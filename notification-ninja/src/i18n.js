import {EN_EXPANSION} from './locales/en-expansion.js';
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
import {EN_ARCADE} from './locales/en-arcade.js';
import {EN_V2} from './locales/en-v2.js';

const normalize=text=>String(text).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/gu,' ').trim();
const EN_ADDITIONAL_UI={
  'Diese Münzen sind jetzt in deinem Dojo. Jede Erfolgsbelohnung lässt sich einmal abholen. Im Basar findest du passende Ninja-Looks und Fähigkeiten.':'These coins are now in your dojo. Each achievement reward can only be claimed once. Find matching ninja looks and abilities in the bazaar.',
  'bestätigter Fortschritt':'verified progress',
  'Run wird am Ende geprüft':'run verification at the end',
  'Entspannt: 5 Herzen. Normal: 4. Profi: 3. Die normalen Räume werden allmählich schneller. Open Run hat einen einzigen Modus mit drei Herzen, langsamem Einstieg und dauerhaft steigendem Tempo. Sammle Münzen für Spielwelten, Ninja-Looks und Fähigkeiten. Der Ninja-Basar zeigt Vorschauen und Freischaltbedingungen; neue Welten werden der Reihe nach freigeschaltet.':'Relaxed: 5 hearts. Normal: 4. Pro: 3. Regular rooms gradually get faster. Open Run has one mode with three hearts, a gentle start and steadily increasing speed. Earn coins for game worlds, ninja looks and abilities. The ninja bazaar shows previews and unlock requirements; new worlds unlock in order.',
  'Musik. Fähigkeiten, Superwahl und Ninja-Looks gelten ab der nächsten neuen Runde.':'Music. Abilities, your selected Super and ninja looks apply from the next new round.',
  '✦ Zusatzmissionen':'✦ Bonus missions',
  '6 Ziffern oder Wiederherstellungscode':'6 digits or recovery code',
  'Diese zehn Codes werden nur einmal angezeigt.':'These ten codes are shown only once.',
  'Bewahre sie getrennt vom Passwort an einem sicheren Ort auf. Jeder Code funktioniert nur einmal.':'Keep them somewhere safe, separate from your password. Each code works only once.',
  'Ich habe die Codes sicher und privat gespeichert.':'I have saved the codes somewhere safe and private.',
  '✓ MFA-Anmeldung bestätigt.':'✓ MFA sign-in confirmed.',
  'Ungültiger Einrichtungscode.':'Invalid setup code.',
  'Zwei-Faktor-Anmeldung ist am Server noch nicht konfiguriert.':'Two-factor sign-in is not configured on the server yet.',
  'MFA-Schlüssel ungültig.':'Invalid MFA key.',
  'MFA-Schlüssel konnte nicht entschlüsselt werden.':'The MFA key could not be decrypted.',
  'MFA-Code ungültig oder abgelaufen.':'MFA code invalid or expired.',
  'Passwort zur Bestätigung erforderlich.':'Confirm your password to continue.',
  'Einrichtung abgelaufen. Bitte erneut beginnen.':'Setup expired. Please start again.',
  'Authenticator-Code ungültig.':'Invalid authenticator code.',
  'MFA-Code ungültig.':'Invalid MFA code.',
  'Ein gültiger MFA-Code wird benötigt.':'A valid MFA code is required.',
  'Wähle einen gültigen Ranglistenzeitraum.':'Choose a valid leaderboard period.',
  'Bitte versuche die Anfrage erneut.':'Please try the request again.',
  'Noch keine Rangliste geladen.':'No leaderboard loaded yet.',
  'Stark! Gute Entscheidungen laden deine Super erneut auf. Im Basar kannst du vor deiner nächsten neuen Runde eine andere Super ausrüsten.':'Great! Good decisions recharge your Super. You can equip a different Super in the bazaar before your next new round.',
  '60 oder 180 richtige Entscheidungen – dein neuer Ninja-Look wartet im Profil.':'60 or 180 correct decisions — your new ninja look is waiting in your profile.'
};
const dictionary=new Map(Object.entries({...EN_GAME,...EN_EXPANSION,...EN_UI,...EN_PORTAL,...EN_HOME,...EN_PDF,...EN_ACCOUNTS,...EN_SETTINGS,...EN_CAMPAIGN,...EN_LEGEND,...EN_REFLECTION,...EN_ARCADE,...EN_V2,...EN_ADDITIONAL_UI}).map(([de,en])=>[normalize(de),en]));
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
    if(key.includes(' · '))output=key.split(' · ').map(part=>dictionary.get(part)??translatedCore(part)).join(' · ');
    else output=translatedPart(key);
  }
  if(cache.size>4096)cache.clear();cache.set(key,output);
  if(output===key&&/[äöüß]|\b(?:Dein|Deine|dein|deine|Münzen|Punkte|Schalte|Runde|Erfolg|Beenden|Zurück|abholen|freigeschaltet|Lernen|Schlafen|Zusatzmissionen|Ziffern|Wiederherstellungscode|Diese|Bewahre|gespeichert)\b|\bWELT(?=\s+\d)/u.test(key)&&missing.size<1500)missing.add(key);
  return output;
}
function translatedPart(key){
  const world=key.match(/^WELT\s+(\d+)$/u);
  if(world)return `WORLD ${world[1]}`;
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
