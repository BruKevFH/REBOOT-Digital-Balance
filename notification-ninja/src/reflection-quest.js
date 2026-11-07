/** A short reasoning challenge after a game round. No coin payouts or backend writes. */
export const REFLECTION_CONTEXTS=['study','gaming','sleep'];
export const REFLECTION_QUESTS=Object.freeze({
  study:{
    label:'Lern-Dojo',
    seal:'Siegel des Fokus',
    icon:'文',
    situation:'Du möchtest deine Schulaufgabe in zehn Minuten abschließen. Währenddessen erscheint eine Meldung über ein neues Video. Was machst du?',
    answers:[
      'Ich schaue das Video sofort – vielleicht verpasse ich etwas.',
      'Ich beende meinen Fokusabschnitt und schaue später, ob die Meldung wichtig ist.',
      'Ich blockiere vorsichtshalber sämtliche Nachrichten, auch wichtige Schulinfos.'
    ],
    correct:1,
    explanation:'Du entscheidest selbst, wann du auf unwichtige Inhalte reagierst. Eine kurze Fokuszeit schützt dein Ziel; wichtige Nachrichten kannst du anschließend bewusst prüfen.',
    wrong:[
      'Der Clip kann spannend sein, aber er unterbricht gerade dein selbst gesetztes Lernziel.',
      '',
      'Nicht jede Nachricht ist eine Ablenkung. Wichtige Schul- und Sicherheitsinfos solltest du weiterhin erkennen können.'
    ],
    why:'Warum passt diese Entscheidung besser zu deinem Ziel?',
    reasons:[
      'Weil grundsätzlich alle Benachrichtigungen schlecht sind.',
      'Weil ich Unwichtiges verschiebe, ohne wichtige Informationen für immer auszuschließen.',
      'Weil es beim Lernen nur darum geht, möglichst lange am Bildschirm zu bleiben.'
    ],
    reason:1,
    reasonWrong:['Nicht jede Nachricht ist unwichtig. Der Kontext entscheidet.','','Längere Bildschirmzeit ist kein Lernziel. Deine konkrete Aufgabe ist wichtiger.'],
    takeaway:'Lege für deine nächste Aufgabe einen kurzen Fokusabschnitt fest. Danach kannst du Nachrichten gezielt prüfen.'
  },
  gaming:{
    label:'Gaming-Dojo',
    seal:'Siegel der Balance',
    icon:'遊',
    situation:'Deine vereinbarte Gaming-Zeit ist vorbei. Dein Team fragt nach „nur einem letzten Match“. Was hilft dir am meisten?',
    answers:[
      'Ich spiele weiter, damit niemand enttäuscht ist.',
      'Ich sage meinem Team Bescheid, halte meine Grenze ein und verabrede mich fürs nächste Mal.',
      'Ich lösche sofort jedes Spiel, damit ich nie wieder zu lange spiele.'
    ],
    correct:1,
    explanation:'Du darfst Spaß am Gaming haben und trotzdem deine Grenze einhalten. Eine freundliche Ansage hilft dem Team, deine Entscheidung zu verstehen.',
    wrong:[
      'Andere mit einzubeziehen ist gut. Deine selbst gesetzte Grenze zählt aber ebenfalls.',
      '',
      'Du musst nicht alles oder nichts tun. Eine realistische Vereinbarung ist oft hilfreicher.'
    ],
    why:'Welche Fähigkeit trainierst du damit?',
    reasons:[
      'Ich entscheide bewusst und kommuniziere meine Grenze.',
      'Ich stelle sicher, dass mein Team immer für mich entscheidet.',
      'Ich lasse mich von der nächsten Belohnung im Spiel treiben.'
    ],
    reason:0,
    reasonWrong:['','Deine Grenze darf von dir selbst kommen.','Zufällige Belohnungen helfen selten beim bewussten Aufhören.'],
    takeaway:'Überlege vor dem nächsten Match, wann du aufhören möchtest, und sag deinem Team rechtzeitig Bescheid.'
  },
  sleep:{
    label:'Schlaf-Dojo',
    seal:'Siegel der Ruhe',
    icon:'月',
    situation:'Du bist müde und möchtest schlafen. Autoplay startet gerade das nächste Video. Was unterstützt dein Ziel?',
    answers:[
      'Ich lasse das Video laufen und hoffe, dass ich dabei einschlafe.',
      'Ich schalte Autoplay aus und lege das Handy für die Nacht beiseite.',
      'Ich suche lieber nach einem weiteren spannenden Clip, bevor ich aufhöre.'
    ],
    correct:1,
    explanation:'Autoplay macht es leicht, immer weiterzuschauen. Wenn du es ausschaltest, entscheidest du selbst, wann Schluss ist, und schaffst Platz für Ruhe.',
    wrong:[
      'Ein Video kann entspannend wirken; das automatische Weiterspielen passt aber nicht zu deinem Wunsch, jetzt zu schlafen.',
      '',
      'Ein neuer Clip verschiebt die Entscheidung häufig noch weiter nach hinten.'
    ],
    why:'Was ist an diesem Schritt hilfreich?',
    reasons:[
      'Weil ich jede Form von Technik komplett vermeiden muss.',
      'Weil ich meine Schlafenszeit aktiv bestimme und nicht vom nächsten Video bestimmt werde.',
      'Weil ich dadurch möglichst viele weitere Videos schaffe.'
    ],
    reason:1,
    reasonWrong:['Du musst Technik nicht pauschal ablehnen. Es geht um deine Entscheidung im richtigen Moment.','','Mehr Videos stehen gerade nicht im Mittelpunkt – dein Schlaf ist das Ziel.'],
    takeaway:'Schalte für den Abend Autoplay aus. Ein fester Platz fürs Handy kann dir zusätzlich helfen.'
  }
});
export function reflectionQuest(context){return REFLECTION_QUESTS[context]||REFLECTION_QUESTS.study;}
const key=scope=>'notification-ninja:reflection-seals:v1:'+String(scope||'guest');
export function readReflectionSeals(storage,scope){
 try{
   const data=JSON.parse(storage?.getItem(key(scope))||'[]');
   return Array.isArray(data)?REFLECTION_CONTEXTS.filter(id=>data.includes(id)):[];
 }catch{return [];}
}
/** Each scenario unlocks only one cosmetic seal per browser profile. */
export function awardReflectionSeal(storage,scope,context){
 if(!REFLECTION_CONTEXTS.includes(context))return {earned:false,saved:false,seals:readReflectionSeals(storage,scope)};
 const current=readReflectionSeals(storage,scope);
 if(current.includes(context))return {earned:false,saved:true,seals:current};
 const seals=[...current,context];
 try{storage?.setItem(key(scope),JSON.stringify(seals));return {earned:true,saved:true,seals};}
 catch{return {earned:true,saved:false,seals};}
}
export function clearReflectionSeals(storage,scope){try{storage?.removeItem(key(scope));return true;}catch{return false;}}


