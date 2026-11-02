import {CONTENT} from './game.js';
import {ninjaPortrait} from './mentor.js';
import {tr,localizeDOM} from './i18n.js';

const CONTEXTS=Object.freeze({study:{name:'Lernen',goal:'Du lernst für eine Schulaufgabe.'},gaming:{name:'Gaming',goal:'Jetzt ist deine bewusste Spielzeit.'},sleep:{name:'Schlafen',goal:'Du möchtest zur Ruhe kommen und schlafen.'}});
const ITEMS=Object.freeze({
  study:['homework','streak','gaming-invite','pencil','autoplay','break','safety','urgent-school','scary-lure'],
  gaming:['gaming-invite','autoplay','gameclip','streak','loot','break','homework','safety','ad'],
  sleep:['quiet','autoplay','teddy','streak','moon','break','urgent-school','safety','gameclip']
});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const itemById=new Map(CONTENT.map(item=>[item.id,item]));
function explanation(item,context){
  const kind=item.kindByContext[context];
  if(item.id==='safety')return 'Eine echte Sicherheitswarnung bleibt wichtig – auch wenn du gerade etwas anderes machst.';
  if(item.id==='break')return 'Trinken und eine bewusste Pause helfen dir in jeder Situation.';
  if(context==='study')return kind==='useful'?'Das unterstützt gerade deine Schulaufgabe. Du lässt es bewusst durch.':'Das zieht deine Aufmerksamkeit von der Schulaufgabe weg. Es kann bis nach dem Lernen warten.';
  if(context==='gaming')return kind==='useful'?'In deiner geplanten Spielzeit dürfen Spieltipps und Team-Nachrichten hilfreich sein. Behalte deine Grenze im Blick.':'Auch beim Spielen brauchst du nicht jeden Feed oder jede Werbung. Das kann warten.';
  return kind==='useful'?'Das passt zu deiner Ruhezeit. Ein ruhiges Ritual hilft dir beim Abschalten.':'Vor dem Schlafen kann diese Nachricht bis morgen warten. Du darfst deine Ruhe schützen.';
}
/** No timer, animation, currency or ranked score: only contextual decision practice. */
export function createPracticeModel(context='study'){
  let selected=Object.hasOwn(CONTEXTS,context)?context:'study',index=0,correct=0,feedback=null;
  const state=()=>{
    const item=itemById.get(ITEMS[selected][index]);
    return {context:selected,contextName:CONTEXTS[selected].name,goal:CONTEXTS[selected].goal,index,total:ITEMS[selected].length,correct,answered:feedback!==null,finished:index>=ITEMS[selected].length,ranked:false,rewards:false,item:item?{...item,kind:item.kindByContext[selected]}:null,feedback:feedback?{...feedback}:null};
  };
  function choose(action){
    if(!['slice','keep'].includes(action)||feedback!==null||index>=ITEMS[selected].length)return {ok:false};
    const item=itemById.get(ITEMS[selected][index]),expected=item.kindByContext[selected]==='distraction'?'slice':'keep',right=action===expected;
    if(right)correct++;
    feedback={correct:right,expected,explanation:explanation(item,selected)};
    return {ok:true,...feedback};
  }
  function next(){if(feedback===null||index>=ITEMS[selected].length)return false;index++;feedback=null;return true;}
  function setContext(value){if(!Object.hasOwn(CONTEXTS,value))return false;selected=value;index=0;correct=0;feedback=null;return true;}
  return Object.freeze({getState:state,choose,next,setContext});
}

