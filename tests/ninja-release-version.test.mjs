import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {SKILLS,SUPERS,ACHIEVEMENTS} from '../notification-ninja/src/progression.js';
import {SKINS} from '../notification-ninja/src/skin-catalog.js';
import {SKIN_RARITIES} from '../notification-ninja/src/skin-presentation.js';
import {INTRO_DURATION} from '../notification-ninja/src/ninja-intro.js';
import {PLAYTIME_DEFAULTS,PLAYTIME_INTERVALS} from '../notification-ninja/src/playtime.js';
import {PODIUM_REWARDS} from '../server/ninja-competition.mjs';
import {CANONICAL_SITE_ORIGIN} from '../notification-ninja/src/site-location.js';
const root='notification-ninja/';
test('release version, homepage download links, SW cache and packaged filename agree',()=>{
  const version=JSON.parse(readFileSync(root+'dist/build.json','utf8')).version;
  const sw=readFileSync(root+'sw.js','utf8');
  const index=readFileSync(root+'index.html','utf8');
  const script=readFileSync('scripts/package_ninja.py','utf8');
  assert.equal(version,'3.13.3');
  assert(sw.includes('${PREFIX}'+version));
  assert.equal((index.match(/downloads\/Notification-Ninja-3\.13\.3\.zip/g)||[]).length,2);

  assert(script.includes("NAME='Notification-Ninja-"+version+"'"));
});

test('release metadata matches the expanded canonical catalogs and implemented online/device features',()=>{
  const metadata=JSON.parse(readFileSync(root+'dist/build.json','utf8'));
  assert.deepEqual([metadata.skills,metadata.supers,metadata.achievements,metadata.skins],[SKILLS.length,SUPERS.length,ACHIEVEMENTS.length,SKINS.length]);
  assert.equal(metadata.skinRarities,Object.keys(SKIN_RARITIES).length);assert.deepEqual(metadata.rarityTiers,Object.keys(SKIN_RARITIES));
  assert.equal(metadata.skillTree,'bazaar-abilities');assert.equal(metadata.intro,'original-canvas-cinematic');assert.equal(metadata.introDurationSeconds,INTRO_DURATION);
  assert.equal(metadata.devicePlaytime,true);assert.deepEqual(metadata.playtimeReminders,{deviceOnly:true,enabledByDefault:PLAYTIME_DEFAULTS.reminders,defaultMinutes:PLAYTIME_DEFAULTS.intervalMinutes,intervalsMinutes:[...PLAYTIME_INTERVALS]});
  assert.deepEqual(metadata.weeklyPodium,{calendar:'UTC',rewards:[...PODIUM_REWARDS],claims:'once-per-player-per-week',adminExcluded:true});
  assert.equal(metadata.canonicalOrigin,CANONICAL_SITE_ORIGIN);assert.equal(metadata.adminTestAccounts,'server-only');
});

test('release runtime dependencies are included in both offline manifests and trigger asset publication',()=>{
  const sw=readFileSync(root+'sw.js','utf8'),workflow=readFileSync('.github/workflows/notification-ninja-assets.yml','utf8');
  const files=JSON.parse(execFileSync('python3',['-c',`import ast,json
tree=ast.parse(open('scripts/package_ninja.py').read())
print(json.dumps(next(ast.literal_eval(node.value) for node in tree.body if isinstance(node,ast.Assign) and any(isinstance(target,ast.Name) and target.id=='FILES' for target in node.targets))))`],{encoding:'utf8'}));
  const markup=readFileSync(root+'index.html','utf8')+readFileSync(root+'home.html','utf8');
  for(const file of ['presentation-polish.css','intro-experience.css','playtime-experience.css','theme-boot.js']){
    assert(markup.includes(`./${file}`),file+' is requested by the runtime');
    assert(sw.includes(`'./${file}'`),file+' has a service-worker fallback');
    assert(files.includes(file),file+' is available in the standalone guest archive');
    assert(workflow.includes(`'notification-ninja/${file}'`),file+' changes trigger asset publication');
  }
});
