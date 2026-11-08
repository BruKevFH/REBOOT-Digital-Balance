import {tr,localizeDOM} from './i18n.js';
import {getPlayerProgress} from './player.js';
import {validateRegistration} from './accounts.js';
import {mfaQR} from './mfa-qr.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const focusable='button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex]:not([tabindex="-1"])';
const visible=element=>element.getClientRects().length>0&&!element.closest('[hidden],[inert]')&&(!element.checkVisibility||element.checkVisibility({checkVisibilityCSS:true}));

/** One focus boundary for all game dialogs, including NIM and account dialogs. */
export function installModalAccessibility(doc=document){
  let current=null,returnFocus=null,queued=false;
  const top=()=>[...doc.querySelectorAll('[role="dialog"][aria-modal="true"]')].filter(visible).at(-1)||null;
  function sync(){
    queued=false;const next=top();if(next===current)return;
    if(!current&&next)returnFocus=doc.activeElement;
    current=next;
    if(next){
      if(!next.hasAttribute('tabindex'))next.tabIndex=-1;
      if(!next.contains(doc.activeElement))(next.querySelector('[autofocus]')||[...next.querySelectorAll(focusable)].find(visible)||next).focus({preventScroll:true});
    }else{const previous=returnFocus;returnFocus=null;if(previous?.isConnected&&visible(previous))previous.focus({preventScroll:true});}
  }
  const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(sync);}});
  observer.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','aria-modal']});
  function keydown(event){
    const dialog=top();if(!dialog||event.key!=='Tab')return;
    const items=[...dialog.querySelectorAll(focusable)].filter(visible),first=items[0],last=items.at(-1);
    if(!items.length){event.preventDefault();dialog.focus();return;}
    if(event.shiftKey&&(doc.activeElement===first||!dialog.contains(doc.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(doc.activeElement===last||!dialog.contains(doc.activeElement))){event.preventDefault();first.focus();}
  }
  function focusin(event){const dialog=top();if(dialog&&!dialog.contains(event.target))([...dialog.querySelectorAll(focusable)].find(visible)||dialog).focus({preventScroll:true});}
  doc.addEventListener('keydown',keydown,true);doc.addEventListener('focusin',focusin,true);sync();
  return ()=>{observer.disconnect();doc.removeEventListener('keydown',keydown,true);doc.removeEventListener('focusin',focusin,true);};
}

/** Real API forms. No password or recovery code is saved by this UI. */
export function createAccountUI({accounts,onSignedIn=()=>{},onGuest=()=>{},onNavigate=()=>{},onDismiss=()=>{},onViewChange=()=>{},onDelete=()=>{},onLogout=()=>{},onRename=()=>{},onRefresh=async()=>null,onImport=()=>{},toast=()=>{},portrait=()=>''}={}){
  if(!accounts)throw new TypeError('Account client required.');
  const host=document.createElement('div');host.id='account-root';document.body.append(host);
  let active='',busy=false,returnFocus=null,formId=0,mfaChallenge=null;
  const b=(label,action,kind='ghost')=>`<button type="button" class="btn ${kind}" data-account="${action}">${label}</button>`;
  const statusMarkup=()=>{const status=accounts.getStatus?.()||{};return status.configured===false?'<aside class="account-service-note"><strong>Online-Konten sind hier noch nicht verbunden.</strong><p>Du kannst sofort als Gast spielen. Für die Synchronisierung muss der Kontodienst erreichbar sein.</p><button type="button" class="btn ghost" data-account="retry">Verbindung erneut prüfen</button></aside>':'';};
  function close(){if(busy)return false;host.replaceChildren();active='';const previous=returnFocus;returnFocus=null;if(previous?.isConnected)previous.focus({preventScroll:true});return true;}
  function draw(title,body,{footer=true,kind=''}={}){
    if(!active)returnFocus=document.activeElement;
    active=kind||title;busy=false;formId++;
    host.innerHTML=`<div class="modal-shade account-shade"><section class="panel account-panel" role="dialog" aria-modal="true" aria-labelledby="account-title"><header class="panel-header"><button type="button" class="panel-back" data-account="close" aria-label="Zurück"><span aria-hidden="true">←</span> Zurück</button><span class="panel-header-title">NOTIFICATION NINJA</span>${kind==='profile'?'<button type="button" class="panel-home" data-account="close">Übersicht</button>':'<button type="button" class="panel-home" data-account="guest">Als Gast spielen</button>'}</header><span class="eyebrow">DEIN NINJA-KONTO</span><h2 id="account-title">${title}</h2>${body}<p id="account-error" class="form-error" role="alert" aria-live="assertive"></p><p id="account-working" class="account-working" role="status" aria-live="polite"></p>${footer?'<div class="account-guest-note"><strong>Du entscheidest.</strong><p>Als Gast bleibt dein Fortschritt auf diesem Gerät. Ein Konto synchronisiert deinen Ninja und ermöglicht geprüfte Open Runs.</p></div>':''}</section></div>`;
    localizeDOM(host);if(['login','register','recovery','profile'].includes(active))onViewChange(active);[...host.querySelectorAll('input:not([type="password"]),button')].find(visible)?.focus({preventScroll:true});
  }
  const loginField=()=>`<label class="account-field" for="account-username"><span>Ninja-Name oder E-Mail</span><input id="account-username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required maxlength="254" autofocus></label>`;
  const nameField=(value='')=>`<label class="account-field" for="account-username"><span>Ninja-Name</span><input id="account-username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required minlength="3" maxlength="36" value="${escape(value)}" aria-describedby="account-name-help"><small id="account-name-help">3–18 Zeichen. Nutze einen Spitznamen statt deines echten Namens.</small></label>`;
  const passwordField=(label='Passwort',autocomplete='current-password')=>`<label class="account-field" for="account-password"><span>${label}</span><span class="password-control"><input id="account-password" name="password" type="password" autocomplete="${autocomplete}" required minlength="10" maxlength="128" aria-describedby="account-password-help"><button type="button" data-account="reveal" aria-controls="account-password" aria-pressed="false" aria-label="Passwort anzeigen">Anzeigen</button></span><small id="account-password-help">10–128 Zeichen. Dein Passwort wird geschützt gespeichert.</small></label>`;
  function login(){if(accounts.getSession?.()){profile();toast('Du bist bereits angemeldet.');return;}draw('Willkommen zurück, Ninja.',`${statusMarkup()}<p>Dein Dojo wartet. Melde dich mit deinem Ninja-Namen oder deiner E-Mail an.</p><form data-account-form="login">${loginField()}${passwordField()}<button class="btn primary account-submit" type="submit">Anmelden →</button></form><div class="account-links">${b('Konto erstellen','register')}${b('Passwort vergessen?','recovery')}</div>`,{kind:'login'});}
  function register(){if(accounts.getSession?.()){profile();toast('Du bist bereits angemeldet.');return;}draw('Ein Ninja. Auf deinen Geräten.',`${statusMarkup()}<p>Dein Konto speichert Fortschritt, Münzen und deine Sammlung. Dein Gastspielstand bleibt erhalten.</p><form data-account-form="register">${nameField()}<label class="account-field" for="account-email"><span>E-Mail-Adresse</span><input id="account-email" name="email" type="email" autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" required maxlength="254" aria-describedby="account-email-help"><small id="account-email-help">Deine E-Mail bleibt privat. Die Passwort-Wiederherstellung nutzt deinen persönlichen Code.</small></label>${passwordField('Passwort wählen','new-password')}<label class="account-field" for="account-password-confirmation"><span>Passwort bestätigen</span><input id="account-password-confirmation" name="passwordConfirmation" type="password" autocomplete="new-password" required minlength="10" maxlength="128"></label><label class="account-check"><input type="checkbox" name="privacyAccepted" required><span>Ich stimme der Speicherung meiner Kontodaten und meines Spielfortschritts gemäß den <a href="./home.html#projekt" target="_blank" rel="noopener">Datenschutzhinweisen</a> zu.</span></label><label class="account-check"><input type="checkbox" name="understood" required><span>Ich speichere meinen Wiederherstellungscode sicher. Ohne ihn kann ich mein Passwort nicht zurücksetzen.</span></label><button class="btn primary account-submit" type="submit">Konto erstellen →</button></form><div class="account-links">${b('Ich habe schon ein Konto','login')}</div>`,{kind:'register'});}
  function recovery(){draw('Zurück in dein Dojo.',`${statusMarkup()}<p>Nutze den Wiederherstellungscode, den du bei der Registrierung erhalten hast. Danach bekommst du einen neuen Code.</p><form data-account-form="recovery">${nameField()}<label class="account-field" for="account-recovery"><span>Wiederherstellungscode</span><input id="account-recovery" name="recoveryKey" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" required maxlength="60" placeholder="NNR-…"></label>${passwordField('Neues Passwort','new-password')}<label class="account-field" for="account-reset-mfa"><span>MFA-Code (falls aktiviert)</span><input id="account-reset-mfa" name="mfaCode" type="text" autocomplete="one-time-code" maxlength="40" placeholder="6 Ziffern oder Wiederherstellungscode"></label><button class="btn primary account-submit" type="submit">Passwort zurücksetzen</button></form><div class="account-links">${b('Zur Anmeldung','login')}</div><p class="account-fine">Kein Code mehr vorhanden? Dein Gastspiel bleibt nutzbar. Aus Sicherheitsgründen können wir den Code nicht aus deinem Namen ableiten.</p>`,{kind:'recovery'});}
  function recoveryKey(key){draw('Dein Schlüssel zum Dojo.',`<div class="account-key-art" aria-hidden="true">✦</div><p><strong>Speichere diesen Code jetzt sicher.</strong> Du brauchst ihn, wenn du dein Passwort vergisst. Er wird nur dieses eine Mal angezeigt.</p><label class="account-field" for="account-key"><span>Dein Wiederherstellungscode</span><textarea id="account-key" readonly rows="3" spellcheck="false" autocomplete="off" translate="no" data-user-text>${escape(key)}</textarea></label><div class="account-links">${b('Code kopieren','copy-key')}</div><form data-account-form="acknowledge-key"><label class="account-check"><input type="checkbox" name="saved" required><span>Ich habe meinen Code sicher gespeichert.</span></label><button class="btn primary account-submit" type="submit">Weiter zum Dojo →</button></form>`,{kind:'key',footer:false});}
  function mfaLogin(){
    draw('Zusätzlicher Schutz für deinen Ninja.',`<p>Öffne deine Authenticator-App und gib den aktuellen sechsstelligen Code ein. Alternativ kannst du einen noch unbenutzten Wiederherstellungscode verwenden.</p>
    <form data-account-form="mfa-login"><label class="account-field" for="account-mfa-code"><span>Authenticator- oder Wiederherstellungscode</span><input id="account-mfa-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" autocapitalize="none" spellcheck="false" required maxlength="40" autofocus></label><button class="btn primary account-submit" type="submit">Anmeldung abschließen</button></form>
    <p class="account-fine">Dein Passwort allein hat noch keine vollständige Anmeldung erstellt.</p><div class="account-links">${b('Zurück zur Anmeldung','login')}</div>`,{kind:'mfa-login',footer:false});
  }
  function mfaSetup(){
    draw('Zwei-Faktor-Anmeldung einrichten.',`<p>Ein zusätzlicher Einmalcode schützt deinen Ninja. Bestätige zuerst dein aktuelles Passwort.</p><form data-account-form="mfa-setup"><label class="account-field" for="account-password"><span>Aktuelles Passwort</span><input id="account-password" type="password" name="password" autocomplete="current-password" required></label><button type="submit" class="btn primary">Authenticator verbinden →</button></form><p class="account-fine">Die Einrichtung erfolgt verschlüsselt auf dem Server; es werden keine Codes an externe QR-Code-Dienste gesendet.</p>`,{kind:'mfa-setup',footer:false});
  }
  function mfaScan(result){
    const uri=result.otpauthUri||'',secret=result.secret||'';
    draw('Authenticator verbinden.',`<p>Scanne den QR-Code mit deiner Authenticator-App. Alternativ kannst du den Schlüssel manuell eingeben. Der Schlüssel ist nur während dieser Einrichtung sichtbar.</p>
    <div class="mfa-qr-wrap">${mfaQR(uri)}</div><label class="account-field" for="mfa-setup-secret"><span>Manueller Einrichtungsschlüssel</span><input id="mfa-setup-secret" type="text" readonly autocomplete="off" spellcheck="false" translate="no" value="${escape(secret)}"></label>
    <form data-account-form="mfa-confirm"><label class="account-field" for="account-mfa-code"><span>Sechsstelliger Bestätigungscode</span><input id="account-mfa-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required autofocus></label><button class="btn primary account-submit" type="submit">MFA sicher aktivieren</button></form>
    <p class="account-fine">Keine Screenshots des Einrichtungsschlüssels teilen.</p>`,{kind:'mfa-confirm',footer:false});
  }
  function mfaRecovery(codes){
    draw('Deine einmaligen Notfallcodes.',`<p><strong>Diese zehn Codes werden nur einmal angezeigt.</strong> Bewahre sie getrennt vom Passwort an einem sicheren Ort auf. Jeder Code funktioniert nur einmal.</p><label class="account-field" for="mfa-recovery-codes"><span>Wiederherstellungscodes</span><textarea id="mfa-recovery-codes" readonly rows="11" spellcheck="false" translate="no">${codes.map(escape).join('\n')}</textarea></label><div class="account-links">${b('Codes kopieren','copy-mfa-codes')}</div><form data-account-form="mfa-ack"><label class="account-check"><input type="checkbox" name="saved" required><span>Ich habe die Codes sicher und privat gespeichert.</span></label><button class="btn primary account-submit" type="submit">Fertig · Zurück zum Konto</button></form>`,{kind:'mfa-backups',footer:false});
  }
  function mfaDisable(){
    draw('MFA deaktivieren?',`<p>Bestätige deine Identität mit Passwort und aktuellem Authenticator-Code oder einem unbenutzten Wiederherstellungscode.</p><form data-account-form="mfa-disable"><label class="account-field" for="account-password"><span>Passwort</span><input id="account-password" name="password" type="password" autocomplete="current-password" required></label><label class="account-field" for="account-mfa-code"><span>MFA-Code</span><input id="account-mfa-code" name="code" type="text" autocomplete="one-time-code" required maxlength="40"></label><button class="btn primary account-submit" type="submit">MFA deaktivieren</button></form>`,{kind:'mfa-disable',footer:false});
  }
  function showMfaInProfile(){
    const generation=formId;
    void accounts.mfaStatus().then(status=>{
      if(active!=='profile'||generation!==formId)return;
      const container=host.querySelector('#account-mfa-status');if(!container)return;
      container.innerHTML=status.enabled?`<strong>✓ MFA aktiviert</strong><p>Deine Anmeldung erfordert einen zweiten Faktor. ${Number(status.recoveryCodesRemaining)||0} Wiederherstellungscodes verfügbar.</p>${b('MFA deaktivieren','mfa-disable')}`:
      status.available?`<strong>MFA derzeit deaktiviert</strong><p>Schütze dein Konto mit einem Einmalcode aus einer Authenticator-App.</p>${b('MFA einrichten','mfa-setup','primary')}`:
      '<strong>MFA noch nicht verfügbar</strong><p>Der Kontoserver benötigt den sicheren Verschlüsselungsschlüssel NINJA_MFA_KEY. Keine unsichere Schein-Einrichtung.</p>';
      localizeDOM(container);
    }).catch(()=>{if(active==='profile'&&generation===formId){const element=host.querySelector('#account-mfa-status');if(element)element.textContent='MFA-Status derzeit nicht erreichbar.';}});
  }
  function profile(value){
    const session=accounts.getSession?.();if(!session){login();return;}const p=value||session.profile||{},username=session.user?.username||p.player?.username||'',progress=getPlayerProgress(p),xp=progress.xp,online=accounts.getStatus?.().online!==false;
    draw('Dein verbundenes Dojo.',`<div class="account-identity"><div class="account-avatar">${portrait(p)}</div><div><span class="account-connected ${online?'':'is-offline'}">${online?'● Online-Konto':'● Verbindung unterbrochen'}</span><h3 data-user-text translate="no">${escape(username)}</h3><p><strong>${Math.max(0,Number(p.coins)||0)}</strong> Münzen · <strong>${xp}</strong> XP · Level <strong>${progress.level}</strong></p></div></div><p>Dein Kontofortschritt wird vom Server gespeichert. Dein ursprünglicher Gastspielstand bleibt getrennt auf diesem Gerät.</p>${online?'':'<aside class="account-service-note" data-account-offline role="status">Du siehst den letzten bestätigten Stand. Verbinde dich erneut und aktualisiere deinen Fortschritt.</aside>'}<details class="account-details"><summary>Ninja-Namen ändern</summary><form data-account-form="rename">${nameField(username)}<button class="btn primary" type="submit">Namen speichern</button></form></details><section class="account-mfa-security"><h3>Kontosicherheit</h3><div id="account-mfa-status" role="status">MFA-Status wird geprüft …</div></section><section class="account-import"><h3>Dein Training mitnehmen</h3><p>Du kannst die abgeschlossene Einführung einmal übernehmen. Gastmünzen, XP und Freischaltungen werden nicht als geprüftes Kontoguthaben importiert.</p>${p.guestImportVersion===1?'<button type="button" class="btn ghost" disabled>Einführung bereits übernommen ✓</button>':b('Einführung übernehmen','import')}</section><div class="account-links">${b('Fortschritt aktualisieren','refresh')}${b('Zum Ninja-Profil','game-profile')}${b('Abmelden','logout')}</div><details class="account-details account-danger"><summary>Konto endgültig löschen</summary><p>Dein Online-Profil, deine Münzen, Käufe und veröffentlichten Ranglisteneinträge werden dauerhaft gelöscht. Dein ursprünglicher Gastspielstand bleibt erhalten.</p><form data-account-form="delete">${passwordField('Mit Passwort bestätigen')}<label class="account-check"><input type="checkbox" required name="confirm"><span>Ich möchte mein Online-Konto endgültig löschen.</span></label><button class="btn account-delete" type="submit">Konto endgültig löschen</button></form></details>`,{kind:'profile',footer:false});
    showMfaInProfile();
  }
  let purchase;
  function confirmPurchase({name,cost,description='',preview='',kind='unlock',onConfirm}={}){
    if(typeof onConfirm!=='function')throw new TypeError('Purchase confirmation requires an action.');
    purchase=onConfirm;
    draw('Bereit für dein nächstes Upgrade?',`<div class="account-purchase-preview">${preview}</div><h3>${escape(name)}</h3><p>${escape(description)}</p><div class="purchase-price"><span aria-hidden="true">★</span><strong>${Math.max(0,Number(cost)||0)}</strong> Münzen</div><p>${kind==='skin'?'Das Outfit verändert deinen Look und deine Wischspur. Im gewerteten Open Run bleibt die Herausforderung für alle gleich.':'Der angezeigte Münzbetrag wird einmal von deinem Guthaben abgezogen.'}</p><div class="account-purchase-actions">${b('Abbrechen','close')}${b('Kauf bestätigen','purchase','primary')}</div>`,{kind:'purchase',footer:false});
  }
  function working(value){busy=value;for(const element of host.querySelectorAll('button,input'))element.disabled=value;host.querySelector('[role="dialog"]')?.setAttribute('aria-busy',String(value));const p=host.querySelector('#account-working');if(p)p.textContent=value?tr('Einen Moment …'):'';}
  async function run(task){if(busy)return;const generation=formId;working(true);try{await task();}catch(error){if(generation===formId&&host.querySelector('#account-error')){host.querySelector('#account-error').textContent=tr(error?.message||'Verbindung fehlgeschlagen. Bitte versuche es erneut.');const badge=host.querySelector('.account-connected');if(badge&&accounts.getStatus?.().online===false){badge.textContent=tr('● Verbindung unterbrochen');badge.classList.add('is-offline');if(!host.querySelector('[data-account-offline]'))host.querySelector('.account-identity')?.insertAdjacentHTML('afterend',`<aside class="account-service-note" data-account-offline role="status">${tr('Du siehst den letzten bestätigten Stand. Verbinde dich erneut und aktualisiere deinen Fortschritt.')}</aside>`);}}}finally{if(generation===formId)working(false);}}
  host.addEventListener('input',event=>{if(event.target.matches('input'))event.target.removeAttribute('aria-invalid');});
  host.addEventListener('submit',event=>{
    const form=event.target.closest('[data-account-form]');if(!form)return;event.preventDefault();if(!form.reportValidity()||busy)return;
    const values=Object.fromEntries(new FormData(form)),kind=form.dataset.accountForm;
    if(kind==='register'){const checked=validateRegistration({...values,privacyAccepted:values.privacyAccepted==='on'});if(!checked.ok){host.querySelector('#account-error').textContent=tr(checked.message);const input=form.elements.namedItem(checked.field);input?.setAttribute('aria-invalid','true');input?.focus();return;}}
    void run(async()=>{
      if(['login','register','recovery'].includes(kind)){
        const result=await accounts[kind==='recovery'?'reset':kind]({username:values.username,password:values.password,...(kind==='recovery'?{recoveryKey:values.recoveryKey,mfaCode:values.mfaCode}:kind==='register'?{email:values.email,passwordConfirmation:values.passwordConfirmation,privacyAccepted:values.privacyAccepted==='on'}:{})});
        form.reset();busy=false;
        if(result.mfaRequired){mfaChallenge=result.challenge;mfaLogin();return;}
        close();await onSignedIn(result);if(result.recoveryKey)recoveryKey(result.recoveryKey);
      }else if(kind==='mfa-login'){const result=await accounts.completeMfa(mfaChallenge,values.code);mfaChallenge=null;form.reset();busy=false;close();await onSignedIn(result);toast('✓ MFA-Anmeldung bestätigt.');}
      else if(kind==='mfa-setup'){const result=await accounts.mfaSetup(values.password);form.reset();busy=false;mfaScan(result);}
      else if(kind==='mfa-confirm'){const result=await accounts.mfaConfirm(values.code);form.reset();busy=false;mfaRecovery(result.recoveryCodes||[]);toast('MFA wurde erfolgreich aktiviert.');}
      else if(kind==='mfa-disable'){await accounts.mfaDisable(values.password,values.code);form.reset();busy=false;profile();toast('MFA deaktiviert.');}
      else if(kind==='mfa-ack'){busy=false;profile();}else if(kind==='rename'){const result=await accounts.rename(values.username);await onRename(result);busy=false;profile(result.profile);toast('Ninja-Name gespeichert.');}
      else if(kind==='delete'){await accounts.deleteAccount({password:values.password});form.reset();busy=false;close();await onDelete();}
      else if(kind==='acknowledge-key'){busy=false;close();onNavigate('worlds');}
    });
  });
  host.addEventListener('click',event=>{
    const button=event.target.closest('[data-account]');if(!button||busy)return;const action=button.dataset.account;
    if(action==='reveal'){const input=host.querySelector('#account-password'),shown=input.type==='password';input.type=shown?'text':'password';button.setAttribute('aria-pressed',String(shown));button.textContent=tr(shown?'Verbergen':'Anzeigen');button.setAttribute('aria-label',tr(shown?'Passwort verbergen':'Passwort anzeigen'));return;}
    if(action==='mfa-setup'){mfaSetup();return;}
    if(action==='mfa-disable'){mfaDisable();return;}
    if(action==='close'){if(close())onDismiss();return;}if(action==='login'){login();return;}if(action==='register'){register();return;}if(action==='recovery'){recovery();return;}
    if(action==='guest'){close();void onGuest();return;}if(action==='game-profile'){close();onNavigate('profile');return;}
    void run(async()=>{
      if(action==='retry'){await accounts.init({retry:true});busy=false;(active==='register'?register:active==='recovery'?recovery:login)();}
      if(action==='logout'){let offline=false;try{await accounts.logout();}catch(error){if(accounts.getSession?.())throw error;offline=true;}busy=false;close();await onLogout();if(offline)toast('Du bist auf diesem Gerät abgemeldet. Die Server-Sitzung läuft automatisch ab.');}
      if(action==='refresh'){const result=await onRefresh();if(result?.profile){busy=false;profile(result.profile);toast('Dein Kontofortschritt ist aktuell.');}}
      if(action==='import'){const result=await onImport();if(result!==false){busy=false;profile(result?.profile);toast('Einführung übernommen. Dein Gastspielstand bleibt erhalten.');}}
      if(action==='purchase'){const callback=purchase;const result=await callback();if(result!==false){busy=false;purchase=null;close();}}
      if(action==='copy-mfa-codes'){const codes=host.querySelector('#mfa-recovery-codes');try{await navigator.clipboard.writeText(codes.value);toast('Notfallcodes kopiert. Sicher aufbewahren.');}catch{codes.focus();codes.select();}}
      if(action==='copy-key'){const key=host.querySelector('#account-key');try{await navigator.clipboard.writeText(key.value);toast('Code kopiert. Speichere ihn an einem sicheren Ort.');}catch{key.focus();key.select();host.querySelector('#account-working').textContent=tr('Code markiert. Kopiere ihn mit der Kopieren-Funktion deines Geräts.');}}
    });
  });
  const onKey=event=>{if(active&&event.key==='Escape'){event.stopImmediatePropagation();event.preventDefault();if(active!=='key'&&close())onDismiss();}};
  document.addEventListener('keydown',onKey,true);
  function destroy(){busy=false;close();document.removeEventListener('keydown',onKey,true);host.remove();}
  return {login,register,recovery,profile,recoveryKey,confirmPurchase,close,destroy,isOpen:()=>Boolean(active)};
}
