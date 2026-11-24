/* Local first-paint preferences; no network, account data or inline-script CSP exception. */
(()=>{try{const value=localStorage.getItem('notification-ninja:ui-theme:v1');if(['relaxed','dark','noir'].includes(value))document.documentElement.dataset.ninjaTheme=value;}catch{}})();
