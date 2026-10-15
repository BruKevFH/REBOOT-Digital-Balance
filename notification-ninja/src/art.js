/** Original inline illustrations. All geometry is local; user input is never used as SVG markup. */
const ink = '#3d493e';
const has = (object,key) => Object.prototype.hasOwnProperty.call(object,key);
const line = `stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const spark = (x,y,size=5,color='#fff6d0') => `<path d="M${x} ${y-size}l${size*.28} ${size*.72} ${size*.72} ${size*.28}-${size*.72} ${size*.28}-${size*.28} ${size*.72}-${size*.28}-${size*.72}-${size*.72}-${size*.28} ${size*.72}-${size*.28}Z" fill="${color}"/>`;
const coin = (x,y,r=9) => `<circle cx="${x}" cy="${y+2}" r="${r}" fill="#ca833c"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f9ca57" stroke="#b87738" stroke-width="2"/><path d="M${x-3} ${y-r+4}q-4 3-4 6" fill="none" stroke="#fff2b1" stroke-width="2" stroke-linecap="round"/><path d="M${x} ${y-4}v8m-2-6h4m-4 4h4" fill="none" stroke="#b87738" stroke-width="2" stroke-linecap="round"/>`;
const star = (x,y,r=18,color='#f7c75d') => `<path d="M${x} ${y-r}l${r*.29} ${r*.61} ${r*.68} ${r*.1}-${r*.49} ${r*.48} ${r*.12} ${r*.68}-${r*.6}-${r*.32}-${r*.6} ${r*.32} ${r*.12}-${r*.68}-${r*.49}-${r*.48} ${r*.68}-${r*.1}Z" fill="${color}" ${line}/>`;
const ninja = (color='#83c5ad',accent='#f2b862') => `<path d="M24 77q1-21 24-23t24 23" fill="${color}" ${line}/><path d="M33 62l15 11 15-11" fill="none" stroke="${accent}" stroke-width="7"/><path d="M66 37l17-9-4 13 6 10-18-4" fill="${accent}" ${line}/><path d="M25 42q0-25 23-25t23 25v10q-2 21-23 21T25 52Z" fill="${color}" ${line}/><path d="M28 41q20-8 40 0v12q-20 11-40 0Z" fill="#fff2d8" ${line}/><path d="M35 47l7 2m13 0 7-2" fill="none" ${line}/><path d="M34 28q6-7 15-6" fill="none" stroke="#bce7ce" stroke-width="4" stroke-linecap="round"/>`;
const brain = `<path d="M47 24c-7-7-18-1-18 7-9 0-13 10-8 17-7 8-1 20 8 20 3 10 17 10 19 2 4 8 17 7 20-2 11 0 15-12 9-19 5-8 0-18-9-18-1-9-13-14-20-7Z" fill="#efaaa3" ${line}/><path d="M48 28v38M32 32q11 1 8 11m-15 5q11-4 15 5m-11 10q2-9 11-7m24-23q-10 0-9 11m16 5q-10-4-16 5m10 10q-2-9-10-7" fill="none" stroke="#b9676a" stroke-width="2.5" stroke-linecap="round"/><path d="M31 26q6-5 11-2" fill="none" stroke="#ffdbce" stroke-width="3" stroke-linecap="round"/>`;
const book = `<path d="M20 32q15-7 28 1 13-8 28-1v37q-16-6-28 1-12-7-28-1Z" fill="#fff3d6" ${line}/><path d="M48 33v37M26 40l15-1m-15 9 15-1m-15 9 13-1m16-16 14 1m-14 8 14 1m-14 7 11 1" fill="none" stroke="#aaa47b" stroke-width="2.5" stroke-linecap="round"/>`;
const shield = `<path d="M48 19l24 10v20q0 21-24 31-24-10-24-31V29Z" fill="#87c7b2" ${line}/><path d="M48 27l16 7v15q-1 14-16 23-15-9-16-23V34Z" fill="#b8e0bb" stroke="#579980" stroke-width="2"/><path d="M39 48l7 8 13-18" fill="none" stroke="#fff8dc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const moon = `<path d="M62 23C37 19 21 47 39 65c14 14 36 6 39-8-22 10-38-13-16-34Z" fill="#ffe7a0" ${line}/><path d="M39 29q-12 11-6 25" fill="none" stroke="#fff8d4" stroke-width="4" stroke-linecap="round"/>`;
const gamepad = `<path d="M31 32h34q10 0 14 13l4 18q2 13-8 13-5 0-15-11H36Q26 76 21 76q-10 0-8-13l4-18q4-13 14-13Z" fill="#afa6d5" ${line}/><path d="M31 42v17m-8-8h16" fill="none" stroke="#fff3dc" stroke-width="6" stroke-linecap="round"/><circle cx="64" cy="46" r="4" fill="#e6ac93"/><circle cx="73" cy="54" r="4" fill="#f3da8e"/><path d="M42 54h12" stroke="#726b9a" stroke-width="3" stroke-linecap="round"/><path d="M27 36h12" stroke="#dcd3f1" stroke-width="3" stroke-linecap="round"/>`;
const skillImages = {
  'focus-root': `${brain}${spark(16,30,5)}${spark(76,70,5)}`,
  'slow-super': `<path d="M46 14h9m-4 0v9m24 4 5 5" fill="none" ${line}/><circle cx="49" cy="49" r="28" fill="#edbc66" ${line}/><circle cx="49" cy="49" r="22" fill="#fff5da" stroke="#c18e49" stroke-width="2"/><path d="M49 32v18l10 5m-27-6h3m28 0h3m-17 16v-3" fill="none" ${line}/><path d="M33 29q7-5 16-5" fill="none" stroke="#ffe7ab" stroke-width="3" stroke-linecap="round"/>${spark(20,22,7)}${spark(80,64,6)}`,
  'flow-boost': `<path d="M13 64q14-27 39-26 24 1 24-12-1-7-12-3" fill="none" stroke="#538e89" stroke-width="12" stroke-linecap="round"/><path d="M13 60q14-27 39-26 24 1 24-12" fill="none" stroke="#a5dfcb" stroke-width="8" stroke-linecap="round"/><path d="M27 76q15-18 38-17m-42-9 11-7" fill="none" stroke="#f6d47e" stroke-width="5" stroke-linecap="round"/>${star(57,41,17)}${spark(22,26,7)}${spark(78,73,6)}`,
  'guard-root': `${shield}<path d="M22 63q-9-12-8-21m60 21q9-12 8-21" fill="none" stroke="#f2cf7b" stroke-width="4" stroke-linecap="round"/>`,
  'shield-super': `<path d="M48 18v52q0 12 11 12 9 0 9-9" fill="none" ${line}/><path d="M13 48q4-28 35-28t35 28q-11-11-23 0-12-11-24 0-12-11-23 0Z" fill="#edab8f" ${line}/><path d="M36 46q0-16 12-26 12 10 12 26" fill="#f5d88a" ${line}/><path d="M21 57v9m55-9v8m-47-2v8" fill="none" stroke="#8ab7c1" stroke-width="3" stroke-linecap="round"/>${spark(76,23,6)}`,
  'second-chance': `<path d="M48 69C6 45 25 21 42 36l6 6 6-6c17-15 36 9-6 33Z" fill="#eea193" ${line}/><path d="M32 39q-8-1-8 8" fill="none" stroke="#ffdbbd" stroke-width="4" stroke-linecap="round"/><path d="M20 33q9-18 31-17 21 1 28 19m-5-13 5 13-13-3M76 67q-12 17-34 13-18-3-23-19m-2 13 2-13 12 5" fill="none" stroke="#7ab7a0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  'coin-root': `<path d="M22 69l15-15" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M22 67l13-13" fill="none" stroke="#ae8363" stroke-width="7" stroke-linecap="round"/><circle cx="52" cy="39" r="24" fill="#cbe6da" ${line}/><circle cx="52" cy="39" r="18" fill="#edf2d5"/>${coin(52,39,13)}${spark(78,67,7)}${spark(17,24,5)}`,
  'sweep-super': `<path d="M26 25q32-10 48 2-8 10-38 8-24-2-18 9 5 9 45 4 20-3 14 6-7 9-40 6-15-1-9 7 4 5 24 7l-7 10" fill="none" stroke="#75b5a4" stroke-width="9" stroke-linecap="round"/><path d="M27 22q29-8 44 3M29 41q24 5 44-2M39 58l23 1" fill="none" stroke="#c0e3bd" stroke-width="4" stroke-linecap="round"/><path d="M13 57q-3-9 6-12 6 8-6 12m60 14q11-7 13 2-8 6-13-2" fill="#efc470" ${line}/>${spark(77,19,6)}`,
  'coin-boost': `<path d="M12 51h17m-11 11h11m-3-22h8" fill="none" stroke="#cba15e" stroke-width="4" stroke-linecap="round"/>${coin(53,61,19)}${coin(65,43,18)}${coin(44,33,17)}${spark(77,19,7)}${spark(24,22,5)}`
};
const achievementImages = {
  'first-cut': `<path d="M26 24h35l9 9v35H26Z" fill="#eff1cf" ${line}/><path d="M61 24v10h9M34 43h27m-27 9h16" fill="none" stroke="#91ae91" stroke-width="3" stroke-linecap="round"/><path d="M18 76 77 19" fill="none" stroke="#f4bd65" stroke-width="10" stroke-linecap="round"/><path d="M18 73 77 16" fill="none" stroke="#fff6d7" stroke-width="4" stroke-linecap="round"/>${spark(23,23,7)}${spark(76,71,6)}`,
  'flow-five': `<path d="m15 71 28-12m-22 1 18-8m-7 23 17-13" fill="none" stroke="#e0ad61" stroke-width="5" stroke-linecap="round"/>${star(58,37,25,'#f6cf79')}${spark(21,28,5)}${spark(79,67,6)}${spark(45,15,4)}${spark(13,44,4)}`,
  'careful-stage': `<g transform="translate(0 12) scale(1 .78)">${book}</g><circle cx="49" cy="35" r="20" fill="#9ec8ad" ${line}/><path d="m39 35 7 7 14-16" fill="none" stroke="#fff4d3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${spark(75,26,6)}`,
  'healthy-stop': `${moon}<path d="M22 59h31q4 0 4 4v12H18V63q0-4 4-4Z" fill="#a9c6c2" ${line}/><path d="M29 59v16m10-12v8m6-8v8" fill="none" stroke="#e6edde" stroke-width="3" stroke-linecap="round"/>${spark(76,23,6)}`,
  'context-master': `<path d="M28 31l-8-15 19 8 9-16 10 16 18-8-8 15v10H28Z" fill="#f3ca6f" ${line}/><path d="M48 42v32m-22 0h44M23 49h50M29 49l-10 16h20L29 49Zm38 0L57 65h20L67 49Z" fill="#b8d3b3" ${line}/><circle cx="48" cy="30" r="4" fill="#e79886"/>`,
  'combo-10': `<path d="M17 66q28 10 47-26m-50 8q16 3 24-9" fill="none" stroke="#efbd73" stroke-width="8" stroke-linecap="round"/><path d="m61 17 5 16 17 5-16 5-6 17-5-17-16-5 16-5Z" fill="#91bdb5" ${line}/><circle cx="61" cy="38" r="5" fill="#fff3d9" ${line}/><circle cx="22" cy="26" r="4" fill="#efbd73"/><circle cx="30" cy="20" r="3" fill="#efbd73"/><circle cx="40" cy="17" r="2" fill="#efbd73"/>`,
  'combo-25': `<path d="M29 79C7 64 25 39 35 33c-3 10 3 14 7 16 4-15 20-22 13-39 30 24 34 58 12 69Z" fill="#ed9d71" ${line}/><path d="M36 77q-13-10 6-28 0 12 9 10 9-3 12-15 15 24-2 33Z" fill="#f5d07b"/>${star(51,60,17,'#fff0bc')}${spark(18,25,5)}`,
  'coins-100': `<path d="M18 43h60v32H18Z" fill="#b58258" ${line}/><path d="M18 43q1-22 30-22t30 22" fill="#d6a56e" ${line}/><path d="M31 25v18m34-18v18M18 54h60" fill="none" stroke="#f3d28a" stroke-width="6"/><path d="M43 49h10v15H43Z" fill="#f6d284" ${line}/><circle cx="48" cy="55" r="2" fill="${ink}"/>${coin(74,72,11)}${coin(24,76,10)}${spark(79,21,6)}`,
  'correct-250': `<path d="M14 48q34-38 68 0-34 38-68 0Z" fill="#fff3d7" ${line}/><circle cx="48" cy="48" r="18" fill="#9ccbb0" ${line}/><circle cx="48" cy="48" r="8" fill="${ink}"/><circle cx="43" cy="43" r="4" fill="#fdf1cf"/><path d="M25 29l-5-6m28-1v-8m23 15 5-6" fill="none" stroke="#d6a455" stroke-width="4" stroke-linecap="round"/>${spark(25,75,5)}${spark(73,73,5)}`,
  'hard-clear': `<path d="M23 73Q7 50 18 29m55 44q16-23 5-44M19 63l-8-3m8-9-9-4m10-8-8-6m65 30 8-3m-8-9 9-4m-10-8 8-6" fill="none" stroke="#9ab985" stroke-width="4" stroke-linecap="round"/><g transform="translate(12 8) scale(.75)">${ninja('#b8a7c9','#f2cc76')}</g>${star(48,75,12)}`,
  'first-super': `<path d="M48 13l9 17 20-2-7 20 13 16-22 3-12 16-11-18-21-3 12-17-6-20 20 4Z" fill="#f1cf7f" stroke="#c7a261" stroke-width="2"/><path d="M55 23 33 51h15l-6 24 24-32H51Z" fill="#fff4c9" ${line}/>${spark(15,17,6)}${spark(83,79,6)}`,
  'first-skill': `<path d="M20 74q8-4 16 0 12-4 24 0 8-4 16 0" fill="none" stroke="#ac8963" stroke-width="5" stroke-linecap="round"/><path d="M48 70V41m0 13Q24 55 24 34q23-1 24 20m0-10q0-24 22-23 0 22-22 23" fill="#a3c9a3" ${line}/><path d="M48 70l-8 10m8-10 9 10m-9-10v13" fill="none" stroke="#ac8963" stroke-width="4" stroke-linecap="round"/>${spark(22,20,6)}${spark(76,58,6)}`
};

