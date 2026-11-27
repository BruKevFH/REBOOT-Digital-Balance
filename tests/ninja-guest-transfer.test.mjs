import test from 'node:test';
import assert from 'node:assert/strict';
import {NinjaGame} from '../notification-ninja/src/game.js';
import {CANONICAL_SITE_ORIGIN,ACCOUNT_SERVICE_ORIGIN,LEGACY_SITE_ORIGIN,LEGACY_SITE_PATH,LEGACY_SITE_ORIGINS} from '../notification-ninja/src/site-location.js';
import {MAX_GUEST_TRANSFER_BYTES,GUEST_TRANSFER_TTL,createGuestTransferNonce,guestTransferNonceFromHash,isSafeGuestTransferData,isGuestTransferMessage,normalizeGuestProfile,createGuestTransferSender,createGuestTransferReceiver} from '../notification-ninja/src/guest-transfer.js';

const now=()=>1795000000000;
const prefix='notification-ninja:guest-transfer:';
const nonce='a'.repeat(64);
const message=(type,extra={})=>({type:prefix+type,version:1,nonce,...extra});
const profile=()=>{const game=new NinjaGame({storage:null,now});game.profile.coins=321;game.profile.totalRuns=4;game.profile.player.username='Guest Ninja';game.profile.tutorialCompleted=true;return game.profile;};
function fakeWindow(href){
  const listeners=new Set(),timeouts=new Map(),intervals=new Map();let next=0;
  const win={location:new URL(href),crypto:globalThis.crypto,opener:null,
    addEventListener(type,fn){if(type==='message')listeners.add(fn);},removeEventListener(type,fn){if(type==='message')listeners.delete(fn);},
    setTimeout(fn){const id=++next;timeouts.set(id,fn);return id;},clearTimeout(id){timeouts.delete(id);},
    setInterval(fn){const id=++next;intervals.set(id,fn);return id;},clearInterval(id){intervals.delete(id);},
    emit(event){for(const listener of [...listeners])listener(event);},listeners,timeouts,intervals,
    history:{state:null,replaceState(state,title,url){win.location.href=new URL(url,win.location).href;}}
  };return win;
}
function connectedWindows(sourceOrigin=LEGACY_SITE_ORIGIN){
  const sender=fakeWindow(sourceOrigin+(sourceOrigin===LEGACY_SITE_ORIGIN?LEGACY_SITE_PATH:'/')+'index.html');
  const receiver=fakeWindow(CANONICAL_SITE_ORIGIN+'/play.html');
  const outbound=[],inbound=[];
  const opener={postMessage(data,origin){inbound.push({data,origin});if(origin===sender.location.origin)sender.emit({data,origin:receiver.location.origin,source:popup});}};
  const popup={postMessage(data,origin){outbound.push({data,origin});if(origin===receiver.location.origin)receiver.emit({data,origin:sender.location.origin,source:opener});}};
  sender.open=(url,name,features)=>{receiver.location.href=url;sender.opened={url,name,features};return popup;};
  receiver.opener=opener;return {sender,receiver,opener,popup,outbound,inbound};
}

test('profile normalization preserves guest progress and strips all account privileges and credentials',()=>{
  const original=profile();Object.assign(original,{accountCalendar:'utc',role:'admin',token:'DO-NOT-TRANSFER',password:'SECRET',account:{role:'admin'},settings:{role:'admin'}});
  original.player.role='admin';original.player.password='SECRET';
  const normalized=normalizeGuestProfile(original,{now});
  assert.equal(normalized.coins,321);assert.equal(normalized.totalRuns,4);assert.equal(normalized.player.username,'Guest Ninja');assert.equal(normalized.tutorialCompleted,true);
  const encoded=JSON.stringify(normalized);
  for(const secret of ['admin','DO-NOT-TRANSFER','SECRET','accountCalendar','password','"token"'])assert.equal(encoded.includes(secret),false);
  assert.equal(original.role,'admin');assert.equal(original.player.password,'SECRET','the original save is preserved');
  normalized.coins=1;assert.equal(original.coins,321);
});

test('JSON boundaries reject oversized, malformed and prototype-bearing profiles without invoking accessors',()=>{
  const cycle={};cycle.self=cycle;let accessed=0;const accessor={get coins(){accessed++;return 9;}};
  for(const value of [cycle,accessor,Object.create({coins:5}),{coins:NaN},{coins:()=>5},JSON.parse('{"coins":2,"__proto__":{"role":"admin"}}'),{player:{constructor:{prototype:{role:'admin'}}}},{coins:0,extra:'x'.repeat(MAX_GUEST_TRANSFER_BYTES)},new Date()]){
    assert.equal(isSafeGuestTransferData(value),false);assert.throws(()=>normalizeGuestProfile(value,{now}));
  }
  assert.equal(accessed,0);for(const value of [null,[],42,{},'not-a-profile'])assert.throws(()=>normalizeGuestProfile(value,{now}));
  assert.equal({}.role,undefined);
});

