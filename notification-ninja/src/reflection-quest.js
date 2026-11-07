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
