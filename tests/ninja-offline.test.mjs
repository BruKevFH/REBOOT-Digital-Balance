import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,mkdirSync,copyFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {publicAccountsConfigured} from '../scripts/build_ninja.mjs';
import vm from 'node:vm';

const root='notification-ninja/';
const source=readFileSync(root+'sw.js','utf8');
const version=JSON.parse(readFileSync(root+'dist/build.json','utf8')).version;

function worker({fetch=async()=>{throw Error('offline');},scope='https://example.test/REBOOT-Digital-Balance/notification-ninja/'}={}){
  const handlers=new Map(),assets=[],puts=[];
  const cache={addAll:async values=>assets.push(...values),match:async url=>({cachedUrl:String(url?.url||url)}),put:async(...args)=>puts.push(args)};
  const context={URL,self:{registration:{scope},skipWaiting:async()=>{},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers.set(name,fn)},caches:{open:async name=>{assert(name.endsWith(':'+version));return cache;},keys:async()=>[]},fetch};
  vm.runInNewContext(source,context);
  async function request(file,mode='cors',method='GET'){
    let result;const waits=[];
    handlers.get('fetch')({request:{url:new URL(file,scope).href,method,mode},respondWith:promise=>result=promise,waitUntil:promise=>waits.push(promise)});
    const response=await result;await Promise.all(waits);return response;
  }
  return {handlers,scope,assets,puts,request};
}

test('worker precaches all dependencies and the public configuration matches its build metadata',async()=>{
  const w=worker();let pending;w.handlers.get('install')({waitUntil:p=>pending=p});await pending;
  for(const file of w.assets)assert(existsSync(root+(file==='./'?'index.html':file.slice(2))),file);
  for(const file of ['./dist/ninja.js','./dist/home.js','./accounts-config.json','./assets/dojo-study.png','./assets/dojo-gaming.svg','./branding/Notification-Ninja-Logo.png'])assert(w.assets.includes(file));
  const accounts=JSON.parse(readFileSync(root+'accounts-config.json','utf8')),metadata=JSON.parse(readFileSync(root+'dist/build.json','utf8'));
  assert.equal(accounts.enabled,true,'The already connected public backend remains active');
  assert.equal(accounts.apiVersion,3);
  assert.equal(accounts.endpoint,'https://notification-ninja-accounts.onrender.com/api/v3');
  assert.equal(metadata.publicAccountsConfigured,publicAccountsConfigured(accounts));
  for(const file of ['./indie-theme.css','./assets/indie-modes.png','./assets/indie-worlds.png','./assets/indie-wordmark.png','./assets/fonts/nunito-latin-wght-normal.woff2'])assert(w.assets.includes(file),'Offline presentation: '+file);

  assert(!w.assets.some(file=>file.startsWith('./src/')));
});

test('offline worker preserves distinct homepage/game/query routes and never intercepts API mutations',async()=>{
  const w=worker();
  for(const [file,expected]of [['','index.html'],['index.html?v=3','index.html'],['home.html?source=offline','home.html']])assert.equal((await w.request(file,'navigate')).cachedUrl,w.scope+expected);
  for(const file of ['leaderboard-config.json','accounts-config.json'])assert.equal((await w.request(file)).cachedUrl,w.scope+file);
  assert.equal(await w.request('unknown.html','navigate'),undefined);
  assert.equal(await w.request('/api/v3/me'),undefined);
  assert.equal(await w.request('/api/v3/runs/test/finish','cors','POST'),undefined);
});

test('canonical offline root preserves the online homepage while legacy folders retain their game entry',async()=>{
  const fixtures=[
    ['https://notification-ninja-accounts.onrender.com/','home.html'],
    ['https://notification-ninja-accounts.onrender.com/notification-ninja/','index.html'],
    ['https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/','index.html'],
    ['https://offline.example.test/extracted-game/','index.html'],
    ['http://localhost:8205/','index.html']
  ];
  for(const [scope,entry]of fixtures){
    const w=worker({scope});
    for(const file of ['','?source=installed'])assert.equal((await w.request(file,'navigate')).cachedUrl,scope+entry,scope+file);
    assert.equal((await w.request('index.html?from=home','navigate')).cachedUrl,scope+'index.html');
    assert.equal((await w.request('home.html?source=offline','navigate')).cachedUrl,scope+'home.html');
    assert.equal(await w.request('/api/v3/me'),undefined,'Account state is never an offline navigation fallback');
  }
});

test('game JS, CSS and configuration update from network instead of a stale previous release',async()=>{
  const online={ok:true,clone:()=>({copy:true})},calls=[];
  const w=worker({fetch:async (request,options)=>{calls.push({url:request.url,cache:options?.cache});return online;}});
  for(const path of ['accounts-config.json','dist/ninja.js','illustrated-adventure-v4.css','assets/overworld-landscape-v4.svg','indie-theme.css']){
    assert.equal(await w.request(path),online,'Fresh online response for '+path);
  }
  // Unchanged large images stay cached rather than downloading every time.
  assert.equal((await w.request('assets/dojo-study.png')).cachedUrl,w.scope+'assets/dojo-study.png');
  assert.equal(calls.length,5);
  assert.equal(w.puts.length,5,'Fresh responses replace the offline copies');
  assert(calls.every(call=>call.cache==='no-store'),'Do not use a stale browser HTTP cache');
});

