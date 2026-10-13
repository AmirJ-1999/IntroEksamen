/* ===== Videopodcast: visuelle scener synkroniseret med lyden ===== */
/* POD_VIDEO[podcast-id] = scener. Hver scene starter ved t ("m:ss"), og dens items dukker op ved
   deres egne tidspunkter, så billedet følger forklaringen. ch = kapiteltitel. */
const PV_LAYERS=[["app","5","Application","Message"],["transport","4","Transport","Segment"],["network","3","Network","Datagram"],["link","2","Link","Frame"],["physical","1","Physical","Bits"]];
const pvT=s=>typeof s==="number"?s:String(s).split(":").reduce((a,b)=>a*60+ +b,0);

const POD_VIDEO={
p1:[
 {t:"0:00",ch:"Intro",kind:"title",kick:"Afsnit 1 · Netværk",title:"Netværkets fem lag på 50 millisekunder",sub:"Hvad sker der, fra du trykker Enter, til dr.dk står på skærmen?",items:[{t:"0:00",x:"dr.dk",k:"url"}]},
 {t:"0:05",kind:"points",kick:"Intro",title:"Det hele sker på ca. 50 millisekunder",items:[
  {t:"0:05",i:"⏱",x:"Før overskriften overhovedet dukker op på skærmen"},
  {t:"0:19",i:"🧭",x:"Pakken finder vej gennem et kæmpe netværk af kabler"},
  {t:"0:21",i:"🔤",x:"Navnet dr.dk oversættes til en IP-adresse"},
  {t:"0:24",i:"🤝",x:"Der forhandles med servere i andre lande"},
  {t:"0:28",i:"🧱",x:"Til sidst bygges hele hjemmesiden op"}]},
 {t:"0:39",kind:"points",kick:"Dagens studiesession",title:"Forstå mekanismerne, ikke en telefonbog",items:[
  {t:"0:42",i:"🎓",x:"Forberedelse til den mundtlige eksamen i Introduktion til IT-sikkerhed"},
  {t:"0:54",i:"🔍",x:"Fokus: applikationslaget og hele netværksforståelsen"},
  {t:"1:07",i:"💡",x:"Hvordan og hvorfor data bevæger sig, som den gør"}]},
 {t:"1:25",ch:"De 5 lag",kind:"stack",kick:"Fundamentet",title:"Femlagsmodellen er en arbejdsfordeling",items:[
  {t:"1:41",x:"Hvert lag har én specifik opgave"},
  {t:"1:45",x:"Lagene bygger oven på hinanden for at transportere dine data"}]},
 {t:"1:51",kind:"stack",hi:"app",kick:"Lag 5",title:"Application: her formuleres beskeden",items:[
  {t:"1:59",x:"Grænsefladen: din browser eller dit e-mailprogram"},
  {t:"2:12",k:"chip",x:"HTTP · hjemmesider"},{t:"2:14",k:"chip",x:"DNS · opslag"},{t:"2:16",k:"chip",x:"SMTP · e-mail"},{t:"2:18",k:"chip",x:"FTP · filer"},
  {t:"2:27",x:"Applikationen kan ikke selv sende over kablet. Den giver stafetten videre nedad"}]},
 {t:"2:33",kind:"stack",hi:"transport",kick:"Lag 4",title:"Transport: forbindelsen mellem programmerne",items:[
  {t:"2:41",k:"chip",x:"TCP"},{t:"2:42",k:"chip",x:"UDP"},
  {t:"2:50",x:"Etablerer forbindelsen mellem dit program og programmet på serveren"},
  {t:"2:58",x:"Afgør, hvordan dataen skal sendes"}]},
 {t:"3:02",kind:"compare",kick:"Lag 4",title:"TCP eller UDP?",cols:[{i:"🛡",n:"TCP",s:"Transmission Control Protocol",c:"transport"},{i:"⚡",n:"UDP",s:"User Datagram Protocol",c:"app"}],items:[
  {t:"3:12",c:0,x:"Opretter en fast forbindelse"},
  {t:"3:16",c:0,x:"Hakker data op i stykker og nummererer dem"},
  {t:"3:20",c:0,x:"Tjekker, at alt er modtaget i rigtig rækkefølge"},
  {t:"3:26",c:0,x:"Mangler noget? Så sendes det igen"},
  {t:"3:53",c:1,x:"Dropper papirarbejdet: ingen bekræftelser frem og tilbage"},
  {t:"4:01",c:1,x:"Pakker dataen og skyder den af sted, lynhurtigt"},
  {t:"4:05",c:1,x:"Live-fodbold: hellere en tabt pixel end en frossen video"},
  {t:"4:21",c:"b",x:"UDP = hastighed  ·  TCP = pålidelighed"}]},
 {t:"4:30",kind:"stack",hi:"network",kick:"Lag 3",title:"Network: find vej på tværs af netværk",items:[
  {t:"4:44",x:"Eneste opgave: finde vej fra afsender til den endelige destination"},
  {t:"4:55",k:"chip",x:"IP · Internet Protocol"},{t:"5:01",k:"chip",x:"IPv4 / IPv6"},
  {t:"5:08",k:"chip",x:"DHCP"},{t:"5:09",k:"chip",x:"NAT"}]},
 {t:"5:20",kind:"chat",kick:"Lag 3 · DHCP",title:"DHCP er boligadministratoren",a:["📱|Din telefon","🏢|DHCP-server i routeren"],items:[
  {t:"5:26",c:"n",x:"Ny på et WiFi-netværk: telefonen har endnu ingen IP-adresse"},
  {t:"5:31",c:0,x:"Hey! Jeg har brug for en adresse!",bc:1},
  {t:"5:37",c:1,x:"Værsgo: 192.168.1.23. Du må låne den i 24 timer"},
  {t:"5:44",c:"n",x:"Adresser udlejes dynamisk, så ingen skal taste dem ind manuelt"}]},
 {t:"5:55",kind:"nat",kick:"Lag 3 · NAT",title:"NAT er receptionisten",items:[
  {t:"6:07",x:"IPv4-adresserne er for længst løbet tør"},
  {t:"6:19",x:"Udadtil: hele husstanden har kun én offentlig IP"},
  {t:"6:30",x:"Indadtil: hver enhed har en privat adresse"},
  {t:"6:39",x:"Routeren noterer, hvilken computer der spurgte"},
  {t:"6:45",x:"Forespørgslen sendes ud under husets fælles adresse"},
  {t:"6:49",x:"Svaret slås op i noterne og sendes ind til den rigtige enhed"}]},
 {t:"7:07",kind:"stack",hi:"link",kick:"Lag 2",title:"Link: kun det næste fysiske skridt",items:[
  {t:"7:12",k:"chip",x:"MAC-adresser"},{t:"7:14",k:"chip",x:"ARP"},{t:"7:15",k:"chip",x:"Ethernet"},
  {t:"7:20",x:"IP-adressen fortæller den endelige destination"},
  {t:"7:24",x:"… men ikke, hvordan man tager det allernæste skridt"}]},
 {t:"7:29",kind:"hops",kick:"Lag 2",title:"IP er «New York» på brevet. Link er vejen til næste postcentral",items:[
  {t:"7:29",x:"IP: den endelige destination, hele vejen"},
  {t:"7:40",x:"Link: kun til den næste fysiske enhed (det næste hop)"},
  {t:"7:54",x:"MAC-adressen er brændt ind i netkortet og ændrer sig aldrig"},
  {t:"7:59",x:"IP-adressen skifter efter, hvilket netværk du er på"}]},
 {t:"8:06",kind:"chat",kick:"Lag 2 · ARP",title:"ARP: fra IP-adresse til MAC-adresse",a:["💻|Din computer","📡|Routeren 192.168.1.1"],items:[
  {t:"8:12",c:"n",x:"For at sende over WiFi skal computeren kende routerens MAC-adresse"},
  {t:"8:22",c:0,x:"Hvem har 192.168.1.1? Send mig din MAC-adresse!",bc:1},
  {t:"8:34",c:1,x:"Det er mig: a4:67:06:8d:83:a1"},
  {t:"8:36",c:"n",x:"Nu kan linklaget pakke dataen ind og sende den på første fysiske stræk"}]},
 {t:"8:43",kind:"stack",hi:"physical",kick:"Lag 1",title:"Physical: ren fysik",items:[
  {t:"8:52",x:"Ingen adresser mere, kun bits: nuller og ettaller"},
  {t:"8:55",k:"chip",x:"⚡ Strøm i kobber"},{t:"9:00",k:"chip",x:"💡 Lys i fiber"},{t:"9:01",k:"chip",x:"📶 Radio (WiFi)"}]},
 {t:"9:09",ch:"Indkapsling",kind:"encap",dir:"down",kick:"Eksamens-kerneemne",title:"Indkapsling: den russiske babushka-dukke 🪆",items:[
  {t:"9:44",x:"Message: selve dataen på applikationslaget"},
  {t:"9:55",x:"Segment: TCP sætter portnumre på"},
  {t:"10:06",x:"Datagram: IP-header med afsender- og modtager-IP"},
  {t:"10:23",x:"Frame: linklaget sætter MAC-adresser på"},
  {t:"10:35",x:"Bits: sendes på det fysiske lag"},
  {t:"10:39",x:"message → segment → datagram → frame → bits",k:"sum"}]},
 {t:"10:50",kind:"encap",dir:"up",kick:"Hos modtageren",title:"… og baglæns hos serveren",items:[
  {t:"10:54",x:"Bits samles til en frame"},
  {t:"10:58",x:"Linklaget piller MAC-adresserne af"},
  {t:"11:00",x:"Netværkslaget læser IP-adressen og fjerner den"},
  {t:"11:04",x:"Transportlaget samler segmenterne"},
  {t:"11:05",x:"Applikationen modtager den intakte message"}]},
 {t:"11:14",ch:"DNS",kind:"title",kick:"Tilbage til lag 5",title:"Applikationslaget i dybden",sub:"Men først mangler computeren IP-adressen på dr.dk",items:[{t:"11:40",x:"DNS · Domain Name System",k:"badge"}]},
 {t:"11:44",kind:"analogy",icon:"📇",from:"dr.dk",to:"192.0.2.10",kick:"DNS",title:"DNS er internettets kontaktbog",items:[
  {t:"11:55",x:"Du trykker på et navn, og telefonen ringer et skjult nummer op"},
  {t:"12:03",x:"Domænenavn (til mennesker) → IP-adresse (til maskiner)"},
  {t:"12:10",x:"Typisk UDP på port 53"}]},
 {t:"12:16",kind:"compare",kick:"DNS",title:"Hvorfor bruger DNS UDP og ikke TCP?",cols:[{i:"🐢",n:"Hvis DNS brugte TCP",c:"transport"},{i:"⚡",n:"DNS over UDP",c:"app"}],items:[
  {t:"12:35",c:0,x:"Først tre beskeder (handshake) for at oprette forbindelsen"},
  {t:"12:44",c:0,x:"… før spørgsmålet overhovedet må stilles"},
  {t:"12:50",c:1,x:"Spørgsmålet skydes af sted med det samme"},
  {t:"12:55",c:1,x:"Intet svar på en brøkdel af et sekund? Spørg bare igen"},
  {t:"12:59",c:"b",x:"Det er stadig meget hurtigere"}]},
 {t:"13:07",kind:"flow",kick:"DNS",title:"Et distribueret hierarki: skattejagten",nodes:[
   {i:"🗂",n:"Lokal cache",s:"Har vi været på dr.dk for nylig?"},
   {i:"🌍",n:"Root-server",s:"Jeg kender .dk-serveren"},
   {i:"🏷",n:"TLD-server .dk",s:"Jeg kender DR's egen server"},
   {i:"🏛",n:"Authoritative dr.dk",s:"Her er IP-adressen"}],items:[
  {t:"13:21",x:"Ikke én kæmpe server, men et hierarki med delegation",k:"note"},
  {t:"13:31"},{t:"14:01"},{t:"14:21"},{t:"14:32"},
  {t:"14:43",x:"cache → root → TLD → authoritative",k:"sum"}]},
 {t:"14:50",kind:"cards",kick:"DNS records",title:"Hvad står der i svaret?",items:[
  {t:"15:04",i:"A",x:"A-record",d:"Binder et navn direkte til en IPv4-adresse"},
  {t:"15:20",i:"CN",x:"CNAME",d:"Alias: shop.dr.dk → «slå bare dr.dk op»"},
  {t:"15:54",i:"MX",x:"MX · Mail Exchange",d:"Hvilken server modtager e-mail til domænet"},
  {t:"16:02",i:"NS",x:"NS · Nameserver",d:"Hvilke servere er autoritative for domænet"}]},
 {t:"16:15",ch:"HTTP",kind:"chat",kick:"HTTP",title:"Request og response",a:["🌐|Browser (klient)","🖥|Webserver dr.dk"],items:[
  {t:"16:21",c:"n",x:"DNS er færdig: browseren kender serverens IP-adresse"},
  {t:"16:40",c:"n",x:"HTTP: et request–response-system mellem klient og server"},
  {t:"16:51",c:0,x:"GET / HTTP/1.1\nHost: www.dr.dk",code:1},
  {t:"16:54",c:1,x:"HTTP/1.1 200 OK\n<html> … </html>",code:1}]},
 {t:"17:00",kind:"compare",kick:"HTTP-metoder",title:"GET eller POST?",cols:[{i:"📥",n:"GET",s:"hent data",c:"app"},{i:"📤",n:"POST",s:"send data",c:"link"}],items:[
  {t:"17:07",c:0,x:"Ren data-hentning: «giv mig din forside»"},
  {t:"17:13",c:0,x:"Forespørgslen står åbent i URL'en"},
  {t:"17:18",c:1,x:"Leverer data til serveren, fx brugernavn og password"},
  {t:"17:28",c:1,x:"Dataen ligger i beskedens body (payload), ikke i adresselinjen"}]},
 {t:"17:37",kind:"cards",kick:"Statuskoder",title:"Serverens svar har en statuskode",items:[
  {t:"17:43",i:"200",x:"200 OK",d:"Succes: hjemmesiden er på vej"},
  {t:"17:47",i:"404",x:"404 Not Found",d:"Serveren svarer fint, men filen findes ikke"},
  {t:"18:15",i:"!",x:"Fejlen ligger i anmodningen",d:"Ikke i forbindelsen. Serveren er ikke nede"}]},
 {t:"18:20",kind:"chat",kick:"Stateless og cookies",title:"HTTP glemmer alt, og cookien er armbåndet 🎟",a:["🌐|Browser","🛒|Webshop"],items:[
  {t:"18:48",c:"n",x:"HTTP er stateless: hvert klik er en helt ny fremmed"},
  {t:"19:09",c:1,x:"Login OK\nSet-Cookie: session=abc123",code:1},
  {t:"19:17",c:0,x:"Næste klik\nCookie: session=abc123",code:1},
  {t:"19:25",c:1,x:"Armbåndet er genkendt: velkommen tilbage!"}]},
 {t:"19:36",kind:"compare",kick:"HTTP-forbindelser",title:"Non-persistent eller persistent?",cols:[{i:"🔁",n:"Non-persistent",s:"den gamle metode",c:"link"},{i:"🚰",n:"Persistent",s:"standard i dag",c:"app"}],items:[
  {t:"20:07",c:0,x:"Nyt TCP-handshake for hver eneste fil"},
  {t:"20:19",c:0,x:"1 tekstfil + 10 billeder = 11 handshakes 🤝 × 11"},
  {t:"20:21",c:0,x:"Enorm forsinkelse"},
  {t:"20:30",c:1,x:"Ét handshake i starten 🤝 × 1"},
  {t:"20:33",c:1,x:"Forbindelsen holdes åben, og alle 11 filer går gennem samme rør"},
  {t:"20:39",c:1,x:"Fjerner masser af overflødig trafik"}]},
 {t:"20:45",ch:"SMTP og FTP",kind:"cards",kick:"Andre applikationsprotokoller",title:"SMTP og FTP",items:[
  {t:"20:58",i:"🚚",x:"SMTP · Simple Mail Transfer Protocol",d:"Skubber e-mail fra server til server · TCP port 25"},
  {t:"21:24",i:"📬",x:"IMAP / POP3",d:"Henter mailen ind i din indbakke"},
  {t:"21:37",i:"📦",x:"FTP · File Transfer Protocol",d:"Upload og download af filer mellem klient og server"}]},
 {t:"21:51",ch:"Opsummering",kind:"cards",kick:"Kernen til eksamen",title:"Fire protokoller, fire roller",items:[
  {t:"22:07",i:"📇",x:"DNS er kontaktbogen",d:"Domænenavn → IP-adresse"},
  {t:"22:14",i:"🌐",x:"HTTP er websproget",d:"Hjemmesider mellem browser og server, med GET og POST"},
  {t:"22:22",i:"🚚",x:"SMTP er postbilen",d:"E-mail mellem mailservere"},
  {t:"22:27",i:"📦",x:"FTP er flyttemanden",d:"Flytter filer på tværs af netværket"}]},
 {t:"22:34",kind:"quiz",kick:"Eksamensspørgsmål",title:"Hvad er den fundamentale forskel på DNS og HTTP?",items:[
  {t:"22:46",i:"📇",x:"DNS finder kun ud af, hvor serveren bor: adressen"},
  {t:"22:53",i:"🚪",x:"HTTP tager derhen, banker på døren og henter selve indholdet"}]},
 {t:"23:09",kind:"https",kick:"Ekstra overskud",title:"Det usynlige lag af sikkerhed: HTTPS 🔒",items:[
  {t:"23:21",x:"Uden S sendes GET, cookies og filnavne som åben tekst"},
  {t:"23:34",x:"HTTPS krypterer hele applikationslagets indhold"},
  {t:"23:45",x:"Routere og switches ser kun, hvor pakken skal hen, ikke hvad der står i den"}]},
 {t:"24:08",ch:"Afslutning",kind:"points",kick:"Husk til eksamen",title:"Held og lykke!",items:[
  {t:"24:26",i:"🗣",x:"Forklar, hvordan det virker"},
  {t:"24:29",i:"🪆",x:"Brug babushka-dukken til at forklare indkapsling"},
  {t:"24:32",i:"💪",x:"Husk, at du faktisk forstår det her"}]}
]
};

