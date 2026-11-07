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

test('worker precaches every locally bundled dependency including both disabled static configs',async()=>{
  const w=worker();let pending;w.handlers.get('install')({waitUntil:p=>pending=p});await pending;
  for(const file of w.assets)assert(existsSync(root+(file==='./'?'index.html':file.slice(2))),file);
  for(const file of ['./dist/ninja.js','./dist/home.js','./accounts-config.json','./assets/dojo-study.png','./assets/dojo-gaming.svg','./branding/Notification-Ninja-Logo.png'])assert(w.assets.includes(file));
  assert.equal(JSON.parse(readFileSync(root+'accounts-config.json','utf8')).enabled,false);
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

test('configuration is fetched fresh online while bundled game assets remain available from cache',async()=>{
  const online={ok:true,clone:()=>({copy:true})},calls=[];
  const w=worker({fetch:async request=>{calls.push(request.url);return online;}});
  assert.equal(await w.request('accounts-config.json'),online);assert.equal(w.puts.length,1);
  assert.equal((await w.request('dist/ninja.js')).cachedUrl,w.scope+'dist/ninja.js');
  assert.equal(calls.length,1);
});


test('the cyber dojo is an original self-contained vector without external content',()=>{
  const svg=readFileSync(new URL('../notification-ninja/assets/dojo-gaming.svg',import.meta.url),'utf8');
  assert.match(svg,/<svg[^>]+viewBox="0 0 1600 900"/);assert.match(svg,/<title[^>]*>Cyber Ninja Dojo<\/title>/);
  assert.doesNotMatch(svg,/<script|<foreignObject|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
  assert.doesNotMatch(svg,/(?:href|src)="[^#]/);
});
