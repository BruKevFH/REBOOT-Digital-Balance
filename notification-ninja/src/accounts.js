/** Real accounts use an opaque, short-lived token in this tab's sessionStorage only. */
export const ACCOUNT_SESSION_KEY='notification-ninja:account-session:v3';
export const ACCOUNT_CACHE_PREFIX='notification-ninja:account-cache:v3:';
const copy=value=>value==null?value:JSON.parse(JSON.stringify(value));
const loopback=host=>['localhost','127.0.0.1','[::1]'].includes(host);
export const ACCOUNT_WARMUP_DELAYS=Object.freeze([1000,2000,4000,8000,12000]);
const connectionPending='Die Online-Verbindung ist noch nicht bereit. Dein Gastspiel bleibt verfügbar. Bitte versuche es erneut.';
const cancelled=()=>new AccountError('Die Verbindungsprüfung wurde abgebrochen.',{code:'REQUEST_CANCELLED'});
export class AccountError extends Error{constructor(message,{code='REQUEST_FAILED',status=0,retryable=false}={}){super(message);this.name='AccountError';this.code=code;this.status=status;this.retryable=retryable;}}
/** Friendly form feedback; the server independently enforces every signup rule. */
export function validateRegistration({email,password,passwordConfirmation,privacyAccepted}={}){
  if(typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim()))return {ok:false,field:'email',message:'Bitte gib eine gültige E-Mail-Adresse ein.'};
  if(password!==passwordConfirmation)return {ok:false,field:'passwordConfirmation',message:'Die Passwörter stimmen nicht überein.'};
  if(privacyAccepted!==true)return {ok:false,field:'privacyAccepted',message:'Bitte stimme den Datenschutzhinweisen zu.'};
  return {ok:true};
}
export function validateAccountsConfig(value,baseURL=globalThis.location?.href||'http://localhost/'){
  if(value?.enabled!==true)return {configured:false,message:'Online-Konten sind hier noch nicht verbunden. Du kannst als Gast spielen.'};
  let endpoint;try{endpoint=new URL(value.endpoint||'/api/v3',baseURL);}catch{return {configured:false,message:'Die Konto-Adresse ist ungültig.'};}
  if(endpoint.username||endpoint.password||endpoint.search||endpoint.hash||!(endpoint.protocol==='https:'||endpoint.protocol==='http:'&&loopback(endpoint.hostname)))return {configured:false,message:'Online-Konten brauchen eine sichere HTTPS-Adresse.'};
  return {configured:true,endpoint:endpoint.href.replace(/\/$/,''),message:'Online-Konten sind bereit.'};
}
export function createAccountStorage(storage,userId){
  const prefix=ACCOUNT_CACHE_PREFIX+encodeURIComponent(userId)+':',memory=new Map();
  return {getItem(key){try{const value=storage?.getItem(prefix+key);return value??memory.get(key)??null;}catch{return memory.get(key)??null;}},setItem(key,value){memory.set(key,String(value));try{storage?.setItem(prefix+key,String(value));}catch{}},removeItem(key){memory.delete(key);try{storage?.removeItem(prefix+key);}catch{}},clear(){memory.clear();try{for(let i=storage.length-1;i>=0;i--){const key=storage.key(i);if(key?.startsWith(prefix))storage.removeItem(key);}}catch{}},prefix};
}
export function createAccounts({fetchImpl=globalThis.fetch,sessionStorage,configURL='./accounts-config.json',baseURL=globalThis.location?.href||'http://localhost/',timeout=10000,now=()=>Date.now()}={}){
  if(sessionStorage===undefined)try{sessionStorage=globalThis.sessionStorage;}catch{}
  let config=null,session=null,initPromise=null,configGeneration=0,warmupTask=null,generation=0,authGeneration=0,status={configured:false,online:false,warming:false,phase:'checking-config',message:'Kontoverbindung wird geprüft.'};
  const listeners=new Set(),pendingActions=new Map(),emit=()=>{for(const fn of listeners)fn(getStatus());};
  const getStatus=()=>({...status,signedIn:Boolean(session),username:session?.user?.username||null});
  try{const saved=JSON.parse(sessionStorage?.getItem(ACCOUNT_SESSION_KEY)||'null');if(saved&&/^[A-Za-z0-9_-]{43}$/.test(saved.token)&&typeof saved.user?.id==='string'&&saved.expiresAt>now())session=saved;else sessionStorage?.removeItem(ACCOUNT_SESSION_KEY);}catch{}
  function retain(result,{newSession=false}={}){if(newSession)generation++;session={user:copy(result.user),token:result.token||session?.token,expiresAt:result.expiresAt||session?.expiresAt,profile:copy(result.profile),revision:result.revision,endpoint:config?.endpoint};try{sessionStorage?.setItem(ACCOUNT_SESSION_KEY,JSON.stringify(session));}catch{}emit();return result;}
  function forget(){generation++;authGeneration++;pendingActions.clear();const oldId=session?.user?.id;session=null;try{sessionStorage?.removeItem(ACCOUNT_SESSION_KEY);if(oldId)createAccountStorage(sessionStorage,oldId).clear();}catch{}emit();}
  function connection(next){status={...status,...next};emit();}
  async function request(url,{method='GET',body,authenticated=true,signal,updateStatus=true}={}){
    if(signal?.aborted)throw cancelled();
    const owner=authenticated?identity():null,controller=new AbortController();let rejectAbort;
    const aborted=new Promise((_,reject)=>{rejectAbort=reject;});
    const abort=()=>{controller.abort();rejectAbort(cancelled());};
    signal?.addEventListener('abort',abort,{once:true});
    const timer=setTimeout(()=>{controller.abort();rejectAbort(new AccountError(connectionPending,{code:'CONNECTION_TIMEOUT',retryable:true}));},timeout);
    const current=()=>updateStatus&&(!owner||isCurrent(owner));
    try{
      const headers={Accept:'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(authenticated&&session?.token)headers.Authorization=`Bearer ${session.token}`;
      const response=await Promise.race([fetchImpl(url,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}),aborted]);
      let data;try{data=await Promise.race([response.json(),aborted]);}catch(error){if(error instanceof AccountError)throw error;throw new AccountError(connectionPending,{code:response.status>=500?'SERVICE_WAKING':'INVALID_RESPONSE',status:response.status,retryable:true});}
      if(!data||typeof data!=='object'||Array.isArray(data))throw new AccountError(connectionPending,{code:'INVALID_RESPONSE',status:response.status,retryable:true});
      if(current())connection({online:response.status<500,warming:false,phase:response.status<500?'ready':'offline',message:response.status<500?'Online-Konten sind bereit.':connectionPending});
      if(!response.ok||data?.ok===false){const statusCode=response.status;throw new AccountError(typeof data?.error==='string'?data.error:typeof data?.message==='string'?data.message:typeof data?.reason==='string'?data.reason:'Die Anfrage konnte nicht abgeschlossen werden.',{code:data?.code||'REQUEST_FAILED',status:statusCode,retryable:statusCode===429||statusCode>=500});}
      return data;
    }catch(error){if(current()&&(!(error instanceof AccountError)||['INVALID_RESPONSE','SERVICE_WAKING','CONNECTION_TIMEOUT'].includes(error.code)))connection({online:false,warming:false,phase:'offline',message:connectionPending});if(error instanceof AccountError)throw error;throw new AccountError('Die Verbindung ist unterbrochen. Dein Gastspiel bleibt verfügbar. Versuche es erneut.',{code:'NETWORK',retryable:true});}
    finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
  function init({retry=false}={}){if(retry){initPromise=null;warmupTask?.controller.abort();}if(initPromise)return initPromise;const attempt=++configGeneration;initPromise=(async()=>{try{const raw=await request(new URL(configURL,baseURL).href,{authenticated:false,updateStatus:false}),checked=validateAccountsConfig(raw,baseURL);if(attempt!==configGeneration)return getStatus();config=checked.configured?checked:null;status={...checked,online:false,warming:false,phase:checked.configured?'configured':'disabled',message:checked.configured?'Online-Verbindung wird hergestellt …':checked.message};if(session&&session.endpoint!==config?.endpoint)forget();}catch(error){if(attempt!==configGeneration)return getStatus();config=null;status={configured:false,online:false,warming:false,phase:'offline',message:error.message};}emit();return getStatus();})();return initPromise;}
  function wait(milliseconds,signal){return new Promise((resolve,reject)=>{if(signal.aborted)return reject(cancelled());const abort=()=>{clearTimeout(timer);reject(cancelled());};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},milliseconds);signal.addEventListener('abort',abort,{once:true});});}
  function joinWarmup(task,signal){
    if(signal?.aborted){if(!task.callers)task.controller.abort();return Promise.reject(cancelled());}
    task.callers++;
    return new Promise((resolve,reject)=>{let finished=false;const finish=(value,error)=>{if(finished)return;finished=true;signal?.removeEventListener('abort',abort);task.callers--;if(!task.callers&&!task.done)task.controller.abort();(error?reject:resolve)(value);};const abort=()=>finish(cancelled(),true);signal?.addEventListener('abort',abort,{once:true});task.promise.then(value=>finish(value,false),error=>finish(error,true));});
  }
  /** Bounded, shared GET-only readiness check. Never sends credentials or retries a mutation. */
  function warmup({signal,delays=ACCOUNT_WARMUP_DELAYS}={}){
    if(signal?.aborted)return Promise.reject(cancelled());
    if(!Array.isArray(delays)||delays.length>5||delays.some(value=>!Number.isSafeInteger(value)||value<0||value>30000))return Promise.reject(new TypeError('Warmup delays must be at most five bounded intervals.'));
    if(warmupTask?.controller.signal.aborted)warmupTask=null;
    if(!warmupTask){
      const task={controller:new AbortController(),callers:0,done:false,promise:null};warmupTask=task;
      task.promise=(async()=>{
        let endpoint,configuration;
        try{
          await init();if(task.controller.signal.aborted)throw cancelled();
          if(!config)return getStatus();endpoint=config.endpoint;configuration=configGeneration;
          for(let attempt=0;attempt<=delays.length;attempt++){
            if(task.controller.signal.aborted)throw cancelled();
            if(config?.endpoint!==endpoint||configGeneration!==configuration)throw new AccountError('Die Kontoverbindung wurde inzwischen geändert.',{code:'STALE_CONNECTION',status:409});
            connection({online:false,warming:true,phase:'warming',attempt:attempt+1,message:'Der Online-Dienst wird gestartet. Du kannst sofort als Gast spielen.'});
            try{
              const health=await request(endpoint+'/health',{authenticated:false,signal:task.controller.signal,updateStatus:false});
              if(health.ok!==true||health.apiVersion!==3)throw new AccountError(connectionPending,{code:'INVALID_RESPONSE',retryable:true});
              if(task.controller.signal.aborted)throw cancelled();
              if(config?.endpoint!==endpoint||configGeneration!==configuration)throw new AccountError('Die Kontoverbindung wurde inzwischen geändert.',{code:'STALE_CONNECTION',status:409});
              connection({online:true,warming:false,phase:'ready',message:'Online-Konten sind bereit.'});return getStatus();
            }catch(error){if(task.controller.signal.aborted)throw cancelled();if(!error.retryable||attempt===delays.length)throw error;await wait(delays[attempt],task.controller.signal);}
          }
        }catch(error){if(warmupTask===task&&(!endpoint||config?.endpoint===endpoint&&configGeneration===configuration))connection({online:false,warming:false,phase:'offline',message:error.code==='REQUEST_CANCELLED'?'Die Verbindungsprüfung wurde abgebrochen.':connectionPending});throw error;}
        finally{task.done=true;if(warmupTask===task)warmupTask=null;}
      })();
    }
    return joinWarmup(warmupTask,signal);
  }
  async function api(path,options={}){const origin=identity();await init();if(options.authenticated!==false)fresh(origin);if(!config)throw new AccountError(status.message,{code:'NOT_CONFIGURED',retryable:true});if(options.authenticated!==false&&!session)throw new AccountError('Bitte melde dich an.',{code:'UNAUTHENTICATED',status:401});try{const result=await request(config.endpoint+path,options);if(options.authenticated!==false)fresh(origin);return result;}catch(error){if(options.authenticated!==false&&error.status===401&&isCurrent(origin))forget();throw error;}}
  const identity=()=>({generation,userId:session?.user?.id,token:session?.token});
  const isCurrent=origin=>origin.generation===generation&&origin.userId===session?.user?.id&&origin.token===session?.token;
  function fresh(origin){if(!isCurrent(origin))throw new AccountError('Diese Antwort gehört zu einer früheren Anmeldung.',{code:'STALE_SESSION',status:409});}
  async function authenticate(path,input){const authAttempt=++authGeneration;const result=await api('/auth/'+path,{method:'POST',body:input,authenticated:false});if(authAttempt!==authGeneration)throw new AccountError('Diese Anmeldung wurde inzwischen ersetzt.',{code:'STALE_SESSION',status:409});if(result.mfaRequired&&typeof result.challenge==='string'&&!result.token)return {mfaRequired:true,challenge:result.challenge,expiresAt:result.expiresAt};if(!result.user?.id||!result.token||!result.profile)throw new AccountError('Die Konto-Antwort ist unvollständig.',{code:'INVALID_RESPONSE'});return retain(result,{newSession:true});}
  async function restore({signal}={}){if(!session)return null;if(session.expiresAt<=now()){forget();return null;}const origin=identity();await init();fresh(origin);try{const result=await api('/me',{signal});fresh(origin);if(Number.isFinite(session.revision)&&Number.isFinite(result.revision)&&result.revision<session.revision)return {user:copy(session.user),profile:copy(session.profile),revision:session.revision};retain({...result,user:result.user||session.user});return {...result,user:result.user||session.user};}catch(error){if((error.status===401||error.status===404)&&isCurrent(origin))forget();throw error;}}
  function applyState(result,origin){fresh(origin);if(session&&result.profile&&(!Number.isFinite(session.revision)||!Number.isFinite(result.revision)||result.revision>=session.revision)){session.profile=copy(result.profile);session.revision=result.revision;retain({...session,...result});}return result;}
  return {init,warmup,getStatus,getSession:()=>copy(session),subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},register:input=>authenticate('register',input),login:input=>authenticate('login',input),reset:input=>authenticate('reset',input),resetPassword:input=>authenticate('reset',input),restore,
    completeMfa:(challenge,code)=>authenticate('mfa/verify',{challenge,code}),
    mfaStatus:()=>api('/mfa/status'),
    mfaSetup:password=>api('/mfa/setup',{method:'POST',body:{password}}),
    mfaConfirm:code=>api('/mfa/confirm',{method:'POST',body:{code}}),
    mfaDisable:(password,code)=>api('/mfa/disable',{method:'POST',body:{password,code}}),
    async logout(){const origin=identity();try{if(session)await api('/auth/logout',{method:'POST',body:{}});}finally{if(isCurrent(origin))forget();}return {ok:true};},
    async deleteAccount(input){const origin=identity(),result=await api('/account',{method:'DELETE',body:input});fresh(origin);forget();return result;},
    async rename(username){const origin=identity(),result=await api('/profile',{method:'PATCH',body:{username}});fresh(origin);if(result.user&&session&&(!Number.isFinite(result.revision)||result.revision>=session.revision))session.user=result.user;return applyState(result,origin);},
    async action(type,id,payload,idempotencyKey){const origin=identity(),signature=JSON.stringify([origin.generation,origin.userId,type,id??null,payload??null]),key=idempotencyKey||pendingActions.get(signature)||globalThis.crypto?.randomUUID?.()||`${now()}-${Math.random().toString(36).slice(2)}`;if(!idempotencyKey){if(pendingActions.size>=128)pendingActions.delete(pendingActions.keys().next().value);pendingActions.set(signature,key);}try{const result=applyState(await api('/actions',{method:'POST',body:{type,...(id!==undefined?{id}:{}),...(payload!==undefined&&payload!==null?{payload}:{}),idempotencyKey:key}}),origin);if(pendingActions.get(signature)===key)pendingActions.delete(signature);return result;}catch(error){if(!error.retryable&&pendingActions.get(signature)===key)pendingActions.delete(signature);throw error;}},
    start:input=>api('/runs/start',{method:'POST',body:input}),
    async finish(id,commands){const origin=identity();return applyState(await api(`/runs/${encodeURIComponent(id)}/finish`,{method:'POST',body:{commands}}),origin);},
    publish:id=>api(`/runs/${encodeURIComponent(id)}/publish`,{method:'POST',body:{}}),
    async leaderboard({limit=25,period='all'}={}){await init();if(!config)throw new AccountError(status.message,{code:'NOT_CONFIGURED',retryable:true});return request(config.endpoint+`/leaderboard?ruleset=open-v2&limit=${Math.max(1,Math.min(100,limit))}&period=${['all','today','week'].includes(period)?period:'all'}`,{authenticated:true});},
    forget,storage:sessionStorage
  };
}