const sceneImages = {
  classroom: `${book}<path d="m68 18 7 4-13 24-7-4Z" fill="#e6b468" ${line}/><path d="m55 42-1 9 8-5" fill="#fff0d5" ${line}/>`,
  'game-room': gamepad,
  bedroom: `${moon}<path d="M18 69h60v9H18Zm4-13h52v13H22Z" fill="#c1b6cd" ${line}/><path d="M26 59h13v7H26Z" fill="#fff0d8"/>`,
  'paper-garden': `<path d="M47 76V43m-1 21Q24 66 22 49q20-3 24 15m2-9q20 0 24-17-21-2-24 17" fill="#9ac19d" ${line}/><path d="M47 15l12 14 17 6-17 10-12 17-11-17-17-10 17-6Z" fill="#ecb3b4" ${line}/><path d="m47 15 1 31 28-11-29 27-28-27 29 11" fill="none" stroke="#bf858f" stroke-width="2"/><circle cx="48" cy="38" r="5" fill="#fae0a3"/>`,
  'pixel-cove': `<path d="M13 66q10-7 21 0t22 0 27 0v13H13Z" fill="#8ac8cd" ${line}/><path d="M22 62q22-21 53 0Z" fill="#f3d296" ${line}/><path d="M51 60q-3-18 4-31" fill="none" stroke="#a58360" stroke-width="6" stroke-linecap="round"/><path d="M54 30q-7-17-22-10l15 11q-20-5-24 9l27-2q9 1 23 9 5-15-16-16 14-3 16-12-16-6-19 11Z" fill="#9bc5a0" ${line}/><circle cx="23" cy="22" r="7" fill="#f4c978"/>`,
  'moon-isles': `${moon}<path d="M14 69q0-10 10-9 7-15 19 0 12 0 12 9Zm39 9q0-9 9-9 6-13 16 0 10 0 10 9Z" fill="#d4dbea" ${line}/>${spark(22,27,5)}${spark(79,27,5)}`
};

