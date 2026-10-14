/* ===== Search everything (Ctrl+K / ⌘K / "/", or the search field) =====
   One index over guides and their sections, flashcards, Python tasks, Netværk Lab topics, podcast
   transcripts, videos and the pages themselves. Every word must match; title hits rank highest. */
const SX_MAC=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
const sxNorm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const sxStrip=h=>String(h).replace(/<(script|style)[\s\S]*?<\/\1>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
const SX_TYPES=[["page","Sider","grid"],["guide","Guides","book"],["card","Flashcards","cards"],["task","Python-opgaver","code"],["nq","Netværk Lab","target"],["pod","Podcasts","headphones"],["video","Videoer","playCircle"]];
let sxIndex=null,sxScope="all",sxSel=0,sxList=[],sxTimer=0;

function sxBuild(){
  const I=[];
  const add=(type,key,title,sub,text,go,keys="")=>I.push({type,key,title,sub,text,go,tN:sxNorm(title),kN:sxNorm(keys+" "+sub),bN:sxNorm(text)});
  /* pages and quick actions */
  [["Start","Forside og dagens plan","home",()=>setView("home")],
   ["Dagens session","Flashcards til repetition i dag","rotate",()=>startTodaySession()],
   ["Flashcards","Ét kort ad gangen","cards",()=>{statusFilter="all";setView("study")}],
   ["Alle kort","Oversigt over alle flashcards","grid",()=>setView("browse")],
   ["Lær","Visuelle guides","book",()=>setView("learn")],
   ["Python Lab","Opgaver med automatiske tests","code",()=>{setView("live");closeSandbox()}],
   ["Fri sandbox","Skriv og kør din egen Python-kode","flask",()=>{setView("live");openSandbox()}],
   ["Netværk Lab","Multiple choice pr. lag","target",()=>setView("netlab")],
   ["Prøveeksamen","Python + Netværk som til eksamen","graduation",()=>{if(exam?.ended){exam=null;exSave()}setView("exam")}],
   ["Podcasts","4 afsnit med video og transskription","headphones",()=>setView("podcasts")],
   ["Videoer","Udvalgte videoer pr. emne","playCircle",()=>setView("videos")],
   ["Header-galleri","Alle headers på én side","layers",()=>openGuide("net-headers")],
   ["Lyst tema","Brug altid lyst tema","sun",()=>applyTheme("light")],
   ["Mørkt tema","Brug altid mørkt tema","moon",()=>applyTheme("dark")],
   ["Auto-tema","Følg enhedens lyse/mørke indstilling","contrast",()=>applyTheme("auto")]
  ].forEach(([t,s,ic,go])=>{add("page","page:"+t,t,s,"",go);I[I.length-1].ic=ic});
  /* guides and their sections */
  GUIDES.forEach(g=>{
    add("guide","g:"+g.id,g.title,`${g.subject} · ${g.group} · ${g.mins} min`,sxStrip(g.lead)+" "+sxStrip(g.html).slice(0,4000),()=>openGuide(g.id),g.tools||"");
    String(g.html).split(/<h2[^>]*>/i).slice(1).forEach(part=>{
      const head=sxStrip(part.split(/<\/h2>/i)[0]),body=sxStrip(part.split(/<\/h2>/i)[1]||"");
      if(head)add("guide","gs:"+g.id+":"+head,head,`${g.title} · afsnit`,body.slice(0,2500),()=>sxGuideSection(g.id,head));
    });
  });
  ALL_CARDS.forEach(c=>add("card","c:"+c.id,sxStrip(c.question),`${c.subject} · ${c.category} · ${c.topic}`,sxStrip(c.answer+" "+c.technical),()=>sxOpenCard(c),(c.tags||[]).join(" ")));
  LIVE_SETS.forEach(set=>set.items.forEach(t=>add("task","t:"+t.id,t.title,`${set.name} · ${t.category} · niveau ${t.difficulty}`,sxStrip(t.prompt+" "+(t.requirements||"")),()=>sxOpenTask(set.id,t))));
  NQ_TOPICS.forEach(t=>add("nq","nq:"+t.id,`Netværk Lab: ${t.name}`,t.desc,t.desc,()=>{setView("netlab");nqStart(t.id)}));
  PODCASTS.forEach((p,pi)=>{
    add("pod","p:"+p.id,p.title,`Afsnit ${pi+1} · ${p.mins} min · ${sxStrip(p.layers)}`,sxStrip(p.desc)+" "+(p.take||[]).map(sxStrip).join(" "),()=>sxOpenPod(p.id));
    p.lines.forEach(([t,line])=>add("pod","pl:"+p.id+":"+t,line.length>120?line.slice(0,118)+"…":line,`${p.title} · ${fmt(t)}`,line,()=>sxOpenPod(p.id,t)));
  });
  VIDEOS.forEach(v=>add("video","v:"+v.id,v.title,`${v.author} · ${v.subject} · ${v.group} · ${v.len}`,sxStrip(v.note||""),()=>sxOpenVideo(v)));
  return I;
}

/* ---------- actions ---------- */
function sxOpenCard(c){
  if(subject!==c.subject){subject=c.subject;syncSubject()}
  category="Alle";difficulty="all";typeFilter="all";statusFilter="all";sortMode="default";search="";
  studyIndex=Math.max(0,filteredCards().findIndex(x=>x.id===c.id));setView("study");
}
function sxOpenTask(setId,t){
  if(currentView==="live")saveCurrentCode();
  liveSet=setId;try{localStorage.setItem("its_live_set",setId)}catch{}
  liveCategory="all";liveDifficulty="all";liveIndex=Math.max(0,liveAll().indexOf(t));
  setView("live");closeSandbox();
}
function sxGuideSection(id,head){
  openGuide(id);
  setTimeout(()=>{const h=[...$$("#guideBody .guide h2")].find(x=>x.textContent.trim()===head);
    if(h){window.scrollTo({top:h.getBoundingClientRect().top+scrollY-stickTop()-14,behavior:"smooth"});sxFlash(h)}},120);
}
function sxOpenPod(id,t){
  setView("podcasts");
  setTimeout(()=>{
    const pod=document.getElementById("pod-"+id);if(!pod)return;
    window.scrollTo({top:pod.getBoundingClientRect().top+scrollY-stickTop()-12,behavior:"smooth"});
    if(t===undefined)return;
    const tr=pod.querySelector(".transcript");
    if(!tr.classList.contains("open"))pod.querySelector("[data-tr]").click();
    const line=tr.querySelector(`.tl[data-t="${t}"]`);if(!line)return;
    line.querySelector("[data-seek]").click();
    tr.scrollTop=line.offsetTop-tr.offsetTop-90;sxFlash(line);
  },120);
}
function sxOpenVideo(v){
  if(subject!==v.subject){subject=v.subject;syncSubject()}
  videoGroup=v.group;setView("videos");
  setTimeout(()=>{const card=$(`#videoList [data-vid="${v.id}"]`)?.closest(".vid");if(card){card.scrollIntoView({behavior:"smooth",block:"center"});sxFlash(card)}},120);
}
function sxFlash(el){el.classList.remove("sx-flash");void el.offsetWidth;el.classList.add("sx-flash");setTimeout(()=>el.classList.remove("sx-flash"),2200)}

/* ---------- searching ---------- */
function sxScore(it,words,q){
  let s=0;
  for(const w of words){
    const ti=it.tN.indexOf(w);
    if(ti>=0){s+=10+(ti===0||/[\s(\-_./:]/.test(it.tN[ti-1])?6:0);continue}
    if(it.kN.includes(w)){s+=5;continue}
    if(it.bN.includes(w)){s+=2;continue}
    return 0;
  }
  if(it.tN.includes(q))s+=12;
  if(it.tN.startsWith(q))s+=10;
  if(it.type==="page")s+=4;
  if(it.key.startsWith("g:"))s+=3;                  // a whole guide before one of its sections
  if(it.key.startsWith("pl:"))s-=3;                 // single transcript lines rank below whole episodes/guides
  if(it.type==="card"&&it.sub.startsWith(subject))s+=1;
  return s;
}
function sxQuery(q){
  const n=sxNorm(q).trim(),words=n.split(/\s+/).filter(Boolean);
  if(!words.length)return [];
  const hits=[];
  for(const it of sxIndex){const s=sxScore(it,words,n);if(s>0)hits.push([s,it])}
  hits.sort((a,b)=>b[0]-a[0]||a[1].title.length-b[1].title.length);
  return hits;
}
/* mark the query words in a display string (positions line up because the text is NFC) */
function sxMark(text,words){
  const t=String(text),n=sxNorm(t),marks=[];
  words.forEach(w=>{let i=0;while(w&&(i=n.indexOf(w,i))>=0){marks.push([i,i+w.length]);i+=w.length}});
  if(!marks.length)return esc(t);
  marks.sort((a,b)=>a[0]-b[0]);
  let out="",at=0;
  for(const [a,b] of marks){if(a<at)continue;out+=esc(t.slice(at,a))+"<mark>"+esc(t.slice(a,b))+"</mark>";at=b}
  return out+esc(t.slice(at));
}
function sxSnippet(it,words){
  if(words.some(w=>it.tN.includes(w))||!it.text)return "";
  const n=sxNorm(it.text);let i=-1;
  for(const w of words){i=n.indexOf(w);if(i>=0)break}
  if(i<0)return "";
  const a=Math.max(0,i-50),b=Math.min(it.text.length,i+90);
  return (a?"… ":"")+sxMark(it.text.slice(a,b),words)+(b<it.text.length?" …":"");
}

/* ---------- the dialog ---------- */
const sxEl=document.createElement("div");
sxEl.className="sx";sxEl.hidden=true;sxEl.setAttribute("role","dialog");sxEl.setAttribute("aria-modal","true");sxEl.setAttribute("aria-label","Søg");
sxEl.innerHTML=`<div class="sx-backdrop"></div><div class="sx-panel">
  <div class="sx-head">${icon("search")}<input class="sx-input" type="search" placeholder="Søg i guides, flashcards, opgaver, podcasts …" aria-label="Søg" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button class="sx-close" aria-label="Luk">Esc</button></div>
  <div class="sx-scopes" role="tablist"></div>
  <div class="sx-results" role="listbox" aria-label="Resultater"></div>
  <div class="sx-foot"><span><kbd>↑</kbd><kbd>↓</kbd> vælg</span><span><kbd>Enter</kbd> åbn</span><span><kbd>Esc</kbd> luk</span><span class="sx-foot-r"><kbd>${SX_MAC?"⌘":"Ctrl"}</kbd><kbd>K</kbd> søg hvor som helst</span></div></div>`;
document.body.appendChild(sxEl);
const sxInput=sxEl.querySelector(".sx-input"),sxRes=sxEl.querySelector(".sx-results"),sxScopes=sxEl.querySelector(".sx-scopes");
const sxRecent=()=>{try{return JSON.parse(localStorage.getItem("its_search_recent")||"[]")||[]}catch{return []}};

function sxRender(){
  const q=sxInput.value,words=sxNorm(q).trim().split(/\s+/).filter(Boolean);
  let groups=[];
  if(!words.length){
    const rec=sxRecent().map(k=>sxIndex.find(it=>it.key===k)).filter(Boolean).slice(0,5);
    if(rec.length)groups.push(["Senest åbnet","clock",rec]);
    groups.push(["Genveje","sparkles",sxIndex.filter(it=>it.type==="page")]);
    sxScopes.hidden=true;
  }else{
    const hits=sxQuery(q),counts={};hits.forEach(([,it])=>counts[it.type]=(counts[it.type]||0)+1);
    sxScopes.hidden=false;
    sxScopes.innerHTML=`<button role="tab" data-scope="all" aria-selected="${sxScope==="all"}">Alt <b>${hits.length}</b></button>`+
      SX_TYPES.filter(([t])=>counts[t]).map(([t,l,ic])=>`<button role="tab" data-scope="${t}" aria-selected="${sxScope===t}">${icon(ic)}${l} <b>${counts[t]}</b></button>`).join("");
    sxScopes.querySelectorAll("[data-scope]").forEach(b=>b.onclick=()=>{sxScope=b.dataset.scope;sxSel=0;sxRender();sxInput.focus()});
    const shown=sxScope==="all"?hits:hits.filter(([,it])=>it.type===sxScope);
    const order=[];const by={};
    shown.forEach(([,it])=>{if(!by[it.type]){by[it.type]=[];order.push(it.type)}by[it.type].push(it)});
    groups=order.map(t=>{const T=SX_TYPES.find(x=>x[0]===t);return [T[1],T[2],by[t].slice(0,sxScope==="all"?(t==="pod"?4:5):40)]});
  }
  sxList=[];
  sxRes.innerHTML=groups.length?groups.map(([label,ic,items])=>`<div class="sx-group"><div class="sx-gh">${icon(ic)}${label}</div>${items.map(it=>{
      const i=sxList.push(it)-1,T=SX_TYPES.find(x=>x[0]===it.type),snip=words.length?sxSnippet(it,words):"";
      return `<button class="sx-item" role="option" data-i="${i}" id="sx-o${i}"><span class="sx-ic">${icon(it.ic||T[2])}</span><span class="sx-txt"><b>${words.length?sxMark(it.title,words):esc(it.title)}</b><small>${esc(it.sub)}</small>${snip?`<span class="sx-snip">${snip}</span>`:""}</span><span class="sx-go">${icon("arrowRight")}</span></button>`}).join("")}</div>`).join("")
    :`<div class="sx-empty">${icon("search")}<b>Ingen resultater for “${esc(q.trim())}”</b><span>Prøv et andet ord, fx “subnet”, “slicing” eller “handshake”.</span></div>`;
  sxSel=Math.min(sxSel,Math.max(0,sxList.length-1));sxHighlight(false);
  sxRes.querySelectorAll(".sx-item").forEach(b=>{b.onclick=()=>sxChoose(+b.dataset.i);b.onmousemove=()=>{if(sxSel!==+b.dataset.i){sxSel=+b.dataset.i;sxHighlight(false)}}});
}
function sxHighlight(scroll=true){
  sxRes.querySelectorAll(".sx-item.on").forEach(x=>x.classList.remove("on"));
  const el=sxRes.querySelector(`[data-i="${sxSel}"]`);
  if(el){el.classList.add("on");sxInput.setAttribute("aria-activedescendant",el.id);if(scroll)el.scrollIntoView({block:"nearest"})}
}
function sxChoose(i){
  const it=sxList[i];if(!it)return;
  const rec=[it.key,...sxRecent().filter(k=>k!==it.key)].slice(0,8);
  try{localStorage.setItem("its_search_recent",JSON.stringify(rec))}catch{}
  sxClose();it.go();
}
function sxOpen(){
  if(!sxIndex)sxIndex=sxBuild();
  sxEl.hidden=false;document.documentElement.classList.add("sx-lock");
  sxScope="all";sxSel=0;sxInput.select();sxRender();
  requestAnimationFrame(()=>sxInput.focus());
}
function sxClose(){sxEl.hidden=true;document.documentElement.classList.remove("sx-lock")}
sxInput.addEventListener("input",()=>{clearTimeout(sxTimer);sxTimer=setTimeout(()=>{sxSel=0;sxScope="all";sxRender()},50)});
sxInput.addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"){e.preventDefault();sxSel=Math.min(sxList.length-1,sxSel+1);sxHighlight()}
  else if(e.key==="ArrowUp"){e.preventDefault();sxSel=Math.max(0,sxSel-1);sxHighlight()}
  else if(e.key==="Enter"){e.preventDefault();sxChoose(sxSel)}
  else if(e.key==="Escape"){e.preventDefault();e.stopPropagation();if(sxInput.value){sxInput.value="";sxRender()}else sxClose()}
});
sxEl.querySelector(".sx-backdrop").onclick=sxClose;
sxEl.querySelector(".sx-close").onclick=sxClose;
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&(e.key==="k"||e.key==="K")){e.preventDefault();sxEl.hidden?sxOpen():sxClose();return}
  if(e.key==="Escape"&&!sxEl.hidden){e.preventDefault();sxClose();return}
  const typing=["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
  if(e.key==="/"&&!typing&&sxEl.hidden&&!e.ctrlKey&&!e.metaKey){e.preventDefault();sxOpen()}
});

/* visible ways in: a search field in the subject bar, and a search button in the top bar on phones */
$(".subject-focus-inner")?.insertAdjacentHTML("beforeend",`<button class="sx-field" type="button" aria-label="Søg på siden (${SX_MAC?"⌘":"Ctrl"}+K)">${icon("search")}<span>Søg i alt …</span><kbd>${SX_MAC?"⌘":"Ctrl"} K</kbd></button>`);
$(".account-wrap")?.insertAdjacentHTML("beforebegin",`<button class="sx-top" type="button" aria-label="Søg">${icon("search")}</button>`);
$$(".sx-field,.sx-top").forEach(b=>b.onclick=sxOpen);
