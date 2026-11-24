// Real-time browser playthrough. Reads diagnostics; every decision uses native input.
// Local isolated server only: never creates public accounts or edits a saved profile.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
assert(['127.0.0.1','localhost','[::1]'].includes(new URL(base).hostname),'Use an isolated local server.');
const out=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-modes-playthrough');
const modeList=(process.env.NINJA_TEST_MODES||'boss-rush,daily,open,training').split(',');
const width=Number(process.env.NINJA_TEST_WIDTH||360),touch=width<768;
const version=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../notification-ninja/dist/build.json'))).version;
fs.mkdirSync(out,{recursive:true});
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const clone=v=>JSON.parse(JSON.stringify(v));
async function ack(p){for(let i=0;i<30&&(await snap(p)).mentor.open;i++)await p.locator('#mentor-next').click();}
async function click(p,selector){const target=p.locator(selector);await target.scrollIntoViewIfNeeded();assert.equal(await target.count(),1,'Unambiguous real target '+selector);if(touch)await target.tap();else await target.click();await p.waitForTimeout(25);}
async function home(p){await ack(p);const s=await snap(p);if(s.ui==='home')return;if(s.ui==='results'){await click(p,'#overlay-root .panel-home[data-action=home]');}else{await click(p,'.indie-bottom-nav [data-game-route=home]');}await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);}
async function pauseAndEnd(p){for(let i=0;i<10;i++){await ack(p);const s=await snap(p);if(s.ui==='paused'&&!s.mentor.open)break;if(s.ui==='playing')await click(p,'#pause-button');await p.waitForTimeout(60);}assert.equal((await snap(p)).ui,'paused');await click(p,'[data-action=finish-round]');await ack(p);}
async function swipe(p,o,cdp){const r=await p.locator('#world').boundingBox();const x=r.x+o.x,y=r.y+o.y;if(touch){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-12,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+12,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{await p.mouse.move(x-12,y);await p.mouse.down();await p.mouse.move(x+12,y,{steps:2});await p.mouse.up();}}
function readyObject(o){return !o.launch||o.age>=o.launch.windup+o.launch.arc;}
function safeTarget(state,r){
 const scale=state.effects.flow>0?1.2:1;
 return state.objects.filter(o=>['distraction','powerup'].includes(o.kind)&&readyObject(o)&&o.x>o.radius&&o.x<r.width-o.radius&&o.y>o.radius+12&&o.y<r.height-o.radius-5)
  .sort((a,b)=>a.y-b.y).find(o=>!state.objects.some(v=>v.id!==o.id&&v.kind==='useful'&&readyObject(v)&&Math.hypot(Math.max(0,Math.abs(v.x-o.x)-12),v.y-o.y)<v.radius*scale+12));
}
async function play(p,mode,report,cdp){
 const startingProfile=(await snap(p)).profile;
 const start=Date.now(),deadline=start+(mode==='boss-rush'?900000:mode==='open'?180000:180000);
 const entry={mode,width,touch,startedAt:new Date().toISOString(),phases:[],cues:[],vulnerabilities:[],cuts:0,errors:[]};
 let stopOpen=false,trainingComplete=false,lastProgress=0,pausedOnce=false,seenState=new Set(),seenCue=new Set();
 while(Date.now()<deadline){
  await ack(p);let s=await snap(p),g=s.state;
  if(mode==='training'&&!g.isTutorial&&g.tutorialResults){trainingComplete=true;entry.training=clone(g.tutorialResults);assert.equal(g.tutorialResults.reason,'learned');assert(g.tutorialResults.cuts>=2&&g.tutorialResults.passed>=2&&g.tutorialResults.decisions>=6);await p.screenshot({path:path.join(out,'training-complete.png'),fullPage:true});break;}
  if(g.ended){entry.result=g.result;entry.state=clone(g);entry.profile={coins:s.profile.coins,totalRuns:s.profile.totalRuns,adventure:clone(s.profile.adventure),highScores:clone(s.profile.highScores)};break;}
  if(s.ui==='briefing'){await p.screenshot({path:path.join(out,mode+'-briefing-'+(g.boss?.id||g.context)+'.png'),fullPage:true});if(mode==='daily'){assert.equal(g.dailyChallenge.practice,true);assert.match(await p.locator('.briefing-copy').innerText(),/Lokale Tagesübung/);assert.equal(g.duration,60);assert.equal(g.maxLives,3);}await click(p,'[data-action=next]');await ack(p);continue;}
  if(s.ui==='limit-choice'){throw Error(mode+' unexpectedly offers a timed extension.');}
  if(s.ui==='paused'){await click(p,'[data-action=resume]');continue;}
  assert.equal(s.ui,'playing','Mode keeps the real play UI');
  if(g.boss){
   const phaseKey=g.boss.id+':'+g.boss.phase;
   if(!seenState.has(phaseKey)){seenState.add(phaseKey);entry.phases.push({id:g.boss.id,phase:g.boss.phase,context:g.context,health:g.boss.health,correct:g.metrics.correctDecisions,elapsed:g.elapsed});console.log('BOSS PHASE',JSON.stringify(entry.phases.at(-1)));await p.screenshot({path:path.join(out,'boss-'+phaseKey.replace(':','-')+'.png')});}
   if(g.boss.cueRemaining>0&&!seenCue.has(g.boss.id+':'+g.boss.phase+':'+g.boss.waves)){seenCue.add(g.boss.id+':'+g.boss.phase+':'+g.boss.waves);entry.cues.push({id:g.boss.id,phase:g.boss.phase,cue:g.boss.cueRemaining,burst:g.boss.burstRemaining,elapsed:g.elapsed});assert.equal(g.boss.burstRemaining,0,'A wave is announced before the burst');assert(await p.locator('#boss-cue').isVisible());}
   if(g.boss.vulnerabilityRemaining>0&&!entry.vulnerabilities.includes(g.boss.id))entry.vulnerabilities.push(g.boss.id);
  }
  if(!pausedOnce&&g.elapsed>8){await click(p,'#pause-button');await ack(p);if((await snap(p)).ui==='paused'){const paused=(await snap(p)).state;await p.waitForTimeout(130);assert.equal((await snap(p)).state.elapsed,paused.elapsed);await p.screenshot({path:path.join(out,mode+'-pause.png'),fullPage:true});await click(p,'[data-action=resume]');pausedOnce=true;entry.pauseFreezesClock=true;}continue;}
  if(mode==='open'){
   assert.equal(g.maxLives,3);assert.equal(g.duration,0);assert.equal(g.remaining,0);assert.equal(g.selectedSuper,null);assert.deepEqual(g.skillIds,[]);
   if(g.elapsed>=90){stopOpen=true;entry.survived90=true;}
  }
  const r=await p.locator('#world').boundingBox();const target=!stopOpen&&safeTarget(g,r);
  if(target){entry.attempts=(entry.attempts||0)+1;const before=g.metrics.cuts;await swipe(p,target,cdp);const after=await snap(p);if(after.state.metrics.cuts>before)entry.cuts++;}
  if(g.elapsed-lastProgress>10){lastProgress=g.elapsed;console.log('MODE PROGRESS',JSON.stringify({mode,elapsed:Math.round(g.elapsed),boss:g.boss?.id,health:g.boss?.health,lives:g.lives,cuts:g.metrics.cuts,correct:g.metrics.correctDecisions,speed:g.speedFactor}));}
  await p.waitForTimeout(22);
 }
 const s=await snap(p);if(mode==='training'){assert(trainingComplete,'Training completed by actual decisions');entry.coins=s.profile.coins;entry.totalRuns=s.profile.totalRuns;assert.equal(s.profile.coins,startingProfile.coins,'Training grants no coins');assert.equal(s.profile.totalRuns,startingProfile.totalRuns,'Training is not a scored run');assert.equal(s.state.score,0,'Tutorial resets arcade score after learning');}
 else{entry.outcome={result:s.state.result,elapsed:s.state.elapsed,metrics:s.state.metrics,lives:s.state.lives,score:s.state.score};await p.screenshot({path:path.join(out,mode+'-outcome.png'),fullPage:true});report.lastAttempt=entry;fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));assert(s.state.ended,'Mode actually reached an outcome: '+JSON.stringify({mode,ui:s.ui,elapsed:s.state.elapsed,health:s.state.boss?.health,lives:s.state.lives}));assert(s.state.metrics.cuts>0&&entry.cuts>0,'Uses genuine native cuts');assert.equal(s.state.result,mode==='open'?'lives':'complete');if(mode==='boss-rush'){assert.deepEqual(s.state.bossRush.completed,['scout','guardian','overlord']);assert.deepEqual(entry.vulnerabilities,['scout','guardian','overlord']);for(const id of ['scout','guardian','overlord'])assert.deepEqual(entry.phases.filter(x=>x.id===id).map(x=>x.phase),[0,1,2]);assert.equal(entry.phases.length,9);assert(s.state.metrics.correctDecisions>=84);}await p.screenshot({path:path.join(out,mode+'-result.png'),fullPage:true});}
 entry.realTimeSeconds=(Date.now()-start)/1000;entry.ok=true;report.runs.push(entry);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));return entry;
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding']});const report={version,nativeInput:true,noProfilePatches:true,runs:[],issues:[],pageErrors:[]};
 try{const context=await browser.newContext({viewport:{width,height:width<768?844:960},hasTouch:touch,serviceWorkers:'block'});const p=await context.newPage();p.on('pageerror',e=>report.pageErrors.push(e.message));const cdp=await context.newCDPSession(p);
  await p.goto(base+'index.html#guest');await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);await ack(p);assert.equal((await snap(p)).session.kind,'guest');assert.equal((await snap(p)).profile.totalRuns,0,'Fresh profile has no fabricated wins');
  for(const mode of modeList){await home(p);if(mode==='training'){await click(p,'[data-open-settings]:visible');await click(p,'[data-settings-command=training]');}else{await click(p,'.indie-bottom-nav [data-game-route=play]');await click(p,`[data-mode-start="${mode}"]`);}await ack(p);await play(p,mode,report,cdp);await context.storageState({path:path.join(out,'earned-state.json')});}
  assert.deepEqual(report.pageErrors,[]);report.ok=true;await context.storageState({path:path.join(out,'earned-state.json')});await cdp.detach();await context.close();
 }catch(error){report.ok=false;report.issues.push(error.stack);process.exitCode=1;console.error(error.stack);}finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('MODES RESULT',JSON.stringify({ok:report.ok,runs:report.runs.map(x=>({mode:x.mode,ok:x.ok,result:x.result,seconds:x.realTimeSeconds})),issues:report.issues}));await browser.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
