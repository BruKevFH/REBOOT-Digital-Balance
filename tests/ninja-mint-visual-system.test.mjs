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

test('new source, logo, posters, styles, homepage and offline release agree',()=>{
 const index=read('index.html'),home=read('home.html'),sw=read('sw.js'),css=read('ninja-mint-ui-v9.css');
 const zip=readFileSync('scripts/package_ninja.py','utf8');
 const workflow=readFileSync('.github/workflows/notification-ninja-assets.yml','utf8');
 const main=read('src/main.js');
 assert(index.includes('ninja-mint-ui-v9.css'));
 assert(home.includes('ninja-mint-home-v9.css'));
 assert(home.includes('ninja-mint-logo-v9.svg'));
 assert(main.includes('class="nn-panel-crest"'));
 for(const style of ['ninja-mint-ui-v9.css','ninja-mint-home-v9.css']){
  assert(sw.includes("'./"+style+"'"));assert(zip.includes("'"+style+"'"));assert(workflow.includes(style));
 }
 for(const id of minted){
  const path='assets/ninja-mint-'+id+'-v9.svg';
  assert(existsSync('notification-ninja/'+path),path);
  const svg=read(path);
  assert(svg.startsWith('<svg')&&svg.endsWith('</svg>'));
  assert(!/<script\b|<foreignObject\b/i.test(svg));
  assert(sw.includes("'./"+path+"'"),'service worker '+path);
  assert(zip.includes("'"+path+"'"),'offline package '+path);
 }
 assert(css.includes('@media(max-width:760px)'));
 assert(css.includes('prefers-reduced-motion:reduce'));
 assert(css.includes('.nn-mint-world-grid'));
 assert(css.includes('.arcade-mode-quest .nn-quest-scene'));
 assert(main.includes('dataset.ninjaRoom'));
});

test('branding does not replace user state, scoring or server validation',()=>{
 const main=read('src/main.js');
 assert(main.includes('if(b.dataset.modeStart)'));
 assert(main.includes("void startAccountRun({kind:'mission'"));
 assert(main.includes('data-action="nav-back"'));
 const game=read('src/game.js');
 assert(game.includes("startQuickRound(context,options={})"));
 const render=read('src/renderer.js');
 for(const id of ['study','gaming','sleep'])assert(render.includes('dojo-'+id+'-v5.svg'));
});

test('cartoon world posters override former absolutely positioned houses at desktop and preserve phone 2×2 layout',()=>{
 const css=read('ninja-mint-ui-v9.css');
 assert(css.includes('display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important'));
 assert(css.includes('.nn-mint-world-grid .nn-village-gate'));
 assert(css.includes('position:relative!important;top:auto!important;left:auto!important'));
 assert(css.includes('@media(max-width:375px)'));
 const browser=readFileSync('scripts/check_ninja_portal.cjs','utf8');
 assert(browser.includes("'grid','Desktop uses the four-poster mint world selector'"));
 assert(browser.includes("'Four illustrated world posters'"));
});
