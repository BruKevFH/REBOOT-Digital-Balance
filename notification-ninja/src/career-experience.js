import {getLanguage,onLanguageChange} from './i18n.js';

const controllers=new WeakMap();
let sequence=0;
const labels=()=>getLanguage()==='en'?{title:'Mission details',close:'Close mission'}:{title:'Missionsdetails',close:'Mission schließen'};
const safeId=value=>typeof value==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/i.test(value)?value:null;

/** Presents the existing mission inspector without copying or changing mission state. */
export function createCareerExperience({container,onClose=()=>{}}={}){
  if(!container?.querySelector||!container.ownerDocument)throw new TypeError('Career experience requires a DOM container.');
  controllers.get(container)?.destroy();
  const doc=container.ownerDocument,win=doc.defaultView||globalThis.window;
  const media=win.matchMedia?.('(max-width: 899px)');
  let active=true,dialog=null,detail=null,placeholder=null,returnFocus=null,returnScroll=null,missionId=null;
  const isMobile=()=>media?media.matches:Number(win.innerWidth)<=899;
  const isOpen=()=>Boolean(dialog?.open||dialog?.hasAttribute('open'));
  function targetFor(id){
    const value=safeId(id);return value?container.querySelector(`[data-mission-inspect="${value}"]`):null;
  }
  function restoreDetail(){
    if(detail&&placeholder?.isConnected)placeholder.replaceWith(detail);
    placeholder?.remove();placeholder=null;detail=null;
  }
  function closeDetails({restoreFocus=true,restoreScroll=true,notify=true}={}){
    if(!dialog)return false;
    const wasOpen=isOpen(),closing=dialog,focus=returnFocus,scroll=returnScroll;
    dialog=null;returnFocus=null;returnScroll=null;
    closing.removeEventListener('cancel',cancel);
    closing.removeEventListener('close',nativeClosed);
    closing.removeEventListener('click',dialogClick);
    if(closing.open&&typeof closing.close==='function')closing.close();
    restoreDetail();closing.remove();
    if(restoreScroll&&scroll)win.scrollTo({left:scroll.left,top:scroll.top,behavior:'auto'});
    if(restoreFocus&&focus?.isConnected)focus.focus({preventScroll:true});
    if(wasOpen&&notify)onClose({missionId});
    return wasOpen;
  }
  function cancel(event){event.preventDefault();closeDetails();}
  function nativeClosed(){closeDetails();}
  function dialogClick(event){
    if(event.target.closest?.('[data-career-sheet-close]')){event.preventDefault();event.stopPropagation();closeDetails();return;}
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDetails();
  }
  function updateLabels(){
    if(!dialog)return;
    const text=labels();dialog.querySelector('.career-sheet-heading').textContent=text.title;
    const close=dialog.querySelector('[data-career-sheet-close]');close.setAttribute('aria-label',text.close);
    close.querySelector('span:last-child').textContent=text.close;
  }
  function openDetails({trigger,missionId:requestedId}={}){
    if(!active)return false;
    if(!isMobile()){
      const inspector=container.querySelector('.nn-career-detail');
      inspector?.scrollIntoView({block:'nearest',behavior:'auto'});
      return false;
    }
    if(isOpen())return true;
    detail=container.querySelector('.nn-career-detail');if(!detail)return false;
    missionId=safeId(requestedId)||safeId(detail.querySelector('[data-mission-start]')?.dataset.missionStart);
    returnFocus=trigger?.isConnected?trigger:targetFor(missionId)||doc.activeElement;
    returnScroll={left:win.scrollX||0,top:win.scrollY||0};
    placeholder=doc.createComment('career mission inspector');detail.before(placeholder);
    dialog=doc.createElement('dialog');dialog.className='career-mission-sheet';
    dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
    const titleId='career-mission-sheet-title-'+(++sequence);dialog.setAttribute('aria-labelledby',titleId);
    const header=doc.createElement('header');header.className='career-sheet-header';
    const heading=doc.createElement('h2');heading.id=titleId;heading.className='career-sheet-heading';
    const close=doc.createElement('button');close.type='button';close.className='career-sheet-close';close.dataset.careerSheetClose='';
    const cross=doc.createElement('span');cross.setAttribute('aria-hidden','true');cross.textContent='×';
    const closeText=doc.createElement('span');close.append(cross,closeText);header.append(heading,close);
    const body=doc.createElement('div');body.className='career-mission-sheet-body';body.append(detail);dialog.append(header,body);
    dialog.addEventListener('cancel',cancel);dialog.addEventListener('close',nativeClosed);dialog.addEventListener('click',dialogClick);
    container.append(dialog);updateLabels();
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    close.focus({preventScroll:true});
    return true;
  }
  function keydown(event){
    if(!active||!isOpen())return;
    if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeDetails();return;}
    // Native dialogs trap Tab themselves; the fallback supports older engines too.
    if(event.key!=='Tab'||typeof dialog.showModal==='function')return;
    const items=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(node=>node.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(!first){event.preventDefault();return;}
    if(event.shiftKey&&(doc.activeElement===first||!dialog.contains(doc.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(doc.activeElement===last||!dialog.contains(doc.activeElement))){event.preventDefault();first.focus();}
  }
  function viewportChanged(){if(isOpen()&&!isMobile())closeDetails();}
  function navigate(event){
    const control=event.target.closest?.('[data-career-chapter],[data-career-next]');
    if(!control||!container.contains(control))return;
    event.preventDefault();event.stopPropagation();
    const chapter=control.dataset.careerChapter,next=safeId(control.dataset.careerNext);
    const target=['study','gaming','sleep'].includes(chapter)?container.querySelector('#campaign-region-'+chapter):targetFor(next);
    if(!target)return;
    const calm=win.matchMedia?.('(prefers-reduced-motion: reduce)').matches||doc.body?.classList.contains('calm-view');
    target.scrollIntoView({block:'start',behavior:calm?'auto':'smooth'});
    if(target.matches('button,a,[tabindex]'))target.focus({preventScroll:true});
  }
  doc.addEventListener('keydown',keydown,true);container.addEventListener('click',navigate);
  if(media?.addEventListener)media.addEventListener('change',viewportChanged);else win.addEventListener('resize',viewportChanged);
  const stopLanguage=onLanguageChange(updateLabels);
  function destroy(){
    if(!active)return;active=false;closeDetails({restoreFocus:false,restoreScroll:false,notify:false});
    doc.removeEventListener('keydown',keydown,true);container.removeEventListener('click',navigate);
    if(media?.removeEventListener)media.removeEventListener('change',viewportChanged);else win.removeEventListener('resize',viewportChanged);
    stopLanguage();if(controllers.get(container)===controller)controllers.delete(container);
  }
  const controller=Object.freeze({openDetails,closeDetails,destroy,getState:()=>({active,open:isOpen(),mobile:isMobile(),missionId})});
  controllers.set(container,controller);return controller;
}
