// Native account-form acceptance using current ESM sources and a controlled readiness promise.
// No game saves, provider APIs or production accounts are used.
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require('playwright');
const publicRoot=path.resolve(__dirname,'../notification-ninja');
const pageHTML=`<!doctype html><html><head><meta charset="utf-8"><style>body{font:16px sans-serif;margin:24px}.portal-account-scene{display:none}.account-field{display:block;margin:12px 0}.account-field input{display:block}button{min-height:44px;margin:4px}</style></head><body>
<button id="open-login">Login</button><button id="open-register">Register</button><button id="open-recovery">Recovery</button>
<script type="module">
import {createAccountUI} from '/src/account-ui.js';
import {AccountError,createAccounts} from '/src/accounts.js';
import {observeTranslations,setLanguage} from '/src/i18n.js';
setLanguage(new URL(location.href).searchParams.get('language')==='de'?'de':'en');observeTranslations(document);
let current=null;const calls=[],preparations=[],signedIn=[],statusListeners=new Set();let connectionStatus={configured:true,online:false};
const authenticate=method=>async input=>{calls.push({method});current={user:{id:'synthetic-user',username:input.username},token:'x'.repeat(43),profile:{coins:0,player:{username:input.username}},revision:1};return current;};
const fakeAccounts={getStatus:()=>({...connectionStatus}),subscribe:listener=>{statusListeners.add(listener);return()=>statusListeners.delete(listener);},getSession:()=>current,login:authenticate('login'),register:authenticate('register'),reset:authenticate('reset'),
 warmup:({signal})=>new Promise((resolve,reject)=>{let done=false;const finish=(value,error)=>{if(done)return;done=true;signal.removeEventListener('abort',abort);(error?reject:resolve)(value);};const abort=()=>finish(new AccountError('Die Verbindungsprüfung wurde abgebrochen.',{code:'REQUEST_CANCELLED'}),true);signal.addEventListener('abort',abort,{once:true});preparations.push({resolve:()=>finish({online:true},false),reject:()=>finish(new AccountError('Die Online-Verbindung ist noch nicht bereit. Dein Gastspiel bleibt verfügbar. Bitte versuche es erneut.',{retryable:true}),true)});})};
const delayedConfig=new URL(location.href).searchParams.has('delayed-config');
const accounts=delayedConfig?createAccounts({baseURL:location.href,configURL:'/accounts-config.json'}):fakeAccounts;
if(delayedConfig)void accounts.init();
const ui=createAccountUI({accounts,onSignedIn:value=>signedIn.push(value.user.id)});
for(const route of ['login','register','recovery'])document.querySelector('#open-'+route).onclick=()=>ui[route]();
window.accountWarmupFixture={ui,calls,preparations,signedIn,statusListenerCount:()=>statusListeners.size,setConnectionStatus:status=>{connectionStatus=status;for(const listener of statusListeners)listener(status);},switchSession:()=>current={user:{id:'different-user'},token:'y'.repeat(43)}};
</script></body></html>`;
async function fill(page,kind){
 await page.locator('[name=username]').fill('WarmupNinja');await page.locator('[name=password]').fill('Local-test-only-password');
 if(kind==='register'){await page.locator('[name=email]').fill('warmup@example.test');await page.locator('[name=passwordConfirmation]').fill('Local-test-only-password');await page.locator('[name=privacyAccepted]').check();await page.locator('[name=understood]').check();}
 if(kind==='recovery')await page.locator('[name=recoveryKey]').fill('NNR-'+'a'.repeat(43));
}
async function run(){
 const pendingConfig=[],configWaiters=[],networkMethods=[];
 const nextConfig=()=>pendingConfig.length?Promise.resolve(pendingConfig.shift()):new Promise((resolve,reject)=>{const deliver=value=>{clearTimeout(timer);resolve(value);};const timer=setTimeout(()=>{const index=configWaiters.indexOf(deliver);if(index>=0)configWaiters.splice(index,1);reject(new Error('The config request did not arrive'));},3000);configWaiters.push(deliver);});
 const server=http.createServer((request,response)=>{
  networkMethods.push(request.method);
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(request.method!=='GET'){response.writeHead(405);return response.end();}
  if(pathname==='/accounts-config.json'){if(configWaiters.length)configWaiters.shift()(response);else pendingConfig.push(response);return;}
  if(pathname==='/'){response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return response.end(pageHTML);}
  const file=path.resolve(publicRoot,'.'+pathname);if(!file.startsWith(publicRoot+path.sep)||!['.js','.png','.svg'].includes(path.extname(file))){response.writeHead(404);return response.end();}
  try{const bytes=fs.readFileSync(file);response.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'image/svg+xml'});response.end(bytes);}catch{response.writeHead(404);response.end();}
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const errors=[],report={kind:'Native current-source account forms, controlled read-only readiness; no production operations',cases:[],errors};
 try{
  browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  const open=async(kind,language='en')=>{const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));await page.goto(`http://127.0.0.1:${server.address().port}/?language=${language}`);await page.waitForFunction(()=>Boolean(window.accountWarmupFixture));await page.locator('#open-'+kind).click();await fill(page,kind);await page.locator('[data-account-form='+kind+'] button[type=submit]').click();await page.waitForFunction(()=>window.accountWarmupFixture.preparations.length===1);return page;};
  for(const kind of ['login','register','recovery']){
   const page=await open(kind);assert.equal(await page.locator('#account-working').innerText(),'Connecting to the online service …');assert.equal(await page.evaluate(()=>accountWarmupFixture.calls.length),0);
   assert.equal(await page.locator('[name=username]').inputValue(),'WarmupNinja');assert.equal(await page.locator('[name=password]').inputValue(),'Local-test-only-password');
   if(kind==='login'){
    await page.evaluate(()=>accountWarmupFixture.preparations[0].reject());await page.waitForFunction(()=>Boolean(document.querySelector('#account-error')?.textContent));assert.match(await page.locator('#account-error').innerText(),/Guest play stays available/);
    assert.equal(await page.locator('[name=username]').inputValue(),'WarmupNinja');assert.equal(await page.locator('[name=password]').inputValue(),'Local-test-only-password');assert.equal(await page.evaluate(()=>accountWarmupFixture.calls.length),0);
    await page.locator('[data-account-form=login] button[type=submit]').click();await page.waitForFunction(()=>accountWarmupFixture.preparations.length===2);
   }
   await page.evaluate(()=>accountWarmupFixture.preparations.at(-1).resolve());await page.waitForFunction(()=>accountWarmupFixture.signedIn.length===1);
   assert.deepEqual(await page.evaluate(()=>accountWarmupFixture.calls.map(value=>value.method)),[kind==='recovery'?'reset':kind]);report.cases.push({kind,ok:true,warmupBeforeMutation:true,oneExplicitMutation:true,valuesRetainedWhileConnecting:true,retryWasExplicit:kind==='login'});await page.close();
  }
  const cancel=await open('login','de');assert.equal(await cancel.locator('#account-working').innerText(),'Online-Verbindung wird hergestellt …');await cancel.locator('[data-account=close]').click();await cancel.evaluate(()=>accountWarmupFixture.preparations[0].resolve());await cancel.waitForTimeout(30);assert.equal(await cancel.evaluate(()=>accountWarmupFixture.calls.length),0);assert.equal(await cancel.locator('[data-account-form=login]').count(),0);report.cases.push({kind:'cancel-readiness',ok:true,noLateMutation:true});await cancel.close();
  const escaped=await open('login');await escaped.keyboard.press('Escape');await escaped.evaluate(()=>accountWarmupFixture.preparations[0].resolve());await escaped.waitForTimeout(30);assert.equal(await escaped.evaluate(()=>accountWarmupFixture.calls.length),0);assert.equal(await escaped.locator('[data-account-form=login]').count(),0);report.cases.push({kind:'escape-readiness',ok:true,noLateMutation:true});await escaped.close();
  const replaced=await open('login');await replaced.evaluate(()=>accountWarmupFixture.ui.register());await replaced.evaluate(()=>accountWarmupFixture.preparations[0].resolve());await replaced.waitForTimeout(30);assert.equal(await replaced.evaluate(()=>accountWarmupFixture.calls.length),0);assert.equal(await replaced.locator('[data-account-form=register]').count(),1);report.cases.push({kind:'replace-form',ok:true,noLateMutation:true});await replaced.close();
  const switched=await open('login');await switched.evaluate(()=>{accountWarmupFixture.switchSession();accountWarmupFixture.preparations[0].resolve();});await switched.waitForFunction(()=>Boolean(document.querySelector('#account-error')?.textContent));assert.equal(await switched.evaluate(()=>accountWarmupFixture.calls.length),0);assert.equal(await switched.locator('[name=username]').inputValue(),'WarmupNinja');report.cases.push({kind:'session-changed-during-readiness',ok:true,noMutationUnderNewSession:true});await switched.close();
  const delayed=await browser.newPage();delayed.on('pageerror',error=>errors.push(error.message));await delayed.goto(`http://127.0.0.1:${server.address().port}/?language=en&delayed-config=1`);await delayed.waitForFunction(()=>Boolean(window.accountWarmupFixture));await delayed.locator('#open-login').click();
  assert.equal(await delayed.locator('[data-account-service-status] strong').innerText(),'Connecting to the online service …');assert.equal(await delayed.locator('[data-account-service-status] [data-account=retry]').count(),0);
  await fill(delayed,'login');await delayed.locator('[name=password]').focus();await delayed.evaluate(()=>{window.originalPasswordField=document.querySelector('[name=password]');window.originalAuthForm=document.querySelector('[data-account-form=login]');});
  (await nextConfig()).writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({enabled:true,endpoint:'/api/v3'}));await delayed.waitForFunction(()=>!document.querySelector('[data-account-service-status] aside'));
  assert.equal(await delayed.locator('[name=username]').inputValue(),'WarmupNinja');assert.equal(await delayed.locator('[name=password]').inputValue(),'Local-test-only-password');assert.equal(await delayed.evaluate(()=>document.activeElement===window.originalPasswordField&&document.querySelector('[data-account-form=login]')===window.originalAuthForm),true);assert(!networkMethods.includes('POST'));report.cases.push({kind:'delayed-real-static-config',ok:true,initialConnecting:true,noteRemovedWithoutFormReset:true,inputValuesAndFocusPreserved:true,noMutation:true});await delayed.close();
  const retryConfig=await browser.newPage();await retryConfig.goto(`http://127.0.0.1:${server.address().port}/?language=en&delayed-config=1`);await retryConfig.waitForFunction(()=>Boolean(window.accountWarmupFixture));await retryConfig.locator('#open-register').click();await fill(retryConfig,'register');await retryConfig.evaluate(()=>window.originalRegistration=document.querySelector('[data-account-form=register]'));
  (await nextConfig()).writeHead(503,{'Content-Type':'text/html'}).end('<html>Temporary static config error</html>');await retryConfig.locator('[data-account-service-status] [data-account=retry]').waitFor();assert.match(await retryConfig.locator('[data-account-service-status]').innerText(),/Guest play stays available/);
  await retryConfig.locator('[data-account-service-status] [data-account=retry]').click();(await nextConfig()).writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({enabled:true,endpoint:'/api/v3'}));await retryConfig.waitForFunction(()=>!document.querySelector('[data-account-service-status] aside')&&!document.querySelector('[name=username]').disabled);
  assert.equal(await retryConfig.locator('[name=username]').inputValue(),'WarmupNinja');assert.equal(await retryConfig.locator('[name=email]').inputValue(),'warmup@example.test');assert.equal(await retryConfig.locator('[name=password]').inputValue(),'Local-test-only-password');assert.equal(await retryConfig.locator('[name=privacyAccepted]').isChecked(),true);assert.equal(await retryConfig.locator('[name=understood]').isChecked(),true);assert.equal(await retryConfig.evaluate(()=>document.querySelector('[data-account-form=register]')===window.originalRegistration),true);assert.equal(await retryConfig.evaluate(()=>document.activeElement?.tagName),'INPUT');assert(!networkMethods.includes('POST'));report.cases.push({kind:'explicit-config-retry',ok:true,registrationFieldsAndConsentPreserved:true,sameFormAndUsableFocus:true,noMutation:true});await retryConfig.close();
  const disposal=await browser.newPage();await disposal.goto(`http://127.0.0.1:${server.address().port}/`);await disposal.waitForFunction(()=>Boolean(window.accountWarmupFixture));assert.equal(await disposal.evaluate(()=>accountWarmupFixture.statusListenerCount()),1);await disposal.evaluate(()=>accountWarmupFixture.ui.destroy());assert.equal(await disposal.evaluate(()=>accountWarmupFixture.statusListenerCount()),0);report.cases.push({kind:'destroy-unsubscribes-connection-status',ok:true});await disposal.close();
  assert.deepEqual(errors,[]);report.ok=true;
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'/tmp/ninja-account-warmup-browser');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');}
 console.log(JSON.stringify(report,null,2));
}
run().catch(error=>{console.error(error.stack);process.exitCode=1;});
