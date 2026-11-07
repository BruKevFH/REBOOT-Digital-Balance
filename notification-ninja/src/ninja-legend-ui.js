
/**
 * Notification Ninja: Legendary Dojo visual layer.
 * Pure view builders. All unlocks, money, runs and rankings come from existing
 * validated game/server state. No mock players, scores or progression.
 */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=value=>Number.isFinite(Number(value))?Number(value).toLocaleString('de-AT'):'0';
const chapters={
  study:{name:'Lern-Dojo',subtitle:'Tal der Konzentration',art:'./assets/dojo-study.png',label:'FOKUS',symbol:'文',text:'Schütze deine Gedanken und erkenne echte Prioritäten.',hint:'Jede Entscheidung beginnt mit einem klaren Ziel.'},
  gaming:{name:'Gaming-Dojo',subtitle:'Neonviertel der Balance',art:'./assets/dojo-gaming.png',label:'BALANCE',symbol:'遊',text:'Meistere dein Team und setze deinem Abenteuer Grenzen.',hint:'Spiele bewusst. Nicht der Autoplay-Loop entscheidet.'},
  sleep:{name:'Schlaf-Dojo',subtitle:'Tempel des Mondes',art:'./assets/dojo-sleep.png',label:'RUHE',symbol:'月',text:'Bewahre die Ruhe und finde den richtigen Moment zum Aufhören.',hint:'Ein gutes Ende ist deine stärkste Technik.'}
};
const icon=(kind)=>kind==='swords'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M11 9 36 36m1-27L12 34M7 6l5 3 28 29-6 4L7 13V6Zm34 0-6 4L9 36l5 5 27-28V6Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':kind==='scroll'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M13 9h25v30H11a5 5 0 0 1 0-10h22M14 9v22M20 17h11m-11 7h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>':kind==='infinity'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 24C17 12 5 14 5 24s12 12 19 0c7-12 19-10 19 0s-12 12-19 0Z" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>':kind==='moon'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M31 6A19 19 0 1 0 42 33 19 19 0 0 1 31 6Zm-17 3 1.8 4 4.2 1.7-4.2 1.7-1.8 4-1.8-4L8 14.7l4.2-1.7L14 9Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':kind==='spark'?'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m24 3 4.5 15.5L44 24l-15.5 5.5L24 45l-5.5-15.5L4 24l14.5-5.5L24 3Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v38M5 24h38m-31-12 24 24m0-24L12 36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';

