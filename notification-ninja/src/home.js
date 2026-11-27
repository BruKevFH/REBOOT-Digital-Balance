import {canonicalGameURL,getSiteLocation} from './site-location.js';
import {createGuestTransferSender} from './guest-transfer.js';
import {STORAGE_KEY} from './game.js';
import {tr,getLanguage,setLanguage,observeTranslations,localizeDOM,onLanguageChange} from './i18n.js';
import {getPreferences} from './preferences.js';
import {applyTheme,cycleTheme} from './display-theme.js';
import {createAccounts} from './accounts.js';

const DESCRIPTION='Notification Ninja: kurze Spielrunden über Lernen, Gaming und Schlaf. Erkenne Ablenkungen, entscheide bewusst und finde deinen Fokus. Kostenlos auf Deutsch und Englisch.';
const TITLE='Notification Ninja';

function refreshLanguage(){
  const language=getLanguage();
  document.documentElement.lang=language;
  const title=document.querySelector('title');
  document.title=title?.dataset?.[language==='en'?'ninjaTitleEn':'ninjaTitleDe']||tr(TITLE);
  const description=document.querySelector('meta[name=description]');
  const copy=description?.dataset?.[language==='en'?'ninjaDescriptionEn':'ninjaDescriptionDe']||tr(DESCRIPTION);
  description?.setAttribute('content',copy);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy);
  for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
  document.body.dataset.calm=String(getPreferences().calmEffects===true);
  applyTheme();
  localizeDOM(document.body);
}

observeTranslations(document.body);
document.addEventListener('click',event=>{if(event.target.closest('[data-theme-cycle]'))cycleTheme();});
for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',()=>setLanguage(button.dataset.language));
onLanguageChange(refreshLanguage);
refreshLanguage();

