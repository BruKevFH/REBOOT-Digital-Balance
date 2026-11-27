/** The static public site stays available while the separate free API wakes up. */
export const CANONICAL_SITE_ORIGIN='https://notification-ninja.onrender.com';
export const ACCOUNT_SERVICE_ORIGIN='https://notification-ninja-accounts.onrender.com';
export const LEGACY_SITE_ORIGIN='https://brukevfh.github.io';
export const LEGACY_SITE_PATH='/REBOOT-Digital-Balance/notification-ninja/';
export const LEGACY_SITE_ORIGINS=Object.freeze([LEGACY_SITE_ORIGIN,ACCOUNT_SERVICE_ORIGIN]);
export const CANONICAL_GAME_PATH='/play.html';

const gameRoute=route=>typeof route==='string'&&/^[a-z0-9][a-z0-9-]{0,63}$/.test(route.replace(/^#/,''))?route.replace(/^#/,''):'overview';
export function canonicalGameURL(route='overview'){
  return `${CANONICAL_SITE_ORIGIN}${CANONICAL_GAME_PATH}#${gameRoute(route)}`;
}

/** Old bookmarks, local previews and guest archives keep their navigation base. */
export function getSiteLocation(location=globalThis.location){
  let url;
  try{url=new URL(typeof location==='string'?location:location?.href||`${location.origin}${location.pathname||'/'}`);}
  catch{url=new URL(CANONICAL_SITE_ORIGIN+'/');}
  const pathname=url.pathname;
  const basePath=url.protocol==='file:'?new URL('./',url).pathname:pathname.startsWith(LEGACY_SITE_PATH)||pathname===LEGACY_SITE_PATH.slice(0,-1)?LEGACY_SITE_PATH:pathname.startsWith('/notification-ninja/')||pathname==='/notification-ninja'?'/notification-ninja/':'/';
  const isCanonical=url.origin===CANONICAL_SITE_ORIGIN;
  const markedStatic=globalThis.document?.documentElement?.dataset?.ninjaStaticSite==='true'&&url.origin===globalThis.location?.origin;
  const isStatic=isCanonical||markedStatic;
  const folder=url.protocol==='file:'?new URL('./',url):new URL(basePath,url.origin);
  const homeURL=url.protocol==='file:'?new URL(isStatic?'index.html':'home.html',folder).href:new URL(isStatic||basePath==='/'?'/':basePath+'home.html',url.origin).href;
  return Object.freeze({
    origin:url.origin,pathname,basePath,isCanonical,isStatic,
    isLegacy:url.origin===LEGACY_SITE_ORIGIN&&basePath===LEGACY_SITE_PATH||url.origin===ACCOUNT_SERVICE_ORIGIN,
    homeURL,
    gameURL:new URL((isStatic?'play.html':'index.html')+'#overview',folder).href,
    canonicalOrigin:CANONICAL_SITE_ORIGIN,
    canonicalHomeURL:CANONICAL_SITE_ORIGIN+'/',
    canonicalGameURL:canonicalGameURL()
  });
}
