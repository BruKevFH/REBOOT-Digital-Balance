import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DIFFICULTIES,SKILLS,SUPERS,ACHIEVEMENTS,WORLDS,BACKGROUNDS,getDifficulty,getSkill,getWorld,getBackground,
  sanitizeProgress,buySkill,equipSuper,claimAchievement,unlockAchievements,getAchievementProgress,
  buyWorld,buyBackground,equipBackground,getOpenSpeedFactor
} from '../notification-ninja/src/progression.js';

const makeProfile = (overrides = {}) => ({coins:0,achievements:[],...sanitizeProgress(null),...overrides});
const saved = value => JSON.parse(JSON.stringify(value));

test('difficulty contracts offer a slower five-heart start and progressively faster rewarded challenges', () => {
  assert.deepEqual(DIFFICULTIES.map(item => [item.id,item.lives]),[['easy',5],['normal',4],['hard',3]]);
  for (let index=1;index<DIFFICULTIES.length;index++) {
    const previous=DIFFICULTIES[index-1],current=DIFFICULTIES[index];
    assert.ok(current.flight<previous.flight);
    assert.ok(current.spawn<previous.spawn);
    assert.ok(current.speedCap>previous.speedCap);
    assert.ok(current.coinMultiplier>previous.coinMultiplier);
  }
  assert.equal(getDifficulty('missing').id,'easy');
  assert.equal(getDifficulty('hard').coinMultiplier,1.5);
});

test('the skill tree has three reachable branches with locked supers and no cycles', () => {
  assert.equal(SKILLS.length,9);
  assert.equal(new Set(SKILLS.map(skill=>skill.id)).size,9);
  assert.deepEqual(SUPERS.map(skill=>skill.id),['slow-super','shield-super','sweep-super']);
  const reached=new Set();
  for(const branch of ['focus','guard','coins']) {
    const nodes=SKILLS.filter(skill=>skill.branch===branch);
    assert.deepEqual(nodes.map(skill=>skill.cost),[35,90,180]);
    for(const node of nodes) {
      assert.ok(node.requires.every(parent=>reached.has(parent)));
      reached.add(node.id);
      assert.ok(node.name&&node.description&&node.effect&&node.icon);
    }
  }
  assert.equal(getSkill('second-chance').effect,'revive');
  assert.equal(getSkill('missing'),null);
  assert.equal(ACHIEVEMENTS.length,24);
  assert.equal(new Set(ACHIEVEMENTS.map(item=>item.id)).size,24);
});

test('old saved profiles receive independent progression defaults without changing existing money or records', () => {
  const original={coins:71,totalRuns:4,highScores:{study:4500},achievements:['first-cut'],unlockedSkins:['default','solar']};
  const before=saved(original),progress=sanitizeProgress(original);
  assert.deepEqual(progress,{unlockedSkills:[],selectedSuper:null,stats:{correct:0,coinsEarned:0,superUses:0,bestCombo:0,hardClears:0},claimedAchievements:[],unlockedWorlds:['study'],unlockedBackgrounds:['classroom','game-room','bedroom'],selectedBackgrounds:{study:'classroom',gaming:'game-room',sleep:'bedroom'}});
  progress.unlockedSkills.push('focus-root');progress.stats.correct=50;
  assert.deepEqual(original,before);
  assert.deepEqual(sanitizeProgress(undefined),sanitizeProgress(null));
});

test('corrupt saves cannot grant orphaned passives, locked supers, invalid counters, or duplicate claims', () => {
  const source={unlockedSkills:['second-chance','shield-super','slow-super','focus-root','focus-root','unknown'],selectedSuper:'shield-super',stats:{correct:12.8,coinsEarned:-10,superUses:Infinity,bestCombo:'25',hardClears:Number.MAX_SAFE_INTEGER+100},claimedAchievements:['first-cut','first-cut','unknown']};
  const normalized=sanitizeProgress(source);
  assert.deepEqual(normalized.unlockedSkills,['focus-root','slow-super']);
  assert.equal(normalized.selectedSuper,null);
  assert.deepEqual(normalized.stats,{correct:12,coinsEarned:0,superUses:0,bestCombo:0,hardClears:Number.MAX_SAFE_INTEGER});
  assert.deepEqual(normalized.claimedAchievements,['first-cut']);
  normalized.claimedAchievements.push('first-super');
  assert.deepEqual(source.claimedAchievements,['first-cut','first-cut','unknown']);
});

