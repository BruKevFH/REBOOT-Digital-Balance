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
 for(const route of ['practice','weekly'])assert(html.includes('data-game-route="'+route+'"'));
 assert(!html.includes('data-game-route="campaign"'));
 assert(!html.includes('data-game-route="dojos"'));
 assert.equal((html.match(/class="arcade-scene"/g)||[]).length,2);
 assert(html.includes('./assets/ninja-mint-day-v9.svg'));
 assert(html.includes('./assets/ninja-mint-open-v9.svg'));
 assert(html.includes('Gemeinsame Herausforderung nach Serverzeit'));
 assert(!html.includes('Eine kurze Alltagssituation'));
 assert(!html.includes('Zurück zum Dojo'));
 for(const theme of THEMES)assert(!html.includes('data-ninja-theme="'+theme+'"'),'Theme is changed only in Settings');
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
test('Overview stays distinct from the unified modes and worlds screen',()=>{
 const index=read('index.html'),main=read('src/main.js');
 assert(index.includes('href="#overview" data-game-route="home"'));
 assert(index.includes('href="#play" data-game-route="play"'));
 assert(!index.includes('href="#dojos" data-game-route="dojos"'));
 assert(main.includes('class="indie-mode-list"'));
 assert(main.includes('class="indie-world-grid"'));
 assert(main.includes('data-world-inspect='));
 assert(main.includes('data-action="nav-back"'));
 assert(main.includes('applyTheme();'),'Relaxed/Dark/Noir retain their existing storage and application flow');
});
test('actual dojo assets exist and the map shows a progress-aware character',()=>{
 for(const file of ['assets/focus-village.png','assets/dojo-study.png','assets/dojo-gaming.svg','assets/dojo-sleep.png'])assert(existsSync('notification-ninja/'+file),file);
 const missions=['study','gaming','sleep'].flatMap((id,i)=>Array.from({length:6},(_,n)=>({id:id+'-'+String(n+1).padStart(2,'0'),chapter:id,section:'main',title:id+' '+n,order:i*6+n+1,completed:n===0,available:n===1,target:8,current:0,reward:2,claimed:true})));
 const html=legendaryCareer({missions});
 assert.equal((html.split('class="nn-career-bosses"')[0].match(/class="nn-career-node is-/g)||[]).length,18);
 assert.equal((html.match(/class="nn-career-chapter-trail"/g)||[]).length,3);
 assert(html.includes('nn-career-sidebar'));
 const worlds=legendaryDojos({missions,worlds:['study']});
 assert(worlds.includes('src="./assets/dojo-gaming-v5.svg"'));
 assert.equal((worlds.match(/class="legend-dojo legend-dojo-/g)||[]).length,4);
  assert(worlds.includes('data-mode-start="master"'),'Balance Master starts the real mixed context mode');
});
test('theme and new labels have explicit English localization',()=>{
 setLanguage('en');
 for(const source of ['Übersicht','Spielwelten','Ninja-Karriere','Dein Abenteuer beginnt hier','Mehr Herausforderungen','Darstellung wählen','Spielwelten erkunden'])assert.notEqual(tr(source),source);
 setLanguage('de');
});
test('current theme and reduced-motion presentation stay local and preserve all theme options',()=>{
 const css=read('indie-theme.css'),main=read('src/main.js'),settings=read('src/settings-ui.js');
 for(const id of ['dark','noir'])assert(css.includes('html[data-ninja-theme='+id+']'),'Current theme: '+id);
 assert(css.includes('prefers-reduced-motion:reduce'));
 assert(settings.includes('themePicker()'));
 assert(main.includes('applyTheme'));
 assert(!/https?:\/\//.test(css),'No runtime asset CDN');
});
