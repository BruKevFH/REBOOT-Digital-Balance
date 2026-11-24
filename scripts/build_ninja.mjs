/* Release 3.13.1: bundle the expanded dojo and record its canonical catalog. */
import {build} from 'esbuild';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SKILLS,SUPERS,ACHIEVEMENTS,WORLDS,BACKGROUNDS,DIFFICULTIES} from '../notification-ninja/src/progression.js';
import {SKINS} from '../notification-ninja/src/skin-catalog.js';
import {SKIN_RARITIES} from '../notification-ninja/src/skin-presentation.js';
import {INTRO_DURATION} from '../notification-ninja/src/ninja-intro.js';
import {PLAYTIME_DEFAULTS,PLAYTIME_INTERVALS} from '../notification-ninja/src/playtime.js';
import {PODIUM_REWARDS} from '../server/ninja-competition.mjs';

/** A public account switch is build metadata, never evidence of a tested deployment. */
export function publicAccountsConfigured(config){
  if(!config||typeof config!=='object'||Array.isArray(config)||typeof config.enabled!=='boolean'||config.apiVersion!==3)throw new TypeError('accounts-config.json requires a boolean enabled and apiVersion 3.');
  if(!config.enabled)return false;
  let endpoint;try{endpoint=new URL(config.endpoint);}catch{throw new TypeError('Public accounts require an absolute HTTPS endpoint.');}
  if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||!/^\/api\/v3\/?$/.test(endpoint.pathname))throw new TypeError('Public accounts require an HTTPS /api/v3 endpoint without credentials, query or fragment.');
  return true;
}

export async function buildNinja(){
const accountsConfigured=publicAccountsConfigured(JSON.parse(await readFile('notification-ninja/accounts-config.json','utf8')));
await mkdir('notification-ninja/dist',{recursive:true});
await build({entryPoints:['notification-ninja/src/home.js'],bundle:true,format:'iife',target:['es2020'],outfile:'notification-ninja/dist/home.js',minify:true,legalComments:'eof',sourcemap:false,logLevel:'info'});
await build({entryPoints:['notification-ninja/src/main.js'],bundle:true,format:'iife',target:['es2020'],outfile:'notification-ninja/dist/ninja.js',minify:true,legalComments:'eof',sourcemap:false,logLevel:'info'});
await writeFile('notification-ninja/dist/build.json',JSON.stringify({
  name:'Notification Ninja',version:'3.13.1',engine:'Canvas 2D / Web Audio',style:'Sakura indie dojo',
  sharedPlayMenu:true,illustrationAtlas:true,illustratedScenes:true,senseiScenarios:12,notificationCodex:true,
  dressingRoom:true,missionDetailsSheet:true,deviceHandedness:true,roundCoaching:true,illustratedRoomArt:true,
  villageMap:true,logo:'assets/indie-wordmark.png',languages:['de','en'],guestPlay:true,
  quickRounds:['study','gaming','sleep'],calmEffects:true,reflection:true,entry:'index.html',homepage:'home.html',
  inbox:'unread-only',offline:true,levels:4,difficulties:DIFFICULTIES.length,skills:SKILLS.length,
  supers:SUPERS.length,achievements:ACHIEVEMENTS.length,worlds:WORLDS.length,backgrounds:BACKGROUNDS.length,
  localProfile:true,ninjaGuide:true,unlockInbox:50,skillTree:'bazaar-abilities',openRun:true,animatedPlayer:true,
  publicLanding:true,throwerCounts:[1,2,3],realHandThrows:true,fullscreen:true,
  hudLayout:'framed-arena-bottom-ribbon',largeHearts:true,ninjaRanks:5,skins:SKINS.length,
  skinRarities:Object.keys(SKIN_RARITIES).length,rarityTiers:Object.keys(SKIN_RARITIES),
  dailyChallenges:3,careerMissions:26,mainMissions:18,accountAPI:3,accountSync:true,
  publicAccountsConfigured:accountsConfigured,canonicalOrigin:'https://notification-ninja-accounts.onrender.com',
  backendRequiresPersistentDatabase:true,databaseAdapters:['postgresql','sqlite'],bossRush:true,dailyRun:true,
  registrationEmailAndConsent:true,accessiblePractice:true,autoplayBosses:3,weeklyChallenges:3,
  weeklyOutfits:['lotus','ember','tide'],comboMilestones:[10,25,50],dynamicWorld:true,menuMusic:true,
  intro:'original-canvas-cinematic',introDurationSeconds:INTRO_DURATION,
  devicePlaytime:true,playtimeReminders:{deviceOnly:true,enabledByDefault:PLAYTIME_DEFAULTS.reminders,
    defaultMinutes:PLAYTIME_DEFAULTS.intervalMinutes,intervalsMinutes:[...PLAYTIME_INTERVALS]},
  weeklyPodium:{calendar:'UTC',rewards:[...PODIUM_REWARDS],claims:'once-per-player-per-week',adminExcluded:true},
  adminTestAccounts:'server-only',openRuleset:'open-v2',openHearts:3,leaderboard:'server-replay-automatic-new-account-runs'
},null,2)+'\n');
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildNinja();
