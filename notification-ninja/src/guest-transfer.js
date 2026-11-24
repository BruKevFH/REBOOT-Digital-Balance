import {NinjaGame,STORAGE_KEY} from './game.js';
import {CANONICAL_SITE_ORIGIN,LEGACY_SITE_ORIGIN,canonicalGameURL,getSiteLocation} from './site-location.js';

export const GUEST_TRANSFER_VERSION=1;
export const MAX_GUEST_TRANSFER_BYTES=128*1024;
export const GUEST_TRANSFER_TTL=2*60*1000;
const PREFIX='notification-ninja:guest-transfer:';
const TYPES=new Set(['ready','profile','accepted']);
const NONCE=/^[a-f0-9]{64}$/;
const PROTOTYPE_KEYS=new Set(['__proto__','prototype','constructor']);
const PROFILE_KEYS=Object.freeze(['coins','totalRuns','highScores','unlockedSkins','selectedSkin','achievements','tutorialCompleted','player','unlockedSkills','selectedSuper','stats','claimedAchievements','unlockedWorlds','unlockedBackgrounds','selectedBackgrounds','journey','adventure']);
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const transferError=code=>Object.assign(new Error('Der lokale Gastspielstand konnte nicht sicher übertragen werden.'),{code});

/** Accept bounded JSON data only, before reading properties or normalizing a save. */
export function isSafeGuestTransferData(value){
  const seen=new Set();let nodes=0;
  function visit(item,depth){
    if(++nodes>10000||depth>16)return false;
    if(item===null||typeof item==='boolean')return true;
    if(typeof item==='string')return item.length<=MAX_GUEST_TRANSFER_BYTES;
    if(typeof item==='number')return Number.isFinite(item);
    if(typeof item!=='object'||seen.has(item))return false;
    const array=Array.isArray(item),prototype=Object.getPrototypeOf(item);
    if(array?prototype!==Array.prototype:prototype!==Object.prototype&&prototype!==null)return false;
    seen.add(item);
    const keys=Reflect.ownKeys(item);
    if(keys.length>10000)return false;
    for(const key of keys){
      if(array&&key==='length')continue;
      if(typeof key!=='string'||PROTOTYPE_KEYS.has(key))return false;
      const descriptor=Object.getOwnPropertyDescriptor(item,key);
      if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value')||!visit(descriptor.value,depth+1))return false;
    }
    seen.delete(item);return true;
  }
  try{return visit(value,0)&&new TextEncoder().encode(JSON.stringify(value)).length<=MAX_GUEST_TRANSFER_BYTES;}
  catch{return false;}
}

/** Reuse the game rules with private memory, never account storage or run state. */
export function normalizeGuestProfile(value,{now=()=>Date.now()}={}){
  if(!record(value)||!isSafeGuestTransferData(value)||!PROFILE_KEYS.some(key=>Object.hasOwn(value,key)))throw transferError('INVALID_GUEST_PROFILE');
  const picked=Object.fromEntries(PROFILE_KEYS.filter(key=>Object.hasOwn(value,key)).map(key=>[key,value[key]]));
  const initial=new NinjaGame({storage:null,now}).exportData();
  let memory=JSON.stringify({...initial,profile:picked});
  const storage={getItem:key=>key===STORAGE_KEY?memory:null,setItem:(key,data)=>{if(key===STORAGE_KEY)memory=String(data);}};
  const game=new NinjaGame({storage,now});
  if(game.storageFailed)throw transferError('INVALID_GUEST_PROFILE');
  // Explicit output whitelist also prevents a future account field in NinjaGame
  // from silently extending this guest-only protocol.
  const profile=Object.fromEntries(PROFILE_KEYS.filter(key=>Object.hasOwn(game.profile,key)).map(key=>[key,game.profile[key]]));
  if(!isSafeGuestTransferData(profile))throw transferError('INVALID_GUEST_PROFILE');
  return JSON.parse(JSON.stringify(profile));
}

export function createGuestTransferNonce(crypto=globalThis.crypto){
  if(typeof crypto?.getRandomValues!=='function')throw transferError('SECURE_RANDOM_UNAVAILABLE');
  const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);
  return Array.from(bytes,value=>value.toString(16).padStart(2,'0')).join('');
}

export function guestTransferNonceFromHash(hash){
  if(typeof hash!=='string')return null;
  const match=/^#guest-transfer=([a-f0-9]{64})$/.exec(hash);
  return match&&match[0].length===hash.length?match[1]:null;
}

/** A trusted origin is insufficient: the exact opened window and nonce must match. */
export function isGuestTransferMessage(event,{origin,source,nonce,type}={}){
  if(!source||event?.source!==source||event?.origin!==origin||typeof nonce!=='string'||nonce.length!==64||!NONCE.test(nonce))return false;
  const data=event.data;
  if(!record(data)||!isSafeGuestTransferData(data)||data.version!==GUEST_TRANSFER_VERSION||data.nonce!==nonce)return false;
  if(typeof data.type!=='string'||!data.type.startsWith(PREFIX))return false;
  const kind=data.type.slice(PREFIX.length);
  if(!TYPES.has(kind)||type&&kind!==type)return false;
  const keys=Object.keys(data).sort().join(',');
  return keys===(kind==='profile'?'nonce,profile,type,version':'nonce,type,version')&&(kind!=='profile'||record(data.profile));
}

const message=(type,nonce,extra={})=>({type:PREFIX+type,version:GUEST_TRANSFER_VERSION,nonce,...extra});
const status=(callback,value,extra={})=>{try{callback?.({status:value,...extra});}catch{/* UI callbacks cannot weaken protocol checks. */}};
const post=(target,data,origin)=>{try{target.postMessage(data,origin);return true;}catch{return false;}};