export function legendaryModes({account=false}={}){
 const feature=[
  {kind:'career',title:'Die Ninja-Karriere',kicker:'DEIN ABENTEUER',desc:'Drei große Dojos, 18 Missionen, geheime Pfade und echte Bossbegegnungen.',meta:['18 Hauptmissionen','3 Dojos'],route:'campaign',action:'Karrierekarte öffnen',icon:'scroll'},
  {kind:'open',title:'Open Run',kicker:'ENDLOSER MODUS',desc:'Drei Herzen. Ein fairer Start. Jede Welle wird schneller – wie lange hältst du durch?',meta:['3 Herzen','Online-Rekorde'],mode:'open',action:'Open Run starten',icon:'infinity'}
 ];
 const others=[
  {kind:'boss',title:'Boss Rush',desc:'Stelle dich drei verschiedenen Bossmechaniken.',mode:'boss-rush',tag:'Drei Bossduelle',icon:'swords'},
  {kind:'day',title:'Ein ganzer Tag',desc:'Erlebe Lernen, Gaming und Schlaf in einem Run.',mode:'campaign',tag:'Story-Run',icon:'moon'},
  {kind:'daily',title:'Tages-Challenge',desc:account?'Gemeinsame Herausforderung nach Serverzeit.':'Lokale Tagesübung; für geprüfte Ergebnisse anmelden.',mode:'daily',tag:'Täglich neu',icon:'spark'},
  {kind:'practice',title:'Zen-Training',desc:'Entscheidungen ohne Zeitdruck üben.',route:'practice',tag:'Ohne Ranglistenwertung',icon:'scroll'}
 ];
 const attr=x=>x.route?`data-game-route="${x.route}"`:`data-mode-start="${x.mode}"`;
 return `<div class="legend-modes">
  <header class="legend-screen-intro"><span class="legend-kicker">WÄHLE DEINEN PFAD</span><p class="legend-stroke">道</p><h3>Welcher Ninja bist du heute?</h3><p>Eine Entscheidung genügt. Wähle ein Abenteuer – alles Weitere zeigt dir NIM im Spiel.</p></header>
  <div class="legend-mode-featured">${feature.map(x=>`<button type="button" class="legend-mode-feature legend-mode-${x.kind}" ${attr(x)}>
    <span class="legend-mode-top"><span>${x.kicker}</span><span class="legend-mode-mark">${icon(x.icon)}</span></span>
    <strong>${x.title}</strong><p>${x.desc}</p><span class="legend-mode-meta">${x.meta.map(k=>`<em>${k}</em>`).join('')}</span><span class="legend-mode-cta">${x.action} <b aria-hidden="true">↗</b></span>
  </button>`).join('')}</div>
  <h4 class="legend-mode-subheading">Oder entdecke einen anderen Weg</h4>
  <div class="legend-mode-secondary">${others.map(x=>`<button type="button" class="legend-mode-small legend-mode-${x.kind}" ${attr(x)}><span class="legend-mode-symbol">${icon(x.icon)}</span><span class="legend-mode-info"><strong>${x.title}</strong><small>${x.desc}</small><em>${x.tag}</em></span><span class="legend-mode-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
  <p class="legend-fair-note">Open Run ist für alle gleich. Andere Modi kannst du entspannt in deinem eigenen Tempo spielen.</p>
 </div>`;
}

export function legendaryDojos({missions=[],worlds=[]}={}){
 const chaptersHtml=['study','gaming','sleep'].map((id,i)=>{
  const c=chapters[id],group=missions.filter(m=>m.section==='main'&&m.chapter===id),done=group.filter(m=>m.completed).length,open=worlds.includes(id)||id==='study';
  const next=group.find(m=>m.available&&!m.completed);
  return `<article class="legend-dojo legend-dojo-${id}">
  <div class="legend-dojo-scene"><img src="${c.art}" alt="" loading="lazy"><span class="legend-dojo-seal" aria-hidden="true">${c.symbol}</span><span class="legend-dojo-order">KAPITEL ${String(i+1).padStart(2,'0')}</span></div>
  <div class="legend-dojo-story"><span class="legend-kicker">${c.label} · ${c.subtitle}</span><h3>${c.name}</h3><p>${c.text}</p>
    <div class="legend-dojo-progress"><span>${done} / ${group.length} Missionen geschafft</span><strong>${group.length?Math.round(100*done/group.length):0}%</strong></div>
    <div class="legend-meter" role="progressbar" aria-label="Fortschritt ${c.name}" aria-valuemin="0" aria-valuemax="${group.length}" aria-valuenow="${done}"><span style="width:${group.length?Math.round(100*done/group.length):0}%"></span></div>
    <small class="legend-dojo-unlock">${open?'Karriere-Kapitel erreichbar':'Karriere-Kapitel noch gesperrt'} · Kurzrunde jederzeit frei</small>
    <div class="legend-dojo-actions"><button class="legend-button legend-button-primary" data-quick-context="${id}">Kurzrunde spielen <span aria-hidden="true">→</span></button><button class="legend-button legend-button-subtle" data-game-route="campaign">${next?'Zur Mission':'Karrierekarte'} <span aria-hidden="true">↗</span></button></div>
  </div></article>`;
 }).join('');
 return `<div class="legend-dojos">
  <header class="legend-screen-intro"><span class="legend-kicker">DIE DREI WEGE DES FOKUS</span><p class="legend-stroke">忍</p><h3>Betritt deine Dojos</h3><p>Jede Welt ist eine eigene Geschichte. Kurzrunden sind frei; die Karriere schaltest du Kapitel für Kapitel frei.</p></header>
  <div class="legend-dojos-grid">${chaptersHtml}</div>
  <aside class="legend-master-island"><span class="legend-master-icon" aria-hidden="true">龍</span><div><span class="legend-kicker">DER WEG ZUM MEISTER</span><strong>Shogun-Pfad & Bonusbosse</strong><p>Die drei besonderen Bosse sind zusätzliche Herausforderungen. Ihre echten Freischaltbedingungen findest du auf der Karrierekarte.</p></div><button class="legend-button legend-button-gold" data-game-route="campaign">Karte erkunden →</button></aside>
 </div>`;
}

const xs=[22,57,81,59,24,52],ys=[83,205,327,449,571,693];
function trail(){
 let d=`M ${xs[0]} ${ys[0]}`;
 for(let i=1;i<xs.length;i++){const mid=(ys[i-1]+ys[i])/2;d+=` C ${xs[i-1]} ${mid}, ${xs[i]} ${mid}, ${xs[i]} ${ys[i]}`;}
 return `<svg class="legend-map-lines" viewBox="0 0 100 760" preserveAspectRatio="none" aria-hidden="true"><path class="legend-map-path-back" d="${d}"/><path class="legend-map-path-front" d="${d}"/></svg>`;
}
function chapterMap(missions,id,index,selectedId){
 const c=chapters[id],group=missions.filter(m=>m.section==='main'&&m.chapter===id),completed=group.filter(m=>m.completed).length;
 const nodes=group.map((m,i)=>{
   const status=m.completed?'is-complete':m.available?'is-available':'is-locked';
   return `<button type="button" class="legend-map-node ${status} ${m.id===selectedId?'is-selected':''} ${i===5?'is-finale':''}" style="--node-x:${xs[i]}%;--node-y:${ys[i]}px" data-mission-inspect="${esc(m.id)}" aria-label="Mission ${m.order}: ${esc(m.title)} – ${m.completed?'Abgeschlossen':m.available?'Spielbar':'Gesperrt'}" aria-pressed="${m.id===selectedId}">
    <span class="legend-node-orb"><span class="legend-node-glyph" aria-hidden="true">${m.completed?'✓':i===5?'✦':String(m.order).padStart(2,'0')}</span></span>
    <span class="legend-node-name">${esc(m.title)}</span>
    ${m.completed&&!m.claimed?'<span class="legend-node-reward">● Belohnung</span>':''}
   </button>`;
 }).join('');
 return `<section class="legend-map-chapter legend-chapter-${id}" aria-labelledby="legend-chapter-title-${id}">
  <div class="legend-chapter-cover"><img src="${c.art}" alt="" loading="lazy"><span class="legend-chapter-crest" aria-hidden="true">${c.symbol}</span><div><small>KAPITEL ${String(index+1).padStart(2,'0')} · ${c.subtitle}</small><h3 id="legend-chapter-title-${id}">${c.name}</h3><p>${esc(c.hint)}</p></div><span class="legend-chapter-counter">${completed}<small>/ ${group.length}</small></span></div>
  <div class="legend-trail-track">${trail()}${nodes}<span class="legend-map-bottom" aria-hidden="true">◆ ZIEL ERREICHEN ◆</span></div>
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
export function legendaryCareer({missions=[],selectedId=null}={}){
 const main=missions.filter(m=>m.section==='main'),selected=missions.find(m=>m.id===selectedId)||main.find(m=>m.available&&!m.completed)||main[0],
 done=main.filter(m=>m.completed).length,bosses=missions.filter(m=>m.bossId),extras=missions.filter(m=>m.section!=='main'&&!m.bossId),ready=missions.filter(m=>m.completed&&!m.claimed);
 return `<div class="legend-career">
 <header class="legend-career-hero"><div><span class="legend-kicker">DER WEG DES NINJA · 3 DOJOS</span><h3>Deine Karrierekarte</h3><p>Von den ersten Fokus-Schritten bis zur Prüfung im Mondtempel. Jede Etappe führt dich weiter.</p></div><div class="legend-career-count"><strong>${done}<small>/ 18</small></strong><span>Missionen geschafft</span></div></header>
 <div class="legend-career-body"><div class="legend-career-route">
   <p class="legend-career-help">Wähle einen Knoten auf dem Pfad – leuchtende Knoten sind spielbar. <span>✓ Geschafft</span> <span>✦ Bereit</span> <span>◌ Gesperrt</span></p>
   ${['study','gaming','sleep'].map((id,i)=>chapterMap(missions,id,i,selected?.id)).join('')}
   <section class="legend-boss-route"><div class="legend-boss-banner"><span>鬼</span><div><small>GEHEIMER NEBENPFAD</small><h3>Die Schattenbosse</h3><p>Drei besondere Kämpfe mit eigenen Mechaniken. Ihre Freischaltung hängt von Zusatzaufgaben ab.</p></div></div>
   <div class="legend-boss-trail">${bosses.map((boss,i)=>`<button class="legend-boss-node ${boss.completed?'is-complete':boss.available?'is-available':'is-locked'} ${selected?.id===boss.id?'is-selected':''}" data-mission-inspect="${esc(boss.id)}" aria-pressed="${boss.id===selected?.id}"><span class="legend-boss-icon" aria-hidden="true">${['鬼','将','龍'][i]||'鬼'}</span><strong>${esc(boss.title)}</strong><small>${boss.completed?'Boss besiegt':boss.available?'Kampf verfügbar':'Noch gesperrt'}</small></button>`).join('')}</div></section>
   <details class="legend-extra-challenges"><summary>Weitere Bonusaufgaben · ${extras.filter(m=>m.completed).length}/${extras.length} <span>⌄</span></summary><p>Diese Aufgaben öffnen zusätzliche Herausforderungen und besondere Bosse. Deine bisherigen Erfolge bleiben erhalten.</p><div class="legend-extra-grid">${extras.map(m=>`<button class="legend-extra-node ${m.completed?'is-complete':m.available?'is-available':'is-locked'}" data-mission-inspect="${esc(m.id)}"><span aria-hidden="true">${m.completed?'✓':m.available?'✦':'○'}</span><strong>${esc(m.title)}</strong><small>${m.completed?'Abgeschlossen':m.available?'Spielbar':'Gesperrt'}</small></button>`).join('')}</div></details>
 </div><div class="legend-career-side">${missionDetails(selected,missions)}<aside class="legend-ready-brief"><strong>${ready.length?'● '+ready.length+' Belohnung'+(ready.length===1?'':'en')+' bereit':'Dein Weg, dein Tempo'}</strong><p>${ready.length?'Wähle die erledigte Mission und hole deine Münzen einmalig ab.':'Schließe Missionen ab, um die nächsten Kapitel zu öffnen.'}</p></aside></div></div>
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
