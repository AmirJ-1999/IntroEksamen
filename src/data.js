/* ===== headers, frames, sequence diagrams, visuals ===== */
const HEADERS={
ipv4:{title:"IPv4-header",sub:"20–60 bytes · 32 bit pr. række · klik på et felt",note:"IPv4-headeren er <b>20 bytes</b> uden options (5 rækker × 4 bytes) og maks. 60 bytes. Klik på et felt for at se, hvad det gør, og <i>hvorfor</i> det findes.",fields:[
 {n:"Version",b:4,c:"ctl",d:"IP-versionen: 4 (binært 0100). Det første routeren læser — det afgør, hvordan resten af headeren skal tolkes."},
 {n:"IHL",b:4,c:"len",full:"Internet Header Length",d:"Headerens længde i 32-bit ord: 5 = 20 B (minimum), 15 = 60 B (maksimum). Findes kun fordi <i>options</i> gør headeren variabel — modtageren skal vide, hvor data begynder."},
 {n:"Type of Service",b:8,c:"ctl",full:"DSCP (6 bit) + ECN (2 bit)",d:"Prioritering / Quality of Service, fx at et videoopkald skal behandles før en download. ECN kan signalere congestion uden at droppe pakker."},
 {n:"Total length",b:16,c:"len",d:"Hele datagrammets længde i bytes — header + data. Maks. 65.535, i praksis ≤ link-MTU (1500 på Ethernet). Eksempel: total 1500 og IHL 5 → 1500 − 20 = 1480 B payload."},
 {n:"Identification",b:16,c:"ctl",d:"Samme værdi i alle fragmenter af ét oprindeligt datagram, så modtageren ved, hvilke stykker der hører sammen."},
 {n:"Flags",b:3,c:"ctl",d:"3 bit: reserveret (0) · <b>DF</b> = Don't Fragment · <b>MF</b> = More Fragments (1 på alle fragmenter undtagen det sidste)."},
 {n:"Fragment offset",b:13,c:"ctl",d:"Hvor fragmentets data hører til i originalen, målt i <b>enheder af 8 bytes</b>. Offset 185 betyder byte 185 × 8 = 1480. (13 bit kan ikke tælle til 65.535 — derfor ÷ 8.)"},
 {n:"TTL",b:8,c:"ctl",full:"Time To Live",d:"Antal hop tilbage. Hver router trækker 1 fra; rammer den 0, kasseres pakken, og routeren sender ICMP type 11 (Time Exceeded). Forhindrer evige loops — og er grundlaget for traceroute. Typisk start: 64 (Linux) / 128 (Windows)."},
 {n:"Protocol",b:8,c:"ctl",d:"Hvem data skal afleveres til: <b>1 = ICMP, 6 = TCP, 17 = UDP</b>. “Limen” mellem netværks- og transportlaget (som EtherType er det mellem link og netværk)."},
 {n:"Header checksum",b:16,c:"chk",d:"Fejltjek af <b>kun headeren</b>, ikke data. Skal genberegnes ved hvert hop, fordi TTL ændres. Er den forkert, kasseres datagrammet. Fjernet helt i IPv6."},
 {n:"Source IP address",b:32,c:"addr",d:"Afsenderens IPv4-adresse (32 bit = 4 bytes, fx 192.168.1.37). Ved udgående trafik omskriver NAT-routeren den til den offentlige adresse."},
 {n:"Destination IP address",b:32,c:"addr",d:"Den endelige modtagers adresse. Den er den samme hele vejen gennem nettet — det er MAC-adresserne, der skifter ved hvert hop."},
 {n:"Options",b:32,c:"opt",var:1,d:"0–40 bytes, sjældent brugt (record route, timestamp, source routing). Gør headeren variabel — derfor findes IHL."},
 {n:"Data (payload)",b:32,c:"data",var:1,d:"Typisk et TCP-segment eller UDP-datagram (eller en ICMP-besked)."}]},
tcp:{title:"TCP-header",sub:"20–60 bytes · 32 bit pr. række · klik på et felt",note:"TCP-headeren er mindst <b>20 bytes</b> (5 rækker) og maks. 60 med options. Eksamensklassiker: <i>“Hvad står der i felterne i den første pakke fra en klient til en webserver?”</i> — se guiden om TCP-headeren.",fields:[
 {n:"Source port",b:16,c:"addr",d:"Afsenderprocessens port. Hos en klient typisk en tilfældig <i>ephemeral</i> port (fx 51544)."},
 {n:"Destination port",b:16,c:"addr",d:"Modtagerprocessens port, fx 80 (HTTP), 443 (HTTPS), 22 (SSH), 25 (SMTP). Bruges til demultiplexing til den rigtige socket."},
 {n:"Sequence number",b:32,c:"ctl",d:"Nummeret på den <b>første databyte</b> i segmentet — TCP tæller bytes, ikke pakker. Startværdien (ISN) er tilfældig for at gøre forfalskning svær. SYN og FIN “bruger” hver ét sekvensnummer."},
 {n:"Acknowledgement number",b:32,c:"ctl",d:"Den <b>næste byte</b>, modtageren forventer. Kumulativ: alt før dette nummer er modtaget. Kun gyldig, når ACK-flaget er sat."},
 {n:"Header length",b:4,c:"len",full:"Data offset",d:"Headerens længde i 32-bit ord: 5 = 20 B, 15 = 60 B. Nødvendig, fordi options gør headeren variabel."},
 {n:"Reserveret",b:4,d:"Ubrugt. (Kursets slide viser “not used 6 bit” + 6 flag — de nyere CWR/ECE-flag har taget 2 af de ubrugte bit.)"},
 {n:"Flags",b:8,c:"ctl",full:"CWR ECE URG ACK PSH RST SYN FIN",d:"<b>SYN</b> opret forbindelse · <b>ACK</b> ack-feltet er gyldigt · <b>FIN</b> pæn lukning · <b>RST</b> brat afbrydelse · <b>PSH</b> aflever til appen nu · <b>URG</b> urgent data (bruges reelt ikke) · CWR/ECE til congestion-signalering. SYN-ACK er <i>ikke</i> ét flag — det er SYN og ACK sat samtidig."},
 {n:"Receive window",b:16,c:"ctl",d:"Flow control: hvor mange bytes modtageren har plads til i sin buffer lige nu (rwnd). 16 bit → maks. 65.535; window scaling-option ganger op på hurtige forbindelser."},
 {n:"Checksum",b:16,c:"chk",d:"Fejltjek af header + data (+ pseudo-header med IP-adresser). Ved fejl kasseres segmentet stille — der findes ingen NAK; afsenderen genudsender efter timeout."},
 {n:"Urgent pointer",b:16,c:"ctl",d:"Peger på slutningen af urgent data, når URG er sat. Bruges reelt ikke."},
 {n:"Options",b:32,c:"opt",var:1,d:"0–40 bytes. Typisk i SYN / SYN-ACK: <b>MSS</b> (fx 1460), <b>SACK-permitted</b>, window scale, timestamps. SACK-blokke (SLE/SRE) sendes også her senere i forbindelsen."},
 {n:"Data (payload)",b:32,c:"data",var:1,d:"Applikationsdata, fx en HTTP-request. Tom i SYN, SYN-ACK og rene ACK'er."}]},
udp:{title:"UDP-header",sub:"8 bytes · 32 bit pr. række",note:"Kun <b>8 bytes</b> og fire felter. Ingen sequence/ack/window → ingen pålidelighed og ingen flow control, men heller intet handshake og minimal overhead.",fields:[
 {n:"Source port",b:16,c:"addr",d:"Afsenderens port (kan være 0, hvis der ikke forventes svar)."},
 {n:"Destination port",b:16,c:"addr",d:"Modtagerens port, fx 53 (DNS), 67/68 (DHCP)."},
 {n:"Length",b:16,c:"len",d:"Hele datagrammet i bytes — <b>header + data</b>. Minimum 8. Sender et program 50 B data, står der 58. (Modsat TCP's header length, der kun tæller headeren.)"},
 {n:"Checksum",b:16,c:"chk",d:"One's complement-sum over header + data (+ pseudo-header). Valgfri i IPv4 (0 = ikke brugt), obligatorisk i IPv6. Fejl opdages, men rettes aldrig."},
 {n:"Data (payload)",b:32,c:"data",var:1,d:"Fx en DNS-forespørgsel."}]},
ipv6:{title:"IPv6-header",sub:"fast 40 bytes · 32 bit pr. række",note:"Fast <b>40 bytes</b>: ingen IHL, ingen header checksum og ingen fragmenteringsfelter. Alt valgfrit ligger i <i>extension headers</i>, kædet sammen via Next Header.",fields:[
 {n:"Version",b:4,c:"ctl",d:"Værdien 6."},
 {n:"Traffic class",b:8,c:"ctl",d:"Prioritet — svarer til Type of Service i IPv4."},
 {n:"Flow label",b:20,c:"ctl",d:"Mærker datagrammer i samme “flow”, så routere kan behandle dem ens (begrebet er bevidst løst defineret)."},
 {n:"Payload length",b:16,c:"len",d:"Kun længden af data efter den faste header (headeren tælles ikke med — den er altid 40 B)."},
 {n:"Next header",b:8,c:"ctl",d:"Hvad der følger: TCP (6), UDP (17), ICMPv6 (58) eller en extension header. Erstatter både protocol-feltet og options."},
 {n:"Hop limit",b:8,c:"ctl",d:"Samme funktion som TTL — nyt navn, fordi den altid har talt hop og aldrig sekunder."},
 {n:"Source address",b:128,c:"addr",d:"128 bit = 16 bytes, fx 2001:db8::8a2e:370:7334 (8 grupper hex; én stribe nul-grupper kan forkortes ::)."},
 {n:"Destination address",b:128,c:"addr",d:"Modtagerens 128-bit adresse."},
 {n:"Data / extension headers",b:32,c:"data",var:1,d:"Evt. extension headers (fx fragmentering, som kun afsenderen må lave) og derefter payload."}]},
icmp:{title:"ICMP-besked",sub:"8 bytes header · ligger i IP (protocol = 1)",note:"ICMP bruges til fejlrapportering og signalering på netværkslaget. Headeren er 8 bytes.",fields:[
 {n:"Type",b:8,c:"ctl",d:"Beskedtype: <b>8</b> echo request (ping) · <b>0</b> echo reply · <b>3</b> destination unreachable · <b>11</b> time exceeded (traceroute)."},
 {n:"Code",b:8,c:"ctl",d:"Underkode: type 3 code 3 = port unreachable (traceroute-stop) · type 11 code 0 = TTL expired."},
 {n:"Checksum",b:16,c:"chk",d:"Fejltjek af ICMP-beskeden."},
 {n:"Typeafhængigt felt",b:32,d:"Ved echo: identifier (16 bit) + sequence number (16 bit), så svar kan matches til forespørgsler."},
 {n:"Data",b:32,c:"data",var:1,d:"Ved fejlbeskeder: IP-headeren + de første 8 bytes af det datagram, der udløste fejlen — nok til at se portnumrene. Ved ping: valgfri data."}]},
dns:{title:"DNS-besked",sub:"12 bytes header · UDP port 53",note:"DNS-headeren er <b>12 bytes</b> = 6 felter à 16 bit. Query og reply bruger samme format.",fields:[
 {n:"Identification",b:16,c:"ctl",d:"16-bit transaction ID. Svaret genbruger forespørgslens ID, så klienten kan matche dem. (Kun 65.536 muligheder → grundlag for cache poisoning-angreb.)"},
 {n:"Flags",b:16,c:"ctl",d:"Query/reply · recursion desired · recursion available · authoritative answer m.fl."},
 {n:"# questions",b:16,c:"len",d:"Antal spørgsmål i questions-sektionen."},
 {n:"# answer RRs",b:16,c:"len",d:"Antal resource records i svaret."},
 {n:"# authority RRs",b:16,c:"len",d:"Antal records om autoritative servere."},
 {n:"# additional RRs",b:16,c:"len",d:"Antal ekstra “hjælpsomme” records."},
 {n:"Questions",b:32,c:"data",var:1,d:"Navn og type, der spørges om, fx (www.dr.dk, A)."},
 {n:"Answers",b:32,c:"data",var:1,d:"Resource records (name, value, type, ttl) med svaret."},
 {n:"Authority",b:32,c:"data",var:1,d:"Records for autoritative servere (NS)."},
 {n:"Additional info",b:32,c:"data",var:1,d:"Fx A-recorden for en NS-server, så klienten slipper for et ekstra opslag."}]},
arp:{title:"ARP-pakke (IPv4 over Ethernet)",sub:"28 bytes · ligger direkte i en Ethernet-frame (EtherType 0x0806)",note:"ARP ligger <b>ikke</b> i IP — den sendes direkte i en Ethernet-frame. Klik på felterne.",fields:[
 {n:"Hardware type",b:16,c:"ctl",d:"1 = Ethernet."},
 {n:"Protocol type",b:16,c:"ctl",d:"0x0800 = IPv4."},
 {n:"HLEN",b:8,c:"len",d:"Længde af hardwareadressen: 6 (MAC)."},
 {n:"PLEN",b:8,c:"len",d:"Længde af protokoladressen: 4 (IPv4)."},
 {n:"Operation",b:16,c:"ctl",d:"1 = request, 2 = reply."},
 {n:"Sender MAC",b:48,c:"addr",d:"Afsenderens MAC. Modtageren kan straks gemme afsenderen i sin ARP-cache."},
 {n:"Sender IP",b:32,c:"addr",d:"Afsenderens IPv4-adresse."},
 {n:"Target MAC",b:48,c:"addr",d:"I en request: 00:00:00:00:00:00 — det er netop den, vi spørger efter. (Selve framen sendes til broadcast FF:FF:FF:FF:FF:FF.)"},
 {n:"Target IP",b:32,c:"addr",d:"IP-adressen, vi vil kende MAC-adressen for."}]}
};
const FRAMES={ethernet:{title:"Ethernet-frame",sub:"klik på et felt · bredder er ikke målfaste",note:"Header = <b>14 B</b> (dst 6 + src 6 + type 2) plus 4 B CRC bagerst. Frame uden preamble: 64–1518 B. Wireshark viser normalt hverken preamble eller CRC (netkortet fjerner dem).",fields:[
 {n:"Preamble",size:"7 B",w:1.3,c:"x",d:"7 × 10101010 — synkroniserer modtagerens ur med afsenderens."},
 {n:"SFD",size:"1 B",w:.7,c:"x",d:"Start Frame Delimiter: 10101011 — “nu starter framen”."},
 {n:"Destination MAC",size:"6 B",w:1.7,c:"addr",d:"Hvem på det lokale link der skal have framen. FF:FF:FF:FF:FF:FF = broadcast (fx ARP request). Netkortet dropper frames, der ikke er til det selv."},
 {n:"Source MAC",size:"6 B",w:1.7,c:"addr",d:"Afsenderens MAC. Switchen lærer herfra, hvilken port afsenderen sidder på (self-learning)."},
 {n:"Type",size:"2 B",w:1,c:"ctl",d:"EtherType: hvilken protokol data indeholder. <b>0x0800 IPv4 · 0x0806 ARP · 0x86DD IPv6</b>. Demultiplexing — ikke fejltjek."},
 {n:"Data (payload)",size:"46–1500 B",w:4.2,c:"data",d:"Typisk et IP-datagram. Maks. 1500 B = MTU. Under 46 B fyldes op med padding."},
 {n:"CRC (FCS)",size:"4 B",w:1,c:"chk",d:"Cyclic Redundancy Check. Modtageren regner efter; ved fejl <b>droppes framen stille</b>. Ethernet sender ingen ACK — det er op til TCP at opdage tabet."}]}};

