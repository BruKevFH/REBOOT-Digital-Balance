import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';

const MODES=new Set(['open']);
const OPEN_RULESET='open-v2';
const OPEN_DIFFICULTY='normal';
const hash=value=>createHash('sha256').update(value).digest('hex');
const fail=(status,message,code)=>Object.assign(new Error(message),{status,code});
const username=value=>typeof value==='string'&&!/[\p{Cc}\p{Cf}\u2028\u2029]/u.test(value)?value.normalize('NFC').trim().replace(/\s+/gu,' '):'';
const validName=value=>Array.from(value).length>=3&&Array.from(value).length<=18&&/^[\p{L}\p{N} _-]+$/u.test(value);
const integer=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max;
const loopback=hostname=>['localhost','127.0.0.1','[::1]'].includes(hostname);

export function validateOrigins(origins){
  const result=new Set();
  for(const item of origins){
    let url;try{url=new URL(item);}catch{throw new Error('ALLOWED_ORIGINS contains an invalid origin.');}
    if(url.origin!==item||url.username||url.password||!(url.protocol==='https:'||(url.protocol==='http:'&&loopback(url.hostname))))throw new Error('ALLOWED_ORIGINS requires exact HTTPS origins (HTTP is limited to loopback).');
    result.add(url.origin);
  }
  if(!result.size)throw new Error('At least one explicit ALLOWED_ORIGINS origin is required.');
  return result;
}

function readJSON(req){
  return new Promise((resolve,reject)=>{
    let size=0,tooLarge=false;const chunks=[];
    req.on('data',chunk=>{size+=chunk.length;if(size>8192){if(!tooLarge)reject(fail(413,'Die Anfrage ist zu groß.'));tooLarge=true;}else if(!tooLarge)chunks.push(chunk);});
    req.on('end',()=>{if(tooLarge)return;try{const body=JSON.parse(Buffer.concat(chunks).toString());if(!body||typeof body!=='object'||Array.isArray(body))throw new Error();resolve(body);}catch{reject(fail(400,'Ungültige JSON-Daten.'));}});
    req.on('error',reject);
  });
}

