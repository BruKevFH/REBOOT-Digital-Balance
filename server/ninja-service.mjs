import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isIP} from 'node:net';
import {createNinjaStore} from './ninja-store.mjs';
import {createNinjaAuth,validateRegistration} from './ninja-auth.mjs';
import {createNinjaGameService} from './ninja-game-service.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT=path.resolve(HERE,'../notification-ninja');
const PREFIX='/api/v3';
const fail=(status,code,message)=>Object.assign(new Error(message),{status,code});
const loopback=host=>['localhost','127.0.0.1','[::1]'].includes(host);
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf','.zip':'application/zip','.txt':'text/plain; charset=utf-8'};

export function validateNinjaOrigins(values=[]){
  const origins=new Set();
  for(const value of values){
    let url;try{url=new URL(value);}catch{throw new TypeError('ALLOWED_ORIGINS must contain exact HTTPS origins.');}
    if(url.origin!==value||url.username||url.password||!(url.protocol==='https:'||url.protocol==='http:'&&loopback(url.hostname)))throw new TypeError('ALLOWED_ORIGINS must contain exact HTTPS origins (HTTP only for localhost).');
    origins.add(value);
  }
  return origins;
}

function readJSON(req,limit){
  if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))throw fail(415,'JSON_REQUIRED','Bitte sende die Anfrage als JSON.');
  if(req.headers['content-encoding']&&req.headers['content-encoding']!=='identity')throw fail(415,'ENCODING_UNSUPPORTED','Komprimierte Anfragen werden nicht unterstützt.');
  const declared=Number(req.headers['content-length']);
  if(Number.isFinite(declared)&&declared>limit)throw fail(413,'REQUEST_TOO_LARGE','Die Anfrage ist zu groß.');
  return new Promise((resolve,reject)=>{
    let size=0,large=false;const chunks=[];
    req.on('data',chunk=>{size+=chunk.length;if(size>limit){large=true;chunks.length=0;}else if(!large)chunks.push(chunk);});
    req.on('end',()=>{
      if(large)return reject(fail(413,'REQUEST_TOO_LARGE','Die Anfrage ist zu groß.'));
      try{const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!body||typeof body!=='object'||Array.isArray(body))throw Error();resolve(body);}
      catch{reject(fail(400,'INVALID_JSON','Ungültige JSON-Daten.'));}
    });
    req.on('aborted',()=>reject(fail(400,'REQUEST_ABORTED','Die Übertragung wurde abgebrochen.')));
    req.on('error',reject);
  });
}

