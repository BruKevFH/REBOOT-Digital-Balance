import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root='notification-ninja/';
const read=name=>readFileSync(root+name,'utf8');

test('focus-first styles are bundled into online and offline entry points',()=>{
 const index=read('index.html'),home=read('home.html'),sw=read('sw.js');
 const packageScript=readFileSync('scripts/package_ninja.py','utf8');
 assert.match(index,/href="\.\/focus-ui\.css"/);
 assert.match(index,/href="\.\/legend-ui\.css"/);
 assert.match(home,/href="\.\/focus-home\.css"/);
 assert.match(home,/href="\.\/legend-home\.css"/);
 for(const asset of ['focus-ui.css','focus-home.css','legend-ui.css','legend-home.css']){
   assert(read(asset).length>3500);
   assert(sw.includes("'./"+asset+"'"),'Missing service worker asset: '+asset);
   assert(packageScript.includes("'"+asset+"'"),'Missing download package asset: '+asset);
 }
});

test('hub offers one primary mission and three unambiguous secondary choices',()=>{
 const index=read('index.html');
 assert.match(index,/id="ninja-hub"/);
 assert.doesNotMatch(index,/id="hub-paths"/);
 assert.equal((index.match(/class="hub-path-card"/g)||[]).length,0);
 assert.match(index,/data-game-route="campaign"/);
 assert.doesNotMatch(index,/data-hub-shortcut="open"/);
 assert.match(index,/data-game-route="dojos"/);
 assert.match(index,/class="nn-home-guide"/);
 assert.match(index,/<details id="adventure-details"/);
 assert.doesNotMatch(index,/<details id="adventure-details"[^>]*open/);
});

test('navigation has six destinations including dojos; account remains available in header',()=>{
 const index=read('index.html');
 const nav=index.match(/<nav class="dojo-tabs"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 assert(nav);
 assert.equal((nav.match(/data-game-route="/g)||[]).length,6);
 for(const route of ['worlds','dojos','campaign','modes','bazaar','leaderboard']){
   assert(nav.includes('data-game-route="'+route+'"'));
 }
 assert(!nav.includes('account-nav-link'));
 assert(!index.includes('class="access-bazaar"'),'No duplicate Bazaar next to account');
 assert(index.includes('id="profile-button"'));
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
