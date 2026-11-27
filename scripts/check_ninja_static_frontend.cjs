// Static frontend / cold API acceptance. Both test servers are isolated loopback origins.
// No provider credentials, production registration, or real account tokens are used.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');
const staticRoot=path.resolve(process.env.NINJA_STATIC_ROOT||path.join(root,'notification-ninja'));
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-static-frontend');
const widths=(process.env.NINJA_TEST_WIDTHS||'360,1280').split(',').map(Number);
const languages=(process.env.NINJA_TEST_LANGUAGES||'de,en').split(',');
const modes=(process.env.NINJA_STATIC_API_MODES||'network-blocked,json-503,wake-html').split(',');
const bootBudget=Number(process.env.NINJA_STATIC_BOOT_BUDGET_MS||6000);
const capture=process.env.NINJA_CAPTURE_SCREENSHOTS!=='0';
const sourceSmoke=process.env.NINJA_STATIC_SOURCE_SMOKE==='1';
const careerOnly=process.env.NINJA_STATIC_CAREER_ONLY==='1';
const gameEntry=process.env.NINJA_STATIC_GAME_ENTRY||(sourceSmoke?'index.html':'play.html');
assert(/^[a-z0-9_-]+\.html$/i.test(gameEntry),'Game entry must be a local HTML filename');
const expectedPublicOrigin=process.env.NINJA_EXPECTED_PUBLIC_ORIGIN?new URL(process.env.NINJA_EXPECTED_PUBLIC_ORIGIN).origin:null;
assert(widths.every(w=>Number.isInteger(w)&&w>=320&&w<=2560),'Invalid viewport widths');
assert(languages.every(l=>['de','en'].includes(l)),'Invalid languages');
assert(modes.every(m=>['network-blocked','json-503','wake-html'].includes(m)),'Invalid API scenarios');
assert(Number.isFinite(bootBudget)&&bootBudget>=500&&bootBudget<=15000,'Invalid guest boot budget');
for(const file of ['home.html','index.html',gameEntry,'dist/build.json','dist/home.js','dist/ninja.js'])assert(fs.statSync(path.join(staticRoot,file)).isFile(),'Missing static runtime: '+file);
const version=JSON.parse(fs.readFileSync(path.join(staticRoot,'dist/build.json'),'utf8')).version;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.zip':'application/zip'};
let staticOrigin,apiOrigin,apiMode='network-blocked',apiReady=false;
const apiRequests=[];
function reply(res,status,body,type='application/json; charset=utf-8',headers={}){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store',...headers});res.end(typeof body==='string'?body:JSON.stringify(body));}
function createPreview(){return http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return reply(res,400,{error:'Bad URL'});}
 if(pathname==='/accounts-config.json')return reply(res,200,{enabled:true,apiVersion:3,endpoint:apiOrigin+'/api/v3'});
 // Published static index.html is physically the homepage; play.html is the game.
 if(pathname==='/')pathname=sourceSmoke?'/home.html':'/index.html';
 const file=path.resolve(staticRoot,'.'+pathname);
 if(!file.startsWith(staticRoot+path.sep)||/\/\.(?:env|git)(?:\/|$)/.test(pathname))return reply(res,404,{error:'Not found'});
 if(!['GET','HEAD'].includes(req.method))return reply(res,405,{error:'Static preview is read-only'});
 fs.stat(file,(error,stat)=>{
  if(error||!stat.isFile())return reply(res,404,{error:'Not found'});
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
 });
});}
function createAPI(){return http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 const cors={'Access-Control-Allow-Origin':staticOrigin||'http://127.0.0.1','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'content-type, authorization','Vary':'Origin'};
 // Only route, method and scenario are recorded. Request bodies and credentials are discarded.
 apiRequests.push({pathname,method:req.method,mode:apiMode});req.resume();
 if(req.method==='OPTIONS')return reply(res,204,'','text/plain',cors);
 if(pathname==='/api/v3/health'&&apiReady)return reply(res,200,{ok:true,apiVersion:3},'application/json; charset=utf-8',cors);
 if(pathname==='/')return reply(res,503,'<!doctype html><title>Render free wake page</title><h1>Your service is spinning up</h1>','text/html; charset=utf-8',cors);
 if(apiMode==='network-blocked'){req.socket.destroy();return;}
 if(apiMode==='wake-html')return reply(res,503,'<!doctype html><title>Render free wake page</title><h1>Your service is spinning up</h1>','text/html; charset=utf-8',cors);
 return reply(res,503,{ok:false,code:'SERVICE_UNAVAILABLE',error:'Synthetic API unavailable for this local test.'},'application/json; charset=utf-8',cors);
});}
function listen(server){return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve('http://127.0.0.1:'+server.address().port));});}
async function close(server){server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve));}
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const economy=s=>Object.fromEntries(['coins','totalRuns','stats','unlockedSkills','unlockedWorlds','unlockedSkins','selectedSkin','achievements','claimedAchievements','highScores'].map(key=>[key,s.profile[key]]));
async function ack(p){for(let i=0;i<32;i++){
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const s=await snap(p);
 if(s.experience?.intro?.active){await p.locator('[data-intro-action=skip]').click();continue;}
 if(s.mentor.open){await p.locator('#mentor-next').click();continue;}
 return;
}throw Error('Intro/mentor did not close through native controls');}
async function click(p,locator,touch){
 await locator.scrollIntoViewIfNeeded();
 const target=await locator.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {w:r.width,h:r.height,reachable:el===hit||el.contains(hit)};});
 assert(target.w>=43.8&&target.h>=43.8&&target.reachable,'Native control is too small or obscured');
 if(touch)await locator.tap();else await locator.click();
}
async function geometry(p){return p.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth}));}
async function seo(p){
 const metadata=await p.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content||'',canonical:document.querySelector('link[rel=canonical]')?.href||'',ogURL:document.querySelector('meta[property="og:url"]')?.content||'',staticSite:document.documentElement.dataset.ninjaStaticSite==='true',h1:document.querySelector('h1')?.textContent.trim()||'',language:document.documentElement.lang,gameLinks:[...document.querySelectorAll('.hero-actions a')].map(a=>({href:a.href,hash:new URL(a.href).hash})),engineMounted:Boolean(window.__NOTIFICATION_NINJA__)}));
 assert(metadata.title.includes('Notification Ninja')&&metadata.description.length>=40&&metadata.h1,'Homepage needs a real title, description and heading');
 assert.equal(metadata.engineMounted,false,'Homepage must not start the game engine');
 for(const link of metadata.gameLinks){assert.equal(new URL(link.href).origin,staticOrigin,'Homepage actions must stay on the static frontend');assert.equal(new URL(link.href).pathname,'/'+gameEntry);}
 for(const hash of ['#login','#register','#guest'])assert(metadata.gameLinks.some(link=>link.hash===hash),'Missing homepage entry: '+hash);
 if(!sourceSmoke){
  assert.equal(metadata.staticSite,true,'Static pages must declare the static deployment route contract');
  assert(metadata.canonical&&new URL(metadata.canonical).protocol==='https:','Homepage needs an absolute HTTPS canonical URL');
  assert(metadata.ogURL&&new URL(metadata.ogURL).protocol==='https:','Homepage needs an absolute HTTPS OpenGraph URL');
  assert.notEqual(new URL(metadata.canonical).origin,apiOrigin,'SEO must not point to the API origin');
  if(expectedPublicOrigin){assert.equal(new URL(metadata.canonical).origin,expectedPublicOrigin,'Canonical URL must use the chosen frontend host');assert.equal(new URL(metadata.ogURL).origin,expectedPublicOrigin,'OpenGraph URL must use the chosen frontend host');}
 }
 return metadata;
}
async function careerContrast(p){return p.evaluate(()=>{
 const rgba=color=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const c=canvas.getContext('2d');c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);};
 const luminance=c=>{const values=c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;};
 return [...document.querySelectorAll('.nn-career-chapter-trail .nn-career-node-copy')].flatMap(card=>{
  const background=rgba(getComputedStyle(card).backgroundColor);
  return [...card.querySelectorAll('strong,small')].map(el=>{const foreground=rgba(getComputedStyle(el).color),a=luminance(foreground),b=luminance(background);return {mission:card.dataset.missionInspect,text:el.textContent.trim(),foreground:foreground.slice(0,3),background:background.slice(0,3),opaque:background[3]>=.99,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};});
 });
});}
async function careerBadgeContrast(p){return p.evaluate(()=>{
 const rgb=color=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];};
 const luminance=color=>{const c=color.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 return [...document.querySelectorAll('.nn-career .career-chapter-nav b')].map(el=>{const style=getComputedStyle(el),foreground=rgb(style.color),background=rgb(style.backgroundColor),a=luminance(foreground),b=luminance(background);return {text:el.textContent.trim(),foreground:foreground.slice(0,3),background:background.slice(0,3),opaque:background[3]===255,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};});
});}
// The browser's timer clock accelerates only the bounded read-only health backoff.
// Network requests and native controls still use the actual browser and two HTTP origins.
async function awaitReadinessFailure(p){
 for(let tick=0;tick<16;tick++){
  if(await p.locator('#account-error').innerText())return;
  await p.waitForTimeout(100);await p.clock.fastForward(13000);
 }
 assert.fail('The bounded read-only readiness check did not return a usable error');
}
async function caseFlow(browser,mode,width,language){
 apiMode=mode;apiReady=false;const touch=width<768;
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:touch?844:960},hasTouch:touch});
 await context.addInitScript(()=>{const nativeFetch=window.fetch;window.__ninjaStaticRequestAudit=[];window.fetch=function(input,options){const url=new URL(typeof input==='string'?input:input.url,location.href);window.__ninjaStaticRequestAudit.push({pathname:url.pathname,method:options?.method||'GET'});return nativeFetch.apply(this,arguments);};});
 const p=await context.newPage(),entry={mode,width,language,pageErrors:[],staticFailures:[],unexpectedOrigins:[],mainDocuments:[],ok:false};p.setDefaultTimeout(12000);
 p.on('pageerror',error=>entry.pageErrors.push(error.message));
 p.on('response',response=>{const url=new URL(response.url());if(url.origin===staticOrigin&&response.status()>=400)entry.staticFailures.push({path:url.pathname,status:response.status()});});
 p.on('framenavigated',frame=>{if(frame===p.mainFrame()&&/^https?:/.test(frame.url()))entry.mainDocuments.push(frame.url());});
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(!['http:','https:'].includes(url.protocol)||[staticOrigin,apiOrigin].includes(url.origin))return route.continue();entry.unexpectedOrigins.push(url.origin);return route.abort();});
 try{
  const beforeHome=apiRequests.length;const response=await p.goto(staticOrigin+'/');assert.equal(response.status(),200);assert.equal(new URL(p.url()).origin,staticOrigin);assert.equal(new URL(p.url()).pathname,'/','The public address stays at the static root');
  await p.evaluate(()=>document.fonts.ready);await click(p,p.locator('[data-language='+language+']'),touch);entry.seo=await seo(p);
  assert.equal(apiRequests.length,beforeHome,'The information homepage must not wake or wait for the API');
  if(capture)await p.screenshot({path:path.join(output,[mode,width,language,'home'].join('-')+'.png')});
  const started=performance.now();await click(p,p.locator('.hero-actions .guest-home-link'),touch);
  await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version,{timeout:bootBudget});await ack(p);entry.guestBootMs=Math.round(performance.now()-started);
  assert(entry.guestBootMs<=bootBudget,'Fresh guest startup waited for the cold API');assert.equal((await snap(p)).ui,'home');assert.equal((await snap(p)).session.kind,'guest');assert.equal((await snap(p)).state.started,false,'Guest entry never starts a round automatically');
  assert.equal(apiRequests.length,beforeHome,'A fresh guest must not need to wake the account API');
  if(!careerOnly){const before=economy(await snap(p));await click(p,p.locator('.indie-bottom-nav [data-game-route=play]'),touch);await ack(p);await click(p,p.locator('.indie-account-tool'),touch);await p.locator('[data-account-form=login]').waitFor();
  await p.locator('[data-account-form=login] [name=username]').fill('synthetic-offline-user');await p.locator('[data-account-form=login] [name=password]').fill('Synthetic test password only');
  await p.clock.install();
  await click(p,p.locator('[data-account-form=login] button[type=submit]'),touch);
  await p.waitForFunction(()=>Boolean(document.querySelector('#account-working')?.textContent.trim()));
  assert.equal(apiRequests.slice(beforeHome).some(request=>request.method==='POST'),false,'No credentials may be posted before read-only readiness succeeds');
  await awaitReadinessFailure(p);entry.accountError=await p.locator('#account-error').innerText();
  assert(!/<(?:html|title|h1)|Your service is spinning up/i.test(entry.accountError),'The API wake page must not appear as account UI');
  assert.equal(await p.locator('[data-account-form=login] [name=username]').inputValue(),'synthetic-offline-user');assert.equal(await p.locator('[data-account-form=login] [name=password]').inputValue(),'Synthetic test password only');
  assert.equal(apiRequests.slice(beforeHome).filter(request=>request.method==='GET'&&request.pathname==='/api/v3/health').length,6,'An unavailable service receives exactly the bounded six read-only health attempts');
  assert.equal(apiRequests.slice(beforeHome).some(request=>request.method==='POST'),false,'An unavailable health check must not submit credentials');
  await p.waitForFunction(()=>!document.querySelector('[data-account-form=login] button[type=submit]')?.disabled);
  const firstAttempts=apiRequests.length;await click(p,p.locator('[data-account-form=login] button[type=submit]'),touch);await p.waitForFunction(()=>Boolean(document.querySelector('#account-working')?.textContent.trim()));await p.waitForTimeout(100);assert(apiRequests.length>firstAttempts,'A deliberate retry reaches only the separate synthetic API');
  await click(p,p.locator('[data-account=close]'),touch);assert.equal(await p.locator('[data-account-form=login]').count(),0,'Back must cancel a pending read-only health check');
  await p.clock.fastForward(30000);await p.waitForTimeout(100);assert.equal(apiRequests.slice(beforeHome).some(request=>request.method==='POST'),false,'Cancelling readiness must never trigger a late login');
  apiReady=true;await click(p,p.locator('.indie-account-tool'),touch);await p.locator('[data-account-form=login]').waitFor();await p.locator('[name=username]').fill('synthetic-offline-user');await p.locator('[name=password]').fill('Synthetic test password only');
  await click(p,p.locator('[data-account-form=login] button[type=submit]'),touch);await p.waitForFunction(()=>Boolean(document.querySelector('#account-error')?.textContent.trim()));
  const loginCalls=await p.evaluate(()=>window.__ninjaStaticRequestAudit.filter(request=>request.method==='POST'&&request.pathname==='/api/v3/auth/login').length),loginConnections=apiRequests.slice(beforeHome).filter(request=>request.method==='POST'&&request.pathname==='/api/v3/auth/login').length;
  assert.equal(loginCalls,1,'A healthy readiness check permits exactly one explicit login fetch, without an application POST retry');
  assert(loginConnections>=1,'The explicit login must reach the separate API origin');
  if(mode!=='network-blocked')assert.equal(loginConnections,1,'An HTTP error response must not trigger another application login request');
  assert.equal(await p.locator('[name=username]').inputValue(),'synthetic-offline-user');assert.equal(await p.locator('[name=password]').inputValue(),'Synthetic test password only');
  assert(!/<(?:html|title|h1)|Your service is spinning up/i.test(await p.locator('#account-error').innerText()),'A failed POST must not display provider HTML');
  entry.readiness={boundedHealthAttempts:6,backoffClockAccelerated:true,explicitRetry:true,cancelledBeforeMutation:true,loginFetchCalls:loginCalls,loginTransportAttempts:loginConnections,fieldsRetained:true};
  await click(p,p.locator('[data-account=guest]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);assert.deepEqual(economy(await snap(p)),before,'A failed online request must preserve the guest profile');}
  entry.career=[];for(const theme of ['dark','noir']){
   await click(p,p.locator('[data-open-settings]:visible').first(),touch);await click(p,p.locator('button[data-ninja-theme='+theme+']'),touch);await click(p,p.locator('.indie-bottom-nav [data-game-route=campaign]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='career');await ack(p);
   const cards=await careerContrast(p);assert.equal(cards.length,36,'All18mission titles and status texts are inspected');assert(cards.every(item=>item.opaque&&item.contrast>=4.5),'Dark/Noir career text needs readable solid cards: '+JSON.stringify(cards.filter(item=>!item.opaque||item.contrast<4.5)));
   const badges=await careerBadgeContrast(p);assert.equal(badges.length,3,'All three chapter number badges must be inspected');assert(badges.every(item=>item.opaque&&item.contrast>=4.5),'Chapter numbers must remain readable in every theme: '+JSON.stringify(badges));
   if(language==='en')assert(!/\b\d+\s+von\s+\d+\s+Missionen\b/i.test(await p.locator('body').innerText()),'English career must translate all chapter mission counters');
   const g=await geometry(p);assert(g.document<=g.width+1,'Career overflows the static frontend viewport');entry.career.push({theme,texts:cards.length,minContrast:Math.min(...cards.map(item=>item.contrast)),chapterBadges:badges.length,minBadgeContrast:Math.min(...badges.map(item=>item.contrast))});
   if(capture)await p.screenshot({path:path.join(output,[mode,width,language,theme,'career'].join('-')+'.png')});
  }
  assert(entry.mainDocuments.every(url=>new URL(url).origin===staticOrigin),'No document navigation may escape to the cold API');assert.deepEqual(entry.pageErrors,[]);assert.deepEqual(entry.staticFailures,[],'Every requested frontend asset must be available without the API');assert.deepEqual(entry.unexpectedOrigins,[]);assert.equal((await snap(p)).language,language);
  entry.apiRequests=apiRequests.slice(beforeHome);if(!careerOnly&&mode!=='network-blocked')assert(entry.apiRequests.some(request=>request.method==='POST'&&request.pathname==='/api/v3/auth/login'),'The cross-origin request must reach the API response scenario after a valid CORS preflight');if(careerOnly)assert.equal(entry.apiRequests.length,0,'Guest career checks must not depend on the account API');entry.ok=true;
 }catch(error){entry.failure=error.stack;await p.screenshot({path:path.join(output,[mode,width,language,'FAIL'].join('-')+'.png'),fullPage:true}).catch(()=>{});}
 finally{await context.close();}return entry;
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});const staticServer=createPreview(),apiServer=createAPI();let browser;
 const report={version,staticRoot,gameEntry,sourceSmoke,careerOnly,isolatedConfigOverride:true,productionAccountsCreated:0,cases:[],issues:[]};
 try{
  const configured=JSON.parse(fs.readFileSync(path.join(staticRoot,'accounts-config.json'),'utf8'));
  assert.equal(configured.enabled,true,'The public static build must keep real optional accounts configured');
  assert.equal(configured.apiVersion,3);const configuredURL=new URL(configured.endpoint);assert.equal(configuredURL.protocol,'https:','Published API endpoint uses HTTPS');
  assert(!configuredURL.username&&!configuredURL.password&&!configuredURL.search&&!configuredURL.hash,'The public API endpoint must not contain credentials, tokens or fragments');
  report.configuredAPIOrigin=configuredURL.origin;if(expectedPublicOrigin)assert.notEqual(configuredURL.origin,expectedPublicOrigin,'Published frontend and API must use separate origins');
  apiOrigin=await listen(apiServer);staticOrigin=await listen(staticServer);assert.notEqual(staticOrigin,apiOrigin);report.frontendOrigin=staticOrigin;report.apiOrigin=apiOrigin;
  for(const privatePath of ['/.env','/.git/config','/server/ninja-service.mjs','/package.json']){assert(!fs.existsSync(path.join(staticRoot,privatePath.slice(1))),'Private file is present in static publish folder: '+privatePath);assert.equal((await fetch(staticOrigin+privatePath)).status,404,'Static publish folder must not expose '+privatePath);}
  const frontendAPI=await fetch(staticOrigin+'/api/v3/health');assert.equal(frontendAPI.status,404,'The static frontend does not run or proxy the API');
  const rootResponse=await fetch(staticOrigin+'/'),homeResponse=await fetch(staticOrigin+'/home.html');assert.equal(await rootResponse.text(),await homeResponse.text(),'The physical static root and home.html alias return the actual homepage');
  browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  for(const mode of modes)for(const width of widths)for(const language of languages){const entry=await caseFlow(browser,mode,width,language);report.cases.push(entry);if(!entry.ok)report.issues.push({mode,width,language,error:entry.failure});fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log('STATIC_FRONTEND',mode,width,language,entry.ok,entry.failure||'guest '+entry.guestBootMs+'ms');}
 }catch(error){report.issues.push({probe:'setup',error:error.stack});}
 finally{await browser?.close();await Promise.all([close(staticServer),close(apiServer)]);fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));}
 console.log(JSON.stringify({version,cases:report.cases.length,issues:report.issues},null,2));if(report.issues.length)process.exitCode=1;
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