/** One local application: static client, password accounts and replay-validated runs. */
export function createNinjaServer({databasePath=':memory:',store:providedStore,allowedOrigins=[],now=()=>Date.now(),requireHTTPS=false,trustProxy=false,durableStorage=databasePath!==':memory:',webRoot=WEB_ROOT,rateLimits={},maxRateBuckets=10000,logError=()=>{},mfaKey=process.env.NINJA_MFA_KEY}={}){
  const origins=validateNinjaOrigins(allowedOrigins);
  if(requireHTTPS&&!trustProxy)throw new TypeError('REQUIRE_HTTPS requires a controlled TLS proxy and TRUST_PROXY=1.');
  if(requireHTTPS&&providedStore?.dialect!=='postgres'&&(!durableStorage||databasePath===':memory:'||path.resolve(databasePath).startsWith('/tmp/')))throw new TypeError('Production accounts require durable DATA_DIR outside /tmp.');
  const defaults={auth:{limit:30,window:15*60*1000},reset:{limit:10,window:15*60*1000},api:{limit:240,window:60*1000},finish:{limit:12,window:60*1000}},limits={};
  if(!rateLimits||typeof rateLimits!=='object'||Array.isArray(rateLimits)||Object.keys(rateLimits).some(key=>!Object.hasOwn(defaults,key)))throw new TypeError('Unknown rate-limit configuration.');
  for(const [name,config]of Object.entries(defaults)){
    limits[name]={...config,...rateLimits[name]};
    if(!Number.isSafeInteger(limits[name].limit)||limits[name].limit<1||!Number.isSafeInteger(limits[name].window)||limits[name].window<1)throw new TypeError('Rate limits require positive integer limits and windows.');
  }
  if(!Number.isSafeInteger(maxRateBuckets)||maxRateBuckets<1||maxRateBuckets>1000000)throw new TypeError('Rate-limit bucket capacity must be an integer from 1 to 1000000.');
  const store=providedStore||createNinjaStore({databasePath,now});
  const persistent=store.dialect==='postgres'||Boolean(durableStorage&&databasePath!==':memory:');
  const auth=createNinjaAuth(store,{now,mfaKey});
  const game=createNinjaGameService(store,{now});
  const buckets=new Map();
  function clientAddress(req){
    // A controlled immediate proxy must append or overwrite the actual peer IP.
    // Reading the last entry prevents a caller-supplied prefix bypassing limits.
    if(trustProxy){const forwarded=req.headers['x-forwarded-for'];if(typeof forwarded==='string'){const address=forwarded.split(',').at(-1).trim();if(isIP(address))return address;}}
    return req.socket.remoteAddress||'unknown';
  }
  function rate(req,name,scope=''){
    const stamp=now(),key=`${name}:${clientAddress(req)}:${scope}`,config=limits[name];
    if(buckets.size>=maxRateBuckets)for(const [id,bucket]of buckets)if(bucket.until<=stamp)buckets.delete(id);
    if(!buckets.has(key)&&buckets.size>=maxRateBuckets)throw fail(429,'RATE_LIMIT','Zu viele Anfragen. Bitte versuche es später erneut.');
    let bucket=buckets.get(key);if(!bucket||bucket.until<=stamp){bucket={count:0,until:stamp+config.window};buckets.set(key,bucket);}
    if(++bucket.count>config.limit){const error=fail(429,'RATE_LIMIT','Zu viele Anfragen. Bitte versuche es später erneut.');error.retryAfter=Math.max(1,Math.ceil((bucket.until-stamp)/1000));throw error;}
  }
  function send(res,status,body,extra={}){
    res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra});
    res.end(status===204?undefined:JSON.stringify(body));
  }
  function token(req){
    const header=req.headers.authorization;if(!header)return null;
    const match=/^Bearer ([A-Za-z0-9_-]{43})$/.exec(header);
    if(!match)throw fail(401,'UNAUTHENTICATED','Bitte melde dich erneut an.');
    return match[1];
  }
  const root=path.resolve(webRoot);
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('X-Frame-Options','DENY');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self' blob:; connect-src 'self' https: http://127.0.0.1:* http://localhost:*; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    let url;
    try{
      if(!req.headers.host||!/^(?:\[[\da-f:.]+\]|[a-z\d.-]+)(?::\d{1,5})?$/i.test(req.headers.host))throw fail(400,'INVALID_HOST','Ungültige Anfrage.');
      let authority;try{authority=new URL('http://'+req.headers.host);}catch{throw fail(400,'INVALID_HOST','Ungültige Anfrage.');}
      if(typeof req.url!=='string'||!req.url.startsWith('/')||req.url.startsWith('//'))throw fail(400,'INVALID_TARGET','Ungültige Anfrage.');
      url=new URL(req.url,authority.origin);
      if(requireHTTPS){
        if(req.headers['x-forwarded-proto']!=='https')throw fail(426,'HTTPS_REQUIRED','Bitte verwende eine sichere HTTPS-Verbindung.');
        res.setHeader('Strict-Transport-Security','max-age=31536000');
      }
      const ownOrigin=`${requireHTTPS?'https':'http'}://${authority.host}`;
      const origin=req.headers.origin;
      if(origin&&origin!==ownOrigin&&!origins.has(origin))throw fail(403,'ORIGIN_DENIED','Dieser Ursprung ist nicht zugelassen.');
      if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
      if(req.method==='OPTIONS'){
        if(!origin)throw fail(400,'ORIGIN_REQUIRED','Ein Ursprung ist erforderlich.');
        const requestedMethod=req.headers['access-control-request-method'];
        const requestedHeaders=(req.headers['access-control-request-headers']||'').split(',').map(value=>value.trim().toLowerCase()).filter(Boolean);
        if(!['GET','POST','PATCH','DELETE','OPTIONS'].includes(requestedMethod)||requestedHeaders.some(header=>!['authorization','content-type'].includes(header)))throw fail(403,'PREFLIGHT_DENIED','Diese Anfrage ist nicht zugelassen.');
        return send(res,204,null,{'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600'});
      }
      if(url.pathname===PREFIX+'/health'){
        if(req.method!=='GET')throw fail(405,'METHOD_NOT_ALLOWED','Diese Methode ist nicht erlaubt.');
        if(store.dialect==='postgres')await store.db.prepare('SELECT 1 AS ready').get();
        return send(res,200,{ok:true,service:'notification-ninja',apiVersion:3,ruleset:'open-v2',durableStorage:persistent,...(store.dialect==='postgres'?{storage:'postgresql'}:{})});
      }
      if(url.pathname.startsWith(PREFIX+'/')){
        rate(req,'api');
        const route=url.pathname.slice(PREFIX.length),method=req.method;
        if(method==='POST'&&['/auth/register','/auth/login','/auth/reset'].includes(route)){
          rate(req,route==='/auth/reset'?'reset':'auth');const body=await readJSON(req,32768);
          if(route==='/auth/register')validateRegistration(body);
          const result=route==='/auth/register'?await auth.register(body):route==='/auth/login'?await auth.login(body):await auth.resetPassword(body);
          return send(res,route==='/auth/register'?201:200,result);
        }
        if(route==='/auth/mfa/verify'&&method==='POST'){
          rate(req,'auth');const body=await readJSON(req,4096);
          return send(res,200,await auth.mfa.finishLogin(body));
        }
        if(route==='/leaderboard'&&method==='GET'){
          const supplied=token(req),user=supplied?await auth.authenticate(supplied):null;
          return send(res,200,await game.leaderboard(user?.id??null,Object.fromEntries(url.searchParams)));
        }
        const supplied=token(req),user=await auth.authenticate(supplied);
        if(route==='/auth/logout'&&method==='POST')return send(res,200,await auth.logout(supplied));
        if(route==='/mfa/status'&&method==='GET')return send(res,200,await auth.mfa.status(user.id));
        if(['/mfa/setup','/mfa/confirm','/mfa/disable'].includes(route)&&method==='POST'){
          rate(req,'auth',user.id);const body=await readJSON(req,4096);
          const result=route==='/mfa/setup'?await auth.mfa.setup(user.id,body):route==='/mfa/confirm'?await auth.mfa.confirm(user.id,body,supplied):await auth.mfa.disable(user.id,body,supplied);
          return send(res,200,result);
        }

        if(route==='/me'&&method==='GET')return send(res,200,{user:{id:user.id,username:user.username},...await game.getState(user.id)});
        if(route==='/profile'&&method==='PATCH'){const body=await readJSON(req,32768);return send(res,200,await auth.rename(user.id,body.username));}
        if(route==='/account'&&method==='DELETE'){const body=await readJSON(req,32768);return send(res,200,await auth.deleteAccount(user.id,body));}
        if(route==='/actions'&&method==='POST'){const body=await readJSON(req,32768);return send(res,200,await game.action(user.id,body));}
        if(route==='/runs/start'&&method==='POST'){const body=await readJSON(req,32768);return send(res,201,await game.startRun(user.id,body));}
        const run=route.match(/^\/runs\/([A-Za-z0-9_-]{8,96})\/(finish|publish)$/);
        if(run&&method==='POST'){
          rate(req,'finish',user.id);
          const result=run[2]==='finish'?await game.finishRun(user.id,run[1],await readJSON(req,2*1024*1024)):await game.publishRun(user.id,run[1]);
          return send(res,200,result);
        }
        throw fail(404,'NOT_FOUND','Dieser API-Endpunkt wurde nicht gefunden.');
      }
      if(!['GET','HEAD'].includes(req.method))throw fail(405,'METHOD_NOT_ALLOWED','Diese Methode ist nicht erlaubt.');
      if(url.pathname==='/'||url.pathname==='/notification-ninja'){res.writeHead(302,{Location:'/notification-ninja/home.html','Cache-Control':'no-store'});return res.end();}
      if(!url.pathname.startsWith('/notification-ninja/'))throw fail(404,'NOT_FOUND','Diese Seite wurde nicht gefunden.');
      if(url.pathname==='/notification-ninja/accounts-config.json')return send(res,200,{enabled:true,endpoint:ownOrigin+PREFIX,apiVersion:3,durableStorage:persistent});
      let relative;try{relative=decodeURIComponent(url.pathname.slice('/notification-ninja/'.length));}catch{throw fail(400,'INVALID_PATH','Ungültiger Pfad.');}
      if(!relative)relative='index.html';
      const filename=path.resolve(root,relative);
      if(filename!==root&&!filename.startsWith(root+path.sep)||relative.includes('\0')||relative.split('/').some(part=>part.startsWith('.'))||relative.startsWith('src/'))throw fail(404,'NOT_FOUND','Diese Datei wurde nicht gefunden.');
      let stat;try{stat=await fs.promises.stat(filename);const real=await fs.promises.realpath(filename);if(!real.startsWith(root+path.sep)||!stat.isFile())throw Error();}catch{throw fail(404,'NOT_FOUND','Diese Datei wurde nicht gefunden.');}
      res.writeHead(200,{'Content-Type':MIME[path.extname(filename)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':['.html','.json','.js'].includes(path.extname(filename))?'no-cache':'public, max-age=3600'});
      if(req.method==='HEAD')return res.end();
      fs.createReadStream(filename).on('error',()=>res.destroy()).pipe(res);
    }catch(error){
      const status=Number.isInteger(error.status)&&error.status>=400&&error.status<=599?error.status:500;
      const code=status===500?'INTERNAL_ERROR':error.code||'REQUEST_FAILED';
      const message=status===500?'Der Dienst konnte die Anfrage gerade nicht bearbeiten. Bitte versuche es erneut.':error.message;
      if(status===500)logError({event:'request_failed',code}); // Never log headers, payloads, credentials or private paths.
      if(!res.headersSent)send(res,status,{error:{code,message},code,message},error.retryAfter?{'Retry-After':String(error.retryAfter)}:{});else res.destroy();
    }
  });
  server.requestTimeout=30000;server.headersTimeout=10000;server.maxHeadersCount=40;server.keepAliveTimeout=5000;
  server.on('close',()=>{server.ninja.storageClosed=Promise.resolve(store.close());});
  server.ninja={store,auth,game};
  return server;
}