/* ---------- scene renderers: (scene, visible items, index of first new item) → HTML ---------- */
const pvNew=(i,nw)=>i>=nw?" pv-new":"";
const pvHead=s=>`<div class="pv-kick">${esc(s.kick||"")}</div><h3 class="pv-title">${esc(s.title)}</h3>`;
const pvList=(items,nw,cls="pv-points")=>`<ul class="${cls}">${items.map((it,i)=>`<li class="${pvNew(it._i,nw)}">${it.i?`<span class="pv-ico">${esc(it.i)}</span>`:""}<span>${esc(it.x)}</span></li>`).join("")}</ul>`;
const PV_RENDER={
  title(s,vis,nw){
    const url=vis.find(x=>x.k==="url"),badges=vis.filter(x=>x.k==="badge");
    return `<div class="pv-center">${s.kick?`<div class="pv-kick">${esc(s.kick)}</div>`:""}<h2 class="pv-big">${esc(s.title)}</h2>${s.sub?`<p class="pv-sub">${esc(s.sub)}</p>`:""}
      ${url?`<div class="pv-browser"><span class="pv-dots"><i></i><i></i><i></i></span><span class="pv-url">${esc(url.x)}<b class="pv-caret"></b></span><span class="pv-key">⏎ Enter</span></div>`:""}
      ${badges.map(b=>`<div class="pv-badge${pvNew(b._i,nw)}">${esc(b.x)}</div>`).join("")}</div>`;
  },
  points(s,vis,nw){return pvHead(s)+pvList(vis,nw)},
  stack(s,vis,nw){
    const chips=vis.filter(x=>x.k==="chip"),notes=vis.filter(x=>x.k!=="chip");
    return pvHead(s)+`<div class="pv-split"><div class="pv-stack">${PV_LAYERS.map(([id,n,name,pdu])=>`<div class="pv-layer l-${id}${s.hi===id?" on":""}${s.hi&&s.hi!==id?" dim":""}"><b>${n}</b><span>${name}</span><small>${pdu}</small></div>`).join("")}</div>
      <div class="pv-side">${notes.length?pvList(notes,nw):""}${chips.length?`<div class="pv-chips">${chips.map(c=>`<span class="pv-chip l-${s.hi||"app"}${pvNew(c._i,nw)}">${esc(c.x)}</span>`).join("")}</div>`:""}</div></div>`;
  },
  compare(s,vis,nw){
    const col=c=>`<div class="pv-col l-${s.cols[c].c}"><div class="pv-colhead"><span>${esc(s.cols[c].i)}</span><div><b>${esc(s.cols[c].n)}</b>${s.cols[c].s?`<small>${esc(s.cols[c].s)}</small>`:""}</div></div>${pvList(vis.filter(x=>x.c===c),nw,"pv-rows")}</div>`;
    const bottom=vis.filter(x=>x.c==="b");
    return pvHead(s)+`<div class="pv-compare">${col(0)}${col(1)}</div>${bottom.map(b=>`<div class="pv-banner${pvNew(b._i,nw)}">${esc(b.x)}</div>`).join("")}`;
  },
  chat(s,vis,nw){
    const [L,R]=s.a.map(a=>a.split("|"));
    return pvHead(s)+`<div class="pv-chat"><div class="pv-actor"><span>${L[0]}</span><b>${esc(L[1])}</b></div><div class="pv-msgs">${vis.map(m=>m.c==="n"
      ?`<div class="pv-note${pvNew(m._i,nw)}">${esc(m.x)}</div>`
      :`<div class="pv-bubble ${m.c?"r":"l"}${m.code?" code":""}${pvNew(m._i,nw)}">${m.bc?`<em>📢 broadcast</em>`:""}${esc(m.x).replace(/\n/g,"<br>")}</div>`).join("")}</div><div class="pv-actor"><span>${R[0]}</span><b>${esc(R[1])}</b></div></div>`;
  },
  flow(s,vis,nw){
    const steps=vis.filter(x=>!x.k),n=steps.length,notes=vis.filter(x=>x.k);
    return pvHead(s)+`<div class="pv-flow">${s.nodes.map((nd,i)=>`${i?`<span class="pv-arrow${i<n?" on":""}">→</span>`:""}<div class="pv-node${i<n?" on":""}${i===n-1?" cur":""}${i<n&&steps[i]._i>=nw?" pv-new":""}"><span>${nd.i}</span><b>${esc(nd.n)}</b><small>${i<n?esc(nd.s):"&nbsp;"}</small></div>`).join("")}</div>
      ${notes.map(x=>`<div class="${x.k==="sum"?"pv-banner":"pv-note"}${pvNew(x._i,nw)}">${esc(x.x)}</div>`).join("")}`;
  },
  cards(s,vis,nw){
    return pvHead(s)+`<div class="pv-cards">${vis.map(c=>`<div class="pv-card${pvNew(c._i,nw)}"><span class="pv-cardicon">${esc(c.i)}</span><b>${esc(c.x)}</b><small>${esc(c.d)}</small></div>`).join("")}</div>`;
  },
  quiz(s,vis,nw){
    return `<div class="pv-kick">${esc(s.kick)}</div><div class="pv-question">❓ ${esc(s.title)}</div>`+(vis.length?pvList(vis,nw,"pv-points pv-answer"):`<div class="pv-think">Tænk over det selv, før svaret kommer …</div>`);
  },
  analogy(s,vis,nw){
    return pvHead(s)+`<div class="pv-split"><div class="pv-analogy"><span class="pv-bigicon">${s.icon}</span><div class="pv-map"><span>${esc(s.from)}</span><i>→</i><code>${esc(s.to)}</code></div><small>(eksempel-IP)</small></div><div class="pv-side">${pvList(vis,nw)}</div></div>`;
  },
  encap(s,vis,nw){
    const k=vis.filter(x=>x.k!=="sum").length,sum=vis.find(x=>x.k==="sum");
    // down: wrapped from the inside out (1 = message … 4 = frame, then bits).
    // up: starts as bits + a full frame and is unwrapped from the outside in.
    const up=s.dir==="up";
    const L=up?[4,4,3,2,1,1][Math.min(k,5)]:Math.min(k,4),bits=up?k===0:k>=5;
    const parts=[],fresh=vis.length&&vis[vis.length-1]._i>=nw&&!up,pop=n=>fresh&&L===n?" pv-new":"";
    if(L>=4)parts.push(`<div class="pv-pk l-link${pop(4)}">Ethernet-header<small>MAC-adresser</small></div>`);
    if(L>=3)parts.push(`<div class="pv-pk l-network${pop(3)}">IP-header<small>IP-adresser</small></div>`);
    if(L>=2)parts.push(`<div class="pv-pk l-transport${pop(2)}">TCP-header<small>portnumre</small></div>`);
    if(L>=1)parts.push(`<div class="pv-pk l-app data${up&&k>=5?" glow":""}${pop(1)}">HTTP-besked<small>GET /index.html</small></div>`);
    if(L>=4)parts.push(`<div class="pv-pk l-link tail${pop(4)}">CRC</div>`);
    const pdu=["","Message","Segment","Datagram","Frame"][L];
    return pvHead(s)+`<div class="pv-encap"><div class="pv-packet">${parts.join("")||`<div class="pv-pk empty">🪆</div>`}</div>
      <div class="pv-pdu">${bits?"0100 1011 0110 0001 0111 0100 … <b>bits</b>":L?`= <b>${pdu}</b>`:"&nbsp;"}</div></div>${pvList(vis.filter(x=>x.k!=="sum"),nw,"pv-points pv-compact")}${sum?`<div class="pv-banner${pvNew(sum._i,nw)}">${esc(sum.x)}</div>`:""}`;
  },
  hops(s,vis,nw){
    const k=vis.length;
    const nodes=[["💻","Din computer"],["📡","Din router"],["🏢","Udbyder"],["🌐","…"],["🖥","Server i USA"]];
    return pvHead(s)+`<div class="pv-hops">
      <div class="pv-ipbar${k>=1?" on":""}">IP-destination: serveren i USA (hele vejen)</div>
      <div class="pv-hoprow">${nodes.map((n,i)=>`${i?`<span class="pv-hop${i===1&&k>=2?" on":""}"></span>`:""}<div class="pv-node on${(i<=1&&k>=2)?" cur":""}"><span>${n[0]}</span><b>${n[1]}</b></div>`).join("")}</div>
      <div class="pv-macbar${k>=2?" on":""}">${k>=3?"MAC-adresser: kun det næste hop":"&nbsp;"}</div></div>${pvList(vis,nw,"pv-points pv-compact")}`;
  },
  nat(s,vis,nw){
    const k=vis.length;
    return pvHead(s)+`<div class="pv-nat">
      <div class="pv-natbox"><b>🏠 Hjemmet</b>${[["💻","192.168.1.10"],["📱","192.168.1.11"],["📺","192.168.1.12"]].map((d,i)=>`<div class="pv-dev${k>=4&&i===0?" cur":""}">${d[0]} <code>${k>=3?d[1]:"?"}</code></div>`).join("")}</div>
      <span class="pv-natarrow${k>=5?" on":""}">${k>=6?"⇄":"→"}</span>
      <div class="pv-natbox router"><b>📡 Router med NAT</b>${k>=4?`<div class="pv-table"><small>NAT-tabel</small><code>192.168.1.10:5000</code><span>⇄ 203.0.113.7:40001</span></div>`:`<div class="pv-table empty"><small>NAT-tabel</small></div>`}</div>
      <span class="pv-natarrow${k>=5?" on":""}">${k>=6?"⇄":"→"}</span>
      <div class="pv-natbox"><b>🌐 Internettet</b><div class="pv-dev">offentlig IP<br><code>${k>=2?"203.0.113.7":"?"}</code></div></div>
    </div>${pvList(vis,nw,"pv-points pv-compact")}`;
  },
  https(s,vis,nw){
    const k=vis.length;
    return pvHead(s)+`<div class="pv-encap"><div class="pv-packet">
      <div class="pv-pk l-link${k>=3?" glow":""}">Ethernet<small>MAC</small></div><div class="pv-pk l-network${k>=3?" glow":""}">IP<small>hvor skal den hen?</small></div><div class="pv-pk l-transport${k>=3?" glow":""}">TCP<small>port 443</small></div>
      <div class="pv-pk l-app data${k>=2?" locked":""}">${k>=2?"🔒 8f3a c91e 77d0 …<small>krypteret</small>":"GET /netbank<small>Cookie: session=abc123</small>"}</div></div></div>${pvList(vis,nw,"pv-points pv-compact")}`;
  }
};

