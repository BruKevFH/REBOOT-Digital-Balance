// Standalone browser check: node tests/ninja-i18n-browser.cjs
// Serves current ESM sources on an ephemeral loopback port; no build or account service is needed.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),sourceRoot=path.join(root,'notification-ninja/src');
const helpSource=fs.readFileSync(path.join(sourceRoot,'main.js'),'utf8').split('function help(){')[1];
const bazaarHelp=helpSource.match(/<div class="insight-card">([^<]+)<\/div>/)?.[1];
const nextRoundHelp=helpSource.match(/<kbd>M<\/kbd> ([^<]+)<\/p>/)?.[1];
assert(bazaarHelp&&nextRoundHelp,'The actual help copy must be present');
const html=`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Language component acceptance</title></head><body>
<button id="english" translate="no">English</button><button id="german" translate="no">Deutsch</button>
<p id="bonus">✦ Zusatzmissionen · 0 / 5</p><p id="world">WELT 01 · Tal des Fokus</p><p id="mixed-world">WELT 02 · Valley of Focus</p>
<p id="save-status">Konto · bestätigter Fortschritt</p>
<label for="mfa">MFA-Code</label><input id="mfa" placeholder="6 Ziffern oder Wiederherstellungscode" aria-description="Authenticator-Code ungültig.">
<strong id="backup-warning">Diese zehn Codes werden nur einmal angezeigt.</strong>
<p id="backup-advice">Bewahre sie getrennt vom Passwort an einem sicheren Ort auf. Jeder Code funktioniert nur einmal.</p>
<label id="backup-consent">Ich habe die Codes sicher und privat gespeichert.</label>
<p id="bazaar-help">${bazaarHelp}</p><p id="round-help"><kbd>M</kbd> ${nextRoundHelp}</p>
<span id="player" data-user-text>WELT 01 · Ninjälino</span><input id="player-input" value="WELT 01 · Ninjälino">
<textarea id="private-literal" translate="no">synthetic-code-only</textarea><div id="dynamic"></div>
<script type="module">
import {setLanguage,observeTranslations,getMissingTranslations} from '/src/i18n.js';
const untouched=JSON.stringify({coins:37,unlockedSkills:['focus-root']});
localStorage.setItem('notification-ninja:save:v1',untouched);
observeTranslations(document);
document.querySelector('#english').onclick=()=>setLanguage('en');
document.querySelector('#german').onclick=()=>setLanguage('de');
window.languageAcceptance={setLanguage,getMissingTranslations,untouched};
</script></body></html>`;

