const ANIMATIONS = new Set(['wave', 'swipe', 'keep', 'coins', 'super', 'unlock', 'achievement', 'profile']);

const NINJA = `<svg viewBox="0 0 180 200" aria-hidden="true" focusable="false">
  <ellipse cx="91" cy="187" rx="55" ry="8" fill="#293c38" opacity=".16"/>
  <g class="nim-charm nim-charm-one" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="m146 37 14 4-2 23-15-3 2-10-2-3Z" fill="#fff0b9" stroke="#ac813d" stroke-width="2"/>
    <path d="m151 42 4 1m-5 4 5 1m-6 5 5 1m-7 4 4 1" stroke="#8d6e42" stroke-width="1.7"/>
    <path d="m151 37 5-6 3 2" stroke="#d8a74f" stroke-width="2"/>
  </g>
  <g class="nim-charm nim-charm-two" stroke-linecap="round" stroke-linejoin="round">
    <path d="m17 63 13-6 9 20-12 7-2-7-4-1Z" fill="#fdf3cf" stroke="#bc985e" stroke-width="2"/>
    <path d="m24 65 4 7 4-2m-3 7 4-2" fill="none" stroke="#8a9c77" stroke-width="2"/>
    <circle cx="21" cy="48" r="2.5" fill="#d7b15e" stroke="none"/>
  </g>
  <g class="nim-body" stroke-linecap="round" stroke-linejoin="round">
    <path d="M111 140q42 23 48-14 18 38-8 53-30 17-48-15Z" fill="#f0dbb4" stroke="#384b42" stroke-width="3.7"/>
    <path d="M148 168q18-13 11-42 13 21 6 35l-8-5 1 8-9-2Z" fill="#fff8e6"/>
    <path d="M58 100q-21 10-26 44l17 13 11 4q26-9 49 0l26-9 10-15-29-38Z" fill="#2f6258" stroke="#293f37" stroke-width="4"/>
    <path d="M59 109q-20 18-15 34l19 8 22-39Z" fill="#3e7f6b"/>
    <path d="M115 108q22 20 22 33l-21 11-25-36Z" fill="#244d47"/>
    <path class="nim-cape-edge" d="m38 144 14 9 10 2m55 0 15-7 9-12" fill="none" stroke="#e8be67" stroke-width="3.5"/>
    <path d="m69 154-6 25 7 8 14-3 5-24m12-1 1 25 14 3 6-7-8-28" fill="#39483f" stroke="#2b3932" stroke-width="3.5"/>
    <path d="M64 178q8 5 20-1l-1 9q-21 10-23-2Zm38 0q8 3 16 0l5 8q-12 8-22 0Z" fill="#e4c59a" stroke="#685d47" stroke-width="2.4"/>
    <path d="M68 110q21-9 42 1l8 47q-29 17-58-1Z" fill="#f0e5c4" stroke="#4c6956" stroke-width="3.7"/>
    <path d="m72 116 25 28 11-27-15 42-21-5Z" fill="#d7d9ac"/>
    <path d="m70 117 21 22 16-24" fill="none" stroke="#729a76" stroke-width="5"/>
    <path d="m63 146 52-2 2 10q-29 9-55 0Z" fill="#d4a34f" stroke="#8a6b3e" stroke-width="2.6"/>
    <path d="m88 144 9 5-8 8-7-6Z" fill="#f8d685" stroke="#8f6d39" stroke-width="2"/>
    <path d="m70 115-14 11-14 8-8-13 25-22" fill="#467c65" stroke="#314d40" stroke-width="3.5"/>
    <path d="m27 182 6-66q-5-12 0-19 5-5 10-1 7 8-2 12" fill="none" stroke="#6c5e3d" stroke-width="6"/>
    <path d="m28 176 6-57m0-15q6 1 7-5" fill="none" stroke="#c4ac67" stroke-width="2.4"/>
    <path d="M34 119q-7-3-10 2-4 8 3 13 6 4 13-1l4-9-7-2-4 6" fill="#f7e7c9" stroke="#7b765a" stroke-width="2.5"/>
    <path d="m32 119 7 1" fill="none" stroke="#e3bd85" stroke-width="2.4"/>
    <path d="m109 111 29 16 13-15-30-20" fill="#487e67" stroke="#314d40" stroke-width="3.5"/>

    <path d="M48 60 35 20Q31 3 43 9l35 29m27 0 29-28q14-11 11 7l-9 45" fill="#f4e4c5" stroke="#384b42" stroke-width="3.8"/>
    <path d="m48 45-7-25 24 19m54 1 18-21-4 28" fill="#cb9c86" stroke="#d7bba0" stroke-width="2.5"/>
    <path d="M45 53q12-22 37-20l8-9 7 9q31-1 42 24l7 12-10 1 12 14-14 1 8 11-18 6q-14 15-34 15-21 0-35-14l-19-7 7-11-15-1 13-14-9-2Z" fill="#f5e6c7" stroke="#384b42" stroke-width="3.8"/>
    <path d="M49 58q11-13 28-12l14 12 12-12q20 1 28 15l-13 22-27 9-28-10Z" fill="#cfc7a5"/>
    <path d="M43 73q6 4 11 0 7 23 36 22 29 1 37-22 6 5 12 1l-6 15-11 7-8 9q-22 16-47-1l-8-8-12-6Z" fill="#fff9e8"/>
    <path d="m77 39 6-8 7 4 8-5 5 12-14-3-8 6Z" fill="#fff9e6"/>
    <g class="nim-eyes">
      <path d="M54 64q13-14 28 0-6 17-21 11Z" fill="#fffdf0" stroke="#4e5c48" stroke-width="2.4"/>
      <path d="M100 64q14-13 27 0-7 17-22 11Z" fill="#fffdf0" stroke="#4e5c48" stroke-width="2.4"/>
      <ellipse cx="70" cy="66" rx="6.5" ry="9" fill="#d4a246"/>
      <ellipse cx="112" cy="66" rx="6.5" ry="9" fill="#67b4ad"/>
      <ellipse cx="71" cy="67" rx="2.8" ry="5.8" fill="#293d35"/>
      <ellipse cx="111" cy="67" rx="2.8" ry="5.8" fill="#293d35"/>
      <circle cx="68" cy="62" r="2.2" fill="#fff"/><circle cx="109" cy="62" r="2.2" fill="#fff"/>
    </g>
    <path d="m52 57 11-10 18 9-16-2Zm47-1 19-10 11 12-13-4Z" fill="#fff9e7" stroke="#b6b292" stroke-width="1.5"/>
    <path d="M73 82q5-8 17-5 13-3 19 5l-4 11-15 9-16-10Z" fill="#fffdf0"/>
    <path d="m83 80 8-2 8 2-8 7Z" fill="#415148"/>
    <g class="nim-mouth"><path d="M91 87v5m-11-3q4 7 11 3 7 4 14-2" fill="none" stroke="#68735b" stroke-width="2.3"/></g>
    <path d="m53 81 8 3m-9 5 9 1m60-6 8-3m-8 9 9-1" fill="none" stroke="#d7b894" stroke-width="2"/>
    <path d="M75 106q16 5 33 0l-4 12-13 7-14-8Z" fill="#315b4c" stroke="#294438" stroke-width="2.7"/>
    <g class="nim-leaf"><path d="M91 106q-12 5-11 14 14 2 22-11-6 2-11-3Z" fill="#e9c46d" stroke="#987e42" stroke-width="1.8"/><path d="m82 120 13-10m-8 7-1-5m5 1 5 1" fill="none" stroke="#b18b45" stroke-width="1.4"/></g>
    <g transform="translate(14 8)">
    <g class="nim-wave">
      <path d="M125 111q-7-4-9-12l-3-9q0-6 5-3l5 9-1-18q2-7 6-2l3 15 2-20q4-5 7 1v21l5-12q5-3 6 3l-8 22-6 8Z" fill="#fff2d7" stroke="#6c7356" stroke-width="2.8"/>
      <path d="m126 100 9-2 4 5-7 5Z" fill="#dba986"/>
      <path d="m119 94 3 4m4-15 1 9m9-13v12m8-5-3 10" fill="none" stroke="#dfc9a2" stroke-width="1.6"/>
    </g>
    </g>
    <path d="m105 122 9 11m-47 8 4-9m33 28 2 10" fill="none" stroke="#7c9b77" stroke-width="2"/>
  </g>
  <g class="nim-charm nim-charm-three" fill="#e6be68"><path d="m153 90 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="15" cy="105" r="2"/></g>
</svg>`;

