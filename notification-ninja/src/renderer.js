// Original, procedural arcade art. This renderer never changes gameplay state.
import { CONTENT } from './game.js';

const CONTENT_LOOKUP=new Map(CONTENT.map(content=>[content.id,content]));
const TAU=Math.PI*2;
const THEMES={
  study:{sky:['#071323','#153147','#285565'],glow:'#65ffe7',secondary:'#79adff',floor:'#101c30'},
  gaming:{sky:['#100a25','#362051','#6d326e'],glow:'#fc68dd',secondary:'#78a9ff',floor:'#1a1334'},
  sleep:{sky:['#100d29','#2a2850','#704675'],glow:'#acaaff',secondary:'#ffc78e',floor:'#171329'},
  master:{sky:['#08182d','#28304c','#55546d'],glow:'#7effe6',secondary:'#ffd59c',floor:'#111c31'}
};
const BRANDS={social:'#fc77b5',school:'#79bfff',gaming:'#b399ff',sleep:'#ffd193',health:'#73e1b7',news:'#ffae7c'};
const SKINS={classic:'#75fff0',mint:'#75fff0',cyan:'#70e8ff',neon:'#f382ff',violet:'#b8a0ff',sunset:'#ffd08e',gold:'#ffe58d',sakura:'#ff98c3',ice:'#b4ecff'};
const COMPACT_LABELS={'streak':['STREAK','RETTEN!'],'urgent-school':['SCHULE','WICHTIG'],'homework':['SCHUL-','AUFGABE'],'gameclip':['GAME','CLIP'],'gaming-invite':['TEAM','INVITE'],'break':['KURZE','PAUSE'],'quiet':['RUHE-','ZEIT'],'scary-lure':['HYPE-','ALARM'],'safety':['ECHTE','WARNUNG'],'update':['UPDATE','MORGEN']};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const ease=value=>1-(1-clamp(value,0,1))**3;
function rgba(color,alpha=1){const hex=/^#([0-9a-f]{6})$/i.exec(color);return hex?`rgba(${parseInt(hex[1].slice(0,2),16)},${parseInt(hex[1].slice(2,4),16)},${parseInt(hex[1].slice(4,6),16)},${clamp(alpha,0,1)})`:color;}
function roundRect(ctx,x,y,w,h,r=10){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
function hash(text){let result=2166136261;for(const c of String(text))result=Math.imul(result^c.charCodeAt(0),16777619);return result>>>0;}
function randomFactory(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function modeOf(state){const raw=String(state.context?.id||state.context?.name||state.context||state.level?.id||state.level||state.mode||'study').toLowerCase();if(raw.includes('gam'))return'gaming';if(raw.includes('sleep')||raw.includes('schlaf'))return'sleep';if(raw.includes('master')||raw.includes('balance'))return'master';return'study';}
function isPower(object){return object.kind==='powerup'||object.type==='powerup'||Boolean(object.power)||Boolean(object.powerup);}
function contentOf(object){const authored=CONTENT_LOOKUP.get(object.contentId)||{};return object.content&&typeof object.content==='object'?{...authored,...object.content}:authored;}
function identityOf(object){const content=contentOf(object);return String(content.id||object.contentId||object.label||content.label||object.type||'signal');}
function brandOf(object){
  const content=contentOf(object),id=String(content.category||content.brand||object.category||identityOf(object)).toLowerCase();
  if(/sleep|schlaf|bed|wecker|alarm|ruhe/.test(id))return'sleep';
  if(/school|class|study|homework|lesson|task|lehr|lern|haus|schule|note|calendar|plan|exam/.test(id))return'school';
  if(/game|gaming|boss|match|quest|level|stream/.test(id))return'gaming';
  if(/health|water|sport|walk|break|pause|drink/.test(id))return'health';
  if(/news|sale|promo|shop|drop|angebot/.test(id))return'news';
  if(/social|chat|feed|video|clip|message|streak|like|dm|friend|freund/.test(id))return'social';
  return Object.keys(BRANDS)[hash(id)%Object.keys(BRANDS).length];
}
function iconOf(object){
  const content=contentOf(object),icon=String(content.icon||object.icon||identityOf(object)).toLowerCase();
  const symbols={'🔥':'flame','✉':'chat','▤':'book','▶':'video','✚':'game','◌':'drop','☾':'moon','!':'alert','△':'alert','↻':'refresh','◷':'clock','⬡':'shield','×2':'star'};if(symbols[icon])return symbols[icon];
  if(/shield|schild/.test(icon))return'shield';if(/slow|clock|timer|alarm|sleep|wecker/.test(icon))return'clock';
  if(/multi|double|boost|star|xp/.test(icon))return'star';if(/focus|flow|zen/.test(icon))return'focus';
  if(/game|controller|boss|match|quest/.test(icon))return'game';if(/video|clip|stream|play/.test(icon))return'video';
  if(/book|school|class|study|homework|note|lern|haus|schule|exam/.test(icon))return'book';
  if(/calendar|task|plan|todo/.test(icon))return'calendar';if(/music|audio|song/.test(icon))return'music';
  if(/water|drink|health/.test(icon))return'drop';if(/moon|bed|ruhe/.test(icon))return'moon';
  if(/sale|shop|promo|offer|angebot|drop/.test(icon))return'bag';return'chat';
}
function colorOf(object){const color=contentOf(object).color;return typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color)?color:BRANDS[brandOf(object)];}

/** Logical coordinates are CSS pixels in the dedicated canvas, at DPR <= 2. */
export function createRenderer(canvas){
  const ctx=canvas?.getContext?.('2d',{alpha:false});if(!ctx)throw new Error('Die 2D-Zeichenfläche konnte nicht gestartet werden.');
  let width=1,height=1,dpr=1,disposed=false,frames=0,lastTime=null,drawMilliseconds=0,currentMode='study',previousMode=null,modeChangedAt=0;
  let particles=[],fragments=[],rings=[],captions=[],trail=[],trailSeen=0,trailKey='',shake=0,stopRemaining=0,lastState={},lastObjectStyles=[];
  const caches=new Map();const rng=randomFactory(673409);
  function resize(){
    const rect=canvas.getBoundingClientRect?.();const w=Math.max(1,Math.round(canvas.clientWidth||rect?.width||800)),h=Math.max(1,Math.round(canvas.clientHeight||rect?.height||600));
    const ratio=Math.min(globalThis.devicePixelRatio||1,2);
    if(w!==width||h!==height||ratio!==dpr){width=w;height=h;dpr=ratio;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);caches.clear();}
    return{width,height};
  }
  function icon(context,type,x,y,size,color='#ffffff'){
    context.save();context.translate(x,y);context.scale(size/24,size/24);context.strokeStyle=color;context.fillStyle=color;context.lineWidth=1.8;context.lineCap='round';context.lineJoin='round';
    if(type==='chat'){roundRect(context,-10,-8,20,14,4);context.stroke();context.beginPath();context.moveTo(-5,6);context.lineTo(-7,10);context.lineTo(0,6);context.stroke();for(const x of [-5,0,5]){context.beginPath();context.arc(x,-1,1,0,TAU);context.fill();}}
    else if(type==='video'){roundRect(context,-10,-8,20,16,4);context.stroke();context.beginPath();context.moveTo(-2,-4);context.lineTo(5,0);context.lineTo(-2,4);context.closePath();context.fill();}
    else if(type==='game'){context.beginPath();context.moveTo(-6,-6);context.quadraticCurveTo(-10,-5,-11,5);context.quadraticCurveTo(-11,10,-6,5);context.lineTo(6,5);context.quadraticCurveTo(11,10,11,5);context.quadraticCurveTo(10,-5,6,-6);context.closePath();context.stroke();context.beginPath();context.moveTo(-6,-2);context.lineTo(-6,3);context.moveTo(-8.5,.5);context.lineTo(-3.5,.5);context.stroke();for(const [x,y]of[[5,-1],[8,2]]){context.beginPath();context.arc(x,y,1.2,0,TAU);context.fill();}}
    else if(type==='book'){context.beginPath();context.moveTo(0,-7);context.quadraticCurveTo(-5,-10,-10,-7);context.lineTo(-10,8);context.quadraticCurveTo(-5,5,0,8);context.quadraticCurveTo(5,5,10,8);context.lineTo(10,-7);context.quadraticCurveTo(5,-10,0,-7);context.lineTo(0,8);context.stroke();}
    else if(type==='calendar'){roundRect(context,-9,-8,18,18,3);context.stroke();context.beginPath();context.moveTo(-9,-3);context.lineTo(9,-3);context.moveTo(-5,-11);context.lineTo(-5,-5);context.moveTo(5,-11);context.lineTo(5,-5);context.stroke();context.beginPath();context.moveTo(-4,3);context.lineTo(-1,6);context.lineTo(5,0);context.stroke();}
    else if(type==='clock'){context.beginPath();context.arc(0,0,9,0,TAU);context.moveTo(0,-5);context.lineTo(0,0);context.lineTo(5,3);context.stroke();context.beginPath();context.moveTo(-7,-9);context.lineTo(-10,-6);context.moveTo(7,-9);context.lineTo(10,-6);context.stroke();}
    else if(type==='shield'){context.beginPath();context.moveTo(0,-10);context.lineTo(9,-6);context.lineTo(7,4);context.quadraticCurveTo(5,9,0,11);context.quadraticCurveTo(-5,9,-7,4);context.lineTo(-9,-6);context.closePath();context.stroke();context.beginPath();context.moveTo(-4,0);context.lineTo(-1,4);context.lineTo(5,-3);context.stroke();}
    else if(type==='star'){context.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?4.4:10;if(i===0)context.moveTo(Math.cos(a)*r,Math.sin(a)*r);else context.lineTo(Math.cos(a)*r,Math.sin(a)*r);}context.closePath();context.stroke();}
    else if(type==='focus'){context.beginPath();context.arc(0,0,7,0,TAU);for(let i=0;i<4;i++){const a=i*Math.PI/2;context.moveTo(Math.cos(a)*5,Math.sin(a)*5);context.lineTo(Math.cos(a)*12,Math.sin(a)*12);}context.stroke();}
    else if(type==='music'){context.beginPath();context.moveTo(-4,6);context.lineTo(-4,-7);context.lineTo(7,-10);context.lineTo(7,3);context.stroke();for(const [x,y]of[[-7,7],[4,4]]){context.beginPath();context.ellipse(x,y,3.5,2.5,-.3,0,TAU);context.fill();}}
    else if(type==='moon'){context.beginPath();context.arc(0,0,10,.55,5.7);context.quadraticCurveTo(-3,-3,8,5.2);context.closePath();context.stroke();}
    else if(type==='drop'){context.beginPath();context.moveTo(0,-11);context.bezierCurveTo(12,2,10,10,0,10);context.bezierCurveTo(-10,10,-12,2,0,-11);context.stroke();context.beginPath();context.moveTo(-4,2);context.quadraticCurveTo(-4,6,0,7);context.stroke();}
    else if(type==='bag'){roundRect(context,-9,-4,18,14,3);context.stroke();context.beginPath();context.moveTo(-4,-4);context.lineTo(-4,-7);context.quadraticCurveTo(0,-13,4,-7);context.lineTo(4,-4);context.stroke();}
    else if(type==='flame'){context.beginPath();context.moveTo(0,-11);context.bezierCurveTo(2,-4,9,-4,9,4);context.quadraticCurveTo(8,11,0,11);context.quadraticCurveTo(-10,10,-9,2);context.quadraticCurveTo(-8,-4,-3,-6);context.lineTo(-3,0);context.quadraticCurveTo(0,-3,0,-11);context.closePath();context.stroke();context.beginPath();context.moveTo(0,0);context.quadraticCurveTo(6,6,0,8);context.quadraticCurveTo(-5,6,0,0);context.fill();}
    else if(type==='alert'){context.beginPath();context.moveTo(0,-11);context.lineTo(11,9);context.lineTo(-11,9);context.closePath();context.stroke();context.beginPath();context.moveTo(0,-4);context.lineTo(0,2);context.stroke();context.beginPath();context.arc(0,6,.9,0,TAU);context.fill();}
    else if(type==='refresh'){context.beginPath();context.arc(0,0,9,.15,5.0);context.stroke();context.beginPath();context.moveTo(3,-10);context.lineTo(8,-8);context.lineTo(4,-3);context.stroke();}
    context.restore();
  }
  function architecture(context,mode){
    const theme=THEMES[mode],random=randomFactory(hash(mode)+width*31+height);const sky=context.createLinearGradient(0,0,0,height);theme.sky.forEach((color,i)=>sky.addColorStop(i/2,color));context.fillStyle=sky;context.fillRect(0,0,width,height);
    const horizon=mode==='sleep'?height*.59:height*.53;
    const glow=context.createRadialGradient(width*.73,horizon,4,width*.73,horizon,width*.75);glow.addColorStop(0,rgba(theme.glow,.15));glow.addColorStop(1,rgba(theme.glow,0));context.fillStyle=glow;context.fillRect(0,0,width,height);
    // Large original moon and thin atmospheric cloud bands, far behind the action.
    const moonX=width*(mode==='gaming'?.78:.76),moonY=height*(mode==='sleep'?.20:.18),moonR=Math.min(width,height)*(mode==='sleep'?.115:.064);
    context.fillStyle=rgba(theme.secondary,.12);context.beginPath();context.arc(moonX,moonY,moonR*1.6,0,TAU);context.fill();context.fillStyle=mode==='sleep'?'#e1d8ec':rgba(theme.secondary,.75);context.beginPath();context.arc(moonX,moonY,moonR,0,TAU);context.fill();
    context.fillStyle=rgba(theme.sky[1],.22);for(const [x,y,r]of[[moonX-moonR*.25,moonY+moonR*.2,moonR*.22],[moonX+moonR*.3,moonY-moonR*.25,moonR*.12]]){context.beginPath();context.arc(x,y,r,0,TAU);context.fill();}
    for(let i=0;i<42;i++){context.globalAlpha=.25+random()*.45;context.fillStyle='#d0efff';const x=random()*width,y=random()*horizon*.88,r=.6+random()*.8;context.beginPath();context.arc(x,y,r,0,TAU);context.fill();}context.globalAlpha=1;
    for(let layer=0;layer<3;layer++){
      const count=Math.ceil(width/57),base=horizon+layer*height*.052;
      for(let i=-1;i<count+1;i++){
        const bw=(40+random()*50)*(1+layer*.08),bh=height*(.08+random()*.25)*(1+layer*.07),x=i*width/count+(random()-.5)*20,y=base-bh;
        context.fillStyle=['#13273b','#15283e','#102236'][layer];if(mode==='gaming')context.fillStyle=['#292345','#302342','#211c36'][layer];if(mode==='sleep')context.fillStyle=['#302c4c','#28283f','#24283c'][layer];context.fillRect(x,y,bw,bh);
        context.fillStyle=rgba(layer===2?theme.glow:theme.secondary,.25);context.fillRect(x+2,y,Math.max(1,bw*.025),bh);
        if(random()>.4){context.strokeStyle=rgba(theme.secondary,.35);context.lineWidth=1;context.beginPath();context.moveTo(x+bw*.5,y);context.lineTo(x+bw*.5,y-10-random()*26);context.stroke();}
        for(let wy=y+9;wy<base-9;wy+=12)for(let wx=x+9;wx<x+bw-6;wx+=11)if(random()>.43){context.fillStyle=rgba(random()>.8?'#ffcf9a':theme.secondary,.10+random()*.25);context.fillRect(wx,wy,3,5);}
        if(layer===2&&i%4===1&&mode!=='sleep'){
          const signW=bw*.7,signH=bh*.26;context.fillStyle=rgba(theme.glow,.10);roundRect(context,x+bw*.15,y+bh*.2,signW,signH,3);context.fill();context.strokeStyle=rgba(theme.glow,.35);context.stroke();
          context.fillStyle=rgba(theme.glow,.75);context.font=`600 ${Math.max(9,Math.min(15,signW*.23))}px ui-monospace, Consolas, monospace`;context.textAlign='center';context.fillText(mode==='gaming'?'PLAY':'AURA',x+bw*.5,y+bh*.2+signH*.6,signW-6);
        }
      }
    }
    const floor=context.createLinearGradient(0,horizon,0,height);floor.addColorStop(0,rgba(theme.floor,.3));floor.addColorStop(1,theme.floor);context.fillStyle=floor;context.fillRect(0,horizon,width,height-horizon);
    context.strokeStyle=rgba(theme.glow,.07);context.lineWidth=1;for(let i=-5;i<9;i++){context.beginPath();context.moveTo(width*.5,horizon);context.lineTo(width*.5+i*width*.19,height);context.stroke();}for(let i=0;i<8;i++){const y=horizon+(height-horizon)*(i/7)**2;context.beginPath();context.moveTo(0,y);context.lineTo(width,y);context.stroke();}
    if(mode==='study'){
      // Window mullions, a warm desk, books, and a tiny original cyber-ninja figurine.
      context.fillStyle='#081221';context.fillRect(0,0,width*.035,height*.82);context.fillRect(width*.965,0,width*.035,height*.82);context.fillRect(0,height*.67,width,7);
      const y=height*.86;const desk=context.createLinearGradient(0,y,0,height);desk.addColorStop(0,'#243047');desk.addColorStop(1,'#11182b');context.fillStyle=desk;context.beginPath();context.moveTo(width*.04,y);context.lineTo(width*.96,y);context.lineTo(width*1.08,height);context.lineTo(-width*.08,height);context.closePath();context.fill();context.strokeStyle=rgba(theme.glow,.24);context.beginPath();context.moveTo(width*.04,y);context.lineTo(width*.96,y);context.stroke();
      for(let i=0;i<3;i++){context.fillStyle=['#597787','#43717a','#685b83'][i];roundRect(context,width*.06+i*3,y-5-i*8,width*.12,8,2);context.fill();}
      context.fillStyle='#151e32';roundRect(context,width*.77,y-25,width*.09,27,7);context.fill();context.strokeStyle=rgba(theme.secondary,.4);context.stroke();context.beginPath();context.arc(width*.865,y-12,width*.018,-Math.PI/2,Math.PI/2);context.stroke();
    }else if(mode==='gaming'){
      // Laser rails and a perspective arcade stage; beams stay below card brightness.
      for(const side of [-1,1]){context.strokeStyle=rgba(theme.glow,.25);context.lineWidth=2;context.beginPath();context.moveTo(width*.5+side*width*.43,height*.12);context.lineTo(width*.5+side*width*.33,height*.70);context.lineTo(width*.5+side*width*.48,height*.92);context.stroke();}
      context.fillStyle='#120f26';roundRect(context,width*.08,height*.83,width*.84,height*.13,12);context.fill();context.strokeStyle=rgba(theme.glow,.28);context.stroke();
      context.fillStyle=rgba(theme.glow,.18);for(let i=0;i<7;i++)roundRect(context,width*(.22+i*.08),height*.88,width*.04,height*.02,3),context.fill();
      for(const side of [-1,1]){
        const x=side<0?width*.045:width*.79,y=height*.52,w=width*.165,h=height*.36;
        context.fillStyle='#251d3a';context.beginPath();context.moveTo(x+w*.1,y);context.lineTo(x+w*.91,y);context.lineTo(x+w,y+h*.23);context.lineTo(x+w*.82,y+h*.60);context.lineTo(x+w*.95,y+h);context.lineTo(x,y+h);context.lineTo(x+w*.13,y+h*.59);context.lineTo(x+w*.03,y+h*.23);context.closePath();context.fill();context.strokeStyle=rgba(theme.glow,.30);context.lineWidth=1.4;context.stroke();
        context.fillStyle=rgba(theme.glow,.17);roundRect(context,x+w*.15,y+h*.04,w*.64,h*.10,3);context.fill();context.fillStyle='#0e1b2d';roundRect(context,x+w*.16,y+h*.20,w*.60,h*.32,4);context.fill();context.strokeStyle=rgba('#8ed9ff',.4);context.stroke();
        context.fillStyle=rgba(theme.glow,.55);context.beginPath();context.moveTo(x+w*.36,y+h*.26);context.lineTo(x+w*.62,y+h*.26);context.lineTo(x+w*.68,y+h*.41);context.lineTo(x+w*.49,y+h*.46);context.lineTo(x+w*.29,y+h*.41);context.closePath();context.fill();context.fillStyle='#211833';context.fillRect(x+w*.37,y+h*.32,w*.07,h*.028);context.fillRect(x+w*.54,y+h*.32,w*.07,h*.028);
        context.fillStyle='#14182e';roundRect(context,x+w*.12,y+h*.58,w*.68,h*.12,3);context.fill();context.fillStyle='#b698ea';context.beginPath();context.arc(x+w*.28,y+h*.63,Math.max(2,w*.03),0,TAU);context.fill();context.fillStyle='#f27bcb';for(let i=0;i<3;i++){context.beginPath();context.arc(x+w*(.48+i*.11),y+h*.63,Math.max(1.6,w*.025),0,TAU);context.fill();}
      }
    }else if(mode==='sleep'){
      context.fillStyle='#11172a';context.beginPath();context.moveTo(0,height*.8);for(let i=0;i<15;i++)context.lineTo(i*width/14,height*(.80+Math.sin(i*.9)*.025));context.lineTo(width,height);context.lineTo(0,height);context.closePath();context.fill();
      const lake=context.createLinearGradient(0,height*.78,0,height);lake.addColorStop(0,rgba('#a4a4e6',.13));lake.addColorStop(1,rgba('#586ba9',.02));context.fillStyle=lake;context.beginPath();context.ellipse(width*.64,height*.88,width*.29,height*.11,-.05,0,TAU);context.fill();
      context.fillStyle='#151c30';for(let i=0;i<7;i++){const x=width*(.03+i*.09),y=height*(.83+(i%2)*.055);context.beginPath();context.moveTo(x,y-height*.1);context.lineTo(x-width*.035,y);context.lineTo(x+width*.035,y);context.closePath();context.fill();}
      const hx=width*.80,hy=height*.82,hw=width*.14,hh=height*.13;context.fillStyle='#222338';roundRect(context,hx,hy-hh,hw,hh,4);context.fill();context.fillStyle='#182034';context.beginPath();context.moveTo(hx-hw*.1,hy-hh);context.lineTo(hx+hw*.5,hy-hh*1.66);context.lineTo(hx+hw*1.12,hy-hh);context.closePath();context.fill();context.fillStyle=rgba('#ffd39d',.45);roundRect(context,hx+hw*.17,hy-hh*.66,hw*.23,hh*.36,2);context.fill();context.fillStyle=rgba('#ffcf92',.25);roundRect(context,hx+hw*.61,hy-hh*.60,hw*.20,hh*.60,2);context.fill();
    }
    // A little masked ninja stands on the foreground ledge, rendered behind every object.
    const nx=width*.9,ny=height*.91,scale=Math.min(width,height)/590;context.save();context.translate(nx,ny);context.scale(scale,scale);context.fillStyle='#0b1326';context.beginPath();context.moveTo(-13,0);context.lineTo(-5,-25);context.lineTo(8,-25);context.lineTo(16,0);context.closePath();context.fill();context.beginPath();context.arc(1,-35,11,0,TAU);context.fill();context.fillStyle=theme.glow;roundRect(context,-7,-37,16,3,1);context.fill();context.fillStyle=rgba(theme.secondary,.48);context.beginPath();context.moveTo(-7,-28);context.lineTo(-36,-21);context.lineTo(-24,-31);context.closePath();context.fill();context.strokeStyle=rgba(theme.glow,.65);context.lineWidth=2;context.beginPath();context.moveTo(9,-19);context.lineTo(32,-50);context.stroke();context.restore();
    const vignette=context.createRadialGradient(width*.5,height*.42,Math.min(width,height)*.15,width*.5,height*.48,Math.max(width,height)*.78);vignette.addColorStop(0,'rgba(2,6,19,0)');vignette.addColorStop(1,'rgba(2,6,19,.48)');context.fillStyle=vignette;context.fillRect(0,0,width,height);
  }
  function cachedBackground(mode){if(!caches.has(mode)){const surface=document.createElement('canvas');surface.width=width;surface.height=height;architecture(surface.getContext('2d'),mode);caches.set(mode,surface);}return caches.get(mode);}
  function background(state,time){
    const theme=THEMES[currentMode];ctx.drawImage(cachedBackground(currentMode),0,0,width,height);
    if(previousMode){const fade=1-clamp((time-modeChangedAt)/.65,0,1);if(fade>0){ctx.save();ctx.globalAlpha=fade;ctx.drawImage(cachedBackground(previousMode),0,0,width,height);ctx.restore();}else previousMode=null;}
    // Gentle parallax traces, drifting motes, and rainy city reflections.
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineWidth=1;
    for(let i=0;i<20;i++){const phase=i*2.399,x=((i*79.13+time*(5+i%3))%(width+50))-25,y=height*(.10+(i*19.37%59)/100)+Math.sin(time*.4+phase)*9;ctx.fillStyle=rgba(theme.glow,.09+(i%3)*.03);ctx.beginPath();ctx.arc(x,y,i%4===0?2:1,0,TAU);ctx.fill();}
    if(currentMode==='gaming'||currentMode==='study'){
      ctx.strokeStyle=rgba(theme.secondary,currentMode==='gaming'?.11:.055);for(let i=0;i<22;i++){const x=(i*77+time*(currentMode==='gaming'?-18:-8)+width*8)%width,y=(i*91+time*190)%height;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+12);ctx.stroke();}
    }
    if(currentMode==='sleep'){for(let i=0;i<8;i++){ctx.strokeStyle=rgba(theme.secondary,.07);ctx.beginPath();ctx.ellipse(width*.64,height*(.835+i*.013),width*(.04+i*.03)+Math.sin(time*.8+i)*5,height*.004,0,0,TAU);ctx.stroke();}}
    if(currentMode==='sleep'){for(let row=0;row<3;row++){ctx.strokeStyle=rgba(row%2?'#93e7d5':'#afaaff',.08);ctx.lineWidth=10+row*7;ctx.beginPath();for(let x=0;x<=width;x+=15){const y=height*(.17+row*.04)+Math.sin(x/width*4+time*.23+row)*height*.045;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}}
    if(currentMode==='master'||state.levelIndex===3){ctx.save();ctx.translate(width*.55,height*.42);ctx.rotate(Math.sin(time*.17)*.08);for(let i=0;i<4;i++){ctx.strokeStyle=rgba(i%2?theme.secondary:theme.glow,.065);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,0,width*(.19+i*.04),height*(.22+i*.035),i*.2,0,TAU);ctx.stroke();}ctx.restore();}
    const effects=state.effects||{},flow=Boolean(state.flow)||finite(state.flowRemaining)>0||finite(effects.flow)>0;
    if(flow){for(let row=0;row<3;row++){ctx.strokeStyle=rgba('#79ffe8',.10-row*.018);ctx.lineWidth=2+row;ctx.beginPath();for(let x=-20;x<=width+20;x+=14){const y=height*(.36+row*.18)+Math.sin(x/width*5.7+time*1.6+row)*height*.047;if(x===-20)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}}
    if(finite(effects.shield)>0){ctx.strokeStyle=rgba('#83d9ff',.14+Math.sin(time*1.3)*.025);ctx.lineWidth=3;roundRect(ctx,7,7,width-14,height-14,Math.min(width,height)*.1);ctx.stroke();}
    ctx.restore();
    const overload=clamp(finite(state.overload),0,100)/100;if(overload>.2){const shade=ctx.createLinearGradient(0,0,width,0);shade.addColorStop(0,rgba('#f162aa',overload*.08));shade.addColorStop(.3,rgba('#f162aa',0));shade.addColorStop(.7,rgba('#f162aa',0));shade.addColorStop(1,rgba('#f162aa',overload*.08));ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);ctx.strokeStyle=rgba('#b58ce8',overload*.025);for(let y=10;y<height;y+=24){ctx.beginPath();ctx.moveTo(0,y+Math.sin(time*1.6+y*.03)*2);ctx.lineTo(width,y);ctx.stroke();}for(let i=0;i<7;i++){const x=i%2?width-34:6,y=height*(.08+i*.12)+Math.sin(time*.7+i)*5;ctx.fillStyle=rgba('#cda2fb',overload*.07);roundRect(ctx,x,y,28,18+i%3*4,3);ctx.fill();}}
  }
  function hero(state,time){
    const home=state.isHome||state.scene==='home'||state.phase==='home',scale=Math.min(width*.42,height*.69)/280;
    ctx.save();ctx.globalAlpha=home?.84:.13;ctx.translate(width*(home?.77:.91),height*.94+Math.sin(time*1.6)*1.8);ctx.scale(scale,scale);const blade=bladeColor(state);
    // Original armored cyber-ninja, with scarf, layered hood, gauntlets, and a katana.
    const halo=ctx.createRadialGradient(-10,-150,10,-10,-150,175);halo.addColorStop(0,rgba(blade,.15));halo.addColorStop(1,rgba(blade,0));ctx.fillStyle=halo;ctx.fillRect(-185,-340,350,350);
    ctx.fillStyle='#172b43';ctx.beginPath();ctx.moveTo(-38,-123);ctx.lineTo(-44,-35);ctx.lineTo(-19,0);ctx.lineTo(1,-2);ctx.lineTo(-1,-105);ctx.closePath();ctx.fill();ctx.fillStyle='#0c1c32';ctx.beginPath();ctx.moveTo(2,-108);ctx.lineTo(9,-31);ctx.lineTo(37,0);ctx.lineTo(55,-2);ctx.lineTo(40,-126);ctx.closePath();ctx.fill();
    ctx.fillStyle='#3b5269';for(const [x,y]of[[-38,-61],[20,-63]]){roundRect(ctx,x,y,27,25,6);ctx.fill();}ctx.fillStyle='#10203a';roundRect(ctx,-30,-7,39,13,4);ctx.fill();roundRect(ctx,28,-7,40,13,4);ctx.fill();
    const suit=ctx.createLinearGradient(-50,-220,45,-100);suit.addColorStop(0,'#416177');suit.addColorStop(.48,'#1b314c');suit.addColorStop(1,'#0e2039');ctx.fillStyle=suit;ctx.beginPath();ctx.moveTo(-44,-206);ctx.lineTo(20,-207);ctx.lineTo(49,-125);ctx.lineTo(-42,-117);ctx.closePath();ctx.fill();
    ctx.fillStyle='#5c798a';ctx.beginPath();ctx.moveTo(-44,-202);ctx.lineTo(-69,-185);ctx.lineTo(-61,-161);ctx.lineTo(-27,-178);ctx.closePath();ctx.fill();ctx.fillStyle='#203c55';ctx.beginPath();ctx.moveTo(20,-202);ctx.lineTo(50,-182);ctx.lineTo(53,-154);ctx.lineTo(25,-164);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#152a43';ctx.lineWidth=21;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-54,-171);ctx.lineTo(-74,-124);ctx.moveTo(40,-172);ctx.lineTo(75,-145);ctx.lineTo(100,-169);ctx.stroke();ctx.strokeStyle='#6b8590';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(-64,-146);ctx.lineTo(-74,-123);ctx.moveTo(75,-145);ctx.lineTo(94,-165);ctx.stroke();
    ctx.fillStyle='#253d53';roundRect(ctx,-83,-129,19,17,5);ctx.fill();roundRect(ctx,90,-180,20,21,5);ctx.fill();ctx.strokeStyle=blade;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-31,-187);ctx.lineTo(-18,-144);ctx.lineTo(19,-147);ctx.stroke();
    ctx.fillStyle='#16304a';ctx.beginPath();ctx.ellipse(-10,-242,39,43,-.1,0,TAU);ctx.fill();ctx.fillStyle='#335369';ctx.beginPath();ctx.moveTo(-48,-250);ctx.quadraticCurveTo(-4,-303,26,-248);ctx.lineTo(12,-219);ctx.lineTo(-40,-220);ctx.closePath();ctx.fill();ctx.fillStyle='#c18d84';ctx.beginPath();ctx.moveTo(-36,-252);ctx.lineTo(15,-257);ctx.lineTo(17,-241);ctx.lineTo(-33,-237);ctx.closePath();ctx.fill();ctx.fillStyle='#09233a';ctx.beginPath();ctx.moveTo(-34,-241);ctx.lineTo(18,-247);ctx.lineTo(11,-221);ctx.lineTo(-20,-220);ctx.closePath();ctx.fill();ctx.strokeStyle=blade;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-28,-247);ctx.lineTo(-14,-249);ctx.moveTo(-3,-250);ctx.lineTo(10,-252);ctx.stroke();
    ctx.fillStyle=rgba(blade,.76);ctx.beginPath();ctx.moveTo(-30,-220);ctx.lineTo(-4,-215);ctx.lineTo(-64,-204);ctx.quadraticCurveTo(-111,-216+Math.sin(time*1.5)*10,-159,-185);ctx.lineTo(-121,-223);ctx.quadraticCurveTo(-75,-242,-30,-220);ctx.fill();
    ctx.strokeStyle='#c4deeb';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(103,-177);ctx.lineTo(160,-274);ctx.stroke();ctx.strokeStyle=rgba(blade,.8);ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(104,-179);ctx.lineTo(163,-278);ctx.stroke();ctx.strokeStyle='#9ab3bd';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(89,-180);ctx.lineTo(118,-165);ctx.stroke();
    ctx.restore();
  }
  function linesOf(text,maxWidth,font,limit=2){ctx.font=`650 ${font}px system-ui, Segoe UI, sans-serif`;const words=String(text).split(/\s+/),lines=[];let line='';for(let word of words){if(ctx.measureText(word).width>maxWidth){if(line){lines.push(line);line='';}while(ctx.measureText(word).width>maxWidth){let length=1;while(length<word.length&&ctx.measureText(word.slice(0,length+1)+'-').width<=maxWidth)length++;lines.push(word.slice(0,length)+'-');word=word.slice(length);}}const candidate=line?`${line} ${word}`:word;if(ctx.measureText(candidate).width>maxWidth&&line){lines.push(line);line=word;}else line=candidate;}if(line)lines.push(line);if(lines.length>limit){lines.length=limit;const last=lines[limit-1];lines[limit-1]=last.length>3?last.slice(0,-2)+'…':last;}return lines;}
  function cardLocal(object,state,fragment=false){
    const r=clamp(finite(object.radius,42),18,100),content=contentOf(object),power=isPower(object),brand=brandOf(object),color=power?'#e7c3ff':colorOf(object);const w=r*2,h=r*1.73;
    if(power){
      ctx.save();ctx.shadowColor='#d6a2ff';ctx.shadowBlur=fragment?4:18;const shine=ctx.createRadialGradient(-r*.22,-r*.25,0,0,0,r);shine.addColorStop(0,'#efe8ff');shine.addColorStop(.24,'#9e79dc');shine.addColorStop(1,'#362653');ctx.fillStyle=shine;ctx.beginPath();ctx.arc(0,0,r*.86,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#ffdda5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.86,0,TAU);ctx.stroke();ctx.strokeStyle=rgba('#ffffff',.4);ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r*.69,-2.8,-.3);ctx.stroke();icon(ctx,iconOf({...object,icon:object.powerup||object.power||content.icon||object.icon||'star'}),0,-r*.13,r*.75,'#fff4d9');ctx.fillStyle='#fff4de';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`750 ${Math.max(13,r*.22)}px system-ui, sans-serif`;const powerLabel=({slow:'ZEITLUPE',shield:'SCHILD',multiplier:'×2'})[object.powerup||object.power]||String(object.label||content.label||'BOOST').toUpperCase();ctx.fillText(powerLabel,0,r*.43,r*1.6);ctx.restore();return;
    }
    ctx.save();ctx.shadowColor=rgba(color,.32);ctx.shadowBlur=fragment?3:12;ctx.shadowOffsetY=4;const body=ctx.createLinearGradient(-r,-r,r,r);body.addColorStop(0,'#263b56');body.addColorStop(.5,'#15263f');body.addColorStop(1,'#101b31');ctx.fillStyle=body;roundRect(ctx,-w/2,-h/2,w,h,r*.19);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
    ctx.save();roundRect(ctx,-w/2,-h/2,w,h,r*.19);ctx.clip();const light=ctx.createLinearGradient(-r,-r*.9,r,r*.2);light.addColorStop(0,rgba('#e2f8ff',.14));light.addColorStop(.48,rgba('#e2f8ff',.01));light.addColorStop(1,rgba(color,.035));ctx.fillStyle=light;ctx.fillRect(-r,-r,w,h);ctx.strokeStyle=rgba('#eefbff',.16);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r*.85,-h*.38);ctx.lineTo(r*.85,-h*.38);ctx.stroke();ctx.restore();
    ctx.fillStyle=rgba(color,.19);roundRect(ctx,-r*.31,-r*.66,r*.62,r*.58,r*.14);ctx.fill();icon(ctx,iconOf(object),0,-r*.38,r*.48,color);
    const label=String(object.label||content.label||object.contentId||'Nachricht'),font=clamp(r*.28,13,19),lines=(r<40||height<300)&&COMPACT_LABELS[identityOf(object)]?COMPACT_LABELS[identityOf(object)]:linesOf(label,r*1.78,font,2);ctx.font=`650 ${font}px system-ui, Segoe UI, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f0f7ff';lines.forEach((line,i)=>ctx.fillText(line,0,r*(lines.length===1?.29:.02)+i*font*1.07,r*1.78));
    if((state.training||state.isTutorial)&&!fragment){const slice=object.kind!=='useful'&&object.kind!=='important';const badge=slice?'ZERTEILEN':'BEHALTEN';ctx.fillStyle='#132438';roundRect(ctx,-r*.97,r*.86,r*1.94,13,4);ctx.fill();ctx.fillStyle=slice?'#ffc6db':'#a8f8e2';ctx.font=`750 ${Math.max(8,r*.16)}px ui-monospace, Consolas, monospace`;ctx.fillText(badge,0,r*.86+6.5,r*1.80);}
    ctx.restore();
  }
  function drawObject(object,state,time){
    if(object.cut||object.removed||!Number.isFinite(object.x)||!Number.isFinite(object.y))return;const r=finite(object.radius,42),power=isPower(object),color=power?'#ddb3ff':colorOf(object);
    if(object.y<-r*3||object.y>height+r*4||object.x<-r*4||object.x>width+r*4)return;
    ctx.save();ctx.translate(object.x,object.y);ctx.rotate(clamp(finite(object.angle),-.18,.18));
    if(power){ctx.save();ctx.rotate(time*.55);ctx.strokeStyle=rgba('#edc1ff',.45);ctx.lineWidth=1;for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+5),Math.sin(a)*(r+5));ctx.stroke();}ctx.restore();}
    cardLocal(object,state);ctx.restore();lastObjectStyles.push({id:object.id,contentId:identityOf(object),brand:power?'powerup':brandOf(object),color,icon:iconOf(object)});
  }
  function setTrail(points=[]){
    if(!Array.isArray(points)||!points.length)return;const accepted=points.slice(-72).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(!accepted.length)return;
    const last=accepted.at(-1),key=[last.x,last.y,last.t,accepted.length].join(':');if(key===trailKey)return;trailKey=key;
    const end=finite(last.t),scale=end>Math.max(10,(lastTime||0)*5)?1/1000:1;
    trail=accepted.map(p=>({x:p.x,y:p.y,age:Math.max(0,(end-finite(p.t,end))*scale)}));trailSeen=lastTime??performance.now()/1000;
  }
  function bladeColor(state){const skin=typeof state.skin==='string'?state.skin:state.skin?.id;const data=state.skinData||{};const color=data.trailColor||data.color||SKINS[skin]||SKINS.classic;return/^#[0-9a-f]{6}$/i.test(color)?color:SKINS.classic;}
  function drawTrail(state,time){
    const points=trail.filter(p=>time-trailSeen+p.age<.26);if(points.length<2)return;const color=bladeColor(state),flow=Boolean(state.flow)||finite(state.effects?.flow)>0||finite(state.flowRemaining)>0;
    const left=[],right=[];for(let i=0;i<points.length;i++){const p=points[i],before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+1)],dx=after.x-before.x,dy=after.y-before.y,length=Math.max(.01,Math.hypot(dx,dy)),fresh=1-clamp((time-trailSeen+p.age)/.26,0,1),wide=(flow?11:7)*(.15+.85*i/(points.length-1))*fresh;left.push({x:p.x-dy/length*wide,y:p.y+dx/length*wide});right.push({x:p.x+dy/length*wide,y:p.y-dx/length*wide});}
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor=color;ctx.shadowBlur=19;ctx.fillStyle=rgba(color,.48);ctx.beginPath();left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));right.reverse().forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.shadowBlur=8;ctx.strokeStyle='#f0ffff';ctx.lineWidth=flow?3:2;ctx.lineCap=ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.shadowBlur=0;const tip=points.at(-1);ctx.fillStyle=rgba('#edffff',.68);ctx.beginPath();ctx.arc(tip.x,tip.y,3.2,0,TAU);ctx.fill();ctx.restore();
  }
  function clippedHalf(fragment){
    const radius=finite(fragment.object.radius,42)*1.3,nx=Math.cos(fragment.cutNormal)*fragment.side,ny=Math.sin(fragment.cutNormal)*fragment.side,vertices=[[-radius,-radius],[radius,-radius],[radius,radius],[-radius,radius]],result=[];
    for(let i=0;i<vertices.length;i++){const a=vertices[i],b=vertices[(i+1)%vertices.length],da=a[0]*nx+a[1]*ny,db=b[0]*nx+b[1]*ny;if(da>=0)result.push(a);if((da>=0)!==(db>=0)){const ratio=da/(da-db);result.push([a[0]+(b[0]-a[0])*ratio,a[1]+(b[1]-a[1])*ratio]);}}
    ctx.beginPath();result.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
  }
  function effect(event={}){
    if(disposed)return;const aliases={'sliced':'slice','useful-mistake':'mistake','distraction-missed':'miss','powerup':'power','flow-started':'flow','useful-passed':'pass','level-started':'level','level-complete':'level','context-changed':'level','healthy-stop':'level'};
    const original=String(event.type||'slice'),type=aliases[original]||original;if(!['slice','mistake','miss','power','flow','pass','level','stop'].includes(type))return;
    const object=event.object,x=clamp(finite(event.x,finite(object?.x,width/2)),12,width-12),y=(type==='pass'||type==='miss')?clamp(finite(event.y,24),28,height-20):finite(event.y,finite(object?.y,height*.45));const protectedHit=Boolean(event.protected),bad=(type==='mistake'||type==='miss'||event.correct===false)&&!protectedHit;
    const color=protectedHit?'#8ceaff':bad?'#ff7d9d':type==='pass'?'#8cf5ce':type==='power'?'#edc8ff':type==='flow'?'#80ffda':object&&!isPower(object)?colorOf(object):bladeColor(lastState);
    if(type==='stop'){stopRemaining=Math.max(stopRemaining,Math.min(.10,finite(event.duration,.055)));return;}
    if((type==='slice'||type==='mistake')&&object){
      const points=Array.isArray(event.points)?event.points:Array.isArray(event.swipePoints)?event.swipePoints:trail,cutAngle=Number.isFinite(event.angle)?event.angle:points?.length>1?Math.atan2(points.at(-1).y-points[0].y,points.at(-1).x-points[0].x):-.45;
      for(const side of [-1,1]){const normal=cutAngle+Math.PI/2;fragments.push({object:{...object,content:{...contentOf(object)}},x,y,vx:Math.cos(normal)*side*(65+rng()*65)+finite(object.vx)*.17,vy:Math.sin(normal)*side*(55+rng()*55)-55,angle:finite(object.angle),spin:side*(1.2+rng()*1.8),cutNormal:normal-finite(object.angle),side,life:.78,total:.78});}
      stopRemaining=Math.max(stopRemaining,.04);shake=Math.max(shake,bad?4:1.25);
    }
    const count=type==='slice'?15:type==='power'||type==='flow'?25:bad?12:8;
    for(let i=0;i<count;i++){const angle=rng()*TAU,speed=(type==='flow'?120:65)+rng()*190;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-22,life:.35+rng()*.45,total:.8,size:1+rng()*3,color,spark:i%3===0});}
    rings.push({x,y,radius:4,life:type==='flow'?.85:.48,total:type==='flow'?.85:.48,color,power:type==='power'||type==='flow'});
    let text=typeof event.text==='string'?event.text:'';if(protectedHit)text='SCHILD';if(!text&&typeof event.points==='number'&&event.points>0)text=`+${Math.round(event.points)}`;if(!text&&Number.isFinite(event.score)&&event.score>0)text=`+${Math.round(event.score)}`;
    if(!text){if(type==='flow')text='FLOW';else if(type==='power')text=({slow:'ZEITLUPE',shield:'FOKUS-SCHILD',multiplier:'PUNKTE ×2'})[event.effect||event.powerup||event.power]||'BOOST';else if(type==='mistake')text='BEHALTEN!';else if(type==='miss')text='VERPASST';else if(type==='pass')text='SIGNAL ERHALTEN';else if(type==='level')text=original==='healthy-stop'?'GUTER SCHLUSS':original==='context-changed'?'NEUER KONTEXT':original==='level-complete'?'GESCHAFFT':'NEUER TAKT';}
    if(text)captions.push({text,x,y:y-12,life:1.0,total:1,color,size:type==='flow'?30:type==='power'?22:18});
    particles=particles.slice(-260);fragments=fragments.slice(-48);rings=rings.slice(-16);captions=captions.slice(-25);
  }
  function animateEffects(dt){
    stopRemaining=Math.max(0,stopRemaining-dt);const step=stopRemaining>0?dt*.12:dt;
    for(const f of fragments){f.life-=step;f.vy+=500*step;f.x+=f.vx*step;f.y+=f.vy*step;f.angle+=f.spin*step;}
    fragments=fragments.filter(f=>f.life>0);
    for(const p of particles){p.life-=step;p.vy+=210*step;p.x+=p.vx*step;p.y+=p.vy*step;p.vx*=Math.exp(-step*1.5);}
    particles=particles.filter(p=>p.life>0);for(const ring of rings){ring.life-=dt;ring.radius+=dt*(ring.power?150:115);}rings=rings.filter(r=>r.life>0);
    for(const caption of captions){caption.life-=dt;caption.y-=dt*32;}captions=captions.filter(c=>c.life>0);shake=Math.max(0,shake-dt*18);
  }
  function drawEffects(state){
    for(const f of fragments){ctx.save();ctx.globalAlpha=clamp(f.life/f.total*2,0,1);ctx.translate(f.x,f.y);ctx.rotate(f.angle);clippedHalf(f);cardLocal(f.object,state,true);ctx.restore();}
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const ring of rings){ctx.strokeStyle=rgba(ring.color,ring.life/ring.total*.38);ctx.lineWidth=ring.power?2:1.4;ctx.beginPath();ctx.arc(ring.x,ring.y,ring.radius,0,TAU);ctx.stroke();}
    for(const p of particles){ctx.strokeStyle=ctx.fillStyle=rgba(p.color,clamp(p.life/p.total,0,1));if(p.spark){ctx.lineWidth=p.size*.55;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);ctx.stroke();}else{ctx.beginPath();ctx.arc(p.x,p.y,p.size*clamp(p.life/.2,0,1),0,TAU);ctx.fill();}}
    ctx.restore();
    if(Array.isArray(state.particles))for(const p of state.particles.slice(-100)){if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;ctx.save();ctx.globalAlpha=clamp(finite(p.alpha,1),0,1);ctx.fillStyle=p.color||'#a5fff3';ctx.beginPath();ctx.arc(p.x,p.y,clamp(finite(p.radius,2),.5,8),0,TAU);ctx.fill();ctx.restore();}
    for(const caption of captions){ctx.save();ctx.globalAlpha=clamp(caption.life/.25,0,1);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`800 ${caption.size}px system-ui, Segoe UI, sans-serif`;ctx.shadowColor=caption.color;ctx.shadowBlur=12;ctx.strokeStyle='#101a2e';ctx.lineWidth=5;ctx.strokeText(caption.text,caption.x,caption.y);ctx.fillStyle=caption.color;ctx.fillText(caption.text,caption.x,caption.y);ctx.restore();}
  }
  function render(state={},time=performance.now()/1000){
    if(disposed)return;const began=performance.now();resize();time=finite(time,performance.now()/1000);const dt=lastTime==null?0:clamp(time-lastTime,0,.05);lastTime=time;lastState=state||{};
    const mode=modeOf(lastState);if(mode!==currentMode){previousMode=currentMode;currentMode=mode;modeChangedAt=time;}
    animateEffects(dt);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,width,height);
    const overload=clamp(finite(lastState.overload),0,100)/100;ctx.save();ctx.translate(Math.sin(time*39)*shake+Math.sin(time*1.7)*overload*1.5,Math.cos(time*31)*shake*.6);background(lastState,time);hero(lastState,time);lastObjectStyles=[];
    const objects=Array.isArray(lastState.objects)?lastState.objects:[];for(const object of objects)drawObject(object,lastState,time);drawEffects(lastState);drawTrail(lastState,time);ctx.restore();frames++;drawMilliseconds=performance.now()-began;
  }
  function dispose(){disposed=true;caches.clear();particles=[];fragments=[];rings=[];captions=[];trail=[];}
  resize();
  return{resize,getSize:()=>({width,height}),render,setTrail,effect,dispose,getStats:()=>({renderedFrames:frames,width,height,dpr,canvas2d:true,context:currentMode,activeObjects:lastObjectStyles.length,particles:particles.length,fragments:fragments.length,rings:rings.length,trailPoints:trail.length,drawMilliseconds,objectStyles:lastObjectStyles.map(style=>({...style}))})};
}
