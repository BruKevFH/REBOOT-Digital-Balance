import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {legendaryModes,legendaryDojos,legendaryWorldDetail,legendaryCareer} from '../notification-ninja/src/ninja-legend-ui.js';
const read=path=>readFileSync('notification-ninja/'+path,'utf8');
const minted=['logo','boss','daily','zen','weekly','day','open','balance'];

test('mint illustration system covers all game modes with real buttons',()=>{
 const html=legendaryModes({account:false});
 for(const id of ['boss','daily','zen','weekly','day','open']){
  assert(html.includes('./assets/ninja-mint-'+id+'-v9.svg'),id);
 }
 for(const mode of ['campaign','open','boss-rush','daily'])assert(html.includes('data-mode-start="'+mode+'"'));
 for(const route of ['practice','weekly'])assert(html.includes('data-game-route="'+route+'"'));
 assert.equal((html.match(/nn-quest-scene/g)||[]).length,4);
});

test('four very different illustrated worlds preserve existing three quick rounds and launch mixed Balance Master',()=>{
 const html=legendaryDojos();
 assert.equal((html.match(/data-world-enter=/g)||[]).length,3);
 assert.equal((html.match(/data-mode-start="master"/g)||[]).length,1);
 for(const id of ['study','gaming','sleep'])assert(html.includes('data-world-enter="'+id+'"'));
 assert(html.includes('./assets/ninja-mint-balance-v9.svg'));
 assert(html.includes('nn-mint-world-grid'));
 for(const id of ['study','gaming','sleep'])assert(legendaryWorldDetail(id).includes('data-quick-context="'+id+'"'));
});

test('the current indie artwork is active while authored upstream illustrations remain available offline',()=>{
 const index=read('index.html'),home=read('home.html'),sw=read('sw.js');
 const zip=readFileSync('scripts/package_ninja.py','utf8');
 assert(index.includes('href="./indie-theme.css"'));assert(home.includes('href="./indie-theme.css"'));
 for(const asset of ['indie-theme.css','assets/indie-modes.png','assets/indie-worlds.png','assets/indie-masthead.png','assets/indie-wordmark.png']){
  assert(existsSync('notification-ninja/'+asset),asset);
  assert(sw.includes("'./"+asset+"'"),'Service worker: '+asset);
  assert(zip.includes("'"+asset+"'"),'Offline package: '+asset);
 }
 for(const id of minted){
  const asset='assets/ninja-mint-'+id+'-v9.svg',svg=read(asset);
  assert(svg.startsWith('<svg')&&svg.endsWith('</svg>'));
  assert(!/<script\b|<foreignObject\b/i.test(svg));
  assert(sw.includes("'./"+asset+"'"));assert(zip.includes("'"+asset+"'"));
 }
 assert(read('src/main.js').includes('dataset.ninjaRoom'));
});

test('branding does not replace user state, scoring or server validation',()=>{
 const main=read('src/main.js');
 assert(main.includes('if(b.dataset.modeStart)'));
 assert(main.includes("void startAccountRun({kind:'mission'"));
 assert(main.includes('data-action="nav-back"'));
 const game=read('src/game.js');
 assert(game.includes("startQuickRound(context,options={})"));
 const render=read('src/renderer.js');
 assert(render.includes("indie-worlds.png"),'The authored atlas is used by the live renderer');
 for(const id of ['study','gaming','sleep','master'])assert(new RegExp(id+':\\[').test(render),'Distinct world region: '+id);
 assert(render.includes('ROOM_ART_REGIONS[balance?\'master\':mode]'),'Mixed Balance Master uses its own fourth quadrant');
});

test('the active Play screen uses a responsive two-column world grid with functional detail buttons',()=>{
 const css=read('indie-theme.css'),main=read('src/main.js');
 assert(css.includes('.indie-world-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))'));
 assert(css.includes('.indie-world-card{position:relative'));
 assert(css.includes('@media(max-width:600px)'));
 assert(main.includes('data-world-inspect="${world.id}"'));
 assert(main.includes('data-quick-context="${id}"'));
 const browser=readFileSync('scripts/check_ninja_portal.cjs','utf8');
 assert(browser.includes('Four illustrated world posters'));
 assert(browser.includes('Unified Play cards fit the phone'));
});