/** PostgreSQL initialization finishes before a listening socket is exposed. */
export async function createPostgresNinjaServer({databaseURL,...options}={}){
  const {createPostgresNinjaStore}=await import('./ninja-postgres-store.mjs');
  const store=await createPostgresNinjaStore({databaseURL,now:options.now});
  try{return createNinjaServer({...options,store,durableStorage:true});}
  catch(error){await store.close();throw error;}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8083);
  const production=process.env.NODE_ENV==='production';
  const durable=process.env.DURABLE_STORAGE==='1';
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be 1..65535.');
  if(production&&!process.env.DATABASE_URL&&(!durable||!process.env.DATA_DIR))throw new Error('Production requires DATA_DIR on a persistent mount and DURABLE_STORAGE=1.');
  const configuredOrigins=(process.env.ALLOWED_ORIGINS||'').split(',').map(item=>item.trim()).filter(Boolean);
  if(!loopback(host)&&!configuredOrigins.length)throw new Error('Public binding requires explicit ALLOWED_ORIGINS.');
  const dataDir=path.resolve(process.env.DATA_DIR||path.join(HERE,'data'));
  const factory=process.env.DATABASE_URL?createPostgresNinjaServer:createNinjaServer;
  const server=await factory({databaseURL:process.env.DATABASE_URL,databasePath:path.join(dataDir,'ninja.sqlite'),allowedOrigins:configuredOrigins,requireHTTPS:production||process.env.REQUIRE_HTTPS==='1',trustProxy:process.env.TRUST_PROXY==='1',durableStorage:production?durable:true,logError:event=>process.stderr.write(JSON.stringify(event)+'\n')});
  server.listen(port,host,()=>process.stdout.write(`Notification Ninja: http://${host}:${port}/notification-ninja/home.html\n`));
  for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(async()=>{await server.ninja.storageClosed;process.exit(0);}));
}