const themes = {
  focus: {back:'#c5ded0',rim:'#80b39f',shine:'#ecf2d9'},
  guard: {back:'#c5dbe1',rim:'#83aeb6',shine:'#e7f0df'},
  coins: {back:'#efdaa8',rim:'#c99d58',shine:'#fff0c9'},
  achievement: {back:'#eee1b7',rim:'#c2a566',shine:'#fff4d5'},
  default: {back:'#d5dec0',rim:'#96ad83',shine:'#f4efd3'}
};

function wrap(picture,theme,kind,className) {
  const extra = typeof className === 'string' ? className.split(/\s+/).filter(name => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(name)).join(' ') : '';
  const ribbon = kind === 'achievement' ? `<path d="m24 64-5 24 13-7 9 9 8-21m6 0 9 21 8-9 13 7-6-24" fill="#b7c29b" stroke="#7f936e" stroke-width="2"/>` : '';
  return `<svg class="upgrade-illustration${extra ? ` ${extra}` : ''}" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${ribbon}<circle cx="48" cy="47" r="41" fill="#514b36" opacity=".12"/><circle cx="48" cy="44" r="40" fill="${theme.rim}"/><circle cx="48" cy="42" r="36" fill="${theme.back}"/><path d="M19 36Q28 11 55 12" fill="none" stroke="${theme.shine}" stroke-width="4" stroke-linecap="round" opacity=".9"/>${picture}</svg>`;
}

