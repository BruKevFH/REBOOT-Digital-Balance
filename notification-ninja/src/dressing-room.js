import {SKINS} from './game.js';
import {createRenderer,playerPortrait} from './renderer.js';
import {getPlayerProgress} from './player.js';
import {NINJA_RANKS} from './journey.js';
import {getLanguage,onLanguageChange,tr} from './i18n.js';

const CONTEXTS=['study','gaming','sleep'];
const skinById=new Map(SKINS.map(skin=>[skin.id,skin]));
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.trunc(value))):0;
const COPY={
  de:{preview:'Vorschau',title:'Dein Look. Deine Entscheidung.',intro:'Probiere jeden Ninja unverbindlich an. Dein ausgerüstetes Outfit und dein Guthaben bleiben dabei erhalten.',previous:'Vorheriger Look',next:'Nächster Look',scene:'Deine Kulisse',study:'Lern-Dojo',gaming:'Gaming-Dojo',sleep:'Schlaf-Dojo',collection:'Alle Ninja-Looks',owned:'In deiner Sammlung',locked:'Noch nicht freigeschaltet',equipped:'Aktuell ausgerüstet',offer:'Zum Angebot',exit:'Zurück zum Basar',condition:'So erhältst du diesen Look',free:'Dein erster Ninja · kostenlos',coins:'Münzen im Basar',correct:'richtige Entscheidungen',rank:'Ninja-Rang',xp:'XP',weekly:'Über die echten Wochenziele freischalten',unchanged:'Anprobieren kauft und rüstet nichts aus.',calm:'Ruhige Vorschau · Bewegung reduziert',motion:'Animierte Vorschau',keyboard:'Mit ← und → kannst du durch die Looks blättern.',canvas:'Animierte Vorschau des ausgewählten Ninja-Looks',position:'von'},
  en:{preview:'Preview',title:'Your look. Your choice.',intro:'Try every ninja without committing. Your equipped outfit and coins are kept.',previous:'Previous look',next:'Next look',scene:'Your backdrop',study:'Study dojo',gaming:'Gaming dojo',sleep:'Sleep dojo',collection:'All ninja looks',owned:'In your collection',locked:'Not unlocked yet',equipped:'Currently equipped',offer:'View offer',exit:'Back to the bazaar',condition:'How to earn this look',free:'Your first ninja · free',coins:'coins in the bazaar',correct:'correct decisions',rank:'Ninja rank',xp:'XP',weekly:'Unlock through the real weekly goals',unchanged:'Trying a look neither buys nor equips it.',calm:'Calm preview · reduced motion',motion:'Animated preview',keyboard:'Use ← and → to browse the looks.',canvas:'Animated preview of the selected ninja look',position:'of'}
};
const copy=()=>COPY[getLanguage()==='en'?'en':'de'];

/** A detached, read-only view of canonical outfits. No game or account method is invoked. */
export function createDressingModel(profile={},initialSkin){
  const source=profile&&typeof profile==='object'?profile:{};
  const owned=new Set(['default',...(Array.isArray(source.unlockedSkins)?source.unlockedSkins:[])].filter(id=>skinById.has(id)));
  const equipped=skinById.has(source.selectedSkin)&&owned.has(source.selectedSkin)?source.selectedSkin:'default';
  const correct=count(source.stats?.correct),xp=getPlayerProgress(source).xp;
  let skinId=skinById.has(initialSkin)?initialSkin:equipped,context='study';
  function getState(){
    const skin=skinById.get(skinId),rank=skin.unlock==='rank'?NINJA_RANKS.find(item=>item.id===skin.rank):null;
    return {skinId,context,index:SKINS.findIndex(item=>item.id===skinId),total:SKINS.length,skin:{...skin},owned:owned.has(skinId),equipped:skinId===equipped,correct,xp,rank:rank?{...rank}:null};
  }
  function select(value){if(!skinById.has(value))return false;skinId=value;return true;}
  function step(direction){if(![-1,1].includes(direction))return false;const index=SKINS.findIndex(item=>item.id===skinId);skinId=SKINS[(index+direction+SKINS.length)%SKINS.length].id;return true;}
  function setContext(value){if(!CONTEXTS.includes(value))return false;context=value;return true;}
  return Object.freeze({getState,select,step,setContext,owns:id=>owned.has(id)});
}

