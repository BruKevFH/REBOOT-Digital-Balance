/** Original inline illustrations. All geometry is local; user input is never used as SVG markup. */
const ink = '#182c28';
const has = (object,key) => Object.prototype.hasOwnProperty.call(object,key);
const line = `stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const spark = (x,y,size=5,color='#fff5bb') => `<path d="M${x} ${y-size}l${size*.28} ${size*.72} ${size*.72} ${size*.28}-${size*.72} ${size*.28}-${size*.28} ${size*.72}-${size*.28}-${size*.72}-${size*.72}-${size*.28} ${size*.72}-${size*.28}Z" fill="${color}"/>`;
const coin = (x,y,r=9) => `<circle cx="${x}" cy="${y+2}" r="${r}" fill="#a26022"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffc536" stroke="#9d601d" stroke-width="2"/><path d="M${x-3} ${y-r+4}q-4 3-4 6" fill="none" stroke="#fff3ad" stroke-width="2" stroke-linecap="round"/><path d="M${x} ${y-4}v8m-2-6h4m-4 4h4" fill="none" stroke="#9d601d" stroke-width="2" stroke-linecap="round"/>`;
const star = (x,y,r=18,color='#ffcc42') => `<path d="M${x} ${y-r}l${r*.29} ${r*.61} ${r*.68} ${r*.1}-${r*.49} ${r*.48} ${r*.12} ${r*.68}-${r*.6}-${r*.32}-${r*.6} ${r*.32} ${r*.12}-${r*.68}-${r*.49}-${r*.48} ${r*.68}-${r*.1}Z" fill="${color}" ${line}/>`;
const ninja = (color='#21ba8c',accent='#ffbf39') => `<path d="M24 77q1-21 24-23t24 23" fill="${color}" ${line}/><path d="M33 62l15 11 15-11" fill="none" stroke="${accent}" stroke-width="7"/><path d="M66 37l17-9-4 13 6 10-18-4" fill="${accent}" ${line}/><path d="M25 42q0-25 23-25t23 25v10q-2 21-23 21T25 52Z" fill="${color}" ${line}/><path d="M28 41q20-8 40 0v12q-20 11-40 0Z" fill="#fff0bf" ${line}/><path d="M35 47l7 2m13 0 7-2" fill="none" ${line}/><path d="M34 28q6-7 15-6" fill="none" stroke="#88f4ba" stroke-width="4" stroke-linecap="round"/>`;
const brain = `<path d="M47 24c-7-7-18-1-18 7-9 0-13 10-8 17-7 8-1 20 8 20 3 10 17 10 19 2 4 8 17 7 20-2 11 0 15-12 9-19 5-8 0-18-9-18-1-9-13-14-20-7Z" fill="#ff866d" ${line}/><path d="M48 28v38M32 32q11 1 8 11m-15 5q11-4 15 5m-11 10q2-9 11-7m24-23q-10 0-9 11m16 5q-10-4-16 5m10 10q-2-9-10-7" fill="none" stroke="#b84448" stroke-width="2.5" stroke-linecap="round"/><path d="M31 26q6-5 11-2" fill="none" stroke="#ffe0b6" stroke-width="3" stroke-linecap="round"/>`;
const book = `<path d="M20 32q15-7 28 1 13-8 28-1v37q-16-6-28 1-12-7-28-1Z" fill="#fff0ba" ${line}/><path d="M48 33v37M26 40l15-1m-15 9 15-1m-15 9 13-1m16-16 14 1m-14 8 14 1m-14 7 11 1" fill="none" stroke="#b5914f" stroke-width="2.5" stroke-linecap="round"/>`;
const shield = `<path d="M48 19l24 10v20q0 21-24 31-24-10-24-31V29Z" fill="#18bb8c" ${line}/><path d="M48 27l16 7v15q-1 14-16 23-15-9-16-23V34Z" fill="#7ee8ac" stroke="#0d8163" stroke-width="2"/><path d="M39 48l7 8 13-18" fill="none" stroke="#fff8cd" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const moon = `<path d="M62 23C37 19 21 47 39 65c14 14 36 6 39-8-22 10-38-13-16-34Z" fill="#ffda52" ${line}/><path d="M39 29q-12 11-6 25" fill="none" stroke="#fff4a7" stroke-width="4" stroke-linecap="round"/>`;
const gamepad = `<path d="M31 32h34q10 0 14 13l4 18q2 13-8 13-5 0-15-11H36Q26 76 21 76q-10 0-8-13l4-18q4-13 14-13Z" fill="#9c83db" ${line}/><path d="M31 42v17m-8-8h16" fill="none" stroke="#fff0b9" stroke-width="6" stroke-linecap="round"/><circle cx="64" cy="46" r="4" fill="#ff865c"/><circle cx="73" cy="54" r="4" fill="#ffca41"/><path d="M42 54h12" stroke="#5b477f" stroke-width="3" stroke-linecap="round"/><path d="M27 36h12" stroke="#d8c5ff" stroke-width="3" stroke-linecap="round"/>`;
const skillImages = {
  'focus-root': `${brain}${spark(16,30,5)}${spark(76,70,5)}`,
  'slow-super': `<path d="M46 14h9m-4 0v9m24 4 5 5" fill="none" ${line}/><circle cx="49" cy="49" r="28" fill="#ffbe34" ${line}/><circle cx="49" cy="49" r="22" fill="#fff2c3" stroke="#a16c23" stroke-width="2"/><path d="M49 32v18l10 5m-27-6h3m28 0h3m-17 16v-3" fill="none" ${line}/><path d="M33 29q7-5 16-5" fill="none" stroke="#ffe7a3" stroke-width="3" stroke-linecap="round"/>${spark(20,22,7)}${spark(80,64,6)}`,
  'flow-boost': `<path d="M13 64q14-27 39-26 24 1 24-12-1-7-12-3" fill="none" stroke="#136e5e" stroke-width="12" stroke-linecap="round"/><path d="M13 60q14-27 39-26 24 1 24-12" fill="none" stroke="#5be2aa" stroke-width="8" stroke-linecap="round"/><path d="M27 76q15-18 38-17m-42-9 11-7" fill="none" stroke="#ffcf45" stroke-width="5" stroke-linecap="round"/>${star(57,41,17)}${spark(22,26,7)}${spark(78,73,6)}`,
  'guard-root': `${shield}<path d="M22 63q-9-12-8-21m60 21q9-12 8-21" fill="none" stroke="#ffd14c" stroke-width="4" stroke-linecap="round"/>`,
  'shield-super': `<path d="M48 18v52q0 12 11 12 9 0 9-9" fill="none" ${line}/><path d="M13 48q4-28 35-28t35 28q-11-11-23 0-12-11-24 0-12-11-23 0Z" fill="#ff7656" ${line}/><path d="M36 46q0-16 12-26 12 10 12 26" fill="#ffce4e" ${line}/><path d="M21 57v9m55-9v8m-47-2v8" fill="none" stroke="#5fc6db" stroke-width="3" stroke-linecap="round"/>${spark(76,23,6)}`,
  'second-chance': `<path d="M48 69C6 45 25 21 42 36l6 6 6-6c17-15 36 9-6 33Z" fill="#ff7466" ${line}/><path d="M32 39q-8-1-8 8" fill="none" stroke="#ffdbac" stroke-width="4" stroke-linecap="round"/><path d="M20 33q9-18 31-17 21 1 28 19m-5-13 5 13-13-3M76 67q-12 17-34 13-18-3-23-19m-2 13 2-13 12 5" fill="none" stroke="#32cf9c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  'coin-root': `<path d="M22 69l15-15" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M22 67l13-13" fill="none" stroke="#ce8d44" stroke-width="7" stroke-linecap="round"/><circle cx="52" cy="39" r="24" fill="#88e0bd" ${line}/><circle cx="52" cy="39" r="18" fill="#cbf5be"/>${coin(52,39,13)}${spark(78,67,7)}${spark(17,24,5)}`,
  'sweep-super': `<path d="M26 25q32-10 48 2-8 10-38 8-24-2-18 9 5 9 45 4 20-3 14 6-7 9-40 6-15-1-9 7 4 5 24 7l-7 10" fill="none" stroke="#1dbe91" stroke-width="9" stroke-linecap="round"/><path d="M27 22q29-8 44 3M29 41q24 5 44-2M39 58l23 1" fill="none" stroke="#9af5b6" stroke-width="4" stroke-linecap="round"/><path d="M13 57q-3-9 6-12 6 8-6 12m60 14q11-7 13 2-8 6-13-2" fill="#ffca45" ${line}/>${spark(77,19,6)}`,
  'coin-boost': `<path d="M12 51h17m-11 11h11m-3-22h8" fill="none" stroke="#ffd15e" stroke-width="4" stroke-linecap="round"/>${coin(53,61,19)}${coin(65,43,18)}${coin(44,33,17)}${spark(77,19,7)}${spark(24,22,5)}`
};
const achievementImages = {
  'first-cut': `<path d="M26 24h35l9 9v35H26Z" fill="#d9f7bd" ${line}/><path d="M61 24v10h9M34 43h27m-27 9h16" fill="none" stroke="#2c9f72" stroke-width="3" stroke-linecap="round"/><path d="M18 76 77 19" fill="none" stroke="#ffc239" stroke-width="10" stroke-linecap="round"/><path d="M18 73 77 16" fill="none" stroke="#fff8cf" stroke-width="4" stroke-linecap="round"/>${spark(23,23,7)}${spark(76,71,6)}`,
  'flow-five': `<path d="m15 71 28-12m-22 1 18-8m-7 23 17-13" fill="none" stroke="#ffc440" stroke-width="5" stroke-linecap="round"/>${star(58,37,25,'#ffd046')}${spark(21,28,5)}${spark(79,67,6)}${spark(45,15,4)}${spark(13,44,4)}`,
  'careful-stage': `<g transform="translate(0 12) scale(1 .78)">${book}</g><circle cx="49" cy="35" r="20" fill="#35c58f" ${line}/><path d="m39 35 7 7 14-16" fill="none" stroke="#fff5c7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${spark(75,26,6)}`,
  'healthy-stop': `${moon}<path d="M22 59h31q4 0 4 4v12H18V63q0-4 4-4Z" fill="#66c3b9" ${line}/><path d="M29 59v16m10-12v8m6-8v8" fill="none" stroke="#d8ffe1" stroke-width="3" stroke-linecap="round"/>${spark(76,23,6)}`,
  'context-master': `<path d="M28 31l-8-15 19 8 9-16 10 16 18-8-8 15v10H28Z" fill="#ffc537" ${line}/><path d="M48 42v32m-22 0h44M23 49h50M29 49l-10 16h20L29 49Zm38 0L57 65h20L67 49Z" fill="#69d99b" ${line}/><circle cx="48" cy="30" r="4" fill="#ff775e"/>`,
  'combo-10': `<path d="M17 66q28 10 47-26m-50 8q16 3 24-9" fill="none" stroke="#ffc343" stroke-width="8" stroke-linecap="round"/><path d="m61 17 5 16 17 5-16 5-6 17-5-17-16-5 16-5Z" fill="#4bc5a2" ${line}/><circle cx="61" cy="38" r="5" fill="#fff4cb" ${line}/><circle cx="22" cy="26" r="4" fill="#ffc343"/><circle cx="30" cy="20" r="3" fill="#ffc343"/><circle cx="40" cy="17" r="2" fill="#ffc343"/>`,
  'combo-25': `<path d="M29 79C7 64 25 39 35 33c-3 10 3 14 7 16 4-15 20-22 13-39 30 24 34 58 12 69Z" fill="#ff7544" ${line}/><path d="M36 77q-13-10 6-28 0 12 9 10 9-3 12-15 15 24-2 33Z" fill="#ffcc3e"/>${star(51,60,17,'#fff0a6')}${spark(18,25,5)}`,
  'coins-100': `<path d="M18 43h60v32H18Z" fill="#a56330" ${line}/><path d="M18 43q1-22 30-22t30 22" fill="#da913e" ${line}/><path d="M31 25v18m34-18v18M18 54h60" fill="none" stroke="#ffc44a" stroke-width="6"/><path d="M43 49h10v15H43Z" fill="#ffd14d" ${line}/><circle cx="48" cy="55" r="2" fill="${ink}"/>${coin(74,72,11)}${coin(24,76,10)}${spark(79,21,6)}`,
  'correct-250': `<path d="M14 48q34-38 68 0-34 38-68 0Z" fill="#fff1c8" ${line}/><circle cx="48" cy="48" r="18" fill="#43cc98" ${line}/><circle cx="48" cy="48" r="8" fill="${ink}"/><circle cx="43" cy="43" r="4" fill="#fff7d5"/><path d="M25 29l-5-6m28-1v-8m23 15 5-6" fill="none" stroke="#ffcb4d" stroke-width="4" stroke-linecap="round"/>${spark(25,75,5)}${spark(73,73,5)}`,
  'hard-clear': `<path d="M23 73Q7 50 18 29m55 44q16-23 5-44M19 63l-8-3m8-9-9-4m10-8-8-6m65 30 8-3m-8-9 9-4m-10-8 8-6" fill="none" stroke="#62bd76" stroke-width="4" stroke-linecap="round"/><g transform="translate(12 8) scale(.75)">${ninja('#a284d3','#ffcd47')}</g>${star(48,75,12)}`,
  'first-super': `<path d="M48 13l9 17 20-2-7 20 13 16-22 3-12 16-11-18-21-3 12-17-6-20 20 4Z" fill="#ffba2e" stroke="#a36526" stroke-width="2"/><path d="M55 23 33 51h15l-6 24 24-32H51Z" fill="#fff4b5" ${line}/>${spark(15,17,6)}${spark(83,79,6)}`,
  'first-skill': `<path d="M20 74q8-4 16 0 12-4 24 0 8-4 16 0" fill="none" stroke="#c58a43" stroke-width="5" stroke-linecap="round"/><path d="M48 70V41m0 13Q24 55 24 34q23-1 24 20m0-10q0-24 22-23 0 22-22 23" fill="#4dce8e" ${line}/><path d="M48 70l-8 10m8-10 9 10m-9-10v13" fill="none" stroke="#c58a43" stroke-width="4" stroke-linecap="round"/>${spark(22,20,6)}${spark(76,58,6)}`,
  'correct-1000': `<circle cx="46" cy="48" r="27" fill="#ff725b" ${line}/><circle cx="46" cy="48" r="18" fill="#fff0bb" stroke="#bb513e" stroke-width="3"/><circle cx="46" cy="48" r="8" fill="#29c395" ${line}/><path d="m46 48 27-27m-7 1 8-9 0 8 8 0-9 8m-27 19 19-2m-19 2 5-17" fill="none" stroke="#ffda65" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${spark(19,24,6)}`,
  'correct-2500': `<path d="M23 29 19 14l20 9q9-4 19 0l19-9-4 17q8 13 2 31L62 77H34L20 62q-5-20 3-33Z" fill="#ffbd3c" ${line}/><path d="m48 45-9 14 9 9 9-9Z" fill="#ee7847" ${line}/><circle cx="34" cy="41" r="13" fill="#fff3c5" ${line}/><circle cx="62" cy="41" r="13" fill="#fff3c5" ${line}/><circle cx="36" cy="42" r="5" fill="${ink}"/><circle cx="60" cy="42" r="5" fill="${ink}"/><circle cx="34" cy="40" r="2" fill="#fff"/><circle cx="58" cy="40" r="2" fill="#fff"/><path d="m33 65 5 6m20-6-5 6" stroke="#a76526" stroke-width="3" stroke-linecap="round"/>`,
  'combo-50': `<path d="m20 24 9-8 41 49-10 8Z" fill="#fff1bf" ${line}/><path d="m20 16 9 8 41-8-8 10-41 47-10-8Z" fill="#92e7bf" ${line}/><path d="m17 66 13 11m32-1 13-11" stroke="#ffba39" stroke-width="8" stroke-linecap="round"/>${star(49,44,17,'#ffca3e')}${spark(17,46,5)}${spark(78,40,5)}`,
  'combo-75': `<path d="M45 46Q31 16 12 24l16 16-13-4q4 17 25 22l-10 9 19-3 18 3-9-9q21-5 25-22l-13 4 15-16Q66 16 52 46Z" fill="#ff784c" ${line}/><path d="M48 23q12 8 10 19-2 11-10 19-9-8-11-19-2-11 11-19Z" fill="#ffd34c" ${line}/><path d="m43 56-3 22 8-6 8 6-3-22" fill="#ffb336" ${line}/><path d="M45 39h6" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>${spark(48,13,6)}`,
  'runs-10': `<path d="M30 22h24l-2 26 17 6q11 4 9 15H24l-5-10 9-12Z" fill="#ff805d" ${line}/><path d="M26 57h28l15 4m-44 8h51M33 31h17m-18 9h17" fill="none" stroke="#ffd36a" stroke-width="4" stroke-linecap="round"/><path d="M9 34h13m-9 12h8m-10 24h8" stroke="#8df3b2" stroke-width="4" stroke-linecap="round"/>${spark(74,28,7)}`,
  'runs-25': `<path d="M16 74q10-11 24-5t24-5 17-10" fill="none" stroke="#ffd04c" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 7"/><path d="M35 58 41 23h23l6 35Z" fill="#f4d58b" ${line}/><path d="M42 30h21l2 12H40Z" fill="#ff7958" ${line}/><path d="M42 22V12h22v10m-27 1 16-13 16 13M48 46h10v13H48Z" fill="#38c595" ${line}/><path d="M53 10V3l14 3-14 4" fill="#ffcc48" stroke="${ink}" stroke-width="2"/>${spark(21,25,6)}`,
  'supers-25': `<path d="M26 63 18 36l9-7 10 15V19l11-6 10 6v21l10-10 10 9-8 27-22 14Z" fill="#46d29b" ${line}/><path d="m48 31-15 24h13l-1 17 19-29H51l3-12Z" fill="#ffd345" ${line}/><path d="M29 47 24 36m43 11 5-8M43 23h9" stroke="#caffcb" stroke-width="3" stroke-linecap="round"/>${spark(79,21,6)}`,
  'supers-100': `<path d="m48 12 9 12 17-5-2 18 13 11-13 10 2 18-17-5-9 12-10-12-17 5 2-18L10 48l13-11-2-18 17 5Z" fill="#ffb72c" stroke="#a46921" stroke-width="2"/><circle cx="48" cy="47" r="23" fill="#20b68c" ${line}/><path d="m52 27-17 23h12l-4 20 20-27H50Z" fill="#fff0a8" ${line}/><path d="M29 33q8-10 18-10" stroke="#a1f6bd" stroke-width="3" stroke-linecap="round"/>`,
  'hard-5': `<path d="m26 29-9-12 1 25 9 11m43-24 9-12-1 25-9 11" fill="#ffcf43" ${line}/><path d="M24 47q0-24 24-28 24 4 24 28L65 69 48 80 31 69Z" fill="#7cbfb0" ${line}/><path d="M48 20v23m-21 0 20 6 21-6-7 20-13 9-13-9Z" fill="#23473c" ${line}/><path d="m33 52 9 3m12 0 9-3" stroke="#ffe281" stroke-width="4" stroke-linecap="round"/><path d="M38 29q5-5 10-6" stroke="#ceffe1" stroke-width="3" stroke-linecap="round"/>`,
  'hard-20': `<path d="M27 65Q13 53 24 36l-3-16 17 8 12-9 19 5-6 10 16 10-3 17-15 5-6 14-15-9Z" fill="#28c18c" ${line}/><path d="m50 19 2-11 10 14M25 36l-13-5 10 15m40 20 11 10-1-16" fill="#ffc83d" ${line}/><path d="m46 39 13-2-6 8-8-1m18 9 11-1m-40 8 12 8 6-9" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="m64 62 5-7 5 6" fill="#fff2bf" ${line}/><path d="M28 38q5-9 14-11" stroke="#a5f4bd" stroke-width="3" stroke-linecap="round"/>`,
  'coins-500': `<path d="m35 29-7-13 14 2 9-7 8 9 12-1-8 14q17 13 15 31-1 16-29 16T21 64q-2-19 14-35Z" fill="#dc8739" ${line}/><path d="M33 31q16 6 31 0" stroke="#ffe17b" stroke-width="5" stroke-linecap="round"/><path d="M30 48q-5 11-1 17" stroke="#ffb95e" stroke-width="4" stroke-linecap="round"/>${coin(49,57,16)}${coin(75,74,9)}${spark(18,27,6)}`,
  'coins-1500': `<path d="M18 60h60v18H18Z" fill="#d58c2e" ${line}/><path d="m25 59 5-17h24l6 17Zm22 0 5-17h21l7 17ZM34 40l5-17h23l6 17Z" fill="#ffc834" ${line}/><path d="M30 47h22m3 0h14M39 28h20m-35 37h47" stroke="#fff0a0" stroke-width="4" stroke-linecap="round"/>${spark(20,25,7)}${spark(77,22,6)}`
};