test('nonce fragments are cryptographic, exact and contain no profile or account data',()=>{
  const a=createGuestTransferNonce(),b=createGuestTransferNonce();assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);
  assert.equal(guestTransferNonceFromHash('#guest-transfer='+a),a);
  for(const origin of LEGACY_SITE_ORIGINS)assert.equal(guestTransferNonceFromHash('#guest-transfer='+a+'&source='+encodeURIComponent(origin)),a);
  for(const hash of ['#guest-transfer=short','#guest-transfer='+a+'\n','#guest-transfer='+a+'&token=private','#overview','#guest-transfer='+a.toUpperCase()])assert.equal(guestTransferNonceFromHash(hash),null);
  for(const suffix of ['&source=','&source=%zz','&source='+encodeURIComponent(LEGACY_SITE_ORIGIN+'/'),'&source='+encodeURIComponent(LEGACY_SITE_ORIGIN+'.attacker.example'),'&source='+encodeURIComponent(CANONICAL_SITE_ORIGIN),'&source='+encodeURIComponent(LEGACY_SITE_ORIGIN)+'&token=private','&source='+encodeURIComponent(LEGACY_SITE_ORIGIN)+'&source='+encodeURIComponent(ACCOUNT_SERVICE_ORIGIN),'&source='+encodeURIComponent(LEGACY_SITE_ORIGIN)+'\n'])assert.equal(guestTransferNonceFromHash('#guest-transfer='+a+suffix),null);
  assert.throws(()=>createGuestTransferNonce({}));
});

test('message validation requires exact source, origin, nonce, type, version and envelope',()=>{
  const source={},event={source,origin:LEGACY_SITE_ORIGIN,data:message('profile',{profile:profile()})};
  const expected={source,origin:LEGACY_SITE_ORIGIN,nonce,type:'profile'};
  assert.equal(isGuestTransferMessage(event,expected),true);
  for(const patch of [{source:{}},{origin:'https://attacker.example'},{origin:LEGACY_SITE_ORIGIN+'.attacker.example'},{data:message('profile',{nonce:'b'.repeat(64),profile:profile()})},{data:message('profile',{profile:profile(),token:'private'})},{data:message('profile',{profile:null})},{data:message('unknown')},{data:message('profile',{version:2,profile:profile()})}])assert.equal(isGuestTransferMessage({...event,...patch},expected),false);
  assert.equal(isGuestTransferMessage(event,{...expected,nonce:nonce+'\n'}),false);
});

test('sender discloses nothing before the opened canonical window completes the nonce handshake',()=>{
  const win=fakeWindow(LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'home.html'),posts=[],popup={postMessage:(data,origin)=>posts.push({data,origin})};let reads=0;
  win.open=url=>{win.opened=url;return popup;};
  const sender=createGuestTransferSender({window:win,now,getProfile:()=>{reads++;return {...profile(),token:'private',role:'admin'};}});
  assert.equal(sender.start().ok,true);const id=guestTransferNonceFromHash(new URL(win.opened).hash);
  assert.equal(new URL(win.opened).origin,CANONICAL_SITE_ORIGIN);assert.equal(new URL(win.opened).search,'');
  assert.equal(new URL(win.opened).pathname,'/play.html');
  const fragment=new URLSearchParams(new URL(win.opened).hash.slice(1));
  assert.equal(fragment.get('source'),LEGACY_SITE_ORIGIN);
  assert.deepEqual([...fragment.keys()],['guest-transfer','source']);
  for(const secret of ['Guest Ninja','private','admin','token=','profile='])assert.equal(win.opened.includes(secret),false);
  const ready={type:prefix+'ready',version:1,nonce:id};
  for(const event of [{source:{},origin:CANONICAL_SITE_ORIGIN,data:ready},{source:popup,origin:'https://attacker.example',data:ready},{source:popup,origin:CANONICAL_SITE_ORIGIN,data:{...ready,nonce:'b'.repeat(64)}}])win.emit(event);
  assert.equal(reads,0);assert.equal(posts.length,0);
  win.emit({source:popup,origin:CANONICAL_SITE_ORIGIN,data:ready});
  assert.equal(reads,1);assert.equal(posts.length,1);assert.equal(posts[0].origin,CANONICAL_SITE_ORIGIN);assert.equal(posts[0].data.profile.coins,321);assert.equal(JSON.stringify(posts).includes('private'),false);assert.equal(JSON.stringify(posts).includes('admin'),false);
  win.emit({source:popup,origin:CANONICAL_SITE_ORIGIN,data:ready});assert.equal(posts.length,1);
  sender.destroy();assert.equal(win.listeners.size,0);assert.equal(win.timeouts.size,0);
});

