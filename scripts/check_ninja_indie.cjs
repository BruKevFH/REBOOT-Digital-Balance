// Local UI acceptance: five destinations, the complete Play screen and saved gameplay.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(base).hostname))throw Error('Use a local test instance.');
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-indie');
const version=JSON.parse(fs.readFileSync(path.join(__dirname,'../notification-ninja/dist/build.json'))).version;
const widths=process.env.NINJA_TEST_WIDTHS?process.env.NINJA_TEST_WIDTHS.split(',').map(Number):[360,768,941,1280];
if(widths.some(width=>!Number.isInteger(width)||width<320||width>2560))throw Error('Invalid viewport widths.');
const read=page=>page.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
async function acknowledge(page){
 // The automatic intro opens on the next rendered frame after entering the hub.
 for(let i=0;i<32;i++){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const current=await read(page);
  if(current.experience?.intro?.active){await page.locator('[data-intro-action=skip]').click();continue;}
  if(current.mentor.open){await page.locator('#mentor-next').click();continue;}
  return;
 }
 throw Error('Intro or mentor did not close through its native controls');
}
async function ready(page){await page.waitForFunction(value=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===value,version);await acknowledge(page);}
const bottom=page=>page.locator('.indie-bottom-nav');

async function checkGeometry(page,label){
  await page.waitForFunction(()=>[...document.images].filter(image=>{const rect=image.getBoundingClientRect();return image.checkVisibility({checkVisibilityCSS:true})&&rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;}).every(image=>image.complete),{},{timeout:10000});
  await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.evaluate(()=>{
    const modal=[...document.querySelectorAll('[role=dialog][aria-modal=true]')].filter(element=>element.checkVisibility({checkVisibilityCSS:true})).at(-1);
    const shown=element=>element.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&!element.closest('[inert]')&&(!modal||modal.contains(element));
    const small=[...document.querySelectorAll('button,a,select,summary,input:not([type=hidden])')].filter(shown).map(element=>{
      let rect=element.getBoundingClientRect();
      // A native checkbox is activated by its full labelled target.
      if(element.matches('input[type=checkbox],input[type=radio]'))for(const label of element.labels||[]){const candidate=label.getBoundingClientRect();if(candidate.width>rect.width&&candidate.height>rect.height)rect=candidate;}
      return {tag:element.tagName,id:element.id,text:(element.getAttribute('aria-label')||element.textContent||element.name||'').trim().replace(/\s+/g,' ').slice(0,100),width:rect.width,height:rect.height};
    }).filter(item=>item.width<43.8||item.height<43.8);
    const imageFailures=[...document.images].filter(image=>{const rect=image.getBoundingClientRect();return shown(image)&&rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth&&(!image.complete||image.naturalWidth===0);}).map(image=>image.getAttribute('src'));
    const obscured=[...document.querySelectorAll('.home-header button,.indie-page-tools button')].filter(shown).filter(element=>{
      const rect=element.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
      if(x<0||x>=innerWidth||y<0||y>=innerHeight)return false;
      const hit=document.elementFromPoint(x,y);return hit&&!element.contains(hit);
    }).map(element=>{const rect=element.getBoundingClientRect(),hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);return {id:element.id,text:element.getAttribute('aria-label')||element.textContent.trim(),blockedBy:hit?.id||hit?.className?.baseVal||hit?.className||hit?.tagName};});
    return {viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,small,imageFailures,obscured};
  });
  assert(geometry.document<=geometry.viewport+1,`${label}: page overflow ${JSON.stringify(geometry)}`);
  assert.deepEqual(geometry.small,[],`${label}: controls need 44px targets`);
  assert.deepEqual(geometry.imageFailures,[],`${label}: visible artwork failed to load`);
  assert.deepEqual(geometry.obscured,[],`${label}: header controls must receive pointer events`);
  assert.deepEqual((await read(page)).translation.missing,[],`${label}: missing translation`);
  return geometry;
}

async function home(page){
  const sheet=page.locator('dialog.career-mission-sheet[open]');
  if(await sheet.count()){await sheet.locator('[data-career-sheet-close]').click();await page.waitForFunction(()=>!document.querySelector('dialog.career-mission-sheet[open]'));}
  const close=page.locator('#account-root [data-account="close"]').first();if(await close.isVisible())await close.click();
  const current=await read(page);
  if(current.ui==='home')return;
  const nav=bottom(page).locator('[data-game-route="home"],[data-game-route="worlds"]');
  if(await nav.isVisible())await nav.click();
  else {
    const control=page.locator('[data-action="home"]:visible').first();
    if(await control.count())await control.click();else await page.keyboard.press('Escape');
  }
  await acknowledge(page);await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');
}
async function play(page){await home(page);await bottom(page).locator('[data-game-route="play"]').click();await acknowledge(page);assert.equal(new URL(page.url()).hash,'#play');}

