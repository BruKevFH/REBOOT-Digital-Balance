/** Build an always-available static homepage and game, separate from the account API. */
import {mkdir,readFile,writeFile,copyFile,lstat,realpath,readdir,rename,rm,chmod} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildNinja} from './build_ninja.mjs';
import {CANONICAL_SITE_ORIGIN} from '../notification-ninja/src/site-location.js';

const REPOSITORY=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const SOURCE=path.join(REPOSITORY,'notification-ninja');
const DEFAULT_OUTPUT=path.join(REPOSITORY,'dist','notification-ninja-site');
const KIND='notification-ninja-static-site';
export const STATIC_HOME_SEO=Object.freeze({
  de:Object.freeze({title:'Notification Ninja – Kostenloses Ninja-Spiel für Fokus und digitale Balance',description:'Spiele Notification Ninja kostenlos: Wische Ablenkungen weg, entdecke drei japanische Dojos und finde deine digitale Balance. Auf Deutsch und Englisch, auch als Gast.'}),
  en:Object.freeze({title:'Notification Ninja – Free ninja game for focus and digital balance',description:'Play Notification Ninja for free: swipe away distractions, explore three Japanese dojos and find your digital balance. In German and English, with guest play.'})
});
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inside=(parent,child)=>{const relative=path.relative(parent,child);return relative===''||!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative);};

