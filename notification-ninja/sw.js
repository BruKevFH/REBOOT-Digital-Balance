const SCOPE=new URL(self.registration.scope);
const STATIC_LAYOUT=false;
const PREFIX=`notification-ninja:${SCOPE.pathname}:`;
const CACHE=`${PREFIX}3.13.3`;
const ASSETS=['./', './index.html', './home.html', './styles.css', './focus-ui.css', './focus-home.css', './legend-ui.css', './worlds-v2.css', './ux-v2.css', './ui-navigation-v3.css', './illustrated-adventure-v4.css', './dojo-worlds-v5.css', './mobile-navigation-v6.css', './ninja-feedback-v7.css', './ninja-mint-ui-v9.css', './ninja-mint-home-v9.css', './legend-home.css', './dist/ninja.js', './dist/home.js', './dist/build.json', './leaderboard-config.json', './accounts-config.json', './manifest.webmanifest', './favicon.svg', './assets/dojo-study.png', './assets/dojo-gaming.svg', './assets/dojo-gaming.png', './assets/dojo-sleep.png', './assets/focus-village.png', './assets/overworld-landscape-v4.svg', './assets/dojo-study-v5.svg', './assets/dojo-gaming-v5.svg', './assets/dojo-sleep-v5.svg', './assets/ninja-mint-logo-v9.svg', './assets/ninja-mint-boss-v9.svg', './assets/ninja-mint-daily-v9.svg', './assets/ninja-mint-zen-v9.svg', './assets/ninja-mint-weekly-v9.svg', './assets/ninja-mint-day-v9.svg', './assets/ninja-mint-open-v9.svg', './assets/ninja-mint-balance-v9.svg', './assets/dojo-study-v2.svg', './assets/dojo-gaming-v2.svg', './assets/dojo-sleep-v2.svg', './branding/Notification-Ninja-Logo.png', './assets/indie-wordmark.png', './indie-theme.css', './adventure-surfaces.css', './learning-adventure.css', './career-experience.css', './dressing-room.css', './experience-comfort.css', './experience-shell.css', './presentation-polish.css', './intro-experience.css', './playtime-experience.css', './theme-boot.js', './assets/indie-journeys.png', './hub-adventure.css', './portal-adventure.css', './assets/indie-scenes.png', './assets/indie-modes.png', './assets/indie-worlds.png', './assets/indie-masthead.png', './assets/indie-masthead.svg', './assets/fonts/nunito-latin-wght-normal.woff2', './assets/fonts/nunito-latin-ext-wght-normal.woff2', './assets/fonts/OFL-Nunito.txt'];
if(STATIC_LAYOUT)ASSETS.push('./play.html');
// The public service serves its homepage at /. Legacy folders and downloads
// retain their index.html entry; their cached navigation must stay independent.
const ROOT_DOCUMENT=STATIC_LAYOUT?'./index.html':SCOPE.origin==='https://notification-ninja-accounts.onrender.com'&&SCOPE.pathname==='/'?'./home.html':'./index.html';
const NAVIGATION=new Map([
  [SCOPE.pathname,ROOT_DOCUMENT],
  [new URL('./index.html',SCOPE).pathname,'./index.html'],
  [new URL('./home.html',SCOPE).pathname,'./home.html'],
]);
if(STATIC_LAYOUT)NAVIGATION.set(new URL('./play.html',SCOPE).pathname,'./play.html');
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