async function inspectCards(page,entry){
  await play(page);
  assert.equal(await page.locator('.indie-mode-card').count(),4);
  assert.equal(await page.locator('.indie-world-card').count(),4);
  assert.equal(await page.locator('.indie-feature-run').count(),2,'Open Run and Digital Day have illustrated launch cards');
  assert.deepEqual(await page.locator('[data-feature-mode]').evaluateAll(cards=>cards.map(card=>card.dataset.featureMode)),['open','campaign']);
  assert.equal(await page.locator('.indie-feature-run details,.indie-feature-run summary').count(),0,'Feature modes are directly available');
  const cards=await page.locator('.indie-mode-card,.indie-world-card,.indie-feature-run').evaluateAll(elements=>elements.map((element,index)=>({index,text:element.textContent.trim().replace(/\s+/g,' '),kind:element.classList.contains('indie-world-card')?'world':'mode'})));
  entry.cards=[];
  for(const card of cards){
    await play(page);
    const target=page.locator('.indie-mode-card,.indie-world-card,.indie-feature-run').nth(card.index);
    const action=target.locator('button,a').first();
    const control=await action.count()?action:target;
    const data=await control.evaluate(element=>({disabled:element.matches(':disabled')||element.getAttribute('aria-disabled')==='true',...element.dataset}));
    if(data.disabled){assert.match(card.text,/gesperrt|freischalten|Münzen|locked|unlock|coins/i,'locked world must explain access');entry.cards.push({kind:card.kind,text:card.text,locked:true});continue;}
    await control.click();await acknowledge(page);
    let state=await read(page);
    if(data.worldInspect){
      assert.equal(state.ui,'world-detail');
      assert.equal(new URL(page.url()).hash,'#play');
      await checkGeometry(page,`${entry.width}/world/${data.worldInspect}`);
      const quick=page.locator(`.indie-world-detail-panel [data-quick-context="${data.worldInspect}"]`);
      if(data.worldInspect==='master'){
        assert.equal(await quick.count(),0,'Balance Master keeps its full-world unlock requirement');
        assert.equal(await page.locator('.indie-world-detail-panel [data-world-play="master"]').count(),0,'unowned Balance Master cannot bypass its unlock');
      }else{
        assert.equal(await quick.count(),1,'each everyday world keeps its existing free short round');
        await quick.click();await acknowledge(page);state=await read(page);
        assert.equal(state.ui,'briefing');assert.equal(state.state.context,data.worldInspect);
      }
    }
    else if(data.modeStart){assert.equal(state.ui,'briefing');assert.equal(state.state.mode,data.modeStart);}
    else if(data.quickContext){assert.equal(state.ui,'briefing');assert.equal(state.state.context,data.quickContext);}
    else if(data.worldQuick){assert.equal(state.ui,'briefing');assert.equal(state.state.context,data.worldQuick);}
    else if(data.worldPlay){assert.equal(state.ui,'briefing');assert.equal(state.state.mode,data.worldPlay);}
    else if(data.gameRoute==='practice'){assert.equal(state.ui,'practice');}
    else assert.notEqual(new URL(page.url()).hash,'#play',`card ${card.text} must perform an action`);
    entry.cards.push({kind:card.kind,text:card.text,ui:state.ui,mode:state.state.mode,context:state.state.context});
    await home(page);
  }
  await play(page);
  await page.locator('[data-mode-start="open"]:visible').click();await acknowledge(page);
  const open=await read(page);assert.equal(open.ui,'briefing');assert.equal(open.state.mode,'open');assert.equal(open.state.maxLives,3);
  entry.openRun={mode:open.state.mode,hearts:open.state.maxLives};await home(page);
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  const report={viewports:[],issues:[]};
  try{
    for(const width of widths){
      const context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width<768?844:960},hasTouch:width<768}),page=await context.newPage();
      const entry={width,errors:[],screens:[]};page.on('pageerror',error=>entry.errors.push(error.message));
      try{
        await page.goto(base);await ready(page);await page.locator('#landing-start').click();await acknowledge(page);
        assert.equal((await read(page)).ui,'home');
        const preserved=profile=>Object.fromEntries(['coins','totalRuns','stats','unlockedSkills','unlockedWorlds','unlockedSkins','selectedSkin','achievements','claimedAchievements'].map(key=>[key,profile[key]]));
        const initial=preserved((await read(page)).profile);
        for(const language of ['de','en']){
          await home(page);await page.locator(`[data-language="${language}"]:visible`).first().click();
          assert.equal((await read(page)).language,language);
          const routes=await bottom(page).locator('[data-game-route]').evaluateAll(elements=>elements.map(element=>element.dataset.gameRoute));
          assert.deepEqual(routes,['home','play','campaign','bazaar','leaderboard'],'exactly five main destinations');
          for(const [route,expected]of [['home','home'],['play','modes'],['campaign','career'],['bazaar','shop'],['leaderboard','leaderboard']]){
            await home(page);await bottom(page).locator(`[data-game-route="${route}"]`).click();await acknowledge(page);
            const snapshot=await read(page);
            assert.equal(snapshot.ui,expected,`${route} opens its own screen`);
            assert.equal(new URL(page.url()).hash,'#'+({home:'overview',campaign:'campaign',bazaar:'bazaar',leaderboard:'leaderboard',play:'play'}[route]));
            assert.equal(await bottom(page).isVisible(),true,`${route}: main navigation stays visible`);
            assert.equal(await bottom(page).locator('[aria-current="page"]').count(),1,`${route} has one current tab`);
            const geometry=await checkGeometry(page,`${width}/${language}/${route}`);
            if(route==='leaderboard')assert.equal(await page.locator('.legend-rank-actions [data-action="highscores"]').innerText(),language==='en'?'View my records →':'Meine Rekorde ansehen →','record action follows the selected language');
            await page.screenshot({path:path.join(output,`${route}-${language}-${width}.png`),fullPage:true});
            entry.screens.push({language,route,geometry});
          }
          await home(page);await page.locator('[data-open-settings]:visible').first().click();
          assert.equal((await read(page)).ui,'settings');
          entry.screens.push({language,route:'settings',geometry:await checkGeometry(page,`${width}/${language}/settings`)});
          await page.screenshot({path:path.join(output,`settings-${language}-${width}.png`),fullPage:true});
          await play(page);await page.locator('[data-account-view="profile"]:visible,[data-account-view="login"]:visible').first().click();
          assert.equal(await page.locator('[data-account-form="login"]').count(),1);
          entry.screens.push({language,route:'login',geometry:await checkGeometry(page,`${width}/${language}/login`)});
          await page.locator('[data-account="register"]').click();
          assert.equal(await page.locator('[data-account-form="register"]').count(),1);
          entry.screens.push({language,route:'register',geometry:await checkGeometry(page,`${width}/${language}/register`)});
          await page.screenshot({path:path.join(output,`register-${language}-${width}.png`),fullPage:true});
          await home(page);
        }
        await play(page);await bottom(page).locator('[data-game-route="campaign"]').click();await acknowledge(page);
        assert.equal((await read(page)).ui,'career');await page.goBack();
        await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='modes');
        assert.equal(new URL(page.url()).hash,'#play','browser Back returns to the previous tab');
        await inspectCards(page,entry);
        for(const alias of ['modes','worlds']){
          await page.goto(base+'#'+alias);await ready(page);
          await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='modes'&&location.hash==='#play',{},{timeout:5000});
          assert.equal((await read(page)).ui,'modes',`legacy #${alias} opens the unified Play screen`);
          assert.equal(new URL(page.url()).hash,'#play');
          assert.equal(await page.locator('.indie-mode-card,.indie-world-card,.indie-feature-run').count(),10);
        }
        assert.deepEqual(preserved((await read(page)).profile),initial,'menu visits and unplayed cards preserve guest progress');
        assert.deepEqual(entry.errors,[]);entry.ok=true;
      }catch(error){entry.ok=false;entry.failure=error.stack;report.issues.push({width,error:error.message});await page.screenshot({path:path.join(output,`FAIL-${width}.png`),fullPage:true}).catch(()=>{});}
      finally{report.viewports.push(entry);console.log('INDIE',width,entry.ok,entry.failure||'');await context.close();}
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    if(report.issues.length)process.exitCode=1;
    console.log(JSON.stringify({viewports:report.viewports.map(entry=>({width:entry.width,ok:entry.ok,screens:entry.screens.length,cards:entry.cards?.length})),issues:report.issues},null,2));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
