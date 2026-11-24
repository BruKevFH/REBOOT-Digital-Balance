import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {once} from 'node:events';
import {createNinjaServer} from '../server/ninja-service.mjs';

async function fixture(t){
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ninja-public-root-'));
  await fs.mkdir(path.join(root,'assets'));await fs.mkdir(path.join(root,'dist'));await fs.mkdir(path.join(root,'src'));
  for(const [file,content] of Object.entries({'home.html':'<title>Notification Ninja home</title>','index.html':'<title>Notification Ninja game</title>','styles.css':'body{}','assets/ninja.svg':'<svg></svg>','dist/ninja.js':'console.log("public game");','src/private.js':'private source','.hidden':'hidden'}))await fs.writeFile(path.join(root,file),content);
  const outside=path.join(root,'..',path.basename(root)+'-private.txt');await fs.writeFile(outside,'private outside');await fs.symlink(outside,path.join(root,'assets','escape.txt'));
  const revision='a'.repeat(40),server=createNinjaServer({webRoot:root,sourceRevision:revision,allowedOrigins:['https://brukevfh.github.io']});
  server.listen(0,'127.0.0.1');await once(server,'listening');
  const origin=`http://127.0.0.1:${server.address().port}`;
  t.after(async()=>{if(server.listening)await new Promise(resolve=>server.close(resolve));await server.ninja.storageClosed;await fs.rm(root,{recursive:true,force:true});await fs.rm(outside,{force:true});});
  return {origin,revision};
}
const raw=(origin,route)=>new Promise((resolve,reject)=>{const url=new URL(origin),request=http.get({hostname:url.hostname,port:url.port,path:route},response=>{response.resume();response.on('end',()=>resolve(response.statusCode));});request.on('error',reject);});

test('the free account host serves home, game, assets, bundles and live config at clean root URLs',async t=>{
  const {origin}=await fixture(t);
  for(const [route,expected] of [['/','Notification Ninja home'],['/home.html','Notification Ninja home'],['/index.html#overview','Notification Ninja game'],['/styles.css','body{}'],['/assets/ninja.svg','<svg>'],['/dist/ninja.js','public game']]){
    const response=await fetch(origin+route,{redirect:'manual'});assert.equal(response.status,200,route);assert.ok((await response.text()).includes(expected),route);
  }
  for(const route of ['/play','/play/']){const response=await fetch(origin+route,{redirect:'manual'});assert.equal(response.status,302);assert.equal(response.headers.get('location'),'/index.html#overview');}
  const config=await(await fetch(origin+'/accounts-config.json')).json();assert.deepEqual(config,{enabled:true,endpoint:origin+'/api/v3',apiVersion:3,durableStorage:false});
  const head=await fetch(origin+'/styles.css',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.match(head.headers.get('content-type'),/text\/css/);
});

test('legacy frontend paths and API health keep working on the same service',async t=>{
  const {origin,revision}=await fixture(t);
  for(const route of ['/notification-ninja/','/notification-ninja/index.html','/notification-ninja/home.html','/notification-ninja/styles.css','/notification-ninja/assets/ninja.svg','/notification-ninja/dist/ninja.js'])assert.equal((await fetch(origin+route)).status,200,route);
  const redirect=await fetch(origin+'/notification-ninja',{redirect:'manual'});assert.equal(redirect.status,302);assert.equal(redirect.headers.get('location'),'/notification-ninja/home.html');
  const config=await(await fetch(origin+'/notification-ninja/accounts-config.json')).json();assert.equal(config.endpoint,origin+'/api/v3');
  const health=await(await fetch(origin+'/api/v3/health')).json();assert.equal(health.ok,true);assert.equal(health.sourceRevision,revision);
});

test('root static routes retain traversal, private source, hidden file and symlink protections',async t=>{
  const {origin}=await fixture(t);
  for(const route of ['/src/private.js','/notification-ninja/src/private.js','/.hidden','/%2ehidden','/assets/escape.txt','/notification-ninja/assets/escape.txt','/assets/%2e%2e/%2e%2e/private.txt','/notification-ninja/%2e%2e/%2e%2e/server/ninja-service.mjs','/%00','/assets%5c..%5cprivate.txt'])assert.equal(await raw(origin,route),404,route);
  assert.equal(await raw(origin,'/%ZZ'),400);
  assert.equal((await fetch(origin+'/index.html',{method:'POST'})).status,405);
});

test('clean URLs preserve exact same-origin and legacy CORS while rejecting unrelated origins',async t=>{
  const {origin}=await fixture(t);
  for(const allowed of [origin,'https://brukevfh.github.io']){
    const response=await fetch(origin+'/api/v3/health',{headers:{Origin:allowed}});assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),allowed);
    const preflight=await fetch(origin+'/api/v3/auth/login',{method:'OPTIONS',headers:{Origin:allowed,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});assert.equal(preflight.status,204);
  }
  for(const route of ['/','/accounts-config.json','/api/v3/health']){
    const response=await fetch(origin+route,{headers:{Origin:'https://attacker.example'}});assert.equal(response.status,403);assert.equal(response.headers.get('access-control-allow-origin'),null);
  }
  const noCookie=await fetch(origin+'/api/v3/me',{headers:{Origin:origin,Cookie:'session=forged'}});assert.equal(noCookie.status,401);
});
