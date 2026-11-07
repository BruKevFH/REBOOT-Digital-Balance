import {EN_PORTAL,PORTAL_PATTERNS} from './locales/en-portal.js';
import {getPreferences,updatePreferences,onPreferencesChange} from './preferences.js';
import {EN_UI,UI_PATTERNS} from './locales/en-ui.js';
import {EN_GAME,GAME_PATTERNS} from './locales/en-game.js';
import {EN_PDF,PDF_PATTERNS} from './locales/en-pdf.js';
import {EN_HOME,HOME_PATTERNS} from './locales/en-home.js';
import {EN_ACCOUNTS,ACCOUNT_PATTERNS} from './locales/en-accounts.js';
import {EN_SETTINGS,SETTINGS_PATTERNS} from './locales/en-settings.js';
import {EN_CAMPAIGN,CAMPAIGN_PATTERNS} from './locales/en-campaign.js';
import {EN_LEGEND,LEGEND_PATTERNS} from './locales/en-legend.js';
import {EN_REFLECTION} from './locales/en-reflection.js';

const normalize=text=>String(text).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/gu,' ').trim();
const dictionary=new Map(Object.entries({...EN_GAME,...EN_UI,...EN_PORTAL,...EN_HOME,...EN_PDF,...EN_ACCOUNTS,...EN_SETTINGS,...EN_CAMPAIGN,...EN_LEGEND,...EN_REFLECTION}).map(([de,en])=>[normalize(de),en]));
const patterns=[...PORTAL_PATTERNS,...LEGEND_PATTERNS,...CAMPAIGN_PATTERNS,...ACCOUNT_PATTERNS,...SETTINGS_PATTERNS,...PDF_PATTERNS,...UI_PATTERNS,...GAME_PATTERNS,...HOME_PATTERNS];
const missing=new Set(),cache=new Map(),roots=new Set(),subscribers=new Set();
const textSources=new WeakMap(),attributeSources=new WeakMap();
const ignored='script,style,noscript,code,pre,textarea,[data-user-text],[translate="no"],.profile-name,#player-name-label,#landing-player-name,.rank-player';
const attributes=['title','aria-label','aria-description','placeholder','alt'];
let language=getPreferences().language;
export const getLanguage=()=>language;
export const getLocale=()=>language==='en'?'en-GB':'de-DE';

