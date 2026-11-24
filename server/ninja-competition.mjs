/** Shared durable competition metadata. No client clock or claimed rank is accepted. */
export const PODIUM_REWARDS=Object.freeze([100,60,30]);
export const ADMIN_TEST_BUDGET=1_000_000_000;
export const WEEK_MS=7*24*60*60*1000;
export function utcWeekStart(stamp){
  const date=new Date(stamp),day=date.getUTCDay()||7;
  return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()-day+1);
}
export const weekId=stamp=>new Date(stamp).toISOString().slice(0,10);
export function competitionSchema(dialect='sqlite'){
  const integer=dialect==='postgres'?'BIGINT':'INTEGER',real=dialect==='postgres'?'DOUBLE PRECISION':'REAL';
  return `
    CREATE TABLE IF NOT EXISTS ninja_feature_migrations(version INTEGER PRIMARY KEY,applied_at ${integer} NOT NULL);
    CREATE TABLE IF NOT EXISTS ninja_admin_accounts(
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      created_at ${integer} NOT NULL CHECK(created_at>=0)
    );
    CREATE TABLE IF NOT EXISTS ninja_competition_settings(name TEXT PRIMARY KEY,value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS ninja_podium_weeks(
      week_start ${integer} PRIMARY KEY,settled_at ${integer} NOT NULL,eligible_entries INTEGER NOT NULL CHECK(eligible_entries>=0)
    );
    CREATE TABLE IF NOT EXISTS ninja_podium_rewards(
      week_start ${integer} NOT NULL REFERENCES ninja_podium_weeks(week_start) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      place INTEGER NOT NULL CHECK(place BETWEEN 1 AND 3),
      coins INTEGER NOT NULL CHECK(coins=CASE place WHEN 1 THEN 100 WHEN 2 THEN 60 ELSE 30 END),
      run_id TEXT NOT NULL,score ${integer} NOT NULL CHECK(score>0),duration ${real} NOT NULL CHECK(duration>0),
      submitted_at ${integer} NOT NULL,claimed_at ${integer},
      PRIMARY KEY(week_start,place),UNIQUE(week_start,user_id)
    );
    CREATE INDEX IF NOT EXISTS ninja_podium_owner ON ninja_podium_rewards(user_id,week_start DESC);
  `;
}
export function accountAccess(user){
  const admin=user?.role==='admin';
  return {role:admin?'admin':'player',sandbox:admin,unlimitedCoins:admin};
}
