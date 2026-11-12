import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {legendaryUnifiedPlay} from '../notification-ninja/src/ninja-legend-ui.js';

const read=p=>readFileSync('notification-ninja/'+p,'utf8');
const html=legendaryUnifiedPlay({account:true});

test('one real Play portal contains the four illustrated primary modes ABOVE the four distinct dojo worlds',()=>{
 assert(html.includes('data-unified-play="true"'));
 const four=['boss-rush','daily'];
 for(const mode of four)assert(html.includes('data-mode-start="'+mode+'"'));
 for(const route of ['practice','weekly'])assert(html.includes('data-game-route="'+route+'"'));
 assert.equal((html.match(/class="nn-ref-mode nn-ref-mode-/g)||[]).length,4);
 assert.equal((html.match(/class="legend-dojo legend-dojo-/g)||[]).length,4);
 assert.equal((html.match(/data-world-enter=/g)||[]).length,3);
 assert.equal((html.match(/data-mode-start="master"/g)||[]).length,1);
 assert(html.indexOf('class="nn-ref-mode-list"')<html.indexOf('class="worlds-hub-grid nn-village-gates nn-mint-world-grid"'));
 for(const k of ['boss','daily','zen','weekly'])assert(html.includes('./assets/ninja-mint-'+k+'-v9.svg'));
 for(const k of ['gaming','study','sleep'])assert(html.includes('data-world-enter="'+k+'"'));
});

test('existing Open Run and Campaign remain playable, but appear only after primary screenshot composition',()=>{
 const bonus=html.indexOf('class="nn-ref-more-modes"');
 assert(bonus>html.indexOf('class="worlds-hub-grid nn-village-gates nn-mint-world-grid"'));
 assert(html.includes('data-mode-start="campaign"'));
 assert(html.includes('data-mode-start="open"'));
 assert.equal((html.match(/data-mode-start="open"/g)||[]).length,1);
});

test('five and only five real primary navigation paths work on both desktop and smartphone',()=>{
 const index=read('index.html');
 const routes=['worlds','play','campaign','bazaar','leaderboard'];
 const navs=[...index.matchAll(/<nav class="(?:dojo-tabs|nn-mobile-nav)"[^>]*>([\s\S]*?)<\/nav>/g)].map(m=>m[1]);
 assert.equal(navs.length,2);
 for(const nav of navs){
  assert.equal((nav.match(/data-game-route=/g)||[]).length,5);
  for(const route of routes)assert(nav.includes('data-game-route="'+route+'"'));
  assert(!nav.includes('data-game-route="modes"'));
  assert(!nav.includes('data-game-route="dojos"'));
 }
 const main=read('src/main.js');
 assert(main.includes("play:'modes',dojos:'modes'"),'old deep links keep working');
 assert(main.includes('legendaryUnifiedPlay({account:accountActive()})'));
 assert(main.includes("modes:'play',dojos:'play',world:'play'"));
});

test('visual style is reference-led, responsive and ships offline without external image dependencies',()=>{
 const css=read('nn-reference-play-v10.css');
 assert(css.includes('.nn-ref-mode-list')&&css.includes('.nn-mint-world-grid'));
 assert(css.includes('@media(max-width:760px)')&&css.includes('@media(max-width:352px)'));
 assert(css.includes('prefers-reduced-motion:reduce'));
 assert(css.includes('env(safe-area-inset-bottom'));
 assert(css.includes('repeat(5,minmax(0,1fr))'));
 const sw=read('sw.js'),pkg=readFileSync('scripts/package_ninja.py','utf8');
 assert(sw.includes("'./nn-reference-play-v10.css'"));
 assert(pkg.includes("'nn-reference-play-v10.css'"));
 assert(read('index.html').includes('href="./nn-reference-play-v10.css"'));
});
