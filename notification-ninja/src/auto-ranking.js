/** Newly finished account runs only. The server still owns every ranking decision. */
export const AUTO_RANKING_PREFIX='notification-ninja:auto-ranking:v1:';
export const AUTO_RANKING_MAX_PENDING=128;
const HARD_LIMIT=256;
const RUN_ID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const validUser=value=>typeof value==='string'&&value.length>0&&value.length<=128;
const terminalCodes=new Set(['RUN_NOT_FOUND','RUN_NOT_RANKED','ADMIN_TEST_ACCOUNT','INVALID_REQUEST']);

export const autoRankingKey=userId=>{
  if(!validUser(userId))throw new TypeError('An account identity is required.');
  return AUTO_RANKING_PREFIX+encodeURIComponent(userId);
};

export function eligibleForAutoRanking(run,identity){
  return identity?.authenticated===true&&validUser(identity.userId)&&identity.admin!==true&&
    identity.role!=='admin'&&identity.sandbox!==true&&identity.unlimitedCoins!==true&&
    run?.verified===true&&Number.isFinite(run.score)&&run.score>0&&run.mode==='open'&&run.result==='lives'&&
    run.ruleset==='open-v2'&&run.published===false&&typeof run.id==='string'&&RUN_ID.test(run.id);
}

/**
 * enqueue(run) persists a NEW server-confirmed result; flush() retries that outbox.
 * Nothing scans historical scores, imports guest results or invents score values.
 * Logout blocks through getIdentity; destroy disposes this instance permanently.
 * Pending work survives either operation; clearUser is for confirmed deletion.
 */