const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
/** Render only authored feedback. Event handlers and all rewards live in main.js. */
export function renderReflectionQuest({context='study',step='choice',choice=null,reason=null,seals=[],reward=null}={}){
 const q=reflectionQuest(context),collected=seals.includes(context),total=seals.length;
 const decisions=`<h3 id="reflection-question">${escapeHTML(q.situation)}</h3>
   <div class="reflection-quest-choices">${q.answers.map((label,index)=>`<button type="button" class="reflection-quest-option" data-reflection-choice="${index+1}"><span class="reflection-choice-number">${index+1}</span><span>${escapeHTML(label)}</span><span aria-hidden="true">→</span></button>`).join('')}</div>`;
 const reasons=`<div class="reflection-explanation is-encouraging"><strong>Guter Ansatz! Aber warum hilft dir das?</strong><p>${escapeHTML(q.why)}</p></div><div class="reflection-quest-choices">${q.reasons.map((label,index)=>`<button type="button" class="reflection-quest-option" data-reflection-reason="${index+1}"><span class="reflection-choice-number">${index+1}</span><span>${escapeHTML(label)}</span><span aria-hidden="true">→</span></button>`).join('')}</div>`;
 const incorrect=`<div class="reflection-explanation is-reconsider"><strong>Schau noch einmal auf dein Ziel.</strong><p>${escapeHTML(q.wrong[choice]||q.explanation)}</p><button type="button" class="btn ghost" data-action="reflection-retry">Andere Entscheidung versuchen →</button></div>`;
 const because=`<div class="reflection-explanation is-reconsider"><strong>Ein wichtiger Unterschied!</strong><p>${escapeHTML(q.reasonWrong[reason]||q.explanation)}</p><button type="button" class="btn ghost" data-action="reflection-retry">Begründung erneut wählen →</button></div>`;
 const success=`<div class="reflection-complete"><span class="reflection-medal" aria-hidden="true">${escapeHTML(q.icon)}</span><div><span class="eyebrow">${reward?.earned?'NEUES ERKENNTNIS-SIEGEL':'DEIN SIEGEL IST SCHON GESICHERT'}</span><h3>${escapeHTML(q.seal)} ${reward?.earned?'freigeschaltet!':'gehört dir!'}</h3><p>${escapeHTML(q.explanation)}</p><p class="reflection-transfer"><strong>Deine Idee für den Alltag:</strong> ${escapeHTML(q.takeaway)}</p></div></div>
   <div class="reflection-reward"><strong>✦ ${reward?.earned?'1 Erkenntnis-Siegel gesammelt':'Schon in deiner Sammlung'}</strong><span>${total} / 3 Themen erkundet</span></div>
   ${total===3?'<p class="reflection-master">✦ Alle drei Wege verstanden – Erkenntnis-Meister!</p>':''}
   ${reward&&!reward.saved?'<p class="reflection-storage-warning">Speichern ist hier blockiert. Das Siegel gilt nur für diese geöffnete Sitzung.</p>':''}`;
 const inner=step==='choice'?decisions:step==='reason'?reasons:step==='wrong-choice'?incorrect:step==='wrong-reason'?because:step==='success'?success:'';
 const progress=step==='choice'||step==='wrong-choice'?1:step==='reason'||step==='wrong-reason'?2:3;
 return `<section class="reflection-quest" aria-labelledby="reflection-quest-heading">
  <header class="reflection-quest-header"><span class="eyebrow">NIMS ENTSCHEIDUNGS-DOJO</span><span class="reflection-seal-progress">✦ ${total} / 3 Siegel</span></header>
  <div class="reflection-quest-intro"><span class="reflection-nim" aria-hidden="true">忍</span><div><small>${escapeHTML(q.label)} · EINE ALLTAGSSITUATION</small><h3 id="reflection-quest-heading">Was würdest du wirklich tun?</h3><p>Überlege erst, was zu deinem Ziel passt – dann, warum. Auch eine zweite Überlegung ist willkommen.</p></div></div>
  <div class="reflection-quest-steps" aria-label="Dein Lernweg" data-step="${progress}"><span>01 · ENTSCHEIDEN</span><span>02 · BEGRÜNDEN</span><span>03 · LERNMOMENT</span></div>
  ${inner}
  <p class="reflection-quest-note">${collected?'Dieses Thema hast du bereits gemeistert. Du kannst die Situation trotzdem noch einmal durchdenken.':'Für eine passende Entscheidung mit guter Begründung erhältst du einmalig ein Erkenntnis-Siegel.'} Die Siegel sind reine Lernabzeichen, keine zusätzlichen Münzen oder Ranglistenpunkte. Sie bleiben auf diesem Gerät und werden nicht mit dem Konto synchronisiert.</p>
 </section>`;
}
