import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync('notification-ninja/'+name,'utf8');
const index=read('index.html'),css=read('indie-theme.css'),ui=read('src/main.js');
const routes=['home','play','campaign','bazaar','leaderboard'];

test('one responsive dock exposes exactly five destinations with modes and worlds unified in Play',()=>{
 const nav=index.match(/<nav[^>]*id="indie-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 assert(nav,'One global navigation dock exists');
 assert.equal((nav.match(/data-game-route="/g)||[]).length,5);
 for(const route of routes)assert(nav.includes('data-game-route="'+route+'"'),route);
 assert(!index.includes('class="nn-mobile-nav"'),'No competing six-destination mobile dock');
 assert(!nav.includes('data-game-route="dojos"'));
 assert(!nav.includes('data-game-route="modes"'));
 assert(nav.includes('href="#play"'));
 assert(nav.includes('href="#bazaar"'));
 assert(index.indexOf('id="indie-bottom-nav"')>index.indexOf('</main>',index.indexOf('id="home"')),'Navigation stays outside the hidden home view');
});

test('the dock preserves touch, keyboard and safe-area access across menu pages',()=>{
 assert(css.includes('grid-template-columns:repeat(5,minmax(0,1fr))'));
 assert(css.includes('safe-area-inset-bottom'));
 assert(css.includes('min-height:59px')||css.includes('min-height:58px'));
 assert(css.includes('[aria-current=page]'));
 assert(read('styles.css').includes(':focus-visible'));
 assert(ui.includes("navigation.hidden=!localLoggedIn"));
 assert(ui.includes("'home',...menuKinds,'practice'"));
 assert(ui.includes("installModalAccessibility(document)"),'Account and MFA dialogs retain their focus boundary');
 assert(read('src/account-ui.js').includes('aria-modal="true"'));
});

test('unified navigation assets and current styles ship online and offline',()=>{
 const sw=read('sw.js'),packaging=readFileSync('scripts/package_ninja.py','utf8');
 assert(index.includes('href="./indie-theme.css"'));
 assert(sw.includes("'./indie-theme.css'"));
 assert(packaging.includes("'indie-theme.css'"));
 assert(ui.includes('class="indie-mode-card"'));
 assert(ui.includes('class="indie-world-card '));
 assert(ui.includes("dojos:'modes'")||ui.includes("dojos:'play'")||ui.includes('function dojosMenu(){modesMenu();}'),'Legacy worlds route reaches the unified view');
});
