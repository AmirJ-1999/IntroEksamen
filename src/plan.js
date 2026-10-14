/* ===== Dagens plan (start page): today's goals across flashcards, Python Lab, Netværk Lab and the mock exam,
   plus a streak and the last 7 days. Activity per day lives in its_activity (synced with the account):
   {day: {c: cards reviewed, p: Python tasks passed, n: Netværk Lab answers, e: mock exams}}. */
const ACT_KEY="its_activity", PLAN_NQ_GOAL=10;
function actLoad(){try{return JSON.parse(localStorage.getItem(ACT_KEY)||"{}")||{}}catch{return {}}}
function actLog(kind,n=1){
  const a=actLoad(),d=srsToday();
  a[d]={...(a[d]||{})};a[d][kind]=(a[d][kind]||0)+n;
  for(const k of Object.keys(a))if(+k<d-90)delete a[k];      // keep three months
  try{localStorage.setItem(ACT_KEY,JSON.stringify(a))}catch{}
}
const actTotal=e=>e?(e.c||0)+(e.p||0)+(e.n||0)+(e.e||0):0;
function actStreak(){
  const a=actLoad(),today=srsToday();
  let d=actTotal(a[today])?today:today-1,n=0;     // today without activity yet doesn't break the streak
  while(actTotal(a[d])){n++;d--}
  return {n,today:!!actTotal(a[today])};
}

/* count activity where it happens */
const _planNqRecord=nqRecord;
nqRecord=function(spec,ok){_planNqRecord(spec,ok);actLog("n")};
const _planShowResults=showResults;
showResults=function(rs){_planShowResults(rs);if(rs.length&&rs.every(r=>r.ok))actLog("p")};

/* the next Python Lab task: easiest one not passed yet */
function planNextPy(){
  const all=LIVE_CHALLENGES,open=all.filter(x=>liveProgress[x.id]!=="passed");
  const next=open.slice().sort((a,b)=>a.difficulty-b.difficulty)[0]||null;
  return {next,passed:all.length-open.length,total:all.length};
}
function planOpenPy(task){
  if(currentView==="live")saveCurrentCode();
  liveSet="ovelser";try{localStorage.setItem("its_live_set","ovelser")}catch{}
  liveCategory="all";liveDifficulty="all";liveIndex=Math.max(0,LIVE_CHALLENGES.indexOf(task));
  setView("live");closeSandbox();
}
/* the Netværk Lab suggestion: questions answered wrong last time, otherwise the weakest topic */
function planNq(){
  const weak=nqWeak().length;
  const topics=NQ_TOPICS.map(t=>({t,m:nqMastery(t.id),a:nqTopicCounts(t.id).answered}));
  const weakest=topics.slice().sort((x,y)=>x.m-y.m||x.a-y.a)[0];
  return {weak,weakest};
}

