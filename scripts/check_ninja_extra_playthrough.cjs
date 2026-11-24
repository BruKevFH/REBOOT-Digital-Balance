// Real-time native input through the eight authored extra missions.
// Starts only from an actually earned browser checkpoint; never edits a profile or clock.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
assert(['127.0.0.1','localhost','[::1]'].includes(new URL(base).hostname),'Local isolated service required');
const out=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-extra-playthrough');
const input=process.env.NINJA_EXTRA_STORAGE||path.join(root,'test-results/ninja-campaign-playthrough/earned-storage.json');
const checkpoint=path.resolve(process.env.NINJA_EXTRA_CHECKPOINT||path.join(out,'earned-state.json'));
const width=Number(process.env.NINJA_TEST_WIDTH||1280),touch=width<768;
const wanted=process.env.NINJA_EXTRA_MISSIONS?.split(',');
const report={nativeInput:touch?'touch':'mouse',realTime:true,sourceCheckpoint:input,missions:[],claims:[],issues:[],pageErrors:[],ok:false};
let context,p;
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
function flush(){fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));}
async function save(label){await context.storageState({path:checkpoint});if(label)await context.storageState({path:path.join(out,'earned-'+label+'.json')});flush();}
async function ack(){for(let i=0;i<50&&(await snap(p)).mentor.open;i++)await p.locator('#mentor-next').click();}
async function click(selector){const target=typeof selector==='string'?p.locator(selector):selector;
 for(let attempt=0;attempt<4;attempt++){await ack();await target.scrollIntoViewIfNeeded();assert.equal(await target.count(),1,'Unambiguous real target');try{if(touch)await target.tap({timeout:2000});else await target.click({timeout:2000});await p.waitForTimeout(20);await ack();return;}catch(error){if(!(await snap(p)).mentor.open||attempt===3)throw error;}}
}
async function ready(){await p.waitForFunction(()=>Boolean(window.__NOTIFICATION_NINJA__?.getSnapshot().version));await ack();report.version=(await snap(p)).version;}
async function home(){await ack();if((await snap(p)).ui==='home')return;const close=p.locator('dialog[open].career-mission-sheet [data-career-sheet-close]');if(await close.count())await click(close);await click(p.locator('[data-action=home]:visible,.indie-bottom-nav [data-game-route=home]:visible').first());await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');}
async function claimAll(){
 await home();await click('.indie-bottom-nav [data-game-route=campaign]');
 await home();await click('#profile-button');await click('[data-action=achievements]');
 for(let n=0;n<30;n++){const claim=p.locator('[data-achievement-claim]:enabled').first();if(!await claim.count())break;const id=await claim.getAttribute('data-achievement-claim'),before=(await snap(p)).profile.coins;await click(claim);report.claims.push({type:'achievement',id,before,after:(await snap(p)).profile.coins});}
 await home();await click('.indie-bottom-nav [data-game-route=play]');await click('[data-game-route=weekly]:visible');
 for(let n=0;n<5;n++){const claim=p.locator('[data-daily-claim]:enabled:visible').first();if(!await claim.count())break;const id=await claim.getAttribute('data-daily-claim'),before=(await snap(p)).profile.coins;await click(claim);report.claims.push({type:'daily',id,before,after:(await snap(p)).profile.coins});}
 for(let n=0;n<5;n++){const claim=p.locator('[data-weekly-claim]:enabled').first();if(!await claim.count())break;const id=await claim.getAttribute('data-weekly-claim'),before=(await snap(p)).profile.coins;await click(claim);report.claims.push({type:'weekly',id,before,after:(await snap(p)).profile.coins});}
 await home();await save('claims');console.log('EXTRA_CLAIMS',JSON.stringify({count:report.claims.length,coins:(await snap(p)).profile.coins}));
}
function distance(o,x1,x2,y){const x=Math.max(x1,Math.min(x2,o.x));return Math.hypot(o.x-x,o.y-y);}
function target(g,r){
 const wide=g.effects.flow>0?1.2:1;
 return g.objects.filter(o=>(o.kind==='distraction'||o.kind==='powerup')&&(!o.launch||o.age>=o.launch.windup+o.launch.arc)&&o.x>18&&o.x<r.width-18&&o.y>18&&o.y<r.height-18)
 .sort((a,b)=>a.y-b.y).find(o=>!g.objects.some(v=>v.id!==o.id&&v.kind==='useful'&&(!v.launch||v.age>=v.launch.windup+v.launch.arc)&&distance(v,o.x-9,o.x+9,o.y)<v.radius*wide+18));
}
async function swipe(o){const r=await p.locator('#world').boundingBox(),x=r.x+o.x,y=r.y+o.y;if(touch){const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-9,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+9,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else{await p.mouse.move(x-9,y);await p.mouse.down();await p.mouse.move(x+9,y);await p.mouse.up();}}
async function play(def){
 const started=Date.now(),deadline=started+600000,entry={id:def.id,title:def.title,phases:[],cuts:0};let nextLog=0;
 while(Date.now()<deadline){await ack();const s=await snap(p),g=s.state;
  if(g.ended){entry.result=g.result;entry.cuts=g.metrics.cuts;entry.elapsed=g.elapsed;entry.correct=g.metrics.correctDecisions;entry.unprotectedErrors=g.metrics.usefulMistakes+g.metrics.missedDistractions;entry.shieldedMistakes=g.metrics.shieldedMistakes||0;entry.errors=entry.unprotectedErrors+entry.shieldedMistakes;entry.coins=s.profile.coins;entry.completed=s.profile.adventure.completed.includes(def.id);if(report.recoveredCompletedAttempt===def.id){entry.resumedCompletedFromEarnedCheckpoint=true;entry.resumeInspectionSeconds=(Date.now()-started)/1000;}else entry.realSeconds=(Date.now()-started)/1000;entry.runCoins=g.awardedCoins;entry.metrics=g.metrics;break;}
  if(s.ui==='briefing'){await p.screenshot({path:path.join(out,def.id+'-briefing-'+g.context+'.png')});await click('[data-action=next]');continue;}
  if(s.ui==='limit-choice'||s.ui==='sleep-choice'){await click('[data-action=stop]');continue;}
  if(s.ui==='paused'){await click('[data-action=resume]');continue;}
  assert.equal(s.ui,'playing');
  if(g.boss&&!entry.phases.includes(g.boss.phase)){entry.phases.push(g.boss.phase);await p.screenshot({path:path.join(out,def.id+'-phase-'+g.boss.phase+'.png')});}
  if(def.id==='sleep-sanctuary'&&g.stopAvailable&&g.metrics.correctDecisions>=8&&g.elapsed>=8){await click('#stop-button');continue;}
  const stopOpen=def.id==='open-trial'&&g.elapsed>=45&&g.metrics.correctDecisions>=20;
  if(!stopOpen){const r=await p.locator('#world').boundingBox(),o=target(g,r);if(o){const before=g.metrics.cuts;await swipe(o);if((await snap(p)).state.metrics.cuts>before)entry.cuts++;}}
  if(g.elapsed>=nextLog){nextLog=g.elapsed+15;console.log('EXTRA_PROGRESS',JSON.stringify({id:def.id,elapsed:g.elapsed,phase:g.boss?.phase,health:g.boss?.health,lives:g.lives,correct:g.metrics.correctDecisions}));}
  await p.waitForTimeout(12);
 }
 assert(entry.completed,'Native attempt did not complete mission '+JSON.stringify(entry));assert(entry.cuts>0,'Real native cuts required');if(def.bossId)assert.deepEqual(entry.phases,[0,1,2]);
 await p.screenshot({path:path.join(out,def.id+'-result.png'),fullPage:true});
 const before=(await snap(p)).profile.coins;await click('[data-career-claim="'+def.id+'"]:visible');entry.claimed=(await snap(p)).profile.adventure.claimed.includes(def.id);entry.afterClaim=(await snap(p)).profile.coins;assert(entry.claimed);assert.equal(entry.afterClaim,before+def.reward);
 report.missions.push(entry);await save(def.id);console.log('EXTRA_PASSED',JSON.stringify(entry));return entry;
}
async function inspectAndStart(def,{startRun=true}={}){await home();await click('.indie-bottom-nav [data-game-route=campaign]');const node=p.locator('[data-mission-inspect="'+def.id+'"]');const details=node.locator('xpath=ancestor::details');if(await details.count()&&!await details.evaluate(el=>el.open))await click(details.locator('summary'));await click(node);if(!startRun)return;const start=p.locator('[data-mission-start="'+def.id+'"]:visible');assert(await start.isEnabled(),'Authored prerequisite satisfied for '+def.id);await click(start);assert.equal((await snap(p)).state.missionId,def.id);}
async function buyMaster(){await claimAll();const s=await snap(p);if(s.profile.unlockedWorlds.includes('master'))return;assert(s.profile.coins>=320,'Earned coins required for Balance Master: '+s.profile.coins);await click('.indie-bottom-nav [data-game-route=bazaar]');await click('[data-shop-tab=worlds]');await click('[data-shop-filter=all]');const before=(await snap(p)).profile.coins;await click('[data-world-buy=master]:visible');await click('#account-root [data-account=purchase]');await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().profile.unlockedWorlds.includes('master'));assert((await snap(p)).profile.unlockedWorlds.includes('master'));assert.equal((await snap(p)).profile.coins,before-320);report.masterPurchase={before,after:(await snap(p)).profile.coins};await save('master-purchase');}
(async()=>{fs.mkdirSync(out,{recursive:true});const {LEGACY_MISSIONS}=await import(pathToFileURL(path.join(root,'notification-ninja/src/adventure.js')).href);const defs=wanted?LEGACY_MISSIONS.filter(d=>wanted.includes(d.id)):LEGACY_MISSIONS;assert(!wanted||defs.length===wanted.length);
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 try{context=await browser.newContext({viewport:{width,height:900},hasTouch:touch,serviceWorkers:'block',storageState:input});p=await context.newPage();p.on('pageerror',e=>report.pageErrors.push(e.message));await p.goto(base);await ready();const initial=(await snap(p)).profile;assert.equal(initial.adventure.completed.filter(id=>/^(study|gaming|sleep)-\d\d$/.test(id)).length,18,'All18mainmissions genuinely completed in source checkpoint');report.initial={coins:initial.coins,completed:initial.adventure.completed,unlockedWorlds:initial.unlockedWorlds};
  await claimAll();for(const def of defs){if((await snap(p)).profile.adventure.claimed.includes(def.id)){console.log('EXTRA_ALREADY_CLAIMED',def.id);continue;}if(def.id==='balance-master')await buyMaster();const current=(await snap(p));if(current.profile.adventure.completed.includes(def.id)&&current.state.missionId===def.id&&current.state.ended){report.recoveredCompletedAttempt=def.id;await inspectAndStart(def,{startRun:false});await play(def);}else{await inspectAndStart(def);await play(def);}}
  assert.deepEqual(report.pageErrors,[]);report.final={coins:(await snap(p)).profile.coins,completed:(await snap(p)).profile.adventure.completed,claimed:(await snap(p)).profile.adventure.claimed};report.ok=true;await save('final');
 }catch(error){report.issues.push(error.stack);if(p){await p.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});report.failureSnapshot=await snap(p).catch(()=>null);await save('failure').catch(()=>{});}console.error(error.stack);process.exitCode=1;}finally{flush();await context?.close();await browser.close();console.log('EXTRA_RESULT',JSON.stringify({ok:report.ok,missions:report.missions.length,issues:report.issues}));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
