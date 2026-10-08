(()=>{var fh="mind-maze:save:v1",ji=[{id:"scanner",name:"Fokus-Scanner",cost:1,charges:1,maxLevel:2,upgradeCost:2,description:"Liest die echte Raumspur und b\xFCndelt deine Aufmerksamkeit.",effect:"Hinweis sichtbar; +8 Fokus, \u22126 Stress. Upgrade: +12 / \u221210."},{id:"shield",name:"Impulsschild",cost:2,charges:1,maxLevel:2,upgradeCost:2,description:"D\xE4mpft falsche Impulse auf der Br\xFCcke. Du musst trotzdem selbst hin\xFCbergehen.",effect:"Ein Br\xFCckendurchgang ohne Fallenstress. Upgrade sch\xFCtzt auch vor einem T\xE4uschungsklick."},{id:"planner",name:"Ein-Aufgaben-Planer",cost:3,charges:1,maxLevel:2,upgradeCost:2,description:"Macht Abh\xE4ngigkeiten sichtbar. Die zweite Stufe kann einen Ablauf ausf\xFChren.",effect:"Stufe 1 zeigt den Taktlabor-Hinweis; Stufe 2 l\xF6st dessen Ablauf alternativ."},{id:"bypass",name:"Analoger Bypass",cost:3,charges:1,maxLevel:1,upgradeCost:0,description:"\xDCberbr\xFCckt den digitalen Schaltknoten \xFCber eine unabh\xE4ngige Leitung.",effect:"Alternative L\xF6sung f\xFCr den Energieknoten; weniger R\xE4tselpunkte."}],_s=[{index:0,id:"echo-lock",kind:"memory",title:"Echo-Schleuse",subtitle:"Eine Spur reicht.",narrative:"Du erwachst in einer digitalen Anlage. Der Ausgang ist verriegelt. Vier Lichtimpulse \xF6ffnen die erste Schleuse; daneben dr\xE4ngen bunte Meldungen nach vorn. Die Anlage pr\xFCft, welcher Spur du Aufmerksamkeit gibst.",objective:"Lies die echte Lichtspur und wiederhole ihre Reihenfolge am Terminal.",lesson:"Arbeitsged\xE4chtnis h\xE4lt nur begrenzt viele Informationen zugleich. Eine Aufgabe und eine klare Spur helfen.",clue:{title:"Die echte Lichtspur",text:"Die Wartungsnotiz zeigt vier Pulse: 2 \u2192 4 \u2192 1 \u2192 3. Die Anzeigen daneben geh\xF6ren nicht zur Schleuse.",lines:["Zuerst 2.","Dann 4.","Dann 1.","Zum Schluss 3."],sequence:[2,4,1,3]},puzzle:{type:"memory",prompt:"Gib die vier Lichtimpulse in der richtigen Reihenfolge ein.",sequence:[2,4,1,3],options:[1,2,3,4].map(i=>({id:i,label:`Impuls ${i}`}))}},{index:1,id:"signal-archive",kind:"filter",title:"Signalarchiv",subtitle:"Wichtig ist nicht dasselbe wie laut.",narrative:"Das Archiv sortiert Nachrichten nach Lautst\xE4rke, nicht nach Bedeutung. Du brauchst die Meldungen, die deinen Weg oder die Sicherheit betreffen. Ein blinkender Streak besitzt keine Schl\xFCsselgewalt.",objective:"W\xE4hle genau die drei relevanten Meldungen aus.",lesson:"Aufmerksamkeitsfilter sind Entscheidungen: Was geh\xF6rt jetzt zur Aufgabe, und was kann warten?",clue:{title:"Auftrag statt Aufmerksamkeit",text:"Relevant sind der Lageplan, die echte Leitungswarnung und die Teamnotiz. Feed, Rabatt und Streak helfen dir nicht beim Entkommen.",lines:["Weg finden: Lageplan.","Gefahr pr\xFCfen: Leitungswarnung.","Aufgabe abstimmen: Teamnotiz."]},puzzle:{type:"filter",prompt:"Welche Meldungen geh\xF6ren zu deinem Auftrag?",options:[{id:"map",label:"Lageplan: Der Energieknoten liegt hinter T\xFCr 2."},{id:"streak",label:"Deine Streak vermisst dich! \xD6ffne den Feed."},{id:"alarm",label:"Leitungswarnung: Vor dem Einschalten die Schaltregeln lesen."},{id:"sale",label:"Nur heute: neue Farben f\xFCr dein Terminal."},{id:"team",label:"Teamnotiz: Teste die Leitung vor dem Senden."},{id:"feed",label:"Zw\xF6lf neue Clips warten auf dich."}]}},{index:2,id:"power-node",kind:"logic",title:"Energieknoten",subtitle:"Pr\xFCfen, bevor du klickst.",narrative:"Vier Leitungen konkurrieren um einen Ausgang. Die Anlage bietet dauernd einen \u201ESofort-Fix\u201C an. Die echte Schaltung verlangt, alle Bedingungen gemeinsam zu pr\xFCfen. An der Seitenwand ist eine auff\xE4llig stille Wartungst\xFCr.",objective:"Finde eine Schalterkombination, die alle vier Regeln erf\xFCllt.",lesson:"Eine laute Abk\xFCrzung ersetzt keine Pr\xFCfung. Ein Modell mit klaren Bedingungen reduziert unn\xF6tige Versuche.",clue:{title:"Vier Bedingungen",text:"Genau zwei Schalter m\xFCssen an sein. A ist erforderlich. Wenn A an ist, muss C an sein. B und C d\xFCrfen nicht gemeinsam an sein; D funktioniert nur mit B.",lines:["Genau zwei Schalter an.","A erforderlich; A braucht C.","B und C schlie\xDFen sich aus.","D braucht B."]},puzzle:{type:"logic",prompt:"Schalte A, B, C und D. Pr\xFCfe dann die gesamte Kombination.",switches:[{id:"A",label:"A \xB7 Versorgung"},{id:"B",label:"B \xB7 Impulskreis"},{id:"C",label:"C \xB7 ruhige Leitung"},{id:"D",label:"D \xB7 Verst\xE4rker"}]}},{index:3,id:"impulse-bridge",kind:"bridge",title:"Impulsbr\xFCcke",subtitle:"Erst schauen. Dann gehen.",narrative:"Ein Boden aus sechs Feldern trennt dich von der n\xE4chsten T\xFCr. Einige Impulse locken dich auf eine Abk\xFCrzung. Die Wartungsspur ist langsamer zu lesen, aber zuverl\xE4ssig. Dein Weg z\xE4hlt erst, wenn du ihn tats\xE4chlich gehst.",objective:"Lies die Spur und betrete A, C, D, F in dieser Reihenfolge.",lesson:"Ein kurzer Orientierungsstopp kann impulsive Fehler verhindern. Schutzwerkzeuge ersetzen nicht deine Handlung.",clue:{title:"Die Wartungsspur",text:"Der sichere Weg verl\xE4uft A \u2192 C \u2192 D \u2192 F. B und E sind T\xE4uschungsfelder. Mit einem Impulsschild kannst du eine andere Strecke \xFCber mindestens drei verschiedene Felder bis F nehmen.",lines:["A \u2192 C \u2192 D \u2192 F.","B und E f\xFChren ohne Schutz in eine Falle.","Gehe den Weg selbst; ein Terminalklick reicht nicht."]},puzzle:{type:"bridge",prompt:"Gehe \xFCber die Felder. Best\xE4tige erst am anderen Ende.",tiles:["A","B","C","D","E","F"],path:["A","C","D","F"]}},{index:4,id:"timing-lab",kind:"schedule",title:"Taktlabor",subtitle:"Wechsel kosten Aufmerksamkeit.",narrative:"Vier Aufgaben blinken gleichzeitig. Alles parallel zu starten wirkt schnell, erzeugt aber R\xFCckspr\xFCnge: Ein Test ohne Leitung und eine Nachricht ohne Testergebnis helfen niemandem. Du bringst die Aufgaben in einen ausf\xFChrbaren Ablauf.",objective:"Ordne Plan, Leitung, Test und Senden nach ihren Abh\xE4ngigkeiten.",lesson:"Multitasking besteht oft aus schnellen Wechseln. Klare Reihenfolgen sparen Wechsel und vermeiden Nacharbeit.",clue:{title:"Abh\xE4ngigkeiten vor Geschwindigkeit",text:"Erst den Plan lesen, dann die Leitung verbinden. Der Test braucht die fertige Leitung. Senden darf erst nach dem Test stattfinden.",lines:["Plan vor Leitung.","Leitung vor Test.","Test vor Senden."]},puzzle:{type:"schedule",prompt:"Baue einen Ablauf aus den vier Aufgaben.",tasks:[{id:"send",label:"Ergebnis senden"},{id:"test",label:"Leitung testen"},{id:"plan",label:"Plan lesen"},{id:"wire",label:"Leitung verbinden"}]}},{index:5,id:"exit-core",kind:"exit",title:"Ausgangskern",subtitle:"Du setzt das letzte Signal.",narrative:"Die Anlage hat keinen echten Countdown. Sie wollte, dass jede Unterbrechung wichtiger wirkt als dein Ziel. Deine gesammelten Fragmente \xF6ffnen den regul\xE4ren Ausgang. Wer den Stillraum entdeckt hat, kennt eine zweite Route.",objective:"\xD6ffne eine Ausgangsroute mit dem passenden Wort und gehe anschlie\xDFend zur T\xFCr.",lesson:"Bewusst ausw\xE4hlen, ordnen und Pausen erlauben: Kontrolle bedeutet nicht, jede Meldung zu beantworten.",clue:{title:"Zwei Wege aus der Anlage",text:"Die f\xFCnf Raumfragmente ergeben FOKUS f\xFCr den regul\xE4ren Ausgang. Der Stillraum verr\xE4t PAUSE f\xFCr den leisen Ausgang. Ein gel\xF6stes Terminal \xF6ffnet die T\xFCr; du musst sie noch selbst erreichen.",lines:["Regul\xE4r: FOKUS.","Leise Route: PAUSE, nur mit gel\xF6stem Stillraum.","Kein Zeitlimit. Erreiche die ge\xF6ffnete T\xFCr."]},puzzle:{type:"exit",prompt:"W\xE4hle die Route und gib das Ausgangswort ein.",routes:[{id:"balanced",label:"Regul\xE4rer Ausgang \xB7 FOKUS"},{id:"quiet",label:"Leiser Ausgang \xB7 PAUSE"}]}},{index:6,id:"quiet-room",kind:"secret",title:"Stillraum",subtitle:"Die versteckte Pause.",narrative:"Hinter der Wartungst\xFCr gibt es keine Werbung und keinen Alarm. Eine analoge Karte nennt das Prinzip, das die Anlage st\xE4ndig verdeckte. Dieser Raum ist optional; er \xF6ffnet einen anderen Ausgang und schenkt dir zus\xE4tzliche Werkzeugpunkte.",objective:"Lies die analoge Karte und erg\xE4nze ihr Prinzip.",lesson:"Eine selbst gew\xE4hlte Pause kann Stress senken. Sie ist ein Werkzeug, kein Versagen.",clue:{title:"Die analoge Karte",text:"\u201EWenn alles zugleich dr\xE4ngt: EINE SACHE nach der anderen.\u201C Das Prinzip ist EINE SACHE. Darunter steht das Ausgangswort PAUSE.",lines:["EINE SACHE nach der anderen.","Leiser Ausgang: PAUSE."]},puzzle:{type:"secret",prompt:"Welches Prinzip steht auf der Karte?",placeholder:"Zwei W\xF6rter"}}],wl=Number.MAX_SAFE_INTEGER,Tl=new Map(ji.map(i=>[i.id,i])),Ji=["A","C","D","F"],bd=["map","alarm","team"],Ed=["plan","wire","test","send"],ph=["F","O","K","U","S"],Ki=i=>i!==null&&typeof i=="object"&&!Array.isArray(i),cn=(i,e=0,t=0,n=wl)=>typeof i=="number"&&Number.isFinite(i)?Math.max(t,Math.min(n,i)):e,Ti=(i,e=0,t=0,n=wl)=>Math.trunc(cn(i,e,t,n)),gs=i=>JSON.parse(JSON.stringify(i)),je=i=>({ok:!1,reason:i}),mh=i=>typeof i=="string"?i.trim().toUpperCase().replace(/\s+/g," "):"",dr=(i,e)=>Array.isArray(i)&&i.length===e.length&&i.every((t,n)=>t===e[n]),gh=i=>[...new Set((Array.isArray(i)?i:[]).filter(e=>Number.isInteger(e)&&e>=0&&e<=6))],_h=i=>{let e=2166136261;for(let t of String(i))e=Math.imul(e^t.charCodeAt(0),16777619);return e>>>0};function Al(i){if(!Ki(i)||!Number.isFinite(i.x)||!Number.isFinite(i.z))return null;let e=cn(i.yaw,0,-wl);return{x:cn(i.x,0,-200,200),z:cn(i.z,0,-200,200),yaw:((e+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI,pitch:cn(i.pitch,0,-1.5,1.5)}}function da(i,e){return{started:!1,seed:i,startedAt:e,roomIndex:0,roomSolved:!1,solved:[],observed:[],tools:Object.fromEntries(ji.map(t=>[t.id,{owned:t.id==="scanner",level:t.id==="scanner"?1:0,charges:t.id==="scanner"?2:0}])),credits:0,focus:80,stress:15,trapWitness:[],shieldActive:!1,deceptionShield:0,fragments:[],secretUnlocked:!1,secretSolved:!1,returnRoomIndex:null,mainPosition:null,position:{x:0,z:5.5,yaw:0,pitch:0},routes:{},exitRoute:null,score:0,ended:!1,ending:null,distractionSequence:0,lastDistractionAt:null,pendingDistraction:null,distractions:[],hazardIds:[],metrics:{cluesRead:0,mistakes:0,hazards:0,toolUses:0,upgrades:0,spawned:0,clicked:0,ignored:0,deceptiveClicks:0,deceptiveIgnored:0,usefulClicks:0,usefulIgnored:0,roomsWithoutTools:0},roomMistakes:{},history:[]}}var xh=[{title:"Neue Clips im Anlagenfeed",text:"Ein kurzer Blick? Die Schleuse kann warten.",category:"feed",deceptive:!0},{title:"Sofort-Fix verf\xFCgbar",text:"\xDCberspringe die Schaltregeln. Ein Klick f\xFChlt sich schneller an.",category:"shortcut",deceptive:!0},{title:"Dein Impuls-Bonus wartet",text:"Sammle den blinkenden Bonus, bevor du weiterdenkst.",category:"reward",deceptive:!0},{title:"Priorit\xE4t: Alles gleichzeitig",text:"Starte alle Aufgaben parallel. Pr\xFCfen l\xE4sst sich sp\xE4ter.",category:"multitask",deceptive:!0}],fa=class{constructor({storage:e,now:t=()=>Date.now(),seed:n="MIND-MAZE"}={}){if(this.now=typeof t=="function"?t:()=>Date.now(),this.seed=_h(n),this.storageFailed=!1,this.storageError=null,e===void 0)try{e=typeof window<"u"?globalThis.localStorage:null}catch{e=null,this.storageFailed=!0,this.storageError="unavailable"}this.storage=e,this.state=da(this.seed,this._time()),this._restore()}_time(){try{return cn(this.now(),Date.now(),0,864e13)}catch{return Date.now()}}currentRoom(){return _s[this.state.roomIndex]}resume(){return this.state.started&&!this.state.ended?{ok:!0,state:this.state}:je("Kein offener Run zum Fortsetzen.")}_live(){return this.state.started&&!this.state.ended}_record(e,t={}){this.state.history.push({type:e,room:this.state.roomIndex,time:this._time(),data:gs(t)}),this.state.history.length>300&&this.state.history.splice(0,this.state.history.length-300)}_change(e,t){this.state.focus=cn(this.state.focus+e,80,0,100),this.state.stress=cn(this.state.stress+t,15,0,100)}_restore(){if(this.storage)try{let e=this.storage.getItem(fh);if(e===null)return;let t=JSON.parse(e);if(!Ki(t)||t.schemaVersion!==1||!Ki(t.state))throw new Error("invalid schema");let n=t.state;if(!Number.isInteger(n.roomIndex)||n.roomIndex<0||n.roomIndex>6)throw new Error("invalid room");let s=da(Ti(n.seed,this.seed,0,4294967295),this._time());s.started=n.started===!0,s.startedAt=cn(n.startedAt,this._time()),s.solved=gh(n.solved),s.observed=gh(n.observed),s.roomIndex=n.roomIndex,s.roomSolved=s.solved.includes(s.roomIndex);let r=s.roomIndex===6?2:s.roomIndex;if(Array.from({length:r},(o,l)=>l).some(o=>!s.solved.includes(o))||s.roomIndex===6&&!s.solved.includes(2))throw new Error("invalid progress");let a=0;for(;s.solved.includes(a)&&a<6;)a++;if(s.solved.some(o=>o<6&&o>=a)||s.solved.includes(6)&&a<3||a<r||a>r+1)throw new Error("invalid solved rooms");for(let o of["credits","score","distractionSequence","deceptionShield"])s[o]=Ti(n[o]);s.deceptionShield=Math.min(1,s.deceptionShield),s.focus=cn(n.focus,80,0,100),s.stress=cn(n.stress,15,0,100);for(let o of ji){let l=n.tools?.[o.id];if(!Ki(l))continue;let c=l.owned===!0;s.tools[o.id]={owned:c,level:c?Ti(l.level,1,1,o.maxLevel):0,charges:c?Ti(l.charges,0,0,20):0}}s.trapWitness=(Array.isArray(n.trapWitness)?n.trapWitness:[]).filter(o=>_s[3].puzzle.tiles.includes(o)).slice(-6),s.shieldActive=n.shieldActive===!0&&s.roomIndex===3&&s.tools.shield.owned,!s.shieldActive&&!s.trapWitness.every((o,l)=>o===Ji[l])&&(s.trapWitness=[]),s.secretUnlocked=s.solved.includes(2),s.secretSolved=s.solved.includes(6),s.returnRoomIndex=s.roomIndex===6?2:null,s.position=Al(n.position)||{x:0,z:5.5,yaw:0,pitch:0},s.mainPosition=Al(n.mainPosition),s.fragments=ph.filter((o,l)=>s.solved.includes(l)),s.routes={};for(let o of s.solved)s.routes[o]=typeof n.routes?.[o]=="string"?n.routes[o].slice(0,30):"balanced";for(let o of Object.keys(s.metrics))s.metrics[o]=Ti(n.metrics?.[o]);s.roomMistakes={};for(let o=0;o<=6;o++)n.roomMistakes?.[o]&&(s.roomMistakes[o]=Ti(n.roomMistakes[o]));s.lastDistractionAt=typeof n.lastDistractionAt=="number"&&Number.isFinite(n.lastDistractionAt)?cn(n.lastDistractionAt,0):null,s.distractions=(Array.isArray(n.distractions)?n.distractions:[]).slice(-100).filter(Ki).map(o=>({id:typeof o.id=="string"?o.id.slice(0,100):"",title:typeof o.title=="string"?o.title.slice(0,200):"",text:typeof o.text=="string"?o.text.slice(0,500):"",category:typeof o.category=="string"?o.category.slice(0,30):"unknown",deceptive:o.deceptive===!0,level:Ti(o.level,1,1,3),adaptation:["normal","precision","temptation","recovery"].includes(o.adaptation)?o.adaptation:"normal",time:cn(o.time),action:["click","ignore"].includes(o.action)?o.action:null})),s.pendingDistraction=s.distractions.find(o=>o.id===n.pendingDistraction?.id&&o.action===null)||null,s.hazardIds=[...new Set((Array.isArray(n.hazardIds)?n.hazardIds:[]).filter(o=>typeof o=="string").slice(-30))],s.history=(Array.isArray(n.history)?n.history:[]).slice(-300).filter(Ki).map(o=>({type:typeof o.type=="string"?o.type.slice(0,40):"unknown",room:Ti(o.room,0,0,6),time:cn(o.time),data:Ki(o.data)?gs(o.data):{}})),s.exitRoute=["balanced","quiet"].includes(n.exitRoute)&&s.solved.includes(5)?n.exitRoute:null,s.exitRoute==="quiet"&&!s.secretSolved&&(s.exitRoute=null),s.ended=n.ended===!0&&s.roomIndex===5&&s.roomSolved&&!!s.exitRoute,s.ending=s.ended?s.exitRoute:null,s.ended&&(s.finishedAt=cn(n.finishedAt,this._time())),this.state=s}catch{this.state=da(this.seed,this._time()),this.storageFailed=!0,this.storageError="unreadable"}}save(){if(!this.storage||typeof this.storage.setItem!="function")return this.storageFailed=!0,this.storageError="unavailable",je("Lokales Speichern ist nicht verf\xFCgbar. Du kannst in dieser Sitzung weiterspielen.");try{return this.storage.setItem(fh,JSON.stringify({schemaVersion:1,state:this.state})),this.storageFailed=!1,this.storageError=null,{ok:!0}}catch{return this.storageFailed=!0,this.storageError="write-failed",je("Speichern ist blockiert oder der Speicher ist voll. Dein Fortschritt bleibt in dieser Sitzung erhalten.")}}start(){return this.state=da(this.seed,this._time()),this.state.started=!0,this._record("start"),this.save(),{ok:!0,state:this.state}}setPosition(e){if(!this._live())return je("Starte zuerst einen Run.");let t=Al(e);return t?(this.state.position=t,{ok:!0,position:t}):je("Ung\xFCltige Position.")}observeClue(){if(!this._live())return je("Starte zuerst einen Run.");let e=this.state;return e.observed.includes(e.roomIndex)||(e.observed.push(e.roomIndex),e.metrics.cluesRead++,this._record("clue-read"),this.save()),{ok:!0,clue:this.currentRoom().clue}}_award(e="balanced",t=!1){let n=this.state;return n.roomSolved?je("Dieser Raum ist bereits gel\xF6st."):(n.roomSolved=!0,n.solved.push(n.roomIndex),n.routes[n.roomIndex]=e,n.score+=n.roomIndex===6?80:t?75:100,n.credits+=n.roomIndex===6?3:n.roomIndex===5?0:2,t||n.metrics.roomsWithoutTools++,this._change(4,-4),n.roomIndex<5&&n.fragments.push(ph[n.roomIndex]),n.roomIndex===2&&(n.secretUnlocked=!0),n.roomIndex===6&&(n.secretSolved=!0,this._change(10,-15)),this._record("room-solved",{route:e,tool:t}),this.save(),{ok:!0,solved:!0,roomIndex:n.roomIndex,route:e,credits:n.credits})}solve(e,t="balanced"){if(!this._live())return je("Starte zuerst einen Run.");let n=this.state,s=n.roomIndex;if(n.roomSolved)return je("Dieser Raum ist bereits gel\xF6st.");if(!n.observed.includes(s))return je("Lies zuerst den echten Hinweis im Raum.");let r=!1;if(s===0&&(r=dr(e,[2,4,1,3])),s===1&&(r=Array.isArray(e)&&e.length===3&&new Set(e).size===3&&bd.every(a=>e.includes(a))),s===2&&Array.isArray(e)&&e.length===4&&e.every(a=>typeof a=="boolean")){let[a,o,l,c]=e;r=e.filter(Boolean).length===2&&a&&(!a||l)&&!(o&&l)&&(!c||o)}if(s===3&&(r=e==="traverse"&&(n.shieldActive?n.trapWitness.at(-1)==="F"&&new Set(n.trapWitness).size>=3:dr(n.trapWitness,Ji)),r))return this._award(n.shieldActive?"shield":"balanced",n.shieldActive);if(s===4&&(r=dr(e,Ed)),s===5){if(!["balanced","quiet"].includes(t))return je("W\xE4hle einen g\xFCltigen Ausgang.");if(t==="quiet"&&!n.secretSolved)return je("Die leise Route braucht das Prinzip aus dem Stillraum.");r=mh(e)===(t==="quiet"?"PAUSE":"FOKUS"),r&&(n.exitRoute=t)}return s===6&&(r=mh(e)==="EINE SACHE"),r?this._award(t):(n.metrics.mistakes++,n.roomMistakes[s]=(n.roomMistakes[s]||0)+1,this._change(-4,5),this._record("wrong-answer"),this.save(),je(s===3?"Die Br\xFCcke braucht deinen tats\xE4chlichen Weg A \u2192 C \u2192 D \u2192 F oder eine gesch\xFCtzte Strecke bis F.":"Das passt noch nicht zu allen Hinweisen. Pr\xFCfe die Spur; es gibt kein Zeitlimit."))}nextRoom(){if(!this._live())return je("Starte zuerst einen Run.");let e=this.state;return e.roomSolved?e.roomIndex===6?je("Gehe vom Stillraum zur\xFCck zum Energieknoten."):e.roomIndex===5?je("Erreiche jetzt den echten Ausgang."):(e.roomIndex++,e.roomSolved=e.solved.includes(e.roomIndex),e.position={x:0,z:5.5,yaw:0,pitch:0},e.shieldActive=!1,e.trapWitness=[],e.hazardIds=[],this._record("room-entered"),this.save(),{ok:!0,room:this.currentRoom(),roomIndex:e.roomIndex}):je("Die T\xFCr \xF6ffnet erst nach der Raumaufgabe.")}enterSecret(){let e=this.state;return!this._live()||e.roomIndex!==2||!e.roomSolved||!e.secretUnlocked?je("Die Wartungst\xFCr wird nach dem gel\xF6sten Energieknoten zug\xE4nglich."):(e.returnRoomIndex=2,e.mainPosition=e.position?gs(e.position):null,e.roomIndex=6,e.roomSolved=e.secretSolved,e.position={x:0,z:5.5,yaw:0,pitch:0},this._record("secret-entered"),this.save(),{ok:!0,room:this.currentRoom(),roomIndex:6})}leaveSecret(){let e=this.state;return!this._live()||e.roomIndex!==6?je("Du bist nicht im Stillraum."):(e.roomIndex=2,e.roomSolved=e.solved.includes(2),e.returnRoomIndex=null,e.position=e.mainPosition||{x:6,z:4.8,yaw:0,pitch:0},e.mainPosition=null,this._record("secret-left"),this.save(),{ok:!0,room:this.currentRoom(),roomIndex:2})}hitHazard(e){return!this._live()||this.state.roomIndex!==3||this.state.roomSolved?je("Hier ist keine aktive Br\xFCckenfalle."):typeof e!="string"||!e||e.length>60?je("Unbekannte Falle."):this.state.shieldActive?{ok:!0,protected:!0,hazard:!1}:(this.state.trapWitness=[],this.state.hazardIds.includes(e)?(this.save(),{ok:!0,hazard:!0,repeated:!0,reset:!0}):(this.state.hazardIds.push(e),this.state.metrics.hazards++,this.state.trapWitness=[],this._change(-6,8),this._record("hazard",{id:e}),this.save(),{ok:!0,hazard:!0,protected:!1,reset:!0}))}traverseTile(e){let t=this.state;if(!this._live()||t.roomIndex!==3||t.roomSolved)return je("Die Br\xFCcke ist nicht aktiv.");if(!_s[3].puzzle.tiles.includes(e))return je("Unbekanntes Br\xFCckenfeld.");if(!t.observed.includes(3)&&!t.shieldActive)return je("Lies zuerst die Wartungsspur.");if(t.trapWitness.at(-1)===e)return{ok:!0,repeated:!0,complete:t.shieldActive?e==="F"&&new Set(t.trapWitness).size>=3:dr(t.trapWitness,Ji),protected:t.shieldActive,next:t.shieldActive?null:Ji[t.trapWitness.length]||null};if(!t.shieldActive&&e!==Ji[t.trapWitness.length]){let s=this.hitHazard(`tile-${e}`);return t.trapWitness=[],this.save(),{...s,ok:!1,reason:"Falscher Impuls. Orientiere dich neu an A \u2192 C \u2192 D \u2192 F.",complete:!1,next:"A"}}t.trapWitness.push(e),t.trapWitness.length>6&&t.trapWitness.shift();let n=t.shieldActive?e==="F"&&new Set(t.trapWitness).size>=3:dr(t.trapWitness,Ji);return this._record("tile-traversed",{id:e,protected:t.shieldActive}),this.save(),{ok:!0,complete:n,hazard:!1,protected:t.shieldActive,next:t.shieldActive?null:Ji[t.trapWitness.length]||null}}buyTool(e){if(!this._live())return je("Starte zuerst einen Run.");let t=Tl.get(e);if(!t)return je("Unbekanntes Werkzeug.");let n=this.state.tools[e];return n.charges>=20?je("Dieses Werkzeug ist bereits vollst\xE4ndig geladen."):this.state.credits<t.cost?je("Daf\xFCr fehlen Werkzeugpunkte."):(this.state.credits-=t.cost,n.owned=!0,n.level=Math.max(1,n.level),n.charges+=t.charges,this._record("tool-bought",{id:e,cost:t.cost}),this.save(),{ok:!0,tool:gs(n),id:e})}upgradeTool(e){if(!this._live())return je("Starte zuerst einen Run.");let t=Tl.get(e),n=this.state.tools[e];return!t||!n?.owned?je("Kaufe das Werkzeug zuerst."):n.level>=t.maxLevel?je("Die h\xF6chste Stufe ist bereits erreicht."):this.state.credits<t.upgradeCost?je("Daf\xFCr fehlen Werkzeugpunkte."):(this.state.credits-=t.upgradeCost,n.level++,this.state.metrics.upgrades++,this._record("tool-upgraded",{id:e,level:n.level}),this.save(),{ok:!0,id:e,level:n.level})}useTool(e){if(!this._live()||this.state.roomSolved)return je("Hier braucht es gerade kein Werkzeug.");let t=Tl.get(e),n=this.state.tools[e];if(!t||!n?.owned||n.charges<1)return je("Dieses Werkzeug ist nicht geladen.");let s=this.state.roomIndex;return e==="bypass"&&s!==2?je("Der Bypass geh\xF6rt zum Energieknoten."):e==="shield"&&(s!==3||this.state.shieldActive)?je("Der Schild sch\xFCtzt einen aktiven Br\xFCckendurchgang."):e==="planner"&&s!==4?je("Der Planer geh\xF6rt zum Taktlabor."):(n.charges--,this.state.metrics.toolUses++,this._record("tool-used",{id:e,level:n.level}),e==="bypass"?{...this._award("bypass",!0),type:"solved",id:e}:e==="planner"&&n.level>=2?{...this._award("planner",!0),type:"solved",id:e}:e==="shield"?(this.state.shieldActive=!0,this.state.trapWitness=[],this.state.hazardIds=[],n.level>=2&&(this.state.deceptionShield=1),this.state.observed.includes(3)||this.state.observed.push(3),this.save(),{ok:!0,type:"traversal",id:e,protected:!0}):(this.observeClue(),e==="scanner"&&this._change(n.level>=2?12:8,n.level>=2?-10:-6),this.save(),{ok:!0,type:"clue",id:e,clue:this.currentRoom().clue}))}distractionLevel(){let e=this.state;return e.stress>=65||e.focus<35?1:e.metrics.deceptiveIgnored>=5?3:e.metrics.deceptiveIgnored>=2||e.metrics.deceptiveClicks>=2?2:1}_adaptation(){let e=this.state;return e.stress>=65||e.focus<35?"recovery":e.metrics.deceptiveClicks>=2&&e.metrics.clicked>e.metrics.ignored?"temptation":e.metrics.deceptiveIgnored>=3?"precision":"normal"}distractionCooldown(){return this._adaptation()==="recovery"?2e4:this.distractionLevel()>=2?1e4:12e3}triggerDistraction(){let e=this.state;if(!this._live()||e.roomSolved)return je("Keine aktive Raumaufgabe.");if(e.pendingDistraction)return je("Eine Unterbrechung wartet bereits auf deine Entscheidung.");let t=this._time();if(e.lastDistractionAt!==null&&t<e.lastDistractionAt&&(e.lastDistractionAt=t),e.lastDistractionAt!==null&&t-e.lastDistractionAt<this.distractionCooldown())return je("cooldown");let n=this._adaptation(),s=this.distractionLevel(),r;if(n==="recovery")r={title:"Echtes Signal: Raum f\xFCr eine Pause",text:"Es gibt kein Zeitlimit. Nimm eine Sache nach der anderen; der Hinweis bleibt verf\xFCgbar.",category:"recovery",deceptive:!1};else if((e.distractionSequence+1)%4===0)r={title:"Echtes Signal aus der Wartung",text:`Dein Auftrag bleibt: ${this.currentRoom().objective}`,category:"task",deceptive:!1};else{let o=_h(`${e.seed}:${e.roomIndex}:${e.distractionSequence}:${n}`)%xh.length;r={...xh[o]},n==="temptation"&&(r.text+=" Die Anlage wiederholt ein Muster, auf das du schon reagiert hast."),n==="precision"&&(r.title=`Vermeintliche Teamnotiz: ${r.title}`)}e.distractionSequence++,e.metrics.spawned++,e.lastDistractionAt=t;let a={id:`maze-${e.seed}-${e.distractionSequence}`,...r,level:s,adaptation:n,time:t,action:null};return e.pendingDistraction=a,e.distractions.push(a),e.distractions.length>100&&e.distractions.shift(),this._record("distraction",{id:a.id,deceptive:a.deceptive,level:s,adaptation:n}),this.save(),{ok:!0,distraction:gs(a)}}respondDistraction(e,t){let n=this.state,s=n.pendingDistraction;if(!this._live()||!s||s.id!==e||!["click","ignore"].includes(t))return je("Diese Unterbrechung ist nicht mehr aktiv.");s.action=t,n.metrics[t==="click"?"clicked":"ignored"]++;let r=!1;s.deceptive?(n.metrics[t==="click"?"deceptiveClicks":"deceptiveIgnored"]++,t==="click"&&n.deceptionShield>0?(n.deceptionShield--,r=!0):this._change(t==="click"?-8:3,t==="click"?9:-2)):(n.metrics[t==="click"?"usefulClicks":"usefulIgnored"]++,t==="click"&&this._change(s.category==="recovery"?8:3,s.category==="recovery"?-10:-2)),n.pendingDistraction=null;let a=s.deceptive?t==="ignore"?"Du hast eine T\xE4uschung erkannt und deine Aufgabe behalten.":r?"Der Schild hat den Impuls abgefangen. Der Inhalt war trotzdem eine T\xE4uschung.":"Die Meldung versprach Fortschritt, lenkte aber von deinem Auftrag ab.":"Diese Meldung bezog sich auf deinen echten Auftrag.";return this._record("distraction-response",{id:e,action:t,deceptive:s.deceptive,protected:r}),this.save(),{ok:!0,deceptive:s.deceptive,protected:r,feedback:a,level:this.distractionLevel()}}finish(e=this.state.exitRoute){let t=this.state;return!this._live()||t.roomIndex!==5||!t.roomSolved||e!==t.exitRoute||!["balanced","quiet"].includes(e)?je("L\xF6se zuerst das Ausgangsterminal und erreiche dann die passende T\xFCr."):(t.ended=!0,t.ending=e,t.finishedAt=this._time(),t.pendingDistraction=null,t.score=Math.max(0,Math.round(t.score+t.focus-t.stress+t.metrics.deceptiveIgnored*5-t.metrics.mistakes*10-t.metrics.hazards*5)),this._record("escaped",{route:e,score:t.score}),this.save(),{ok:!0,ended:!0,ending:e,score:t.score})}exportData(){return gs({game:"MIND MAZE \u2013 Escape the Distraction",version:"1.0.0",schemaVersion:1,state:this.state})}};var Zh=0,ac=1,Jh=2;var as=1,Kh=2,er=3,Oi=0,fn=1,In=2,ei=0,tr=1,oc=2,lc=3,cc=4,jh=5;var os=100,Qh=101,eu=102,tu=103,nu=104,iu=200,su=201,ru=202,au=203,hc=204,uc=205,ou=206,lu=207,cu=208,hu=209,uu=210,du=211,fu=212,pu=213,mu=214,Va=0,Ga=1,Ha=2,Os=3,Wa=4,Xa=5,qa=6,Ya=7,dc=0,gu=1,_u=2,Vn=0,fc=1,pc=2,mc=3,Jr=4,gc=5,_c=6,xc=7;var vc=300,Bi=301,ls=302,vo=303,yo=304,Kr=306,$a=1e3,$n=1001,Za=1002,Xt=1003,xu=1004;var jr=1005;var Kt=1006,So=1007;var zi=1008;var xn=1009,yc=1010,Sc=1011,nr=1012,Mo=1013,Gn=1014,Pn=1015,Hn=1016,bo=1017,Eo=1018,ir=1020,Mc=35902,bc=35899,Ec=1021,Tc=1022,Ln=1023,Zn=1026,ki=1027,To=1028,Ao=1029,Vi=1030,wo=1031;var Ro=1033,Qr=33776,ea=33777,ta=33778,na=33779,Co=35840,Io=35841,Po=35842,Lo=35843,Do=36196,No=37492,Uo=37496,Fo=37488,Oo=37489,ia=37490,Bo=37491,zo=37808,ko=37809,Vo=37810,Go=37811,Ho=37812,Wo=37813,Xo=37814,qo=37815,Yo=37816,$o=37817,Zo=37818,Jo=37819,Ko=37820,jo=37821,Qo=36492,el=36494,tl=36495,nl=36283,il=36284,sa=36285,sl=36286;var Er=2300,Ja=2301,za=2302,Jl=2303,Kl=2400,jl=2401,Ql=2402;var vu=3200;var rl=0,yu=1,vi="",rn="srgb",Tr="srgb-linear",Ar="linear",gt="srgb";var ka=7680;var Su=519,Mu=512,bu=513,Eu=514,al=515,Tu=516,Au=517,ol=518,wu=519,Ac=35044;var wc="300 es",kn=2e3,Bs=2001;function Td(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ad(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function wr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ru(){let i=wr("canvas");return i.style.display="block",i}var vh={},zs=null;function Rr(...i){let e="THREE."+i.shift();zs?zs("log",e,...i):console.log(e,...i)}function Cu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ze(...i){i=Cu(i);let e="THREE."+i.shift();if(zs)zs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=Cu(i);let e="THREE."+i.shift();if(zs)zs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function is(...i){let e=i.join(" ");e in vh||(vh[e]=!0,ze(...i))}function Iu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Pu={[Va]:Ga,[Ha]:qa,[Wa]:Ya,[Os]:Xa,[Ga]:Va,[qa]:Ha,[Ya]:Wa,[Xa]:Os},Jn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yh=1234567,Mr=Math.PI/180,ks=180/Math.PI;function pi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]+"-"+nn[e&255]+nn[e>>8&255]+"-"+nn[e>>16&15|64]+nn[e>>24&255]+"-"+nn[t&63|128]+nn[t>>8&255]+"-"+nn[t>>16&255]+nn[t>>24&255]+nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]).toLowerCase()}function at(i,e,t){return Math.max(e,Math.min(t,i))}function Rc(i,e){return(i%e+e)%e}function wd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Rd(i,e,t){return i!==e?(t-i)/(e-i):0}function br(i,e,t){return(1-t)*i+t*e}function Cd(i,e,t,n){return br(i,e,1-Math.exp(-t*n))}function Id(i,e=1){return e-Math.abs(Rc(i,e*2)-e)}function Pd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ld(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Dd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Nd(i,e){return i+Math.random()*(e-i)}function Ud(i){return i*(.5-Math.random())}function Fd(i){i!==void 0&&(yh=i);let e=yh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Od(i){return i*Mr}function Bd(i){return i*ks}function zd(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function kd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gd(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),p=r((e-n)/2),h=a((e-n)/2),g=r((n-e)/2),_=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*p,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*p,o*c);break;case"ZXZ":i.set(l*p,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*_,l*g,o*c);break;case"YXY":i.set(l*g,o*u,l*_,o*c);break;case"ZYZ":i.set(l*_,l*g,o*u,o*c);break;default:ze("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function zn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var En={DEG2RAD:Mr,RAD2DEG:ks,generateUUID:pi,clamp:at,euclideanModulo:Rc,mapLinear:wd,inverseLerp:Rd,lerp:br,damp:Cd,pingpong:Id,smoothstep:Pd,smootherstep:Ld,randInt:Dd,randFloat:Nd,randFloatSpread:Ud,seededRandom:Fd,degToRad:Od,radToDeg:Bd,isPowerOfTwo:zd,ceilPowerOfTwo:kd,floorPowerOfTwo:Vd,setQuaternionFromProperEuler:Gd,normalize:xt,denormalize:zn},Dc=class Dc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(at(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Dc.prototype.isVector2=!0;var $e=Dc,Kn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],p=n[s+3],h=r[a+0],g=r[a+1],_=r[a+2],S=r[a+3];if(p!==S||l!==h||c!==g||u!==_){let m=l*h+c*g+u*_+p*S;m<0&&(h=-h,g=-g,_=-_,S=-S,m=-m);let d=1-o;if(m<.9995){let A=Math.acos(m),D=Math.sin(A);d=Math.sin(d*A)/D,o=Math.sin(o*A)/D,l=l*d+h*o,c=c*d+g*o,u=u*d+_*o,p=p*d+S*o}else{l=l*d+h*o,c=c*d+g*o,u=u*d+_*o,p=p*d+S*o;let A=1/Math.sqrt(l*l+c*c+u*u+p*p);l*=A,c*=A,u*=A,p*=A}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],p=r[a],h=r[a+1],g=r[a+2],_=r[a+3];return e[t]=o*_+u*p+l*g-c*h,e[t+1]=l*_+u*h+c*p-o*g,e[t+2]=c*_+u*g+o*h-l*p,e[t+3]=u*_-o*p-l*h-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),p=o(r/2),h=l(n/2),g=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=h*u*p+c*g*_,this._y=c*g*p-h*u*_,this._z=c*u*_+h*g*p,this._w=c*u*p-h*g*_;break;case"YXZ":this._x=h*u*p+c*g*_,this._y=c*g*p-h*u*_,this._z=c*u*_-h*g*p,this._w=c*u*p+h*g*_;break;case"ZXY":this._x=h*u*p-c*g*_,this._y=c*g*p+h*u*_,this._z=c*u*_+h*g*p,this._w=c*u*p-h*g*_;break;case"ZYX":this._x=h*u*p-c*g*_,this._y=c*g*p+h*u*_,this._z=c*u*_-h*g*p,this._w=c*u*p+h*g*_;break;case"YZX":this._x=h*u*p+c*g*_,this._y=c*g*p+h*u*_,this._z=c*u*_-h*g*p,this._w=c*u*p-h*g*_;break;case"XZY":this._x=h*u*p-c*g*_,this._y=c*g*p-h*u*_,this._z=c*u*_+h*g*p,this._w=c*u*p+h*g*_;break;default:ze("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],p=t[10],h=n+o+p;if(h>0){let g=.5/Math.sqrt(h+1);this._w=.25/g,this._x=(u-l)*g,this._y=(r-c)*g,this._z=(a-s)*g}else if(n>o&&n>p){let g=2*Math.sqrt(1+n-o-p);this._w=(u-l)/g,this._x=.25*g,this._y=(s+a)/g,this._z=(r+c)/g}else if(o>p){let g=2*Math.sqrt(1+o-n-p);this._w=(r-c)/g,this._x=(s+a)/g,this._y=.25*g,this._z=(l+u)/g}else{let g=2*Math.sqrt(1+p-n-o);this._w=(a-s)/g,this._x=(r+c)/g,this._y=(l+u)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Nc=class Nc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),p=2*(r*n-a*t);return this.x=t+l*c+a*p-o*u,this.y=n+l*u+o*c-r*p,this.z=s+l*p+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Rl.copy(this).projectOnVector(e),this.sub(Rl)}reflect(e){return this.sub(Rl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(at(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Nc.prototype.isVector3=!0;var k=Nc,Rl=new k,Sh=new Kn,Uc=class Uc{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],p=n[7],h=n[2],g=n[5],_=n[8],S=s[0],m=s[3],d=s[6],A=s[1],D=s[4],y=s[7],E=s[2],T=s[5],I=s[8];return r[0]=a*S+o*A+l*E,r[3]=a*m+o*D+l*T,r[6]=a*d+o*y+l*I,r[1]=c*S+u*A+p*E,r[4]=c*m+u*D+p*T,r[7]=c*d+u*y+p*I,r[2]=h*S+g*A+_*E,r[5]=h*m+g*D+_*T,r[8]=h*d+g*y+_*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],p=u*a-o*c,h=o*l-u*r,g=c*r-a*l,_=t*p+n*h+s*g;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/_;return e[0]=p*S,e[1]=(s*c-u*n)*S,e[2]=(o*n-s*a)*S,e[3]=h*S,e[4]=(u*t-s*l)*S,e[5]=(s*r-o*t)*S,e[6]=g*S,e[7]=(n*l-c*t)*S,e[8]=(a*t-n*r)*S,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return is("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Cl.makeScale(e,t)),this}rotate(e){return is("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Cl.makeRotation(-e)),this}translate(e,t){return is("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Cl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Uc.prototype.isMatrix3=!0;var Ze=Uc,Cl=new Ze,Mh=new Ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bh=new Ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hd(){let i={enabled:!0,workingColorSpace:Tr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===gt&&(s.r=mi(s.r),s.g=mi(s.g),s.b=mi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===gt&&(s.r=Fs(s.r),s.g=Fs(s.g),s.b=Fs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vi?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Tr]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:Mh,fromXYZ:bh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:rn},outputColorSpaceConfig:{drawingBufferColorSpace:rn}},[rn]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:Mh,fromXYZ:bh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:rn}}}),i}var rt=Hd();function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var xs,Ka=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{xs===void 0&&(xs=wr("canvas")),xs.width=e.width,xs.height=e.height;let s=xs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=xs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=wr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=mi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mi(t[n]/255)*255):t[n]=mi(t[n]);return{data:t,width:e.width,height:e.height}}else return ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Wd=0,Vs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=pi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Il(s[a].image)):r.push(Il(s[a]))}else r=Il(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Il(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ze("Texture: Unable to serialize Texture."),{})}var Xd=0,Pl=new k,dn=class i extends Jn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=$n,s=$n,r=Kt,a=zi,o=Ln,l=xn,c=i.DEFAULT_ANISOTROPY,u=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=pi(),this.name="",this.source=new Vs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Pl).x}get height(){return this.source.getSize(Pl).y}get depth(){return this.source.getSize(Pl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ze(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $a:e.x=e.x-Math.floor(e.x);break;case $n:e.x=e.x<0?0:1;break;case Za:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $a:e.y=e.y-Math.floor(e.y);break;case $n:e.y=e.y<0?0:1;break;case Za:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=vc;dn.DEFAULT_ANISOTROPY=1;var Fc=class Fc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],p=l[8],h=l[1],g=l[5],_=l[9],S=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(p-S)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(p+S)<.1&&Math.abs(_+m)<.1&&Math.abs(c+g+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let D=(c+1)/2,y=(g+1)/2,E=(d+1)/2,T=(u+h)/4,I=(p+S)/4,x=(_+m)/4;return D>y&&D>E?D<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(D),s=T/n,r=I/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=x/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=I/r,s=x/r),this.set(n,s,r,t),this}let A=Math.sqrt((m-_)*(m-_)+(p-S)*(p-S)+(h-u)*(h-u));return Math.abs(A)<.001&&(A=1),this.x=(m-_)/A,this.y=(p-S)/A,this.z=(h-u)/A,this.w=Math.acos((c+g+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this.w=at(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this.w=at(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Fc.prototype.isVector4=!0;var It=Fc,ja=class extends Jn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new dn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Vs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},_n=class extends ja{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Cr=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Qa=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var xo=class xo{constructor(e,t,n,s,r,a,o,l,c,u,p,h,g,_,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,p,h,g,_,S,m)}set(e,t,n,s,r,a,o,l,c,u,p,h,g,_,S,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=p,d[14]=h,d[3]=g,d[7]=_,d[11]=S,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xo().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/vs.setFromMatrixColumn(e,0).length(),r=1/vs.setFromMatrixColumn(e,1).length(),a=1/vs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){let h=a*u,g=a*p,_=o*u,S=o*p;t[0]=l*u,t[4]=-l*p,t[8]=c,t[1]=g+_*c,t[5]=h-S*c,t[9]=-o*l,t[2]=S-h*c,t[6]=_+g*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,g=l*p,_=c*u,S=c*p;t[0]=h+S*o,t[4]=_*o-g,t[8]=a*c,t[1]=a*p,t[5]=a*u,t[9]=-o,t[2]=g*o-_,t[6]=S+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,g=l*p,_=c*u,S=c*p;t[0]=h-S*o,t[4]=-a*p,t[8]=_+g*o,t[1]=g+_*o,t[5]=a*u,t[9]=S-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,g=a*p,_=o*u,S=o*p;t[0]=l*u,t[4]=_*c-g,t[8]=h*c+S,t[1]=l*p,t[5]=S*c+h,t[9]=g*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,g=a*c,_=o*l,S=o*c;t[0]=l*u,t[4]=S-h*p,t[8]=_*p+g,t[1]=p,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=g*p+_,t[10]=h-S*p}else if(e.order==="XZY"){let h=a*l,g=a*c,_=o*l,S=o*c;t[0]=l*u,t[4]=-p,t[8]=c*u,t[1]=h*p+S,t[5]=a*u,t[9]=g*p-_,t[2]=_*p-g,t[6]=o*u,t[10]=S*p+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qd,e,Yd)}lookAt(e,t,n){let s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Ai.crossVectors(n,yn),Ai.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Ai.crossVectors(n,yn)),Ai.normalize(),pa.crossVectors(yn,Ai),s[0]=Ai.x,s[4]=pa.x,s[8]=yn.x,s[1]=Ai.y,s[5]=pa.y,s[9]=yn.y,s[2]=Ai.z,s[6]=pa.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],p=n[5],h=n[9],g=n[13],_=n[2],S=n[6],m=n[10],d=n[14],A=n[3],D=n[7],y=n[11],E=n[15],T=s[0],I=s[4],x=s[8],b=s[12],C=s[1],R=s[5],F=s[9],z=s[13],P=s[2],X=s[6],te=s[10],Y=s[14],W=s[3],Z=s[7],re=s[11],ae=s[15];return r[0]=a*T+o*C+l*P+c*W,r[4]=a*I+o*R+l*X+c*Z,r[8]=a*x+o*F+l*te+c*re,r[12]=a*b+o*z+l*Y+c*ae,r[1]=u*T+p*C+h*P+g*W,r[5]=u*I+p*R+h*X+g*Z,r[9]=u*x+p*F+h*te+g*re,r[13]=u*b+p*z+h*Y+g*ae,r[2]=_*T+S*C+m*P+d*W,r[6]=_*I+S*R+m*X+d*Z,r[10]=_*x+S*F+m*te+d*re,r[14]=_*b+S*z+m*Y+d*ae,r[3]=A*T+D*C+y*P+E*W,r[7]=A*I+D*R+y*X+E*Z,r[11]=A*x+D*F+y*te+E*re,r[15]=A*b+D*z+y*Y+E*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],p=e[6],h=e[10],g=e[14],_=e[3],S=e[7],m=e[11],d=e[15],A=l*g-c*h,D=o*g-c*p,y=o*h-l*p,E=a*g-c*u,T=a*h-l*u,I=a*p-o*u;return t*(S*A-m*D+d*y)-n*(_*A-m*E+d*T)+s*(_*D-S*E+d*I)-r*(_*y-S*T+m*I)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],p=e[9],h=e[10],g=e[11],_=e[12],S=e[13],m=e[14],d=e[15],A=t*o-n*a,D=t*l-s*a,y=t*c-r*a,E=n*l-s*o,T=n*c-r*o,I=s*c-r*l,x=u*S-p*_,b=u*m-h*_,C=u*d-g*_,R=p*m-h*S,F=p*d-g*S,z=h*d-g*m,P=A*z-D*F+y*R+E*C-T*b+I*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let X=1/P;return e[0]=(o*z-l*F+c*R)*X,e[1]=(s*F-n*z-r*R)*X,e[2]=(S*I-m*T+d*E)*X,e[3]=(h*T-p*I-g*E)*X,e[4]=(l*C-a*z-c*b)*X,e[5]=(t*z-s*C+r*b)*X,e[6]=(m*y-_*I-d*D)*X,e[7]=(u*I-h*y+g*D)*X,e[8]=(a*F-o*C+c*x)*X,e[9]=(n*C-t*F-r*x)*X,e[10]=(_*T-S*y+d*A)*X,e[11]=(p*y-u*T-g*A)*X,e[12]=(o*b-a*R-l*x)*X,e[13]=(t*R-n*b+s*x)*X,e[14]=(S*D-_*E-m*A)*X,e[15]=(u*E-p*D+h*A)*X,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,p=o+o,h=r*c,g=r*u,_=r*p,S=a*u,m=a*p,d=o*p,A=l*c,D=l*u,y=l*p,E=n.x,T=n.y,I=n.z;return s[0]=(1-(S+d))*E,s[1]=(g+y)*E,s[2]=(_-D)*E,s[3]=0,s[4]=(g-y)*T,s[5]=(1-(h+d))*T,s[6]=(m+A)*T,s[7]=0,s[8]=(_+D)*I,s[9]=(m-A)*I,s[10]=(1-(h+S))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=vs.set(s[0],s[1],s[2]).length(),o=vs.set(s[4],s[5],s[6]).length(),l=vs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Un.copy(this);let c=1/a,u=1/o,p=1/l;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=u,Un.elements[5]*=u,Un.elements[6]*=u,Un.elements[8]*=p,Un.elements[9]*=p,Un.elements[10]*=p,t.setFromRotationMatrix(Un),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=kn,l=!1){let c=this.elements,u=2*r/(t-e),p=2*r/(n-s),h=(t+e)/(t-e),g=(n+s)/(n-s),_,S;if(l)_=r/(a-r),S=a*r/(a-r);else if(o===kn)_=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Bs)_=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=p,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=kn,l=!1){let c=this.elements,u=2/(t-e),p=2/(n-s),h=-(t+e)/(t-e),g=-(n+s)/(n-s),_,S;if(l)_=1/(a-r),S=a/(a-r);else if(o===kn)_=-2/(a-r),S=-(a+r)/(a-r);else if(o===Bs)_=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=p,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};xo.prototype.isMatrix4=!0;var mt=xo,vs=new k,Un=new mt,qd=new k(0,0,0),Yd=new k(1,1,1),Ai=new k,pa=new k,yn=new k,Eh=new mt,Th=new Kn,gi=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],p=s[2],h=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(at(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,g),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-at(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(at(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-at(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,g),this._y=0);break;default:ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Eh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Eh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Th.setFromEuler(this),this.setFromQuaternion(Th,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};gi.DEFAULT_ORDER="XYZ";var Gs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},$d=0,Ah=new k,ys=new Kn,li=new mt,ma=new k,fr=new k,Zd=new k,Jd=new Kn,wh=new k(1,0,0),Rh=new k(0,1,0),Ch=new k(0,0,1),Ih={type:"added"},Kd={type:"removed"},Ss={type:"childadded",child:null},Ll={type:"childremoved",child:null},qt=class i extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new k,t=new gi,n=new Kn,s=new k(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new Ze}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ys.setFromAxisAngle(e,t),this.quaternion.multiply(ys),this}rotateOnWorldAxis(e,t){return ys.setFromAxisAngle(e,t),this.quaternion.premultiply(ys),this}rotateX(e){return this.rotateOnAxis(wh,e)}rotateY(e){return this.rotateOnAxis(Rh,e)}rotateZ(e){return this.rotateOnAxis(Ch,e)}translateOnAxis(e,t){return Ah.copy(e).applyQuaternion(this.quaternion),this.position.add(Ah.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wh,e)}translateY(e){return this.translateOnAxis(Rh,e)}translateZ(e){return this.translateOnAxis(Ch,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ma.copy(e):ma.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(fr,ma,this.up):li.lookAt(ma,fr,this.up),this.quaternion.setFromRotationMatrix(li),s&&(li.extractRotation(s.matrixWorld),ys.setFromRotationMatrix(li),this.quaternion.premultiply(ys.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ih),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Kd),Ll.child=e,this.dispatchEvent(Ll),Ll.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ih),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,e,Zd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,Jd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let p=l[c];r(e.shapes,p)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),p=a(e.shapes),h=a(e.skeletons),g=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),p.length>0&&(n.shapes=p),h.length>0&&(n.skeletons=h),g.length>0&&(n.animations=g),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};qt.DEFAULT_UP=new k(0,1,0);qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Jt=class extends qt{constructor(){super(),this.isGroup=!0,this.type="Group"}},jd={type:"move"},Hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let S of e.hand.values()){let m=t.getJointPose(S,n),d=this._getHandJoint(c,S);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let u=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=u.position.distanceTo(p.position),g=.02,_=.005;c.inputState.pinching&&h>g+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=g-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Jt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Lu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wi={h:0,s:0,l:0},ga={h:0,s:0,l:0};function Dl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=rn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=Rc(e,1),t=at(t,0,1),n=at(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Dl(a,r,e+1/3),this.g=Dl(a,r,e),this.b=Dl(a,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=rn){function n(r){r!==void 0&&parseFloat(r)<1&&ze("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ze("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=rn){let n=Lu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Fs(e.r),this.g=Fs(e.g),this.b=Fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=rn){return rt.workingToColorSpace(sn.copy(this),e),Math.round(at(sn.r*255,0,255))*65536+Math.round(at(sn.g*255,0,255))*256+Math.round(at(sn.b*255,0,255))}getHexString(e=rn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(sn.copy(this),t);let n=sn.r,s=sn.g,r=sn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let p=a-o;switch(c=u<=.5?p/(a+o):p/(2-a-o),a){case n:l=(s-r)/p+(s<r?6:0);break;case s:l=(r-n)/p+2;break;case r:l=(n-s)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=rn){rt.workingToColorSpace(sn.copy(this),e);let t=sn.r,n=sn.g,s=sn.b;return e!==rn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(wi),this.setHSL(wi.h+e,wi.s+t,wi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wi),e.getHSL(ga);let n=br(wi.h,ga.h,t),s=br(wi.s,ga.s,t),r=br(wi.l,ga.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},sn=new Qe;Qe.NAMES=Lu;var Ir=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Qe(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Pr=class extends qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gi,this.environmentIntensity=1,this.environmentRotation=new gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Fn=new k,ci=new k,Nl=new k,hi=new k,Ms=new k,bs=new k,Ph=new k,Ul=new k,Fl=new k,Ol=new k,Bl=new It,zl=new It,kl=new It,fi=class i{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Fn.subVectors(e,t),s.cross(Fn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Fn.subVectors(s,t),ci.subVectors(n,t),Nl.subVectors(e,t);let a=Fn.dot(Fn),o=Fn.dot(ci),l=Fn.dot(Nl),c=ci.dot(ci),u=ci.dot(Nl),p=a*c-o*o;if(p===0)return r.set(0,0,0),null;let h=1/p,g=(c*l-o*u)*h,_=(a*u-o*l)*h;return r.set(1-g-_,_,g)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hi.x),l.addScaledVector(a,hi.y),l.addScaledVector(o,hi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Bl.setScalar(0),zl.setScalar(0),kl.setScalar(0),Bl.fromBufferAttribute(e,t),zl.fromBufferAttribute(e,n),kl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Bl,r.x),a.addScaledVector(zl,r.y),a.addScaledVector(kl,r.z),a}static isFrontFacing(e,t,n,s){return Fn.subVectors(n,t),ci.subVectors(e,t),Fn.cross(ci).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Fn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ms.subVectors(s,n),bs.subVectors(r,n),Ul.subVectors(e,n);let l=Ms.dot(Ul),c=bs.dot(Ul);if(l<=0&&c<=0)return t.copy(n);Fl.subVectors(e,s);let u=Ms.dot(Fl),p=bs.dot(Fl);if(u>=0&&p<=u)return t.copy(s);let h=l*p-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ms,a);Ol.subVectors(e,r);let g=Ms.dot(Ol),_=bs.dot(Ol);if(_>=0&&g<=_)return t.copy(r);let S=g*c-l*_;if(S<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(bs,o);let m=u*_-g*p;if(m<=0&&p-u>=0&&g-_>=0)return Ph.subVectors(r,s),o=(p-u)/(p-u+(g-_)),t.copy(s).addScaledVector(Ph,o);let d=1/(m+S+h);return a=S*d,o=h*d,t.copy(n).addScaledVector(Ms,a).addScaledVector(bs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},jn=class{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_a.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_a.copy(n.boundingBox)),_a.applyMatrix4(e.matrixWorld),this.union(_a)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(pr),xa.subVectors(this.max,pr),Es.subVectors(e.a,pr),Ts.subVectors(e.b,pr),As.subVectors(e.c,pr),Ri.subVectors(Ts,Es),Ci.subVectors(As,Ts),Qi.subVectors(Es,As);let t=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-Qi.z,Qi.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,Qi.z,0,-Qi.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-Qi.y,Qi.x,0];return!Vl(t,Es,Ts,As,xa)||(t=[1,0,0,0,1,0,0,0,1],!Vl(t,Es,Ts,As,xa))?!1:(va.crossVectors(Ri,Ci),t=[va.x,va.y,va.z],Vl(t,Es,Ts,As,xa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ui=[new k,new k,new k,new k,new k,new k,new k,new k],On=new k,_a=new jn,Es=new k,Ts=new k,As=new k,Ri=new k,Ci=new k,Qi=new k,pr=new k,xa=new k,va=new k,es=new k;function Vl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){es.fromArray(i,r);let o=s.x*Math.abs(es.x)+s.y*Math.abs(es.y)+s.z*Math.abs(es.z),l=e.dot(es),c=t.dot(es),u=n.dot(es);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Ft=new k,ya=new $e,Qd=0,an=class extends Jn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ac,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ya.fromBufferAttribute(this,t),ya.applyMatrix3(e),this.setXY(t,ya.x,ya.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Lr=class extends an{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Dr=class extends an{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ct=class extends an{constructor(e,t,n){super(new Float32Array(e),t,n)}},ef=new jn,mr=new k,Gl=new k,_i=class{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):ef.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mr.subVectors(e,this.center);let t=mr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(mr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mr.copy(e.center).add(Gl)),this.expandByPoint(mr.copy(e.center).sub(Gl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},tf=0,Cn=new mt,Hl=new qt,ws=new k,Sn=new jn,gr=new jn,Wt=new k,Yt=class i extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Td(e)?Dr:Lr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return Hl.lookAt(e),Hl.updateMatrix(),this.applyMatrix4(Hl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ws).negate(),this.translate(ws.x,ws.y,ws.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ct(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _i);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){let n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(Wt.addVectors(Sn.min,gr.min),Sn.expandByPoint(Wt),Wt.addVectors(Sn.max,gr.max),Sn.expandByPoint(Wt)):(Sn.expandByPoint(gr.min),Sn.expandByPoint(gr.max))}Sn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Wt.fromBufferAttribute(o,c),l&&(ws.fromBufferAttribute(e,c),Wt.add(ws)),s=Math.max(s,n.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new an(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new k,l[x]=new k;let c=new k,u=new k,p=new k,h=new $e,g=new $e,_=new $e,S=new k,m=new k;function d(x,b,C){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,b),p.fromBufferAttribute(n,C),h.fromBufferAttribute(r,x),g.fromBufferAttribute(r,b),_.fromBufferAttribute(r,C),u.sub(c),p.sub(c),g.sub(h),_.sub(h);let R=1/(g.x*_.y-_.x*g.y);isFinite(R)&&(S.copy(u).multiplyScalar(_.y).addScaledVector(p,-g.y).multiplyScalar(R),m.copy(p).multiplyScalar(g.x).addScaledVector(u,-_.x).multiplyScalar(R),o[x].add(S),o[b].add(S),o[C].add(S),l[x].add(m),l[b].add(m),l[C].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let x=0,b=A.length;x<b;++x){let C=A[x],R=C.start,F=C.count;for(let z=R,P=R+F;z<P;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let D=new k,y=new k,E=new k,T=new k;function I(x){E.fromBufferAttribute(s,x),T.copy(E);let b=o[x];D.copy(b),D.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);let R=y.dot(l[x])<0?-1:1;a.setXYZW(x,D.x,D.y,D.z,R)}for(let x=0,b=A.length;x<b;++x){let C=A[x],R=C.start,F=C.count;for(let z=R,P=R+F;z<P;z+=3)I(e.getX(z+0)),I(e.getX(z+1)),I(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new an(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,g=n.count;h<g;h++)n.setXYZ(h,0,0,0);let s=new k,r=new k,a=new k,o=new k,l=new k,c=new k,u=new k,p=new k;if(e)for(let h=0,g=e.count;h<g;h+=3){let _=e.getX(h+0),S=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,m),u.subVectors(a,r),p.subVectors(s,r),u.cross(p),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,g=t.count;h<g;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),p.subVectors(s,r),u.cross(p),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,p=o.normalized,h=new c.constructor(l.length*u),g=0,_=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?g=l[S]*o.data.stride+o.offset:g=l[S]*u;for(let d=0;d<u;d++)h[_++]=c[g++]}return new an(h,u,p)}if(this.index===null)return ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,p=c.length;u<p;u++){let h=c[u],g=e(h,n);l.push(g)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let p=0,h=c.length;p<h;p++){let g=c[p];u.push(g.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],p=r[c];for(let h=0,g=p.length;h<g;h++)u.push(p[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},eo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ac,this.updateRanges=[],this.version=0,this.uuid=pi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},hn=new k,Nr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=zn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=zn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=zn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=zn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Rr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new an(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Rr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Wl=new k,nf=new k,sf=new Ze,Bn=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Wl.subVectors(n,t).cross(nf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Wl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||sf.getNormalMatrix(e),s=this.coplanarPoint(Wl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},rf=0,Qn=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=tr,this.side=Oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hc,this.blendDst=uc,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Su,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ka,this.stencilZFail=ka,this.stencilZPass=ka,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ze(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Bn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new $e().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new $e().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ws=class extends Qn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Rs,_r=new k,Cs=new k,Is=new k,Ps=new $e,xr=new $e,Du=new mt,Sa=new k,vr=new k,Ma=new k,Lh=new $e,Xl=new $e,Dh=new $e,Ur=class extends qt{constructor(e=new Ws){if(super(),this.isSprite=!0,this.type="Sprite",Rs===void 0){Rs=new Yt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new eo(t,5);Rs.setIndex([0,1,2,0,2,3]),Rs.setAttribute("position",new Nr(n,3,0,!1)),Rs.setAttribute("uv",new Nr(n,2,3,!1))}this.geometry=Rs,this.material=e,this.center=new $e(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Be('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Cs.setFromMatrixScale(this.matrixWorld),Du.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Cs.multiplyScalar(-Is.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;ba(Sa.set(-.5,-.5,0),Is,a,Cs,s,r),ba(vr.set(.5,-.5,0),Is,a,Cs,s,r),ba(Ma.set(.5,.5,0),Is,a,Cs,s,r),Lh.set(0,0),Xl.set(1,0),Dh.set(1,1);let o=e.ray.intersectTriangle(Sa,vr,Ma,!1,_r);if(o===null&&(ba(vr.set(-.5,.5,0),Is,a,Cs,s,r),Xl.set(0,1),o=e.ray.intersectTriangle(Sa,Ma,vr,!1,_r),o===null))return;let l=e.ray.origin.distanceTo(_r);l<e.near||l>e.far||t.push({distance:l,point:_r.clone(),uv:fi.getInterpolation(_r,Sa,vr,Ma,Lh,Xl,Dh,new $e),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ba(i,e,t,n,s,r){Ps.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(xr.x=r*Ps.x-s*Ps.y,xr.y=s*Ps.x+r*Ps.y):xr.copy(Ps),i.copy(e),i.x+=xr.x,i.y+=xr.y,i.applyMatrix4(Du)}var di=new k,ql=new k,Ea=new k,Ta=new k,Xs=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,t),di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ql.copy(e).add(t).multiplyScalar(.5),Ea.copy(t).sub(e).normalize(),Ta.copy(this.origin).sub(ql);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Ea),o=Ta.dot(this.direction),l=-Ta.dot(Ea),c=Ta.lengthSq(),u=Math.abs(1-a*a),p,h,g,_;if(u>0)if(p=a*l-o,h=a*o-l,_=r*u,p>=0)if(h>=-_)if(h<=_){let S=1/u;p*=S,h*=S,g=p*(p+a*h+2*o)+h*(a*p+h+2*l)+c}else h=r,p=Math.max(0,-(a*h+o)),g=-p*p+h*(h+2*l)+c;else h=-r,p=Math.max(0,-(a*h+o)),g=-p*p+h*(h+2*l)+c;else h<=-_?(p=Math.max(0,-(-a*r+o)),h=p>0?-r:Math.min(Math.max(-r,-l),r),g=-p*p+h*(h+2*l)+c):h<=_?(p=0,h=Math.min(Math.max(-r,-l),r),g=h*(h+2*l)+c):(p=Math.max(0,-(a*r+o)),h=p>0?r:Math.min(Math.max(-r,-l),r),g=-p*p+h*(h+2*l)+c);else h=a>0?-r:r,p=Math.max(0,-(a*h+o)),g=-p*p+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(ql).addScaledVector(Ea,h),g}intersectSphere(e,t){if(e.radius<0)return null;di.subVectors(e.center,this.origin);let n=di.dot(this.direction),s=di.dot(di)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),p>=0?(o=(e.min.z-h.z)*p,l=(e.max.z-h.z)*p):(o=(e.max.z-h.z)*p,l=(e.min.z-h.z)*p),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,p=e.x-a.x,h=e.y-a.y,g=e.z-a.z,_=t.x-a.x,S=t.y-a.y,m=t.z-a.z,d=n.x-a.x,A=n.y-a.y,D=n.z-a.z,y=Math.abs(l),E=Math.abs(c),T=Math.abs(u),I,x,b,C,R,F,z,P,X,te,Y,W;if(y>=E&&y>=T?(b=l,F=p,X=_,W=d,l>=0?(I=c,x=u,C=h,R=g,z=S,P=m,te=A,Y=D):(I=u,x=c,C=g,R=h,z=m,P=S,te=D,Y=A)):E>=T?(b=c,F=h,X=S,W=A,c>=0?(I=u,x=l,C=g,R=p,z=m,P=_,te=D,Y=d):(I=l,x=u,C=p,R=g,z=_,P=m,te=d,Y=D)):(b=u,F=g,X=m,W=D,u>=0?(I=l,x=c,C=p,R=h,z=_,P=S,te=d,Y=A):(I=c,x=l,C=h,R=p,z=S,P=_,te=A,Y=d)),b===0)return null;let Z=I/b,re=x/b,ae=1/b,Fe=C-Z*F,De=R-re*F,vt=z-Z*X,We=P-re*X,lt=te-Z*W,j=Y-re*W,se=lt*We-j*vt,be=Fe*j-De*lt,Ve=vt*De-We*Fe;if(s){if(se<0||be<0||Ve<0)return null}else if((se<0||be<0||Ve<0)&&(se>0||be>0||Ve>0))return null;let ve=se+be+Ve;if(ve===0)return null;let et=ae*(se*F+be*X+Ve*W);return(ve>0?et<0:et>0)?null:this.at(et/ve,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xi=class extends Qn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.combine=dc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Nh=new mt,ts=new Xs,Aa=new _i,Uh=new k,wa=new k,Ra=new k,Ca=new k,Yl=new k,Ia=new k,Fh=new k,Pa=new k,on=class extends qt{constructor(e=new Yt,t=new xi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Ia.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],p=r[l];u!==0&&(Yl.fromBufferAttribute(p,e),a?Ia.addScaledVector(Yl,u):Ia.addScaledVector(Yl.sub(t),u))}t.add(Ia)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Aa.copy(n.boundingSphere),Aa.applyMatrix4(r),ts.copy(e.ray).recast(e.near),!(Aa.containsPoint(ts.origin)===!1&&(ts.intersectSphere(Aa,Uh)===null||ts.origin.distanceToSquared(Uh)>(e.far-e.near)**2))&&(Nh.copy(r).invert(),ts.copy(e.ray).applyMatrix4(Nh),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ts)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,p=r.attributes.normal,h=r.groups,g=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,S=h.length;_<S;_++){let m=h[_],d=a[m.materialIndex],A=Math.max(m.start,g.start),D=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let y=A,E=D;y<E;y+=3){let T=o.getX(y),I=o.getX(y+1),x=o.getX(y+2);s=La(this,d,e,n,c,u,p,T,I,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,g.start),S=Math.min(o.count,g.start+g.count);for(let m=_,d=S;m<d;m+=3){let A=o.getX(m),D=o.getX(m+1),y=o.getX(m+2);s=La(this,a,e,n,c,u,p,A,D,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,S=h.length;_<S;_++){let m=h[_],d=a[m.materialIndex],A=Math.max(m.start,g.start),D=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let y=A,E=D;y<E;y+=3){let T=y,I=y+1,x=y+2;s=La(this,d,e,n,c,u,p,T,I,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,g.start),S=Math.min(l.count,g.start+g.count);for(let m=_,d=S;m<d;m+=3){let A=m,D=m+1,y=m+2;s=La(this,a,e,n,c,u,p,A,D,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function af(i,e,t,n,s,r,a,o){let l;if(e.side===fn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Oi,o),l===null)return null;Pa.copy(o),Pa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Pa);return c<t.near||c>t.far?null:{distance:c,point:Pa.clone(),object:i}}function La(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,wa),i.getVertexPosition(l,Ra),i.getVertexPosition(c,Ca);let u=af(i,e,t,n,wa,Ra,Ca,Fh);if(u){let p=new k;fi.getBarycoord(Fh,wa,Ra,Ca,p),s&&(u.uv=fi.getInterpolatedAttribute(s,o,l,c,p,new $e)),r&&(u.uv1=fi.getInterpolatedAttribute(r,o,l,c,p,new $e)),a&&(u.normal=fi.getInterpolatedAttribute(a,o,l,c,p,new k),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new k,materialIndex:0};fi.getNormal(wa,Ra,Ca,h.normal),u.face=h,u.barycoord=p}return u}var Fr=class extends dn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Xt,u=Xt,p,h){super(null,a,o,l,c,u,s,r,p,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Or=class extends an{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ls=new mt,Oh=new mt,Da=[],Bh=new jn,of=new mt,yr=new on,Sr=new _i,Br=class extends on{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Or(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,of)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Bh.copy(e.boundingBox).applyMatrix4(Ls),this.boundingBox.union(Bh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new _i),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Sr.copy(e.boundingSphere).applyMatrix4(Ls),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ls),Oh.multiplyMatrices(n,Ls),yr.matrixWorld=Oh,yr.raycast(e,Da);for(let a=0,o=Da.length;a<o;a++){let l=Da[a];l.instanceId=r,l.object=this,t.push(l)}Da.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Or(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fr(new Float32Array(s*this.count),s,this.count,To,Pn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ns=new _i,lf=new $e(.5,.5),Na=new k,qs=class{constructor(e=new Bn,t=new Bn,n=new Bn,s=new Bn,r=new Bn,a=new Bn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=kn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],p=r[5],h=r[6],g=r[7],_=r[8],S=r[9],m=r[10],d=r[11],A=r[12],D=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,g-u,d-_,E-A).normalize(),s[1].setComponents(c+a,g+u,d+_,E+A).normalize(),s[2].setComponents(c+o,g+p,d+S,E+D).normalize(),s[3].setComponents(c-o,g-p,d-S,E-D).normalize(),n)s[4].setComponents(l,h,m,y).normalize(),s[5].setComponents(c-l,g-h,d-m,E-y).normalize();else if(s[4].setComponents(c-l,g-h,d-m,E-y).normalize(),t===kn)s[5].setComponents(c+l,g+h,d+m,E+y).normalize();else if(t===Bs)s[5].setComponents(l,h,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ns.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ns.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ns)}intersectsSprite(e){ns.center.set(0,0,0);let t=lf.distanceTo(e.center);return ns.radius=.7071067811865476+t,ns.applyMatrix4(e.matrixWorld),this.intersectsSphere(ns)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Na.x=s.normal.x>0?e.max.x:e.min.x,Na.y=s.normal.y>0?e.max.y:e.min.y,Na.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Na)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ys=class extends Qn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Qe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},zh=new mt,ec=new Xs,Ua=new _i,Fa=new k,zr=class extends qt{constructor(e=new Yt,t=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(s),Ua.radius+=r,e.ray.intersectsSphere(Ua)===!1)return;zh.copy(s).invert(),ec.copy(e.ray).applyMatrix4(zh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,p=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),g=Math.min(c.count,a.start+a.count);for(let _=h,S=g;_<S;_++){let m=c.getX(_);Fa.fromBufferAttribute(p,m),kh(Fa,m,l,s,e,t,this)}}else{let h=Math.max(0,a.start),g=Math.min(p.count,a.start+a.count);for(let _=h,S=g;_<S;_++)Fa.fromBufferAttribute(p,_),kh(Fa,_,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function kh(i,e,t,n,s,r,a){let o=ec.distanceSqToPoint(i);if(o<t){let l=new k;ec.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var kr=class extends dn{constructor(e=[],t=Bi,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$s=class extends dn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Pi=class extends dn{constructor(e,t,n=Gn,s,r,a,o=Xt,l=Xt,c,u=Zn,p=1){if(u!==Zn&&u!==ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:p};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},to=class extends Pi{constructor(e,t=Gn,n=Bi,s,r,a=Xt,o=Xt,l,c=Zn){let u={width:e,height:e,depth:1},p=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Vr=class extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Li=class i extends Yt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],p=[],h=0,g=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,s,a,2),_("x","z","y",1,-1,e,n,-t,s,a,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ct(c,3)),this.setAttribute("normal",new Ct(u,3)),this.setAttribute("uv",new Ct(p,2));function _(S,m,d,A,D,y,E,T,I,x,b){let C=y/I,R=E/x,F=y/2,z=E/2,P=T/2,X=I+1,te=x+1,Y=0,W=0,Z=new k;for(let re=0;re<te;re++){let ae=re*R-z;for(let Fe=0;Fe<X;Fe++){let De=Fe*C-F;Z[S]=De*A,Z[m]=ae*D,Z[d]=P,c.push(Z.x,Z.y,Z.z),Z[S]=0,Z[m]=0,Z[d]=T>0?1:-1,u.push(Z.x,Z.y,Z.z),p.push(Fe/I),p.push(1-re/x),Y+=1}}for(let re=0;re<x;re++)for(let ae=0;ae<I;ae++){let Fe=h+ae+X*re,De=h+ae+X*(re+1),vt=h+(ae+1)+X*(re+1),We=h+(ae+1)+X*re;l.push(Fe,De,We),l.push(De,vt,We),W+=6}o.addGroup(g,W,b),g+=W,h+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Gr=class i extends Yt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],u=t/2,p=Math.PI/2*e,h=t,g=2*p+h,_=n*2+r,S=s+1,m=new k,d=new k;for(let A=0;A<=_;A++){let D=0,y=0,E=0,T=0;if(A<=n){let b=A/n,C=b*Math.PI/2;y=-u-e*Math.cos(C),E=e*Math.sin(C),T=-e*Math.cos(C),D=b*p}else if(A<=n+r){let b=(A-n)/r;y=-u+b*t,E=e,T=0,D=p+b*h}else{let b=(A-n-r)/n,C=b*Math.PI/2;y=u+e*Math.sin(C),E=e*Math.cos(C),T=e*Math.sin(C),D=p+h+b*p}let I=Math.max(0,Math.min(1,D/g)),x=0;A===0?x=.5/s:A===_&&(x=-.5/s);for(let b=0;b<=s;b++){let C=b/s,R=C*Math.PI*2,F=Math.sin(R),z=Math.cos(R);d.x=-E*z,d.y=y,d.z=E*F,o.push(d.x,d.y,d.z),m.set(-E*z,T,E*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(C+x,I)}if(A>0){let b=(A-1)*S;for(let C=0;C<s;C++){let R=b+C,F=b+C+1,z=A*S+C,P=A*S+C+1;a.push(R,F,z),a.push(F,P,z)}}}this.setIndex(a),this.setAttribute("position",new Ct(o,3)),this.setAttribute("normal",new Ct(l,3)),this.setAttribute("uv",new Ct(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var Zs=class i extends Yt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],p=[],h=[],g=[],_=0,S=[],m=n/2,d=0;A(),a===!1&&(e>0&&D(!0),t>0&&D(!1)),this.setIndex(u),this.setAttribute("position",new Ct(p,3)),this.setAttribute("normal",new Ct(h,3)),this.setAttribute("uv",new Ct(g,2));function A(){let y=new k,E=new k,T=0,I=(t-e)/n;for(let x=0;x<=r;x++){let b=[],C=x/r,R=C*(t-e)+e;for(let F=0;F<=s;F++){let z=F/s,P=z*l+o,X=Math.sin(P),te=Math.cos(P);E.x=R*X,E.y=-C*n+m,E.z=R*te,p.push(E.x,E.y,E.z),y.set(X,I,te).normalize(),h.push(y.x,y.y,y.z),g.push(z,1-C),b.push(_++)}S.push(b)}for(let x=0;x<s;x++)for(let b=0;b<r;b++){let C=S[b][x],R=S[b+1][x],F=S[b+1][x+1],z=S[b][x+1];(e>0||b!==0)&&(u.push(C,R,z),T+=3),(t>0||b!==r-1)&&(u.push(R,F,z),T+=3)}c.addGroup(d,T,0),d+=T}function D(y){let E=_,T=new $e,I=new k,x=0,b=y===!0?e:t,C=y===!0?1:-1;for(let F=1;F<=s;F++)p.push(0,m*C,0),h.push(0,C,0),g.push(.5,.5),_++;let R=_;for(let F=0;F<=s;F++){let P=F/s*l+o,X=Math.cos(P),te=Math.sin(P);I.x=b*te,I.y=m*C,I.z=b*X,p.push(I.x,I.y,I.z),h.push(0,C,0),T.x=X*.5+.5,T.y=te*.5*C+.5,g.push(T.x,T.y),_++}for(let F=0;F<s;F++){let z=E+F,P=R+F;y===!0?u.push(P,P+1,z):u.push(P+1,P,z),x+=3}c.addGroup(d,x,y===!0?1:2),d+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hr=class i extends Zs{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ss=class i extends Yt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,p=e/o,h=t/l,g=[],_=[],S=[],m=[];for(let d=0;d<u;d++){let A=d*h-a;for(let D=0;D<c;D++){let y=D*p-r;_.push(y,-A,0),S.push(0,0,1),m.push(D/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let A=0;A<o;A++){let D=A+c*d,y=A+c*(d+1),E=A+1+c*(d+1),T=A+1+c*d;g.push(D,y,T),g.push(y,E,T)}this.setIndex(g),this.setAttribute("position",new Ct(_,3)),this.setAttribute("normal",new Ct(S,3)),this.setAttribute("uv",new Ct(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Js=class i extends Yt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],p=new k,h=new k,g=[],_=[],S=[],m=[];for(let d=0;d<=n;d++){let A=[],D=d/n,y=a+D*o,E=e*Math.cos(y),T=Math.sqrt(e*e-E*E),I=0;d===0&&a===0?I=.5/t:d===n&&l===Math.PI&&(I=-.5/t);for(let x=0;x<=t;x++){let b=x/t,C=s+b*r;p.x=-T*Math.cos(C),p.y=E,p.z=T*Math.sin(C),_.push(p.x,p.y,p.z),h.copy(p).normalize(),S.push(h.x,h.y,h.z),m.push(b+I,1-D),A.push(c++)}u.push(A)}for(let d=0;d<n;d++)for(let A=0;A<t;A++){let D=u[d][A+1],y=u[d][A],E=u[d+1][A],T=u[d+1][A+1];(d!==0||a>0)&&g.push(D,y,T),(d!==n-1||l<Math.PI)&&g.push(y,E,T)}this.setIndex(g),this.setAttribute("position",new Ct(_,3)),this.setAttribute("normal",new Ct(S,3)),this.setAttribute("uv",new Ct(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Wr=class i extends Yt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],p=[],h=new k,g=new k,_=new k;for(let S=0;S<=n;S++){let m=a+S/n*o;for(let d=0;d<=s;d++){let A=d/s*r;g.x=(e+t*Math.cos(m))*Math.cos(A),g.y=(e+t*Math.cos(m))*Math.sin(A),g.z=t*Math.sin(m),c.push(g.x,g.y,g.z),h.x=e*Math.cos(A),h.y=e*Math.sin(A),_.subVectors(g,h).normalize(),u.push(_.x,_.y,_.z),p.push(d/s),p.push(S/n)}}for(let S=1;S<=n;S++)for(let m=1;m<=s;m++){let d=(s+1)*S+m-1,A=(s+1)*(S-1)+m-1,D=(s+1)*(S-1)+m,y=(s+1)*S+m;l.push(d,A,y),l.push(A,D,y)}this.setIndex(l),this.setAttribute("position",new Ct(c,3)),this.setAttribute("normal",new Ct(u,3)),this.setAttribute("uv",new Ct(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function cs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Vh(s))s.isRenderTargetTexture?(ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Vh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function ln(i){let e={};for(let t=0;t<i.length;t++){let n=cs(i[t]);for(let s in n)e[s]=n[s]}return e}function Vh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function cf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Cc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var Nu={clone:cs,merge:ln},hf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends Qn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hf,this.fragmentShader=uf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cs(e.uniforms),this.uniformsGroups=cf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Qe().setHex(s.value);break;case"v2":this.uniforms[n].value=new $e().fromArray(s.value);break;case"v3":this.uniforms[n].value=new k().fromArray(s.value);break;case"v4":this.uniforms[n].value=new It().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ze().fromArray(s.value);break;case"m4":this.uniforms[n].value=new mt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},no=class extends Mn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},rs=class extends Qn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rl,this.normalScale=new $e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var io=class extends Qn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},so=class extends Qn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ds(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function $l(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Di=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ro=class extends Di{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Kl,endingEnd:Kl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case jl:r=e,o=2*t-n;break;case Ql:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case jl:a=e,l=2*n-t;break;case Ql:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,p=this._offsetNext,h=this._weightPrev,g=this._weightNext,_=(n-t)/(s-t),S=_*_,m=S*_,d=-h*m+2*h*S-h*_,A=(1+h)*m+(-1.5-2*h)*S+(-.5+h)*_+1,D=(-1-g)*m+(1.5+g)*S+.5*_,y=g*m-g*S;for(let E=0;E!==o;++E)r[E]=d*a[u+E]+A*a[c+E]+D*a[l+E]+y*a[p+E];return r}},ao=class extends Di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),p=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*p+a[l+h]*u;return r}},oo=class extends Di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},lo=class extends Di{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,p=this.outTangents;if(!u||!p){let _=(n-t)/(s-t),S=1-_;for(let m=0;m!==o;++m)r[m]=a[c+m]*S+a[l+m]*_;return r}let h=o*2,g=e-1;for(let _=0;_!==o;++_){let S=a[c+_],m=a[l+_],d=g*h+_*2,A=p[d],D=p[d+1],y=e*h+_*2,E=u[y],T=u[y+1],I=ff(n,t,A,E,s);r[_]=Uu(I,S,D,T,m)}return r}};function Uu(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function df(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function ff(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Uu(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=df(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var bn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ds(t,this.TimeBufferType),this.values=Ds(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ds(e.times,Array),values:Ds(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),$l(e.settings)&&(n.settings={inTangents:Ds(e.settings.inTangents,Array),outTangents:Ds(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new oo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ao(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ro(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new lo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Er:t=this.InterpolantFactoryMethodDiscrete;break;case Ja:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break;case Jl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ze("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Er;case this.InterpolantFactoryMethodLinear:return Ja;case this.InterpolantFactoryMethodSmooth:return za;case this.InterpolantFactoryMethodBezier:return Jl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;$l(this.settings)&&(Gh(this.settings.inTangents,e),Gh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Be("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Be("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Ad(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Be("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===za,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let p=o*n,h=p-n,g=p+n;for(let _=0;_!==n;++_){let S=t[p+_];if(S!==t[h+_]||S!==t[g+_]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let p=o*n,h=a*n;for(let g=0;g!==n;++g)t[h+g]=t[p+g]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,$l(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Gh(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}bn.prototype.ValueTypeName="";bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=Ja;var Ni=class extends bn{constructor(e,t,n){super(e,t,n)}};Ni.prototype.ValueTypeName="bool";Ni.prototype.ValueBufferType=Array;Ni.prototype.DefaultInterpolation=Er;Ni.prototype.InterpolantFactoryMethodLinear=void 0;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var co=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};co.prototype.ValueTypeName="color";var ho=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};ho.prototype.ValueTypeName="number";var uo=class extends Di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)Kn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Xr=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new uo(this.times,this.values,this.getValueSize(),e)}};Xr.prototype.ValueTypeName="quaternion";Xr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends bn{constructor(e,t,n){super(e,t,n)}};Ui.prototype.ValueTypeName="string";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=Er;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var fo=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};fo.prototype.ValueTypeName="vector";var po=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,p){return c.push(u,p),this},this.removeHandler=function(u){let p=c.indexOf(u);return p!==-1&&c.splice(p,2),this},this.getHandler=function(u){for(let p=0,h=c.length;p<h;p+=2){let g=c[p],_=c[p+1];if(g.global&&(g.lastIndex=0),g.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Fu=new po,mo=class{constructor(e){this.manager=e!==void 0?e:Fu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};mo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ks=class extends qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},qr=class extends Ks{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Zl=new mt,Hh=new k,Wh=new k,Yr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $e(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qs,this._frameExtents=new $e(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Hh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Hh),Wh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Wh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Zl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Zl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Bs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Zl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Oa=new k,Ba=new Kn,Yn=new k,$r=class extends qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Oa,Ba,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Ba,Yn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Oa,Ba,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Ba,Yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ii=new k,Xh=new $e,qh=new $e,un=class extends $r{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ks*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ks*2*Math.atan(Math.tan(Mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z),Ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z)}getViewSize(e,t){return this.getViewBounds(e,Xh,qh),t.subVectors(qh,Xh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Mr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var tc=class extends Yr{constructor(){super(new un(90,1,.5,500)),this.isPointLightShadow=!0}},js=class extends Ks{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new tc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Fi=class extends $r{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},nc=class extends Yr{constructor(){super(new Fi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Qs=class extends Ks{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.target=new qt,this.shadow=new nc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ns=-90,Us=1,go=class extends qt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new un(Ns,Us,e,t);s.layers=this.layers,this.add(s);let r=new un(Ns,Us,e,t);r.layers=this.layers,this.add(r);let a=new un(Ns,Us,e,t);a.layers=this.layers,this.add(a);let o=new un(Ns,Us,e,t);o.layers=this.layers,this.add(o);let l=new un(Ns,Us,e,t);l.layers=this.layers,this.add(l);let c=new un(Ns,Us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Bs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(p,h,g),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},_o=class extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Ic="\\[\\]\\.:\\/",pf=new RegExp("["+Ic+"]","g"),Pc="[^"+Ic+"]",mf="[^"+Ic.replace("\\.","")+"]",gf=/((?:WC+[\/:])*)/.source.replace("WC",Pc),_f=/(WCOD+)?/.source.replace("WCOD",mf),xf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Pc),vf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Pc),yf=new RegExp("^"+gf+_f+xf+vf+"$"),Sf=["material","materials","bones","map"],ic=class{constructor(e,t,n){let s=n||At.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},At=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(pf,"")}static parseTrackName(e){let t=yf.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Sf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ze("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};At.Composite=ic;At.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};At.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};At.prototype.GetterByBindingType=[At.prototype._getValue_direct,At.prototype._getValue_array,At.prototype._getValue_arrayElement,At.prototype._getValue_toArray];At.prototype.SetterByBindingTypeAndVersioning=[[At.prototype._setValue_direct,At.prototype._setValue_direct_setNeedsUpdate,At.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[At.prototype._setValue_array,At.prototype._setValue_array_setNeedsUpdate,At.prototype._setValue_array_setMatrixWorldNeedsUpdate],[At.prototype._setValue_arrayElement,At.prototype._setValue_arrayElement_setNeedsUpdate,At.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[At.prototype._setValue_fromArray,At.prototype._setValue_fromArray_setNeedsUpdate,At.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var N_=new Float32Array(1);var Yh=new mt,Zr=class{constructor(e,t,n=0,s=1/0){this.ray=new Xs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Gs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Be("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yh),this}intersectObject(e,t=!0,n=[]){return sc(e,this,n,t),n.sort($h),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)sc(e[s],this,n,t);return n.sort($h),n}};function $h(i,e){return i.distance-e.distance}function sc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)sc(r[a],e,t,!0)}}var Oc=class Oc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Oc.prototype.isMatrix2=!0;var rc=Oc;function Lc(i,e,t,n){let s=Mf(n);switch(t){case Ec:return i*e;case To:return i*e/s.components*s.byteLength;case Ao:return i*e/s.components*s.byteLength;case Vi:return i*e*2/s.components*s.byteLength;case wo:return i*e*2/s.components*s.byteLength;case Tc:return i*e*3/s.components*s.byteLength;case Ln:return i*e*4/s.components*s.byteLength;case Ro:return i*e*4/s.components*s.byteLength;case Qr:case ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ta:case na:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Io:case Lo:return Math.max(i,16)*Math.max(e,8)/4;case Co:case Po:return Math.max(i,8)*Math.max(e,8)/2;case Do:case No:case Fo:case Oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Uo:case ia:case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ko:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Vo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Xo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case qo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Yo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case $o:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Jo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ko:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case jo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qo:case el:case tl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nl:case il:return Math.ceil(i/4)*Math.ceil(e/4)*8;case sa:case sl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Mf(i){switch(i){case xn:case yc:return{byteLength:1,components:1};case nr:case Sc:case Hn:return{byteLength:2,components:1};case bo:case Eo:return{byteLength:2,components:4};case Gn:case Mo:case Pn:return{byteLength:4,components:1};case Mc:case bc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function sd(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ef(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,p=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let g;if(c instanceof Float32Array)g=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)g=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=i.SHORT;else if(c instanceof Uint32Array)g=i.UNSIGNED_INT;else if(c instanceof Int32Array)g=i.INT;else if(c instanceof Int8Array)g=i.BYTE;else if(c instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,l,c){let u=l.array,p=l.updateRanges;if(i.bindBuffer(c,o),p.length===0)i.bufferSubData(c,0,u);else{p.sort((g,_)=>g.start-_.start);let h=0;for(let g=1;g<p.length;g++){let _=p[h],S=p[g];S.start<=_.start+_.count+1?_.count=Math.max(_.count,S.start+S.count-_.start):(++h,p[h]=S)}p.length=h+1;for(let g=0,_=p.length;g<_;g++){let S=p[g];i.bufferSubData(c,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Tf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Af=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,If=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Lf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Df=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Nf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Uf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ff=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Of=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Bf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,zf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,kf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Vf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Xf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,qf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Yf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,$f=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Kf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ep=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tp="gl_FragColor = linearToOutputTexel( gl_FragColor );",np=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ip=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,rp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ap=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,up=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,_p=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,xp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ep=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ap=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Rp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Cp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Lp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Np=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Up=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Op=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Gp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Wp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$p=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,em=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,tm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,im=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,om=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,hm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,um=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,fm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,mm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_m=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ym=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Em=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Tm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Am=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Lm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Dm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Nm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Om=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,km=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Wm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ym=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$m=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Jm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Km=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,eg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ng=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ig=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tt={alphahash_fragment:Tf,alphahash_pars_fragment:Af,alphamap_fragment:wf,alphamap_pars_fragment:Rf,alphatest_fragment:Cf,alphatest_pars_fragment:If,aomap_fragment:Pf,aomap_pars_fragment:Lf,batching_pars_vertex:Df,batching_vertex:Nf,begin_vertex:Uf,beginnormal_vertex:Ff,bsdfs:Of,iridescence_fragment:Bf,bumpmap_pars_fragment:zf,clipping_planes_fragment:kf,clipping_planes_pars_fragment:Vf,clipping_planes_pars_vertex:Gf,clipping_planes_vertex:Hf,color_fragment:Wf,color_pars_fragment:Xf,color_pars_vertex:qf,color_vertex:Yf,common:$f,cube_uv_reflection_fragment:Zf,defaultnormal_vertex:Jf,displacementmap_pars_vertex:Kf,displacementmap_vertex:jf,emissivemap_fragment:Qf,emissivemap_pars_fragment:ep,colorspace_fragment:tp,colorspace_pars_fragment:np,envmap_fragment:ip,envmap_common_pars_fragment:sp,envmap_pars_fragment:rp,envmap_pars_vertex:ap,envmap_physical_pars_fragment:_p,envmap_vertex:op,fog_vertex:lp,fog_pars_vertex:cp,fog_fragment:hp,fog_pars_fragment:up,gradientmap_pars_fragment:dp,lightmap_pars_fragment:fp,lights_lambert_fragment:pp,lights_lambert_pars_fragment:mp,lights_pars_begin:gp,lights_toon_fragment:xp,lights_toon_pars_fragment:vp,lights_phong_fragment:yp,lights_phong_pars_fragment:Sp,lights_physical_fragment:Mp,lights_physical_pars_fragment:bp,lights_fragment_begin:Ep,lights_fragment_maps:Tp,lights_fragment_end:Ap,lightprobes_pars_fragment:wp,logdepthbuf_fragment:Rp,logdepthbuf_pars_fragment:Cp,logdepthbuf_pars_vertex:Ip,logdepthbuf_vertex:Pp,map_fragment:Lp,map_pars_fragment:Dp,map_particle_fragment:Np,map_particle_pars_fragment:Up,metalnessmap_fragment:Fp,metalnessmap_pars_fragment:Op,morphinstance_vertex:Bp,morphcolor_vertex:zp,morphnormal_vertex:kp,morphtarget_pars_vertex:Vp,morphtarget_vertex:Gp,normal_fragment_begin:Hp,normal_fragment_maps:Wp,normal_pars_fragment:Xp,normal_pars_vertex:qp,normal_vertex:Yp,normalmap_pars_fragment:$p,clearcoat_normal_fragment_begin:Zp,clearcoat_normal_fragment_maps:Jp,clearcoat_pars_fragment:Kp,iridescence_pars_fragment:jp,opaque_fragment:Qp,packing:em,premultiplied_alpha_fragment:tm,project_vertex:nm,dithering_fragment:im,dithering_pars_fragment:sm,roughnessmap_fragment:rm,roughnessmap_pars_fragment:am,shadowmap_pars_fragment:om,shadowmap_pars_vertex:lm,shadowmap_vertex:cm,shadowmask_pars_fragment:hm,skinbase_vertex:um,skinning_pars_vertex:dm,skinning_vertex:fm,skinnormal_vertex:pm,specularmap_fragment:mm,specularmap_pars_fragment:gm,tonemapping_fragment:_m,tonemapping_pars_fragment:xm,transmission_fragment:vm,transmission_pars_fragment:ym,uv_pars_fragment:Sm,uv_pars_vertex:Mm,uv_vertex:bm,worldpos_vertex:Em,background_vert:Tm,background_frag:Am,backgroundCube_vert:wm,backgroundCube_frag:Rm,cube_vert:Cm,cube_frag:Im,depth_vert:Pm,depth_frag:Lm,distance_vert:Dm,distance_frag:Nm,equirect_vert:Um,equirect_frag:Fm,linedashed_vert:Om,linedashed_frag:Bm,meshbasic_vert:zm,meshbasic_frag:km,meshlambert_vert:Vm,meshlambert_frag:Gm,meshmatcap_vert:Hm,meshmatcap_frag:Wm,meshnormal_vert:Xm,meshnormal_frag:qm,meshphong_vert:Ym,meshphong_frag:$m,meshphysical_vert:Zm,meshphysical_frag:Jm,meshtoon_vert:Km,meshtoon_frag:jm,points_vert:Qm,points_frag:eg,shadow_vert:tg,shadow_frag:ng,sprite_vert:ig,sprite_frag:sg},xe={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},envMapRotation:{value:new Ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new k},probesMax:{value:new k},probesResolution:{value:new k}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},ni={basic:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:tt.meshbasic_vert,fragmentShader:tt.meshbasic_frag},lambert:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Qe(0)},envMapIntensity:{value:1}}]),vertexShader:tt.meshlambert_vert,fragmentShader:tt.meshlambert_frag},phong:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:tt.meshphong_vert,fragmentShader:tt.meshphong_frag},standard:{uniforms:ln([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag},toon:{uniforms:ln([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Qe(0)}}]),vertexShader:tt.meshtoon_vert,fragmentShader:tt.meshtoon_frag},matcap:{uniforms:ln([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:tt.meshmatcap_vert,fragmentShader:tt.meshmatcap_frag},points:{uniforms:ln([xe.points,xe.fog]),vertexShader:tt.points_vert,fragmentShader:tt.points_frag},dashed:{uniforms:ln([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:tt.linedashed_vert,fragmentShader:tt.linedashed_frag},depth:{uniforms:ln([xe.common,xe.displacementmap]),vertexShader:tt.depth_vert,fragmentShader:tt.depth_frag},normal:{uniforms:ln([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:tt.meshnormal_vert,fragmentShader:tt.meshnormal_frag},sprite:{uniforms:ln([xe.sprite,xe.fog]),vertexShader:tt.sprite_vert,fragmentShader:tt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:tt.background_vert,fragmentShader:tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ze}},vertexShader:tt.backgroundCube_vert,fragmentShader:tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:tt.cube_vert,fragmentShader:tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:tt.equirect_vert,fragmentShader:tt.equirect_frag},distance:{uniforms:ln([xe.common,xe.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:tt.distance_vert,fragmentShader:tt.distance_frag},shadow:{uniforms:ln([xe.lights,xe.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:tt.shadow_vert,fragmentShader:tt.shadow_frag}};ni.physical={uniforms:ln([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag};var ll={r:0,b:0,g:0},rg=new mt,rd=new Ze;rd.set(-1,0,0,0,1,0,0,0,1);function ag(i,e,t,n,s,r){let a=new Qe(0),o=s===!0?0:1,l,c,u=null,p=0,h=null;function g(A){let D=A.isScene===!0?A.background:null;if(D&&D.isTexture){let y=A.backgroundBlurriness>0;D=e.get(D,y)}return D}function _(A){let D=!1,y=g(A);y===null?m(a,o):y&&y.isColor&&(m(y,1),D=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||D)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(A,D){let y=g(D);y&&(y.isCubeTexture||y.mapping===Kr)?(c===void 0&&(c=new on(new Li(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:cs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(rg.makeRotationFromEuler(D.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(rd),c.material.toneMapped=rt.getTransfer(y.colorSpace)!==gt,(u!==y||p!==y.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,p=y.version,h=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new on(new ss(2,2),new Mn({name:"BackgroundMaterial",uniforms:cs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,l.material.toneMapped=rt.getTransfer(y.colorSpace)!==gt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||p!==y.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,p=y.version,h=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null))}function m(A,D){A.getRGB(ll,Cc(i)),t.buffers.color.setClear(ll.r,ll.g,ll.b,D,r)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,D=1){a.set(A),o=D,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,m(a,o)},render:_,addToRenderList:S,dispose:d}}function og(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(R,F,z,P,X){let te=!1,Y=p(R,P,z,F);r!==Y&&(r=Y,c(r.object)),te=g(R,P,z,X),te&&_(R,P,z,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,y(R,F,z,P),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(R){return i.bindVertexArray(R)}function u(R){return i.deleteVertexArray(R)}function p(R,F,z,P){let X=P.wireframe===!0,te=n[F.id];te===void 0&&(te={},n[F.id]=te);let Y=R.isInstancedMesh===!0?R.id:0,W=te[Y];W===void 0&&(W={},te[Y]=W);let Z=W[z.id];Z===void 0&&(Z={},W[z.id]=Z);let re=Z[X];return re===void 0&&(re=h(l()),Z[X]=re),re}function h(R){let F=[],z=[],P=[];for(let X=0;X<t;X++)F[X]=0,z[X]=0,P[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:z,attributeDivisors:P,object:R,attributes:{},index:null}}function g(R,F,z,P){let X=r.attributes,te=F.attributes,Y=0,W=z.getAttributes();for(let Z in W)if(W[Z].location>=0){let ae=X[Z],Fe=te[Z];if(Fe===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(Fe=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(Fe=R.instanceColor)),ae===void 0||ae.attribute!==Fe||Fe&&ae.data!==Fe.data)return!0;Y++}return r.attributesNum!==Y||r.index!==P}function _(R,F,z,P){let X={},te=F.attributes,Y=0,W=z.getAttributes();for(let Z in W)if(W[Z].location>=0){let ae=te[Z];ae===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(ae=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(ae=R.instanceColor));let Fe={};Fe.attribute=ae,ae&&ae.data&&(Fe.data=ae.data),X[Z]=Fe,Y++}r.attributes=X,r.attributesNum=Y,r.index=P}function S(){let R=r.newAttributes;for(let F=0,z=R.length;F<z;F++)R[F]=0}function m(R){d(R,0)}function d(R,F){let z=r.newAttributes,P=r.enabledAttributes,X=r.attributeDivisors;z[R]=1,P[R]===0&&(i.enableVertexAttribArray(R),P[R]=1),X[R]!==F&&(i.vertexAttribDivisor(R,F),X[R]=F)}function A(){let R=r.newAttributes,F=r.enabledAttributes;for(let z=0,P=F.length;z<P;z++)F[z]!==R[z]&&(i.disableVertexAttribArray(z),F[z]=0)}function D(R,F,z,P,X,te,Y){Y===!0?i.vertexAttribIPointer(R,F,z,X,te):i.vertexAttribPointer(R,F,z,P,X,te)}function y(R,F,z,P){S();let X=P.attributes,te=z.getAttributes(),Y=F.defaultAttributeValues;for(let W in te){let Z=te[W];if(Z.location>=0){let re=X[W];if(re===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(re=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(re=R.instanceColor)),re!==void 0){let ae=re.normalized,Fe=re.itemSize,De=e.get(re);if(De===void 0)continue;let vt=De.buffer,We=De.type,lt=De.bytesPerElement,j=We===i.INT||We===i.UNSIGNED_INT||re.gpuType===Mo;if(re.isInterleavedBufferAttribute){let se=re.data,be=se.stride,Ve=re.offset;if(se.isInstancedInterleavedBuffer){for(let ve=0;ve<Z.locationSize;ve++)d(Z.location+ve,se.meshPerAttribute);R.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let ve=0;ve<Z.locationSize;ve++)m(Z.location+ve);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let ve=0;ve<Z.locationSize;ve++)D(Z.location+ve,Fe/Z.locationSize,We,ae,be*lt,(Ve+Fe/Z.locationSize*ve)*lt,j)}else{if(re.isInstancedBufferAttribute){for(let se=0;se<Z.locationSize;se++)d(Z.location+se,re.meshPerAttribute);R.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let se=0;se<Z.locationSize;se++)m(Z.location+se);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let se=0;se<Z.locationSize;se++)D(Z.location+se,Fe/Z.locationSize,We,ae,Fe*lt,Fe/Z.locationSize*se*lt,j)}}else if(Y!==void 0){let ae=Y[W];if(ae!==void 0)switch(ae.length){case 2:i.vertexAttrib2fv(Z.location,ae);break;case 3:i.vertexAttrib3fv(Z.location,ae);break;case 4:i.vertexAttrib4fv(Z.location,ae);break;default:i.vertexAttrib1fv(Z.location,ae)}}}}A()}function E(){b();for(let R in n){let F=n[R];for(let z in F){let P=F[z];for(let X in P){let te=P[X];for(let Y in te)u(te[Y].object),delete te[Y];delete P[X]}}delete n[R]}}function T(R){if(n[R.id]===void 0)return;let F=n[R.id];for(let z in F){let P=F[z];for(let X in P){let te=P[X];for(let Y in te)u(te[Y].object),delete te[Y];delete P[X]}}delete n[R.id]}function I(R){for(let F in n){let z=n[F];for(let P in z){let X=z[P];if(X[R.id]===void 0)continue;let te=X[R.id];for(let Y in te)u(te[Y].object),delete te[Y];delete X[R.id]}}}function x(R){for(let F in n){let z=n[F],P=R.isInstancedMesh===!0?R.id:0,X=z[P];if(X!==void 0){for(let te in X){let Y=X[te];for(let W in Y)u(Y[W].object),delete Y[W];delete X[te]}delete z[P],Object.keys(z).length===0&&delete n[F]}}}function b(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:C,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:I,initAttributes:S,enableAttribute:m,disableUnusedAttributes:A}}function lg(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let g=0;g<u;g++)h+=c[g];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function cg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==Ln&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let x=I===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==xn&&I!==Pn&&!x&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(ze("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let p=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),D=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:g,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:A,maxVaryings:D,maxFragmentUniforms:y,maxSamples:E,samples:T}}function hg(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Bn,o=new Ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){let g=p.length!==0||h||n!==0||s;return s=h,n=p.length,g},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,h){t=u(p,h,0)},this.setState=function(p,h,g){let _=p.clippingPlanes,S=p.clipIntersection,m=p.clipShadows,d=i.get(p);if(!s||_===null||_.length===0||r&&!m)r?u(null):c();else{let A=r?0:n,D=A*4,y=d.clippingState||null;l.value=y,y=u(_,h,D,g);for(let E=0;E!==D;++E)y[E]=t[E];d.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(p,h,g,_){let S=p!==null?p.length:0,m=null;if(S!==0){if(m=l.value,_!==!0||m===null){let d=g+S*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<d)&&(m=new Float32Array(d));for(let D=0,y=g;D!==S;++D,y+=4)a.copy(p[D]).applyMatrix4(A,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}var rr=4,ug=6,dg=20,fg=256,ra=new Fi,Ou=new Qe,Bc=null,zc=0,kc=0,Vc=!1,pg=new k,hs=new k,hl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=pg}=r;Bc=this._renderer.getRenderTarget(),zc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ku(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Bc,zc,kc),this._renderer.xr.enabled=Vc,e.scissorTest=!1,sr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bi||e.mapping===ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bc=this._renderer.getRenderTarget(),zc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:Hn,format:Ln,colorSpace:Tr,depthBuffer:!1},s=Bu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bu(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=mg(r)),this._blurMaterial=_g(r,e,t),this._ggxMaterial=gg(r,e,t)}return s}_compileMaterial(e){let t=new on(new Yt,e);this._renderer.compile(t,ra)}_sceneToCubeUV(e,t,n,s,r){let l=new un(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,g=p.toneMapping;p.getClearColor(Ou),p.toneMapping=Vn,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new on(new Li,new xi({name:"PMREM.Background",side:fn,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,m=S.material,d=!1,A=e.background;A?A.isColor&&(m.color.copy(A),e.background=null,d=!0):(m.color.copy(Ou),d=!0);for(let D=0;D<6;D++){let y=D%3;y===0?(l.up.set(0,c[D],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[D],r.y,r.z)):y===1?(l.up.set(0,0,c[D]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[D],r.z)):(l.up.set(0,c[D],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[D]));let E=this._cubeSize;sr(s,y*E,D>2?E:0,E,E),p.setRenderTarget(s),d&&p.render(S,l),p.render(e,l)}p.toneMapping=g,p.autoClear=h,e.background=A}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Bi||e.mapping===ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ku()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;sr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ra)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),p=Math.sqrt(c*c-u*u),h=c*1.25,g=p*h,{_lodMax:_}=this,S=this._sizeLods[n],m=3*S*(n>_-rr?n-_+rr:0),d=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=g,l.mipInt.value=_-t,sr(r,m,d,3*S,2*S),s.setRenderTarget(r),s.render(o,ra),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=_-n,sr(e,m,d,3*S,2*S),s.setRenderTarget(e),s.render(o,ra)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],p=3*u*(s>this._lodMax-rr?s-this._lodMax+rr:0),h=4*(this._cubeSize-u);sr(t,p,h,3*u,2*u),a.setRenderTarget(t),a.render(l,ra)}};function mg(i){let e=[],t=[],n=i,s=i-rr+1+ug;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,h=6,g=3,_=new Float32Array(g*h*p),S=new Float32Array(g*h*p);for(let d=0;d<p;d++){let A=d%3*2/3-1,D=d>2?0:-1,y=[A,D,0,A+2/3,D,0,A+2/3,D+1,0,A,D,0,A+2/3,D+1,0,A,D+1,0];_.set(y,g*h*d);for(let E=0;E<h;E++){let T=u[E*2]*2-1,I=u[E*2+1]*2-1;d===0?hs.set(1,I,T):d===1?hs.set(-T,1,-I):d===2?hs.set(-T,I,1):d===3?hs.set(-1,I,-T):d===4?hs.set(-T,-1,I):hs.set(T,I,-1),hs.toArray(S,(d*h+E)*g)}}let m=new Yt;m.setAttribute("position",new an(_,g)),m.setAttribute("outputDirection",new an(S,g)),t.push(new on(m,null)),n>rr&&n--}return{lodMeshes:t,sizeLods:e}}function Bu(i,e,t){let n=new _n(i,e,t);return n.texture.mapping=Kr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function sr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function gg(i,e,t){return new Mn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:fg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function _g(i,e,t){return new Mn({name:"SphericalGaussianBlur",defines:{SAMPLES:dg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:fl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function zu(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function ku(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function fl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ul=class extends _n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new kr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Li(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:fn,blending:ei});r.uniforms.tEquirect.value=t;let a=new on(s,r),o=t.minFilter;return t.minFilter===zi&&(t.minFilter=Kt),new go(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function xg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,g=!1){return h==null?null:g?a(h):r(h)}function r(h){if(h&&h.isTexture){let g=h.mapping;if(g===vo||g===yo)if(e.has(h)){let _=e.get(h).texture;return o(_,h.mapping)}else{let _=h.image;if(_&&_.height>0){let S=new ul(_.height);return S.fromEquirectangularTexture(i,h),e.set(h,S),h.addEventListener("dispose",c),o(S.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let g=h.mapping,_=g===vo||g===yo,S=g===Bi||g===ls;if(_||S){let m=t.get(h),d=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new hl(i)),m=_?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let A=h.image;return _&&A&&A.height>0||S&&A&&l(A)?(n===null&&(n=new hl(i)),m=_?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,g){return g===vo?h.mapping=Bi:g===yo&&(h.mapping=ls),h}function l(h){let g=0,_=6;for(let S=0;S<_;S++)h[S]!==void 0&&g++;return g===_}function c(h){let g=h.target;g.removeEventListener("dispose",c);let _=e.get(g);_!==void 0&&(e.delete(g),_.dispose())}function u(h){let g=h.target;g.removeEventListener("dispose",u);let _=t.get(g);_!==void 0&&(t.delete(g),_.dispose())}function p(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:p}}function vg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&is("WebGLRenderer: "+n+" extension not supported."),s}}}function yg(i,e,t,n){let s={},r=new WeakMap;function a(p){let h=p.target;h.index!==null&&e.remove(h.index);for(let _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete s[h.id];let g=r.get(h);g&&(e.remove(g),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(p,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(p){let h=p.attributes;for(let g in h)e.update(h[g],i.ARRAY_BUFFER)}function c(p){let h=[],g=p.index,_=p.attributes.position,S=0;if(_===void 0)return;if(g!==null){let A=g.array;S=g.version;for(let D=0,y=A.length;D<y;D+=3){let E=A[D+0],T=A[D+1],I=A[D+2];h.push(E,T,T,I,I,E)}}else{let A=_.array;S=_.version;for(let D=0,y=A.length/3-1;D<y;D+=3){let E=D+0,T=D+1,I=D+2;h.push(E,T,T,I,I,E)}}let m=new(_.count>=65535?Dr:Lr)(h,1);m.version=S;let d=r.get(p);d&&e.remove(d),r.set(p,m)}function u(p){let h=r.get(p);if(h){let g=p.index;g!==null&&h.version<g.version&&c(p)}else c(p);return r.get(p)}return{get:o,update:l,getWireframeAttribute:u}}function Sg(i,e,t){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,h){i.drawElements(n,h,r,p*a),t.update(h,n,1)}function c(p,h,g){g!==0&&(i.drawElementsInstanced(n,h,r,p*a,g),t.update(h,n,g))}function u(p,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,p,0,g);let S=0;for(let m=0;m<g;m++)S+=h[m];t.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Mg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function bg(i,e,t){let n=new WeakMap,s=new It;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==p){let b=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",b)};h!==void 0&&h.texture.dispose();let g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],D=0;g===!0&&(D=1),_===!0&&(D=2),S===!0&&(D=3);let y=o.attributes.position.count*D,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*E*4*p),I=new Cr(T,y,E,p);I.type=Pn,I.needsUpdate=!0;let x=D*4;for(let C=0;C<p;C++){let R=m[C],F=d[C],z=A[C],P=y*E*4*C;for(let X=0;X<R.count;X++){let te=X*x;g===!0&&(s.fromBufferAttribute(R,X),T[P+te+0]=s.x,T[P+te+1]=s.y,T[P+te+2]=s.z,T[P+te+3]=0),_===!0&&(s.fromBufferAttribute(F,X),T[P+te+4]=s.x,T[P+te+5]=s.y,T[P+te+6]=s.z,T[P+te+7]=0),S===!0&&(s.fromBufferAttribute(z,X),T[P+te+8]=s.x,T[P+te+9]=s.y,T[P+te+10]=s.z,T[P+te+11]=z.itemSize===4?s.w:1)}}h={count:p,texture:I,size:new $e(y,E)},n.set(o,h),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let S=0;S<c.length;S++)g+=c[S];let _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Eg(i,e,t,n,s){let r=new WeakMap;function a(c){let u=s.render.frame,p=c.geometry,h=e.get(c,p);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let g=c.skeleton;r.get(g)!==u&&(g.update(),r.set(g,u))}return h}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var Tg={[fc]:"LINEAR_TONE_MAPPING",[pc]:"REINHARD_TONE_MAPPING",[mc]:"CINEON_TONE_MAPPING",[Jr]:"ACES_FILMIC_TONE_MAPPING",[_c]:"AGX_TONE_MAPPING",[xc]:"NEUTRAL_TONE_MAPPING",[gc]:"CUSTOM_TONE_MAPPING"};function Ag(i,e,t,n,s,r){let a=new _n(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Yt;c.setAttribute("position",new Ct([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ct([0,2,0,0,2,0],2));let u=new no({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new on(c,u),h=new Fi(-1,1,1,-1,0,1),g=null,_=null,S=!1,m,d=null,A=[],D=!1;this.setSize=function(y,E){a.setSize(y,E),o!==null&&o.setSize(y,E),l!==null&&l.setSize(y,E);for(let T=0;T<A.length;T++){let I=A[T];I.setSize&&I.setSize(y,E)}},this.setEffects=function(y){A=y,D=A.length>0&&A[0].isRenderPass===!0;let E=a.width,T=a.height;A.length>0&&o===null&&(o=new _n(E,T,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new _n(E,T,{type:Hn,depthBuffer:!1,stencilBuffer:!1}));for(let I=0;I<A.length;I++){let x=A[I];x.setSize&&x.setSize(E,T)}},this.begin=function(y,E){if(S||y.toneMapping===Vn&&A.length===0)return!1;if(d=E,E!==null){let T=E.width,I=E.height;(a.width!==T||a.height!==I)&&this.setSize(T,I)}return D===!1&&y.setRenderTarget(a),m=y.toneMapping,y.toneMapping=Vn,!0},this.hasRenderPass=function(){return D},this.end=function(y,E){y.toneMapping=m,S=!0;let T=a,I=o;for(let x=0;x<A.length;x++){let b=A[x];b.enabled!==!1&&(b.render(y,I,T,E),b.needsSwap!==!1&&(T=I,I=I===o?l:o))}if(g!==y.outputColorSpace||_!==y.toneMapping){g=y.outputColorSpace,_=y.toneMapping,u.defines={},rt.getTransfer(g)===gt&&(u.defines.SRGB_TRANSFER="");let x=Tg[_];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(d),y.render(p,h),d=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var ad=new dn,Wc=new Pi(1,1),od=new Cr,ld=new Qa,cd=new kr,Vu=[],Gu=[],Hu=new Float32Array(16),Wu=new Float32Array(9),Xu=new Float32Array(4);function or(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Vu[s];if(r===void 0&&(r=new Float32Array(s),Vu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function pl(i,e){let t=Gu[e];t===void 0&&(t=new Int32Array(e),Gu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function wg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Rg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2fv(this.addr,e),kt(t,e)}}function Cg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;i.uniform3fv(this.addr,e),kt(t,e)}}function Ig(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4fv(this.addr,e),kt(t,e)}}function Pg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(zt(t,n))return;Xu.set(n),i.uniformMatrix2fv(this.addr,!1,Xu),kt(t,n)}}function Lg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(zt(t,n))return;Wu.set(n),i.uniformMatrix3fv(this.addr,!1,Wu),kt(t,n)}}function Dg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(zt(t,n))return;Hu.set(n),i.uniformMatrix4fv(this.addr,!1,Hu),kt(t,n)}}function Ng(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ug(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2iv(this.addr,e),kt(t,e)}}function Fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3iv(this.addr,e),kt(t,e)}}function Og(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4iv(this.addr,e),kt(t,e)}}function Bg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function zg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2uiv(this.addr,e),kt(t,e)}}function kg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3uiv(this.addr,e),kt(t,e)}}function Vg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4uiv(this.addr,e),kt(t,e)}}function Gg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Wc.compareFunction=t.isReversedDepthBuffer()?ol:al,r=Wc):r=ad,t.setTexture2D(e||r,s)}function Hg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ld,s)}function Wg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||cd,s)}function Xg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||od,s)}function qg(i){switch(i){case 5126:return wg;case 35664:return Rg;case 35665:return Cg;case 35666:return Ig;case 35674:return Pg;case 35675:return Lg;case 35676:return Dg;case 5124:case 35670:return Ng;case 35667:case 35671:return Ug;case 35668:case 35672:return Fg;case 35669:case 35673:return Og;case 5125:return Bg;case 36294:return zg;case 36295:return kg;case 36296:return Vg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return Xg}}function Yg(i,e){i.uniform1fv(this.addr,e)}function $g(i,e){let t=or(e,this.size,2);i.uniform2fv(this.addr,t)}function Zg(i,e){let t=or(e,this.size,3);i.uniform3fv(this.addr,t)}function Jg(i,e){let t=or(e,this.size,4);i.uniform4fv(this.addr,t)}function Kg(i,e){let t=or(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function jg(i,e){let t=or(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Qg(i,e){let t=or(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function e0(i,e){i.uniform1iv(this.addr,e)}function t0(i,e){i.uniform2iv(this.addr,e)}function n0(i,e){i.uniform3iv(this.addr,e)}function i0(i,e){i.uniform4iv(this.addr,e)}function s0(i,e){i.uniform1uiv(this.addr,e)}function r0(i,e){i.uniform2uiv(this.addr,e)}function a0(i,e){i.uniform3uiv(this.addr,e)}function o0(i,e){i.uniform4uiv(this.addr,e)}function l0(i,e,t){let n=this.cache,s=e.length,r=pl(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),kt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Wc:a=ad;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function c0(i,e,t){let n=this.cache,s=e.length,r=pl(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),kt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ld,r[a])}function h0(i,e,t){let n=this.cache,s=e.length,r=pl(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),kt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||cd,r[a])}function u0(i,e,t){let n=this.cache,s=e.length,r=pl(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),kt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||od,r[a])}function d0(i){switch(i){case 5126:return Yg;case 35664:return $g;case 35665:return Zg;case 35666:return Jg;case 35674:return Kg;case 35675:return jg;case 35676:return Qg;case 5124:case 35670:return e0;case 35667:case 35671:return t0;case 35668:case 35672:return n0;case 35669:case 35673:return i0;case 5125:return s0;case 36294:return r0;case 36295:return a0;case 36296:return o0;case 35678:case 36198:case 36298:case 36306:case 35682:return l0;case 35679:case 36299:case 36307:return c0;case 35680:case 36300:case 36308:case 36293:return h0;case 36289:case 36303:case 36311:case 36292:return u0}}var Xc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qg(t.type)}},qc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=d0(t.type)}},Yc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Gc=/(\w+)(\])?(\[|\.)?/g;function qu(i,e){i.seq.push(e),i.map[e.id]=e}function f0(i,e,t){let n=i.name,s=n.length;for(Gc.lastIndex=0;;){let r=Gc.exec(n),a=Gc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){qu(t,c===void 0?new Xc(o,i,e):new qc(o,i,e));break}else{let p=t.map[o];p===void 0&&(p=new Yc(o),qu(t,p)),t=p}}}var ar=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);f0(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Yu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var p0=37297,m0=0;function g0(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var $u=new Ze;function _0(i){rt._getMatrix($u,rt.workingColorSpace,i);let e=`mat3( ${$u.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(i)){case Ar:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return ze("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+g0(i.getShaderSource(e),o)}else return r}function x0(i,e){let t=_0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var v0={[fc]:"Linear",[pc]:"Reinhard",[mc]:"Cineon",[Jr]:"ACESFilmic",[_c]:"AgX",[xc]:"Neutral",[gc]:"Custom"};function y0(i,e){let t=v0[e];return t===void 0?(ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var cl=new k;function S0(){rt.getLuminanceCoefficients(cl);let i=cl.x.toFixed(4),e=cl.y.toFixed(4),t=cl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function M0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(oa).join(`
`)}function b0(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function E0(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function oa(i){return i!==""}function Ju(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ku(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var T0=/^[ \t]*#include +<([\w\d./]+)>/gm;function $c(i){return i.replace(T0,w0)}var A0=new Map;function w0(i,e){let t=tt[e];if(t===void 0){let n=A0.get(e);if(n!==void 0)t=tt[n],ze('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return $c(t)}var R0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ju(i){return i.replace(R0,C0)}function C0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var I0={[as]:"SHADOWMAP_TYPE_PCF",[er]:"SHADOWMAP_TYPE_VSM"};function P0(i){return I0[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var L0={[Bi]:"ENVMAP_TYPE_CUBE",[ls]:"ENVMAP_TYPE_CUBE",[Kr]:"ENVMAP_TYPE_CUBE_UV"};function D0(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":L0[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var N0={[ls]:"ENVMAP_MODE_REFRACTION"};function U0(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":N0[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var F0={[dc]:"ENVMAP_BLENDING_MULTIPLY",[gu]:"ENVMAP_BLENDING_MIX",[_u]:"ENVMAP_BLENDING_ADD"};function O0(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":F0[i.combine]||"ENVMAP_BLENDING_NONE"}function B0(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function z0(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=P0(t),c=D0(t),u=U0(t),p=O0(t),h=B0(t),g=M0(t),_=b0(r),S=s.createProgram(),m,d,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(oa).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(oa).join(`
`),d.length>0&&(d+=`
`)):(m=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(oa).join(`
`),d=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?tt.tonemapping_pars_fragment:"",t.toneMapping!==Vn?y0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",tt.colorspace_pars_fragment,x0("linearToOutputTexel",t.outputColorSpace),S0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(oa).join(`
`)),a=$c(a),a=Ju(a,t),a=Ku(a,t),o=$c(o),o=Ju(o,t),o=Ku(o,t),a=ju(a),o=ju(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===wc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let D=A+m+a,y=A+d+o,E=Yu(s,s.VERTEX_SHADER,D),T=Yu(s,s.FRAGMENT_SHADER,y);s.attachShader(S,E),s.attachShader(S,T),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function I(R){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(S)||"",z=s.getShaderInfoLog(E)||"",P=s.getShaderInfoLog(T)||"",X=F.trim(),te=z.trim(),Y=P.trim(),W=!0,Z=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,E,T);else{let re=Zu(s,E,"vertex"),ae=Zu(s,T,"fragment");Be("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+X+`
`+re+`
`+ae)}else X!==""?ze("WebGLProgram: Program Info Log:",X):(te===""||Y==="")&&(Z=!1);Z&&(R.diagnostics={runnable:W,programLog:X,vertexShader:{log:te,prefix:m},fragmentShader:{log:Y,prefix:d}})}s.deleteShader(E),s.deleteShader(T),x=new ar(s,S),b=E0(s,S)}let x;this.getUniforms=function(){return x===void 0&&I(this),x};let b;this.getAttributes=function(){return b===void 0&&I(this),b};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(S,p0)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=m0++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=E,this.fragmentShader=T,this}var k0=0,Zc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Jc(e),t.set(e,n)),n}},Jc=class{constructor(e){this.id=k0++,this.code=e,this.usedTimes=0}};function V0(i){return i===Vi||i===ia||i===sa}function G0(i,e,t,n,s,r){let a=new Gs,o=new Zc,l=new Set,c=[],u=new Map,p=n.logarithmicDepthBuffer,h=n.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return l.add(x),x===0?"uv":`uv${x}`}function S(x,b,C,R,F,z){let P=R.fog,X=F.geometry,te=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,Y=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,W=e.get(x.envMap||te,Y),Z=W&&W.mapping===Kr?W.image.height:null,re=g[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&ze("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let ae=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Fe=ae!==void 0?ae.length:0,De=0;X.morphAttributes.position!==void 0&&(De=1),X.morphAttributes.normal!==void 0&&(De=2),X.morphAttributes.color!==void 0&&(De=3);let vt,We,lt,j;if(re){let ht=ni[re];vt=ht.vertexShader,We=ht.fragmentShader}else{vt=x.vertexShader,We=x.fragmentShader;let ht=o.getVertexShaderStage(x),ut=o.getFragmentShaderStage(x);o.update(x,ht,ut),lt=ht.id,j=ut.id}let se=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),Ve=F.isInstancedMesh===!0,ve=F.isBatchedMesh===!0,et=!!x.map,Pt=!!x.matcap,Xe=!!W,qe=!!x.aoMap,yt=!!x.lightMap,it=!!x.bumpMap&&x.wireframe===!1,Tt=!!x.normalMap,Dt=!!x.displacementMap,Vt=!!x.emissiveMap,St=!!x.metalnessMap,Rt=!!x.roughnessMap,U=x.anisotropy>0,Nt=x.clearcoat>0,ct=x.dispersion>0,M=x.retroreflectivity>0,f=x.iridescence>0,O=x.sheen>0,H=x.transmission>0,$=U&&!!x.anisotropyMap,ue=Nt&&!!x.clearcoatMap,de=Nt&&!!x.clearcoatNormalMap,K=Nt&&!!x.clearcoatRoughnessMap,ie=f&&!!x.iridescenceMap,he=f&&!!x.iridescenceThicknessMap,Le=O&&!!x.sheenColorMap,pe=O&&!!x.sheenRoughnessMap,J=!!x.specularMap,Ee=!!x.specularColorMap,Ue=!!x.specularIntensityMap,Ge=H&&!!x.transmissionMap,N=H&&!!x.thicknessMap,ce=!!x.gradientMap,ee=!!x.alphaMap,fe=x.alphaTest>0,_e=!!x.alphaHash,oe=!!x.extensions,Pe=Vn;x.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Pe=i.toneMapping);let Ce={shaderID:re,shaderType:x.type,shaderName:x.name,vertexShader:vt,fragmentShader:We,defines:x.defines,customVertexShaderID:lt,customFragmentShaderID:j,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:ve,batchingColor:ve&&F._colorsTexture!==null,instancing:Ve,instancingColor:Ve&&F.instanceColor!==null,instancingMorph:Ve&&F.morphTexture!==null,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:et,matcap:Pt,envMap:Xe,envMapMode:Xe&&W.mapping,envMapCubeUVHeight:Z,aoMap:qe,lightMap:yt,bumpMap:it,normalMap:Tt,displacementMap:Dt,emissiveMap:Vt,normalMapObjectSpace:Tt&&x.normalMapType===yu,normalMapTangentSpace:Tt&&x.normalMapType===rl,packedNormalMap:Tt&&x.normalMapType===rl&&V0(x.normalMap.format),metalnessMap:St,roughnessMap:Rt,anisotropy:U,anisotropyMap:$,clearcoat:Nt,clearcoatMap:ue,clearcoatNormalMap:de,clearcoatRoughnessMap:K,dispersion:ct,retroreflection:M,iridescence:f,iridescenceMap:ie,iridescenceThicknessMap:he,sheen:O,sheenColorMap:Le,sheenRoughnessMap:pe,specularMap:J,specularColorMap:Ee,specularIntensityMap:Ue,transmission:H,transmissionMap:Ge,thicknessMap:N,gradientMap:ce,opaque:x.transparent===!1&&x.blending===tr&&x.alphaToCoverage===!1,alphaMap:ee,alphaTest:fe,alphaHash:_e,combine:x.combine,mapUv:et&&_(x.map.channel),aoMapUv:qe&&_(x.aoMap.channel),lightMapUv:yt&&_(x.lightMap.channel),bumpMapUv:it&&_(x.bumpMap.channel),normalMapUv:Tt&&_(x.normalMap.channel),displacementMapUv:Dt&&_(x.displacementMap.channel),emissiveMapUv:Vt&&_(x.emissiveMap.channel),metalnessMapUv:St&&_(x.metalnessMap.channel),roughnessMapUv:Rt&&_(x.roughnessMap.channel),anisotropyMapUv:$&&_(x.anisotropyMap.channel),clearcoatMapUv:ue&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:de&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:he&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:pe&&_(x.sheenRoughnessMap.channel),specularMapUv:J&&_(x.specularMap.channel),specularColorMapUv:Ee&&_(x.specularColorMap.channel),specularIntensityMapUv:Ue&&_(x.specularIntensityMap.channel),transmissionMapUv:Ge&&_(x.transmissionMap.channel),thicknessMapUv:N&&_(x.thicknessMap.channel),alphaMapUv:ee&&_(x.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Tt||U),vertexNormals:!!X.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!X.attributes.uv&&(et||ee),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||X.attributes.normal===void 0&&Tt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:be,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:X.attributes.position!==void 0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:Fe,morphTextureStride:De,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pe,decodeVideoTexture:et&&x.map.isVideoTexture===!0&&rt.getTransfer(x.map.colorSpace)===gt,decodeVideoTextureEmissive:Vt&&x.emissiveMap.isVideoTexture===!0&&rt.getTransfer(x.emissiveMap.colorSpace)===gt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===In,flipSided:x.side===fn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:oe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&x.extensions.multiDraw===!0||ve)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function m(x){let b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(let C in x.defines)b.push(C),b.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(d(b,x),A(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function d(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numSunLights),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numSunLightShadows),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function A(x,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.retroreflection&&a.enable(24),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function D(x){let b=g[x.type],C;if(b){let R=ni[b];C=Nu.clone(R.uniforms)}else C=x.uniforms;return C}function y(x,b){let C=u.get(b);return C!==void 0?++C.usedTimes:(C=new z0(i,b,x,s),c.push(C),u.set(b,C)),C}function E(x){if(--x.usedTimes===0){let b=c.indexOf(x);c[b]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function I(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:D,acquireProgram:y,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:I}}function H0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function W0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function ed(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function td(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let g=0;return h.isInstancedMesh&&(g+=2),h.isSkinnedMesh&&(g+=1),g}function o(h,g,_,S,m,d){let A=i[e];return A===void 0?(A={id:h.id,object:h,geometry:g,material:_,materialVariant:a(h),groupOrder:S,renderOrder:h.renderOrder,z:m,group:d},i[e]=A):(A.id=h.id,A.object=h,A.geometry=g,A.material=_,A.materialVariant=a(h),A.groupOrder=S,A.renderOrder=h.renderOrder,A.z=m,A.group=d),e++,A}function l(h,g,_,S,m,d,A){A.reversedDepth===!0&&(m=-m);let D=o(h,g,_,S,m,d);_.transmission>0?n.push(D):_.transparent===!0?s.push(D):t.push(D)}function c(h,g,_,S,m,d){let A=o(h,g,_,S,m,d);_.transmission>0?n.unshift(A):_.transparent===!0?s.unshift(A):t.unshift(A)}function u(h,g){t.length>1&&t.sort(h||W0),n.length>1&&n.sort(g||ed),s.length>1&&s.sort(g||ed)}function p(){for(let h=e,g=i.length;h<g;h++){let _=i[h];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:p,sort:u}}function X0(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new td,i.set(n,[a])):s>=r.length?(a=new td,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function q0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new k,color:new Qe};break;case"SpotLight":t={position:new k,direction:new k,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function Y0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var $0=0;function Z0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function J0(i){let e=new q0,t=Y0(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new k);let s=new k,r=new mt,a=new mt;function o(c){let u=0,p=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let g=0,_=0,S=0,m=0,d=0,A=0,D=0,y=0,E=0,T=0,I=0,x=0,b=0,C=0;c.sort(Z0);for(let F=0,z=c.length;F<z;F++){let P=c[F],X=P.color,te=P.intensity,Y=P.distance,W=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Vi?W=P.shadow.map.texture:W=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=X.r*te,p+=X.g*te,h+=X.b*te;else if(P.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(P.sh.coefficients[Z],te);C++}else if(P.isSunLight){let Z=e.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let re=P.shadow,ae=t.get(P);ae.shadowIntensity=re.intensity,ae.shadowBias=re.bias,ae.shadowNormalBias=re.normalBias,ae.shadowRadius=re.radius,ae.shadowMapSize.copy(re.mapSize).multiply(re.getFrameExtents()),n.sunShadow[_]=ae,n.sunShadowMap[_]=W;let Fe=re.getViewportCount();for(let De=0;De<Fe;De++)n.sunShadowMatrix[S+De]=re.getMatrix(De),n.sunShadowCascade[S+De]=re._cascadeData[De];S+=Fe,_++}n.sun[g]=Z,g++}else if(P.isDirectionalLight){let Z=e.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let re=P.shadow,ae=t.get(P);ae.shadowIntensity=re.intensity,ae.shadowBias=re.bias,ae.shadowNormalBias=re.normalBias,ae.shadowRadius=re.radius,ae.shadowMapSize=re.mapSize,n.directionalShadow[m]=ae,n.directionalShadowMap[m]=W,n.directionalShadowMatrix[m]=P.shadow.matrix,E++}n.directional[m]=Z,m++}else if(P.isSpotLight){let Z=e.get(P);Z.position.setFromMatrixPosition(P.matrixWorld),Z.color.copy(X).multiplyScalar(te),Z.distance=Y,Z.coneCos=Math.cos(P.angle),Z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Z.decay=P.decay,n.spot[A]=Z;let re=P.shadow;if(P.map&&(n.spotLightMap[x]=P.map,x++,re.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[A]=re.matrix,P.castShadow){let ae=t.get(P);ae.shadowIntensity=re.intensity,ae.shadowBias=re.bias,ae.shadowNormalBias=re.normalBias,ae.shadowRadius=re.radius,ae.shadowMapSize=re.mapSize,n.spotShadow[A]=ae,n.spotShadowMap[A]=W,I++}A++}else if(P.isRectAreaLight){let Z=e.get(P);Z.color.copy(X).multiplyScalar(te),Z.halfWidth.set(P.width*.5,0,0),Z.halfHeight.set(0,P.height*.5,0),n.rectArea[D]=Z,D++}else if(P.isPointLight){let Z=e.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),Z.distance=P.distance,Z.decay=P.decay,P.castShadow){let re=P.shadow,ae=t.get(P);ae.shadowIntensity=re.intensity,ae.shadowBias=re.bias,ae.shadowNormalBias=re.normalBias,ae.shadowRadius=re.radius,ae.shadowMapSize=re.mapSize,ae.shadowCameraNear=re.camera.near,ae.shadowCameraFar=re.camera.far,n.pointShadow[d]=ae,n.pointShadowMap[d]=W,n.pointShadowMatrix[d]=P.shadow.matrix,T++}n.point[d]=Z,d++}else if(P.isHemisphereLight){let Z=e.get(P);Z.skyColor.copy(P.color).multiplyScalar(te),Z.groundColor.copy(P.groundColor).multiplyScalar(te),n.hemi[y]=Z,y++}}D>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=p,n.ambient[2]=h;let R=n.hash;(R.sunLength!==g||R.directionalLength!==m||R.pointLength!==d||R.spotLength!==A||R.rectAreaLength!==D||R.hemiLength!==y||R.numSunShadows!==_||R.numDirectionalShadows!==E||R.numPointShadows!==T||R.numSpotShadows!==I||R.numSpotMaps!==x||R.numLightProbes!==C)&&(n.sun.length=g,n.directional.length=m,n.spot.length=A,n.rectArea.length=D,n.point.length=d,n.hemi.length=y,n.sunShadow.length=_,n.sunShadowMap.length=_,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=I,n.spotShadowMap.length=I,n.spotLightMatrix.length=I+x-b,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=C,R.sunLength=g,R.directionalLength=m,R.pointLength=d,R.spotLength=A,R.rectAreaLength=D,R.hemiLength=y,R.numSunShadows=_,R.numDirectionalShadows=E,R.numPointShadows=T,R.numSpotShadows=I,R.numSpotMaps=x,R.numLightProbes=C,n.version=$0++)}function l(c,u){let p=0,h=0,g=0,_=0,S=0,m=0,d=u.matrixWorldInverse;for(let A=0,D=c.length;A<D;A++){let y=c[A];if(y.isSunLight){let E=n.sun[p];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(d),p++}else if(y.isDirectionalLight){let E=n.directional[h];E.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(d),h++}else if(y.isSpotLight){let E=n.spot[_];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(d),E.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(d),_++}else if(y.isRectAreaLight){let E=n.rectArea[S];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(d),a.identity(),r.copy(y.matrixWorld),r.premultiply(d),a.extractRotation(r),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),S++}else if(y.isPointLight){let E=n.point[g];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(d),g++}else if(y.isHemisphereLight){let E=n.hemi[m];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(d),m++}}}return{setup:o,setupView:l,state:n}}function nd(i){let e=new J0(i),t=[],n=[],s=[];function r(h){p.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let p={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:p,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function K0(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new nd(i),e.set(s,[o])):r>=a.length?(o=new nd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var j0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,e_=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)],t_=[new k(0,-1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1),new k(0,-1,0),new k(0,-1,0)],id=new mt,aa=new k,Hc=new k;function n_(i,e,t){let n=new qs,s=new $e,r=new $e,a=new It,o=new io,l=new so,c={},u=t.maxTextureSize,p={[Oi]:fn,[fn]:Oi,[In]:In},h=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:j0,fragmentShader:Q0}),g=h.clone();g.defines.HORIZONTAL_PASS=1;let _=new Yt;_.setAttribute("position",new an(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new on(_,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=as;let d=this.type;this.render=function(T,I,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Kh&&(ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=as);let b=i.getRenderTarget(),C=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),F=i.state;F.setBlending(ei),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let z=d!==this.type;z&&I.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(X=>X.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,X=T.length;P<X;P++){let te=T[P],Y=te.shadow;if(Y===void 0){ze("WebGLShadowMap:",te,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let W=Y.getFrameExtents();s.multiply(W),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/W.x),s.x=r.x*W.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/W.y),s.y=r.y*W.y,Y.mapSize.y=r.y));let Z=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=Z,Y.map===null||z===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===er){if(te.isPointLight){ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new _n(s.x,s.y,{format:Vi,type:Hn,minFilter:Kt,magFilter:Kt,generateMipmaps:!1}),Y.map.texture.name=te.name+".shadowMap",Y.map.depthTexture=new Pi(s.x,s.y,Pn),Y.map.depthTexture.name=te.name+".shadowMapDepth",Y.map.depthTexture.format=Zn,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Xt,Y.map.depthTexture.magFilter=Xt}else te.isPointLight?(Y.map=new ul(s.x),Y.map.depthTexture=new to(s.x,Gn)):(Y.map=new _n(s.x,s.y),Y.map.depthTexture=new Pi(s.x,s.y,Gn)),Y.map.depthTexture.name=te.name+".shadowMap",Y.map.depthTexture.format=Zn,this.type===as?(Y.map.depthTexture.compareFunction=Z?ol:al,Y.map.depthTexture.minFilter=Kt,Y.map.depthTexture.magFilter=Kt):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Xt,Y.map.depthTexture.magFilter=Xt);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);let re=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();te.isPointLight!==!0&&Y.updateMatrices(te,x);for(let ae=0;ae<re;ae++){let Fe=Y.getCamera(ae);if(te.isPointLight){let De=Y.camera,vt=Y.matrix,We=te.distance||De.far;We!==De.far&&(De.far=We,De.updateProjectionMatrix()),aa.setFromMatrixPosition(te.matrixWorld),De.position.copy(aa),Hc.copy(De.position),Hc.add(e_[ae]),De.up.copy(t_[ae]),De.lookAt(Hc),De.updateMatrixWorld(),vt.makeTranslation(-aa.x,-aa.y,-aa.z),id.multiplyMatrices(De.projectionMatrix,De.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(id,De.coordinateSystem,De.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,ae),i.clear();else{ae===0&&(i.setRenderTarget(Y.map),i.clear());let De=Y.getViewport(ae);a.set(r.x*De.x,r.y*De.y,r.x*De.z,r.y*De.w),F.viewport(a)}n=Y.getFrustum(ae),y(I,x,Fe,te,this.type)}Y.isPointLightShadow!==!0&&this.type===er&&A(Y,x),Y.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(b,C,R)};function A(T,I){let x=e.update(S);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,g.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,g.needsUpdate=!0),T.mapPass===null?T.mapPass=new _n(s.x,s.y,{format:Vi,type:Hn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(I,null,x,h,S,null),g.uniforms.shadow_pass.value=T.mapPass.texture,g.uniforms.resolution.value.set(T.map.width,T.map.height),g.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(I,null,x,g,S,null)}function D(T,I,x,b){let C=null,R=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)C=R;else if(C=x.isPointLight===!0?l:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let F=C.uuid,z=I.uuid,P=c[F];P===void 0&&(P={},c[F]=P);let X=P[z];X===void 0&&(X=C.clone(),P[z]=X,I.addEventListener("dispose",E)),C=X}if(C.visible=I.visible,C.wireframe=I.wireframe,b===er?C.side=I.shadowSide!==null?I.shadowSide:I.side:C.side=I.shadowSide!==null?I.shadowSide:p[I.side],C.alphaMap=I.alphaMap,C.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,C.map=I.map,C.clipShadows=I.clipShadows,C.clippingPlanes=I.clippingPlanes,C.clipIntersection=I.clipIntersection,C.displacementMap=I.displacementMap,C.displacementScale=I.displacementScale,C.displacementBias=I.displacementBias,C.wireframeLinewidth=I.wireframeLinewidth,C.linewidth=I.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let F=i.properties.get(C);F.light=x}return C}function y(T,I,x,b,C){if(T.visible===!1)return;if(T.layers.test(I.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===er)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let z=e.update(T),P=T.material;if(Array.isArray(P)){let X=z.groups;for(let te=0,Y=X.length;te<Y;te++){let W=X[te],Z=P[W.materialIndex];if(Z&&Z.visible){let re=D(T,Z,b,C);T.onBeforeShadow(i,T,I,x,z,re,W),i.renderBufferDirect(x,null,z,re,T,W),T.onAfterShadow(i,T,I,x,z,re,W)}}}else if(P.visible){let X=D(T,P,b,C);T.onBeforeShadow(i,T,I,x,z,X,null),i.renderBufferDirect(x,null,z,X,T,null),T.onAfterShadow(i,T,I,x,z,X,null)}}let F=T.children;for(let z=0,P=F.length;z<P;z++)y(F[z],I,x,b,C)}function E(T){T.target.removeEventListener("dispose",E);for(let x in c){let b=c[x],C=T.target.uuid;C in b&&(b[C].dispose(),delete b[C])}}}function i_(i,e){function t(){let N=!1,ce=new It,ee=null,fe=new It(0,0,0,0);return{setMask:function(_e){ee!==_e&&!N&&(i.colorMask(_e,_e,_e,_e),ee=_e)},setLocked:function(_e){N=_e},setClear:function(_e,oe,Pe,Ce,ht){ht===!0&&(_e*=Ce,oe*=Ce,Pe*=Ce),ce.set(_e,oe,Pe,Ce),fe.equals(ce)===!1&&(i.clearColor(_e,oe,Pe,Ce),fe.copy(ce))},reset:function(){N=!1,ee=null,fe.set(-1,0,0,0)}}}function n(){let N=!1,ce=!1,ee=null,fe=null,_e=null;return{setReversed:function(oe){if(ce!==oe){let Pe=e.get("EXT_clip_control");oe?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),ce=oe;let Ce=_e;_e=null,this.setClear(Ce)}},getReversed:function(){return ce},setTest:function(oe){oe?se(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(oe){ee!==oe&&!N&&(i.depthMask(oe),ee=oe)},setFunc:function(oe){if(ce&&(oe=Pu[oe]),fe!==oe){switch(oe){case Va:i.depthFunc(i.NEVER);break;case Ga:i.depthFunc(i.ALWAYS);break;case Ha:i.depthFunc(i.LESS);break;case Os:i.depthFunc(i.LEQUAL);break;case Wa:i.depthFunc(i.EQUAL);break;case Xa:i.depthFunc(i.GEQUAL);break;case qa:i.depthFunc(i.GREATER);break;case Ya:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}fe=oe}},setLocked:function(oe){N=oe},setClear:function(oe){_e!==oe&&(_e=oe,ce&&(oe=1-oe),i.clearDepth(oe))},reset:function(){N=!1,ee=null,fe=null,_e=null,ce=!1}}}function s(){let N=!1,ce=null,ee=null,fe=null,_e=null,oe=null,Pe=null,Ce=null,ht=null;return{setTest:function(ut){N||(ut?se(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(ut){ce!==ut&&!N&&(i.stencilMask(ut),ce=ut)},setFunc:function(ut,Zt,Qt){(ee!==ut||fe!==Zt||_e!==Qt)&&(i.stencilFunc(ut,Zt,Qt),ee=ut,fe=Zt,_e=Qt)},setOp:function(ut,Zt,Qt){(oe!==ut||Pe!==Zt||Ce!==Qt)&&(i.stencilOp(ut,Zt,Qt),oe=ut,Pe=Zt,Ce=Qt)},setLocked:function(ut){N=ut},setClear:function(ut){ht!==ut&&(i.clearStencil(ut),ht=ut)},reset:function(){N=!1,ce=null,ee=null,fe=null,_e=null,oe=null,Pe=null,Ce=null,ht=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},p={},h={},g=new WeakMap,_=[],S=null,m=!1,d=null,A=null,D=null,y=null,E=null,T=null,I=null,x=new Qe(0,0,0),b=0,C=!1,R=null,F=null,z=null,P=null,X=null,te=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,W=0,Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(Z)[1]),Y=W>=1):Z.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),Y=W>=2);let re=null,ae={},Fe=i.getParameter(i.SCISSOR_BOX),De=i.getParameter(i.VIEWPORT),vt=new It().fromArray(Fe),We=new It().fromArray(De);function lt(N,ce,ee,fe){let _e=new Uint8Array(4),oe=i.createTexture();i.bindTexture(N,oe),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<ee;Pe++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(ce,0,i.RGBA,1,1,fe,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(ce+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return oe}let j={};j[i.TEXTURE_2D]=lt(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=lt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=lt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=lt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(i.DEPTH_TEST),a.setFunc(Os),it(!1),Tt(ac),se(i.CULL_FACE),qe(ei);function se(N){u[N]!==!0&&(i.enable(N),u[N]=!0)}function be(N){u[N]!==!1&&(i.disable(N),u[N]=!1)}function Ve(N,ce){return h[N]!==ce?(i.bindFramebuffer(N,ce),h[N]=ce,N===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ce),N===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ce),!0):!1}function ve(N,ce){let ee=_,fe=!1;if(N){ee=g.get(ce),ee===void 0&&(ee=[],g.set(ce,ee));let _e=N.textures;if(ee.length!==_e.length||ee[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,Pe=_e.length;oe<Pe;oe++)ee[oe]=i.COLOR_ATTACHMENT0+oe;ee.length=_e.length,fe=!0}}else ee[0]!==i.BACK&&(ee[0]=i.BACK,fe=!0);fe&&i.drawBuffers(ee)}function et(N){return S!==N?(i.useProgram(N),S=N,!0):!1}let Pt={[os]:i.FUNC_ADD,[Qh]:i.FUNC_SUBTRACT,[eu]:i.FUNC_REVERSE_SUBTRACT};Pt[tu]=i.MIN,Pt[nu]=i.MAX;let Xe={[iu]:i.ZERO,[su]:i.ONE,[ru]:i.SRC_COLOR,[hc]:i.SRC_ALPHA,[uu]:i.SRC_ALPHA_SATURATE,[cu]:i.DST_COLOR,[ou]:i.DST_ALPHA,[au]:i.ONE_MINUS_SRC_COLOR,[uc]:i.ONE_MINUS_SRC_ALPHA,[hu]:i.ONE_MINUS_DST_COLOR,[lu]:i.ONE_MINUS_DST_ALPHA,[du]:i.CONSTANT_COLOR,[fu]:i.ONE_MINUS_CONSTANT_COLOR,[pu]:i.CONSTANT_ALPHA,[mu]:i.ONE_MINUS_CONSTANT_ALPHA};function qe(N,ce,ee,fe,_e,oe,Pe,Ce,ht,ut){if(N===ei){m===!0&&(be(i.BLEND),m=!1);return}if(m===!1&&(se(i.BLEND),m=!0),N!==jh){if(N!==d||ut!==C){if((A!==os||E!==os)&&(i.blendEquation(i.FUNC_ADD),A=os,E=os),ut)switch(N){case tr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oc:i.blendFunc(i.ONE,i.ONE);break;case lc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case cc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",N);break}else switch(N){case tr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case lc:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case cc:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",N);break}D=null,y=null,T=null,I=null,x.set(0,0,0),b=0,d=N,C=ut}return}_e=_e||ce,oe=oe||ee,Pe=Pe||fe,(ce!==A||_e!==E)&&(i.blendEquationSeparate(Pt[ce],Pt[_e]),A=ce,E=_e),(ee!==D||fe!==y||oe!==T||Pe!==I)&&(i.blendFuncSeparate(Xe[ee],Xe[fe],Xe[oe],Xe[Pe]),D=ee,y=fe,T=oe,I=Pe),(Ce.equals(x)===!1||ht!==b)&&(i.blendColor(Ce.r,Ce.g,Ce.b,ht),x.copy(Ce),b=ht),d=N,C=!1}function yt(N,ce){N.side===In?be(i.CULL_FACE):se(i.CULL_FACE);let ee=N.side===fn;ce&&(ee=!ee),it(ee),N.blending===tr&&N.transparent===!1?qe(ei):qe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let fe=N.stencilWrite;o.setTest(fe),fe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Vt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(N){R!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),R=N)}function Tt(N){N!==Zh?(se(i.CULL_FACE),N!==F&&(N===ac?i.cullFace(i.BACK):N===Jh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),F=N}function Dt(N){N!==z&&(Y&&i.lineWidth(N),z=N)}function Vt(N,ce,ee){N?(se(i.POLYGON_OFFSET_FILL),(P!==ce||X!==ee)&&(P=ce,X=ee,a.getReversed()&&(ce=-ce),i.polygonOffset(ce,ee))):be(i.POLYGON_OFFSET_FILL)}function St(N){N?se(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function Rt(N){N===void 0&&(N=i.TEXTURE0+te-1),re!==N&&(i.activeTexture(N),re=N)}function U(N,ce,ee){ee===void 0&&(re===null?ee=i.TEXTURE0+te-1:ee=re);let fe=ae[ee];fe===void 0&&(fe={type:void 0,texture:void 0},ae[ee]=fe),(fe.type!==N||fe.texture!==ce)&&(re!==ee&&(i.activeTexture(ee),re=ee),i.bindTexture(N,ce||j[N]),fe.type=N,fe.texture=ce)}function Nt(){let N=ae[re];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ct(){try{i.compressedTexImage2D(...arguments)}catch(N){Be("WebGLState:",N)}}function M(){try{i.compressedTexImage3D(...arguments)}catch(N){Be("WebGLState:",N)}}function f(){try{i.texSubImage2D(...arguments)}catch(N){Be("WebGLState:",N)}}function O(){try{i.texSubImage3D(...arguments)}catch(N){Be("WebGLState:",N)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(N){Be("WebGLState:",N)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(N){Be("WebGLState:",N)}}function ue(){try{i.texStorage2D(...arguments)}catch(N){Be("WebGLState:",N)}}function de(){try{i.texStorage3D(...arguments)}catch(N){Be("WebGLState:",N)}}function K(){try{i.texImage2D(...arguments)}catch(N){Be("WebGLState:",N)}}function ie(){try{i.texImage3D(...arguments)}catch(N){Be("WebGLState:",N)}}function he(N){return p[N]!==void 0?p[N]:i.getParameter(N)}function Le(N,ce){p[N]!==ce&&(i.pixelStorei(N,ce),p[N]=ce)}function pe(N){vt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),vt.copy(N))}function J(N){We.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),We.copy(N))}function Ee(N,ce){let ee=c.get(ce);ee===void 0&&(ee=new WeakMap,c.set(ce,ee));let fe=ee.get(N);fe===void 0&&(fe=i.getUniformBlockIndex(ce,N.name),ee.set(N,fe))}function Ue(N,ce){let fe=c.get(ce).get(N);l.get(ce)!==fe&&(i.uniformBlockBinding(ce,fe,N.__bindingPointIndex),l.set(ce,fe))}function Ge(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},p={},re=null,ae={},h={},g=new WeakMap,_=[],S=null,m=!1,d=null,A=null,D=null,y=null,E=null,T=null,I=null,x=new Qe(0,0,0),b=0,C=!1,R=null,F=null,z=null,P=null,X=null,vt.set(0,0,i.canvas.width,i.canvas.height),We.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:be,bindFramebuffer:Ve,drawBuffers:ve,useProgram:et,setBlending:qe,setMaterial:yt,setFlipSided:it,setCullFace:Tt,setLineWidth:Dt,setPolygonOffset:Vt,setScissorTest:St,activeTexture:Rt,bindTexture:U,unbindTexture:Nt,compressedTexImage2D:ct,compressedTexImage3D:M,texImage2D:K,texImage3D:ie,pixelStorei:Le,getParameter:he,updateUBOMapping:Ee,uniformBlockBinding:Ue,texStorage2D:ue,texStorage3D:de,texSubImage2D:f,texSubImage3D:O,compressedTexSubImage2D:H,compressedTexSubImage3D:$,scissor:pe,viewport:J,reset:Ge}}function s_(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $e,u=new WeakMap,p=new Set,h,g=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(M,f){return _?new OffscreenCanvas(M,f):wr("canvas")}function m(M,f,O){let H=1,$=ct(M);if(($.width>O||$.height>O)&&(H=O/Math.max($.width,$.height)),H<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let ue=Math.floor(H*$.width),de=Math.floor(H*$.height);h===void 0&&(h=S(ue,de));let K=f?S(ue,de):h;return K.width=ue,K.height=de,K.getContext("2d").drawImage(M,0,0,ue,de),ze("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ue+"x"+de+")."),K}else return"data"in M&&ze("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),M;return M}function d(M){return M.generateMipmaps}function A(M){i.generateMipmap(M)}function D(M){return M.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?i.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(M,f,O,H,$,ue=!1){if(M!==null){if(i[M]!==void 0)return i[M];ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let de;H&&(de=e.get("EXT_texture_norm16"),de||ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=f;if(f===i.RED&&(O===i.FLOAT&&(K=i.R32F),O===i.HALF_FLOAT&&(K=i.R16F),O===i.UNSIGNED_BYTE&&(K=i.R8),O===i.UNSIGNED_SHORT&&de&&(K=de.R16_EXT),O===i.SHORT&&de&&(K=de.R16_SNORM_EXT)),f===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.R8UI),O===i.UNSIGNED_SHORT&&(K=i.R16UI),O===i.UNSIGNED_INT&&(K=i.R32UI),O===i.BYTE&&(K=i.R8I),O===i.SHORT&&(K=i.R16I),O===i.INT&&(K=i.R32I)),f===i.RG&&(O===i.FLOAT&&(K=i.RG32F),O===i.HALF_FLOAT&&(K=i.RG16F),O===i.UNSIGNED_BYTE&&(K=i.RG8),O===i.UNSIGNED_SHORT&&de&&(K=de.RG16_EXT),O===i.SHORT&&de&&(K=de.RG16_SNORM_EXT)),f===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RG8UI),O===i.UNSIGNED_SHORT&&(K=i.RG16UI),O===i.UNSIGNED_INT&&(K=i.RG32UI),O===i.BYTE&&(K=i.RG8I),O===i.SHORT&&(K=i.RG16I),O===i.INT&&(K=i.RG32I)),f===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGB8UI),O===i.UNSIGNED_SHORT&&(K=i.RGB16UI),O===i.UNSIGNED_INT&&(K=i.RGB32UI),O===i.BYTE&&(K=i.RGB8I),O===i.SHORT&&(K=i.RGB16I),O===i.INT&&(K=i.RGB32I)),f===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),O===i.UNSIGNED_INT&&(K=i.RGBA32UI),O===i.BYTE&&(K=i.RGBA8I),O===i.SHORT&&(K=i.RGBA16I),O===i.INT&&(K=i.RGBA32I)),f===i.RGB&&(O===i.UNSIGNED_SHORT&&de&&(K=de.RGB16_EXT),O===i.SHORT&&de&&(K=de.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),f===i.RGBA){let ie=ue?Ar:rt.getTransfer($);O===i.FLOAT&&(K=i.RGBA32F),O===i.HALF_FLOAT&&(K=i.RGBA16F),O===i.UNSIGNED_BYTE&&(K=ie===gt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&de&&(K=de.RGBA16_EXT),O===i.SHORT&&de&&(K=de.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function E(M,f){let O;return M?f===null||f===Gn||f===ir?O=i.DEPTH24_STENCIL8:f===Pn?O=i.DEPTH32F_STENCIL8:f===nr&&(O=i.DEPTH24_STENCIL8,ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):f===null||f===Gn||f===ir?O=i.DEPTH_COMPONENT24:f===Pn?O=i.DEPTH_COMPONENT32F:f===nr&&(O=i.DEPTH_COMPONENT16),O}function T(M,f){return d(M)===!0||M.isFramebufferTexture&&M.minFilter!==Xt&&M.minFilter!==Kt?Math.log2(Math.max(f.width,f.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?f.mipmaps.length:1}function I(M){let f=M.target;f.removeEventListener("dispose",I),b(f),f.isVideoTexture&&u.delete(f),f.isHTMLTexture&&p.delete(f)}function x(M){let f=M.target;f.removeEventListener("dispose",x),R(f)}function b(M){let f=n.get(M);if(f.__webglInit===void 0)return;let O=M.source,H=g.get(O);if(H){let $=H[f.__cacheKey];$.usedTimes--,$.usedTimes===0&&C(M),Object.keys(H).length===0&&g.delete(O)}n.remove(M)}function C(M){let f=n.get(M);i.deleteTexture(f.__webglTexture);let O=M.source,H=g.get(O);delete H[f.__cacheKey],a.memory.textures--}function R(M){let f=n.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),n.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(f.__webglFramebuffer[H]))for(let $=0;$<f.__webglFramebuffer[H].length;$++)i.deleteFramebuffer(f.__webglFramebuffer[H][$]);else i.deleteFramebuffer(f.__webglFramebuffer[H]);f.__webglDepthbuffer&&i.deleteRenderbuffer(f.__webglDepthbuffer[H])}else{if(Array.isArray(f.__webglFramebuffer))for(let H=0;H<f.__webglFramebuffer.length;H++)i.deleteFramebuffer(f.__webglFramebuffer[H]);else i.deleteFramebuffer(f.__webglFramebuffer);if(f.__webglDepthbuffer&&i.deleteRenderbuffer(f.__webglDepthbuffer),f.__webglMultisampledFramebuffer&&i.deleteFramebuffer(f.__webglMultisampledFramebuffer),f.__webglColorRenderbuffer)for(let H=0;H<f.__webglColorRenderbuffer.length;H++)f.__webglColorRenderbuffer[H]&&i.deleteRenderbuffer(f.__webglColorRenderbuffer[H]);f.__webglDepthRenderbuffer&&i.deleteRenderbuffer(f.__webglDepthRenderbuffer)}let O=M.textures;for(let H=0,$=O.length;H<$;H++){let ue=n.get(O[H]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(O[H])}n.remove(M)}let F=0;function z(){F=0}function P(){return F}function X(M){F=M}function te(){let M=F;return M>=s.maxTextures&&ze("WebGLTextures: Trying to use "+(M+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,M}function Y(M){let f=[];return f.push(M.wrapS),f.push(M.wrapT),f.push(M.wrapR||0),f.push(M.magFilter),f.push(M.minFilter),f.push(M.anisotropy),f.push(M.internalFormat),f.push(M.format),f.push(M.type),f.push(M.generateMipmaps),f.push(M.premultiplyAlpha),f.push(M.flipY),f.push(M.unpackAlignment),f.push(M.colorSpace),f.join()}function W(M,f){let O=n.get(M);if(M.isVideoTexture&&U(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&O.__version!==M.version){let H=M.image;if(H===null)ze("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)ze("WebGLRenderer: Texture marked for update but image is incomplete");else{be(O,M,f);return}}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+f)}function Z(M,f){let O=n.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){be(O,M,f);return}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+f)}function re(M,f){let O=n.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){be(O,M,f);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+f)}function ae(M,f){let O=n.get(M);if(M.isCubeDepthTexture!==!0&&M.version>0&&O.__version!==M.version){Ve(O,M,f);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+f)}let Fe={[$a]:i.REPEAT,[$n]:i.CLAMP_TO_EDGE,[Za]:i.MIRRORED_REPEAT},De={[Xt]:i.NEAREST,[xu]:i.NEAREST_MIPMAP_NEAREST,[jr]:i.NEAREST_MIPMAP_LINEAR,[Kt]:i.LINEAR,[So]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},vt={[Mu]:i.NEVER,[wu]:i.ALWAYS,[bu]:i.LESS,[al]:i.LEQUAL,[Eu]:i.EQUAL,[ol]:i.GEQUAL,[Tu]:i.GREATER,[Au]:i.NOTEQUAL};function We(M,f){if(f.type===Pn&&e.has("OES_texture_float_linear")===!1&&(f.magFilter===Kt||f.magFilter===So||f.magFilter===jr||f.magFilter===zi||f.minFilter===Kt||f.minFilter===So||f.minFilter===jr||f.minFilter===zi)&&ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(M,i.TEXTURE_WRAP_S,Fe[f.wrapS]),i.texParameteri(M,i.TEXTURE_WRAP_T,Fe[f.wrapT]),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,Fe[f.wrapR]),i.texParameteri(M,i.TEXTURE_MAG_FILTER,De[f.magFilter]),i.texParameteri(M,i.TEXTURE_MIN_FILTER,De[f.minFilter]),f.compareFunction&&(i.texParameteri(M,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(M,i.TEXTURE_COMPARE_FUNC,vt[f.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(f.magFilter===Xt||f.minFilter!==jr&&f.minFilter!==zi||f.type===Pn&&e.has("OES_texture_float_linear")===!1)return;if(f.anisotropy>1||n.get(f).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(M,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(f.anisotropy,s.getMaxAnisotropy())),n.get(f).__currentAnisotropy=f.anisotropy}}}function lt(M,f){let O=!1;M.__webglInit===void 0&&(M.__webglInit=!0,f.addEventListener("dispose",I));let H=f.source,$=g.get(H);$===void 0&&($={},g.set(H,$));let ue=Y(f);if(ue!==M.__cacheKey){$[ue]===void 0&&($[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),$[ue].usedTimes++;let de=$[M.__cacheKey];de!==void 0&&($[M.__cacheKey].usedTimes--,de.usedTimes===0&&C(f)),M.__cacheKey=ue,M.__webglTexture=$[ue].texture}return O}function j(M,f,O){return Math.floor(Math.floor(M/O)/f)}function se(M,f,O,H){let ue=M.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,f.width,f.height,O,H,f.data);else{ue.sort((Le,pe)=>Le.start-pe.start);let de=0;for(let Le=1;Le<ue.length;Le++){let pe=ue[de],J=ue[Le],Ee=pe.start+pe.count,Ue=j(J.start,f.width,4),Ge=j(pe.start,f.width,4);J.start<=Ee+1&&Ue===Ge&&j(J.start+J.count-1,f.width,4)===Ue?pe.count=Math.max(pe.count,J.start+J.count-pe.start):(++de,ue[de]=J)}ue.length=de+1;let K=t.getParameter(i.UNPACK_ROW_LENGTH),ie=t.getParameter(i.UNPACK_SKIP_PIXELS),he=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,f.width);for(let Le=0,pe=ue.length;Le<pe;Le++){let J=ue[Le],Ee=Math.floor(J.start/4),Ue=Math.ceil(J.count/4),Ge=Ee%f.width,N=Math.floor(Ee/f.width),ce=Ue,ee=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ge),t.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Ge,N,ce,ee,O,H,f.data)}M.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,K),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,he)}}function be(M,f,O){let H=i.TEXTURE_2D;(f.isDataArrayTexture||f.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),f.isData3DTexture&&(H=i.TEXTURE_3D);let $=lt(M,f),ue=f.source;t.bindTexture(H,M.__webglTexture,i.TEXTURE0+O);let de=n.get(ue);if(ue.version!==de.__version||$===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&f.image instanceof ImageBitmap)===!1){let ee=rt.getPrimaries(rt.workingColorSpace),fe=f.colorSpace===vi?null:rt.getPrimaries(f.colorSpace),_e=f.colorSpace===vi||ee===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,f.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,f.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}t.pixelStorei(i.UNPACK_ALIGNMENT,f.unpackAlignment);let ie=m(f.image,!1,s.maxTextureSize);ie=Nt(f,ie);let he=r.convert(f.format,f.colorSpace),Le=r.convert(f.type),pe=y(f.internalFormat,he,Le,f.normalized,f.colorSpace,f.isVideoTexture);We(H,f);let J,Ee=f.mipmaps,Ue=f.isVideoTexture!==!0,Ge=de.__version===void 0||$===!0,N=ue.dataReady,ce=T(f,ie);if(f.isDepthTexture)pe=E(f.format===ki,f.type),Ge&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,pe,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,pe,ie.width,ie.height,0,he,Le,null));else if(f.isDataTexture)if(Ee.length>0){Ue&&Ge&&t.texStorage2D(i.TEXTURE_2D,ce,pe,Ee[0].width,Ee[0].height);for(let ee=0,fe=Ee.length;ee<fe;ee++)J=Ee[ee],Ue?N&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,J.width,J.height,he,Le,J.data):t.texImage2D(i.TEXTURE_2D,ee,pe,J.width,J.height,0,he,Le,J.data);f.generateMipmaps=!1}else Ue?(Ge&&t.texStorage2D(i.TEXTURE_2D,ce,pe,ie.width,ie.height),N&&se(f,ie,he,Le)):t.texImage2D(i.TEXTURE_2D,0,pe,ie.width,ie.height,0,he,Le,ie.data);else if(f.isCompressedTexture)if(f.isCompressedArrayTexture){Ue&&Ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,pe,Ee[0].width,Ee[0].height,ie.depth);for(let ee=0,fe=Ee.length;ee<fe;ee++)if(J=Ee[ee],f.format!==Ln)if(he!==null)if(Ue){if(N)if(f.layerUpdates.size>0){let _e=Lc(J.width,J.height,f.format,f.type);for(let oe of f.layerUpdates){let Pe=J.data.subarray(oe*_e/J.data.BYTES_PER_ELEMENT,(oe+1)*_e/J.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,oe,J.width,J.height,1,he,Pe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,J.width,J.height,ie.depth,he,J.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ee,pe,J.width,J.height,ie.depth,0,J.data,0,0);else ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,J.width,J.height,ie.depth,he,Le,J.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ee,pe,J.width,J.height,ie.depth,0,he,Le,J.data);f.layerUpdates.size>0&&f.clearLayerUpdates()}else{Ue&&Ge&&t.texStorage2D(i.TEXTURE_2D,ce,pe,Ee[0].width,Ee[0].height);for(let ee=0,fe=Ee.length;ee<fe;ee++)J=Ee[ee],f.format!==Ln?he!==null?Ue?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,ee,0,0,J.width,J.height,he,J.data):t.compressedTexImage2D(i.TEXTURE_2D,ee,pe,J.width,J.height,0,J.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?N&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,J.width,J.height,he,Le,J.data):t.texImage2D(i.TEXTURE_2D,ee,pe,J.width,J.height,0,he,Le,J.data)}else if(f.isDataArrayTexture)if(Ue){if(Ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,pe,ie.width,ie.height,ie.depth),N)if(f.layerUpdates.size>0){let ee=Lc(ie.width,ie.height,f.format,f.type);for(let fe of f.layerUpdates){let _e=ie.data.subarray(fe*ee/ie.data.BYTES_PER_ELEMENT,(fe+1)*ee/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,fe,ie.width,ie.height,1,he,Le,_e)}f.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,he,Le,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,pe,ie.width,ie.height,ie.depth,0,he,Le,ie.data);else if(f.isData3DTexture)Ue?(Ge&&t.texStorage3D(i.TEXTURE_3D,ce,pe,ie.width,ie.height,ie.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,he,Le,ie.data)):t.texImage3D(i.TEXTURE_3D,0,pe,ie.width,ie.height,ie.depth,0,he,Le,ie.data);else if(f.isFramebufferTexture){if(Ge)if(Ue)t.texStorage2D(i.TEXTURE_2D,ce,pe,ie.width,ie.height);else{let ee=ie.width,fe=ie.height;for(let _e=0;_e<ce;_e++)t.texImage2D(i.TEXTURE_2D,_e,pe,ee,fe,0,he,Le,null),ee>>=1,fe>>=1}}else if(f.isHTMLTexture){if("texElementImage2D"in i){let ee=i.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),ie.parentNode!==ee){ee.appendChild(ie),p.add(f),ee.onpaint=fe=>{let _e=fe.changedElements;for(let oe of p)_e.includes(oe.image)&&(oe.needsUpdate=!0)},ee.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ie);else{let _e=i.RGBA,oe=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,_e,oe,Pe,ie)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ee.length>0){if(Ue&&Ge){let ee=ct(Ee[0]);t.texStorage2D(i.TEXTURE_2D,ce,pe,ee.width,ee.height)}for(let ee=0,fe=Ee.length;ee<fe;ee++)J=Ee[ee],Ue?N&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,he,Le,J):t.texImage2D(i.TEXTURE_2D,ee,pe,he,Le,J);f.generateMipmaps=!1}else if(Ue){if(Ge){let ee=ct(ie);t.texStorage2D(i.TEXTURE_2D,ce,pe,ee.width,ee.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,he,Le,ie)}else t.texImage2D(i.TEXTURE_2D,0,pe,he,Le,ie);d(f)&&A(H),de.__version=ue.version,f.onUpdate&&f.onUpdate(f)}M.__version=f.version}function Ve(M,f,O){if(f.image.length!==6)return;let H=lt(M,f),$=f.source;t.bindTexture(i.TEXTURE_CUBE_MAP,M.__webglTexture,i.TEXTURE0+O);let ue=n.get($);if($.version!==ue.__version||H===!0){t.activeTexture(i.TEXTURE0+O);let de=rt.getPrimaries(rt.workingColorSpace),K=f.colorSpace===vi?null:rt.getPrimaries(f.colorSpace),ie=f.colorSpace===vi||de===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,f.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,f.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,f.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let he=f.isCompressedTexture||f.image[0].isCompressedTexture,Le=f.image[0]&&f.image[0].isDataTexture,pe=[];for(let oe=0;oe<6;oe++)!he&&!Le?pe[oe]=m(f.image[oe],!0,s.maxCubemapSize):pe[oe]=Le?f.image[oe].image:f.image[oe],pe[oe]=Nt(f,pe[oe]);let J=pe[0],Ee=r.convert(f.format,f.colorSpace),Ue=r.convert(f.type),Ge=y(f.internalFormat,Ee,Ue,f.normalized,f.colorSpace),N=f.isVideoTexture!==!0,ce=ue.__version===void 0||H===!0,ee=$.dataReady,fe=T(f,J);We(i.TEXTURE_CUBE_MAP,f);let _e;if(he){N&&ce&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ge,J.width,J.height);for(let oe=0;oe<6;oe++){_e=pe[oe].mipmaps;for(let Pe=0;Pe<_e.length;Pe++){let Ce=_e[Pe];f.format!==Ln?Ee!==null?N?ee&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe,0,0,Ce.width,Ce.height,Ee,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe,Ge,Ce.width,Ce.height,0,Ce.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe,0,0,Ce.width,Ce.height,Ee,Ue,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe,Ge,Ce.width,Ce.height,0,Ee,Ue,Ce.data)}}}else{if(_e=f.mipmaps,N&&ce){_e.length>0&&fe++;let oe=ct(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ge,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Le){N?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,pe[oe].width,pe[oe].height,Ee,Ue,pe[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ge,pe[oe].width,pe[oe].height,0,Ee,Ue,pe[oe].data);for(let Pe=0;Pe<_e.length;Pe++){let ht=_e[Pe].image[oe].image;N?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe+1,0,0,ht.width,ht.height,Ee,Ue,ht.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe+1,Ge,ht.width,ht.height,0,Ee,Ue,ht.data)}}else{N?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ee,Ue,pe[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ge,Ee,Ue,pe[oe]);for(let Pe=0;Pe<_e.length;Pe++){let Ce=_e[Pe];N?ee&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe+1,0,0,Ee,Ue,Ce.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Pe+1,Ge,Ee,Ue,Ce.image[oe])}}}d(f)&&A(i.TEXTURE_CUBE_MAP),ue.__version=$.version,f.onUpdate&&f.onUpdate(f)}M.__version=f.version}function ve(M,f,O,H,$,ue){let de=r.convert(O.format,O.colorSpace),K=r.convert(O.type),ie=y(O.internalFormat,de,K,O.normalized,O.colorSpace),he=n.get(f),Le=n.get(O);if(Le.__renderTarget=f,!he.__hasExternalTextures){let pe=Math.max(1,f.width>>ue),J=Math.max(1,f.height>>ue);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,ue,ie,pe,J,f.depth,0,de,K,null):t.texImage2D($,ue,ie,pe,J,0,de,K,null)}t.bindFramebuffer(i.FRAMEBUFFER,M),Rt(f)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,$,Le.__webglTexture,0,St(f)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,$,Le.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function et(M,f,O){if(i.bindRenderbuffer(i.RENDERBUFFER,M),f.depthBuffer){let H=f.depthTexture,$=H&&H.isDepthTexture?H.type:null,ue=E(f.stencilBuffer,$),de=f.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Rt(f)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,St(f),ue,f.width,f.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,St(f),ue,f.width,f.height):i.renderbufferStorage(i.RENDERBUFFER,ue,f.width,f.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,M)}else{let H=f.textures;for(let $=0;$<H.length;$++){let ue=H[$],de=r.convert(ue.format,ue.colorSpace),K=r.convert(ue.type),ie=y(ue.internalFormat,de,K,ue.normalized,ue.colorSpace);Rt(f)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,St(f),ie,f.width,f.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,St(f),ie,f.width,f.height):i.renderbufferStorage(i.RENDERBUFFER,ie,f.width,f.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(M,f,O){let H=f.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,M),!(f.depthTexture&&f.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(f.depthTexture);if($.__renderTarget=f,(!$.__webglTexture||f.depthTexture.image.width!==f.width||f.depthTexture.image.height!==f.height)&&(f.depthTexture.image.width=f.width,f.depthTexture.image.height=f.height,f.depthTexture.needsUpdate=!0),H){if($.__webglInit===void 0&&($.__webglInit=!0,f.depthTexture.addEventListener("dispose",I)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),We(i.TEXTURE_CUBE_MAP,f.depthTexture);let he=r.convert(f.depthTexture.format),Le=r.convert(f.depthTexture.type),pe;f.depthTexture.format===Zn?pe=i.DEPTH_COMPONENT24:f.depthTexture.format===ki&&(pe=i.DEPTH24_STENCIL8);for(let J=0;J<6;J++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,pe,f.width,f.height,0,he,Le,null)}}else W(f.depthTexture,0);let ue=$.__webglTexture,de=St(f),K=H?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,ie=f.depthTexture.format===ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(f.depthTexture.format===Zn)Rt(f)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,K,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,ie,K,ue,0);else if(f.depthTexture.format===ki)Rt(f)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,K,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,ie,K,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Xe(M){let f=n.get(M),O=M.isWebGLCubeRenderTarget===!0;if(f.__boundDepthTexture!==M.depthTexture){let H=M.depthTexture;if(f.__depthDisposeCallback&&f.__depthDisposeCallback(),H){let $=()=>{delete f.__boundDepthTexture,delete f.__depthDisposeCallback,H.removeEventListener("dispose",$)};H.addEventListener("dispose",$),f.__depthDisposeCallback=$}f.__boundDepthTexture=H}if(M.depthTexture&&!f.__autoAllocateDepthBuffer)if(O)for(let H=0;H<6;H++)Pt(f.__webglFramebuffer[H],M,H);else{let H=M.texture.mipmaps;H&&H.length>0?Pt(f.__webglFramebuffer[0],M,0):Pt(f.__webglFramebuffer,M,0)}else if(O){f.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(i.FRAMEBUFFER,f.__webglFramebuffer[H]),f.__webglDepthbuffer[H]===void 0)f.__webglDepthbuffer[H]=i.createRenderbuffer(),et(f.__webglDepthbuffer[H],M,!1);else{let $=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=f.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ue)}}else{let H=M.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(i.FRAMEBUFFER,f.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,f.__webglFramebuffer),f.__webglDepthbuffer===void 0)f.__webglDepthbuffer=i.createRenderbuffer(),et(f.__webglDepthbuffer,M,!1);else{let $=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=f.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function qe(M,f,O){let H=n.get(M);f!==void 0&&ve(H.__webglFramebuffer,M,M.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Xe(M)}function yt(M){let f=M.texture,O=n.get(M),H=n.get(f);M.addEventListener("dispose",x);let $=M.textures,ue=M.isWebGLCubeRenderTarget===!0,de=$.length>1;if(de||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=f.version,a.memory.textures++),ue){O.__webglFramebuffer=[];for(let K=0;K<6;K++)if(f.mipmaps&&f.mipmaps.length>0){O.__webglFramebuffer[K]=[];for(let ie=0;ie<f.mipmaps.length;ie++)O.__webglFramebuffer[K][ie]=i.createFramebuffer()}else O.__webglFramebuffer[K]=i.createFramebuffer()}else{if(f.mipmaps&&f.mipmaps.length>0){O.__webglFramebuffer=[];for(let K=0;K<f.mipmaps.length;K++)O.__webglFramebuffer[K]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(de)for(let K=0,ie=$.length;K<ie;K++){let he=n.get($[K]);he.__webglTexture===void 0&&(he.__webglTexture=i.createTexture(),a.memory.textures++)}if(M.samples>0&&Rt(M)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let K=0;K<$.length;K++){let ie=$[K];O.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[K]);let he=r.convert(ie.format,ie.colorSpace),Le=r.convert(ie.type),pe=y(ie.internalFormat,he,Le,ie.normalized,ie.colorSpace,M.isXRRenderTarget===!0),J=St(M);i.renderbufferStorageMultisample(i.RENDERBUFFER,J,pe,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,O.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),M.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),et(O.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),We(i.TEXTURE_CUBE_MAP,f);for(let K=0;K<6;K++)if(f.mipmaps&&f.mipmaps.length>0)for(let ie=0;ie<f.mipmaps.length;ie++)ve(O.__webglFramebuffer[K][ie],M,f,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ie);else ve(O.__webglFramebuffer[K],M,f,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);d(f)&&A(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let K=0,ie=$.length;K<ie;K++){let he=$[K],Le=n.get(he),pe=i.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(pe=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,Le.__webglTexture),We(pe,he),ve(O.__webglFramebuffer,M,he,i.COLOR_ATTACHMENT0+K,pe,0),d(he)&&A(pe)}t.unbindTexture()}else{let K=i.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(K=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(K,H.__webglTexture),We(K,f),f.mipmaps&&f.mipmaps.length>0)for(let ie=0;ie<f.mipmaps.length;ie++)ve(O.__webglFramebuffer[ie],M,f,i.COLOR_ATTACHMENT0,K,ie);else ve(O.__webglFramebuffer,M,f,i.COLOR_ATTACHMENT0,K,0);d(f)&&A(K),t.unbindTexture()}M.depthBuffer&&Xe(M)}function it(M){let f=M.textures;for(let O=0,H=f.length;O<H;O++){let $=f[O];if(d($)){let ue=D(M),de=n.get($).__webglTexture;t.bindTexture(ue,de),A(ue),t.unbindTexture()}}}let Tt=[],Dt=[];function Vt(M){if(M.samples>0){if(Rt(M)===!1){let f=M.textures,O=M.width,H=M.height,$=i.COLOR_BUFFER_BIT,ue=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(M),K=f.length>1;if(K)for(let he=0;he<f.length;he++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let ie=M.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let he=0;he<f.length;he++){if(M.resolveDepthBuffer&&(M.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),K){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[he]);let Le=n.get(f[he]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Le,0)}i.blitFramebuffer(0,0,O,H,0,0,O,H,$,i.NEAREST),l===!0&&(Tt.length=0,Dt.length=0,Tt.push(i.COLOR_ATTACHMENT0+he),M.depthBuffer&&M.storeMultisampledDepthBuffer===!1&&(Tt.push(ue),Dt.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Tt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let he=0;he<f.length;he++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,de.__webglColorRenderbuffer[he]);let Le=n.get(f[he]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,Le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.storeMultisampledDepthBuffer===!1&&l){let f=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[f])}}}function St(M){return Math.min(s.maxSamples,M.samples)}function Rt(M){let f=n.get(M);return M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&f.__useRenderToTexture!==!1}function U(M){let f=a.render.frame;u.get(M)!==f&&(u.set(M,f),M.update())}function Nt(M,f){let O=M.colorSpace,H=M.format,$=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||O!==Tr&&O!==vi&&(rt.getTransfer(O)===gt?(H!==Ln||$!==xn)&&ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",O)),f}function ct(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(c.width=M.displayWidth,c.height=M.displayHeight):(c.width=M.width,c.height=M.height),c}this.allocateTextureUnit=te,this.resetTextureUnits=z,this.getTextureUnits=P,this.setTextureUnits=X,this.setTexture2D=W,this.setTexture2DArray=Z,this.setTexture3D=re,this.setTextureCube=ae,this.rebindTextures=qe,this.setupRenderTarget=yt,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=Rt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function r_(i,e){function t(n,s=vi){let r,a=rt.getTransfer(s);if(n===xn)return i.UNSIGNED_BYTE;if(n===bo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Eo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Mc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===bc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===yc)return i.BYTE;if(n===Sc)return i.SHORT;if(n===nr)return i.UNSIGNED_SHORT;if(n===Mo)return i.INT;if(n===Gn)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===Ec)return i.ALPHA;if(n===Tc)return i.RGB;if(n===Ln)return i.RGBA;if(n===Zn)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===To)return i.RED;if(n===Ao)return i.RED_INTEGER;if(n===Vi)return i.RG;if(n===wo)return i.RG_INTEGER;if(n===Ro)return i.RGBA_INTEGER;if(n===Qr||n===ea||n===ta||n===na)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===na)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Co||n===Io||n===Po||n===Lo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Co)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Io)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Po)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Lo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Do||n===No||n===Uo||n===Fo||n===Oo||n===ia||n===Bo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Do||n===No)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Uo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fo)return r.COMPRESSED_R11_EAC;if(n===Oo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ia)return r.COMPRESSED_RG11_EAC;if(n===Bo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===zo||n===ko||n===Vo||n===Go||n===Ho||n===Wo||n===Xo||n===qo||n===Yo||n===$o||n===Zo||n===Jo||n===Ko||n===jo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ko)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Go)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ho)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$o)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ko)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qo||n===el||n===tl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qo)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===el)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===tl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nl||n===il||n===sa||n===sl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===nl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===il)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ir?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var a_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,o_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Vr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Mn({vertexShader:a_,fragmentShader:o_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new on(new ss(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jc=class extends Jn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,p=null,h=null,g=null,_=null,S=typeof XRWebGLBinding<"u",m=new Kc,d={},A=t.getContextAttributes(),D=null,y=null,E=[],T=[],I=new $e,x=null,b=null,C=new un;C.viewport=new It;let R=new un;R.viewport=new It;let F=[C,R],z=new _o,P=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let se=E[j];return se===void 0&&(se=new Hs,E[j]=se),se.getTargetRaySpace()},this.getControllerGrip=function(j){let se=E[j];return se===void 0&&(se=new Hs,E[j]=se),se.getGripSpace()},this.getHand=function(j){let se=E[j];return se===void 0&&(se=new Hs,E[j]=se),se.getHandSpace()};function te(j){let se=T.indexOf(j.inputSource);if(se===-1)return;let be=E[se];be!==void 0&&(be.update(j.inputSource,j.frame,c||a),be.dispatchEvent({type:j.type,data:j.inputSource}))}function Y(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",W);for(let j=0;j<E.length;j++){let se=T[j];se!==null&&(T[j]=null,E[j].disconnect(se))}P=null,X=null,m.reset();for(let j in d)delete d[j];if(e.setRenderTarget(D),g=null,h=null,p=null,s=null,y=null,lt.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(I.width,I.height,!1),b!==null){let j=b.camera;j.fov=b.fov,j.zoom=b.zoom,j.updateProjectionMatrix(),b=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return h!==null?h:g},this.getBinding=function(){return p===null&&S&&(p=new XRWebGLBinding(s,t)),p},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(D=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",W),A.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(I),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,Ve=null,ve=null;A.depth&&(ve=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=A.stencil?ki:Zn,Ve=A.stencil?ir:Gn);let et={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};p=this.getBinding(),h=p.createProjectionLayer(et),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new _n(h.textureWidth,h.textureHeight,{format:Ln,type:xn,depthTexture:new Pi(h.textureWidth,h.textureHeight,Ve,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let be={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),y=new _n(g.framebufferWidth,g.framebufferHeight,{format:Ln,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),lt.setContext(s),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(j){for(let se=0;se<j.removed.length;se++){let be=j.removed[se],Ve=T.indexOf(be);Ve>=0&&(T[Ve]=null,E[Ve].disconnect(be))}for(let se=0;se<j.added.length;se++){let be=j.added[se],Ve=T.indexOf(be);if(Ve===-1){for(let et=0;et<E.length;et++)if(et>=T.length){T.push(be),Ve=et;break}else if(T[et]===null){T[et]=be,Ve=et;break}if(Ve===-1)break}let ve=E[Ve];ve&&ve.connect(be)}}let Z=new k,re=new k;function ae(j,se,be){Z.setFromMatrixPosition(se.matrixWorld),re.setFromMatrixPosition(be.matrixWorld);let Ve=Z.distanceTo(re),ve=se.projectionMatrix.elements,et=be.projectionMatrix.elements,Pt=ve[14]/(ve[10]-1),Xe=ve[14]/(ve[10]+1),qe=(ve[9]+1)/ve[5],yt=(ve[9]-1)/ve[5],it=(ve[8]-1)/ve[0],Tt=(et[8]+1)/et[0],Dt=Pt*it,Vt=Pt*Tt,St=Ve/(-it+Tt),Rt=St*-it;if(se.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Rt),j.translateZ(St),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),ve[10]===-1)j.projectionMatrix.copy(se.projectionMatrix),j.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let U=Pt+St,Nt=Xe+St,ct=Dt-Rt,M=Vt+(Ve-Rt),f=qe*Xe/Nt*U,O=yt*Xe/Nt*U;j.projectionMatrix.makePerspective(ct,M,f,O,U,Nt),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Fe(j,se){se===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(se.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let se=j.near,be=j.far;m.texture!==null&&(m.depthNear>0&&(se=m.depthNear),m.depthFar>0&&(be=m.depthFar)),z.near=R.near=C.near=se,z.far=R.far=C.far=be,(P!==z.near||X!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),P=z.near,X=z.far),z.layers.mask=j.layers.mask|6,C.layers.mask=z.layers.mask&-5,R.layers.mask=z.layers.mask&-3;let Ve=j.parent,ve=z.cameras;Fe(z,Ve);for(let et=0;et<ve.length;et++)Fe(ve[et],Ve);ve.length===2?ae(z,C,R):z.projectionMatrix.copy(C.projectionMatrix),b===null&&j.isPerspectiveCamera&&(b={camera:j,fov:j.fov,zoom:j.zoom}),De(j,z,Ve)};function De(j,se,be){be===null?j.matrix.copy(se.matrixWorld):(j.matrix.copy(be.matrixWorld),j.matrix.invert(),j.matrix.multiply(se.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(se.projectionMatrix),j.projectionMatrixInverse.copy(se.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=ks*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&g===null))return l},this.setFoveation=function(j){l=j,h!==null&&(h.fixedFoveation=j),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(j){return d[j]};let vt=null;function We(j,se){if(u=se.getViewerPose(c||a),_=se,u!==null){let be=u.views;g!==null&&(e.setRenderTargetFramebuffer(y,g.framebuffer),e.setRenderTarget(y));let Ve=!1;be.length!==z.cameras.length&&(z.cameras.length=0,Ve=!0);for(let Xe=0;Xe<be.length;Xe++){let qe=be[Xe],yt=null;if(g!==null)yt=g.getViewport(qe);else{let Tt=p.getViewSubImage(h,qe);yt=Tt.viewport,Xe===0&&(e.setRenderTargetTextures(y,Tt.colorTexture,Tt.depthStencilTexture),e.setRenderTarget(y))}let it=F[Xe];it===void 0&&(it=new un,it.layers.enable(Xe),it.viewport=new It,F[Xe]=it),it.matrix.fromArray(qe.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(qe.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(yt.x,yt.y,yt.width,yt.height),Xe===0&&(z.matrix.copy(it.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ve===!0&&z.cameras.push(it)}let ve=s.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){p=n.getBinding();let Xe=p.getDepthInformation(be[0]);Xe&&Xe.isValid&&Xe.texture&&m.init(Xe,s.renderState)}if(ve&&ve.includes("camera-access")&&S){e.state.unbindTexture(),p=n.getBinding();for(let Xe=0;Xe<be.length;Xe++){let qe=be[Xe].camera;if(qe){let yt=d[qe];yt||(yt=new Vr,d[qe]=yt);let it=p.getCameraImage(qe);yt.sourceTexture=it}}}}for(let be=0;be<E.length;be++){let Ve=T[be],ve=E[be];Ve!==null&&ve!==void 0&&ve.update(Ve,se,c||a)}vt&&vt(j,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),_=null}let lt=new sd;lt.setAnimationLoop(We),this.setAnimationLoop=function(j){vt=j},this.dispose=function(){}}},l_=new mt,hd=new Ze;hd.set(-1,0,0,0,1,0,0,0,1);function c_(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Cc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,A,D,y){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?r(m,d):d.isMeshLambertMaterial?(r(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(m,d),p(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(m,d),h(m,d),d.isMeshPhysicalMaterial&&g(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),S(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,A,D):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===fn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===fn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let A=e.get(d),D=A.envMap,y=A.envMapRotation;D&&(m.envMap.value=D,m.envMapRotation.value.setFromMatrix4(l_.makeRotationFromEuler(y)).transpose(),D.isCubeTexture&&D.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(hd),m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,A,D){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*A,m.scale.value=D*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function p(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function g(m,d,A){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===fn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.retroreflectivity>0&&(m.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function S(m,d){let A=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function h_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,E){let T=E.program;n.uniformBlockBinding(y,T)}function c(y,E){let T=s[y.id];T===void 0&&(m(y),T=u(y),s[y.id]=T,y.addEventListener("dispose",A));let I=E.program;n.updateUBOMapping(y,I);let x=e.render.frame;r[y.id]!==x&&(h(y),r[y.id]=x)}function u(y){let E=p();y.__bindingPointIndex=E;let T=i.createBuffer(),I=y.__size,x=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,I,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,T),T}function p(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){let E=s[y.id],T=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let x=0,b=T.length;x<b;x++){let C=T[x];if(Array.isArray(C))for(let R=0,F=C.length;R<F;R++)g(C[R],x,R,I);else g(C,x,0,I)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(y,E,T,I){if(S(y,E,T,I)===!0){let x=y.__offset,b=y.value;if(Array.isArray(b)){let C=0;for(let R=0;R<b.length;R++){let F=b[R],z=d(F);_(F,y.__data,C),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(C+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(b,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,y.__data)}}function _(y,E,T){typeof y=="number"||typeof y=="boolean"?E[0]=y:y.isMatrix3?(E[0]=y.elements[0],E[1]=y.elements[1],E[2]=y.elements[2],E[3]=0,E[4]=y.elements[3],E[5]=y.elements[4],E[6]=y.elements[5],E[7]=0,E[8]=y.elements[6],E[9]=y.elements[7],E[10]=y.elements[8],E[11]=0):ArrayBuffer.isView(y)?E.set(new y.constructor(y.buffer,y.byteOffset,E.length)):y.toArray(E,T)}function S(y,E,T,I){let x=y.value,b=E+"_"+T;if(I[b]===void 0)return typeof x=="number"||typeof x=="boolean"?I[b]=x:ArrayBuffer.isView(x)?I[b]=x.slice():I[b]=x.clone(),!0;{let C=I[b];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return I[b]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function m(y){let E=y.uniforms,T=0,I=16;for(let b=0,C=E.length;b<C;b++){let R=Array.isArray(E[b])?E[b]:[E[b]];for(let F=0,z=R.length;F<z;F++){let P=R[F],X=Array.isArray(P.value)?P.value:[P.value];for(let te=0,Y=X.length;te<Y;te++){let W=X[te],Z=d(W),re=T%I,ae=re%Z.boundary,Fe=re+ae;T+=ae,Fe!==0&&I-Fe<Z.storage&&(T+=I-Fe),P.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=T,T+=Z.storage}}}let x=T%I;return x>0&&(T+=I-x),y.__size=T,y.__cache={},this}function d(y){let E={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(E.boundary=4,E.storage=4):y.isVector2?(E.boundary=8,E.storage=8):y.isVector3||y.isColor?(E.boundary=16,E.storage=12):y.isVector4?(E.boundary=16,E.storage=16):y.isMatrix3?(E.boundary=48,E.storage=48):y.isMatrix4?(E.boundary=64,E.storage=64):y.isTexture?ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(E.boundary=16,E.storage=y.byteLength):ze("WebGLRenderer: Unsupported uniform value type.",y),E}function A(y){let E=y.target;E.removeEventListener("dispose",A);let T=a.indexOf(E.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function D(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:D}}var u_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ti=null;function d_(){return ti===null&&(ti=new Fr(u_,16,16,Vi,Hn),ti.name="DFG_LUT",ti.minFilter=Kt,ti.magFilter=Kt,ti.wrapS=$n,ti.wrapT=$n,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}var dl=class{constructor(e={}){let{canvas:t=Ru(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:g=xn}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;let S=g,m=new Set([Ro,wo,Ao]),d=new Set([xn,Gn,nr,ir,bo,Eo]),A=new Uint32Array(4),D=new Int32Array(4),y=new k,E=null,T=null,I=[],x=[],b=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,R=!1,F=null,z=null,P=null,X=null;this._outputColorSpace=rn;let te=0,Y=0,W=null,Z=-1,re=null,ae=new It,Fe=new It,De=null,vt=new Qe(0),We=0,lt=t.width,j=t.height,se=1,be=null,Ve=null,ve=new It(0,0,lt,j),et=new It(0,0,lt,j),Pt=!1,Xe=new qs,qe=!1,yt=!1,it=new mt,Tt=new k,Dt=new It,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},St=!1;function Rt(){return W===null?se:1}let U=n;function Nt(v,L){return t.getContext(v,L)}let ct,M,f,O,H,$,ue,de,K,ie,he,Le,pe,J,Ee,Ue,Ge,N,ce,ee,fe,_e,oe;try{let v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",ht,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",Zt,!1),U===null){let L="webgl2";if(U=Nt(L,v),U===null)throw Nt(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Pe()}catch(v){throw t.removeEventListener("webglcontextlost",ht,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",Zt,!1),Be("WebGLRenderer: "+v.message),v}function Pe(){ct=new vg(U),ct.init(),fe=new r_(U,ct),M=new cg(U,ct,e,fe),f=new i_(U,ct),M.reversedDepthBuffer&&h&&f.buffers.depth.setReversed(!0),z=U.createFramebuffer(),P=U.createFramebuffer(),X=U.createFramebuffer(),O=new Mg(U),H=new H0,$=new s_(U,ct,f,H,M,fe,O),ue=new xg(C),de=new Ef(U),_e=new og(U,de),K=new yg(U,de,O,_e),ie=new Eg(U,K,de,_e,O),N=new bg(U,M,$),Ee=new hg(H),he=new G0(C,ue,ct,M,_e,Ee),Le=new c_(C,H),pe=new X0,J=new K0(ct),Ge=new ag(C,ue,f,ie,_,l),Ue=new n_(C,ie,M),oe=new h_(U,O,M,f),ce=new lg(U,ct,O),ee=new Sg(U,ct,O),O.programs=he.programs,C.capabilities=M,C.extensions=ct,C.properties=H,C.renderLists=pe,C.shadowMap=Ue,C.state=f,C.info=O}S!==xn&&(b=new Ag(S,t.width,t.height,o,s,r));let Ce=new jc(C,U);this.xr=Ce,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let v=ct.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=ct.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(v){v!==void 0&&(se=v,this.setSize(lt,j,!1))},this.getSize=function(v){return v.set(lt,j)},this.setSize=function(v,L,q=!0){if(Ce.isPresenting){ze("WebGLRenderer: Can't change size while VR device is presenting.");return}lt=v,j=L,t.width=Math.floor(v*se),t.height=Math.floor(L*se),q===!0&&(t.style.width=v+"px",t.style.height=L+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(lt*se,j*se).floor()},this.setDrawingBufferSize=function(v,L,q){lt=v,j=L,se=q,t.width=Math.floor(v*q),t.height=Math.floor(L*q),this.setViewport(0,0,v,L)},this.setEffects=function(v){if(S===xn){Be("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let L=0;L<v.length;L++)if(v[L].isOutputPass===!0){ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(ae)},this.getViewport=function(v){return v.copy(ve)},this.setViewport=function(v,L,q,V){v.isVector4?ve.set(v.x,v.y,v.z,v.w):ve.set(v,L,q,V),f.viewport(ae.copy(ve).multiplyScalar(se).round())},this.getScissor=function(v){return v.copy(et)},this.setScissor=function(v,L,q,V){v.isVector4?et.set(v.x,v.y,v.z,v.w):et.set(v,L,q,V),f.scissor(Fe.copy(et).multiplyScalar(se).round())},this.getScissorTest=function(){return Pt},this.setScissorTest=function(v){f.setScissorTest(Pt=v)},this.setOpaqueSort=function(v){be=v},this.setTransparentSort=function(v){Ve=v},this.getClearColor=function(v){return v.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,q=!0){let V=0;if(v){let G=!1;if(W!==null){let ge=W.texture.format;G=m.has(ge)}if(G){let ge=W.texture.type,Se=d.has(ge),me=Ge.getClearColor(),we=Ge.getClearAlpha(),Ae=me.r,Je=me.g,nt=me.b;Se?(A[0]=Ae,A[1]=Je,A[2]=nt,A[3]=we,U.clearBufferuiv(U.COLOR,0,A)):(D[0]=Ae,D[1]=Je,D[2]=nt,D[3]=we,U.clearBufferiv(U.COLOR,0,D))}else V|=U.COLOR_BUFFER_BIT}L&&(V|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(V|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&U.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),F=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ht,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",Zt,!1),Ge.dispose(),pe.dispose(),J.dispose(),H.dispose(),ue.dispose(),ie.dispose(),_e.dispose(),oe.dispose(),he.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",Gt),Ce.removeEventListener("sessionend",Mi),en.stop()};function ht(v){v.preventDefault(),Rr("WebGLRenderer: Context Lost."),R=!0}function ut(){Rr("WebGLRenderer: Context Restored."),R=!1;let v=O.autoReset,L=Ue.enabled,q=Ue.autoUpdate,V=Ue.needsUpdate,G=Ue.type;Pe(),O.autoReset=v,Ue.enabled=L,Ue.autoUpdate=q,Ue.needsUpdate=V,Ue.type=G}function Zt(v){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Qt(v){let L=v.target;L.removeEventListener("dispose",Qt),Gi(L)}function Gi(v){Hi(v),H.remove(v)}function Hi(v){let L=H.get(v).programs;L!==void 0&&(L.forEach(function(q){he.releaseProgram(q)}),v.isShaderMaterial&&he.releaseShaderCache(v))}this.renderBufferDirect=function(v,L,q,V,G,ge){L===null&&(L=Vt);let Se=G.isMesh&&G.matrixWorld.determinantAffine()<0,me=ds(v,L,q,V,G);f.setMaterial(V,Se);let we=q.index,Ae=1;if(V.wireframe===!0){if(we=K.getWireframeAttribute(q),we===void 0)return;Ae=2}let Je=q.drawRange,nt=q.attributes.position,Re=Je.start*Ae,dt=(Je.start+Je.count)*Ae;ge!==null&&(Re=Math.max(Re,ge.start*Ae),dt=Math.min(dt,(ge.start+ge.count)*Ae)),we!==null?(Re=Math.max(Re,0),dt=Math.min(dt,we.count)):nt!=null&&(Re=Math.max(Re,0),dt=Math.min(dt,nt.count));let Lt=dt-Re;if(Lt<0||Lt===1/0)return;_e.setup(G,V,me,q,we);let Mt,_t=ce;if(we!==null&&(Mt=de.get(we),_t=ee,_t.setIndex(Mt)),G.isMesh)V.wireframe===!0?(f.setLineWidth(V.wireframeLinewidth*Rt()),_t.setMode(U.LINES)):_t.setMode(U.TRIANGLES);else if(G.isLine){let Ot=V.linewidth;Ot===void 0&&(Ot=1),f.setLineWidth(Ot*Rt()),G.isLineSegments?_t.setMode(U.LINES):G.isLineLoop?_t.setMode(U.LINE_LOOP):_t.setMode(U.LINE_STRIP)}else G.isPoints?_t.setMode(U.POINTS):G.isSprite&&_t.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))_t.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Ot=G._multiDrawStarts,Me=G._multiDrawCounts,Bt=G._multiDrawCount,ot=we?de.get(we).bytesPerElement:1,Ut=H.get(V).currentProgram.getUniforms();for(let Tn=0;Tn<Bt;Tn++)Ut.setValue(U,"_gl_DrawID",Tn),_t.render(Ot[Tn]/ot,Me[Tn])}else if(G.isInstancedMesh)_t.renderInstances(Re,Lt,G.count);else if(q.isInstancedBufferGeometry){let Ot=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Me=Math.min(q.instanceCount,Ot);_t.renderInstances(Re,Lt,Me)}else _t.render(Re,Lt)};function Wn(v,L,q,V){F!==null&&v.isNodeMaterial&&F.setObject(V,v),qe===!0&&Ee.setState(v,q,!1),v.transparent===!0&&v.side===In&&v.forceSinglePass===!1?(v.side=fn,v.needsUpdate=!0,bi(v,L,V),v.side=Oi,v.needsUpdate=!0,bi(v,L,V),v.side=In):bi(v,L,V)}this.compile=function(v,L,q=null){q===null&&(q=v),F!==null&&F.renderStart(v,L,q),T=J.get(q),T.init(L),x.push(T),q.traverseVisible(function(G){G.isLight&&G.layers.test(L.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),v!==q&&v.traverseVisible(function(G){G.isLight&&G.layers.test(L.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),yt=this.localClippingEnabled,qe=Ee.init(this.clippingPlanes,yt),qe===!0&&Ee.setGlobalState(this.clippingPlanes,L),F!==null&&Ue.render(T.state.shadowsArray,q,L);let V=new Set;return v.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let ge=G.material;if(ge)if(Array.isArray(ge))for(let Se=0;Se<ge.length;Se++){let me=ge[Se];Wn(me,q,L,G),V.add(me)}else Wn(ge,q,L,G),V.add(ge)}),T=x.pop(),F!==null&&F.renderEnd(),V},this.compileAsync=function(v,L,q=null){let V=this.compile(v,L,q);return new Promise(G=>{function ge(){if(V.forEach(function(Se){let we=H.get(Se).currentProgram;(we===void 0||we.isReady())&&V.delete(Se)}),V.size===0){G(v);return}setTimeout(ge,10)}ct.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let oi=null;function Si(v){oi&&oi(v)}function Gt(){en.stop()}function Mi(){en.start()}let en=new sd;en.setAnimationLoop(Si),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(v){oi=v,Ce.setAnimationLoop(v),v===null?en.stop():en.start()},Ce.addEventListener("sessionstart",Gt),Ce.addEventListener("sessionend",Mi),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;F!==null&&F.renderStart(v,L);let q=Ce.enabled===!0&&Ce.isPresenting===!0,V=b!==null&&(W===null||q)&&b.begin(C,W);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(L),L=Ce.getCamera()),v.isScene===!0&&v.onBeforeRender(C,v,L,W),T=J.get(v,x.length),T.init(L),T.state.textureUnits=$.getTextureUnits(),x.push(T),it.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Xe.setFromProjectionMatrix(it,kn,L.reversedDepth),yt=this.localClippingEnabled,qe=Ee.init(this.clippingPlanes,yt),E=pe.get(v,I.length),E.init(),I.push(E),Ce.enabled===!0&&Ce.isPresenting===!0){let Se=C.xr.getDepthSensingMesh();Se!==null&&Xn(Se,L,-1/0,C.sortObjects)}Xn(v,L,0,C.sortObjects),E.finish(),F!==null&&F.updateLights(T.state.lightsArray),C.sortObjects===!0&&E.sort(be,Ve),St=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,St&&Ge.addToRenderList(E,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),qe===!0&&Ee.beginShadows();let G=T.state.shadowsArray;if(Ue.render(G,v,L),qe===!0&&Ee.endShadows(),(V&&b.hasRenderPass())===!1){let Se=E.opaque,me=E.transmissive;if(T.setupLights(),L.isArrayCamera){let we=L.cameras;if(me.length>0)for(let Ae=0,Je=we.length;Ae<Je;Ae++){let nt=we[Ae];hr(Se,me,v,nt)}St&&Ge.render(v);for(let Ae=0,Je=we.length;Ae<Je;Ae++){let nt=we[Ae];Wi(E,v,nt,nt.viewport)}}else me.length>0&&hr(Se,me,v,L),St&&Ge.render(v),Wi(E,v,L)}W!==null&&Y===0&&($.updateMultisampleRenderTarget(W),$.updateRenderTargetMipmap(W)),V&&b.end(C),v.isScene===!0&&v.onAfterRender(C,v,L),_e.resetDefaultState(),Z=-1,re=null,x.pop(),x.length>0?(T=x[x.length-1],$.setTextureUnits(T.state.textureUnits),qe===!0&&Ee.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,I.pop(),I.length>0?E=I[I.length-1]:E=null,F!==null&&F.renderEnd()};function Xn(v,L,q,V){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)q=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(L);else if(v.isLightProbeGrid)T.pushLightProbeGrid(v);else if(v.isLight)T.pushLight(v),v.castShadow&&T.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Xe)){V&&Dt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(it);let Se=ie.update(v),me=v.material;me.visible&&E.push(v,Se,me,q,Dt.z,null,L)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Xe))){let Se=ie.update(v),me=v.material;if(V&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Dt.copy(v.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Dt.copy(Se.boundingSphere.center)),Dt.applyMatrix4(v.matrixWorld).applyMatrix4(it)),Array.isArray(me)){let we=Se.groups;for(let Ae=0,Je=we.length;Ae<Je;Ae++){let nt=we[Ae],Re=me[nt.materialIndex];Re&&Re.visible&&E.push(v,Se,Re,q,Dt.z,nt,L)}}else me.visible&&E.push(v,Se,me,q,Dt.z,null,L)}}let ge=v.children;for(let Se=0,me=ge.length;Se<me;Se++)Xn(ge[Se],L,q,V)}function Wi(v,L,q,V){let{opaque:G,transmissive:ge,transparent:Se}=v;T.setupLightsView(q),qe===!0&&Ee.setGlobalState(C.clippingPlanes,q),V&&f.viewport(ae.copy(V)),G.length>0&&Xi(G,L,q),ge.length>0&&Xi(ge,L,q),Se.length>0&&Xi(Se,L,q),f.buffers.depth.setTest(!0),f.buffers.depth.setMask(!0),f.buffers.color.setMask(!0),f.setPolygonOffset(!1)}function hr(v,L,q,V){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){let Re=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new _n(1,1,{generateMipmaps:!0,type:Re?Hn:xn,minFilter:zi,samples:Math.max(4,M.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}let ge=T.state.transmissionRenderTarget[V.id],Se=V.viewport||ae;ge.setSize(Se.z*C.transmissionResolutionScale,Se.w*C.transmissionResolutionScale);let me=C.getRenderTarget(),we=C.getActiveCubeFace(),Ae=C.getActiveMipmapLevel();C.setRenderTarget(ge),C.getClearColor(vt),We=C.getClearAlpha(),We<1&&C.setClearColor(16777215,.5),C.clear(),St&&Ge.render(q);let Je=C.toneMapping;C.toneMapping=Vn;let nt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),qe===!0&&Ee.setGlobalState(C.clippingPlanes,V),Xi(v,q,V),$.updateMultisampleRenderTarget(ge),$.updateRenderTargetMipmap(ge),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let dt=0,Lt=L.length;dt<Lt;dt++){let Mt=L[dt],{object:_t,geometry:Ot,material:Me,group:Bt}=Mt;if(Me.side===In&&_t.layers.test(V.layers)){let ot=Me.side;Me.side=fn,Me.needsUpdate=!0,ha(_t,q,V,Ot,Me,Bt),Me.side=ot,Me.needsUpdate=!0,Re=!0}}Re===!0&&($.updateMultisampleRenderTarget(ge),$.updateRenderTargetMipmap(ge))}C.setRenderTarget(me,we,Ae),C.setClearColor(vt,We),nt!==void 0&&(V.viewport=nt),C.toneMapping=Je}function Xi(v,L,q){let V=L.isScene===!0?L.overrideMaterial:null;for(let G=0,ge=v.length;G<ge;G++){let Se=v[G],{object:me,geometry:we,group:Ae}=Se,Je=Se.material;Je.allowOverride===!0&&V!==null&&(Je=V),me.layers.test(q.layers)&&ha(me,L,q,we,Je,Ae)}}function ha(v,L,q,V,G,ge){F!==null&&G.isNodeMaterial&&F.setObject(v,G),v.onBeforeRender(C,L,q,V,G,ge),v.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),G.onBeforeRender(C,L,q,V,v,ge),G.transparent===!0&&G.side===In&&G.forceSinglePass===!1?(G.side=fn,G.needsUpdate=!0,C.renderBufferDirect(q,L,V,G,v,ge),G.side=Oi,G.needsUpdate=!0,C.renderBufferDirect(q,L,V,G,v,ge),G.side=In):C.renderBufferDirect(q,L,V,G,v,ge),v.onAfterRender(C,L,q,V,G,ge)}function bi(v,L,q){L.isScene!==!0&&(L=Vt);let V=H.get(v),G=T.state.lights,ge=T.state.shadowsArray,Se=G.state.version,me=he.getParameters(v,G.state,ge,L,q,T.state.lightProbeGridArray),we=he.getProgramCacheKey(me),Ae=V.programs;V.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,V.fog=L.fog;let Je=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;V.envMap=ue.get(v.envMap||V.environment,Je),V.envMapRotation=V.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",Qt),Ae=new Map,V.programs=Ae);let nt=Ae.get(we);if(nt!==void 0){if(V.currentProgram===nt&&V.lightsStateVersion===Se)return Yi(v,me),nt}else me.uniforms=he.getUniforms(v),F!==null&&v.isNodeMaterial&&F.build(v,q,me),v.onBeforeCompile(me,C),nt=he.acquireProgram(me,we),Ae.set(we,nt),V.uniforms=me.uniforms;let Re=V.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Re.clippingPlanes=Ee.uniform),Yi(v,me),V.needsLights=Ei(v),V.lightsStateVersion=Se,V.needsLights&&(Re.ambientLightColor.value=G.state.ambient,Re.lightProbe.value=G.state.probe,Re.sunLights.value=G.state.sun,Re.sunLightShadows.value=G.state.sunShadow,Re.directionalLights.value=G.state.directional,Re.directionalLightShadows.value=G.state.directionalShadow,Re.spotLights.value=G.state.spot,Re.spotLightShadows.value=G.state.spotShadow,Re.rectAreaLights.value=G.state.rectArea,Re.ltc_1.value=G.state.rectAreaLTC1,Re.ltc_2.value=G.state.rectAreaLTC2,Re.pointLights.value=G.state.point,Re.pointLightShadows.value=G.state.pointShadow,Re.hemisphereLights.value=G.state.hemi,Re.sunShadowMatrix.value=G.state.sunShadowMatrix,Re.sunShadowCascade.value=G.state.sunShadowCascade,Re.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Re.spotLightMatrix.value=G.state.spotLightMatrix,Re.spotLightMap.value=G.state.spotLightMap,Re.pointShadowMatrix.value=G.state.pointShadowMatrix),V.lightProbeGrid=T.state.lightProbeGridArray.length>0,V.currentProgram=nt,V.uniformsList=null,nt}function qi(v){if(v.uniformsList===null){let L=v.currentProgram.getUniforms();v.uniformsList=ar.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function Yi(v,L){let q=H.get(v);q.outputColorSpace=L.outputColorSpace,q.batching=L.batching,q.batchingColor=L.batchingColor,q.instancing=L.instancing,q.instancingColor=L.instancingColor,q.instancingMorph=L.instancingMorph,q.skinning=L.skinning,q.morphTargets=L.morphTargets,q.morphNormals=L.morphNormals,q.morphColors=L.morphColors,q.morphTargetsCount=L.morphTargetsCount,q.numClippingPlanes=L.numClippingPlanes,q.numIntersection=L.numClipIntersection,q.vertexAlphas=L.vertexAlphas,q.vertexTangents=L.vertexTangents,q.toneMapping=L.toneMapping}function ur(v,L){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;y.setFromMatrixPosition(L.matrixWorld);for(let q=0,V=v.length;q<V;q++){let G=v[q];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function ds(v,L,q,V,G){L.isScene!==!0&&(L=Vt),$.resetTextureUnits();let ge=L.fog,Se=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?L.environment:null,me=W===null?C.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:rt.workingColorSpace,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ae=ue.get(V.envMap||Se,we),Je=V.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,nt=!!q.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Re=!!q.morphAttributes.position,dt=!!q.morphAttributes.normal,Lt=!!q.morphAttributes.color,Mt=Vn;V.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(Mt=C.toneMapping);let _t=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Ot=_t!==void 0?_t.length:0,Me=H.get(V),Bt=T.state.lights;if(qe===!0&&(yt===!0||v!==re)){let ne=v===re&&V.id===Z;Ee.setState(V,v,ne)}let ot=!1;V.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Bt.state.version||Me.outputColorSpace!==me||G.isBatchedMesh&&Me.batching===!1||!G.isBatchedMesh&&Me.batching===!0||G.isBatchedMesh&&Me.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Me.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Me.instancing===!1||!G.isInstancedMesh&&Me.instancing===!0||G.isSkinnedMesh&&Me.skinning===!1||!G.isSkinnedMesh&&Me.skinning===!0||G.isInstancedMesh&&Me.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Me.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Me.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Me.instancingMorph===!1&&G.morphTexture!==null||Me.envMap!==Ae||V.fog===!0&&Me.fog!==ge||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Ee.numPlanes||Me.numIntersection!==Ee.numIntersection)||Me.vertexAlphas!==Je||Me.vertexTangents!==nt||Me.morphTargets!==Re||Me.morphNormals!==dt||Me.morphColors!==Lt||Me.toneMapping!==Mt||Me.morphTargetsCount!==Ot||!!Me.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ot=!0):(ot=!0,Me.__version=V.version);let Ut=Me.currentProgram;ot===!0&&(Ut=bi(V,L,G),F&&V.isNodeMaterial&&F.onUpdateProgram(V,Ut,Me));let Tn=!1,An=!1,w=!1,B=Ut.getUniforms(),Q=Me.uniforms;if(f.useProgram(Ut.program)&&(Tn=!0,An=!0,w=!0),V.id!==Z&&(Z=V.id,An=!0),Me.needsLights){let ne=ur(T.state.lightProbeGridArray,G);Me.lightProbeGrid!==ne&&(Me.lightProbeGrid=ne,An=!0)}if(Tn||re!==v){f.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),B.setValue(U,"projectionMatrix",v.projectionMatrix),B.setValue(U,"viewMatrix",v.matrixWorldInverse);let Ie=B.map.cameraPosition;Ie!==void 0&&Ie.setValue(U,Tt.setFromMatrixPosition(v.matrixWorld)),M.logarithmicDepthBuffer&&B.setValue(U,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&B.setValue(U,"isOrthographic",v.isOrthographicCamera===!0),re!==v&&(re=v,An=!0,w=!0)}if(Me.needsLights&&(Bt.state.sunShadowMap.length>0&&B.setValue(U,"sunShadowMap",Bt.state.sunShadowMap,$),Bt.state.directionalShadowMap.length>0&&B.setValue(U,"directionalShadowMap",Bt.state.directionalShadowMap,$),Bt.state.spotShadowMap.length>0&&B.setValue(U,"spotShadowMap",Bt.state.spotShadowMap,$),Bt.state.pointShadowMap.length>0&&B.setValue(U,"pointShadowMap",Bt.state.pointShadowMap,$)),G.isSkinnedMesh){B.setOptional(U,G,"bindMatrix"),B.setOptional(U,G,"bindMatrixInverse");let ne=G.skeleton;ne&&(ne.boneTexture===null&&ne.computeBoneTexture(),B.setValue(U,"boneTexture",ne.boneTexture,$))}G.isBatchedMesh&&(B.setOptional(U,G,"batchingTexture"),B.setValue(U,"batchingTexture",G._matricesTexture,$),B.setOptional(U,G,"batchingIdTexture"),B.setValue(U,"batchingIdTexture",G._indirectTexture,$),B.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&B.setValue(U,"batchingColorTexture",G._colorsTexture,$));let le=q.morphAttributes;if((le.position!==void 0||le.normal!==void 0||le.color!==void 0)&&N.update(G,q,Ut),(An||Me.receiveShadow!==G.receiveShadow)&&(Me.receiveShadow=G.receiveShadow,B.setValue(U,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&L.environment!==null&&(Q.envMapIntensity.value=L.environmentIntensity),Q.dfgLUT!==void 0&&(Q.dfgLUT.value=d_()),An){if(B.setValue(U,"toneMappingExposure",C.toneMappingExposure),Me.needsLights&&fs(Q,w),ge&&V.fog===!0&&Le.refreshFogUniforms(Q,ge),Le.refreshMaterialUniforms(Q,V,se,j,T.state.transmissionRenderTarget[v.id]),Me.needsLights&&Me.lightProbeGrid){let ne=Me.lightProbeGrid;Q.probesSH.value=ne.texture,Q.probesMin.value.copy(ne.boundingBox.min),Q.probesMax.value.copy(ne.boundingBox.max),Q.probesResolution.value.copy(ne.resolution)}ar.upload(U,qi(Me),Q,$)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(ar.upload(U,qi(Me),Q,$),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&B.setValue(U,"center",G.center),B.setValue(U,"modelViewMatrix",G.modelViewMatrix),B.setValue(U,"normalMatrix",G.normalMatrix),B.setValue(U,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){let ne=V.uniformsGroups;for(let Ie=0,Oe=ne.length;Ie<Oe;Ie++){let Ke=ne[Ie];oe.update(Ke,Ut),oe.bind(Ke,Ut)}}return Ut}function fs(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.sunLights.needsUpdate=L,v.sunLightShadows.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function Ei(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return te},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(v,L,q){let V=H.get(v);V.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),H.get(v.texture).__webglTexture=L,H.get(v.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:q,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){let q=H.get(v);q.__webglFramebuffer=L,q.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(v,L=0,q=0){W=v,te=L,Y=q;let V=null,G=!1,ge=!1;if(v){let me=H.get(v);if(me.__useDefaultFramebuffer!==void 0){f.bindFramebuffer(U.FRAMEBUFFER,me.__webglFramebuffer),ae.copy(v.viewport),Fe.copy(v.scissor),De=v.scissorTest,f.viewport(ae),f.scissor(Fe),f.setScissorTest(De),Z=-1;return}else if(me.__webglFramebuffer===void 0)$.setupRenderTarget(v);else if(me.__hasExternalTextures)$.rebindTextures(v,H.get(v.texture).__webglTexture,H.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let Je=v.depthTexture;if(me.__boundDepthTexture!==Je){if(Je!==null&&H.has(Je)&&(v.width!==Je.image.width||v.height!==Je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(v)}}let we=v.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ge=!0);let Ae=H.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ae[L])?V=Ae[L][q]:V=Ae[L],G=!0):v.samples>0&&$.useMultisampledRTT(v)===!1?V=H.get(v).__webglMultisampledFramebuffer:Array.isArray(Ae)?V=Ae[q]:V=Ae,ae.copy(v.viewport),Fe.copy(v.scissor),De=v.scissorTest}else ae.copy(ve).multiplyScalar(se).floor(),Fe.copy(et).multiplyScalar(se).floor(),De=Pt;if(q!==0&&(V=z),f.bindFramebuffer(U.FRAMEBUFFER,V)&&f.drawBuffers(v,V),f.viewport(ae),f.scissor(Fe),f.setScissorTest(De),G){let me=H.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+L,me.__webglTexture,q)}else if(ge){let me=L;for(let we=0;we<v.textures.length;we++){let Ae=H.get(v.textures[we]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+we,Ae.__webglTexture,q,me)}}else if(v!==null&&q!==0){let me=H.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,me.__webglTexture,q)}Z=-1};function ps(v){let L=H.get(v);return(L.__readFormat!==v.format||L.__readType!==v.type)&&(L.__readFormat=v.format,L.__readType=v.type,L.__formatReadable=M.textureFormatReadable(v.format),L.__typeReadable=M.textureTypeReadable(v.type)),L}this.readRenderTargetPixels=function(v,L,q,V,G,ge,Se,me=0){if(!(v&&v.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){f.bindFramebuffer(U.FRAMEBUFFER,we);try{let Ae=v.textures[me],Je=Ae.format,nt=Ae.type;v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+me);let Re=ps(Ae);if(Re.__formatReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Re.__typeReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=v.width-V&&q>=0&&q<=v.height-G&&U.readPixels(L,q,V,G,fe.convert(Je),fe.convert(nt),ge)}finally{let Ae=W!==null?H.get(W).__webglFramebuffer:null;f.bindFramebuffer(U.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,L,q,V,G,ge,Se,me=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(L>=0&&L<=v.width-V&&q>=0&&q<=v.height-G){f.bindFramebuffer(U.FRAMEBUFFER,we);let Ae=v.textures[me],Je=Ae.format,nt=Ae.type;v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+me);let Re=ps(Ae);if(Re.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Re.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let dt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,dt),U.bufferData(U.PIXEL_PACK_BUFFER,ge.byteLength,U.STREAM_READ),U.readPixels(L,q,V,G,fe.convert(Je),fe.convert(nt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Lt=W!==null?H.get(W).__webglFramebuffer:null;f.bindFramebuffer(U.FRAMEBUFFER,Lt);let Mt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Iu(U,Mt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,dt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ge),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(dt),U.deleteSync(Mt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,q=0){let V=Math.pow(2,-q),G=Math.floor(v.image.width*V),ge=Math.floor(v.image.height*V),Se=L!==null?L.x:0,me=L!==null?L.y:0;$.setTexture2D(v,0),U.copyTexSubImage2D(U.TEXTURE_2D,q,0,0,Se,me,G,ge),f.unbindTexture()},this.copyTextureToTexture=function(v,L,q=null,V=null,G=0,ge=0){let Se,me,we,Ae,Je,nt,Re,dt,Lt,Mt=v.isCompressedTexture?v.mipmaps[ge]:v.image;if(q!==null)Se=q.max.x-q.min.x,me=q.max.y-q.min.y,we=q.isBox3?q.max.z-q.min.z:1,Ae=q.min.x,Je=q.min.y,nt=q.isBox3?q.min.z:0;else{let Q=Math.pow(2,-G);Se=Math.floor(Mt.width*Q),me=Math.floor(Mt.height*Q),v.isDataArrayTexture?we=Mt.depth:v.isData3DTexture?we=Math.floor(Mt.depth*Q):we=1,Ae=0,Je=0,nt=0}V!==null?(Re=V.x,dt=V.y,Lt=V.z):(Re=0,dt=0,Lt=0);let _t=fe.convert(L.format),Ot=fe.convert(L.type),Me;L.isData3DTexture?($.setTexture3D(L,0),Me=U.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?($.setTexture2DArray(L,0),Me=U.TEXTURE_2D_ARRAY):($.setTexture2D(L,0),Me=U.TEXTURE_2D),f.activeTexture(U.TEXTURE0),f.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,L.flipY),f.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),f.pixelStorei(U.UNPACK_ALIGNMENT,L.unpackAlignment);let Bt=f.getParameter(U.UNPACK_ROW_LENGTH),ot=f.getParameter(U.UNPACK_IMAGE_HEIGHT),Ut=f.getParameter(U.UNPACK_SKIP_PIXELS),Tn=f.getParameter(U.UNPACK_SKIP_ROWS),An=f.getParameter(U.UNPACK_SKIP_IMAGES);f.pixelStorei(U.UNPACK_ROW_LENGTH,Mt.width),f.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Mt.height),f.pixelStorei(U.UNPACK_SKIP_PIXELS,Ae),f.pixelStorei(U.UNPACK_SKIP_ROWS,Je),f.pixelStorei(U.UNPACK_SKIP_IMAGES,nt);let w=v.isDataArrayTexture||v.isData3DTexture,B=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){let Q=H.get(v),le=H.get(L),ne=H.get(Q.__renderTarget),Ie=H.get(le.__renderTarget);f.bindFramebuffer(U.READ_FRAMEBUFFER,ne.__webglFramebuffer),f.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let Oe=0;Oe<we;Oe++)w&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(v).__webglTexture,G,nt+Oe),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(L).__webglTexture,ge,Lt+Oe)),U.blitFramebuffer(Ae,Je,Se,me,Re,dt,Se,me,U.DEPTH_BUFFER_BIT,U.NEAREST);f.bindFramebuffer(U.READ_FRAMEBUFFER,null),f.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||v.isRenderTargetTexture||H.has(v)){let Q=H.get(v),le=H.get(L);f.bindFramebuffer(U.READ_FRAMEBUFFER,P),f.bindFramebuffer(U.DRAW_FRAMEBUFFER,X);for(let ne=0;ne<we;ne++)w?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Q.__webglTexture,G,nt+ne):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Q.__webglTexture,G),B?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,le.__webglTexture,ge,Lt+ne):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,le.__webglTexture,ge),G!==0?U.blitFramebuffer(Ae,Je,Se,me,Re,dt,Se,me,U.COLOR_BUFFER_BIT,U.NEAREST):B?U.copyTexSubImage3D(Me,ge,Re,dt,Lt+ne,Ae,Je,Se,me):U.copyTexSubImage2D(Me,ge,Re,dt,Ae,Je,Se,me);f.bindFramebuffer(U.READ_FRAMEBUFFER,null),f.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else B?v.isDataTexture||v.isData3DTexture?U.texSubImage3D(Me,ge,Re,dt,Lt,Se,me,we,_t,Ot,Mt.data):L.isCompressedArrayTexture?U.compressedTexSubImage3D(Me,ge,Re,dt,Lt,Se,me,we,_t,Mt.data):U.texSubImage3D(Me,ge,Re,dt,Lt,Se,me,we,_t,Ot,Mt):v.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ge,Re,dt,Se,me,_t,Ot,Mt.data):v.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ge,Re,dt,Mt.width,Mt.height,_t,Mt.data):U.texSubImage2D(U.TEXTURE_2D,ge,Re,dt,Se,me,_t,Ot,Mt);f.pixelStorei(U.UNPACK_ROW_LENGTH,Bt),f.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ot),f.pixelStorei(U.UNPACK_SKIP_PIXELS,Ut),f.pixelStorei(U.UNPACK_SKIP_ROWS,Tn),f.pixelStorei(U.UNPACK_SKIP_IMAGES,An),ge===0&&L.generateMipmaps&&U.generateMipmap(Me),f.unbindTexture()},this.initRenderTarget=function(v){H.get(v).__webglFramebuffer===void 0&&$.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?$.setTextureCube(v,0):v.isData3DTexture?$.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?$.setTexture2DArray(v,0):$.setTexture2D(v,0),f.unbindTexture()},this.resetState=function(){te=0,Y=0,W=null,f.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};var $t=Object.freeze({console:Object.freeze({x:-4.8,z:-3.8,label:"CONSOLE"}),clue:Object.freeze({x:4.6,z:-3.8,label:"CLUE"}),exit:Object.freeze({x:0,z:-6.8,label:"EXIT"}),secret:Object.freeze({x:6.2,z:4.8,label:"HIDDEN CHANNEL"}),quiet:Object.freeze({x:4,z:-6.8,label:"QUIET EXIT"})}),p_=Object.freeze([{id:"A",x:0,z:3.7,safe:!0},{id:"B",x:2.5,z:2.2,safe:!1},{id:"C",x:-1.4,z:1.5,safe:!0},{id:"D",x:1,z:-.7,safe:!0},{id:"E",x:-2.6,z:-1.3,safe:!1},{id:"F",x:0,z:-3,safe:!0}].map(Object.freeze)),ii=7.45,m_=3.35,ml=.31,g_={1:"\u25C7",2:"\u25C9",3:"\u25B3",4:"\u271A"},ud=[7402204,16762506,7857663,16742575,11396806,12428799,16766090],__=["MEMORY VAULT","SIGNAL FILTER","POWER GRID","TRAP BRIDGE","TASK CHAMBER","THE LAST CHOICE","HIDDEN CHANNEL"];function dd({canvas:i,onInteract:e=()=>{},onHazard:t=()=>{},onMove:n=()=>{},onTile:s=()=>{}}={}){if(!i)throw new Error("MIND MAZE ben\xF6tigt ein Canvas f\xFCr die 3D-Grafik.");let r;try{r=new dl({canvas:i,antialias:!0,alpha:!1,powerPreference:"high-performance"})}catch{throw new Error("WebGL 2 konnte nicht gestartet werden. Bitte verwende einen aktuellen Browser mit Grafikbeschleunigung.")}r.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5)),r.shadowMap.enabled=!0,r.shadowMap.type=as,r.outputColorSpace=rn,r.toneMapping=Jr,r.toneMappingExposure=1.18,i.style.touchAction="none";let a=new Pr;a.background=new Qe(527390),a.fog=new Ir(527390,.009);let o=new Fi(-14,14,10,-10,.1,100),l=new Zr,c=new $e,u=new Jt;a.add(u);let p=[],h=[],g=[],_=[],S=[],m=w=>(p.push(w),w),d=w=>(h.push(w),w),A=w=>(g.push(w),w),D=m(new Li(1,1,1)),y=m(new Js(1,14,10)),E=m(new Zs(1,1,1,16)),T=m(new Hr(1,1,6)),I=m(new ss(1,1)),x=m(new Wr(1,.035,6,32)),b=m(new Gr(.085,.36,3,7)),C=new Map;function R(w,B=0,Q=.6,le=.08,ne=1){let Ie=[w,B,Q,le,ne].join(":");return C.has(Ie)||C.set(Ie,d(new rs({color:w,emissive:w,emissiveIntensity:B,roughness:Q,metalness:le,transparent:ne<1,opacity:ne,depthWrite:ne>=1}))),C.get(Ie)}let F=R(15197916,0,.62,.06),z=R(1845826,0,.47,.2),P=R(1054764,0,.62,.1),X=R(16735914,1.9),te=R(16053996,0,.6);function Y(w,B,Q,le,ne,Ie,Oe,Ke,Ye=u,Te=!1){let ft=new on(w,B);return ft.position.set(Q,le,ne),ft.scale.set(Ie,Oe,Ke),ft.castShadow=Te,ft.receiveShadow=!0,Ye.add(ft),ft}function W(w,B,Q,le,ne,Ie,Oe,Ke=u,Ye=!1){return Y(D,w,B,Q,le,ne,Ie,Oe,Ke,Ye)}function Z(w,B,Q,le,ne,Ie,Oe,Ke=u,Ye=!1){return Y(y,w,B,Q,le,ne,Ie,Oe,Ke,Ye)}function re(w,{color:B="#e9fffa",background:Q="rgba(12,24,43,.93)",font:le=34,width:ne=640,height:Ie=200}={}){let Oe=document.createElement("canvas");Oe.width=ne,Oe.height=Ie;let Ke=Oe.getContext("2d");Ke.clearRect(0,0,ne,Ie),Ke.fillStyle=Q,Ke.beginPath(),Ke.roundRect(2,2,ne-4,Ie-4,14),Ke.fill(),Ke.strokeStyle="rgba(112,242,220,.4)",Ke.lineWidth=3,Ke.stroke(),Ke.textAlign="center",Ke.textBaseline="middle",Ke.font=`600 ${le}px ui-monospace, Consolas, monospace`,Ke.fillStyle=B;let Ye=Array.isArray(w)?w:[String(w)];Ye.forEach((ft,qn)=>Ke.fillText(String(ft),ne/2,(qn+.5)*Ie/Ye.length,ne-32));let Te=new $s(Oe);return Te.colorSpace=rn,_.push(Te),Te}function ae(w,B,Q,le,ne=2.1,Ie=.55,Oe={}){let Ke=re(w,Oe),Ye=new Ws({map:Ke,transparent:!0,depthWrite:!1});_.push(Ye);let Te=new Ur(Ye);return Te.position.set(B,Q,le),Te.scale.set(ne,Ie,1),u.add(Te),Te}function Fe(){let w=document.createElement("canvas");w.width=w.height=128;let B=w.getContext("2d"),Q=B.createRadialGradient(64,64,1,64,64,64);return Q.addColorStop(0,"rgba(255,255,255,.65)"),Q.addColorStop(.2,"rgba(255,255,255,.22)"),Q.addColorStop(1,"rgba(255,255,255,0)"),B.fillStyle=Q,B.fillRect(0,0,128,128),A(new $s(w))}let De=Fe(),vt=d(new xi({map:De,color:461591,transparent:!0,opacity:.6,depthWrite:!1})),We=new Qs(16774102,3.2);We.position.set(-8,17,10),We.castShadow=!0,We.shadow.mapSize.set(1024,1024),We.shadow.camera.left=-13,We.shadow.camera.right=13,We.shadow.camera.top=13,We.shadow.camera.bottom=-13,We.shadow.camera.near=1,We.shadow.camera.far=50,We.shadow.normalBias=.045,We.shadow.bias=-3e-4,a.add(We),a.add(new qr(10934783,3420237,2.25));let lt=new Qs(7530976,1.5);lt.position.set(9,4,-12),a.add(lt);let j=new js(7665117,15,18,2);j.position.set(0,3,-4),a.add(j);let se=new js(16737706,7,12,2);se.position.set(-7,2,4),a.add(se);let be=24117,Ve=()=>(be=Math.imul(be,1664525)+1013904223>>>0,be/4294967296),ve=new Float32Array(360);for(let w=0;w<120;w++){let B=Ve()*Math.PI*2,Q=16+Ve()*20;ve[w*3]=Math.cos(B)*Q,ve[w*3+1]=-7+Ve()*22,ve[w*3+2]=Math.sin(B)*Q}let et=m(new Yt);et.setAttribute("position",new an(ve,3));let Pt=new zr(et,d(new Ys({color:9152973,size:.055,transparent:!0,opacity:.48,sizeAttenuation:!0})));a.add(Pt);let Xe=new Jt;a.add(Xe);let qe=new Jt;qe.position.y=.62,Xe.add(qe),W(z,0,0,0,.42,.25,.24,qe,!0);let yt=W(F,0,.36,0,.48,.55,.29,qe,!0);W(R(6805711),0,.36,-.155,.34,.15,.035,qe),W(P,0,.36,.225,.34,.41,.17,qe,!0);let it=W(R(7993055,1.8),0,.39,.319,.24,.055,.02,qe),Tt=Z(R(14395266),0,.82,-.015,.225,.24,.21,qe,!0),Dt=m(new Js(.234,14,8,0,Math.PI*2,0,Math.PI*.58));Y(Dt,P,0,.865,-.005,1,1,1,qe,!0),W(P,0,.845,-.205,.31,.055,.038,qe),W(R(11599853,1),0,.846,-.227,.24,.023,.016,qe);let Vt=[],St=[];for(let w of[-1,1]){let B=new Jt;B.position.set(w*.32,.56,0),qe.add(B),Y(b,F,0,-.16,0,1,1,1,B,!0),Z(R(14395266),0,-.41,-.01,.095,.095,.09,B,!0),Vt.push(B);let Q=new Jt;Q.position.set(w*.12,-.08,0),qe.add(Q),W(z,0,-.22,0,.16,.45,.17,Q,!0),W(P,0,-.46,-.06,.19,.12,.31,Q,!0),St.push(Q)}let Rt=Y(I,vt,0,.018,0,1.7,1.7,1,a);Rt.rotation.x=-Math.PI/2;let U=d(new rs({color:7730395,emissive:7730395,emissiveIntensity:.5,transparent:!0,opacity:.1,roughness:.25,metalness:.2,depthWrite:!1})),Nt=Z(U,0,.82,0,.74,1.02,.74,Xe);Nt.visible=!1;let ct=Y(x,R(7993055,1.8),0,.045,0,1.05,1.05,1,Xe);ct.rotation.x=-Math.PI/2,ct.visible=!1;let M={},f=0,O=!1,H=!1,$=!1,ue=!1,de=null,K=!1,ie=0,he=0,Le=0,pe=-99,J={x:0,z:5.5,yaw:0},Ee=!1,Ue=0,Ge=0,N=0,ce=[],ee=null,fe=null,_e=0,oe=0,Pe=1,Ce=0,ht=null,ut=[],Zt=[],Qt=[],Gi=[],Hi=null,Wn=[],oi=[],Si=[],Gt=new Set,Mi=new Set,en=0,Xn=0,Wi=new k(0,.45,0),hr=new k,Xi=new k;function ha(w){if(Number.isInteger(w.index))return Math.max(0,Math.min(6,w.index));if(Number.isInteger(w.id))return Math.max(0,Math.min(6,w.id));let B=String(w.kind||w.id||"").toLowerCase(),le=["memory","filter","power","bridge","task","final","secret"].findIndex(ne=>B.includes(ne));return le<0?0:le}function bi(w,B,Q,le){ut.push({x:w,z:B,w:Q,d:le})}function qi(w,B){return!Number.isFinite(w)||!Number.isFinite(B)||Math.abs(w)>ii||Math.abs(B)>ii?!0:ut.some(Q=>Math.abs(w-Q.x)<Q.w/2+ml&&Math.abs(B-Q.z)<Q.d/2+ml)}function Yi(w,B){w.userData.targetId=B,Zt.push(w)}function ur(w,B,Q,le,ne){let Ie={id:w,x:B,z:Q,label:le,group:ne};return Qt.push(Ie),ne.userData.targetId=w,ne.traverse(Oe=>{(Oe.isMesh||Oe.isSprite)&&Yi(Oe,w)}),Ie}function ds(w,B,Q="#ccfff4"){if(w.sign){u.remove(w.sign),Zt=Zt.filter(Ie=>Ie!==w.sign);let ne=[w.sign.material.map,w.sign.material];for(let Ie of ne){Ie.dispose();let Oe=_.indexOf(Ie);Oe>=0&&_.splice(Oe,1)}}let le=["exit","quiet"].includes(w.id)?3.35:2.65;w.sign=ae(B,w.x,le,w.z,2.6,.42,{font:64,width:512,height:96,color:Q}),Yi(w.sign,w.id)}function fs(w,B,Q,le=.76){let ne=Y(x,R(Q,1.8),w,.045,B,le,le,1);return ne.rotation.x=-Math.PI/2,ne}function Ei(w,B,Q){let le=Math.hypot(B.x-w.x,B.z-w.z),ne=Math.atan2(B.x-w.x,B.z-w.z),Ie=W(R(Q,.8),(w.x+B.x)/2,.023,(w.z+B.z)/2,.035,.016,le);Ie.rotation.y=ne}function ps(w,B,Q,le,ne,Ie=15197916){bi(w,B,Q,le),W(R(Ie),w,ne/2,B,Q,ne,le,u,!0),W(P,w,ne+.025,B,Q+.025,.05,le+.025),W(R(ud[f],1),w,ne+.06,B,Q*.85,.023,le*.82)}function v(w,B,Q,le){let ne=new Jt;ne.position.set(B,0,Q),u.add(ne),W(z,0,.29,0,.92,.58,.84,ne,!0),W(F,0,.75,0,.74,.43,.62,ne,!0);let Ie=W(R(le,.65),0,1.02,-.01,.65,.055,.43,ne);Ie.rotation.x=.18,W(P,0,1.045,-.01,.56,.03,.35,ne),W(R(le,1.6),0,1.067,-.05,.4,.015,.035,ne),W(R(le,1.3),0,.41,.435,.45,.04,.025,ne),fs(B,Q,le),bi(B,Q,.92,.84);let Oe=ur(w,B,Q,w==="console"?"CONSOLE":"CLUE",ne);return ds(Oe,w==="console"?"[E] CONSOLE":"[E] READ CLUE"),Oe}function L(w,B,Q,le){let ne=new Jt;ne.position.set(B,0,Q),u.add(ne),W(F,-1.14,1.45,0,.23,2.9,.5,ne,!0),W(F,1.14,1.45,0,.23,2.9,.5,ne,!0),W(F,0,2.86,0,2.5,.21,.5,ne,!0);let Ie=[];for(let Te of[-1,1]){let ft=W(z,Te*.49,1.38,0,.95,2.7,.15,ne,!0),qn=W(R(le,1),Te*.49,1.42,.1,.034,2.3,.026,ne);Ie.push({mesh:ft,stripe:qn,side:Te})}let Oe=W(X,0,2.85,.275,.75,.04,.025,ne);fs(B,Q,le,.82);let Ke=new xi({transparent:!0,opacity:0,depthWrite:!1,side:In});_.push(Ke),Y(I,Ke,0,1.38,.025,2,2.7,1,ne);let Ye=ur(w,B,Q,w==="quiet"?"QUIET EXIT":"EXIT",ne);return ds(Ye,w==="quiet"?"QUIET // LOCKED":"EXIT // LOCKED","#ffc1d9"),w==="quiet"&&(ne.visible=!1,Ye.sign.visible=!1),Gi.push({panels:Ie,indicator:Oe,value:Ye,enabled:!1,amount:0}),Ye}function q(w){let B=new Jt;B.position.set(w.x,.055,w.z),u.add(B),W(z,0,.02,0,1.4,.13,1.4,B);let Q=W(R(16742328,1.05),0,-.011,0,1.5,.028,1.5,B),le=W(R(14543590),0,.097,0,1.28,.024,1.28,B),ne=re(w.id,{font:100,width:128,height:128,color:"#1b2a42",background:"rgba(0,0,0,0)"}),Ie=new xi({map:ne,transparent:!0,depthWrite:!1});_.push(Ie);let Oe=Y(I,Ie,0,.114,0,.64,.64,1,B);Oe.rotation.x=-Math.PI/2,Wn.push({...w,group:B,trim:Q,top:le})}function V(){u.clear();for(let w of _.splice(0))w.dispose();ut=[],Zt=[],Qt=[],Gi=[],Wn=[],oi=[],Si=[],Hi=null}function G(w={}){if(H)return;V(),M=typeof w=="object"&&w?w:{index:Number(w)||0},f=ha(M);let B=ud[f];j.color.set(B),$=!1,ue=!1,de=null,K=!1,Le=0,en=Xn=0,ce=[],ee=null,fe=null,pe=-99,Gt.clear(),Ge=N=0,W(z,0,-.43,0,16.65,.72,16.65,u,!0),W(F,0,-.07,0,16.4,.16,16.4),Hi=W(R(8559779,0,.78),0,.002,0,16.05,.035,16.05),Hi.userData.floor=!0;let Q=new Br(D,F,64),le=new mt;for(let Ne=0;Ne<8;Ne++)for(let st=0;st<8;st++)le.makeScale(1.96,.048,1.96),le.setPosition(-7+st*2,.031,-7+Ne*2),Q.setMatrixAt(Ne*8+st,le);Q.receiveShadow=!0,u.add(Q),_.push(Q);for(let Ne of[-1,1]){W(R(B,1.6),Ne*8.25,-.14,0,.035,.16,16.5),W(R(B,1.6),0,-.14,Ne*8.25,16.5,.16,.035),W(F,Ne*7.95,.24,0,.23,.44,16),W(F,0,.24,Ne*7.95,16,.44,.23);for(let st of[-6.5,6.5])W(z,Ne*7.8,.95,st,.44,1.55,.44,u,!0),W(R(B,1.5),Ne*7.8,1.75,st,.35,.08,.35);W(z,Ne*6.3,-1.16,0,1.2,.8,10.5),W(R(B,.9),Ne*6.3,-1.6,0,.2,.04,10.5)}for(let Ne=0;Ne<5;Ne++){let st=-10.5-Ne*.8,pt=-5+Ne*2.25,vn=W(Ne%2?F:z,st,-.6-Ne*.32,pt,1.3,.35,1.7);vn.rotation.y=Ne*.16,Si.push({mesh:vn,baseY:vn.position.y,phase:Ne})}ae(M.title||M.name||__[f],0,3.9,-7.25,4.8,.57,{font:54,color:"#a1fff0"}),ae(`SECTOR ${String(f+1).padStart(2,"0")}  /  MIND MAZE`,0,.21,6.85,3.7,.42,{font:54,background:"rgba(13,28,42,.82)"});let ne=v("console",$t.console.x,$t.console.z,B),Ie=v("clue",$t.clue.x,$t.clue.z,B),Ke=[(Array.isArray(M.glyphs)?M.glyphs:Array.isArray(M.clue?.glyphs)?M.clue.glyphs:Array.isArray(M.clue?.sequence)?M.clue.sequence:f===0?[2,4,1,3]:f===2?["A","B","C","D"]:f===3?["A","C","D","F"]:["\u25C7","\u25CB","\u25B3"]).map(Ne=>g_[Ne]||String(Ne)).join("   "),f===0?"OBSERVE  //  REMEMBER":f===3?"FOLLOW THE SAFE SIGNAL":"OBSERVE THE PATTERN"],Ye=ae(Ke,Ie.x,1.78,Ie.z,3.3,1,{font:65,width:512,height:240,color:"#b7fff0"});Yi(Ye,"clue");let Te=ae(["\u25C7  \u25C9  \u25B3","INPUT TERMINAL"],ne.x,1.75,ne.z,2.5,.8,{font:65,width:512,height:240});Yi(Te,"console"),L("exit",$t.exit.x,$t.exit.z,B),f===5&&L("quiet",$t.quiet.x,$t.quiet.z,10155989);let ft=new Jt;ft.position.set($t.secret.x,0,$t.secret.z),u.add(ft);let qn=Y(T,R(16765323,1.25),0,1.12,0,.44,.8,.44,ft);qn.rotation.z=Math.PI,W(z,0,.17,0,.65,.3,.65,ft);let ua=ur("secret",$t.secret.x,$t.secret.z,"HIDDEN CHANNEL",ft);if(ds(ua,"HIDDEN CHANNEL","#ffdfad"),ft.visible=!1,ua.sign.visible=!1,Ei($t.console,{x:-2,z:-5.6},B),Ei({x:-2,z:-5.6},$t.exit,B),Ei($t.clue,{x:2,z:-5.6},B),Ei({x:2,z:-5.6},$t.exit,B),f===3){for(let Ne of p_)q(Ne);for(let[Ne,st]of[{x:-4.6,z:.4,w:2.3,d:.13},{x:4.5,z:-1.5,w:2.3,d:.13},{x:0,z:-5.3,w:1.9,d:.13}].entries()){let pt=new rs({color:16736413,emissive:16726156,emissiveIntensity:2,transparent:!0,opacity:.8,depthWrite:!1});_.push(pt);let vn=W(pt,st.x,.14,st.z,st.w,.15,st.d);oi.push({...st,mesh:vn,phase:Ne*.8,on:!1});for(let ms of[-1,1])W(z,st.x+ms*(st.w/2+.07),.27,st.z,.18,.45,.28,u,!0)}ps(-5.9,1.4,.8,3,1.05),ps(5.9,-.8,.8,3,1.05)}else{let Ne=[[{x:-2.75,z:.4,w:.7,d:3.5,h:1.12},{x:2.75,z:-.65,w:.7,d:3.5,h:1.12}],[{x:-2.8,z:1,w:2,d:.65,h:1.05},{x:2.8,z:-1.1,w:2,d:.65,h:1.05}],[{x:-2.8,z:.4,w:.7,d:3.6,h:1.12},{x:2.8,z:.4,w:.7,d:3.6,h:1.12}],[],[{x:-2.5,z:-.1,w:.7,d:3.5,h:1.15},{x:2.6,z:1.2,w:.7,d:3.5,h:1.15}],[{x:-3,z:.2,w:.8,d:3.6,h:1.05},{x:3,z:.2,w:.8,d:3.6,h:1.05}],[{x:-3.1,z:.4,w:.6,d:2.5,h:.75},{x:3.1,z:.4,w:.6,d:2.5,h:.75}]],st=Array.isArray(M.obstacles)?M.obstacles:Ne[f];for(let pt of st)[pt.x,pt.z,pt.w,pt.d].every(Number.isFinite)&&ps(pt.x,pt.z,pt.w,pt.d,Number.isFinite(pt.h)?pt.h:1.1);for(let pt of[-1,1]){let vn=Z(R(B,1.15),pt*2.75,1.6,.35,.16,.16,.16);Si.push({mesh:vn,baseY:1.6,phase:pt}),fs(pt*2.75,.35,B,.36)}}if(f===0)for(let Ne=0;Ne<4;Ne++){let st=-5.6+Ne*.75,pt=-.2;W(z,st,.18,pt,.35,.32,.35);let vn=Z(R(Ne%2?16747451:B,1.2),st,.75+Ne*.1,pt,.15,.15,.15);Si.push({mesh:vn,baseY:vn.position.y,phase:Ne})}else if(f===1)for(let Ne=0;Ne<3;Ne++){let pt=.2+Ne*.9;W(z,5.65,.32,pt,.65,.6,.55),W(R(Ne===1?16743855:B,.75),5.65,.68,pt,.49,.08,.43)}else if(f===2)for(let Ne=0;Ne<4;Ne++){let st=-3+Ne*2;W(z,st,.15,-5.1,.45,.24,.6),W(R(B,1.4),st,.31,-5.1,.34,.045,.42),W(F,st,.63,-5.1,.12,.56,.12),Z(R(B,1.3),st,.96,-5.1,.13,.13,.13)}else if(f===4)for(let Ne=0;Ne<4;Ne++){let st=Ne<2?-5.7:5.7,pt=.3+Ne%2*1.25;W(z,st,.35,pt,.72,.64,.6),W(R(B,1.05),st,.71,pt,.58,.06,.46),ae(["PLAN","WIRE","TEST","SEND"][Ne],st,1.25,pt,1.25,.3,{font:55,width:256,height:96})}else if(f===5){W(z,0,.17,-2.6,.8,.29,.8),bi(0,-2.6,.8,.8);let Ne=Y(T,R(B,.8),0,1.05,-2.6,.42,.95,.42);Si.push({mesh:Ne,baseY:1.05,phase:2}),fs(0,-2.6,B,.65),Ei({x:0,z:-2.6},$t.exit,B),Ei({x:0,z:-2.6},$t.quiet,10155989)}else f===6&&(W(F,-5.5,.42,.8,1.4,.15,.9),W(z,-5.5,.2,.8,.12,.4,.6),W(R(B,.15),-5.5,.53,.8,.54,.04,.36),ae(["EINE SACHE","PAUSE"],-5.5,1.15,.8,2,.64,{font:60,width:400,height:180,color:"#ffe3ac"}));let $i=M.spawn||{x:0,z:5.5};J={x:0,z:5.5,yaw:0},Re($i),Wi.set(0,.45,0),Xe.position.set(J.x,.09,J.z),ge(M.solved===!0),we(M.secretVisible===!0),me(M.exitRoute||null,M.quietUnlocked===!0),a.updateMatrixWorld(!0),Bt()}function ge(w){let B=!!w;B!==$&&($=B,Se())}function Se(){for(let w of Gi){let B=w.value.id==="quiet";w.enabled=$&&(f!==5||(B?de==="quiet":de==="balanced")),B&&(w.value.group.visible=K,w.value.sign.visible=K),w.indicator.material=w.enabled?R(9371605,1.6):X,ds(w.value,w.enabled?B?"[E] QUIET ROUTE":"[E] EXIT OPEN":B?"QUIET // LOCKED":"EXIT // LOCKED",w.enabled?"#b7ffde":"#ffc1d9"),w.value.sign.visible=w.value.group.visible}}function me(w,B=!1){let Q=w==="quiet"?"quiet":w==="balanced"||w==="exit"?"balanced":null,le=!!B;Q===de&&le===K||(de=Q,K=le,Se())}function we(w){ue=!!w;let B=Qt.find(Q=>Q.id==="secret");B&&(B.group.visible=ue,B.sign.visible=ue)}function Ae(){return Qt.filter(w=>w.group.visible&&!(f===5&&$&&["exit","quiet"].includes(w.id)&&!Gi.find(B=>B.value===w)?.enabled))}function Je(){return Ae().map(w=>({target:w,distance:Math.hypot(J.x-w.x,J.z-w.z)})).sort((w,B)=>w.distance-B.distance)[0]}function nt(){if(!O)return;let w=Je();w&&w.distance<=2&&e(w.target.id)}function Re(w={}){let B=Number.isFinite(w.x)?En.clamp(w.x,-ii,ii):J.x,Q=Number.isFinite(w.z)?En.clamp(w.z,-ii,ii):J.z;qi(B,Q)||(J.x=B,J.z=Q),Number.isFinite(w.yaw)&&(J.yaw=w.yaw),ce=[],ee=null,fe=null,Xe.position.set(J.x,.09,J.z),Rt.position.set(J.x,.07,J.z)}function dt(w,B,Q=null){let Oe=Ht=>Math.max(0,Math.min(32,Math.round((Ht- -7.2)/.45))),Ke=(Ht,wn)=>({x:-7.2+Ht*.45,z:-7.2+wn*.45}),Ye={x:Oe(J.x),z:Oe(J.z)},Te={x:Oe(w),z:Oe(B)},ft=(Ht,wn)=>wn*33+Ht,qn=ft(Ye.x,Ye.z),ua=ft(Te.x,Te.z),$i=[qn],Ne=new Map,st=new Map([[qn,0]]),pt=new Map([[qn,Math.hypot(Ye.x-Te.x,Ye.z-Te.z)]]),vn=new Set,ms=(Ht,wn)=>Ht>=0&&wn>=0&&Ht<33&&wn<33&&!qi(Ke(Ht,wn).x,Ke(Ht,wn).z);if(ms(Te.x,Te.z))for(;$i.length;){$i.sort((Rn,tn)=>pt.get(Rn)-pt.get(tn));let Ht=$i.shift();if(Ht===ua){let Rn=[],tn=Ht;for(;tn!==qn;)if(Rn.push(Ke(tn%33,Math.floor(tn/33))),tn=Ne.get(tn),tn==null)return;ce=Rn.reverse(),ee=Q;return}vn.add(Ht);let wn=Ht%33,Sl=Math.floor(Ht/33);for(let Rn=-1;Rn<=1;Rn++)for(let tn=-1;tn<=1;tn++){if(!Rn&&!tn)continue;let Ml=wn+Rn,bl=Sl+tn,Zi=ft(Ml,bl);if(!ms(Ml,bl)||vn.has(Zi)||Rn&&tn&&(!ms(wn+Rn,Sl)||!ms(wn,Sl+tn)))continue;let El=st.get(Ht)+Math.hypot(Rn,tn);El<(st.get(Zi)??1/0)&&(Ne.set(Zi,Ht),st.set(Zi,El),pt.set(Zi,El+Math.hypot(Ml-Te.x,bl-Te.z)),$i.includes(Zi)||$i.push(Zi))}}}function Lt(w){if(!O)return;let B=i.getBoundingClientRect();c.set((w.clientX-B.left)/B.width*2-1,-(w.clientY-B.top)/B.height*2+1),a.updateMatrixWorld(!0),l.setFromCamera(c,o);let Q=l.intersectObjects([Hi,...Zt.filter(ne=>{let Ie=ne;for(;Ie;){if(!Ie.visible)return!1;Ie=Ie.parent}return!0})],!1)[0];if(!Q)return;let le=Q.object.userData.targetId;if(le){let ne=Ae().find(Oe=>Oe.id===le);if(!ne)return;if(Math.hypot(J.x-ne.x,J.z-ne.z)<=2)e(le);else{let Oe=J.x-ne.x,Ke=J.z-ne.z,Ye=1.55/Math.max(.001,Math.hypot(Oe,Ke));dt(ne.x+Oe*Ye,ne.z+Ke*Ye,le)}}else Q.object===Hi&&dt(En.clamp(Q.point.x,-7.2,7.2),En.clamp(Q.point.z,-7.2,7.2))}function Mt(w){let B=(Gt.has("KeyW")||Gt.has("ArrowUp")?1:0)-(Gt.has("KeyS")||Gt.has("ArrowDown")?1:0)+Ge,Q=(Gt.has("KeyD")||Gt.has("ArrowRight")?1:0)-(Gt.has("KeyA")||Gt.has("ArrowLeft")?1:0)+N,le=(Q-B)*Math.SQRT1_2,ne=(-B-Q)*Math.SQRT1_2;if(Math.abs(le)+Math.abs(ne)>.01)ce=[],ee=null;else if(ce.length){for(;ce.length&&Math.hypot(ce[0].x-J.x,ce[0].z-J.z)<.15;)ce.shift();if(ce.length)le=ce[0].x-J.x,ne=ce[0].z-J.z;else{let Ye=ee;if(ee=null,Ye){let Te=Qt.find(ft=>ft.id===Ye);Te&&Math.hypot(J.x-Te.x,J.z-Te.z)<=2&&e(Ye)}}}let Ie=Math.hypot(le,ne);if(Ee=!1,Ie>.001){let Ye=m_*(Gt.has("ShiftLeft")||Gt.has("ShiftRight")?1.28:1);le=le/Ie*Ye*w,ne=ne/Ie*Ye*w;let Te=J.x,ft=J.z;qi(J.x+le,J.z)||(J.x+=le),qi(J.x,J.z+ne)||(J.z+=ne),Ee=Math.hypot(J.x-Te,J.z-ft)>1e-4,Ee?(J.yaw=Math.atan2(-(J.x-Te),-(J.z-ft)),n({...J})):ce.length&&(ce=[],ee=null)}let Oe=Wn.find(Ye=>Math.abs(J.x-Ye.x)<.71&&Math.abs(J.z-Ye.z)<.71)?.id||null;if(Oe!==fe&&(fe=Oe,Oe&&s(Oe)),he<en)return;let Ke=oi.find(Ye=>Ye.on&&Math.abs(J.x-Ye.x)<Ye.w/2+ml&&Math.abs(J.z-Ye.z)<Ye.d/2+ml);Ke&&he-pe>1.4&&(pe=he,t({id:`laser-${oi.indexOf(Ke)+1}`,x:J.x,z:J.z,shielded:he<Xn}))}function _t(w){O=!!w,Gt.clear(),Ge=N=0,ce=[],ee=null,Ee=!1}function Ot(w,B){B?Mi.add(w):(Mi.delete(w),w==="shield"&&(Xn=0)),it.material=Mi.size?R(16763275,1.6):R(7993055,1.8)}function Me(w){w==="scanner"?en=he+6:w==="shield"&&(Xn=he+6),Ot(w,!0)}function Bt(){let w=Math.max(1,Math.round(i.clientWidth||globalThis.innerWidth||800)),B=Math.max(1,Math.round(i.clientHeight||globalThis.innerHeight||600));(w!==_e||B!==oe)&&(_e=w,oe=B,Pe=w/B,r.setSize(w,B,!1))}function ot(w,B){if(H)return;let Q=performance.now(),le=En.clamp(Number.isFinite(w)?w:0,0,.05);O&&(he+=le,he>=en&&(Le+=le));let ne=Number.isFinite(B)?B:he;Bt();for(let Te of oi)Te.on=O&&he>=en&&(Le+Te.phase)%2.8<1.5,Te.mesh.material.opacity=Te.on?.86:.12,Te.mesh.material.emissiveIntensity=Te.on?2.4:.18,Te.mesh.position.y=Te.on?.14:.065;O&&Mt(le),Ue+=Ee?le*10:0,qe.position.y=.62+(Ee?Math.abs(Math.sin(Ue))*.035:Math.sin(ne*1.8)*.006);for(let Te=0;Te<2;Te++)St[Te].rotation.x=Ee?Math.sin(Ue+Te*Math.PI)*.48:En.damp(St[Te].rotation.x,0,12,le),Vt[Te].rotation.x=Ee?-Math.sin(Ue+Te*Math.PI)*.36:En.damp(Vt[Te].rotation.x,0,12,le);let Ie=En.euclideanModulo(J.yaw-Xe.rotation.y+Math.PI,Math.PI*2)-Math.PI;Xe.position.set(J.x,.09,J.z),Xe.rotation.y+=Ie*(1-Math.exp(-14*le)),Rt.position.set(J.x,.07,J.z),ct.visible=he<en,ct.scale.setScalar(1.05+Math.sin(ne*5)*.1),Nt.visible=Mi.has("shield")||he<Xn,Nt.rotation.y=ne*.2;for(let Te of Wn){let ft=he<en;Te.trim.material=R(ft?Te.safe?6681791:16733854:16742328,ft?1.7:1.05),Te.group.position.y=.055+(Te.id===fe?.035:0)}for(let Te of Gi){Te.amount=En.damp(Te.amount,Te.enabled?1:0,4,le);for(let ft of Te.panels)ft.stripe.position.x=ft.mesh.position.x=ft.side*(.49+Te.amount)}for(let Te of Si)Te.mesh.position.y=Te.baseY+Math.sin(ne*1.2+Te.phase)*.075,Te.mesh.geometry===y&&(Te.mesh.rotation.y=ne*.6);Pt.rotation.y=ne*.004,hr.set(O?J.x*.58:0,.45,O?J.z*.58:-.3),Wi.lerp(hr,1-Math.exp(-le*4));let Oe=Math.PI/4+(O?0:Math.sin(ne*.08)*.1),Ke=19.8;Xi.set(Math.sin(Oe)*Ke,18.2,Math.cos(Oe)*Ke),o.position.copy(Wi).add(Xi),o.lookAt(Wi);let Ye=O?Math.max(8.3,5.2/Pe):Math.max(10.8,10.8/Pe);o.left=-Ye*Pe,o.right=Ye*Pe,o.top=Ye,o.bottom=-Ye,o.updateProjectionMatrix(),o.updateMatrixWorld(!0),r.render(a,o),ie++,Ce=performance.now()-Q}function Ut(w,B,Q,le){w.addEventListener(B,Q,le),S.push(()=>w.removeEventListener(B,Q,le))}Ut(globalThis,"resize",Bt),Ut(document,"keydown",w=>{!O||/^(INPUT|TEXTAREA|SELECT)$/.test(w.target?.tagName)||w.target?.isContentEditable||(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","ShiftRight"].includes(w.code)?(Gt.add(w.code),w.preventDefault()):w.code==="KeyE"&&!w.repeat&&(w.preventDefault(),nt()))}),Ut(document,"keyup",w=>Gt.delete(w.code)),Ut(globalThis,"blur",()=>{Gt.clear(),Ge=N=0,ce=[],ee=null,Ee=!1}),Ut(i,"pointerdown",w=>{O&&w.button===0&&(ht={x:w.clientX,y:w.clientY,id:w.pointerId})}),Ut(i,"pointerup",w=>{ht&&ht.id===w.pointerId&&Math.hypot(w.clientX-ht.x,w.clientY-ht.y)<9&&Lt(w),ht=null}),Ut(i,"pointercancel",()=>ht=null);function Tn(){if(!H){H=!0,O=!1;for(let w of S)w();V();for(let w of h)w.dispose();for(let w of p)w.dispose();for(let w of g)w.dispose();r.dispose(),a.clear()}}function An({x:w=0,y:B=.08,z:Q=0}={}){let le=new k(w,B,Q).project(o);return{x:(le.x+1)*_e/2,y:(1-le.y)*oe/2,visible:Math.abs(le.x)<=1&&Math.abs(le.y)<=1&&le.z>=-1&&le.z<=1}}return G({index:0}),{loadRoom:G,update:ot,setActive:_t,setSolved:ge,setSecretVisible:we,setExitRoute:me,setTool:Ot,useTool:Me,dispose:Tn,setPlayerPosition:Re,projectPoint:An,getPlayerPosition:()=>({...J}),setMovement:(w=0,B=0)=>{Ge=En.clamp(Number(w)||0,-1,1),N=En.clamp(Number(B)||0,-1,1)},getTargets:()=>Ae().map(({id:w,x:B,z:Q,label:le})=>({id:w,x:B,z:Q,label:le})),getTiles:()=>Wn.map(({id:w,x:B,z:Q})=>({id:w,x:B,z:Q})),distanceToTarget:w=>{let B=Ae().find(Q=>Q.id===w);return B?Math.hypot(J.x-B.x,J.z-B.z):1/0},getStats:()=>{let w=0,B=0;return a.traverse(Q=>{w++,Q.isMesh&&B++}),{renderedFrames:ie,objects:w,meshes:B,drawCalls:r.info.render.calls,triangles:r.info.render.triangles,geometries:r.info.memory.geometries,frameMilliseconds:Ce,roomIndex:f,active:O,solved:$,secretVisible:ue,exitRoute:de,quietUnlocked:K,webgl2:!0,player:{...J},pathSteps:ce.length,targets:Ae().map(({id:Q,x:le,z:ne,label:Ie})=>({id:Q,x:le,z:ne,label:Ie})),tiles:Wn.map(({id:Q,x:le,z:ne})=>({id:Q,x:le,z:ne})),targetScreenPositions:Object.fromEntries(Ae().map(Q=>[Q.id,An({x:Q.x,y:1.05,z:Q.z})])),tileScreenPositions:Object.fromEntries(Wn.map(Q=>[Q.id,An({x:Q.x,y:.12,z:Q.z})])),bounds:{minX:-ii,maxX:ii,minZ:-ii,maxZ:ii},scannerActive:he<en,shieldActive:Mi.has("shield")||he<Xn}}}}var He=i=>document.getElementById(i),wt=i=>String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),ah={1:"\u25C7",2:"\u25C9",3:"\u25B3",4:"\u271A"},Qc={plan:"Bauplan lesen",wire:"Leitungen verbinden",test:"Sicherheit pr\xFCfen",send:"Ergebnis \xFCbertragen"},_d={scanner:"\u2315",shield:"\u25C8",planner:"\u224B",bypass:"\u2301"},x_=[{id:"map",label:"NAV / Wartungskarte",text:"Die Karte markiert den sicheren Weg zum Energieknoten."},{id:"streak",label:"AURA / Streak-Alarm",text:"Deine Serie endet! \xD6ffne sofort den Feed."},{id:"alarm",label:"SICHERHEIT / Leitungswarnung",text:"Lies die Schaltregeln, bevor du den Energieknoten einschaltest."},{id:"sale",label:"AURA / Exklusivangebot",text:"Nur f\xFCr dich: doppelte Credits, wenn du jetzt reagierst."},{id:"team",label:"TEAM / Arbeitsauftrag",text:"Pr\xFCfe die Leitung und \xFCbertrage erst das best\xE4tigte Ergebnis."},{id:"feed",label:"AURA / Neues f\xFCr dich",text:"12 \xFCberraschende Videos warten in deinem pers\xF6nlichen Feed."}],Et,bt="home",la="explore",ke=null,_l=0,xl=0,eh=0,fd=performance.now(),th=0,nh=0,pd,lr=!1,pn,ih=[],v_="scanner",sh=null,ye=new fa,ri=()=>ye.currentRoom(),si=i=>i===!0||i?.ok===!0,us=i=>i?.reason||i?.message||"Das passt noch nicht. Pr\xFCfe den Hinweis im Raum.";function mn(i=440,e=.12){if(lr)try{pn??(pn=new(window.AudioContext||window.webkitAudioContext)),pn.resume();let t=pn.createOscillator(),n=pn.createGain();t.frequency.value=i,n.gain.setValueAtTime(.025,pn.currentTime),n.gain.exponentialRampToValueAtTime(.001,pn.currentTime+e),t.connect(n),n.connect(pn.destination),t.start(),t.stop(pn.currentTime+e)}catch{}}function y_(){if(lr=!lr,He("sound-toggle").setAttribute("aria-pressed",String(lr)),He("sound-toggle").title=lr?"Ton ausschalten":"Ton einschalten",ih.forEach(i=>{try{i.stop()}catch{}}),ih=[],!!lr)try{pn??(pn=new(window.AudioContext||window.webkitAudioContext)),pn.resume();for(let i of[110,164.81,220]){let e=pn.createOscillator(),t=pn.createGain();e.type="sine",e.frequency.value=i,t.gain.value=.009,e.connect(t),t.connect(pn.destination),e.start(),ih.push(e)}}catch{}}function jt(i){clearTimeout(pd),He("toast-root").textContent=i,He("toast-root").classList.add("visible"),pd=setTimeout(()=>He("toast-root").classList.remove("visible"),4200)}function gn(){Et&&ye.state?.started&&!ye.state.ended&&bt!=="home"&&ye.setPosition(Et.getPlayerPosition()),ye.save(),He("save-indicator").textContent=ye.storageFailed?"Speicherung blockiert \xB7 Sitzung spielbar":"Lokal gespeichert"}function Nn(i){bt=i,He("home").hidden=i!=="home",He("hud").hidden=i==="home",document.body.classList.toggle("is-playing",i!=="home"),Et?.setActive(i==="explore"),He("touch-controls").hidden=i!=="explore",He("distraction-root").hidden=!["explore","puzzle","clue"].includes(i)}function ai(i,e,{label:t="MIND MAZE // M\u201306",actions:n="",className:s=""}={}){He("overlay-root").innerHTML=`<div class="modal-shade"><section class="panel ${s}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="eyebrow">${t}</div><h2 id="dialog-title">${i}</h2>${e}${n?`<div class="overlay-actions">${n}</div>`:""}</section></div>`,He("overlay-root").querySelector("button:not(:disabled),input")?.focus({preventScroll:!0})}function xd(){He("overlay-root").replaceChildren()}function vd(){return Array.isArray(ji)?ji:Object.entries(ji).map(([i,e])=>({id:i,...e}))}function yd(){return Et.getTargets().filter(i=>i.id!=="secret"||ye.state?.secretUnlocked&&!ye.state?.secretSolved).filter(i=>i.id!=="quiet"||ye.state?.secretSolved).map(i=>({...i,distance:Et.distanceToTarget(i.id)})).sort((i,e)=>i.distance-e.distance)[0]}function Dn(){let i=ye.state,e=ri();if(!i||!e)return;He("room-label").textContent=e.title,He("room-number").textContent=i.roomIndex===6?"GEHEIMER RAUM":`RAUM ${String(i.roomIndex+1).padStart(2,"0")} / 06`;for(let n of["focus","stress"]){let s=Math.round(i[n]);He(n+"-meter").style.width=`${s}%`,He(n+"-meter").setAttribute("aria-valuenow",String(s)),He(n+"-meter").title=`${n==="focus"?"Fokus":"Stress"}: ${s} / 100`}let t=i.observed?.includes(i.roomIndex);He("objective").textContent=i.roomSolved?i.roomIndex===6?"Stillraum entdeckt. Kehre durch das Portal zur\xFCck.":i.roomIndex===5?i.exitRoute==="quiet"?"Der stille Ausgang ist offen. Gehe zum PAUSE-Portal.":"Der Hauptausgang ist offen. Gehe zum FOKUS-Portal.":i.roomIndex===2&&!i.secretSolved?"Portal offen. Ein verborgener Raum wurde sichtbar.":"Portal offen. Gehe zum n\xE4chsten Raum.":t?i.roomIndex===3?`Sichere Platten: ${i.trapWitness?.join(" \u2192 ")||"A \u2192 C \u2192 D \u2192 F"}. Erreiche das Portal.`:e.objective:"Finde den leuchtenden Datenkristall und lies den Raumhinweis.",He("tools").innerHTML=vd().map(n=>{let s=i.tools?.[n.id];return`<button class="tool-card ${s?.owned?"owned":""}" data-tool="${n.id}" title="${wt(n.name)}" aria-label="${wt(n.name)}: ${s?.owned?s.charges+" Ladungen":"gesperrt"}"><span>${_d[n.id]||"\u25C7"}</span><small>${wt(n.name||n.id)}</small><b>${s?.owned?s.charges:"+"}</b></button>`}).join(""),Et.setSolved(i.roomSolved),Et.setExitRoute?.(i.exitRoute,i.secretSolved),Et.setSecretVisible?.(i.roomIndex===2&&i.secretUnlocked&&!i.secretSolved),Et.setTool("shield",i.shieldActive),S_()}function S_(){He("save-indicator").textContent=ye.storageFailed?"Speicherung blockiert \xB7 Sitzung spielbar":"Lokal gespeichert"}function vl(){let i=ri();Et.loadRoom(i),Et.setPlayerPosition(ye.state.position||{x:0,z:5.5}),Et.setSolved(ye.state.roomSolved),Et.setSecretVisible?.(ye.state.roomIndex===2&&ye.state.secretUnlocked&&!ye.state.secretSolved);for(let e of["scanner","shield","planner","bypass"])Et.setTool(e,!!ye.state.tools?.[e]?.owned);Et.setTool("shield",ye.state.shieldActive),ke=null,Dn()}function oh(){gn(),xd(),Nn("home"),He("continue").hidden=!ye.state?.started||ye.state.ended,He("distraction-root").replaceChildren(),ye.state?.started?vl():Et.loadRoom(_s[0])}function lh(){let i=ri();Nn("intro"),ai(wt(i.title),`<p class="muted">${wt(i.narrative)}</p><div class="insight-card"><span>MISSION</span><p>${wt(i.objective)}</p></div>`,{label:`${ye.state.roomIndex===6?"STILLRAUM":`SEKTOR ${String(ye.state.roomIndex+1).padStart(2,"0")}`} // AURA IST ONLINE`,actions:'<button class="btn primary" data-action="explore">Raum erkunden \u2192</button>'})}function cr(){xd(),Nn("explore"),Dn(),ca(),gn()}function md(i=!1){if(bt!=="home")return;let e=i?ye.resume():ye.start();if(!si(e)&&!(e?.started&&!e?.ended)){jt(us(e));return}vl(),mn(550),i?cr():lh()}function M_(i){return typeof i.clue=="string"?i.clue:i.clue?.text||i.clue?.description||i.narrative}function hh(i=!0){ye.observeClue(),i&&(_l=0),Nn("clue");let e=ri(),t=e.clue?.sequence||e.clue?.symbols||e.puzzle?.sequence||[2,4,1,3];ai(wt(e.clue?.title||"Datenkristall"),`<p class="muted">${wt(M_(e))}</p>${e.index===0?`<div class="symbol-strip">${[1,2,3,4].map(n=>`<div class="puzzle-key" data-clue-symbol="${n}">${ah[n]}</div>`).join("")}</div><p class="muted" id="clue-status">Die Sequenz wird \xFCbertragen \u2026</p>`:""}<div class="insight-card"><span>DATENFRAGMENT</span><p>${e.index===6?"Ein verborgener Ausgang beginnt mit PAUSE.":wt((ye.state.fragments||[]).join(" \xB7 ")||"L\xF6se den Raum, um ein Fragment zu bergen.")}</p></div>`,{label:"ARCHIV // HINWEIS",actions:'<button class="btn primary" data-action="explore">Hinweis schlie\xDFen</button>'}),ke={type:"clue",sequence:t},Dn(),mn(680),gn()}function b_(){let i=ri();if(ye.state.roomSolved){jt("Dieser Raum ist entschl\xFCsselt. Das Portal ist offen.");return}if(!ye.state.observed?.includes(ye.state.roomIndex)){jt("Lies zuerst den Datenkristall auf der anderen Seite des Raums.");return}ke={type:i.kind||["memory","filter","circuit","bridge","schedule","final","secret"][i.index],symbols:[],selected:new Set,switches:[!1,!1,!1,!0],order:["send","test","plan","wire"]},Nn("puzzle"),yi()}function yi(){let i=ri(),e=i.index,t="";e===0?t=`<p class="muted">\xDCbertrage die vier Impulse aus dem Datenkristall in der richtigen Reihenfolge.</p><div class="symbol-strip" id="entered-symbols">${ke.symbols.map(n=>`<span>${ah[n]}</span>`).join("")||"<span>\u2013</span>"}</div><div class="puzzle-grid">${[1,2,3,4].map(n=>`<button class="puzzle-key" data-symbol="${n}" aria-label="Symbol ${n}">${ah[n]}<small>${n}</small></button>`).join("")}</div><button class="btn ghost" data-action="reset-memory">Eingabe l\xF6schen</button>`:e===1?t=`<p class="muted">Welche drei Nachrichten helfen dir beim Entkommen? W\xE4hle sie aus; k\xFCnstliche Dringlichkeit allein ist kein Grund.</p><div class="filter-list">${x_.map(n=>`<button class="choice-card ${ke.selected.has(n.id)?"is-selected":""}" data-message="${n.id}" aria-pressed="${ke.selected.has(n.id)}"><strong>${wt(n.label)}</strong><span>${wt(n.text)}</span><em>${ke.selected.has(n.id)?"\u2713 AUSGEW\xC4HLT":"AUSW\xC4HLEN"}</em></button>`).join("")}</div>`:e===2?t=`<p class="muted">Schalte den Ausgang frei. Genau zwei Kan\xE4le d\xFCrfen aktiv sein. A ist Pflicht. A braucht C. B und C vertragen sich nicht. D darf nur zusammen mit B laufen.</p><div class="circuit-board">${["A","B","C","D"].map((n,s)=>`<button class="circuit-node ${ke.switches[s]?"is-on":""}" data-switch="${s}" aria-pressed="${ke.switches[s]}"><span>${n}</span><strong>${["Versorgung","Zusatzlast","K\xFChlung","Nebenmodul"][s]}</strong><small>${ke.switches[s]?"AKTIV":"INAKTIV"}</small></button>`).join("")}</div><p class="muted">${ke.switches.filter(Boolean).length} / 2 Kan\xE4le aktiv \xB7 Der Bypass bietet eine andere L\xF6sung.</p>`:e===3?t=`<p class="muted">Betrete die Bodenplatten A \u2192 C \u2192 D \u2192 F mit deiner Figur. Beobachte die Laser oder nutze den Scanner. Der Schild erlaubt einen gesch\xFCtzten Weg \xFCber mindestens drei verschiedene Platten bis F.</p><div class="symbol-strip">${["A","C","D","F"].map(n=>`<span class="${ye.state.trapWitness?.includes(n)?"is-active":""}">${n}</span>`).join("")}</div><p class="muted">Aktuell: ${wt(ye.state.trapWitness?.join(" \u2192 ")||"Noch keine Platte erreicht")}</p>`:e===4?t=`<p class="muted">Ordne die Arbeitsschritte. Ein Wechsel zur n\xE4chsten Aufgabe lohnt sich erst, wenn die vorige Voraussetzung erf\xFCllt ist.</p><div class="task-list">${ke.order.map((n,s)=>`<div class="timeline-task"><span class="task-number">0${s+1}</span><strong>${Qc[n]}</strong><button class="btn ghost" data-task="${s}" data-direction="-1" aria-label="${Qc[n]} nach oben" ${s===0?"disabled":""}>\u2191</button><button class="btn ghost" data-task="${s}" data-direction="1" aria-label="${Qc[n]} nach unten" ${s===3?"disabled":""}>\u2193</button></div>`).join("")}</div>`:e===5?t=`<p class="muted">Setze die gesammelten Fragmente zum zentralen Code zusammen. Der verborgene Stillraum er\xF6ffnet einen zweiten Weg.</p><div class="symbol-strip">${(ye.state.fragments||[]).map(n=>`<span>${wt(n)}</span>`).join("")}</div><label class="code-label" for="escape-code">AUSGANGSCODE<input id="escape-code" type="text" maxlength="12" autocomplete="off" spellcheck="false" placeholder="F\xFCnf Zeichen" value="${wt(ke.code||"")}" /></label><p class="muted">${ye.state.secretSolved?"Stillraum-Archiv: PAUSE ist der alternative Code.":"Ein verborgener Raum kann einen weiteren Ausgang freilegen."}</p>`:t=`<p class="muted">Das Archiv zeigt drei M\xF6glichkeiten. Welche Strategie senkt vermeidbare Wechselkosten?</p><div class="puzzle-grid secret-answers">${["ALLE GLEICHZEITIG","EINE SACHE","SCHNELLER KLICKEN"].map(n=>`<button class="choice-card ${ke.secret===n?"is-selected":""}" data-secret-answer="${n}">${n}</button>`).join("")}</div>`,ai(wt(i.title),t,{label:"TERMINAL // ENTSCHL\xDCSSELN",className:"puzzle-panel",actions:`<button class="btn ghost" data-action="explore">Zum Raum</button>${e!==3?'<button class="btn primary" data-action="validate">L\xF6sung pr\xFCfen \u2192</button>':""}`})}function ch(){if(bt!=="puzzle"||!ke)return;let i=ri().index,e=i===0?ke.symbols:i===1?[...ke.selected]:i===2?ke.switches:i===3?"traverse":i===4?ke.order:i===5?He("escape-code").value.trim().toUpperCase():ke.secret,t=ye.solve(e,i===5&&e==="PAUSE"?"quiet":"balanced");if(Dn(),gn(),!si(t)){mn(180),jt(us(t));return}uh()}function uh(){mn(880,.25),Dn(),gn(),Nn("solved");let i=ri(),e=typeof i.insight=="string"?i.insight:i.insight?.text||i.lesson||"Fokus entsteht, wenn du relevante Signale erkennst und Aufgaben bewusst zu Ende bringst.";ai("Verbindung wiederhergestellt.",`<p class="muted">${wt(i.title)} ist entschl\xFCsselt. Das Ausgangsportal ist jetzt offen.</p><div class="insight-card"><span>WAS DU ENTDECKT HAST</span><p>${wt(e)}</p></div>${i.index===2?'<p class="muted">In der Wand ist eine zweite Signatur aufgetaucht. Untersuche sie, bevor du weitergehst.</p>':""}`,{label:"SYSTEM // ENTSPERRT",actions:'<button class="btn primary" data-action="explore">Zum Portal \u2192</button>'})}function yl(i){if(bt!=="explore")return;let e=i?Et.getTargets().find(t=>t.id===i):yd();if(e){if(Et.distanceToTarget(e.id)>2.15){jt("Gehe n\xE4her an das markierte Objekt. Ein Klick auf den Boden bewegt deine Figur.");return}if(gn(),mn(420),e.id==="clue")hh();else if(e.id==="console")b_();else if(e.id==="secret"){let t=ye.enterSecret();si(t)?(vl(),lh()):jt(us(t))}else if(e.id==="exit"||e.id==="quiet"){let t=ye.state.roomIndex===6?ye.leaveSecret():ye.state.roomIndex===5?ye.finish(e.id==="quiet"?"quiet":"balanced"):ye.nextRoom();if(!si(t)){jt(us(t));return}ye.state.ended?R_():(vl(),lh())}}}function E_(i){if(bt!=="explore"||ye.state?.roomIndex!==3||ye.state.roomSolved)return;let e=ye.traverseTile(i);if(Dn(),e?.hazard?(mn(160),jt(e.reason||"Unsichere Platte. Folge der gespeicherten Reihenfolge.")):e?.ok&&(mn(520),jt(`Platte ${i} \xB7 ${ye.state.trapWitness?.join(" \u2192 ")||""}`)),e?.complete){let t=ye.solve("traverse",ye.state.shieldActive?"shield":"balanced");si(t)&&uh()}}function T_(i){if(bt!=="explore"||ye.state?.roomIndex!==3||ye.state.roomSolved)return;let e=ye.hitHazard(typeof i=="string"?i:i?.id);si(e)&&!e.repeated&&(mn(180),jt(ye.state.shieldActive?"Dein Schild f\xE4ngt den Impuls ab.":"Impulsfeld ber\xFChrt. Beobachte den Rhythmus oder scanne den Raum."),Dn())}function gl(i="scanner"){if(!ye.state){jt("Betrete zuerst das Labyrinth.");return}if(bt==="ended")return;v_=i,Nn("tools");let e=ye.state;ai("Werkstatt f\xFCr deinen Fokus.",`<p class="muted">${e.credits} Credits verf\xFCgbar. Gel\xF6ste R\xE4ume finanzieren Werkzeuge; es gibt keine echten K\xE4ufe.</p><div class="tool-shop">${vd().map(t=>{let n=e.tools?.[t.id];return`<article class="tool-card tool-detail ${t.id===i?"selected":""}"><span class="tool-icon">${_d[t.id]}</span><h3>${wt(t.name)}</h3><p class="muted">${wt(t.description||t.desc||t.effect||"Ein Werkzeug f\xFCr alternative L\xF6sungswege.")}</p><small>${n?.owned?`Stufe ${n.level} \xB7 ${n.charges} Ladungen`:"Noch gesperrt"}</small><div class="tool-actions"><button class="btn primary" data-buy-tool="${t.id}">${n?.owned?"Aufladen":"Freischalten"} \xB7 ${t.cost??t.buyCost??{scanner:1,shield:2,planner:3,bypass:3}[t.id]} C</button>${n?.owned?`<button class="btn ghost" data-use-tool="${t.id}" ${n.charges<1?"disabled":""}>Einsetzen</button>${n.level<(t.maxLevel??(t.id==="bypass"?1:2))?`<button class="btn ghost" data-upgrade-tool="${t.id}">Upgrade \xB7 2 C</button>`:""}`:""}</div></article>`}).join("")}</div>`,{label:"TOOLS // DEINE STRATEGIE",className:"tools-panel",actions:'<button class="btn ghost" data-action="explore">Zur\xFCck zum Raum</button>'}),gn()}function A_(i){let e=ye.useTool(i);if(!si(e)){jt(us(e));return}if(Et.useTool?.(i),Dn(),mn(650),gn(),ye.state.roomSolved){uh();return}e.type==="clue"?(hh(),jt(i==="scanner"?"Scanner aktiv. Hinweise und Impulsfelder werden sichtbar.":"Der Planer zeigt die Abh\xE4ngigkeiten deiner Aufgaben.")):(cr(),jt(i==="shield"?"Schild bereit. Erreiche F \xFCber drei verschiedene Platten.":"Werkzeug aktiviert. Pr\xFCfe das Terminal erneut."))}function gd(){if(!ye.state)return;Nn("journal");let i=ye.state;ai("Der Weg durch M\u201306.",`<div class="room-map">${_s.map(e=>`<article class="map-room ${i.solved.includes(e.index)?"is-solved":""} ${i.roomIndex===e.index?"is-current":""}"><span>${e.index===6?"?":String(e.index+1).padStart(2,"0")}</span><div><strong>${e.index===6&&!i.secretUnlocked?"Verborgene Signatur":wt(e.title)}</strong><small>${i.solved.includes(e.index)?"Entschl\xFCsselt":i.roomIndex===e.index?"Du bist hier":"Noch verschlossen"}</small></div></article>`).join("")}</div><div class="symbol-strip">${i.fragments.map(e=>`<span>${wt(e)}</span>`).join("")}</div><p class="muted">${i.metrics?.ignored??i.metrics?.distractionsIgnored??0} St\xF6rungen bewusst ignoriert. ${i.metrics?.clicked??i.metrics?.distractionsClicked??0} Lockangebote ge\xF6ffnet.</p>`,{label:"JOURNAL // DEINE FRAGMENTE",actions:'<button class="btn primary" data-action="explore">Weiter erkunden</button>'}),gn()}function w_(){la=bt==="home"?"home":"explore",Nn(bt==="home"?"home":"help"),ai("Ein Muster nach dem anderen.",'<div class="controls-list"><p><kbd>WASD / Pfeile</kbd> Figur bewegen</p><p><kbd>Klick / Tap auf Boden</kbd> Bewegungsziel setzen</p><p><kbd>E</kbd> Nahe Objekte untersuchen \xB7 Klick auf nahe Objekte</p><p><kbd>1 2 3 4</kbd> Symbole im Ged\xE4chtnisr\xE4tsel</p><p><kbd>J</kbd> Raumkarte \xB7 <kbd>T</kbd> Werkzeuge \xB7 <kbd>Esc</kbd> Pause</p></div><p class="muted">Datenkristalle geben Hinweise, Terminals pr\xFCfen deine L\xF6sung und Portale f\xFChren weiter. Im Impulsraum betrittst du echte Bodenplatten mit deiner Figur. AURA-Nachrichten sind Spielsimulationen; k\xFCnstlicher Zeitdruck verpflichtet dich zu nichts.</p><p class="muted">Fokus und Stress sind vereinfachte Spielwerte. Lerninhalte behandeln Aufmerksamkeitsauswahl, Arbeitsged\xE4chtnis und Wechselkosten.</p>',{label:"QUICK START",actions:'<button class="btn primary" data-action="close-help">Verstanden</button>'})}function rh(){if(bt==="paused"){dh();return}["explore","puzzle","clue"].includes(bt)&&(la=bt,Nn("paused"),gn(),ai("Die St\xF6rung darf warten.",'<p class="muted">Bewegung, Hinweisfolge und Ablenkungs-Timer sind pausiert. Dein Fortschritt bleibt gespeichert.</p>',{label:"PAUSE // DEIN TEMPO",actions:'<button class="btn primary" data-action="resume">Weiterspielen</button><button class="btn ghost" data-action="home">Startmen\xFC</button>'}))}function dh(){la==="puzzle"&&ke?(Nn("puzzle"),yi()):la==="clue"?hh(!1):cr(),ca()}function R_(){Nn("ended"),Dn(),He("distraction-root").replaceChildren();let i=ye.state,e=i.ending==="quiet";ai(e?"Ein stiller Ausgang.":"Du hast deinen Fokus zur\xFCck.",`<p class="muted">${e?"Du hast den verborgenen Stillraum gefunden und den Ausgang au\xDFerhalb von AURAs Belohnungsschleife gew\xE4hlt.":"Du hast die zentralen Systeme entschl\xFCsselt und die Anlage durch das Hauptportal verlassen."}</p><div class="result-grid"><div><span>FOKUS</span><strong>${Math.round(i.focus)}</strong></div><div><span>STRESS</span><strong>${Math.round(i.stress)}</strong></div><div><span>SCORE</span><strong>${i.score??0}</strong></div><div><span>GEHEIMRAUM</span><strong>${i.secretSolved?"01 / 01":"00 / 01"}</strong></div></div><div class="insight-card"><span>DEIN WEG</span><p>Du hast relevante Signale ausgew\xE4hlt, Abfolgen gemerkt, Voraussetzungen gepr\xFCft und Aufgaben zu Ende gebracht. Tools sind unterschiedliche Strategien; bewusste Pausen geh\xF6ren dazu.</p></div>`,{label:"ESCAPE COMPLETE // MIND MAZE",actions:'<button class="btn primary" data-action="home">Zur\xFCck zum Start</button><button class="btn ghost" data-action="export">Spielverlauf exportieren</button>'}),gn(),mn(990,.3)}function C_(){let i=URL.createObjectURL(new Blob([JSON.stringify(ye.exportData(),null,2)],{type:"application/json"})),e=document.createElement("a");e.href=i,e.download="MIND-MAZE-Spielverlauf.json",e.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function ca(){let i=ye.state?.pendingDistraction;if(!i){He("distraction-root").replaceChildren(),sh=null;return}sh===i.id&&He("distraction-root").firstChild||(sh=i.id,xl=0,He("distraction-root").innerHTML=`<aside class="distraction-card"><div class="intrusion-label">AURA // SPIELSIMULATION</div><h3 class="intrusion-title">${wt(i.title||"Nur noch ein Klick.")}</h3><p class="intrusion-copy">${wt(i.text||i.message||"Eine scheinbare Belohnung wartet. Ist sie f\xFCr deinen Weg relevant?")}</p><div class="intrusion-timer" id="intrusion-timer">MELDUNG: 12 s</div><div class="intrusion-actions"><button class="btn danger" data-distraction="click">${wt(i.button||(i.deceptive?"\xD6ffnen":"Signal lesen"))}</button><button class="btn ghost" data-distraction="ignore">Ignorieren</button></div></aside>`,mn(230,.1))}function Sd(i){let e=ye.state?.pendingDistraction?.id;if(!e)return;let t=ye.respondDistraction(e,i);si(t)&&(jt(t.feedback||"Meldung abgeschlossen."),Dn(),ca(),gn())}function I_(i){i==="explore"?cr():i==="home"?oh():i==="resume"?dh():i==="validate"?ch():i==="reset-memory"?(ke.symbols=[],yi()):i==="close-help"?la==="home"?oh():cr():i==="export"?C_():i==="interact"&&yl()}function P_(){He("launch").onclick=()=>md(),He("continue").onclick=()=>md(!0),He("pause-button").onclick=rh,He("help-button").onclick=w_,He("map-button").onclick=gd,He("sound-toggle").onclick=y_,He("interact-button").onclick=()=>yl(),He("tools").addEventListener("click",e=>{let t=e.target.closest("[data-tool]");t&&gl(t.dataset.tool)}),He("distraction-root").addEventListener("click",e=>{let t=e.target.closest("[data-distraction]");t&&Sd(t.dataset.distraction)}),He("overlay-root").addEventListener("click",e=>{let t=e.target.closest("button");if(!(!t||t.disabled))if(t.dataset.action)I_(t.dataset.action);else if(t.dataset.symbol)ke.symbols.length<4&&(ke.symbols.push(Number(t.dataset.symbol)),mn(350+Number(t.dataset.symbol)*70),yi());else if(t.dataset.message)ke.selected.has(t.dataset.message)?ke.selected.delete(t.dataset.message):ke.selected.add(t.dataset.message),yi();else if(t.dataset.switch!==void 0){let n=Number(t.dataset.switch);ke.switches[n]=!ke.switches[n],mn(450),yi()}else if(t.dataset.task!==void 0){let n=Number(t.dataset.task),s=n+Number(t.dataset.direction);s>=0&&s<ke.order.length&&([ke.order[n],ke.order[s]]=[ke.order[s],ke.order[n]],yi())}else if(t.dataset.secretAnswer)ke.secret=t.dataset.secretAnswer,yi();else if(t.dataset.buyTool){let n=ye.buyTool(t.dataset.buyTool);si(n)?mn(700):jt(us(n)),Dn(),gl(t.dataset.buyTool)}else if(t.dataset.upgradeTool){let n=ye.upgradeTool(t.dataset.upgradeTool);si(n)?mn(740):jt(us(n)),Dn(),gl(t.dataset.upgradeTool)}else t.dataset.useTool&&A_(t.dataset.useTool)}),He("overlay-root").addEventListener("input",e=>{e.target.id==="escape-code"&&ke&&(ke.code=e.target.value)}),window.addEventListener("keydown",e=>{if(e.target instanceof HTMLInputElement&&e.key!=="Escape"){e.key==="Enter"&&bt==="puzzle"&&(e.preventDefault(),ch());return}e.repeat||(e.key==="Escape"?bt==="paused"?dh():["explore","puzzle","clue"].includes(bt)?rh():bt!=="home"&&bt!=="ended"&&cr():e.key.toLowerCase()==="j"&&bt==="explore"?(e.preventDefault(),gd()):e.key.toLowerCase()==="t"&&bt==="explore"?(e.preventDefault(),gl()):bt==="puzzle"&&ri().index===0&&["1","2","3","4"].includes(e.key)?(e.preventDefault(),ke.symbols.length<4&&(ke.symbols.push(Number(e.key)),yi())):e.key==="Enter"&&bt==="puzzle"&&(e.preventDefault(),ch()))});let i={forward:0,back:0,left:0,right:0};document.querySelectorAll("[data-move]").forEach(e=>{let t=n=>{i[e.dataset.move]=n,Et.setMovement(i.forward-i.back,i.right-i.left)};e.addEventListener("pointerdown",n=>{n.preventDefault(),e.setPointerCapture(n.pointerId),t(1)});for(let n of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(n,()=>t(0))}),document.querySelector('[data-action="interact"]').onclick=()=>yl(),window.addEventListener("pagehide",gn),window.addEventListener("blur",()=>{["explore","puzzle","clue"].includes(bt)&&rh()})}function Md(i){let e=Math.min(.08,Math.max(0,(i-fd)/1e3));fd=i,Et.update(e,i/1e3);let t=["explore","puzzle","clue"].includes(bt);if(bt==="clue"&&ri().index===0&&ke?.type==="clue"){_l+=e;let n=Math.floor(_l/1.05);document.querySelectorAll("[data-clue-symbol]").forEach(r=>r.classList.toggle("is-active",n<ke.sequence.length&&Number(r.dataset.clueSymbol)===ke.sequence[n]&&_l%1.05<.75));let s=He("clue-status");s&&(s.textContent=n<ke.sequence.length?`IMPULS ${n+1} / ${ke.sequence.length}`:"\xDCbertragung beendet. Merke dir die Reihenfolge.")}if(t&&ye.state&&!ye.state.ended){if(th+=e,nh+=e,eh+=e,th>2&&(th=0,gn()),bt==="explore"&&nh>.16){nh=0;let n=yd();He("interact-button").disabled=!n||n.distance>2.15;let s=He("interact-button").querySelector("span:nth-child(2)");s&&(s.textContent=n?`${n.label||n.id} \xB7 ${n.distance.toFixed(1)} m`:"Interagieren")}ye.state.pendingDistraction?(ca(),xl+=e,He("intrusion-timer")&&(He("intrusion-timer").textContent=`MELDUNG: ${Math.max(0,Math.ceil(12-xl))} s`),xl>=12&&Sd("ignore")):eh>2&&(eh=0,ye.triggerDistraction(),ca())}requestAnimationFrame(Md)}async function L_(){try{if(Et=dd({canvas:He("world"),onInteract:yl,onHazard:T_,onTile:E_,onMove:()=>{}}),P_(),oh(),He("loading").hidden=!0,requestAnimationFrame(Md),location.protocol==="file:"&&(He("download").hidden=!0,document.querySelector(".back-link").hidden=!0),window.__MIND_MAZE__=Object.freeze({getSnapshot:()=>JSON.parse(JSON.stringify({version:"1.0.0",scene:bt,state:ye.state,world:Et.getStats(),position:Et.getPlayerPosition(),targets:Et.getTargets(),tiles:Et.getTiles?.(),storageFailed:ye.storageFailed,puzzle:ke?{type:ke.type,symbols:ke.symbols,order:ke.order,switches:ke.switches,selected:[...ke.selected||[]]}:null}))}),location.protocol.startsWith("http")&&"serviceWorker"in navigator){let i=!!navigator.serviceWorker.controller,e=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{i&&!e&&(e=!0,gn(),location.reload())}),navigator.serviceWorker.register("./sw.js").catch(()=>{})}}catch(i){console.error("MIND MAZE startup failed",i),He("loading").hidden=!0,ai("Die Anlage konnte nicht starten.",`<p class="muted">\xD6ffne das Spiel in einem aktuellen Browser mit WebGL 2 und Hardwarebeschleunigung.</p><p class="muted">${wt(i.message)}</p>`,{actions:'<button class="btn primary" data-reload>Erneut starten</button>'}),document.querySelector("[data-reload]").onclick=()=>location.reload()}}L_();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
