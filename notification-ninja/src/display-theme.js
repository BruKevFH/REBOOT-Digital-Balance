/** Device-only interface palette; never part of account gameplay or wallet state. */
export const THEME_KEY='notification-ninja:ui-theme:v1';
export const THEMES=Object.freeze(['relaxed','dark','noir']);
const titles=Object.freeze({relaxed:'Relaxed',dark:'Dark',noir:'Noir'});
let current='relaxed';
const safe=value=>THEMES.includes(value)?value:'relaxed';
function storage(){try{return globalThis.localStorage;}catch{return null;}}
export function getTheme(store=storage()){
 try{const stored=store?.getItem(THEME_KEY);return stored===null||stored===undefined?current:safe(stored);}catch{return current;}
}
export function applyTheme(theme=getTheme()){
 current=safe(theme);
 const doc=globalThis.document;
 if(!doc?.documentElement)return current;
 doc.documentElement.dataset.ninjaTheme=current;
 for(const b of doc.querySelectorAll('[data-ninja-theme]')){
   const selected=b.dataset.ninjaTheme===current;
   b.setAttribute('aria-pressed',String(selected));
   b.classList.toggle('is-chosen',selected);
 }
 for(const b of doc.querySelectorAll('[data-theme-cycle]')){
   b.setAttribute('aria-label','Design wechseln: '+titles[current]+'. Nächstes Design');
   b.title='Design: '+titles[current]+' · wechseln';
   const text=b.querySelector('[data-theme-label]');if(text)text.textContent=titles[current];
 }
 return current;
}
export function setTheme(theme,store=storage()){
 if(!THEMES.includes(theme))return false;
 current=theme;
 try{store?.setItem(THEME_KEY,theme);}catch{}
 applyTheme(theme);
 return true;
}
export function cycleTheme(store=storage()){
 const index=THEMES.indexOf(getTheme(store));
 return setTheme(THEMES[(index+1)%THEMES.length],store);
}
export function themePicker(){
 return '<div class="ninja-theme-picker" role="group" aria-label="Spiel-Design">'+THEMES.map((id,i)=>
 '<button type="button" data-ninja-theme="'+id+'" aria-pressed="'+String(getTheme()===id)+'"><span aria-hidden="true">'+['☀','◐','◆'][i]+'</span>'+titles[id]+'</button>').join('')+'</div>';
}
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
 if(event.key===THEME_KEY||event.key===null)applyTheme(getTheme());
});
