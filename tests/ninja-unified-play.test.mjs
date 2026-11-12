import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {legendaryPlayHub} from '../notification-ninja/src/ninja-legend-ui.js';

const read=f=>readFileSync('notification-ninja/'+f,'utf8');
const hub=legendaryPlayHub({account:true});
const modes=['boss-rush','daily'],extra=['campaign','open'];
const navRoutes=['worlds','play','campaign','bazaar','leaderboard'];

test('Screenshot composition: exactly four full-art mode banners and four illustrated world posters',()=>{
 assert.equal((hub.match(/class="nn-play-banner nn-play-banner-/g)||[]).length,4);
 assert.equal((hub.match(/class="nn-play-world nn-play-world-/g)||[]).length,4);
 assert(hub.indexOf('nn-play-mode-list')<hub.indexOf('nn-play-world-grid'));
 for(const name of ['Boss Rush','Tages-Challenge','Zen-Training','Wochenziele','Gaming-Dojo','Schul-Dojo','Schlaf-Dojo','Balance-Master'])
   assert(hub.includes(name),name);
 assert(hub.includes('SPIELMODI')&&hub.includes('SPIELWELTEN'));
 for(const mode of modes)assert(hub.includes('data-mode-start="'+mode+'"'));
 for(const route of ['practice','weekly'])assert(hub.includes('data-game-route="'+route+'"'));
 for(const id of ['gaming','study','sleep'])assert(hub.includes('data-world-enter="'+id+'"'));
 assert(hub.includes('data-mode-start="master"'));
 for(const mode of extra)assert(hub.includes('data-mode-start="'+mode+'"'),'Preserve advanced mode '+mode);
 assert.equal((hub.match(/class="nn-play-world-art"/g)||[]).length,4);
 assert(hub.includes('<details class="nn-play-more">'),'Keep extra modes collapsible rather than duplicating top-level nav');
});

test('Single five-item navigation across mobile/desktop, with legacy routes redirected',()=>{
 const html=read('index.html'),js=read('src/main.js');
 for(const navClass of ['dojo-tabs','nn-mobile-nav']){
  const nav=html.match(new RegExp('<nav class="'+navClass+'"[^>]*>([\\s\\S]*?)<\\/nav>'))?.[1];
  assert(nav,navClass+' missing');
  assert.equal((nav.match(/data-game-route="/g)||[]).length,5,'No duplicate menu targets');
  for(const route of navRoutes)assert(nav.includes('data-game-route="'+route+'"'),route);
  for(const old of ['modes','dojos'])assert(!nav.includes('data-game-route="'+old+'"'),'Old duplicate route '+old);
 }
 assert(js.includes("else if(target==='play')playMenu()"));
 assert(js.includes("modes:'play',dojos:'play'"),'Old deep links remain valid');
 assert(js.includes("function playMenu()"));
 assert(js.includes("play:playMenu"),'Back navigation can restore the merged Play view');
 assert(!html.includes('data-game-route="modes"'));
 assert(!html.includes('data-game-route="dojos"'));
});

test('The reference design ships as a functional, responsive offline asset',()=>{
 const index=read('index.html'),css=read('ninja-reference-v10.css'),sw=read('sw.js');
 const zip=readFileSync('scripts/package_ninja.py','utf8');
 assert(index.includes('ninja-reference-v10.css'));
 assert(sw.includes("'./ninja-reference-v10.css'"));
 assert(zip.includes("'ninja-reference-v10.css'"));
 assert.match(css,/repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/repeat\(5,minmax\(0,1fr\)\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.nn-play-banner-copy strong/);
 assert.match(css,/\.nn-play-world-gaming \.nn-play-world-cta/);
 assert.match(css,/\.nn-play-world-sleep \.nn-play-world-cta/);
 assert.match(css,/\.nn-play-world-balance \.nn-play-world-cta/);
 assert.match(css,/@media\(max-width:370px\)/);
 assert(read('src/renderer.js').includes("'balance-master':'ninja-mint-balance-v9.svg'"));
 assert(read('src/renderer.js').includes("state.mode==='master'"),'Real mixed context uses the balance arena');
});

test('Progress and account APIs are reused, never duplicated on a new hub',()=>{
 const js=read('src/main.js');
 assert(js.includes("if(b.dataset.modeStart){$('mode-select').value=b.dataset.modeStart;launch();return;}"));
 assert(js.includes('if(b.dataset.worldEnter){worldDetailsMenu(b.dataset.worldEnter);return;}'));
 assert(js.includes('if(b.dataset.missionStart){launchMission(b.dataset.missionStart);return;}'));
 assert(js.includes('verifiedRun?.flush()'));
 assert(js.includes("if(b.dataset.shopTab){shop(b.dataset.shopTab);return;}"));
});
