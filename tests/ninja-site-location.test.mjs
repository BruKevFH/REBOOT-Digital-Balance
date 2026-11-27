import test from 'node:test';
import assert from 'node:assert/strict';
import {CANONICAL_SITE_ORIGIN,ACCOUNT_SERVICE_ORIGIN,LEGACY_SITE_ORIGIN,LEGACY_SITE_PATH,LEGACY_SITE_ORIGINS,CANONICAL_GAME_PATH,canonicalGameURL,getSiteLocation} from '../notification-ninja/src/site-location.js';

test('the static homepage and game have clean addresses while the account service stays separate',()=>{
  assert.equal(CANONICAL_SITE_ORIGIN,'https://notification-ninja.onrender.com');
  assert.equal(ACCOUNT_SERVICE_ORIGIN,'https://notification-ninja-accounts.onrender.com');
  assert.equal(CANONICAL_GAME_PATH,'/play.html');
  assert.equal(canonicalGameURL(),CANONICAL_SITE_ORIGIN+'/play.html#overview');
  assert.equal(canonicalGameURL('login'),CANONICAL_SITE_ORIGIN+'/play.html#login');
  assert.equal(canonicalGameURL('#worlds'),CANONICAL_SITE_ORIGIN+'/play.html#worlds');
  for(const route of ['https://attacker.example','//attacker.example','../x','<script>',null])assert.equal(canonicalGameURL(route),canonicalGameURL());
  const site=getSiteLocation(CANONICAL_SITE_ORIGIN+'/index.html#overview');
  assert.equal(site.basePath,'/');assert.equal(site.isCanonical,true);assert.equal(site.isStatic,true);assert.equal(site.isLegacy,false);
  assert.equal(site.homeURL,CANONICAL_SITE_ORIGIN+'/');assert.equal(site.gameURL,canonicalGameURL());
  assert.equal(site.canonicalGameURL.includes('REBOOT-Digital-Balance'),false);
});

test('legacy bookmarks and local folders retain their own navigation base',()=>{
  const legacy=getSiteLocation(LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'home.html');
  assert.equal(legacy.isLegacy,true);assert.equal(legacy.basePath,LEGACY_SITE_PATH);
  assert.equal(legacy.homeURL,LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'home.html');
  assert.equal(legacy.gameURL,LEGACY_SITE_ORIGIN+LEGACY_SITE_PATH+'index.html#overview');
  const local=getSiteLocation('http://localhost:8083/notification-ninja/index.html');
  assert.equal(local.basePath,'/notification-ninja/');assert.equal(local.isLegacy,false);
  assert.equal(getSiteLocation(LEGACY_SITE_ORIGIN+'/another-project/index.html').isLegacy,false);
  assert.equal(getSiteLocation(undefined).canonicalOrigin,CANONICAL_SITE_ORIGIN);
});

test('both exact old origins remain legacy and alias domains are never trusted',()=>{
  assert.deepEqual(LEGACY_SITE_ORIGINS,[LEGACY_SITE_ORIGIN,ACCOUNT_SERVICE_ORIGIN]);
  assert.equal(Object.isFrozen(LEGACY_SITE_ORIGINS),true);
  const account=getSiteLocation(ACCOUNT_SERVICE_ORIGIN+'/index.html#guest');
  assert.equal(account.isLegacy,true);assert.equal(account.isCanonical,false);assert.equal(account.isStatic,false);
  assert.equal(account.homeURL,ACCOUNT_SERVICE_ORIGIN+'/');
  assert.equal(account.gameURL,ACCOUNT_SERVICE_ORIGIN+'/index.html#overview');
  assert.equal(account.canonicalGameURL,canonicalGameURL());
  for(const origin of [CANONICAL_SITE_ORIGIN+'.attacker.example',ACCOUNT_SERVICE_ORIGIN+'.attacker.example',LEGACY_SITE_ORIGIN+'.attacker.example','https://attacker.example']){
    const site=getSiteLocation(origin+LEGACY_SITE_PATH+'index.html');
    assert.equal(site.isCanonical,false);assert.equal(site.isLegacy,false);assert.equal(site.isStatic,false);
  }
});

test('only the same-origin explicit static preview marker changes local homepage and game routing',()=>{
  const descriptors=Object.fromEntries(['document','location'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  try{
    Object.defineProperty(globalThis,'document',{configurable:true,value:{documentElement:{dataset:{ninjaStaticSite:'true'}}}});
    Object.defineProperty(globalThis,'location',{configurable:true,value:new URL('http://localhost:8088/index.html')});
    const preview=getSiteLocation('http://localhost:8088/index.html');
    assert.equal(preview.isStatic,true);assert.equal(preview.isCanonical,false);assert.equal(preview.isLegacy,false);
    assert.equal(preview.homeURL,'http://localhost:8088/');assert.equal(preview.gameURL,'http://localhost:8088/play.html#overview');
    const other=getSiteLocation('http://localhost:8089/index.html');
    assert.equal(other.isStatic,false);assert.equal(other.gameURL,'http://localhost:8089/index.html#overview');
    globalThis.document.documentElement.dataset.ninjaStaticSite='false';
    assert.equal(getSiteLocation('http://localhost:8088/index.html').isStatic,false);
  }finally{
    for(const key of ['document','location'])if(descriptors[key])Object.defineProperty(globalThis,key,descriptors[key]);else delete globalThis[key];
  }
});


test('extracted guest downloads keep working with file URLs and spaces in their folder',()=>{
  const site=getSiteLocation('file:///Users/ninja/My%20Dojo/home.html');
  assert.equal(site.homeURL,'file:///Users/ninja/My%20Dojo/home.html');
  assert.equal(site.gameURL,'file:///Users/ninja/My%20Dojo/index.html#overview');
  assert.equal(site.isLegacy,false);assert.equal(site.isCanonical,false);
});
