// Original illustrated arcade art. This renderer only draws; game state belongs to the model.
import { CONTENT } from './game.js';
import { getThrowerLayout, getThrowerPose, getThrowScale, isThrowReady, THROW_RECOVERY } from './throwers.js';
const CONTENT_LOOKUP=new Map(CONTENT.map(content=>[content.id,content]));
const TAU=Math.PI*2,INK='#36344b',PAPER='#fff9ed',CORAL='#ee7567',GREEN='#4b9d78',GOLD='#f7bd51';
const THEMES={study:{wall:'#fff0d2',bottom:'#f7d59e'},gaming:{wall:'#eadff6',bottom:'#c8b2da'},sleep:{wall:'#a9a0ce',bottom:'#8982b3'},home:{wall:'#ffedd1',bottom:'#f4c59c'}};
const SKINS={default:'#69bba0',classic:'#69bba0',mint:'#78b7c5',neon:'#b88bd1',solar:'#ecad43',gold:'#ecad43',dawn:'#eaaa65',shadow:'#72b9b0',grandmaster:'#e4bc61'};
const PLAYER_PALETTES={default:{body:'#699c89',hood:'#52816e',dark:'#436a5d',arm:'#7eb2a0',scarf:'#ee7567',light:'#b5d6b4'},solar:{body:'#d29a4b',hood:'#a86842',dark:'#876449',arm:'#e3b065',scarf:'#e87544',light:'#ffe0a0'},mint:{body:'#82b5ca',hood:'#5f91ad',dark:'#4b6e8e',arm:'#b1dce4',scarf:'#b0d8ec',light:'#e3f9fc'},neon:{body:'#a786c2',hood:'#7d639e',dark:'#5f4c7c',arm:'#c7a6df',scarf:'#e798bd',light:'#e8d2ef'},dawn:{body:'#d59976',hood:'#b66f61',dark:'#986057',arm:'#e8b58b',scarf:'#efb65e',light:'#ffe3b1'},shadow:{body:'#626b8b',hood:'#434d72',dark:'#343e5a',arm:'#7d90a9',scarf:'#7dc3b8',light:'#c3e1d7'},grandmaster:{body:'#eee3c6',hood:'#e1cc9c',dark:'#9a7659',arm:'#fff0cf',scarf:'#c56859',light:'#fff7e2'}};
const THROW_STYLES={default:'ribbon',solar:'flame',mint:'crystal',neon:'comic-stars',dawn:'sunrise-fan',shadow:'shadow-feathers',grandmaster:'golden-lotus'};
const playerSkin=value=>Object.prototype.hasOwnProperty.call(PLAYER_PALETTES,value)?value:'default';
/** A safe, authored portrait of the equipped player. The mint tutorial guide is a separate character. */
export function playerPortrait(skinId='default'){
  const id=playerSkin(skinId),p=PLAYER_PALETTES[id],stroke='stroke="#36344b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"';
  const rankGear={dawn:`<path d="M56 46q33-35 67 0" fill="#f6c475" ${stroke}/><path d="m61 40-4-13m18 5-1-16m16 13V10m16 23 4-16m8 25 9-12" fill="none" stroke="#f6c475" stroke-width="5" stroke-linecap="round"/><path d="M60 46h62" stroke="#ffe7ac" stroke-width="6"/>`,shadow:`<path d="m89 10 10 22 23-2-14 17-19 8-19-8-14-17 23 2Z" fill="#7dc3b8" ${stroke}/><path d="m89 20 5 16 12 1-17 11-17-11 12-1Z" fill="#d6e8d3"/><path d="m56 51-22-10 10 22-17 13 29-9" fill="#505c7d" ${stroke}/>`,grandmaster:`<path d="m57 47 5-28 18 12 10-27 11 27 18-12 5 28Z" fill="#ebc05f" ${stroke}/><path d="m74 41 16-23 15 23Z" fill="#fff4ca"/><circle cx="90" cy="36" r="6" fill="#cf7860" ${stroke}/><path d="m64 49-9 12m63-12 9 12" stroke="#ebc05f" stroke-width="5" stroke-linecap="round"/>`};
  const gear=rankGear[id]||(id==='solar'?`<path d="m65 46 2-24 13 13 9-29 10 28 13-15 5 27Z" fill="#f4b354" ${stroke}/><path d="m80 36 9-18 8 20Z" fill="#ffdf91"/>`:id==='mint'?`<path d="m58 45-1-20 17 10L89 9l13 25 18-11-3 24Z" fill="#c8eef1" ${stroke}/><path d="m89 12-2 31 14-9Z" fill="#92c9df"/>`:id==='neon'?`<path d="m89 8 7 17 18 2-13 12 4 19-16-10-17 10 4-19-13-12 19-2Z" fill="#d0b2e5" ${stroke}/><path d="m89 19 4 12 11 1-9 8 2 11-8-7-9 7 2-11-8-8 11-1Z" fill="#f0d0e3"/>`:`<path d="m54 49-14-9 5 16-11 12 22-5" fill="${p.scarf}" ${stroke}/><path d="m90 31 5 9 10 5-10 5-5 10-5-10-10-5 10-5Z" fill="#e4dfbc" ${stroke}/><circle cx="90" cy="45" r="3" fill="${p.dark}"/>`);
  return `<svg class="player-ninja-avatar player-ninja--${id}" data-player-skin="${id}" viewBox="0 0 180 200" aria-hidden="true" focusable="false"><style>.player-avatar-scarf{transform-origin:117px 94px;animation:player-scarf 2.6s ease-in-out infinite}.player-avatar-body{transform-origin:90px 180px;animation:player-breathe 3.3s ease-in-out infinite}.player-avatar-eyes{transform-origin:90px 73px;animation:player-blink 5.2s infinite}@keyframes player-scarf{50%{transform:rotate(-7deg)}}@keyframes player-breathe{50%{transform:translateY(-2px)}}@keyframes player-blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.15)}}@media(prefers-reduced-motion:reduce){.player-avatar-scarf,.player-avatar-body,.player-avatar-eyes{animation:none}}</style><ellipse cx="90" cy="186" rx="52" ry="9" fill="#685752" opacity=".13"/><g class="player-avatar-body"><path d="m64 132-9 48 23 4 13-34 11 34 24-6-11-46Z" fill="${p.dark}" ${stroke}/><path d="m56 174-3 12q9 8 25 0v-10m25 0v11q17 6 25-3l-4-12" fill="#c18b63" ${stroke}/><path d="M64 97q-19 1-28 32l14 7 23-27m43-10 22 25 14-9-25-31" fill="${p.arm}" ${stroke}/><circle cx="44" cy="131" r="9" fill="${p.light}" ${stroke}/><circle cx="146" cy="116" r="9" fill="${p.light}" ${stroke}/><path d="M66 96q23-11 46 0l12 50q-35 12-64 0Z" fill="${p.body}" ${stroke}/><path d="m73 104 35 34m-1-34-31 34" fill="none" stroke="${p.light}" stroke-width="9"/><path d="m62 135 59-1 3 11q-33 11-64 0Z" fill="#deb06d" ${stroke}/><rect x="83" y="134" width="15" height="14" rx="3" fill="#ffe7aa" ${stroke}/><path class="player-avatar-scarf" d="M115 88q22 3 39-15l-4 19 14 10q-27 10-49-4" fill="${p.scarf}" ${stroke}/><path d="M43 65q-2-41 46-43 46 1 47 43l-7 29q-16 22-40 22-28-1-42-25Z" fill="${p.hood}" ${stroke}/>${gear}<path d="M50 65q38-16 79 0l-4 22q-33 15-70 0Z" fill="#ffddb4" ${stroke}/><path d="m52 58 75-1" stroke="${p.scarf}" stroke-width="12"/><g class="player-avatar-eyes"><ellipse cx="73" cy="76" rx="9" ry="11" fill="#fff9e9"/><ellipse cx="108" cy="76" rx="9" ry="11" fill="#fff9e9"/><ellipse cx="75" cy="77" rx="4" ry="6" fill="#36344b"/><ellipse cx="110" cy="77" rx="4" ry="6" fill="#36344b"/></g><path d="M53 86q36 14 74 0l-3 14q-33 27-67 0Z" fill="${p.body}" ${stroke}/><path d="M75 96q14 8 31 0" fill="none" stroke="${p.light}" stroke-width="3" stroke-linecap="round"/></g></svg>`;
}
const COMPACT={streak:'STREAK','urgent-school':'SCHULE',homework:'AUFGABE',gameclip:'GAME-CLIP','gaming-invite':'TEAM-INVITE',break:'PAUSE',quiet:'RUHEZEIT','scary-lure':'KLICK-ALARM',safety:'ECHTE WARNUNG',update:'UPDATE',notebook:'NOTIZBUCH',pencil:'STIFT',assignment:'AUFGABE',controller:'CONTROLLER',loot:'SCHATZ',energy:'ENERGIE',pillow:'KISSEN',teddy:'TEDDY',moon:'GUTE NACHT',video:'VIDEO'};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v)),finite=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
function rgba(color,alpha=1){const m=/^#([0-9a-f]{6})$/i.exec(color);return m?`rgba(${parseInt(m[1].slice(0,2),16)},${parseInt(m[1].slice(2,4),16)},${parseInt(m[1].slice(4,6),16)},${clamp(alpha,0,1)})`:color;}
function rounded(c,x,y,w,h,r=8){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();}
function rect(c,x,y,w,h,color,stroke=null,r=8){rounded(c,x,y,w,h,r);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
function oval(c,x,y,rx,ry,color,stroke=null,a=0){c.beginPath();c.ellipse(x,y,rx,ry,a,0,TAU);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
function polygon(c,points,color,stroke=null){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
function line(c,points,color,w=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=w;c.stroke();}
function star(c,x,y,r,color,n=5,a=-Math.PI/2){const p=[];for(let i=0;i<n*2;i++){const d=i%2?r*.47:r,t=a+i*Math.PI/n;p.push([x+Math.cos(t)*d,y+Math.sin(t)*d]);}polygon(c,p,color);}
function modeOf(s){const raw=String(s.context?.id||s.context||s.level?.id||s.level||s.mode||'study').toLowerCase();return /gam/.test(raw)?'gaming':/sleep|schlaf/.test(raw)?'sleep':'study';}
function isPower(o){return o.kind==='powerup'||o.type==='powerup'||Boolean(o.powerup||o.power);}
function contentOf(o){const c=CONTENT_LOOKUP.get(o.contentId)||{};return o.content&&typeof o.content==='object'?{...c,...o.content}:c;}
function identityOf(o){return String(contentOf(o).id||o.contentId||o.label||'signal');}
function colorOf(o){const color=o.color||contentOf(o).color;return typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color)?color:'#8cadce';}
function visualOf(o){const c=contentOf(o);return String(o.visual||c.visual||({'urgent-school':'assignment',homework:'notebook','gaming-invite':'controller',gameclip:'gameclip',break:'energy',quiet:'pillow',safety:'shield','power-slow':'clock','power-shield':'shield','power-multiplier':'star','power-coins':'coin'})[identityOf(o)]||'phone');}
function iconOf(o){return String(contentOf(o).icon||o.icon||visualOf(o));}

export function createRenderer(canvas){
  const ctx=canvas?.getContext?.('2d',{alpha:false});if(!ctx)throw new Error('Die 2D-Zeichenfläche konnte nicht gestartet werden.');
  let width=1,height=1,dpr=1,disposed=false,frames=0,lastTime=null,lastState={},currentMode='study',currentBackground='classroom',lastObjectStyles=[],drawMilliseconds=0;
  let particles=[],fragments=[],rings=[],captions=[],coinBursts=[],superBursts=[],comboBursts=[],comboCelebrations=0,worldStage=0,throwAnimations=0,players=[],activeThrows=[],poseRecords=new Map(),lastSimulationTime=null,trail=[],trailSeen=0,trailKey='',shake=0,stopRemaining=0,seed=673409;
  let wasGameplayScene=false,cameraOffset={x:0,y:0},effectsResets=0;
  const reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
  const caches=new Map(),random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  function resize(){const b=canvas.getBoundingClientRect?.(),w=Math.max(1,Math.round(canvas.clientWidth||b?.width||800)),h=Math.max(1,Math.round(canvas.clientHeight||b?.height||600)),ratio=Math.min(globalThis.devicePixelRatio||1,2);if(w!==width||h!==height||ratio!==dpr){width=w;height=h;dpr=ratio;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);caches.clear();}return{width,height};}
  function cloud(c,x,y,s,color='#fff9e9'){oval(c,x,y,s*.7,s*.23,color);oval(c,x-s*.3,y-s*.14,s*.3,s*.25,color);oval(c,x+s*.2,y-s*.18,s*.36,s*.3,color);}
  function plant(c,x,y,size){c.save();c.translate(x,y);c.scale(size/100,size/100);c.lineWidth=3;c.lineCap='round';line(c,[[0,0],[-2,-59]],'#50876c',4);for(const [px,py,a]of[[-17,-24,-.6],[15,-36,.55],[-14,-49,-.5],[5,-67,.1]])oval(c,px,py,12,23,'#7aaf76',null,a);polygon(c,[[-22,-5],[22,-5],[15,28],[-15,28]],'#d48868');rect(c,-24,-8,48,10,'#edb495',null,3);c.restore();}
  function book(c,x,y,w,h,color){rect(c,x,y,w,h,color,null,3);rect(c,x+3,y+3,w-6,h-6,'#fff0d2',null,2);rect(c,x,y,w,Math.max(3,h*.22),color,null,2);}
  function windowFrame(c,x,y,w,h,night=false){
    rect(c,x-7,y-7,w+14,h+14,night?'#786d9c':'#dfab79',null,12);rect(c,x,y,w,h,night?'#625c91':'#b8e4e5',null,7);
    c.save();rounded(c,x,y,w,h,6);c.clip();
    if(night){oval(c,x+w*.65,y+h*.27,h*.15,h*.15,'#f4df9c');oval(c,x+w*.72,y+h*.22,h*.14,h*.14,'#625c91');for(let i=0;i<8;i++)star(c,x+w*(.08+(i*.173)%.86),y+h*(.1+(i*.267)%.75),3,'#f8edc8');}
    else{oval(c,x+w*.73,y+h*.26,h*.13,h*.13,'#f8d274');cloud(c,x+w*.27,y+h*.25,w*.17);cloud(c,x+w*.72,y+h*.53,w*.17);oval(c,x+w*.35,y+h*1.12,w*.53,h*.45,'#a5c997');oval(c,x+w*.85,y+h*1.12,w*.54,h*.4,'#8fbc9a');}
    line(c,[[x+w*.5,y],[x+w*.5,y+h]],night?'#a29bc1':'#fff3d8',7);line(c,[[x,y+h*.54],[x+w,y+h*.54]],night?'#a29bc1':'#fff3d8',7);c.restore();rect(c,x-10,y+h,w+20,10,night?'#b1a1c6':'#f8d8ac',null,4);
  }
  function classroom(c){
    windowFrame(c,width*.065,height*.075,width*.31,height*.48);rect(c,width*.5,height*.11,width*.36,height*.32,'#c49c73',null,10);rect(c,width*.515,height*.13,width*.33,height*.27,'#6d9c89',null,7);
    for(let i=0;i<3;i++)line(c,[[width*(.55+i*.075),height*.2],[width*(.59+i*.075),height*.2]],'#dfebd3',2);c.font=`600 ${Math.max(14,Math.min(28,height*.044))}px system-ui,sans-serif`;c.fillStyle='#e8f2d8';c.textAlign='center';c.fillText('1 + 1 = 2',width*.675,height*.32,width*.27);star(c,width*.82,height*.17,Math.min(width,height)*.019,'#f1dc92');
    c.fillStyle='#dbb592';c.fillRect(0,height*.78,width,height*.22);line(c,[[0,height*.78],[width,height*.78]],'#c49d7c',4);rect(c,width*.02,height*.86,width*.96,height*.16,'#dca778',null,8);rect(c,width*.005,height*.85,width*.99,height*.055,'#ecc299',null,8);
    for(let i=0;i<3;i++)book(c,width*.04+i*2,height*.85-8-i*10,width*.12,11,['#7a9dbc','#e99d81','#94b994'][i]);const px=width*.74,py=height*.86;rect(c,px,py-height*.075,width*.09,height*.075,'#f5e7c9',null,8);line(c,[[px+width*.02,py-height*.074],[px+width*.012,py-height*.17]],'#e7b45c',5);line(c,[[px+width*.05,py-height*.074],[px+width*.062,py-height*.15]],'#8faabc',5);plant(c,width*.92,height*.85,Math.min(width*.13,height*.27));rect(c,width*.42,height*.51,width*.17,height*.1,'#efd7bb',null,6);rect(c,width*.455,height*.57,width*.07,height*.24,'#d4b297',null,5);
  }
  function gameRoom(c){
    windowFrame(c,width*.075,height*.09,width*.2,height*.34);rect(c,width*.38,height*.12,width*.4,height*.32,'#6d6591',null,13);rect(c,width*.396,height*.139,width*.368,height*.28,'#abc4c8',null,8);polygon(c,[[width*.4,height*.38],[width*.48,height*.23],[width*.56,height*.36],[width*.65,height*.2],[width*.75,height*.38]],'#83a6a8');rect(c,width*.48,height*.35,width*.18,height*.028,'#789a75',null,2);star(c,width*.7,height*.22,Math.min(width,height)*.032,'#ffe2a0');
    const u=Math.min(width,height)*.014;c.fillStyle='#fae1af';for(const[dx,dy]of[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2]])c.fillRect(width*.55+dx*u,height*.21+dy*u,u,u);rect(c,width*.52,height*.44,width*.12,height*.017,'#6d6591',null,3);rect(c,width*.46,height*.457,width*.24,height*.035,'#bd91a8',null,4);
    c.fillStyle='#d2ad9f';c.fillRect(0,height*.81,width,height*.19);line(c,[[0,height*.81],[width,height*.81]],'#b58f8c',4);rect(c,width*.105,height*.64,width*.68,height*.18,'#ad83ad',null,20);rect(c,width*.14,height*.58,width*.6,height*.17,'#c59bbd',null,18);rect(c,width*.12,height*.75,width*.65,height*.08,'#bb91b4',null,15);for(const x of[.13,.72])rect(c,width*x,height*.68,width*.065,height*.16,'#a878a7',null,12);rect(c,width*.2,height*.62,width*.12,height*.13,'#f1b89a',null,10);rect(c,width*.58,height*.63,width*.11,height*.12,'#8eb7b5',null,10);oval(c,width*.51,height*.9,width*.26,height*.065,'#edcea5');rect(c,width*.35,height*.84,width*.24,height*.055,'#b6bac8',null,10);rect(c,width*.365,height*.85,width*.13,height*.02,'#707c98',null,5);oval(c,width*.56,height*.863,3,3,'#f8dd9e');plant(c,width*.89,height*.79,Math.min(width*.14,height*.29));rect(c,width*.845,height*.12,width*.105,height*.25,'#ecd6c4',null,8);star(c,width*.897,height*.235,Math.min(width,height)*.052,'#e9967b');
  }
  function bedroom(c){
    windowFrame(c,width*.64,height*.055,width*.26,height*.4,true);for(const x of[.605,.915]){polygon(c,[[width*x,height*.045],[width*(x+.055),height*.045],[width*(x+.02),height*.47],[width*(x-.025),height*.47]],'#c89fb5');line(c,[[width*x,height*.28],[width*(x+.034),height*.28]],'#e2b7c8',4);}c.fillStyle='#9183a6';c.fillRect(0,height*.82,width,height*.18);line(c,[[0,height*.82],[width,height*.82]],'#7f739d',4);
    rect(c,width*.08,height*.5,width*.19,height*.29,'#c5a0ad',null,16);rect(c,width*.11,height*.63,width*.56,height*.17,'#c4b5cf',null,18);rect(c,width*.11,height*.7,width*.56,height*.14,'#a99cc5',null,14);rect(c,width*.145,height*.62,width*.17,height*.085,'#f6ddc9',null,14);rect(c,width*.36,height*.67,width*.26,height*.16,'#9ab3c9',null,14);for(let i=0;i<8;i++)star(c,width*(.38+(i%4)*.058),height*(.7+Math.floor(i/4)*.075),Math.min(width,height)*.013,'#e1e2d5');
    rect(c,width*.72,height*.75,width*.12,height*.14,'#b998ad',null,8);rect(c,width*.715,height*.74,width*.13,height*.03,'#dfbbbd',null,5);line(c,[[width*.779,height*.74],[width*.779,height*.57]],'#cfbaad',4);polygon(c,[[width*.72,height*.6],[width*.742,height*.48],[width*.816,height*.48],[width*.84,height*.6]],'#f3d2ab');c.save();c.translate(width*.26,height*.69);const scale=Math.min(width*.1,height*.19)/100;c.scale(scale,scale);illustration(c,'teddy','#d9ad84',{});c.restore();for(let i=0;i<6;i++)star(c,width*(.08+i*.079),height*(.11+(i%2)*.09),4,'#d9cbe6');oval(c,width*.88,height*.935,width*.09,height*.034,'#b8a4c1');
  }
  function dojo(c){
    c.fillStyle='#f2c19b';c.fillRect(0,height*.77,width,height*.23);line(c,[[0,height*.77],[width,height*.77]],'#c89675',4);for(let i=0;i<4;i++)cloud(c,width*(.11+i*.23),height*(.13+(i%2)*.08),width*.055,'#fff8df');polygon(c,[[width*.53,height*.5],[width*.7,height*.23],[width*.86,height*.51]],'#d3c49b');polygon(c,[[width*.68,height*.55],[width*.9,height*.25],[width*1.13,height*.56]],'#b7b897');rect(c,width*.63,height*.43,width*.34,height*.35,'#ead0a6',null,8);polygon(c,[[width*.57,height*.45],[width*.8,height*.27],[width*1.02,height*.45]],'#b78272');polygon(c,[[width*.6,height*.44],[width*.8,height*.31],[width*.99,height*.44]],'#d29a7d');for(const x of[.64,.92])rect(c,width*x,height*.46,width*.03,height*.32,'#c18e75',null,3);rect(c,width*.73,height*.47,width*.14,height*.26,'#f7e8ca',null,4);line(c,[[width*.8,height*.47],[width*.8,height*.73]],'#d6b896',2);line(c,[[width*.91,height*.02],[width*.97,height*.26],[width*.85,height*.21]],'#b38671',7);for(let i=0;i<10;i++){oval(c,width*(.85+(i*.027)%.16),height*(.09+(i*.039)%.2),8,5,'#e7a7a1',null,i*.6);}plant(c,width*.94,height*.81,Math.min(width*.12,height*.22));
  }
  function flower(c,x,y,size,color){
    line(c,[[x,y+size],[x,y-size*.4]],'#789f70',Math.max(2,size*.12));for(let i=0;i<5;i++){const a=i*TAU/5;oval(c,x+Math.cos(a)*size*.42,y+Math.sin(a)*size*.42,size*.31,size*.31,color);}oval(c,x,y,size*.23,size*.23,'#f8d174');
  }
  function paperGarden(c){
    c.fillStyle='#dcebe5';c.fillRect(0,0,width,height);cloud(c,width*.24,height*.15,width*.11);cloud(c,width*.72,height*.1,width*.08);oval(c,width*.83,height*.2,Math.min(width,height)*.07,Math.min(width,height)*.07,'#f8d486');
    oval(c,width*.28,height*.77,width*.8,height*.43,'#b9cfa4');oval(c,width*.86,height*.77,width*.56,height*.38,'#a4c49c');c.fillStyle='#c4d8aa';c.fillRect(0,height*.68,width,height*.32);
    polygon(c,[[width*.42,height*.57],[width*.55,height*.57],[width*.81,height],[width*.31,height]],'#edcf9f');for(let i=0;i<7;i++)oval(c,width*(.49+i*.017),height*(.62+i*.055),width*(.018+i*.005),height*.012,'#dbb88f');
    for(const [x,y,s]of[[.08,.42,.2],[.94,.38,.24]]){line(c,[[width*x,height*(y+.22)],[width*x,height*(y-.05)]],'#ae8d6f',width*.027);oval(c,width*x,height*y,width*s*.52,height*.16,'#a9c296');oval(c,width*(x-.045),height*(y-.07),width*s*.39,height*.13,'#bed1aa');for(let i=0;i<7;i++)flower(c,width*(x-.06+i*.02),height*(y-.1+(i%3)*.035),Math.min(width,height)*.013,'#edb8b1');}
    c.save();c.translate(width*.24,height*.81);c.rotate(-.1);rect(c,-width*.13,-height*.055,width*.26,height*.11,'#f1b9a7',null,7);for(let i=0;i<6;i++)line(c,[[-width*.115+i*width*.045,-height*.047],[-width*.115+i*width*.045,height*.047]],'#f7dfc6',2);book(c,-width*.075,-height*.043,width*.09,height*.045,'#7ba4b5');book(c,-width*.017,-height*.017,width*.11,height*.04,'#dca36d');c.restore();
    for(let i=0;i<14;i++)flower(c,width*(.035+(i*.179)%.94),height*(.8+(i%3)*.065),Math.min(width,height)*(.014+(i%3)*.003),['#e6a49e','#f4d596','#c0afcf'][i%3]);
  }
  function pixelPalm(c,x,y,size){
    const unit=size/12;c.fillStyle='#be9777';for(let i=0;i<9;i++)c.fillRect(x+(i>4?unit*.6:0),y-i*unit,unit*1.3,unit*1.1);for(let side of[-1,1])for(let i=0;i<5;i++){c.fillStyle=i%2?'#75a68b':'#92bb8e';c.fillRect(x+side*i*unit*1.4,y-unit*(9-i*.65),unit*2,unit*1.25);c.fillRect(x+side*i*unit*1.05,y-unit*(9+i*.27),unit*1.7,unit*1.15);}oval(c,x+unit*.7,y-unit*8,unit*.75,unit*.7,'#d6ae7e');
  }
  function pixelCove(c){
    const sky=c.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#d8e8e6');sky.addColorStop(1,'#f8dbb1');c.fillStyle=sky;c.fillRect(0,0,width,height);oval(c,width*.22,height*.17,height*.07,height*.07,'#ffda91');cloud(c,width*.53,height*.13,width*.09);cloud(c,width*.87,height*.23,width*.08);
    c.fillStyle='#8fc7c4';c.fillRect(0,height*.44,width,height*.33);for(let i=0;i<5;i++){line(c,[[0,height*(.48+i*.052)],[width,height*(.48+i*.052)]],i%2?'#b7ddcc':'#a5d5cb',height*.012);}polygon(c,[[width*.04,height*.47],[width*.18,height*.33],[width*.29,height*.47]],'#afbf9e');c.fillStyle='#efd1a0';c.fillRect(0,height*.76,width,height*.24);oval(c,width*.52,height*.77,width*.68,height*.045,'#f7dfb6');
    pixelPalm(c,width*.08,height*.77,Math.min(width,height)*.43);pixelPalm(c,width*.87,height*.75,Math.min(width,height)*.37);
    rect(c,width*.47,height*.45,width*.28,height*.26,'#e6b58c',null,8);for(const x of[.48,.71])rect(c,width*x,height*.38,width*.025,height*.39,'#bc9477',null,3);polygon(c,[[width*.43,height*.43],[width*.57,height*.29],[width*.79,height*.43]],'#dba2a8');polygon(c,[[width*.57,height*.29],[width*.57,height*.43],[width*.79,height*.43]],'#eed3ad');rect(c,width*.53,height*.48,width*.16,height*.13,'#6f7a93',null,5);rect(c,width*.542,height*.49,width*.136,height*.095,'#9dcbbe',null,3);const u=width*.011;c.fillStyle='#e7c775';for(const [px,py]of[[0,0],[2,0],[1,1],[0,2],[2,2]])c.fillRect(width*.59+px*u,height*.51+py*u,u,u);rect(c,width*.5,height*.63,width*.23,height*.028,'#c48e77',null,3);
    oval(c,width*.44,height*.87,width*.17,height*.053,'#cbafa7');c.save();c.translate(width*.43,height*.85);c.scale(Math.min(width,height)*.0011,Math.min(width,height)*.0011);illustration(c,'controller','#aa95c8',{});c.restore();for(let i=0;i<7;i++)star(c,width*(.2+i*.11),height*(.95-(i%2)*.015),3,'#d5af84',4,i);
  }
  function moonIsles(c){
    const sky=c.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#a79bc4');sky.addColorStop(1,'#d0bdd0');c.fillStyle=sky;c.fillRect(0,0,width,height);oval(c,width*.78,height*.17,height*.095,height*.095,'#f6d997');oval(c,width*.815,height*.14,height*.087,height*.087,'#a99dc5');
    for(let i=0;i<11;i++){const x=width*(.055+i*.089),y=height*(.07+(i%3)*.055);line(c,[[x,0],[x,y]],'#cfc0d7',1);star(c,x,y,Math.min(width,height)*(.012+(i%3)*.003),'#f5e1b3',5,i*.3);}
    for(const [x,y,s]of[[.16,.42,.21],[.81,.53,.21],[.48,.84,.35]]){cloud(c,width*x,height*y,width*s,'#e9dce0');oval(c,width*x,height*(y-.02),width*s*.72,height*.035,'#c3c1ce');polygon(c,[[width*(x-s*.42),height*(y+.015)],[width*(x+s*.37),height*(y+.015)],[width*(x+s*.12),height*(y+.18)],[width*(x-s*.18),height*(y+.135)]],'#b4a4c2');cloud(c,width*x,height*(y+.035),width*s*.8,'#e6d9df');}
    const ax=width*.22,bx=width*.65,y=height*.62;line(c,[[ax,y+height*.15],[ax,y-height*.14]],'#ae8a98',5);line(c,[[bx,y+height*.15],[bx,y-height*.13]],'#ae8a98',5);c.beginPath();c.moveTo(ax,y-height*.1);c.quadraticCurveTo(width*.43,y+height*.24,bx,y-height*.1);c.quadraticCurveTo(width*.42,y+height*.14,ax,y-height*.1);c.fillStyle='#d6b6bd';c.fill();c.strokeStyle='#a889a4';c.lineWidth=2;c.stroke();c.save();c.translate(width*.44,y+height*.065);c.scale(Math.min(width,height)*.001,Math.min(width,height)*.001);c.rotate(.14);illustration(c,'teddy','#dfb78c',{});c.restore();for(let i=0;i<5;i++)cloud(c,width*(.08+i*.24),height*(.95+(i%2)*.025),width*.08,'#e8dbe0');
  }
  function ninja(time,state={},actor=null,pose=null){
    const id=playerSkin(typeof state.skin==='string'?state.skin:state.skin?.id),palette=PLAYER_PALETTES[id],arena=Boolean(actor);
    const celebration=arena?comboBursts.at(-1):null,celebrate=celebration?(reducedMotion?.65:Math.sin(clamp((1-celebration.life/celebration.total)*1.6,0,1)*Math.PI)):0;
    if(reducedMotion)time=0;
    const scale=arena?actor.scale:state.shopPreview?Math.min(width*.78,height*.86)/310:Math.min(width*.33,height*.72)/310,x=arena?actor.x:state.shopPreview?width*.5:width<600?width*.83:width*.79,y=arena?actor.y:state.shopPreview?height*.94:height*.81;
    ctx.save();ctx.translate(x,y+(arena?pose.crouch*scale:0));ctx.scale(scale*(arena?actor.facing:1),scale);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=5;
    if(celebration){
      ctx.save();ctx.globalAlpha=.12+celebrate*.18;const aura=celebration.milestone===50?GOLD:celebration.milestone===25?'#84bdb3':CORAL;
      for(let i=0;i<(celebration.milestone===50?8:5);i++){const angle=i*TAU/(celebration.milestone===50?8:5)+(reducedMotion?0:time*.35),rx=85+celebrate*18,ry=116+celebrate*12;star(ctx,Math.cos(angle)*rx,-157+Math.sin(angle)*ry,9+celebrate*5,aura,4,angle);}ctx.restore();
    }
    oval(ctx,0,12,70,13,rgba('#916f70',.18));
    polygon(ctx,[[-28,-104],[-54,-14],[-23,-5],[-5,-65],[12,-6],[43,-11],[27,-105]],palette.dark,INK);rect(ctx,-57,-20,43,23,'#ca8b5f',INK,9);rect(ctx,12,-19,43,23,'#ca8b5f',INK,9);
    oval(ctx,-2,-130,51,62,palette.body,INK);polygon(ctx,[[-48,-158],[-13,-100],[45,-157],[24,-171],[-4,-128],[-30,-176]],palette.light);rect(ctx,-47,-112,91,15,'#e9b15c',INK,5);rect(ctx,-9,-114,19,19,'#ffe3a0',INK,3);
    // The support arm opens during the wind-up; the other glove is the shared physical launch point.
    // Only the free arm celebrates. The throwing glove remains at the shared physical hand point.
    const lift=(arena&&pose.phase!=='idle'?Math.sin(pose.progress*Math.PI)*12:0)+celebrate*(celebration?.milestone===50?86:celebration?.milestone===25?68:47);
    line(ctx,[[-37,-155],[-72-lift,-114-lift],[-61-lift,-85-lift]],INK,24);line(ctx,[[-37,-155],[-72-lift,-114-lift],[-61-lift,-85-lift]],palette.arm,17);oval(ctx,-57-lift,-85-lift,15,15,palette.light,INK);
    if(arena){
      const hand=pose.hand,elbow=pose.elbow;
      line(ctx,[[35,-157],[elbow.x,elbow.y],[hand.x,hand.y]],INK,24);line(ctx,[[35,-157],[elbow.x,elbow.y],[hand.x,hand.y]],palette.arm,17);oval(ctx,hand.x,hand.y,15,15,palette.light,INK);
    }else{
      line(ctx,[[35,-157],[70,-182],[83,-216]],INK,24);line(ctx,[[35,-157],[70,-182],[83,-216]],palette.arm,17);oval(ctx,83,-216,15,15,palette.light,INK);line(ctx,[[87,-226],[128,-276]],INK,12);line(ctx,[[87,-226],[128,-276]],'#ffebbd',7);line(ctx,[[74,-231],[97,-212]],INK,9);line(ctx,[[74,-231],[97,-212]],'#d6ac71',5);
    }
    oval(ctx,0,-216,58,60,palette.hood,INK);oval(ctx,0,-213,42,35,'#ffd8a9');rect(ctx,-52,-253,104,18,palette.scarf,INK,5);oval(ctx,55,-245,10,10,'#e48b69',INK);
    ctx.fillStyle=palette.scarf;ctx.beginPath();ctx.moveTo(-20,-178);ctx.bezierCurveTo(-70,-206,-102,-167+Math.sin(time*1.7)*(9+celebrate*19),-151-celebrate*15,-185-celebrate*8);ctx.lineTo(-122,-157);ctx.bezierCurveTo(-87,-148,-41,-176,-4,-162);ctx.closePath();ctx.fill();
    for(const ex of[-18,18]){oval(ctx,ex,-215,11,13,'#fffcf4');if(celebration?.milestone===50)star(ctx,ex,-214,8,'#b88638',4,Math.PI/4);else if(celebrate>.2)line(ctx,[[ex-6,-211],[ex,-217],[ex+6,-211]],'#4b465e',3);else{oval(ctx,ex+2,-213,5,7,'#4b465e');oval(ctx,ex+3,-217,2,2,'#ffffff');}}
    polygon(ctx,[[-42,-205],[42,-205],[29,-178],[-29,-178]],palette.body);line(ctx,[[-14,-193],[0,-189],[14,-193]],'#d4dfd6',2.5);line(ctx,[[-27,-232],[-11,-235]],INK,3);line(ctx,[[11,-235],[27,-232]],INK,3);
    if(id==='solar'){polygon(ctx,[[-37,-264],[-34,-288],[-16,-277],[0,-307],[12,-278],[31,-294],[37,-263]],'#f0aa50',INK);polygon(ctx,[[-15,-270],[0,-293],[13,-269]],'#ffe49b');}
    else if(id==='mint'){polygon(ctx,[[-36,-263],[-34,-289],[-15,-277],[0,-304],[14,-278],[34,-290],[36,-262]],'#c8eef1',INK);polygon(ctx,[[-1,-300],[-6,-266],[14,-278]],'#91c6de');}
    else if(id==='neon'){star(ctx,0,-277,24,'#c7a4dd',5,-Math.PI/2);star(ctx,0,-278,14,'#f0cae0');}
    else if(id==='dawn'){ctx.save();ctx.strokeStyle='#f2c374';ctx.lineWidth=5;for(let i=0;i<5;i++){const angle=Math.PI+i*Math.PI/4;line(ctx,[[Math.cos(angle)*32,-260+Math.sin(angle)*32],[Math.cos(angle)*47,-260+Math.sin(angle)*47]],'#f2c374',5);}ctx.restore();ctx.beginPath();ctx.arc(0,-259,33,Math.PI,TAU);ctx.fillStyle='#efb65e';ctx.fill();line(ctx,[[-36,-258],[36,-258]],'#ffe4a6',7);}
    else if(id==='shadow'){polygon(ctx,[[0,-305],[13,-281],[36,-284],[23,-265],[0,-255],[-23,-265],[-36,-284],[-13,-281]],'#7dc3b8',INK);polygon(ctx,[[0,-292],[6,-275],[19,-274],[0,-263],[-19,-274],[-6,-275]],'#d6e8d3');}
    else if(id==='grandmaster'){polygon(ctx,[[-38,-261],[-32,-291],[-12,-278],[0,-310],[13,-278],[32,-291],[38,-261]],'#ebc05f',INK);polygon(ctx,[[-16,-267],[0,-294],[16,-267]],'#fff4ca');oval(ctx,0,-274,6,6,'#cf7860',INK);}
    else{star(ctx,0,-248,16,'#e3dfbe',4,Math.PI/4);oval(ctx,0,-248,4,4,palette.dark);polygon(ctx,[[-53,-247],[-74,-259],[-68,-240],[-82,-230],[-54,-232]],palette.scarf,INK);}
    // The elbow winds behind the hood; the glove stays in front to hold the one real object.
    if(arena)oval(ctx,pose.hand.x,pose.hand.y,15,15,palette.light,INK);
    if(id==='solar'){polygon(ctx,[[-76,-116],[-86,-137],[-79,-133],[-79,-147],[-65,-129],[-66,-114]],'#ffda7b');}
    else if(id==='mint'){polygon(ctx,[[61,-169],[69,-183],[77,-169],[69,-155]],'#d7f7fa',palette.hood);}
    else if(id==='neon'){for(const [sx,sy,r]of[[-77,-232,10],[66,-115,8],[114,-181,6]])star(ctx,sx,sy,r,'#f0c5e6',4,time*.2);}
    else if(id==='dawn'){line(ctx,[[-39,-144],[-19,-127],[4,-146]],'#f9d697',4);star(ctx,-65,-124,8,'#f5cf8c',4,time*.2);}
    else if(id==='shadow'){polygon(ctx,[[-45,-161],[-65,-182],[-64,-157],[-83,-166],[-66,-142]],'#a6d6c9',palette.hood);line(ctx,[[-40,-123],[-21,-135],[-12,-123]],palette.scarf,3);}
    else if(id==='grandmaster'){for(const side of[-1,1])polygon(ctx,[[side*36,-157],[side*57,-164],[side*61,-145],[side*39,-135]],'#e5bd65',INK);star(ctx,0,-138,10,'#dba647',4,Math.PI/4);}
    ctx.restore();
  }
  function rememberThrow(object){
    if(!object?.launch||!Number.isInteger(object.launch.throwerIndex)||typeof object.id!=='string')return;
    const existing=poseRecords.get(object.id);
    if(!existing)poseRecords.set(object.id,{id:object.id,launch:{...object.launch},age:finite(object.age)});
    else {existing.age=finite(object.age,existing.age);existing.launch={...object.launch};}
    if(poseRecords.size>18)poseRecords.delete(poseRecords.keys().next().value);
  }
  function prepareSquad(state){
    players=[];activeThrows=[];
    const clock=finite(state.elapsed),elapsedDelta=lastSimulationTime===null?0:clamp(clock-lastSimulationTime,0,.1);lastSimulationTime=clock;
    if(state.scene!=='playing'||state.isHome||state.started===false){poseRecords.clear();return;}
    const slow=finite(state.effects?.slow)>0||finite(state.effects?.flow)>0?.5:1;
    for(const record of poseRecords.values())if(!state.paused)record.age+=elapsedDelta*slow;
    for(const object of Array.isArray(state.objects)?state.objects:[])if(object.launch)rememberThrow(object);
    for(const [id,record]of poseRecords){if(record.age>record.launch.windup+THROW_RECOVERY+.02)poseRecords.delete(id);}
    const skin=playerSkin(typeof state.skin==='string'?state.skin:state.skin?.id),actors=getThrowerLayout(width,height,state.difficulty);
    for(const actor of actors){
      const candidates=[...poseRecords.values()].filter(record=>record.launch.throwerIndex===actor.index&&record.age<record.launch.windup+THROW_RECOVERY);
      candidates.sort((a,b)=>a.age-b.age);const record=candidates[0],pose=getThrowerPose(actor,record?record.age:Infinity,record?.launch.windup);
      players.push({actor,pose,skin,objectId:record?.id||null});
    }
    activeThrows=(Array.isArray(state.objects)?state.objects:[]).filter(object=>object.launch&&!object.cut&&!object.removed).map(object=>({id:object.id,throwerIndex:object.launch.throwerIndex,age:object.age,phase:getThrowerPose(actors[object.launch.throwerIndex]||actors[0],object.age,object.launch.windup).phase,ready:isThrowReady(object),scale:getThrowScale(object),x:object.x,y:object.y}));
  }
  function drawSquad(state){
    const time=finite(state.elapsed);
    for(const player of players){
      ninja(time,state,player.actor,player.pose);
      if(player.pose.phase==='release'){
        const record=poseRecords.get(player.objectId);if(!record)continue;
        const before=getThrowerPose(player.actor,Math.max(record.launch.windup,record.age-.07),record.launch.windup),p=PLAYER_PALETTES[player.skin];
        ctx.save();ctx.globalAlpha=.55*(1-player.pose.progress);ctx.strokeStyle=p.light;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(before.handX,before.handY);ctx.quadraticCurveTo(player.pose.handX+player.actor.facing*14,player.pose.handY-8,player.pose.handX,player.pose.handY);ctx.stroke();ctx.restore();
        // Rank flourishes trace the real release, rather than launching decorative object copies.
        const strength=1-player.pose.progress,x=player.pose.handX,y=player.pose.handY,side=player.actor.facing,unit=clamp(player.actor.scale, .25,.72);
        ctx.save();ctx.globalAlpha=.72*strength;ctx.lineWidth=2;
        if(player.skin==='dawn')for(let i=0;i<3;i++){ctx.beginPath();ctx.strokeStyle=i%2?'#edb16d':'#ffe1a4';ctx.arc(x-side*9,y+4,unit*(23+i*13),-Math.PI*.92,-Math.PI*.25);ctx.stroke();}
        else if(player.skin==='shadow')for(let i=0;i<3;i++){const px=x-side*(9+i*15)*unit,py=y+(10+i*12)*unit;polygon(ctx,[[px-6*unit,py],[px+side*5*unit,py-17*unit],[px+8*unit,py+7*unit],[px,py+15*unit]],i%2?'#a6d6c9':'#66718f');}
        else if(player.skin==='grandmaster')for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(x,y,unit*(22+i*17),unit*(8+i*6),-.4,0,TAU);ctx.strokeStyle=i?'#e0b354':'#fff2bf';ctx.stroke();star(ctx,x+side*(20+i*15)*unit,y-(9+i*9)*unit,5*unit,'#f6d987',4);}
        ctx.restore();
      }
    }
  }
  function drawWorldAmbience(state,time,scene){
    const elapsed=state.scene==='playing'&&!state.isHome?Math.max(0,finite(state.elapsed)):0;
    worldStage=elapsed>=180?4:elapsed>=120?3:elapsed>=60?2:elapsed>=30?1:0;
    if(!worldStage)return;
    const cloudAmount=clamp((elapsed-30)/12,0,1),templeAmount=clamp((elapsed-60)/16,0,1),glowAmount=clamp((elapsed-120)/20,0,1),petalAmount=clamp((elapsed-180)/15,0,1),t=reducedMotion?0:elapsed;
    const windowBounds=scene==='classroom'?[.065,.075,.31,.48]:scene==='game-room'?[.075,.09,.2,.34]:scene==='bedroom'?[.64,.055,.26,.4]:null;
    const bounds=windowBounds||[.08,.07,.84,.46],wx=width*bounds[0],wy=height*bounds[1],ww=width*bounds[2],wh=height*bounds[3],night=currentMode==='sleep';
    ctx.save();rounded(ctx,wx+2,wy+2,ww-4,wh-4,5);ctx.clip();
    if(cloudAmount){ctx.globalAlpha=cloudAmount*(night?.32:.68);for(let i=0;i<3;i++){const cx=wx+((i*.39+t*.006)%1.35-.18)*ww,cy=wy+wh*(.18+(i%2)*.2);cloud(ctx,cx,cy,ww*(.18+(i%2)*.035),night?'#bfc1da':'#fff9e9');}}
    if(templeAmount){
      const tx=wx+ww*.66,base=wy+wh*.97,tw=ww*.47,th=Math.min(wh*.6,tw*.75),rise=(1-templeAmount)*th*.4;
      ctx.globalAlpha=templeAmount*(windowBounds?.82:.5);ctx.save();ctx.translate(tx,base+rise);
      const walls=night?'#8986ab':'#a3b9a2',roof=night?'#686991':'#7e9a91';
      rect(ctx,-tw*.31,-th*.62,tw*.62,th*.63,walls,null,2);rect(ctx,-tw*.22,-th,tw*.44,th*.45,walls,null,2);
      for(const [roofY,roofW]of[[-th*.58,tw],[-th*.98,tw*.72]])polygon(ctx,[[-roofW*.53,roofY+th*.04],[-roofW*.39,roofY-th*.02],[0,roofY-th*.28],[roofW*.39,roofY-th*.02],[roofW*.53,roofY+th*.04]],roof);
      line(ctx,[[0,-th*1.27],[0,-th*1.43]],roof,2);oval(ctx,0,-th*1.47,2,2,roof);
      const lampColor=glowAmount?'#ffe6a0':night?'#b8b3cc':'#d5dfbf';for(const lx of[-.18,0,.18])rect(ctx,tw*lx-tw*.04,-th*.37,tw*.08,th*.18,lampColor,null,1);
      if(glowAmount){ctx.globalAlpha=glowAmount*.3;const halo=ctx.createRadialGradient(0,-th*.32,0,0,-th*.32,tw*.65);halo.addColorStop(0,'#ffe4a3');halo.addColorStop(1,rgba('#ffe4a3',0));ctx.fillStyle=halo;ctx.fillRect(-tw*.7,-th*1.2,tw*1.4,th*1.4);}
      ctx.restore();
    }
    if(glowAmount){ctx.globalAlpha=glowAmount*.14;polygon(ctx,[[wx+ww*.7,wy],[wx+ww,wy],[wx+ww*.4,wy+wh],[wx,wy+wh]],'#ffe5ac');}
    ctx.restore();
    // Window bars and the room silhouette remain in front of the new view.
    if(windowBounds){ctx.save();ctx.globalAlpha=1;line(ctx,[[wx+ww*.5,wy],[wx+ww*.5,wy+wh]],night?'#a29bc1':'#fff3d8',7);line(ctx,[[wx,wy+wh*.54],[wx+ww,wy+wh*.54]],night?'#a29bc1':'#fff3d8',7);ctx.restore();}
    if(glowAmount){ctx.save();ctx.globalAlpha=glowAmount*.08;ctx.fillStyle=night?'#f5d1a3':'#f1c87d';ctx.fillRect(0,0,width,height);ctx.restore();}
    // Late-run petals stay at the edges, outside the principal swipe lanes.
    if(petalAmount){ctx.save();ctx.globalAlpha=petalAmount*.58;for(let i=0;i<10;i++){const side=i%2?-1:1,px=side>0?width*(.012+(i%3)*.012):width*(.988-(i%3)*.012),py=height*((i*.127+t*.018)%1);oval(ctx,px+(reducedMotion?0:Math.sin(t*.6+i)*4),py,4.5,2.3,i%3?'#edbcaf':'#efcf8f',null,reducedMotion?i:time*.5+i);}ctx.restore();}
  }
  function background(state,time){
    const home=state.isHome||state.scene==='home'||state.phase==='home',mode=home?'home':modeOf(state),theme=THEMES[mode],defaults={study:'classroom',gaming:'game-room',sleep:'bedroom',home:'dojo'},allowed={study:['classroom','paper-garden'],gaming:['game-room','pixel-cove'],sleep:['bedroom','moon-isles']},requested=state.backgrounds?.[mode],scene=home?'dojo':allowed[mode]?.includes(requested)?requested:defaults[mode],cacheKey=`${mode}:${scene}`;currentMode=mode;currentBackground=scene;let image=caches.get(cacheKey);if(!image){image=document.createElement('canvas');image.width=width;image.height=height;const c=image.getContext('2d'),wall=c.createLinearGradient(0,0,0,height);wall.addColorStop(0,theme.wall);wall.addColorStop(1,theme.bottom);c.fillStyle=wall;c.fillRect(0,0,width,height);c.lineJoin='round';c.lineCap='round';if(mode==='home')dojo(c);else if(scene==='paper-garden')paperGarden(c);else if(scene==='pixel-cove')pixelCove(c);else if(scene==='moon-isles')moonIsles(c);else if(mode==='study')classroom(c);else if(mode==='gaming')gameRoom(c);else bedroom(c);caches.set(cacheKey,image);}ctx.drawImage(image,0,0,width,height);
    drawWorldAmbience(state,time,scene);
    ctx.save();ctx.globalAlpha=mode==='sleep'?.18:.13;for(let i=0;i<15;i++){const ambientTime=reducedMotion?0:time,x=((i*.183*width+Math.sin(ambientTime*.27+i)*13)%width+width)%width,y=(i*.263*height-ambientTime*(mode==='sleep'?2:4))%height;oval(ctx,x,y<0?y+height:y,1.8,1.8,mode==='sleep'?'#fff2c4':'#ffffff');}ctx.restore();
    drawBonusAccents(state,time);if(finite(state.effects?.flow)>0||state.flow||finite(state.flowRemaining)>0){ctx.save();ctx.strokeStyle=rgba(GOLD,.32);ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.beginPath();for(let x=0;x<=width;x+=30){const y=height*(.25+i*.27)+Math.sin(x/width*TAU+time*.75+i)*height*.025;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}ctx.restore();}if(finite(state.effects?.shield)>0){ctx.strokeStyle=rgba(GREEN,.28);ctx.lineWidth=5;rounded(ctx,7,7,width-14,height-14,16);ctx.stroke();}if(finite(state.overload)>50){ctx.fillStyle=rgba(CORAL,(state.overload-50)/800);ctx.fillRect(0,0,width,10);ctx.fillRect(0,height-10,width,10);}if(home)ninja(time,state);else drawSquad(state);
  }
  function miniIcon(c,type,x,y,size,color=INK){c.save();c.translate(x,y);c.scale(size/24,size/24);c.lineWidth=2.5;c.lineCap='round';c.lineJoin='round';if(type==='shield'){polygon(c,[[0,-10],[9,-6],[7,4],[0,11],[-7,4],[-9,-6]],color);line(c,[[-4,0],[-1,3],[5,-4]],'#ffffff',2);}else if(type==='scissors'){oval(c,-5,5,3,3,color);oval(c,5,5,3,3,color);line(c,[[-5,5],[7,-10]],color,2.5);line(c,[[5,5],[-7,-10]],color,2.5);}else if(type==='clock'){oval(c,0,0,10,10,'#ffefc3',color);line(c,[[0,-6],[0,0],[5,3]],color,2.5);}else if(type==='star')star(c,0,0,11,color);else if(type==='flame'||type==='🔥')polygon(c,[[0,-11],[8,0],[6,9],[-6,9],[-9,1],[-3,-6],[-2,0]],color);else if(type==='video'||type==='▶')polygon(c,[[-6,-8],[9,0],[-6,8]],color);else if(type==='alert'||type==='!'||type==='△'){polygon(c,[[0,-11],[11,9],[-11,9]],'#ffcf7e',color);line(c,[[0,-4],[0,2]],color,2.5);oval(c,0,6,1.2,1.2,color);}else{rect(c,-10,-8,20,16,color,null,4);for(const x of[-5,0,5])oval(c,x,0,1.3,1.3,'#ffffff');}c.restore();}
  function illustration(c,visual,color,object){
    c.lineWidth=3;c.lineJoin='round';c.lineCap='round';
    if(visual==='notebook'||visual==='book'){polygon(c,[[-32,-35],[31,-38],[36,23],[-28,28]],'#fff2d0',INK);polygon(c,[[-34,-38],[26,-42],[32,20],[-30,24]],'#76a9c4',INK);rect(c,-20,-26,38,27,'#e6f0e4',INK,5);star(c,-1,-12,9,'#e7b869');for(let i=0;i<5;i++)oval(c,-32,-26+i*10,5,3,'#f3d9ae',INK);line(c,[[-15,7],[18,4]],'#3b6f90',2);}
    else if(visual==='pencil'||visual==='tool'){c.save();c.rotate(-.46);rect(c,-8,-43,16,60,'#f3c25b',INK,3);rect(c,-8,-43,16,13,'#f49e9a',INK,3);rect(c,-8,-31,16,6,'#eee0c4',INK,2);polygon(c,[[-8,17],[8,17],[0,37]],'#f0d4a8',INK);polygon(c,[[-3,29],[3,29],[0,37]],INK);line(c,[[-2,-22],[-2,16]],'#fbe2a0',2);c.restore();c.save();c.rotate(.3);rect(c,8,-22,17,54,'#9cc7c6',INK,4);for(let i=0;i<6;i++)line(c,[[9,-15+i*8],[17,-15+i*8]],'#57787c',1.5);c.restore();}
    else if(visual==='assignment'){polygon(c,[[-28,-37],[23,-37],[34,-26],[34,25],[-28,25]],'#fff8df',INK);polygon(c,[[23,-37],[23,-26],[34,-26]],'#e9d8b6',INK);rect(c,-13,-44,27,12,CORAL,INK,4);for(let i=0;i<3;i++){line(c,[[-10,-14+i*12],[21,-14+i*12]],'#b6bdb9',2);line(c,[[-21,-14+i*12],[-18,-11+i*12],[-14,-18+i*12]],GREEN,2.5);}}
    else if(visual==='controller'||visual==='game'){c.beginPath();c.moveTo(-22,-23);c.bezierCurveTo(-44,-25,-50,25,-35,27);c.quadraticCurveTo(-25,27,-17,12);c.lineTo(17,12);c.quadraticCurveTo(25,27,35,27);c.bezierCurveTo(50,25,44,-25,22,-23);c.closePath();c.fillStyle='#aa95c8';c.fill();c.strokeStyle=INK;c.stroke();line(c,[[-28,-8],[-28,7]],INK,5);line(c,[[-36,-1],[-21,-1]],INK,5);oval(c,23,-7,4,4,CORAL,INK);oval(c,33,3,4,4,'#f2cc77',INK);oval(c,-7,4,5,5,'#766a95',INK);oval(c,7,4,5,5,'#766a95',INK);}
    else if(visual==='gameclip'){polygon(c,[[-31,-33],[31,-33],[31,21],[-31,21]],'#dba875',INK);rect(c,-24,-23,48,30,'#b9d2c3',INK,4);miniIcon(c,'video',0,-8,19,'#678d8d');rect(c,-18,13,36,11,'#8e76aa',INK,2);for(let i=0;i<4;i++)rect(c,-12+i*7,15,4,8,'#f5deab',null,0);}
    else if(visual==='loot'){rect(c,-34,-11,68,36,'#bf8557',INK,5);c.beginPath();c.moveTo(-34,-10);c.quadraticCurveTo(-35,-39,0,-39);c.quadraticCurveTo(35,-39,34,-10);c.closePath();c.fillStyle='#dea05f';c.fill();c.strokeStyle=INK;c.stroke();line(c,[[-31,-9],[31,-9]],INK,3);rect(c,-24,-33,8,57,'#f8cc68',INK,2);rect(c,16,-33,8,57,'#f8cc68',INK,2);rect(c,-7,-6,14,17,'#ffdf7e',INK,4);oval(c,0,1,2,3,INK);star(c,31,-37,7,'#ffe8a8');}
    else if(visual==='energy'||visual==='drop'){polygon(c,[[-24,-26],[23,-26],[16,27],[-17,27]],'#a6cfb7',INK);rect(c,-27,-31,54,8,'#e9f0d0',INK,4);line(c,[[9,-29],[15,-44],[31,-44]],'#dc986d',4);oval(c,0,1,17,17,'#fff1c4',INK);star(c,0,1,11,'#e5ae4b');}
    else if(visual==='pillow'||visual==='soft'){c.beginPath();c.moveTo(-35,-26);c.quadraticCurveTo(-4,-32,34,-25);c.quadraticCurveTo(26,0,36,23);c.quadraticCurveTo(0,31,-35,24);c.quadraticCurveTo(-27,0,-35,-26);c.closePath();c.fillStyle='#b3ccd0';c.fill();c.strokeStyle=INK;c.stroke();line(c,[[-27,-18],[24,-18]],'#e4ece0',2);line(c,[[-14,0],[-8,3],[-2,0]],'#708c9a',2);line(c,[[9,0],[15,3],[21,0]],'#708c9a',2);oval(c,3,12,3,2,'#7b93a0');}
    else if(visual==='teddy'){oval(c,-23,-29,13,13,'#c99f76',INK);oval(c,23,-29,13,13,'#c99f76',INK);oval(c,-27,9,13,19,'#c99f76',INK,-.4);oval(c,27,9,13,19,'#c99f76',INK,.4);oval(c,0,6,23,27,'#dfb78c',INK);oval(c,-17,28,14,11,'#d6aa7e',INK);oval(c,17,28,14,11,'#d6aa7e',INK);oval(c,0,-18,29,25,'#dfb78c',INK);oval(c,0,-9,17,12,'#f3d6ae');for(const x of[-11,11])oval(c,x,-22,2.8,3.3,INK);oval(c,0,-12,5,3.5,INK);line(c,[[0,-10],[0,-5],[-4,-2]],INK,1.8);polygon(c,[[-13,7],[0,13],[13,7],[13,20],[0,14],[-13,20]],CORAL);oval(c,0,14,4,4,'#f3c178');}
    else if(visual==='moon'){c.save();c.rotate(-.15);c.beginPath();c.moveTo(12,-39);c.bezierCurveTo(-45,-43,-48,24,-1,31);c.bezierCurveTo(16,33,27,21,30,15);c.bezierCurveTo(-4,29,-22,-13,12,-39);c.closePath();c.fillStyle='#f8d478';c.fill();c.strokeStyle=INK;c.stroke();line(c,[[-24,-1],[-19,2],[-14,-1]],'#a38151',2);oval(c,-5,18,3,2,'#e7b75f');c.restore();star(c,29,-25,10,'#f5d789');}
    else if(visual==='shield'){polygon(c,[[0,-39],[31,-26],[25,12],[0,30],[-25,12],[-31,-26]],'#7db494',INK);polygon(c,[[0,-30],[23,-20],[17,10],[0,22],[-17,10],[-23,-20]],'#c2dcc0');line(c,[[-14,-4],[-4,7],[15,-14]],'#538a71',6);}
    else if(visual==='clock'){oval(c,0,-5,33,33,'#f5c15a',INK);oval(c,0,-5,25,25,'#fff6d5',INK);line(c,[[0,-22],[0,-5],[15,4]],'#8f7560',4);oval(c,0,-5,3,3,CORAL);line(c,[[-20,25],[-25,34]],INK,5);line(c,[[20,25],[25,34]],INK,5);oval(c,-22,-33,14,7,CORAL,INK,-.5);oval(c,22,-33,14,7,CORAL,INK,.5);}
    else if(visual==='coin'){coin(c,0,-5,35,0);star(c,34,-29,7,'#fff4b9',4);star(c,-32,22,5,'#ffe2a0',4);}
    else if(visual==='star'){star(c,0,-4,41,'#e4a348');star(c,0,-7,35,'#ffd76d');for(const x of[-10,10])oval(c,x,-8,2.7,4,INK);line(c,[[-7,5],[0,9],[7,5]],'#ad8248',2);}
    else if(visual==='ad'){polygon(c,[[-30,-31],[8,-40],[30,-23],[29,22],[-28,25]],'#f5ba77',INK);star(c,-1,-8,23,'#ffedbe',8);miniIcon(c,'alert',0,-8,27,CORAL);line(c,[[-18,17],[19,17]],'#ba775f',3);}
    else{rect(c,-26,-42,52,74,'#5c6078',INK,10);rect(c,-20,-33,40,52,visual==='video'?'#b9a0cd':'#efc5b9',null,5);rect(c,-9,-38,18,3,'#343d55',null,2);oval(c,0,25,3,3,'#a6afbd');miniIcon(c,visual==='video'?'video':identityOf(object)==='streak'?'flame':identityOf(object)==='scary-lure'?'alert':iconOf(object),0,-11,25,visual==='video'?'#735688':CORAL);rect(c,10,-40,22,17,'#f8d878',INK,8);c.fillStyle=INK;c.textAlign='center';c.textBaseline='middle';c.font='800 11px system-ui,sans-serif';c.fillText('!',21,-31);}
  }
  function coin(c,x,y,r,spin=0){
    c.save();c.translate(x,y);const squash=.42+.58*Math.abs(Math.cos(spin));c.scale(squash,1);c.lineWidth=Math.max(1.5,r*.07);oval(c,3,1,r,r,'#d99632',INK);oval(c,0,-1,r,r,'#f8c955',INK);oval(c,0,-1,r*.76,r*.76,'#ffe391','#dfa43d');
    star(c,0,-2,r*.49,'#d89732');star(c,-1,-4,r*.4,'#f6bd4b');line(c,[[-r*.43,-r*.51],[-r*.15,-r*.65]],'#fff9d2',Math.max(2,r*.09));c.restore();
  }
  function bonusId(state){return typeof state.bonusPhase==='string'?state.bonusPhase:state.bonusPhase?.id;}
  function drawBonusAccents(state,time){
    const id=bonusId(state);if(!id)return;ctx.save();
    // Leave the swipe lane and object instructions clear: the phase lives at the room edges.
    if(id==='coin-rush'){ctx.globalAlpha=.28;for(let i=0;i<6;i++){const x=i%2?width-18:18,y=height*(.15+Math.floor(i/2)*.29)+Math.sin(time*1.6+i)*8;coin(ctx,x,y,8,time+i);}ctx.strokeStyle=rgba(GOLD,.4);}
    else if(id==='combo-party'){ctx.globalAlpha=.24;for(let i=0;i<10;i++){const x=i%2?width-14:14,y=(i*.137*height+time*12)%height;star(ctx,x,y,5,[CORAL,GOLD,GREEN,'#b497cb'][i%4],4,time*.4+i);}ctx.strokeStyle=rgba(CORAL,.35);}
    else {ctx.globalAlpha=.25;for(const x of[10,width-10]){ctx.beginPath();for(let y=0;y<=height;y+=16){const px=x+Math.sin(y/height*TAU+time*1.4)*5;y?ctx.lineTo(px,y):ctx.moveTo(px,y);}ctx.strokeStyle=GREEN;ctx.lineWidth=3;ctx.stroke();}ctx.strokeStyle=rgba(GREEN,.3);}
    ctx.globalAlpha=1;ctx.lineWidth=3;rounded(ctx,3,3,width-6,height-6,14);ctx.stroke();ctx.restore();
  }
  function progressionEffect(e){
    const type=e.type,object=e.object,x=clamp(finite(e.x,finite(object?.x,width*.5)),16,width-16),y=clamp(finite(e.y,finite(object?.y,height*.32)),20,height-20);
    if(type==='combo-milestone'){
      const milestone=Number(e.milestone);if(![10,25,50].includes(milestone))return true;
      const total=milestone===50?2.35:milestone===25?2:1.7,points=Math.round(clamp(finite(e.points,({10:250,25:750,50:2000})[milestone]),0,1e7));
      comboBursts.push({milestone,points,life:total,total});comboBursts=comboBursts.slice(-3);comboCelebrations=Math.min(Number.MAX_SAFE_INTEGER,comboCelebrations+1);
      if(!reducedMotion){const count=milestone===50?46:milestone===25?32:22;for(let i=0;i<count;i++){const angle=random()*TAU,speed=45+random()*125;particles.push({x:width*.5,y:height*.2,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-35,life:.7+random()*.55,total:1.3,size:2+random()*3,color:[GOLD,'#e99d8f','#8dbba7','#c2a6ce'][i%4],spin:random()*4,angle,star:i%3===0});}particles=particles.slice(-260);}
      return true;
    }
    if(type==='coin-earned'){
      const amount=Math.max(1,Math.floor(finite(e.amount,1))),count=Math.min(5,Math.max(1,Math.ceil(amount/2)));
      for(let i=0;i<count;i++)coinBursts.push({x:x+(i-(count-1)/2)*12,y:y+i%2*6,life:.85+i*.055,total:.85+i*.055,spin:random()*TAU,offset:i});
      captions.push({text:`+${amount} MÜNZ${amount===1?'E':'EN'}`,x,y:Math.max(24,y-46),life:.85,total:.85,color:'#a96f24',size:17,big:false});coinBursts=coinBursts.slice(-24);captions=captions.slice(-18);return true;
    }
    if(type==='super-used'){
      const id=e.id||e.skillId,duration=id==='sweep-super'?1.05:1.4;
      superBursts.push({id,x:width/2,y:height*.5,life:duration,total:duration});superBursts=superBursts.slice(-3);
      return true;
    }
    if(type==='bonus-phase-start'||type==='bonus-phase-end'||type==='achievement-unlocked'||type==='skill-unlocked'||type==='second-chance'){
      const id=e.id||e.phase?.id||e.phase,phase=({'coin-rush':'MÜNZREGEN','combo-party':'KOMBO-PARTY','focus-wave':'FOKUS-WELLE'})[id]||'BONUSRUNDE';
      const text=type==='bonus-phase-start'?`${phase}!`:type==='bonus-phase-end'?'BONUS GESCHAFFT!':type==='achievement-unlocked'?'ERFOLG FREIGESCHALTET!':type==='second-chance'?'ZWEITE CHANCE!':'NEUE FÄHIGKEIT!';
      if(type!=='bonus-phase-start')captions.push({text,x:width*.5,y:height*.15,life:type==='bonus-phase-end'?.85:1.3,total:type==='bonus-phase-end'?.85:1.3,color:GOLD,size:clamp(width*.027,17,26),big:true});captions=captions.slice(-18);
      if(type!=='bonus-phase-end')for(let i=0;i<20;i++){const angle=random()*TAU;particles.push({x:width*.5,y:height*.15,vx:Math.cos(angle)*(40+random()*80),vy:Math.sin(angle)*70-40,life:.75,total:.75,size:2+random()*2,color:[GOLD,CORAL,GREEN][i%3],spin:random()*3,angle,star:true});}particles=particles.slice(-260);return true;
    }
    return false;
  }
  function drawSuperEffects(time){
    for(const burst of superBursts){const progress=1-burst.life/burst.total,fade=Math.sin(progress*Math.PI),span=Math.max(width,height);ctx.save();
      if(burst.id==='slow-super'){
        ctx.fillStyle=rgba('#a9d9e7',fade*.1);ctx.fillRect(0,0,width,height);ctx.strokeStyle=rgba('#7bb4c6',fade*.5);ctx.lineWidth=3;
        for(let i=0;i<3;i++){ctx.beginPath();const radius=span*(progress*.9+i*.22);ctx.ellipse(width*.5,height*.5,radius,radius*.58,0,0,TAU);ctx.stroke();}
      }else if(burst.id==='shield-super'){
        ctx.strokeStyle=rgba(GREEN,fade*.55);ctx.lineWidth=6;rounded(ctx,9+progress*9,9+progress*9,width-18-progress*18,height-18-progress*18,24);ctx.stroke();
        for(let i=0;i<6;i++){const angle=time+i*TAU/6;star(ctx,width*.5+Math.cos(angle)*width*.43,height*.5+Math.sin(angle)*height*.42,6*fade,'#81b997',4,angle);}
      }else {
        const colors=[CORAL,GOLD,'#81bca4','#b69aca'];ctx.lineWidth=4;
        for(let i=0;i<4;i++){const start=progress*TAU*1.1+i*TAU/4,radius=span*(.06+progress*.72);ctx.beginPath();ctx.strokeStyle=rgba(colors[i],fade*.65);ctx.ellipse(width*.5,height*.5,radius,radius*.65,0,start,start+1.4);ctx.stroke();}
      }ctx.restore();
    }
  }
  function drawCoinBursts(){
    for(const burst of coinBursts){const progress=1-burst.life/burst.total,ease=progress*progress,x=burst.x+(width-28-burst.x)*ease,y=burst.y+(20-burst.y)*ease-Math.sin(progress*Math.PI)*35;ctx.save();ctx.globalAlpha=clamp(burst.life/.18,0,1);coin(ctx,x,y,9+(1-progress)*2,burst.spin+progress*7);ctx.restore();}
  }
  function drawComboCelebration(){
    const burst=comboBursts.at(-1);if(!burst)return;
    const progress=1-burst.life/burst.total,enter=reducedMotion?1:clamp(progress*7,0,1),fade=clamp(burst.life/.3,0,1),scale=reducedMotion?1:.86+enter*.14+Math.sin(enter*Math.PI)*.05,w=Math.min(width*.87,540),h=width<500?82:96,cx=width*.5,cy=clamp(height*.19,61,125),colors=burst.milestone===50?['#f8d477','#bd883b']:burst.milestone===25?['#b8dbca','#558d7c']:['#f3b3a0','#b36752'];
    ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.globalAlpha=fade;
    // A compact paper scroll gives milestone scores their own shape and clear hierarchy.
    polygon(ctx,[[-w*.5,-h*.31],[-w*.57,-h*.4],[-w*.54,0],[-w*.57,h*.39],[-w*.45,h*.28]],colors[0],INK);
    polygon(ctx,[[w*.5,-h*.31],[w*.57,-h*.4],[w*.54,0],[w*.57,h*.39],[w*.45,h*.28]],colors[0],INK);
    ctx.lineWidth=2.5;rect(ctx,-w*.5+3,-h*.5+5,w,h,'#706153',null,17);rect(ctx,-w*.5,-h*.5,w,h,PAPER,INK,17);
    ctx.save();ctx.globalAlpha*=.3;for(let i=0;i<7;i++){const px=(i-3)*w*.13;line(ctx,[[px,-h*.43],[px+9,h*.43]],colors[0],1);}ctx.restore();
    const title=burst.milestone===50?'50 · NINJA-LEGENDE!':burst.milestone===25?'25 · SCHATTEN-FLOW!':'10 · NINJA-KOMBO!';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`950 ${clamp(width*.05,16,26)}px system-ui,Segoe UI,sans-serif`;ctx.fillStyle=INK;ctx.fillText(title,0,-h*.22,w*.9);
    ctx.font=`950 ${clamp(width*.084,28,43)}px system-ui,Segoe UI,sans-serif`;ctx.strokeStyle=colors[0];ctx.lineWidth=5;ctx.strokeText(`+${burst.points}`,0,h*.19,w*.65);ctx.fillStyle=colors[1];ctx.fillText(`+${burst.points}`,0,h*.19,w*.65);
    for(const side of[-1,1])star(ctx,side*w*.4,h*.17,clamp(width*.025,8,16),colors[0],burst.milestone===50?8:4,reducedMotion?0:progress*.8*side);
    ctx.restore();
  }
  function labelFor(o){const c=contentOf(o);return String(o.shortLabel||c.shortLabel||COMPACT[identityOf(o)]||COMPACT[visualOf(o)]||o.label||c.label||identityOf(o)).toUpperCase();}
  function objectLocal(o,state,fragment=false){
    const r=clamp(finite(o.radius,48),20,110),scale=r/50,power=isPower(o),keep=o.kind==='useful'||o.kind==='important';
    ctx.save();ctx.scale(scale,scale);ctx.lineWidth=3;ctx.shadowColor=rgba('#786b71',.22);ctx.shadowOffsetY=4;ctx.shadowBlur=5;
    if(power){star(ctx,0,-3,47,'#fff0b7',12);ctx.shadowBlur=0;}
    illustration(ctx,visualOf(o),colorOf(o),o);ctx.restore();
    if(fragment||!isThrowReady(o))return;
    // Keep the instructions at a readable CSS size, including on short, wide screens.
    // Labels sit outside the illustration; the action remains inside the swipe radius.
    const training=state.isTutorial===true,action=power?'BONUS':keep?'BEHALTEN':'WISCHEN',fill=power?'#fff0b7':keep?'#d9efdd':'#ffe0d6',ink=power?'#805b1c':keep?'#286343':'#973e39',badgeWidth=Math.max(92,r*1.92),actionY=r*.7,labelY=actionY+(training?22:1);
    ctx.save();ctx.lineWidth=1;ctx.textAlign='center';ctx.textBaseline='middle';
    if(training){rect(ctx,-badgeWidth/2,actionY-10,badgeWidth,20,fill,rgba(ink,.28),10);miniIcon(ctx,power?'star':keep?'shield':'scissors',-badgeWidth/2+12,actionY,12,ink);ctx.font='850 12px system-ui,Segoe UI,sans-serif';ctx.fillStyle=ink;ctx.fillText(action,6,actionY,badgeWidth-30);}
    rect(ctx,-badgeWidth/2-3,labelY-9,badgeWidth+6,18,PAPER,null,8);ctx.font='800 12px system-ui,Segoe UI,sans-serif';ctx.fillStyle=INK;ctx.fillText(labelFor(o),0,labelY,badgeWidth-6);ctx.restore();
  }
  function drawObject(o,state,time){if(o.cut||o.removed||!Number.isFinite(o.x)||!Number.isFinite(o.y))return;const r=finite(o.radius,48);if(o.y<-r*3||o.y>height+r*4||o.x<-r*4||o.x>width+r*4)return;ctx.save();ctx.translate(o.x,o.y);const throwScale=getThrowScale(o);ctx.scale(throwScale,throwScale);ctx.rotate(clamp(finite(o.angle),-.16,.16)+Math.sin(finite(o.age,time)*2.3)*.035);objectLocal(o,state);ctx.restore();lastObjectStyles.push({id:o.id,contentId:identityOf(o),brand:o.category||contentOf(o).category||contentOf(o).brand||'signal',color:colorOf(o),icon:iconOf(o),visual:visualOf(o),action:state.isTutorial&&isThrowReady(o)?(isPower(o)?'bonus':o.kind==='useful'?'keep':'slice'):null,ready:isThrowReady(o),throwScale:getThrowScale(o),throwerIndex:o.launch?.throwerIndex??null});}
  function bladeColor(s){if(finite(s.effects?.flow)>0)return GOLD;const skin=typeof s.skin==='string'?s.skin:s.skin?.id,color=s.skinData?.trailColor||s.skinData?.color||SKINS[skin]||SKINS.default;return/^#[0-9a-f]{6}$/i.test(color)?color:SKINS.default;}
  function setTrail(points=[]){if(!Array.isArray(points)||!points.length)return;const accepted=points.slice(-72).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(!accepted.length)return;const last=accepted[accepted.length-1],key=[last.x,last.y,last.t,accepted.length].join(':');if(key===trailKey)return;trailKey=key;const end=finite(last.t),scale=end>Math.max(10,(lastTime||0)*5)?1/1000:1;trail=accepted.map(p=>({x:p.x,y:p.y,age:Math.max(0,(end-finite(p.t,end))*scale)}));trailSeen=lastTime??performance.now()/1000;}
  function drawTrail(s,time){const points=trail.filter(p=>time-trailSeen+p.age<.28);if(points.length<2)return;const color=bladeColor(s),flow=finite(s.effects?.flow)>0,left=[],right=[];for(let i=0;i<points.length;i++){const p=points[i],a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,length=Math.max(.01,Math.hypot(dx,dy)),fresh=1-clamp((time-trailSeen+p.age)/.28,0,1),wide=(flow?11:8)*(.15+.85*i/(points.length-1))*fresh;left.push({x:p.x-dy/length*wide,y:p.y+dx/length*wide});right.push({x:p.x+dy/length*wide,y:p.y-dx/length*wide});}ctx.save();ctx.fillStyle=rgba(color,.72);ctx.beginPath();left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));right.reverse().forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.strokeStyle='#fffaf0';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();const skin=typeof s.skin==='string'?s.skin:s.skin?.id||'default';
    // Unlocked blades keep their own personality even during the golden Flow mode.
    for(let i=2;i<points.length;i+=3){const p=points[i],fresh=1-clamp((time-trailSeen+p.age)/.28,0,1),size=(3+i/points.length*3)*fresh;ctx.globalAlpha=fresh*.85;
      if(skin==='solar')polygon(ctx,[[p.x-size,p.y+size*.5],[p.x,p.y-size*1.8],[p.x+size,p.y+size*.6]],i%2?'#f39a51':'#ffe09a');
      else if(skin==='mint')polygon(ctx,[[p.x,p.y-size*1.5],[p.x+size,p.y],[p.x,p.y+size*1.5],[p.x-size,p.y]],'#d0f4fc','#78b9d0');
      else if(skin==='neon')star(ctx,p.x,p.y,size*1.4,i%2?'#d3b0ed':'#efaec9',4,time+i);
      else if(skin==='dawn')polygon(ctx,[[p.x-size,p.y+size],[p.x-size*.4,p.y-size],[p.x+size,p.y-size*.2],[p.x+size*.6,p.y+size]],i%2?'#f3bd7a':'#f4d79f');
      else if(skin==='shadow')polygon(ctx,[[p.x-size*1.5,p.y],[p.x+size*.5,p.y-size],[p.x+size,p.y+size*.4],[p.x-size,p.y+size]],i%2?'#99cfc3':'#707d9b');
      else if(skin==='grandmaster'){star(ctx,p.x,p.y,size*1.5,'#e4bd61',4,Math.PI/4);star(ctx,p.x,p.y,size*.65,'#fff4c9',4,Math.PI/4);}
    }ctx.globalAlpha=1;const tip=points[points.length-1];star(ctx,tip.x,tip.y,skin==='neon'?8:5,skin==='mint'?'#d8f9ff':skin==='solar'?'#ffe09a':skin==='neon'?'#e8c5f4':'#fff1b8',4,time);ctx.restore();}
  function clippedHalf(f){const r=finite(f.object.radius,48)*1.45,nx=Math.cos(f.cutNormal)*f.side,ny=Math.sin(f.cutNormal)*f.side,v=[[-r,-r],[r,-r],[r,r],[-r,r]],p=[];for(let i=0;i<v.length;i++){const a=v[i],b=v[(i+1)%v.length],da=a[0]*nx+a[1]*ny,db=b[0]*nx+b[1]*ny;if(da>=0)p.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);p.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}ctx.beginPath();p.forEach((a,i)=>i?ctx.lineTo(a[0],a[1]):ctx.moveTo(a[0],a[1]));ctx.closePath();ctx.clip();}
  function effect(e={}){
    if(disposed)return;if(e.type==='spawned'){const object=e.object||e;throwAnimations=Math.min(Number.MAX_SAFE_INTEGER,throwAnimations+1);rememberThrow(object);return;}if(progressionEffect(e))return;const aliases={sliced:'slice','useful-mistake':'mistake','distraction-missed':'miss',powerup:'power','flow-started':'flow','useful-passed':'pass','level-started':'level','level-complete':'level','context-changed':'level','healthy-stop':'level'},original=String(e.type||'slice'),type=aliases[original]||original;if(!['slice','mistake','miss','power','flow','pass','level','stop'].includes(type))return;if(type==='stop'){stopRemaining=Math.max(stopRemaining,Math.min(.1,finite(e.duration,.055)));return;}
    const object=e.object,x=clamp(finite(e.x,finite(object?.x,width/2)),16,width-16),y=clamp(finite(e.y,finite(object?.y,height*.28)),20,height-20),protectedHit=Boolean(e.protected),bad=(type==='mistake'||type==='miss'||e.correct===false)&&!protectedHit,color=protectedHit?GREEN:bad?CORAL:type==='power'||type==='flow'?GOLD:type==='pass'?GREEN:object?colorOf(object):GOLD;
    if((type==='slice'||type==='mistake')&&object){const p=Array.isArray(e.points)?e.points:Array.isArray(e.swipePoints)?e.swipePoints:trail,a=Number.isFinite(e.angle)?e.angle:p.length>1?Math.atan2(p[p.length-1].y-p[0].y,p[p.length-1].x-p[0].x):-.45;for(const side of[-1,1]){const n=a+Math.PI/2;fragments.push({object:{...object,content:{...contentOf(object)}},x,y,vx:Math.cos(n)*side*(70+random()*65)+finite(object.vx)*.15,vy:Math.sin(n)*side*(65+random()*55)-75,angle:finite(object.angle),spin:side*(1+random()*1.5),cutNormal:n-finite(object.angle),side,life:.9,total:.9,bounced:false});}stopRemaining=Math.max(stopRemaining,.035);shake=Math.max(shake,bad?2:1);}
    const count=type==='power'||type==='flow'?34:type==='slice'?20:bad?8:10,palette=[GOLD,CORAL,'#86baab','#9c93c3','#efce86'];for(let i=0;i<count;i++){const a=random()*TAU,speed=55+random()*170;particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-75,life:.55+random()*.45,total:1,size:2+random()*4,color:bad?CORAL:palette[i%palette.length],spin:random()*5,angle:random()*TAU,star:i%4===0});}rings.push({x,y,radius:5,life:type==='flow'||type==='power'?.75:.45,total:type==='flow'||type==='power'?.75:.45,color,power:type==='power'||type==='flow'});
    let text=typeof e.text==='string'?e.text:'';if(protectedHit)text='GUT GESCHÜTZT!';else if(!text&&typeof e.points==='number'&&e.points>0)text=type==='slice'?`${['ZACK!','NICE!','JUHU!'][Math.floor(random()*3)]} +${Math.round(e.points)}`:`+${Math.round(e.points)}`;if(!text)text=type==='flow'?'SUPER FLOW!':type==='power'?({slow:'ZEITLUPE!',shield:'SCHILD!',multiplier:'BONUS ×2!',coins:'MÜNZEN!'})[e.effect||e.powerup||e.power]||'BONUS!':type==='mistake'?'DAS DARF BLEIBEN':type==='miss'?'NÄCHSTES MAL!':type==='pass'?'GUT BEHALTEN!':original==='healthy-stop'?'GUTER SCHLUSS!':original==='level-complete'?'GESCHAFFT!':original==='context-changed'?'NEUE RUNDE!':'LOS GEHT’S!';const big=type==='flow'||type==='power'||type==='level';captions.push({text,x:big?width*.5:x,y:big?height*.18:clamp(y-finite(object?.radius,45)-24,24,height-24),life:big?1.25:.85,total:big?1.25:.85,color:bad?CORAL:type==='pass'?GREEN:GOLD,size:big?clamp(width*.03,20,30):18,big});particles=particles.slice(-260);fragments=fragments.slice(-48);rings=rings.slice(-16);captions=captions.slice(-18);
  }
  function animateEffects(dt){for(const b of comboBursts)b.life-=dt;comboBursts=comboBursts.filter(b=>b.life>0);for(const b of coinBursts)b.life-=dt;coinBursts=coinBursts.filter(b=>b.life>0);for(const b of superBursts)b.life-=dt;superBursts=superBursts.filter(b=>b.life>0);stopRemaining=Math.max(0,stopRemaining-dt);const step=stopRemaining>0?dt*.15:dt;for(const f of fragments){f.life-=step;f.vy+=420*step;f.x+=f.vx*step;f.y+=f.vy*step;f.angle+=f.spin*step;if(f.y>height-12&&f.vy>0&&!f.bounced){f.y=height-12;f.vy*=-.32;f.bounced=true;}}fragments=fragments.filter(f=>f.life>0);for(const p of particles){p.life-=step;p.vy+=155*step;p.x+=p.vx*step;p.y+=p.vy*step;p.vx*=Math.exp(-step);p.angle+=p.spin*step;}particles=particles.filter(p=>p.life>0);for(const r of rings){r.life-=dt;r.radius+=dt*(r.power?140:105);}rings=rings.filter(r=>r.life>0);for(const c of captions){c.life-=dt;c.y-=dt*17;}captions=captions.filter(c=>c.life>0);shake=Math.max(0,shake-dt*15);}
  function drawEffects(state){
    for(const f of fragments){ctx.save();ctx.globalAlpha=clamp(f.life/f.total*2,0,1);ctx.translate(f.x,f.y);ctx.rotate(f.angle);clippedHalf(f);objectLocal(f.object,state,true);ctx.restore();}for(const r of rings){ctx.save();ctx.globalAlpha=r.life/r.total*.4;ctx.strokeStyle=r.color;ctx.lineWidth=r.power?4:2;ctx.beginPath();ctx.arc(r.x,r.y,r.radius,0,TAU);ctx.stroke();if(r.power)for(let i=0;i<10;i++){const a=i*TAU/10;star(ctx,r.x+Math.cos(a)*r.radius,r.y+Math.sin(a)*r.radius,4,r.color,4,a);}ctx.restore();}for(const p of particles){ctx.save();ctx.globalAlpha=clamp(p.life/.2,0,1);ctx.translate(p.x,p.y);ctx.rotate(p.angle);if(p.star)star(ctx,0,0,p.size*1.3,p.color);else rect(ctx,-p.size,-p.size*.5,p.size*2,p.size,p.color,null,1);ctx.restore();}
    drawCoinBursts();for(const c of captions){const t=1-c.life/c.total,bounce=1+Math.sin(clamp(t*4,0,1)*Math.PI)*.09;ctx.save();ctx.globalAlpha=clamp(c.life/.2,0,1);ctx.translate(c.x,c.y);ctx.scale(bounce,bounce);ctx.font=`900 ${c.size}px system-ui,Segoe UI,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';const w=Math.min(width*.85,ctx.measureText(c.text).width+28);if(c.big)polygon(ctx,[[-w*.55,-8],[-w*.49,-20],[-w*.3,-15],[-w*.09,-24],[w*.12,-16],[w*.36,-22],[w*.47,-10],[w*.55,2],[w*.44,15],[w*.19,16],[-w*.08,24],[-w*.29,15],[-w*.5,18]],'#fff0ba',rgba('#a78147',.32));ctx.strokeStyle=PAPER;ctx.lineWidth=5;ctx.strokeText(c.text,0,0,w-12);ctx.fillStyle=c.big?INK:c.color;ctx.fillText(c.text,0,0,w-12);ctx.restore();}
  }
  function clearTransientEffects(){particles=[];fragments=[];rings=[];captions=[];coinBursts=[];superBursts=[];comboBursts=[];poseRecords.clear();lastSimulationTime=null;players=[];activeThrows=[];trail=[];trailSeen=0;trailKey='';shake=0;stopRemaining=0;cameraOffset={x:0,y:0};}
  function render(state={},time=performance.now()/1000){
    if(disposed)return;const began=performance.now();resize();time=finite(time,performance.now()/1000);const dt=lastTime==null?0:clamp(time-lastTime,0,.05);lastTime=time;lastState=state||{};
    const gameplayScene=lastState.scene==='playing'&&!lastState.isHome&&lastState.phase!=='home'&&lastState.started!==false;
    // A finished run leaves no frozen hit, slash or celebration behind the Dojo.
    if(wasGameplayScene&&!gameplayScene){clearTransientEffects();effectsResets++;}wasGameplayScene=gameplayScene;
    prepareSquad(lastState);animateEffects(lastState.paused?0:dt);
    const cameraActive=gameplayScene&&!lastState.paused&&!reducedMotion;
    cameraOffset={x:cameraActive?Math.sin(time*29)*shake:0,y:cameraActive?Math.cos(time*23)*shake*.5:0};
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,width,height);ctx.save();ctx.translate(cameraOffset.x,cameraOffset.y);background(lastState,time);drawSuperEffects(time);lastObjectStyles=[];for(const o of Array.isArray(lastState.objects)?lastState.objects:[])drawObject(o,lastState,time);drawEffects(lastState);drawComboCelebration();drawTrail(lastState,time);ctx.restore();frames++;drawMilliseconds=performance.now()-began;
  }
  function dispose(){disposed=true;caches.clear();clearTransientEffects();}
  resize();return{resize,getSize:()=>({width,height}),render,setTrail,effect,dispose,getStats:()=>({renderedFrames:frames,width,height,dpr,canvas2d:true,artDirection:'illustrated-cartoon',context:currentMode,backgroundId:currentBackground,skin:typeof lastState.skin==='string'?lastState.skin:lastState.skin?.id||'default',trailPattern:THROW_STYLES[playerSkin(typeof lastState.skin==='string'?lastState.skin:lastState.skin?.id)],trainingActions:lastState.isTutorial===true,playerVisible:lastState.scene==='playing'&&!lastState.isHome&&lastState.started!==false,playerSkin:playerSkin(typeof lastState.skin==='string'?lastState.skin:lastState.skin?.id),worldStage,worldStageName:['Morgenruhe','Wolken ziehen auf','Tempel am Horizont','Tempellichter','Blütenwind'][worldStage],comboCelebrations,cameraShake:shake,cameraOffset:{...cameraOffset},hitstop:stopRemaining,effectsResets,activeMilestone:comboBursts.at(-1)?.milestone||null,comboEffects:comboBursts.length,reducedMotion,throwStyle:THROW_STYLES[playerSkin(typeof lastState.skin==='string'?lastState.skin:lastState.skin?.id)],throwAnimations,throwPose:players.find(player=>player.pose.phase!=='idle')?.pose.phase||'idle',throwRemaining:Math.max(0,...[...poseRecords.values()].map(record=>record.launch.windup+THROW_RECOVERY-record.age)),launches:activeThrows.filter(object=>!object.ready).length,playerCount:players.length,players:players.map(player=>({index:player.actor.index,x:player.actor.x,y:player.actor.y,height:player.actor.height,skin:player.skin,phase:player.pose.phase,handX:player.pose.handX,handY:player.pose.handY,objectId:player.objectId})),activeThrows:activeThrows.map(object=>({...object})),activeObjects:lastObjectStyles.length,particles:particles.length,fragments:fragments.length,rings:rings.length,captions:captions.length,coinBursts:coinBursts.length,superBursts:superBursts.length,bonusPhase:typeof lastState.bonusPhase==='string'?lastState.bonusPhase:lastState.bonusPhase?.id||null,trailPoints:trail.length,drawMilliseconds,objectStyles:lastObjectStyles.map(style=>({...style}))})};
}
