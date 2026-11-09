import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';

const root='notification-ninja/';
const source=readFileSync(root+'sw.js','utf8');
const version=JSON.parse(readFileSync(root+'dist/build.json','utf8')).version;

function worker({fetch=async()=>{throw Error('offline');}}={}){
  const handlers=new Map(),assets=[],puts=[];
  const scope='https://example.test/REBOOT-Digital-Balance/notification-ninja/';
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

test('worker precaches every locally bundled dependency including the public account config',async()=>{
  const w=worker();let pending;w.handlers.get('install')({waitUntil:p=>pending=p});await pending;
  for(const file of w.assets)assert(existsSync(root+(file==='./'?'index.html':file.slice(2))),file);
  for(const file of ['./dist/ninja.js','./dist/home.js','./accounts-config.json','./assets/dojo-study.png','./assets/dojo-gaming.svg','./branding/Notification-Ninja-Logo.png'])assert(w.assets.includes(file));
  const accountConfig=JSON.parse(readFileSync(root+'accounts-config.json','utf8'));
  assert.equal(accountConfig.enabled,true);
  assert.equal(accountConfig.apiVersion,3);
  assert.equal(accountConfig.endpoint,'https://notification-ninja-accounts.onrender.com/api/v3');
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

test('game JS, CSS and configuration update from network instead of a stale previous release',async()=>{
  const online={ok:true,clone:()=>({copy:true})},calls=[];
  const w=worker({fetch:async (request,options)=>{calls.push({url:request.url,cache:options?.cache});return online;}});
  for(const path of ['accounts-config.json','dist/ninja.js','illustrated-adventure-v4.css','assets/overworld-landscape-v4.svg']){
    assert.equal(await w.request(path),online,'Fresh online response for '+path);
  }
  // Unchanged large images stay cached rather than downloading every time.
  assert.equal((await w.request('assets/dojo-study.png')).cachedUrl,w.scope+'assets/dojo-study.png');
  assert.equal(calls.length,4);
  assert.equal(w.puts.length,4,'Fresh responses replace the offline copies');
  assert(calls.every(call=>call.cache==='no-store'),'Do not use a stale browser HTTP cache');
});

test('3.5 offline assets retain a usable fallback when internet access fails',async()=>{
  const w=worker();
  for(const path of ['dist/ninja.js','illustrated-adventure-v4.css','assets/overworld-landscape-v4.svg']){
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
