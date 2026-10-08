import * as THREE from 'three';

// These coordinates are shared by the scene, guidance UI, and legitimate input QA.
export const TARGETS = Object.freeze({
  console: Object.freeze({x:-4.8,z:-3.8,label:'CONSOLE'}),
  clue: Object.freeze({x:4.6,z:-3.8,label:'CLUE'}),
  exit: Object.freeze({x:0,z:-6.8,label:'EXIT'}),
  secret: Object.freeze({x:6.2,z:4.8,label:'HIDDEN CHANNEL'}),
  quiet: Object.freeze({x:4,z:-6.8,label:'QUIET EXIT'})
});
export const BRIDGE_TILES = Object.freeze([
  {id:'A',x:0,z:3.7,safe:true}, {id:'B',x:2.5,z:2.2,safe:false},
  {id:'C',x:-1.4,z:1.5,safe:true}, {id:'D',x:1,z:-.7,safe:true},
  {id:'E',x:-2.6,z:-1.3,safe:false}, {id:'F',x:0,z:-3,safe:true}
].map(Object.freeze));
const BOUNDS = 7.45, SPEED = 3.35, PLAYER_RADIUS = .31;
const GLYPHS = {1:'◇',2:'◉',3:'△',4:'✚'};
const PALETTES = [0x70f2dc,0xffc68a,0x77e5ff,0xff78af,0xade6c6,0xbda5ff,0xffd48a];
const TITLES = ['MEMORY VAULT','SIGNAL FILTER','POWER GRID','TRAP BRIDGE','TASK CHAMBER','THE LAST CHOICE','HIDDEN CHANNEL'];

