import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>readFileSync('notification-ninja/'+name,'utf8');
const index=read('index.html');
const css=read('mobile-navigation-v6.css');
const ui=read('src/main.js');
const legacy=read('legend-ui.css');
const sw=read('sw.js');
const packaging=readFileSync('scripts/package_ninja.py','utf8');
const routes=['worlds','dojos','campaign','modes','bazaar','leaderboard'];

test('mobile dock exposes all six main routes, including Bazaar',()=>{
 const main=index.match(/<nav class="dojo-tabs"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 const mobile=index.match(/<nav class="nn-mobile-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 assert(main&&mobile,'Both responsive navigation variants must exist');
 for(const html of [main,mobile]){
  assert.equal((html.match(/data-game-route="/g)||[]).length,6,'Exactly six destinations');
  for(const route of routes)assert(html.includes('data-game-route="'+route+'"'),route+' should be accessible');
 }
 assert.match(mobile,/href="#bazaar"[^>]*data-game-route="bazaar"/);
 assert.doesNotMatch(legacy,/data-game-route\s*=\s*['"]?bazaar['"]?\]\s*\{\s*display\s*:\s*none/i);
});

test('mobile dock works in menus, but is hidden in gameplay and MFA',()=>{
 assert.match(css,/repeat\(6,minmax\(0,1fr\)\)/);
 assert.match(css,/body\.nn-menu-context \.nn-mobile-nav/);
 assert.match(css,/body:has\(\.account-shade\) \.nn-mobile-nav\s*\{\s*display:none/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/\.modal-shade:not\(\.account-shade\)/);
 assert.match(ui,/classList\.toggle\('nn-menu-context'/);
 assert.match(ui,/\['home','modes','dojos','world','career','shop','leaderboard'/);
 assert.match(css,/\.nn-mobile-nav a:focus-visible/);
});

test('mobile navigation and short copy ship in both the online and offline version',()=>{
 assert(index.includes('href="./mobile-navigation-v6.css"'));
 assert(sw.includes("'./mobile-navigation-v6.css'"));
 assert(packaging.includes("'mobile-navigation-v6.css'"));
 assert(index.includes('Spielwelten, Karriere und Basar sind im Menü.'));
 assert(read('src/ninja-legend-ui.js').includes('Levelzahl: starten. Titel: Details.'));
 assert(css.includes('.nn-home-guide,.dojo-stamp,.home-footer{display:none!important}'));
});