test('rejected purchases are atomic for missing parents, insufficient money, duplicates, and unknown IDs', () => {
  const profile=makeProfile({coins:100});
  for(const id of ['missing','slow-super','flow-boost','shield-super','second-chance','sweep-super','coin-boost']) {
    const before=saved(profile),result=buySkill(profile,id);
    assert.equal(result.ok,false,id);assert.ok(result.reason);assert.deepEqual(profile,before);
  }
  assert.equal(buySkill(profile,'focus-root').ok,true);
  const before=saved(profile);
  assert.equal(buySkill(profile,'focus-root').ok,false);
  assert.deepEqual(profile,before);
  const poor=makeProfile({coins:34});
  assert.equal(buySkill(poor,'coin-root').ok,false);
  assert.equal(poor.coins,34);
  assert.equal(buySkill(null,'focus-root').ok,false);
});

test('earned currency purchases an entire branch in order and first purchased super equips automatically', () => {
  const profile=makeProfile({coins:500});
  assert.equal(buySkill(profile,'focus-root').ok,true);
  assert.equal(profile.coins,465);
  assert.deepEqual(profile.achievements,['first-skill']);
  assert.equal(profile.claimedAchievements.length,0);
  assert.equal(buySkill(profile,'slow-super').selectedSuper,'slow-super');
  assert.equal(buySkill(profile,'flow-boost').ok,true);
  assert.equal(profile.coins,195);
  assert.deepEqual(profile.unlockedSkills,['focus-root','slow-super','flow-boost']);
  assert.equal(buySkill(profile,'guard-root').ok,true);
  assert.equal(buySkill(profile,'shield-super').ok,true);
  assert.equal(profile.selectedSuper,'slow-super');
  assert.equal(equipSuper(profile,'shield-super').ok,true);
  assert.equal(profile.selectedSuper,'shield-super');
});

test('equipping requires an owned super, rejects passives, and can explicitly unequip without spending coins', () => {
  const profile=makeProfile({coins:40,unlockedSkills:['coin-root','sweep-super'],selectedSuper:'sweep-super'});
  for(const id of ['focus-root','slow-super','missing',undefined]) {
    const before=saved(profile);
    assert.equal(equipSuper(profile,id).ok,false);
    assert.deepEqual(profile,before);
  }
  assert.equal(equipSuper(profile,null).ok,true);
  assert.equal(profile.selectedSuper,null);
  assert.equal(profile.coins,40);
  assert.equal(equipSuper(profile,'sweep-super').ok,true);
  assert.equal(profile.selectedSuper,'sweep-super');
});

test('cumulative achievements unlock at their real thresholds and do not automatically award currency', () => {
  const profile=makeProfile({coins:0,achievements:['first-cut','healthy-stop'],unlockedSkills:['focus-root'],stats:{correct:250,coinsEarned:100,superUses:1,bestCombo:25,hardClears:1}});
  const expected=['combo-10','combo-25','coins-100','correct-250','hard-clear','first-super','first-skill'];
  assert.deepEqual(unlockAchievements(profile),expected);
  assert.equal(profile.coins,0);
  assert.deepEqual(profile.achievements,['first-cut','healthy-stop',...expected]);
  assert.deepEqual(unlockAchievements(profile),[]);
  assert.deepEqual(profile.claimedAchievements,[]);
  const below=makeProfile({stats:{correct:249,coinsEarned:99,superUses:0,bestCombo:9,hardClears:0}});
  assert.deepEqual(unlockAchievements(below),[]);
});

test('an achievement reward can be collected exactly once even after saving and restoring', () => {
  const profile=makeProfile({coins:7,achievements:['first-cut']});
  const result=claimAchievement(profile,'first-cut');
  assert.deepEqual(result,{ok:true,id:'first-cut',reward:3,coins:10,achievements:[]});
  assert.equal(profile.stats.coinsEarned,3);
  const restored=saved(profile),before=saved(restored);
  assert.equal(claimAchievement(restored,'first-cut').ok,false);
  assert.deepEqual(restored,before);
  for(const id of ['first-super','missing']) {
    assert.equal(claimAchievement(restored,id).ok,false);
    assert.deepEqual(restored,before);
  }
});

