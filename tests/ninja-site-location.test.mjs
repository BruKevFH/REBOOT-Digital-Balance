import test from 'node:test';
import assert from 'node:assert/strict';
import {CANONICAL_SITE_ORIGIN,LEGACY_SITE_ORIGIN,LEGACY_SITE_PATH,canonicalGameURL,getSiteLocation} from '../notification-ninja/src/site-location.js';

test('the public game has a clean address on the existing free host',()=>{
  assert.equal(canonicalGameURL(),CANONICAL_SITE_ORIGIN+'/index.html#overview');
  assert.equal(canonicalGameURL('login'),CANONICAL_SITE_ORIGIN+'/index.html#login');
  assert.equal(canonicalGameURL('#worlds'),CANONICAL_SITE_ORIGIN+'/index.html#worlds');
  for(const route of ['https://attacker.example','//attacker.example','../x','<script>',null])assert.equal(canonicalGameURL(route),canonicalGameURL());
  const site=getSiteLocation(CANONICAL_SITE_ORIGIN+'/index.html#overview');
  assert.equal(site.basePath,'/');assert.equal(site.isCanonical,true);assert.equal(site.isLegacy,false);
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