/** Capped render scheduling; hidden/calm controllers disable it rather than burning idle frames. */
export function createPreviewAnimator({render,requestFrame=callback=>globalThis.requestAnimationFrame(callback),cancelFrame=id=>globalThis.cancelAnimationFrame(id),now=()=>globalThis.performance.now(),fps=30}={}){
  if(typeof render!=='function')throw new TypeError('A preview renderer is required.');
  const interval=1000/Math.min(30,Math.max(1,Number(fps)||30));
  let enabled=false,disposed=false,pending=null,lastPaint=null,nextPaint=null,elapsed=0,renderedFrames=0;
  function paint(stamp,force=false){
    if(disposed)return;
    const time=Number.isFinite(stamp)?stamp:now();
    if(!force&&lastPaint!==null&&time-lastPaint<interval-.01)return;
    if(enabled&&lastPaint!==null)elapsed+=Math.min(.1,Math.max(0,(time-lastPaint)/1000));
    lastPaint=time;render(elapsed);renderedFrames++;
  }
  function tick(stamp){pending=null;if(!enabled||disposed)return;const time=Number.isFinite(stamp)?stamp:now();if(nextPaint===null||time+.01>=nextPaint){paint(time,true);nextPaint=nextPaint===null||time-nextPaint>interval?time+interval:nextPaint+interval;}if(enabled&&!disposed)pending=requestFrame(tick);}
  function setEnabled(value){
    if(disposed)return false;
    const next=value===true;if(next===enabled)return true;
    enabled=next;lastPaint=null;nextPaint=null;
    if(!enabled&&pending!==null){cancelFrame(pending);pending=null;}
    else if(enabled&&pending===null)pending=requestFrame(tick);
    return true;
  }
  function refresh(){paint(now(),true);}
  function destroy(){if(disposed)return;enabled=false;disposed=true;if(pending!==null)cancelFrame(pending);pending=null;lastPaint=null;nextPaint=null;}
  const getState=()=>({animationRunning:enabled&&!disposed,rafPending:pending!==null,disposed,renderedFrames,elapsed});
  return Object.freeze({setEnabled,refresh,destroy,getState});
}

function condition(state,labels){
  const skin=state.skin;
  if(skin.unlock==='mastery')return `${Math.min(state.correct,skin.requiredCorrect)} / ${skin.requiredCorrect} ${labels.correct}`;
  if(skin.unlock==='rank')return `${labels.rank}: ${tr(state.rank?.name||skin.rank)} · ${Math.min(state.xp,state.rank?.xp||0)} / ${state.rank?.xp||0} ${labels.xp}`;
  if(skin.unlock==='weekly')return labels.weekly;
  return skin.cost?`${skin.cost} ${labels.coins}`:labels.free;
}

