/** Local, deterministic progression. Currency is earned through play; no network or storage is used here. */
const freezeRows = rows => Object.freeze(rows.map(row => Object.freeze({
  ...row,
  ...(row.requires ? {requires:Object.freeze([...row.requires])} : {}),
  ...(row.palette ? {palette:Object.freeze({...row.palette})} : {}),
  ...(row.preview ? {preview:Object.freeze([...row.preview])} : {})
})));

export const DIFFICULTIES = freezeRows([
  {id:'easy',name:'Entspannt',lives:5,flight:4.6,spawn:1.75,speedCap:1.35,coinMultiplier:1},
  {id:'normal',name:'Normal',lives:4,flight:3.8,spawn:1.4,speedCap:1.65,coinMultiplier:1.25},
  {id:'hard',name:'Profi',lives:3,flight:3.1,spawn:1.15,speedCap:1.95,coinMultiplier:1.5}
]);

export const SKILLS = freezeRows([
  {id:'focus-root',name:'Klarer Kopf',description:'Jede richtige Entscheidung lädt deinen Super um 2 zusätzliche Punkte auf.',cost:12,branch:'focus',requires:[],type:'passive',effect:'charge-boost',icon:'◉'},
  {id:'slow-super',name:'Zeitzauber',description:'Super: Alle Gegenstände bewegen sich 8 Sekunden lang langsamer. Die Rundenuhr läuft normal weiter.',cost:25,branch:'focus',requires:['focus-root'],type:'super',effect:'slow',icon:'◷'},
  {id:'flow-boost',name:'Flow-Meister',description:'Dein Focus Flow hält 2 Sekunden länger an.',cost:45,branch:'focus',requires:['slow-super'],type:'passive',effect:'flow-duration',icon:'✦'},
  {id:'guard-root',name:'Gut vorbereitet',description:'Du beginnst jede neue Runde mit einem Schild gegen genau einen Fehler.',cost:12,branch:'guard',requires:[],type:'passive',effect:'start-shield',icon:'⬡'},
  {id:'shield-super',name:'Rettungsschirm',description:'Super: Erhalte einen Schild, der genau einen Fehler abfängt.',cost:25,branch:'guard',requires:['guard-root'],type:'super',effect:'shield',icon:'☂'},
  {id:'second-chance',name:'Zweite Chance',description:'Einmal pro Runde erhältst du beim letzten verlorenen Herz ein neues Herz.',cost:45,branch:'guard',requires:['shield-super'],type:'passive',effect:'revive',icon:'♥'},
  {id:'coin-root',name:'Münzgespür',description:'Verdiene für je 4 richtige Entscheidungen eine Münze statt für je 5.',cost:12,branch:'coins',requires:[],type:'passive',effect:'coin-frequency',icon:'●'},
  {id:'sweep-super',name:'Aufräum-Wirbel',description:'Super: Räume alle Ablenkungen auf einmal ab. Sinnvolle Dinge bleiben unberührt.',cost:25,branch:'coins',requires:['coin-root'],type:'super',effect:'sweep',icon:'↻'},
  {id:'coin-boost',name:'Goldener Lauf',description:'Verdiene beim Spielen 25 % mehr Münzen.',cost:45,branch:'coins',requires:['sweep-super'],type:'passive',effect:'coin-multiplier',icon:'★'}
]);

export const SUPERS = Object.freeze(SKILLS.filter(skill => skill.type === 'super'));

export const WORLDS = freezeRows([
  {id:'study',name:'Schulzimmer',description:'Dein Start: Lernhefte behalten und Ablenkungen wegwischen.',context:'study',cost:0,requires:[]},
  {id:'gaming',name:'Gaming-Zimmer',description:'Neue Gegenstände, neue Prioritäten: Jetzt darf das Spielen im Mittelpunkt stehen.',context:'gaming',cost:35,requires:['study']},
  {id:'sleep',name:'Schlafzimmer',description:'Teddy, Kissen und ruhige Nächte: Finde deine Grenze vor dem Schlafengehen.',context:'sleep',cost:75,requires:['gaming']},
  {id:'master',name:'Balance Master',description:'Alle drei Räume wechseln sich ab. Erkenne, was in diesem Moment wichtig ist.',context:'study',cost:120,requires:['sleep']}
]);