const ICONS = {
  swipe: '<path d="M25 32h30v27H25z" fill="#efb09a" stroke="#b57766" stroke-width="3"/><path d="M34 39h12m-12 7h9" stroke="#fff7e6" stroke-width="3" stroke-linecap="round"/>',
  keep: '<path d="m22 31 20-4 17 4v32l-17-4-20 4Z" fill="#b2d7b1" stroke="#6c916c" stroke-width="3"/><path d="M42 29v30m-13-19h7m12 0h5m-24 9h7m12 0h5" stroke="#faf4dc" stroke-width="3" stroke-linecap="round"/>',
  coins: '<circle cx="42" cy="45" r="21" fill="#f8cf6e" stroke="#b68c45" stroke-width="3"/><circle cx="42" cy="45" r="15" fill="none" stroke="#ffe9ac" stroke-width="3"/><path d="m42 34 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="#b98736"/>',
  super: '<path d="m45 20-21 28h16l-3 23 24-31H45Z" fill="#f3c662" stroke="#9d7a44" stroke-width="3" stroke-linejoin="round"/>',
  unlock: '<rect x="24" y="39" width="37" height="29" rx="7" fill="#e9be78" stroke="#a9814f" stroke-width="3"/><path d="M34 39v-9q0-16 16-12 9 3 8 12" fill="none" stroke="#94ab87" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="50" r="4" fill="#a9814f"/><path d="M42 52v7" stroke="#a9814f" stroke-width="4" stroke-linecap="round"/>',
  achievement: '<path d="M26 25h32v22q-16 22-32 0Z" fill="#efd17e" stroke="#b68c45" stroke-width="3"/><path d="M26 30H16v9q0 11 14 11m28-20h10v9q0 11-14 11M42 56v11m-10 1h20" fill="none" stroke="#b68c45" stroke-width="4" stroke-linecap="round"/><path d="m42 29 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#fff6cf"/>',
  profile: '<rect x="18" y="18" width="49" height="54" rx="11" fill="#e9dfef" stroke="#a18cb0" stroke-width="3"/><circle cx="42" cy="36" r="9" fill="#acbd99"/><path d="M27 60q0-20 15-20 16 0 16 20" fill="#acbd99"/><path d="M27 65h31" stroke="#fff5dd" stroke-width="3" stroke-linecap="round"/>'
};

