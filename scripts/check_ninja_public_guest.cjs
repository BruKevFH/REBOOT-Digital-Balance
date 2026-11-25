// Production acceptance is guest-only. Every HTTP request is read-only.
const {run}=require('./check_ninja_313.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const base=process.env.NINJA_PUBLIC_URL||'https://notification-ninja-accounts.onrender.com/';
const out=process.env.NINJA_TEST_OUTPUT||'test-results/ninja-public-guest';
async function verifyPublicAssets(){
 assert.equal(base,'https://notification-ninja-accounts.onrender.com/','The public smoke only targets the canonical game origin');
 const hashes=[];
 for(const file of ['index.html','home.html','dist/build.json','dist/ninja.js','dist/home.js','presentation-polish.css','intro-experience.css','playtime-experience.css','theme-boot.js']){
  const expected=fs.readFileSync(path.resolve(__dirname,'../notification-ninja',file));
  const response=await fetch(new URL(file+'?acceptance='+Date.now(),base),{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(45000)});
  assert.equal(response.status,200,'Canonical asset '+file);
  const actual=Buffer.from(await response.arrayBuffer());
  const digest=value=>createHash('sha256').update(value).digest('hex');
  assert.equal(digest(actual),digest(expected),'The public file matches the tested checkout: '+file);
  hashes.push({file,bytes:actual.length,sha256:digest(actual)});
 }
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'asset-identity.json'),JSON.stringify({base,method:'GET only',assets:hashes},null,2));
 return hashes;
}
(async()=>{
 const assets=await verifyPublicAssets();
 const report=await run({base,publicOnly:true,out});
 console.log(JSON.stringify({version:report.version,base:report.base,verifiedAssets:assets.length,viewports:report.viewports.map(v=>({width:v.width,ok:v.ok,screens:v.screens.length})),issues:report.issues},null,2));
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