export const BACKGROUNDS = freezeRows([
  {id:'classroom',name:'Sonniges Klassenzimmer',description:'Warme Farben, ein weiter Blick und Platz für klare Gedanken.',context:'study',cost:0,requiresWorld:'study',icon:'✎',palette:{sky:'#b5e0ed',floor:'#e7be8d',accent:'#edba66',detail:'#73a890'},preview:['#b5e0ed','#e7be8d','#edba66','#73a890']},
  {id:'game-room',name:'Gemütliche Gaming-Ecke',description:'Eine bunte Spielecke für deine Runde mit dem Team.',context:'gaming',cost:0,requiresWorld:'gaming',icon:'✚',palette:{sky:'#cdc6ee',floor:'#bfa4c5',accent:'#a5cfaa',detail:'#e5b36f'},preview:['#cdc6ee','#bfa4c5','#a5cfaa','#e5b36f']},
  {id:'bedroom',name:'Sternen-Schlafzimmer',description:'Ein ruhiger Lieblingsplatz unter dem Abendhimmel.',context:'sleep',cost:0,requiresWorld:'sleep',icon:'☾',palette:{sky:'#7f91bf',floor:'#c5b1ba',accent:'#efd093',detail:'#a8c6c1'},preview:['#7f91bf','#c5b1ba','#efd093','#a8c6c1']},
  {id:'paper-garden',name:'Papiergarten',description:'Zwischen riesigen Papierblumen und Origami-Vögeln wird Lernen zum kleinen Ausflug.',context:'study',cost:60,requiresWorld:'study',icon:'❀',palette:{sky:'#c6e8ca',floor:'#d8c9a3',accent:'#eea8b3',detail:'#88b7a5'},preview:['#c6e8ca','#d8c9a3','#eea8b3','#88b7a5']},
  {id:'pixel-cove',name:'Pixelbucht',description:'Deine Gaming-Auszeit auf einer bunten Insel mit Pixelwellen und Palmen.',context:'gaming',cost:85,requiresWorld:'gaming',icon:'⚑',palette:{sky:'#9bdfef',floor:'#f4d496',accent:'#f29a88',detail:'#7fc9a3'},preview:['#9bdfef','#f4d496','#f29a88','#7fc9a3']},
  {id:'moon-isles',name:'Mondinseln',description:'Schwebende Wolkeninseln, sanftes Sternenlicht und ein großer freundlicher Mond.',context:'sleep',cost:110,requiresWorld:'sleep',icon:'☁',palette:{sky:'#8f8cc5',floor:'#c0c2e8',accent:'#f0dca3',detail:'#a4cae0'},preview:['#8f8cc5','#c0c2e8','#f0dca3','#a4cae0']}
]);

export const ACHIEVEMENTS = freezeRows([
  {id:'first-cut',name:'Erster Wischer',description:'Zerteile deine erste Ablenkung.',reward:3,icon:'✂',stat:'unlocked',target:1},
  {id:'flow-five',name:'Im Flow',description:'Aktiviere zum ersten Mal Focus Flow.',reward:5,icon:'✦',stat:'unlocked',target:1},
  {id:'careful-stage',name:'Mit Köpfchen',description:'Schließe einen Abschnitt ohne Entscheidungsfehler ab.',reward:8,icon:'✓',stat:'unlocked',target:1},
  {id:'healthy-stop',name:'Meine Grenze',description:'Beende Gaming oder Schlaf bewusst mit dem Stopp-Knopf.',reward:8,icon:'☾',stat:'unlocked',target:1},
  {id:'context-master',name:'Balance-Meister',description:'Schaffe die Kampagne oder Balance Master.',reward:15,icon:'♛',stat:'unlocked',target:1},
  {id:'combo-10',name:'Zehner-Serie',description:'Erreiche eine Kombo von 10.',reward:8,icon:'10',stat:'bestCombo',target:10},
  {id:'combo-25',name:'Unaufhaltsam',description:'Erreiche eine Kombo von 25.',reward:15,icon:'25',stat:'bestCombo',target:25},
  {id:'coins-100',name:'Münzsammler',description:'Verdiene insgesamt 100 Münzen. Ausgeben ist erlaubt.',reward:12,icon:'●',stat:'coinsEarned',target:100},
  {id:'correct-250',name:'Gute Instinkte',description:'Triff insgesamt 250 richtige Entscheidungen.',reward:20,icon:'◎',stat:'correct',target:250},
  {id:'hard-clear',name:'Profi-Ninja',description:'Schließe eine Runde auf Profi ab.',reward:25,icon:'★',stat:'hardClears',target:1},
  {id:'first-super',name:'Superkraft!',description:'Setze zum ersten Mal einen Super ein.',reward:8,icon:'⚡',stat:'superUses',target:1},
  {id:'first-skill',name:'Mein eigener Weg',description:'Schalte deine erste Fähigkeit im Baum frei.',reward:6,icon:'♧',stat:'unlockedSkills',target:1}
]);

