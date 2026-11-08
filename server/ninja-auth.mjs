import {operation} from './ninja-operations.mjs';
import {createNinjaMfa} from './ninja-mfa.mjs';
import {createHash,randomBytes,randomUUID,scrypt,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {validateUsername} from '../notification-ninja/src/player.js';
import {normalizeJourney} from '../notification-ninja/src/journey.js';
import {normalizeAdventure} from '../notification-ninja/src/adventure.js';

const scryptAsync=promisify(scrypt);
export const AUTH_CONFIG=Object.freeze({passwordMinLength:10,passwordMaxLength:128,sessionTTL:12*60*60*1000,maxSessions:5,scryptN:32768,scryptR:8,scryptP:1,keyLength:64,saltLength:16});
const MAX_TTL=30*24*60*60*1000;
const tokenPattern=/^[A-Za-z0-9_-]{43}$/;
const recoveryPattern=/^NNR-[A-Za-z0-9_-]{43}$/;
const digest=value=>createHash('sha256').update(value).digest('hex');
const sameHash=(a,b)=>typeof a==='string'&&typeof b==='string'&&/^[a-f0-9]{64}$/.test(a)&&/^[a-f0-9]{64}$/.test(b)&&timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
const clone=value=>JSON.parse(JSON.stringify(value));
const error=(status,code,message)=>Object.assign(new Error(message),{status,code});
const credentialError=()=>error(401,'INVALID_CREDENTIALS','Anmeldung fehlgeschlagen. Prüfe Name und Passwort.');
const recoveryError=()=>error(401,'INVALID_RECOVERY','Zurücksetzen fehlgeschlagen. Prüfe Name und Wiederherstellungscode.');
const authError=()=>error(401,'UNAUTHENTICATED','Bitte melde dich erneut an.');
const duplicateName=()=>error(409,'NAME_UNAVAILABLE','Dieser Ninja-Name ist nicht verfügbar.');
const usernameKey=name=>name.normalize('NFKC').toLowerCase();
function passwordIsValid(value){return typeof value==='string'&&value.isWellFormed()&&Array.from(value).length>=AUTH_CONFIG.passwordMinLength&&Array.from(value).length<=AUTH_CONFIG.passwordMaxLength&&Buffer.byteLength(value)<=512;}
function requirePassword(value){if(!passwordIsValid(value))throw error(400,'INVALID_PASSWORD','Dein Passwort braucht 10 bis 128 Zeichen.');return value;}
function candidatePassword(value){return typeof value==='string'&&value.isWellFormed()&&Buffer.byteLength(value)<=512?value:'invalid-password-input';}
function normalizedName(value){const result=validateUsername(value);if(!result.ok)throw error(400,'INVALID_USERNAME',result.reason);return {username:result.username,key:usernameKey(result.username)};}
async function hashPassword(password){
  const salt=randomBytes(AUTH_CONFIG.saltLength);
  const key=await scryptAsync(password,salt,AUTH_CONFIG.keyLength,{N:AUTH_CONFIG.scryptN,r:AUTH_CONFIG.scryptR,p:AUTH_CONFIG.scryptP,maxmem:64*1024*1024});
  return `scrypt-v1$${AUTH_CONFIG.scryptN}$${AUTH_CONFIG.scryptR}$${AUTH_CONFIG.scryptP}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}
function readPasswordHash(value){
  if(typeof value!=='string')return null;
  const match=/^scrypt-v1\$32768\$8\$1\$([A-Za-z0-9_-]{22})\$([A-Za-z0-9_-]{86})$/.exec(value);
  if(!match)return null;
  const salt=Buffer.from(match[1],'base64url'),key=Buffer.from(match[2],'base64url');
  if(salt.length!==16||key.length!==64||salt.toString('base64url')!==match[1]||key.toString('base64url')!==match[2])return null;
  return {salt,key};
}
let dummyHash;
const getDummyHash=()=>dummyHash??=hashPassword('Notification Ninja dummy password, never a real account.');
async function verifyPassword(password,serialized){
  const parsed=readPasswordHash(serialized)||readPasswordHash(await getDummyHash());
  const actual=await scryptAsync(candidatePassword(password),parsed.salt,AUTH_CONFIG.keyLength,{N:AUTH_CONFIG.scryptN,r:AUTH_CONFIG.scryptR,p:AUTH_CONFIG.scryptP,maxmem:64*1024*1024});
  return Boolean(readPasswordHash(serialized))&&timingSafeEqual(actual,parsed.key);
}
const isDuplicateName=exception=>/UNIQUE constraint failed: users\.username_key/.test(exception?.message||'')||exception?.code==='23505'&&exception.constraint==='users_username_key_key';
const isDuplicateEmail=exception=>/UNIQUE constraint failed: users\.email/.test(exception?.message||'')||exception?.code==='23505'&&exception.constraint==='users_email_key';
export function validateRegistration({email,password,passwordConfirmation,privacyAccepted}={}){
  if(typeof email!=='string'||email.length>254||!email.isWellFormed()||!/^([A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64})@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(email.trim()))throw error(400,'INVALID_EMAIL','Bitte gib eine gültige E-Mail-Adresse an.');
  if(passwordConfirmation!==password)throw error(400,'PASSWORD_MISMATCH','Die Passwörter stimmen nicht überein.');
  if(privacyAccepted!==true)throw error(400,'PRIVACY_REQUIRED','Bitte bestätige die Datenschutzhinweise.');
  return email.trim().normalize('NFKC').toLowerCase();
}

/** Passwords and recovery keys are never stored or returned in plain text after creation. */
export function createNinjaAuth(store,{now=()=>Date.now(),sessionTTL=AUTH_CONFIG.sessionTTL,maxSessions=AUTH_CONFIG.maxSessions,mfaKey=process.env.NINJA_MFA_ENCRYPTION_KEY}={}){
  if(!store?.db||typeof store.transaction!=='function')throw new TypeError('A Ninja store is required.');
  if(!Number.isSafeInteger(sessionTTL)||sessionTTL<1000||sessionTTL>MAX_TTL)throw new TypeError('sessionTTL must be between one second and thirty days.');
  if(!Number.isInteger(maxSessions)||maxSessions<1||maxSessions>20)throw new TypeError('maxSessions must be between one and twenty.');
  const db=store.db;
  const byName=db.prepare('SELECT * FROM users WHERE username_key=?');
  const byId=db.prepare('SELECT * FROM users WHERE id=?');
  const sessionQuery=db.prepare('SELECT s.token_hash,s.expires_at,u.id,u.username,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?');
  const clock=()=>{const value=now();if(!Number.isSafeInteger(value)||value<0||value>Number.MAX_SAFE_INTEGER-sessionTTL)throw new TypeError('The auth clock must return a valid timestamp.');return value;};
  function* issueSession(userId,stamp){
    if(store.lockUser)yield store.lockUser(userId);
    const token=randomBytes(32).toString('base64url'),expiresAt=stamp+sessionTTL;
    (yield db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(stamp));
    (yield db.prepare('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)').run(digest(token),userId,stamp,expiresAt));
    // Millisecond timestamps can tie during parallel logins. Keep the newly
    // inserted session instead of choosing randomly by its opaque token hash.
    (yield db.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash NOT IN (SELECT token_hash FROM sessions WHERE user_id=? ORDER BY created_at DESC,rowid DESC LIMIT ?)').run(userId,userId,maxSessions));
    return {token,expiresAt};
  }
  function* response(userId,session,extra={}){const user=(yield store.getUser(userId)),state=(yield store.getProfile(userId));return {user:{id:user.id,username:user.username},...session,profile:state.profile,revision:state.revision,...extra};}
  const mfa=createNinjaMfa(store,{key:mfaKey,now,verifyPassword,issueSession,response});
  async function register(input={}){
    const {username,password}=input;
    const email=input.email===undefined?null:validateRegistration(input);
    const name=normalizedName(username);requirePassword(password);
    const passwordHash=await hashPassword(password),recoveryKey=`NNR-${randomBytes(32).toString('base64url')}`,stamp=clock(),id=randomUUID();
    try{return await store.transaction(function*(){
      const model=new NinjaGame({storage:null,now:()=>stamp});
      const profile=clone(model.profile);profile.accountCalendar='utc';normalizeJourney(profile,stamp);normalizeAdventure(profile,stamp);profile.player={...profile.player,username:name.username,createdAt:stamp};delete profile.player.guest;
      (yield db.prepare('INSERT INTO users(id,username,username_key,password_hash,recovery_hash,created_at,email,privacy_at) VALUES(?,?,?,?,?,?,?,?)').run(id,name.username,name.key,passwordHash,digest(recoveryKey),stamp,email,email?stamp:null));
      (yield db.prepare('INSERT INTO profiles(user_id,data,revision,run_sequence) VALUES(?,?,0,0)').run(id,JSON.stringify(profile)));
      (yield db.prepare('INSERT INTO wallets(user_id,balance) VALUES(?,0)').run(id));
      return (yield* response(id,(yield* issueSession(id,stamp)),{recoveryKey}));
    });}catch(exception){if(isDuplicateName(exception))throw duplicateName();if(isDuplicateEmail(exception))throw error(409,'EMAIL_UNAVAILABLE','Diese E-Mail-Adresse ist nicht verfügbar.');throw exception;}
  }
  async function login({username,password}={}){
    let name;try{name=normalizedName(username);}catch{}
    const email=typeof username==='string'&&username.includes('@')?username.trim().normalize('NFKC').toLowerCase():null;
    const user=email?await db.prepare('SELECT * FROM users WHERE email=?').get(email):name?await byName.get(name.key):undefined,serialized=user?.password_hash||await getDummyHash();
    const verified=await verifyPassword(password,serialized);
    if(!verified||!user)throw credentialError();
    return store.transaction(function*(){
      const current=(yield byId.get(user.id));
      if(!current||current.password_hash!==user.password_hash)throw credentialError();
      const challenge=yield* mfa.challengeIfRequired(current.id,clock());
      if(challenge)return challenge;
      return (yield* response(current.id,(yield* issueSession(current.id,clock()))));
    });
  }
  function* authenticate(token){
    const valid=typeof token==='string'&&tokenPattern.test(token),supplied=digest(valid?token:'invalid-session-token');
    const row=valid?(yield sessionQuery.get(supplied)):undefined;
    if(!sameHash(supplied,row?.token_hash||'0'.repeat(64))||!row||row.expires_at<=clock())throw authError();
    return {id:row.id,username:row.username,createdAt:row.created_at};
  }
  function* logout(token){if(typeof token==='string'&&tokenPattern.test(token))(yield db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(token)));return {ok:true};}
  async function resetPassword({username,recoveryKey,password,newPassword,mfaCode}={}){
    const replacement=password===undefined?newPassword:password;requirePassword(replacement);
    let name;try{name=normalizedName(username);}catch{}
    const secret=typeof recoveryKey==='string'?recoveryKey.trim():'';
    const user=name?await byName.get(name.key):undefined,supplied=digest(recoveryPattern.test(secret)?secret:'invalid-recovery-key');
    if(!sameHash(supplied,user?.recovery_hash||'0'.repeat(64))||!user)throw recoveryError();
    const passwordHash=await hashPassword(replacement),nextRecovery=`NNR-${randomBytes(32).toString('base64url')}`;
    return store.transaction(function*(){
      const current=(yield byId.get(user.id));
      if(!current||!sameHash(current.recovery_hash,supplied))throw recoveryError();
      yield* mfa.verifyForRecovery(current.id,mfaCode,clock());
      (yield db.prepare('UPDATE users SET password_hash=?,recovery_hash=? WHERE id=?').run(passwordHash,digest(nextRecovery),current.id));
      (yield db.prepare('DELETE FROM sessions WHERE user_id=?').run(current.id));
      return (yield* response(current.id,(yield* issueSession(current.id,clock())),{recoveryKey:nextRecovery}));
    });
  }
  async function deleteAccount(userId,{password}={}){
    const user=await byId.get(userId),verified=await verifyPassword(password,user?.password_hash||await getDummyHash());
    if(!verified||!user)throw error(403,'PASSWORD_CONFIRMATION_FAILED','Das Passwort konnte nicht bestätigt werden.');
    return store.transaction(function*(){
      const current=(yield byId.get(userId));
      if(!current||current.password_hash!==user.password_hash)throw error(403,'PASSWORD_CONFIRMATION_FAILED','Das Passwort konnte nicht bestätigt werden.');
      (yield db.prepare('DELETE FROM users WHERE id=?').run(userId));return {ok:true,deleted:true};
    });
  }
  function* rename(userId,username){
    const name=normalizedName(username);
    try{return yield store.transaction(function*(){
      const current=(yield store.getUser(userId));
      if(current.username!==name.username){(yield db.prepare('UPDATE users SET username=?,username_key=? WHERE id=?').run(name.username,name.key,userId));(yield store.putProfile(userId,(yield store.getProfile(userId)).profile));}
      const state=(yield store.getProfile(userId));return {user:{id:userId,username:name.username},profile:state.profile,revision:state.revision};
    });}catch(exception){if(isDuplicateName(exception))throw duplicateName();if(isDuplicateEmail(exception))throw error(409,'EMAIL_UNAVAILABLE','Diese E-Mail-Adresse ist nicht verfügbar.');throw exception;}
  }
  return {register,login,authenticate:operation(authenticate),logout:operation(logout),resetPassword,deleteAccount,rename:operation(rename),mfa};
}