const SEQS={
handshake:{title:"TCP three-way handshake",actors:["Klient","Server"],sub:["port 51544 (ephemeral)","port 80 · LISTEN"],msgs:[
 {f:0,t:1,l:"SYN   seq = x",s:"flags: SYN · options: MSS, SACK-permitted"},
 {f:1,t:0,l:"SYN-ACK   seq = y, ack = x+1",s:"SYN- og ACK-flag sat samtidig"},
 {f:0,t:1,l:"ACK   ack = y+1",s:"serveren svarer ikke på denne"},
 {note:"ESTABLISHED — data kan flyde begge veje",cls:"sv-box-green"}],caption:"+1 fordi SYN “bruger” ét sekvensnummer. x og y er tilfældige startnumre (ISN)."},
teardown:{title:"TCP lukning",actors:["Klient","Server"],msgs:[
 {f:0,t:1,l:"FIN",s:"“jeg har ikke mere at sende”"},{f:1,t:0,l:"ACK"},{f:1,t:0,l:"FIN",s:"serveren er også færdig"},{f:0,t:1,l:"ACK"},
 {note:"TIME_WAIT (2 × MSL)",at:0,side:"c",w:150}],caption:"Fire beskeder, fordi hver retning lukkes for sig (full duplex). RST afbryder derimod brat."},
seqack:{title:"Seq og ACK (telnet-eksemplet)",actors:["Host A","Host B"],msgs:[
 {f:0,t:1,l:"Seq=42, ACK=79, data='C'",s:"brugeren taster 'C' (1 byte)"},
 {f:1,t:0,l:"Seq=79, ACK=43, data='C'",s:"B kvitterer (42+1) og ekkoer 'C'"},
 {f:0,t:1,l:"Seq=43, ACK=80",s:"A kvitterer for ekkoet (79+1)"}],caption:"ACK = modpartens seq + antal modtagne bytes. Kvitteringen kan “piggybacke” på data i modsat retning."},
sack:{title:"Pakketab MED SACK",actors:["Afsender","Modtager"],msgs:[
 {f:0,t:1,l:"SEQ 29 (28 B)"},{f:1,t:0,l:"ACK 57"},
 {f:0,t:1,l:"SEQ 57 (28 B)",lost:1},
 {f:0,t:1,l:"SEQ 85 (7 B)",s:"ankommer out-of-order → buffres"},
 {f:1,t:0,l:"ACK 57 · SACK SLE 85, SRE 92",s:"“alt til 57 OK — og 85–92 ligger i min buffer”"},
 {f:0,t:1,l:"SEQ 57 (28 B)",s:"kun hullet 57–85 genudsendes",blue:1},
 {f:1,t:0,l:"ACK 92",s:"kumulativ: hullet er lukket"}],caption:"Svarer til SACK.pcap pakke 19–23 fra Network 2. SACK aftales med SACK-permitted i SYN/SYN-ACK."},
nosack:{title:"Pakketab UDEN SACK",actors:["Afsender","Modtager"],msgs:[
 {f:0,t:1,l:"SEQ 57",lost:1},
 {f:0,t:1,l:"SEQ 85",s:"out-of-order → kasseres"},{f:1,t:0,l:"ACK 57",s:"duplicate ACK"},
 {f:0,t:1,l:"SEQ 92",s:"kasseres"},{f:1,t:0,l:"ACK 57",s:"duplicate ACK"},
 {note:"timeout (eller 3 dup-ACKs → fast retransmit)",at:0,side:"r",w:280},
 {f:0,t:1,l:"SEQ 57",blue:1},{f:0,t:1,l:"SEQ 85",blue:1,s:"sendes igen"},{f:0,t:1,l:"SEQ 92",blue:1,s:"sendes igen"},
 {f:1,t:0,l:"ACK 99"}],caption:"Uden SACK (kursets “legacy mode”) kasseres out-of-order data, så resten af vinduet må sendes igen — Go-Back-N-agtigt."},
http:{title:"Hent en webside (persistent HTTP)",actors:["Browser","Webserver"],sub:["klient","port 80"],msgs:[
 {f:0,t:1,l:"SYN"},{f:1,t:0,l:"SYN-ACK"},{f:0,t:1,l:"ACK",s:"TCP-forbindelse: 1 RTT"},
 {f:0,t:1,l:"GET /index.html HTTP/1.1",blue:1,s:"Host: www.kallas.dk"},
 {f:1,t:0,l:"HTTP/1.1 200 OK + HTML",blue:1,s:"Content-Type: text/html"},
 {f:0,t:1,l:"GET /logo.png",blue:1,s:"samme TCP-forbindelse (persistent)"},
 {f:1,t:0,l:"200 OK + billede",blue:1}],caption:"Non-persistent HTTP (1.0) ville lukke og genåbne TCP for hvert objekt: 2 RTT pr. objekt."},
dnsiter:{title:"DNS-opslag: rekursivt til lokal DNS, iterativt ud i hierarkiet",actors:["Host","Lokal DNS","Root","TLD (.dk)","Authoritative"],colW:150,left:70,colors:["sv-box-blue","sv-box-teal","sv-box-gold","sv-box-gold","sv-box-gold"],msgs:[
 {f:0,t:1,l:"1. www.dr.dk ?",s:"rekursiv forespørgsel"},
 {f:1,t:2,l:"2. www.dr.dk ?"},{f:2,t:1,l:"3. spørg .dk-TLD",s:"henvisning (iterativ)"},
 {f:1,t:3,l:"4. www.dr.dk ?"},{f:3,t:1,l:"5. spørg dr.dk's server",s:"henvisning (NS + A)"},
 {f:1,t:4,l:"6. www.dr.dk ?"},{f:4,t:1,l:"7. A-record: IP",s:"det endelige svar"},
 {f:1,t:0,l:"8. svar",s:"lokal DNS cacher svaret i TTL"}],caption:"Alt sammen typisk over UDP port 53. Ligger svaret i cachen, springes trin 2–7 over."},
dora:{title:"DHCP: DORA",actors:["DHCP-klient","DHCP-server"],sub:["ingen IP endnu · UDP 68","fx hjemmerouteren · UDP 67"],msgs:[
 {f:0,t:1,l:"1. DHCP Discover",s:"0.0.0.0:68 → 255.255.255.255:67 (broadcast)"},
 {f:1,t:0,l:"2. DHCP Offer",s:"tilbud: IP, subnetmaske, gateway, DNS, lease time"},
 {f:0,t:1,l:"3. DHCP Request",s:"broadcast: “jeg tager dét tilbud” (andre servere hører det)"},
 {f:1,t:0,l:"4. DHCP ACK",s:"bekræftet — først nu må adressen bruges"},
 {note:"Klienten har nu IP, maske, default gateway, DNS og lease",cls:"sv-box-green"}],caption:"Broadcast, fordi klienten hverken har en adresse eller kender serverens. Derfor UDP — broadcast virker ikke over TCP."},
arp:{title:"ARP request og reply",actors:["Host A","Andre på LAN","Router / Host B"],sub:["192.168.1.37","","192.168.1.1"],msgs:[
 {f:0,t:1,l:"ARP request",s:"til FF:FF:FF:FF:FF:FF (broadcast)"},
 {f:0,t:2,l:"“Hvem har 192.168.1.1? Svar 192.168.1.37”",same:1,dy:30},
 {note:"ignorerer (ikke deres IP)",at:1,side:"c",w:170},
 {f:2,t:0,l:"ARP reply (unicast)",s:"“192.168.1.1 er aa:bb:cc:dd:ee:ff”"},
 {note:"A gemmer IP ↔ MAC i ARP-cachen (~20 min)",at:0,side:"r",w:270,cls:"sv-box-green"}],caption:"Request = broadcast (A kender ikke MAC'en). Reply = unicast (B kender nu A's MAC fra requesten)."},
traceroute:{title:"Traceroute: stigende TTL",actors:["Kilde","Router 1","Router 2","Destination"],colW:160,msgs:[
 {f:0,t:1,l:"UDP, TTL = 1"},{f:1,t:0,l:"ICMP type 11, code 0",s:"“TTL udløb hos mig” → afslører Router 1",blue:1},
 {f:0,t:2,l:"UDP, TTL = 2",s:"overlever router 1, dør hos router 2"},{f:2,t:0,l:"ICMP type 11, code 0",blue:1},
 {f:0,t:3,l:"UDP, TTL = 3 → usandsynlig port"},{f:3,t:0,l:"ICMP type 3, code 3",s:"Port Unreachable → destinationen nået, stop",blue:1}],caption:"Linux/macOS bruger UDP-probes (3 pr. TTL). Windows' tracert bruger ICMP echo request og stopper ved echo reply."},
rtscts:{title:"RTS/CTS løser hidden terminal",actors:["Station A","Access point","Station C"],sub:["kan ikke høre C","hører begge","kan ikke høre A"],msgs:[
 {f:0,t:1,l:"RTS (varighed)",s:"“må jeg sende i X µs?”"},
 {f:1,t:0,l:"CTS"},{f:1,t:2,l:"CTS",same:1},
 {note:"C hører CTS → holder sig tavs i den reserverede tid",at:2,side:"l",w:320},
 {f:0,t:1,l:"DATA (stor frame)",blue:1},
 {f:1,t:0,l:"ACK",s:"link-layer ACK"}],caption:"Kollisioner kan kun ske mellem de små RTS-frames — ikke mellem store datatransmissioner."},
smtp:{title:"SMTP-dialog (TCP port 25)",actors:["crepes.fr (klient)","hamburger.edu (server)"],rowH:34,colW:300,msgs:[
 {f:1,t:0,l:"220 hamburger.edu",flat:1},{f:0,t:1,l:"HELO crepes.fr",flat:1,blue:1},{f:1,t:0,l:"250 Hello crepes.fr",flat:1},
 {f:0,t:1,l:"MAIL FROM: <alice@crepes.fr>",flat:1,blue:1},{f:1,t:0,l:"250 Sender ok",flat:1},
 {f:0,t:1,l:"RCPT TO: <bob@hamburger.edu>",flat:1,blue:1},{f:1,t:0,l:"250 Recipient ok",flat:1},
 {f:0,t:1,l:"DATA",flat:1,blue:1},{f:1,t:0,l:"354 Enter mail, end with \".\"",flat:1},
 {f:0,t:1,l:"Do you like ketchup? … .",flat:1,blue:1},{f:1,t:0,l:"250 Message accepted",flat:1},
 {f:0,t:1,l:"QUIT",flat:1,blue:1},{f:1,t:0,l:"221 closing connection",flat:1}],caption:"Tre faser: handshaking (220/HELO) → transfer (MAIL FROM … DATA) → closure (QUIT). Beskeden slutter med CRLF.CRLF."},
socktcp:{title:"TCP-sockets i Python",actors:["TCP-server","TCP-klient"],sub:["SOCK_STREAM","SOCK_STREAM"],colW:330,left:150,msgs:[
 {f:0,t:0,l:"socket(AF_INET, SOCK_STREAM)"},{f:0,t:0,l:"bind(('', 15000))"},{f:0,t:0,l:"listen(1)"},{f:0,t:0,l:"accept()  — venter …"},
 {f:1,t:1,l:"socket(AF_INET, SOCK_STREAM)"},
 {f:1,t:0,l:"connect((host, 15000))",s:"→ SYN / SYN-ACK / ACK; accept() returnerer en NY socket"},
 {f:1,t:0,l:"send(msg.encode())",blue:1},{f:0,t:0,l:"recv(2048).decode().upper()"},
 {f:0,t:1,l:"send(svar.encode())",blue:1},{f:1,t:1,l:"recv(2048) · close()"},{f:0,t:0,l:"connection_socket.close()"}],caption:"Serveren har to sockets: velkomst-socketen (bind/listen/accept) og forbindelses-socketen fra accept()."},
sockudp:{title:"UDP-sockets i Python",actors:["UDP-server","UDP-klient"],sub:["SOCK_DGRAM","SOCK_DGRAM"],colW:330,left:150,msgs:[
 {f:0,t:0,l:"socket(AF_INET, SOCK_DGRAM)"},{f:0,t:0,l:"bind(('', 12000))"},{f:0,t:0,l:"recvfrom(2048) — venter …"},
 {f:1,t:1,l:"socket(AF_INET, SOCK_DGRAM)"},
 {f:1,t:0,l:"sendto(msg.encode(), (host, 12000))",s:"intet handshake — data sendes med det samme",blue:1},
 {f:0,t:0,l:"data, addr = recvfrom(2048)"},
 {f:0,t:1,l:"sendto(svar.encode(), addr)",blue:1},{f:1,t:1,l:"recvfrom(2048) · close()"}],caption:"Ingen listen/accept/connect. Adressen skal med ved hver sendto(); serveren får klientens adresse fra recvfrom()."}
};

