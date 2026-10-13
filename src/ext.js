/* ===== v8 Study Lab: Lær, Podcasts, Videoer, Sandbox ===== */
const EXT_VIEWS=["learn","podcasts","videos"];
const MEDIA_BASE=location.protocol==="file:"?"https://amirj-1999.github.io/IntroEksamen/":"";
let learnId=JSON.parse(localStorage.getItem("its_learn_last")||"{}");
let checks=JSON.parse(localStorage.getItem("its_checklists")||"{}");
let videoGroup="Alle";
let uid=0;
const nextId=p=>(p||"x")+(++uid);

/* ---------- view wiring (wraps the original functions) ---------- */
const _origSetView=setView, _origSync=syncSubject, _origChange=changeSubject, _origHome=renderHome;
setView=function(view){
  $("#topnav")?.classList.remove("menu-open");
  if(view!=="learn"&&location.hash)history.replaceState(null,"",location.pathname+location.search);
  if(EXT_VIEWS.includes(view)){
    if(view==="podcasts"&&subject!=="Netværk"){subject="Netværk";syncSubject();}
    currentView=view;
    ["home","study","browse","live",...EXT_VIEWS].forEach(v=>{
      $("#"+v+"View").classList.toggle("hidden",v!==view);
      $$(`.navbtn[data-view="${v}"]`).forEach(b=>b.classList.toggle("active",v===view));
    });
    if(view==="learn")renderLearn();
    if(view==="podcasts")renderPodcasts();
    if(view==="videos")renderVideos();
    window.scrollTo({top:0,behavior:"smooth"});
    return;
  }
  EXT_VIEWS.forEach(v=>{$("#"+v+"View").classList.add("hidden");$$(`.navbtn[data-view="${v}"]`).forEach(b=>b.classList.remove("active"))});
  _origSetView(view);
};
syncSubject=function(){
  _origSync();
  $$('.navbtn[data-view="podcasts"]').forEach(b=>b.style.display=subject==="Netværk"?"":"none");
};
changeSubject=function(s){
  if(currentView==="podcasts"&&s!=="Netværk")currentView="home";
  _origChange(s);
};
renderHome=function(){
  _origHome();
  const g=GUIDES.filter(x=>x.subject===subject).length, v=VIDEOS.filter(x=>x.subject===subject).length;
  const cards=subject==="Python"?[
    ["◧","Lær","Visuelle guides til hele Python-pensum: datatyper, slicing, loops, funktioner, filer, exceptions, sockets og Linux — med interaktive værktøjer.",`<button class="btn primary" data-go2="learn">Åbn guides (${g})</button>`],
    ["◫","Flashcards","Ét kort ad gangen med let og teknisk forklaring. Marker Kan / Usikker / Øv igen.",`<button class="btn" data-go2="study">Start flashcards</button>`],
    ["⌘","Python Lab","70 live-coding-opgaver med automatiske tests — plus en fri sandbox, hvor du kan køre din egen kode.",`<button class="btn" data-go2="live">Live Coding</button><button class="btn" data-go2="sandbox">Sandbox</button>`],
    ["▶","Videoer",`${v} udvalgte videoer (Corey Schafer, NetworkChuck m.fl.) sorteret efter emne.`,`<button class="btn" data-go2="videos">Se videoer</button>`]
  ]:[
    ["◧","Lær","Visuelle guides for hvert lag: interaktive headers, sekvensdiagrammer, subnet- og fragmenteringsberegner og et header-galleri til eksamen.",`<button class="btn primary" data-go2="learn">Åbn guides (${g})</button>`],
    ["◫","Flashcards","Ét kort ad gangen med let og teknisk forklaring. Marker Kan / Usikker / Øv igen.",`<button class="btn" data-go2="study">Start flashcards</button>`],
    ["♫","Podcasts","4 lydafsnit (ca. 90 min) om lagene — med klikbar transskription, så du kan læse med.",`<button class="btn" data-go2="podcasts">Lyt</button>`],
    ["▶","Videoer",`${v} udvalgte videoer, bl.a. Jim Kurose (forfatteren til jeres lærebog) og Daniels Wireshark-serie.`,`<button class="btn" data-go2="videos">Se videoer</button>`]
  ];
  /* #quickLive is kept (hidden) because the original syncSubject() toggles it */
  $(".quickstart").innerHTML=cards.map(c=>`<div class="start-card"><div class="icon">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p>${c[3]}</div>`).join("")+`<span id="quickLive" hidden></span>`;
  $$("[data-go2]").forEach(b=>b.onclick=()=>{const t=b.dataset.go2;if(t==="sandbox"){setView("live");openSandbox();}else setView(t)});
};

/* ---------- mobile dropdown menu ---------- */
$("#mobileMenu").onclick=()=>$("#topnav").classList.toggle("menu-open");

