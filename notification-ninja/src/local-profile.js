import {STORAGE_KEY} from './game.js';

export const SESSION_KEY='notification-ninja:session:v1';
const OWN_KEYS=[STORAGE_KEY,SESSION_KEY,'notification-ninja:music'];

// Local session convenience only: this is not server authentication.
export function isSignedIn(storage,hasName){
  if(!hasName)return false;
  try{return storage?.getItem(SESSION_KEY)!=='signed-out';}catch{return true;}
}

export function setSignedIn(storage,value){
  try{storage?.setItem(SESSION_KEY,value?'signed-in':'signed-out');return {ok:true};}
  catch{return {ok:false,reason:'Der Browser kann deine Anmeldung nicht dauerhaft speichern.'};}
}

export function deleteLocalProfile(storage){
  if(!storage)return {ok:true,sessionOnly:true};
  try{
    for(const key of OWN_KEYS)storage.removeItem(key);
    for(const key of OWN_KEYS)if(storage.getItem(key)!==null)throw new Error('not removed');
    return {ok:true,sessionOnly:false};
  }catch{return {ok:false,reason:'Der Browser blockiert das Löschen. Bitte erlaube den Zugriff auf die Website-Daten und versuche es erneut.'};}
}