const STACK=[
 {n:5,name:"Application",pdu:"message",enc:`<span class="e-data">GET /index.html HTTP/1.1</span>`,job:"understøtter netværksapplikationer — det, brugeren og programmerne “taler”.",proto:"HTTP, DNS, SMTP, FTP, DHCP",addr:"URL / domænenavn",dev:"værter (browser, server)"},
 {n:4,name:"Transport",pdu:"segment (TCP) / datagram (UDP)",enc:`<span class="e-t">TCP-hdr</span><span class="e-data">message</span>`,job:"proces-til-proces: leverer data til den rigtige socket via portnumre; TCP giver pålidelighed.",proto:"TCP, UDP (QUIC ovenpå UDP)",addr:"portnummer (16 bit)",dev:"værter"},
 {n:3,name:"Network",pdu:"datagram",enc:`<span class="e-n">IP-hdr</span><span class="e-t">TCP</span><span class="e-data">message</span>`,job:"host-til-host på tværs af netværk: adressering og routing.",proto:"IPv4, IPv6, ICMP",addr:"IP-adresse (32/128 bit)",dev:"router"},
 {n:2,name:"Link",pdu:"frame",enc:`<span class="e-l">Eth-hdr</span><span class="e-n">IP</span><span class="e-t">TCP</span><span class="e-data">message</span><span class="e-l">CRC</span>`,job:"næste hop: flytter framen mellem to naboknuder på samme link.",proto:"Ethernet, 802.11 (WiFi), ARP",addr:"MAC-adresse (48 bit)",dev:"switch, access point"},
 {n:1,name:"Physical",pdu:"bits",enc:`<span class="e-p">10110010 01101001 11010…</span>`,job:"bits som signaler: strøm i kobber, lys i fiber, radiobølger.",proto:"kabler, fiber, radio",addr:"—",dev:"kabel, hub, antenne"}];

