
/**
 * Notification Ninja: Legendary Dojo visual layer.
 * Pure view builders. All unlocks, money, runs and rankings come from existing
 * validated game/server state. No mock players, scores or progression.
 */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=value=>Number.isFinite(Number(value))?Number(value).toLocaleString('de-DE'):'0';
const chapters={
  study:{name:'Lern-Dojo',subtitle:'Tal der Konzentration',art:'./assets/dojo-study.png',label:'FOKUS',symbol:'文',text:'Schütze deine Gedanken und erkenne echte Prioritäten.',hint:'Jede Entscheidung beginnt mit einem klaren Ziel.'},
  gaming:{name:'Gaming-Dojo',subtitle:'Neonviertel der Balance',art:'./assets/dojo-gaming.svg',label:'BALANCE',symbol:'遊',text:'Meistere dein Team und setze deinem Abenteuer Grenzen.',hint:'Spiele bewusst. Nicht der Autoplay-Loop entscheidet.'},
  sleep:{name:'Schlaf-Dojo',subtitle:'Tempel des Mondes',art:'./assets/dojo-sleep.png',label:'RUHE',symbol:'月',text:'Bewahre die Ruhe und finde den richtigen Moment zum Aufhören.',hint:'Ein gutes Ende ist deine stärkste Technik.'}
};
const icon=(kind)=>kind==='swords'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M11 9 36 36m1-27L12 34M7 6l5 3 28 29-6 4L7 13V6Zm34 0-6 4L9 36l5 5 27-28V6Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':kind==='scroll'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M13 9h25v30H11a5 5 0 0 1 0-10h22M14 9v22M20 17h11m-11 7h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>':kind==='infinity'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 24C17 12 5 14 5 24s12 12 19 0c7-12 19-10 19 0s-12 12-19 0Z" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>':kind==='moon'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M31 6A19 19 0 1 0 42 33 19 19 0 0 1 31 6Zm-17 3 1.8 4 4.2 1.7-4.2 1.7-1.8 4-1.8-4L8 14.7l4.2-1.7L14 9Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':kind==='spark'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m24 3 4.5 15.5L44 24l-15.5 5.5L24 45l-5.5-15.5L4 24l14.5-5.5L24 3Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v38M5 24h38m-31-12 24 24m0-24L12 36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';

