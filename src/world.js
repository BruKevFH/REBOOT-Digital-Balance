import * as THREE from 'three';

export const HUBS = [
  {name: 'MORNING // HOME', x: -13, z: 10, color: 0xffb85f},
  {name: 'CAMPUS // SIGNAL SCHOOL', x: -13, z: -12, color: 0x54dcff},
  {name: 'RESET PARK', x: 12, z: -12, color: 0x8dffa8},
  {name: 'FOCUSBAND // MEDTECH LAB', x: 17, z: 8, color: 0x50f4eb},
  {name: 'ONE MORE // ARCADE', x: 0, z: 20, color: 0xa883ff},
  {name: 'NIGHT GARDEN', x: -18, z: 21, color: 0xff80c3},
];

const PEOPLE = {
  mia: {name: 'MIA', role: 'CONTENT & SOCIAL', color: 0xff80c3},
  leon: {name: 'LEON', role: 'GAMING SQUAD', color: 0xa883ff},
  sami: {name: 'SAMI', role: 'MEDTECH LAB', color: 0x50f4eb},
  nora: {name: 'NORA', role: 'SPORT & CAMPUS', color: 0x8dffa8},
};
const DEFAULT_PEOPLE = ['mia', 'sami', 'nora', 'sami', 'leon', 'mia'];
const EYE_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.32;