const sceneImages = {
  classroom: `${book}<path d="m68 18 7 4-13 24-7-4Z" fill="#ffbe49" ${line}/><path d="m55 42-1 9 8-5" fill="#fff1c3" ${line}/>`,
  'game-room': gamepad,
  bedroom: `${moon}<path d="M18 69h60v9H18Zm4-13h52v13H22Z" fill="#9883c1" ${line}/><path d="M26 59h13v7H26Z" fill="#fff0b8"/>`,
  'paper-garden': `<path d="M47 76V43m-1 21Q24 66 22 49q20-3 24 15m2-9q20 0 24-17-21-2-24 17" fill="#42c28c" ${line}/><path d="M47 15l12 14 17 6-17 10-12 17-11-17-17-10 17-6Z" fill="#ff87a0" ${line}/><path d="m47 15 1 31 28-11-29 27-28-27 29 11" fill="none" stroke="#af456a" stroke-width="2"/><circle cx="48" cy="38" r="5" fill="#ffe463"/>`,
  'pixel-cove': `<path d="M13 66q10-7 21 0t22 0 27 0v13H13Z" fill="#49c7d5" ${line}/><path d="M22 62q22-21 53 0Z" fill="#ffd47e" ${line}/><path d="M51 60q-3-18 4-31" fill="none" stroke="#bd8141" stroke-width="6" stroke-linecap="round"/><path d="M54 30q-7-17-22-10l15 11q-20-5-24 9l27-2q9 1 23 9 5-15-16-16 14-3 16-12-16-6-19 11Z" fill="#41bc85" ${line}/><circle cx="23" cy="22" r="7" fill="#ffd14b"/>`,
  'moon-isles': `${moon}<path d="M14 69q0-10 10-9 7-15 19 0 12 0 12 9Zm39 9q0-9 9-9 6-13 16 0 10 0 10 9Z" fill="#d5d8fb" ${line}/>${spark(22,27,5)}${spark(79,27,5)}`
};