test('receiver prepares a detached preview and imports once only after explicit target acceptance',async()=>{
  const pair=connectedWindows(),source=profile(),original=JSON.stringify(source),states=[],imports=[];
  const sender=createGuestTransferSender({window:pair.sender,now,getProfile:()=>source,onStatus:s=>states.push('sender:'+s.status)});
  assert.equal(sender.start().ok,true);
  const receiver=createGuestTransferReceiver({window:pair.receiver,now,onImport:p=>{imports.push(p);return {ok:true};},onStatus:s=>{states.push('receiver:'+s.status);if(s.profile)s.profile.coins=9999;}});
  assert.equal(receiver.start().ok,true);assert.equal(imports.length,0);assert.equal(pair.receiver.location.hash,'#overview');
  assert.ok(states.includes('receiver:awaiting-accept'));assert.equal(pair.outbound.length,1);
  assert.equal((await receiver.accept()).ok,true);assert.equal(imports.length,1);assert.equal(imports[0].coins,321);assert.equal(states.at(-1),'receiver:complete');assert.ok(states.includes('sender:complete'));
  assert.equal((await receiver.accept()).ok,false);assert.equal(imports.length,1);assert.equal(JSON.stringify(source),original);
  assert.equal(pair.sender.listeners.size,0);assert.equal(pair.receiver.listeners.size,0);assert.equal(pair.receiver.opener,null);
});

for(const origin of LEGACY_SITE_ORIGINS)test(`new sender at ${origin} pins ready, profile and acknowledgement to its exact trusted origin`,async()=>{
  const pair=connectedWindows(origin),original=profile(),before=JSON.stringify(original),states=[],imports=[];
  const sender=createGuestTransferSender({window:pair.sender,now,getProfile:()=>original,onStatus:state=>states.push(state.status)});
  assert.equal(sender.start().ok,true);
  const link=new URL(pair.sender.opened.url);
  assert.equal(link.origin,CANONICAL_SITE_ORIGIN);assert.equal(link.search,'');assert.equal(link.pathname,'/play.html');
  assert.equal(new URLSearchParams(link.hash.slice(1)).get('source'),origin);
  const receiver=createGuestTransferReceiver({window:pair.receiver,now,onImport:data=>{imports.push(data);return {ok:true};}});
  assert.equal(receiver.start().ok,true);
  assert.equal(pair.inbound.length,1,'A marked link sends one ready message, without probing the other trusted origin');
  assert.equal(pair.inbound[0].origin,origin);assert.equal(pair.inbound[0].data.type,prefix+'ready');
  assert.equal(pair.outbound.length,1);assert.equal(pair.outbound[0].origin,CANONICAL_SITE_ORIGIN);
  assert.equal(imports.length,0);assert.equal((await receiver.accept()).ok,true);
  assert.equal(imports.length,1);assert.equal(imports[0].coins,original.coins);
  assert.deepEqual(pair.inbound.map(item=>[item.data.type,item.origin]),[[prefix+'ready',origin],[prefix+'accepted',origin]]);
  assert.equal(states.at(-1),'complete');assert.equal(JSON.stringify(original),before);
});

test('nonce-only receivers retain both trusted ready targets and acknowledge the validated profile origin',async()=>{
  const win=fakeWindow(CANONICAL_SITE_ORIGIN+'/play.html#guest-transfer='+nonce),posts=[],opener={postMessage:(data,origin)=>posts.push({data,origin})};win.opener=opener;
  const imports=[],receiver=createGuestTransferReceiver({window:win,now,onImport:value=>imports.push(value)});
  assert.equal(receiver.start().ok,true);
  assert.deepEqual(posts.map(item=>item.origin),LEGACY_SITE_ORIGINS);
  assert(posts.every(item=>item.data.type===prefix+'ready'&&!('profile'in item.data)));
  win.emit({origin:ACCOUNT_SERVICE_ORIGIN,source:opener,data:message('profile',{profile:profile()})});
  assert.equal(imports.length,0);assert.equal((await receiver.accept()).ok,true);
  assert.equal(posts.at(-1).data.type,prefix+'accepted');assert.equal(posts.at(-1).origin,ACCOUNT_SERVICE_ORIGIN);
});

