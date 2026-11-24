import {prepareNinjaAccount} from './ninja-auth.mjs';
import {createNinjaGameService} from './ninja-game-service.mjs';
import {validateUsername} from '../notification-ninja/src/player.js';
import {ADMIN_TEST_BUDGET,accountAccess} from './ninja-competition.mjs';

const failure=(code,message)=>Object.assign(new Error(message),{status:409,code});
/** Owner-only setup helper. It is deliberately not an HTTP registration option. */
export async function bootstrapNinjaAdmin({store,game,username,password,recoveryKey,now=()=>Date.now()}={}){
  if(!store?.db||typeof store.transaction!=='function')throw new TypeError('Admin setup requires a Ninja store.');
  const name=validateUsername(username);
  if(!name.ok)throw new TypeError('Admin setup requires a valid Ninja name.');
  if(typeof password!=='string'||!password.isWellFormed()||Array.from(password).length<20||Array.from(password).length>128||Buffer.byteLength(password)>512)throw new TypeError('Admin setup requires a password with 20 to 128 characters.');
  if(recoveryKey!==undefined&&(typeof recoveryKey!=='string'||!/^NNR-[A-Za-z0-9_-]{43}$/.test(recoveryKey)))throw new TypeError('Admin setup recovery key is invalid.');
  const key=name.username.normalize('NFKC').toLowerCase();
  async function existingAccount(){
    const existing=await store.db.prepare('SELECT id FROM users WHERE username_key=?').get(key);
    if(!existing)return null;
    const user=await store.getUser(existing.id);
    if(user.role!=='admin')throw failure('ADMIN_NAME_CONFLICT','Dieser Name gehört bereits einem normalen Konto. Es wurde nicht verändert.');
    return {created:false,user:{id:user.id,username:user.username},account:accountAccess(user)};
  }
  const existing=await existingAccount();if(existing)return existing;
  game??=createNinjaGameService(store,{now}); // Creates the same game/ledger schema used by HTTP.
  const prepared=await prepareNinjaAccount({username:name.username,password,recoveryKey,now});
  try{
    return await store.transaction(function*(){
      // One commit owns identity, role and test budget; a crash cannot leave a regular account behind.
      const current=yield store.db.prepare('SELECT id FROM users WHERE username_key=?').get(key);
      if(current){
        const user=yield store.getUser(current.id);
        if(user.role!=='admin')throw failure('ADMIN_NAME_CONFLICT','Dieser Name gehört bereits einem normalen Konto. Es wurde nicht verändert.');
        return {created:false,user:{id:user.id,username:user.username},account:accountAccess(user)};
      }
      const {id,name,passwordHash,recoveryHash,stamp,profile}=prepared;
      yield store.db.prepare('INSERT INTO users(id,username,username_key,password_hash,recovery_hash,created_at,email,privacy_at) VALUES(?,?,?,?,?,?,NULL,NULL)').run(id,name.username,name.key,passwordHash,recoveryHash,stamp);
      yield store.db.prepare('INSERT INTO profiles(user_id,data,revision,run_sequence) VALUES(?,?,0,0)').run(id,JSON.stringify(profile));
      yield store.db.prepare('INSERT INTO wallets(user_id,balance) VALUES(?,?)').run(id,ADMIN_TEST_BUDGET);
      yield store.db.prepare('INSERT INTO ninja_admin_accounts(user_id,created_at) VALUES(?,?)').run(id,stamp);
      yield store.db.prepare('INSERT INTO ninja_ledger(user_id,reference,kind,delta,balance_after,created_at) VALUES(?,?,?,?,?,?)').run(id,'admin:test-budget:init','admin.test-budget',ADMIN_TEST_BUDGET,ADMIN_TEST_BUDGET,stamp);
      return {created:true,user:{id,username:name.username},account:{role:'admin',sandbox:true,unlimitedCoins:true},recoveryKey:prepared.recoveryKey};
    });
  }catch(error){
    // A simultaneous setup or public registration may have won the unique name.
    if(error.code==='23505'||/UNIQUE constraint failed: users\.username_key/.test(error.message||'')){
      const current=await existingAccount();if(current)return current;
    }
    throw error;
  }
}

/** Production startup may set these private variables once, then remove them. */
export async function bootstrapNinjaAdminFromEnv({env=process.env,...options}={}){
  const username=env.NINJA_ADMIN_BOOTSTRAP_USERNAME,password=env.NINJA_ADMIN_BOOTSTRAP_PASSWORD,recoveryKey=env.NINJA_ADMIN_BOOTSTRAP_RECOVERY_KEY;
  if(username===undefined&&password===undefined&&recoveryKey===undefined)return {enabled:false};
  if(typeof username!=='string'||!username||typeof password!=='string'||!password)throw new TypeError('Both private admin bootstrap variables must be set.');
  const result=await bootstrapNinjaAdmin({...options,username,password,...(recoveryKey!==undefined?{recoveryKey}:{})});
  // Startup diagnostics must never return or log a recovery key or session token.
  return {enabled:true,created:result.created,user:result.user,account:result.account};
}
