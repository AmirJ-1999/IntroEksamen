/* ===== Netværk Lab: quiz-motor ===== */
/* Spørgsmål kommer fra NQ_BANK (håndskrevne) og genereres desuden fra HEADERS/FRAMES (felter),
   SEQS (sekvensdiagrammer), NQ_ORDERS (rækkefølger) og små beregnings-generatorer.
   Statistik pr. spørgsmål gemmes i localStorage "its_netquiz" (og følger dermed kontoen). */
let nqStats=JSON.parse(localStorage.getItem("its_netquiz")||"{}");
let nqRound=null;          // {title, items:[spec], i, results:[{spec, ok, q}], q (current question), answered}
let nqKeyHandler=null;
const NQ_ROUND=10, NQ_EXAM=20;
const NQ_FAMILY_WEIGHT={bank:4,header:3,seq:1.5,order:1,calc:1.5};
const NQ_KIND_LABEL={mc:"Multiple choice",multi:"Vælg flere",hname:"Hvad hedder feltet?",hpoint:"Peg på feltet",hclue:"Peg på feltet",hpurpose:"Hvad bruges feltet til?",hsize:"Feltets størrelse",seq:"Hvad mangler?",order:"Rækkefølge",calc:"Beregning"};
const nqShuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const nqPickN=(a,n)=>nqShuffle(a).slice(0,n);
const nqRand=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
const nqTopic=id=>NQ_TOPICS.find(t=>t.id===id);
function nqSave(){localStorage.setItem("its_netquiz",JSON.stringify(nqStats))}

/* ---------- the question pool ---------- */
const nqHeaderDef=k=>HEADERS[k]||FRAMES[k];
const nqHeaderKeys=()=>Object.keys(NQ_HEADER_TOPIC).filter(nqHeaderDef);
const nqFieldOk=f=>f.c!=="data"&&f.n!=="Reserveret";
const nqFieldSize=f=>f.size||(f.var?"variabel":f.b%8===0&&f.b>=8?`${f.b} bit = ${f.b/8} B`:`${f.b} bit`);
const NQ_CALCS={
  "subnet-net":"network","subnet-bc":"network","subnet-hosts":"network","subnet-mask":"network",
  "frag-count":"network","frag-offset":"network","frag-last":"network","ihl":"network",
  "tcphl":"transport","seqack":"transport","synack":"transport","porthex":"transport"
};
let nqPoolCache=null;
function nqPool(){
  if(nqPoolCache)return nqPoolCache;
  const P=[];
  NQ_BANK.forEach(q=>P.push({id:"b:"+q.id,t:q.t,fam:"bank",kind:(q.c||1)>1?"multi":"mc",src:q}));
  NQ_ORDERS.forEach(o=>P.push({id:"o:"+o.id,t:o.t,fam:"order",kind:"order",src:o}));
  nqHeaderKeys().forEach(h=>{
    const def=nqHeaderDef(h),t=NQ_HEADER_TOPIC[h],clues=NQ_CLUES[h]||{},isFrame=!HEADERS[h];
    const withClue=def.fields.filter(f=>clues[f.n]).length;
    def.fields.forEach((f,fi)=>{
      if(!nqFieldOk(f))return;
      P.push({id:`hn:${h}:${fi}`,t,fam:"header",kind:"hname",h,fi});
      P.push({id:`hp:${h}:${fi}`,t,fam:"header",kind:"hpoint",h,fi});
      if(clues[f.n])P.push({id:`hc:${h}:${fi}`,t,fam:"header",kind:"hclue",h,fi});
      if(clues[f.n]&&withClue>=4)P.push({id:`hu:${h}:${fi}`,t,fam:"header",kind:"hpurpose",h,fi});
      if(!isFrame&&!f.var)P.push({id:`hs:${h}:${fi}`,t,fam:"header",kind:"hsize",h,fi});
    });
  });
  Object.entries(NQ_SEQS).forEach(([k,meta])=>{
    const s=SEQS[k];if(!s)return;
    let ai=-1;
    s.msgs.forEach(m=>{if(m.l===undefined)return;ai++;if(m.f!==m.t)P.push({id:`sq:${k}:${ai}`,t:meta.t,fam:"seq",kind:"seq",k,ai})});
  });
  Object.entries(NQ_CALCS).forEach(([k,t])=>P.push({id:"c:"+k,t,fam:"calc",kind:"calc",k}));
  return nqPoolCache=P;
}
const nqStat=id=>nqStats[id]||null;
function nqRecord(spec,ok){
  const s=nqStats[spec.id]||{n:0,c:0,s:0};
  s.n++;if(ok){s.c++;s.s++}else s.s=0;s.t=Date.now();
  nqStats[spec.id]=s;nqSave();
}
/* priority: last answered wrong > never seen > shaky > mastered (plus randomness) */
function nqScore(spec){
  const s=nqStat(spec.id);
  const base=!s?2:s.s===0?3:1/(1+s.s);
  return base+Math.random()*1.6;
}
function nqSelect(pool,n){
  const fams={};pool.forEach(p=>(fams[p.fam]=fams[p.fam]||[]).push(p));
  Object.values(fams).forEach(list=>list.sort((a,b)=>nqScore(b)-nqScore(a)));
  const out=[];
  while(out.length<n){
    const avail=Object.keys(fams).filter(f=>fams[f].length);
    if(!avail.length)break;
    const total=avail.reduce((s,f)=>s+NQ_FAMILY_WEIGHT[f],0);
    let r=Math.random()*total,fam=avail[0];
    for(const f of avail){r-=NQ_FAMILY_WEIGHT[f];if(r<=0){fam=f;break}}
    out.push(fams[fam].shift());
  }
  return nqShuffle(out);
}
function nqMastery(topic){
  const fams={};nqPool().filter(p=>p.t===topic).forEach(p=>{(fams[p.fam]=fams[p.fam]||{n:0,m:0}).n++;const s=nqStat(p.id);if(s&&s.s>0)fams[p.fam].m++});
  // weighted by question family, so a family with one or two items can't dominate the percentage
  const keys=Object.keys(fams);if(!keys.length)return 0;
  const w=f=>NQ_FAMILY_WEIGHT[f]*Math.min(1,fams[f].n/10);
  return Math.round(100*keys.reduce((a,f)=>a+w(f)*fams[f].m/fams[f].n,0)/keys.reduce((a,f)=>a+w(f),0));
}
function nqTopicCounts(topic){
  const items=nqPool().filter(p=>p.t===topic);let n=0,c=0;
  items.forEach(p=>{const s=nqStat(p.id);if(s){n+=s.n;c+=s.c}});
  return {pool:items.length,answered:n,pct:n?Math.round(100*c/n):null};
}
const nqWeak=()=>nqPool().filter(p=>{const s=nqStat(p.id);return s&&s.s===0});