test('the old GitHub nonce-only sender remains compatible with the exact former account-hosted receiver',async()=>{
  const sender=fakeWindow(LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'index.html'),receiverWindow=fakeWindow(ACCOUNT_SERVICE_ORIGIN+'/index.html#guest-transfer='+nonce);
  const source=profile(),before=JSON.stringify(source),events=[],imports=[];
  const opener={postMessage(data,origin){events.push({data,origin});if(origin===LEGACY_SITE_ORIGIN)sender.emit({data,origin:ACCOUNT_SERVICE_ORIGIN,source:popup});}};
  const popup={postMessage(data,origin){assert.equal(origin,ACCOUNT_SERVICE_ORIGIN);receiverWindow.emit({data,origin:LEGACY_SITE_ORIGIN,source:opener});}};
  sender.addEventListener('message',event=>{
    if(isGuestTransferMessage(event,{origin:ACCOUNT_SERVICE_ORIGIN,source:popup,nonce,type:'ready'}))popup.postMessage(message('profile',{profile:source}),ACCOUNT_SERVICE_ORIGIN);
  });
  receiverWindow.opener=opener;
  const receiver=createGuestTransferReceiver({window:receiverWindow,now,onImport:value=>imports.push(value)});
  assert.equal(receiver.start().ok,true);assert.equal(imports.length,0);
  assert.equal((await receiver.accept()).ok,true);assert.equal(imports[0].coins,source.coins);
  assert.equal(events.at(-1).origin,LEGACY_SITE_ORIGIN);assert.equal(events.at(-1).data.type,prefix+'accepted');
  assert.equal(JSON.stringify(source),before);
});

test('a source marker cannot authorize another trusted source, an alias host or a different opener window',async()=>{
  for(const sourceOrigin of LEGACY_SITE_ORIGINS){
    const alternate=LEGACY_SITE_ORIGINS.find(value=>value!==sourceOrigin),win=fakeWindow(CANONICAL_SITE_ORIGIN+'/play.html#guest-transfer='+nonce+'&source='+encodeURIComponent(sourceOrigin));
    const posts=[],opener={postMessage:(data,origin)=>posts.push({data,origin})};win.opener=opener;let imports=0;
    const receiver=createGuestTransferReceiver({window:win,now,onImport:()=>imports++});assert.equal(receiver.start().ok,true);
    for(const [origin,source]of [[alternate,opener],[sourceOrigin+'.attacker.example',opener],[sourceOrigin,{}]]){
      win.emit({origin,source,data:message('profile',{profile:profile()})});assert.equal((await receiver.accept()).ok,false);
    }
    assert.equal(imports,0);win.emit({origin:sourceOrigin,source:opener,data:message('profile',{profile:profile()})});
    assert.equal((await receiver.accept()).ok,true);assert.equal(imports,1);assert.equal(posts.at(-1).origin,sourceOrigin);
  }
  for(const origin of [CANONICAL_SITE_ORIGIN+'.attacker.example',ACCOUNT_SERVICE_ORIGIN+'.attacker.example',LEGACY_SITE_ORIGIN,'https://attacker.example']){
    const win=fakeWindow(origin+'/play.html#guest-transfer='+nonce);win.opener={postMessage(){assert.fail('Wrong host must not send a handshake');}};
    assert.equal(createGuestTransferReceiver({window:win,now,onImport:()=>assert.fail('Wrong host imported data')}).start().ok,false);
  }
});