test('reward coins count toward lifetime earnings and reaching a milestone still requires a separate claim', () => {
  const profile=makeProfile({coins:2,achievements:['first-cut'],stats:{correct:0,coinsEarned:99,superUses:0,bestCombo:0,hardClears:0}});
  const result=claimAchievement(profile,'first-cut');
  assert.deepEqual(result.achievements,['coins-100']);
  assert.equal(profile.coins,5);
  assert.equal(profile.stats.coinsEarned,102);
  assert.deepEqual(profile.claimedAchievements,['first-cut']);
  assert.equal(claimAchievement(profile,'coins-100').reward,5);
  assert.equal(profile.coins,10);
  assert.equal(profile.stats.coinsEarned,107);
});

test('all twenty-four rewards remain individually claimable once, including previously unlocked story achievements', () => {
  const profile=makeProfile({achievements:ACHIEVEMENTS.map(item=>item.id)});
  let expected=0;
  for(const achievement of ACHIEVEMENTS) {
    const result=claimAchievement(profile,achievement.id);
    assert.equal(result.ok,true);
    expected+=achievement.reward;
    assert.equal(profile.coins,expected);
    assert.equal(claimAchievement(profile,achievement.id).ok,false);
  }
  assert.equal(profile.claimedAchievements.length,24);
  assert.equal(profile.stats.coinsEarned,expected);
});

test('achievement progress distinguishes accumulated progress, an unlocked story goal, and a claimed reward', () => {
  const profile=makeProfile({stats:{correct:123,coinsEarned:200,superUses:0,bestCombo:14,hardClears:0},achievements:['first-cut'],claimedAchievements:['first-cut']});
  assert.deepEqual(getAchievementProgress(profile,'correct-250'),{current:123,target:250,unlocked:false,claimed:false});
  assert.deepEqual(getAchievementProgress(profile,'combo-10'),{current:10,target:10,unlocked:false,claimed:false});
  assert.deepEqual(getAchievementProgress(profile,'first-cut'),{current:1,target:1,unlocked:true,claimed:true});
  assert.deepEqual(getAchievementProgress(profile,'flow-five'),{current:0,target:1,unlocked:false,claimed:false});
  assert.deepEqual(getAchievementProgress(null,'missing'),{current:0,target:1,unlocked:false,claimed:false});
});

test('bounded balances cannot overflow through rewards and invalid currency never grants a purchase', () => {
  const profile=makeProfile({coins:Number.MAX_SAFE_INTEGER-1,achievements:['context-master'],stats:{correct:0,coinsEarned:Number.MAX_SAFE_INTEGER,superUses:0,bestCombo:0,hardClears:0}});
  const reward=claimAchievement(profile,'context-master');
  assert.equal(reward.reward,1);
  assert.equal(profile.coins,Number.MAX_SAFE_INTEGER);
  assert.equal(profile.stats.coinsEarned,Number.MAX_SAFE_INTEGER);
  for(const coins of [-1,Infinity,NaN,'100']) {
    const invalid=makeProfile({coins});
    assert.equal(buySkill(invalid,'coin-root').ok,false);
    assert.equal(Object.is(invalid.coins,coins),true);
  }
});

test('worlds form one priced level chain and backgrounds offer one free and one distinct premium look per context', () => {
  assert.deepEqual(WORLDS.map(world=>[world.id,world.cost,world.requires]),[
    ['study',0,[]],['gaming',80,['study']],['sleep',180,['gaming']],['master',320,['sleep']]
  ]);
  assert.equal(getWorld('master').name,'Balance Master');
  assert.equal(getWorld('missing'),null);
  assert.equal(BACKGROUNDS.length,6);
  assert.equal(new Set(BACKGROUNDS.map(background=>background.id)).size,6);
  for(const context of ['study','gaming','sleep']) {
    const choices=BACKGROUNDS.filter(background=>background.context===context);
    assert.equal(choices.length,2);
    assert.equal(choices[0].cost,0);
    assert.ok(choices[1].cost>0);
    assert.ok(choices.every(background=>background.requiresWorld===context));
    assert.notDeepEqual(choices[0].preview,choices[1].preview);
    assert.ok(choices.every(background=>background.preview.length===4&&background.palette.sky&&background.description));
  }
  assert.equal(getBackground('paper-garden').cost,160);
  assert.equal(getBackground('pixel-cove').cost,220);
  assert.equal(getBackground('moon-isles').cost,280);
  assert.equal(getBackground('missing'),null);
});

