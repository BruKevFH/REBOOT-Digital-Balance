const SCOPE=new URL(self.registration.scope);
const PREFIX=`notification-ninja:${SCOPE.pathname}:`;
const CACHE=`${PREFIX}1.8.1`;
const ASSETS=['./','./index.html','./home.html','./styles.css','./dist/ninja.js','./dist/build.json','./leaderboard-config.json','./manifest.webmanifest','./favicon.svg'];
const NAVIGATION=new Map([
  [SCOPE.pathname,'./index.html'],
  [new URL('./index.html',SCOPE).pathname,'./index.html'],
  [new URL('./home.html',SCOPE).pathname,'./home.html'],
]);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  if(url.href===new URL('./leaderboard-config.json',SCOPE).href){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.open(CACHE).then(cache=>cache.match(event.request))));return;}
  if(event.request.mode==='navigate'){
    const fallback=NAVIGATION.get(url.pathname);
    if(fallback)event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL(fallback,SCOPE).href))));
  }
  else if(ASSETS.some(asset=>new URL(asset,SCOPE).href===url.href))event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request)));
});