async function run(){
 const server=http.createServer((request,response)=>{
  if(request.method!=='GET'){response.writeHead(405);return response.end();}
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(pathname==='/'){response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return response.end(html);}
  const file=path.resolve(sourceRoot,pathname.slice('/src/'.length));
  if(!pathname.startsWith('/src/')||!file.startsWith(sourceRoot+path.sep)||!file.endsWith('.js')){response.writeHead(404);return response.end();}
  try{response.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8'});response.end(fs.readFileSync(file));}catch{response.writeHead(404);response.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 const errors=[],report={kind:'Current-source native DOM translation acceptance; isolated loopback only',checks:[],errors};
 try{
  browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:844,height:390}});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(()=>Boolean(window.languageAcceptance));
  await page.locator('#english').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.locator('#bonus').innerText(),'✦ Bonus missions · 0 / 5');
  assert.equal(await page.locator('#world').innerText(),'WORLD 01 · Valley of Focus');
  assert.equal(await page.locator('#mixed-world').innerText(),'WORLD 02 · Valley of Focus');
  assert.equal(await page.locator('#save-status').innerText(),'Account · verified progress');
  assert.equal(await page.locator('#mfa').getAttribute('placeholder'),'6 digits or recovery code');
  assert.equal(await page.locator('#mfa').getAttribute('aria-description'),'Invalid authenticator code.');
  assert.equal(await page.locator('#backup-warning').innerText(),'These ten codes are shown only once.');
  assert.match(await page.locator('#backup-advice').innerText(),/separate from your password/);
  assert.equal(await page.locator('#backup-consent').innerText(),'I have saved the codes somewhere safe and private.');
  assert.match(await page.locator('#bazaar-help').innerText(),/game worlds, ninja looks and abilities/);
  assert.match(await page.locator('#round-help').innerText(),/ninja looks apply from the next new round/);
  assert.deepEqual(await page.evaluate(()=>window.languageAcceptance.getMissingTranslations()),[]);
  report.checks.push('career_counter_and_mixed_chapter_labels','mfa_placeholder_aria_and_backup_instructions','actual_help_offers_and_next_round_copy');

  await page.evaluate(()=>{document.querySelector('#dynamic').innerHTML='<span id="later">✦ Zusatzmissionen · 4 / 5</span><input id="later-mfa" placeholder="6 Ziffern oder Wiederherstellungscode">';});
  await page.waitForFunction(()=>document.querySelector('#later')?.textContent==='✦ Bonus missions · 4 / 5');
  assert.equal(await page.locator('#later-mfa').getAttribute('placeholder'),'6 digits or recovery code');
  await page.locator('#german').click();
  assert.equal(await page.locator('#bonus').innerText(),'✦ Zusatzmissionen · 0 / 5');
  assert.equal(await page.locator('#world').innerText(),'WELT 01 · Tal des Fokus');
  assert.equal(await page.locator('#mfa').getAttribute('placeholder'),'6 Ziffern oder Wiederherstellungscode');
  assert.equal(await page.locator('#mfa').getAttribute('aria-description'),'Authenticator-Code ungültig.');
  assert.equal(await page.locator('#backup-consent').innerText(),'Ich habe die Codes sicher und privat gespeichert.');
  assert.equal(await page.locator('#later').innerText(),'✦ Zusatzmissionen · 4 / 5');
  await page.locator('#english').click();
  assert.equal(await page.locator('#later').innerText(),'✦ Bonus missions · 4 / 5');
  report.checks.push('dynamic_nodes_and_attributes_observed','english_german_english_switch_reversible');

  await page.evaluate(()=>{document.querySelector('#save-status').textContent='Konto · Run wird am Ende geprüft';});
  await page.waitForFunction(()=>document.querySelector('#save-status')?.textContent==='Account · run verification at the end');
  assert.deepEqual(await page.evaluate(()=>window.languageAcceptance.getMissingTranslations()),[]);
  await page.locator('#german').click();
  assert.equal(await page.locator('#save-status').innerText(),'Konto · Run wird am Ende geprüft');
  await page.locator('#english').click();
  assert.equal(await page.locator('#save-status').innerText(),'Account · run verification at the end');
  report.checks.push('confirmed_and_pending_account_save_status_reversible');

  await page.evaluate(()=>{document.querySelector('#dynamic').textContent='Münzen · Weitere Zusatzmissionen sind noch nicht bereit.';});
  await page.waitForFunction(()=>window.languageAcceptance.getMissingTranslations().includes('Weitere Zusatzmissionen sind noch nicht bereit.'));
  assert.equal(await page.locator('#dynamic').innerText(),'Coins · Weitere Zusatzmissionen sind noch nicht bereit.');
  assert.equal(await page.locator('#player').innerText(),'WELT 01 · Ninjälino');
  assert.equal(await page.locator('#player-input').inputValue(),'WELT 01 · Ninjälino');
  assert.equal(await page.locator('#private-literal').inputValue(),'synthetic-code-only');
  assert.equal(await page.evaluate(()=>localStorage.getItem('notification-ninja:save:v1')),await page.evaluate(()=>window.languageAcceptance.untouched));
  report.checks.push('mixed_label_missing_part_reported','user_names_codes_and_game_save_untouched');
  assert.deepEqual(errors,[]);report.ok=true;
 }finally{
  await browser?.close();await new Promise(resolve=>server.close(resolve));
  const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'/tmp/ninja-i18n-browser');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
 }
 console.log(JSON.stringify(report,null,2));
}
run().catch(error=>{console.error(error.stack);process.exitCode=1;});
