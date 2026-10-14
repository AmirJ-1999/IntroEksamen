/* ===== Prøveeksamen: setup → Python (live coding) and/or Netværk (oral) on one clock → result =====
   The running exam lives in its_exam_cur (this browser only), finished attempts in its_exam_hist (synced). */
EXT_VIEWS.push("exam");
const EXAM_KEY="its_exam_cur", EXAM_HIST="its_exam_hist";
let exam=null;
try{exam=JSON.parse(localStorage.getItem(EXAM_KEY)||"null")}catch{}
if(exam?.ended)exam=null;     // a finished exam is in the history; a new visit starts at the setup
let examSetup={mode:"both",first:"py",timed:true};
let examTick=null;
const exSave=()=>{try{exam?localStorage.setItem(EXAM_KEY,JSON.stringify(exam)):localStorage.removeItem(EXAM_KEY)}catch{}};
const exHist=()=>{try{return JSON.parse(localStorage.getItem(EXAM_HIST)||"[]")||[]}catch{return []}};
const exChain=()=>EXAM_PY.find(c=>c.id===exam.py.chain);
const exLayer=()=>EXAM_NET.find(l=>l.layer===exam.net.layer);
const exNetItems=()=>[EXAM_NET_MODEL,...exam.net.qs.map(i=>exLayer().qs[i])];
const exPlain=h=>String(h).replace(/<[^>]+>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
const exPartName=p=>p==="py"?"Python":"Netværk";
const mmss=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const exShuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const exElapsed=()=>((exam.ended||Date.now())-exam.started)/1000;

function examStart(){
  const {mode,first,timed}=examSetup,last=exHist()[0];
  const chains=EXAM_PY.filter(c=>c.id!==last?.py?.chain);            // a different Python forløb than last time
  const chain=chains[Math.floor(Math.random()*chains.length)];
  const L=exShuffle(EXAM_NET.filter(l=>l.layer!==last?.net?.layer))[0];
  const head=L.qs.findIndex(q=>q.head),others=exShuffle(L.qs.map((q,i)=>i).filter(i=>i!==head)).slice(0,2);
  const blank=()=>({st:"",hint:false,pts:[],open:false,notes:""});
  exam={mode,order:mode==="both"?(first==="py"?["py","net"]:["net","py"]):[mode],part:0,
    limit:timed?(mode==="both"?20:10)*60:0,started:Date.now(),ended:null,half:false,over:false,
    py:{chain:chain.id,idx:0,max:0,res:chain.steps.map(blank),
      code:`# Prøveeksamen: ${chain.title}\n# Koden bliver stående, når du går videre. Byg videre på den.\n\n`},
    net:{layer:L.layer,qs:[head,...others],idx:0,max:0,revealed:false,res:[0,1,2,3].map(blank)}};
  exSave();exToastHide();renderExam();window.scrollTo({top:0,behavior:"smooth"});
}
function exFinish(){
  if(!exam||exam.ended)return;
  exam.ended=Date.now();
  actLog("e");
  const h=exHist();
  h.unshift({t:exam.ended,mode:exam.mode,secs:Math.round(exElapsed()),
    py:exam.order.includes("py")?{chain:exam.py.chain,pct:exPyScore()}:null,
    net:exam.order.includes("net")?{layer:exam.net.layer,pct:exNetScore()}:null});
  try{localStorage.setItem(EXAM_HIST,JSON.stringify(h.slice(0,20)))}catch{}
  exSave();exToastHide();renderExam();window.scrollTo({top:0,behavior:"smooth"});
}
function exPyScore(){
  const ch=exChain();let s=0;
  ch.steps.forEach((st,k)=>{const r=exam.py.res[k];s+=st.t==="code"?(r.st==="passed"?(r.hint?.75:1):0):r.pts.length/st.points.length});
  return Math.round(s/ch.steps.length*100);
}
function exNetScore(){
  let got=0,tot=0;
  exNetItems().forEach((it,k)=>{got+=exam.net.res[k].pts.length;tot+=it.points.length});
  return Math.round(got/tot*100);
}
const exPartDone=p=>p==="py"?exam.py.res.every(r=>r.st):exam.net.res.every(r=>r.st);

/* ---------- clock, toast and the "exam running" pill ---------- */
function exTick(){
  const live=exam&&!exam.ended;
  if(!live){clearInterval(examTick);examTick=null}
  exPill();
  if(!live)return;
  const el=exElapsed(),rem=exam.limit?exam.limit-el:null,t=$("#exTime");
  if(t){
    t.textContent=rem===null?mmss(el):rem>=0?mmss(rem):"+"+mmss(-rem);
    const c=t.closest(".ex-clock");c.classList.toggle("over",rem!==null&&rem<0);c.classList.toggle("low",rem!==null&&rem>=0&&rem<120);
    const bar=$("#exTimeBar");if(bar)bar.style.width=Math.min(100,el/exam.limit*100)+"%";
  }
  if(exam.limit&&exam.order.length>1&&!exam.half&&exam.part===0&&el>=exam.limit/2){
    exam.half=true;exSave();
    exToast(`Halvdelen af tiden er gået. Tid til at gå videre til ${exPartName(exam.order[1])}.`,"Skift nu",()=>exGoPart(1));
  }
  if(exam.limit&&rem<0&&!exam.over){exam.over=true;exSave();exToast("Tiden er gået. Gør den sidste opgave færdig, eller se dit resultat.","Se resultat",()=>{setView("exam");exFinish()})}
}
function exTickStart(){if(!examTick)examTick=setInterval(exTick,1000);exTick()}
const exToastEl=document.createElement("div");exToastEl.className="ex-toast";exToastEl.hidden=true;document.body.appendChild(exToastEl);
function exToast(msg,label,fn){
  exToastEl.innerHTML=`<span class="ex-toast-ic">${icon("timer")}</span><span>${esc(msg)}</span>${label?`<button class="btn run">${esc(label)}</button>`:""}<button class="ex-toast-x" aria-label="Luk">${icon("x")}</button>`;
  exToastEl.hidden=false;
  exToastEl.querySelector(".btn")?.addEventListener("click",()=>{exToastHide();fn()});
  exToastEl.querySelector(".ex-toast-x").onclick=exToastHide;
}
function exToastHide(){exToastEl.hidden=true}
const exPillEl=document.createElement("button");exPillEl.className="exam-pill";exPillEl.hidden=true;document.body.appendChild(exPillEl);
exPillEl.onclick=()=>setView("exam");
function exPill(){
  const show=!!(exam&&!exam.ended&&currentView!=="exam");
  exPillEl.hidden=!show;if(!show)return;
  const rem=exam.limit?exam.limit-exElapsed():null;
  exPillEl.innerHTML=`${icon("graduation")}<span>Prøveeksamen</span><b>${rem===null?mmss(exElapsed()):rem>=0?mmss(rem):"+"+mmss(-rem)}</b>`;
}

/* ---------- screens ---------- */
function renderExam(){
  const host=$("#examBody");if(!host)return;
  host.innerHTML=!exam?exSetupHTML():exam.ended?exResultHTML():exRunHTML();
  if(!exam)exBindSetup();else if(exam.ended)exBindResult();else{exBindRun();exTickStart()}
}
function exSetupHTML(){
  const s=examSetup,opt=(k,ic,t,d)=>`<button class="ex-opt ${s.mode===k?"on":""}" data-mode="${k}"><span class="ex-opt-ic">${icon(ic)}</span><b>${t}</b><small>${d}</small><span class="ex-opt-check">${icon("check")}</span></button>`;
  const h=exHist().slice(0,6);
  return `<div class="hero"><div><div class="eyebrow">Eksamen · test dig selv</div><h1 style="font-size:clamp(26px,3.4vw,40px)">Prøveeksamen</h1>
    <p>Øv eksamen, som den foregår: Python som live coding, hvor hver opgave bygger videre på den forrige, og Netværk som en mundtlig samtale, hvor eksaminator vælger et lag. Bagefter ser du, hvad du klarede, og hvad du skal øve.</p></div></div>
  <div class="ex-setup">
    <div class="ex-setup-main">
      <h3 class="ex-h">Hvad vil du øve?</h3>
      <div class="ex-opts">${opt("both","graduation","Hele eksamen",s.timed?"Python + Netværk · 20 min":"Python + Netværk")}${opt("py","braces","Kun Python",s.timed?"Live coding · 10 min":"Live coding")}${opt("net","network","Kun Netværk",s.timed?"Mundtlig · 10 min":"Mundtlig")}</div>
      <div class="ex-row">
        ${s.mode==="both"?`<div class="ex-seg" role="group" aria-label="Start med"><span>Start med</span><button data-first="py" aria-pressed="${s.first==="py"}">Python</button><button data-first="net" aria-pressed="${s.first==="net"}">Netværk</button></div>`:""}
        <div class="ex-seg" role="group" aria-label="Tid"><span>Tid</span><button data-timed="1" aria-pressed="${s.timed}">Med tidsgrænse</button><button data-timed="0" aria-pressed="${!s.timed}">Uden</button></div>
      </div>
      <button class="btn run ex-go" id="exGo">${icon("play")}Start prøveeksamen</button>
    </div>
    <aside class="ex-how"><h3 class="ex-h">Sådan foregår det</h3><ol>
      <li><span>${icon("braces")}</span><div><b>Python</b><p>Én lille opgave ad gangen. Koden bliver stående, og næste opgave bygger videre på den. Indimellem skal du forklare din kode. Tjek dine løsninger med tests. Et hint koster lidt.</p></div></li>
      <li><span>${icon("network")}</span><div><b>Netværk</b><p>Du forklarer 5-lagsmodellen, og så vælger eksaminator et lag. Svar højt, og tjek bagefter, hvad et godt svar skulle have med.</p></div></li>
      <li><span>${icon("trophy")}</span><div><b>Resultat</b><p>Du ser din score, hvad du manglede, og hvor du kan øve videre.</p></div></li></ol></aside>
  </div>
  ${h.length?`<div class="section-head"><div><h2>Tidligere forsøg</h2><p>Gemt på din konto, hvis du er logget ind.</p></div></div>
  <div class="ex-hist">${h.map(x=>`<div class="ex-hist-row"><span class="ex-hist-date">${new Date(x.t).toLocaleDateString("da-DK",{day:"numeric",month:"short"})}</span>
    <span class="ex-hist-mode">${x.mode==="both"?"Hele eksamen":"Kun "+exPartName(x.mode)}</span>
    ${x.py?`<span class="ex-hist-sc">${icon("braces")}${x.py.pct}%</span>`:""}${x.net?`<span class="ex-hist-sc">${icon("network")}${x.net.pct}% <small>${esc(x.net.layer)}</small></span>`:""}
    <span class="ex-hist-time">${icon("clock")}${mmss(x.secs)}</span></div>`).join("")}</div>`:""}`;
}
function exBindSetup(){
  $$("#examBody [data-mode]").forEach(b=>b.onclick=()=>{examSetup.mode=b.dataset.mode;renderExam()});
  $$("#examBody [data-first]").forEach(b=>b.onclick=()=>{examSetup.first=b.dataset.first;renderExam()});
  $$("#examBody [data-timed]").forEach(b=>b.onclick=()=>{examSetup.timed=b.dataset.timed==="1";renderExam()});
  $("#exGo").onclick=examStart;
}

function exRunHTML(){
  const cur=exam.order[exam.part];
  const tabs=exam.order.map((p,i)=>`<button class="ex-part ${i===exam.part?"on":""} ${exPartDone(p)?"done":""}" data-part="${i}"><span class="ex-part-n">${exPartDone(p)?icon("check"):i+1}</span>${exPartName(p)}</button>`).join("");
  return `<div class="ex-bar">
    <div class="ex-parts">${tabs}</div>
    <div class="ex-clock">${icon("timer")}<b id="exTime">--:--</b><small>${exam.limit?"tilbage":"brugt"}</small>${exam.limit?`<span class="ex-clock-bar"><i id="exTimeBar"></i></span>`:""}</div>
    <button class="btn" id="exEnd">${icon("checkCircle")}<span>Afslut</span></button></div>
  <div class="ex-stage">${cur==="py"?exPyHTML():exNetHTML()}</div>`;
}
const exNextLabel=last=>last?(exam.part<exam.order.length-1?`Videre til ${exPartName(exam.order[exam.part+1])}`:"Afslut og se resultat"):null;
function exStepsHTML(res,idx,max,attr){
  return `<div class="ex-steps" role="list">${res.map((r,k)=>`<button class="ex-step ${k===idx?"on":""} ${r.st}" data-${attr}="${k}" ${k>max?"disabled":""} aria-label="Trin ${k+1}"><span>${r.st==="passed"||r.st==="answered"?icon("check"):r.st==="skipped"?icon("x"):k+1}</span></button>`).join("")}</div>`;
}
function exPyHTML(){
  const ch=exChain(),P=exam.py,i=P.idx,st=ch.steps[i],r=P.res[i],last=i===ch.steps.length-1;
  const head=`<div class="ex-task-head"><div><div class="eyebrow">Python · live coding</div><h2>${esc(ch.title)}</h2></div>${exStepsHTML(P.res,i,P.max,"step")}</div>`;
  if(st.t==="explain")return head+exAskHTML(st.q,st.points,r,"py",exNextLabel(last)||"Næste opgave");
  const next=r.st==="passed"?(exNextLabel(last)||"Næste opgave"):"Spring over";
  return head+`<div class="ex-py">
    <div class="ex-task">
      <div class="ex-kicker">${icon("code")}Opgave ${i+1} af ${ch.steps.length}</div>
      <p class="ex-prompt">${st.prompt}</p>
      ${r.hint?`<div class="ex-hint">${icon("bulb")}<div><b>Hint</b><p>${st.hint}</p></div></div>`:`<button class="btn ex-hint-btn" id="exHintBtn">${icon("bulb")}Vis hint <small>(koster lidt)</small></button>`}
      <p class="ex-note">${icon("info")}Koden fra de forrige opgaver bliver stående. Byg videre på den, ligesom til eksamen.</p>
    </div>
    <div class="ex-editor">
      <div class="ex-ed-head"><span class="g-code-lang"><i class="g-dots"><b></b><b></b><b></b></i>main.py</span><span class="ex-ed-keys">Ctrl+Enter tjekker · Tab rykker ind</span></div>
      <textarea class="code-input" id="exCode" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Din kode">${esc(P.code)}</textarea>
      <div class="ex-ed-actions"><button class="btn" id="exRun">${icon("play")}Kør</button><button class="btn run" id="exCheck">${icon("checkCircle")}Tjek opgaven</button>
        <span class="ex-flex"></span><button class="btn ${r.st==="passed"?"primary":""}" id="exNext">${next}${icon("arrowRight")}</button></div>
      <div class="results ex-out" id="exOut" aria-live="polite">${r.st==="passed"?`<div class="results-sum ok">${icon("checkCircle")} Opgaven er løst${r.hint?" (med hint)":""}</div>`:""}</div>
    </div></div>`;
}
function exAskHTML(q,points,r,kind,nextLbl,chip=""){
  return `<div class="ex-ask">
    ${chip}
    <div class="ex-kicker">${icon("message")}${kind==="net"?"Mundtligt spørgsmål":"Forklar din kode"}</div>
    <h3 class="ex-q">${q}</h3>
    <p class="ex-ask-help">Svar højt, som hvis eksaminator sad over for dig. Skriv eventuelt stikord, og tjek dig selv bagefter.</p>
    <textarea class="input ex-notes" id="exNotes" placeholder="Dine stikord (valgfrit) …">${esc(r.notes||"")}</textarea>
    ${r.open?`<div class="ex-check">
        <div class="ex-check-head"><b>${icon("checkCircle")}Det her dækker et godt svar</b><span>Sæt flueben ved det, du fik sagt</span></div>
        ${points.map((p,k)=>`<label class="ex-pt ${r.pts.includes(k)?"on":""}"><input type="checkbox" data-pt="${k}" ${r.pts.includes(k)?"checked":""}><span class="ex-box">${icon("check")}</span><span>${esc(p)}</span></label>`).join("")}
        <div class="ex-score"><span class="ex-score-bar"><i style="width:${r.pts.length/points.length*100}%"></i></span><b id="exPtScore">${r.pts.length} af ${points.length}</b></div>
      </div>
      <div class="ex-ask-actions"><button class="btn run" id="exNext">${nextLbl}${icon("arrowRight")}</button></div>`
    :`<div class="ex-ask-actions"><button class="btn primary" id="exReveal">${icon("eye")}Jeg har svaret. Vis hvad et godt svar indeholder</button></div>`}
  </div>`;
}
function exNetHTML(){
  const N=exam.net,items=exNetItems(),i=N.idx,it=items[i],r=N.res[i],last=i===items.length-1;
  const head=`<div class="ex-task-head"><div><div class="eyebrow">Netværk · mundtlig</div><h2>${i===0||!N.revealed?"5-lagsmodellen":"Lag: "+esc(N.layer)}</h2></div>${exStepsHTML(N.res,i,N.revealed?N.max:0,"nstep")}</div>`;
  if(i>0&&!N.revealed)return head+`<div class="ex-reveal"><p>Eksaminator vælger et lag …</p><div class="ex-reveal-name" id="exRevealName">Application</div><div class="ex-reveal-layers">${["Application","Transport","Network","Link","Physical"].map(l=>`<span data-l="${l}">${l}</span>`).join("")}</div></div>`;
  const chip=i===0?`<div class="ex-chip">${icon("layers")}Først: tegn modellen</div>`:`<div class="ex-chip">${icon("layers")}${esc(N.layer)} · spørgsmål ${i} af ${items.length-1}${it.head?" · headeren":""}</div>`;
  return head+exAskHTML(it.q,it.points,r,"net",exNextLabel(last)||"Næste spørgsmål",chip);
}

function exGoPart(i){exam.part=i;exSave();renderExam();window.scrollTo({top:0,behavior:"smooth"})}
function exAdvance(){
  const p=exam.order[exam.part],S=exam[p],r=S.res[S.idx];
  if(!r.st)r.st=p==="net"||(p==="py"&&exChain().steps[S.idx].t==="explain")?"answered":"skipped";
  if(S.idx<S.res.length-1){S.idx++;S.max=Math.max(S.max,S.idx);exSave();renderExam();$(".ex-stage")?.scrollIntoView({behavior:"smooth",block:"start"});return}
  const nextPart=exam.order.findIndex((q,k)=>k!==exam.part&&!exPartDone(q));
  if(nextPart>=0)exGoPart(nextPart);else exFinish();
}
function exBindRun(){
  $$("#examBody [data-part]").forEach(b=>b.onclick=()=>exGoPart(+b.dataset.part));
  $("#exEnd").onclick=()=>{if(confirm("Afslut prøveeksamen og se resultatet?"))exFinish()};
  $$("#examBody [data-step]").forEach(b=>b.onclick=()=>{exam.py.idx=+b.dataset.step;exSave();renderExam()});
  $$("#examBody [data-nstep]").forEach(b=>b.onclick=()=>{exam.net.idx=+b.dataset.nstep;exSave();renderExam()});
  const p=exam.order[exam.part],S=exam[p],r=S.res[S.idx];
  $("#exNext")&&($("#exNext").onclick=exAdvance);
  /* explain / oral */
  const notes=$("#exNotes");if(notes)notes.oninput=()=>{r.notes=notes.value;exSave()};
  $("#exReveal")&&($("#exReveal").onclick=()=>{r.open=true;exSave();renderExam();$(".ex-check")?.scrollIntoView({behavior:"smooth",block:"nearest"})});
  $$("#examBody [data-pt]").forEach(cb=>cb.onchange=()=>{
    const k=+cb.dataset.pt;r.pts=cb.checked?[...new Set([...r.pts,k])]:r.pts.filter(x=>x!==k);exSave();
    cb.closest(".ex-pt").classList.toggle("on",cb.checked);
    const n=$$("#examBody [data-pt]").length;$("#exPtScore").textContent=`${r.pts.length} af ${n}`;$(".ex-score-bar i").style.width=r.pts.length/n*100+"%";
  });
  /* the layer reveal */
  if(p==="net"&&S.idx>0&&!S.revealed){
    const names=["Application","Transport","Network","Link"],el=$("#exRevealName");let k=0;
    const spin=setInterval(()=>{k++;el.textContent=names[k%4];$$(".ex-reveal-layers span").forEach(s=>s.classList.toggle("on",s.dataset.l===names[k%4]))},110);
    setTimeout(()=>{clearInterval(spin);el.textContent=S.layer;el.classList.add("landed");$$(".ex-reveal-layers span").forEach(s=>s.classList.toggle("on",s.dataset.l===S.layer));
      setTimeout(()=>{if(exam&&!exam.ended&&exam.net===S){S.revealed=true;S.max=Math.max(S.max,1);exSave();if(currentView==="exam")renderExam()}},1100)},1500);
  }
  /* code */
  const ta=$("#exCode");if(!ta)return;
  const st=exChain().steps[S.idx];
  ta.oninput=()=>{exam.py.code=ta.value;exSave()};
  ta.onkeydown=e=>{
    if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"    "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+4;ta.oninput()}
    if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();e.shiftKey?exRunCode():exCheck()}
  };
  const busy=b=>{["#exRun","#exCheck"].forEach(s=>{const x=$(s);if(x)x.disabled=b})};
  const exRunCode=()=>runInteractive($("#exOut"),ta.value,{setup:st.tests[0].setup||"",textarea:ta,busy});
  async function exCheck(){
    const out=$("#exOut");stopTerminal(out);busy(true);out.innerHTML=`<div class="test">Klargør Python og kører tests …</div>`;
    let res;
    try{res=await pyExec(ta.value,st.tests)}catch(e){out.innerHTML=`<div class="test fail"><b>Fejl</b><p>${esc(String(e.message||e))}</p></div>`;busy(false);return}
    busy(false);
    if(res.type!=="result"){out.innerHTML=runFailHTML(res,"testkørslen");return}
    const rs=res.data,ok=rs.filter(x=>x.ok).length,all=ok===rs.length;
    const firstErr=rs.find(x=>x.err);
    const html=`<div class="results-sum ${all?"ok":"fail"}">${all?icon("checkCircle")+" Opgaven er løst"+(r.hint?" (med hint)":""):`${icon("xCircle")} ${ok} af ${rs.length} tests bestået`}</div>`+
      rs.map(x=>x.ok?`<div class="test ok"><b>${icon("check")} ${esc(x.name)}</b></div>`
        :`<div class="test fail"><b>${icon("x")} ${esc(x.name)}</b><p>${esc(x.expect||"")}</p>${x.err?(x===firstErr?pyErrorHTML(x.err):`<p class="test-note">Samme fejl som ovenfor (${esc(x.err.type)}).</p>`):consoleHTML(x.output,{label:"Dit output"})}</div>`).join("");
    if(all&&r.st!=="passed"){r.st="passed";exSave();renderExam();$("#exOut").innerHTML=html;$("#exNext")?.focus({preventScroll:true})}
    else{out.innerHTML=html;bindGotoLines(out,ta)}
  }
  $("#exRun").onclick=exRunCode;
  $("#exCheck").onclick=exCheck;
  $("#exHintBtn")&&($("#exHintBtn").onclick=()=>{r.hint=true;exSave();const o=$("#exOut").innerHTML;renderExam();$("#exOut").innerHTML=o});
}

