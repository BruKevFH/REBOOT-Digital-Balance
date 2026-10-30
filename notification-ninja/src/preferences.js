/** Device preferences contain no identity and are separate from saved runs. */
export const PREFERENCES_KEY='notification-ninja:preferences:v1';
const listeners=new Set();
let fallback=null,fallbackStorage=null;
function defaultStorage(){try{return globalThis.localStorage;}catch{return null;}}
function defaults(){return {language:'de',calmEffects:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches};}
export function normalizePreferences(value){const base=defaults();return {language:value?.language==='en'?'en':'de',calmEffects:typeof value?.calmEffects==='boolean'?value.calmEffects:base.calmEffects};}
export function getPreferences(storage=defaultStorage()){
  if(fallback&&storage===fallbackStorage)return {...fallback};
  try{if(storage){const raw=storage.getItem(PREFERENCES_KEY);return raw?normalizePreferences(JSON.parse(raw)):defaults();}}catch{}
  return fallback?{...fallback}:defaults();
}
export function updatePreferences(patch,{storage=defaultStorage()}={}){
  const previous=getPreferences(storage),next=normalizePreferences({...previous,
    ...(patch?.language==='de'||patch?.language==='en'?{language:patch.language}:{}),
    ...(typeof patch?.calmEffects==='boolean'?{calmEffects:patch.calmEffects}:{})});
  try{if(!storage)throw new Error('unavailable');storage.setItem(PREFERENCES_KEY,JSON.stringify(next));fallback=null;fallbackStorage=null;}catch{fallback={...next};fallbackStorage=storage;}
  for(const listener of listeners)listener({...next});
  return {...next};
}
export function onPreferencesChange(listener){listeners.add(listener);return()=>listeners.delete(listener);}
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
  if(event.key===PREFERENCES_KEY||event.key===null)for(const listener of listeners)listener(getPreferences());
});