/** Separate optional API. GitHub Pages continues to serve the game itself. */
export function createNinjaLeaderboardServer({databasePath=':memory:',allowedOrigins=['http://127.0.0.1:8000'],requireHTTPS=false,trustProxy=false,now=()=>Date.now()}={}){
  const origins=validateOrigins(allowedOrigins);
  if(requireHTTPS&&!trustProxy)throw new Error('REQUIRE_HTTPS needs TRUST_PROXY and a trusted TLS reverse proxy.');
  if(databasePath!==':memory:')fs.mkdirSync(path.dirname(path.resolve(databasePath)),{recursive:true});
  const db=new DatabaseSync(databasePath);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS ninja_players(id TEXT PRIMARY KEY,token_hash TEXT NOT NULL,name TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS ninja_runs(player_id TEXT NOT NULL REFERENCES ninja_players(id) ON DELETE CASCADE,run_id TEXT NOT NULL,mode TEXT NOT NULL,difficulty TEXT NOT NULL,score INTEGER NOT NULL,duration REAL NOT NULL,decisions INTEGER NOT NULL,submitted_at INTEGER NOT NULL,ruleset TEXT NOT NULL DEFAULT 'legacy',PRIMARY KEY(player_id,run_id));
    CREATE INDEX IF NOT EXISTS ninja_ranks ON ninja_runs(mode,difficulty,score DESC);`);
  // Existing scores used different heart counts and speed curves. Keep every
  // record and identity, but never mix those results into the three-heart board.
  if(!db.prepare('PRAGMA table_info(ninja_runs)').all().some(column=>column.name==='ruleset'))db.exec("ALTER TABLE ninja_runs ADD COLUMN ruleset TEXT NOT NULL DEFAULT 'legacy'");
  db.exec('CREATE INDEX IF NOT EXISTS ninja_open_ranks_v2 ON ninja_runs(mode,ruleset,difficulty,score DESC)');
  const rate=new Map();
  function limit(key,max,window=3600000){
    const stamp=now();let entry=rate.get(key);if(!entry||stamp-entry.start>=window){entry={start:stamp,count:0};rate.set(key,entry);}
    if(++entry.count>max)throw fail(429,'Zu viele Anfragen. Versuche es später erneut.');
    if(rate.size>10000)for(const [id,item]of rate)if(stamp-item.start>=window)rate.delete(id);
  }
  function json(res,status,body){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(body));}
  function identity(req,optional=false){
    const match=/^Bearer ([a-f0-9-]{36})\.([A-Za-z0-9_-]{43})$/.exec(req.headers.authorization||'');
    if(!match){if(optional)return null;throw fail(401,'Die Ranglisten-Anmeldung fehlt.');}
    const player=db.prepare('SELECT * FROM ninja_players WHERE id=?').get(match[1]);
    const supplied=Buffer.from(hash(match[2]),'hex'),expected=player?Buffer.from(player.token_hash,'hex'):Buffer.alloc(32);
    if(!timingSafeEqual(supplied,expected)||!player){if(optional)return null;throw fail(401,'Die Ranglisten-Anmeldung ist ungültig.',player?'INVALID_TOKEN':'UNKNOWN_PLAYER');}
    return player;
  }
  async function handle(req,res){
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/health'&&req.method==='GET')return json(res,200,{ok:true,service:'notification-ninja-leaderboard',apiVersion:2,ruleset:OPEN_RULESET});
    if(requireHTTPS&&req.headers['x-forwarded-proto']!=='https')throw fail(426,'HTTPS ist erforderlich.');
    const origin=req.headers.origin;
    if(!origin||!origins.has(origin))throw fail(403,'Diese Spiel-Webseite ist nicht zugelassen.');
    res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
    if(req.method==='OPTIONS'){
      if(!['GET','POST','DELETE'].includes(req.headers['access-control-request-method']))throw fail(405,'Diese Methode ist nicht verfügbar.');
      const requested=String(req.headers['access-control-request-headers']||'').toLowerCase().split(',').map(value=>value.trim()).filter(Boolean);
      if(requested.some(value=>!['authorization','content-type'].includes(value)))throw fail(403,'Diese Anfrage-Header sind nicht zugelassen.');
      res.writeHead(204,{'Access-Control-Allow-Methods':'GET, POST, DELETE','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600'});return res.end();
    }
    const remote=req.socket.remoteAddress||'unknown';
    limit(`requests:${remote}`,300,60000);
    if(req.method==='POST'&&url.pathname==='/v1/players'){
      limit(`players:${remote}`,20);
      const body=await readJSON(req),name=username(body.username);
      if(!validName(name))throw fail(400,'Der öffentliche Ninja-Name braucht 3 bis 18 Zeichen.');
      const id=randomUUID(),token=randomBytes(32).toString('base64url');
      db.prepare('INSERT INTO ninja_players(id,token_hash,name,created_at) VALUES(?,?,?,?)').run(id,hash(token),name,now());
      return json(res,201,{ok:true,playerId:id,token});
    }
    if(req.method==='DELETE'&&url.pathname==='/v1/player'){
      const player=identity(req);db.prepare('DELETE FROM ninja_players WHERE id=?').run(player.id);
      return json(res,200,{ok:true,deleted:true});
    }
    if(req.method==='POST'&&['/v1/runs','/v2/runs'].includes(url.pathname)){
      const player=identity(req),body=await readJSON(req),name=username(body.username);
      if(body.ruleset!==OPEN_RULESET||body.difficulty!==OPEN_DIFFICULTY)throw fail(400,'Nur aktuelle Open Runs mit drei Herzen gehören in diese Rangliste.');
      if(!validName(name)||typeof body.runId!=='string'||!/^[A-Za-z0-9_-]{8,96}$/.test(body.runId)||!MODES.has(body.mode)||body.result!=='lives'||!integer(body.score,0,20000000)||!Number.isFinite(body.duration)||body.duration<5||body.duration>86400||!integer(body.decisions,0,900000)||body.decisions>body.duration*15+20||body.score>body.decisions*1000+5000)throw fail(400,'Dieser Run kann nicht in die Rangliste eingetragen werden.');
      const old=db.prepare('SELECT mode,difficulty,ruleset,score,duration,decisions FROM ninja_runs WHERE player_id=? AND run_id=?').get(player.id,body.runId);
      if(old){if(['mode','difficulty','ruleset','score','duration','decisions'].some(key=>old[key]!==body[key]))throw fail(409,'Diese Run-ID wurde bereits für einen anderen Run verwendet.');return json(res,200,{ok:true,duplicate:true,playerId:player.id,ruleset:OPEN_RULESET});}
      limit(`runs:${player.id}`,60);
      db.exec('BEGIN IMMEDIATE');try{
        db.prepare('UPDATE ninja_players SET name=? WHERE id=?').run(name,player.id);
        db.prepare('INSERT INTO ninja_runs(player_id,run_id,mode,difficulty,score,duration,decisions,submitted_at,ruleset) VALUES(?,?,?,?,?,?,?,?,?)').run(player.id,body.runId,body.mode,body.difficulty,body.score,body.duration,body.decisions,now(),OPEN_RULESET);
        db.exec('COMMIT');
      }catch(error){db.exec('ROLLBACK');throw error;}
      return json(res,201,{ok:true,duplicate:false,playerId:player.id,ruleset:OPEN_RULESET});
    }
    if(req.method==='GET'&&['/v1/leaderboard','/v2/leaderboard'].includes(url.pathname)){
      const mode=url.searchParams.get('mode')||'open',difficulty=url.searchParams.get('difficulty')||OPEN_DIFFICULTY,ruleset=url.searchParams.get('ruleset')||OPEN_RULESET;
      if(!MODES.has(mode)||difficulty!==OPEN_DIFFICULTY||ruleset!==OPEN_RULESET)throw fail(400,'Es gibt eine gemeinsame Open-Run-Rangliste mit drei Herzen.');
      const amount=Number(url.searchParams.get('limit')||25);if(!integer(amount,1,50))throw fail(400,'Die Rangliste zeigt höchstens 50 Plätze.');
      const rows=db.prepare(`WITH best AS (SELECT r.*,ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY score DESC,submitted_at ASC,run_id ASC) AS personal FROM ninja_runs r WHERE mode=? AND difficulty=? AND ruleset=?),ranked AS (SELECT player_id,p.name,score,submitted_at,ROW_NUMBER() OVER(ORDER BY score DESC,submitted_at ASC,player_id ASC) AS rank FROM best JOIN ninja_players p ON p.id=best.player_id WHERE personal=1) SELECT * FROM ranked ORDER BY rank`).all(mode,difficulty,ruleset);
      const player=identity(req,true),publicRow=row=>({rank:row.rank,playerId:row.player_id,username:row.name,score:row.score,submittedAt:row.submitted_at});
      return json(res,200,{ok:true,mode,difficulty,ruleset,totalPlayers:rows.length,entries:rows.slice(0,amount).map(publicRow),own:player?(rows.find(row=>row.player_id===player.id)?publicRow(rows.find(row=>row.player_id===player.id)):null):null});
    }
    throw fail(404,'Dieser Ranglisten-Endpunkt existiert nicht.');
  }
  const server=http.createServer((req,res)=>{handle(req,res).catch(error=>{if(!res.headersSent)json(res,error.status||500,{ok:false,error:error.status?error.message:'Die Rangliste ist vorübergehend nicht verfügbar.',...(error.code?{code:error.code}:{})});else res.destroy();});});
  server.requestTimeout=10000;server.headersTimeout=10000;
  server.on('close',()=>db.close());
  return server;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8082);
  const originText=process.env.ALLOWED_ORIGINS;
  if(!loopback(host)&&!originText)throw new Error('Public binding requires explicit ALLOWED_ORIGINS.');
  const allowedOrigins=(originText||'http://127.0.0.1:8000').split(',').map(value=>value.trim()).filter(Boolean);
  const dataDir=path.resolve(process.env.DATA_DIR||path.dirname(fileURLToPath(import.meta.url)));
  const server=createNinjaLeaderboardServer({databasePath:path.join(dataDir,'ninja-leaderboard.sqlite'),allowedOrigins,requireHTTPS:process.env.REQUIRE_HTTPS==='1',trustProxy:process.env.TRUST_PROXY==='1'});
  server.listen(port,host,()=>console.log(`Notification Ninja leaderboard listening on ${host}:${server.address().port}`));
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
