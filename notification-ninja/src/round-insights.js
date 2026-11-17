import {CONTENT} from './game.js';
import {getLanguage,tr} from './i18n.js';

const CONTEXTS=Object.freeze(['study','gaming','sleep']);
const ITEMS=new Map(CONTENT.map(item=>[item.id,item]));
const MAX_COUNT=1_000_000_000;
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value:{};
const count=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(MAX_COUNT,Math.floor(value))):0;
const escape=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

/** A factual presentation of one run. No rewards, storage, profile or run mutation. */
export function getRoundInsights(state={}){
  const source=record(state),metrics=record(source.metrics);
  const counts={correct:count(metrics.correctDecisions),usefulMistakes:count(metrics.usefulMistakes),missedDistractions:count(metrics.missedDistractions),shieldedMistakes:count(metrics.shieldedMistakes)};
  const totalDecisions=Object.values(counts).reduce((total,value)=>total+value,0);
  const intentionalStop=['stopped','healthy-stop'].includes(source.result)||count(metrics.healthyStops)>0;
  let lastMistake=null;
  const mistake=record(source.lastMistake),item=ITEMS.get(mistake.contentId);
  const knownContext=CONTEXTS.includes(mistake.context),knownKind=['useful','distraction'].includes(mistake.kind);
  const hasRecordedMistake=mistake.protected===true?counts.shieldedMistakes>0:mistake.kind==='useful'?counts.usefulMistakes>0:counts.missedDistractions>0;
  const validTime=typeof mistake.elapsed==='number'&&Number.isFinite(mistake.elapsed)&&mistake.elapsed>=0&&typeof source.elapsed==='number'&&Number.isFinite(source.elapsed)&&mistake.elapsed<=source.elapsed;
  if(item&&knownContext&&knownKind&&item.kindByContext?.[mistake.context]===mistake.kind&&hasRecordedMistake&&validTime){
    lastMistake={contentId:item.id,context:mistake.context,kind:mistake.kind,protected:mistake.protected===true,label:item.label,expected:mistake.kind==='useful'?'keep':'slice'};
  }
  const context=lastMistake?.context||(CONTEXTS.includes(source.context)?source.context:'study');
  const reason=totalDecisions===0?'no-decisions':counts.usefulMistakes>0&&counts.usefulMistakes>=counts.missedDistractions?'useful-mistakes':counts.missedDistractions>0?'missed-distractions':counts.shieldedMistakes>0?'shielded-mistakes':intentionalStop?'intentional-stop':'steady-round';
  return {context,reason,counts,totalDecisions,intentionalStop,lastMistake};
}

