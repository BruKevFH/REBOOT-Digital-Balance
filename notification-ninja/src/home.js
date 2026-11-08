import {tr,getLanguage,setLanguage,observeTranslations,localizeDOM,onLanguageChange} from './i18n.js';
import {getPreferences} from './preferences.js';
import {applyTheme,cycleTheme} from './display-theme.js';
import {createAccounts} from './accounts.js';

const DESCRIPTION='Notification Ninja: kurze Spielrunden über Lernen, Gaming und Schlaf. Erkenne Ablenkungen, entscheide bewusst und finde deinen Fokus. Kostenlos auf Deutsch und Englisch.';
const TITLE='Notification Ninja';

function refreshLanguage(){
  const language=getLanguage();
  document.documentElement.lang=language;
  document.title=tr(TITLE);
  document.querySelector('meta[name="description"]')?.setAttribute('content',tr(DESCRIPTION));
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
if(location.protocol.startsWith('http')&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

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
    await client.init();
    const session=client.getSession();
    if(!session?.token)return;
    const state=await client.restore();
    if(!state?.user?.id)return;
    const access=document.querySelector('.access-choices');
    if(!access)return;
    const entry=document.createElement('a');
    entry.href='./index.html#worlds';entry.className='button large';entry.textContent='Zum persönlichen Dojo →';
    const logout=document.createElement('button');
    logout.type='button';logout.className='button secondary';logout.textContent='Abmelden';
    const note=document.createElement('p');note.className='home-auth-state';note.setAttribute('role','status');
    note.textContent='✓ Du bist bereits angemeldet. Willkommen zurück!';
    access.replaceChildren(entry,logout,note);
    for(const link of document.querySelectorAll('a[href="./index.html#login"],a[href="./index.html#register"],a[href="./index.html#guest"]')){
      if(access.contains(link))continue;
      link.href='./index.html#worlds';link.textContent='Zum persönlichen Dojo';
    }
    logout.addEventListener('click',async()=>{
      logout.disabled=true;
      try{await client.logout();note.textContent='✓ Abgemeldet.';setTimeout(()=>location.reload(),700);}
      catch{logout.disabled=false;note.textContent='Abmeldung fehlgeschlagen. Bitte versuche es erneut.';}
    });
  }catch{/* No verified session: leave normal login/register/guest controls. */}
}
void revealSignedInLanding();
