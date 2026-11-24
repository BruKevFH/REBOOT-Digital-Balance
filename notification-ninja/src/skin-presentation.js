import {getLanguage} from './i18n.js';

/** Cosmetic presentation only. Ownership and prices stay in the shared game catalog. */
export const SKIN_RARITIES=Object.freeze({
  common:Object.freeze({rank:1,de:'Gewöhnlich',en:'Common',color:'#94b4a6',ink:'#163f36',symbol:'leaf'}),
  uncommon:Object.freeze({rank:2,de:'Ungewöhnlich',en:'Uncommon',color:'#69cfa6',ink:'#103c31',symbol:'chevrons'}),
  rare:Object.freeze({rank:3,de:'Selten',en:'Rare',color:'#72bdf3',ink:'#103958',symbol:'diamond'}),
  epic:Object.freeze({rank:4,de:'Episch',en:'Epic',color:'#b69ae9',ink:'#352050',symbol:'star'}),
  legendary:Object.freeze({rank:5,de:'Legendär',en:'Legendary',color:'#f2c264',ink:'#53330b',symbol:'crown'})
});
const entry=(rarity,motif,de,en)=>Object.freeze({rarity,motif,de,en});
export const SKIN_PRESENTATIONS=Object.freeze({
  default:entry('common','woven','Gewebter Stoff · Messingstern','Woven cloth · brass star'),
  solar:entry('uncommon','sun','Bronze-Lamellen · Sonnengold','Bronze lamellae · sun gold'),
  dawn:entry('uncommon','sunrise','Leinen · Sonnenfächer','Linen · sunrise fan'),
  mint:entry('rare','crystal','Eisglas · arktische Seide','Ice glass · arctic silk'),
  shadow:entry('rare','feather','Dunkler Stoff · Jade-Federn','Dark cloth · jade feathers'),
  'focus-fox':entry('rare','fox','Goldbrokat · Fuchsmotiv','Gold brocade · fox motif'),
  neon:entry('epic','prism','Lichtfäden · violettes Prisma','Light threads · violet prism'),
  'night-guardian':entry('epic','moon','Nachtseide · Mondsilber','Night silk · moon silver'),
  lotus:entry('epic','lotus','Blütenseide · Lotusblätter','Petal silk · lotus leaves'),
  ember:entry('legendary','ember','Kupferrüstung · Glutfuchs','Copper armour · ember fox'),
  tide:entry('legendary','tide','Perlmutt · fließende Wellen','Mother-of-pearl · flowing waves'),
  grandmaster:entry('legendary','royal','Elfenbein-Brokat · Goldkrone','Ivory brocade · golden crown')
});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const languageOf=value=>value==='en'?'en':'de';

export function skinPresentation(skinId,{language=getLanguage()}={}){
  const id=typeof skinId==='string'&&Object.hasOwn(SKIN_PRESENTATIONS,skinId)?skinId:'default';
  const presentation=SKIN_PRESENTATIONS[id],rarity=SKIN_RARITIES[presentation.rarity],lang=languageOf(language);
  return {id,rarity:presentation.rarity,rank:rarity.rank,label:rarity[lang],color:rarity.color,ink:rarity.ink,symbol:rarity.symbol,motif:presentation.motif,material:presentation[lang],language:lang};
}

const SYMBOLS=Object.freeze({
  leaf:'<path d="M6 18C4 9 11 4 21 4c0 11-5 17-13 15m0-1 9-9"/>',
  chevrons:'<path d="m5 7 7 5 7-5m-14 7 7 5 7-5"/>',
  diamond:'<path d="m12 3 8 9-8 9-8-9 8-9Zm0 0v18M4 12h16"/>',
  star:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Zm0 6v8m-4-4h8"/>',
  crown:'<path d="m3 7 5 4 4-8 4 8 5-4-2 12H5L3 7Zm3 8h12"/>'
});

/** A label and a distinct emblem carry rarity even when colour cannot be perceived. */
export function skinRarityBadge(skinId,{language=getLanguage(),compact=false}={}){
  const info=skinPresentation(skinId,{language});
  const label=info.language==='en'?'Rarity':'Seltenheit';
  return `<span class="skin-rarity${compact?' skin-rarity--compact':''}" data-skin-rarity="${info.rarity}" style="--rarity-color:${info.color};--rarity-ink:${info.ink}" translate="no" lang="${info.language}" aria-label="${label}: ${escape(info.label)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SYMBOLS[info.symbol]}</svg><span>${escape(info.label)}</span></span>`;
}
