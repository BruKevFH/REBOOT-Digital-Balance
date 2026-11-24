// Native account Open Runs. No score/state grants and no manual publish action.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {randomBytes}=require('node:crypto');
const base=new URL(process.env.NINJA_BASE_URL||'http://127.0.0.1:8203/notification-ninja/');
assert(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Isolated local service required');
const output=process.env.NINJA_TEST_OUTPUT||'test-results/ninja-auto-ranking';
fs.mkdirSync(output,{recursive:true});
const version=JSON.parse(fs.readFileSync(path.join(__dirname,'../notification-ninja/dist/build.json'))).version;
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
async function ack(p){if((await snap(p)).experience.intro?.active)await p.locator('[data-intro-action=skip]').click();for(let i=0;i<30&&(await snap(p)).mentor.open;i++)await p.locator('#mentor-next').click();}
async function request(route,{token,method='GET',body,status=200}={}){
 const r=await fetch(base.origin+'/api/v3'+route,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 assert.equal(r.status,status,method+' '+route);return status===204?null:r.json();
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']}),report={version,kind:'Two native account runs; automatic publication only; no fabricated progression',accounts:[],issues:[]};
 try{for(const [width,language]of [[360,'de'],[1280,'en']]){
  const username='qaauto'+randomBytes(4).toString('hex'),password='Qa!'+randomBytes(24).toString('base64url');let token,context;
  const entry={width,language,errors:[],manualPublishClicks:0};
  try{
   const created=await request('/auth/register',{method:'POST',status:201,body:{username,email:username+'@example.invalid',password,passwordConfirmation:password,privacyAccepted:true}});token=created.token;
   context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:960},hasTouch:width<768});const p=await context.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>entry.errors.push(e.message));
   await p.goto(new URL('index.html#login',base).href);await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);
   await p.locator('[name=username]').fill(username);await p.locator('[name=password]').fill(password);await p.locator('[data-account-form=login] button[type=submit]').click();await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().session.kind==='account');await ack(p);
   await p.locator('[data-language='+language+']:visible').first().click();await p.locator('.indie-bottom-nav [data-game-route=play]').click();await ack(p);await p.locator('[data-mode-start=open]:visible').click();await ack(p);
   assert.match(await p.locator('.open-ranking-note').innerText(),language==='en'?/automatically ranked/:/automatisch/);
   await p.locator('[data-action=next]').click();await ack(p);let attempts=0;const started=Date.now(),deadline=started+110000;
   while(Date.now()<deadline){
    await ack(p);const s=(await snap(p)).state;if(s.ended)break;
    if(s.metrics.cuts<3){const b=await p.locator('#world').boundingBox(),o=s.objects.find(o=>o.kind==='distraction'&&(!o.launch||o.age>=o.launch.windup+o.launch.arc)&&o.x>o.radius+4&&o.x<b.width-o.radius-4&&o.y>o.radius+15&&o.y<b.height-o.radius-10&&!s.objects.some(v=>v.id!==o.id&&v.kind!=='distraction'&&Math.hypot(v.x-o.x,v.y-o.y)<v.radius+o.radius+24));
     if(o){attempts++;await p.mouse.move(b.x+o.x-12,b.y+o.y);await p.mouse.down();await p.mouse.move(b.x+o.x+12,b.y+o.y,{steps:2});await p.mouse.up();}}
    await p.waitForTimeout(35);
   }
   const ended=await snap(p);assert.equal(ended.state.result,'lives');assert(ended.state.metrics.cuts>=3,'Actual pointer cuts earn the score');
   await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().lastVerified?.published===true,null,{timeout:25000});await ack(p);
   const verified=await snap(p);assert.equal(verified.lastVerified.verified,true);assert(verified.lastVerified.score>0);
   const board=await request('/leaderboard?period=all&limit=100',{token});const own=board.entries.find(x=>x.username===username);assert(own,'The new native result is automatically public');assert.equal(own.score,verified.lastVerified.score);
   assert.deepEqual(verified.translation.missing,[]);assert.deepEqual(entry.errors,[]);
   await p.screenshot({path:path.join(output,'native-auto-ranked-'+width+'.png'),fullPage:true});
   await p.reload();await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__?.getSnapshot().session.kind==='account');await ack(p);const persisted=await request('/leaderboard?period=all&limit=100',{token});assert(persisted.entries.some(x=>x.username===username&&x.score===own.score));
   Object.assign(entry,{ok:true,attempts,actualCuts:verified.state.metrics.cuts,score:own.score,elapsed:verified.state.elapsed,wallSeconds:(Date.now()-started)/1000,persistedAfterReload:true});
  }catch(error){entry.ok=false;entry.error=error.message;report.issues.push({width,error:error.message});}
  finally{await context?.close();if(token){await request('/account',{method:'DELETE',token,body:{password}});const board=await request('/leaderboard?limit=100');assert(!board.entries.some(x=>x.username===username));entry.deleted=true;}report.accounts.push(entry);fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log('AUTO_RANKING_NATIVE',width,entry.ok);}
 }}finally{await browser.close();}
 assert.deepEqual(report.issues,[]);console.log(JSON.stringify({version,accounts:report.accounts,issues:report.issues},null,2));
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