const addrTable=rows=>`<table class="g-table"><tr><th>Lag</th><th>Kilde</th><th>Destination</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table>`;
const DAYLIFE=[
 {short:"DHCP",title:"Laptoppen får en IP-adresse (DHCP)",html:`<p>Du åbner laptoppen på skolens WiFi. Den har ingen IP endnu, så den broadcaster en <b>DHCP Discover</b> (UDP 68 → 67). Efter DORA kender den: egen IP <code>10.0.0.37/24</code>, default gateway <code>10.0.0.1</code>, DNS-server <code>10.0.0.53</code> og lease time.</p>${addrTable([["Transport","UDP 68","UDP 67"],["Network","0.0.0.0","255.255.255.255 (broadcast)"],["Link","laptoppens MAC","FF:FF:FF:FF:FF:FF"]])}<div class="g-box exam"><b class="t">Pointe</b><p>Alt efterfølgende afhænger af det, DHCP leverede: gateway og DNS-server.</p></div>`},
 {short:"ARP",title:"Find gatewayens MAC-adresse (ARP)",html:`<p>DNS-serveren og webserveren ligger uden for eget subnet (subnetmasken afgør det), så alt skal via <b>default gateway</b>. Laptoppen kender gatewayens IP, men framen skal have en <b>MAC</b>. ARP request (broadcast): <i>“Hvem har 10.0.0.1?”</i> — routeren svarer unicast med sin MAC, som caches.</p>${addrTable([["Link (request)","laptoppens MAC","FF:FF:FF:FF:FF:FF"],["Link (reply)","routerens MAC","laptoppens MAC"]])}`},
 {short:"DNS",title:"Slå www.kallas.dk op (DNS)",html:`<p>Browseren skal bruge en IP. Den sender en DNS-forespørgsel (A-record) til den lokale DNS-server over <b>UDP port 53</b>. Lokal DNS spørger evt. root → TLD (.dk) → authoritative og svarer med IP-adressen.</p>${addrTable([["Transport","UDP 51000 (ephemeral)","UDP 53"],["Network","10.0.0.37","10.0.0.53"],["Link (første hop)","laptoppens MAC","gatewayens MAC (fra ARP)"]])}<p>Bemærk: IP-destinationen er DNS-serveren, men MAC-destinationen er gatewayen — MAC'en skifter ved hvert hop, IP'en gør ikke.</p>`},
 {short:"TCP",title:"Åbn en TCP-forbindelse (three-way handshake)",html:`<p>Med serverens IP åbner browseren en TCP-forbindelse til port 80: <b>SYN → SYN-ACK → ACK</b>. SYN'et har tilfældig ISN og options som MSS og SACK-permitted.</p>${addrTable([["Transport","TCP 51544 (ephemeral)","TCP 80"],["Network","10.0.0.37 → (NAT) offentlig IP","webserverens IP"],["Link","skifter ved hvert hop","skifter ved hvert hop"]])}<p>Ved hjemmeroutere omskriver <b>NAT</b> kilde-IP og -port til den offentlige adresse og husker oversættelsen i NAT-tabellen.</p>`},
 {short:"HTTP",title:"Send HTTP GET og modtag 200 OK",html:`<p>Over den etablerede forbindelse sendes <code>GET /index.html HTTP/1.1</code> med <code>Host:</code>-header. Serveren svarer <code>HTTP/1.1 200 OK</code> med HTML i body. Store svar deles i flere TCP-segmenter (MSS ≈ 1460 B), som hver kvitteres med ACK.</p><pre><code>GET /index.html HTTP/1.1\\r\\n\nHost: www.kallas.dk\\r\\n\n\\r\\n</code></pre>`},
 {short:"Render",title:"Siden vises — og forbindelsen genbruges",html:`<p>HTML'en refererer til billeder og CSS. Med <b>persistent HTTP</b> hentes de over samme TCP-forbindelse. Når siden er færdig, lukkes forbindelsen med <b>FIN/ACK</b> (eller efter timeout).</p><div class="g-box exam"><b class="t">Brug det til eksamen</b><p>Uanset hvilket lag Dany vælger, kan du placere det i denne kæde: <i>“Når jeg åbner en webside, sker der … på mit lag”</i>. Det viser, at du forstår lagene som et samarbejde, ikke som fem separate kapitler.</p></div>`}];

