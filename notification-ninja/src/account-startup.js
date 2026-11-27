/** Restore online state in the background without replacing an intervening guest run. */
export function createAccountStartup({accounts,capture=()=>null,canApply=()=>true,apply=()=>{},onError=()=>{}}={}){
  if(!accounts)throw new TypeError('Account startup needs a client.');
  let generation=0,controller=null,ready=null;
  const identity=()=>{const session=accounts.getSession();return {id:session?.user?.id,token:session?.token};};
  const same=origin=>{const current=identity();return current.id===origin.id&&current.token===origin.token;};
  function cancel({forget=false}={}){generation++;controller?.abort();controller=null;ready=null;if(forget)accounts.forget();}
  async function start({restore=true}={}){
    cancel();const own=++generation,origin=identity(),context=capture(),abort=new AbortController();controller=abort;
    const current=()=>generation===own&&!abort.signal.aborted&&same(origin);
    try{
      const configured=await accounts.init();
      if(!current()||!restore||!origin.id||configured.configured===false)return null;
      const connection=await accounts.warmup({signal:abort.signal});
      if(!current()||!connection.online)return null;
      const result=await accounts.restore({signal:abort.signal});
      if(!current()||!result?.user?.id||result.user.id!==origin.id)return null;
      if(canApply(context)){await apply(result);return result;}
      ready={origin,result};return null;
    }catch(error){if(generation===own&&!abort.signal.aborted&&error.code!=='STALE_SESSION')onError(error);return null;}
    finally{if(controller===abort)controller=null;}
  }
  function takeReady(){const value=ready;ready=null;return value&&same(value.origin)?value.result:null;}
  return Object.freeze({start,cancel,takeReady});
}
