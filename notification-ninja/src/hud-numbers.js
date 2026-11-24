/** Exact accessible values; long counters use locale-aware compact visible text. */
export function hudNumber(value,locale='de-DE',{series=false}={}){
  const n=Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number.isFinite(Number(value))?Number(value):0)));
  const full=n.toLocaleString(locale),compact=n>=1_000_000?new Intl.NumberFormat(locale,{notation:'compact',maximumFractionDigits:1}).format(n):full;
  return {text:(series?'×':'')+compact,full:(series?'×':'')+full};
}
let measuring;
/** Fit the actual font into the allocated counter, only when value/size changes. */
export function paintHudNumber(element,value,locale,options={}){
  const formatted=hudNumber(value,locale,options),width=element.clientWidth;
  const token=formatted.full+'|'+locale+'|'+width+'|'+document.fonts?.status;
  if(element.dataset.hudValue===token)return;
  element.dataset.hudValue=token;element.textContent=formatted.text;
  element.title=formatted.full;element.setAttribute('aria-label',formatted.full);
  element.style.fontSize='';
  const style=getComputedStyle(element),size=parseFloat(style.fontSize)||24;
  measuring??=document.createElement('canvas').getContext('2d');
  if(measuring&&width>0){
    measuring.font=[style.fontStyle,style.fontWeight,size+'px',style.fontFamily].join(' ');
    const measured=measuring.measureText(formatted.text).width;
    if(measured>width-2)element.style.fontSize=Math.max(10,Math.floor(size*(width-2)/measured))+'px';
  }
}
