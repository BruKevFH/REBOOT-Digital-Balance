import {Pool,types} from 'pg';
import {AsyncLocalStorage} from 'node:async_hooks';
import {execute} from './ninja-operations.mjs';

const MAX=Number.MAX_SAFE_INTEGER;
const failure=(status,code,message)=>Object.assign(new Error(message),{status,code});
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
// All BIGINT columns are constrained to JS-safe integers; refuse unexpected overflow.
const safeInteger=value=>{const result=Number(value);if(!Number.isSafeInteger(result))throw new RangeError('Unsafe PostgreSQL integer.');return result;};
const parsers=types.getTypeParser;
const numericTypes={getTypeParser:(oid,format)=>oid===20&&format!=='binary'?safeInteger:parsers(oid,format)};

export function postgresConnectionOptions(databaseURL){
  let url;try{url=new URL(databaseURL);}catch{throw new TypeError('DATABASE_URL must be a PostgreSQL URL.');}
  if(!['postgres:','postgresql:'].includes(url.protocol)||!url.hostname||!url.pathname.slice(1))throw new TypeError('DATABASE_URL must identify a PostgreSQL database.');
  const local=['127.0.0.1','localhost','[::1]'].includes(url.hostname);
  // pg parses sslmode from connectionString after explicit options. Strip options
  // that can silently weaken certificate/hostname verification before passing it.
  for(const key of ['sslmode','ssl','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
  return {connectionString:url.href,ssl:local?false:{rejectUnauthorized:true},max:5,connectionTimeoutMillis:10000,idleTimeoutMillis:30000,types:numericTypes};
}
function postgresSQL(sql){
  let position=0;
  let result=sql.replace(/\?/g,()=>`$${++position}`);
  if(/^INSERT OR IGNORE\b/.test(result))result=result.replace(/^INSERT OR IGNORE\b/,'INSERT')+' ON CONFLICT DO NOTHING';
  return result.replace(/rowid DESC/g,'session_order DESC');
}

const migration=`
CREATE TABLE IF NOT EXISTS ninja_auth_migrations(version INTEGER PRIMARY KEY,applied_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS users(
 id TEXT PRIMARY KEY,username TEXT NOT NULL,username_key TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,
 recovery_hash TEXT NOT NULL,created_at BIGINT NOT NULL CHECK(created_at>=0 AND created_at<=9007199254740991),
 email TEXT UNIQUE,privacy_at BIGINT
);
CREATE TABLE IF NOT EXISTS sessions(
 token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_at BIGINT NOT NULL,expires_at BIGINT NOT NULL CHECK(expires_at>created_at),session_order BIGSERIAL UNIQUE
);
CREATE INDEX IF NOT EXISTS ninja_sessions_user ON sessions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS ninja_sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS profiles(
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,data TEXT NOT NULL CHECK(jsonb_typeof(data::jsonb)='object'),
 revision BIGINT NOT NULL DEFAULT 0 CHECK(revision>=0 AND revision<=9007199254740991),
 run_sequence BIGINT NOT NULL DEFAULT 0 CHECK(run_sequence>=0 AND run_sequence<=9007199254740991)
);
CREATE TABLE IF NOT EXISTS wallets(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 balance BIGINT NOT NULL DEFAULT 0 CHECK(balance>=0 AND balance<=9007199254740991));
CREATE TABLE IF NOT EXISTS ninja_game_migrations(version INTEGER PRIMARY KEY,applied_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS ninja_ledger(
 id BIGSERIAL PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,reference TEXT NOT NULL,kind TEXT NOT NULL,
 delta BIGINT NOT NULL CHECK(delta BETWEEN -9007199254740991 AND 9007199254740991),
 balance_after BIGINT NOT NULL CHECK(balance_after>=0 AND balance_after<=9007199254740991),created_at BIGINT NOT NULL,
 UNIQUE(user_id,reference)
);
CREATE TABLE IF NOT EXISTS ninja_actions(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,key TEXT NOT NULL,
 body_hash TEXT NOT NULL,response TEXT NOT NULL CHECK(jsonb_typeof(response::jsonb)='object'),created_at BIGINT NOT NULL,PRIMARY KEY(user_id,key));
CREATE TABLE IF NOT EXISTS ninja_runs(
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,seed TEXT NOT NULL,
 started_at BIGINT NOT NULL,expires_at BIGINT NOT NULL,initial TEXT NOT NULL CHECK(jsonb_typeof(initial::jsonb)='object'),profile_revision BIGINT NOT NULL,
 status TEXT NOT NULL CHECK(status IN('active','superseded','finished')),commands_hash TEXT,
 response TEXT CHECK(response IS NULL OR jsonb_typeof(response::jsonb)='object'),finished_at BIGINT,
 published INTEGER NOT NULL DEFAULT 0 CHECK(published IN(0,1))
);
CREATE INDEX IF NOT EXISTS ninja_runs_owner ON ninja_runs(user_id,status,started_at);
CREATE UNIQUE INDEX IF NOT EXISTS ninja_one_active_run ON ninja_runs(user_id) WHERE status='active';
CREATE TABLE IF NOT EXISTS ninja_verified_scores(
 run_id TEXT PRIMARY KEY REFERENCES ninja_runs(id) ON DELETE CASCADE,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 ruleset TEXT NOT NULL,score BIGINT NOT NULL CHECK(score>0 AND score<=9007199254740991),duration DOUBLE PRECISION NOT NULL CHECK(duration>0),
 decisions BIGINT NOT NULL CHECK(decisions>0 AND decisions<=9007199254740991),submitted_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS ninja_verified_score_order ON ninja_verified_scores(ruleset,score DESC,duration DESC,submitted_at);
`;

/** Async durable store; same business operations as SQLite, with isolated transactions. */
export async function createPostgresNinjaStore({databaseURL,now=()=>Date.now(),pool:providedPool}={}){
  const pool=providedPool||new Pool(postgresConnectionOptions(databaseURL));
  pool.on('error',()=>{}); // Requests fail closed; never log connection strings.
  const context=new AsyncLocalStorage();let closed=false;
  const timestamp=()=>{const stamp=now();if(!Number.isSafeInteger(stamp)||stamp<0)throw new TypeError('Invalid storage clock.');return stamp;};
  async function query(text,params=[]){if(closed)throw new Error('The database is closed.');return (context.getStore()||pool).query(text,params);}
  const db={
    prepare(sql){const text=postgresSQL(sql);return {
      get:async(...params)=>(await query(text,params)).rows[0],
      all:async(...params)=>(await query(text,params)).rows,
      run:async(...params)=>({changes:(await query(text,params)).rowCount})
    };},
    exec:sql=>query(sql)
  };
  async function transaction(callback){
    if(context.getStore())throw new Error('Nested PostgreSQL transactions are not supported.');
    for(let attempt=0;attempt<4;attempt++){
      const client=await pool.connect();
      try{
        await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
        const result=await context.run(client,()=>execute(callback()));
        await client.query('COMMIT');return result;
      }catch(error){
        try{await client.query('ROLLBACK');}catch{}
        if(['40001','40P01'].includes(error.code)){if(attempt<3)continue;throw failure(503,'DATABASE_BUSY','Bitte versuche die Anfrage erneut.');}
        throw error;
      }finally{client.release();}
    }
  }
  try{
    // DDL is atomic and serialized across simultaneous service starts.
    const client=await pool.connect();
    try{
      await client.query('BEGIN');await client.query('SELECT pg_advisory_xact_lock(1911,3)');
      await client.query('CREATE TABLE IF NOT EXISTS ninja_auth_migrations(version INTEGER PRIMARY KEY,applied_at BIGINT NOT NULL)');
      await client.query('CREATE TABLE IF NOT EXISTS ninja_game_migrations(version INTEGER PRIMARY KEY,applied_at BIGINT NOT NULL)');
      const versions=(await client.query('SELECT version FROM ninja_auth_migrations')).rows.map(row=>row.version);
      if(versions.some(version=>version>2))throw new Error('Database schema is newer than this service.');
      await client.query(migration);
      if(!versions.includes(2))await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_at BIGINT;
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email);
        ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_order BIGSERIAL;
        CREATE UNIQUE INDEX IF NOT EXISTS ninja_session_order ON sessions(session_order);
      `);
      const required={users:['id','username','username_key','password_hash','recovery_hash','created_at','email','privacy_at'],sessions:['token_hash','user_id','created_at','expires_at','session_order'],profiles:['user_id','data','revision','run_sequence'],wallets:['user_id','balance']};
      for(const [table,columns]of Object.entries(required)){
        const actual=new Set((await client.query('SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name=$1',[table])).rows.map(row=>row.column_name));
        if(columns.some(column=>!actual.has(column)))throw new Error('Existing database schema is incompatible; no data was replaced.');
      }
      await client.query('INSERT INTO ninja_auth_migrations(version,applied_at) VALUES(1,$1),(2,$1) ON CONFLICT DO NOTHING',[timestamp()]);
      await client.query('INSERT INTO ninja_game_migrations(version,applied_at) VALUES(1,$1) ON CONFLICT DO NOTHING',[timestamp()]);
      await client.query('COMMIT');
    }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
  }catch(error){if(!providedPool)await pool.end();throw error;}
  async function getUser(userId){
    const user=await db.prepare('SELECT id,username,created_at FROM users WHERE id=?').get(userId);
    if(!user)throw failure(404,'ACCOUNT_NOT_FOUND','Dieses Konto ist nicht verfügbar.');
    return {id:user.id,username:user.username,createdAt:user.created_at};
  }
  async function lockUser(userId){if(context.getStore())await query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[userId]);}
  async function getProfile(userId){
    await lockUser(userId);
    const row=(await query(`SELECT u.username,u.created_at,p.data,p.revision,p.run_sequence,w.balance
      FROM profiles p JOIN users u ON u.id=p.user_id JOIN wallets w ON w.user_id=p.user_id WHERE p.user_id=$1${context.getStore()?' FOR UPDATE OF p,w':''}`,[userId])).rows[0];
    if(!row)throw failure(404,'ACCOUNT_NOT_FOUND','Dieses Konto ist nicht verfügbar.');
    let profile;try{profile=JSON.parse(row.data);if(!object(profile))throw Error();}catch{throw failure(500,'PROFILE_UNREADABLE','Dein gespeichertes Profil kann gerade nicht geladen werden.');}
    profile.coins=row.balance;profile.player={...(object(profile.player)?profile.player:{}),username:row.username,createdAt:row.created_at};delete profile.player.guest;
    return {profile,revision:row.revision,runSequence:row.run_sequence};
  }
  async function putProfile(userId,value){
    if(!context.getStore())return transaction(()=>putProfile(userId,value));
    if(!object(value))throw new TypeError('A profile must be an object.');
    const previous=await getProfile(userId),profile=structuredClone(value);
    profile.coins=previous.profile.coins;profile.player={...(object(profile.player)?profile.player:{}),username:previous.profile.player.username,createdAt:previous.profile.player.createdAt};delete profile.player.guest;
    const json=JSON.stringify(profile);if(Buffer.byteLength(json)>524288)throw failure(413,'PROFILE_TOO_LARGE','Das Profil ist zu groß.');
    if(previous.revision>=MAX)throw failure(503,'PROFILE_REVISION_LIMIT','Dein Profil kann gerade nicht gespeichert werden.');
    const result=await db.prepare('UPDATE profiles SET data=?,revision=revision+1 WHERE user_id=? AND revision=?').run(json,userId,previous.revision);
    if(result.changes!==1)throw failure(409,'PROFILE_CHANGED','Das Profil wurde inzwischen geändert. Bitte versuche es erneut.');
    return getProfile(userId);
  }
  async function close(){if(closed)return;closed=true;if(!providedPool)await pool.end();}
  return {db,transaction,close,getUser,getProfile,putProfile,lockUser,dialect:'postgres',schemaVersion:2};
}