/* ---------- building one question from a spec ---------- */
function nqOptions(correct,wrong,count=4){
  const seen=new Set([String(correct)]),opts=[{label:String(correct),ok:true}];
  for(const w of nqShuffle(wrong)){const k=String(w);if(seen.has(k))continue;seen.add(k);opts.push({label:k,ok:false});if(opts.length>=count)break}
  return nqShuffle(opts);
}
const nqSeqLabel=l=>String(l).replace(/\s+/g," ").replace(/^\d+\.\s*/,"").trim();
function nqFieldInfo(h,fi){
  const f=nqHeaderDef(h).fields[fi];
  return `<b>${esc(f.n)}</b> · ${esc(nqFieldSize(f))}${f.full?" · <i>"+esc(f.full)+"</i>":""}<br>${f.d}`;
}
function nqMake(spec){
  const q={spec,kind:spec.kind,topic:spec.t};
  const def=spec.h?nqHeaderDef(spec.h):null, f=def?def.fields[spec.fi]:null;
  const clues=spec.h?(NQ_CLUES[spec.h]||{}):{};
  const others=def?def.fields.filter((x,i)=>i!==spec.fi&&nqFieldOk(x)):[];
  switch(spec.kind){
    case "mc":case "multi":{
      const s=spec.src,c=s.c||1;
      q.prompt=esc(s.q);q.multi=c>1;
      q.options=nqShuffle(s.a.map((label,i)=>({label,ok:i<c})));
      q.ex=esc(s.ex);q.g=s.g;
      if(s.v){q.visual={h:s.v.h||s.v.f,mark:s.v.h||s.v.f?(nqHeaderDef(s.v.h||s.v.f).fields.findIndex(x=>x.n===s.v.m)):-1}}
      break;
    }
    case "order":{
      const o=spec.src;q.prompt=esc(o.q);q.items=o.items;q.ex=esc(o.ex);q.g=o.g;break;
    }
    case "hname":
      q.prompt=`Hvad hedder det markerede felt i ${esc(def.title)}?`;
      q.visual={h:spec.h,mark:spec.fi,hideNames:true};
      q.options=nqOptions(f.n,others.map(x=>x.n));
      q.exHTML=nqFieldInfo(spec.h,spec.fi);q.g=NQ_HEADER_GUIDE[spec.h];break;
    case "hpoint":
      q.prompt=`Klik på feltet <b>${esc(f.n)}</b> i ${esc(def.title)}.`;
      q.visual={h:spec.h,hideNames:true,hideSizes:true,pick:true};q.answerFi=spec.fi;
      q.exHTML=nqFieldInfo(spec.h,spec.fi);q.g=NQ_HEADER_GUIDE[spec.h];break;
    case "hclue":
      q.prompt=`Klik på feltet i ${esc(def.title)}, der har denne funktion:<span class="nq-clue">${esc(clues[f.n])}</span>`;
      q.visual={h:spec.h,pick:true};q.answerFi=spec.fi;
      q.exHTML=nqFieldInfo(spec.h,spec.fi);q.g=NQ_HEADER_GUIDE[spec.h];break;
    case "hpurpose":
      q.prompt=`Hvad bruges det markerede felt i ${esc(def.title)} til?`;
      q.visual={h:spec.h,mark:spec.fi};
      q.options=nqOptions(clues[f.n],others.filter(x=>clues[x.n]).map(x=>clues[x.n]));
      q.exHTML=nqFieldInfo(spec.h,spec.fi);q.g=NQ_HEADER_GUIDE[spec.h];break;
    case "hsize":{
      q.prompt=`Hvor stort er det markerede felt <b>${esc(f.n)}</b> i ${esc(def.title)}?`;
      q.visual={h:spec.h,mark:spec.fi,hideSizes:true};
      const bits=[1,2,3,4,6,8,9,12,13,16,20,24,32,48,64,128].filter(b=>b!==f.b);
      const near=bits.sort((a,b)=>Math.abs(a-f.b)-Math.abs(b-f.b)).slice(0,6);
      q.options=nqOptions(`${f.b} bit`,near.map(b=>`${b} bit`));
      q.exHTML=nqFieldInfo(spec.h,spec.fi);q.g=NQ_HEADER_GUIDE[spec.h];break;
    }
    case "seq":{
      const s=SEQS[spec.k],meta=NQ_SEQS[spec.k];
      const labels=s.msgs.filter(m=>m.l!==undefined).map(m=>m.l);
      const correct=nqSeqLabel(labels[spec.ai]);
      q.prompt=`Hvad mangler på den markerede pil i diagrammet «${esc(s.title)}»?`;
      q.seq={k:spec.k,hide:spec.ai};
      q.options=nqOptions(correct,[...labels.map(nqSeqLabel),...meta.extra].filter(l=>l!==correct));
      const m=s.msgs.filter(m=>m.l!==undefined)[spec.ai];
      q.exHTML=`Det rigtige er <b>${esc(correct)}</b>${m.s?`: ${esc(m.s)}`:""}.`;q.g=meta.g;break;
    }
    case "calc":Object.assign(q,nqCalc(spec.k));break;
  }
  return q;
}

