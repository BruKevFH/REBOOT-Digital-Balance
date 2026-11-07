import {tr,getLanguage,setLanguage,observeTranslations,localizeDOM,onLanguageChange} from './i18n.js';
import {getPreferences} from './preferences.js';

const DESCRIPTION='Notification Ninja: kurze Spielrunden über Lernen, Gaming und Schlaf. Erkenne Ablenkungen, entscheide bewusst und finde deinen Fokus. Kostenlos auf Deutsch und Englisch.';
const TITLE='Notification Ninja';

function refreshLanguage(){
  const language=getLanguage();
  document.documentElement.lang=language;
  document.title=tr(TITLE);
  document.querySelector('meta[name="description"]')?.setAttribute('content',tr(DESCRIPTION));
  for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
  document.body.dataset.calm=String(getPreferences().calmEffects===true);
  localizeDOM(document.body);
}

observeTranslations(document.body);
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