export function validateStaticOrigin(value){
  if(typeof value!=='string'||value.trim()!==value||!/^https:\/\/[^/?#]+\/?$/i.test(value)||value.includes('@'))throw new TypeError('Static site origin must be an HTTPS origin.');
  let url;try{url=new URL(value);}catch{throw new TypeError('Static site origin must be an absolute HTTPS origin.');}
  if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new TypeError('Static site origin requires HTTPS without credentials, paths, query or fragment.');
  return url.origin;
}
function runtimePath(value){
  if(value==='./')return null;
  if(typeof value!=='string'||!/^\.\/[A-Za-z0-9/_.,-]+$/.test(value)||value.slice(2).split('/').some(part=>!part||part.startsWith('.')))throw new TypeError('Unsafe precache path.');
  const name=value.slice(2);
  const rootFiles=new Set(['index.html','home.html','theme-boot.js','accounts-config.json','leaderboard-config.json','manifest.webmanifest','favicon.svg']);
  if(rootFiles.has(name)||/^[A-Za-z0-9_-]+\.css$/.test(name)||/^dist\/(?:home\.js|ninja\.js|build\.json)$/.test(name)||/^assets\/[A-Za-z0-9/_.,-]+\.(?:png|svg|webp|jpg|jpeg|avif|woff2|mp3|ogg|wav)$/.test(name)||/^assets\/fonts\/OFL-[A-Za-z0-9_-]+\.txt$/.test(name)||/^branding\/[A-Za-z0-9_-]+\.(?:png|svg|webp)$/.test(name))return name;
  throw new TypeError('Precache contains a non-runtime file: '+name);
}
/** Parse the literal single-quoted list. Never execute the service worker to discover files. */
export function parsePrecacheAssets(source){
  if(typeof source!=='string')throw new TypeError('A service-worker source is required.');
  const matches=[...source.matchAll(/\bconst\s+ASSETS\s*=\s*(\[[\s\S]*?\])\s*;/g)];
  if(matches.length!==1)throw new TypeError('Expected one literal ASSETS array.');
  const literal=matches[0][1];
  if(!/^\[\s*(?:'[^'\\\r\n]*'\s*(?:,\s*'[^'\\\r\n]*'\s*)*,?\s*)?\]$/.test(literal))throw new TypeError('ASSETS must contain only literal single-quoted paths.');
  const values=JSON.parse(literal.replace(/'([^']*)'/g,(_,value)=>JSON.stringify(value)).replace(/,\s*\]$/,']'));
  if(new Set(values).size!==values.length)throw new TypeError('Precache paths must be unique.');
  for(const value of values)runtimePath(value);
  if(!values.includes('./index.html')||!values.includes('./home.html')||!values.includes('./dist/build.json'))throw new TypeError('Precache must include both documents and build metadata.');
  return values;
}
function setHeadTag(html,pattern,tag){return pattern.test(html)?html.replace(pattern,tag):html.replace(/<\/head>/i,tag+'\n</head>');}
export function staticHTML(source,{origin,game=false}={}){
  const canonical=validateStaticOrigin(origin)+(game?'/play.html':'/');
  let html=source.replace(/\b(href|action)\s*=\s*(["'])(?:\.\/)?index\.html(?=[?#"'])/gi,(_,attribute,quote)=>attribute+'='+quote+'./play.html');
  html=html.replace(/<html\b([^>]*)>/i,(_,attributes)=>'<html'+attributes.replace(/\s+data-ninja-static-site\s*=\s*(?:"[^"]*"|'[^']*')/gi,'')+' data-ninja-static-site="true">');
  if(!/<html\b[^>]*data-ninja-static-site="true"/i.test(html)||!/<\/head>/i.test(html))throw new TypeError('Expected a complete HTML document.');
  const title=game?'Notification Ninja – Spielen':STATIC_HOME_SEO.de.title;
  const description=game?'Dein persönliches Notification-Ninja-Dojo: Spiele als Gast oder mit deinem Konto.':STATIC_HOME_SEO.de.description;
  const titleData=game?'':` data-ninja-title-de="${escape(STATIC_HOME_SEO.de.title)}" data-ninja-title-en="${escape(STATIC_HOME_SEO.en.title)}"`;
  const descriptionData=game?'':` data-ninja-description-de="${escape(STATIC_HOME_SEO.de.description)}" data-ninja-description-en="${escape(STATIC_HOME_SEO.en.description)}"`;
  html=setHeadTag(html,/<title\b[^>]*>[\s\S]*?<\/title>/i,`<title${titleData}>${escape(title)}</title>`);
  html=setHeadTag(html,/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,`<meta name="description" content="${escape(description)}"${descriptionData}>`);
  html=setHeadTag(html,/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i,`<meta name="robots" content="${game?'noindex,follow':'index,follow'}">`);
  html=setHeadTag(html,/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,`<link rel="canonical" href="${escape(canonical)}">`);
  for(const [name,value]of Object.entries({'og:title':title,'og:description':description,'og:url':canonical,'og:type':'website','og:site_name':'Notification Ninja','og:image':validateStaticOrigin(origin)+'/assets/indie-masthead.png','og:locale':'de_AT','og:locale:alternate':'en_GB'})){
    const pattern=new RegExp('<meta\\b(?=[^>]*\\bproperty=["\\\']'+name+'["\\\'])[^>]*>','i');
    html=setHeadTag(html,pattern,`<meta property="${name}" content="${escape(value)}">`);
  }
  return html;
}
async function sourceFile(root,name){
  const filename=path.join(root,name),resolved=await realpath(filename),stat=await lstat(filename);
  if(stat.isSymbolicLink()||!stat.isFile()||!inside(root,resolved))throw new TypeError('Runtime file must remain inside its source directory: '+name);
  return filename;
}
async function safeOutput(outDir,sourceRoot){
  const target=path.resolve(outDir);
  if(inside(target,REPOSITORY)||inside(target,sourceRoot)||inside(sourceRoot,target))throw new TypeError('Static output must be separate from repository sources.');
  await mkdir(path.dirname(target),{recursive:true});
  try{
    const stat=await lstat(target);if(!stat.isDirectory()||stat.isSymbolicLink())throw new TypeError('Static output must be a real directory.');
    const contents=await readdir(target);
    if(contents.length){let marker;try{marker=JSON.parse(await readFile(path.join(target,'site-build.json'),'utf8'));}catch{}if(marker?.kind!==KIND)throw new TypeError('Refusing to replace an unrelated non-empty output directory.');}
  }catch(error){if(error.code!=='ENOENT')throw error;}
  return target;
}
/** Fixture source roots may skip bundling; the CLI always builds the real sources first. */
export async function buildNinjaStatic({outDir=DEFAULT_OUTPUT,origin=CANONICAL_SITE_ORIGIN,sourceRoot=SOURCE,skipBuild=false,revision=process.env.RENDER_GIT_COMMIT||null}={}){
  const canonicalOrigin=validateStaticOrigin(origin);
  if(typeof skipBuild!=='boolean')throw new TypeError('skipBuild must be a boolean.');
  if(revision!==null&&(typeof revision!=='string'||!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(revision)))throw new TypeError('Source revision must be a complete hexadecimal commit ID.');
  const root=await realpath(sourceRoot),target=await safeOutput(outDir,root);
  if(!skipBuild){if(root!==await realpath(SOURCE))throw new TypeError('Only the repository runtime can be bundled.');const previous=process.cwd();try{process.chdir(REPOSITORY);await buildNinja();}finally{process.chdir(previous);}}
  const worker=await readFile(await sourceFile(root,'sw.js'),'utf8'),assets=parsePrecacheAssets(worker);
  const marker=/\bconst\s+STATIC_LAYOUT\s*=\s*false\s*;/g;
  if([...worker.matchAll(marker)].length!==1)throw new TypeError('Service worker requires one literal const STATIC_LAYOUT=false flag.');
  const metadata=JSON.parse(await readFile(await sourceFile(root,'dist/build.json'),'utf8'));
  if(!metadata||typeof metadata!=='object'||Array.isArray(metadata)||!/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(metadata.version))throw new TypeError('A valid runtime release version is required.');
  const archive=`Notification-Ninja-${metadata.version}.zip`,archivePath='downloads/'+archive,checksumPath=archivePath+'.sha256';
  const archiveFile=await sourceFile(root,archivePath),checksum=await readFile(await sourceFile(root,checksumPath),'utf8');
  const archiveBytes=await readFile(archiveFile),digest=createHash('sha256').update(archiveBytes).digest('hex');
  if(checksum.trim()!==`${digest}  ${archive}`)throw new TypeError('The release ZIP does not match its SHA-256 manifest.');
  const files=[...new Set(assets.map(runtimePath).filter(Boolean))];
  for(const file of files)await sourceFile(root,file);
  const stage=path.join(path.dirname(target),'.ninja-site-'+randomUUID());await mkdir(stage);
  const copied=[];
  try{
    for(const file of files){
      if(['index.html','home.html','dist/build.json'].includes(file))continue;
      await mkdir(path.dirname(path.join(stage,file)),{recursive:true});await copyFile(await sourceFile(root,file),path.join(stage,file));copied.push(file);
    }
    const home=staticHTML(await readFile(await sourceFile(root,'home.html'),'utf8'),{origin:canonicalOrigin});
    const game=staticHTML(await readFile(await sourceFile(root,'index.html'),'utf8'),{origin:canonicalOrigin,game:true});
    await writeFile(path.join(stage,'index.html'),home);await writeFile(path.join(stage,'home.html'),home);await writeFile(path.join(stage,'play.html'),game);
    await mkdir(path.join(stage,'dist'),{recursive:true});await writeFile(path.join(stage,'dist/build.json'),JSON.stringify({...metadata,canonicalOrigin,entry:'play.html',homepage:'index.html',staticSite:true},null,2)+'\n');
    await writeFile(path.join(stage,'sw.js'),worker.replace(marker,'const STATIC_LAYOUT=true;'));
    await mkdir(path.join(stage,'downloads'),{recursive:true});await copyFile(archiveFile,path.join(stage,archivePath));await writeFile(path.join(stage,checksumPath),checksum);
    await writeFile(path.join(stage,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${canonicalOrigin}/sitemap.xml\n`);
    await writeFile(path.join(stage,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(canonicalOrigin)}/</loc></url></urlset>\n`);
    const manifest={kind:KIND,version:metadata.version,canonicalOrigin,homepage:'index.html',entry:'play.html',sourceRevision:revision,files:[...copied,'index.html','home.html','play.html','dist/build.json','sw.js',archivePath,checksumPath,'robots.txt','sitemap.xml','site-build.json'].sort()};
    await writeFile(path.join(stage,'site-build.json'),JSON.stringify(manifest,null,2)+'\n');
    async function publicPermissions(directory){await chmod(directory,0o755);for(const entry of await readdir(directory,{withFileTypes:true})){const filename=path.join(directory,entry.name);if(entry.isDirectory())await publicPermissions(filename);else await chmod(filename,0o644);}}
    await publicPermissions(stage);
    await rm(target,{recursive:true,force:true});await rename(stage,target);
    return {outDir:target,...manifest};
  }catch(error){await rm(stage,{recursive:true,force:true});throw error;}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const options={};
  for(let index=2;index<process.argv.length;index++){const name=process.argv[index],value=process.argv[++index];if(!['--out-dir','--origin'].includes(name)||!value)throw new TypeError('Usage: node scripts/build_ninja_static.mjs [--out-dir DIR] [--origin HTTPS_ORIGIN]');options[name==='--out-dir'?'outDir':'origin']=value;}
  const result=await buildNinjaStatic(options);console.log(`Built Notification Ninja ${result.version}: ${result.files.length} public files in ${result.outDir}`);
}
