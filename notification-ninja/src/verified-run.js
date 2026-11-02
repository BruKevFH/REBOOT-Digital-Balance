import {NinjaGame} from './game.js';
export const VERIFIED_METHODS=Object.freeze(['update','swipe','resize','nextLevel','setPaused','pause','resume','resumeRun','requestStop','continueAfterLimit','continueSleep','activateSuper','finishRound','skipTutorial']);
const copy=value=>JSON.parse(JSON.stringify(value));
export const traceKey=userId=>`notification-ninja:trace:v3:${encodeURIComponent(userId)}`;
/** Apply a server-issued snapshot exactly. Seed, initial state and loadout remain server-owned. */
export function gameFromServerSnapshot(initial,{storage,now}={}){
  if(initial?.schemaVersion!==1||!initial.profile||!initial.state||!Number.isFinite(initial.width)||!Number.isFinite(initial.height))throw new TypeError('Invalid server run snapshot.');
  const game=new NinjaGame({storage:null,width:initial.width,height:initial.height,now});
  game.storage=storage;game.profile=copy(initial.profile);game.state=copy(initial.state);game.width=initial.width;game.height=initial.height;game.initialJourneyEvents=[];return game;
}
export function readVerifiedTrace(storage,userId){try{const trace=JSON.parse(storage?.getItem(traceKey(userId))||'null');if(trace?.userId!==userId||typeof trace.run?.runId!=='string'||!Array.isArray(trace.commands)||trace.commands.length>40000)return null;return trace;}catch{return null;}}
/** Records top-level model calls, never DOM/pointer handlers or a second game loop. */
export function createVerifiedRun(game,{run,userId,storage,commands=[],maxCommands=40000,onEnded=()=>{},onOverflow=()=>{},onError=()=>{}}={}){
  if(!run?.runId||!userId)throw new TypeError('A server run and authenticated user are required.');
  const originals=new Map(),log=copy(commands);let depth=0,enabled=true,endedNotified=game.state.ended,overflow=false,lastPersist=0,cleared=false;
  const snapshot=()=>({version:3,userId,run:copy(run),commands:copy(log),overflow});
  function flush(){if(cleared)return true;try{storage?.setItem(traceKey(userId),JSON.stringify(snapshot()));lastPersist=Date.now();return true;}catch(error){onError(error);return false;}}
  for(const method of VERIFIED_METHODS){if(typeof game[method]!=='function')continue;const original=game[method];originals.set(method,original);game[method]=function(...args){
    if(!enabled||depth)return original.apply(this,args);
    // Ended UI/layout updates are deliberately outside the completed simulation log.
    const record=!this.state.ended,wasEnded=this.state.ended;depth++;
    let result;try{result=original.apply(this,args);}finally{depth--;}
    if(record&&!overflow){if(log.length>=maxCommands){overflow=true;onOverflow();}else log.push([method,copy(args)]);}
    if(record&&(Date.now()-lastPersist>=1000||method!=='update'&&method!=='swipe'))flush();
    if(!wasEnded&&this.state.ended&&!endedNotified){endedNotified=true;flush();onEnded(snapshot());}
    return result;
  };}
  flush();
  return {getRun:()=>copy(run),getCommands:()=>copy(log),getStatus:()=>({runId:run.runId,ended:game.state.ended,overflow,commands:log.length}),flush,clear(){cleared=true;try{storage?.removeItem(traceKey(userId));}catch{}},destroy(){enabled=false;for(const [method,original]of originals)game[method]=original;},snapshot};
}
export function restoreVerifiedGame(trace,{storage,now}={}){
  const game=gameFromServerSnapshot(trace.run.initial,{storage,now});
  for(const command of trace.commands){if(!Array.isArray(command)||!VERIFIED_METHODS.includes(command[0])||!Array.isArray(command[1]))throw new TypeError('Invalid saved run command.');game[command[0]](...command[1]);}
  return game;
}