/* ---------- calculation generators (new numbers every time) ---------- */
const nqMask=p=>p===0?0:(0xffffffff<<(32-p))>>>0;
function nqRandPrivateIp(){
  const r=Math.random();
  if(r<.45)return ipToInt(`192.168.${nqRand(0,255)}.${nqRand(1,254)}`);
  if(r<.75)return ipToInt(`10.${nqRand(0,255)}.${nqRand(0,255)}.${nqRand(1,254)}`);
  return ipToInt(`172.${nqRand(16,31)}.${nqRand(0,255)}.${nqRand(1,254)}`);
}
function nqCalc(k){
  const R={topic:NQ_CALCS[k],g:"net-subnet"};
  const P=[24,25,26,27,28,29,22,20][nqRand(0,7)];
  const ip=nqRandPrivateIp(),net=(ip&nqMask(P))>>>0,bc=(net|(~nqMask(P)>>>0))>>>0;
  const host=32-P,hosts=2**host-2,I=intToIp,cidr=`${I(ip)}/${P}`;
  const netOf=p=>I((ip&nqMask(p))>>>0),bcOf=p=>I(((ip&nqMask(p))|(~nqMask(p)>>>0))>>>0);
  switch(k){
    case "subnet-net":
      R.prompt=`Hvad er netværksadressen for <b>${cidr}</b>?`;
      R.options=nqOptions(I(net),[I(bc),netOf(P+1),netOf(P-1),I(net+1),netOf(P+2)]);
      R.ex=`Netværksadressen = IP AND maske. /${P} giver ${host} værtsbit, som alle sættes til 0: ${I(net)}.`;break;
    case "subnet-bc":
      R.prompt=`Hvad er broadcast-adressen for <b>${cidr}</b>?`;
      R.options=nqOptions(I(bc),[I(net),I(bc-1),bcOf(P+1),bcOf(P-1),bcOf(P+2)]);
      R.ex=`Broadcast = alle ${host} værtsbit sat til 1: ${I(bc)}. Brugbare værter går fra ${I(net+1)} til ${I(bc-1)}.`;break;
    case "subnet-hosts":
      R.prompt=`Hvor mange brugbare værtsadresser er der i et <b>/${P}</b>-net?`;
      R.options=nqOptions(hosts,[2**host,2**host-1,2**(host-1)-2,2**(host+1)-2]);
      R.ex=`2^${host} − 2 = ${hosts}. Netværks- og broadcast-adressen kan ikke bruges til værter.`;break;
    case "subnet-mask":
      R.prompt=`Hvilken subnetmaske svarer til <b>/${P}</b>?`;
      R.options=nqOptions(I(nqMask(P)),[I(nqMask(P+1)),I(nqMask(P-1)),I(nqMask(P+2)),I(nqMask(P-2))]);
      R.ex=`/${P} = ${P} ettaller efterfulgt af ${host} nuller = ${I(nqMask(P))}.`;break;
    case "frag-count":case "frag-offset":case "frag-last":{
      R.g="net-frag";
      const D=nqRand(76,295)*20,n=Math.ceil(D/1480),last=D-(n-1)*1480;
      const intro=`Et IPv4-datagram med <b>${D} bytes data</b> (+ 20 B header) skal over et link med MTU 1500.`;
      if(k==="frag-count"){
        R.prompt=`${intro} Hvor mange fragmenter bliver det til?`;
        R.options=nqOptions(n,[n+1,n-1,Math.ceil(D/1500),Math.ceil((D+20)/1500)+1].filter(x=>x>0));
        R.ex=`Hvert fragment kan have 1500 − 20 = 1480 bytes data. ${D} / 1480 rundet op = ${n}.`;
      }else if(k==="frag-offset"){
        const j=nqRand(2,Math.max(2,n));const off=(j-1)*185;
        R.prompt=`${intro} Hvad står der i fragment offset i fragment nr. ${j}?`;
        R.options=nqOptions(off,[(j-1)*1480,(j-1)*187,j*185,(j-1)*1500,off+1]);
        R.ex=`Fragment ${j} starter ved byte ${(j-1)*1480}. Offset tælles i enheder af 8 bytes: ${(j-1)*1480} / 8 = ${off}.`;
      }else{
        R.prompt=`${intro} Hvor mange bytes data er der i det sidste fragment?`;
        R.options=nqOptions(last,[last+20,1480,D%1500||1500,last-20].filter(x=>x>0));
        R.ex=`De første ${n-1} fragmenter har 1480 B data hver (${(n-1)*1480} B i alt), så det sidste får ${D} − ${(n-1)*1480} = ${last} B data (og MF = 0).`;
      }
      break;
    }
    case "ihl":{
      const v=nqRand(5,15);R.g="net-ipv4";
      R.prompt=`IHL-feltet i en IPv4-header er <b>${v}</b>. Hvor lang er headeren?`;
      R.options=nqOptions(`${v*4} bytes`,[`${v} bytes`,`${v*8} bytes`,`${v*32} bytes`,`${v*2} bytes`]);
      R.ex=`IHL tæller 32-bit ord (4 bytes): ${v} · 4 = ${v*4} bytes. Minimum 5 (20 B) og maksimum 15 (60 B).`;
      R.visual={h:"ipv4",mark:1};break;
    }
    case "tcphl":{
      const v=nqRand(5,15);R.g="net-tcphdr";
      R.prompt=`Header length i et TCP-segment er <b>${v}</b>. Hvor lang er TCP-headeren?`;
      R.options=nqOptions(`${v*4} bytes`,[`${v} bytes`,`${v*8} bytes`,`${v*32} bytes`,`${v*2} bytes`]);
      R.ex=`Header length tæller 32-bit ord: ${v} · 4 = ${v*4} bytes${v>5?`, heraf ${(v-5)*4} B options`:""}.`;
      R.visual={h:"tcp",mark:4};break;
    }
    case "seqack":{
      const x=nqRand(1000,90000),n=[1,100,200,512,1000,1460][nqRand(0,5)];R.g="net-tcphdr";
      R.prompt=`Klienten sender et TCP-segment med <b>seq = ${x}</b> og <b>${n} bytes data</b>. Hvilket ack-nummer kvitterer serveren med?`;
      R.options=nqOptions(x+n,[x+n-1,x+n+1,x+1,x,x+2*n]);
      R.ex=`ACK = næste forventede byte = ${x} + ${n} = ${x+n}.`;break;
    }
    case "synack":{
      const x=nqRand(1000,4000000000);R.g="net-tcploss";
      R.prompt=`Klientens SYN har <b>seq = ${x}</b>. Hvilket ack-nummer står der i serverens SYN-ACK?`;
      R.options=nqOptions(x+1,[x,x+2,0,x+20]);
      R.ex=`SYN forbruger ét sekvensnummer, så serveren kvitterer med ${x} + 1 = ${x+1}.`;break;
    }
    case "porthex":{
      const ports={80:"HTTP",443:"HTTPS",53:"DNS",22:"SSH",25:"SMTP",8080:"HTTP-alt",110:"POP3",143:"IMAP",123:"NTP",3389:"RDP"};
      const keys=Object.keys(ports).map(Number),p=keys[nqRand(0,keys.length-1)];
      const hex=p.toString(16).padStart(4,"0"),hi=p>>8,lo=p&255,swapped=(lo<<8)|hi;R.g="net-udp";
      R.prompt=`De to første bytes i en TCP-header er <code>0x${hex.toUpperCase()}</code>. Hvilken source port er det?`;
      R.options=nqOptions(p,[swapped,hi+lo,parseInt(hex,10)||p+1,...keys.filter(x=>x!==p)].filter(x=>x>0&&x!==p));
      R.ex=`0x${hex.toUpperCase()} = ${hi} · 256 + ${lo} = ${p} (${ports[p]}). Netværk bruger big-endian, så den mest betydende byte kommer først.`;
      R.visual={h:"tcp",mark:0};break;
    }
  }
  return R;
}

