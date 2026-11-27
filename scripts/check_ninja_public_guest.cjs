// Production acceptance is guest-only. Every HTTP request is read-only.
const {run}=require('./check_ninja_313.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {createHash}=require('node:crypto');
const repository=path.resolve(__dirname,'..');
const digest=value=>createHash('sha256').update(value).digest('hex');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function get(base,file,{fetchImpl=fetch,timeoutMs=15000}={}){
 const url=new URL(file,base);url.searchParams.set('acceptance',String(Date.now()));
 const response=await fetchImpl(url,{headers:{'Cache-Control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(timeoutMs)});
 assert.equal(response.status,200,'Canonical asset '+file);
 return Buffer.from(await response.arrayBuffer());
}

async function waitForStaticRevision({base,expectedRevision,fetchImpl=fetch,attempts=18,intervalMs=20000}){
 assert.match(expectedRevision,/^[a-f0-9]{40}$/i,'Expected source revision must be a complete Git commit');
 let failure;
 for(let attempt=1;attempt<=attempts;attempt++){
  try{
   const manifest=JSON.parse(await get(base,'site-build.json',{fetchImpl}));
   assert.equal(manifest.kind,'notification-ninja-static-site');
   assert.equal(manifest.sourceRevision,expectedRevision,'Static deployment has the expected source revision');
   return manifest;
  }catch(error){failure=error;if(attempt<attempts){console.log('Waiting for static deployment '+attempt+'/'+attempts+': '+error.message);await pause(intervalMs);}}
 }
 throw failure;
}

async function verifyPublicAssets({base,out,staticRoot=path.join(repository,'dist/notification-ninja-site'),expectedRevision,fetchImpl=fetch,attempts=18,intervalMs=20000}){
 const expectedManifest=JSON.parse(fs.readFileSync(path.join(staticRoot,'site-build.json'),'utf8'));
 assert.equal(expectedManifest.sourceRevision,expectedRevision,'Build static output with RENDER_GIT_COMMIT set to the expected commit');
 assert.equal(expectedManifest.canonicalOrigin,new URL(base).origin);
 assert.equal(expectedManifest.homepage,'index.html');assert.equal(expectedManifest.entry,'play.html');
 const manifest=await waitForStaticRevision({base,expectedRevision,fetchImpl,attempts,intervalMs});
 assert.deepEqual(manifest,expectedManifest,'Published static file inventory and build identity match this checkout');
 const hashes=[];
 // Compare every allowlisted public file, including HTML, CSS, code, artwork,
 // robots, sitemap and the downloadable archive. Never read paths from a remote manifest.
 const files=[...expectedManifest.files];
 for(let offset=0;offset<files.length;offset+=4){
  const group=await Promise.all(files.slice(offset,offset+4).map(async file=>{
   assert(!file.startsWith('/')&&!file.split('/').some(part=>part==='..'||!part),'Safe generated public path');
   const expected=fs.readFileSync(path.join(staticRoot,file)),actual=await get(base,file,{fetchImpl,timeoutMs:45000});
   assert.equal(digest(actual),digest(expected),'The public file matches the tested static build: '+file);
   return {file,bytes:actual.length,sha256:digest(actual)};
  }));
  hashes.push(...group);
 }
 const home=fs.readFileSync(path.join(staticRoot,'index.html'),'utf8');
 assert.match(home,/<html\b[^>]*data-ninja-static-site="true"/i);
 assert(home.includes('<link rel="canonical" href="'+base+'">'),'Homepage canonical identifies the independent static root');
 assert(home.includes('property="og:url" content="'+base+'"'),'Open Graph identifies the independent homepage');
 assert(home.includes('./play.html#guest'),'Homepage links directly to the static guest game');
 const config=JSON.parse(fs.readFileSync(path.join(staticRoot,'accounts-config.json'),'utf8'));
 const {ACCOUNT_SERVICE_ORIGIN}=await import(pathToFileURL(path.join(repository,'notification-ninja/src/site-location.js')).href);
 assert.equal(config.enabled,true);assert.equal(config.apiVersion,3);assert.equal(config.endpoint,ACCOUNT_SERVICE_ORIGIN+'/api/v3','The static site retains the separate account backend');
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'asset-identity.json'),JSON.stringify({base,sourceRevision:expectedRevision,method:'GET only; SHA-256 comparison against generated static output',assets:hashes},null,2));
 return hashes;
}

async function main(){
 const {CANONICAL_SITE_ORIGIN,ACCOUNT_SERVICE_ORIGIN}=await import(pathToFileURL(path.join(repository,'notification-ninja/src/site-location.js')).href);
 const base=process.env.NINJA_PUBLIC_URL||CANONICAL_SITE_ORIGIN+'/',out=process.env.NINJA_TEST_OUTPUT||'test-results/ninja-public-guest';
 assert.equal(base,CANONICAL_SITE_ORIGIN+'/','The public smoke only targets the canonical static homepage');
 const expectedRevision=process.env.NINJA_EXPECTED_REVISION||process.env.GITHUB_SHA;
 const assets=await verifyPublicAssets({base,out,expectedRevision});
 // Keep GitHub Pages preflight in the workflow and verify this new origin too.
 const {verifyNinjaDeployment}=await import(pathToFileURL(path.join(repository,'scripts/verify_ninja_deployment.mjs')).href);
 const api=await verifyNinjaDeployment(ACCOUNT_SERVICE_ORIGIN,{pagesOrigin:CANONICAL_SITE_ORIGIN,expectedRevision});
 fs.writeFileSync(path.join(out,'static-origin-api-cors.json'),JSON.stringify(api,null,2));
 const report=await run({base,gameEntry:'play.html',publicOnly:true,out});
 console.log(JSON.stringify({version:report.version,base:report.base,sourceRevision:expectedRevision,verifiedAssets:assets.length,apiChecks:api.checks,viewports:report.viewports.map(v=>({width:v.width,ok:v.ok,screens:v.screens.length})),issues:report.issues},null,2));
}

module.exports={verifyPublicAssets,waitForStaticRevision};
if(require.main===module)main().catch(error=>{console.error(error.stack);process.exitCode=1;});