function exResultHTML(){
  const ring=(pct,label)=>`<div class="ex-ring" style="--p:${pct}"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="exRing${label}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1fcfc1"/><stop offset="1" stop-color="#3a5fe0"/></linearGradient></defs><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" pathLength="100" stroke="url(#exRing${label})"/></svg><div><b>${pct}%</b><small>${label}</small></div></div>`;
  const verdict=p=>p>=85?["Stærkt","Det sidder. Hold det ved lige med dagens repetition."]:p>=60?["Godt på vej","Du har det meste. Øv de punkter, du manglede."]:p>=35?["Øv mere","Læs guiderne til de svage emner, og prøv igen."]:["Start med guiderne","Gå guiderne igennem først, og tag så en ny prøveeksamen."];
  const parts=exam.order.map(p=>{
    if(p==="py"){
      const ch=exChain(),pct=exPyScore(),[v,vt]=verdict(pct);
      const rows=ch.steps.map((st,k)=>{const r=exam.py.res[k];
        const tag=st.t==="explain"?(r.open?`<span class="ex-tag ${r.pts.length===st.points.length?"ok":r.pts.length?"mid":"bad"}">${r.pts.length}/${st.points.length} punkter</span>`:`<span class="ex-tag none">Ikke besvaret</span>`)
          :r.st==="passed"?`<span class="ex-tag ${r.hint?"mid":"ok"}">${r.hint?"Løst med hint":"Løst"}</span>`:r.st==="skipped"?`<span class="ex-tag bad">Sprunget over</span>`:`<span class="ex-tag none">Ikke nået</span>`;
        const missed=st.t==="explain"&&r.open?st.points.filter((x,j)=>!r.pts.includes(j)):[];
        return `<div class="ex-res-row"><span class="ex-res-n">${k+1}</span><div class="ex-res-txt"><p>${esc(exPlain(st.prompt||st.q))}</p>
          ${missed.length?`<ul class="ex-missed">${missed.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>`:""}
          ${st.t==="code"?`<details class="ex-sol"><summary>${icon("fileCode")}Se model-løsning</summary><pre><code>${esc(st.solution)}</code></pre></details>`:""}</div>${tag}</div>`}).join("");
      return `<section class="ex-res-part"><div class="ex-res-head">${ring(pct,"Python")}<div><div class="eyebrow">Python · ${esc(ch.title)}</div><h2>${v}</h2><p>${vt}</p>
        <div class="ex-res-actions"><button class="btn primary" data-livecat="${esc(ch.live)}">${icon("code")}Python Lab: ${esc(ch.live)}</button><button class="btn" data-guide="${ch.guide}">${icon("book")}Læs guiden</button></div></div></div>
        <div class="ex-res-list">${rows}</div></section>`;
    }
    const L=exLayer(),pct=exNetScore(),[v,vt]=verdict(pct),items=exNetItems();
    const grp=GUIDES.find(g=>g.id===L.guide)?.group,topic=typeof NQ_GUIDE_TOPIC!=="undefined"?NQ_GUIDE_TOPIC[grp]:null;
    const rows=items.map((it,k)=>{const r=exam.net.res[k],missed=it.points.filter((x,j)=>!r.pts.includes(j));
      const tag=r.open?`<span class="ex-tag ${missed.length===0?"ok":r.pts.length?"mid":"bad"}">${r.pts.length}/${it.points.length} punkter</span>`:`<span class="ex-tag none">Ikke besvaret</span>`;
      return `<div class="ex-res-row"><span class="ex-res-n">${k+1}</span><div class="ex-res-txt"><p>${esc(it.q)}</p>
        ${missed.length&&r.open?`<ul class="ex-missed">${missed.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>`:""}
        <button class="ex-link" data-guide="${it.guide}">${icon("book")}Læs om det</button></div>${tag}</div>`}).join("");
    return `<section class="ex-res-part"><div class="ex-res-head">${ring(pct,"Netværk")}<div><div class="eyebrow">Netværk · ${esc(L.layer)}</div><h2>${v}</h2><p>${vt}</p>
      <div class="ex-res-actions">${topic?`<button class="btn primary" data-nqtopic="${topic}">${icon("target")}Netværk Lab: ${esc(nqTopic(topic).name)}</button>`:""}<button class="btn" data-guide="${L.guide}">${icon("book")}Læs guiden</button></div></div></div>
      <div class="ex-res-list">${rows}</div></section>`;
  }).join("");
  const over=exam.limit&&exElapsed()>exam.limit;
  const scores=exam.order.map(p=>p==="py"?exPyScore():exNetScore()),avg=scores.reduce((a,b)=>a+b,0)/scores.length;
  return `<div class="ex-res-top"><div><div class="eyebrow">Prøveeksamen · resultat</div><h1 style="font-size:clamp(26px,3.4vw,40px)">${avg>=85?"Flot klaret":avg>=60?"Godt arbejde":"Dit resultat"}</h1>
    <p>${icon("clock")} Du brugte <b>${mmss(exElapsed())}</b>${exam.limit?` af ${mmss(exam.limit)}${over?" (over tiden)":""}`:""}. Herunder kan du se, hvad du klarede, og hvad du manglede.</p></div>
    <div class="ex-res-cta"><button class="btn run" id="exAgain">${icon("rotate")}Ny prøveeksamen</button><button class="btn" id="exHome">${icon("home")}Til forsiden</button></div></div>
  ${parts}`;
}
function exBindResult(){
  $("#exAgain").onclick=()=>{exam=null;exSave();renderExam();window.scrollTo({top:0,behavior:"smooth"})};
  $("#exHome").onclick=()=>{exam=null;exSave();setView("home")};
  $$("#examBody [data-guide]").forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));
  $$("#examBody [data-livecat]").forEach(b=>b.onclick=()=>{liveSet="ovelser";liveCategory=b.dataset.livecat;liveIndex=0;setView("live");closeSandbox()});
  $$("#examBody [data-nqtopic]").forEach(b=>b.onclick=()=>{setView("netlab");nqStart(b.dataset.nqtopic)});
}

/* ---------- wiring: the view, the start page and the clock ---------- */
const _examSetView=setView;
setView=function(view){_examSetView(view);if(view==="exam")renderExam();exPill()};
const _examHome=renderHome;
renderHome=function(){_examHome();renderHomeToday()};
if(exam&&!exam.ended)exTickStart();