const themes = {
  focus: {back:'#174a3d',rim:'#25bd8a',shine:'#b6f3a8',shade:'#0c775d'},
  guard: {back:'#3b4535',rim:'#ff865b',shine:'#ffe1a3',shade:'#b84936'},
  coins: {back:'#574222',rim:'#ffc53d',shine:'#fff1a6',shade:'#b87520'},
  achievement: {back:'#264b3b',rim:'#f7be3a',shine:'#fff2ae',shade:'#ad7024'},
  default: {back:'#31533f',rim:'#d39b49',shine:'#ffdf8a',shade:'#85552d'}
};

function wrap(picture,theme,kind,className) {
  const extra = typeof className === 'string' ? className.split(/\s+/).filter(name => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(name)).join(' ') : '';
  const ribbon = kind === 'achievement' ? `<path d="m25 64-7 29 15-7 10 8 7-24m5 0 9 24 10-8 14 7-9-29" fill="#e85f43" stroke="${ink}" stroke-width="3"/><path d="m28 72-3 12m48-12 4 12" stroke="#ffb759" stroke-width="3" stroke-linecap="round"/>` : '';
  return `<svg class="upgrade-illustration${extra ? ` ${extra}` : ''}" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${ribbon}<path d="m48 6 29 9 15 25-6 30-23 19H33L10 70 4 40l15-25Z" fill="${ink}" opacity=".25"/><path d="m48 3 29 10 15 25-6 30-23 18H33L10 68 4 38l15-25Z" fill="${theme.rim}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="m48 3 29 10-8 8-21-8-21 8-8-8Z" fill="${theme.shine}"/><path d="m92 38-6 30-23 18H33L10 68l10-6 17 13h22l17-13 6-23Z" fill="${theme.shade}"/><path d="m48 13 23 8 12 20-5 22-18 14H36L18 63l-5-22 12-20Z" fill="${theme.back}" stroke="${ink}" stroke-width="2"/><path d="m26 23 22-8 21 8" fill="none" stroke="${theme.shine}" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="m18 38 4-9m55 36-7 6" stroke="#fff4c3" stroke-width="2" stroke-linecap="round" opacity=".65"/>${picture}<path d="m9 38 4-9m69 43-7 6" stroke="${theme.shine}" stroke-width="3" stroke-linecap="round"/></svg>`;
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
    const palettes = {default:['#21ba8c','#ffbf39'],solar:['#f09141','#ffd44d'],mint:['#54d5ae','#ff9e68'],neon:['#a782e2','#62e0a8']};
    const palette = has(palettes,id) ? palettes[id] : palettes.default;
    image = ninja(...palette);
  } else if (type === 'coins') {
    theme = themes.coins;
    image = `${coin(35,59,17)}${coin(61,57,17)}${coin(48,34,19)}${spark(76,21,7)}`;
  } else if (type === 'level') {
    theme = themes.achievement;
    image = `<path d="m28 66-6 22 17-8 9 10 9-10 17 8-6-22" fill="#40ba86" ${line}/>${star(48,43,28)}<circle cx="48" cy="42" r="8" fill="#fff1ad"/>`;
  }
  return wrap(image || `${star(48,45,25)}${spark(19,25,5)}${spark(77,67,6)}`,theme,type,className);
}