function translatedCore(text){
  const key=normalize(text);
  if(dictionary.has(key))return dictionary.get(key);
  if(cache.has(key))return cache.get(key);
  let output=key;
  for(const [regex,replacement,kind]of patterns){
    regex.lastIndex=0;
    if(!regex.test(key))continue;
    regex.lastIndex=0;
    output=kind==='authored'&&typeof replacement==='string'
      ?key.replace(regex,(match,...args)=>replacement.replace(/\$(\d+)/g,(_,index)=>{const value=args[Number(index)-1]??'';return dictionary.get(normalize(value))??String(value).split(' · ').map(part=>dictionary.get(normalize(part))??part).join(' · ');} ))
      :key.replace(regex,replacement);
    break;
  }
  if(output===key){
    if(key.includes(' · '))output=key.split(' · ').map(part=>dictionary.get(part)??translatedPart(part)).join(' · ');
    else output=translatedPart(key);
  }
  if(cache.size>4096)cache.clear();cache.set(key,output);
  if(output===key&&/[äöüß]|\b(?:Dein|Deine|dein|deine|Münzen|Punkte|Schalte|Runde|Erfolg|Beenden|Zurück|abholen|freigeschaltet|Lernen|Schlafen)\b/u.test(key)&&missing.size<1500)missing.add(key);
  return output;
}
function translatedPart(key){
  const months={'Januar':'January','Februar':'February','März':'March','April':'April','Mai':'May','Juni':'June','Juli':'July','August':'August','September':'September','Oktober':'October','November':'November','Dezember':'December'};
  const date=key.match(/^(\d{1,2})\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)(.*)$/u);
  if(date)return `${date[1]} ${months[date[2]]}${date[3]}`;
  const numeric=key.match(/^([+−-]?\d+(?:[.,]\d+)?)\s*(Münzen|Münze|Punkte|Herzen|Sekunden|Minuten|Runden|Aufgaben|Kräfte|Räume|Erfolge)([!?.:]?)$/u);
  if(numeric){const units={'Münzen':'coins','Münze':'coin','Punkte':'points','Herzen':'hearts','Sekunden':'seconds','Minuten':'minutes','Runden':'rounds','Aufgaben':'tasks','Kräfte':'abilities','Räume':'rooms','Erfolge':'achievements'};return `${numeric[1]} ${units[numeric[2]]}${numeric[3]}`;}
  return key;
}
/** Translates authored presentation only. IDs, saves and usernames stay intact. */
export function tr(value){
  const text=String(value??'');if(language!=='en'||!text.trim())return text;
  const leading=text.match(/^\s*/u)[0],trailing=text.match(/\s*$/u)[0];
  return leading+translatedCore(text)+trailing;
}
function updateText(node){
  if(!node.parentElement||node.parentElement.closest(ignored))return;
  const current=node.nodeValue;if(!current?.trim())return;
  let item=textSources.get(node);
  if(!item||current!==item.rendered)item={source:current,rendered:current};
  const rendered=tr(item.source);if(rendered!==current)node.nodeValue=rendered;
  item.rendered=rendered;textSources.set(node,item);
}
function updateAttributes(element){
  if(element.closest?.(ignored))return;
  let records=attributeSources.get(element);if(!records){records=new Map();attributeSources.set(element,records);}
  for(const name of attributes){
    const current=element.getAttribute(name);if(current===null)continue;
    let item=records.get(name);if(!item||current!==item.rendered)item={source:current,rendered:current};
    const rendered=tr(item.source);if(rendered!==current)element.setAttribute(name,rendered);
    item.rendered=rendered;records.set(name,item);
  }
  if(element.tagName==='META'&&element.name==='description'){
    const current=element.content;let item=records.get('content');if(!item||current!==item.rendered)item={source:current,rendered:current};
    element.content=tr(item.source);item.rendered=element.content;records.set('content',item);
  }
}
export function localizeDOM(root=globalThis.document){
  if(!root)return;
  const document=root.ownerDocument||root;
  if(document.documentElement)document.documentElement.lang=language;
  if(root.nodeType===3){updateText(root);return;}
  if(root.nodeType===1){if(root.closest?.(ignored))return;updateAttributes(root);}
  for(const element of root.querySelectorAll?.('[title],[aria-label],[aria-description],[placeholder],[alt],meta[name="description"]')||[])updateAttributes(element);
  if(!document.createTreeWalker)return;
  const walker=document.createTreeWalker(root,4);let node;
  while((node=walker.nextNode()))updateText(node);
}
export function observeTranslations(root=globalThis.document){
  if(!root||typeof MutationObserver==='undefined')return()=>{};
  localizeDOM(root);const pending=new Set();let queued=false;
  const observer=new MutationObserver(records=>{
    for(const record of records){
      if(record.type==='childList'){for(const added of record.addedNodes)pending.add(added);}
      else pending.add(record.target);
    }
    if(queued||!pending.size)return;queued=true;
    queueMicrotask(()=>{queued=false;for(const node of pending){if(node.isConnected)localizeDOM(node);}pending.clear();});
  });
  observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  const registration={root,observer};roots.add(registration);
  return()=>{observer.disconnect();roots.delete(registration);};
}
function changeLanguage(next){
  if(next===language)return;language=next;cache.clear();missing.clear();
  for(const {root}of roots)localizeDOM(root);
  if(typeof document!=='undefined')document.documentElement.lang=language;
  for(const subscriber of subscribers)subscriber(language);
}
export function setLanguage(next){if(next!=='de'&&next!=='en')return false;changeLanguage(next);updatePreferences({language:next});return true;}
export function onLanguageChange(listener){subscribers.add(listener);return()=>subscribers.delete(listener);}
export function getMissingTranslations(){return [...missing];}
export function getTranslationCoverage(){return {language,entries:dictionary.size,patterns:patterns.length,missing:missing.size};}
onPreferencesChange(preferences=>changeLanguage(preferences.language));
