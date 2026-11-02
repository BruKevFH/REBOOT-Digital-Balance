import {deleteLocalProfile} from './local-profile.js';

const REMOTE_FAILED='Der alte Ranglistendienst konnte die Löschung nicht bestätigen. Dein lokales Profil bleibt erhalten. Du kannst es später erneut versuchen oder ausdrücklich nur die lokalen Daten löschen. Ein alter Online-Eintrag kann dann bestehen bleiben.';

/**
 * Default: fail closed, never claim remote deletion after a network error.
 * The explicit local-only option keeps the historic leaderboard credential
 * intact so the user can attempt remote deletion again later.
 */
export async function deleteGuestProfile({leaderboard,storage,allowLocalOnly=false,deleteLocal=deleteLocalProfile}={}){
  if(!leaderboard||typeof leaderboard.init!=='function'||typeof leaderboard.deletePlayer!=='function')throw new TypeError('A leaderboard client is required.');
  if(!allowLocalOnly){
    try{
      await leaderboard.init();
      const remote=await leaderboard.deletePlayer();
      if(!remote?.ok)return {ok:false,remotePending:true,reason:REMOTE_FAILED};
    }catch{return {ok:false,remotePending:true,reason:REMOTE_FAILED};}
  }
  const local=deleteLocal(storage);
  if(!local?.ok)return {...local,ok:false,remotePending:false};
  return {...local,ok:true,remotePending:allowLocalOnly,localOnly:allowLocalOnly};
}