/** Call start only from the old site's explicit transfer button. */
export function createGuestTransferSender({window:win=globalThis.window,location=win?.location,getProfile,onStatus,now=()=>Date.now(),crypto=win?.crypto||globalThis.crypto}={}){
  let popup=null,nonce=null,listener=null,timer=null,active=false,sent=false,expiresAt=0;
  const timers=win||globalThis;
  function cleanup(){if(listener)win?.removeEventListener('message',listener);if(timer!==null)timers.clearTimeout(timer);listener=null;timer=null;active=false;}
  function destroy(){cleanup();popup=null;nonce=null;}
  function start(){
    destroy();
    if(!getSiteLocation(location).isLegacy||typeof win?.open!=='function'||typeof getProfile!=='function'){status(onStatus,'unavailable');return {ok:false,status:'unavailable'};}
    try{nonce=createGuestTransferNonce(crypto);}catch{status(onStatus,'unavailable');return {ok:false,status:'unavailable'};}
    sent=false;active=true;expiresAt=now()+GUEST_TRANSFER_TTL;
    listener=event=>{
      if(!active||now()>expiresAt)return;
      if(isGuestTransferMessage(event,{origin:CANONICAL_SITE_ORIGIN,source:popup,nonce,type:'ready'})){
        if(sent)return;
        let profile;try{profile=normalizeGuestProfile(getProfile(),{now});}catch{cleanup();status(onStatus,'invalid-profile');return;}
        sent=true;
        if(!post(popup,message('profile',nonce,{profile}),CANONICAL_SITE_ORIGIN)){cleanup();status(onStatus,'failed');return;}
        status(onStatus,'awaiting-accept');
      }else if(sent&&isGuestTransferMessage(event,{origin:CANONICAL_SITE_ORIGIN,source:popup,nonce,type:'accepted'})){
        cleanup();status(onStatus,'complete');
      }
    };
    win.addEventListener('message',listener);
    // The fragment contains only a fresh random nonce. Profiles and account
    // credentials never appear in a URL, query string, referrer or window name.
    try{popup=win.open(canonicalGameURL().split('#')[0]+'#guest-transfer='+nonce,'_blank','popup');}catch{popup=null;}
    if(!popup){cleanup();status(onStatus,'popup-blocked');return {ok:false,status:'popup-blocked'};}
    timer=timers.setTimeout(()=>{cleanup();status(onStatus,'expired');},GUEST_TRANSFER_TTL);
    status(onStatus,'waiting');return {ok:true,status:'waiting'};
  }
  return Object.freeze({start,destroy});
}

/** Receipt prepares a preview; only accept() may call the import callback. */
export function createGuestTransferReceiver({window:win=globalThis.window,location=win?.location,onImport,onStatus,now=()=>Date.now()}={}){
  let opener=null,nonce=null,listener=null,retry=null,timer=null,profile=null,active=false,accepting=false,expiresAt=0;
  const timers=win||globalThis;
  function cleanup(){if(listener)win?.removeEventListener('message',listener);if(retry!==null)timers.clearInterval(retry);if(timer!==null)timers.clearTimeout(timer);listener=null;retry=null;timer=null;active=false;}
  function destroy(){cleanup();profile=null;nonce=null;opener=null;accepting=false;}
  function start(){
    destroy();
    nonce=guestTransferNonceFromHash(location?.hash||'');opener=win?.opener;
    if(!getSiteLocation(location).isCanonical||!nonce||!opener||opener===win||typeof onImport!=='function')return {ok:false,status:'unavailable'};
    active=true;expiresAt=now()+GUEST_TRANSFER_TTL;
    try{win.history?.replaceState(win.history.state,'',location.pathname+(location.search||'')+'#overview');}catch{/* Fragment never reaches the server. */}
    listener=event=>{
      if(!active||profile||now()>expiresAt||!isGuestTransferMessage(event,{origin:LEGACY_SITE_ORIGIN,source:opener,nonce,type:'profile'}))return;
      try{profile=normalizeGuestProfile(event.data.profile,{now});}catch{status(onStatus,'invalid-profile');return;}
      if(retry!==null)timers.clearInterval(retry);retry=null;
      status(onStatus,'awaiting-accept',{profile:JSON.parse(JSON.stringify(profile))});
    };
    win.addEventListener('message',listener);
    const ready=()=>post(opener,message('ready',nonce),LEGACY_SITE_ORIGIN);
    retry=timers.setInterval(ready,500);
    timer=timers.setTimeout(()=>{cleanup();profile=null;status(onStatus,'expired');},GUEST_TRANSFER_TTL);
    status(onStatus,'waiting');ready();return {ok:true,status:'waiting'};
  }
  async function accept(){
    if(!active||!profile||accepting||now()>expiresAt)return {ok:false,status:'unavailable'};
    accepting=true;
    try{
      // A detached object prevents the UI's preview from changing the import.
      const result=await onImport(JSON.parse(JSON.stringify(profile)));
      if(result?.ok===false)throw transferError('IMPORT_FAILED');
      if(!active)return {ok:false,status:'unavailable'};
      post(opener,message('accepted',nonce),LEGACY_SITE_ORIGIN);
      cleanup();profile=null;status(onStatus,'complete');
      try{win.opener=null;}catch{}
      return {ok:true,status:'complete'};
    }catch{if(active)status(onStatus,'import-failed');return {ok:false,status:'import-failed'};}
    finally{accepting=false;}
  }
  return Object.freeze({start,accept,destroy});
}
