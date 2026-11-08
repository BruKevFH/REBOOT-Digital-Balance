import {getPreferences,updatePreferences} from './preferences.js';
import {getLanguage,setLanguage,localizeDOM,tr} from './i18n.js';
import {themePicker,applyTheme} from './display-theme.js';

/** Settings keep display/audio preferences separate from every guest/account save. */
export function createSettingsUI({dialog,button,onBack=()=>{},onPreferencesChanged=()=>{},audio,onPractice=()=>{},onTraining=()=>{},onFullscreen=()=>{},onHelp,onLogout,onExit=()=>{},container}={}){
  if(typeof dialog!=='function')throw new TypeError('Settings require the app dialog renderer.');
  const root=container||globalThis.document?.getElementById('overlay-root');
  const control=(label,key,value)=>`<label class="mix-control" for="settings-${key}"><span><strong>${label}</strong> <output for="settings-${key}" id="settings-${key}-value">${Math.round(value*100)} %</output></span><input id="settings-${key}" data-setting-range="${key}" type="range" min="0" max="100" step="1" value="${Math.round(value*100)}" aria-valuetext="${Math.round(value*100)} %"></label>`;
  const toggle=(title,description,key,value)=>`<label class="calm-toggle" for="settings-${key}"><input id="settings-${key}" data-setting-toggle="${key}" type="checkbox" ${value?'checked':''}><span><strong>${title}</strong><small>${description}</small></span></label>`;
  let active=false;
  function apply(patch,notify=true){
    const next=updatePreferences(patch);audio?.setMix?.(next);
    if(notify)onPreferencesChanged(next);
    return next;
  }
  function show(){
    const prefs=getPreferences();audio?.setMix?.(prefs);
    dialog('Dein Spiel. Dein Tempo.',`<section class="settings-section"><h3>Sprache</h3><p>Deutsch oder Englisch: Du kannst jederzeit wechseln. Dein Spielstand bleibt erhalten.</p><div class="language-switch" role="group" aria-label="Sprache wählen"><button class="btn ghost" data-settings-language="de" aria-pressed="${getLanguage()==='de'}">Deutsch</button><button class="btn ghost" data-settings-language="en" aria-pressed="${getLanguage()==='en'}">English</button></div></section><section class="settings-section theme-settings"><h3>Darstellung wählen</h3><p>Relaxed ist hell und freundlich. Dark ist atmosphärisch. Noir ist besonders kontrastreich – Spielregeln bleiben gleich.</p>${themePicker()}</section><section class="settings-section"><h3>Ton</h3>${control('Musiklautstärke','musicVolume',prefs.musicVolume)}${control('Effektlautstärke','effectsVolume',prefs.effectsVolume)}${toggle('Ton komplett aus','Musik und Effekte bleiben stumm. Deine Lautstärken bleiben gespeichert.','muted',prefs.muted)}</section><section class="settings-section"><h3>Bewegung und Darstellung</h3>${toggle('Weniger Effekte','Weniger Bewegung und keine Kamerastöße. Hinweise bleiben mit Text und Symbol sichtbar.','calmEffects',prefs.calmEffects)}${toggle('Kamerawackeln erlauben','Schalte kurze Kamerastöße unabhängig von den anderen Effekten aus.','screenShake',prefs.screenShake)}<p class="muted">Die Systemeinstellung für reduzierte Bewegung wird zusätzlich berücksichtigt. Spieltempo und Ranglistenregeln bleiben gleich.</p><button class="btn ghost" data-settings-command="fullscreen">Vollbild umschalten</button></section><section class="settings-section"><h3>Üben und Hilfe</h3><p>Die Auswahlübung funktioniert mit großen Tasten und ohne Zeitdruck. Sie vergibt keine Münzen, XP oder Ranglistenpunkte.</p><div class="practice-actions"><button class="btn primary" data-settings-command="practice">Auswahlübung starten</button><button class="btn ghost" data-settings-command="training">Wischtraining wiederholen</button>${onHelp?'<button class="btn ghost" data-settings-command="help">Ninja-Hilfe öffnen</button>':''}</div></section><section class="settings-section ninja-exit-settings"><h3>Spiel verlassen</h3><p>Zur öffentlichen Informationsseite zurückkehren. Wenn eine Runde läuft, erhältst du vorher eine Bestätigungsfrage.</p><button class="btn ghost" data-settings-command="exit">Spiel verlassen ↗</button></section><p class="settings-privacy">Diese Einstellungen werden in diesem Browser gespeichert. Beim Spielen als Gast brauchst du keinen Namen und keine E-Mail.</p>${onLogout?'<button class="btn ghost" data-settings-command="logout">Abmelden</button>':''}`,`<button class="btn ghost" data-settings-command="back">${tr('Zurück')}</button>`,{label:'EINSTELLUNGEN',classes:'settings-panel'});
    if(!active&&root){root.addEventListener('input',input);root.addEventListener('change',change);root.addEventListener('click',click);active=true;}
    localizeDOM(root);applyTheme();
  }
  function input(event){
    if(!root?.querySelector('.settings-panel'))return;
    const field=event.target.dataset?.settingRange;if(!['musicVolume','effectsVolume'].includes(field))return;
    const value=Number(event.target.value)/100;if(!Number.isFinite(value))return;
    const prefs=apply({[field]:value},false),output=root.querySelector(`#settings-${field}-value`);if(output)output.textContent=`${Math.round(prefs[field]*100)} %`;
    event.target.setAttribute('aria-valuetext',`${Math.round(prefs[field]*100)} %`);
  }
  function change(event){
    if(!root?.querySelector('.settings-panel'))return;
    const field=event.target.dataset?.settingToggle;
    if(['calmEffects','muted','screenShake'].includes(field)){const prefs=apply({[field]:event.target.checked});if(field==='muted'&&!prefs.muted){audio?.setEnabled?.(true);void audio?.unlock?.();}}
    else if(['musicVolume','effectsVolume'].includes(event.target.dataset?.settingRange)){input(event);onPreferencesChanged(getPreferences());audio?.setEnabled?.(true);void audio?.unlock?.();}
  }
  function click(event){
    if(!root?.querySelector('.settings-panel'))return;
    const language=event.target.closest?.('[data-settings-language]');
    if(language){setLanguage(language.dataset.settingsLanguage);for(const item of root.querySelectorAll('[data-settings-language]'))item.setAttribute('aria-pressed',String(item.dataset.settingsLanguage===getLanguage()));onPreferencesChanged(getPreferences());return;}
    const command=event.target.closest?.('[data-settings-command]')?.dataset.settingsCommand;if(!command)return;
    event.preventDefault();
    const handlers={back:onBack,practice:onPractice,training:onTraining,fullscreen:onFullscreen,help:onHelp,logout:onLogout,exit:onExit};
    if(command!=='fullscreen')destroy();handlers[command]?.();
  }
  function destroy(){if(!active||!root)return;root.removeEventListener('input',input);root.removeEventListener('change',change);root.removeEventListener('click',click);active=false;}
  return Object.freeze({show,destroy});
}
