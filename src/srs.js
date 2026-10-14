/* ===== Spaced repetition for the flashcards =====
   its_srs: {cardId: {d: due day, i: interval in days, e: ease, n: successful reviews in a row}}
   its_srs_day: today's fixed set of new cards per subject, so the session doesn't keep refilling. */
const SRS_KEY="its_srs", SRS_DAY_KEY="its_srs_day", SRS_NEW_PER_DAY=10;
const srsToday=()=>{const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/864e5)};
function srsLoad(){try{return JSON.parse(localStorage.getItem(SRS_KEY)||"{}")||{}}catch{return {}}}
function srsSave(m){try{localStorage.setItem(SRS_KEY,JSON.stringify(m))}catch{}}
/* cards marked before spaced repetition existed: "Øv igen" and "Usikker" count as due, "Kan" does not */
function srsIsDue(id,m=srsLoad(),today=srsToday()){
  const e=m[id];
  return e?e.d<=today:statusMap[id]==="review"||statusMap[id]==="unsure";
}
function srsNext(prev,st){
  const e={i:0,e:2.3,n:0,...(prev||{})};
  if(st==="known"){e.i=e.n===0?2:e.n===1?5:Math.round(Math.max(e.i,2)*e.e);e.e=Math.min(2.8,e.e+.05);e.n++}
  else if(st==="unsure"){e.i=1;e.e=Math.max(1.3,e.e-.15)}
  else{e.i=0;e.e=Math.max(1.3,e.e-.2);e.n=0}
  e.i=Math.min(e.i,180);e.d=srsToday()+e.i;
  return e;
}
function srsReview(id,st){const m=srsLoad();m[id]=srsNext(m[id],st);srsSave(m)}
const srsLabel=days=>days<=0?"i dag":days===1?"i morgen":days<7?`om ${days} dage`:days<30?`om ${Math.round(days/7)} uge${Math.round(days/7)>1?"r":""}`:`om ${Math.round(days/30)} md.`;
function srsNewToday(subj=subject){
  const today=srsToday();let s;
  try{s=JSON.parse(localStorage.getItem(SRS_DAY_KEY)||"{}")||{}}catch{s={}}
  if(s.day!==today)s={day:today};
  if(!s[subj]){
    const m=srsLoad();
    s[subj]=ALL_CARDS.filter(c=>c.subject===subj&&!statusMap[c.id]&&!m[c.id]).slice(0,SRS_NEW_PER_DAY).map(c=>c.id);
    try{localStorage.setItem(SRS_DAY_KEY,JSON.stringify(s))}catch{}
  }
  return s[subj];
}
/* numbers for the start page */
function srsStats(subj=subject){
  const m=srsLoad(),today=srsToday(),cards=ALL_CARDS.filter(c=>c.subject===subj);
  const due=cards.filter(c=>srsIsDue(c.id,m,today)).length;
  const fresh=srsNewToday(subj).filter(id=>!m[id]).length;
  const future=cards.map(c=>m[c.id]).filter(e=>e&&e.d>today).map(e=>e.d-today);
  const next=future.length?Math.min(...future):null;
  const tomorrow=future.filter(d=>d===1).length;
  return {due,fresh,next,tomorrow,learned:cards.filter(c=>m[c.id]&&m[c.id].n>0).length,total:cards.length};
}
function startTodaySession(){category="Alle";difficulty="all";typeFilter="all";statusFilter="today";sortMode="default";search="";studyIndex=0;setView("study")}

/* the status buttons show when the card comes back for each choice */
statusButtons=function(id){
  const m=srsLoad(),e=m[id],s=statusMap[id]||"",saved=!!savedMap[id];
  const when=st=>st==="review"?"igen i dag":srsLabel(srsNext(e,st).i);
  const due=e?e.d-srsToday():null;
  return `<span class="status-label">Status:</span>
  <button class="status-btn saved-btn ${saved?"active":""}" data-save="1">${icon("star")}${saved?"Gemt":"Gem"}</button>
  <button class="status-btn known ${s==="known"?"active":""}" data-st="known" title="Kort kommer igen ${when("known")}">Kan<small>${when("known")}</small></button>
  <button class="status-btn unsure ${s==="unsure"?"active":""}" data-st="unsure" title="Kort kommer igen ${when("unsure")}">Usikker<small>${when("unsure")}</small></button>
  <button class="status-btn review ${s==="review"?"active":""}" data-st="review" title="Kortet bliver i dagens session">Øv igen<small>${when("review")}</small></button>
  ${e&&due>0?`<span class="srs-next">${icon("clock")}Næste repetition ${srsLabel(due)}</span>`:""}`;
};
function studyEmptyHTML(){
  if(statusFilter!=="due"&&statusFilter!=="today")return `<div class="empty">Ingen kort matcher filtrene.</div>`;
  const st=srsStats();
  return `<div class="srs-done"><span class="srs-done-ic">${icon("checkCircle")}</span><h3>Færdig for i dag</h3>
    <p>Du har repeteret alle kort, der var klar i ${esc(subject)}.${st.next!==null?` Næste repetition er ${srsLabel(st.next)}${st.tomorrow?` (${st.tomorrow} kort i morgen)`:""}.`:""}</p>
    <div class="srs-done-actions"><button class="btn primary" data-srs-all>${icon("cards")}Fortsæt med alle kort</button><button class="btn" data-go2="exam">${icon("graduation")}Tag en prøveeksamen</button></div></div>`;
}
function bindStudyEmpty(){
  $("#studyCardHost [data-srs-all]")?.addEventListener("click",()=>{statusFilter="all";studyIndex=0;renderStudy()});
  $("#studyCardHost [data-go2]")?.addEventListener("click",()=>setView("exam"));
}