test('room migration keeps only reachable paid unlocks and validates contextual background selections', () => {
  const source={
    unlockedWorlds:['master','sleep','study','study','missing'],
    unlockedBackgrounds:['paper-garden','pixel-cove','moon-isles','missing','paper-garden'],
    selectedBackgrounds:{study:'paper-garden',gaming:'moon-isles',sleep:'moon-isles'}
  };
  const before=saved(source),progress=sanitizeProgress(source);
  assert.deepEqual(progress.unlockedWorlds,['study']);
  assert.deepEqual(progress.unlockedBackgrounds,['classroom','game-room','bedroom','paper-garden']);
  assert.deepEqual(progress.selectedBackgrounds,{study:'paper-garden',gaming:'game-room',sleep:'bedroom'});
  progress.unlockedWorlds.push('gaming');progress.selectedBackgrounds.study='classroom';
  assert.deepEqual(source,before);
});

test('earned coins unlock rooms in order without switching the chosen mode or background', () => {
  const profile=makeProfile({coins:800,mode:'study'});
  const originalBackgrounds=saved(profile.selectedBackgrounds);
  assert.equal(buyWorld(profile,'gaming').coins,720);
  assert.equal(buyWorld(profile,'sleep').coins,540);
  const purchase=buyWorld(profile,'master');
  assert.deepEqual(purchase,{ok:true,id:'master',coins:220,unlockedWorlds:['study','gaming','sleep','master']});
  assert.equal(profile.mode,'study');
  assert.deepEqual(profile.selectedBackgrounds,originalBackgrounds);
  purchase.unlockedWorlds.pop();
  assert.equal(profile.unlockedWorlds.includes('master'),true);
});

test('blocked room purchases never deduct coins or modify an old profile', () => {
  const profile={coins:100,achievements:['first-cut'],highScores:{study:1200}};
  for(const id of ['study','sleep','master','missing']) {
    const before=saved(profile);
    assert.equal(buyWorld(profile,id).ok,false,id);
    assert.deepEqual(profile,before);
  }
  const poor=makeProfile({coins:34});
  const before=saved(poor);
  assert.equal(buyWorld(poor,'gaming').ok,false);
  assert.deepEqual(poor,before);
  assert.equal(buyWorld(null,'gaming').ok,false);
});

test('premium art requires its room, sufficient currency, and a separate selection after buying', () => {
  const profile=makeProfile({coins:600});
  let before=saved(profile);
  assert.equal(buyBackground(profile,'pixel-cove').ok,false);
  assert.deepEqual(profile,before);
  assert.equal(buyBackground(profile,'paper-garden').ok,true);
  assert.equal(profile.coins,440);
  assert.equal(profile.selectedBackgrounds.study,'classroom');
  assert.equal(equipBackground(profile,'paper-garden').ok,true);
  assert.equal(profile.selectedBackgrounds.study,'paper-garden');
  assert.equal(buyWorld(profile,'gaming').ok,true);
  assert.equal(buyBackground(profile,'pixel-cove').coins,140);
  assert.equal(profile.selectedBackgrounds.gaming,'game-room');
  const equipped=equipBackground(profile,'pixel-cove');
  assert.deepEqual(equipped,{ok:true,id:'pixel-cove',context:'gaming',selectedBackgrounds:{study:'paper-garden',gaming:'pixel-cove',sleep:'bedroom'}});
  equipped.selectedBackgrounds.gaming='game-room';
  assert.equal(profile.selectedBackgrounds.gaming,'pixel-cove');
  before=saved(profile);
  assert.equal(buyBackground(profile,'pixel-cove').ok,false);
  assert.deepEqual(profile,before);
});

test('locked room defaults and unowned art cannot be equipped or purchased cheaply', () => {
  const profile=makeProfile({coins:59});
  for(const [action,id] of [[equipBackground,'game-room'],[equipBackground,'paper-garden'],[equipBackground,'missing'],[buyBackground,'paper-garden'],[buyBackground,'classroom'],[buyBackground,'missing']]) {
    const before=saved(profile);
    assert.equal(action(profile,id).ok,false,id);
    assert.deepEqual(profile,before);
  }
  assert.equal(equipBackground(profile,'classroom').ok,true);
  assert.equal(profile.coins,59);
  assert.equal(buyBackground(null,'paper-garden').ok,false);
  assert.equal(equipBackground(null,'classroom').ok,false);
});