/* ---------- visuals ---------- */
function nqHeaderHTML(key,{hideNames=false,hideSizes=false,mark=-1,good=-1,bad=-1,pick=false}={}){
  const def=nqHeaderDef(key),isFrame=!HEADERS[key];
  const cls=fi=>`${fi===mark?" q-mark":""}${fi===good?" q-good":""}${fi===bad?" q-bad":""}`;
  const label=f=>hideNames?"":esc(f.n);
  const title=`<div class="hdr-title"><b>${esc(def.title)}</b><span>${pick?"Klik på et felt":esc(isFrame?def.sub:"32 bit pr. række")}</span></div>`;
  if(isFrame)return `${title}<div class="hdr-scroll"><div class="fbar">${def.fields.map((f,i)=>`<div class="hdr-cell c-${f.c||"x"}${cls(i)}" style="flex-grow:${f.w}" data-fi="${i}">${label(f)||"&nbsp;"}<small>${hideSizes?"&nbsp;":esc(f.size)}</small></div>`).join("")}</div></div>`;
  const cells=[];let pos=0;
  def.fields.forEach((f,fi)=>{let rem=f.b,first=true;while(rem>0){const take=Math.min(rem,32-pos);cells.push({f,fi,span:take,cont:!first});pos=(pos+take)%32;rem-=take;first=false}});
  const ruler=Array.from({length:32},(_,i)=>`<div class="hdr-ruler">${i%4===0||i===31?i:""}</div>`).join("");
  return `${title}<div class="hdr-scroll"><div class="hdr-grid nq-grid${hideNames?" nq-compact":""}">${ruler}${cells.map(c=>`<div class="hdr-cell c-${c.f.c||"x"}${cls(c.fi)}" style="grid-column:span ${c.span}" data-fi="${c.fi}">${label(c.f)}${c.cont&&!hideNames?" (forts.)":""}${hideNames&&!label(c.f)?"&nbsp;":""}<small>${hideSizes||c.span<4?"&nbsp;":esc(nqFieldSize(c.f))}</small></div>`).join("")}</div></div>`;
}
function nqDrawVisual(q,state={}){
  const el=$("#nqVisual");if(!el)return;
  if(q.seq){renderSeq(el,q.seq.k,{hide:q.seq.hide,reveal:state.done});el.classList.add("nq-seq");return}
  if(!q.visual){el.innerHTML="";el.className="nq-visual";return}
  const v=q.visual,done=!!state.done;
  el.className="nq-visual hdr";
  el.innerHTML=nqHeaderHTML(v.h,{hideNames:v.hideNames&&!done,hideSizes:v.hideSizes&&!done,mark:done?-1:v.mark??-1,good:done?(q.answerFi??v.mark??-1):-1,bad:done&&state.badFi!==undefined?state.badFi:-1,pick:v.pick&&!done});
  if(v.pick&&!done)el.querySelectorAll(".hdr-cell").forEach(c=>c.onclick=()=>nqAnswerPoint(+c.dataset.fi));
  // narrow screens: the header scrolls sideways, so bring the marked/correct field into view
  const sc=el.querySelector(".hdr-scroll"),m=el.querySelector(".q-mark,.q-good");
  if(sc&&m&&sc.scrollWidth>sc.clientWidth)sc.scrollLeft=Math.max(0,m.offsetLeft-(sc.clientWidth-m.offsetWidth)/2);
}

