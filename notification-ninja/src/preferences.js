/** Device preferences contain no identity and are separate from guest/account saves. */
export const PREFERENCES_KEY='notification-ninja:preferences:v1';
export const PREFERENCE_DEFAULTS=Object.freeze({language:'de',calmEffects:false,musicVolume:.4,effectsVolume:.5,muted:false,screenShake:true});
const listeners=new Set();
let fallback=null,fallbackStorage=null;
function defaultStorage(){try{return globalThis.localStorage;}catch{return null;}}
function defaults(){return {...PREFERENCE_DEFAULTS,calmEffects:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches};}
const volume=(value,base)=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(1,value)):base;
/** Old language/calm-only values migrate in place; unknown and personal fields never survive. */
export function normalizePreferences(value){
  const base=defaults();
  return {language:value?.language==='en'?'en':'de',calmEffects:typeof value?.calmEffects==='boolean'?value.calmEffects:base.calmEffects,
    musicVolume:volume(value?.musicVolume,base.musicVolume),effectsVolume:volume(value?.effectsVolume,base.effectsVolume),
    muted:typeof value?.muted==='boolean'?value.muted:base.muted,screenShake:typeof value?.screenShake==='boolean'?value.screenShake:base.screenShake};
}
export function getPreferences(storage=defaultStorage()){
  if(fallback&&storage===fallbackStorage)return {...fallback};
  try{if(storage){const raw=storage.getItem(PREFERENCES_KEY);return raw?normalizePreferences(JSON.parse(raw)):defaults();}}catch{}
  return defaults();
}
export function updatePreferences(patch,{storage=defaultStorage()}={}){
  const previous=getPreferences(storage),safe={};
  if(patch?.language==='de'||patch?.language==='en')safe.language=patch.language;
  for(const field of ['calmEffects','muted','screenShake'])if(typeof patch?.[field]==='boolean')safe[field]=patch[field];
  for(const field of ['musicVolume','effectsVolume'])if(typeof patch?.[field]==='number'&&Number.isFinite(patch[field]))safe[field]=patch[field];
  const next=normalizePreferences({...previous,...safe});
  try{if(!storage)throw new Error('unavailable');storage.setItem(PREFERENCES_KEY,JSON.stringify(next));if(storage===fallbackStorage){fallback=null;fallbackStorage=null;}}catch{fallback={...next};fallbackStorage=storage;}
  for(const listener of listeners)listener({...next});
  return {...next};
}
export function onPreferencesChange(listener){listeners.add(listener);return()=>listeners.delete(listener);}
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
  if(event.key===PREFERENCES_KEY||event.key===null)for(const listener of listeners)listener(getPreferences());
});
