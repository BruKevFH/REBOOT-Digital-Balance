import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {execute} from './ninja-operations.mjs';

const MAX=Number.MAX_SAFE_INTEGER;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const clone=value=>JSON.parse(JSON.stringify(value));
const failure=(status,code,message)=>Object.assign(new Error(message),{status,code});

/** Durable SQLite storage. HTTP policy and game transactions belong to callers. */
export function createNinjaStore({databasePath=':memory:',now=()=>Date.now()}={}){
  if(typeof databasePath!=='string'||!databasePath)throw new TypeError('databasePath must be a nonempty path.');
  if(databasePath!==':memory:')fs.mkdirSync(path.dirname(path.resolve(databasePath)),{recursive:true});
  const db=new DatabaseSync(databasePath);
  let inTransaction=false,closed=false;
  const timestamp=()=>{const value=now();if(!Number.isSafeInteger(value)||value<0)throw new TypeError('The storage clock must return a nonnegative safe integer.');return value;};
  function transaction(callback){
    if(typeof callback!=='function'||callback.constructor?.name==='AsyncFunction')throw new TypeError('SQLite transaction callbacks must be synchronous.');
    if(closed)throw new Error('The database is closed.');
    if(inTransaction)throw new Error('Nested SQLite transactions are not supported.');
    inTransaction=true;
    try{
      db.exec('BEGIN IMMEDIATE');
      const result=execute(callback());
      if(result&&typeof result.then==='function'){
        // A programming error must not commit writes performed before the promise.
        Promise.resolve(result).catch(()=>{});
        throw new TypeError('SQLite transaction callbacks must not return promises.');
      }
      db.exec('COMMIT');return result;
    }catch(error){try{db.exec('ROLLBACK');}catch{}throw error;}
    finally{inTransaction=false;}
  }
  try{
    db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;');
    transaction(()=>{
      db.exec(`
        CREATE TABLE IF NOT EXISTS ninja_auth_migrations(version INTEGER PRIMARY KEY,applied_at INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS users(
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          username_key TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          recovery_hash TEXT NOT NULL,
          created_at INTEGER NOT NULL CHECK(created_at>=0)
        );
        CREATE TABLE IF NOT EXISTS sessions(
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at INTEGER NOT NULL CHECK(created_at>=0),
          expires_at INTEGER NOT NULL CHECK(expires_at>created_at)
        );
        CREATE TABLE IF NOT EXISTS profiles(
          user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          data TEXT NOT NULL CHECK(json_valid(data)),
          revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0 AND revision<=9007199254740991),
          run_sequence INTEGER NOT NULL DEFAULT 0 CHECK(run_sequence>=0 AND run_sequence<=9007199254740991)
        );
        CREATE TABLE IF NOT EXISTS wallets(
          user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          balance INTEGER NOT NULL DEFAULT 0 CHECK(typeof(balance)='integer' AND balance>=0 AND balance<=9007199254740991)
        );
        CREATE INDEX IF NOT EXISTS ninja_sessions_user ON sessions(user_id,created_at DESC);
        CREATE INDEX IF NOT EXISTS ninja_sessions_expiry ON sessions(expires_at);
      `);
      const expected={
        users:['id','username','username_key','password_hash','recovery_hash','created_at'],
        sessions:['token_hash','user_id','created_at','expires_at'],
        profiles:['user_id','data','revision','run_sequence'],
        wallets:['user_id','balance']
      };
      for(const [table,columns]of Object.entries(expected)){
        const actual=new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(column=>column.name));
        if(columns.some(column=>!actual.has(column)))throw new Error(`Existing ${table} schema is incompatible; its data has not been replaced.`);
      }
      const userColumns=new Set(db.prepare('PRAGMA table_info(users)').all().map(column=>column.name));
      if(!userColumns.has('email'))db.exec('ALTER TABLE users ADD COLUMN email TEXT;');
      if(!userColumns.has('privacy_at'))db.exec('ALTER TABLE users ADD COLUMN privacy_at INTEGER;');
      db.exec('CREATE UNIQUE INDEX IF NOT EXISTS ninja_users_email ON users(email) WHERE email IS NOT NULL;');
      db.prepare('INSERT OR IGNORE INTO ninja_auth_migrations(version,applied_at) VALUES(?,?)').run(1,timestamp());
      db.prepare('INSERT OR IGNORE INTO ninja_auth_migrations(version,applied_at) VALUES(?,?)').run(2,timestamp());
    });
  }catch(error){db.close();throw error;}

  const selectUser=db.prepare('SELECT id,username,created_at FROM users WHERE id=?');
  const selectProfile=db.prepare(`SELECT u.username,u.created_at,p.data,p.revision,p.run_sequence,w.balance
    FROM profiles p JOIN users u ON u.id=p.user_id JOIN wallets w ON w.user_id=p.user_id WHERE p.user_id=?`);
  const saveProfile=db.prepare('UPDATE profiles SET data=?,revision=revision+1 WHERE user_id=? AND revision<?');
  function getUser(userId){
    const user=selectUser.get(userId);
    if(!user)throw failure(404,'ACCOUNT_NOT_FOUND','Dieses Konto ist nicht verfügbar.');
    return {id:user.id,username:user.username,createdAt:user.created_at};
  }
  function getProfile(userId){
    const row=selectProfile.get(userId);
    if(!row)throw failure(404,'ACCOUNT_NOT_FOUND','Dieses Konto ist nicht verfügbar.');
    let profile;
    try{profile=JSON.parse(row.data);if(!object(profile))throw new Error();}
    catch{throw failure(500,'PROFILE_UNREADABLE','Dein gespeichertes Profil kann gerade nicht geladen werden.');}
    profile.coins=row.balance;
    profile.player={...(object(profile.player)?profile.player:{}),username:row.username,createdAt:row.created_at};
    delete profile.player.guest;
    return {profile,revision:row.revision,runSequence:row.run_sequence};
  }
  function putProfile(userId,value){
    if(!object(value))throw new TypeError('A profile must be an object.');
    const previous=getProfile(userId),profile=clone(value);
    profile.coins=previous.profile.coins;
    profile.player={...(object(profile.player)?profile.player:{}),username:previous.profile.player.username,createdAt:previous.profile.player.createdAt};
    delete profile.player.guest;
    const json=JSON.stringify(profile);
    if(Buffer.byteLength(json)>524288)throw failure(413,'PROFILE_TOO_LARGE','Das Profil ist zu groß.');
    if(previous.revision>=MAX)throw failure(503,'PROFILE_REVISION_LIMIT','Dein Profil kann gerade nicht gespeichert werden.');
    const result=saveProfile.run(json,userId,MAX);
    if(result.changes!==1)throw failure(409,'PROFILE_CHANGED','Das Profil wurde inzwischen geändert. Bitte versuche es erneut.');
    return getProfile(userId);
  }
  function close(){if(closed)return;if(inTransaction)throw new Error('Cannot close the database during a transaction.');db.close();closed=true;}
  return {db,transaction,close,getUser,getProfile,putProfile,schemaVersion:2};
}