/* ---------- Learn ---------- */
function guidesFor(s){return GUIDES.filter(g=>g.subject===s)}
function renderLearn(){
  const list=guidesFor(subject);
  let id=learnId[subject];
  const hash=new URLSearchParams(location.hash.slice(1)).get("guide");
  if(hash&&list.some(g=>g.id===hash))id=hash;
  if(!list.some(g=>g.id===id))id=list[0].id;
  const groups=[...new Set(list.map(g=>g.group))];
  $("#guideNav").innerHTML=`<h3>${esc(subject)} · guides</h3><p style="color:var(--muted);font-size:11px;margin:0">${list.length} guides · visuelt og interaktivt</p>`+
    groups.map(gr=>`<div class="gn-group">${esc(gr)}</div>`+list.filter(g=>g.group===gr).map(g=>`<button class="gn-btn ${g.id===id?"active":""}" data-g="${g.id}">${esc(g.title)}<small>${g.mins} min${g.tools?" · "+esc(g.tools):""}</small></button>`).join("")).join("");
  $("#guideSelect").innerHTML=groups.map(gr=>`<optgroup label="${esc(gr)}">`+list.filter(g=>g.group===gr).map(g=>`<option value="${g.id}" ${g.id===id?"selected":""}>${esc(g.title)}</option>`).join("")+`</optgroup>`).join("");
  $$("#guideNav [data-g]").forEach(b=>b.onclick=()=>openGuide(b.dataset.g));
  $("#guideSelect").onchange=e=>openGuide(e.target.value);
  showGuide(id);
}
function openGuide(id){
  const g=GUIDES.find(x=>x.id===id);if(!g)return;
  if(g.subject!==subject){subject=g.subject;syncSubject();}
  learnId[subject]=id;localStorage.setItem("its_learn_last",JSON.stringify(learnId));
  if(currentView!=="learn"){history.replaceState(null,"","#guide="+id);setView("learn");return;}
  history.replaceState(null,"","#guide="+id);
  $$("#guideNav [data-g]").forEach(b=>b.classList.toggle("active",b.dataset.g===id));
  $("#guideSelect").value=id;
  showGuide(id);
  const top=$("#guideBody").getBoundingClientRect().top+window.scrollY-150;
  window.scrollTo({top:Math.max(0,top),behavior:"smooth"});
}
function showGuide(id){
  const g=GUIDES.find(x=>x.id===id);
  learnId[subject]=id;localStorage.setItem("its_learn_last",JSON.stringify(learnId));
  const list=guidesFor(g.subject),i=list.indexOf(g);
  const vids=(g.videos||[]).map(v=>VIDEOS.find(x=>x.id===v)).filter(Boolean);
  const pod=g.podcast?PODCASTS.find(p=>p.id===g.podcast):null;
  const cats=g.cards||[];
  $("#guideBody").innerHTML=`<article class="guide">
    <div class="g-meta"><span class="badge">${esc(g.group)}</span><span class="badge">${g.mins} min læsning</span>${g.tools?`<span class="badge d2">${esc(g.tools)}</span>`:""}</div>
    <div class="g-kicker">${esc(g.subject)} · Lær</div>
    <h1>${esc(g.title)}</h1>
    <p class="g-lead">${g.lead}</p>
    ${g.html}
    ${vids.length?`<h2>Se også</h2><div class="g-videos"><div class="vid-grid">${vids.map(videoCard).join("")}</div></div>`:""}
    ${pod?`<div class="g-box analogy" style="margin-top:18px"><b class="t">Lyt</b><p>Podcast-afsnittet <b>${esc(pod.title)}</b> (${pod.mins} min) gennemgår samme stof som samtale. <button class="btn" data-pod="${pod.id}" style="margin-left:6px">Gå til podcast</button></p></div>`:""}
    <div class="g-actions">
      ${cats.map(c=>`<button class="btn primary" data-cards="${esc(c)}">Øv flashcards: ${esc(c)}</button>`).join("")}
      ${g.live?`<button class="btn" data-livecat="${esc(g.live)}">Live Coding: ${esc(g.live)}</button>`:""}
      <span style="flex:1"></span>
      ${i>0?`<button class="btn" data-g2="${list[i-1].id}">← ${esc(list[i-1].title)}</button>`:""}
      ${i<list.length-1?`<button class="btn" data-g2="${list[i+1].id}">${esc(list[i+1].title)} →</button>`:""}
    </div></article>`;
  hydrate($("#guideBody"));
  $$("#guideBody [data-g2]").forEach(b=>b.onclick=()=>openGuide(b.dataset.g2));
  $$("#guideBody [data-cards]").forEach(b=>b.onclick=()=>{category=b.dataset.cards;difficulty="all";typeFilter="all";statusFilter="all";sortMode="default";search="";studyIndex=0;setView("study")});
  $$("#guideBody [data-livecat]").forEach(b=>b.onclick=()=>{liveCategory=b.dataset.livecat;liveIndex=0;setView("live");closeSandbox()});
  $$("#guideBody [data-pod]").forEach(b=>b.onclick=()=>{setView("podcasts");setTimeout(()=>document.getElementById("pod-"+b.dataset.pod)?.scrollIntoView({behavior:"smooth",block:"start"}),60)});
}
function hydrate(root){
  root.querySelectorAll("[data-header]").forEach(el=>renderHeader(el,el.dataset.header));
  root.querySelectorAll("[data-frame]").forEach(el=>renderFrame(el,el.dataset.frame));
  root.querySelectorAll("[data-seq]").forEach(el=>renderSeq(el,el.dataset.seq));
  root.querySelectorAll("[data-viz]").forEach(el=>{const f=VIZ[el.dataset.viz];if(f)f(el)});
  root.querySelectorAll("[data-chk]").forEach(el=>renderChecklist(el,el.dataset.chk));
  root.querySelectorAll("pre[data-run]").forEach(pre=>{
    const b=document.createElement("button");b.className="btn";b.textContent="▶ Prøv i sandbox";b.style.margin="-8px 0 14px";
    b.onclick=()=>{setView("live");openSandbox(pre.innerText.replace(/\n$/,""),pre.dataset.run||"")};
    pre.after(b);
  });
  bindVideoCards(root);
}

