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
 {t:"11:44",kind:"analogy",icon:"📇",from:"dr.dk",to:"192.0.2.10",note:"(eksempel-IP)",kick:"DNS",title:"DNS er internettets kontaktbog",items:[
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

POD_VIDEO.p2=[
 {t:"0:00",ch:"Intro",kind:"points",kick:"Afsnit 2 · Netværk",title:"Tusindvis af pakker. Hvor skal de hen?",items:[
  {t:"0:05",i:"📦",x:"Lige nu modtager din enhed tusindvis af usynlige datapakker"},
  {t:"0:13",i:"🎧",x:"Nogle af dem er den lydfil, du hører"},
  {t:"0:17",i:"🔔",x:"Andre er en notifikation eller en kalender, der synkroniserer"},
  {t:"0:23",i:"❓",x:"Hvordan ved enheden, hvilken pakke der hører til hvad?"}]},
 {t:"0:31",kind:"title",kick:"Svaret ligger i maskinrummet",title:"Transportlagets mekanik med TCP og UDP",sub:"Mekanisk forståelse, ikke udenadslære",items:[{t:"0:38",x:"Transportlaget",k:"badge"}]},
 {t:"1:06",kind:"points",kick:"Skabelonen for hvert koncept",title:"Tre spørgsmål hver gang",items:[
  {t:"1:16",i:"❓",x:"Hvad er det?"},
  {t:"1:17",i:"⚙",x:"Hvad gør det?"},
  {t:"1:18",i:"💡",x:"Hvorfor er det overhovedet nødvendigt?"}]},
 {t:"1:33",ch:"Lagene",kind:"stack",hi:"transport",kick:"Den store sammenhæng",title:"Fem lag, der samarbejder vertikalt",items:[
  {t:"1:42",x:"Application: dine programmer, fx HTTP"},
  {t:"1:48",x:"Transport: TCP og UDP, dagens emne"},
  {t:"1:55",x:"Network: IP-adresser · Link: MAC-adresser"},
  {t:"2:01",x:"Physical: rå bits som elektriske signaler"}]},
 {t:"2:14",ch:"Indkapsling",kind:"points",kick:"Den klassiske forvirring",title:"Hvorfor har dataen så mange navne?",items:[
  {t:"2:20",i:"🏷",x:"Message, segment, datagram, frame, bits …"},
  {t:"2:32",i:"🪆",x:"Det er ikke de samme data: hvert lag pakker ind (encapsulation)"},
  {t:"3:02",i:"✉",x:"Et brev lægges i en kuvert …"},
  {t:"3:05",i:"📦",x:"… kuverten i en forsendelsesæske med fragtlabel …"},
  {t:"3:10",i:"🚢",x:"… og æsken i en stor stålcontainer"}]},
 {t:"3:14",kind:"encap",dir:"down",kick:"Indkapsling",title:"Navnet fortæller, hvilken container vi kigger på",items:[
  {t:"3:21",x:"Message på application"},
  {t:"3:23",x:"Segment på transport: TCP sætter sin header på"},
  {t:"3:33",x:"Datagram på network: IP-headeren kommer på"},
  {t:"3:37",x:"Frame på link"},
  {t:"3:40",x:"Bits på det fysiske lag"},
  {t:"3:47",x:"message → segment → datagram → frame → bits",k:"sum"}]},
 {t:"3:57",ch:"Porte og sockets",kind:"cards",kick:"Internettet er en stor by",title:"Bygning, lejlighed og dør",items:[
  {t:"4:16",i:"🏢",x:"Bygningen = IP-adressen",d:"Finder frem til selve maskinen (netværkslaget)"},
  {t:"4:41",i:"🏠",x:"Lejligheden = portnummeret",d:"Hvert program har sit eget nummer (transportlaget)"},
  {t:"4:49",i:"🚪",x:"Døren = socket",d:"Åbningen, hvor programmet sidder og lytter efter data"}]},
 {t:"5:04",kind:"mux",kick:"Mange programmer på én gang",title:"Multiplexing og demultiplexing",apps:[["🌐","Browser","443"],["🎵","Spotify","4070"],["📅","Kalender","993"]],items:[
  {t:"5:09",x:"Browserfaner, musik og spil sender og modtager samtidig"},
  {t:"5:24",x:"Multiplexing hos afsenderen: portnumre på, flettet til én strøm"},
  {t:"5:42",x:"Demultiplexing hos modtageren: sorteret efter destinationsport"},
  {t:"5:57",x:"Derfor ender lydfilen ikke i kalenderen",k:"sum"}]},
 {t:"6:01",ch:"TCP vs UDP",kind:"compare",kick:"De to brødre",title:"TCP eller UDP: hvad koster pålidelighed?",cols:[{i:"📮",n:"TCP",s:"Transmission Control Protocol",c:"transport"},{i:"🚒",n:"UDP",s:"User Datagram Protocol",c:"app"}],items:[
  {t:"6:19",c:0,x:"Garanterer, at alt ankommer i korrekt rækkefølge"},
  {t:"6:30",c:0,x:"Det koster på hastigheden"},
  {t:"6:35",c:0,x:"Tung header: mindst 20 bytes"},
  {t:"6:51",c:1,x:"Ingen forbindelse: spørger ikke, om modtageren er klar"},
  {t:"6:58",c:1,x:"Garanterer ingenting, kaster data blindt af sted"},
  {t:"7:02",c:0,x:"Anbefalet post: underskrift for hver pakke"},
  {t:"7:09",c:1,x:"En brandslange, der sprøjter pakker mod bygningen"},
  {t:"7:22",c:1,x:"Header på kun 8 bytes"},
  {t:"7:27",c:"b",x:"Hurtigt DNS-opslag? Så er UDP perfekt"}]},
 {t:"7:41",ch:"Handshake",kind:"arrows",kick:"TCP er forbindelsesorienteret",title:"Three-way handshake",a:["💻|Klient (browser)","🖥|Server"],items:[
  {t:"7:58",c:0,x:"SYN",s:"«Jeg vil gerne forbinde. Mit startnummer er x»"},
  {t:"8:13",c:1,x:"SYN + ACK",s:"«Modtaget, og her er mit eget startnummer y»"},
  {t:"8:29",c:0,x:"ACK",s:"«Jeg har også hørt dig»"},
  {t:"8:48",c:"n",x:"En lille forsinkelse, men her aftales sequence- og acknowledgement-numre"}]},
 {t:"9:00",ch:"Seq og ACK",kind:"arrows",kick:"Rækkefølge",title:"Sequence number og acknowledgement number",a:["💻|Afsender","💻|Modtager"],items:[
  {t:"9:04",c:"n",x:"Hver eneste byte får et nummer"},
  {t:"9:08",c:"n",x:"Sequence number = nummeret på den første byte i segmentet"},
  {t:"9:21",c:"n",x:"ACK number = den næste byte, modtageren forventer"},
  {t:"9:36",c:0,x:"seq = 1 · 100 bytes data",s:"bytes 1–100"},
  {t:"9:45",c:1,x:"ACK = 101",s:"«fik 1–100, næste jeg forventer er 101»"}]},
 {t:"9:56",kind:"arrows",kick:"Når netværket svigter",title:"Pakketab og retransmission",a:["💻|Afsender","💻|Modtager"],items:[
  {t:"9:57",c:0,x:"seq = 101 · 100 bytes",lost:1},
  {t:"10:00",c:"n",x:"⏱ TCP har en timer for hver afsendt pakke"},
  {t:"10:07",c:"n",x:"Intet ACK, før tiden løber ud? Så er pakken tabt"},
  {t:"10:09",c:0,x:"seq = 101 · 100 bytes",s:"retransmission"},
  {t:"10:11",c:1,x:"ACK = 201"}]},
 {t:"10:13",kind:"compare",kick:"Selective Acknowledgement",title:"Uden SACK eller med SACK?",cols:[{i:"😩",n:"Uden SACK",s:"kun hele uafbrudte blokke",c:"link"},{i:"🎯",n:"Med SACK",s:"Selective Acknowledgement",c:"app"}],items:[
  {t:"10:17",c:0,x:"Modtageren kan kun bekræfte uafbrudte blokke af bytes"},
  {t:"10:23",c:0,x:"Pakke 50 tabt: «jeg mangler 50!», selvom 51–1000 er kommet"},
  {t:"10:34",c:0,x:"Afsenderen gensender det hele: spild af netværk"},
  {t:"10:43",c:1,x:"Modtageren siger præcist, hvilket hul der mangler"},
  {t:"10:53",c:1,x:"SLE = SACK Left Edge · SRE = SACK Right Edge"},
  {t:"11:00",c:1,x:"Kanterne på data, der allerede er modtaget længere fremme"},
  {t:"11:08",c:"b",x:"Kun hullet bliver sendt igen"}]},
 {t:"11:12",ch:"Flow vs congestion",kind:"compare",kick:"To begreber, der ofte forveksles",title:"Hvem beskytter vi?",cols:[{i:"🥛",n:"Flow control",s:"vandglasset",c:"app"},{i:"🛣",n:"Congestion control",s:"motorvejen",c:"network"}],items:[
  {t:"11:32",c:0,x:"Beskytter modtageren"},
  {t:"11:37",c:0,x:"Modtagerens buffer er begrænset, som et vandglas"},
  {t:"11:43",c:0,x:"Hæld ikke hurtigere, end glasset kan rumme"},
  {t:"11:56",c:1,x:"Beskytter selve netværket mellem dem"},
  {t:"12:00",c:1,x:"Trafikprop ved en central router"},
  {t:"12:07",c:1,x:"Afsenderen tvinges til at bremse"},
  {t:"12:14",c:"b",x:"Flow control beskytter modtageren · congestion control beskytter motorvejen"}]},
 {t:"12:19",ch:"TCP-headeren",kind:"hdr",h:"tcp",kick:"Eksamen: felt for felt",title:"TCP-headeren oppefra og ned",items:[
  {t:"12:35",m:["Source port","Destination port"],x:"Porte (16 bit): lejlighedsnummeret. Ingen IP-adresser her!"},
  {t:"12:53",m:["Sequence number","Acknowledgement number"],x:"Seq og ACK (32 bit): rækkefølge og genudsendelse"},
  {t:"13:07",m:["Header length"],x:"Header length: 20–60 bytes på grund af options. Hvor starter data?"},
  {t:"13:30",m:["Flags"],x:"Flagene: seks klassiske"}]},
 {t:"13:35",kind:"cards",three:1,kick:"TCP-flag",title:"De seks klassiske flag",items:[
  {t:"13:39",i:"URG",x:"Urgent",d:"Det haster, læs det med det samme"},
  {t:"13:45",i:"ACK",x:"Acknowledgement",d:"Ack-feltet indeholder en gyldig værdi"},
  {t:"13:51",i:"PSH",x:"Push",d:"Skub data op til applikationen med det samme"},
  {t:"14:07",i:"RST",x:"Reset",d:"River forbindelsen over uden varsel"},
  {t:"14:12",i:"SYN",x:"Synchronize",d:"Starter en forbindelse (handshake)"},
  {t:"14:17",i:"FIN",x:"Finish",d:"Normal, planlagt afslutning"}]},
 {t:"14:21",kind:"compare",kick:"TCP-flag",title:"FIN eller RST?",cols:[{i:"👋",n:"FIN",s:"pæn afslutning",c:"app"},{i:"💥",n:"RST",s:"brat afbrydelse",c:"link"}],items:[
  {t:"14:24",c:0,x:"«Tak for i dag», røret lægges pænt på"},
  {t:"14:28",c:1,x:"Røret smækkes på midt i en sætning, fordi noget gik galt"},
  {t:"14:43",c:"b",x:"SYN-ACK er ikke ét flag: SYN og ACK er sat samtidig"}]},
 {t:"14:52",kind:"hdr",h:"tcp",kick:"Eksamen: felt for felt",title:"TCP-headeren: resten",items:[
  {t:"14:52",m:["Receive window"],x:"Receive window: plads i bufferen (flow control, vandglasset)"},
  {t:"15:11",m:["Checksum"],x:"Checksum: opdager fejl, men reparerer intet. Fejl = kasseres i stilhed"},
  {t:"15:27",m:["Data (payload)"],x:"Payload: selve dataene"}]},
 {t:"15:34",ch:"UDP-headeren",kind:"hdr",h:"udp",kick:"Fra cockpit til løbehjul",title:"UDP-headeren: kun fire felter",items:[
  {t:"15:44",m:["Source port","Destination port","Length","Checksum"],x:"Source port, destination port, length og checksum: 8 bytes i alt"},
  {t:"15:56",x:"Intet sequence number, intet ACK, intet window"},
  {t:"16:05",x:"Fejl i checksum: pakken slettes, og applikationen må selv rydde op"},
  {t:"16:30",m:["Length"],x:"Length = header + data (TCP's header length tæller kun headeren)"},
  {t:"16:44",x:"50 bytes data + 8 bytes header = 58 i length-feltet",k:"sum"}]},
 {t:"16:58",ch:"Eksamens-pingpong",kind:"quiz",kick:"Eksamensscenarie",title:"WiFi dør i 2 sekunder midt i en stor TCP-download. Hvorfor crasher filen ikke?",items:[
  {t:"17:31",i:"🚪",x:"Porten identificerer forbindelsen (socket'en), mens IP kun identificerer bygningen"},
  {t:"17:53",i:"🔢",x:"Seq viser, hvor dataene hører til. ACK siger «næste byte, jeg mangler, er X»"},
  {t:"18:15",i:"🥛",x:"Window size: flow control, så gensendelsen ikke drukner modtageren"},
  {t:"18:38",i:"🚒",x:"Med UDP: ingen seq og ingen retransmission, så data er tabt, medmindre appen redder det"}]},
 {t:"18:59",ch:"Afslutning",kind:"cards",kick:"Tag det med til eksamen",title:"Når du går i stå: grib analogierne",items:[
  {t:"18:59",i:"❓",x:"Hvad, hvordan, hvorfor?",d:"Hvad er det? Hvad gør det? Hvorfor findes det?"},
  {t:"19:10",i:"🥛",x:"Vandglasset",d:"Flow control"},
  {t:"19:11",i:"🛣",x:"Motorvejen",d:"Congestion control"},
  {t:"19:13",i:"🏢",x:"Bygningen og døren",d:"IP-adresse vs. port og socket"}]},
 {t:"19:37",kind:"points",kick:"Ét klik, set indefra",title:"Held og lykke ved det grønne bord",items:[
  {t:"19:37",i:"👆",x:"Dit klik knuses til en strøm af usynlige pakker"},
  {t:"19:44",i:"🏢",x:"De finder den rigtige bygning i verden (IP)"},
  {t:"19:46",i:"🚪",x:"… og den rigtige lejlighed og dør (port og socket)"},
  {t:"19:51",i:"🎼",x:"TCP dirigerer: undgår trafikkøer og sørger for, at vandglasset aldrig løber over"},
  {t:"20:12",i:"🍀",x:"Du har byggeklodserne. Held og lykke!"}]}
];

POD_VIDEO.p3=[
 {t:"0:00",ch:"Intro",kind:"quiz",kick:"Afsnit 3 · Netværk",title:"Hvad forhindrer en forvildet pakke i at køre i ring og crashe hele internettet?",items:[
  {t:"0:12",i:"🔤",x:"Svaret gemmer sig i tre bittesmå bogstaver i hver eneste pakke. Det afsløres senere"}]},
 {t:"0:25",kind:"title",kick:"Lydbog 3",title:"Bliv klar til eksamen i netværkslaget",sub:"Fra tør teori til forståelse, der trækker karakteren op",items:[{t:"0:35",x:"Netværkslaget",k:"badge"}]},
 {t:"0:48",kind:"points",kick:"Strategien",title:"Forstå logikken, så behøver du ikke huske",items:[
  {t:"0:52",i:"📋",x:"En lang liste af akronymer er ikke nok"},
  {t:"0:58",i:"🃏",x:"Udenadslære falder sammen, når eksaminator spørger til den virkelige verden"},
  {t:"1:08",i:"🛠",x:"Hvorfor er netværket bygget sådan? Hvilke problemer løste ingeniørerne?"},
  {t:"1:15",i:"💡",x:"Forstår du logikken, giver resten sig selv"}]},
 {t:"1:22",ch:"Lagene",kind:"stack",hi:"network",kick:"Konteksten",title:"Et strengt opdelt samarbejde",items:[
  {t:"1:47",x:"Application: HTTP, DNS, SMTP"},
  {t:"2:09",x:"Transport: TCP og UDP styrer samtalen mellem processerne"},
  {t:"2:33",x:"Network: IP-adresser og routing hele vejen frem"},
  {t:"2:49",x:"Link: kun næste fysiske hop (Ethernet, MAC)"},
  {t:"3:07",x:"Physical: bits som lys eller radiobølger"}]},
 {t:"3:32",ch:"Indkapsling",kind:"points",kick:"Hvorfor skifter dataen navn?",title:"Det er ikke den samme klump data længere",items:[
  {t:"3:36",i:"🏷",x:"Message, segment, datagram, frame, bits"},
  {t:"3:52",i:"➕",x:"Hvert lag tilføjer sine egne styreinformationer"},
  {t:"4:01",i:"🪆",x:"Det kaldes encapsulation, altså indkapsling"},
  {t:"4:18",i:"📦",x:"Bedre billede: at sende skrøbelig elektronik med posten"}]},
 {t:"4:24",kind:"encap",dir:"down",kick:"Indkapsling",title:"Skrøbelig elektronik med posten",items:[
  {t:"4:26",x:"Message: selve elektronikken (beskeden)"},
  {t:"4:36",x:"Segment: pakket i stødabsorberende skum (transport-header)"},
  {t:"4:50",x:"Datagram: papkasse med GPS-etiket (IP-adresser)"},
  {t:"5:03",x:"Frame: aflåst stålcontainer til den første lastbil"},
  {t:"5:18",x:"Bits: bevægelse ude på vejen"},
  {t:"5:24",x:"message → segment → datagram → frame → bits",k:"sum"}]},
 {t:"5:32",ch:"Netværkslaget",kind:"points",kick:"Lad os åbne papkassen",title:"Netværkslagets kernemission",items:[
  {t:"5:46",i:"🏷",x:"IP-adressering"},
  {t:"5:52",i:"🚚",x:"Transport af IP-datagrammer fra afsender til destination på tværs af netværk"},
  {t:"6:01",i:"🔢",x:"IPv4: adresser på præcis 32 bit"},
  {t:"6:09",i:"📡",x:"Routerne modtager, inspicerer og beslutter, hvor datagrammet skal hen"}]},
 {t:"6:19",ch:"Routing vs forwarding",kind:"compare",kick:"Dumper man, hvis man blander dem sammen",title:"Routing eller forwarding?",cols:[{i:"🗺",n:"Routing",s:"planlægningen",c:"transport"},{i:"↪",n:"Forwarding",s:"handlingen",c:"app"}],items:[
  {t:"6:40",c:0,x:"Intelligent, tidskrævende planlægning"},
  {t:"6:45",c:0,x:"Algoritmer udveksler info med andre routere og tegner kortet"},
  {t:"6:58",c:0,x:"Som Google Maps, der regner den hurtigste rute ud"},
  {t:"7:13",c:1,x:"Lynhurtig, konkret handling inde i routeren"},
  {t:"7:18",c:1,x:"Ind på port 1 → slå op i tabellen → ud af port 4"},
  {t:"7:30",c:1,x:"Tager en brøkdel af et millisekund"},
  {t:"7:32",c:"b",x:"Routing planlægger rejsen · forwarding drejer rattet"}]},
 {t:"7:41",ch:"Subnet og CIDR",kind:"cidr",ip:"192.168.1.37",prefix:24,kick:"Subnet og CIDR",title:"Hvad betyder /24?",items:[
  {t:"8:04",x:"Subnet: et lokalt net, hvor enhederne taler direkte sammen"},
  {t:"8:22",x:"/24: de første 24 af 32 bit er netværkets navn"},
  {t:"8:32",x:"Netværksdelen er by- og gadenavnet: alle på subnettet bor på samme gade"},
  {t:"8:42",x:"De sidste bit er husnummeret på den enkelte computer"}]},
 {t:"8:47",kind:"analogy",icon:"🚪",from:"anden gade",to:"default gateway",kick:"Når adressen ligger på en anden gade",title:"Default gateway: udgangsdøren til verden",items:[
  {t:"8:54",x:"Computeren kender sin egen gade (sit subnet)"},
  {t:"9:03",x:"En anden gade? Så kan pakken ikke leveres direkte"},
  {t:"9:10",x:"Den sendes til default gateway"},
  {t:"9:17",x:"Routeren i bygningen, der ved, hvordan man kommer til alle de andre gader"}]},
 {t:"9:27",ch:"IPv4-headeren",kind:"hdr",h:"ipv4",kick:"Fragtsedlen på papkassen",title:"IPv4-headeren: hvad og hvorfor",items:[
  {t:"9:51",x:"Routeren læser fragtsedlen uden at åbne pakken og læse din e-mail"},
  {t:"10:16",m:["Version"],x:"Version (4 bit): «det her er IPv4», bestemmer, hvordan resten læses"},
  {t:"10:34",m:["IHL"],x:"Header length: options gør headeren variabel, så det er bogmærket for, hvor data starter"},
  {t:"11:17",m:["Type of Service"],x:"Type of Service: prioritet, fx et live videoopkald"},
  {t:"11:29",m:["Total length"],x:"Total length: hele datagrammets størrelse"}]},
 {t:"11:34",ch:"Fragmentering",kind:"hdr",h:"ipv4",kick:"Sofaen gennem kælderdøren 🛋",title:"Fragmentering: tre felter, der arbejder sammen",items:[
  {t:"11:38",m:["Identification","Flags","Fragment offset"],x:"Identification, flags og fragment offset"},
  {t:"11:52",x:"Næste link har en lille max framestørrelse: datagrammet kan ikke komme igennem"},
  {t:"12:12",x:"Routeren hakker det op i mindre fragmenter, som man skruer benene af en sofa"},
  {t:"12:29",m:["Identification"],x:"Identification: samme ID på alle stykker af den samme sofa"},
  {t:"12:36",m:["Flags"],x:"Flags: «der er flere stykker på vej, bliv ved med at vente»"},
  {t:"12:43",m:["Fragment offset"],x:"Fragment offset: hvor stykket hører til, når de samles"}]},
 {t:"12:52",ch:"TTL",kind:"ttl",kick:"Svaret på intro-spørgsmålet",title:"TTL: Time To Live",items:[
  {t:"13:04",x:"De tre bogstaver: TTL, Time To Live"},
  {t:"13:10",x:"Uden TTL ville en pakke i et routing-loop drukne netværket"},
  {t:"13:23",x:"TTL er bare et tal, der fx starter på 64"},
  {t:"13:28",x:"Hver router trækker 1 fra: 63, 62, 61 …"},
  {t:"13:42",x:"Rammer den 0, slettes pakken med det samme"},
  {t:"13:50",x:"Pakken dør, og internettets båndbredde er reddet",k:"sum"}]},
 {t:"13:58",kind:"hdr",h:"ipv4",kick:"IPv4-headeren",title:"Protocol, checksum og adresserne",items:[
  {t:"13:58",m:["Protocol"],x:"Protocol: hvilket transportlag venter hos modtageren (TCP = 6, UDP = 17)"},
  {t:"14:24",m:["Header checksum"],x:"Header checksum: opdager støj, men kun i headeren"},
  {t:"14:44",x:"Fejl i fragtsedlen? Slet pakken, ellers kan den ende hos en forkert modtager"},
  {t:"15:03",x:"Payloaden tjekkes af transportlaget, så routeren kan være hurtig"},
  {t:"15:23",m:["Source IP address","Destination IP address"],x:"Source og destination IP: afsender og modtager"},
  {t:"15:29",m:["Data (payload)"],x:"Data: segmentet, som papkassen transporterer"}]},
 {t:"15:38",ch:"DHCP",kind:"points",kick:"Hjem ad døren",title:"Telefonen vil på WiFi, men har ingen IP",items:[
  {t:"15:48",i:"📱",x:"Uden IP-adresse kan telefonen ikke sende datagrammer"},
  {t:"15:59",i:"🏷",x:"DHCP: Dynamic Host Configuration Protocol (applikationslaget)"},
  {t:"16:09",i:"🏢",x:"DHCP-serveren sidder typisk i hjemmerouteren"},
  {t:"16:16",i:"4️⃣",x:"Fire trin, som huskes med DORA"},
  {t:"16:25",i:"🤔",x:"Paradoks: hvordan spørger man uden en adresse at spørge fra?"}]},
 {t:"16:38",kind:"arrows",kick:"DHCP",title:"DORA løser paradokset",a:["📱|Telefon (ingen IP)","🏢|DHCP-server"],items:[
  {t:"16:43",c:"n",x:"Ingen identitet og kender ikke serverens adresse: start med broadcast"},
  {t:"16:56",c:0,x:"D · Discover",s:"broadcast: «Er der en DHCP-server, der kan høre mig?»"},
  {t:"17:05",c:1,x:"O · Offer",s:"«Her er en ledig IP-adresse»"},
  {t:"17:13",c:0,x:"R · Request",s:"«Jeg tager det tilbud» (andre servere tager deres tilbage)"},
  {t:"17:49",c:1,x:"A · ACK",s:"adressen er udlejet i en lease time"},
  {t:"18:02",c:"n",x:"Plus subnetmaske, default gateway og DNS-server: hele overlevelsespakken"}]},
 {t:"18:16",ch:"NAT",kind:"nat",kick:"Network Address Translation",title:"30 enheder, én offentlig IP",items:[
  {t:"18:30",x:"30 enheder, men udbyderen giver kun én offentlig IP"},
  {t:"18:52",x:"NAT: Network Address Translation"},
  {t:"19:02",x:"Indadtil: private adresser, fx 192.168.1.10"},
  {t:"19:32",x:"Routeren noterer forespørgslen i sin NAT-tabel"},
  {t:"19:36",x:"Den private source-IP byttes ud med husstandens offentlige IP"},
  {t:"20:16",x:"Svaret slås op via portnummeret (NAT kigger op i transportlaget)"}]},
 {t:"20:50",ch:"ICMP og traceroute",kind:"points",kick:"Når noget går galt",title:"ICMP: internettets nødblus",items:[
  {t:"21:07",i:"🤐",x:"IP har ingen mekanisme til at advare afsenderen"},
  {t:"21:15",i:"🏷",x:"ICMP: Internet Control Message Protocol"},
  {t:"21:23",i:"🚨",x:"Kan destinationen ikke nås, sender routeren en ICMP-fejl tilbage til kilden"},
  {t:"21:36",i:"🏓",x:"Ping: echo request og echo reply"}]},
 {t:"21:48",kind:"trace",kick:"Traceroute",title:"Tving routerne til at afsløre sig selv",items:[
  {t:"22:15",x:"Traceroute udnytter TTL"},
  {t:"22:23",ttl:1,x:"TTL = 1"},
  {t:"22:52",x:"Nu kender du router 1's IP-adresse"},
  {t:"22:57",ttl:2,x:"TTL = 2"},
  {t:"23:05",ttl:3,x:"TTL = 3"},
  {t:"23:08",x:"Routerne tvinges én efter én til at fejle og sende et nødblus",k:"sum"}]},
 {t:"23:15",ch:"IPv6",kind:"compare",kick:"Den sidste tunge sten",title:"IPv4 eller IPv6?",cols:[{i:"4️⃣",n:"IPv4",s:"internettets ungdom",c:"network"},{i:"6️⃣",n:"IPv6",s:"fremtiden",c:"transport"}],items:[
  {t:"23:19",c:0,x:"32-bit adresser, og vi løber tør"},
  {t:"23:28",c:1,x:"128-bit adresser, så vi løber aldrig tør igen"},
  {t:"23:38",c:1,x:"Fast header på præcis 40 bytes"},
  {t:"23:47",c:0,x:"Variabel header (options), så header length skal læses først"},
  {t:"24:08",c:1,x:"Strippet for unødvendige felter: lynhurtig forwarding i hardware"},
  {t:"24:20",c:"b",x:"I IPv6 ligger alt altid på præcis samme plads"}]},
 {t:"24:23",kind:"tunnel",kick:"IPv6 møder gamle IPv4-netværk",title:"Tunneling",items:[
  {t:"24:31",x:"En ny computer sender et IPv6-datagram ud i et gammelt netværk"},
  {t:"24:42",x:"IPv6-datagrammet lægges som payload i en IPv4-papkasse"},
  {t:"24:52",x:"De gamle IPv4-routere læser kun den ydre IPv4-header"},
  {t:"25:02",x:"Ved moderne hardware pakkes det ud igen"}]},
 {t:"25:08",ch:"Faldgruber",kind:"cards",one:1,kick:"Tre klassiske faldgruber til eksamen",title:"Lynkontrol",items:[
  {t:"25:35",i:"1",x:"Routing vs forwarding?",d:"Routing: algoritmernes kortlægning af ruten. Forwarding: routeren sender pakken ud af det rigtige kabel"},
  {t:"25:58",i:"2",x:"Hvorfor header length i IPv4?",d:"Headeren kan variere pga. options. Routeren skal vide, hvor instruktionerne slutter og data starter"},
  {t:"26:24",i:"3",x:"TTL vs ARP-cachens levetid?",d:"ARP-cachen måler tid (minutter og sekunder). TTL måler hop: én ned pr. router"}]},
 {t:"26:55",ch:"Afslutning",kind:"points",kick:"Bedste råd",title:"Spørg hele tiden: hvorfor?",items:[
  {t:"26:58",i:"🚫",x:"Undgå udenadslære for enhver pris"},
  {t:"27:02",i:"❓",x:"Spørg hvorfor for hvert lag, hver protokol og hvert felt"},
  {t:"27:09",i:"💬",x:"Forstår du behovet bag fx NAT, bliver eksamenssamtalen flydende"}]},
 {t:"27:24",kind:"quiz",kick:"En tankevækker til eksamen",title:"NAT gav en utilsigtet sikkerhedsmur. Hvad sker der, når alt kører IPv6?",items:[
  {t:"27:50",i:"📺",x:"Angribere udefra kan ikke ramme dit smart-TV, for det har ingen offentlig adresse"},
  {t:"27:55",i:"🛡",x:"NAT-tabellen afviser trafik, der ikke er bedt om indefra"},
  {t:"28:10",i:"🌍",x:"Med IPv6 kan alle enheder få en unik, offentlig adresse. Tænk over det …"}]}
];

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
  /* two lifelines with arrows: items c:0 = left→right, c:1 = right→left, c:"n" = note, lost:1 = dropped */
  arrows(s,vis,nw){
    const [L,R]=s.a.map(a=>a.split("|"));
    return pvHead(s)+`<div class="pv-seq${vis.length>=6?" dense":""}"><div class="pv-seqhead"><div><span>${L[0]}</span><b>${esc(L[1])}</b></div><div><span>${R[0]}</span><b>${esc(R[1])}</b></div></div>
      <div class="pv-seqbody">${vis.map(m=>m.c==="n"
        ?`<div class="pv-note${pvNew(m._i,nw)}">${esc(m.x)}</div>`
        :`<div class="pv-msg ${m.c?"rl":"lr"}${m.lost?" lost":""}${pvNew(m._i,nw)}"><b>${esc(m.x)}</b><i></i>${m.s?`<small>${esc(m.s)}</small>`:""}</div>`).join("")}</div></div>`;
  },
  /* multiplexing: sender apps → one stream → receiver apps (k = how far the story has come) */
  mux(s,vis,nw){
    const k=vis.filter(x=>x.k!=="sum").length,sum=vis.find(x=>x.k==="sum");
    const app=(a,i,side)=>`<div class="pv-app a${i}${side==="r"&&k>=3?" on":""}"><span>${a[0]}</span><b>${esc(a[1])}</b><code>:${a[2]}</code></div>`;
    return pvHead(s)+`<div class="pv-mux">
      <div class="pv-muxcol"><small>Afsender</small>${s.apps.map((a,i)=>app(a,i,"l")).join("")}</div>
      <div class="pv-stream${k>=2?" on":""}"><small>${k>=3?"demultiplexing →":k>=2?"multiplexing →":"&nbsp;"}</small><div>${k>=2?[0,1,2,0,2,1,0].map(i=>`<span class="a${i}">:${s.apps[i][2]}</span>`).join(""):""}</div></div>
      <div class="pv-muxcol"><small>Modtager</small>${s.apps.map((a,i)=>app(a,i,"r")).join("")}</div></div>
      ${pvList(vis.filter(x=>x.k!=="sum"),nw,"pv-points pv-compact")}${sum?`<div class="pv-banner${pvNew(sum._i,nw)}">${esc(sum.x)}</div>`:""}`;
  },
  /* a real header from HEADERS; the fields named by the newest item (m) light up, earlier ones stay marked */
  hdr(s,vis,nw){
    const def=HEADERS[s.h],cur=[...vis].reverse().find(x=>x.m),now=new Set(cur?cur.m:[]),done=new Set(vis.flatMap(x=>x.m||[]));
    const cells=[];let pos=0;
    def.fields.forEach(f=>{let rem=f.b,first=true;while(rem>0){const take=Math.min(rem,32-pos);cells.push({f,span:take,cont:!first});pos=(pos+take)%32;rem-=take;first=false}});
    const sum=vis.find(x=>x.k==="sum");
    return pvHead(s)+`<div class="pv-hdr">${cells.map(c=>`<div class="pv-hf${now.has(c.f.n)?" on":done.has(c.f.n)?" done":""}${c.f.var?" var":""}" style="grid-column:span ${c.span}">${esc(c.f.n)}${c.cont?" (forts.)":""}${c.span>=8&&!c.f.var?`<small>${c.f.b} bit</small>`:""}</div>`).join("")}</div>
      ${pvList(vis.filter(x=>x.k!=="sum"),nw,"pv-points pv-compact")}${sum?`<div class="pv-banner${pvNew(sum._i,nw)}">${esc(sum.x)}</div>`:""}`;
  },
  /* an IPv4 address as 32 bits: network part (street) vs host part (house number) */
  cidr(s,vis,nw){
    const k=vis.length,P=s.prefix,oct=s.ip.split(".").map(Number);
    const bits=oct.map((o,oi)=>`<div class="pv-oct"><span>${o}</span><div>${o.toString(2).padStart(8,"0").split("").map((b,bi)=>`<i class="${k>=2?(oi*8+bi<P?"net":"host"):""}">${b}</i>`).join("")}</div></div>`).join("");
    return pvHead(s)+`<div class="pv-cidr"><div class="pv-ipline"><code>${esc(s.ip)}</code><b>/${P}</b></div><div class="pv-bits">${bits}</div>
      <div class="pv-cidrlab"><span class="net${k>=3?" on":""}" style="flex:${P}">${k>=3?`netværksdel (${P} bit): by og gade`:"&nbsp;"}</span><span class="host${k>=4?" on":""}" style="flex:${32-P}">${k>=4?"vært: husnummer":"&nbsp;"}</span></div></div>${pvList(vis,nw,"pv-points pv-compact")}`;
  },
  /* TTL counting down hop by hop until the packet is dropped */
  ttl(s,vis,nw){
    const k=vis.filter(x=>x.k!=="sum").length,sum=vis.find(x=>x.k==="sum");
    const nodes=[["💻","Afsender",64],["📡","Router",63],["📡","Router",62],["📡","Router",61],["📡","…",1],["📡","Router",0]];
    return pvHead(s)+`<div class="pv-ttl">${k>=2?`<div class="pv-loop">🔁 To fejlkonfigurerede routere sender pakken frem og tilbage</div>`:""}<div class="pv-hoprow">${nodes.map((n,i)=>{
        const show=i===0?k>=3:i<5?k>=4:k>=5,dead=i===5&&k>=5;
        return `${i?`<span class="pv-hop${show?" on":""}"></span>`:""}<div class="pv-node on${dead?" dead":""}"><span>${n[0]}</span><b>${n[1]}</b><em class="${show?"":"off"}">TTL ${show?n[2]:"?"}${dead?" ✕":""}</em></div>`}).join("")}</div></div>
      ${pvList(vis.filter(x=>x.k!=="sum"),nw,"pv-points pv-compact")}${sum?`<div class="pv-banner${pvNew(sum._i,nw)}">${esc(sum.x)}</div>`:""}`;
  },
  /* traceroute: each probe (item.ttl = n) dies at router n, which answers with ICMP */
  trace(s,vis,nw){
    const nodes=[["💻","Dig"],["📡","Router 1"],["📡","Router 2"],["📡","Router 3"],["🖥","Server"]],sum=vis.find(x=>x.k==="sum");
    const probes=vis.filter(x=>x.ttl),notes=vis.filter(x=>!x.ttl&&x.k!=="sum");
    return pvHead(s)+`<div class="pv-trace"><div class="pv-trow head">${nodes.map(n=>`<div class="pv-tnode"><span>${n[0]}</span><b>${n[1]}</b></div>`).join("")}</div>
      ${probes.map(p=>`<div class="pv-trow${pvNew(p._i,nw)}"><div class="pv-tbar" style="grid-column:1 / ${p.ttl+1}">TTL = ${p.ttl} →</div><div class="pv-tdie" style="grid-column:${p.ttl+1}">✕<small>↩ ICMP time exceeded</small></div></div>`).join("")}</div>
      ${pvList(notes,nw,"pv-points pv-compact")}${sum?`<div class="pv-banner${pvNew(sum._i,nw)}">${esc(sum.x)}</div>`:""}`;
  },
  /* tunneling: an IPv6 datagram carried as the payload of an IPv4 datagram */
  tunnel(s,vis,nw){
    const k=vis.length;
    const v6=`<div class="pv-pk l-transport">IPv6-header<small>128-bit adresser</small></div><div class="pv-pk l-app data">TCP + data<small>payload</small></div>`;
    return pvHead(s)+`<div class="pv-encap">${k>=2
        ?`<div class="pv-packet"><div class="pv-pk l-network${k>=3?" glow":""}">IPv4-header<small>${k>=3?"det eneste gamle routere læser":"ydre papkasse"}</small></div><div class="pv-inner">${v6}</div></div>`
        :`<div class="pv-packet">${v6}</div>`}
      <div class="pv-pdu">${k>=4?"moderne router: IPv4-headeren fjernes → IPv6 kører videre":k>=2?"IPv6-datagram = <b>payload</b> i et IPv4-datagram":"et moderne IPv6-datagram …"}</div></div>${pvList(vis,nw,"pv-points pv-compact")}`;
  },
  cards(s,vis,nw){
    return pvHead(s)+`<div class="pv-cards${s.three?" three":""}${s.one?" one":""}">${vis.map(c=>`<div class="pv-card${pvNew(c._i,nw)}"><span class="pv-cardicon">${esc(c.i)}</span><b>${esc(c.x)}</b><small>${esc(c.d)}</small></div>`).join("")}</div>`;
  },
  quiz(s,vis,nw){
    return `<div class="pv-kick">${esc(s.kick)}</div><div class="pv-question">❓ ${esc(s.title)}</div>`+(vis.length?pvList(vis,nw,"pv-points pv-answer"):`<div class="pv-think">Tænk over det selv, før svaret kommer …</div>`);
  },
  analogy(s,vis,nw){
    return pvHead(s)+`<div class="pv-split"><div class="pv-analogy"><span class="pv-bigicon">${s.icon}</span><div class="pv-map"><span>${esc(s.from)}</span><i>→</i><code>${esc(s.to)}</code></div>${s.note?`<small>${esc(s.note)}</small>`:""}</div><div class="pv-side">${pvList(vis,nw)}</div></div>`;
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