/** A local, asset-free, genuinely rendered escape facility. Game rules live outside the scene. */
export function createWorld({canvas,onInteract=()=>{},onHazard=()=>{},onMove=()=>{},onTile=()=>{}}={}) {
  if (!canvas) throw new Error('MIND MAZE benötigt ein Canvas für die 3D-Grafik.');
  let renderer;
  try {renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});}
  catch {throw new Error('WebGL 2 konnte nicht gestartet werden. Bitte verwende einen aktuellen Browser mit Grafikbeschleunigung.');}
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.18;
  canvas.style.touchAction='none';
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x080c1e); scene.fog=new THREE.FogExp2(0x080c1e,.009);
  const camera=new THREE.OrthographicCamera(-14,14,10,-10,.1,100);
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
  const roomRoot=new THREE.Group();scene.add(roomRoot);
  const geometries=[], materials=[], textures=[], roomResources=[], listeners=[];
  const keepGeometry=g=>(geometries.push(g),g),keepMaterial=m=>(materials.push(m),m),keepTexture=t=>(textures.push(t),t);
  const box=keepGeometry(new THREE.BoxGeometry(1,1,1));
  const sphere=keepGeometry(new THREE.SphereGeometry(1,14,10));
  const cylinder=keepGeometry(new THREE.CylinderGeometry(1,1,1,16));
  const cone=keepGeometry(new THREE.ConeGeometry(1,1,6));
  const plane=keepGeometry(new THREE.PlaneGeometry(1,1));
  const ring=keepGeometry(new THREE.TorusGeometry(1,.035,6,32));
  const capsule=keepGeometry(new THREE.CapsuleGeometry(.085,.36,3,7));
  const materialPool=new Map();
  function mat(color,glow=0,roughness=.6,metalness=.08,opacity=1) {
    const key=[color,glow,roughness,metalness,opacity].join(':');
    if (!materialPool.has(key)) materialPool.set(key,keepMaterial(new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:glow,roughness,metalness,transparent:opacity<1,opacity,depthWrite:opacity>=1})));
    return materialPool.get(key);
  }
  const ivory=mat(0xe7e6dc,0,.62,.06), dark=mat(0x1c2a42,0,.47,.2), ink=mat(0x10182c,0,.62,.1), pink=mat(0xff5eaa,1.9), white=mat(0xf4f6ec,0,.6);
  function mesh(geometry,material,x,y,z,sx,sy,sz,parent=roomRoot,shadow=false) {
    const item=new THREE.Mesh(geometry,material);item.position.set(x,y,z);item.scale.set(sx,sy,sz);item.castShadow=shadow;item.receiveShadow=true;parent.add(item);return item;
  }
  function cube(material,x,y,z,sx,sy,sz,parent=roomRoot,shadow=false){return mesh(box,material,x,y,z,sx,sy,sz,parent,shadow);}
  function round(material,x,y,z,sx,sy,sz,parent=roomRoot,shadow=false){return mesh(sphere,material,x,y,z,sx,sy,sz,parent,shadow);}
  function textCanvas(lines,{color='#e9fffa',background='rgba(12,24,43,.93)',font=34,width=640,height=200}={}) {
    const surface=document.createElement('canvas');surface.width=width;surface.height=height;const ctx=surface.getContext('2d');
    ctx.clearRect(0,0,width,height);ctx.fillStyle=background;ctx.beginPath();ctx.roundRect(2,2,width-4,height-4,14);ctx.fill();
    ctx.strokeStyle='rgba(112,242,220,.4)';ctx.lineWidth=3;ctx.stroke();ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=`600 ${font}px ui-monospace, Consolas, monospace`;ctx.fillStyle=color;
    const content=Array.isArray(lines)?lines:[String(lines)];content.forEach((line,i)=>ctx.fillText(String(line),width/2,(i+.5)*height/content.length,width-32));
    const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;roomResources.push(texture);return texture;
  }
  function label(lines,x,y,z,width=2.1,height=.55,options={}) {
    const texture=textCanvas(lines,options),material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});roomResources.push(material);
    const sprite=new THREE.Sprite(material);sprite.position.set(x,y,z);sprite.scale.set(width,height,1);roomRoot.add(sprite);return sprite;
  }
  function glowTexture(){
    const surface=document.createElement('canvas');surface.width=surface.height=128;const ctx=surface.getContext('2d'),gradient=ctx.createRadialGradient(64,64,1,64,64,64);
    gradient.addColorStop(0,'rgba(255,255,255,.65)');gradient.addColorStop(.2,'rgba(255,255,255,.22)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);return keepTexture(new THREE.CanvasTexture(surface));
  }
  const glowMap=glowTexture();
  const footShadow=keepMaterial(new THREE.MeshBasicMaterial({map:glowMap,color:0x070b17,transparent:true,opacity:.6,depthWrite:false}));
  const sunlight=new THREE.DirectionalLight(0xfff3d6,3.2);sunlight.position.set(-8,17,10);sunlight.castShadow=true;sunlight.shadow.mapSize.set(1024,1024);sunlight.shadow.camera.left=-13;sunlight.shadow.camera.right=13;sunlight.shadow.camera.top=13;sunlight.shadow.camera.bottom=-13;sunlight.shadow.camera.near=1;sunlight.shadow.camera.far=50;sunlight.shadow.normalBias=.045;sunlight.shadow.bias=-.0003;scene.add(sunlight);
  scene.add(new THREE.HemisphereLight(0xa6d9ff,0x34304d,2.25));
  const rim=new THREE.DirectionalLight(0x72e9e0,1.5);rim.position.set(9,4,-12);scene.add(rim);
  const accentLight=new THREE.PointLight(0x74f5dd,15,18,2);accentLight.position.set(0,3,-4);scene.add(accentLight);
  const dangerLight=new THREE.PointLight(0xff65aa,7,12,2);dangerLight.position.set(-7,2,4);scene.add(dangerLight);

  // A sparse digital star field adds depth to the floating architecture in one draw call.
  let seed=24117;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const starPositions=new Float32Array(120*3);
  for(let i=0;i<120;i++){const a=random()*Math.PI*2,r=16+random()*20;starPositions[i*3]=Math.cos(a)*r;starPositions[i*3+1]=-7+random()*22;starPositions[i*3+2]=Math.sin(a)*r;}
  const starGeometry=keepGeometry(new THREE.BufferGeometry());starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const stars=new THREE.Points(starGeometry,keepMaterial(new THREE.PointsMaterial({color:0x8ba9cd,size:.055,transparent:true,opacity:.48,sizeAttenuation:true})));scene.add(stars);

  // Small human explorer, with articulated arms and legs and a luminous backpack.
  const explorer=new THREE.Group();scene.add(explorer);
  const hips=new THREE.Group();hips.position.y=.62;explorer.add(hips);
  cube(dark,0,0,0,.42,.25,.24,hips,true);
  const torso=cube(ivory,0,.36,0,.48,.55,.29,hips,true);
  cube(mat(0x67d8cf),0,.36,-.155,.34,.15,.035,hips);
  cube(ink,0,.36,.225,.34,.41,.17,hips,true);
  const packLed=cube(mat(0x79f6df,1.8),0,.39,.319,.24,.055,.02,hips);
  const head=round(mat(0xdba782),0,.82,-.015,.225,.24,.21,hips,true);
  const hairGeometry=keepGeometry(new THREE.SphereGeometry(.234,14,8,0,Math.PI*2,0,Math.PI*.58));mesh(hairGeometry,ink,0,.865,-.005,1,1,1,hips,true);
  cube(ink,0,.845,-.205,.31,.055,.038,hips);
  cube(mat(0xb0ffed,1),0,.846,-.227,.24,.023,.016,hips);
  const arms=[],legs=[];
  for(const side of [-1,1]){
    const shoulder=new THREE.Group();shoulder.position.set(side*.32,.56,0);hips.add(shoulder);mesh(capsule,ivory,0,-.16,0,1,1,1,shoulder,true);round(mat(0xdba782),0,-.41,-.01,.095,.095,.09,shoulder,true);arms.push(shoulder);
    const leg=new THREE.Group();leg.position.set(side*.12,-.08,0);hips.add(leg);cube(dark,0,-.22,0,.16,.45,.17,leg,true);cube(ink,0,-.46,-.06,.19,.12,.31,leg,true);legs.push(leg);
  }
  const avatarShadow=mesh(plane,footShadow,0,.018,0,1.7,1.7,1,scene);avatarShadow.rotation.x=-Math.PI/2;
  const bubbleMaterial=keepMaterial(new THREE.MeshStandardMaterial({color:0x75f4db,emissive:0x75f4db,emissiveIntensity:.5,transparent:true,opacity:.1,roughness:.25,metalness:.2,depthWrite:false}));
  const shieldBubble=round(bubbleMaterial,0,.82,0,.74,1.02,.74,explorer);shieldBubble.visible=false;
  const scannerRing=mesh(ring,mat(0x79f6df,1.8),0,.045,0,1.05,1.05,1,explorer);scannerRing.rotation.x=-Math.PI/2;scannerRing.visible=false;

  let room={},roomIndex=0,active=false,disposed=false,solved=false,secretVisible=false,exitRoute=null,quietUnlocked=false,frames=0,elapsed=0,roomTime=0,lastHazard=-99;
  let player={x:0,z:5.5,yaw:0},moving=false,walkPhase=0,movementForward=0,movementRight=0,path=[],pathTarget=null,tileContact=null;
  let width=0,height=0,aspect=1,frameMilliseconds=0,pointerStart=null;
  let colliders=[],targetObjects=[],targets=[],doors=[],floor=null,tiles=[],hazards=[],decorations=[];
  const keys=new Set(),tools=new Set();let scannerUntil=0,shieldUntil=0;
  const lookAt=new THREE.Vector3(0,.45,0),desiredLook=new THREE.Vector3(),offset=new THREE.Vector3();
  function roomNumber(value){
    if(Number.isInteger(value.index))return Math.max(0,Math.min(6,value.index));
    if(Number.isInteger(value.id))return Math.max(0,Math.min(6,value.id));
    const kind=String(value.kind||value.id||'').toLowerCase();
    const kinds=['memory','filter','power','bridge','task','final','secret'];const index=kinds.findIndex(k=>kind.includes(k));return index<0?0:index;
  }
  function collider(x,z,w,d){colliders.push({x,z,w,d});}
  function blocked(x,z){
    if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>BOUNDS||Math.abs(z)>BOUNDS)return true;
    return colliders.some(c=>Math.abs(x-c.x)<c.w/2+PLAYER_RADIUS&&Math.abs(z-c.z)<c.d/2+PLAYER_RADIUS);
  }
  function markTarget(object,id){object.userData.targetId=id;targetObjects.push(object);}
  function target(id,x,z,labelText,group){
    const value={id,x,z,label:labelText,group};targets.push(value);group.userData.targetId=id;group.traverse(o=>{if(o.isMesh||o.isSprite)markTarget(o,id)});return value;
  }
  function targetLabel(value,text,color='#ccfff4'){
    if(value.sign){
      roomRoot.remove(value.sign);targetObjects=targetObjects.filter(object=>object!==value.sign);
      const old=[value.sign.material.map,value.sign.material];for(const resource of old){resource.dispose();const index=roomResources.indexOf(resource);if(index>=0)roomResources.splice(index,1);}
    }
    const height=['exit','quiet'].includes(value.id)?3.35:2.65;
    value.sign=label(text,value.x,height,value.z,2.6,.42,{font:64,width:512,height:96,color});markTarget(value.sign,value.id);
  }
  function lightRing(x,z,color,radius=.76){const item=mesh(ring,mat(color,1.8),x,.045,z,radius,radius,1);item.rotation.x=-Math.PI/2;return item;}
  function conduit(a,b,color){const length=Math.hypot(b.x-a.x,b.z-a.z),angle=Math.atan2(b.x-a.x,b.z-a.z);const item=cube(mat(color,.8), (a.x+b.x)/2,.023,(a.z+b.z)/2,.035,.016,length);item.rotation.y=angle;}
  function obstacle(x,z,w,d,h,color=0xe7e6dc){
    collider(x,z,w,d);cube(mat(color),x,h/2,z,w,h,d,roomRoot,true);cube(ink,x,h+.025,z,w+.025,.05,d+.025);cube(mat(PALETTES[roomIndex],1),x,h+.06,z,w*.85,.023,d*.82);
  }
  function terminal(id,x,z,color){
    const group=new THREE.Group();group.position.set(x,0,z);roomRoot.add(group);
    cube(dark,0,.29,0,.92,.58,.84,group,true);cube(ivory,0,.75,0,.74,.43,.62,group,true);
    const screen=cube(mat(color,.65),0,1.02,-.01,.65,.055,.43,group);screen.rotation.x=.18;
    cube(ink,0,1.045,-.01,.56,.03,.35,group);cube(mat(color,1.6),0,1.067,-.05,.4,.015,.035,group);
    cube(mat(color,1.3),0,.41,.435,.45,.04,.025,group);lightRing(x,z,color);
    collider(x,z,.92,.84);const value=target(id,x,z,id==='console'?'CONSOLE':'CLUE',group);targetLabel(value,id==='console'?'[E] CONSOLE':'[E] READ CLUE');return value;
  }
  function makeDoor(id,x,z,color){
    const group=new THREE.Group();group.position.set(x,0,z);roomRoot.add(group);
    cube(ivory,-1.14,1.45,0,.23,2.9,.5,group,true);cube(ivory,1.14,1.45,0,.23,2.9,.5,group,true);cube(ivory,0,2.86,0,2.5,.21,.5,group,true);
    const panels=[];for(const side of [-1,1]){const panel=cube(dark,side*.49,1.38,0,.95,2.7,.15,group,true);const stripe=cube(mat(color,1),side*.49,1.42,.1,.034,2.3,.026,group);panels.push({mesh:panel,stripe,side});}
    const indicator=cube(pink,0,2.85,.275,.75,.04,.025,group);lightRing(x,z,color,.82);
    // The empty opening remains a real raycast target after both panels slide away.
    const portalMaterial=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});roomResources.push(portalMaterial);
    mesh(plane,portalMaterial,0,1.38,.025,2.0,2.7,1,group);
    const value=target(id,x,z,id==='quiet'?'QUIET EXIT':'EXIT',group);targetLabel(value,id==='quiet'?'QUIET // LOCKED':'EXIT // LOCKED','#ffc1d9');if(id==='quiet'){group.visible=false;value.sign.visible=false;}doors.push({panels,indicator,value,enabled:false,amount:0});return value;
  }
  function makeTile(data){
    const group=new THREE.Group();group.position.set(data.x,.055,data.z);roomRoot.add(group);
    cube(dark,0,.02,0,1.4,.13,1.4,group);const trim=cube(mat(0xff77b8,1.05),0,-.011,0,1.5,.028,1.5,group);
    const top=cube(mat(0xddeae6),0,.097,0,1.28,.024,1.28,group);
    const texture=textCanvas(data.id,{font:100,width:128,height:128,color:'#1b2a42',background:'rgba(0,0,0,0)'}),material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});roomResources.push(material);
    const glyph=mesh(plane,material,0,.114,0,.64,.64,1,group);glyph.rotation.x=-Math.PI/2;
    tiles.push({...data,group,trim,top});
  }
  function clearRoom(){
    roomRoot.clear();for(const resource of roomResources.splice(0))resource.dispose();colliders=[];targetObjects=[];targets=[];doors=[];tiles=[];hazards=[];decorations=[];floor=null;
  }
  function loadRoom(value={}){
    if(disposed)return;clearRoom();room=typeof value==='object'&&value?value:{index:Number(value)||0};roomIndex=roomNumber(room);const accent=PALETTES[roomIndex];accentLight.color.set(accent);
    solved=false;secretVisible=false;exitRoute=null;quietUnlocked=false;roomTime=0;scannerUntil=shieldUntil=0;path=[];pathTarget=null;tileContact=null;lastHazard=-99;keys.clear();movementForward=movementRight=0;
    cube(dark,0,-.43,0,16.65,.72,16.65,roomRoot,true);cube(ivory,0,-.07,0,16.4,.16,16.4);
    floor=cube(mat(0x829ca3,0,.78),0,.002,0,16.05,.035,16.05);floor.userData.floor=true;
    // One instanced floor grid gives crisp seams without sixty-four draw calls.
    const floorTiles=new THREE.InstancedMesh(box,ivory,64),matrix=new THREE.Matrix4();
    for(let z=0;z<8;z++)for(let x=0;x<8;x++){matrix.makeScale(1.96,.048,1.96);matrix.setPosition(-7+x*2,.031,-7+z*2);floorTiles.setMatrixAt(z*8+x,matrix);}floorTiles.receiveShadow=true;roomRoot.add(floorTiles);roomResources.push(floorTiles);
    for(const side of [-1,1]){
      cube(mat(accent,1.6),side*8.25,-.14,0,.035,.16,16.5);cube(mat(accent,1.6),0,-.14,side*8.25,16.5,.16,.035);
      cube(ivory,side*7.95,.24,0,.23,.44,16);cube(ivory,0,.24,side*7.95,16,.44,.23);
      for(const z of [-6.5,6.5]){cube(dark,side*7.8,.95,z,.44,1.55,.44,roomRoot,true);cube(mat(accent,1.5),side*7.8,1.75,z,.35,.08,.35);}
      cube(dark,side*6.3,-1.16,0,1.2,.8,10.5);cube(mat(accent,.9),side*6.3,-1.6,0,.2,.04,10.5);
    }
    // Floating fragments and hanging conduits frame a room rather than blocking its route.
    for(let i=0;i<5;i++){const x=-10.5-i*.8,z=-5+i*2.25;const fragment=cube(i%2?ivory:dark,x,-.6-i*.32,z,1.3,.35,1.7);fragment.rotation.y=i*.16;decorations.push({mesh:fragment,baseY:fragment.position.y,phase:i});}
    label(room.title||room.name||TITLES[roomIndex],0,3.9,-7.25,4.8,.57,{font:54,color:'#a1fff0'});
    label(`SECTOR ${String(roomIndex+1).padStart(2,'0')}  /  MIND MAZE`,0,.21,6.85,3.7,.42,{font:54,background:'rgba(13,28,42,.82)'});
    const consoleTarget=terminal('console',TARGETS.console.x,TARGETS.console.z,accent);
    const clueTarget=terminal('clue',TARGETS.clue.x,TARGETS.clue.z,accent);
    const glyphs=Array.isArray(room.glyphs)?room.glyphs:Array.isArray(room.clue?.glyphs)?room.clue.glyphs:Array.isArray(room.clue?.sequence)?room.clue.sequence:roomIndex===0?[2,4,1,3]:roomIndex===2?['A','B','C','D']:roomIndex===3?['A','C','D','F']:['◇','○','△'];
    const clueLines=[glyphs.map(g=>GLYPHS[g]||String(g)).join('   '),roomIndex===0?'OBSERVE  //  REMEMBER':roomIndex===3?'FOLLOW THE SAFE SIGNAL':'OBSERVE THE PATTERN'];
    const clueDisplay=label(clueLines,clueTarget.x,1.78,clueTarget.z,3.3,1.0,{font:65,width:512,height:240,color:'#b7fff0'});markTarget(clueDisplay,'clue');
    const consoleMark=label(['◇  ◉  △','INPUT TERMINAL'],consoleTarget.x,1.75,consoleTarget.z,2.5,.8,{font:65,width:512,height:240});markTarget(consoleMark,'console');
    makeDoor('exit',TARGETS.exit.x,TARGETS.exit.z,accent);if(roomIndex===5)makeDoor('quiet',TARGETS.quiet.x,TARGETS.quiet.z,0x9af7d5);
    const secretGroup=new THREE.Group();secretGroup.position.set(TARGETS.secret.x,0,TARGETS.secret.z);roomRoot.add(secretGroup);
    const secretOrb=mesh(cone,mat(0xffd18b,1.25),0,1.12,0,.44,.8,.44,secretGroup);secretOrb.rotation.z=Math.PI;cube(dark,0,.17,0,.65,.3,.65,secretGroup);
    const secretTarget=target('secret',TARGETS.secret.x,TARGETS.secret.z,'HIDDEN CHANNEL',secretGroup);targetLabel(secretTarget,'HIDDEN CHANNEL','#ffdfad');secretGroup.visible=false;secretTarget.sign.visible=false;
    conduit(TARGETS.console,{x:-2,z:-5.6},accent);conduit({x:-2,z:-5.6},TARGETS.exit,accent);conduit(TARGETS.clue,{x:2,z:-5.6},accent);conduit({x:2,z:-5.6},TARGETS.exit,accent);
    if(roomIndex===3){
      for(const tile of BRIDGE_TILES)makeTile(tile);
      for(const [i,h] of [{x:-4.6,z:.4,w:2.3,d:.13},{x:4.5,z:-1.5,w:2.3,d:.13},{x:0,z:-5.3,w:1.9,d:.13}].entries()){
        const material=new THREE.MeshStandardMaterial({color:0xff609d,emissive:0xff388c,emissiveIntensity:2,transparent:true,opacity:.8,depthWrite:false});roomResources.push(material);
        const strip=cube(material,h.x,.14,h.z,h.w,.15,h.d);hazards.push({...h,mesh:strip,phase:i*.8,on:false});
        for(const side of [-1,1])cube(dark,h.x+side*(h.w/2+.07),.27,h.z,.18,.45,.28,roomRoot,true);
      }
      obstacle(-5.9,1.4,.8,3.0,1.05);obstacle(5.9,-.8,.8,3.0,1.05);
    } else {
      const layouts=[
        [{x:-2.75,z:.4,w:.7,d:3.5,h:1.12},{x:2.75,z:-.65,w:.7,d:3.5,h:1.12}],
        [{x:-2.8,z:1,w:2.0,d:.65,h:1.05},{x:2.8,z:-1.1,w:2.0,d:.65,h:1.05}],
        [{x:-2.8,z:.4,w:.7,d:3.6,h:1.12},{x:2.8,z:.4,w:.7,d:3.6,h:1.12}],
        [],
        [{x:-2.5,z:-.1,w:.7,d:3.5,h:1.15},{x:2.6,z:1.2,w:.7,d:3.5,h:1.15}],
        [{x:-3.0,z:.2,w:.8,d:3.6,h:1.05},{x:3.0,z:.2,w:.8,d:3.6,h:1.05}],
        [{x:-3.1,z:.4,w:.6,d:2.5,h:.75},{x:3.1,z:.4,w:.6,d:2.5,h:.75}]
      ];
      const obstacles=Array.isArray(room.obstacles)?room.obstacles:layouts[roomIndex];for(const o of obstacles)if([o.x,o.z,o.w,o.d].every(Number.isFinite))obstacle(o.x,o.z,o.w,o.d,Number.isFinite(o.h)?o.h:1.1);
      for(const side of [-1,1]){
        const node=round(mat(accent,1.15),side*2.75,1.6,.35,.16,.16,.16);decorations.push({mesh:node,baseY:1.6,phase:side});
        lightRing(side*2.75,.35,accent,.36);
      }
    }
    if(roomIndex===0){
      for(let i=0;i<4;i++){const x=-5.6+i*.75,z=-.2;cube(dark,x,.18,z,.35,.32,.35);const mote=round(mat(i%2?0xff8bbb:accent,1.2),x,.75+i*.1,z,.15,.15,.15);decorations.push({mesh:mote,baseY:mote.position.y,phase:i});}
    }else if(roomIndex===1){
      for(let i=0;i<3;i++){const x=5.65,z=.2+i*.9;cube(dark,x,.32,z,.65,.6,.55);cube(mat(i===1?0xff7daf:accent,.75),x,.68,z,.49,.08,.43);}
    }else if(roomIndex===2){
      for(let i=0;i<4;i++){const x=-3+i*2;cube(dark,x,.15,-5.1,.45,.24,.6);cube(mat(accent,1.4),x,.31,-5.1,.34,.045,.42);cube(ivory,x,.63,-5.1,.12,.56,.12);round(mat(accent,1.3),x,.96,-5.1,.13,.13,.13);}
    }else if(roomIndex===4){
      for(let i=0;i<4;i++){const x=i<2?-5.7:5.7,z=.3+(i%2)*1.25;cube(dark,x,.35,z,.72,.64,.6);cube(mat(accent,1.05),x,.71,z,.58,.06,.46);label(['PLAN','WIRE','TEST','SEND'][i],x,1.25,z,1.25,.3,{font:55,width:256,height:96});}
    }else if(roomIndex===5){
      cube(dark,0,.17,-2.6,.8,.29,.8);collider(0,-2.6,.8,.8);const core=mesh(cone,mat(accent,.8),0,1.05,-2.6,.42,.95,.42);decorations.push({mesh:core,baseY:1.05,phase:2});lightRing(0,-2.6,accent,.65);conduit({x:0,z:-2.6},TARGETS.exit,accent);conduit({x:0,z:-2.6},TARGETS.quiet,0x9af7d5);
    }else if(roomIndex===6){
      cube(ivory,-5.5,.42,.8,1.4,.15,.9);cube(dark,-5.5,.2,.8,.12,.4,.6);cube(mat(accent,.15),-5.5,.53,.8,.54,.04,.36);label(['EINE SACHE','PAUSE'],-5.5,1.15,.8,2,.64,{font:60,width:400,height:180,color:'#ffe3ac'});
    }
    const spawn=room.spawn||{x:0,z:5.5};player={x:0,z:5.5,yaw:0};setPlayerPosition(spawn);lookAt.set(0,.45,0);explorer.position.set(player.x,.09,player.z);
    setSolved(room.solved===true);setSecretVisible(room.secretVisible===true);setExitRoute(room.exitRoute||null,room.quietUnlocked===true);
    scene.updateMatrixWorld(true);resize();
  }
  function setSolved(value){
    const next=Boolean(value);if(next===solved)return;solved=next;
    refreshDoors();
  }
  function refreshDoors(){
    for(const door of doors){
      const quiet=door.value.id==='quiet';door.enabled=solved&&(roomIndex!==5||(quiet?exitRoute==='quiet':exitRoute==='balanced'));
      if(quiet){door.value.group.visible=quietUnlocked;door.value.sign.visible=quietUnlocked;}
      door.indicator.material=door.enabled?mat(0x8effd5,1.6):pink;
      targetLabel(door.value,door.enabled?(quiet?'[E] QUIET ROUTE':'[E] EXIT OPEN'):(quiet?'QUIET // LOCKED':'EXIT // LOCKED'),door.enabled?'#b7ffde':'#ffc1d9');
      door.value.sign.visible=door.value.group.visible;
    }
  }
  function setExitRoute(route,unlocked=false){
    const next=route==='quiet'?'quiet':route==='balanced'||route==='exit'?'balanced':null,showQuiet=Boolean(unlocked);
    if(next===exitRoute&&showQuiet===quietUnlocked)return;exitRoute=next;quietUnlocked=showQuiet;refreshDoors();
  }
  function setSecretVisible(value){secretVisible=Boolean(value);const target=targets.find(t=>t.id==='secret');if(target){target.group.visible=secretVisible;target.sign.visible=secretVisible;}}
  function visibleTargets(){return targets.filter(t=>t.group.visible&&!(roomIndex===5&&solved&&['exit','quiet'].includes(t.id)&&!doors.find(d=>d.value===t)?.enabled));}
  function nearestTarget(){return visibleTargets().map(t=>({target:t,distance:Math.hypot(player.x-t.x,player.z-t.z)})).sort((a,b)=>a.distance-b.distance)[0];}
  function interact(){if(!active)return;const near=nearestTarget();if(near&&near.distance<=2.0)onInteract(near.target.id);}
  function setPlayerPosition(value={}){
    const x=Number.isFinite(value.x)?THREE.MathUtils.clamp(value.x,-BOUNDS,BOUNDS):player.x,z=Number.isFinite(value.z)?THREE.MathUtils.clamp(value.z,-BOUNDS,BOUNDS):player.z;
    if(!blocked(x,z)){player.x=x;player.z=z;}
    if(Number.isFinite(value.yaw))player.yaw=value.yaw;
    path=[];pathTarget=null;tileContact=null;explorer.position.set(player.x,.09,player.z);avatarShadow.position.set(player.x,.07,player.z);
  }
  // A* lets real floor clicks route around actual colliders, including tight corners.
  function walkTo(x,z,targetId=null){
    const unit=.45,min=-7.2,size=33,toCell=(v)=>Math.max(0,Math.min(size-1,Math.round((v-min)/unit))),point=(x,z)=>({x:min+x*unit,z:min+z*unit});
    const start={x:toCell(player.x),z:toCell(player.z)},end={x:toCell(x),z:toCell(z)},id=(x,z)=>z*size+x;
    const startId=id(start.x,start.z),endId=id(end.x,end.z),open=[startId],came=new Map(),g=new Map([[startId,0]]),f=new Map([[startId,Math.hypot(start.x-end.x,start.z-end.z)]]),closed=new Set();
    const valid=(cx,cz)=>cx>=0&&cz>=0&&cx<size&&cz<size&&!blocked(point(cx,cz).x,point(cx,cz).z);
    if(!valid(end.x,end.z))return;
    while(open.length){
      open.sort((a,b)=>f.get(a)-f.get(b));const current=open.shift();if(current===endId){const cells=[];let cursor=current;while(cursor!==startId){cells.push(point(cursor%size,Math.floor(cursor/size)));cursor=came.get(cursor);if(cursor==null)return;}path=cells.reverse();pathTarget=targetId;return;}
      closed.add(current);const cx=current%size,cz=Math.floor(current/size);
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
        if(!dx&&!dz)continue;const nx=cx+dx,nz=cz+dz,key=id(nx,nz);if(!valid(nx,nz)||closed.has(key)||(dx&&dz&&(!valid(cx+dx,cz)||!valid(cx,cz+dz))))continue;
        const score=g.get(current)+Math.hypot(dx,dz);if(score<(g.get(key)??Infinity)){came.set(key,current);g.set(key,score);f.set(key,score+Math.hypot(nx-end.x,nz-end.z));if(!open.includes(key))open.push(key);}
      }
    }
  }
  function pointerClick(event){
    if(!active)return;const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);scene.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects([floor,...targetObjects.filter(o=>{let parent=o;while(parent){if(!parent.visible)return false;parent=parent.parent;}return true;})],false)[0];if(!hit)return;
    const targetId=hit.object.userData.targetId;
    if(targetId){const t=visibleTargets().find(t=>t.id===targetId);if(!t)return;const distance=Math.hypot(player.x-t.x,player.z-t.z);if(distance<=2)onInteract(targetId);else{const dx=player.x-t.x,dz=player.z-t.z,scale=1.55/Math.max(.001,Math.hypot(dx,dz));walkTo(t.x+dx*scale,t.z+dz*scale,targetId);}}
    else if(hit.object===floor)walkTo(THREE.MathUtils.clamp(hit.point.x,-7.2,7.2),THREE.MathUtils.clamp(hit.point.z,-7.2,7.2));
  }
  function move(dt){
    const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)+movementForward;
    const right=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+movementRight;
    let dx=(right-forward)*Math.SQRT1_2,dz=(-forward-right)*Math.SQRT1_2;
    if(Math.abs(dx)+Math.abs(dz)>.01){path=[];pathTarget=null;}
    else if(path.length){
      while(path.length&&Math.hypot(path[0].x-player.x,path[0].z-player.z)<.15)path.shift();
      if(path.length){dx=path[0].x-player.x;dz=path[0].z-player.z;}
      else{const id=pathTarget;pathTarget=null;if(id){const target=targets.find(t=>t.id===id);if(target&&Math.hypot(player.x-target.x,player.z-target.z)<=2)onInteract(id);}}
    }
    const length=Math.hypot(dx,dz);moving=false;
    if(length>.001){const speed=SPEED*(keys.has('ShiftLeft')||keys.has('ShiftRight')?1.28:1);dx=dx/length*speed*dt;dz=dz/length*speed*dt;const oldX=player.x,oldZ=player.z;
      if(!blocked(player.x+dx,player.z))player.x+=dx;if(!blocked(player.x,player.z+dz))player.z+=dz;
      moving=Math.hypot(player.x-oldX,player.z-oldZ)>.0001;if(moving){player.yaw=Math.atan2(-(player.x-oldX),-(player.z-oldZ));onMove({...player});}else if(path.length){path=[];pathTarget=null;}
    }
    const touched=tiles.find(tile=>Math.abs(player.x-tile.x)<.71&&Math.abs(player.z-tile.z)<.71)?.id||null;
    if(touched!==tileContact){tileContact=touched;if(touched)onTile(touched);}
    if(elapsed<scannerUntil)return;
    const hazard=hazards.find(h=>h.on&&Math.abs(player.x-h.x)<h.w/2+PLAYER_RADIUS&&Math.abs(player.z-h.z)<h.d/2+PLAYER_RADIUS);
    if(hazard&&elapsed-lastHazard>1.4){lastHazard=elapsed;onHazard({id:`laser-${hazards.indexOf(hazard)+1}`,x:player.x,z:player.z,shielded:elapsed<shieldUntil});}
  }
  function setActive(value){active=Boolean(value);keys.clear();movementForward=movementRight=0;path=[];pathTarget=null;moving=false;}
  function setTool(id,value){if(value)tools.add(id);else{tools.delete(id);if(id==='shield')shieldUntil=0;}packLed.material=tools.size?mat(0xffc98b,1.6):mat(0x79f6df,1.8);}
  function useTool(id){if(id==='scanner'){scannerUntil=elapsed+6;}else if(id==='shield'){shieldUntil=elapsed+6;}setTool(id,true);}
  function resize(){const w=Math.max(1,Math.round(canvas.clientWidth||globalThis.innerWidth||800)),h=Math.max(1,Math.round(canvas.clientHeight||globalThis.innerHeight||600));if(w!==width||h!==height){width=w;height=h;aspect=w/h;renderer.setSize(w,h,false);}}
  function update(dt,time){
    if(disposed)return;const began=performance.now(),step=THREE.MathUtils.clamp(Number.isFinite(dt)?dt:0,0,.05);if(active){elapsed+=step;if(elapsed>=scannerUntil)roomTime+=step;}
    const t=Number.isFinite(time)?time:elapsed;resize();
    for(const hazard of hazards){hazard.on=active&&elapsed>=scannerUntil&&((roomTime+hazard.phase)%2.8)<1.5;hazard.mesh.material.opacity=hazard.on?.86:.12;hazard.mesh.material.emissiveIntensity=hazard.on?2.4:.18;hazard.mesh.position.y=hazard.on?.14:.065;}
    if(active)move(step);
    walkPhase+=moving?step*10:0;hips.position.y=.62+(moving?Math.abs(Math.sin(walkPhase))*.035:Math.sin(t*1.8)*.006);
    for(let i=0;i<2;i++){legs[i].rotation.x=moving?Math.sin(walkPhase+i*Math.PI)*.48:THREE.MathUtils.damp(legs[i].rotation.x,0,12,step);arms[i].rotation.x=moving?-Math.sin(walkPhase+i*Math.PI)*.36:THREE.MathUtils.damp(arms[i].rotation.x,0,12,step);}
    const angleDelta=THREE.MathUtils.euclideanModulo(player.yaw-explorer.rotation.y+Math.PI,Math.PI*2)-Math.PI;
    explorer.position.set(player.x,.09,player.z);explorer.rotation.y+=angleDelta*(1-Math.exp(-14*step));avatarShadow.position.set(player.x,.07,player.z);
    scannerRing.visible=elapsed<scannerUntil;scannerRing.scale.setScalar(1.05+Math.sin(t*5)*.10);shieldBubble.visible=tools.has('shield')||elapsed<shieldUntil;shieldBubble.rotation.y=t*.2;
    for(const tile of tiles){const revealed=elapsed<scannerUntil;tile.trim.material=mat(revealed?(tile.safe?0x65f4bf:0xff569e):0xff77b8,revealed?1.7:1.05);tile.group.position.y=.055+(tile.id===tileContact?.035:0);}
    for(const door of doors){door.amount=THREE.MathUtils.damp(door.amount,door.enabled?1:0,4,step);for(const panel of door.panels)panel.stripe.position.x=panel.mesh.position.x=panel.side*(.49+door.amount);}
    for(const deco of decorations){deco.mesh.position.y=deco.baseY+Math.sin(t*1.2+deco.phase)*.075;if(deco.mesh.geometry===sphere)deco.mesh.rotation.y=t*.6;}
    stars.rotation.y=t*.004;
    desiredLook.set(active?player.x*.58:0,.45,active?player.z*.58:-.3);lookAt.lerp(desiredLook,1-Math.exp(-step*4));
    const angle=Math.PI/4+(active?0:Math.sin(t*.08)*.1),radius=19.8;offset.set(Math.sin(angle)*radius,18.2,Math.cos(angle)*radius);camera.position.copy(lookAt).add(offset);camera.lookAt(lookAt);
    const halfHeight=active?Math.max(8.3,5.2/aspect):Math.max(10.8,10.8/aspect);camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
    renderer.render(scene,camera);frames++;frameMilliseconds=performance.now()-began;
  }
  function listen(target,event,handler,options){target.addEventListener(event,handler,options);listeners.push(()=>target.removeEventListener(event,handler,options));}
  listen(globalThis,'resize',resize);
  listen(document,'keydown',event=>{if(!active||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)||event.target?.isContentEditable)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(event.code)){keys.add(event.code);event.preventDefault();}else if(event.code==='KeyE'&&!event.repeat){event.preventDefault();interact();}});
  listen(document,'keyup',event=>keys.delete(event.code));listen(globalThis,'blur',()=>{keys.clear();movementForward=movementRight=0;path=[];pathTarget=null;moving=false;});
  listen(canvas,'pointerdown',event=>{if(active&&event.button===0)pointerStart={x:event.clientX,y:event.clientY,id:event.pointerId};});
  listen(canvas,'pointerup',event=>{if(pointerStart&&pointerStart.id===event.pointerId&&Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)<9)pointerClick(event);pointerStart=null;});
  listen(canvas,'pointercancel',()=>pointerStart=null);
  function dispose(){if(disposed)return;disposed=true;active=false;for(const remove of listeners)remove();clearRoom();for(const material of materials)material.dispose();for(const geometry of geometries)geometry.dispose();for(const texture of textures)texture.dispose();renderer.dispose();scene.clear();}
  function projectPoint({x=0,y=.08,z=0}={}){const projected=new THREE.Vector3(x,y,z).project(camera);return{x:(projected.x+1)*width/2,y:(1-projected.y)*height/2,visible:Math.abs(projected.x)<=1&&Math.abs(projected.y)<=1&&projected.z>=-1&&projected.z<=1};}
  loadRoom({index:0});
  return {loadRoom,update,setActive,setSolved,setSecretVisible,setExitRoute,setTool,useTool,dispose,setPlayerPosition,projectPoint,
    getPlayerPosition:()=>({...player}),setMovement:(forward=0,right=0)=>{movementForward=THREE.MathUtils.clamp(Number(forward)||0,-1,1);movementRight=THREE.MathUtils.clamp(Number(right)||0,-1,1);},
    getTargets:()=>visibleTargets().map(({id,x,z,label})=>({id,x,z,label})),getTiles:()=>tiles.map(({id,x,z})=>({id,x,z})),
    distanceToTarget:id=>{const target=visibleTargets().find(t=>t.id===id);return target?Math.hypot(player.x-target.x,player.z-target.z):Infinity;},
    getStats:()=>{let objects=0,meshes=0;scene.traverse(o=>{objects++;if(o.isMesh)meshes++;});return{renderedFrames:frames,objects,meshes,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,frameMilliseconds,roomIndex,active,solved,secretVisible,exitRoute,quietUnlocked,webgl2:true,player:{...player},pathSteps:path.length,targets:visibleTargets().map(({id,x,z,label})=>({id,x,z,label})),tiles:tiles.map(({id,x,z})=>({id,x,z})),targetScreenPositions:Object.fromEntries(visibleTargets().map(target=>[target.id,projectPoint({x:target.x,y:1.05,z:target.z})])),tileScreenPositions:Object.fromEntries(tiles.map(tile=>[tile.id,projectPoint({x:tile.x,y:.12,z:tile.z})])),bounds:{minX:-BOUNDS,maxX:BOUNDS,minZ:-BOUNDS,maxZ:BOUNDS},scannerActive:elapsed<scannerUntil,shieldActive:tools.has('shield')||elapsed<shieldUntil};}
  };
}