// Every texture and mesh is generated locally. The bundled game also runs on file://.
export function createWorld({canvas, onInteract, onPause, onMove} = {}) {
  if (!canvas) throw new Error('REBOOT benötigt eine Spielfläche.');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false, powerPreference: 'high-performance'});
  } catch {
    throw new Error('Dein Browser konnte WebGL 2 nicht starten. Aktiviere die Hardwarebeschleunigung oder öffne REBOOT in einem aktuellen Chrome, Edge oder Firefox.');
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x12213a, 0.017);
  const camera = new THREE.PerspectiveCamera(74, 1, 0.08, 180);
  camera.rotation.order = 'YXZ';
  const resources = {geometries: new Set(), materials: new Set(), textures: new Set()};
  const colliders = [];
  const focusOccluders = [];
  const billboardSigns = [];
  const robots = [];
  const keys = new Set();
  const events = [];
  const scratch = {direction: new THREE.Vector3(), right: new THREE.Vector3(), matrix: new THREE.Matrix4(), quaternion: new THREE.Quaternion(), position: new THREE.Vector3(), scale: new THREE.Vector3()};
  let active = false;
  let disposed = false;
  let elapsed = 0;
  let targetIndex = 0;
  let frames = 0;
  let frameMilliseconds = 0;
  let velocityX = 0;
  let velocityZ = 0;
  let intentionalUnlock = false;
  let hadPointerLock = false;
  let drag = null;
  let focusTarget = null;
  let lastWidth = 0;
  let lastHeight = 0;
  let movementForward = 0;
  let movementRight = 0;
  const player = {x: HUBS[0].x, z: HUBS[0].z + 3.4, yaw: 0, pitch: 0};

  let seed = 2121;
  const random = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
  const keepGeometry = g => {resources.geometries.add(g); return g;};
  const keepMaterial = m => {resources.materials.add(m); return m;};
  const keepTexture = t => {resources.textures.add(t); return t;};
  const cube = keepGeometry(new THREE.BoxGeometry(1, 1, 1));
  const sphere = keepGeometry(new THREE.SphereGeometry(1, 14, 10));
  const cylinder = keepGeometry(new THREE.CylinderGeometry(1, 1, 1, 16));
  const plane = keepGeometry(new THREE.PlaneGeometry(1, 1));
  const materialCache = new Map();

  function material(color, glow = 0, metalness = 0.2, roughness = 0.45) {
    const key = `${color}:${glow}:${metalness}:${roughness}`;
    if (!materialCache.has(key)) materialCache.set(key, keepMaterial(new THREE.MeshStandardMaterial({color, emissive: color, emissiveIntensity: glow, metalness, roughness})));
    return materialCache.get(key);
  }
  function mesh(geometry, mat, x, y, z, sx = 1, sy = 1, sz = 1, parent = scene, shadow = true) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.scale.set(sx, sy, sz);
    object.castShadow = shadow;
    object.receiveShadow = true;
    parent.add(object);
    if (shadow) focusOccluders.push(object);
    return object;
  }
  function boxCollider(x, z, width, depth) {colliders.push({type: 'box', x, z, width: width / 2, depth: depth / 2});}
  function circleCollider(x, z, radius) {colliders.push({type: 'circle', x, z, radius});}
  function makeCanvas(width, height) {
    const surface = document.createElement('canvas'); surface.width = width; surface.height = height;
    return [surface, surface.getContext('2d')];
  }
  function labelTexture(title, subtitle = '', color = 0x54dcff) {
    const [surface, ctx] = makeCanvas(768, 160);
    const tint = `#${new THREE.Color(color).getHexString()}`;
    ctx.fillStyle = 'rgba(7, 16, 31, .86)'; ctx.fillRect(4, 5, 760, 148);
    ctx.strokeStyle = tint; ctx.lineWidth = 4; ctx.strokeRect(4, 5, 760, 148);
    ctx.fillStyle = tint; ctx.textAlign = 'center'; ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.fillText(title, 384, subtitle ? 69 : 100, 730);
    if (subtitle) {ctx.fillStyle = '#e5f6ff'; ctx.font = '24px system-ui, sans-serif'; ctx.fillText(subtitle, 384, 119, 725);}
    const texture = keepTexture(new THREE.CanvasTexture(surface)); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  function sign(title, subtitle, x, y, z, width = 3.5, color = 0x54dcff) {
    const mat = keepMaterial(new THREE.MeshBasicMaterial({map: labelTexture(title, subtitle, color), transparent: true, side: THREE.DoubleSide, depthWrite: false}));
    const object = mesh(plane, mat, x, y, z, width, width / 4.8, 1, scene, false);
    billboardSigns.push(object);
    return object;
  }

  const [skySurface, skyContext] = makeCanvas(1024, 512);
  const skyGradient = skyContext.createLinearGradient(0, 0, 0, 512);
  skyGradient.addColorStop(0, '#030815'); skyGradient.addColorStop(0.40, '#0a1633'); skyGradient.addColorStop(0.56, '#25446d'); skyGradient.addColorStop(0.71, '#233448'); skyGradient.addColorStop(1, '#070b13');
  skyContext.fillStyle = skyGradient; skyContext.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 120; i++) {skyContext.fillStyle = `rgba(164,206,255,${0.25 + random() * 0.55})`; skyContext.fillRect(random() * 1024, random() * 210, 1 + random(), 1 + random());}
  for (let i = 0; i < 35; i++) {skyContext.fillStyle = ['#223c58', '#25435f', '#163247'][i % 3]; skyContext.fillRect(i * 31, 276 - random() * 32, 18 + random() * 20, 28 + random() * 55);}
  const sky = keepTexture(new THREE.CanvasTexture(skySurface)); sky.colorSpace = THREE.SRGBColorSpace; sky.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = sky;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromEquirectangular(sky);
  scene.environment = environment.texture; scene.environmentIntensity = 0.8;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(0xa1c5ff, 0x151325, 2.25); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xb7d1ff, 2.8); sun.position.set(-12, 28, 15); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -34; sun.shadow.camera.right = 34; sun.shadow.camera.top = 34; sun.shadow.camera.bottom = -34;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 85; sun.shadow.normalBias = 0.04; sun.shadow.bias = -0.0002;
  scene.add(sun); scene.add(sun.target);

  const [gridSurface, gridContext] = makeCanvas(256, 256);
  gridContext.fillStyle = '#182238'; gridContext.fillRect(0, 0, 256, 256);
  gridContext.strokeStyle = '#24354d'; gridContext.lineWidth = 2;
  for (let i = 0; i <= 256; i += 64) {gridContext.beginPath(); gridContext.moveTo(i, 0); gridContext.lineTo(i, 256); gridContext.moveTo(0, i); gridContext.lineTo(256, i); gridContext.stroke();}
  const grid = keepTexture(new THREE.CanvasTexture(gridSurface)); grid.colorSpace = THREE.SRGBColorSpace; grid.wrapS = grid.wrapT = THREE.RepeatWrapping; grid.repeat.set(12, 12); grid.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const groundMaterial = keepMaterial(new THREE.MeshStandardMaterial({color: 0x697e9a, map: grid, roughness: 0.68, metalness: 0.22}));
  const ground = mesh(plane, groundMaterial, 0, -0.03, 0, 84, 84, 1, scene, false); ground.rotation.x = -Math.PI / 2;
  const polished = keepMaterial(new THREE.MeshPhysicalMaterial({color: 0x1d3447, metalness: 0.45, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.09}));
  const plaza = mesh(cylinder, polished, 0, 0.012, 0, 8.5, 0.03, 8.5, scene, false);
  for (const radius of [7.8, 6.9]) {
    const ring = mesh(keepGeometry(new THREE.TorusGeometry(radius, 0.025, 6, 64)), material(0x39c6ef, 1.2), 0, 0.045, 0, 1, 1, 1, scene, false); ring.rotation.x = Math.PI / 2;
  }
  const fountain = mesh(cylinder, material(0x172b42), 0, 0.24, 0, 1.2, 0.45, 1.2); circleCollider(0, 0, 1.2);
  mesh(cylinder, polished, 0, 0.50, 0, 1.04, 0.08, 1.04, scene, false);
  const centerCrystal = mesh(keepGeometry(new THREE.OctahedronGeometry(0.62)), material(0x53effa, 1.8, 0.35), 0, 1.82, 0);
  sign('REBOOT', 'OWN YOUR DAY // NEON BALANCE', 0, 4.1, 0, 4.8, 0x68eaff);

  for (const hub of HUBS) {
    const length = Math.hypot(hub.x, hub.z);
    const angle = Math.atan2(hub.x, hub.z);
    const path = mesh(cube, polished, hub.x / 2, 0.015, hub.z / 2, 2.7, 0.03, length, scene, false); path.rotation.y = angle;
    for (const side of [-1, 1]) {
      const rail = mesh(cube, material(hub.color, 1.4), hub.x / 2 + Math.cos(angle) * side * 1.39, 0.04, hub.z / 2 - Math.sin(angle) * side * 1.39, 0.032, 0.025, length, scene, false); rail.rotation.y = angle;
    }
  }

  // Windows use one instanced draw call instead of hundreds of individual objects.
  const windowPositions = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const radius = 33 + random() * 4;
    const x = Math.sin(angle) * radius, z = Math.cos(angle) * radius;
    const width = 3.4 + random() * 2.5, depth = 3.1 + random() * 2.4, height = 9 + random() * 16;
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = angle; scene.add(group);
    mesh(cube, material(i % 3 === 0 ? 0x193047 : 0x111e32, 0, 0.48, 0.35), 0, height / 2, 0, width, height, depth, group);
    const accent = HUBS[i % HUBS.length].color;
    mesh(cube, material(accent, 1.8), 0, height + 0.07, 0, width + 0.15, 0.12, depth + 0.15, group, false);
    mesh(cube, material(accent, 1.3), -width / 2 + 0.06, height / 2, -depth / 2 - 0.035, 0.055, height, 0.035, group, false);
    const roof = mesh(cube, material(0x273448), 0.3, height + 0.62, 0, width * 0.42, 1.0, depth * 0.5, group);
    group.updateMatrixWorld(true);
    for (let level = 1; level < height - 0.8; level += 1.25) for (let col = -width / 2 + 0.48; col < width / 2 - 0.35; col += 0.9) {
      if (random() < 0.2) continue;
      const position = new THREE.Vector3(col, level, -depth / 2 - 0.04).applyMatrix4(group.matrixWorld);
      windowPositions.push({position, angle, color: accent, brightness: 0.35 + random() * 0.65});
    }
    const aabbWidth = Math.abs(Math.cos(angle)) * width + Math.abs(Math.sin(angle)) * depth;
    const aabbDepth = Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * depth;
    boxCollider(x, z, aabbWidth, aabbDepth);
  }
  const windows = new THREE.InstancedMesh(cube, keepMaterial(new THREE.MeshBasicMaterial({color: 0xffffff})), windowPositions.length);
  for (let i = 0; i < windowPositions.length; i++) {
    const item = windowPositions[i]; scratch.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), item.angle); scratch.scale.set(0.55, 0.65, 0.035); scratch.matrix.compose(item.position, scratch.quaternion, scratch.scale);
    windows.setMatrixAt(i, scratch.matrix); windows.setColorAt(i, new THREE.Color(item.color).multiplyScalar(item.brightness));
  }
  windows.instanceMatrix.needsUpdate = true; windows.instanceColor.needsUpdate = true; scene.add(windows);

  const glowSurface = makeCanvas(128, 128);
  const glowGradient = glowSurface[1].createRadialGradient(64, 64, 0, 64, 64, 64); glowGradient.addColorStop(0, 'rgba(255,255,255,.85)'); glowGradient.addColorStop(.18, 'rgba(255,255,255,.45)'); glowGradient.addColorStop(1, 'rgba(255,255,255,0)'); glowSurface[1].fillStyle = glowGradient; glowSurface[1].fillRect(0, 0, 128, 128);
  const glowTexture = keepTexture(new THREE.CanvasTexture(glowSurface[0]));
  function halo(color, x, y, z, size = 1, parent = scene) {
    const sprite = new THREE.Sprite(keepMaterial(new THREE.SpriteMaterial({map: glowTexture, color, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false})));
    sprite.position.set(x, y, z); sprite.scale.set(size, size, 1); parent.add(sprite); return sprite;
  }
  const targetRing = mesh(keepGeometry(new THREE.TorusGeometry(2.1, 0.055, 8, 48)), material(HUBS[0].color, 2.4), HUBS[0].x, 0.1, HUBS[0].z, 1, 1, 1, scene, false); targetRing.rotation.x = Math.PI / 2;
  const beaconMaterial = keepMaterial(new THREE.MeshBasicMaterial({color: HUBS[0].color, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide}));
  const beacon = mesh(cylinder, beaconMaterial, HUBS[0].x, 3.1, HUBS[0].z, 0.8, 6, 0.8, scene, false);

  function makeRobot(hub, identity) {
    const group = new THREE.Group(); group.position.set(hub.x, 0.10, hub.z); scene.add(group);
    const body = keepMaterial(new THREE.MeshStandardMaterial({color: identity.color, roughness: 0.3, metalness: 0.55}));
    const visor = keepMaterial(new THREE.MeshStandardMaterial({color: identity.color, emissive: identity.color, emissiveIntensity: 1.7, metalness: 0.2, roughness: 0.25}));
    const dark = material(0x101b2d, 0, 0.5, 0.3);
    for (const side of [-1, 1]) {
      mesh(cube, dark, side * 0.15, 0.10, -0.035, 0.22, 0.18, 0.34, group);
      mesh(cylinder, body, side * 0.15, 0.36, 0, 0.11, 0.42, 0.11, group);
    }
    mesh(cube, body, 0, 0.88, 0, 0.54, 0.64, 0.30, group);
    mesh(cube, dark, 0, 0.97, -0.16, 0.34, 0.30, 0.035, group);
    mesh(cube, visor, 0, 0.99, -0.185, 0.22, 0.04, 0.018, group, false);
    const helmet = mesh(sphere, body, 0, 1.44, 0, 0.26, 0.27, 0.25, group);
    mesh(cube, dark, 0, 1.47, -0.20, 0.39, 0.16, 0.11, group);
    mesh(cube, visor, 0, 1.47, -0.263, 0.30, 0.055, 0.018, group, false);
    const arms = [];
    for (const side of [-1, 1]) {
      const arm = mesh(cube, body, side * 0.39, 0.85, 0, 0.16, 0.55, 0.18, group); arm.rotation.z = side * 0.12; arms.push(arm);
      mesh(sphere, dark, side * 0.41, 0.51, 0, 0.10, 0.10, 0.10, group);
    }
    const glow = halo(identity.color, 0, 1.44, 0, 1.25, group);
    const label = sign(identity.name, identity.role, hub.x, 2.5, hub.z, 2.6, identity.color);
    circleCollider(hub.x, hub.z, 0.52);
    const robot = {group, body, visor, helmet, arms, glow, label, identity, hub};
    robots.push(robot); return robot;
  }
  HUBS.forEach((hub, index) => {
    mesh(cylinder, material(0x192c42), hub.x, 0.05, hub.z, 2.35, 0.08, 2.35, scene, false);
    const ring = mesh(keepGeometry(new THREE.TorusGeometry(2.27, 0.025, 6, 48)), material(hub.color, 0.9), hub.x, 0.105, hub.z, 1, 1, 1, scene, false); ring.rotation.x = Math.PI / 2;
    makeRobot(hub, PEOPLE[DEFAULT_PEOPLE[index]]);
    sign(hub.name, 'EXPLORE // CONNECT // REBOOT', hub.x, 3.5, hub.z + 0.25, 4, hub.color);
    const light = new THREE.PointLight(hub.color, 18, 8, 2); light.position.set(hub.x, 2.7, hub.z); scene.add(light);
  });

  // Morning home: an open doorway, glowing wall strips and a rooftop garden.
  const home = HUBS[0];
  for (const side of [-1, 1]) {
    mesh(cube, material(0x29354b), home.x + side * 2.05, 1.6, home.z + 3.7, 0.16, 3.2, 3.4);
    boxCollider(home.x + side * 2.05, home.z + 3.7, 0.16, 3.4);
  }
  mesh(cube, material(0x29354b), home.x, 1.6, home.z + 5.3, 4.2, 3.2, 0.16); boxCollider(home.x, home.z + 5.3, 4.2, 0.16);
  mesh(cube, material(0x192b40), home.x, 3.3, home.z + 3.7, 4.5, 0.22, 3.65);
  for (const side of [-1, 1]) mesh(cube, material(home.color, 1.6), home.x + side * 2.1, 1.7, home.z + 1.95, 0.06, 3.05, 0.055, scene, false);
  sign('GOOD MORNING', 'A NEW DAY IS YOURS', home.x, 2.4, home.z + 4.9, 3, home.color);

  // Campus pavilion and solar canopy: a covered destination rather than a wall.
  const campus = HUBS[1];
  for (const side of [-1, 1]) {
    mesh(cube, material(0x25384e), campus.x + side * 3.2, 1.8, campus.z - 1.6, 0.2, 3.6, 0.2); boxCollider(campus.x + side * 3.2, campus.z - 1.6, .2, .2);
    mesh(cube, material(campus.color, 1.8), campus.x + side * 3.2, 1.8, campus.z - 1.45, .035, 3.5, .025, scene, false);
  }
  mesh(cube, material(0x24344b, 0, .65), campus.x, 3.65, campus.z - 1.6, 6.7, .18, 3.0);
  mesh(cube, material(campus.color, 1.4), campus.x, 3.76, campus.z - 0.12, 6.7, .06, .04, scene, false);
  sign('SIGNAL > NOISE', 'LEARN SOMETHING THAT MATTERS', campus.x, 2.1, campus.z - 2.8, 4.6, campus.color);

  // Park: layered trees, planters and real benches with collision.
  const park = HUBS[2];
  for (let i = 0; i < 7; i++) {
    const x = park.x + (i % 4 - 1.5) * 2.6, z = park.z - 3.8 - Math.floor(i / 4) * 2.7;
    mesh(cylinder, material(0x4b3340), x, .85, z, .19, 1.7, .19); circleCollider(x, z, .23);
    for (let layer = 0; layer < 2; layer++) mesh(sphere, material(layer ? 0x286746 : 0x194c40), x + layer * .15, 2.4 + layer * .65, z, 1.2 - layer * .16, 1.35 - layer * .16, 1.1 - layer * .16);
    mesh(cylinder, material(0x273746), x, .14, z, .60, .28, .60);
  }
  function bench(x, z, rotation = 0) {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; scene.add(group);
    const seat = material(0x665e67, 0, .25, .7);
    mesh(cube, seat, 0, .53, 0, 1.7, .10, .48, group); mesh(cube, seat, 0, .95, .2, 1.7, .58, .08, group);
    for (const side of [-1, 1]) mesh(cube, material(0x19263a), side * .6, .26, 0, .09, .5, .44, group);
    boxCollider(x, z, rotation ? .6 : 1.75, rotation ? 1.75 : .6);
  }
  bench(park.x - 3.7, park.z, Math.PI / 2); bench(park.x + 3.7, park.z, Math.PI / 2);
  bench(-5.2, 4.9); bench(5.2, 4.9);

  // MedTech laboratory: holographic core, worktable and sensor stations.
  const lab = HUBS[3];
  mesh(cube, material(0x233c4d, 0, .65), lab.x + 3.1, .85, lab.z, 1.6, .17, 3.2); boxCollider(lab.x + 3.1, lab.z, 1.6, 3.2);
  for (const side of [-1, 1]) mesh(cube, material(0x223145), lab.x + 3.1, .40, lab.z + side * 1.3, 1.45, .78, .12);
  const labCore = mesh(keepGeometry(new THREE.IcosahedronGeometry(.47)), material(lab.color, 1.6, .35), lab.x + 3.1, 1.7, lab.z);
  for (const side of [-1, 1]) {
    mesh(cube, material(0x192d43), lab.x + 3.1, 1.13, lab.z + side * .98, .60, .42, .65);
    mesh(cube, material(lab.color, 1.7), lab.x + 3.1, 1.39, lab.z + side * .98, .50, .025, .56, scene, false);
  }
  sign('FOCUSBAND', 'SIMULATE // CALIBRATE // PROTECT', lab.x + 3.1, 2.5, lab.z, 3.2, lab.color);

  // Arcade: illuminated cabinets, screens and coloured physical buttons.
  const arcade = HUBS[4];
  for (let i = 0; i < 3; i++) {
    const x = arcade.x + (i - 1) * 1.5, z = arcade.z + 3.7;
    mesh(cube, material(0x201d39, 0, .4), x, 1.05, z, 1.02, 2.10, .72); boxCollider(x, z, 1.02, .72);
    mesh(cube, material(0x0e172d), x, 1.30, z - .40, .80, .95, .12);
    mesh(cube, material(arcade.color, 1.8), x, 1.47, z - .47, .68, .58, .02, scene, false);
    mesh(cube, material(0x354163), x, .91, z - .50, .83, .10, .44);
    for (const side of [-1, 1]) mesh(sphere, material(side < 0 ? 0x53eeec : 0xff85b8, 1), x + side * .18, .99, z - .54, .055, .035, .055, scene, false);
  }
  sign('ONE MORE?', 'YOU CHOOSE WHEN TO LOG OFF', arcade.x, 2.9, arcade.z + 3.7, 4.4, arcade.color);

  // Night garden: soft lamps and a quiet reading corner.
  const night = HUBS[5];
  bench(night.x - 2.7, night.z + .9, Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const x = night.x + Math.sin(angle) * 3.4, z = night.z + Math.cos(angle) * 3.4;
    mesh(cylinder, material(0x263447), x, .45, z, .08, .9, .08); circleCollider(x, z, .12);
    mesh(sphere, material(night.color, 1.8), x, .98, z, .15, .15, .15, scene, false); halo(night.color, x, .98, z, .9);
  }
  sign('REST IS PART OF THE RUN', 'MAKE ROOM FOR TOMORROW', night.x - .5, 2.6, night.z + 3.8, 4.3, night.color);

  const particlePositions = new Float32Array(160 * 3);
  for (let i = 0; i < 160; i++) {particlePositions[i * 3] = (random() - .5) * 52; particlePositions[i * 3 + 1] = .8 + random() * 10; particlePositions[i * 3 + 2] = (random() - .5) * 52;}
  const particleGeometry = keepGeometry(new THREE.BufferGeometry()); particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const motes = new THREE.Points(particleGeometry, keepMaterial(new THREE.PointsMaterial({color: 0x9ad8ff, size: .055, transparent: true, opacity: .55, depthWrite: false}))); scene.add(motes);

  function listen(target, name, callback, options) {target.addEventListener(name, callback, options); events.push(() => target.removeEventListener(name, callback, options));}
  function clearMovement() {keys.clear(); velocityX = velocityZ = movementForward = movementRight = 0; drag = null;}
  function positionCamera() {camera.position.set(player.x, EYE_HEIGHT, player.z); camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ'); camera.updateMatrixWorld(true);}
  function look(dx, dy) {
    if (!active || disposed) return;
    player.yaw -= (Number.isFinite(dx) ? dx : 0) * .0024;
    player.pitch = THREE.MathUtils.clamp(player.pitch - (Number.isFinite(dy) ? dy : 0) * .0022, -1.38, 1.38);
    positionCamera();
  }
  function exitPointerLock() {
    intentionalUnlock = true;
    if (document.pointerLockElement === canvas) document.exitPointerLock();
  }
  function requestPointerLock() {
    if (!active || disposed || !canvas.requestPointerLock) return;
    intentionalUnlock = false;
    try {const request = canvas.requestPointerLock(); if (request?.catch) request.catch(() => {});} catch { /* Drag-to-look remains available if pointer lock is denied. */ }
  }
  listen(window, 'keydown', event => {
    if (!active || event.target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'].includes(event.code)) {keys.add(event.code); event.preventDefault();}
    if (event.repeat) return;
    if (event.code === 'KeyE') {event.preventDefault(); onInteract?.();}
    if (event.code === 'Escape') {event.preventDefault(); onPause?.();}
  });
  listen(window, 'keyup', event => keys.delete(event.code));
  listen(window, 'blur', () => {clearMovement(); if (active) onPause?.();});
  listen(document, 'visibilitychange', () => {if (document.hidden) {clearMovement(); if (active) onPause?.();}});
  listen(document, 'pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    if (hadPointerLock && !locked && active && !intentionalUnlock) onPause?.();
    hadPointerLock = locked;
    if (!locked) intentionalUnlock = false;
  });
  listen(document, 'mousemove', event => {if (active && document.pointerLockElement === canvas) look(event.movementX, event.movementY);});
  listen(canvas, 'pointerdown', event => {
    if (!active || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
    if (event.pointerType === 'mouse') requestPointerLock();
    try {canvas.setPointerCapture(event.pointerId);} catch { /* Pointer capture is optional. */ }
  });
  listen(canvas, 'pointermove', event => {
    if (!active || document.pointerLockElement === canvas || !drag || drag.id !== event.pointerId) return;
    look(event.clientX - drag.x, event.clientY - drag.y); drag.x = event.clientX; drag.y = event.clientY;
  });
  const stopDrag = event => {if (drag?.id === event.pointerId) drag = null;};
  listen(canvas, 'pointerup', stopDrag); listen(canvas, 'pointercancel', stopDrag);

  function resize() {
    const width = Math.max(1, Math.round(canvas.clientWidth || window.innerWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight || window.innerHeight));
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width; lastHeight = height; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  listen(window, 'resize', resize); resize();

  function blocked(x, z) {
    for (const item of colliders) {
      if (item.type === 'circle') {if (Math.hypot(x - item.x, z - item.z) < PLAYER_RADIUS + item.radius) return true;}
      else {
        const dx = Math.max(Math.abs(x - item.x) - item.width, 0), dz = Math.max(Math.abs(z - item.z) - item.depth, 0);
        if (dx * dx + dz * dz < PLAYER_RADIUS * PLAYER_RADIUS) return true;
      }
    }
    return false;
  }
  function move(dt) {
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) + movementForward;
    const right = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + movementRight;
    const length = Math.max(1, Math.hypot(forward, right));
    const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 6.2 : 3.8;
    const directionX = (-Math.sin(player.yaw) * forward + Math.cos(player.yaw) * right) / length;
    const directionZ = (-Math.cos(player.yaw) * forward - Math.sin(player.yaw) * right) / length;
    velocityX = THREE.MathUtils.damp(velocityX, directionX * speed, 14, dt); velocityZ = THREE.MathUtils.damp(velocityZ, directionZ * speed, 14, dt);
    const oldX = player.x, oldZ = player.z;
    const nextX = THREE.MathUtils.clamp(player.x + velocityX * dt, -29.5, 29.5);
    if (!blocked(nextX, player.z)) player.x = nextX; else velocityX = 0;
    const nextZ = THREE.MathUtils.clamp(player.z + velocityZ * dt, -29.5, 29.5);
    if (!blocked(player.x, nextZ)) player.z = nextZ; else velocityZ = 0;
    const distance = Math.hypot(player.x - oldX, player.z - oldZ);
    if (distance > .00001) onMove?.({...player, distance});
  }
  function setTarget(index, eventSpeaker) {
    targetIndex = THREE.MathUtils.clamp(Math.floor(Number(index) || 0), 0, HUBS.length - 1);
    const hub = HUBS[targetIndex]; targetRing.position.set(hub.x, .11, hub.z); beacon.position.set(hub.x, 3.1, hub.z);
    targetRing.material = material(hub.color, 2.4); beaconMaterial.color.setHex(hub.color);
    const speaker = typeof eventSpeaker === 'string' ? eventSpeaker.toLowerCase() : DEFAULT_PEOPLE[targetIndex];
    const identity = PEOPLE[speaker] || PEOPLE[DEFAULT_PEOPLE[targetIndex]];
    const robot = robots[targetIndex];
    if (robot.identity !== identity) {
      robot.identity = identity; robot.body.color.setHex(identity.color); robot.visor.color.setHex(identity.color); robot.visor.emissive.setHex(identity.color);
      robot.glow.material.color.setHex(identity.color);
      const previous = robot.label.material.map; robot.label.material.map = labelTexture(identity.name, identity.role, identity.color); robot.label.material.needsUpdate = true;
      resources.textures.delete(previous); previous.dispose();
    }
  }
  const raycaster = new THREE.Raycaster();
  function clearFocusTarget() {
    if (!focusTarget) return;
    scene.remove(focusTarget.group); focusTarget = null;
  }
  const targetGeometry = keepGeometry(new THREE.SphereGeometry(.24, 18, 12));
  const targetTorus = keepGeometry(new THREE.TorusGeometry(.34, .018, 6, 36));
  const targetMaterial = material(0x66ffb8, 2.7, .25, .22);
  const targetHaloMaterial = keepMaterial(new THREE.SpriteMaterial({map: glowTexture, color: 0x66ffb8, transparent: true, opacity: .42, blending: THREE.AdditiveBlending, depthWrite: false}));
  function spawnFocusTarget() {
    clearFocusTarget(); positionCamera();
    camera.getWorldDirection(scratch.direction); scratch.right.setFromMatrixColumn(camera.matrixWorld, 0);
    const group = new THREE.Group();
    group.position.copy(camera.position).addScaledVector(scratch.direction, 3.2).addScaledVector(scratch.right, (Math.random() - .5) * 1.6);
    group.position.y = THREE.MathUtils.clamp(group.position.y + (Math.random() - .5) * .7, .55, 4.8);
    // Keep a new target in front of nearby NPCs, walls and props rather than hidden
    // behind them. It remains a world-space object that the player must aim at.
    scene.updateMatrixWorld(true);
    const direction = group.position.clone().sub(camera.position).normalize();
    raycaster.set(camera.position, direction);
    const obstacle = raycaster.intersectObjects(focusOccluders, false)[0];
    if (obstacle && obstacle.distance < camera.position.distanceTo(group.position) + .25) {
      group.position.copy(camera.position).addScaledVector(direction, Math.max(.36, obstacle.distance * .55));
    }
    const target = mesh(targetGeometry, targetMaterial, 0, 0, 0, 1, 1, 1, group, false);
    const ring = mesh(targetTorus, targetMaterial, 0, 0, 0, 1, 1, 1, group, false);
    const glow = new THREE.Sprite(targetHaloMaterial); glow.scale.set(1.45, 1.45, 1); group.add(glow);
    scene.add(group); group.updateMatrixWorld(true); focusTarget = {group, target, ring};
  }
  function hitFocusTarget() {
    if (!focusTarget || !active) return false;
    positionCamera(); focusTarget.group.updateMatrixWorld(true); raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hit = raycaster.intersectObject(focusTarget.target, false)[0];
    if (!hit) return false;
    const obstacle = raycaster.intersectObjects(focusOccluders, false)[0];
    if (obstacle && obstacle.distance + .001 < hit.distance) return false;
    clearFocusTarget(); return true;
  }
  function setPlayerPosition(position = {}) {
    const x = Number.isFinite(position.x) ? THREE.MathUtils.clamp(position.x, -29.5, 29.5) : player.x;
    const z = Number.isFinite(position.z) ? THREE.MathUtils.clamp(position.z, -29.5, 29.5) : player.z;
    if (!blocked(x, z)) {player.x = x; player.z = z;}
    if (Number.isFinite(position.yaw)) player.yaw = position.yaw;
    if (Number.isFinite(position.pitch)) player.pitch = THREE.MathUtils.clamp(position.pitch, -1.38, 1.38);
    velocityX = velocityZ = 0; if (active) positionCamera();
  }
  function update(dt, time) {
    if (disposed) return;
    const began = performance.now();
    const step = THREE.MathUtils.clamp(Number.isFinite(dt) ? dt : 0, 0, .05); elapsed += step;
    const t = Number.isFinite(time) ? time : elapsed;
    if (active) {move(step); positionCamera();}
    else {
      // Stay inside the skyline's inner edge. A camera crossing a skyscraper
      // sees its backface-culled walls disappear and near windows fill the view.
      const angle = t * .035 + .45;
      camera.position.set(Math.sin(angle) * 25, 15.5 + Math.sin(t * .10) * 1.3, Math.cos(angle) * 25);
      camera.lookAt(0, 1.8, 2);
    }
    targetRing.scale.setScalar(1 + Math.sin(t * 2.7) * .04); beaconMaterial.opacity = .042 + Math.sin(t * 2.1) * .012;
    centerCrystal.rotation.y = t * .45; centerCrystal.position.y = 1.82 + Math.sin(t * 1.8) * .15;
    labCore.rotation.set(t * .25, t * .5, t * .2); motes.rotation.y = t * .006;
    for (let i = 0; i < robots.length; i++) {
      const robot = robots[i]; robot.group.position.y = .10 + Math.sin(t * 2.3 + i) * .035;
      robot.group.rotation.y = Math.atan2(-(camera.position.x - robot.hub.x), -(camera.position.z - robot.hub.z));
      robot.arms[0].rotation.x = Math.sin(t * 1.7 + i) * .09; robot.arms[1].rotation.x = -Math.sin(t * 1.7 + i) * .09;
      robot.label.position.y = 2.5 + Math.sin(t * 2.3 + i) * .035;
    }
    for (const label of billboardSigns) label.lookAt(camera.position);
    if (focusTarget) {focusTarget.ring.lookAt(camera.position); focusTarget.ring.rotation.z += t * .3;}
    resize(); renderer.render(scene, camera); frames++; frameMilliseconds = performance.now() - began;
  }
  function setActive(value) {
    const next = Boolean(value); clearMovement(); active = next;
    if (active) positionCamera(); else exitPointerLock();
  }
  function dispose() {
    if (disposed) return;
    active = false; disposed = true; exitPointerLock(); clearMovement(); clearFocusTarget();
    for (const remove of events) remove();
    for (const geometry of resources.geometries) geometry.dispose();
    for (const mat of resources.materials) mat.dispose();
    for (const texture of resources.textures) texture.dispose();
    environment.dispose(); renderer.dispose(); scene.clear();
  }
  return {
    update, setActive, setTarget, setPlayerPosition, requestPointerLock, exitPointerLock, spawnFocusTarget, hitFocusTarget, clearFocusTarget, dispose,
    distanceToTarget: () => Math.hypot(player.x - HUBS[targetIndex].x, player.z - HUBS[targetIndex].z),
    getPlayerPosition: () => ({...player}),
    setMovement: (forward = 0, right = 0) => {movementForward = THREE.MathUtils.clamp(Number(forward) || 0, -1, 1); movementRight = THREE.MathUtils.clamp(Number(right) || 0, -1, 1);},
    look,
    turn: delta => look(delta, 0),
    getStats() {
      let objects = 0, meshes = 0; scene.traverse(object => {objects++; if (object.isMesh) meshes++;});
      const focusTargetPosition = focusTarget ? {x: focusTarget.group.position.x, y: focusTarget.group.position.y, z: focusTarget.group.position.z} : null;
      return {renderedFrames: frames, objects, meshes, instancedWindows: windowPositions.length, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, geometries: renderer.info.memory.geometries, frameMilliseconds, webgl2: true, active, targetIndex, focusTarget: Boolean(focusTarget), focusTargetPosition, pointerLocked: document.pointerLockElement === canvas, player: {...player}};
    },
  };
}
