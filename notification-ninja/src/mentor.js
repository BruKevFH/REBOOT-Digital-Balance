const ANIMATIONS = new Set(['wave', 'swipe', 'keep', 'coins', 'super', 'unlock', 'achievement', 'profile']);

const NINJA = `<svg viewBox="0 0 180 200" aria-hidden="true" focusable="false">
  <ellipse cx="91" cy="185" rx="51" ry="9" fill="#604b41" opacity=".13"/>
  <g class="nim-body">
    <path d="M65 137 57 179Q64 190 78 181l13-32 11 33q17 8 24-4l-11-43" fill="#509c88" stroke="#365b51" stroke-width="4" stroke-linejoin="round"/>
    <path d="m58 174-4 8q1 12 25 5l2-12m22 0 1 13q23 4 25-7l-5-9" fill="#3d5d55"/>
    <path d="M62 93q-18 9-28 32l12 9 25-21m47-14 20 22 13-8-19-30" fill="#75bda2" stroke="#365b51" stroke-width="4" stroke-linejoin="round"/>
    <g class="nim-wave"><path d="m136 119 12-9 5-24q-2-8-7-4l-5 14-1-17q-6-6-8 2l-1 25Z" fill="#efc09b" stroke="#715544" stroke-width="3" stroke-linejoin="round"/></g>
    <path d="M65 96q22-12 46 0l13 49q-30 17-65 0Z" fill="#8dccae" stroke="#365b51" stroke-width="4"/>
    <path d="m73 101 34 38m0-38-31 38" fill="none" stroke="#c1e5c7" stroke-width="9"/>
    <path d="m61 136 61-1 2 10q-32 10-65 0Z" fill="#d89258" stroke="#875e3f" stroke-width="3"/>
    <rect x="82" y="134" width="17" height="15" rx="4" fill="#ffe1a0" stroke="#966d41" stroke-width="3"/>
    <path class="nim-scarf" d="M110 88q25 2 37-15l-1 18 14 7q-24 8-50 0" fill="#eb9e76" stroke="#a66750" stroke-width="3" stroke-linejoin="round"/>
    <path d="M43 61q0-45 47-46 48 1 48 46l-6 29q-16 24-42 24T47 90Z" fill="#79bda3" stroke="#365b51" stroke-width="4"/>
    <path d="M50 60q40-17 81 0l-4 23q-39 17-73 0Z" fill="#ffe1bb" stroke="#54745c" stroke-width="3"/>
    <g class="nim-eyes" fill="#424b43"><ellipse cx="73" cy="71" rx="4.5" ry="7"/><ellipse cx="108" cy="71" rx="4.5" ry="7"/></g>
    <path d="m63 59 14-2m25 0 14 3" stroke="#526d55" stroke-width="3" stroke-linecap="round"/>
    <path d="M51 81q37 17 79 0l-2 15q-36 28-73 0Z" fill="#5c9e88" stroke="#365b51" stroke-width="3"/>
    <path d="M72 91q17 7 37 0" fill="none" stroke="#a4d4b8" stroke-width="3" stroke-linecap="round"/>
    <path d="m79 28 11-7 12 7-12 14Z" fill="#ffe3a1" stroke="#bd9753" stroke-width="2"/>
  </g>
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
.nim-dialog *{box-sizing:border-box}.nim-heading{display:flex;gap:15px;align-items:center}.nim-character{flex:0 0 116px;width:116px;height:128px;margin:-5px 0 -2px;overflow:visible}.nim-character svg{width:100%;height:100%;overflow:visible}.nim-body{transform-origin:90px 140px;animation:nim-bob 2.8s ease-in-out infinite}.nim-wave{transform-origin:137px 112px;animation:nim-wave 1.7s ease-in-out infinite}.nim-scarf{transform-origin:110px 90px;animation:nim-scarf 2s ease-in-out infinite}.nim-eyes{transform-box:fill-box;transform-origin:center;animation:nim-blink 5s infinite}.nim-name{display:inline-flex;gap:7px;align-items:center;margin:0 0 6px;font-size:10px;line-height:1.6;letter-spacing:.12em;font-weight:900;color:#6f9171}.nim-speaking{display:inline-flex;gap:3px}.nim-speaking i{height:4px;width:4px;border-radius:50%;background:#8eae87;animation:nim-dot 1.3s ease-in-out infinite}.nim-speaking i:nth-child(2){animation-delay:.15s}.nim-speaking i:nth-child(3){animation-delay:.3s}.nim-dialog h2{margin:0;font-size:clamp(20px,5.3vw,28px);line-height:1.18;font-weight:950;letter-spacing:-.03em;color:#725b48}.nim-speech{position:relative;margin:15px 0 0;padding:17px 18px;border:2px solid #d6c6a1;border-radius:16px;background:#fffdf3;font-size:14px;line-height:1.75;white-space:pre-line}.nim-speech:before{content:'';position:absolute;left:42px;top:-8px;width:12px;height:12px;border-left:2px solid #d6c6a1;border-top:2px solid #d6c6a1;background:#fffdf3;transform:rotate(45deg)}
.nim-demo{height:93px;margin:13px 0 0;position:relative;overflow:hidden;border:1px dashed #dac9a7;border-radius:15px;background:repeating-linear-gradient(0deg,#f5f0df 0,#f5f0df 1px,#faf6e9 1px,#faf6e9 18px)}.nim-demo svg{width:84px;height:84px;position:absolute;left:calc(50% - 42px);top:4px;overflow:visible}.nim-demo-card{transform-origin:42px 45px;animation:nim-card 2.7s ease-in-out infinite}.nim-gesture{fill:none;stroke:#e59872;stroke-width:7;stroke-linecap:round;stroke-dasharray:76;stroke-dashoffset:76;animation:nim-swipe 2.7s ease-in-out infinite}.nim-demo-keep .nim-demo-card{animation:nim-keep 3s ease-in-out infinite}.nim-demo-keep .nim-demo-mark{animation:nim-check 3s ease-in-out infinite}.nim-demo:not(.nim-demo-swipe):not(.nim-demo-keep) .nim-demo-card{animation:nim-reward 2.4s ease-in-out infinite}.nim-demo-sparks{transform-origin:42px 45px;animation:nim-sparks 2.4s ease-out infinite}.nim-demo-caption{position:absolute;left:12px;bottom:8px;margin:0;font-size:10px;line-height:1.5;font-weight:800;color:#9b856a;max-width:calc(50% - 38px)}
.nim-actions{display:flex;gap:10px;align-items:center;justify-content:flex-end;margin-top:17px}.nim-counter{margin-right:auto;font-size:11px;color:#a18d73;font-weight:750}.nim-next{min-width:145px;min-height:48px;padding:12px 19px;border:2px solid #678365;border-radius:13px;background:#b9d8a3;box-shadow:0 3px 0 #87a477;color:#4e6948;font:inherit;font-size:13px;font-weight:900;cursor:pointer;touch-action:manipulation}.nim-next:hover{background:#c8e3b3}.nim-next:active{transform:translateY(2px);box-shadow:0 1px 0 #87a477}.nim-next:focus-visible{outline:3px solid #dc9b61;outline-offset:4px}
@keyframes nim-appear{from{opacity:0}to{opacity:1}}@keyframes nim-pop{from{transform:translateY(16px) scale(.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}@keyframes nim-bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-3px) rotate(1deg)}}@keyframes nim-wave{0%,100%{transform:rotate(0)}35%{transform:rotate(-13deg)}60%{transform:rotate(6deg)}}@keyframes nim-scarf{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(7deg)}}@keyframes nim-blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.1)}}@keyframes nim-dot{0%,65%,100%{opacity:.35;transform:translateY(0)}35%{opacity:1;transform:translateY(-2px)}}@keyframes nim-card{0%,20%,100%{transform:rotate(-5deg);opacity:1}40%{transform:rotate(7deg);opacity:1}54%,80%{transform:translateY(-9px) rotate(13deg);opacity:.2}}@keyframes nim-swipe{0%,28%,100%{stroke-dashoffset:76;opacity:0}32%{opacity:1}54%,68%{stroke-dashoffset:0;opacity:1}80%{stroke-dashoffset:0;opacity:0}}@keyframes nim-keep{0%{transform:translateY(44px);opacity:0}20%,48%{transform:translateY(0);opacity:1}80%,100%{transform:translateY(-65px);opacity:0}}@keyframes nim-check{0%,50%,100%{opacity:0}65%,85%{opacity:1}}@keyframes nim-reward{0%,100%{transform:translateY(2px) rotate(-5deg) scale(.92)}48%{transform:translateY(-4px) rotate(5deg) scale(1.08)}}@keyframes nim-sparks{0%,25%,100%{transform:scale(.45);opacity:0}48%{opacity:1}78%{transform:scale(1.2);opacity:0}}
@media(max-width:420px){.nim-shade{padding:12px}.nim-dialog{padding:17px;border-radius:22px;max-height:calc(100svh - 24px)}.nim-character{flex-basis:91px;width:91px;height:105px}.nim-heading{gap:8px}.nim-name{font-size:9px}.nim-speech{font-size:13px;padding:14px}.nim-demo-caption{font-size:9px;left:8px}.nim-actions{margin-top:13px}.nim-next{min-width:139px;font-size:12px}}
@media(orientation:landscape) and (max-height:520px){.nim-shade{padding:10px}.nim-dialog{width:min(760px,100%);max-height:calc(100svh - 20px);padding:15px 20px;display:grid;grid-template-columns:190px minmax(0,1fr);gap:10px 18px}.nim-heading{grid-row:1/3;display:flex;flex-direction:column;gap:1px;justify-content:center;text-align:center}.nim-character{width:85px;height:94px;flex-basis:auto}.nim-dialog h2{font-size:20px}.nim-name{margin:0 0 4px}.nim-speech{margin:0;padding:11px 14px;font-size:12px;line-height:1.6}.nim-speech:before{display:none}.nim-demo{height:71px;margin:0}.nim-demo svg{width:67px;height:67px;left:calc(50% - 34px);top:1px}.nim-actions{grid-column:2;margin:0}.nim-next{min-height:42px;padding:8px 15px}.nim-demo-caption{font-size:9px;bottom:6px}}
@media(prefers-reduced-motion:reduce){.nim-shade,.nim-dialog,.nim-body,.nim-wave,.nim-scarf,.nim-eyes,.nim-speaking i,.nim-demo-card,.nim-demo-mark,.nim-gesture,.nim-demo-sparks{animation:none!important}.nim-gesture{stroke-dashoffset:0;opacity:.8}.nim-demo-keep .nim-demo-mark{opacity:1}}
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

/** Original static SVG, safe to reuse in the local profile and welcome screen. */
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
    const name = element('div', 'nim-name', 'NIM · DEIN NINJA-COACH');
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