function renderHomeToday(){
  let box=$("#homeToday");
  if(!box){$("#homeView .quickstart").insertAdjacentHTML("beforebegin",`<section class="plan" id="homeToday" aria-label="Dagens plan"></section>`);box=$("#homeToday")}
  const a=actLoad(),today=srsToday(),t=a[today]||{};
  const sP=srsStats("Python"),sN=srsStats("Netværk");
  const cardsLeft=sP.due+sP.fresh+sN.due+sN.fresh,cardsDone=t.c||0;
  const py=planNextPy(),nq=planNq(),nqDone=t.n||0;
  const running=exam&&!exam.ended,last=exHist()[0];
  const goals=[
    {id:"cards",done:cardsLeft===0,ic:"rotate",
     title:cardsLeft?`Repetér ${cardsLeft} flashcards`:cardsDone?`${cardsDone} kort repeteret i dag`:"Ingen kort at repetere i dag",
     sub:cardsLeft?(cardsDone?`${cardsDone} repeteret indtil videre · `:"")+"Vælg fag:":"Godt klaret. Kortene kommer igen, når det er tid.",
     prog:cardsLeft?cardsDone/(cardsDone+cardsLeft):1,
     act:cardsLeft?[["Python",sP.due+sP.fresh],["Netværk",sN.due+sN.fresh]].filter(x=>x[1]).map(([s,n])=>`<button class="plan-chip" data-cards="${s}">${icon(s==="Python"?"braces":"network")}${s}<b>${n}</b></button>`).join(""):`<button class="btn" data-go3="study">${icon("cards")}Alle kort</button>`},
    {id:"py",done:(t.p||0)>=1,ic:"code",
     title:(t.p||0)>=1?`${t.p} Python-opgave${t.p>1?"r":""} løst i dag`:"Løs en Python-opgave",
     sub:py.next?`Næste: <b>${esc(py.next.title)}</b> · ${esc(py.next.category)} · niveau ${py.next.difficulty} · ${py.passed}/${py.total} bestået`:`Alle ${py.total} øvelser er bestået. Prøv Mandatory opgave 1.`,
     prog:Math.min(1,(t.p||0)),
     act:py.next?`<button class="btn ${(t.p||0)>=1?"":"primary"}" data-py>${icon("play")}${(t.p||0)>=1?"Én til":"Åbn opgaven"}</button>`:`<button class="btn" data-go3="live">${icon("code")}Python Lab</button>`},
    {id:"nq",done:nqDone>=PLAN_NQ_GOAL,ic:"target",
     title:nqDone>=PLAN_NQ_GOAL?`${nqDone} netværksspørgsmål besvaret i dag`:`Besvar ${PLAN_NQ_GOAL} spørgsmål i Netværk Lab`,
     sub:nq.weak>=5?`Du har ${nq.weak} spørgsmål, du svarede forkert på sidst.`:`Dit svageste emne: <b>${esc(nq.weakest.t.name)}</b> (${nq.weakest.m}% mestret)`,
     prog:Math.min(1,nqDone/PLAN_NQ_GOAL),progTxt:nqDone<PLAN_NQ_GOAL&&nqDone?`${nqDone}/${PLAN_NQ_GOAL}`:"",
     act:nq.weak>=5?`<button class="btn ${nqDone>=PLAN_NQ_GOAL?"":"primary"}" data-nq="weak">${icon("target")}Øv svage punkter</button>`:`<button class="btn ${nqDone>=PLAN_NQ_GOAL?"":"primary"}" data-nq="${nq.weakest.t.id}">${icon("target")}Øv ${esc(nq.weakest.t.name)}</button>`}
  ];
  const doneN=goals.filter(g=>g.done).length,allDone=doneN===goals.length;
  const examDone=(t.e||0)>=1;
  const extra={id:"exam",done:examDone,ic:"graduation",optional:true,
    title:running?"Prøveeksamen i gang":examDone?"Prøveeksamen taget i dag":"Tag en prøveeksamen",
    sub:running?"Fortsæt, hvor du slap.":last?`Sidst: ${[last.py?`Python ${last.py.pct}%`:"",last.net?`Netværk ${last.net.pct}%`:""].filter(Boolean).join(" · ")} · ${planAgo(last.t)}`:"Python + Netværk på 20 minutter, som til den rigtige eksamen.",
    prog:examDone?1:0,
    act:`<button class="btn" data-exam>${icon(running?"play":"arrowRight")}${running?"Fortsæt":"Start"}</button>`};
  const st=actStreak();
  const days=["S","M","T","O","T","F","L"],week=[];
  for(let d=today-6;d<=today;d++){const n=actTotal(a[d]),lv=!n?0:n<10?1:n<30?2:3,dt=new Date((d*864e5)+new Date().getTimezoneOffset()*60000);
    week.push(`<span class="plan-day lv${lv} ${d===today?"now":""}" title="${dt.toLocaleDateString("da-DK",{weekday:"long",day:"numeric",month:"short"})}: ${n} aktiviteter"><i></i><small>${days[dt.getDay()]}</small></span>`)}
  const date=new Date().toLocaleDateString("da-DK",{weekday:"long",day:"numeric",month:"long"});
  const item=g=>`<div class="plan-item ${g.done?"done":""} ${g.optional?"optional":""}">
      <span class="plan-check">${g.done?icon("check"):icon(g.ic)}</span>
      <div class="plan-txt"><b>${g.title}${g.optional?`<span class="plan-opt">Valgfri</span>`:""}</b><span>${g.sub}</span>
        ${!g.done&&g.prog>0&&g.prog<1?`<span class="plan-bar"><i style="width:${g.prog*100}%"></i></span>`:""}</div>
      <div class="plan-act">${g.act}</div></div>`;
  box.innerHTML=`<div class="plan-side">
      <div class="plan-kicker">${icon("sparkles")}Dagens plan</div>
      <div class="plan-date">${date.charAt(0).toUpperCase()+date.slice(1)}</div>
      <div class="plan-ring ${allDone?"all":""}" style="--p:${doneN/goals.length*100}"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="planRingG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1fcfc1"/><stop offset="1" stop-color="#3a5fe0"/></linearGradient></defs><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" pathLength="100" stroke="url(#planRingG)"/></svg>
        <div>${allDone?icon("trophy"):`<b>${doneN}<small>/${goals.length}</small></b>`}<span>${allDone?"Alle mål nået":"mål i dag"}</span></div></div>
      <div class="plan-streak ${st.n?"on":""}">${icon("bolt")}<div><b>${st.n?`${st.n} dag${st.n>1?"e":""} i træk`:"Ingen streak endnu"}</b><span>${st.n?st.today?"Du har øvet i dag":"Øv i dag for at holde den":"Øv lidt i dag for at starte en"}</span></div></div>
      <div class="plan-week" aria-label="De sidste 7 dage">${week.join("")}</div>
    </div>
    <div class="plan-items">${goals.map(item).join("")}${item(extra)}</div>`;
  box.querySelectorAll("[data-cards]").forEach(b=>b.onclick=()=>{if(subject!==b.dataset.cards){subject=b.dataset.cards;syncSubject()}startTodaySession()});
  box.querySelectorAll("[data-go3]").forEach(b=>b.onclick=()=>{statusFilter="all";studyIndex=0;setView(b.dataset.go3)});
  box.querySelector("[data-py]")?.addEventListener("click",()=>planOpenPy(py.next));
  box.querySelectorAll("[data-nq]").forEach(b=>b.onclick=()=>{setView("netlab");nqStart(b.dataset.nq)});
  box.querySelector("[data-exam]").onclick=()=>{if(exam?.ended){exam=null;exSave()}setView("exam")};
}
function planAgo(t){
  const d=srsToday()-Math.floor((t-new Date(t).getTimezoneOffset()*60000)/864e5);
  return d<=0?"i dag":d===1?"i går":`for ${d} dage siden`;
}
