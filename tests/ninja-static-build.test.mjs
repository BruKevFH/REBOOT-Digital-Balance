import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,lstat,rm,symlink,unlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildNinjaStatic,parsePrecacheAssets,validateStaticOrigin,STATIC_HOME_SEO} from '../scripts/build_ninja_static.mjs';

const origin='https://ninja-static.example';
const precache=['./','./index.html','./home.html','./styles.css','./dist/build.json','./dist/home.js','./dist/ninja.js','./accounts-config.json','./assets/indie-masthead.png'];
const worker=values=>`const STATIC_LAYOUT=false;\nconst ASSETS=[${values.map(x=>"'"+x+"'").join(', ')}];\nif(STATIC_LAYOUT)ASSETS.push('./play.html');\n`;
const html=(label,body)=>`<!doctype html><html lang="de"><head><title>${label}</title><meta name="description" content="Old description"></head><body>${body}</body></html>`;
async function fixture(t){
  const directory=await mkdtemp(path.join(tmpdir(),'ninja-static-test-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  const sourceRoot=path.join(directory,'source'),outDir=path.join(directory,'site');
  const archive='Notification-Ninja-3.13.2.zip',bytes=Buffer.from('PK\x03\x04fixture archive'),sha=createHash('sha256').update(bytes).digest('hex');
  const files={
    'sw.js':worker(precache),'index.html':html('Game','<main>GAME</main><a href="./index.html#overview">Hub</a><a href="./home.html">Home</a>'),
    'home.html':html('Home','<main>HOMEPAGE</main><a href="./index.html#login">Login</a><a href="index.html?quick=study#guest">Guest</a>'),
    'styles.css':'body{color:#123}','dist/build.json':JSON.stringify({version:'3.13.2',entry:'index.html',homepage:'home.html',publicAccountsConfigured:true}),
    'dist/home.js':'window.HOME=true;','dist/ninja.js':'window.GAME=true;',
    'accounts-config.json':JSON.stringify({enabled:true,apiVersion:3,endpoint:'https://ninja-api.example/api/v3'}),
    'assets/indie-masthead.png':Buffer.from([137,80,78,71]),
    ['downloads/'+archive]:bytes,['downloads/'+archive+'.sha256']:`${sha}  ${archive}\n`,
    '.env':'DO_NOT_PUBLISH=dummy','src/main.js':'private source','server/ninja-auth.mjs':'private server','README.md':'private docs','downloads/old.zip':'old archive'
  };
  for(const [name,value]of Object.entries(files)){const target=path.join(sourceRoot,name);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,value);}
  return {directory,sourceRoot,outDir,files,archive,bytes,sha,build:options=>buildNinjaStatic({sourceRoot,outDir,origin,skipBuild:true,revision:null,...options})};
}
async function listFiles(directory,prefix=''){
  const result=[];for(const entry of await readdir(directory,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())result.push(...await listFiles(path.join(directory,entry.name),name+'/'));else result.push(name);}return result.sort();
}

test('static origins accept only bare HTTPS origins, including rejection before URL path normalization',()=>{
  assert.equal(validateStaticOrigin(origin+'/'),origin);
  assert.equal(validateStaticOrigin('https://example.test:443'),'https://example.test');
  for(const value of ['http://example.test','https://u:p@example.test','https://@example.test','https://example.test/path','https://example.test/a/..','https://example.test/.','https://example.test?','https://example.test/#',' https://example.test','https://example.test\\path',null])assert.throws(()=>validateStaticOrigin(value),/HTTPS|credentials|paths|origin/);
});

test('precache parsing never evaluates source and rejects traversal, dynamic values and non-runtime files',()=>{
  assert.deepEqual(parsePrecacheAssets(worker(precache)),precache);
  for(const extra of ['../secret','./../.env','./assets/../private.png','./src/main.js','./server/auth.mjs','./README.md','./.env','./secrets.json','./assets/private.txt','./dist/ninja.js.map','https://example.test/file.js'])assert.throws(()=>parsePrecacheAssets(worker([...precache,extra])));
  for(const dynamic of ["const ASSETS=['./index.html', process.env.SECRET];",'const ASSETS=["./index.html"];',"const ASSETS=['./index.html', ...(true?['./home.html']:[])];", "const ASSETS=[globalThis.__STATIC_EVAL__='executed'];"])assert.throws(()=>parsePrecacheAssets(dynamic),/literal|paths|documents/);
  assert.equal(globalThis.__STATIC_EVAL__,undefined);
  assert.throws(()=>parsePrecacheAssets(worker([...precache,'./styles.css'])),/unique/);
});

test('a real static build remaps the two entries, emits bilingual SEO and publishes only approved runtime files',async t=>{
  const f=await fixture(t),beforeHome=await readFile(path.join(f.sourceRoot,'home.html')),beforeGame=await readFile(path.join(f.sourceRoot,'index.html'));
  const built=await f.build({revision:'a'.repeat(40)});
  const home=await readFile(path.join(f.outDir,'index.html'),'utf8'),game=await readFile(path.join(f.outDir,'play.html'),'utf8');
  assert.match(home,/HOMEPAGE/);assert.doesNotMatch(home,/<main>GAME/);assert.match(game,/<main>GAME/);
  assert.match(home,/href="\.\/play\.html#login"/);assert.match(home,/href="\.\/play\.html\?quick=study#guest"/);
  assert.match(home,/data-ninja-static-site="true"/);assert.match(game,/data-ninja-static-site="true"/);
  assert(home.includes(STATIC_HOME_SEO.de.title));assert(home.includes(STATIC_HOME_SEO.en.title));assert(home.includes(STATIC_HOME_SEO.en.description));
  assert.match(home,/<link rel="canonical" href="https:\/\/ninja-static\.example\/">/);
  assert.match(home,/<meta property="og:url" content="https:\/\/ninja-static\.example\/">/);
  assert.match(game,/<meta name="robots" content="noindex,follow">/);
  assert.equal(await readFile(path.join(f.outDir,'home.html'),'utf8'),home);
  const metadata=JSON.parse(await readFile(path.join(f.outDir,'dist/build.json'),'utf8'));
  assert.equal(metadata.entry,'play.html');assert.equal(metadata.homepage,'index.html');assert.equal(metadata.canonicalOrigin,origin);assert.equal(metadata.staticSite,true);
  assert.match(await readFile(path.join(f.outDir,'sw.js'),'utf8'),/const STATIC_LAYOUT=true;/);
  assert.deepEqual(await readFile(path.join(f.outDir,'downloads',f.archive)),f.bytes);
  assert.equal(await readFile(path.join(f.outDir,'accounts-config.json'),'utf8'),f.files['accounts-config.json']);
  assert.deepEqual(await readFile(path.join(f.sourceRoot,'home.html')),beforeHome);assert.deepEqual(await readFile(path.join(f.sourceRoot,'index.html')),beforeGame);
  const publicFiles=await listFiles(f.outDir);assert.deepEqual(publicFiles,built.files);
  for(const excluded of ['.env','src/main.js','server/ninja-auth.mjs','README.md','downloads/old.zip'])assert(!publicFiles.includes(excluded));
  const robots=await readFile(path.join(f.outDir,'robots.txt'),'utf8'),sitemap=await readFile(path.join(f.outDir,'sitemap.xml'),'utf8');
  assert(robots.includes(origin+'/sitemap.xml'));assert.equal((sitemap.match(/<loc>/g)||[]).length,1);assert(sitemap.includes('<loc>'+origin+'/</loc>'));assert.doesNotMatch(sitemap,/#|login|register|play\.html|home\.html/);
  const provenance=JSON.parse(await readFile(path.join(f.outDir,'site-build.json'),'utf8'));assert.equal(provenance.sourceRevision,'a'.repeat(40));
  assert.equal((await lstat(path.join(f.outDir,'downloads',f.archive))).mode&0o777,0o644);assert.equal((await lstat(f.outDir)).mode&0o777,0o755);
});

test('builds replace only their own output and remove stale files while preserving unrelated directories',async t=>{
  const f=await fixture(t);await f.build();await writeFile(path.join(f.outDir,'stale-secret.env'),'dummy');await writeFile(path.join(f.sourceRoot,'styles.css'),'body{color:green}');await f.build();
  assert(!(await listFiles(f.outDir)).includes('stale-secret.env'));assert.equal(await readFile(path.join(f.outDir,'styles.css'),'utf8'),'body{color:green}');
  const unrelated=path.join(f.directory,'unrelated');await mkdir(unrelated);await writeFile(path.join(unrelated,'keep.txt'),'keep');
  await assert.rejects(f.build({outDir:unrelated}),/unrelated/);assert.equal(await readFile(path.join(unrelated,'keep.txt'),'utf8'),'keep');
  await assert.rejects(f.build({outDir:f.sourceRoot}),/separate/);await assert.rejects(f.build({outDir:f.directory}),/separate/);
});

test('a mismatched release archive or unsafe worker cannot replace a previously valid site',async t=>{
  const f=await fixture(t);await f.build();const previous=await readFile(path.join(f.outDir,'site-build.json'),'utf8');
  await writeFile(path.join(f.sourceRoot,'downloads',f.archive),'tampered');await assert.rejects(f.build(),/SHA-256/);assert.equal(await readFile(path.join(f.outDir,'site-build.json'),'utf8'),previous);
  await writeFile(path.join(f.sourceRoot,'downloads',f.archive),f.bytes);
  await writeFile(path.join(f.sourceRoot,'sw.js'),worker(precache).replace('const STATIC_LAYOUT=false;',''));await assert.rejects(f.build(),/STATIC_LAYOUT/);
  await assert.rejects(f.build({revision:'do-not-embed-private-values'}),/commit ID/);
});

test('a runtime symlink cannot publish files outside the runtime source directory',async t=>{
  const f=await fixture(t),privateFile=path.join(f.directory,'not-public.txt');await writeFile(privateFile,'dummy-not-public');
  await unlink(path.join(f.sourceRoot,'assets/indie-masthead.png'));await symlink(privateFile,path.join(f.sourceRoot,'assets/indie-masthead.png'));
  await assert.rejects(f.build(),/inside its source/);
});