/* ---------- header diagrams ---------- */
function renderHeader(el,key){
  const h=HEADERS[key];if(!h){el.textContent="(mangler header: "+key+")";return}
  const id=nextId("hd");
  const cells=[];let pos=0;
  h.fields.forEach((f,fi)=>{
    let rem=f.b,first=true;
    while(rem>0){const take=Math.min(rem,32-pos);cells.push({f,fi,span:take,cont:!first});pos=(pos+take)%32;rem-=take;first=false}
  });
  const size=f=>f.size||(f.b%8===0&&f.b>=8?`${f.b} bit = ${f.b/8} B`:`${f.b} bit`);
  const ruler=Array.from({length:32},(_,i)=>`<div class="hdr-ruler">${i%4===0||i===31?i:""}</div>`).join("");
  el.classList.add("hdr");
  el.innerHTML=`<div class="hdr-title"><b>${esc(h.title)}</b><span>${esc(h.sub||"32 bit pr. række · klik på et felt")}</span></div>
    <div class="hdr-scroll"><div class="hdr-grid">${ruler}${cells.map(c=>`<div class="hdr-cell c-${c.f.c||"x"}" style="grid-column:span ${c.span}" data-fi="${c.fi}">${esc(c.f.n)}${c.cont?" (forts.)":""}<small>${c.span<4?"":esc(c.f.var?"variabel":size(c.f))}</small></div>`).join("")}</div></div>
    <div class="hdr-info" id="${id}">${h.note}</div>
    <div class="hdr-legend"><span><i style="background:rgba(115,169,255,.25)"></i>adresser/porte</span><span><i style="background:rgba(240,199,94,.25)"></i>styring/flag</span><span><i style="background:rgba(100,211,145,.25)"></i>længde</span><span><i style="background:rgba(255,116,116,.2)"></i>fejltjek</span></div>`;
  el.querySelectorAll(".hdr-cell").forEach(c=>c.onclick=()=>{
    const f=h.fields[+c.dataset.fi];
    el.querySelectorAll(".hdr-cell").forEach(x=>x.classList.toggle("sel",x.dataset.fi===c.dataset.fi));
    $("#"+id).innerHTML=`<b>${esc(f.n)}</b> · ${esc(f.var?"variabel længde":size(f))}${f.full?" · <i>"+esc(f.full)+"</i>":""}<br>${f.d}`;
  });
}
function renderFrame(el,key){
  const h=FRAMES[key];const id=nextId("fr");el.classList.add("hdr");
  el.innerHTML=`<div class="hdr-title"><b>${esc(h.title)}</b><span>${esc(h.sub)}</span></div>
   <div class="hdr-scroll"><div class="fbar">${h.fields.map((f,i)=>`<div class="hdr-cell c-${f.c||"x"}" style="flex-grow:${f.w}" data-i="${i}">${esc(f.n)}<small>${esc(f.size)}</small></div>`).join("")}</div></div>
   <div class="hdr-info" id="${id}">${h.note}</div>`;
  el.querySelectorAll(".hdr-cell").forEach(c=>c.onclick=()=>{const f=h.fields[+c.dataset.i];
    el.querySelectorAll(".hdr-cell").forEach(x=>x.classList.toggle("sel",x===c));
    $("#"+id).innerHTML=`<b>${esc(f.n)}</b> · ${esc(f.size)}<br>${f.d}`});
}

