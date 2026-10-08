const SCOPE=new URL(self.registration.scope);
const PREFIX=`mind-maze:${SCOPE.pathname}:`;
const CACHE=`${PREFIX}1.0.0`;
const ASSETS=['./','./index.html','./styles.css','./dist/maze.js','./dist/build.json','./manifest.webmanifest','./favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL('./index.html',SCOPE).href))));
  else if(ASSETS.some(asset=>new URL(asset,SCOPE).href===url.href))event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request)));
});
