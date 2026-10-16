// Request browser fullscreen only from a player gesture. iPhone Safari and
// embedded browsers can instead give the game a compact, larger play view.
export function createFullscreen({target=document.documentElement,button,onChange=()=>{}}={}) {
  const doc=target.ownerDocument||document,body=doc.body;
  const buttons=[button,doc.getElementById('landing-fullscreen')].filter((value,index,items)=>value&&items.indexOf(value)===index);
  const status=doc.getElementById('fullscreen-status');
  let focused=false,pending=false,disposed=false,nativeRequests=0,fallbackEntries=0,changes=0;
  const fullElement=()=>doc.fullscreenElement||doc.webkitFullscreenElement||null;
  const request=()=>target.requestFullscreen||target.webkitRequestFullscreen;
  const nativeAvailable=()=>!!request()&&doc.fullscreenEnabled!==false&&doc.webkitFullscreenEnabled!==false;
  const nativeActive=()=>fullElement()===target;
  const isActive=()=>nativeActive()||focused;
  const update=(announce=true)=>{
    if(disposed)return;
    const native=nativeActive(),active=native||focused;
    body.classList.toggle('is-fullscreen-game',active);
    body.classList.toggle('game-focus-view',focused&&!native);
    const label=active?(native?'Vollbild verlassen':'Große Spielansicht verlassen'):(nativeAvailable()?'Vollbild':'Große Spielansicht');
    for(const item of buttons){
      item.setAttribute('aria-pressed',String(active));item.setAttribute('aria-label',label);item.title=label;
      item.dataset.fullscreenMode=native?'native':focused?'focus':'window';
      const icon=item.querySelector('svg path');
      if(icon)icon.setAttribute('d',active?'M4 9h5V4m6 0v5h5M4 15h5v5m6 0v-5h5':'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5');
      for(const copy of item.querySelectorAll('[data-fullscreen-label]'))copy.textContent=label;
    }
    if(announce&&status)status.textContent=active?(native?'Vollbild ist aktiv. Zum Verlassen erneut die Vollbild-Taste drücken.':'Große Spielansicht ist aktiv. Dein Browser zeigt seine eigene Leiste weiterhin an. Zum Verlassen erneut die Ansicht-Taste drücken.'):'Normale Ansicht ist wieder aktiv.';
    changes++;onChange({active,native,mode:native?'native':focused?'focus':'window'});
  };
  const enterFocus=()=>{focused=true;fallbackEntries++;update();return {active:true,native:false,mode:'focus'};};
  const toggle=async()=>{
    if(disposed||pending)return {active:isActive(),native:nativeActive(),pending};
    if(focused){focused=false;update();return {active:false,native:false,mode:'window'};}
    if(nativeActive()){
      const exit=doc.exitFullscreen||doc.webkitExitFullscreen;
      if(!exit)return {active:true,native:true,mode:'native'};
      pending=true;
      try{await exit.call(doc);}catch(_error){/* The exit button remains available if the browser declines. */}
      finally{pending=false;if(!disposed)update();}
      return {active:isActive(),native:nativeActive(),mode:nativeActive()?'native':'window'};
    }
    if(!nativeAvailable())return enterFocus();
    pending=true;nativeRequests++;
    try{
      // Do not await anything before this call: transient activation is required.
      await request().call(target);
      if(disposed)return {active:false,native:false,mode:'window'};
      if(nativeActive()){focused=false;update();return {active:true,native:true,mode:'native'};}
      // Legacy WebKit reports completion through webkitfullscreenchange later.
      // The compact layout is useful meanwhile, without claiming native mode.
      return enterFocus();
    }catch(_error){return disposed?{active:false,native:false,mode:'window'}:enterFocus();}
    finally{pending=false;}
  };
  const changed=()=>{if(nativeActive())focused=false;update();};
  const escape=event=>{
    if(event.key==='Escape'&&focused){event.preventDefault();event.stopPropagation();focused=false;update();}
  };
  const clicked=()=>{void toggle();};
  for(const item of buttons)item.addEventListener('click',clicked);
  doc.addEventListener('fullscreenchange',changed);doc.addEventListener('webkitfullscreenchange',changed);
  doc.addEventListener('keydown',escape,true);
  update(false);
  const prepare=()=>isActive()?{active:true,native:nativeActive()}:enterFocus();
  const enter=async()=>{
    if(disposed||pending||nativeActive())return {active:isActive(),native:nativeActive(),pending};
    if(!nativeAvailable())return focused?{active:true,native:false,mode:'focus'}:enterFocus();
    pending=true;nativeRequests++;
    try{
      await request().call(target);
      if(disposed)return {active:false,native:false,mode:'window'};
      if(nativeActive()){focused=false;update();return {active:true,native:true,mode:'native'};}
      return focused?{active:true,native:false,mode:'focus'}:enterFocus();
    }catch(_error){return disposed?{active:false,native:false,mode:'window'}:focused?{active:true,native:false,mode:'focus'}:enterFocus();}
    finally{pending=false;}
  };
  return {toggle,enter,prepare,isActive,getStats:()=>({active:isActive(),native:nativeActive(),mode:nativeActive()?'native':focused?'focus':'window',nativeAvailable:nativeAvailable(),nativeRequests,fallbackEntries,changes,pending}),dispose(){
    if(disposed)return;disposed=true;
    for(const item of buttons)item.removeEventListener('click',clicked);
    doc.removeEventListener('fullscreenchange',changed);doc.removeEventListener('webkitfullscreenchange',changed);doc.removeEventListener('keydown',escape,true);
    body.classList.remove('is-fullscreen-game','game-focus-view');
  }};
}