/* ---------- sequence diagrams ---------- */
function renderSeq(el,key){
  const s=SEQS[key];if(!s){el.textContent="(mangler diagram: "+key+")";return}
  const n=s.actors.length,colW=s.colW||Math.max(170,Math.min(230,620/(n-1||1)));
  const left=s.left||95,W=left*2+colW*(n-1),rowH=s.rowH||44,top=58;
  const X=i=>left+i*colW;
  let y=top+14,body="",lastAdv=0;const mid=nextId("m");
  const marker=(cls,id)=>`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="${cls}"/></marker>`;
  s.msgs.forEach(m=>{
    if(m.gap){y+=m.gap;return}
    if(m.note!==undefined){
      const x=m.at===undefined?W/2:X(m.at);const w=m.w||Math.min(260,m.note.length*6.4+20);
      const bx=m.at===undefined?x-w/2:(m.side==="l"?x-w-8:m.side==="c"?x-w/2:x+8);
      body+=`<rect x="${bx}" y="${y-2}" width="${w}" height="22" rx="6" class="${m.cls||"sv-box-gold"}"/><text x="${bx+w/2}" y="${y+13}" text-anchor="middle" class="sv-text" style="font-size:11px">${esc(m.note)}</text>`;
      y+=m.h||30;return;
    }
    if(m.same)y-=lastAdv;
    const x1=X(m.f),x2=X(m.t),dy=m.flat?0:(m.dy??18);
    if(m.f===m.t){ /* local action */
      const w=Math.max(70,m.l.length*6.6+16);
      body+=`<rect x="${x1-w/2}" y="${y}" width="${w}" height="22" rx="6" class="sv-box-teal"/><text x="${x1}" y="${y+15}" text-anchor="middle" class="sv-text" style="font-size:11px">${esc(m.l)}</text>`;
      y+=m.h||32;return;
    }
    const cls=m.lost?"sv-arrow-red":m.blue?"sv-arrow-blue":"sv-arrow";
    const mk=m.lost?"r":m.blue?"b":"t";
    let x2e=x2,y2e=y+dy;
    if(m.lost){x2e=x1+(x2-x1)*0.62;y2e=y+dy*0.62}
    body+=`<line x1="${x1}" y1="${y}" x2="${x2e}" y2="${y2e}" class="${cls}" ${m.lost?"":`marker-end="url(#${mid}${mk})"`}/>`;
    if(m.lost)body+=`<text x="${x2e}" y="${y2e+5}" text-anchor="middle" style="fill:var(--red);font:bold 16px Inter,sans-serif">✕</text>`;
    const lx=(x1+x2)/2,ly=y+dy/2-7;
    body+=`<text x="${lx}" y="${ly}" text-anchor="middle" class="sv-text sv-bold" style="font-size:11.5px">${esc(m.l)}</text>`;
    if(m.s)body+=`<text x="${lx}" y="${ly+dy/2+20}" text-anchor="middle" class="sv-small">${esc(m.s)}</text>`;
    lastAdv=rowH+(m.s?10:0)+(m.extra||0);y+=lastAdv;
  });
  const H=y+10;
  let head=`<defs>${marker("sv-head",mid+"t")}${marker("sv-head-blue",mid+"b")}${marker("sv-head-red",mid+"r")}</defs>`;
  s.actors.forEach((a,i)=>{
    const w=Math.max(96,a.length*7.4+20);
    head+=`<line x1="${X(i)}" y1="${top-8}" x2="${X(i)}" y2="${H}" class="sv-dash"/>`+
      `<rect x="${X(i)-w/2}" y="12" width="${w}" height="32" rx="9" class="${(s.colors||[])[i]||"sv-box-blue"}"/><text x="${X(i)}" y="33" text-anchor="middle" class="sv-text sv-bold">${esc(a)}</text>`;
    if(s.sub&&s.sub[i])head+=`<text x="${X(i)}" y="${56}" text-anchor="middle" class="sv-small">${esc(s.sub[i])}</text>`;
  });
  el.classList.add("fig");
  el.innerHTML=`<div class="svgwrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(s.title||key)}">${head}${body}</svg></div>${s.caption?`<figcaption>${s.caption}</figcaption>`:""}`;
}

/* ---------- checklists ---------- */
function renderChecklist(el,key){
  const items=CHECKLISTS[key]||[];checks[key]=checks[key]||{};
  const draw=()=>{
    const done=items.filter((_,i)=>checks[key][i]).length;
    el.innerHTML=`<div class="chk-prog">${done} af ${items.length} sidder · gemmes i din browser</div><div class="chk">${items.map((t,i)=>`<label class="${checks[key][i]?"done":""}"><input type="checkbox" data-i="${i}" ${checks[key][i]?"checked":""}><span>${t}</span></label>`).join("")}</div>`;
    el.querySelectorAll("input").forEach(c=>c.onchange=()=>{checks[key][c.dataset.i]=c.checked;localStorage.setItem("its_checklists",JSON.stringify(checks));draw()});
  };
  draw();
}

/* ---------- videos ---------- */
function videoCard(v){
  return `<div class="vid"><div class="vid-frame"><button class="vid-play" data-vid="${v.id}" style="background-image:url('https://i.ytimg.com/vi/${v.id}/hqdefault.jpg')" aria-label="Afspil ${esc(v.title)}"><span>${esc(v.len)}</span></button></div>
   <div class="vid-body"><b>${esc(v.title)}</b><small>${esc(v.author)} · ${esc(v.group)}</small>${v.note?`<p>${v.note}</p>`:""}<a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Åbn på YouTube ↗</a></div></div>`;
}
function bindVideoCards(root){
  root.querySelectorAll("[data-vid]").forEach(b=>b.onclick=()=>{
    const f=document.createElement("iframe");
    f.src=`https://www.youtube-nocookie.com/embed/${b.dataset.vid}?autoplay=1&rel=0`;
    f.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen=true;f.title="YouTube video";b.replaceWith(f);
  });
}
function renderVideos(){
  const list=VIDEOS.filter(v=>v.subject===subject);
  const groups=[...new Set(list.map(v=>v.group))];
  if(videoGroup!=="Alle"&&!groups.includes(videoGroup))videoGroup="Alle";
  $("#videosTitle").textContent=subject==="Python"?"Videoer · Python & Linux":"Videoer · Netværk";
  $("#videosIntro").innerHTML=subject==="Python"
    ?"Korte, velforklarede videoer til hvert emne i Python-pensum. Corey Schafers serie følger næsten samme rækkefølge som jeres slides. Videoerne indlæses først, når du trykker afspil."
    :"Jim Kurose er medforfatter til jeres lærebog <i>Computer Networking: A Top-Down Approach</i> — hans videoer følger bogens kapitler. Daniels serie (kanalen <i>Security in mind</i>) er den, eksamensguiden anbefaler. Videoerne indlæses først, når du trykker afspil.";
  $("#videoChips").innerHTML=["Alle",...groups].map(g=>`<button class="chip ${g===videoGroup?"active":""}" data-vg="${esc(g)}">${esc(g)} <span style="opacity:.6">${g==="Alle"?list.length:list.filter(v=>v.group===g).length}</span></button>`).join("");
  $$("#videoChips [data-vg]").forEach(b=>b.onclick=()=>{videoGroup=b.dataset.vg;renderVideos()});
  const shown=groups.filter(g=>videoGroup==="Alle"||g===videoGroup);
  $("#videoList").innerHTML=shown.map(g=>{const gi=VIDEO_GROUPS[g]||"";return `<h3 class="vid-group">${esc(g)}${gi?`<small>${gi}</small>`:""}</h3><div class="vid-grid">${list.filter(v=>v.group===g).map(videoCard).join("")}</div>`}).join("");
  bindVideoCards($("#videoList"));
}