/** Inner-page controller. Offers only navigate back to the existing authoritative shop. */
export function createDressingRoom({container,profile={},initialSkin,calmEffects=false,onOffer=()=>{},onExit=()=>{}}={}){
  if(!container?.ownerDocument)throw new TypeError('Dressing room requires a connected UI container.');
  const root=container,doc=root.ownerDocument,view=doc.defaultView||globalThis,model=createDressingModel(profile,initialSkin);
  const motion=view.matchMedia?.('(prefers-reduced-motion: reduce)');
  let active=false,disposed=false,suspended=false,renderer=null,canvas=null,resizeObserver=null,unsubscribe=null,preload=null,imageTimer=null;
  const quiet=()=>Boolean(typeof calmEffects==='function'?calmEffects():calmEffects)||motion?.matches===true;
  const animator=createPreviewAnimator({render:paint,requestFrame:callback=>view.requestAnimationFrame(callback),cancelFrame:id=>view.cancelAnimationFrame(id),now:()=>view.performance.now()});
  function getState(){return {...model.getState(),...animator.getState(),active,disposed,suspended,reducedMotion:quiet(),hidden:doc.hidden===true,renderer:renderer?.getStats?.()||null};}
  function paint(time){
    if(!active||!renderer)return;
    if(root.isConnected===false){destroy();return;}
    const state=model.getState();
    renderer.render({scene:'playing',started:true,shopPreview:true,mode:state.context,context:state.context,difficulty:'easy',skin:state.skinId,skinData:state.skin,elapsed:quiet()?0:time,objects:[],effects:{},backgrounds:{study:'classroom',gaming:'game-room',sleep:'bedroom'},calmEffects:quiet(),screenShake:false},quiet()?0:time);
  }
  function updateStatus(){
    if(!active)return;
    const state=model.getState(),labels=copy();
    const name=root.querySelector('[data-dressing-name]'),info=root.querySelector('[data-dressing-info]'),caption=root.querySelector('[data-dressing-motion]');
    if(name)name.textContent=tr(state.skin.name);
    if(info)info.innerHTML=`<div class="dressing-room-status ${state.owned?'is-owned':'is-preview'}"><span aria-hidden="true">${state.equipped?'✓':state.owned?'✦':'◇'}</span><strong>${escape(state.equipped?labels.equipped:state.owned?labels.owned:labels.locked)}</strong></div><div class="dressing-room-condition"><small>${escape(labels.condition)}</small><strong>${escape(condition(state,labels))}</strong>${state.skin.description?`<p>${escape(tr(state.skin.description))}</p>`:''}</div><p class="dressing-room-fair">${escape(labels.unchanged)}</p>`;
    if(caption)caption.textContent=quiet()?labels.calm:labels.motion;
    const position=root.querySelector('[data-dressing-position]');if(position)position.textContent=`${state.index+1} ${labels.position} ${state.total}`;
    for(const control of root.querySelectorAll('[data-dressing-skin]'))control.setAttribute('aria-pressed',String(control.dataset.dressingSkin===state.skinId));
    const choice=root.querySelector('[data-dressing-context]');if(choice)choice.value=state.context;
  }
  function syncMotion(){if(!active)return;animator.setEnabled(doc.hidden!==true&&!quiet()&&!suspended);if(doc.hidden!==true&&!suspended)animator.refresh();updateStatus();}
  function setSuspended(value){if(disposed)return false;suspended=value===true;syncMotion();return true;}
  function resize(){if(!active||suspended||doc.hidden===true)return;renderer?.resize();animator.refresh();}
  function renderUI(){
    if(!active)return;
    const labels=copy(),state=model.getState();
    const focused=doc.activeElement?.closest?.('[data-dressing-action],[data-dressing-skin],[data-dressing-context]');
    const focusAction=focused?.dataset.dressingAction,focusSkin=focused?.dataset.dressingSkin,focusContext=focused?.hasAttribute('data-dressing-context');
    resizeObserver?.disconnect();renderer?.dispose();
    root.innerHTML=`<section class="dressing-room" translate="no" lang="${getLanguage()}" aria-label="${escape(labels.title)}"><header class="dressing-room-intro"><span class="eyebrow">${escape(labels.preview)}</span><h3>${escape(labels.title)}</h3><p>${escape(labels.intro)}</p></header><div class="dressing-room-layout"><div class="dressing-room-stage"><canvas class="dressing-room-canvas" aria-label="${escape(labels.canvas)}"></canvas><div class="dressing-room-stage-heading"><span data-dressing-motion>${escape(quiet()?labels.calm:labels.motion)}</span><strong data-dressing-name>${escape(tr(state.skin.name))}</strong></div><div class="dressing-room-navigation"><button type="button" data-dressing-action="previous" aria-label="${escape(labels.previous)}">←</button><span data-dressing-position>${state.index+1} ${labels.position} ${state.total}</span><button type="button" data-dressing-action="next" aria-label="${escape(labels.next)}">→</button></div></div><div class="dressing-room-paper"><label class="dressing-room-scene-label">${escape(labels.scene)}<select data-dressing-context>${CONTEXTS.map(id=>`<option value="${id}" ${id===state.context?'selected':''}>${escape(labels[id])}</option>`).join('')}</select></label><div data-dressing-info aria-live="polite" aria-atomic="true"></div><div class="dressing-room-actions"><button type="button" class="btn primary" data-dressing-action="offer">${escape(labels.offer)} <span aria-hidden="true">→</span></button><button type="button" class="btn ghost" data-dressing-action="exit">${escape(labels.exit)}</button></div></div></div><section class="dressing-room-collection" aria-label="${escape(labels.collection)}"><header><h4>${escape(labels.collection)}</h4><p>${escape(labels.keyboard)}</p></header><div class="dressing-room-looks">${SKINS.map(skin=>`<button type="button" data-dressing-skin="${skin.id}" aria-pressed="${skin.id===state.skinId}" aria-label="${escape(labels.preview+' '+tr(skin.name))}"><span class="dressing-room-miniature" aria-hidden="true">${playerPortrait(skin.id)}</span><strong>${escape(tr(skin.name))}</strong><small>${escape(model.owns(skin.id)?labels.owned:labels.preview)}</small></button>`).join('')}</div></section></section>`;
    canvas=root.querySelector('canvas');renderer=createRenderer(canvas);resizeObserver?.observe(canvas);updateStatus();if(!suspended&&doc.hidden!==true)animator.refresh();
    const target=focusAction?root.querySelector(`[data-dressing-action="${focusAction}"]`):focusSkin?root.querySelector(`[data-dressing-skin="${focusSkin}"]`):focusContext?root.querySelector('[data-dressing-context]'):null;
    target?.focus({preventScroll:true});
  }
  function changeSelection(id){if(!active||!model.select(id))return;updateStatus();animator.refresh();}
  function click(event){
    const button=event.target.closest?.('button');if(!active||!button||!root.contains(button))return;
    if(button.hasAttribute('data-dressing-skin')){event.preventDefault();changeSelection(button.dataset.dressingSkin);return;}
    const action=button.dataset.dressingAction;if(!action)return;event.preventDefault();event.stopPropagation();
    if(action==='previous'||action==='next'){model.step(action==='previous'?-1:1);updateStatus();animator.refresh();}
    else if(action==='offer'){const id=model.getState().skinId;destroy();onOffer(id);}
    else if(action==='exit'){destroy();onExit();}
  }
  function change(event){if(active&&event.target.matches?.('[data-dressing-context]')&&model.setContext(event.target.value)){updateStatus();animator.refresh();}}
  function keydown(event){
    if(!active||event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('input,textarea,select'))return;
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();destroy();onExit();}
    else if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();event.stopPropagation();model.step(event.key==='ArrowLeft'?-1:1);updateStatus();animator.refresh();}
  }
  function show(){
    if(disposed)return controller;if(active)return controller;active=true;
    root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('keydown',keydown);doc.addEventListener('visibilitychange',syncMotion);view.addEventListener('resize',resize);
    if(view.ResizeObserver)resizeObserver=new view.ResizeObserver(resize);
    if(motion?.addEventListener)motion.addEventListener('change',syncMotion);else motion?.addListener?.(syncMotion);
    unsubscribe=onLanguageChange(renderUI);renderUI();syncMotion();
    // A calm preview repaints once when its room texture arrives, without an animation loop.
    if(view.Image){preload=new view.Image();preload.onload=()=>{imageTimer=view.setTimeout(()=>{imageTimer=null;if(active&&!suspended&&doc.hidden!==true)animator.refresh();},0);};preload.src=new URL('./assets/indie-worlds.png',doc.baseURI).href;}
    return controller;
  }
  function destroy(){
    if(disposed)return;active=false;disposed=true;animator.destroy();renderer?.dispose();renderer=null;resizeObserver?.disconnect();resizeObserver=null;unsubscribe?.();unsubscribe=null;
    root.removeEventListener('click',click);root.removeEventListener('change',change);root.removeEventListener('keydown',keydown);doc.removeEventListener('visibilitychange',syncMotion);view.removeEventListener('resize',resize);
    if(motion?.removeEventListener)motion.removeEventListener('change',syncMotion);else motion?.removeListener?.(syncMotion);
    if(preload){preload.onload=null;preload.onerror=null;preload=null;}if(imageTimer!==null)view.clearTimeout(imageTimer);imageTimer=null;
    root.replaceChildren();canvas=null;
  }
  const controller=Object.freeze({show,destroy,getState,setSuspended});return controller;
}
