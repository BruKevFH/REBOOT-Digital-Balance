import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(__dirname,'..');
const PORT=Number(process.env.PORT||8080);
const HOST=process.env.HOST||'127.0.0.1';
const REQUIRE_HTTPS=process.env.REQUIRE_HTTPS==='1';
const TRUST_PROXY=process.env.TRUST_PROXY==='1';
const RESEARCH_KEY=process.env.RESEARCH_KEY||'';
if(REQUIRE_HTTPS && !TRUST_PROXY) throw new Error('REQUIRE_HTTPS=1 requires TRUST_PROXY=1 and a trusted HTTPS reverse proxy.');
const DATA_DIR=path.resolve(process.env.DATA_DIR||__dirname);
fs.mkdirSync(DATA_DIR,{recursive:true});
const db=new DatabaseSync(path.join(DATA_DIR,'reboot.sqlite'));
const PUBLIC_FILES=new Set(['/index.html','/404.html','/app.js','/styles.css','/sw.js','/manifest.webmanifest','/favicon.svg','/dist/reboot.js','/dist/build.json','/licenses/THREE-LICENSE.txt','/downloads/REBOOT-Neon-Balance-1.0.0.zip']);

db.exec(`
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS events(
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  day INTEGER,
  type TEXT NOT NULL,
  mode TEXT,
  data_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs(
  id TEXT PRIMARY KEY,
  mode TEXT,
  started_at TEXT,
  ended_at TEXT,
  day INTEGER,
  energy REAL, focus REAL, mood REAL, balance REAL, social REAL,
  screen_minutes INTEGER,
  xp INTEGER,
  chips INTEGER
);
CREATE INDEX IF NOT EXISTS idx_events_run ON events(run_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
`);

const insertEvent=db.prepare(`INSERT OR IGNORE INTO events(id,run_id,ts,day,type,mode,data_json) VALUES(?,?,?,?,?,?,?)`);
const insertRun=db.prepare(`INSERT OR REPLACE INTO runs(id,mode,started_at,ended_at,day,energy,focus,mood,balance,social,screen_minutes,xp,chips) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`);

function securityHeaders(res){
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'");
}
function json(res,status,obj){securityHeaders(res);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(obj));}
function readJson(req){
  return new Promise((resolve,reject)=>{
    const chunks=[];let size=0;let oversized=false;
    req.on('data',chunk=>{
      if(oversized)return;
      size+=chunk.length;
      if(size>200000){oversized=true;const error=new Error('too large');error.status=413;reject(error);return;}
      chunks.push(chunk);
    });
    req.on('end',()=>{if(oversized)return;try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}'))}catch(error){reject(error)}});
    req.on('error',reject);
  });
}
function safeText(x,max=120){return typeof x==='string'?x.slice(0,max):'';}
async function serveFile(req,res,rel){
  if(rel==='/'||rel==='') rel='/index.html';
  if(!PUBLIC_FILES.has(rel))return json(res,404,{error:'not found'});
  const target=path.join(ROOT,rel.slice(1));
  let body;
  try{
    if(!(await fs.promises.lstat(target)).isFile())return json(res,404,{error:'not found'});
    body=await fs.promises.readFile(target);
  }catch(error){if(error.code==='ENOENT')return json(res,404,{error:'not found'});throw error;}
  const ext=path.extname(target);
  // Only this optional backend enables same-origin telemetry.
  if(ext==='.html')body=body.toString('utf8').replace('</head>','  <meta name="reboot-api-base" content="/api/">\n</head>');
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.zip':'application/zip','.txt':'text/plain; charset=utf-8'};
  securityHeaders(res);res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:body);
}

async function handleRequest(req,res){
  const proto=req.headers['x-forwarded-proto'];
  if(REQUIRE_HTTPS && proto!=='https') return json(res,426,{error:'HTTPS required'});
  let route;
  try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch(_){return json(res,400,{error:'invalid URL'});}
  if(route==='/api/health') return json(res,200,{ok:true,service:'reboot-api'});
  if(req.method==='POST'&&route==='/api/events'){
    try{
      const b=await readJson(req);
      if(!safeText(b?.id)||!safeText(b?.runId)||!safeText(b?.type))return json(res,400,{error:'invalid event'});
      const dataJson=JSON.stringify(b.data??{});
      if(Buffer.byteLength(dataJson)>100000)return json(res,413,{error:'event data too large'});
      insertEvent.run(safeText(b.id),safeText(b.runId),safeText(b.ts,40),Number(b.day||0),safeText(b.type,50),safeText(b.mode,20),dataJson);
      return json(res,201,{ok:true});
    }catch(error){return json(res,error.status||400,{error:error.status===413?'request too large':'invalid json'});}
  }
  if(req.method==='POST'&&route==='/api/runs'){
    try{const b=await readJson(req);if(!safeText(b?.id))return json(res,400,{error:'invalid run'});const s=b.stats||{};insertRun.run(safeText(b.id),safeText(b.mode,20),safeText(b.startedAt,40),safeText(b.endedAt,40),Number(b.day||0),Number(s.energy||0),Number(s.focus||0),Number(s.mood||0),Number(s.balance||0),Number(s.social||0),Number(b.screenMinutes||0),Number(b.xp||0),Number(b.chips||0));return json(res,201,{ok:true});}catch(error){return json(res,error.status||400,{error:error.status===413?'request too large':'invalid json'});}
  }
  if(req.method==='GET'&&route==='/api/research/summary'){
    if(!RESEARCH_KEY)return json(res,404,{error:'research endpoint disabled'});
    if(req.headers['x-research-key']!==RESEARCH_KEY)return json(res,403,{error:'forbidden'});
    const totals=db.prepare('SELECT COUNT(*) runs, ROUND(AVG(balance),1) avg_balance, ROUND(AVG(focus),1) avg_focus, ROUND(AVG(screen_minutes),1) avg_screen FROM runs').get();
    const choices=db.prepare("SELECT json_extract(data_json,'$.choice') choice, COUNT(*) n FROM events WHERE type='choice' GROUP BY choice ORDER BY n DESC LIMIT 12").all();
    return json(res,200,{totals,topChoices:choices});
  }
  if(req.method==='GET'||req.method==='HEAD') return serveFile(req,res,route);
  return json(res,405,{error:'method not allowed'});
}
const server=http.createServer((req,res)=>{
  handleRequest(req,res).catch(()=>{
    if(!res.headersSent)return json(res,500,{error:'internal server error'});
    res.destroy();
  });
});
server.listen(PORT,HOST,()=>console.log(`REBOOT running on http://${HOST}:${server.address().port}`));
