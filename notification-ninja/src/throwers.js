const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export const THROW_RECOVERY=.32;

export function getThrowerCount(difficulty){return difficulty==='hard'?3:difficulty==='normal'?2:1;}

/** Shared by physics and drawing: the visible glove is the actual launch origin. */
export function getThrowerLayout(width,height,difficulty='easy'){
  const count=getThrowerCount(difficulty),positions=count===3?[.19,.5,.81]:count===2?[.30,.70]:[.5];
  const size=Math.min(220,height*.42,width*(count===3?.32:count===2?.44:.66));
  return positions.map((position,index)=>({index,x:width*position,y:height*.90,height:size,scale:size/310,facing:position>.5?-1:1}));
}

export function getThrowerPose(actor,age=Infinity,windup=.22){
  const preparing=age<windup,p=preparing?clamp(age/windup,0,1):clamp((age-windup)/THROW_RECOVERY,0,1);
  let hand,elbow,crouch;
  if(preparing){
    const pull=Math.min(1,p/.58),push=clamp((p-.58)/.42,0,1);
    hand={x:46+( -22-46)*pull+(99+22)*push,y:-161+(-273+161)*pull+(-245+273)*push};
    elbow={x:28-24*pull+52*push,y:-157-45*pull-8*push};crouch=10*Math.sin(p*Math.PI);
  }else if(p<1){hand={x:99+16*Math.sin(p*Math.PI)-52*p,y:-245+92*p};elbow={x:56-5*p,y:-210+61*p};crouch=-5*Math.sin(p*Math.PI);}
  else{hand={x:47,y:-153};elbow={x:51,y:-149};crouch=0;}
  return {phase:preparing?'windup':p<.45?'release':p<1?'recover':'idle',progress:p,hand,elbow,crouch,
    handX:actor.x+actor.facing*hand.x*actor.scale,handY:actor.y+(hand.y+crouch)*actor.scale};
}

export function getThrowScale(object){
  const launch=object?.launch;if(!launch)return 1;
  const age=Number.isFinite(object.age)?object.age:0;
  return age<launch.windup?.30:.30+.70*clamp((age-launch.windup)/launch.arc,0,1);
}

export function isThrowReady(object){return !object.launch||object.age>=object.launch.windup+object.launch.arc;}