const STYLES = `
.nim-shade{box-sizing:border-box;position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:rgba(55,47,43,.47);backdrop-filter:blur(5px);touch-action:none;overscroll-behavior:contain;animation:nim-appear .2s ease-out}
.nim-dialog{box-sizing:border-box;min-width:0;width:min(580px,100%);max-height:calc(100dvh - 36px);max-height:calc(100svh - 36px);overflow:auto;position:relative;padding:24px;border:3px solid #7c6850;border-radius:26px;background:#fff8e7;box-shadow:0 9px 0 rgba(74,65,48,.25),0 22px 80px rgba(45,41,32,.18);color:#67584a;touch-action:pan-y;overscroll-behavior:contain;animation:nim-pop .28s cubic-bezier(.2,.9,.3,1.2)}
.nim-dialog *{box-sizing:border-box}.nim-heading{display:flex;gap:15px;align-items:center}.nim-character{flex:0 0 116px;width:116px;height:128px;margin:-5px 0 -2px;overflow:visible}.nim-character svg{width:100%;height:100%;overflow:visible}.nim-body{transform-origin:90px 140px;animation:nim-bob 2.8s ease-in-out infinite}.nim-wave{transform-origin:130px 106px;animation:nim-wave 1.7s ease-in-out infinite}.nim-cape-edge{transform-origin:90px 114px;animation:nim-cape 3.2s ease-in-out infinite}.nim-charm{transform-box:fill-box;transform-origin:center;animation:nim-charm 3.7s ease-in-out infinite}.nim-charm-two{animation-delay:-1.5s;animation-duration:4.3s}.nim-charm-three{animation-delay:-.7s;animation-duration:2.9s}.nim-mouth{transform-origin:91px 89px;animation:nim-talk 1.9s ease-in-out infinite}.nim-leaf{animation:nim-leaf 3.3s ease-in-out infinite}.nim-eyes{transform-box:fill-box;transform-origin:center;animation:nim-blink 5s infinite}.nim-name{display:inline-flex;gap:7px;align-items:center;margin:0 0 6px;font-size:10px;line-height:1.6;letter-spacing:.12em;font-weight:900;color:#6f9171}.nim-speaking{display:inline-flex;gap:3px}.nim-speaking i{height:4px;width:4px;border-radius:50%;background:#8eae87;animation:nim-dot 1.3s ease-in-out infinite}.nim-speaking i:nth-child(2){animation-delay:.15s}.nim-speaking i:nth-child(3){animation-delay:.3s}.nim-dialog h2{margin:0;font-size:clamp(20px,5.3vw,28px);line-height:1.18;font-weight:950;letter-spacing:-.03em;color:#725b48}.nim-speech{position:relative;margin:15px 0 0;padding:17px 18px;border:2px solid #d6c6a1;border-radius:16px;background:#fffdf3;font-size:14px;line-height:1.75;white-space:pre-line}.nim-speech:before{content:'';position:absolute;left:42px;top:-8px;width:12px;height:12px;border-left:2px solid #d6c6a1;border-top:2px solid #d6c6a1;background:#fffdf3;transform:rotate(45deg)}
.nim-demo{height:93px;margin:13px 0 0;position:relative;overflow:hidden;border:1px dashed #dac9a7;border-radius:15px;background:repeating-linear-gradient(0deg,#f5f0df 0,#f5f0df 1px,#faf6e9 1px,#faf6e9 18px)}.nim-demo svg{width:84px;height:84px;position:absolute;left:calc(50% - 42px);top:4px;overflow:visible}.nim-demo-card{transform-origin:42px 45px;animation:nim-card 2.7s ease-in-out infinite}.nim-gesture{fill:none;stroke:#e59872;stroke-width:7;stroke-linecap:round;stroke-dasharray:76;stroke-dashoffset:76;animation:nim-swipe 2.7s ease-in-out infinite}.nim-demo-keep .nim-demo-card{animation:nim-keep 3s ease-in-out infinite}.nim-demo-keep .nim-demo-mark{animation:nim-check 3s ease-in-out infinite}.nim-demo:not(.nim-demo-swipe):not(.nim-demo-keep) .nim-demo-card{animation:nim-reward 2.4s ease-in-out infinite}.nim-demo-sparks{transform-origin:42px 45px;animation:nim-sparks 2.4s ease-out infinite}.nim-demo-caption{position:absolute;left:12px;bottom:8px;margin:0;font-size:10px;line-height:1.5;font-weight:800;color:#9b856a;max-width:calc(50% - 38px)}
.nim-actions{display:flex;gap:10px;align-items:center;justify-content:flex-end;margin-top:17px}.nim-counter{margin-right:auto;font-size:11px;color:#a18d73;font-weight:750}.nim-next{min-width:145px;min-height:48px;padding:12px 19px;border:2px solid #678365;border-radius:13px;background:#b9d8a3;box-shadow:0 3px 0 #87a477;color:#4e6948;font:inherit;font-size:13px;font-weight:900;cursor:pointer;touch-action:manipulation}.nim-next:hover{background:#c8e3b3}.nim-next:active{transform:translateY(2px);box-shadow:0 1px 0 #87a477}.nim-next:focus-visible{outline:3px solid #dc9b61;outline-offset:4px}
@keyframes nim-appear{from{opacity:0}to{opacity:1}}@keyframes nim-pop{from{transform:translateY(16px) scale(.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}@keyframes nim-bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-3px) rotate(1deg)}}@keyframes nim-wave{0%,100%{transform:rotate(0)}35%{transform:rotate(-13deg)}60%{transform:rotate(6deg)}}@keyframes nim-cape{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.7px)}}@keyframes nim-charm{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-6px) rotate(6deg)}}@keyframes nim-talk{0%,24%,51%,100%{transform:scaleY(1)}12%,39%{transform:scaleY(1.28)}}@keyframes nim-leaf{0%,100%{opacity:1}50%{opacity:.72}}@keyframes nim-blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.1)}}@keyframes nim-dot{0%,65%,100%{opacity:.35;transform:translateY(0)}35%{opacity:1;transform:translateY(-2px)}}@keyframes nim-card{0%,20%,100%{transform:rotate(-5deg);opacity:1}40%{transform:rotate(7deg);opacity:1}54%,80%{transform:translateY(-9px) rotate(13deg);opacity:.2}}@keyframes nim-swipe{0%,28%,100%{stroke-dashoffset:76;opacity:0}32%{opacity:1}54%,68%{stroke-dashoffset:0;opacity:1}80%{stroke-dashoffset:0;opacity:0}}@keyframes nim-keep{0%{transform:translateY(44px);opacity:0}20%,48%{transform:translateY(0);opacity:1}80%,100%{transform:translateY(-65px);opacity:0}}@keyframes nim-check{0%,50%,100%{opacity:0}65%,85%{opacity:1}}@keyframes nim-reward{0%,100%{transform:translateY(2px) rotate(-5deg) scale(.92)}48%{transform:translateY(-4px) rotate(5deg) scale(1.08)}}@keyframes nim-sparks{0%,25%,100%{transform:scale(.45);opacity:0}48%{opacity:1}78%{transform:scale(1.2);opacity:0}}
@media(max-width:420px){.nim-shade{padding:12px}.nim-dialog{padding:17px;border-radius:22px;max-height:calc(100svh - 24px)}.nim-character{flex-basis:91px;width:91px;height:105px}.nim-heading{gap:8px}.nim-name{font-size:9px}.nim-speech{font-size:13px;padding:14px}.nim-demo-caption{font-size:9px;left:8px}.nim-actions{margin-top:13px}.nim-next{min-width:139px;font-size:12px}}
@media(orientation:landscape) and (max-height:520px){.nim-shade{padding:10px}.nim-dialog{width:min(760px,100%);max-height:calc(100svh - 20px);padding:15px 20px;display:grid;grid-template-columns:190px minmax(0,1fr);gap:10px 18px}.nim-heading{grid-row:1/3;display:flex;flex-direction:column;gap:1px;justify-content:center;text-align:center}.nim-character{width:85px;height:94px;flex-basis:auto}.nim-dialog h2{font-size:20px}.nim-name{margin:0 0 4px}.nim-speech{margin:0;padding:11px 14px;font-size:12px;line-height:1.6}.nim-speech:before{display:none}.nim-demo{height:71px;margin:0}.nim-demo svg{width:67px;height:67px;left:calc(50% - 34px);top:1px}.nim-actions{grid-column:2;margin:0}.nim-next{min-height:42px;padding:8px 15px}.nim-demo-caption{font-size:9px;bottom:6px}}
@media(prefers-reduced-motion:reduce){.nim-shade,.nim-dialog,.nim-body,.nim-wave,.nim-cape-edge,.nim-charm,.nim-mouth,.nim-leaf,.nim-eyes,.nim-speaking i,.nim-demo-card,.nim-demo-mark,.nim-gesture,.nim-demo-sparks{animation:none!important}.nim-gesture{stroke-dashoffset:0;opacity:.8}.nim-demo-keep .nim-demo-mark{opacity:1}}
`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function demo(animation) {
  if (animation === 'wave') return null;
  const wrapper = element('div', `nim-demo nim-demo-${animation}`);
  wrapper.setAttribute('aria-hidden', 'true');
  const sparks = '<g class="nim-demo-sparks" fill="#e8b65e"><path d="m13 17 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm58 39 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="66" cy="17" r="3"/><circle cx="13" cy="61" r="2"/></g>';
  const gesture = animation === 'swipe' ? '<path class="nim-gesture" d="M10 71 72 18"/>' : animation === 'keep' ? '<path class="nim-demo-mark" d="m59 62 6 6 11-13" fill="none" stroke="#78a16d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' : sparks;
  wrapper.innerHTML = `<svg viewBox="0 0 84 84" focusable="false"><g class="nim-demo-card">${ICONS[animation] || ICONS.unlock}</g>${gesture}</svg>`;
  const captions = {swipe:'Gedrückt halten · durchziehen', keep:'Finger weg · hochfliegen lassen', coins:'Deine Belohnung', super:'Dein neuer Move', unlock:'Neu für dich', achievement:'Geschafft!', profile:'Dein Ninja-Profil'};
  wrapper.append(element('span', 'nim-demo-caption', captions[animation]));
  return wrapper;
}

