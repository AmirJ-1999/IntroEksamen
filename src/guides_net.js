/* ===== Netværk-guides ===== */
const N="Netværk";
const GUIDES=[
{id:"net-exam",subject:N,group:"Eksamen",title:"Sådan foregår netværkseksamen",mins:6,tools:"tjeklister",cards:["End-to-end"],
lead:"Du tegner 5-lagsmodellen, Dany vælger et lag — og så går samtalen i dybden. Her er formatet, hvad tidligere studerende blev spurgt om, og tjeklister for hvert lag.",
html:`<div class="g-grid">
 <div class="g-card"><h4>1 · Tegn modellen</h4><p>Application, Transport, Network, Link, Physical — med PDU-navne og et par protokoller pr. lag.</p></div>
 <div class="g-card"><h4>2 · Dany vælger et lag</h4><p>Du forklarer lagets opgave, protokollerne og hvordan det hænger sammen med lagene omkring det.</p></div>
 <div class="g-card"><h4>3 · Dybden + header</h4><p>Næsten uanset lag skal du forklare headeren. Nogle ender i Wireshark og skal vise det i rigtig trafik.</p></div></div>
<div class="g-box exam"><b class="t">Det vigtigste råd fra den tidligere studerende</b><p>“Lær ikke de fem layers som fem separate kapitler. Tænk hele tiden: <i>hvis jeg sender en pakke lige nu, hvad sker der så med den hele vejen ned gennem modellen?</i>” — se guiden <b>En dag i livet</b>.</p></div>
<h2>Hvad blev tidligere studerende spurgt om?</h2>
<table class="g-table"><tr><th>Lag</th><th>Spørgsmål der gik igen</th></tr>
<tr><td>Application</td><td>DNS “i dyyybden” (hierarki, records, iterativ/rekursiv), protokoller på laget</td></tr>
<tr><td>Transport</td><td>TCP vs UDP, egenskaber (connection-oriented, reliable, congestion control), tegn 3-way handshake, seq/ack, options i handshaket (MSS, SACK), hvad sker der ved tab med SACK-permitted, TCP-headeren og portene ved en webserver, receive window</td></tr>
<tr><td>Network</td><td>IPv4-headeren felt for felt, IPv6, skriv en gyldig (privat) IP, subnet og CIDR, NAT, DHCP (default gateway, maske, lease, DORA) — og vis det i Wireshark, bits/bytes, fragmentering og offset</td></tr>
<tr><td>Link</td><td>Ethernet-frame, MAC vs IP, ARP request/reply, switch vs router, CSMA/CD, WiFi (CSMA/CA, RTS/CTS)</td></tr></table>
<div class="g-box tip"><b class="t">Hav headers klar</b><p>Hav dem åbne, så du kan klikke hen til dem. Brug <b>Header-galleriet</b> her i Study Lab — alle headers på én side.</p></div>
<div class="g-box"><b class="t">Værktøjer der nævnes i den officielle recap</b><p>Wireshark, telnet, nslookup og arp. Tjek inden eksamen, at din laptop kan køre dem og kobles til projektoren.</p></div>
<h2>Tjeklister — sæt kryds når det sidder</h2>
<h3>Application Layer</h3><div data-chk="netapp"></div>
<h3>Transport Layer</h3><div data-chk="nettrans"></div>
<h3>Network Layer</h3><div data-chk="netnet"></div>
<h3>Data Link + Physical</h3><div data-chk="netlink"></div>`},

{id:"net-model",subject:N,group:"Grundlag",title:"TCP/IP-modellen og indkapsling",mins:7,tools:"interaktiv",videos:["IZ_PnVXtMeY"],podcast:"p1",cards:["Grundlag"],
lead:"Fem lag, der hver løser én opgave og stoler på laget under. Klik på et lag for at se protokoller, adresser og enheder — og se, hvordan hvert lag pakker data ind i sin egen header.",
html:`<div data-viz="stack"></div>
<h2>Hvad er en protokol?</h2><p>En protokol definerer tre ting: <b>formatet</b> på beskederne, <b>rækkefølgen</b> af beskeder mellem parterne og de <b>handlinger</b>, der udføres ved afsendelse/modtagelse eller andre hændelser.</p>
<h2>Indkapsling (encapsulation)</h2><p>På vej ned tilføjer hvert lag sin egen header foran data fra laget over (linklaget også en trailer, CRC). Hos modtageren pilles lagene af i omvendt rækkefølge. Derfor skifter dataenheden navn:</p>
<table class="g-table"><tr><th>Lag</th><th>PDU</th><th>Header tilføjet</th><th>Adresse</th></tr>
<tr><td>Application</td><td>message</td><td>—</td><td>URL / navn</td></tr><tr><td>Transport</td><td>segment (TCP) / datagram (UDP)</td><td>TCP 20 B / UDP 8 B</td><td>port</td></tr>
<tr><td>Network</td><td>datagram</td><td>IPv4 20 B</td><td>IP-adresse</td></tr><tr><td>Link</td><td>frame</td><td>Ethernet 14 B + 4 B CRC</td><td>MAC-adresse</td></tr><tr><td>Physical</td><td>bits</td><td>—</td><td>—</td></tr></table>
<div class="g-box analogy"><b class="t">Analogi</b><p>Et brev (message) lægges i en kuvert med lejlighedsnummer (segment, port), kuverten i en pakke med adresse (datagram, IP), og pakken i en container til netop den næste lastbil (frame, MAC). Ved hver omlastning skifter containeren — adressen på pakken gør ikke.</p></div>
<h2>Hvem læser hvad?</h2><p>En <b>switch</b> pakker kun op til lag 2 (MAC). En <b>router</b> pakker op til lag 3 (IP), beslutter næste hop og bygger en <i>ny</i> frame. Kun <b>værterne</b> i enderne bruger lag 4–5.</p>
<h2>OSI vs TCP/IP</h2><p>OSI har 7 lag: de ekstra er <b>Presentation</b> (kryptering, komprimering, dataformat) og <b>Session</b> (synkronisering, checkpoints). I Internet-stakken skal applikationen selv lave dem, hvis den har brug for dem — fx ligger TLS som et bibliotek oven på TCP.</p>
<div class="g-box exam"><b class="t">Eksamenspointe</b><p>Nævn altid PDU-navnet, adressetypen og en protokol for laget — og vis, at du ved, hvilken enhed der arbejder på hvilket lag.</p></div>`},

{id:"net-daylife",subject:N,group:"Grundlag",title:"En dag i livet: fra Enter til webside",mins:8,tools:"trin-for-trin",videos:["F27PLin3TV0"],podcast:"p1",cards:["End-to-end"],
lead:"Alt hænger sammen: DHCP → ARP → DNS → TCP → HTTP. Gå trinene igennem og se, hvilke adresser der står i hvert lag undervejs.",
html:`<div data-viz="daylife"></div>
<h2>Hvorfor både IP og MAC?</h2><div data-viz="svg" data-name="twohop"></div>
<p>IP-adressen siger, hvor pakken skal hen <i>globalt</i>. MAC-adressen siger, hvem der skal have framen på <i>dette</i> link. Routeren fjerner framen, kigger i IP-headeren, trækker 1 fra TTL og bygger en ny frame til næste hop.</p>
<div class="g-box exam"><b class="t">Typisk spørgsmål</b><p>“Host A sender til B på et andet subnet — hvilken IP- og MAC-destination står i den første frame?” → IP = B, MAC = default gatewayens MAC (fundet med ARP).</p></div>`},

{id:"net-http",subject:N,group:"Application",title:"HTTP: request, response og statuskoder",mins:9,tools:"base64-dekoder",videos:["S9GEPaQ1lFs","4M39gEPWPYs"],podcast:"p1",cards:["Application"],
lead:"HTTP er webbens sprog: klienten spørger (request), serveren svarer (response). Tekstbaseret, stateless og kører over TCP port 80 (HTTPS: TLS over TCP 443).",
html:`<div data-seq="http"></div>
<h2>Request-beskeden</h2>
<pre><code>GET /index.html HTTP/1.1          ← request line: metode, URL, version
Host: www.kallas.dk               ← header lines (navn: værdi)
User-Agent: Mozilla/5.0
Accept-Language: da, en;q=0.7
Connection: keep-alive
                                  ← tom linje (\\r\\n) = slut på headers
(body — tom ved GET)</code></pre>
<h2>Response-beskeden</h2>
<pre><code>HTTP/1.1 200 OK                   ← status line: version, kode, frase
Date: Tue, 13 Oct 2026 10:00:00 GMT
Server: Apache/2.4
Last-Modified: Mon, 12 Oct 2026 08:00:00 GMT
Content-Length: 2652              ← bytes i body
Content-Type: text/html; charset=UTF-8

&lt;html&gt; … data …</code></pre>
<h2>Statuskoder</h2><table class="g-table"><tr><th>Kode</th><th>Betydning</th></tr>
<tr><td><b>200</b> OK</td><td>Det gik godt — objektet følger i body</td></tr><tr><td><b>301</b> Moved Permanently</td><td>Flyttet; ny adresse i <code>Location:</code>-headeren</td></tr>
<tr><td><b>400</b> Bad Request</td><td>Serveren forstod ikke requesten</td></tr><tr><td><b>401</b> Unauthorized</td><td>Kræver login → browseren sender <code>Authorization:</code></td></tr>
<tr><td><b>404</b> Not Found</td><td>Forbindelsen virker, men filen findes ikke på serveren</td></tr><tr><td><b>505</b> HTTP Version Not Supported</td><td>Serveren understøtter ikke versionen</td></tr></table>
<p>Første ciffer er klassen: 1xx info · 2xx succes · 3xx omdirigering · 4xx klientfejl · 5xx serverfejl.</p>
<h2>Persistent vs non-persistent</h2><table class="g-table"><tr><th></th><th>Non-persistent (HTTP/1.0)</th><th>Persistent (HTTP/1.1 default)</th></tr>
<tr><td>Objekter pr. TCP-forbindelse</td><td>1 — lukkes derefter</td><td>mange</td></tr><tr><td>Tid pr. objekt</td><td>2 RTT + overførsel</td><td>~1 RTT efter første</td></tr><tr><td>Side med 10 billeder</td><td>11 handshakes</td><td>1 handshake</td></tr></table>
<h2>Stateless og cookies</h2><p>Serveren husker intet mellem requests — det gør den enkel og skalerbar. Login og indkøbskurve bygges ovenpå med <b>cookies</b>: serveren giver browseren et “armbånd”, som sendes med i hver ny request.</p>
<h2>GET vs POST</h2><p><b>GET</b> henter; parametre står i URL'en (<code>?q=monkeys&amp;banana</code>). <b>POST</b> sender data (fx formular) i body. Begge er klartekst uden TLS.</p>
<h2>Basic authentication (Wireshark-labbet)</h2><div data-viz="base64"></div>
<h2>Prøv selv</h2><pre><code>telnet www.kallas.dk 80
GET /index.html HTTP/1.1
Host: www.kallas.dk
(tryk Enter to gange)

# eller i Kali:
printf "GET / HTTP/1.1\\r\\nHost: www.kallas.dk\\r\\n\\r\\n" | nc www.kallas.dk 80</code></pre>
<div class="g-box exam"><b class="t">Wireshark-filter</b><p><code>http</code> — tiden fra GET til 200 OK aflæses i tidskolonnen. Højreklik → Follow → TCP Stream viser hele samtalen.</p></div>`},

{id:"net-dns",subject:N,group:"Application",title:"DNS i dybden",mins:10,tools:"header-diagram",videos:["6lRcMh5Yphg","UVR9lhUGAyU"],podcast:"p1",cards:["Application"],
lead:"DNS er internettets telefonbog: en distribueret, hierarkisk database + en applikationsprotokol, der oversætter navne til IP-adresser. Kører normalt over UDP port 53.",
html:`<div data-viz="svg" data-name="dnstree"></div>
<h2>Serverklasserne</h2><table class="g-table"><tr><th>Klasse</th><th>Rolle</th></tr>
<tr><td><b>Root</b></td><td>Kender TLD-serverne. 13 logiske root-servere (a–m), replikeret til 1000+ maskiner.</td></tr>
<tr><td><b>TLD</b></td><td>Ansvarlig for én endelse: .com, .org, .dk, .uk …</td></tr>
<tr><td><b>Authoritative</b></td><td>Organisationens egen server med de endelige svar (fx dr.dk's navneserver).</td></tr>
<tr><td><b>Lokal DNS</b></td><td>Ikke en del af hierarkiet. ISP'ens/skolens server, som værten spørger. Cacher svar.</td></tr></table>
<h2>Et opslag fra start til slut</h2><div data-seq="dnsiter"></div>
<table class="g-table"><tr><th>Iterativ</th><th>Rekursiv</th></tr><tr><td>Den kontaktede server svarer “jeg ved det ikke — spørg denne server”. Den, der spørger, går selv videre.</td><td>Den kontaktede server løser hele opslaget og returnerer det færdige svar. Belaster de øverste niveauer, så root/TLD svarer iterativt.</td></tr></table>
<h2>Resource records</h2><p>Format: <code>(name, value, type, ttl)</code> — ttl = hvor længe svaret må caches.</p>
<table class="g-table"><tr><th>Type</th><th>name</th><th>value</th><th>Eksempel</th></tr>
<tr><td><b>A</b></td><td>hostname</td><td>IPv4-adresse</td><td>(relay1.bar.foo, 145.37.93.126, A)</td></tr>
<tr><td><b>AAAA</b></td><td>hostname</td><td>IPv6-adresse</td><td>(www.dr.dk, 2a02:…, AAAA)</td></tr>
<tr><td><b>NS</b></td><td>domæne</td><td>autoritativ navneserver</td><td>(foo.com, dns.foo.com, NS)</td></tr>
<tr><td><b>CNAME</b></td><td>alias</td><td>kanonisk (rigtigt) navn</td><td>(ibm.com, servereast.backup2.ibm.com, CNAME)</td></tr>
<tr><td><b>MX</b></td><td>domæne</td><td>mailserverens navn</td><td>(foo.com, mail.bar.foo.com, MX)</td></tr></table>
<h2>DNS-beskeden</h2><div data-header="dns"></div>
<h2>Hvorfor UDP?</h2><p>Små, hyppige opslag: UDP sparer TCP's handshake og har 8 B header mod 20. Mangler svaret, spørger klienten bare igen. TCP/53 bruges til store svar og zone transfers.</p>
<div class="g-box warn"><b class="t">Sikkerhed</b><p>16-bit ID + UDP uden autentificering → <b>cache poisoning</b>: en angriber svarer før den rigtige server. Modtræk: tilfældige kildeporte og DNSSEC.</p></div>
<h2>nslookup</h2><pre><code>nslookup www.dr.dk              # A-record via din lokale DNS
nslookup -type=MX gmail.com     # mailservere
nslookup -type=NS ku.dk         # autoritative navneservere
nslookup www.dr.dk 8.8.8.8      # spørg en bestemt server</code></pre>`},

{id:"net-smtp",subject:N,group:"Application",title:"SMTP og e-mail",mins:5,videos:["D3GMrOMR2dk"],podcast:"p1",cards:["Application"],
lead:"SMTP skubber mail fra afsenderens mailserver til modtagerens over TCP port 25. Hentning til brugeren sker med andre protokoller.",
html:`<div data-viz="svg" data-name="mailflow"></div><div data-seq="smtp"></div>
<table class="g-table"><tr><th></th><th>HTTP</th><th>SMTP</th></tr><tr><td>Retning</td><td><b>Pull</b> — klienten henter</td><td><b>Push</b> — afsenderens server skubber</td></tr>
<tr><td>Fælles</td><td colspan="2">ASCII kommando/svar med statuskoder, kører over TCP, persistente forbindelser</td></tr>
<tr><td>Flere objekter</td><td>ét objekt pr. response</td><td>multipart i én besked</td></tr><tr><td>Tegnsæt</td><td>frit</td><td>7-bit ASCII (binært encodes, fx base64/MIME)</td></tr></table>
<h2>Mail access</h2><p><b>POP3</b> (TCP 110): download og færdig. <b>IMAP</b> (TCP 143): beskederne bliver på serveren med mapper og flag. <b>HTTP(S)</b>: webmail (Gmail, Outlook).</p>
<div class="g-box warn"><b class="t">Sikkerhed</b><p>MAIL FROM og From:-headeren verificeres ikke i grundprotokollen → afsenderen kan forfalskes (spoofing). SPF, DKIM og DMARC er lagt ovenpå.</p></div>`},

{id:"net-udp",subject:N,group:"Transport",title:"Transportlaget: porte, sockets og UDP",mins:8,tools:"checksum-beregner",videos:["CekW6ipRrGA","VjBDgcNno-Q"],podcast:"p2",cards:["Transport"],
lead:"IP finder maskinen — porten finder programmet. Transportlaget leverer data proces-til-proces gennem sockets. UDP er den simple variant.",
html:`<div data-viz="svg" data-name="mux"></div>
<div class="g-box analogy"><b class="t">Analogi fra podcasten</b><p>IP-adressen er <b>bygningen</b>, portnummeret er <b>lejligheden</b>, og socketen er <b>døren</b>, programmet lytter ved.</p></div>
<h2>Multiplexing og demultiplexing</h2><p><b>Multiplexing</b> (afsender): data fra mange sockets samles og får en transport-header. <b>Demultiplexing</b> (modtager): headerens portnumre bruges til at levere til den rigtige socket. En UDP-socket identificeres af (dst-IP, dst-port); en TCP-socket af hele 4-tuplen (src-IP, src-port, dst-IP, dst-port).</p>
<table class="g-table"><tr><th>Portinterval</th><th>Brug</th></tr><tr><td>0–1023 well-known</td><td>22 SSH · 25 SMTP · 53 DNS · 67/68 DHCP · 80 HTTP · 443 HTTPS</td></tr><tr><td>1024–49151 registered</td><td>registrerede applikationer</td></tr><tr><td>49152–65535 ephemeral</td><td>klientens midlertidige kildeport</td></tr></table>
<h2>UDP-headeren</h2><div data-header="udp"></div>
<h2>Hvorfor vælge UDP?</h2><ul><li>Ingen handshake → ingen ventetid før data (DNS!)</li><li>Ingen congestion control → appen bestemmer selv tempoet (live video, spil)</li><li>Lille header: 8 B mod TCP's 20 B</li><li>Ingen forbindelsestilstand på serveren</li></ul>
<h2>UDP checksum — regn selv</h2><div data-viz="checksum"></div>
<p>UDP har <b>error checking</b>, men ingen <b>error recovery</b>: et beskadiget segment kasseres eller afleveres med en advarsel — der bedes aldrig om genudsendelse.</p>
<div class="g-box exam"><b class="t">Typisk fælde</b><p>UDP's <i>length</i> tæller header + data. TCP's <i>header length</i> tæller kun headeren (i 32-bit ord).</p></div>`},

{id:"net-tcphdr",subject:N,group:"Transport",title:"TCP-headeren felt for felt",mins:8,tools:"header-diagram",videos:["UYJP-6mhF6E"],podcast:"p2",cards:["Transport"],
lead:"TCP er connection-oriented, full duplex, point-to-point og leverer en pålidelig, ordnet byte-strøm med flow og congestion control. Alt det kan aflæses i headeren.",
html:`<div data-header="tcp"></div>
<h2>Den første pakke fra en klient til en webserver</h2>
<table class="g-table"><tr><th>Felt</th><th>Typisk værdi i SYN</th><th>Hvorfor</th></tr>
<tr><td>Source port</td><td>51544</td><td>tilfældig ephemeral port</td></tr><tr><td>Destination port</td><td>80 / 443</td><td>webserverens velkendte port</td></tr>
<tr><td>Sequence number</td><td>x (tilfældig ISN)</td><td>Wireshark viser “0” (relativt)</td></tr><tr><td>Ack number</td><td>0</td><td>ACK-flaget er ikke sat endnu</td></tr>
<tr><td>Flags</td><td>SYN</td><td>“lad os synkronisere”</td></tr><tr><td>Window</td><td>fx 64240</td><td>klientens buffer</td></tr>
<tr><td>Options</td><td>MSS 1460, SACK-permitted, window scale, timestamps</td><td>forhandles kun i handshaket</td></tr><tr><td>Data</td><td>tom</td><td>handshaket bærer ingen data</td></tr></table>
<h2>Sequence og acknowledgement</h2><div data-seq="seqack"></div>
<p><b>Sequence number</b> = nummeret på første databyte i segmentet. <b>ACK number</b> = næste byte, modtageren forventer. Begge tæller <b>bytes</b>. Sender du 100 bytes fra seq 1, svarer modtageren ACK 101.</p>
<div class="g-box exam"><b class="t">Eksamensdetalje</b><p>Der findes ikke et “SYN-ACK-flag” — det er SYN og ACK sat samtidig. FIN er “tak for i dag”, RST er at smække røret på.</p></div>
<h2>MSS</h2><p>Maximum Segment Size = største mængde data i ét segment. Typisk <b>1460 = 1500 (Ethernet MTU) − 20 (IP) − 20 (TCP)</b>. Annonceres som option i SYN og SYN-ACK, så segmenterne passer i én frame uden IP-fragmentering.</p>`},

{id:"net-tcploss",subject:N,group:"Transport",title:"Handshake, pakketab og SACK",mins:10,tools:"sekvensdiagrammer",videos:["E4I6t0mI_is","F27PLin3TV0"],podcast:"p2",cards:["Transport"],
lead:"Det mest spurgte transport-emne: tegn handshaket, forklar seq/ack — og hvad der sker, når en pakke går tabt, med og uden SACK.",
html:`<h2>Three-way handshake</h2><div data-seq="handshake"></div>
<h2>Lukning</h2><div data-seq="teardown"></div>
<h2>Pakketab med SACK</h2><div data-seq="sack"></div>
<p>Den <b>kumulative ACK</b> fortæller, hvor langt den sammenhængende strøm rækker. <b>SACK-blokken</b> (SLE = left edge, SRE = right edge) fortæller, hvad der derudover ligger i bufferen. Differencen er præcis hullet, der skal genudsendes.</p>
<h2>Pakketab uden SACK</h2><div data-seq="nosack"></div>
<h2>Go-Back-N vs Selective Repeat</h2><table class="g-table"><tr><th></th><th>Go-Back-N</th><th>Selective Repeat</th></tr>
<tr><td>Out-of-order pakker</td><td>kasseres</td><td>buffres</td></tr><tr><td>Ved tab</td><td>hele resten af vinduet sendes igen</td><td>kun den manglende</td></tr><tr><td>Ligner</td><td>TCP uden SACK</td><td>TCP med SACK</td></tr></table>
<div class="g-box warn"><b class="t">Husk</b><p>Slides understreger: GBN og SR er <i>ikke</i> TCP — de er undervisningsmodeller med pakkenumre. TCP bruger sekvensnumre på bytes.</p></div>
<h2>De seks scenarier fra slides</h2><table class="g-table"><tr><th>Scenarie</th><th>Hvad sker der?</th></tr>
<tr><td>Sidste ACK i handshaket tabt</td><td>Serveren genudsender SYN-ACK ved timeout; klientens første datasegment bærer også ACK og fuldfører handshaket.</td></tr>
<tr><td>SYN-ACK tabt</td><td>Klientens SYN-timer udløber → SYN sendes igen (timeout fordobles).</td></tr>
<tr><td>Data tabt på vej frem</td><td>Intet ACK → timeout (eller 3 dup-ACKs) → genudsendelse med samme seq.</td></tr>
<tr><td>Data fremme, ACK tabt</td><td>Afsenderen genudsender; modtageren genkender seq som dublet, kasserer den og ACK'er igen.</td></tr>
<tr><td>A ok, B tabt, C fremme</td><td>Dup-ACK for A. Uden SACK kasseres C; med SACK buffres C og rapporteres i en SACK-blok.</td></tr>
<tr><td>Checksum-fejl</td><td>Segmentet kasseres stille (ingen NAK) → som om det var tabt.</td></tr></table>`},

{id:"net-flow",subject:N,group:"Transport",title:"Flow control vs congestion control",mins:5,videos:["cIHiSR4j3g4"],podcast:"p2",cards:["Transport"],
lead:"To mekanismer, der ofte blandes sammen. Flow control beskytter modtageren; congestion control beskytter netværket.",
html:`<div class="g-grid"><div class="g-card"><h4>Flow control — vandglasset</h4><p>Modtageren skriver i <b>receive window</b>, hvor mange bytes der er plads til i bufferen. Afsenderen må aldrig have mere udestående. Eksplicit signal fra modtageren.</p></div>
<div class="g-card"><h4>Congestion control — motorvejen</h4><p>Afsenderen udleder belastning af <b>pakketab</b> og regulerer sit eget <b>cwnd</b>. Implicit signal fra netværket.</p></div></div>
<div data-viz="svg" data-name="aimd"></div>
<table class="g-table"><tr><th>Fase</th><th>Regel</th></tr><tr><td>Slow start</td><td>cwnd starter på 1 MSS og fordobles pr. RTT (eksponentielt)</td></tr><tr><td>Additive increase</td><td>+1 MSS pr. RTT, så længe der ikke er tab</td></tr><tr><td>Multiplicative decrease</td><td>halvér ved hvert tab</td></tr></table>
<p>Afsenderens reelle vindue er det <b>mindste af rwnd og cwnd</b>. Receive window er 16 bit (maks. 65.535 B); window scaling ganger op på hurtige forbindelser.</p>
<h2>QUIC</h2><p>QUIC (HTTP/3) kører oven på <b>UDP port 443</b> og implementerer selv pålidelighed, congestion control og TLS 1.3 — og slår transport- og krypteringshandshake sammen, så der spares en RTT. Bruger et connection ID, så forbindelsen overlever skift fra WiFi til mobildata.</p>`},

{id:"net-ipv4",subject:N,group:"Network",title:"IPv4-headeren",mins:8,tools:"header-diagram",videos:["sdIpLuIR1ZY"],podcast:"p3",cards:["Network"],
lead:"Fragtsedlen på hver pakke. Routere læser den ved hvert hop — og til eksamen skal du kunne forklare hvert felt, og hvorfor det findes.",
html:`<div data-header="ipv4"></div>
<h2>Felterne, der oftest giver spørgsmål</h2>
<div class="g-grid"><div class="g-card"><h4>IHL</h4><p>Bogmærket: hvor headeren slutter. Nødvendigt pga. options. 5 × 4 B = 20 B.</p></div>
<div class="g-card"><h4>TTL</h4><p>Hoptæller mod evige loops. 64 → 63 → … → 0 = kasseres + ICMP type 11.</p></div>
<div class="g-card"><h4>Protocol</h4><p>1 ICMP · 6 TCP · 17 UDP — hvem payloaden afleveres til.</p></div>
<div class="g-card"><h4>Header checksum</h4><p>Kun headeren; genberegnes ved hvert hop (TTL ændres). Indholdet tjekkes af transportlaget.</p></div></div>
<h2>Forwarding vs routing</h2><table class="g-table"><tr><th>Forwarding — data plane</th><th>Routing — control plane</th></tr><tr><td>Lokal handling i routeren: flyt datagrammet fra input- til output-port ud fra forwarding-tabellen (longest prefix match). Nanosekunder.</td><td>Algoritmer (fx OSPF, BGP) eller SDN, der beregner ruten gennem nettet og udfylder tabellerne.</td></tr></table>
<div class="g-box analogy"><b class="t">Huskeregel</b><p>Routing lægger kortet (Google Maps beregner ruten) — forwarding kører turen (drej til højre ved næste kryds).</p></div>
<div class="g-box exam"><b class="t">Fra eksamen (EX 6)</b><p>“Du bliver spurgt ind til stort set alt på IPv4-headeren” — og fragmentering/offset var det, studerende fejlede på. Se guiden <b>Fragmentering</b>.</p></div>`},

{id:"net-subnet",subject:N,group:"Network",title:"Adressering, subnetting og CIDR",mins:10,tools:"subnet-beregner",videos:["BWZ-MHIhqjM","sdIpLuIR1ZY"],podcast:"p3",cards:["Network"],
lead:"En IPv4-adresse er 32 bit = 4 bytes. CIDR-prefixet /x siger, hvor mange af dem der er netværksdelen. Leg med beregneren.",
html:`<div data-viz="subnet"></div>
<h2>Bits og bytes</h2><p>4 oktetter à 8 bit, hver 0–255 (2<sup>8</sup> = 256 værdier). <code>192 = 11000000</code>. IPv6 = 128 bit, MAC = 48 bit, port = 16 bit.</p>
<h2>Prefix-tabel</h2><table class="g-table"><tr><th>Prefix</th><th>Maske</th><th>Værtsbit</th><th>Adresser</th><th>Brugbare værter</th></tr>
<tr><td>/8</td><td>255.0.0.0</td><td>24</td><td>16.777.216</td><td>16.777.214</td></tr><tr><td>/16</td><td>255.255.0.0</td><td>16</td><td>65.536</td><td>65.534</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>8</td><td>256</td><td>254</td></tr><tr><td>/26</td><td>255.255.255.192</td><td>6</td><td>64</td><td>62</td></tr><tr><td>/30</td><td>255.255.255.252</td><td>2</td><td>4</td><td>2</td></tr></table>
<p>Værter = 2<sup>32−x</sup> − 2: netværksadressen (alle værtsbit 0) og broadcast (alle værtsbit 1) kan ikke bruges.</p>
<h2>Private adresser (RFC 1918)</h2><table class="g-table"><tr><th>Interval</th><th>Eksempel på gyldig værtsadresse</th></tr><tr><td>10.0.0.0/8</td><td>10.12.0.5</td></tr><tr><td>172.16.0.0/12 (172.16–172.31)</td><td>172.20.1.10</td></tr><tr><td>192.168.0.0/16</td><td>192.168.1.37/24</td></tr></table>
<p>Andre specielle: <code>127.0.0.1</code> loopback · <code>169.254.x.x</code> APIPA (DHCP fejlede!) · <code>255.255.255.255</code> limited broadcast.</p>
<h2>Default gateway</h2><p>Værten AND'er destinationen med sin maske. Samme netværksadresse → lever direkte (ARP for værten). Ellers → send til <b>default gateway</b> (ARP for routeren). Se den med <code>ip route</code>.</p>
<h2>Del et /24 i fire</h2><p>4 subnets = 2 ekstra bit → /26 med 64 adresser hver: .0, .64, .128, .192. Spring = 256 − 192 = 64.</p>
<div class="g-box exam"><b class="t">Fra eksamen (EX 1)</b><p>“Skriv en gyldig privat IP og forklar den” → <code>192.168.1.37/24</code>: privat (192.168/16), netværk 192.168.1.0, maske 255.255.255.0, 254 værter, broadcast 192.168.1.255.</p></div>`},

{id:"net-frag",subject:N,group:"Network",title:"Fragmentering og fragment offset",mins:6,tools:"fragment-beregner",videos:["H9DivCEFuUg"],podcast:"p3",cards:["Network"],
lead:"Er datagrammet større end næste links MTU, skærer routeren det i stykker. Tre felter gør, at modtageren kan samle sofaen igen.",
html:`<div data-viz="frag"></div>
<table class="g-table"><tr><th>Felt</th><th>Rolle</th></tr><tr><td>Identification (16)</td><td>samme ID i alle fragmenter → “de hører sammen”</td></tr>
<tr><td>Flags (3): DF / MF</td><td>DF = må ikke fragmenteres · MF = 1 betyder “der kommer flere”</td></tr><tr><td>Fragment offset (13)</td><td>position i originalens data, i enheder af <b>8 bytes</b></td></tr></table>
<div class="g-box analogy"><b class="t">Analogi fra podcasten</b><p>En trepersoners sofa skal ind ad en lille kælderdør: benene skrues af (fragmenter), alle dele mærkes med samme ordrenummer (identification), og samlevejledningen siger, hvor hver del sidder (offset).</p></div>
<ul><li>Kun <b>destinationen</b> samler fragmenterne — routere gør det ikke.</li><li>Mangler ét fragment, kasseres hele datagrammet.</li><li>IPv6-routere fragmenterer ikke: afsenderen får ICMPv6 “Packet Too Big” og skruer selv ned (Path MTU Discovery).</li></ul>`},

{id:"net-dhcp",subject:N,group:"Network",title:"DHCP og DORA",mins:6,videos:["H9DivCEFuUg"],podcast:"p3",cards:["Network","Værktøjer"],
lead:"Hvordan en ny enhed får IP, maske, default gateway og DNS-server automatisk — med fire beskeder.",
html:`<div data-seq="dora"></div>
<table class="g-table"><tr><th>Klienten lærer</th><th>Hvorfor</th></tr><tr><td>Egen IP-adresse</td><td>for at kunne sende og modtage</td></tr><tr><td>Subnetmaske</td><td>for at vide, hvad der er lokalt</td></tr>
<tr><td>Default gateway</td><td>vejen ud af subnettet</td></tr><tr><td>Lokal DNS-server</td><td>for at kunne slå navne op</td></tr><tr><td>Lease time</td><td>hvor længe adressen er lånt (fornyes ved ~50 %)</td></tr></table>
<div class="g-box"><b class="t">Hvorfor Request, når man lige har fået et Offer?</b><p>Der kan være flere DHCP-servere, der alle har sendt tilbud. Requesten broadcastes, så klienten vælger ét, og de andre ved, at deres tilbud er afvist.</p></div>
<h2>Vis det i Wireshark (EX 1)</h2><pre><code>Filter:  dhcp          (ældre Wireshark: bootp)

sudo dhclient -r eth0   # slip adressen
sudo dhclient -v eth0   # Discover → Offer → Request → ACK</code></pre>
<div class="g-box warn"><b class="t">Sikkerhed</b><p>DHCP er hverken autentificeret eller krypteret. En <b>rogue DHCP-server</b> kan udpege sig selv som gateway/DNS (man-in-the-middle). Modtræk: DHCP snooping på switchen.</p></div>`},

{id:"net-nat",subject:N,group:"Network",title:"NAT",mins:5,podcast:"p3",cards:["Network"],
lead:"Hele hjemmet bag én offentlig IP: routeren omskriver privat kilde-IP:port til offentlig IP:port og husker det i en tabel.",
html:`<div data-viz="svg" data-name="nat"></div>
<table class="g-table"><tr><th>#</th><th>Hændelse</th><th>Kilde</th><th>Destination</th></tr>
<tr><td>1</td><td>Laptop sender</td><td>10.0.0.1:3345</td><td>128.119.40.186:80</td></tr><tr><td>2</td><td>NAT omskriver + noterer</td><td><b>138.76.29.7:5001</b></td><td>128.119.40.186:80</td></tr>
<tr><td>3</td><td>Svar kommer</td><td>128.119.40.186:80</td><td>138.76.29.7:5001</td></tr><tr><td>4</td><td>NAT slår op og oversætter</td><td>128.119.40.186:80</td><td><b>10.0.0.1:3345</b></td></tr></table>
<div class="g-grid"><div class="g-card"><h4>Fordele</h4><p>Kun én offentlig IP · skift ISP uden at omadressere · interne enheder er ikke direkte nåelige udefra.</p></div>
<div class="g-card"><h4>Kritik</h4><p>Bryder end-to-end-princippet · en lag 3-enhed roder med lag 4-porte · indgående forbindelser kræver port forwarding.</p></div></div>
<div class="g-box exam"><b class="t">Tankevækker fra podcasten</b><p>NAT gav “gratis” sikkerhed, fordi interne enheder ikke har en offentlig adresse. Med IPv6 får alle enheder offentlige adresser — så skal en rigtig firewall gøre arbejdet.</p></div>`},

{id:"net-ipv6",subject:N,group:"Network",title:"IPv6",mins:5,tools:"header-diagram",videos:["H9DivCEFuUg"],podcast:"p3",cards:["Network"],
lead:"128-bit adresser og en fast, enklere 40-byte header, der er hurtigere at behandle i routerne.",
html:`<div data-header="ipv6"></div>
<table class="g-table"><tr><th>IPv4</th><th>IPv6</th></tr><tr><td>32-bit adresser</td><td>128-bit adresser (≈ 3,4 × 10<sup>38</sup>)</td></tr>
<tr><td>Header 20–60 B (IHL)</td><td>Fast 40 B (intet IHL)</td></tr><tr><td>Header checksum</td><td>fjernet</td></tr><tr><td>Routere kan fragmentere</td><td>kun afsenderen (ICMPv6 Packet Too Big)</td></tr>
<tr><td>Options i headeren</td><td>extension headers via Next Header</td></tr><tr><td>TTL · Protocol · ToS</td><td>Hop Limit · Next Header · Traffic Class</td></tr><tr><td>ARP</td><td>NDP (Neighbor Discovery over ICMPv6)</td></tr></table>
<h2>Notation</h2><pre><code>2001:0db8:0000:0000:0000:8a2e:0370:7334
2001:db8::8a2e:370:7334      ← foranstillede nuller væk, én nul-stribe = ::
::1 = loopback · fe80::/10 = link-local · /64 = standard subnet</code></pre>
<h2>Overgang: tunneling</h2><p>Mellem IPv6-“øer” lægges hele IPv6-datagrammet som payload i et IPv4-datagram (protocol = 41). IPv4-routerne ser kun yderkassen.</p>`},

{id:"net-icmp",subject:N,group:"Network",title:"ICMP, ping og traceroute",mins:6,tools:"header-diagram",videos:["EHV0Q0R--Ns"],podcast:"p3",cards:["Network"],
lead:"IP har ingen egen fejlmelding — det er ICMP's job. Ping og traceroute er bygget på det.",
html:`<div data-header="icmp"></div>
<table class="g-table"><tr><th>Type</th><th>Code</th><th>Betydning</th></tr><tr><td>8</td><td>0</td><td>Echo request (ping)</td></tr><tr><td>0</td><td>0</td><td>Echo reply</td></tr>
<tr><td>3</td><td>0/1/3</td><td>Destination network / host / <b>port</b> unreachable</td></tr><tr><td>11</td><td>0</td><td>TTL expired (traceroute)</td></tr></table>
<h2>Traceroute</h2><div data-seq="traceroute"></div>
<pre><code>ping -c 4 8.8.8.8        # 4 echo requests; RTT pr. svar
traceroute dr.dk         # hop for hop (Linux)
tracert dr.dk            # Windows (ICMP echo i stedet for UDP)</code></pre>
<div class="g-box warn"><b class="t">Sikkerhed</b><p>Ping-sweeps og traceroute kortlægger netværk, så ICMP filtreres ofte. Men blokerer man alt, ødelægges Path MTU Discovery (“Packet Too Big”).</p></div>`},

{id:"net-ethernet",subject:N,group:"Data Link & WiFi",title:"Linklaget og Ethernet-framen",mins:7,tools:"frame-diagram",videos:["lMGWJZLTulY","1XrRT0CmzYw"],podcast:"p4",cards:["Data Link"],
lead:"Linklaget flytter en frame ét hop — fra én node til den fysisk tilstødende. Det implementeres i netkortet (NIC) og driveren.",
html:`<div data-frame="ethernet"></div>
<h2>Linklagets services</h2><ul><li><b>Framing</b> — pak datagrammet ind i en frame med header og trailer</li><li><b>Link access</b> — hvem må sende på et delt medie (MAC-protokol)</li><li><b>Fejldetektion</b> — CRC; fejlbehæftede frames droppes</li></ul>
<h2>MAC-adressen</h2><p>48 bit = 6 bytes, skrevet som 12 hex-cifre: <code>1A-2F-BB-76-09-AD</code>. De første 3 bytes (OUI) er producentens. Brændt ind i NIC'en (men kan ændres i software). <code>FF-FF-FF-FF-FF-FF</code> = broadcast.</p>
<table class="g-table"><tr><th></th><th>MAC</th><th>IP</th></tr><tr><td>Lag</td><td>2 — link</td><td>3 — network</td></tr><tr><td>Størrelse</td><td>48 bit</td><td>32 bit (IPv4)</td></tr><tr><td>Rækkevidde</td><td>det lokale link</td><td>end-to-end på tværs af net</td></tr><tr><td>Skifter?</td><td>ved hvert hop</td><td>nej (undtagen NAT)</td></tr><tr><td>Analogi (slides)</td><td>CPR-nummer — følger dig</td><td>postadresse — afhænger af hvor du bor</td></tr></table>
<div class="g-box exam"><b class="t">Type vs CRC</b><p>De har intet med hinanden at gøre: <b>type</b> siger, hvilken protokol der ligger i data (demultiplexing). <b>CRC</b> opdager bitfejl — og ved fejl droppes framen uden ACK; TCP må opdage tabet.</p></div>`},

{id:"net-arp",subject:N,group:"Data Link & WiFi",title:"ARP",mins:6,tools:"header-diagram",videos:["QPi5Nvxaosw","aamG4-tH_m8"],podcast:"p4",cards:["Data Link"],
lead:"Jeg kender IP-adressen på nogen i mit subnet — hvad er deres MAC? ARP spørger hele LAN'et og husker svaret.",
html:`<div data-seq="arp"></div><div data-header="arp"></div>
<table class="g-table"><tr><th></th><th>ARP</th><th>DNS</th></tr><tr><td>Oversætter</td><td>IPv4 → MAC</td><td>navn → IP</td></tr><tr><td>Rækkevidde</td><td>kun eget subnet</td><td>hele internettet (hierarki)</td></tr><tr><td>Transport</td><td>direkte i Ethernet (0x0806)</td><td>UDP 53</td></tr><tr><td>Cache-levetid</td><td>tid (~20 min, soft state)</td><td>recordens TTL</td></tr></table>
<div class="g-box warn"><b class="t">To slags TTL</b><p>ARP-cachens TTL er <b>tid</b>. IPv4-headerens TTL er <b>hop</b>. Podcasten bruger netop dette som eksamensfælde.</p></div>
<h2>Til et andet subnet</h2><div data-viz="svg" data-name="twohop"></div>
<pre><code>arp -a            # vis ARP-cachen
ip neigh          # moderne Linux-alternativ
Wireshark-filter: arp</code></pre>
<div class="g-box warn"><b class="t">Sikkerhed</b><p>ARP har ingen autentificering — enhver kan svare. <b>ARP spoofing</b> får trafik sendt til angriberen (man-in-the-middle).</p></div>`},

{id:"net-switch",subject:N,group:"Data Link & WiFi",title:"Switch vs router og CSMA/CD",mins:6,videos:["X2cLpzFRMT4"],podcast:"p4",cards:["Data Link"],
lead:"To store-and-forward-enheder på hver sit lag — og hvordan Ethernet historisk delte et kabel uden at alle talte i munden på hinanden.",
html:`<table class="g-table"><tr><th></th><th>Switch</th><th>Router</th></tr><tr><td>Lag</td><td>2 — link</td><td>3 — network</td></tr><tr><td>Kigger på</td><td>MAC-adresser</td><td>IP-adresser</td></tr>
<tr><td>Tabel</td><td>lærer selv (self-learning: afsender-MAC ↔ port; ukendt destination → flood)</td><td>beregnes med routingalgoritmer</td></tr><tr><td>Konfiguration</td><td>plug-and-play, usynlig for værterne</td><td>skal konfigureres; er default gateway</td></tr></table>
<p class="g-box analogy"><b class="t">Huskeregel fra podcasten</b>Switch → MAC. Router → IP.</p>
<h2>Multiple access</h2><p>Tre klasser: <b>channel partitioning</b> (TDM, FDM), <b>random access</b> (ALOHA, CSMA, CSMA/CD, CSMA/CA) og <b>taking turns</b> (polling, token).</p>
<h2>CSMA/CD (Ethernet)</h2><ol><li>Lyt: er kanalen ledig, så send (<i>carrier sense</i>).</li><li>Kollision kan stadig ske pga. propagation delay.</li><li>Opdages kollisionen under afsendelse: stop, send <b>jam signal</b>.</li><li><b>Binary exponential backoff</b>: efter m'te kollision vent K × 512 bit-tider, K tilfældig i {0 … 2<sup>m</sup>−1}.</li></ol>
<p>CSMA/CD er primært relevant for half-duplex/delt Ethernet — moderne switchede full-duplex-links har ikke kollisioner.</p>`},

{id:"net-wifi",subject:N,group:"Data Link & WiFi",title:"WiFi: CSMA/CA, hidden terminal og RTS/CTS",mins:7,videos:["vvhEnr52UOU"],podcast:"p4",cards:["WiFi"],
lead:"Luften er et delt medie, og en radio kan ikke høre andre, mens den selv sender. Derfor undgår WiFi kollisioner i stedet for at opdage dem.",
html:`<div class="g-box warn"><b class="t">Kilde</b><p>WiFi-stoffet står på eksamens-tjeklisten, men ikke i kursets slides i mappen. Guiden bygger på lærebogen (Kurose & Ross kap. 7) og podcasten.</p></div>
<h2>Begreber</h2><p><b>Access point (AP)</b> = basestationen. AP + dets værter = et <b>BSS</b>. <b>SSID</b> = netværkets navn i AP'ens beacon frames. En vært associerer sig med en AP, før den sender data.</p>
<h2>Hvorfor ikke CSMA/CD?</h2><p>Mens antennen sender, overdøver dens eget signal alt andet — den kan ikke høre en kollision. Og to stationer kan være skjulte for hinanden:</p>
<div data-viz="svg" data-name="hidden"></div>
<h2>CSMA/CA</h2><ol><li>Er kanalen ledig i et kort interval (DIFS) → send hele framen.</li><li>Er den optaget → vælg en tilfældig backoff, der kun tæller ned, mens kanalen er ledig; send ved 0.</li><li>Modtageren sender en <b>link-layer ACK</b>. Ingen ACK → større backoff og prøv igen.</li></ol>
<h2>RTS/CTS</h2><div data-seq="rtscts"></div>
<table class="g-table"><tr><th></th><th>Ethernet (CSMA/CD)</th><th>WiFi (CSMA/CA)</th></tr><tr><td>Kollisioner</td><td>opdages (detection)</td><td>undgås (avoidance)</td></tr><tr><td>ACK på linklaget</td><td>nej</td><td>ja</td></tr><tr><td>Sender frame færdig ved kollision</td><td>nej — afbryder + jam</td><td>ja — kan ikke opdage den</td></tr></table>`},

{id:"net-wireshark",subject:N,group:"Værktøjer",title:"Wireshark og kommandoer",mins:7,videos:["89vY3ofpC3A","2D0s2pWqeyc","yqnmotqP8U0"],cards:["Værktøjer"],
lead:"Teori bliver til virkelighed i Wireshark. Nogle studerende skulle vise det, de forklarede, i rigtig trafik — vær klar.",
html:`<div class="g-grid"><div class="g-card"><h4>1 · Packet list</h4><p>Én linje pr. pakke: nr., tid, kilde, destination, protokol, info.</p></div><div class="g-card"><h4>2 · Packet details</h4><p>Lagene foldet ud: Frame → Ethernet II → IPv4 → TCP → HTTP. Her ser du headerfelterne.</p></div><div class="g-card"><h4>3 · Packet bytes</h4><p>Rå bytes i hex/ASCII. Klik et felt i (2), og bytes markeres her.</p></div></div>
<h2>Filtre du skal kunne</h2><table class="g-table"><tr><th>Filter</th><th>Viser</th></tr>
<tr><td><code>http</code> · <code>dns</code> · <code>arp</code> · <code>icmp</code></td><td>én protokol</td></tr><tr><td><code>dhcp</code> (ældre: <code>bootp</code>)</td><td>DORA</td></tr>
<tr><td><code>tcp.port == 80</code> · <code>udp.port == 53</code></td><td>bestemt port</td></tr><tr><td><code>ip.addr == 10.0.0.5</code></td><td>alt til/fra en IP</td></tr>
<tr><td><code>tcp.flags.syn == 1</code></td><td>handshakes</td></tr><tr><td><code>tcp.analysis.retransmission</code></td><td>genudsendelser (pakketab!)</td></tr></table>
<h2>Network Challenge-teknikker</h2><ul><li><b>Statistics → Endpoints</b> (IPv4): alle IP'er i capturen</li><li><b>Statistics → Conversations</b>: trafik pr. forbindelse</li><li><b>File → Export Objects → HTTP</b>: udtræk filer (fx home1.jpg)</li><li><b>Follow → TCP Stream</b>: hele samtalen som tekst</li><li>Navne på IP'er: kig i DNS-svarene; hostnames i DHCP/NBNS</li><li>Blev forbindelsen lukket? Kig efter FIN- eller RST-flag</li></ul>
<h2>Kommandoer på Kali</h2><pre><code>ip a                   # IP og MAC pr. interface
ip route               # default gateway
cat /etc/resolv.conf   # DNS-server
arp -a / ip neigh      # ARP-cache
ping · traceroute · nslookup
ss -tulpn              # lyttende porte
telnet host 80         # rå TCP-forbindelse</code></pre>`},

{id:"net-headers",subject:N,group:"Værktøjer",title:"Header-galleri (hav det åbent til eksamen)",mins:3,tools:"alle headers",cards:["End-to-end"],
lead:"Alle headers samlet på én side, nedefra og op — klik på et felt for forklaringen. Det er præcis det, den tidligere studerende anbefaler at have klar.",
html:`<h2>Link</h2><div data-frame="ethernet"></div><div data-header="arp"></div>
<h2>Network</h2><div data-header="ipv4"></div><div data-header="ipv6"></div><div data-header="icmp"></div>
<h2>Transport</h2><div data-header="tcp"></div><div data-header="udp"></div>
<h2>Application</h2><div data-header="dns"></div>
<pre><code>HTTP request:   GET /index.html HTTP/1.1\\r\\n  Host: …\\r\\n  …  \\r\\n
HTTP response:  HTTP/1.1 200 OK\\r\\n  Content-Type: …\\r\\n  Content-Length: …\\r\\n  \\r\\n  body</code></pre>`}
];