/* ---------- screens ---------- */
function renderNetlab(){
  if(nqRound&&!nqRound.finished)return nqShowQuestion();
  if(nqRound&&nqRound.finished)return nqShowDone();
  nqShowHome();
}
function nqShowHome(){
  nqRound=null;nqBindKeys(null);
  const weak=nqWeak().length;
  $("#nqBody").innerHTML=`
    <p class="nq-lead">Multiple choice med rigtige headere, sekvensdiagrammer, rækkefølger og beregninger. Du får svar og forklaring med det samme. Det, du svarer forkert på, kommer oftere igen.</p>
    <div class="nq-actions">
      <button class="btn run" id="nqExam">${icon("trophy")}Eksamensøvelse · ${NQ_EXAM} blandede</button>
      <button class="btn" id="nqWeakBtn" ${weak?"":"disabled"}>${icon("target")}Øv svage punkter${weak?` (${weak})`:""}</button>
    </div>
    <div class="nq-topics">${NQ_TOPICS.map(t=>{
      const m=nqMastery(t.id),c=nqTopicCounts(t.id);
      return `<button class="nq-topic" data-topic="${t.id}">
        <span class="nq-topic-icon">${icon(t.icon)}</span>
        <b>${esc(t.name)}</b><small>${esc(t.desc)}</small>
        <span class="nq-bar"><i style="width:${m}%"></i></span>
        <span class="nq-topic-meta"><span>${m}% mestret</span><span>${c.answered?`${c.pct}% rigtige svar`:`${c.pool} spørgsmål`}</span></span>
        <span class="nq-topic-go">Start runde ${icon("arrowRight")}</span>
      </button>`}).join("")}</div>
    <div class="nq-types"><b>Spørgsmålstyper:</b> tekstspørgsmål · hvad hedder feltet? · peg på feltet i headeren · hvad bruges feltet til? · feltstørrelser · hvad mangler i diagrammet? · sæt i rækkefølge · subnetting, fragmentering og seq/ack-beregninger</div>`;
  $$("#nqBody [data-topic]").forEach(b=>b.onclick=()=>nqStart(b.dataset.topic));
  $("#nqExam").onclick=()=>nqStart("exam");
  $("#nqWeakBtn").onclick=()=>nqStart("weak");
}
function nqStart(mode,specs){
  let items,title;
  if(specs){items=nqShuffle(specs);title="Øv de forkerte igen"}
  else if(mode==="exam"){
    // spread across the topics, each picked with the usual mix of question families
    const per={};NQ_TOPICS.forEach(t=>per[t.id]=nqSelect(nqPool().filter(p=>p.t===t.id),NQ_EXAM));
    items=[];for(let i=0;items.length<NQ_EXAM&&i<NQ_EXAM*2;i++){const t=NQ_TOPICS[i%NQ_TOPICS.length].id;const s=per[t].shift();if(s)items.push(s)}
    items=nqShuffle(items);title="Eksamensøvelse";
  }else if(mode==="weak"){items=nqSelect(nqWeak(),NQ_ROUND);title="Svage punkter"}
  else{items=nqSelect(nqPool().filter(p=>p.t===mode),NQ_ROUND);title=nqTopic(mode).name}
  if(!items.length)return;
  nqRound={mode,title,items,i:0,results:[],q:null,answered:false,finished:false};
  nqNext(true);
}
function nqNext(first){
  if(!first)nqRound.i++;
  if(nqRound.i>=nqRound.items.length){nqRound.finished=true;return nqShowDone()}
  nqRound.q=nqMake(nqRound.items[nqRound.i]);nqRound.answered=false;nqRound.state={};nqRound.order=[];
  nqShowQuestion();
  $("#netlabView").scrollIntoView({behavior:"smooth",block:"start"});
}
function nqShowQuestion(){
  const r=nqRound,q=r.q,n=r.items.length,topic=nqTopic(q.topic||q.spec.t);
  $("#nqBody").innerHTML=`
    <div class="nq-top">
      <button class="btn" id="nqQuit">${icon("arrowLeft")}Emner</button>
      <div class="nq-progress" aria-label="Fremdrift"><i style="width:${Math.round(100*r.i/n)}%"></i></div>
      <span class="nq-count">${r.i+1} / ${n}</span>
    </div>
    <article class="nq-card">
      <div class="meta nq-meta"><span class="badge">${esc(r.title)}</span>${topic&&r.mode!==q.spec.t?`<span class="badge">${esc(topic.name)}</span>`:""}<span class="badge d2">${esc(NQ_KIND_LABEL[q.kind])}</span></div>
      <h2 class="nq-q">${q.prompt}</h2>
      ${q.multi?`<p class="nq-hint">Der er flere rigtige svar. Vælg alle og tryk «Svar».</p>`:""}
      <div class="nq-visual" id="nqVisual"></div>
      <div class="nq-answer" id="nqAnswer"></div>
      <div class="nq-feedback" id="nqFeedback" hidden></div>
    </article>`;
  $("#nqQuit").onclick=()=>{nqRound=null;nqShowHome()};
  nqDrawVisual(q,r.state);
  nqDrawAnswer();
  if(r.answered)nqShowFeedback();
  nqBindKeys(nqQuestionKeys);
}
function nqDrawAnswer(){
  const r=nqRound,q=r.q,box=$("#nqAnswer"),done=r.answered;
  if(q.kind==="hpoint"||q.kind==="hclue"){
    box.innerHTML=done?"":`<div class="nq-pointhint">${icon("pointer")} Klik på feltet i headeren ovenfor.</div><button class="btn nq-skip" id="nqSkip">Jeg ved det ikke</button>`;
    if(!done)$("#nqSkip").onclick=()=>nqAnswerPoint(-1);
    return;
  }
  if(q.kind==="order"){
    const placed=r.order,left=q.pool||(q.pool=nqShuffle(q.items.map((t,i)=>({t,i}))));
    const remaining=left.filter(x=>!placed.includes(x));
    box.innerHTML=`<ol class="nq-order">${placed.map((x,k)=>`<li class="${done?(x.i===k?"ok":"bad"):""}"><button ${done?"disabled":""} data-un="${k}">${esc(x.t)}</button></li>`).join("")}${!done?Array.from({length:remaining.length},()=>`<li class="slot"><span>tryk på et trin nedenfor</span></li>`).join(""):""}</ol>
      ${done?"":`<div class="nq-pool">${remaining.map(x=>`<button class="nq-chip" data-pick="${left.indexOf(x)}">${esc(x.t)}</button>`).join("")}</div>
      <div class="nq-row"><button class="btn primary" id="nqCheck" ${remaining.length?"disabled":""}>Tjek rækkefølge</button><button class="btn" id="nqReset">Start forfra</button><button class="btn nq-skip" id="nqSkip">Jeg ved det ikke</button></div>`}`;
    if(!done){
      box.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{r.order.push(left[+b.dataset.pick]);nqDrawAnswer()});
      box.querySelectorAll("[data-un]").forEach(b=>b.onclick=()=>{r.order.splice(+b.dataset.un,1);nqDrawAnswer()});
      $("#nqCheck").onclick=()=>nqFinishAnswer(r.order.every((x,k)=>x.i===k));
      $("#nqReset").onclick=()=>{r.order=[];nqDrawAnswer()};
      $("#nqSkip").onclick=()=>{r.order=[];nqFinishAnswer(false)};
    }
    return;
  }
  const sel=r.state.sel||(r.state.sel=new Set());
  box.innerHTML=`<div class="nq-options">${q.options.map((o,i)=>{
      let cls="nq-opt";
      if(done){if(o.ok)cls+=" ok";else if(sel.has(i))cls+=" bad";else cls+=" dim"}
      else if(sel.has(i))cls+=" sel";
      return `<button class="${cls}" data-o="${i}" ${done?"disabled":""}><span class="nq-key">${q.multi?(sel.has(i)?icon("check"):""):i+1}</span><span>${esc(o.label)}</span></button>`}).join("")}</div>
    ${done?"":`<div class="nq-row">${q.multi?`<button class="btn primary" id="nqSubmit" ${sel.size?"":"disabled"}>Svar</button>`:""}<button class="btn nq-skip" id="nqSkip">Jeg ved det ikke</button></div>`}`;
  if(done)return;
  box.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>nqPickOption(+b.dataset.o));
  if(q.multi)$("#nqSubmit").onclick=nqSubmitMulti;
  $("#nqSkip").onclick=()=>{sel.clear();nqFinishAnswer(false)};
}
function nqPickOption(i){
  const r=nqRound,q=r.q;if(r.answered)return;
  const sel=r.state.sel;
  if(q.multi){sel.has(i)?sel.delete(i):sel.add(i);return nqDrawAnswer()}
  sel.clear();sel.add(i);nqFinishAnswer(q.options[i].ok);
}
function nqSubmitMulti(){
  const q=nqRound.q,sel=nqRound.state.sel;
  nqFinishAnswer(q.options.every((o,i)=>o.ok===sel.has(i)));
}
function nqAnswerPoint(fi){
  const r=nqRound;if(r.answered)return;
  if(fi!==r.q.answerFi)r.state.badFi=fi;
  nqFinishAnswer(fi===r.q.answerFi);
}
function nqFinishAnswer(ok){
  const r=nqRound;if(r.answered)return;
  r.answered=true;r.ok=ok;r.state.done=true;
  nqRecord(r.q.spec,ok);r.results.push({spec:r.q.spec,ok,prompt:r.q.prompt});
  nqDrawVisual(r.q,r.state);nqDrawAnswer();nqShowFeedback();
}
function nqShowFeedback(){
  const r=nqRound,q=r.q,fb=$("#nqFeedback");
  const guide=q.g&&GUIDES.find(g=>g.id===q.g);
  const orderList=q.kind==="order"?`<ol class="nq-solution">${q.items.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>`:"";
  fb.hidden=false;fb.className=`nq-feedback ${r.ok?"ok":"bad"}`;
  fb.innerHTML=`<div class="nq-verdict">${r.ok?icon("checkCircle")+" Rigtigt":icon("xCircle")+" Ikke helt"}</div>
    ${orderList}<div class="nq-ex">${q.exHTML||q.ex||""}</div>
    <div class="nq-row">${guide?`<button class="btn" id="nqGuide">Læs: ${esc(guide.title)}</button>`:""}<span style="flex:1"></span>
    <button class="btn primary nq-next" id="nqNextBtn">${r.i+1<r.items.length?"Næste →":"Se resultat →"}</button></div>`;
  $("#nqNextBtn").onclick=()=>nqNext();
  if(guide)$("#nqGuide").onclick=()=>openGuide(guide.id);
  $("#nqNextBtn").focus({preventScroll:true});
  if(innerWidth<900)fb.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function nqShowDone(){
  const r=nqRound,ok=r.results.filter(x=>x.ok).length,n=r.results.length,pct=n?Math.round(100*ok/n):0;
  const wrong=r.results.filter(x=>!x.ok).map(x=>x.spec);
  const msg=pct===100?"Perfekt! Alt sad i skabet.":pct>=80?"Rigtig godt. Kig på de få, du missede.":pct>=50?"Godt på vej. Øv de forkerte igen.":"Det her emne trænger til en tur mere. Læs guiden og prøv igen.";
  nqBindKeys(null);
  $("#nqBody").innerHTML=`<article class="nq-card nq-done">
    <div class="nq-score"><b>${ok}</b><span>/ ${n}</span></div>
    <h2>${esc(r.title)}: ${pct}%</h2><p class="nq-lead">${msg}</p>
    <div class="nq-actions">
      ${wrong.length?`<button class="btn run" id="nqRetry">Øv de ${wrong.length} forkerte igen</button>`:""}
      <button class="btn ${wrong.length?"":"run"}" id="nqAgain">Ny runde</button>
      <button class="btn" id="nqHome">Til emner</button>
    </div>
    <ol class="nq-review">${r.results.map(x=>`<li class="${x.ok?"ok":"bad"}"><span>${icon(x.ok?"check":"x")}</span><div>${x.prompt}</div></li>`).join("")}</ol>
  </article>`;
  if(wrong.length)$("#nqRetry").onclick=()=>nqStart("retry",wrong);
  $("#nqAgain").onclick=()=>nqStart(r.mode==="retry"?"weak":r.mode);
  $("#nqHome").onclick=()=>{nqRound=null;nqShowHome()};
}

/* keyboard: 1–9 choose, Enter = next/submit */
function nqQuestionKeys(e){
  if(currentView!=="netlab"||!nqRound||nqRound.finished)return;
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;
  const r=nqRound,q=r.q;
  if(e.key==="Enter"){if(r.answered){e.preventDefault();nqNext()}else if(q.multi&&r.state.sel.size){e.preventDefault();nqSubmitMulti()}return}
  const n=Number(e.key);
  if(!r.answered&&q.options&&n>=1&&n<=q.options.length){e.preventDefault();nqPickOption(n-1)}
}
function nqBindKeys(fn){
  if(nqKeyHandler)document.removeEventListener("keydown",nqKeyHandler);
  nqKeyHandler=fn;if(fn)document.addEventListener("keydown",fn);
}