/* ---------- podcasts ---------- */
const fmt=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
function renderPodcasts(){
  if($("#podList").dataset.done)return;
  $("#podList").dataset.done="1";
  $("#podList").innerHTML=PODCASTS.map((p,i)=>`<article class="pod" id="pod-${p.id}">
    <div class="pod-head"><div class="pod-num">${i+1}</div><div><h3>${esc(p.title)}</h3><div class="pod-sub">${p.mins} min · ${esc(p.layers)}</div></div></div>
    <p>${p.desc}</p>
    <audio controls preload="none" src="${MEDIA_BASE}podcasts/${p.file}"></audio>
    <b style="font-size:12px">Hovedpointer</b>
    <ul class="pod-take">${p.take.map(t=>`<li>${t}</li>`).join("")}</ul>
    ${p.caveat?`<div class="g-box warn" style="margin-top:10px"><b class="t">Vær kritisk</b><p>${p.caveat}</p></div>`:""}
    <div class="pod-tools"><button class="btn" data-tr="${p.id}">Vis transskription</button>${(p.guides||[]).map(g=>{const gg=GUIDES.find(x=>x.id===g);return gg?`<button class="btn" data-pg="${g}">Guide: ${esc(gg.title)}</button>`:""}).join("")}</div>
    <div class="transcript" id="tr-${p.id}"><input class="input tr-search" placeholder="Søg i transskriptionen…"><div class="tr-lines">${p.lines.map(l=>`<div class="tl" data-t="${l[0]}"><button data-seek="${l[0]}">${fmt(l[0])}</button><span>${esc(l[1])}</span></div>`).join("")}</div></div>
  </article>`).join("");
  $$("#podList [data-tr]").forEach(b=>b.onclick=()=>{const t=$("#tr-"+b.dataset.tr);t.classList.toggle("open");b.textContent=t.classList.contains("open")?"Skjul transskription":"Vis transskription"});
  $$("#podList [data-pg]").forEach(b=>b.onclick=()=>openGuide(b.dataset.pg));
  $$("#podList .pod").forEach(pod=>{
    const audio=pod.querySelector("audio"),lines=[...pod.querySelectorAll(".tl")];
    pod.querySelectorAll("[data-seek]").forEach(b=>b.onclick=()=>{audio.currentTime=+b.dataset.seek;audio.play()});
    let last=-1;
    audio.addEventListener("timeupdate",()=>{
      const t=audio.currentTime;let idx=-1;
      for(let i=0;i<lines.length;i++){if(+lines[i].dataset.t<=t)idx=i;else break}
      if(idx!==last){lines[last]?.classList.remove("now");lines[idx]?.classList.add("now");last=idx;
        const tr=pod.querySelector(".transcript");if(tr.classList.contains("open")&&lines[idx]){const box=tr.getBoundingClientRect(),r=lines[idx].getBoundingClientRect();if(r.top<box.top||r.bottom>box.bottom)tr.scrollTop+=r.top-box.top-120}}
    });
    pod.querySelector(".tr-search").oninput=e=>{const q=e.target.value.toLowerCase().trim();let first=null;
      lines.forEach(l=>{const hit=q&&l.textContent.toLowerCase().includes(q);l.classList.toggle("hit",!!hit);if(hit&&!first)first=l});
      if(first){const tr=pod.querySelector(".transcript");tr.scrollTop=first.offsetTop-tr.offsetTop-40}};
  });
  /* only one audio at a time */
  $$("#podList audio").forEach(a=>a.addEventListener("play",()=>$$("#podList audio").forEach(o=>{if(o!==a)o.pause()})));
}

