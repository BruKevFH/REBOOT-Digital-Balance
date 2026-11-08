/**
 * Notification Ninja two-factor authentication.
 * RFC 6238 (TOTP SHA-1, 30s, 6 digits), AES-256-GCM encrypted secrets,
 * one-time hashed recovery codes, replay-protected counters and expiring challenges.
 * No TOTP secret or recovery code is stored in plaintext.
 */
import {createCipheriv,createDecipheriv,createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {operation} from './ninja-operations.mjs';
import {qrSvgForAuthenticator} from './ninja-qr.mjs';

const fail=(status,code,message)=>Object.assign(new Error(message),{status,code});
const sha=value=>createHash('sha256').update(String(value)).digest('hex');
const safeEq=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32(bytes){
 let bits=0,value=0,result='';
 for(const byte of bytes){value=(value<<8)|byte;bits+=8;while(bits>=5){result+=alphabet[(value>>>(bits-=5))&31];}}
 if(bits>0)result+=alphabet[(value<<(5-bits))&31];
 return result;
}
export function fromBase32(secret){
 if(typeof secret!=='string'||!/^[A-Z2-7]{16,64}$/.test(secret))throw new TypeError('Invalid base32 secret');
 let bits=0,value=0,bytes=[];
 for(const ch of secret){value=(value<<5)|alphabet.indexOf(ch);bits+=5;if(bits>=8){bytes.push((value>>>(bits-=8))&255);value&=(1<<bits)-1;}}
 return Buffer.from(bytes);
}
export function totp(secret,period){
 if(!Number.isSafeInteger(period)||period<0)throw new TypeError('Invalid period');
 const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(period));
 const hash=createHmac('sha1',fromBase32(secret)).update(counter).digest();
 const offset=hash[19]&15;
 const value=(hash.readUInt32BE(offset)&0x7fffffff)%1e6;
 return String(value).padStart(6,'0');
}
export function checkTotp(secret,code,now,lastCounter=-1){
 if(typeof code!=='string'||!/^[0-9]{6}$/.test(code))return null;
 const period=Math.floor(now/30000);
 for(const tick of [period,period-1,period+1]){
  if(tick<=lastCounter||tick<0)continue;
  if(safeEq(totp(secret,tick),code))return tick;
 }
 return null;
}
export function mfaCrypto(key){
 if(typeof key!=='string'||!/^[a-f0-9]{64}$/i.test(key))return null;
 const raw=Buffer.from(key,'hex');
 return {
  encrypt(value){
   const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',raw,iv),data=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);
   return [iv,cipher.getAuthTag(),data].map(p=>p.toString('base64url')).join('.');
  },
  decrypt(stored){
   const parts=String(stored).split('.');
   if(parts.length!==3)throw fail(503,'MFA_CONFIGURATION','MFA-Konfiguration ist nicht verfügbar.');
   try{const [iv,tag,blob]=parts.map(p=>Buffer.from(p,'base64url'));if(iv.length!==12||tag.length!==16)throw new Error('Invalid AES data');
    const decipher=createDecipheriv('aes-256-gcm',raw,iv);decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(blob),decipher.final()]).toString('utf8');
   }catch{throw fail(503,'MFA_CONFIGURATION','MFA kann gerade nicht entschlüsselt werden. Bitte kontaktiere den Support.');}
  }
 };
}
const normalizeCode=value=>typeof value==='string'?value.trim().toUpperCase():'';
function backups(){
 const codes=Array.from({length:10},()=>randomBytes(9).toString('base64url').toUpperCase());
 return {codes,hashes:codes.map(sha)};
}
export function createNinjaMfa(store,{key=process.env.NINJA_MFA_ENCRYPTION_KEY,now=Date.now,verifyPassword,issueSession,response}={}){
 const db=store.db,crypto=mfaCrypto(key);
 const userQuery=db.prepare('SELECT * FROM ninja_mfa WHERE user_id=?');
 const challengeQuery=db.prepare('SELECT * FROM ninja_mfa_challenges WHERE challenge_hash=?');
 const clock=()=>{const t=now();if(!Number.isSafeInteger(t)||t<0)throw new TypeError('Invalid clock');return t;};
 const supported=()=>{if(!crypto)throw fail(503,'MFA_NOT_CONFIGURED','MFA ist auf diesem Server noch nicht eingerichtet.');};
 const get=async userId=>userQuery.get(userId);
 async function status(userId){const row=await get(userId);return {available:Boolean(crypto),enabled:Boolean(row?.enabled),pending:Boolean(row?.pending_secret)};}
 function* challengeIfRequired(userId,stamp=clock()){
  const row=yield userQuery.get(userId);
  if(!row?.enabled)return null;
  supported();
  const secret=randomBytes(32).toString('base64url');
  yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE expires_at<=?').run(stamp);
  yield db.prepare('INSERT INTO ninja_mfa_challenges(challenge_hash,user_id,created_at,expires_at,attempts) VALUES(?,?,?,?,0)').run(sha(secret),userId,stamp,stamp+5*60*1000);
  return {mfaRequired:true,challenge:secret,expiresAt:stamp+5*60*1000};
 }
 function* verifyFactor(row,code,stamp){
  if(!row?.enabled)return false;
  supported();
  const secret=crypto.decrypt(row.encrypted_secret),candidate=normalizeCode(code),last=Number(row.last_counter);
  const tick=checkTotp(secret,candidate,stamp,last);
  if(tick!==null){
   yield db.prepare('UPDATE ninja_mfa SET last_counter=?,updated_at=? WHERE user_id=? AND last_counter<?').run(tick,stamp,row.user_id,tick);
   return true;
  }
  if(!/^[A-Z0-9_-]{12}$/.test(candidate))return false;
  let stored;try{stored=JSON.parse(row.recovery_codes||'[]');}catch{return false;}
  const hashed=sha(candidate),index=stored.findIndex(item=>safeEq(item,hashed));
  if(index<0)return false;
  stored.splice(index,1);
  yield db.prepare('UPDATE ninja_mfa SET recovery_codes=?,updated_at=? WHERE user_id=?').run(JSON.stringify(stored),stamp,row.user_id);
  return true;
 }
 async function verifyLogin(challenge,code){
  if(typeof challenge!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(challenge))throw fail(401,'INVALID_MFA','Ungültiger oder abgelaufener Anmeldecode.');
  supported();
  const result=await store.transaction(function*(){
   const row=yield challengeQuery.get(sha(challenge)),stamp=clock();
   if(!row||row.expires_at<=stamp||row.attempts>=5)return {ok:false};
   if(store.lockUser)yield store.lockUser(row.user_id);
   const state=yield userQuery.get(row.user_id);
   const valid=yield* verifyFactor(state,code,stamp);
   if(!valid){
    yield db.prepare('UPDATE ninja_mfa_challenges SET attempts=attempts+1 WHERE challenge_hash=?').run(sha(challenge));
    return {ok:false};
   }
   yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE user_id=?').run(row.user_id);
   return {ok:true,session:(yield* response(row.user_id,(yield* issueSession(row.user_id,stamp))))};
  });
  if(!result.ok)throw fail(401,'INVALID_MFA','Code ungültig oder Anmeldezeit abgelaufen. Bitte erneut versuchen.');
  return result.session;
 }
 async function begin(userId,password){
  supported();
  const user=await db.prepare('SELECT password_hash FROM users WHERE id=?').get(userId);
  if(!user||!await verifyPassword(password,user.password_hash))throw fail(403,'PASSWORD_CONFIRMATION_FAILED','Passwort falsch.');
  const secret=base32(randomBytes(20)),stamp=clock();
  return store.transaction(function*(){
   if(store.lockUser)yield store.lockUser(userId);
   const row=yield userQuery.get(userId);
   if(row?.enabled)throw fail(409,'MFA_ALREADY_ENABLED','MFA ist bereits aktiviert.');
   if(row)yield db.prepare('UPDATE ninja_mfa SET pending_secret=?,updated_at=? WHERE user_id=?').run(crypto.encrypt(secret),stamp,userId);
   else yield db.prepare('INSERT INTO ninja_mfa(user_id,encrypted_secret,pending_secret,enabled,last_counter,recovery_codes,updated_at) VALUES(?,?,?,0,-1,?,?)').run(userId,'',crypto.encrypt(secret),'[]',stamp);
   const username=yield db.prepare('SELECT username FROM users WHERE id=?').get(userId);
   const label=encodeURIComponent('Notification Ninja:'+username.username);
   const uri='otpauth://totp/'+label+'?secret='+secret+'&issuer=Notification%20Ninja&algorithm=SHA1&digits=6&period=30';
   return {secret,uri,qrSvg:qrSvgForAuthenticator(uri)};
  });
 }
 async function confirm(userId,code,sessionToken){
  supported();
  return store.transaction(function*(){
   if(store.lockUser)yield store.lockUser(userId);
   const row=yield userQuery.get(userId);
   if(!row?.pending_secret||row.enabled||clock()-row.updated_at>10*60*1000)throw fail(409,'MFA_SETUP_MISSING','Bitte starte die MFA-Einrichtung erneut.');
   const secret=crypto.decrypt(row.pending_secret),tick=checkTotp(secret,normalizeCode(code),clock());
   if(tick===null)throw fail(400,'INVALID_MFA','Dieser Authenticator-Code ist ungültig.');
   const recovery=backups(),stamp=clock();
   yield db.prepare('UPDATE ninja_mfa SET encrypted_secret=?,pending_secret=?,enabled=1,last_counter=?,recovery_codes=?,updated_at=? WHERE user_id=?').run(row.pending_secret,'',tick,JSON.stringify(recovery.hashes),stamp,userId);
   yield db.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash<>?').run(userId,sha(sessionToken));
   return {enabled:true,recoveryCodes:recovery.codes};
  });
 }
 async function disable(userId,password,code,sessionToken){
  supported();
  const user=await db.prepare('SELECT password_hash FROM users WHERE id=?').get(userId);
  if(!user||!await verifyPassword(password,user.password_hash))throw fail(403,'PASSWORD_CONFIRMATION_FAILED','Passwort falsch.');
  const done=await store.transaction(function*(){
   if(store.lockUser)yield store.lockUser(userId);
   const row=yield userQuery.get(userId);
   if(!row?.enabled)throw fail(409,'MFA_NOT_ENABLED','MFA ist nicht aktiviert.');
   if(!(yield* verifyFactor(row,code,clock())))return false;
   yield db.prepare('DELETE FROM ninja_mfa WHERE user_id=?').run(userId);
   yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE user_id=?').run(userId);
   yield db.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash<>?').run(userId,sha(sessionToken));
   return true;
  });
  if(!done)throw fail(403,'INVALID_MFA','Der MFA-Code ist ungültig.');
  return {enabled:false};
 }
 function* verifyForRecovery(userId,code,stamp){
  const row=yield userQuery.get(userId);
  if(!row?.enabled)return;
  if(!code)throw fail(403,'MFA_REQUIRED','Für die Passwortwiederherstellung wird auch dein Authenticator- oder Backup-Code benötigt.');
  if(!(yield* verifyFactor(row,code,stamp)))throw fail(403,'INVALID_MFA','Der Authenticator- oder Backup-Code ist ungültig.');
 }
 return {status,begin,confirm,disable,verifyLogin,challengeIfRequired,verifyForRecovery,available:Boolean(crypto)};
}
