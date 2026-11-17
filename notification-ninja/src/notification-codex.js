import {CONTENT} from './game.js';
import {getLanguage,onLanguageChange,tr} from './i18n.js';
import {sceneArt} from './scene-art.js';

const contexts=['study','gaming','sleep'],kinds=['all','useful','distraction','powerup'];
const normalize=value=>String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('en').trim();
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={
 de:{eyebrow:'NIMS SYMBOLLEXIKON',title:'Dasselbe Signal. Ein anderes Ziel.',intro:'Entdecke die echten Hinweise aus dem Spiel und sieh, wie ihre Bedeutung mit deiner Situation wechselt.',context:'Deine Alltagssituation',study:'Lernen',gaming:'Gaming',sleep:'Ruhe',search:'Hinweise durchsuchen',placeholder:'Zum Beispiel Team, Pause oder Warnung',all:'Alle Hinweise',useful:'Hilfreich',distraction:'Ablenkung',powerup:'Bonusobjekt',keep:'Durchlassen',slice:'Wegwischen',collect:'Beim Durchwischen einsammeln',filters:'Hinweisart filtern',count:'Hinweise',emptyTitle:'Dazu gibt es gerade keinen passenden Hinweis.',emptyCopy:'Versuche einen anderen Suchbegriff oder zeige wieder alle Hinweisarten.',clear:'Suche leeren',practice:'Diese Situation üben',exit:'Zurück ins Dojo',map:'Bedeutung in den drei Situationen',safety:'Eine echte Sicherheitswarnung bleibt in allen drei Situationen wichtig. Sie ist kein Klickköder.',break:'Eine bewusste Trink- oder Erholungspause kann in jeder Situation hilfreich sein.',usefulCopy:'Dieser Hinweis unterstützt das aktuelle Ziel. Lass ihn im Spiel bewusst passieren.',distractionCopy:'Dieser Hinweis lenkt im aktuellen Kontext vom Ziel ab. Im Spiel wischst du ihn weg.',powerupCopy:'Bonusobjekte sind eigene Spielhilfen. Verfügbarkeit und Wirkung hängen vom Modus ab; sie sind keine normale Benachrichtigungsentscheidung.',note:'Die Regeln stammen aus den tatsächlichen Spielinhalten. Hier werden keine angeblich entdeckten Objekte oder zusätzlichen Belohnungen erfunden.',practiceNote:'Die Übung ist ohne Zeitdruck, Münzen, XP und Ranglistenwertung.',reset:'Alle Filter zurücksetzen'},
 en:{eyebrow:'NIM’S SYMBOL CODEX',title:'The same signal. A different goal.',intro:'Explore the actual game signals and see how their meaning changes with your situation.',context:'Your everyday situation',study:'Study',gaming:'Gaming',sleep:'Rest',search:'Search signals',placeholder:'For example team, break or warning',all:'All signals',useful:'Helpful',distraction:'Distraction',powerup:'Bonus item',keep:'Let through',slice:'Slice away',collect:'Collect with a swipe',filters:'Filter signal type',count:'signals',emptyTitle:'There is no matching signal right now.',emptyCopy:'Try another search term or show all signal types again.',clear:'Clear search',practice:'Practise this situation',exit:'Back to the dojo',map:'Meaning in the three situations',safety:'A genuine safety warning remains important in all three situations. It is not clickbait.',break:'A deliberate drink or rest break can be helpful in every situation.',usefulCopy:'This signal supports the current goal. Deliberately let it pass in the game.',distractionCopy:'This signal distracts from the current goal. Slice it away in the game.',powerupCopy:'Bonus items are separate game aids. Their availability and effect depend on the mode; they are not ordinary notification decisions.',note:'These rules come from the actual game content. No supposedly discovered items or extra rewards are invented here.',practiceNote:'Practice has no time pressure, coins, XP or leaderboard score.',reset:'Reset all filters'}
};
export function getCodexEntries({context='study',query='',kind='all'}={}){
 const selected=contexts.includes(context)?context:'study',needle=normalize(typeof query==='string'?query.slice(0,160):''),filter=kinds.includes(kind)?kind:'all';
 return CONTENT.map(item=>{
  const classification=item.powerup?'powerup':item.kindByContext[selected];
  return {id:item.id,label:tr(item.label),text:tr(item.text),icon:item.icon,color:item.color,context:selected,kind:classification,powerup:item.powerup||null,meaning:{...item.kindByContext},searchText:[item.id,item.label,item.text,tr(item.label),tr(item.text)].join(' ')};
 }).filter(item=>(filter==='all'||item.kind===filter)&&(!needle||normalize(item.searchText).includes(needle))).map(({searchText,...entry})=>entry);
}
export function createNotificationCodexModel({context='study'}={}){
 let selected=contexts.includes(context)?context:'study',query='',kind='all';
 return Object.freeze({
  getState:()=>({context:selected,query,kind,total:CONTENT.length,entries:getCodexEntries({context:selected,query,kind}),ranked:false,rewards:false}),
  setContext(value){if(!contexts.includes(value))return false;selected=value;return true;},
  setQuery(value){query=typeof value==='string'?value.slice(0,160):'';return query;},
  setKind(value){if(!kinds.includes(value))return false;kind=value;return true;},
  reset(){query='';kind='all';}
 });
}
export function createNotificationCodex({container,onPractice=()=>{},onExit=()=>{},context='study'}={}){
 if(!container)throw new TypeError('The notification codex requires a container.');
 const root=container,model=createNotificationCodexModel({context});let active=false,unsubscribe=null;
 const t=()=>labels[getLanguage()==='en'?'en':'de'];
 function cards(){
  const state=model.getState(),copy=t();
  if(!state.entries.length)return `<section class="codex-empty" role="status"><span aria-hidden="true">◎</span><h3>${copy.emptyTitle}</h3><p>${copy.emptyCopy}</p><button type="button" class="btn ghost" data-codex-action="reset">${copy.reset}</button></section>`;
  return state.entries.map(item=>{
   const help=item.id==='safety'?copy.safety:item.id==='break'?copy.break:item.kind==='powerup'?copy.powerupCopy:item.kind==='useful'?copy.usefulCopy:copy.distractionCopy;
   const action=item.kind==='powerup'?copy.collect:item.kind==='useful'?copy.keep:copy.slice;
   const matrix=contexts.map(key=>{const itemKind=item.powerup?'powerup':item.meaning[key];return `<span class="codex-meaning ${key===state.context?'is-selected':''}" data-context="${key}" data-kind="${itemKind}"><span>${copy[key]}</span><b>${itemKind==='powerup'?'✦':itemKind==='useful'?'✓':'✂'}</b><small>${copy[itemKind]}</small></span>`;}).join('');
   return `<article class="codex-card is-${item.kind}" data-codex-id="${escape(item.id)}" data-codex-kind="${item.kind}"><div class="codex-object-scene"><span class="codex-object-icon" aria-hidden="true" style="--signal-color:${/^#[a-f\d]{6}$/i.test(item.color)?item.color:'#a8d9bd'}">${escape(item.icon)}</span><span class="codex-kind">${copy[item.kind]}</span></div><div class="codex-card-content"><h3>${escape(item.label)}</h3><p>${escape(item.text)}</p><strong class="codex-action-label"><span aria-hidden="true">${item.kind==='powerup'?'✦':item.kind==='useful'?'✓':'✂'}</span>${action}</strong><p class="codex-explanation">${help}</p><div class="codex-meaning-map" role="group" aria-label="${copy.map}">${matrix}</div></div></article>`;
  }).join('');
 }
 function updateResults(){
  const state=model.getState(),list=root.querySelector('.codex-results'),count=root.querySelector('.codex-results-count');
  if(list)list.innerHTML=cards();if(count)count.textContent=`${state.entries.length} / ${state.total} ${t().count}`;
  for(const button of root.querySelectorAll('[data-codex-context]'))button.setAttribute('aria-pressed',String(button.dataset.codexContext===state.context));
  for(const button of root.querySelectorAll('[data-codex-kind-filter]'))button.setAttribute('aria-pressed',String(button.dataset.codexKindFilter===state.kind));
 }
 function render(preserveFocus=false){
  const state=model.getState(),copy=t(),language=getLanguage()==='en'?'en':'de',focused=root.ownerDocument?.activeElement,searchFocused=preserveFocus&&focused?.matches?.('[data-codex-search]'),selection=searchFocused?[focused.selectionStart,focused.selectionEnd]:null;
  root.innerHTML=`<div class="notification-codex" translate="no" lang="${language}"><header class="codex-hero">${sceneArt('welcome')}<div><span class="eyebrow">${copy.eyebrow}</span><h3>${copy.title}</h3><p>${copy.intro}</p></div></header><section class="codex-tools" aria-label="${copy.filters}"><div class="codex-contexts" role="group" aria-label="${copy.context}">${contexts.map(value=>`<button type="button" class="btn ghost" data-codex-context="${value}" aria-pressed="${state.context===value}">${copy[value]}</button>`).join('')}</div><div class="codex-search-field"><label for="codex-search">${copy.search}</label><div><input id="codex-search" data-codex-search type="search" maxlength="160" autocomplete="off" spellcheck="false" placeholder="${copy.placeholder}" value="${escape(state.query)}"><button type="button" class="btn ghost" data-codex-action="clear" aria-label="${copy.clear}">×</button></div></div><div class="codex-types" role="group" aria-label="${copy.filters}">${kinds.map(value=>`<button type="button" class="btn ghost" data-codex-kind-filter="${value}" aria-pressed="${state.kind===value}">${copy[value]}</button>`).join('')}</div></section><div class="codex-results-heading"><strong class="codex-results-count" role="status" aria-live="polite">${state.entries.length} / ${state.total} ${copy.count}</strong><button type="button" class="btn primary" data-codex-action="practice">${copy.practice} →</button></div><p class="codex-practice-note">${copy.practiceNote}</p><div class="codex-results">${cards()}</div><p class="codex-source-note">${copy.note}</p><footer class="codex-footer"><button type="button" class="btn ghost" data-codex-action="exit">${copy.exit}</button></footer></div>`;
  if(searchFocused){const search=root.querySelector('[data-codex-search]');search.focus({preventScroll:true});search.setSelectionRange(...selection);}
 }
 function click(event){
  const button=event.target.closest?.('button');if(!button||!root.contains(button))return;
  if(button.dataset.codexContext){event.preventDefault();if(model.setContext(button.dataset.codexContext))updateResults();return;}
  if(button.dataset.codexKindFilter){event.preventDefault();if(model.setKind(button.dataset.codexKindFilter))updateResults();return;}
  const action=button.dataset.codexAction;if(!action)return;event.preventDefault();
  if(action==='practice')onPractice(model.getState().context);
  else if(action==='exit')onExit();
  else if(action==='clear'){model.setQuery('');const search=root.querySelector('[data-codex-search]');search.value='';updateResults();search.focus({preventScroll:true});}
  else if(action==='reset'){model.reset();render();root.querySelector('[data-codex-search]')?.focus({preventScroll:true});}
 }
 function input(event){if(event.target.matches?.('[data-codex-search]')){model.setQuery(event.target.value);updateResults();}}
 function show(){if(!active){root.addEventListener('click',click);root.addEventListener('input',input);unsubscribe=onLanguageChange(()=>render(true));active=true;}render();return controller;}
 function destroy(){if(!active)return;root.removeEventListener('click',click);root.removeEventListener('input',input);unsubscribe?.();unsubscribe=null;active=false;root.replaceChildren();}
 const controller=Object.freeze({show,destroy,getState:model.getState});return controller;
}