export function legendaryModes({account=false}={}){
 const feature=[
  {kind:'day',title:'Ein ganzer Tag',kicker:'01 · DIE STORY-RUNDE',desc:'Vom Lernen über Gaming bis zur Abendruhe: drei Situationen in einer zusammenhängenden Spielrunde.',meta:['Drei Alltagsthemen','Bewusste Entscheidungen','Story-Run'],mode:'campaign',action:'Tagesabenteuer starten',icon:'scroll',scene:'./assets/focus-village.png',emblem:'日'},
  {kind:'open',title:'Open Run',kicker:'02 · DER ENDLOSE PFAD',desc:'Drei Herzen, kein Zeitlimit. Die Wellen werden schneller – wie lange bleibst du im Flow?',meta:['3 Herzen','Highscore','Kein Zeitlimit'],mode:'open',action:'Open Run starten',icon:'infinity',scene:'./assets/dojo-gaming.svg',emblem:'∞'}
 ];
 const others=[
  {kind:'boss',title:'Boss Rush',desc:'Drei besondere Bosse. Drei unterschiedliche Taktiken.',mode:'boss-rush',tag:'3 Bossgegner',icon:'swords',sign:'鬼',level:'HERAUSFORDERUNG'},
  
  {kind:'daily',title:'Tages-Challenge',desc:account?'Gemeinsame Herausforderung nach Serverzeit.':'Lokale Tagesübung; für geprüfte Ergebnisse anmelden.',mode:'daily',tag:'Täglich neu',icon:'spark',sign:'星',level:'TÄGLICH'},
  {kind:'practice',title:'Zen-Training',desc:'Wischen und Entscheidungen ohne Zeitdruck üben.',route:'practice',tag:'Ohne Ranglistenwertung',icon:'scroll',sign:'禅',level:'ENTSPANNT'},
   {kind:'weekly',title:'Wochenziele',desc:'Drei Aufgaben, echte Belohnungen und ein besonderes Outfit.',route:'weekly',tag:'Wöchentlich',icon:'scroll',sign:'週',level:'DEINE ZIELE'}
 ];
 const attr=x=>x.route?`data-game-route="${x.route}"`:`data-mode-start="${x.mode}"`;
 return `<div class="legend-modes arcade-mode-board">
  <header class="arcade-mode-banner">
   <div class="arcade-banner-label"><span class="arcade-level-dot" aria-hidden="true">✦</span> NINJA-AUSWAHL · WELCHER PFAD PASST HEUTE?</div>
   <h3>Wähle dein nächstes <em>Abenteuer.</em></h3>
   <p>Ein klarer Start: Die zwei großen Wege sind deine Hauptmodi. Weitere Herausforderungen findest du darunter.</p>
   <div class="arcade-world-signs" aria-hidden="true"><span>☀ Lernen</span><span>✦ Gaming</span><span>☾ Schlaf</span></div>
  </header>
  <div class="arcade-mode-section-head"><div><span class="arcade-section-index">01 / HAUPTWEGE</span><h4>Dein Abenteuer beginnt hier</h4></div><span class="arcade-section-hint">WÄHLE EIN PORTAL <span aria-hidden="true">↘</span></span></div>
  <div class="legend-mode-featured arcade-mode-portals">${feature.map((x,i)=>`<button type="button" class="legend-mode-feature legend-mode-${x.kind} arcade-mode-portal" ${attr(x)} aria-label="${esc(x.title)}: ${esc(x.action)}">
     <span class="arcade-scene" aria-hidden="true"><img src="${x.scene}" alt="" loading="lazy"><span class="arcade-scene-cloud cloud-a"></span><span class="arcade-scene-cloud cloud-b"></span><span class="arcade-scene-stars">✦ <i>✦</i> ✧</span><span class="arcade-scene-gate"><span>${x.emblem}</span></span><span class="arcade-scene-floor"></span></span>
     <span class="arcade-portal-content">
      <span class="arcade-portal-index"><span>${x.kicker}</span><span>${String(i+1).padStart(2,'0')} / 02</span></span>
      <span class="arcade-portal-title"><strong>${x.title}</strong><span class="arcade-portal-icon">${icon(x.icon)}</span></span>
      <span class="arcade-portal-description">${x.desc}</span>
      <span class="legend-mode-meta">${x.meta.map(k=>`<em>${k}</em>`).join('')}</span>
      <span class="arcade-portal-cta"><span>${x.action}</span><span class="arcade-cta-arrow" aria-hidden="true">➜</span></span>
     </span>
   </button>`).join('')}</div>
  <div class="arcade-mode-section-head arcade-secondary-header"><div><span class="arcade-section-index">02 / NEBENWEGE</span><h4>Mehr Herausforderungen</h4></div><span class="arcade-section-hint">DEIN TEMPO. DEINE WAHL.</span></div>
  <div class="legend-mode-secondary arcade-mode-quests">${others.map((x,i)=>`<button type="button" class="legend-mode-small legend-mode-${x.kind} arcade-mode-quest" ${attr(x)}>
     <span class="arcade-quest-symbol" aria-hidden="true"><span class="arcade-quest-symbol-bg">${x.sign}</span>${icon(x.icon)}</span>
     <span class="legend-mode-info"><span class="arcade-quest-level">${x.level} · ${String(i+1).padStart(2,'0')}</span><strong>${x.title}</strong><small>${x.desc}</small><em>✦ ${x.tag}</em></span>
     <span class="arcade-quest-arrow" aria-hidden="true">➜</span>
   </button>`).join('')}</div>
  <footer class="arcade-mode-footer"><span class="arcade-mode-footer-icon" aria-hidden="true">忍</span><p>Jeder Spielmodus ist eigenständig. Für die Themenrunden findest du den Bereich „Spielwelten“ in der Hauptnavigation.</p></footer>
 </div>`;
}

export const WORLD_DETAILS=Object.freeze({
 study:{title:'Lern-Dojo',subtitle:'Tal des Fokus',tag:'RUHIGER TAG',art:'./assets/dojo-study.png',symbol:'文',
  story:'Zwischen Bambus und Wasser lernst du, Benachrichtigungen bewusst auszuwählen. Hier zählt dein Ziel – nicht der lauteste Hinweis.',
  cues:['Fokus behalten','Wichtige Informationen erkennen','Bewusst Pausen einplanen'],
  mentor:'Nicht alles ist dringend. Entscheide erst, was dir gerade wirklich wichtig ist.',
  start:'Lernrunde starten'},
 gaming:{title:'Gaming-Dojo',subtitle:'Die Arcade-Nacht',tag:'LEUCHTENDES VIERTEL',art:'./assets/dojo-gaming.png',symbol:'遊',
  story:'Arcade-Lichter, Team-Einladungen und ein Abenteuer, das immer weitergeht: Im Gaming-Dojo trainierst du faire Grenzen und bewusste Pausen.',
  cues:['Gemeinsame Zeit gestalten','Autoplay durchschauen','Eigene Grenzen setzen'],
  mentor:'Ein gutes Match darf Spaß machen. Du entscheidest, wann der nächste Tag beginnt.',
  start:'Gamingrunde starten'},
 sleep:{title:'Schlaf-Dojo',subtitle:'Mondtempel der Ruhe',tag:'STILLE STERNENNACHT',art:'./assets/dojo-sleep.png',symbol:'月',
  story:'Unter einem ruhigen Mond löst du dich vom nächsten Video und findest den passenden Moment zum Aufhören. Dieses Dojo ist bewusst langsamer und stiller.',
  cues:['Abendrituale entwickeln','Autoplay stoppen','Ruhe und Schlaf schützen'],
  mentor:'Die schönste Technik am Abend ist manchmal, den Bildschirm bewusst auszuschalten.',
  start:'Schlafrunde starten'}
});

