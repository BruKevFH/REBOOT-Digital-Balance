import {SKILLS,WORLDS,BACKGROUNDS,ACHIEVEMENTS} from './progression.js';

/** Local player identity and progress derived from existing gameplay counters. */
export const GUIDE_IDS = Object.freeze([
  'daily-ready','rank:beginner','rank:dawn','rank:shadow','rank:temple','rank:grandmaster','welcome','training-intro','training-swipe','training-keep','training-complete',
  'first-coins','first-powerup','first-flow','first-skill','first-super-unlock',
  'super-ready','first-super-use','first-world','first-background','first-skin',
  'first-achievement','first-reward','profile','world-map','shop','skills',
  'achievements','study','gaming','sleep','master','level-up',
  ...SKILLS.map(item => `skill:${item.id}`),
  ...WORLDS.map(item => `world:${item.id}`),
  ...BACKGROUNDS.map(item => `background:${item.id}`),
  ...['default','solar','mint','neon','dawn','shadow','grandmaster'].map(id => `skin:${id}`),
  ...ACHIEVEMENTS.map(item => `achievement:${item.id}`)
]);

const MAX = Number.MAX_SAFE_INTEGER;
const MAX_DATE = 8640000000000000;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const count = value => typeof value === 'number' && Number.isFinite(value)
  ? Math.max(0, Math.min(MAX, Math.trunc(value))) : 0;
const invalid = reason => ({ok:false,username:'',reason});

/** Only authored unlocks and bounded, canonical level numbers enter the local inbox. */
export function validateNotification(value) {
  if (!object(value) || typeof value.type !== 'string' || typeof value.ref !== 'string') {
    return {ok:false,reason:'Diese Mitteilung ist ungültig.'};
  }
  const {type,ref}=value;
  const known=type==='level'
    ? /^[1-9]\d{0,5}$/.test(ref) && Number(ref)>=2 && Number(ref)<=100000
    : ['skill','world','background','skin','achievement'].includes(type) && GUIDE_IDS.includes(`${type}:${ref}`);
  if (!known) return {ok:false,reason:'Diese Freischaltung gibt es nicht.'};
  return {ok:true,id:`${type}:${ref}`,type,ref};
}

function normalizeNotifications(value) {
  const notifications=[],ids=new Set();
  for (const entry of Array.isArray(value) ? value : []) {
    const item=validateNotification(entry);
    if (!item.ok || ids.has(item.id)) continue;
    ids.add(item.id);
    notifications.push({id:item.id,type:item.type,ref:item.ref,
      createdAt:Math.min(MAX_DATE,count(entry.createdAt)),read:entry.read===true});
    if (notifications.length===50) break;
  }
  return notifications;
}

/** Normalize ordinary spacing and accents without accepting markup or hidden controls. */
export function validateUsername(value) {
  if (typeof value !== 'string') return invalid('Wähle einen Ninja-Namen.');
  if (/[\p{Cc}\p{Cf}\u2028\u2029]/u.test(value)) {
    return invalid('Der Name darf keine Steuerzeichen oder Zeilenumbrüche enthalten.');
  }
  const username = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  const length = Array.from(username).length;
  if (length < 3 || length > 18) return invalid('Dein Ninja-Name braucht 3 bis 18 Zeichen.');
  if (!/^[\p{L}\p{N} _-]+$/u.test(username)) {
    return invalid('Nutze nur Buchstaben, Zahlen, Leerzeichen, _ oder -.');
  }
  return {ok:true,username};
}

/** Missing or damaged identity fields never reset the wallet or any gameplay unlocks. */
export function normalizePlayer(profile) {
  const source = object(profile?.player) ? profile.player : {};
  const name = validateUsername(source.username);
  return {
    username:name.ok ? name.username : '',
    createdAt:name.ok ? Math.min(MAX_DATE, count(source.createdAt)) : 0,
    guideSeen:[...new Set((Array.isArray(source.guideSeen) ? source.guideSeen : [])
      .filter(id => GUIDE_IDS.includes(id)))],
    notifications:normalizeNotifications(source.notifications)
  };
}

const multiply = (value, factor) => value > Math.floor(MAX / factor) ? MAX : value * factor;
const add = (a, b) => a > MAX - b ? MAX : a + b;

/** Cumulative XP and level thresholds; no separate, editable XP balance is stored. */
export function getPlayerProgress(profile) {
  const source = object(profile) ? profile : {};
  const stats = object(source.stats) ? source.stats : {};
  const xp = add(add(multiply(count(stats.correct), 5), multiply(count(stats.superUses), 10)),
    multiply(count(source.totalRuns), 25));
  const level = 1 + Math.floor(Math.sqrt(xp / 100));
  const currentXP = 100 * (level - 1) ** 2;
  const nextXP = Math.min(MAX, 100 * level ** 2);
  const needed = nextXP - xp;
  const progress = Math.max(0, Math.min(1, (xp - currentXP) / (nextXP - currentXP)));
  return {xp,level,currentXP,nextXP,needed,progress};
}
