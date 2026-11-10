import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {legendaryDojos,legendaryCareer,legendaryWorldDetail} from '../notification-ninja/src/ninja-legend-ui.js';
import {CAREER_MISSIONS} from '../notification-ninja/src/adventure.js';

const root='notification-ninja/';
const read=p=>readFileSync(root+p,'utf8');
const missions=CAREER_MISSIONS.map((m,i)=>({
 ...m,completed:i===0,available:i<=1,claimed:false,current:i===0?m.target:0,
 target:m.target||8,reward:m.reward||5,best:null,missingRequirements:i>1?[CAREER_MISSIONS[i-1].id]:[]
}));

test('the new village is an interactive illustration with exactly three distinct primary Dojo buttons',()=>{
 const html=legendaryDojos();
 assert.match(html,/nn-village-stage/);
 assert.match(html,/assets\/overworld-landscape-v4\.svg/);
 assert.equal((html.match(/data-world-enter=/g)||[]).length,3);
 for(const id of ['study','gaming','sleep']){
  assert.match(html,new RegExp('nn-village-gate-'+id));
  assert.match(html,new RegExp('data-world-enter="'+id+'"'));
  assert.match(html,new RegExp('assets/dojo-'+id+'-v5\\.svg'));
 }
 assert(!html.includes('data-game-route="campaign"'),'Career must not be duplicated in world selection');
 assert(html.includes('ninjaMascot')===false,'The mascot is rendered as actual vector markup');
});

test('career journey has 18 data-bound map stones, three readable regions and real missions',()=>{
 const html=legendaryCareer({missions,selectedId:'study-01'});
 assert.equal((html.split('class="nn-career-bosses"')[0].match(/class="nn-career-node is-/g)||[]).length,18);
 assert.equal((html.match(/class="nn-career-chapter nn-career-chapter-/g)||[]).length,3);
 assert.equal((html.match(/class="nn-career-trail-path"/g)||[]).length,3);
 assert.equal((html.match(/class="nn-career-boss is-/g)||[]).length,3);
 assert(html.includes('data-mission-start="study-01"'));
 assert(html.includes('data-career-claim="study-01"'));
 assert(!html.includes('data-career-claim="sleep-06"'));
 assert(html.includes('nn-career-path-mascot'));
 assert(html.includes('class="nn-career-node-number nn-career-direct-start"'));
 assert(!html.includes('nn-career-territory'), 'No repeated inset card on top of the adventure scenery');
});

test('each illustrated world still runs the genuine contextual quick round',()=>{
 for(const id of ['study','gaming','sleep']){
  const html=legendaryWorldDetail(id);
  assert(html.includes('data-quick-context="'+id+'"'));
  assert(html.includes('data-world-practice="'+id+'"'));
  assert(html.includes('nn-inside-scroll'));
 }
});

test('illustrated backgrounds, accessible meaning and real success animation are packaged offline',()=>{
 const index=read('index.html'),sw=read('sw.js'),packageScript=readFileSync('scripts/package_ninja.py','utf8');
 const css=read('illustrated-adventure-v4.css'),map=read('assets/overworld-landscape-v4.svg');
 assert(existsSync(root+'assets/overworld-landscape-v4.svg'));
 assert(index.includes('href="./illustrated-adventure-v4.css"'));
 assert(index.includes('id="nn-celebration-root"'));
 assert(index.includes('class="nn-hud-meaning"'));
 for(const file of ['illustrated-adventure-v4.css','assets/overworld-landscape-v4.svg','dojo-worlds-v5.css',...['study','gaming','sleep'].map(id=>'assets/dojo-'+id+'-v5.svg')]){
  assert(sw.includes('./'+file));assert(packageScript.includes("'"+file+"'"));
 }
 assert.match(map,/viewBox="0 0 1600 850"/);
 assert.doesNotMatch(map.replace('http://www.w3.org/2000/svg',''),/<script|<foreignObject|https?:\/\//i);
 assert(css.includes('prefers-reduced-motion:reduce'));
 assert(css.includes('body.calm-view'));
 const newCss=read('dojo-worlds-v5.css');assert(newCss.includes('prefers-reduced-motion:reduce'));assert(newCss.includes('nn-village-gate-gaming'));
 const main=read('src/main.js');
 for(const event of ['level-complete','career-completed','boss-defeated','rank-unlocked'])assert(main.includes("e.type==='"+event+"'"));
 assert(main.includes("celebrateUnlock(type,ref)"));
 assert(css.includes(".nn-celebration.nn-celebration-skin"));
});