const ninjaMascot="<svg class=\"nn-nim-svg\" viewBox=\"0 0 130 154\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M35 111Q17 101 17 90L7 95Q9 121 29 127\" fill=\"#f5a064\" stroke=\"#23374d\" stroke-width=\"6\" stroke-linejoin=\"round\"/><path d=\"M87 44q31 1 37 16-18-4-23 7l-12-11Z\" fill=\"#ff957b\" stroke=\"#23374d\" stroke-width=\"6\"/><rect x=\"33\" y=\"42\" width=\"64\" height=\"66\" rx=\"27\" fill=\"#37bea8\" stroke=\"#23374d\" stroke-width=\"7\"/><rect x=\"37\" y=\"61\" width=\"58\" height=\"29\" rx=\"14\" fill=\"#fff4e2\" stroke=\"#23374d\" stroke-width=\"6\"/><path d=\"M52 75q8-8 15 0M73 75q8-8 14 0\" fill=\"none\" stroke=\"#23374d\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M53 96q12 9 26 0\" fill=\"none\" stroke=\"#e8d58b\" stroke-width=\"5\"/><path d=\"M40 105l-7 30 18 4 10-24M81 114l8 23 16-6-10-31\" fill=\"#46bda2\" stroke=\"#23374d\" stroke-width=\"7\" stroke-linejoin=\"round\"/><path d=\"M33 107l-17 6 5 15 23-5M93 107l14-16 10 10-17 25\" fill=\"#46bda2\" stroke=\"#23374d\" stroke-width=\"7\" stroke-linejoin=\"round\"/><path d=\"M57 42 64 17l8 25\" fill=\"#35bca3\" stroke=\"#23374d\" stroke-width=\"7\"/><path d=\"m65 27 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z\" fill=\"#ffcf64\" stroke=\"#23374d\" stroke-width=\"2\"/></svg>";
const villageParticles='<span class="nn-landscape-petal petal-one" aria-hidden="true">✿</span><span class="nn-landscape-petal petal-two" aria-hidden="true">✿</span><span class="nn-landscape-petal petal-three" aria-hidden="true">✿</span><span class="nn-landscape-petal petal-four" aria-hidden="true">✿</span><span class="nn-landscape-firefly f-one" aria-hidden="true">✦</span><span class="nn-landscape-firefly f-two" aria-hidden="true">✦</span><span class="nn-landscape-firefly f-three" aria-hidden="true">✦</span>';