const MAX = Number.MAX_SAFE_INTEGER;
const skillMap = new Map(SKILLS.map(skill => [skill.id,skill]));
const worldMap = new Map(WORLDS.map(world => [world.id,world]));
const backgroundMap = new Map(BACKGROUNDS.map(background => [background.id,background]));
const baseBackgrounds = {study:'classroom',gaming:'game-room',sleep:'bedroom'};
const achievementMap = new Map(ACHIEVEMENTS.map(item => [item.id,item]));
const statKeys = ['correct','coinsEarned','superUses','bestCombo','hardClears'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const count = value => typeof value === 'number' && Number.isFinite(value) ? Math.max(0,Math.min(MAX,Math.trunc(value))) : 0;
const failure = reason => ({ok:false,reason});
const validAchievements = value => [...new Set((Array.isArray(value) ? value : []).filter(id => achievementMap.has(id)))];

export const getDifficulty = id => DIFFICULTIES.find(difficulty => difficulty.id === id) || DIFFICULTIES[0];
export const getSkill = id => skillMap.get(id) || null;
export const getWorld = id => worldMap.get(id) || null;
export const getBackground = id => backgroundMap.get(id) || null;

/** Read and validate new fields without changing old saved profiles or retaining mutable references. */
export function sanitizeProgress(profile) {
  const source = object(profile) ? profile : {};
  const requested = new Set(Array.isArray(source.unlockedSkills) ? source.unlockedSkills : []);
  const unlockedSkills = [];
  // The data is parent-first. An orphaned or unknown node never grants a passive or a super.
  for (const skill of SKILLS) {
    if (requested.has(skill.id) && skill.requires.every(parent => unlockedSkills.includes(parent))) unlockedSkills.push(skill.id);
  }
  const selected = skillMap.get(source.selectedSuper);
  const selectedSuper = selected?.type === 'super' && unlockedSkills.includes(selected.id) ? selected.id : null;
  const stats = Object.fromEntries(statKeys.map(key => [key,count(source.stats?.[key])]));
  const requestedWorlds = new Set(Array.isArray(source.unlockedWorlds) ? source.unlockedWorlds : []);
  const unlockedWorlds = ['study'];
  for (const world of WORLDS) {
    if (world.id !== 'study' && requestedWorlds.has(world.id) && world.requires.every(parent => unlockedWorlds.includes(parent))) unlockedWorlds.push(world.id);
  }
  const requestedBackgrounds = new Set(Array.isArray(source.unlockedBackgrounds) ? source.unlockedBackgrounds : []);
  const unlockedBackgrounds = BACKGROUNDS.filter(background => background.cost === 0 ||
    requestedBackgrounds.has(background.id) && unlockedWorlds.includes(background.requiresWorld)).map(background => background.id);
  const selectedBackgrounds = Object.fromEntries(Object.entries(baseBackgrounds).map(([context,baseId]) => {
    const selectedBackground = backgroundMap.get(source.selectedBackgrounds?.[context]);
    return [context,selectedBackground?.context === context && unlockedBackgrounds.includes(selectedBackground.id) ? selectedBackground.id : baseId];
  }));
  return {unlockedSkills,selectedSuper,stats,claimedAchievements:validAchievements(source.claimedAchievements),unlockedWorlds,unlockedBackgrounds,selectedBackgrounds};
}

/** Unlock cumulative milestones. Existing five story achievements remain controlled by the game rules. */
export function unlockAchievements(profile) {
  if (!object(profile)) return [];
  const progress = sanitizeProgress(profile);
  const existing = validAchievements(profile.achievements);
  const eligible = [
    ['combo-10',progress.stats.bestCombo >= 10],
    ['combo-25',progress.stats.bestCombo >= 25],
    ['coins-100',progress.stats.coinsEarned >= 100],
    ['correct-250',progress.stats.correct >= 250],
    ['hard-clear',progress.stats.hardClears >= 1],
    ['first-super',progress.stats.superUses >= 1],
    ['first-skill',progress.unlockedSkills.length >= 1]
  ];
  const added = eligible.filter(([id,ready]) => ready && !existing.includes(id)).map(([id]) => id);
  profile.achievements = [...existing,...added];
  return added;
}

/** Presentation-safe progress, including locked milestones whose counters have not reached the target. */
export function getAchievementProgress(profile,id) {
  const achievement = achievementMap.get(id);
  if (!achievement) return {current:0,target:1,unlocked:false,claimed:false};
  const progress = sanitizeProgress(profile);
  const unlocked = validAchievements(profile?.achievements).includes(id);
  const raw = achievement.stat === 'unlocked' ? Number(unlocked)
    : achievement.stat === 'unlockedSkills' ? progress.unlockedSkills.length : progress.stats[achievement.stat];
  return {current:Math.min(achievement.target,count(raw)),target:achievement.target,unlocked,claimed:progress.claimedAchievements.includes(id)};
}

/** Purchases are atomic: any rejected request leaves the entire profile untouched. */
export function buySkill(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const skill = skillMap.get(id);
  if (!skill) return failure('Diese Fähigkeit gibt es nicht.');
  const progress = sanitizeProgress(profile);
  if (progress.unlockedSkills.includes(id)) return failure('Diese Fähigkeit ist bereits freigeschaltet.');
  if (!skill.requires.every(parent => progress.unlockedSkills.includes(parent))) return failure('Schalte zuerst die vorherige Fähigkeit in diesem Zweig frei.');
  const coins = count(profile.coins);
  if (coins < skill.cost) return failure('Dafür fehlen noch Münzen.');
  progress.unlockedSkills.push(id);
  if (skill.type === 'super' && !progress.selectedSuper) progress.selectedSuper = id;
  Object.assign(profile,progress,{coins:coins-skill.cost});
  const achievements = unlockAchievements(profile);
  return {ok:true,id,coins:profile.coins,selectedSuper:profile.selectedSuper,achievements};
}

export function equipSuper(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const progress = sanitizeProgress(profile);
  if (id !== null) {
    const skill = skillMap.get(id);
    if (!skill || skill.type !== 'super') return failure('Wähle eine Super-Fähigkeit.');
    if (!progress.unlockedSkills.includes(id)) return failure('Schalte diesen Super zuerst im Fähigkeitenbaum frei.');
  }
  progress.selectedSuper = id;
  Object.assign(profile,progress);
  return {ok:true,id,selectedSuper:id};
}

/** Rooms unlock in order; buying access never switches or restarts the active game. */
export function buyWorld(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const world = worldMap.get(id);
  if (!world) return failure('Diesen Raum gibt es nicht.');
  const progress = sanitizeProgress(profile);
  if (progress.unlockedWorlds.includes(id)) return failure('Dieser Raum ist bereits freigeschaltet.');
  if (!world.requires.every(parent => progress.unlockedWorlds.includes(parent))) return failure('Schalte zuerst den vorherigen Raum frei.');
  const coins = count(profile.coins);
  if (coins < world.cost) return failure('Dafür fehlen noch Münzen.');
  progress.unlockedWorlds.push(id);
  Object.assign(profile,progress,{coins:coins-world.cost});
  return {ok:true,id,coins:profile.coins,unlockedWorlds:[...profile.unlockedWorlds]};
}

/** Premium room art is cosmetic and becomes selectable after a separate explicit equip action. */
export function buyBackground(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const background = backgroundMap.get(id);
  if (!background) return failure('Diesen Hintergrund gibt es nicht.');
  const progress = sanitizeProgress(profile);
  if (!progress.unlockedWorlds.includes(background.requiresWorld)) return failure('Schalte zuerst den passenden Raum frei.');
  if (progress.unlockedBackgrounds.includes(id)) return failure('Dieser Hintergrund gehört dir bereits.');
  const coins = count(profile.coins);
  if (coins < background.cost) return failure('Dafür fehlen noch Münzen.');
  progress.unlockedBackgrounds.push(id);
  Object.assign(profile,progress,{coins:coins-background.cost});
  return {ok:true,id,coins:profile.coins};
}

export function equipBackground(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const background = backgroundMap.get(id);
  if (!background) return failure('Diesen Hintergrund gibt es nicht.');
  const progress = sanitizeProgress(profile);
  if (!progress.unlockedWorlds.includes(background.requiresWorld)) return failure('Schalte zuerst den passenden Raum frei.');
  if (!progress.unlockedBackgrounds.includes(id)) return failure('Kaufe diesen Hintergrund zuerst im Shop.');
  progress.selectedBackgrounds[background.context] = id;
  Object.assign(profile,progress);
  return {ok:true,id,context:background.context,selectedBackgrounds:{...profile.selectedBackgrounds}};
}

/** A reward is credited only when explicitly claimed, once per achievement across reloads. */
export function claimAchievement(profile,id) {
  if (!object(profile)) return failure('Der Spielstand ist ungültig.');
  const achievement = achievementMap.get(id);
  if (!achievement) return failure('Diese Errungenschaft gibt es nicht.');
  if (!validAchievements(profile.achievements).includes(id)) return failure('Diese Errungenschaft ist noch nicht erreicht.');
  const progress = sanitizeProgress(profile);
  if (progress.claimedAchievements.includes(id)) return failure('Diese Belohnung hast du schon abgeholt.');
  const coins = count(profile.coins);
  const reward = Math.min(achievement.reward,MAX-coins);
  progress.claimedAchievements.push(id);
  progress.stats.coinsEarned = Math.min(MAX,progress.stats.coinsEarned+reward);
  Object.assign(profile,progress,{coins:coins+reward});
  const achievements = unlockAchievements(profile);
  return {ok:true,id,reward,coins:profile.coins,achievements};
}