test('transfer expiry is strict at its boundary and an old async acceptance cannot close or acknowledge a new session',async()=>{
  let stamp=now(),resolveImport;
  const win=fakeWindow(CANONICAL_SITE_ORIGIN+'/play.html#guest-transfer='+nonce+'&source='+encodeURIComponent(LEGACY_SITE_ORIGIN)),posts=[],opener={postMessage:(data,origin)=>posts.push({data,origin})};win.opener=opener;
  const receiver=createGuestTransferReceiver({window:win,now:()=>stamp,onImport:()=>new Promise(resolve=>{resolveImport=resolve;})});
  assert.equal(receiver.start().ok,true);
  const profileEvent={origin:LEGACY_SITE_ORIGIN,source:opener,data:message('profile',{profile:profile()})};
  win.emit(profileEvent);stamp+=GUEST_TRANSFER_TTL;
  assert.equal((await receiver.accept()).ok,false,'No import may start at the exact expiry time');
  receiver.destroy();stamp=now();win.location.hash='#guest-transfer='+nonce+'&source='+encodeURIComponent(LEGACY_SITE_ORIGIN);receiver.start();win.emit(profileEvent);
  const old=receiver.accept();receiver.destroy();
  const nextNonce='b'.repeat(64);win.location.hash='#guest-transfer='+nextNonce+'&source='+encodeURIComponent(ACCOUNT_SERVICE_ORIGIN);receiver.start();
  resolveImport({ok:true});assert.equal((await old).ok,false);
  assert.equal(posts.filter(item=>item.data.type===prefix+'accepted').length,0);
  assert.equal(win.listeners.size,1,'The old import cannot tear down the next receiver');
  win.emit({origin:ACCOUNT_SERVICE_ORIGIN,source:opener,data:{...message('profile',{profile:profile()}),nonce:nextNonce}});
  const current=receiver.accept();resolveImport({ok:true});assert.equal((await current).ok,true);
  assert.equal(posts.at(-1).data.nonce,nextNonce);assert.equal(posts.at(-1).origin,ACCOUNT_SERVICE_ORIGIN);
});

test('receiver ignores forged, oversized and polluted payloads and never calls import before acceptance',async()=>{
  const win=fakeWindow(CANONICAL_SITE_ORIGIN+'/index.html#guest-transfer='+nonce),opener={postMessage(){}},imports=[];win.opener=opener;
  const receiver=createGuestTransferReceiver({window:win,now,onImport:p=>imports.push(p)});receiver.start();
  const event={origin:LEGACY_SITE_ORIGIN,source:opener,data:message('profile',{profile:profile()})};
  for(const patch of [{origin:'https://attacker.example'},{source:{}},{data:message('profile',{nonce:'b'.repeat(64),profile:profile()})},{data:message('profile',{profile:{coins:0,extra:'x'.repeat(MAX_GUEST_TRANSFER_BYTES)}})},{data:message('profile',{profile:JSON.parse('{"coins":5,"player":{"__proto__":{"role":"admin"}}}')})},{data:message('profile',{profile:{}})}]){
    win.emit({...event,...patch});assert.equal((await receiver.accept()).ok,false);
  }
  assert.equal(imports.length,0);win.emit(event);assert.equal(imports.length,0);assert.equal((await receiver.accept()).ok,true);assert.equal(imports.length,1);
});

test('blocked popups, wrong hosts, expiry, failed imports and destroy preserve the original copy',async()=>{
  const source=profile(),original=JSON.stringify(source),win=fakeWindow(LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'home.html'),statuses=[];
  win.open=()=>null;const sender=createGuestTransferSender({window:win,now,getProfile:()=>source,onStatus:s=>statuses.push(s.status)});
  assert.equal(sender.start().status,'popup-blocked');assert.equal(win.listeners.size,0);assert.equal(JSON.stringify(source),original);
  assert.equal(createGuestTransferSender({window:fakeWindow('https://attacker.example/'),getProfile:()=>source}).start().ok,false);
  const pair=connectedWindows();let stamp=now(),attempts=0;
  const outgoing=createGuestTransferSender({window:pair.sender,now:()=>stamp,getProfile:()=>source});outgoing.start();
  const incoming=createGuestTransferReceiver({window:pair.receiver,now:()=>stamp,onImport:()=>{if(!attempts++)throw Error('disk full');return {ok:true};}});incoming.start();
  assert.equal((await incoming.accept()).status,'import-failed');assert.equal(pair.receiver.listeners.size,1);assert.equal((await incoming.accept()).ok,true);
  outgoing.destroy();incoming.destroy();
  const expired=fakeWindow(CANONICAL_SITE_ORIGIN+'/index.html#guest-transfer='+nonce);expired.opener={postMessage(){}};
  const receiver=createGuestTransferReceiver({window:expired,now:()=>stamp,onImport:()=>assert.fail('expired transfer imported')});receiver.start();
  expired.emit({origin:LEGACY_SITE_ORIGIN,source:expired.opener,data:message('profile',{profile:source})});stamp+=GUEST_TRANSFER_TTL+1;
  assert.equal((await receiver.accept()).ok,false);receiver.destroy();assert.equal(expired.listeners.size,0);assert.equal(expired.timeouts.size,0);assert.equal(expired.intervals.size,0);assert.equal(JSON.stringify(source),original);
});
