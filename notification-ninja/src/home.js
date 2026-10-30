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
if(location.protocol.startsWith('http')&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