/** Small, recognizable card art. Unknown identifiers get a safe generic illustration. */
export function upgradeArt(type,id,{className=''}={}) {
  let image;
  let theme = themes.default;
  if (type === 'skill') {
    image = has(skillImages,id) ? skillImages[id] : null;
    theme = themes[['focus-root','slow-super','flow-boost'].includes(id) ? 'focus' : ['guard-root','shield-super','second-chance'].includes(id) ? 'guard' : 'coins'];
  } else if (type === 'achievement') {
    image = has(achievementImages,id) ? achievementImages[id] : null;
    theme = themes.achievement;
  } else if (type === 'world') {
    image = id === 'study' ? sceneImages.classroom : id === 'gaming' ? gamepad : id === 'sleep' ? sceneImages.bedroom : id === 'master' ? achievementImages['context-master'] : null;
  } else if (type === 'background') {
    image = has(sceneImages,id) ? sceneImages[id] : null;
  } else if (type === 'skin') {
    const palettes = {default:['#83c5ad','#f2b862'],solar:['#e8ab76','#f5d38d'],mint:['#99ccba','#eab893'],neon:['#b4a2cf','#a7d3ba']};
    const palette = has(palettes,id) ? palettes[id] : palettes.default;
    image = ninja(...palette);
  } else if (type === 'coins') {
    theme = themes.coins;
    image = `${coin(35,59,17)}${coin(61,57,17)}${coin(48,34,19)}${spark(76,21,7)}`;
  } else if (type === 'level') {
    theme = themes.achievement;
    image = `<path d="m28 66-6 22 17-8 9 10 9-10 17 8-6-22" fill="#96b9a5" ${line}/>${star(48,43,28)}<circle cx="48" cy="42" r="8" fill="#fff1c9"/>`;
  }
  return wrap(image || `${star(48,45,25)}${spark(19,25,5)}${spark(77,67,6)}`,theme,type,className);
}

/** The original wooden seed hub used at the centre of the branching ability roots. */
export function dojoTreeArt() {
  return `<svg class="dojo-tree-art" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M48 68v22m-5-17L24 87m27-13 19 13M28 56 7 66m62-10 20 10M34 28 17 10m45 18L79 9" stroke="#ae895c" stroke-width="7" stroke-linecap="round"/><path d="M48 74v16m-5-11-12 7m25-6 12 7M26 59l-17 8m64-8 15 7" stroke="#dec293" stroke-width="2" stroke-linecap="round"/><circle cx="48" cy="47" r="34" fill="#b48d60" stroke="#735b40" stroke-width="3"/><circle cx="48" cy="44" r="29" fill="#ead6aa" stroke="#d1b681" stroke-width="3"/><path d="M24 26q-9-16 2-19 12 8 6 16m36 3q9-16-2-19-12 8-6 16" fill="#9cbd91" stroke="#628567" stroke-width="2"/><g transform="translate(16 15) scale(.67)">${ninja()}</g><path d="M27 21q8-7 16-7" stroke="#f6e8c3" stroke-width="3" stroke-linecap="round"/></svg>`;
}
