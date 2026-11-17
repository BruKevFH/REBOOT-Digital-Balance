/** Painted scenery stays separate from live text, controls and player state. */
const REGIONS=Object.freeze({village:'0 0 768 512',bazaar:'768 0 768 512',welcome:'0 512 768 512',rewards:'768 512 768 512'});
export function sceneArt(kind='village'){
  const region=REGIONS[kind]||REGIONS.village;
  return `<svg class="adventure-scene" viewBox="${region}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><image href="./assets/indie-scenes.png" width="1536" height="1024"/></svg>`;
}
