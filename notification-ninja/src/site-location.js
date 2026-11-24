/** The existing free account service also hosts the complete public game. */
export const CANONICAL_SITE_ORIGIN='https://notification-ninja-accounts.onrender.com';
export const LEGACY_SITE_ORIGIN='https://brukevfh.github.io';
export const LEGACY_SITE_PATH='/REBOOT-Digital-Balance/notification-ninja/';

const gameRoute=route=>typeof route==='string'&&/^[a-z0-9][a-z0-9-]{0,63}$/.test(route.replace(/^#/,''))?route.replace(/^#/,''):'overview';

export function canonicalGameURL(route='overview'){
  return `${CANONICAL_SITE_ORIGIN}/index.html#${gameRoute(route)}`;
}

/** Preserve relative navigation in old bookmarks, downloads and local previews. */
export function getSiteLocation(location=globalThis.location){
  let url;
  try{url=new URL(typeof location==='string'?location:location?.href||`${location.origin}${location.pathname||'/'}`);}
  catch{url=new URL(CANONICAL_SITE_ORIGIN+'/');}
  const pathname=url.pathname;
  const basePath=pathname.startsWith(LEGACY_SITE_PATH)||pathname===LEGACY_SITE_PATH.slice(0,-1)?LEGACY_SITE_PATH:pathname.startsWith('/notification-ninja/')||pathname==='/notification-ninja'?'/notification-ninja/':'/';
  return Object.freeze({
    origin:url.origin,pathname,basePath,
    isCanonical:url.origin===CANONICAL_SITE_ORIGIN,
    isLegacy:url.origin===LEGACY_SITE_ORIGIN&&basePath===LEGACY_SITE_PATH,
    homeURL:new URL(basePath==='/'?'/':basePath+'home.html',url.origin).href,
    gameURL:new URL(basePath+'index.html#overview',url.origin).href,
    canonicalOrigin:CANONICAL_SITE_ORIGIN,
    canonicalHomeURL:CANONICAL_SITE_ORIGIN+'/',
    canonicalGameURL:canonicalGameURL()
  });
}