const COPY=Object.freeze({
  de:{
    heading:'NIMs Rundenrückblick',eyebrow:'DEIN NÄCHSTER SCHRITT',correct:'Richtig entschieden',usefulMistakes:'Hilfreiches geschnitten',missedDistractions:'Ablenkungen verpasst',
    shielded:'Zusätzlich vom Schild abgefangene Fehler',last:'Dein letzter Hinweis',keep:'In dieser Situation: bewusst durchlassen.',slice:'In dieser Situation: wegwischen.',
    practice:'Passend üben',codex:'Im Lexikon nachschlagen',stop:'Du hast selbst entschieden, die Runde zu beenden. Du darfst deine Grenze respektieren.',
    contexts:{study:'Lernen',gaming:'Gaming',sleep:'Ruhe'},
    tips:{
      'no-decisions':{title:'Erst verstehen, dann wischen.',text:'In dieser Runde wurde noch keine Entscheidung gezählt. Schau dir in Ruhe ein Beispiel an und wähle, was zu deinem Ziel passt.'},
      'useful-mistakes':{title:'Lass hilfreiche Dinge bewusst durch.',text:'Einige hilfreiche Hinweise wurden geschnitten. Lies zuerst dein Ziel und übe, passende Nachrichten unberührt vorbeiziehen zu lassen.'},
      'missed-distractions':{title:'Nimm dir einen Hinweis nach dem anderen vor.',text:'Einige Ablenkungen sind vorbeigeflogen. Übe ohne Zeitdruck, sie zu erkennen und mit einem gezielten Wischer zu entfernen.'},
      'shielded-mistakes':{title:'Der Schild half dir bei einem Fehler.',text:'Auch ein abgefangener Fehler ist eine Gelegenheit zum Verstehen. Sieh dir noch einmal an, welche Signale gerade zu deinem Ziel passen.'},
      'intentional-stop':{title:'Ein bewusster Abschluss gehört dazu.',text:'Du hast richtige Entscheidungen getroffen und selbst einen Schluss gewählt. Für die nächste Runde kannst du dir in Ruhe ein neues Ziel setzen.'},
      'steady-round':{title:'Dein Ziel gab dir Orientierung.',text:'Du hast hilfreiche Dinge und Ablenkungen passend unterschieden. Erkunde im Lexikon, wie derselbe Hinweis in einer anderen Situation seine Bedeutung wechseln kann.'}
    }
  },
  en:{
    heading:'NIM’s round review',eyebrow:'YOUR NEXT STEP',correct:'Correct decisions',usefulMistakes:'Useful items sliced',missedDistractions:'Distractions missed',
    shielded:'Additional mistakes caught by the shield',last:'Your last signal',keep:'In this situation: deliberately let it through.',slice:'In this situation: slice it away.',
    practice:'Practise this situation',codex:'Look it up in the guide',stop:'You chose to end the round yourself. You are allowed to respect your limit.',
    contexts:{study:'Study',gaming:'Gaming',sleep:'Rest'},
    tips:{
      'no-decisions':{title:'Understand first, then swipe.',text:'No decision was counted in this round yet. Take your time with an example and choose what fits your goal.'},
      'useful-mistakes':{title:'Deliberately let useful things through.',text:'Some useful signals were sliced. Read your goal first, then practise letting relevant messages pass untouched.'},
      'missed-distractions':{title:'Take one signal at a time.',text:'Some distractions flew past. Practise recognising them without a timer and removing them with a deliberate swipe.'},
      'shielded-mistakes':{title:'The shield helped you with a mistake.',text:'A protected mistake is still a chance to understand. Review which signals fit your current goal.'},
      'intentional-stop':{title:'Choosing an ending is part of the game.',text:'You made correct decisions and chose your own stopping point. Take your time choosing a goal for your next round.'},
      'steady-round':{title:'Your goal helped you stay on track.',text:'You distinguished useful things from distractions in this situation. Explore how the same signal can change meaning in another context.'}
    }
  }
});

/** Explicit DE/EN copy; rerender this pure card when the interface language changes. */
export function renderRoundInsights(state={}){
  const insight=getRoundInsights(state),language=getLanguage()==='en'?'en':'de',copy=COPY[language],tip=copy.tips[insight.reason];
  const number=value=>value.toLocaleString(language==='en'?'en-GB':'de-DE');
  const stats=[['correct',insight.counts.correct],['usefulMistakes',insight.counts.usefulMistakes],['missedDistractions',insight.counts.missedDistractions]];
  const last=insight.lastMistake;
  return `<section class="round-insights" data-insight-reason="${insight.reason}" aria-label="${escape(copy.heading)}" translate="no"><header class="round-insights-head"><span class="round-insights-emblem" aria-hidden="true">✦</span><div><span class="eyebrow">${escape(copy.eyebrow)}</span><h3>${escape(copy.heading)}</h3></div><span class="round-insights-context">${escape(copy.contexts[insight.context])}</span></header><dl class="round-insights-stats">${stats.map(([label,value])=>`<div data-insight-metric="${label}"><dt>${escape(copy[label])}</dt><dd>${number(value)}</dd></div>`).join('')}</dl>${insight.counts.shieldedMistakes?`<p class="round-insights-shield">${escape(copy.shielded)}: <strong>${number(insight.counts.shieldedMistakes)}</strong></p>`:''}<div class="round-insights-tip"><h4>${escape(tip.title)}</h4><p>${escape(tip.text)}</p>${insight.intentionalStop&&insight.reason!=='intentional-stop'?`<p class="round-insights-stop">${escape(copy.stop)}</p>`:''}</div>${last?`<div class="round-insights-last"><small>${escape(copy.last)} · ${escape(copy.contexts[last.context])}</small><strong>${escape(tr(last.label))}</strong><p>${escape(copy[last.expected])}</p></div>`:''}<div class="round-insights-actions"><button type="button" class="btn ghost" data-experience-practice="${insight.context}">${escape(copy.practice)} <span aria-hidden="true">→</span></button><button type="button" class="btn ghost" data-experience-codex="${insight.context}">${escape(copy.codex)} <span aria-hidden="true">→</span></button></div></section>`;
}
