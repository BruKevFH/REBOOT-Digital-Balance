import test from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {CAREER_MISSIONS} from '../notification-ninja/src/adventure.js';
import {legendaryCareer,legendaryDojos,legendaryModes,legendaryLeaderboard} from '../notification-ninja/src/ninja-legend-ui.js';

const fixture=CAREER_MISSIONS.map((mission,i)=>({
  ...mission,
  completed:i===0,claimed:false,
  available:i<=1,
  current:i===0?mission.target:0,
  worldLocked:i>6,
  target:mission.target,
  best:i===0?{score:1240,correct:12}:null,
  missingRequirements:i>1?[CAREER_MISSIONS[i-1]?.id||'study-01']:[],
}));

test('rendered campaign has all 18 genuine main missions on connected paths',()=>{
 const html=legendaryCareer({missions:fixture,selectedId:'study-01'});
 assert.equal((html.match(/class="legend-map-node /g)||[]).length,18);
 assert.equal((html.match(/class="legend-map-chapter /g)||[]).length,3);
 assert.equal((html.match(/class="legend-map-lines"/g)||[]).length,3);
 assert(html.includes('data-mission-inspect="study-01"'));
 assert(html.includes('data-mission-inspect="sleep-06"'));
 assert(html.includes('data-mission-start="study-01"'));
 assert(html.includes('data-career-claim="study-01"'));
 assert(html.includes('aria-pressed="true"'));
 assert(html.includes('legend-node-reward'));
});

test('three boss nodes and all optional challenges use existing mission IDs',()=>{
 const html=legendaryCareer({missions:fixture});
 assert.equal((html.match(/class="legend-boss-node /g)||[]).length,3);
 assert.equal((html.match(/class="legend-extra-node /g)||[]).length,5);
 for(const boss of fixture.filter(m=>m.bossId))assert(html.includes('data-mission-inspect="'+boss.id+'"'));
 for(const extra of fixture.filter(m=>m.section!=='main'&&!m.bossId))assert(html.includes('data-mission-inspect="'+extra.id+'"'));
});

test('locked mission may be inspected but cannot be started or claimed',()=>{
 const html=legendaryCareer({missions:fixture,selectedId:'sleep-04'});
 assert(html.includes('data-mission-inspect="sleep-04"'));
 assert.match(html,/data-mission-start="sleep-04" disabled/);
 assert(!html.includes('data-career-claim="sleep-04"'));
});

test('dojo scenes, progress, and free short rounds preserve chapter identity',()=>{
 const html=legendaryDojos({missions:fixture,worlds:['study']});
 for(const context of ['study','gaming','sleep']){
   assert(html.includes('assets/dojo-'+context+'-v2.svg'));
   assert(html.includes('data-world-enter="'+context+'"'));
 }
 assert.equal((html.match(/class="legend-dojo legend-dojo-/g)||[]).length,3);
 assert(!html.includes('data-game-route="campaign"'),'Worlds must not be campaign duplicates');
 assert(html.includes('Die Themenrunden sind eigenständig'));
});

test('mode cards only request known game routes and existing modes',()=>{
 const html=legendaryModes({account:true});
 for(const mode of ['open','boss-rush','campaign','daily'])assert(html.includes('data-mode-start="'+mode+'"'));
 for(const route of ['campaign','practice'])assert(html.includes('data-game-route="'+route+'"'));
 assert.equal((html.match(/class="legend-mode-feature /g)||[]).length,2);
 assert.equal((html.match(/class="legend-mode-small /g)||[]).length,4);
 assert(html.includes('Gemeinsame Herausforderung nach Serverzeit'));
});

test('leaderboard podium uses real server rows, keeps global ranks and escapes user input',()=>{
 const now=Date.now();
 const rows=[{username:'A<script>',score:900,rank:1,submittedAt:now,mine:true},
  {username:'B',score:800,rank:2,submittedAt:now-10000},
  {username:'C',score:700,rank:3,submittedAt:now-20000},
  {username:'D',score:600,rank:4,submittedAt:now-30000}];
 const html=legendaryLeaderboard({message:'Online',entries:rows,filter:'all',own:rows[0],account:true});
 assert(html.includes('A&lt;script&gt;'));
 assert(!html.includes('A<script>'));
 assert(html.includes('Gesamtplatz #1'));
 assert(html.includes('Gesamtplatz #2'));
 assert(html.includes('Gesamtplatz #3'));
 assert(html.includes('class="legend-ranking-row '));
 assert(html.includes('data-leaderboard-filter="today"'));
 assert(html.includes('data-leaderboard-filter="week"'));
 assert(html.includes('data-leaderboard-filter="local"'));
 assert(html.includes('data-action="submit-score" disabled'));
 const local=legendaryLeaderboard({entries:rows,filter:'local',localScore:12345});
 assert(!local.includes('A&lt;script&gt;'));
 assert(local.includes('12.345'));
 const empty=legendaryLeaderboard({entries:[],filter:'all'});
 assert(empty.includes('Noch frei'));
 assert(!empty.includes('Ninja123'));
});

test('no game or storage dependency is imported by the purely presentational module',()=>{
 const src=requireSource();
 assert(!/localStorage|sessionStorage|fetch\(|database|DATABASE_URL|accounts\.action/.test(src));
});
function requireSource(){return readFileSync('notification-ninja/src/ninja-legend-ui.js','utf8');}