export function legendaryDojos(){
 const labels={study:{name:'Lernen',icon:'✦',tag:'MORGENLICHT',hint:'Ablenkungen erkennen',letter:'文'},gaming:{name:'Gaming',icon:'✧',tag:'NEON-NACHT',hint:'Bewusst pausieren',letter:'遊'},sleep:{name:'Schlafen',icon:'☾',tag:'MONDLICHT',hint:'Zur Ruhe kommen',letter:'月'}};
 return `<div class="legend-dojos worlds-hub nn-world-village">
  <header class="nn-village-title worlds-hub-intro">
   <span class="legend-kicker">DEINE DREI DOJO-WELTEN</span>
   <h3>Dein Weg zur <em>digitalen Balance</em></h3>
   <p>Drei Alltagssituationen. Bewusst entscheiden. Wähle ein Gebäude auf der Karte und entdecke seine eigene Spielregel.</p>
  </header>
  <section class="nn-village-stage" aria-label="Interaktive Weltkarte mit drei Dojos">
    <img class="nn-village-landscape" src="./assets/overworld-landscape-v4.svg" alt="" loading="eager">
    <span class="nn-village-sun" aria-hidden="true"></span><span class="nn-village-moon" aria-hidden="true">☾</span>
    <div class="worlds-hub-grid nn-village-gates">
      ${['study','gaming','sleep'].map((id,i)=>{const c=WORLD_DETAILS[id],d=labels[id];return `<article class="legend-dojo legend-dojo-${id} worlds-hub-card nn-village-gate nn-village-gate-${id}">
      <button type="button" class="worlds-hub-entry nn-village-house" data-world-enter="${id}" aria-label="${c.title} betreten: ${esc(d.hint)}">
        <span class="nn-house-halo" aria-hidden="true"></span>
        <span class="nn-house-roof" aria-hidden="true"><span class="nn-house-roof-symbol">${d.icon}</span></span>
        <span class="worlds-hub-art nn-house-interior"><img src="${c.art}" alt="" loading="lazy"><span class="nn-house-window-shine" aria-hidden="true"></span><span class="nn-house-lantern l-left" aria-hidden="true">✦</span><span class="nn-house-lantern l-right" aria-hidden="true">✦</span></span>
        <span class="nn-house-plaque"><span class="nn-house-number">${String(i+1).padStart(2,'0')}</span><strong>${d.name}</strong><small>${c.title}</small></span>
        <span class="worlds-hub-info nn-house-foot"><span class="legend-kicker">${d.tag}</span><span class="nn-house-action">Welt betreten <span aria-hidden="true">➜</span></span></span>
       </button>
      </article>`}).join('')}
    </div>
    <div class="nn-village-sakura" aria-hidden="true"></div>
    ${villageParticles}
    <div class="nn-village-guide" aria-label="NIMs Hinweis">
     <span class="nn-guide-avatar">${ninjaMascot}</span>
     <span class="nn-guide-balloon">Wähle dein <strong>Dojo!</strong><small>Jede Welt spielt sich anders.</small></span>
    </div>
    <span class="nn-village-water-label" aria-hidden="true">✦ NINJATAL ✦</span>
  </section>
  <p class="nn-village-caption">Die Themenrunden sind eigenständig. Die 18 Story-Missionen findest du ausschließlich in der <strong>Karrierekarte</strong>.</p>
 </div>`;
}
export function legendaryWorldDetail(id){
 const c=WORLD_DETAILS[id];if(!c)return '';
 return `<div class="world-inside world-inside-${id}">
 <div class="world-inside-scene"><img src="${c.art}" alt="" loading="eager"><span class="world-inside-particles" aria-hidden="true">✧ ✦ ✧</span><span class="world-inside-name">${c.symbol}</span><span class="nn-inside-scroll"><span class="nn-inside-symbol" aria-hidden="true">${c.symbol}</span><strong>${c.title}</strong><small>${c.subtitle}</small></span><span class="nn-inside-glimmer" aria-hidden="true">✦</span></div>
 <div class="world-inside-story"><div class="nn-inside-mini-guide"><span class="nn-inside-nim">${ninjaMascot}</span><span>WILLKOMMEN IM NINJATAL!</span></div><span class="legend-kicker">${c.tag} · ${c.subtitle}</span><h3>Willkommen im ${c.title}!</h3><p>${c.story}</p>
 <div class="world-inside-cues"><strong>Hier lernst du:</strong>${c.cues.map(x=>`<span><span aria-hidden="true">✦</span> ${x}</span>`).join('')}</div>
 <div class="world-inside-nim"><span aria-hidden="true">忍</span><p><strong>Sensei NIM</strong> „${c.mentor}“</p></div>
 <div class="world-inside-actions"><button type="button" class="legend-button legend-button-primary" data-quick-context="${id}">${c.start} <span aria-hidden="true">➜</span></button><button type="button" class="legend-button legend-button-subtle" data-world-practice="${id}">Ohne Zeitdruck üben</button></div>
 </div></div>`;
}
const xs=[15,36,66,85,66,36],ys=[70,169,268,367,466,565];
function trail(){
 let d=`M ${xs[0]} ${ys[0]}`;
 for(let i=1;i<xs.length;i++){const mid=(ys[i-1]+ys[i])/2;d+=` C ${xs[i-1]} ${mid}, ${xs[i]} ${mid}, ${xs[i]} ${ys[i]}`;}
 return `<svg class="legend-map-lines" viewBox="0 0 100 630" preserveAspectRatio="none" aria-hidden="true"><path class="legend-map-path-back" d="${d}"/><path class="legend-map-path-front" d="${d}"/></svg>`;
}
function chapterMap(missions,id,index,selectedId){
 const c=WORLD_DETAILS[id],group=missions.filter(m=>m.section==='main'&&m.chapter===id),completed=group.filter(m=>m.completed).length;
 const nodes=group.map((m,i)=>{
 const status=m.completed?'is-complete':m.available?'is-available':'is-locked';
 return `<button type="button" class="legend-map-node ${status} ${m.id===selectedId?'is-selected':''} ${i===5?'is-finale':''}" style="--node-x:${xs[i]}%;--node-y:${ys[i]}px" data-mission-inspect="${esc(m.id)}" aria-label="Mission ${m.order}: ${esc(m.title)} – ${m.completed?'Abgeschlossen':m.available?'Spielbar':'Gesperrt'}" aria-pressed="${m.id===selectedId}">
  <span class="legend-node-orb"><span class="legend-node-glyph" aria-hidden="true">${m.completed?'✓':i===5?'✦':String(m.order).padStart(2,'0')}</span></span>
  <span class="legend-node-name">${esc(m.title)}</span>${m.completed&&!m.claimed?'<span class="legend-node-reward">● Belohnung</span>':''}
 </button>`}).join('');
 return `<section id="campaign-region-${id}" class="legend-map-chapter legend-chapter-${id} campaign-region" aria-labelledby="legend-chapter-title-${id}">
  <div class="legend-chapter-cover"><img src="${c.art}" alt="" loading="lazy"><span class="legend-chapter-crest" aria-hidden="true">${c.symbol}</span><div><small>WELT ${index+1} · ${c.subtitle}</small><h3 id="legend-chapter-title-${id}">${c.title}</h3><p>Sechs Etappen auf deinem Weg zum Fokus-Ninja.</p></div><span class="legend-chapter-counter">${completed}<small>/ ${group.length}</small></span></div>
  <div class="legend-trail-track"><img class="campaign-region-art" src="${c.art}" alt="" loading="lazy">
  <div class="campaign-map-clouds" aria-hidden="true">☁ ✦ ☁</div>${trail()}${nodes}
  <span class="arcade-map-traveler" style="--traveler-x:${xs[Math.min(completed,5)]}%;--traveler-y:${ys[Math.min(completed,5)]-36}px" aria-hidden="true"><span>忍</span><small>HIER</small></span>
  <span class="legend-map-bottom" aria-hidden="true">${index<2?'▼ DER WEG GEHT WEITER ▼':'◆ FINALE ◆'}</span></div>
 </section>`;
}
function missionDetails(selected,missions){
 if(!selected)return '';
 const missing=(selected.missingRequirements||[]).map(id=>missions.find(m=>m.id===id)?.title||id);
 const prereq=selected.worldLocked?'Die Karriere-Welt ist noch nicht freigeschaltet.':missing.length?'Zuerst meistern: '+missing.join(' · '):'Alle Voraussetzungen erfüllt';
 const status=selected.completed?'Geschafft':selected.available?'Jetzt spielbar':'Noch gesperrt';
 const best=selected.best?`<p class="legend-mission-best">Bestwert: ${num(selected.best.score)} Punkte · ${num(selected.best.correct)} richtig</p>`:'';
 return `<aside class="legend-mission-inspector career-detail" aria-live="polite"><span class="legend-kicker">DEINE AUSGEWÄHLTE ETAPPE</span>
  <div class="legend-inspector-emblem" aria-hidden="true">${selected.bossId?'鬼':selected.chapter?chapters[selected.chapter]?.symbol||'忍':'✦'}</div>
  <span class="legend-mission-state ${selected.completed?'done':selected.available?'ready':'locked'}">${status}</span>
  <h3>${esc(selected.title)}</h3><p>${esc(selected.description)}</p>
  <div class="legend-inspector-line"><span>${num(selected.current)} / ${num(selected.target)}</span><span>+${num(selected.reward)} Münzen</span></div>
  <div class="legend-meter" role="progressbar" aria-label="Missionsziel" aria-valuemin="0" aria-valuemax="${Math.max(1,Number(selected.target)||1)}" aria-valuenow="${Math.min(Math.max(0,Number(selected.current)||0),Math.max(1,Number(selected.target)||1))}"><span style="width:${Math.round(100*Math.min(Math.max(0,Number(selected.current)||0),Math.max(1,Number(selected.target)||1))/Math.max(1,Number(selected.target)||1))}%"></span></div>
  ${best}<small class="legend-mission-requirement">${esc(prereq)}</small>
  <div class="legend-inspector-actions"><button class="legend-button legend-button-primary" data-mission-start="${esc(selected.id)}" ${selected.available||selected.completed?'':'disabled'}>${selected.completed?'Erneut spielen':'Mission starten'} <span aria-hidden="true">→</span></button>
  ${selected.completed&&!selected.claimed?`<button class="legend-button legend-button-gold" data-career-claim="${esc(selected.id)}">+${num(selected.reward)} Münzen abholen</button>`:''}
  </div>
  <p class="legend-inspector-tip">Tipp: Wähle einen leuchtenden Knoten auf der Karte. Der ausgewählte Weg erscheint hier.</p>
 </aside>`;
}

