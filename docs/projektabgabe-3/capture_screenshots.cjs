// Capture the actual Notification Ninja interface for the course presentation.
// No UI mock-ups, score changes, profile grants, private accounts or production writes.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const out=path.join(__dirname,'assets/screenshots');
const base=new URL(process.env.NINJA_BASE_URL||'http://127.0.0.1:8203/notification-ninja/');
assert(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Use an isolated local service');
fs.mkdirSync(out,{recursive:true});
const report={kind:'Original screenshots from the running game, never mocked',capturedAt:new Date().toISOString(),version:JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version,sourceRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),viewport:{width:1440,height:900},language:'de',theme:'relaxed',syntheticProfileGrants:false,accountCredentialsUsed:false,productionRequests:false,images:[],errors:[]};
if((process.argv.includes('--extras')||process.argv.includes('--worlds-only'))&&fs.existsSync(path.join(out,'provenance.json')))Object.assign(report,JSON.parse(fs.readFileSync(path.join(out,'provenance.json'),'utf8')));
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
async function ready(p){await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,report.version,{timeout:30000});await p.evaluate(()=>document.fonts.ready);}
async function ack(p){for(let i=0;i<35;i++){await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const s=await snap(p);if(s.experience.intro?.active){await p.locator('[data-intro-action=skip]').click();continue;}if(s.mentor.open){await p.locator('#mentor-next').click();continue;}return;}throw new Error('NIM guide did not close');}
async function shot(p,name,description,extra={}){await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(220);await p.screenshot({path:path.join(out,name+'.png'),fullPage:false});const bytes=fs.readFileSync(path.join(out,name+'.png'));report.images=report.images.filter(image=>image.file!==name+'.png');report.images.push({file:name+'.png',description,urlPath:new URL(p.url()).pathname+new URL(p.url()).hash,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,method:'Unmodified Playwright screenshot of the actual visible viewport',...extra});fs.writeFileSync(path.join(out,'provenance.json'),JSON.stringify(report,null,2));console.log('CAPTURED',name);}
async function route(p,id){await p.goto(new URL('index.html#'+id,base).href);await ready(p);await ack(p);}
async function finish(p){await ack(p);if((await snap(p)).ui==='playing'){await p.locator('#pause-button').click();await ack(p);}if((await snap(p)).ui==='paused'){await p.locator('[data-action=finish-round]').click();await ack(p);}}
async function nativeGameplay(p,context,name){await route(p,'play');if(context==='open')await p.locator('[data-mode-start=open]').click();else{await p.locator('[data-world-inspect='+context+']').click();await p.locator('.indie-world-detail-panel [data-quick-context='+context+']').click();}await ack(p);await p.locator('[data-action=next]').click();await ack(p);const start=Date.now();let attempts=0,captured=false;
while(Date.now()-start<35000){await ack(p);const s=(await snap(p)).state;if(s.ended)break;const b=await p.locator('#world').boundingBox();
 const safe=s.objects.find(o=>o.kind==='distraction'&&(!o.launch||o.age>=o.launch.windup+o.launch.arc)&&o.x>o.radius+5&&o.x<b.width-o.radius-5&&o.y>o.radius+40&&o.y<b.height-o.radius-20&&!s.objects.some(v=>v.id!==o.id&&v.kind!=='distraction'&&Math.hypot(v.x-o.x,v.y-o.y)<v.radius+o.radius+20));
 if(safe){attempts++;await p.mouse.move(b.x+safe.x-14,b.y+safe.y);await p.mouse.down();await p.mouse.move(b.x+safe.x+14,b.y+safe.y,{steps:3});await p.mouse.up();}
 const now=(await snap(p)).state,visible=now.objects.filter(o=>o.y>o.radius+35&&o.y<b.height-o.radius-25&&o.age>(o.launch?.windup||0)+(o.launch?.arc||0));
 if(now.metrics.cuts>=3&&visible.length>=2){await shot(p,name,'Echte laufende '+context+'-Kurzrunde mit geworfenen Signalen, Ninja und HUD.',{nativeMouseCuts:now.metrics.cuts,actualScore:now.score,elapsed:now.elapsed,visibleSignals:visible.length,attempts});captured=true;break;}
 await p.waitForTimeout(45);
}
if(!captured){const s=(await snap(p)).state;assert(!s.ended,'The captured game is still active');assert(s.metrics.cuts>0,'At least one genuine pointer cut');await shot(p,name,'Echte laufende '+context+'-Kurzrunde nach tatsächlichen Mausschnitten.',{nativeMouseCuts:s.metrics.cuts,actualScore:s.score,elapsed:s.elapsed,attempts});}
await finish(p);}
(async()=>{const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const c=await browser.newContext({serviceWorkers:'block',viewport:report.viewport}),p=await c.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>report.errors.push(e.message));
try{
 if(process.argv.includes('--worlds-only')){
  await route(p,'guest');await route(p,'play');await p.locator('.indie-world-grid').evaluate(el=>el.scrollIntoView({block:'start'}));
  await shot(p,'play-worlds','Echte gemeinsame Spielwelt-Auswahl mit vier unterschiedlich gestalteten Dojos; echte Freischaltzustände eines neuen Gastprofils.');return;
 }
 if(process.argv.includes('--extras')){
  await route(p,'guest');await route(p,'bazaar');await p.locator('[data-shop-tab=skins]').click();
  await p.locator('[data-shop-skin]').first().evaluate(el=>el.scrollIntoView({block:'start'}));
  await shot(p,'bazaar-skins','Echte Basar-Karten mit Ninja-Illustrationen, Seltenheiten und Freischaltbedingungen; sichtbarer erster Produktabschnitt.');
  await p.locator('#shop-rarity-filter').selectOption('legendary');
  await p.locator('[data-shop-skin]').first().evaluate(el=>el.scrollIntoView({block:'start'}));
  await shot(p,'bazaar-legendary','Echter Basar mit dem ausgewählten Seltenheitsfilter Legendär; keine Freischaltung vorgenommen.');
  await nativeGameplay(p,'open','gameplay-open-run');
  const revision=execFileSync('git',['rev-parse','8e4271c'],{cwd:root,encoding:'utf8'}).trim();
  const asset='notification-ninja/assets/dojo-study-v5.svg';
  const svg=execFileSync('git',['show',revision+':'+asset],{cwd:root});
  const historical='/tmp/ninja-presentation-study-v5-historical.svg';fs.writeFileSync(historical,svg);
  const historicalServer=require('node:http').createServer((request,response)=>{response.writeHead(200,{'Content-Type':'image/svg+xml'});response.end(svg);});
  await new Promise(resolve=>historicalServer.listen(0,'127.0.0.1',resolve));
  await p.setViewportSize({width:1440,height:960});await p.goto('http://127.0.0.1:'+historicalServer.address().port+'/design-study-v5.svg');
  await shot(p,'design-study-v5','Illustrationsentwurf des Lern-Dojos aus Git-Version 3.6.0 vom 10.11.2026; keine Benutzeroberfläche und kein aktueller Gameplay-Screenshot.',{kind:'Illustrationsentwurf, kein UI-Screenshot',viewport:{width:1440,height:960},sourceAsset:asset,sourceAssetRevision:revision,sourceAssetSha256:createHash('sha256').update(svg).digest('hex'),sourceAssetDate:'2026-11-10T17:53:24+01:00',urlPath:'git:'+revision+':'+asset,method:'Unmodified native browser screenshot rendering the exact historical SVG, preserved 3:2 aspect ratio'});
  await new Promise(resolve=>historicalServer.close(resolve));
  return;
 }
 await p.goto(new URL('home.html',base).href);await p.locator('article.situation-card').first().waitFor();await p.evaluate(()=>document.fonts.ready);await shot(p,'homepage','Öffentliche Homepage mit Logo, NIM und Einstiegsmöglichkeiten.');
 await route(p,'guest');await p.locator('[data-language=de]:visible').first().click();await ack(p);await shot(p,'hub','Ninja-Hub eines frisch gestarteten echten Gastprofils.');
 await route(p,'play');await shot(p,'play-menu','Gemeinsame Auswahl von Spielmodi und Spielwelten.');
 await nativeGameplay(p,'study','gameplay-study');
 await route(p,'campaign');await shot(p,'career-map','Tatsächliche Karrierekarte mit Hauptmissionen und realen Freischaltzuständen.');
 await route(p,'bazaar');await p.locator('[data-shop-tab=skins]').click();await p.locator('[data-shop-skin]').first().evaluate(el=>el.scrollIntoView({block:'start'}));await shot(p,'bazaar-skins','Basar mit realen Ninja-Looks, Seltenheiten und Freischaltbedingungen.');
 await p.locator('[data-skin-preview=solar]').click();await p.locator('[data-dressing-context]').selectOption('gaming');await shot(p,'ninja-preview','Echte wertungsfreie Ninja-Look-Vorschau im Gaming-Dojo.');
 await route(p,'abilities');await p.locator('[data-shop-skill=zen-super] [data-skill-inspect]').click();await p.locator('[data-shop-skill=zen-super]').scrollIntoViewIfNeeded();await shot(p,'bazaar-abilities','Fähigkeiten und Supers mit realen Preisen und Voraussetzungen.');
 await route(p,'register');await p.locator('[data-account-form=register]').waitFor();await shot(p,'registration','Echtes Registrierungsformular; keine Anmeldung und keine Kontoerstellung durchgeführt.');
 await route(p,'leaderboard');await p.locator('[data-podium-place]').first().waitFor();await shot(p,'leaderboard','Echte Ranglistenansicht und Wochenpodium; es werden keine erfundenen Spieler hinzugefügt.');
 await route(p,'settings');await p.locator('[data-playtime-panel-root]').scrollIntoViewIfNeeded();await shot(p,'playtime-settings','Tatsächliche Einstellungen für aktive Spielzeit, Intro und freiwillige Pausenerinnerungen.');
 await nativeGameplay(p,'gaming','gameplay-gaming');await nativeGameplay(p,'sleep','gameplay-sleep');
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify({captured:report.images.length,version:report.version,errors:report.errors}));
}finally{await browser.close();fs.writeFileSync(path.join(out,'provenance.json'),JSON.stringify(report,null,2));}})().catch(error=>{console.error(error.stack);process.exitCode=1;});