test('retained and current presentation assets retain a usable fallback when internet access fails',async()=>{
  const w=worker();
  for(const path of ['dist/ninja.js','illustrated-adventure-v4.css','assets/overworld-landscape-v4.svg','indie-theme.css']){
    assert.equal((await w.request(path)).cachedUrl,w.scope+path);
  }
  const sw=readFileSync(root+'sw.js','utf8');
  assert(sw.includes('networkFirst(event.request,key)'),'Presentation assets must never regress to cache-first');
  assert(!sw.includes('${PREFIX}3.4.0'),'Do not reuse the old 3.4.0 cache name');
});


test('the cyber dojo is an original self-contained vector without external content',()=>{
  const svg=readFileSync(new URL('../notification-ninja/assets/dojo-gaming.svg',import.meta.url),'utf8');
  assert.match(svg,/<svg[^>]+viewBox="0 0 1600 900"/);assert.match(svg,/<title[^>]*>Cyber Ninja Dojo<\/title>/);
  assert.doesNotMatch(svg,/<script|<foreignObject|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
  assert.doesNotMatch(svg,/(?:href|src)="[^#]/);
});


test('public builds reject unsafe enabled account endpoints and derive the explicit switch',()=>{
  assert.equal(publicAccountsConfigured({enabled:false,apiVersion:3}),false);
  assert.equal(publicAccountsConfigured({enabled:true,apiVersion:3,endpoint:'https://accounts.example.test/api/v3'}),true);
  for(const endpoint of ['http://accounts.example.test/api/v3','/api/v3','https://user:password@accounts.example.test/api/v3','https://accounts.example.test/api/v3?secret=x','https://accounts.example.test/api/v3#fragment','https://accounts.example.test/api/v2'])assert.throws(()=>publicAccountsConfigured({enabled:true,apiVersion:3,endpoint}));
  for(const config of [{enabled:'true',apiVersion:3},{enabled:true,apiVersion:2,endpoint:'https://accounts.example.test/api/v3'},null])assert.throws(()=>publicAccountsConfigured(config));
});

test('an enabled public fixture packages a disabled guest edition without changing source files',async()=>{
  const directory=mkdtempSync(path.join(tmpdir(),'ninja-guest-package-'));
  try{
    const w=worker();let installed;w.handlers.get('install')({waitUntil:promise=>installed=promise});await installed;
    const files=[...new Set(['sw.js',...w.assets.map(file=>file==='./'?'index.html':file.slice(2))])];
    for(const file of files){const target=path.join(directory,file);mkdirSync(path.dirname(target),{recursive:true});copyFileSync(root+file,target);}
    const enabled={enabled:true,apiVersion:3,endpoint:'https://accounts.example.test/api/v3'};
    writeFileSync(path.join(directory,'accounts-config.json'),JSON.stringify(enabled)+'\n');
    const metadata=JSON.parse(readFileSync(path.join(directory,'dist/build.json'),'utf8'));metadata.publicAccountsConfigured=publicAccountsConfigured(enabled);
    writeFileSync(path.join(directory,'dist/build.json'),JSON.stringify(metadata)+'\n');
    const before=Object.fromEntries(files.map(file=>[file,readFileSync(path.join(directory,file)).toString('base64')]));
    execFileSync('python3',['scripts/package_ninja.py','--root',directory],{encoding:'utf8'});
    const report=JSON.parse(execFileSync('python3',['-c',`
import json,sys,hashlib
from pathlib import Path
from zipfile import ZipFile
root=Path(sys.argv[1]); archive=next((root/'downloads').glob('*.zip'))
with ZipFile(archive) as zipped:
    prefix=next(name.rsplit('/dist/build.json',1)[0] for name in zipped.namelist() if name.endswith('/dist/build.json'))+'/'
    accounts=json.loads(zipped.read(prefix+'accounts-config.json'))
    metadata=json.loads(zipped.read(prefix+'dist/build.json'))
    for name in zipped.namelist():
        relative=name[len(prefix):]
        if relative not in ['accounts-config.json','dist/build.json','START-HIER.txt']:
            assert zipped.read(name)==(root/relative).read_bytes(),relative
    assert zipped.testzip() is None
    digest=hashlib.sha256(archive.read_bytes()).hexdigest()
    assert archive.with_suffix('.zip.sha256').read_text().split()[0]==digest
    print(json.dumps({'accounts':accounts,'metadata':metadata,'members':len(zipped.namelist())}))
`,directory],{encoding:'utf8'}));
    assert.equal(report.accounts.enabled,false);assert.equal(report.accounts.apiVersion,3);assert.equal('endpoint' in report.accounts,false);
    assert.deepEqual(report.metadata,{...metadata,publicAccountsConfigured:false});assert.equal(report.members,files.length+1);
    for(const file of files)assert.equal(readFileSync(path.join(directory,file)).toString('base64'),before[file],`Source fixture changed: ${file}`);
  }finally{rmSync(directory,{recursive:true,force:true});}
});
