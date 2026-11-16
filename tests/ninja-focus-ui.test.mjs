import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root='notification-ninja/';
const read=name=>readFileSync(root+name,'utf8');

test('the current indie design is active online and packaged with retained legacy assets',()=>{
 const index=read('index.html'),home=read('home.html'),sw=read('sw.js');
 const packageScript=readFileSync('scripts/package_ninja.py','utf8');
 assert(index.includes('href="./indie-theme.css"'));assert(home.includes('href="./indie-theme.css"'));
 for(const asset of ['indie-theme.css','focus-ui.css','focus-home.css','legend-ui.css','legend-home.css']){
  assert(read(asset).length>3500);
  assert(sw.includes("'./"+asset+"'"),'Offline asset: '+asset);
  assert(packageScript.includes("'"+asset+"'"),'Download asset: '+asset);
 }
});

test('the hub has one Play destination and preserves the player collection without duplicate navigation cards',()=>{
 const index=read('index.html'),main=read('src/main.js');
 assert(index.includes('id="ninja-hub"'));
 assert(!index.includes('id="hub-paths"'));
 assert(!index.includes('class="hub-path-card"'));
 assert(main.includes('class="btn primary hub-play" data-game-route="play"'));
 assert(!index.includes('data-hub-shortcut="open"'));
 assert(index.includes('id="profile-button"'),'Existing player profile stays accessible');
 assert(index.includes('id="adventure-details"'),'Existing collection data is retained');
 assert(!/<details id="adventure-details"[^>]*open/.test(index));
});

test('five main destinations keep account management outside the primary dock',()=>{
 const index=read('index.html');
 const nav=index.match(/<nav[^>]*id="indie-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 assert(nav);assert.equal((nav.match(/data-game-route="/g)||[]).length,5);
 for(const route of ['home','play','campaign','bazaar','leaderboard'])assert(nav.includes('data-game-route="'+route+'"'));
 assert(!nav.includes('account-nav-link'));assert(!nav.includes('data-account-view'));
 assert(index.includes('id="profile-button"'));
 assert(read('src/main.js').includes('data-account-view="profile"'));
});

test('shortcut uses the existing Open Run rules and does not modify backend contracts',()=>{
 const source=read('src/main.js');
 assert(source.includes("hub-paths')?.addEventListener"),'Safe optional listener stays compatible with older saved views');
 assert(source.includes("shortcut?.dataset.hubShortcut==='open'"));
 assert(source.includes("$('mode-select').value='open';launch()"));
 assert(!read('index.html').includes('data-hub-shortcut="open"'));
 const config=JSON.parse(read('accounts-config.json'));
 assert.equal(config.enabled,true);
 assert.equal(config.apiVersion,3);
 assert.equal(config.endpoint,'https://notification-ninja-accounts.onrender.com/api/v3');
});

test('new presentation is translated without changing player IDs',()=>{
 const ui=read('src/locales/en-ui.js'),home=read('src/locales/en-home.js');
 for(const text of ['Worauf hast du Lust?','Missionen und Bosse','Mehr entdecken','Endlos und fair'])
   assert(ui.includes(JSON.stringify(text)));
 for(const text of ['Jetzt spielen','Neu hier? Kostenloses Konto erstellen →'])
   assert(home.includes(JSON.stringify(text))||home.includes("'"+text+"'"),'Missing translation: '+text);
});
