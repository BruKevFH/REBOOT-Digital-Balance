/** RFC 6238 TOTP MFA with AES-256-GCM, one-time recovery codes and short-lived challenges. */
import {createCipheriv,createDecipheriv,createHmac,createHash,randomBytes,timingSafeEqual} from 'node:crypto';
const fail=(status,code,message)=>Object.assign(new Error(message),{status,code});
const digest=value=>createHash('sha256').update(value).digest('hex');
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const b32=bytes=>{const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits=0,value=0,out='';for(const byte of bytes){value=value<<8|byte;bits+=8;while(bits>=5)out+=abc[(value>>>(bits-=5))&31];}if(bits>0)out+=abc[(value<<(5-bits))&31];return out;};
const decode32=value=>{if(typeof value!=='string'||!/^[A-Z2-7]{32}$/.test(value))throw fail(400,'INVALID_MFA_SECRET','Ungültiger Einrichtungscode.');const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',out=[];let bits=0,buf=0;for(const c of value){buf=buf<<5|abc.indexOf(c);bits+=5;if(bits>=8){out.push((buf>>>(bits-=8))&255);buf&=(1<<bits)-1;}}return Buffer.from(out);};
function totp(secret,step){const b=Buffer.alloc(8);b.writeBigUInt64BE(BigInt(step));const h=createHmac('sha1',decode32(secret)).update(b).digest();return String((h.readUInt32BE(h[19]&15)&0x7fffffff)%1000000).padStart(6,'0');}
export const testMfaCode=(secret,step)=>totp(secret,step);
function verifyTOTP(secret,code,now,lastStep=-1){
 if(typeof code!=='string'||!/^[0-9]{6}$/.test(code))return null;
 const step=Math.floor(now/30000);
 for(const t of [step,step-1,step+1])if(t>lastStep&&equal(totp(secret,t),code))return t;
 return null;
}
export function createNinjaMFA(store,{now=()=>Date.now(),key=process.env.NINJA_MFA_KEY,verifyPassword,issueSession,response}={}){
 const cryptoKey=key?(/^[a-fA-F0-9]{64}$/.test(key)?Buffer.from(key,'hex'):(()=>{throw new TypeError('NINJA_MFA_KEY must contain 32 bytes encoded as 64 hex characters.');})()):null,db=store.db;
 const clock=()=>{const t=now();if(!Number.isSafeInteger(t)||t<0)throw new TypeError('Invalid MFA clock.');return t;};
 const needKey=()=>{if(!cryptoKey)throw fail(503,'MFA_UNAVAILABLE','Zwei-Faktor-Anmeldung ist am Server noch nicht konfiguriert.');};
 const byId=db.prepare('SELECT * FROM ninja_mfa WHERE user_id=?');
 const byChallenge=db.prepare('SELECT * FROM ninja_mfa_challenges WHERE challenge_hash=?');
 const encrypt=value=>{needKey();const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',cryptoKey,iv),sealed=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return 'gcm-v1:'+Buffer.concat([iv,cipher.getAuthTag(),sealed]).toString('base64url');};
 const decrypt=value=>{needKey();if(typeof value!=='string'||!value.startsWith('gcm-v1:'))throw fail(503,'MFA_UNAVAILABLE','MFA-Schlüssel ungültig.');const bytes=Buffer.from(value.slice(7),'base64url');if(bytes.length<29)throw fail(503,'MFA_UNAVAILABLE','MFA-Schlüssel ungültig.');try{const cipher=createDecipheriv('aes-256-gcm',cryptoKey,bytes.subarray(0,12));cipher.setAuthTag(bytes.subarray(12,28));return Buffer.concat([cipher.update(bytes.subarray(28)),cipher.final()]).toString('utf8');}catch{throw fail(503,'MFA_UNAVAILABLE','MFA-Schlüssel konnte nicht entschlüsselt werden.');}};
 function* validate(row,code,stamp){
   const step=verifyTOTP(decrypt(row.secret),code,stamp,Number(row.last_step));
   if(step!==null){yield db.prepare('UPDATE ninja_mfa SET last_step=? WHERE user_id=? AND last_step<?').run(step,row.user_id,step);return true;}
   if(typeof code==='string'&&/^NNM-[A-Za-z0-9_-]{27}$/.test(code)){
     const hashes=JSON.parse(row.recovery_hashes||'[]'),idx=hashes.findIndex(x=>equal(x,digest(code)));
     if(idx>=0){hashes.splice(idx,1);yield db.prepare('UPDATE ninja_mfa SET recovery_hashes=? WHERE user_id=?').run(JSON.stringify(hashes),row.user_id);return true;}
   }
   return false;
 }
 function* loginStep(userId){
   const row=yield byId.get(userId);if(row?.enabled!==1)return null;needKey();
   const stamp=clock(),challenge=randomBytes(32).toString('base64url');
   yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE expires_at<=?').run(stamp);
   yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE user_id=?').run(userId);
   yield db.prepare('INSERT INTO ninja_mfa_challenges(challenge_hash,user_id,created_at,expires_at,attempts) VALUES(?,?,?,?,0)').run(digest(challenge),userId,stamp,stamp+300000);
   return {mfaRequired:true,challenge,expiresAt:stamp+300000};
 }
 async function finishLogin({challenge,code}={}){
   if(typeof challenge!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(challenge))throw fail(401,'MFA_INVALID','MFA-Code ungültig oder abgelaufen.');
   const result=await store.transaction(function*(){
     const stamp=clock(),entry=yield byChallenge.get(digest(challenge));
     if(!entry||entry.expires_at<=stamp||entry.attempts>=5)throw fail(401,'MFA_INVALID','MFA-Code ungültig oder abgelaufen.');
     if(store.lockUser)yield store.lockUser(entry.user_id);
     const row=yield byId.get(entry.user_id);
     if(!row||row.enabled!==1)throw fail(401,'MFA_INVALID','MFA-Code ungültig oder abgelaufen.');
     if(!(yield* validate(row,code,stamp))){
       yield db.prepare('UPDATE ninja_mfa_challenges SET attempts=attempts+1 WHERE challenge_hash=?').run(digest(challenge));
       return {mfaDenied:true};
     }
     yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE user_id=?').run(entry.user_id);
     return yield* response(entry.user_id,yield* issueSession(entry.user_id,stamp));
   });
   if(result?.mfaDenied)throw fail(401,'MFA_INVALID','MFA-Code ungültig oder abgelaufen.');
   return result;
 }
 async function status(userId){
   const row=await byId.get(userId);return {enabled:row?.enabled===1,available:Boolean(cryptoKey),recoveryCodesRemaining:row?.enabled===1?JSON.parse(row.recovery_hashes||'[]').length:0};
 }
 async function setup(userId,{password}={}){
   needKey();const user=await db.prepare('SELECT password_hash,username FROM users WHERE id=?').get(userId);
   if(!user||!(await verifyPassword(password,user.password_hash)))throw fail(403,'PASSWORD_CONFIRMATION_FAILED','Passwort zur Bestätigung erforderlich.');
   const secret=b32(randomBytes(20)),stamp=clock();
   await store.transaction(function*(){
     if(store.lockUser)yield store.lockUser(userId);
     const row=yield byId.get(userId);if(row?.enabled===1)throw fail(409,'MFA_ALREADY_ENABLED','Zwei-Faktor-Anmeldung ist bereits aktiv.');
     yield db.prepare("INSERT INTO ninja_mfa(user_id,secret,enabled,pending_until,last_step,recovery_hashes) VALUES(?,?,0,?,-1,'[]') ON CONFLICT(user_id) DO UPDATE SET secret=excluded.secret,enabled=0,pending_until=excluded.pending_until,last_step=-1,recovery_hashes='[]'").run(userId,encrypt(secret),stamp+600000);
   });
   const issuer='Notification Ninja',label=encodeURIComponent(issuer+':'+user.username);
   return {enabled:false,secret,otpauthUri:'otpauth://totp/'+label+'?secret='+secret+'&issuer='+encodeURIComponent(issuer)+'&algorithm=SHA1&digits=6&period=30',expiresAt:stamp+600000};
 }
 async function confirm(userId,{code}={}){
   return store.transaction(function*(){
     if(store.lockUser)yield store.lockUser(userId);
     const stamp=clock(),row=yield byId.get(userId);
     if(!row||row.enabled===1||row.pending_until<=stamp)throw fail(400,'MFA_SETUP_EXPIRED','Einrichtung abgelaufen. Bitte erneut beginnen.');
     const step=verifyTOTP(decrypt(row.secret),code,stamp);
     if(step===null)throw fail(400,'MFA_INVALID','Authenticator-Code ungültig.');
     const codes=Array.from({length:10},()=>('NNM-'+randomBytes(20).toString('base64url')));
     yield db.prepare('UPDATE ninja_mfa SET enabled=1,pending_until=0,last_step=?,recovery_hashes=? WHERE user_id=?').run(step,JSON.stringify(codes.map(digest)),userId);
     return {enabled:true,recoveryCodes:codes};
   });
 }
 async function disable(userId,{password,code}={}){
   const user=await db.prepare('SELECT password_hash FROM users WHERE id=?').get(userId);
   if(!user||!(await verifyPassword(password,user.password_hash)))throw fail(403,'PASSWORD_CONFIRMATION_FAILED','Passwort zur Bestätigung erforderlich.');
   const result=await store.transaction(function*(){
     if(store.lockUser)yield store.lockUser(userId);
     const row=yield byId.get(userId);if(!row||row.enabled!==1)return {enabled:false};
     if(!(yield* validate(row,code,clock())))return {denied:true};
     yield db.prepare('DELETE FROM ninja_mfa WHERE user_id=?').run(userId);
     yield db.prepare('DELETE FROM ninja_mfa_challenges WHERE user_id=?').run(userId);
     return {enabled:false};
   });
   if(result.denied)throw fail(403,'MFA_INVALID','MFA-Code ungültig.');
   return result;
 }
 function* requireResetFactor(userId,code){
   const row=yield byId.get(userId);if(!row||row.enabled!==1)return;
   if(!(yield* validate(row,code,clock())))throw fail(403,'MFA_REQUIRED','Ein gültiger MFA-Code wird benötigt.');
 }
 return {configured:Boolean(cryptoKey),loginStep,finishLogin,setup,confirm,disable,status,requireResetFactor};
}