/* ---------- sandbox ---------- */
function openSandbox(code,inputs){
  $("#liveMain").classList.add("hidden");$("#sandboxPanel").classList.remove("hidden");
  $("#sandboxBtn").textContent="← Tilbage til opgaver";
  if(code!==undefined){$("#sbCode").value=code;$("#sbInput").value=inputs||"";$("#sbOut").textContent="Tryk ▶ Kør for at se output.";$("#sbOut").classList.remove("err")}
  else if(!$("#sbCode").value)$("#sbCode").value=localStorage.getItem("its_sandbox")||"# Skriv frit Python her og tryk ▶ Kør (Ctrl+Enter)\nname = input('Hvad hedder du? ')\nprint('Hej', name)\n\nfor i in range(3):\n    print(i, i ** 2)";
}
function closeSandbox(){$("#liveMain").classList.remove("hidden");$("#sandboxPanel").classList.add("hidden");$("#sandboxBtn").textContent="🧪 Fri sandbox"}
async function runSandbox(){
  const code=$("#sbCode").value;localStorage.setItem("its_sandbox",code);
  const inputs=$("#sbInput").value.split("\n");while(inputs.length&&inputs[inputs.length-1]==="")inputs.pop();
  const out=$("#sbOut");out.classList.remove("err");out.textContent="Kører…";$("#sbRun").disabled=true;
  try{
    await ensureWorker();
    const prev=pyWorker.onmessage;
    const res=await new Promise(resolve=>{
      const to=setTimeout(()=>{pyWorker.terminate();pyWorker=null;pyReady=false;setEngine("error","Timeout");resolve({timeout:true})},8000);
      pyWorker.onmessage=e=>{if(e.data.type==="result"||e.data.type==="error"){clearTimeout(to);resolve(e.data)}};
      pyWorker.postMessage({code,tests:[{name:"Kørsel",inputs,check:"True"}]});
    });
    if(pyWorker)pyWorker.onmessage=prev;
    if(res.timeout){out.classList.add("err");out.textContent="Stoppet efter 8 sekunder — har du en uendelig løkke, eller mangler der input?";}
    else if(res.type==="error"){out.classList.add("err");out.textContent=res.error}
    else{const r=res.data[0];
      let txt=r.output||"";
      if(r.error){const eof=r.error.includes("EOFError");txt+=(txt?"\n":"")+(eof?"⚠ Programmet kaldte input() flere gange, end der er linjer i input-feltet. Tilføj en linje pr. input().":r.error.trim());out.classList.add("err")}
      out.textContent=txt||"(intet output)";}
  }catch(e){out.classList.add("err");out.textContent=String(e)}
  finally{$("#sbRun").disabled=false}
}
$("#sandboxBtn").onclick=()=>$("#sandboxPanel").classList.contains("hidden")?openSandbox():closeSandbox();
$("#sbRun").onclick=runSandbox;
$("#sbClear").onclick=()=>{$("#sbCode").value="";$("#sbOut").textContent=""};
$("#sbCode").addEventListener("keydown",e=>{
  if(e.key==="Tab"){e.preventDefault();const t=e.target,s=t.selectionStart,en=t.selectionEnd;t.value=t.value.slice(0,s)+"    "+t.value.slice(en);t.selectionStart=t.selectionEnd=s+4}
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();runSandbox()}
});