function campaignOverworld(missions){
 const worlds=['study','gaming','sleep'];
 return `<section class="campaign-overworld" aria-label="Die drei Abenteuerregionen">
 <div class="campaign-overworld-head"><span class="legend-kicker">DIE GROSSE NINJA-REISE</span><strong>Vom Morgenlicht bis zum Mondtempel</strong><small>Wähle eine Welt, um zu ihren Missionsknoten zu springen.</small></div>
 <div class="campaign-overworld-vistas">
   <svg class="campaign-overworld-road" viewBox="0 0 1000 270" preserveAspectRatio="none" aria-hidden="true"><path d="M 105 180 C 230 260, 310 88, 490 168 S 775 250, 890 120" fill="none" stroke="#263d5a" stroke-width="16" stroke-dasharray="19 17" stroke-linecap="round"/><path d="M 105 180 C 230 260, 310 88, 490 168 S 775 250, 890 120" fill="none" stroke="#ffe6a4" stroke-width="5" stroke-dasharray="20 17" stroke-linecap="round"/></svg>
   ${worlds.map((id,i)=>{const c=WORLD_DETAILS[id],group=missions.filter(m=>m.section==='main'&&m.chapter===id),done=group.filter(m=>m.completed).length;
   return `<button type="button" class="campaign-overworld-landmark campaign-overworld-${id}" data-campaign-jump="${id}" aria-label="${c.title}, ${done} von ${group.length} Missionen geschafft">
     <img src="${c.art}" alt="" loading="lazy"><span class="campaign-landmark-title"><strong>${String(i+1)} · ${c.title}</strong><small>${done}/${group.length} Missionen</small></span><span class="campaign-landmark-pin" aria-hidden="true">${c.symbol}</span>
   </button>`}).join('')}
  </div><div class="campaign-overworld-guide"><span aria-hidden="true">忍</span><p><strong>NIM:</strong> „Jede Welt hat sechs Missionen. Folge den leuchtenden Knoten und entscheide, wann du den nächsten Weg betrittst.“</p></div>
 </section>`;
}