// Keep the homepage section indicator accurate without changing game routes.
const sectionLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
function markSection(id){for(const link of sectionLinks){if(link.hash===`#${id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}
for(const link of sectionLinks)link.addEventListener('click',()=>markSection(link.hash.slice(1)));
markSection(location.hash.slice(1)||'start');
if('IntersectionObserver' in window){const sections=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)markSection(visible.target.id);},{rootMargin:'-8% 0px -55% 0px',threshold:[0,.1,.5]});for(const link of sectionLinks){const section=document.getElementById(link.hash.slice(1));if(section)sections.observe(section);}}
if(location.protocol.startsWith('http')&&'serviceWorker' in navigator){
 const controlled=Boolean(navigator.serviceWorker.controller);
 let refreshed=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(controlled&&!refreshed){refreshed=true;location.reload();}
 });
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>registration.update()).catch(()=>{});
}

// A privacy link from registration opens the actual policy, including on reload.
function openPrivacy(){if(location.hash==='#projekt'){const details=document.getElementById('privacy-details');if(details)details.open=true;}}
openPrivacy();window.addEventListener('hashchange',openPrivacy);


/* The informational page never trusts sessionStorage alone. Only a validated
   /me response changes the guest/login controls to an authenticated overview. */
async function revealSignedInLanding(){
  let storage;try{storage=window.sessionStorage;}catch{return;}
  if(!storage)return;
  const client=createAccounts({sessionStorage:storage,baseURL:location.href});
  try{
    const session=client.getSession();
    if(!session?.token)return;
    await client.init();
    const connection=await client.warmup();
    if(!connection.online)return;
    const state=await client.restore();
    if(!state?.user?.id)return;
    const access=document.querySelector('.access-choices');
    if(!access)return;
    const entry=document.createElement('a');
    entry.href=getSiteLocation().gameURL;entry.className='button large';entry.textContent='Zum persönlichen Dojo →';
    const logout=document.createElement('button');
    logout.type='button';logout.className='button secondary';logout.textContent='Abmelden';
    const note=document.createElement('p');note.className='home-auth-state';note.setAttribute('role','status');
    note.textContent='✓ Du bist bereits angemeldet. Willkommen zurück!';
    access.replaceChildren(entry,logout,note);
    for(const link of document.querySelectorAll('a[href$="#login"],a[href$="#register"],a[href$="#guest"]')){
      if(access.contains(link))continue;
      link.href=homeGameURL('overview');link.textContent='Zum persönlichen Dojo';
    }
    logout.addEventListener('click',async()=>{
      logout.disabled=true;
      try{await client.logout();note.textContent='✓ Abgemeldet.';setTimeout(()=>location.reload(),700);}
      catch{logout.disabled=false;note.textContent='Abmeldung fehlgeschlagen. Bitte versuche es erneut.';}
    });
  }catch{/* No verified session: leave normal login/register/guest controls. */}
}
void revealSignedInLanding();

function homeGameURL(route){const site=getSiteLocation();if(site.isLegacy)return canonicalGameURL(route);const url=new URL(site.gameURL);url.hash=route;return url.href;}
function savedGuestProfile(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw||raw.length>128*1024)return null;return JSON.parse(raw)?.profile||null;}catch{return null;}}
for(const link of document.querySelectorAll('a[href^="./index.html#"]')){const route=new URL(link.href).hash.slice(1);link.href=homeGameURL(route);}
let migrationSender=null;
function homeTransferStatus(state){let host=document.getElementById('home-transfer');if(!host){host=document.createElement('aside');host.id='home-transfer';host.className='guest-transfer-note';document.body.append(host);}const en=getLanguage()==='en',copy={'awaiting-accept':en?'Confirm the transfer in the new dojo window.':'Bestätige die Übernahme im neuen Dojo-Fenster.',waiting:en?'Confirm the transfer in the new dojo window.':'Bestätige die Übernahme im neuen Dojo-Fenster.',complete:en?'Your guest profile has arrived. The original is kept.':'Dein Gastspielstand ist angekommen. Das Original bleibt erhalten.','popup-blocked':en?'Allow the new window and try again.':'Erlaube das neue Fenster und versuche es erneut.',expired:en?'The transfer expired. Try again.':'Die Übernahme ist abgelaufen. Versuche es erneut.'};host.innerHTML=`<div role="dialog" aria-modal="true"><h2>${en?'Your ninja is moving':'Dein Ninja zieht um'}</h2><p>${copy[state.status]||(en?'The transfer could not be completed. Your original profile is kept.':'Die Übernahme konnte nicht abgeschlossen werden. Dein ursprünglicher Spielstand bleibt erhalten.')}</p><button type="button" class="button secondary" data-home-transfer-close>${en?'Close':'Schließen'}</button></div>`;}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-home-transfer-close]')){migrationSender?.destroy();document.getElementById('home-transfer')?.remove();return;}
 if(event.target.closest('[data-home-transfer-start]')){migrationSender=createGuestTransferSender({getProfile:savedGuestProfile,onStatus:homeTransferStatus});migrationSender.start();return;}
 const link=event.target.closest('a[href]'),site=getSiteLocation();if(!link||!site.isLegacy||link.hasAttribute('data-home-transfer-without'))return;const url=new URL(link.href);if(url.origin!==site.canonicalOrigin||!['#guest','#overview'].includes(url.hash))return;
 const profile=savedGuestProfile();if(!profile||!(profile.totalRuns>0||profile.coins>0||profile.player?.username&&!profile.player?.guest))return;
 event.preventDefault();const en=getLanguage()==='en',host=document.createElement('aside');document.getElementById('home-transfer')?.remove();host.id='home-transfer';host.className='guest-transfer-note';host.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="home-transfer-title"><h2 id="home-transfer-title">${en?'Bring your guest profile':'Nimm deinen Gastspielstand mit'}</h2><p>${en?'The new game address has its own local storage. You can bring your guest ninja with you; the original stays here. Account progress is saved on the server and remains available after signing in.':'Die neue Spieladresse hat einen eigenen lokalen Speicher. Du kannst deinen Gast-Ninja mitnehmen; das Original bleibt hier. Kontofortschritt bleibt auf dem Server gespeichert und ist nach dem Anmelden verfügbar.'}</p><button type="button" class="button" data-home-transfer-start>${en?'Bring my ninja':'Meinen Ninja mitnehmen'}</button><a class="button secondary" href="${url.href}" data-home-transfer-without>${en?'Continue without importing':'Ohne Übernahme fortfahren'}</a><button type="button" class="button secondary" data-home-transfer-close>${en?'Stay here':'Hier bleiben'}</button></div>`;document.body.append(host);host.querySelector('button')?.focus();
},true);