test('world and background purchases preserve skill, achievement, currency history, and selections across reloads', () => {
  const profile=makeProfile({coins:1000,unlockedSkills:['focus-root','slow-super'],selectedSuper:'slow-super',stats:{correct:250,coinsEarned:600,superUses:3,bestCombo:25,hardClears:1},achievements:['first-cut'],claimedAchievements:['first-cut']});
  const expectedSkills=saved(profile.unlockedSkills),expectedStats=saved(profile.stats);
  for(const id of ['gaming','sleep','master']) assert.equal(buyWorld(profile,id).ok,true);
  assert.equal(buyBackground(profile,'moon-isles').ok,true);
  assert.equal(equipBackground(profile,'moon-isles').ok,true);
  const restored=sanitizeProgress(saved(profile));
  assert.deepEqual(restored.unlockedSkills,expectedSkills);
  assert.deepEqual(restored.stats,expectedStats);
  assert.equal(restored.selectedSuper,'slow-super');
  assert.deepEqual(restored.claimedAchievements,['first-cut']);
  assert.deepEqual(restored.unlockedWorlds,['study','gaming','sleep','master']);
  assert.deepEqual(restored.selectedBackgrounds,{study:'classroom',gaming:'game-room',sleep:'moon-isles'});
  assert.equal(profile.coins,140);
  assert.deepEqual(profile.achievements,['first-cut']);
});

test('each of the twelve long-term milestones unlocks only at its actual counter threshold', () => {
  const ids=['correct-1000','correct-2500','combo-50','combo-75','runs-10','runs-25','supers-25','supers-100','hard-5','hard-20','coins-500','coins-1500'];
  for(const id of ids) {
    const achievement=ACHIEVEMENTS.find(item=>item.id===id);assert.ok(achievement,id);
    const profile=makeProfile({coins:17});
    if(achievement.stat==='totalRuns')profile.totalRuns=achievement.target-1;
    else profile.stats[achievement.stat]=achievement.target-1;
    unlockAchievements(profile);assert.equal(profile.achievements.includes(id),false,id);
    assert.equal(getAchievementProgress(profile,id).current,achievement.target-1);
    if(achievement.stat==='totalRuns')profile.totalRuns++;
    else profile.stats[achievement.stat]++;
    assert.ok(unlockAchievements(profile).includes(id),id);assert.equal(profile.coins,17);
    assert.deepEqual(getAchievementProgress(profile,id),{current:achievement.target,target:achievement.target,unlocked:true,claimed:false});
    const claimed=claimAchievement(profile,id);assert.equal(claimed.ok,true);assert.ok(claimed.reward>=3&&claimed.reward<=20);
    const before=saved(profile);assert.equal(claimAchievement(profile,id).ok,false);assert.deepEqual(profile,before);
  }
});

test('new milestone rewards stay modest compared with the full collection and never auto-claim one another', () => {
  assert.equal(ACHIEVEMENTS.length,24);
  assert.ok(ACHIEVEMENTS.every(item=>item.reward>=3&&item.reward<=20));
  const collection=SKILLS.reduce((sum,item)=>sum+item.cost,0)+WORLDS.reduce((sum,item)=>sum+item.cost,0)+BACKGROUNDS.reduce((sum,item)=>sum+item.cost,0);
  const rewards=ACHIEVEMENTS.reduce((sum,item)=>sum+item.reward,0);
  assert.ok(collection>2000);assert.ok(rewards<collection*.12);
  const profile=makeProfile({totalRuns:25,stats:{correct:2500,coinsEarned:1500,superUses:100,bestCombo:75,hardClears:20}});
  unlockAchievements(profile);assert.equal(profile.coins,0);assert.equal(profile.claimedAchievements.length,0);
  const reward=claimAchievement(profile,'coins-1500');assert.equal(reward.reward,20);assert.equal(profile.coins,20);assert.deepEqual(profile.claimedAchievements,['coins-1500']);
});


test('one gentle open-run speed curve stays continuous and keeps increasing without a limit', () => {
  for(const difficulty of DIFFICULTIES) {
    const before=getOpenSpeedFactor(difficulty.id,90-.000001),at=getOpenSpeedFactor(difficulty.id,90),after=getOpenSpeedFactor(difficulty.id,90+.000001);
    assert.ok(before<=at&&at<after);assert.ok(after-before<.000001);
    let prior=at;
    for(const seconds of [120,300,3600,60000]){const speed=getOpenSpeedFactor(difficulty.id,seconds);assert.ok(speed>prior);assert.ok(Number.isFinite(speed));prior=speed;}
    assert.equal(getOpenSpeedFactor(difficulty.id,-1),.82);assert.equal(getOpenSpeedFactor(difficulty.id,NaN),.82);
  }
});