/** Adventure progress comes only from real getCareerMissions() data. */
export function legendaryCareer({missions=[],selectedId=null}={}){
 const main=missions.filter(m=>m.section==='main');
 const selected=missions.find(m=>m.id===selectedId)||main.find(m=>m.available&&!m.completed)||main[0];
 const completed=main.filter(m=>m.completed).length;
 const bosses=missions.filter(m=>m.bossId);
 const extras=missions.filter(m=>m.section!=='main'&&!m.bossId);
 const ready=missions.filter(m=>m.completed&&!m.claimed).length;
 const state=m=>m.completed?'complete':m.available?'ready':'locked';
 const stateLabel=m=>m.completed?'Geschafft':m.available?'Spielbar':'Gesperrt';
 const worldNames=['study','gaming','sleep'];
 const waypoints=[[9,75],[25,52],[42,70],[57,38],[74,62],[88,28]];
 const steps=(m,i=0,mini=false)=>{
   const style=mini?'':`style="--nx:${waypoints[i]?.[0]||50}%;--ny:${waypoints[i]?.[1]||50}%"`;
   const playable=m.available||m.completed;
   return `<div class="nn-career-node is-${state(m)} ${selected?.id===m.id?'is-selected':''} ${mini?'is-bonus':''}" ${style} role="group" aria-label="Mission ${m.order}: ${esc(m.title)}, ${stateLabel(m)}">
     ${playable?`<button type="button" class="nn-career-node-number nn-career-direct-start" data-mission-start="${esc(m.id)}" aria-label="Mission ${esc(m.title)} ${m.completed?'erneut ':''}direkt starten"><span class="nn-node-count">${String(m.order).padStart(2,'0')}</span><span class="nn-node-play-symbol" aria-hidden="true">▶</span></button>`:`<span class="nn-career-node-number nn-career-node-locked" aria-hidden="true">♧</span>`}
     <button type="button" class="nn-career-node-copy nn-career-inspect" data-mission-inspect="${esc(m.id)}" aria-pressed="${selected?.id===m.id}" aria-label="Details zu Mission ${esc(m.title)} ansehen"><strong>${esc(m.title)}</strong><small>${stateLabel(m)}${playable?' · ▶ Start am Stein':''}${m.completed&&!m.claimed?' · Belohnung bereit':''}</small></button>
     <span class="nn-career-node-arrow" aria-hidden="true">✦</span>
   </div>`;
 };
 const chapters=worldNames.map((id,i)=>{
  const c=WORLD_DETAILS[id],group=main.filter(m=>m.chapter===id),done=group.filter(m=>m.completed).length;
  return `<section id="campaign-region-${id}" class="nn-career-chapter nn-career-chapter-${id}" aria-labelledby="nn-chapter-${id}">
   <div class="nn-career-chapter-cover">
     <span class="nn-career-chapter-emblem" aria-hidden="true">${c.symbol}</span>
     <div class="nn-career-chapter-label"><span>WELT ${String(i+1).padStart(2,'0')} · ${esc(c.subtitle)}</span><h4 id="nn-chapter-${id}">${esc(c.title)}</h4><small>${done} von ${group.length} Missionen</small></div>
   </div>
   <div class="nn-career-chapter-trail" aria-label="Missionspfad ${esc(c.title)}">
    <img class="nn-career-illustrated-landscape" src="./assets/overworld-landscape-v4.svg" alt="" loading="lazy">
    <div class="nn-career-territory" aria-hidden="true">
       <span class="nn-career-territory-roof">${c.symbol}</span>
       <img src="${c.art}" alt="">
    </div>
    <svg class="nn-career-trail-path" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><path class="nn-path-shadow" d="M90 375 C145 375 200 240 250 260 S355 377 420 350 S505 170 570 190 S665 360 740 310 S823 130 880 145"/><path class="nn-path-road" d="M90 375 C145 375 200 240 250 260 S355 377 420 350 S505 170 570 190 S665 360 740 310 S823 130 880 145"/></svg>
    <span class="nn-career-path-mascot" aria-hidden="true">${ninjaMascot}</span>
    ${group.map((m,j)=>steps(m,j)).join('')}
    ${villageParticles}
    <span class="nn-career-chapter-next" aria-hidden="true">${i<2?'WEITER ZUR NÄCHSTEN WELT ↓':'DEIN WEG ZUM FINALE ✦'}</span>
   </div>
  </section>`;
 }).join('');
 const missing=(selected?.missingRequirements||[]).map(id=>missions.find(m=>m.id===id)?.title||id);
 const prereq=selected?.worldLocked?'Diese Welt ist noch gesperrt.':missing.length?'Zuerst abschließen: '+missing.join(' · '):'Alle Voraussetzungen erfüllt';
 const current=Math.max(0,Number(selected?.current)||0),target=Math.max(1,Number(selected?.target)||1);
 const detail=selected?`<section class="nn-career-detail" aria-live="polite">
    <span class="nn-career-eyebrow">DEINE AUSGEWÄHLTE MISSION</span>
    <div class="nn-career-detail-hero"><span class="nn-career-detail-mascot">${ninjaMascot}</span><span class="nn-career-status is-${state(selected)}">${stateLabel(selected)}</span></div>
    <h4>${esc(selected.title)}</h4>
    <p>${esc(selected.description)}</p>
    <div class="nn-career-progress"><span>${num(current)} / ${num(target)} Fortschritt</span><strong>✦ +${num(selected.reward)} Münzen</strong></div>
    <div class="nn-career-meter" role="progressbar" aria-label="Missionsfortschritt" aria-valuemin="0" aria-valuemax="${target}" aria-valuenow="${Math.min(target,current)}"><span style="width:${Math.round(Math.min(current,target)/target*100)}%"></span></div>
    ${selected.best?`<small class="nn-career-best">Bestwert: ${num(selected.best.score)} Punkte · ${num(selected.best.correct)} richtige Entscheidungen</small>`:''}
    <small class="nn-career-prerequisites">${esc(prereq)}</small>
    <button type="button" class="legend-button legend-button-primary nn-career-start" data-mission-start="${esc(selected.id)}" ${selected.available||selected.completed?'':'disabled'}>${selected.completed?'Mission erneut spielen':'Mission starten'} <span aria-hidden="true">➜</span></button>
    ${selected.completed&&!selected.claimed?`<button type="button" class="legend-button legend-button-gold" data-career-claim="${esc(selected.id)}">✦ +${num(selected.reward)} Münzen abholen</button>`:''}
   </section>`:'';
 return `<div class="nn-career nn-career-adventure">
  <header class="nn-career-intro">
   <div><span class="nn-career-eyebrow">DEINE NINJA-REISE · DREI REGIONEN</span><h3>Karrierekarte</h3><p>Schritt für Schritt zum Fokus-Ninja. Folge den leuchtenden Missionssteinen durch drei Welten.</p></div>
   <div class="nn-career-overall"><strong>${completed}<span> / ${main.length}</span></strong><small>Missionen geschafft</small></div>
  </header>
  <div class="nn-career-layout">
   <div class="nn-career-worlds">${chapters}
    <section class="nn-career-bosses" aria-labelledby="nn-boss-title">
     <span class="nn-career-eyebrow">DIE LETZTEN PRÜFUNGEN</span><h4 id="nn-boss-title">Schattenbosse</h4><p>Drei besondere Bosskämpfe. Wähle deinen nächsten Kampf auf dem Pfad.</p>
     <div class="nn-career-boss-grid">${bosses.map((m,i)=>`<button type="button" class="nn-career-boss is-${state(m)} ${selected?.id===m.id?'is-selected':''}" data-mission-inspect="${esc(m.id)}" aria-pressed="${selected?.id===m.id}"><span aria-hidden="true">${['鬼','将','龍'][i]||'鬼'}</span><strong>${esc(m.title)}</strong><small>${stateLabel(m)}</small></button>`).join('')}</div>
    </section>
    ${extras.length?`<details class="nn-career-bonus"><summary>✦ Zusatzmissionen · ${extras.filter(m=>m.completed).length} / ${extras.length}</summary><div class="nn-career-bonus-grid">${extras.map((m,i)=>steps(m,i,true)).join('')}</div></details>`:''}
   </div>
   <aside class="nn-career-sidebar" aria-label="Missionsdetails">
    ${detail}
    <p class="nn-career-sidebar-tip">✦ ${ready?'Du hast '+ready+' Münzbelohnung(en) zum Abholen.':'Wähle einen leuchtenden Missionsstein, um deine nächste Herausforderung zu entdecken.'}</p>
   </aside>
  </div>
 </div>`;
}

