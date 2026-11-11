const SCOPE=new URL(self.registration.scope);
const PREFIX=`notification-ninja:${SCOPE.pathname}:`;
const CACHE=`${PREFIX}3.8.0`;
const ASSETS=['./','./index.html','./home.html','./styles.css','./focus-ui.css','./focus-home.css','./legend-ui.css','./worlds-v2.css','./ux-v2.css','./ui-navigation-v3.css','./illustrated-adventure-v4.css','./dojo-worlds-v5.css','./mobile-navigation-v6.css','./ninja-feedback-v7.css','./legend-home.css','./dist/ninja.js','./dist/home.js','./dist/build.json','./leaderboard-config.json','./accounts-config.json','./manifest.webmanifest','./favicon.svg','./assets/dojo-study.png','./assets/dojo-gaming.svg','./assets/dojo-gaming.png','./assets/dojo-sleep.png','./assets/focus-village.png','./assets/overworld-landscape-v4.svg','./assets/dojo-study-v5.svg','./assets/dojo-gaming-v5.svg','./assets/dojo-sleep-v5.svg','./assets/dojo-study-v2.svg','./assets/dojo-gaming-v2.svg','./assets/dojo-sleep-v2.svg','./branding/Notification-Ninja-Logo.png'];
const NAVIGATION=new Map([
  [SCOPE.pathname,'./index.html'],
  [new URL('./index.html',SCOPE).pathname,'./index.html'],
  [new URL('./home.html',SCOPE).pathname,'./home.html'],
]);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

/*
 * Revision 3.5.0: mutable presentation and code assets are NETWORK-FIRST.
 * Cached-first CSS/JS persisted from 3.4.0 even after new assets were merged,
 * making the game look unchanged. Fallback remains available for offline play.
 * PNG art is immutable between releases and can stay cache-first.
 */
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  const cacheMatch=path=>caches.open(CACHE).then(cache=>cache.match(path));
  const networkFirst=(request,cacheKey)=>{
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
      if(response.ok){
        const copy=response.clone();
        event.waitUntil(caches.open(CACHE).then(cache=>cache.put(cacheKey,copy)));
      }
      return response;
    }).catch(()=>cacheMatch(cacheKey)));
  };
  const config=['./leaderboard-config.json','./accounts-config.json'].find(file=>url.href===new URL(file,SCOPE).href);
  if(config){networkFirst(event.request,event.request);return;}
  if(event.request.mode==='navigate'){
    const fallback=NAVIGATION.get(url.pathname);
    if(fallback)event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>cacheMatch(new URL(fallback,SCOPE).href)));
    return;
  }
  const asset=ASSETS.find(file=>new URL(file,SCOPE).href===url.href);
  if(!asset)return;
  const key=new URL(asset,SCOPE).href;
  if(/\.(?:css|js|json|svg)$/.test(url.pathname)){
    networkFirst(event.request,key);
  }else{
    event.respondWith(cacheMatch(key).then(cached=>cached||fetch(event.request)));
  }
});
