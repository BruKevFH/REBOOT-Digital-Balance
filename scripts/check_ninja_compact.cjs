// Native compact views and their expanded explanations. No fabricated progress.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const base=new URL(process.env.NINJA_BASE_URL||'http://127.0.0.1:8203/notification-ninja/');
assert(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Compact checks require an isolated local service');
assert(['http:','https:'].includes(base.protocol)&&!base.username&&!base.password&&!base.search&&!base.hash,'Use a plain local service URL');
const gameURL=new URL('index.html',base).href;
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-compact');
const version=JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version;
const widths=(process.env.NINJA_TEST_WIDTHS||'360,1280').split(',').map(Number);
assert(widths.every(width=>Number.isInteger(width)&&width>=320&&width<=2560),'Invalid test widths');
const snapshot=page=>page.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const economy=profile=>Object.fromEntries(['coins','totalRuns','unlockedSkills','unlockedWorlds','unlockedSkins','claimedAchievements'].map(key=>[key,profile[key]]));

async function acknowledge(page){
  for(let i=0;i<30;i++){
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const state=await snapshot(page);
    if(state.experience.intro?.active){await page.locator('[data-intro-action=skip]').click();continue;}
    if(state.mentor.open){await page.locator('#mentor-next').click();continue;}
    return;
  }
  throw new Error('Introduction or guide did not finish');
}

async function ready(page){
  await page.waitForFunction(expected=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===expected,version,{timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  await acknowledge(page);
}

async function route(page,id){
  await page.goto(gameURL+'#'+id);
  await ready(page);
}

async function inspect(page,label,report){
  const state=await snapshot(page);
  if(state.translation.missing.length)report.translationFindings.push({label,missing:state.translation.missing});
  const geometry=await page.evaluate(()=>{
    const modal=[...document.querySelectorAll('dialog[open],[role=dialog][aria-modal=true]')].filter(element=>element.checkVisibility()).at(-1);
    const visible=element=>element.checkVisibility()&&!element.closest('[inert]')&&(!modal||modal.contains(element));
    const small=[...document.querySelectorAll('summary')].filter(visible).map(element=>{
      const bounds=element.getBoundingClientRect();
      return {text:element.innerText,width:bounds.width,height:bounds.height};
    }).filter(item=>item.width<43.8||item.height<43.8);
    return {width:innerWidth,scroll:document.documentElement.scrollWidth,small};
  });
  assert(geometry.scroll<=geometry.width+1,label+': no horizontal overflow');
  assert.deepEqual(geometry.small,[],label+': explanation controls remain at least 44px');
  const record={label,language:state.language,...geometry};
  report.states.push(record);
  return record;
}

async function stopRound(page){
  await page.locator('[data-action=next]').click();
  await acknowledge(page);
  await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='playing');
  await page.waitForTimeout(120);
  await page.locator('#pause-button').click();
  await acknowledge(page);
  assert.equal((await snapshot(page)).ui,'paused');
  await page.locator('[data-action=finish-round]').click();
  await acknowledge(page);
  assert.equal((await snapshot(page)).ui,'results');
}

async function missionContrast(page){
  return page.locator('.mission-briefing-goal').evaluate(element=>{
    const rgba=value=>value.match(/[\d.]+/g).map(Number);
    const luminance=color=>color.slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((total,value,index)=>total+value*[.2126,.7152,.0722][index],0);
    const blend=(foreground,background)=>foreground.slice(0,3).map((value,index)=>value*(foreground[3]??1)+background[index]*(1-(foreground[3]??1)));
    let background=[255,255,255];
    const ancestors=[];
    for(let node=element;node;node=node.parentElement)ancestors.unshift(node);
    for(const node of ancestors)background=blend(rgba(getComputedStyle(node).backgroundColor),background);
    return [...element.querySelectorAll('p,strong')].map(node=>{
      const color=blend(rgba(getComputedStyle(node).color),background),a=luminance(color),b=luminance(background);
      return {text:node.textContent,color,background,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
    });
  });
}

async function inspectMission(page,label,report){
  await route(page,'campaign');
  await page.locator('[data-mission-inspect="study-01"]').click();
  await acknowledge(page);
  // The same inspector moves into a native dialog below 900px and stays inline
  // on desktop. Scope to that inspector instead of the background level node.
  const inspector=page.locator('.nn-career-detail');
  await inspector.locator('[data-mission-start="study-01"]').click();
  await acknowledge(page);
  assert.equal((await snapshot(page)).ui,'briefing');
  const contrast=await missionContrast(page);
  assert(contrast.length>=2,'The mission objective contains its label and description');
  assert(contrast.every(item=>item.ratio>=4.5),'Mission objective stays readable '+label+' '+JSON.stringify(contrast));
  const record=await inspect(page,label+'-mission-objective',report);
  record.objectiveContrast=contrast;
  await stopRound(page);
  // Cover the failure result branch too; opening the next route must not hide
  // a missing translation recorded by that result.
  const state=await snapshot(page);
  if(state.translation.missing.length)report.translationFindings.push({label:label+'-mission-stopped',missing:state.translation.missing});
}

async function inspectCardContrast(page,label,report){
  const samples=[
    ['campaign','.nn-career-node-copy strong,.nn-career-node-copy small'],
    ['help','.briefing-items p,kbd'],
    ['leaderboard','.legend-empty-score,.legend-podium-base span,.weekly-podium-rewards li>strong'],
    ['achievements','.achievement-meta span,.achievement-meta strong,.tree-wallet strong,.owned-collection>summary,.collection-count'],
    ['sensei','.sensei-total small,.sensei-total strong,.sensei-scenario-head>span'],
    ['profile','#username-form>label'],
  ];
  for(const [routeId,selector]of samples){
    await route(page,routeId);
    await page.locator(selector).first().waitFor({state:'visible'});
    const measured=await page.locator(selector).evaluateAll(elements=>{
      const rgba=value=>value.match(/[\d.]+/g).map(Number);
      const blend=(foreground,background)=>foreground.slice(0,3).map((value,index)=>value*(foreground[3]??1)+background[index]*(1-(foreground[3]??1)));
      const luminance=color=>color.slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
      return elements.filter(element=>element.checkVisibility()).map(element=>{
        let background=[255,255,255];const ancestors=[];
        for(let node=element;node;node=node.parentElement)ancestors.unshift(node);
        for(const node of ancestors)background=blend(rgba(getComputedStyle(node).backgroundColor),background);
        const foreground=blend(rgba(getComputedStyle(element).color),background),a=luminance(foreground),b=luminance(background);
        return {text:element.textContent.trim().slice(0,90),ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
      });
    });
    assert(measured.length,'The expected card labels are present on '+routeId);
    assert(measured.every(sample=>sample.ratio>=4.5),'Readable solid card text '+label+' '+routeId+' '+JSON.stringify(measured.filter(sample=>sample.ratio<4.5)));
    const record=await inspect(page,label+'-readable-'+routeId,report);
    record.cardContrast={samples:measured.length,minimum:Math.min(...measured.map(sample=>sample.ratio))};
  }
}

async function flow(page,width,language,theme,report,initialEconomy){
  const label=width+'-'+language+'-'+theme;
  await route(page,'settings');
  await page.locator('[data-settings-language='+language+']').click();
  await page.locator('button[data-ninja-theme='+theme+']').click();
  assert.equal((await snapshot(page)).language,language);
  assert.equal(await page.locator('html').getAttribute('data-ninja-theme'),theme);
  await route(page,'play');
  await page.locator('[data-world-inspect=study]').click();
  await acknowledge(page);
  const learning=page.locator('.indie-world-learning');
  assert.equal(await learning.evaluate(element=>element.open),false);
  await learning.locator('summary').click();
  assert.equal(await learning.evaluate(element=>element.open),true);
  await inspect(page,label+'-world-learning-open',report);
  await learning.locator('summary').click();
  await page.locator('.indie-world-detail-panel [data-quick-context=study]').click();
  await acknowledge(page);
  const rules=page.locator('.briefing-how');
  assert.equal(await rules.evaluate(element=>element.open),false);
  await rules.locator('summary').click();
  assert.equal(await rules.evaluate(element=>element.open),true);
  assert((await rules.locator('p').innerText()).length>20);
  await inspect(page,label+'-briefing-rules-open',report);
  await stopRound(page);
  const coaching=page.locator('.result-coaching');
  assert.equal(await coaching.evaluate(element=>element.open),false);
  await coaching.locator('summary').click();
  assert.equal(await coaching.evaluate(element=>element.open),true);
  await inspect(page,label+'-result-coaching-open',report);
  await route(page,'abilities');
  assert.equal(await page.locator('[data-shop-skill]').count(),18);
  assert((await page.locator('.shop-skill-description:visible').count())<=1);
  await page.locator('[data-skill-inspect=zen-super]').click();
  assert.equal(await page.locator('[data-skill-inspect=zen-super]').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#skill-description-zen-super').isVisible(),true);
  assert.equal(await page.locator('.shop-skill-description:visible').count(),1);
  await inspect(page,label+'-ability-effect-open',report);
  await inspectMission(page,label,report);
  await inspectCardContrast(page,label,report);
  assert.deepEqual(economy((await snapshot(page)).profile),initialEconomy,'Short presentation checks do not manufacture rewards, unlocks or qualified runs');
  console.log('NINJA_COMPACT_FLOW',label,'11 states passed');
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const report={version,kind:'Native short unranked presentation flows; no gameplay or save grants',states:[],issues:[],pageErrors:[],translationFindings:[]};
  const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  let page;
  try{
    for(const width of widths){
      const context=await browser.newContext({viewport:{width,height:width<768?844:960},serviceWorkers:'block',hasTouch:width<768});
      try{
        page=await context.newPage();page.setDefaultTimeout(20000);
        page.on('pageerror',error=>report.pageErrors.push(error.message));
        await route(page,'guest');
        const initialEconomy=economy((await snapshot(page)).profile);
        for(const language of ['de','en'])for(const theme of ['relaxed','dark','noir'])await flow(page,width,language,theme,report,initialEconomy);
      }catch(error){
        if(page&&!page.isClosed())await page.screenshot({path:path.join(output,'FAIL-'+width+'.png'),fullPage:true}).catch(()=>{});
        throw error;
      }finally{await context.close();}
    }
    assert.deepEqual(report.pageErrors,[],'No JavaScript errors');
    assert.deepEqual(report.translationFindings,[],'All expanded and stopped-result branches have English translations');
    assert.equal(report.states.length,widths.length*2*3*11,'Every compact flow completed');
    report.ok=true;
  }catch(error){
    report.ok=false;report.issues.push(error.stack);console.error(error.stack);process.exitCode=1;
    if(page&&!page.isClosed())await page.screenshot({path:path.join(output,'FAIL.png'),fullPage:true}).catch(()=>{});
  }finally{
    await browser.close();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({version,ok:report.ok,states:report.states.length,issues:report.issues}));
  }
})();