const stampedAt=value=>{
 if(typeof value==='string'&&!/^\d+$/.test(value))return Date.parse(value);
 const n=Number(value);
 return Number.isFinite(n)?(n<1e11?n*1000:n):NaN;
};
function inPeriod(value,period){
 const date=stampedAt(value);if(!Number.isFinite(date))return false;
 const now=Date.now(),d=new Date(now);
 if(period==='today')return new Date(date).toISOString().slice(0,10)===d.toISOString().slice(0,10);
 if(period==='week'){const start=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());const monday=start-((d.getUTCDay()+6)%7)*86400000;return date>=monday&&date<=now;}
 return true;
}
export function legendaryLeaderboard({message='',entries=[],own=null,filter='all',canPublish=false,account=false,published=false,busy=false,localScore=0}={}){
 const valid=['all','today','week','local'].includes(filter)?filter:'all';
 const selection=valid==='local'?[]:entries.filter(x=>valid==='all'||inPeriod(x.submittedAt,valid));
 const top=selection.slice(0,3),rest=selection.slice(3);
 const podium=[1,0,2].map((pos)=>{
  const e=top[pos];return `<div class="legend-podium-step legend-podium-${pos+1} ${e?.mine?'is-mine':''}"><div class="legend-podium-medal" aria-hidden="true">${['🥇','🥈','🥉'][pos]}</div><div class="legend-podium-name" data-user-text>${e?esc(e.username||'Ninja'):'Noch frei'}</div><strong>${e?num(e.score):'—'}</strong><small>${e?'Gesamtplatz #'+num(e.rank):'Kein Eintrag'}</small><div class="legend-podium-base"><span>${pos+1}</span></div></div>`;
 }).join('');
 const rows=rest.map(e=>`<li class="legend-ranking-row ${e.mine?'is-mine':''}"><span class="legend-ranking-rank">#${num(e.rank)}</span><span class="legend-ranking-avatar" aria-hidden="true">忍</span><strong class="legend-ranking-name" data-user-text>${esc(e.username||'Ninja')}</strong><strong class="legend-ranking-score">${num(e.score)} <small>Pkt.</small></strong></li>`).join('');
 const tabs=[['all','Gesamt'],['today','Heute'],['week','Woche'],['local','Lokal']];
 return `<div class="legend-leaderboard">
  <div class="legend-rank-hero"><span class="legend-kicker">DIE HALLE DER LEGENDEN</span><div class="legend-trophy" aria-hidden="true">🏆</div><h3>Open Run Rangliste</h3><p>Drei Herzen. Ein Regelwerk. Dein Name erscheint nur, wenn du einen geprüften Run selbst veröffentlichst.</p></div>
  <div class="legend-rank-tabs" role="group" aria-label="Rangliste filtern">${tabs.map(([id,label])=>`<button type="button" data-leaderboard-filter="${id}" aria-pressed="${valid===id}">${label}</button>`).join('')}</div>
  <p class="legend-rank-hint" role="status">${esc(message)} ${valid==='today'||valid==='week'?'Zeitfilter aus den geladenen globalen Top 100 (UTC); keine separate Tages-/Wochenwertung.':''}</p>
  ${valid==='local'?`<div class="legend-local-score"><span class="legend-local-icon" aria-hidden="true">忍</span><div><strong>Dein persönlicher Open-Run-Rekord</strong><p>Auf deinem Profil gespeicherter Bestwert</p></div><b>${num(localScore)} <small>Pkt.</small></b></div>`:`<div class="legend-podium" aria-label="Die ersten drei Einträge der aktuellen Auswahl">${podium}</div>${rows?`<ol class="legend-ranking-list">${rows}</ol>`:''}${!selection.length?'<p class="legend-empty-score">Hier sind noch keine passenden veröffentlichten Runs zu sehen. Der erste Platz wartet!</p>':''}`}
  ${own?`<div class="legend-own-score">Dein veröffentlichter Gesamtplatz: <strong>#${num(own.rank)}</strong> · <strong>${num(own.score)} Punkte</strong></div>`:''}
  <section class="legend-rank-publish"><h4>Dein Ergebnis. Deine Entscheidung.</h4><p>Veröffentlicht werden ausschließlich servergeprüfte Open Runs, die mit dem Verlust aller drei Herzen enden. Keine gekauften Kräfte oder Supers.</p>
    ${account?`<div class="legend-rank-actions"><button class="legend-button legend-button-subtle" data-action="refresh-leaderboard">Aktualisieren</button><button class="legend-button legend-button-primary" data-action="submit-score" ${canPublish&&!busy?'':'disabled'}>${published?'Bereits veröffentlicht ✓':'Geprüften Run veröffentlichen'}</button></div>`:`<button class="legend-button legend-button-primary" data-account-view="login">Zum Konto anmelden</button>`}
    <div class="legend-rank-actions"><button class="legend-button legend-button-subtle" data-action="highscores">Meine Rekorde ansehen →</button></div>
  </section><p class="legend-fair-note">Freundeslisten sind derzeit nicht verfügbar. Es werden keine erfundenen Spieler oder Ergebnisse angezeigt.</p>
 </div>`;
}
