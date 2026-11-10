import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='notification-ninja/';
test('release version, homepage download links, SW cache and packaged filename agree',()=>{
  const version=JSON.parse(readFileSync(root+'dist/build.json','utf8')).version;
  const sw=readFileSync(root+'sw.js','utf8');
  const index=readFileSync(root+'index.html','utf8');
  const script=readFileSync('scripts/package_ninja.py','utf8');
  assert.match(version,/^3\.7\.0$/);
  assert(sw.includes('${PREFIX}'+version));
  assert.equal((index.match(/downloads\/Notification-Ninja-3\.7\.0\.zip/g)||[]).length,2);
  assert(script.includes("NAME='Notification-Ninja-"+version+"'"));
});