/* ---------- player ---------- */
function pvScenes(id){
  const sc=POD_VIDEO[id];if(!sc)return null;
  if(!sc._prepared){sc.forEach(s=>{s._t=pvT(s.t);(s.items||[]).forEach((it,i)=>{it._t=pvT(it.t);it._i=i})});sc._prepared=true}
  return sc;
}
function pvAttach(pod,p,audio){
  const scenes=pvScenes(p.id);if(!scenes)return;
  const stage=pod.querySelector(".pv-stage"),inner=stage.querySelector(".pv-scene"),chapters=pod.querySelector(".pv-chapters");
  const chs=scenes.filter(s=>s.ch);
  chapters.innerHTML=chs.map(s=>`<button class="pv-ch" data-t="${s._t}"><small>${fmt(s._t)}</small>${esc(s.ch)}</button>`).join("");
  chapters.querySelectorAll(".pv-ch").forEach(b=>b.onclick=()=>{audio.currentTime=+b.dataset.t;audio.play().catch(()=>{})});
  let cur=-1,curK=-1;
  const draw=()=>{
    const t=audio.currentTime||0;
    let si=0;for(let i=0;i<scenes.length;i++){if(scenes[i]._t<=t)si=i;else break}
    const s=scenes[si],vis=(s.items||[]).filter(it=>it._t<=t),k=vis.length;
    if(si===cur&&k===curK)return;
    const nw=si===cur?curK:Infinity;   // only items that just appeared get the pop-in animation
    inner.className=`pv-scene k-${s.kind}${si!==cur?" pv-enter":""}`;
    inner.innerHTML=PV_RENDER[s.kind](s,vis,nw);
    const chIdx=chs.filter(c=>c._t<=t).length-1;
    chapters.querySelectorAll(".pv-ch").forEach((b,i)=>b.classList.toggle("on",i===chIdx));
    cur=si;curK=k;
  };
  const playState=()=>stage.classList.toggle("unstarted",audio.paused&&(audio.currentTime||0)<0.5);
  audio.addEventListener("timeupdate",draw);audio.addEventListener("seeked",draw);
  ["play","pause","seeked"].forEach(ev=>audio.addEventListener(ev,playState));
  stage.addEventListener("click",e=>{if(e.target.closest(".pv-fs"))return;audio.paused?audio.play().catch(()=>{}):audio.pause()});
  stage.querySelector(".pv-fs").onclick=()=>{const w=pod.querySelector(".pv-wrap");document.fullscreenElement?document.exitFullscreen():w.requestFullscreen?.()};
  draw();playState();
}
