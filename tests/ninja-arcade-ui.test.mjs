import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {legendaryModes,legendaryDojos,legendaryCareer} from '../notification-ninja/src/ninja-legend-ui.js';
import {THEMES,THEME_KEY,getTheme,setTheme,cycleTheme,themePicker} from '../notification-ninja/src/display-theme.js';
import {getPreferences} from '../notification-ninja/src/preferences.js';
import {tr,setLanguage} from '../notification-ninja/src/i18n.js';

const read=path=>readFileSync('notification-ninja/'+path,'utf8');
const mockStorage=()=>{const state=new Map();return {
  getItem:key=>state.get(key)??null,
  setItem:(key,value)=>state.set(key,value),
  removeItem:key=>state.delete(key),
  state
};};
test('two illustrated primary portals and four purposeful secondary arcade modes use real game routes',()=>{
 const html=legendaryModes({account:true});
 assert.equal((html.match(/class="legend-mode-feature /g)||[]).length,2);
 assert.equal((html.match(/class="legend-mode-small /g)||[]).length,4);
 for(const mode of ['open','boss-rush','campaign','daily'])assert(html.includes('data-mode-start="'+mode+'"'));
 for(const route of ['campaign','practice','dojos'])assert(html.includes('data-game-route="'+route+'"'));
 assert.equal((html.match(/class="arcade-scene"/g)||[]).length,2);
 assert(html.includes('./assets/focus-village.png'));
 assert(html.includes('./assets/dojo-gaming.svg'));
 assert(html.includes('Gemeinsame Herausforderung nach Serverzeit'));
 assert(!html.includes('Eine kurze Alltagssituation'));
 assert(!html.includes('Zurück zum Dojo'));
 for(const theme of THEMES)assert(html.includes('data-ninja-theme="'+theme+'"'));
 const guest=legendaryModes({account:false});
 assert(guest.includes('Lokale Tagesübung; für geprüfte Ergebnisse anmelden.'));
});
test('Relaxed/Dark/Noir remain device-only and never pollute account or game preferences',()=>{
 const storage=mockStorage();
 assert.deepEqual(THEMES,['relaxed','dark','noir']);
 assert.equal(setTheme('dark',storage),true);
 assert.equal(getTheme(storage),'dark');
 assert.equal(storage.state.get(THEME_KEY),'dark');
 assert.equal(setTheme('noir',storage),true);
 assert.equal(getTheme(storage),'noir');
 assert.equal(cycleTheme(storage),true);
 assert.equal(getTheme(storage),'relaxed');
 assert.equal(setTheme('invalid',storage),false);
 assert.equal(getTheme(storage),'relaxed');
 assert(themePicker().includes('data-ninja-theme="noir"'));
 assert(!JSON.stringify(getPreferences(storage)).includes('theme'));
});
test('home and modal navigation distinguish Overview from thematic Game Worlds',()=>{
 const home=read('index.html'),main=read('src/main.js');
 assert.match(home,/<span>Übersicht<\/span><\/a><a href="#dojos"/);
 assert.match(home,/<span>Spielwelten<\/span><\/a><a href="#campaign"/);
 assert(main.includes("dojos:'SPIELWELTEN'"));
 assert(main.includes("modes:'SPIELMODI'"));
 assert(main.includes('class="panel-header arcade-sticky-header"'));
 assert(main.includes('data-theme-cycle'));
 assert(main.includes('aria-label="Zur Übersicht"'));
 assert(!main.includes('aria-label="Zur Dojo-Übersicht"'));
 assert(main.includes("applyTheme();"));
 assert(read('legend-ui.css').includes('position:sticky!important'));
});
test('actual dojo assets exist and the map shows a progress-aware character',()=>{
 for(const file of ['assets/focus-village.png','assets/dojo-study.png','assets/dojo-gaming.svg','assets/dojo-sleep.png'])assert(existsSync('notification-ninja/'+file),file);
 const missions=['study','gaming','sleep'].flatMap((id,i)=>Array.from({length:6},(_,n)=>({id:id+'-'+String(n+1).padStart(2,'0'),chapter:id,section:'main',title:id+' '+n,order:i*6+n+1,completed:n===0,available:n===1,target:8,current:0,reward:2,claimed:true})));
 const html=legendaryCareer({missions});
 assert.equal((html.match(/class="legend-map-node /g)||[]).length,18);
 assert.equal((html.match(/class="arcade-map-traveler"/g)||[]).length,3);
 assert(html.includes('--traveler-x:'));
 const worlds=legendaryDojos({missions,worlds:['study']});
 assert(worlds.includes('src="./assets/dojo-gaming-v2.svg"'));
 assert.equal((worlds.match(/class="legend-dojo legend-dojo-/g)||[]).length,3);
});
test('theme and new labels have explicit English localization',()=>{
 setLanguage('en');
 for(const source of ['Übersicht','Spielwelten','Ninja-Karriere','Dein Abenteuer beginnt hier','Mehr Herausforderungen','Darstellung wählen','Spielwelten erkunden'])assert.notEqual(tr(source),source);
 setLanguage('de');
});
test('reduced-motion and theme styles are bundled as local presentation without remote dependencies',()=>{
 const css=read('legend-ui.css'),publicCss=read('legend-home.css'),main=read('src/main.js'),home=read('src/home.js');
 for(const id of THEMES)assert(css.includes('html[data-ninja-theme='+id+']'));
 assert(css.includes('@media(prefers-reduced-motion:reduce)'));
 assert(css.includes('.calm-view .arcade-scene-cloud'));
 assert(css.includes('.legend-chapter-gaming .legend-trail-track'));
 for(const id of ['relaxed','noir'])assert(publicCss.includes('html[data-ninja-theme='+id+']'));
 assert(home.includes('cycleTheme()'));
 assert(main.includes("import {applyTheme,setTheme,cycleTheme,getTheme}"));
 assert(!css.includes('https://'));
});