/** One root-scoped controller. Destroy removes all handlers; never touches NinjaGame. */
export function createPractice({context='study',container,onExit=()=>{},onFinish=()=>{}}={}){
  const root=container||globalThis.document?.getElementById('overlay-root');
  if(!root)throw new TypeError('Practice requires a container.');
  const model=createPracticeModel(context);let active=false,reported=false;
  function render(focus=true){
    const state=model.getState(),item=state.item;
    const body=state.finished?`<div class="practice-result"><span aria-hidden="true">✦</span><h3>Gut geübt!</h3><p>${escape(tr('Richtige Entscheidungen'))}: ${state.correct} / ${state.total}</p><p>Hier zählt das Verstehen. Diese Übung gibt keine Münzen, XP oder Ranglistenpunkte.</p><div class="practice-actions"><button class="btn primary" data-practice="restart">Noch einmal üben</button><button class="btn ghost" data-practice="exit">Zurück ins Dojo</button></div></div>`:`<label for="practice-context">Deine Alltagssituation</label><select id="practice-context" data-practice-context>${Object.entries(CONTEXTS).map(([id,value])=>`<option value="${id}" ${id===state.context?'selected':''}>${escape(tr(value.name))}</option>`).join('')}</select><p class="practice-goal"><strong>${escape(tr(state.goal))}</strong></p><p class="muted">${escape(tr('Beispiel'))} ${state.index+1} / ${state.total} · ${escape(tr('Ohne Zeitdruck'))}</p><article class="practice-object" aria-labelledby="practice-item"><span class="practice-object-icon" aria-hidden="true">${escape(item.icon)}</span><h3 id="practice-item">${escape(tr(item.label))}</h3><p>${escape(tr(item.text))}</p></article><div class="practice-actions"><button class="btn primary" data-practice="slice" ${state.answered?'disabled':''}>✂ ${escape(tr('Wegwischen'))} <kbd>1</kbd></button><button class="btn ghost" data-practice="keep" ${state.answered?'disabled':''}>✓ ${escape(tr('Durchlassen'))} <kbd>2</kbd></button></div><section class="practice-feedback" role="status" aria-live="polite" aria-atomic="true">${state.feedback?`<h3>${state.feedback.correct?'✓ '+escape(tr('Gut entschieden!')):'↻ '+escape(tr('Probier es gedanklich noch einmal.'))}</h3><p><strong>${escape(tr('Hier passt'))}: ${escape(tr(state.feedback.expected==='slice'?'Wegwischen':'Durchlassen'))}.</strong> ${escape(tr(state.feedback.explanation))}</p><button class="btn primary" data-practice="next">${escape(tr(state.index+1===state.total?'Übung abschließen':'Nächstes Beispiel'))} →</button>`:'<p>Entscheide selbst. NIM erklärt dir danach, warum die Wahl zu dieser Situation passt.</p>'}</section>`;
    root.innerHTML=`<div class="modal-shade"><section class="panel practice-panel" role="dialog" aria-modal="true" aria-labelledby="practice-title"><header class="panel-header"><button class="panel-back" data-practice="exit">← ${escape(tr('Zurück'))}</button><span class="panel-header-title">${escape(tr('NINJA-ÜBUNG'))}</span></header><div class="eyebrow">AUSWAHLSTEUERUNG · OHNE RANGLISTE</div><h2 id="practice-title">Üben in deinem Tempo</h2><div class="practice-mentor"><div class="profile-avatar">${ninjaPortrait()}</div><p>Ich bin NIM. Hier bleiben die Gegenstände stehen. Wähle mit den großen Tasten oder mit 1 und 2.</p></div>${body}</section></div>`;
    localizeDOM(root);
    if(focus)root.querySelector('[data-practice="next"]:not(:disabled),[data-practice="restart"]:not(:disabled),[data-practice="slice"]:not(:disabled)')?.focus({preventScroll:true});
    if(state.finished&&!reported){reported=true;onFinish({context:state.context,correct:state.correct,total:state.total,ranked:false,rewards:false});}
  }
  function act(action){
    if(action==='exit'){destroy();onExit();return;}
    if(action==='restart'){reported=false;model.setContext(model.getState().context);render();return;}
    if(action==='next'){if(model.next())render();return;}
    if(model.choose(action).ok)render();
  }
  function click(event){const button=event.target.closest?.('[data-practice]');if(button&&root.contains(button)){event.preventDefault();act(button.dataset.practice);}}
  function change(event){if(event.target.matches?.('[data-practice-context]')&&model.setContext(event.target.value)){reported=false;render();}}
  function keydown(event){
    if(event.altKey||event.ctrlKey||event.metaKey||event.repeat||event.target.closest?.('input,textarea,select'))return;
    const state=model.getState();
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();act('exit');}
    else if(!state.answered&&!state.finished&&['1','2'].includes(event.key)){event.preventDefault();event.stopPropagation();act(event.key==='1'?'slice':'keep');}
    else if(event.key==='Enter'&&state.answered){event.preventDefault();event.stopPropagation();act('next');}
    else if(event.key==='Tab'){
      const choices=[...root.querySelectorAll('button:not(:disabled),select')],first=choices[0],last=choices.at(-1);
      if(event.shiftKey&&root.ownerDocument.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&root.ownerDocument.activeElement===last){event.preventDefault();first?.focus();}
    }
  }
  function show(){if(!active){root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('keydown',keydown);active=true;}render();return controller;}
  function destroy(){if(!active)return;root.removeEventListener('click',click);root.removeEventListener('change',change);root.removeEventListener('keydown',keydown);active=false;if(root.querySelector('.practice-panel'))root.replaceChildren();}
  const controller=Object.freeze({show,destroy,getState:model.getState});return controller;
}