const svg=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${body}</svg>`;
const ah=(id,cls)=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="${cls||"sv-head"}"/></marker></defs>`;
const box=(x,y,w,h,cls,t,sub)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="${cls}"/><text x="${x+w/2}" y="${y+h/2+(sub?-2:4)}" text-anchor="middle" class="sv-text sv-bold">${t}</text>${sub?`<text x="${x+w/2}" y="${y+h/2+13}" text-anchor="middle" class="sv-small">${sub}</text>`:""}`;
const arr=(x1,y1,x2,y2,id,cls)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls||"sv-arrow"}" marker-end="url(#${id})"/>`;
const SVGS={
 dnstree:{caption:"DNS er et distribueret hierarki — ingen enkelt server kender alt.",svg:svg(700,250,ah("dt")+
  box(290,14,120,40,"sv-box-gold","Root","13 logiske (a–m)")+
  [[60,".com"],[230,".dk"],[400,".org"],[570,".edu"]].map(([x,t])=>box(x,104,90,38,"sv-box-teal",t,"TLD")+arr(350,54,x+45,102,"dt","sv-line")).join("")+
  [[10,"amazon.com"],[120,"google.com"],[200,"dr.dk"],[290,"kea.dk"]].map(([x,t],i)=>box(x,196,i<2?100:80,38,"sv-box-blue",t,"authoritative")+arr(i<2?105:275,142,x+(i<2?50:40),194,"dt","sv-line")).join("")+
  `<text x="520" y="215" class="sv-muted">Lokal DNS (ISP/skole) står uden for</text><text x="520" y="230" class="sv-muted">hierarkiet og cacher svar.</text>`)},
 nat:{caption:"NAT/PAT: hele hjemmet deler én offentlig IP. Routeren skelner sessionerne på portnummeret.",svg:svg(760,250,ah("na")+
  `<rect x="10" y="20" width="250" height="210" rx="14" class="sv-range"/><text x="20" y="40" class="sv-muted">Privat LAN 10.0.0.0/24</text>`+
  box(30,60,200,44,"sv-box-blue","10.0.0.1:3345","laptop")+box(30,130,200,44,"sv-box-blue","10.0.0.2:4127","telefon")+
  box(300,90,140,60,"sv-box-gold","NAT-router","LAN 10.0.0.4 · WAN 138.76.29.7")+
  box(560,90,190,60,"sv-box-teal","128.119.40.186:80","webserver")+
  arr(230,82,298,112,"na")+arr(230,152,298,128,"na")+arr(440,120,558,120,"na")+
  `<text x="450" y="108" class="sv-small">src 138.76.29.7:5001</text><text x="450" y="140" class="sv-small">src 138.76.29.7:5002</text>`+
  `<rect x="300" y="168" width="250" height="66" rx="8" class="sv-box"/><text x="310" y="186" class="sv-small sv-bold">NAT-tabel  WAN-side → LAN-side</text><text x="310" y="204" class="sv-text" style="font-size:11px">138.76.29.7:5001 → 10.0.0.1:3345</text><text x="310" y="222" class="sv-text" style="font-size:11px">138.76.29.7:5002 → 10.0.0.2:4127</text>`)},
 hidden:{caption:"Hidden terminal: A og C er begge inden for AP'ens rækkevidde, men ikke hinandens.",svg:svg(620,230,
  `<ellipse cx="200" cy="115" rx="175" ry="95" class="sv-range"/><ellipse cx="420" cy="115" rx="175" ry="95" class="sv-range2"/>`+
  `<circle cx="130" cy="115" r="24" class="sv-box-blue"/><text x="130" y="120" text-anchor="middle" class="sv-text sv-bold">A</text>`+
  `<circle cx="310" cy="115" r="26" class="sv-box-gold"/><text x="310" y="120" text-anchor="middle" class="sv-text sv-bold">AP</text>`+
  `<circle cx="490" cy="115" r="24" class="sv-box-blue"/><text x="490" y="120" text-anchor="middle" class="sv-text sv-bold">C</text>`+
  `<text x="80" y="40" class="sv-muted">A's rækkevidde</text><text x="440" y="40" class="sv-muted">C's rækkevidde</text>`+
  `<text x="310" y="170" text-anchor="middle" style="fill:var(--red);font:bold 13px Inter,sans-serif">✕ kollision ved AP</text><text x="310" y="200" text-anchor="middle" class="sv-small">A og C lytter (CSMA), hører ikke hinanden → begge sender</text>`)},
 aimd:{caption:"AIMD-savtakken: +1 MSS pr. RTT, halvering ved tab.",svg:svg(640,230,ah("ai")+
  `<line x1="50" y1="200" x2="620" y2="200" class="sv-line" marker-end="url(#ai)"/><line x1="50" y1="200" x2="50" y2="20" class="sv-line" marker-end="url(#ai)"/>`+
  `<text x="600" y="220" class="sv-muted">tid</text><text x="56" y="30" class="sv-muted">sendehastighed (cwnd)</text>`+
  `<polyline class="sv-curve" points="50,200 70,150 90,120 110,105 200,60 200,132 300,72 300,136 410,70 410,135 520,72 520,136 600,88"/>`+
  `<text x="70" y="190" class="sv-small">slow start (fordobling)</text><text x="215" y="58" class="sv-small">additive increase</text><text x="206" y="150" style="fill:var(--red);font:10px Inter,sans-serif">tab → halvér</text>`)},
 mailflow:{caption:"SMTP skubber (push) mailen mellem servere; modtageren henter (pull) med IMAP/POP3/HTTP.",svg:svg(760,150,ah("mf")+
  box(10,50,120,50,"sv-box-blue","Alice","user agent")+box(200,50,140,50,"sv-box-teal","crepes.fr","Alices mailserver")+
  box(420,50,140,50,"sv-box-teal","hamburger.edu","Bobs mailserver")+box(630,50,120,50,"sv-box-blue","Bob","user agent")+
  arr(130,75,198,75,"mf")+arr(340,75,418,75,"mf")+arr(628,75,562,75,"mf")+
  `<text x="135" y="65" class="sv-small">SMTP</text><text x="345" y="65" class="sv-small">SMTP · TCP 25</text><text x="565" y="65" class="sv-small">IMAP/POP3</text><text x="565" y="98" class="sv-small">(Bob henter)</text>`)},
 twohop:{caption:"IP-adresserne er de samme hele vejen; MAC-adresserne skifter ved hvert hop.",svg:svg(760,240,ah("th")+
  box(10,30,120,50,"sv-box-blue","Host A","IP-A · MAC-A")+box(320,30,120,50,"sv-box-gold","Router R","MAC-R1 | MAC-R2")+box(630,30,120,50,"sv-box-blue","Host B","IP-B · MAC-B")+
  arr(130,55,318,55,"th")+arr(440,55,628,55,"th")+
  `<rect x="20" y="100" width="290" height="120" rx="10" class="sv-box"/><text x="32" y="122" class="sv-small sv-bold">Frame på hop 1 (A → R)</text><text x="32" y="146" class="sv-text" style="font-size:11.5px">MAC: MAC-A → <tspan style="fill:var(--gold);font-weight:800">MAC-R1</tspan></text><text x="32" y="170" class="sv-text" style="font-size:11.5px">IP: IP-A → <tspan style="fill:var(--teal);font-weight:800">IP-B</tspan></text><text x="32" y="196" class="sv-small">ARP fandt gatewayens MAC</text>`+
  `<rect x="450" y="100" width="290" height="120" rx="10" class="sv-box"/><text x="462" y="122" class="sv-small sv-bold">Frame på hop 2 (R → B)</text><text x="462" y="146" class="sv-text" style="font-size:11.5px">MAC: MAC-R2 → <tspan style="fill:var(--gold);font-weight:800">MAC-B</tspan></text><text x="462" y="170" class="sv-text" style="font-size:11.5px">IP: IP-A → <tspan style="fill:var(--teal);font-weight:800">IP-B</tspan></text><text x="462" y="196" class="sv-small">routeren laver en ny frame</text>`)},
 mux:{caption:"Demultiplexing: transportlaget læser destinationsporten og afleverer til den rigtige socket.",svg:svg(720,220,ah("mx")+
  box(10,85,170,50,"sv-box-gold","Indkommende","IP 10.0.0.37")+
  box(260,85,140,50,"sv-box-teal","Transportlaget","læser dst-port")+
  box(480,10,230,44,"sv-box-blue","socket :443  (browser)","")+box(480,88,230,44,"sv-box-blue","socket :53  (DNS-klient)","")+box(480,166,230,44,"sv-box-blue","socket :22  (SSH)","")+
  arr(180,110,258,110,"mx")+arr(400,100,478,32,"mx")+arr(400,110,478,110,"mx")+arr(400,120,478,188,"mx"))},
 ifflow:{caption:"if / elif / else: første sande betingelse vinder — resten springes over.",svg:svg(640,280,ah("if")+
  box(240,10,160,36,"sv-box-teal","a > b and a > c ?","")+box(470,10,110,36,"sv-box-green","print('a')","")+
  box(240,90,160,36,"sv-box-teal","b > a and b > c ?","")+box(470,90,110,36,"sv-box-green","print('b')","")+
  box(240,170,160,36,"sv-box-gold","else","")+box(470,170,110,36,"sv-box-green","print('c')","")+box(250,240,140,32,"sv-box","fortsæt programmet","")+
  arr(400,28,468,28,"if")+arr(320,46,320,88,"if")+arr(400,108,468,108,"if")+arr(320,126,320,168,"if")+arr(400,188,468,188,"if")+arr(320,206,320,238,"if")+
  `<text x="420" y="22" class="sv-small">True</text><text x="326" y="72" class="sv-small">False</text><text x="420" y="102" class="sv-small">True</text><text x="326" y="152" class="sv-small">False</text>`)}
};