export function createAutoRankingPublisher({accounts,storage,getIdentity,onStatus,maxPending=AUTO_RANKING_MAX_PENDING}={}){
  if(typeof accounts?.publish!=='function')throw new TypeError('The real accounts.publish operation is required.');
  if(!Number.isInteger(maxPending)||maxPending<1||maxPending>HARD_LIMIT)throw new TypeError('Invalid pending-run limit.');
  getIdentity??=()=>{
    const session=accounts.getSession?.();
    return {userId:session?.user?.id,authenticated:Boolean(session?.user?.id),admin:session?.profile?.adminSandbox===true||session?.account?.sandbox===true||session?.account?.role==='admin'};
  };
  if(typeof getIdentity!=='function')throw new TypeError('An account identity reader is required.');
  const queues=new Map(),generations=new Map();
  let destroyed=false,inFlight=null,flightUserId=null;
  function identity(){try{return getIdentity()||{};}catch{return {};}}
  function active(value){return !destroyed&&value?.authenticated===true&&validUser(value.userId)&&value.admin!==true&&value.role!=='admin'&&value.sandbox!==true&&value.unlimitedCoins!==true;}
  function current(userId,generation){const value=identity();return active(value)&&value.userId===userId&&(generations.get(userId)||0)===generation;}
  function queue(userId){
    if(queues.has(userId))return queues.get(userId);
    const value={pending:[],durable:false,blocked:false,readable:true};
    if(storage&&typeof storage.getItem==='function'){
      try{
        const raw=storage.getItem(autoRankingKey(userId));
        if(raw!==null&&raw!==undefined){
          if(typeof raw!=='string'||raw.length>20000)throw new Error('Invalid outbox.');
          const parsed=JSON.parse(raw);
          if(parsed?.version!==1||!Array.isArray(parsed.pending)||parsed.pending.length>HARD_LIMIT||parsed.pending.some(id=>typeof id!=='string'||!RUN_ID.test(id))||Object.keys(parsed).some(key=>!['version','pending'].includes(key)))throw new Error('Invalid outbox.');
          value.pending=[...new Set(parsed.pending)];
        }
        value.durable=true;
      }catch(error){
        // A read failure must never overwrite unread pending work. Memory-only
        // delivery remains possible when browser storage itself is unavailable.
        value.readable=false;
        try{value.blocked=storage.getItem(autoRankingKey(userId))!=null;}catch{}
      }
    }
    queues.set(userId,value);return value;
  }
  function persist(userId,value){
    value.durable=false;
    if(!storage||!value.readable||value.blocked)return;
    try{
      if(!value.pending.length&&typeof storage.removeItem==='function')storage.removeItem(autoRankingKey(userId));
      else storage.setItem(autoRankingKey(userId),JSON.stringify({version:1,pending:value.pending}));
      value.durable=true;
    }catch{/* The in-memory queue stays intact; a lost acknowledgement is safe to retry. */}
  }
  function emit(status,userId,runId,extra={}){
    if(destroyed)return;
    const value=validUser(userId)?queue(userId):null;
    try{onStatus?.({status,userId:userId||null,runId:runId||null,pending:value?.pending.length||0,durable:value?.durable??false,...extra});}catch{/* Presentation callbacks cannot change delivery. */}
  }
  function getState(userId=identity().userId){
    if(!validUser(userId))return {userId:null,pending:[],durable:false,blocked:false};
    const value=queue(userId);return {userId,pending:[...value.pending],durable:value.durable,blocked:value.blocked};
  }
  function enqueue(run){
    const account=identity();
    if(destroyed||!eligibleForAutoRanking(run,account))return {ok:false,reason:'ineligible'};
    const value=queue(account.userId);
    if(value.blocked){emit('unreadable-outbox',account.userId,run.id);return {ok:false,reason:'unreadable-outbox'};}
    if(value.pending.includes(run.id))return {ok:true,queued:false,duplicate:true,...getState(account.userId)};
    if(value.pending.length>=maxPending){emit('queue-full',account.userId,run.id);return {ok:false,reason:'queue-full',...getState(account.userId)};}
    value.pending.push(run.id);persist(account.userId,value);emit('queued',account.userId,run.id);
    return {ok:true,queued:true,...getState(account.userId)};
  }
  function flush(){
    const account=identity();
    if(inFlight){
      // Restoring B while A's old request is settling must not strand B's own
      // outbox. A still finishes once; B is delivered after that shared flight.
      if(active(account)&&account.userId!==flightUserId)return inFlight.then(()=>flush());
      return inFlight;
    }
    if(!active(account))return Promise.resolve({ok:false,reason:'inactive',published:[],...getState(account.userId)});
    const userId=account.userId,generation=generations.get(userId)||0,value=queue(userId);
    if(value.blocked){emit('unreadable-outbox',userId);return Promise.resolve({ok:false,reason:'unreadable-outbox',published:[],...getState(userId)});}
    const work=async()=>{
      const published=[],rejected=[];let reason=null;
      // Serial requests plus the one shared flight avoid duplicate concurrent
      // sends. Enqueues during an awaited request remain in this same queue.
      while(value.pending.length&&current(userId,generation)){
        const id=value.pending[0];emit('publishing',userId,id);
        try{
          const result=await accounts.publish(id);
          if(!current(userId,generation))return {ok:false,reason:'identity-changed',published,...getState(userId)};
          const run=result?.run;
          if(run?.id!==id||run.published!==true||run.verified!==true||run.mode!=='open'||run.result!=='lives'||run.ruleset!=='open-v2'){
            reason='invalid-acknowledgement';emit('pending',userId,id,{reason});break;
          }
          value.pending=value.pending.filter(item=>item!==id);persist(userId,value);
          published.push({runId:id,result});emit('published',userId,id,{result});
        }catch(error){
          if(!current(userId,generation))return {ok:false,reason:'identity-changed',published,...getState(userId)};
          if(terminalCodes.has(error?.code)){
            value.pending=value.pending.filter(item=>item!==id);persist(userId,value);rejected.push({runId:id,code:error.code});emit('rejected',userId,id,{code:error.code});continue;
          }
          reason=typeof error?.code==='string'?error.code:'NETWORK';
          // Connection loss, rate limits, expired auth and stale sessions all
          // retain the original run ID. A later explicit flush retries safely.
          emit('pending',userId,id,{reason});break;
        }
      }
      if(!value.pending.length)emit('idle',userId);
      return {ok:!value.pending.length&&!rejected.length,reason:reason||(rejected.length?'rejected':null),published,rejected,...getState(userId)};
    };
    // Start work in a microtask so a reentrant callback sees the same flight.
    flightUserId=userId;
    inFlight=Promise.resolve().then(work).finally(()=>{inFlight=null;flightUserId=null;});
    return inFlight;
  }
  function clearUser(userId=identity().userId){
    if(!validUser(userId))return false;
    generations.set(userId,(generations.get(userId)||0)+1);queues.delete(userId);
    try{storage?.removeItem(autoRankingKey(userId));return true;}catch{return false;}
  }
  function destroy(){destroyed=true;}
  return Object.freeze({enqueue,flush,getState,clearUser,destroy});
}
