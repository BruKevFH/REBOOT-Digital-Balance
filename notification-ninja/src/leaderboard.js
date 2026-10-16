const STORAGE_KEY='notification-ninja:leaderboard:v1';
const OPEN_RULESET='open-v2';
const fail=reason=>({ok:false,reason});
const loopback=hostname=>['localhost','127.0.0.1','[::1]'].includes(hostname);

export function validateLeaderboardConfig(value){
  if(!value||value.enabled!==true)return {ok:false,reason:'Online-Rangliste noch nicht verbunden.'};
  let endpoint;try{endpoint=new URL(value.endpoint);}catch{return fail('Die Ranglisten-Adresse ist ungültig.');}
  if(endpoint.username||endpoint.password||endpoint.search||endpoint.hash||!(endpoint.protocol==='https:'||(endpoint.protocol==='http:'&&loopback(endpoint.hostname))))return fail('Die Online-Rangliste braucht eine HTTPS-Adresse.');
  return {ok:true,endpoint:endpoint.href.replace(/\/$/,'')};
}

/** No player data is sent until the player explicitly submits a finished run. */
export function createLeaderboard({configURL='./leaderboard-config.json',storage,fetchImpl=globalThis.fetch,timeout=8000}={}){
  if(storage===undefined){try{storage=globalThis.localStorage;}catch{storage=null;}}
  let config=null,initPromise=null,identity=null,credentialsFailed=false;
  let status={configured:false,online:false,message:'Online-Rangliste noch nicht verbunden.'};
  const getStatus=()=>({...status});
  try{const saved=JSON.parse(storage?.getItem(STORAGE_KEY)||'null');if(saved&&/^[a-f0-9-]{36}$/.test(saved.playerId)&&/^[A-Za-z0-9_-]{43}$/.test(saved.token)&&typeof saved.endpoint==='string')identity=saved;}catch{credentialsFailed=true;}
  async function request(url,options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
    try{
      const response=await fetchImpl(url,{...options,signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
      const body=await response.json();
      if(!response.ok)return {...fail(typeof body?.error==='string'?body.error:'Die Rangliste ist gerade nicht erreichbar.'),...(typeof body?.code==='string'?{code:body.code}:{})};
      return body;
    }catch{return fail('Die Online-Rangliste ist gerade nicht erreichbar. Dein Spielstand bleibt auf diesem Gerät.');}
    finally{clearTimeout(timer);}
  }
  function init(){
    if(initPromise)return initPromise;
    initPromise=(async()=>{
      const value=await request(configURL),result=validateLeaderboardConfig(value);
      if(!result.ok){status={configured:false,online:false,message:result.reason};return getStatus();}
      config=result;status={configured:true,online:false,message:'Ranglisten-Adresse bereit. Ergebnisse werden nur mit deiner Zustimmung veröffentlicht.'};return getStatus();
    })();
    return initPromise;
  }
  const auth=()=>identity&&identity.endpoint===config?.endpoint?{Authorization:`Bearer ${identity.playerId}.${identity.token}`} : {};
  async function load({limit=25}={}){
    await init();if(!config)return fail(status.message);
    // One shared, three-heart competition; campaign difficulty never filters it.
    const query=new URLSearchParams({mode:'open',difficulty:'normal',ruleset:OPEN_RULESET,limit:String(limit)});
    let result=await request(`${config.endpoint}/v2/leaderboard?${query}`,{headers:auth()});
    if(result.ok&&result.ruleset!==OPEN_RULESET)result=fail('Die Rangliste wird gerade aktualisiert. Versuche es später erneut.');
    status.online=result.ok===true;status.message=result.ok?'Gemeinsame Online-Rangliste':result.reason;
    return result;
  }
  async function submit(run,retry=true){
    await init();if(!config)return fail(status.message);
    if(run?.mode!=='open'||run.ruleset!==OPEN_RULESET||run.difficulty!=='normal'||run.result!=='lives')return fail('Nur aktuelle Open Runs mit drei Herzen können veröffentlicht werden.');
    if(credentialsFailed||!storage)return fail('Speichern ist blockiert. Eine löschbare Ranglisten-Anmeldung kann auf diesem Gerät nicht gespeichert werden.');
    if(identity&&identity.endpoint!==config.endpoint)return fail('Deine bisherigen Online-Einträge gehören zu einer anderen Rangliste. Lösche diese zuerst, bevor du den neuen Server verwendest.');
    if(!identity){
      // Check writable local storage before creating a remote identity.
      try{storage.setItem(`${STORAGE_KEY}:check`,'1');storage.removeItem(`${STORAGE_KEY}:check`);}catch{return fail('Speichern ist blockiert. Das Ergebnis wurde nicht veröffentlicht.');}
      const created=await request(`${config.endpoint}/v1/players`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:run?.username})});
      if(!created.ok)return created;
      identity={endpoint:config.endpoint,playerId:created.playerId,token:created.token};
      try{storage.setItem(STORAGE_KEY,JSON.stringify(identity));}catch{
        const cleaned=await request(`${config.endpoint}/v1/player`,{method:'DELETE',headers:auth()});
        identity=null;credentialsFailed=true;
        return fail(cleaned.ok?'Die Anmeldung konnte nicht gespeichert werden. Es wurde kein Ergebnis veröffentlicht.':'Die Anmeldung konnte nicht gespeichert werden. Es wurde kein Ergebnis veröffentlicht; der leere Ranglisten-Zugang konnte gerade nicht entfernt werden.');
      }
    }
    const result=await request(`${config.endpoint}/v2/runs`,{method:'POST',headers:{'Content-Type':'application/json',...auth()},body:JSON.stringify(run)});
    if(result.code==='UNKNOWN_PLAYER'&&retry){
      // An ephemeral free host can lose its database. No remote entries remain for this ID.
      try{storage.removeItem(STORAGE_KEY);}catch{return fail('Der alte Ranglisten-Zugang konnte nicht aktualisiert werden.');}
      identity=null;return submit(run,false);
    }
    status.online=result.ok===true;return result;
  }
  async function deletePlayer(){
    await init();
    if(!identity)return {ok:true,skipped:true};
    // Use the identity's original endpoint even if the public config changed.
    const original=validateLeaderboardConfig({enabled:true,endpoint:identity.endpoint});
    if(!original.ok)return fail('Der gespeicherte Ranglisten-Zugang hat eine ungültige Adresse.');
    const result=await request(`${original.endpoint}/v1/player`,{method:'DELETE',headers:{Authorization:`Bearer ${identity.playerId}.${identity.token}`}});
    if(!result.ok&&result.code!=='UNKNOWN_PLAYER')return result;
    try{storage?.removeItem(STORAGE_KEY);}catch{return fail('Online-Einträge gelöscht. Die lokale Ranglisten-Anmeldung konnte nicht entfernt werden.');}
    identity=null;return {ok:true,deleted:true};
  }
  // Signing out preserves the local credential so later deletion remains possible.
  function disconnect(){status.online=false;return getStatus();}
  return {init,getStatus,load,submit,deletePlayer,disconnect};
}