/** A carved tree seal anchors the branches without duplicating the speaking mentor. */
export function dojoTreeArt() {
  return `<svg class="dojo-tree-art" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M48 69v23M40 71 21 89m35-18 19 18M28 55 4 67m64-12 24 12M32 29 13 7m51 22L83 7" stroke="#382a1d" stroke-width="9" stroke-linecap="round"/><path d="M48 70v21M40 72 22 88m34-16 18 16M28 55 5 67m63-12 23 12M32 29 14 8m50 21L82 8" stroke="#b67a36" stroke-width="5" stroke-linecap="round"/><path d="m48 5 27 12 13 28-9 28-31 16-31-16-9-28 13-28Z" fill="#ad7032" stroke="#32271e" stroke-width="3"/><path d="m48 10 23 11 11 25-8 23-26 14-26-14-8-23 11-25Z" fill="#e6b254" stroke="#f9d47d" stroke-width="2"/><path d="m48 17 20 9 9 21-7 19-22 12-22-12-7-19 9-21Z" fill="#214d36" stroke="#614321" stroke-width="3"/><path d="M48 69V46q-1-10-13-15m13 16q2-12 15-18M48 60l-11 9m11-9 12 10m-12-1 1 7" stroke="#e7b651" stroke-width="5" stroke-linecap="round"/><path d="M45 43Q21 42 26 23q21-1 19 20m8-2q-2-22 20-23 1 21-20 23M48 30q-12-13-1-21 12 8 1 21Z" fill="#3ed090" stroke="#183d2b" stroke-width="2.5"/><path d="m29 28 13 12m27-17L56 37M47 14v11" stroke="#b8f2aa" stroke-width="2" stroke-linecap="round"/><circle cx="48" cy="53" r="6" fill="#ffd24f" stroke="#755023" stroke-width="2"/><path d="m24 18 12-5m44 48-5 10" stroke="#fff0b0" stroke-width="3" stroke-linecap="round"/></svg>`;
}