const CHECKLISTS={
 python:["Variabler og datatyper (str, int, float, bool) og <code>type()</code>","<code>input()</code> og casting, fx <code>int(input())</code>","Operatorer: <code>+ - * / // % **</code>","<code>if / elif / else</code>","for-loops og <code>range()</code> (også nested)","while-loops, <code>break</code> og <code>continue</code>","Lister, tuples, sets og dictionaries (<code>.items()</code>, <code>.values()</code>)","Functions, <code>return</code> (og hvad der sker uden), <code>*args</code> og <code>**kwargs</code>","Exceptions: <code>try / except</code> med specifikke fejltyper","Læse og skrive filer: <code>open()</code>, <code>'r' 'w' 'a'</code>, <code>with</code>, <code>.write(str(x))</code>","Indexing, slicing (også step <code>[::-1]</code>, <code>[::-2]</code>) og <code>split()</code>","Importere et modul og køre et script fra terminalen (<code>sys.argv</code>)","Linux: <code>pwd ls cd cat mkdir cp mv rm</code>, <code>python3 fil.py</code>"],
 netapp:["HTTP request/response og hvordan de ser ud","Statuskoder: 200, 301, 400, 404, 505","HTTP-headers (Host, User-Agent, Content-Length …)","DNS-hierarkiet: Root → TLD → Authoritative","Rekursiv vs. iterativ DNS","DNS-records: A, AAAA, MX, CNAME, NS","SMTP overordnet (faser, kommandoer, push vs. pull)"],
 nettrans:["Forskellen på TCP og UDP","3-way handshake: SYN → SYN/ACK → ACK","Sequence og acknowledgement number","TCP-headeren felt for felt","Window size (flow control)","MSS og SACK","Hvad der sker, når pakker går tabt","Go-Back-N og Selective Repeat","UDP-header og checksum"],
 netnet:["IPv4-headeren felt for felt","IPv6 og forskellen på IPv4/IPv6","Bits og bytes","Fragmentering og fragment offset","TTL","Private IP-adresser","Subnetting og CIDR","DHCP og DORA","Default gateway","NAT","ICMP, ping og traceroute"],
 netlink:["Ethernet-framen og dens felter","MAC-adresser","Forskellen på MAC og IP","ARP request og ARP reply","Switch vs. router","CSMA/CD","WiFi / 802.11","CSMA/CA","RTS/CTS og hidden terminal-problemet"]
};