/* ---------- interactive tools & visuals ---------- */
const ipToInt=s=>{const p=s.trim().split(".");if(p.length!==4)return null;let n=0;for(const x of p){if(!/^\d{1,3}$/.test(x)||+x>255)return null;n=n*256+ +x}return n>>>0};
const intToIp=n=>[24,16,8,0].map(s=>(n>>>s)&255).join(".");
const bin32=n=>n.toString(2).padStart(32,"0");
const VIZ={
  subnet(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>Subnet-beregner</h4><div class="tool-row"><input class="input" value="192.168.1.37/24" aria-label="IP/prefix"><span style="font-size:11px;color:var(--muted)">Prøv: 10.0.0.5/26 · 172.16.4.9/12 · 192.168.10.130/26</span></div><div class="tool-res"></div>`;
    const inp=el.querySelector("input"),res=el.querySelector(".tool-res");
    const calc=()=>{
      const m=inp.value.trim().match(/^([\d.]+)\s*\/\s*(\d{1,2})$/);const ip=m&&ipToInt(m[1]);const p=m?+m[2]:-1;
      if(ip===null||!m||p<0||p>32){res.innerHTML=`<div class="tool-err">Skriv fx 192.168.1.37/24</div>`;return}
      const mask=p===0?0:(0xFFFFFFFF<<(32-p))>>>0,net=(ip&mask)>>>0,bc=(net|(~mask>>>0))>>>0;
      const total=2**(32-p),hosts=p>=31?(p===31?2:1):total-2;
      const priv=(ip>>>24)===10||((ip>>>20)===0xAC1)||((ip>>>16)===0xC0A8);
      const b=bin32(ip),bits=[0,8,16,24].map(i=>b.slice(i,i+8).split("").map((c,j)=>`<span class="${i+j<p?"bn":"bh"}">${c}</span>`).join("")).join(".");
      res.innerHTML=`<div class="tool-out">
        <div><small>Subnetmaske</small><b>${intToIp(mask)}</b></div><div><small>Netværksadresse</small><b>${intToIp(net)}/${p}</b></div>
        <div><small>Broadcast</small><b>${intToIp(bc)}</b></div><div><small>Første / sidste vært</small><b>${p>=31?"–":intToIp(net+1)+" – "+intToIp(bc-1)}</b></div>
        <div><small>Adresser i alt</small><b>2^${32-p} = ${total.toLocaleString("da-DK")}</b></div><div><small>Brugbare værter</small><b>${hosts.toLocaleString("da-DK")}</b></div>
        <div><small>Privat (RFC 1918)?</small><b>${priv?"Ja":"Nej"}</b></div><div><small>Netværks-/værtsbit</small><b>${p} / ${32-p}</b></div></div>
        <div class="bits">${bits} &nbsp; <span class="bn">netværksdel</span> · <span class="bh">værtsdel</span></div>`;
    };
    inp.oninput=calc;calc();
  },
  frag(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>Fragmenterings-beregner (IPv4, 20 B header)</h4><div class="tool-row"><label>Datagram total length (B)</label><input class="input" type="number" value="4000" min="21"><label>Link-MTU (B)</label><input class="input" type="number" value="1500" min="68"></div><div class="tool-res"></div>`;
    const [a,b]=el.querySelectorAll("input"),res=el.querySelector(".tool-res");
    const calc=()=>{
      const tot=+a.value,mtu=+b.value,data=tot-20;
      if(!(tot>20&&mtu>=68)){res.innerHTML=`<div class="tool-err">Ugyldige tal</div>`;return}
      if(tot<=mtu){res.innerHTML=`<p style="font-size:13px">Datagrammet (${tot} B) passer i MTU'en (${mtu} B) — ingen fragmentering. MF = 0, offset = 0.</p>`;return}
      const per=Math.floor((mtu-20)/8)*8;const rows=[];let off=0;
      while(off<data){const len=Math.min(per,data-off);rows.push([rows.length+1,len,off/8,off+len<data?1:0,len+20]);off+=len}
      res.innerHTML=`<p style="font-size:13px">Data i originalen: ${tot} − 20 = <b>${data} B</b>. Maks. data pr. fragment: (${mtu} − 20) rundet ned til 8-tal = <b>${per} B</b>.</p>
       <table class="g-table"><tr><th>Fragment</th><th>Data (B)</th><th>Offset (÷8)</th><th>Byte-position</th><th>MF</th><th>Total length</th></tr>
       ${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td><td>${r[2]*8}–${r[2]*8+r[1]-1}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</table>
       <p style="font-size:12px;color:var(--muted)">Alle fragmenter har samme <b>identification</b>. Kun det sidste har MF = 0. Destinationen samler dem — mangler ét, kasseres hele datagrammet.</p>`;
    };
    a.oninput=b.oninput=calc;calc();
  },
  slice(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>Slicing-visualizer</h4><div class="tool-row"><label>Tekst</label><input class="input" value="Kolbye"><label>Slice</label><input class="input" value="[::-1]" style="flex:0 1 140px"></div><div class="tool-res"></div>
      <div style="font-size:11px;color:var(--muted)">Prøv: <code>[0]</code> <code>[-1]</code> <code>[1:4]</code> <code>[:3]</code> <code>[-2:]</code> <code>[::2]</code> <code>[::-2]</code></div>`;
    const [t,s]=el.querySelectorAll("input"),res=el.querySelector(".tool-res");
    const calc=()=>{
      const str=t.value,n=str.length,m=s.value.replace(/\s/g,"").match(/^\[(-?\d*)(?::(-?\d*))?(?::(-?\d*))?\]$/);
      if(!m){res.innerHTML=`<div class="tool-err">Skriv fx [1:4] eller [::-1]</div>`;return}
      let idx=[];
      if(!s.value.includes(":")){let i=+m[1];if(m[1]===""){res.innerHTML=`<div class="tool-err">Mangler index</div>`;return}if(i<0)i+=n;if(i<0||i>=n){res.innerHTML=`<div class="tool-err">IndexError: string index out of range</div>`;return}idx=[i]}
      else{
        const step=m[3]===undefined||m[3]===""?1:+m[3];if(step===0){res.innerHTML=`<div class="tool-err">ValueError: slice step cannot be zero</div>`;return}
        const norm=(v,def)=>{if(v===undefined||v==="")return def;let x=+v;if(x<0)x+=n;return step>0?Math.min(Math.max(x,0),n):Math.min(Math.max(x,-1),n-1)};
        const a=norm(m[1],step>0?0:n-1),b=norm(m[2],step>0?n:-1);
        for(let i=a;step>0?i<b:i>b;i+=step)idx.push(i);
      }
      const r=idx.map(i=>str[i]).join("");
      res.innerHTML=`<div class="chars">${[...str].map((c,i)=>`<div class="ch ${idx.includes(i)?"on":""}"><small>${i}</small><b>${esc(c===" "?"␣":c)}</b><small>${i-n}</small></div>`).join("")}</div>
       <p style="font-size:13px;margin-top:10px"><code>'${esc(str)}'${esc(s.value.trim())}</code> → <code>${s.value.includes(":")?"'"+esc(r)+"'":"'"+esc(r)+"'"}</code> &nbsp;<span style="color:var(--muted);font-size:11px">øverste tal = positivt index, nederste = negativt index${idx.length>1?" · rækkefølge: "+idx.join(", "):""}</span></p>`;
    };
    t.oninput=s.oninput=calc;calc();
  },
  range(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>range()-visualizer</h4><div class="tool-row"><label>start</label><input class="input" type="number" value="1"><label>stop</label><input class="input" type="number" value="11"><label>step</label><input class="input" type="number" value="1"></div><div class="tool-res"></div>`;
    const [a,b,c]=el.querySelectorAll("input"),res=el.querySelector(".tool-res");
    const calc=()=>{const s=+a.value,e=+b.value,st=+c.value;if(!st){res.innerHTML=`<div class="tool-err">ValueError: range() arg 3 must not be zero</div>`;return}
      const out=[];for(let i=s;st>0?i<e:i>e;i+=st){out.push(i);if(out.length>200)break}
      res.innerHTML=`<p style="font-size:13px"><code>list(range(${s}, ${e}, ${st}))</code> → <code>[${out.join(", ")}${out.length>200?", …":""}]</code> &nbsp; <span style="color:var(--muted);font-size:11px">${out.length} tal · stop (${e}) er aldrig med</span></p>`};
    a.oninput=b.oninput=c.oninput=calc;calc();
  },
  caesar(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>Caesar-værksted</h4><div class="tool-row"><label>Tekst</label><input class="input" value="Hello World!"><label>Nøgle</label><input class="input" type="number" value="3" style="flex:0 1 90px"></div><div class="tool-res"></div>`;
    const [t,k]=el.querySelectorAll("input"),res=el.querySelector(".tool-res");
    const calc=()=>{const key=+k.value||0;const sh=c=>{const o=c.charCodeAt(0);if(o>=97&&o<=122)return String.fromCharCode(((o-97+key)%26+26)%26+97);if(o>=65&&o<=90)return String.fromCharCode(((o-65+key)%26+26)%26+65);return c};
      const chars=[...t.value].slice(0,24);
      res.innerHTML=`<div class="chars">${chars.map(c=>`<div class="ch"><small class="ord">${c.charCodeAt(0)}</small><b>${esc(c===" "?"␣":c)}</b><small>↓</small><b style="color:var(--teal)">${esc(sh(c)===" "?"␣":sh(c))}</b><small class="ord">${sh(c).charCodeAt(0)}</small></div>`).join("")}</div>
      <p style="font-size:13px;margin-top:10px">Resultat: <code>${esc([...t.value].map(sh).join(""))}</code> · Gult tal = <code>ord()</code>. Formel for små bogstaver: <code>chr((ord(c) - 97 + key) % 26 + 97)</code></p>`};
    t.oninput=k.oninput=calc;calc();
  },
  checksum(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>UDP/Internet checksum (16-bit one's complement)</h4><div class="tool-row"><input class="input" value="1110011001100110"><input class="input" value="1101010101010101"><input class="input" value="" placeholder="(valgfrit 3. ord)"></div><div class="tool-res"></div>`;
    const ins=el.querySelectorAll("input"),res=el.querySelector(".tool-res");
    const calc=()=>{const ws=[...ins].map(i=>i.value.trim()).filter(Boolean);
      if(!ws.every(w=>/^[01]{16}$/.test(w))){res.innerHTML=`<div class="tool-err">Hvert ord skal være præcis 16 bit (0/1)</div>`;return}
      let sum=0,lines=[];ws.forEach((w,i)=>{sum+=parseInt(w,2);let wrap="";if(sum>0xFFFF){sum=(sum&0xFFFF)+1;wrap=" ← carry lagt til (wraparound)"}lines.push((i?"+ ":"  ")+w+(i?"  = "+sum.toString(2).padStart(16,"0")+wrap:""))});
      const ck=(~sum)&0xFFFF;
      res.innerHTML=`<pre style="margin:0 0 8px">${lines.join("\n")}\nsum      ${sum.toString(2).padStart(16,"0")}\nchecksum ${ck.toString(2).padStart(16,"0")}   (bitvis komplement, 0x${ck.toString(16).toUpperCase().padStart(4,"0")})\nmodtager: sum + checksum = ${(sum+ck).toString(2).padStart(16,"0")}  → lutter 1-taller = ingen fejl opdaget</pre>`};
    ins.forEach(i=>i.oninput=calc);calc();
  },
  base64(el){
    el.classList.add("tool");
    el.innerHTML=`<h4>Base64-dekoder (HTTP Basic Auth)</h4><div class="tool-row"><input class="input" value="Z3Vlc3Q6Z3Vlc3Q="></div><div class="tool-res"></div>`;
    const i=el.querySelector("input"),res=el.querySelector(".tool-res");
    const calc=()=>{try{res.innerHTML=`<p style="font-size:13px">Dekodet: <code>${esc(atob(i.value.trim()))}</code> — det er <b>brugernavn:password</b> i klartekst. Base64 er encoding, ikke kryptering.</p>`}catch(e){res.innerHTML=`<div class="tool-err">Ikke gyldig base64</div>`}};
    i.oninput=calc;calc();
  },
  stack(el){
    const L=STACK;
    el.innerHTML=`<div class="stack">${L.map((l,i)=>`<div class="stack-row" data-i="${i}"><div class="ly"><b>${l.n}. ${l.name}</b><small>PDU: ${l.pdu}</small></div><div class="enc">${l.enc}</div></div>`).join("")}</div><div class="hdr-info stack-info">Klik på et lag for at se protokoller, adresser og enheder.</div>`;
    el.querySelectorAll(".stack-row").forEach(r=>r.onclick=()=>{const l=L[+r.dataset.i];el.querySelectorAll(".stack-row").forEach(x=>x.classList.toggle("sel",x===r));
      el.querySelector(".stack-info").innerHTML=`<b>${l.name}</b> — ${l.job}<br><span style="color:var(--muted)">Protokoller:</span> ${l.proto} · <span style="color:var(--muted)">Adresse:</span> ${l.addr} · <span style="color:var(--muted)">Enhed:</span> ${l.dev}`});
  },
  daylife(el){
    const S=DAYLIFE;let i=0;el.classList.add("stepper");
    const draw=()=>{const s=S[i];el.innerHTML=`<div class="step-dots">${S.map((x,j)=>`<button class="step-dot ${j===i?"active":""}" data-j="${j}">${j+1}. ${x.short}</button>`).join("")}</div>
      <div class="step-body"><h4>${i+1}. ${s.title}</h4>${s.html}</div>
      <div class="step-foot"><button class="btn" ${i===0?"disabled":""} data-d="-1">← Forrige</button><span style="font-size:11px;color:var(--muted);align-self:center">Trin ${i+1} af ${S.length}</span><button class="btn primary" ${i===S.length-1?"disabled":""} data-d="1">Næste →</button></div>`;
      el.querySelectorAll("[data-j]").forEach(b=>b.onclick=()=>{i=+b.dataset.j;draw()});
      el.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{i+=+b.dataset.d;draw()});};
    draw();
  },
  svg(el){ /* static svg by name */
    const s=SVGS[el.dataset.name];el.classList.add("fig");
    el.innerHTML=`<div class="svgwrap">${s.svg}</div>${s.caption?`<figcaption>${s.caption}</figcaption>`:""}`;
  }
};
