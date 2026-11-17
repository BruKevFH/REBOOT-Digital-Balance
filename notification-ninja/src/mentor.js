const ANIMATIONS = new Set(['wave', 'swipe', 'keep', 'coins', 'super', 'unlock', 'achievement', 'profile']);

const NINJA = `<svg viewBox="0 0 180 200" aria-hidden="true" focusable="false">
  <ellipse cx="91" cy="188" rx="52" ry="8" fill="#092b35" opacity=".16"/>
  <g class="nim-charm nim-charm-one" stroke-linecap="round" stroke-linejoin="round">
    <path d="m148 37 14 4-2 23-15-3 2-10-2-3Z" fill="#fff0b9" stroke="#a87836" stroke-width="2"/>
    <path d="m153 44 4 1m-5 5 5 1m-6 5 4 1" stroke="#c39b53" stroke-width="1.8"/>
  </g>
  <g class="nim-charm nim-charm-two" fill="#ffd66b" stroke="#bd8b38" stroke-width="1.5">
    <path d="m22 59 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>
    <circle cx="20" cy="44" r="2.5" stroke="none"/>
  </g>
  <g class="nim-body" stroke="#092b35" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M111 145q32 12 39-22 25 23 9 49-14 24-49 2Z" fill="#ed8a43"/>
    <path d="M146 168q15-15 4-45 23 20 9 43l-8-3 1 10-9-3-5 9-6-6Z" fill="#fff1cd" stroke="none"/>
    <path d="M114 163q16 13 30 3" fill="none" stroke="#ffbd70" stroke-width="4"/>
    <path d="m63 151-7 25q-3 11 13 12 13 1 16-13l6-17 7 20q5 12 18 9 13-3 9-13l-12-27Z" fill="#173f40"/>
    <path d="M57 178q12 5 25-1l-1 9q-21 8-26-2m47-6q12 4 22-1l5 8q-16 9-27 0Z" fill="#f7c078"/>
    <path d="M60 109q30-17 57 1l15 38q-2 19-41 23-40-3-43-23Z" fill="#267f6c"/>
    <path d="M61 115q-7 22-5 34 11 12 35 14l-5-45Z" fill="#3dac89" stroke="none"/>
    <path d="M75 111q16-5 30 1l10 42q-25 10-47-1Z" fill="#fff0cf"/>
    <path d="m73 119 17 16 17-17m-17 17v18" fill="none" stroke="#87c5a3" stroke-width="5"/>
    <path class="nim-cape-edge" d="m52 147 11 11m54-2 11-9" fill="none" stroke="#f4cf78" stroke-width="3"/>
    <path d="M61 148q30 7 59-1v11q-29 11-59 1Z" fill="#123d3d"/>
    <rect x="81" y="150" width="19" height="14" rx="4" fill="#f4cb70"/>
    <path d="m87 155 7-1" stroke="#fff0bb" stroke-width="3"/>
    <path d="M62 116q-18 0-25 20l14 10 19-19m46-12 17 14 13-15-15-10-11 8" fill="#3daf8c"/>
    <path d="m29 182 5-64q-5-12 0-20 6-5 10-1 6 8-3 11" fill="none" stroke="#6b5339" stroke-width="6"/>
    <path d="m30 178 5-58m0-15 5-4" fill="none" stroke="#c9a873" stroke-width="2.5"/>
    <path d="M35 126q-11-8-14 2-2 11 10 13 9-1 12-10" fill="#f8c47b" stroke-width="3"/>
    <path d="m25 129 7 1m-5 4 6 1" stroke="#dd9452" stroke-width="2"/>
    <path d="M46 60 35 17q-3-12 7-6l32 25m36-1 28-25q11-7 9 7l-9 46Z" fill="#ed8a43"/>
    <path d="m47 43-5-22 20 19m61 0 17-20-4 25" fill="#f6baa0" stroke="#b9603e" stroke-width="2.5"/>
    <path d="M39 61q10-27 50-28 39 0 51 28l10 14-12 2 11 14-18 4-8 15q-31 24-65-1l-9-14-19-4 11-14-11-2Z" fill="#ed8a43"/>
    <path d="M45 62q9-20 33-22-14 9-20 24Z" fill="#ffc176" stroke="none"/>
    <path d="M37 77q14-1 26 11l27 13 27-13q11-12 25-12l-9 19-13 6-9 12q-22 13-44 0l-9-12-14-6Z" fill="#fff1cf" stroke-width="2.5"/>
    <path d="M44 53q45-15 94 0l-2 15q-45-14-90 0Z" fill="#25bd97"/>
    <path d="M52 53q38-11 77-1" fill="none" stroke="#b9f2c9" stroke-width="3"/>
    <path d="m137 53 14-10-1 17 12 8-25-3" fill="#25bd97"/>
    <path d="m91 39 4 8 9 1-7 7 2 9-8-5-8 5 2-9-7-7 9-1Z" fill="#ffd46d" stroke-width="2.8"/>
    <path d="m91 44 2 6 5 1-4 3 1 5-4-3Z" fill="#fff0b3" stroke="none"/>
    <g class="nim-eyes">
      <path d="M55 77q9-11 18-1m33 0q9-10 18 1" fill="none" stroke-width="4.5"/>
      <path d="m51 85 9 2m64-2 8-2" fill="none" stroke="#d87755" stroke-width="3"/>
    </g>
    <path d="M72 91q6-10 18-6 12-4 20 6l-6 13-14 8-14-9Z" fill="#fff9e8" stroke="none"/>
    <path d="m83 88 8-2 8 2-8 7Z" fill="#173f40" stroke-width="2"/>
    <g class="nim-mouth"><path d="M91 95v5m-11-2q4 7 11 3 7 4 13-3" fill="none" stroke-width="2.5"/></g>
    <path d="m50 94 11 3m-8 4 10 1m57-5 11-3m-12 8 10-1" fill="none" stroke="#d7ad7d" stroke-width="1.8"/>
    <path d="M63 112q28 9 53-1l2 13q-27 15-57 0Z" fill="#e96b42" stroke-width="3"/>
    <path d="m71 119 18 4 19-4" fill="none" stroke="#ffcf83" stroke-width="3"/>
    <path class="nim-cape-edge" d="M112 117q20 6 32-10l-2 17 15 9q-26 9-45-3Z" fill="#ef7a42" stroke-width="3"/>
    <g class="nim-leaf"><path d="m89 129 7 5-7 9-7-7Z" fill="#ffd46d" stroke="#a77738" stroke-width="2"/><path d="m86 136 4-3" stroke="#fff0b5" stroke-width="2"/></g>
    <g class="nim-wave">
      <path d="M131 120q-14-8-12-18l-3-9q0-5 5-2l5 8-1-17q2-6 6-2l3 15 3-17q4-4 6 2l-1 17 5-9q5-1 5 4l-8 21-7 8Z" fill="#f6bc75" stroke-width="3"/>
      <path d="m128 103 8-2 5 6-8 6Z" fill="#e68a53" stroke="none"/>
      <path d="m125 94 2 5m4-12 1 9m8-10-1 10" fill="none" stroke="#ffdca0" stroke-width="2"/>
    </g>
  </g>
  <g class="nim-charm nim-charm-three" fill="#ffd46d"><path d="m157 83 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="17" cy="103" r="2"/></g>
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
@media(orientation:landscape) and (max-height:520px){.nim-shade{padding:10px}.nim-dialog{width:min(760px,100%);max-height:calc(100svh - 20px);padding:15px 20px;display:grid;grid-template-columns:190px minmax(0,1fr);gap:10px 18px}.nim-heading{grid-row:1/3;display:flex;flex-direction:column;gap:1px;justify-content:center;text-align:center}.nim-character{width:85px;height:94px;flex-basis:auto}.nim-dialog h2{font-size:20px}.nim-name{margin:0 0 4px}.nim-speech{margin:0;padding:11px 14px;font-size:12px;line-height:1.6}.nim-speech:before{display:none}.nim-demo{height:71px;margin:0}.nim-demo svg{width:67px;height:67px;left:calc(50% - 34px);top:1px}.nim-actions{grid-column:2;margin:0}.nim-next{min-height:44px;padding:8px 15px}.nim-demo-caption{font-size:9px;bottom:6px}}
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