/** Original fox-sensei guide art. Distinct from the player and all buyable outfits. */
export function ninjaPortrait() { return NINJA; }

/** A pausing explanation queue. Persistence belongs to the caller, on acknowledgment. */
export function createMentor({root, onOpen = () => {}, onClose = () => {}} = {}) {
  if (!root || typeof root.replaceChildren !== 'function') throw new TypeError('createMentor needs a DOM root.');
  const style = element('style');
  style.textContent = STYLES;
  const queue = [];
  let active = null;
  let opened = false;
  let transitioning = false;
  let previousFocus = null;
  let totalShown = 0;
  let totalAcknowledged = 0;
  let lastAcknowledged = null;

  function stop(event) { event.stopPropagation(); }

  function close() {
    active = null;
    root.replaceChildren();
    if (!opened) return;
    opened = false;
    document.removeEventListener('keydown', onKeyDown, true);
    const focus = previousFocus;
    previousFocus = null;
    onClose();
    if (!opened && focus?.isConnected && typeof focus.focus === 'function') focus.focus({preventScroll:true});
  }

  function acknowledge(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (!active || transitioning) return;
    const current = active;
    active = null;
    transitioning = true;
    totalAcknowledged += 1;
    lastAcknowledged = current.message.id || null;
    try { current.onDone?.(current.message.id); }
    finally {
      transitioning = false;
      if (queue.length) renderNext();
      else close();
    }
  }

  function onKeyDown(event) {
    if (!opened) return;
    if (event.key === 'Escape') acknowledge(event);
    else if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      root.querySelector('#mentor-next')?.focus({preventScroll:true});
    }
  }

  function renderNext() {
    if (active || transitioning || !queue.length) return;
    if (!opened) {
      opened = true;
      previousFocus = document.activeElement;
      document.addEventListener('keydown', onKeyDown, true);
      onOpen();
      if (!opened || !queue.length) return;
    }
    active = queue.shift();
    totalShown += 1;
    const message = active.message;
    const shade = element('div', 'nim-shade');
    shade.addEventListener('pointerdown', stop);
    shade.addEventListener('pointerup', stop);
    shade.addEventListener('pointermove', stop);
    shade.addEventListener('click', stop);
    const panel = element('section', 'nim-dialog');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'mentor-title');
    panel.setAttribute('aria-describedby', 'mentor-text');
    const heading = element('div', 'nim-heading');
    const ninja = element('div', 'nim-character');
    ninja.innerHTML = NINJA;
    const headingText = element('div');
    const name = element('div', 'nim-name', 'MEISTER NIM · DEIN GUIDE');
    const speaking = element('span', 'nim-speaking');
    speaking.setAttribute('aria-hidden', 'true');
    speaking.append(element('i'), element('i'), element('i'));
    name.append(speaking);
    const title = element('h2', '', message.title);
    title.id = 'mentor-title';
    headingText.append(name, title);
    heading.append(ninja, headingText);
    const speech = element('p', 'nim-speech', message.text);
    speech.id = 'mentor-text';
    panel.append(heading, speech);
    const demonstration = demo(message.animation);
    if (demonstration) panel.append(demonstration);
    const actions = element('div', 'nim-actions');
    if (queue.length) actions.append(element('span', 'nim-counter', `${queue.length} weiterer Tipp${queue.length === 1 ? '' : 's'}`));
    const next = element('button', 'nim-next', message.buttonLabel || (queue.length ? 'Weiter →' : 'Verstanden!'));
    next.type = 'button';
    next.id = 'mentor-next';
    next.addEventListener('click', acknowledge);
    actions.append(next);
    panel.append(actions);
    shade.append(panel);
    root.replaceChildren(style, shade);
    next.focus({preventScroll:true});
  }

  return {
    show(message, onDone) {
      if (!message || typeof message !== 'object') return false;
      const normalized = {
        id:typeof message.id === 'string' ? message.id.slice(0, 160) : '',
        title:String(message.title || 'Ein Tipp von NIM').slice(0, 180),
        text:String(message.text || '').slice(0, 2400),
        animation:ANIMATIONS.has(message.animation) ? message.animation : 'wave',
        buttonLabel:typeof message.buttonLabel === 'string' ? message.buttonLabel.slice(0, 80) : ''
      };
      queue.push({message:normalized, onDone:typeof onDone === 'function' ? onDone : null});
      renderNext();
      if (active && queue.length) {
        const actions = root.querySelector('.nim-actions');
        const next = root.querySelector('#mentor-next');
        let counter = actions?.querySelector('.nim-counter');
        if (!counter && actions && next) {
          counter = element('span', 'nim-counter');
          actions.insertBefore(counter, next);
        }
        if (counter) counter.textContent = `${queue.length} weiterer Tipp${queue.length === 1 ? '' : 's'}`;
        if (next && !active.message.buttonLabel) next.textContent = 'Weiter →';
      }
      return true;
    },
    isOpen() { return opened; },
    clear() { queue.length = 0; close(); },
    getStats() {
      return {open:opened, activeId:active?.message.id || null, queued:queue.length, shown:totalShown, acknowledged:totalAcknowledged, lastAcknowledged};
    }
  };
}
