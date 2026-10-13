# Metadata for "Mandatory opgave 1" i Python Lab.
# Spørgsmål, my_data og model-svar læses fra mandatory/Python_Exam_All_33_Questions.py;
# build.py kører model-svaret for at finde det rigtige svar (som aldrig vises på siden).
# Her står det, der ikke findes i filen: titel, kategori, niveau, hint og forklaring.
# 'annotated' er valgfri — uden den bruges model-svaret som forklaret løsning.

M1_SOURCE = 'mandatory/Python_Exam_All_33_Questions.py'

PCAP_NOTE = ('Opgaven kræver <code>cap.pcapng</code> fra netværks-challenge, som ikke kan åbnes her. '
             'Find svaret i Wireshark og gem det i <code>result</code> — testen tjekker det stadig.')

M1 = {
 1: dict(title="Store bogstaver", cat="Strings", diff=1,
   hint="Strings har en indbygget metode, der returnerer teksten med store bogstaver.",
   why="<p><code>.upper()</code> returnerer en <b>ny</b> streng — strings kan ikke ændres (immutable), så <code>my_data</code> er uændret bagefter. Derfor skal resultatet gemmes i <code>result</code>.</p>",
   annotated='''result = my_data.upper()  # .upper() laver en NY streng med store bogstaver
print(result)'''),
 2: dict(title="Vend teksten om", cat="Strings", diff=1,
   hint="Slicing har formen <code>tekst[start:stop:step]</code>. Hvad sker der, hvis step er -1?",
   why="<p><code>[::-1]</code>: start og stop er udeladt (hele strengen), og step −1 betyder baglæns.</p>",
   annotated='''result = my_data[::-1]  # slicing: hele strengen, step -1 = baglæns
print(result)'''),
 3: dict(title="Sortér listen", cat="Lists", diff=1,
   hint="Der findes en indbygget funktion, der returnerer en ny, sorteret liste. Pas på: <code>.sort()</code> returnerer <code>None</code>.",
   why="<p><code>sorted()</code> returnerer en ny liste. <code>my_data.sort()</code> sorterer listen på stedet og returnerer <code>None</code>. Derfor giver <code>result = my_data.sort()</code> <code>None</code>, og det er en klassisk fejl. Dubletter bliver i listen.</p>",
   annotated='''result = sorted(my_data)  # sorted() returnerer en NY sorteret liste (dubletter bevares)
print(result)'''),
 4: dict(title="De første 3 elementer", cat="Lists", diff=1,
   hint="Slicing: <code>liste[start:stop]</code>. Stop-indekset er <i>ikke</i> med.",
   why="<p><code>[0:3]</code> (eller bare <code>[:3]</code>) giver index 0, 1 og 2. Index 3 er ikke med.</p>",
   annotated='''result = my_data[0:3]  # index 0, 1 og 2 — stop (3) er ikke med
print(result)'''),
 5: dict(title="Gang hvert tal med 5", cat="Lists", diff=1,
   hint="Lav en tom liste, løb <code>my_data</code> igennem med <code>for</code>, og brug <code>.append()</code>. En list comprehension virker også.",
   why="<p>Loop + <code>append</code> eller <code>[n * 5 for n in my_data]</code>. Pas på: <code>my_data * 5</code> ganger ikke tallene. Den gentager hele listen 5 gange.</p>",
   annotated='''result = []               # tom liste til resultatet
for n in my_data:         # n er ét tal ad gangen
    result.append(n * 5)  # læg det ganget tal til sidst i listen
print(result)'''),
 6: dict(title="Det 6. element", cat="Lists", diff=1,
   hint="Python tæller fra 0. Hvilket index har det 6. element?",
   why="<p>Det 6. element har index 5. Med <code>my_data[6]</code> får man det 7. element. Den slags fejl kaldes off-by-one.</p>",
   annotated='''result = my_data[5]  # 6. element = index 5, fordi første element er index 0
print(result)'''),
 7: dict(title="Sortér uden dubletter", cat="Tuples & sets", diff=2,
   hint="Et <code>set</code> kan ikke indeholde dubletter, men det er ikke sorteret. Svaret skal være en liste.",
   why="<p><code>set()</code> fjerner dubletter. <code>sorted()</code> sorterer og returnerer altid en <b>liste</b>. Samlet: <code>sorted(set(x))</code>.</p>",
   annotated='''result = sorted(set(my_data))  # set() fjerner dubletter, sorted() giver en sorteret liste
print(result)'''),
 8: dict(title="Erstat 'be' med 'python'", cat="Strings", diff=1,
   hint="Strings har en metode, der erstatter alle forekomster af én tekst med en anden.",
   why="<p><code>.replace(gammel, ny)</code> erstatter <b>alle</b> forekomster og returnerer en ny streng. Bemærk, at den også ville erstatte 'be' inde i andre ord, fx 'because'.</p>",
   annotated='''result = my_data.replace("be", "python")  # erstatter ALLE forekomster af "be"
print(result)'''),
 9: dict(title="Stav 'star' baglæns", cat="Strings", diff=2,
   hint="Del sætningen op i ord med <code>.split()</code>, find ordet der er præcis <code>'star'</code>, vend det, og saml sætningen igen med <code>' '.join()</code>.",
   why="<p>Med <code>.replace('star', 'rats')</code> bliver <i>staring</i> også til <i>ratsing</i>. Derfor skal hele ord sammenlignes ét ad gangen.</p>",
   annotated='''words = my_data.split()               # liste af ord
for i in range(len(words)):           # i = position, så vi kan ændre ordet i listen
    if words[i] == "star":            # kun hele ordet — ikke "staring"
        words[i] = words[i][::-1]     # vend ordet med slicing
result = " ".join(words)              # saml ordene med mellemrum
print(result)'''),
 10: dict(title="20 værdier med spring på 5", cat="Loops", diff=2,
   hint="<code>range(start, stop, step)</code>. Stop er ikke med. 20 værdier med spring på 5 dækker 100.",
   why="<p><code>range(25, 125, 5)</code> giver 25, 30, …, 120, altså 20 værdier. <code>range</code> er ikke en liste, så den skal laves om med <code>list()</code>.</p>",
   annotated='''result = list(range(my_data, my_data + 100, 5))  # 20 værdier × 5 = 100; stop er ikke med
print(result)'''),
 11: dict(title="Forbindelser for én IP", cat="Tuples & sets", diff=2,
   hint="Hvert element er en tuple <code>(ip, antal)</code>. Løb listen igennem, sammenlign <code>[0]</code> med IP'en og gem <code>[1]</code>.",
   why="<p>Alternativ: <code>dict(my_data)['192.168.1.212']</code>. En liste af par kan laves direkte om til en dictionary.</p>",
   annotated='''result = None
for i in my_data:                 # i er en tuple: (ip, antal)
    if i[0] == "192.168.1.212":   # [0] = ip
        result = i[1]             # [1] = antal forbindelser
        break                     # fundet — stop loopet
print(result)'''),
 12: dict(title="Summen af listen", cat="Lists", diff=1,
   hint="Der findes en indbygget funktion, der lægger alle tal i en liste sammen.",
   why="<p><code>sum()</code> lægger alle elementer sammen. Manuelt: start med <code>total = 0</code> og læg hvert tal til i et loop.</p>",
   annotated='''result = sum(my_data)  # indbygget: lægger alle tal i listen sammen
print(result)'''),
 13: dict(title="Navne og telefonnumre", cat="Strings", diff=2,
   hint="Split først på <code>','</code> for at få hver person, og derefter hver person på <code>':'</code>. Telefonnumrene skal forblive strings.",
   why="<p>Der splittes på to niveauer. <code>name, phone = person.split(':')</code> er tuple-udpakning: listen med to elementer fordeles ud på to variabler.</p>",
   annotated='''result = []
for person in my_data.split(","):       # "jens:32242526", "peter:23451234", ...
    name, phone = person.split(":")     # udpakning: ["jens", "32242526"] -> name, phone
    result.append((name, phone))        # bemærk de dobbelte parenteser: vi tilføjer én tuple
print(result)'''),
 14: dict(title="Fjern en nøgle", cat="Dictionaries", diff=1,
   hint="Brug <code>del</code> eller <code>.pop()</code> med nøglen. Svaret er hele dictionary'en bagefter.",
   why="<p><code>del d[key]</code> fjerner både nøgle og værdi. <code>.pop(key)</code> gør det samme, men <b>returnerer værdien</b>. <code>result = my_data.pop(...)</code> giver derfor 54 og ikke dictionary'en.</p>",
   annotated='''del my_data["192.168.1.243"]  # fjerner nøgle + værdi fra dictionary'en
result = my_data               # svaret er hele den ændrede dictionary
print(result)'''),
 15: dict(title="Vend hvert ord", cat="Strings", diff=2,
   hint="Split i ord, vend hvert ord med slicing, og saml dem igen med mellemrum.",
   why="<p>Ordene bliver stående, kun bogstaverne i hvert ord vendes. Kompakt version: <code>' '.join(w[::-1] for w in my_data.split())</code>.</p>",
   annotated='''words = my_data.split()        # liste af ord
result = []
for w in words:
    result.append(w[::-1])     # vend bogstaverne i hvert ord
result = " ".join(result)      # saml til én streng igen
print(result)'''),
 16: dict(title="10 kopier af en tuple", cat="Tuples & sets", diff=1,
   hint="Hvad sker der, når man ganger en liste med et tal? Prøv <code>[1] * 3</code> i sandboxen.",
   why="<p><code>[my_data] * 10</code> giver en liste med den samme tuple 10 gange. Til sammenligning giver <code>my_data * 10</code> én lang tuple med 20 elementer.</p>",
   annotated='''result = [my_data] * 10  # en liste med ÉN tuple, gentaget 10 gange
print(result)'''),
 17: dict(title="Tilføj 'yellow'", cat="Dictionaries", diff=1,
   hint="Man tilføjer et element til en dictionary ved at tildele en værdi til en ny nøgle.",
   why="<p><code>d[key] = value</code> opretter nøglen eller overskriver den, hvis den allerede findes. Dictionaries husker rækkefølgen, elementerne blev sat ind i.</p>",
   annotated='''my_data["yellow"] = 22  # ny nøgle -> oprettes
result = my_data
print(result)'''),
 18: dict(title="Unikke IP'er i loggen", cat="Log-analyse", diff=3,
   hint="Split loggen i linjer og tag det første ord fra hver linje. Et <code>set</code> fjerner automatisk dubletter.",
   why="<p>Hver logline starter med IP-adressen: <code>line.split()[0]</code>. <code>.add()</code> på et set ignorerer dubletter. Kompakt version: <code>{l.split()[0] for l in my_data.splitlines()}</code>. Et set har ingen fast rækkefølge, så print kan vise IP'erne i en anden orden.</p>",
   annotated='''result = set()                    # tomt set — {} ville være en tom dictionary!
lines = my_data.split("\\n")        # én logline pr. element
for l in lines:
    if l:                         # spring tomme linjer over
        ip = l.split()[0]         # første "ord" på linjen er IP'en
        result.add(ip)            # set ignorerer dubletter
print(result)'''),
 19: dict(title="Tæl statuskoder", cat="Log-analyse", diff=3,
   hint='''Statuskoden står efter request-delen i anførselstegn. Prøv <code>line.split('"')[2]</code> eller <code>line.split()[-2]</code>. Tæl dem i en dictionary.''',
   why="<p>Efter <code>\"GET … HTTP/1.1\"</code> kommer <code>status størrelse</code>. Optællingsmønstret: findes nøglen, lægges 1 til, ellers sættes den til 1. Kortere: <code>d[k] = d.get(k, 0) + 1</code>. Nøglerne skal være strings og antallet int.</p>",
   annotated='''result = {}
for line in my_data.split("\\n"):
    if line:
        parts = line.split('"')[2].split()  # teksten efter request'en: ['200', '8540']
        status = parts[0]                   # statuskoden som string
        if status in result:
            result[status] += 1             # set før: tæl op
        else:
            result[status] = 1              # første gang
print(result)'''),
 20: dict(title="Gennemsnit for status 200", cat="Log-analyse", diff=3,
   hint="Find linjerne med status 200, læg størrelserne sammen (husk <code>int()</code>), og divider med antallet. Svaret skal være en <code>int</code>.",
   why="<p><code>int(total / count)</code> skærer decimalerne af. Linjer med størrelse <code>-</code> har aldrig status 200, så de giver ingen ValueError her.</p>",
   annotated='''total = 0
count = 0
for l in my_data.split("\\n"):
    if l:
        parts = l.split('"')[2].split()  # ['200', '8540'] = [status, størrelse]
        status = parts[0]
        if status == "200":
            size = int(parts[1])         # tekst -> tal, så vi kan regne
            total += size
            count += 1
result = int(total / count)              # gennemsnit, konverteret til int
print(result)'''),
 21: dict(title="Tæl PNG-billeder", cat="Log-analyse", diff=2,
   hint="Strings har en metode, der tæller, hvor mange gange en tekst forekommer.",
   why="<p><code>my_data.count('.png')</code> tæller forekomster i hele teksten. Det virker, fordi '.png' højst står én gang pr. linje. En mere robust løsning tæller de linjer, hvor stien ender på <code>.png</code>.</p>",
   annotated='''result = my_data.count(".png")  # antal gange ".png" står i hele loggen
print(result)'''),
 22: dict(title="Star Wars som dictionary", cat="Dictionaries", diff=2,
   hint="Brug tuple-udpakning: <code>for name, episode in my_data</code>. Episoden skal være nøglen.",
   why="<p>Tuplerne er (navn, episode), men nøglen skal være episoden, så rækkefølgen byttes om. Kompakt version: <code>{ep: name for name, ep in my_data}</code>.</p>",
   annotated='''result = {}
for name, episode in my_data:   # udpak hver tuple: ('The Phantom Menace', 'Episode I')
    result[episode] = name      # episoden er nøglen, navnet er værdien
print(result)'''),
 23: dict(title="1–100 uden multipla", cat="Loops", diff=2,
   hint="<code>%</code> (modulo) giver resten ved division. Et tal er deleligt med 3, når resten er 0. <code>range(1, 101)</code> går til og med 100.",
   why="<p><code>n % my_data != 0</code> holder kun de tal, der <i>ikke</i> går op i <code>my_data</code>. Kompakt version: <code>[n for n in range(1, 101) if n % my_data]</code>.</p>",
   annotated='''result = []
for n in range(1, 101):        # 1..100 (stop er ikke med)
    if n % my_data != 0:       # rest != 0 -> ikke deleligt med 3
        result.append(n)
print(result)'''),
 24: dict(title="Knæk SHA1-hashen", cat="Hashing", diff=4,
   hint="Prøv alle kombinationer af 4 bogstaver a–z med <code>itertools.product('abc…z', repeat=4)</code>. Hash hvert gæt med <code>hashlib.sha1(gæt.encode()).hexdigest()</code> og sammenlign med <code>my_data</code>.",
   why="<p>Det er brute force: 26⁴ = 456.976 muligheder. <code>.encode()</code> laver strengen om til bytes, som hashlib kræver, og <code>.hexdigest()</code> giver hashen som hex-tekst. Med <code>break</code> stopper man, så snart passwordet er fundet.</p>",
   annotated='''import hashlib
from itertools import product

result = None
for letters in product("abcdefghijklmnopqrstuvwxyz", repeat=4):  # ('a','a','a','a'), ('a','a','a','b'), ...
    guess = "".join(letters)                                     # tuple -> "aaab"
    if hashlib.sha1(guess.encode()).hexdigest() == my_data:      # hash gættet og sammenlign
        result = guess
        break                                                    # fundet — stop
print(result)'''),
 25: dict(title="Gæt passwordet (SHA256)", cat="Hashing", diff=4,
   hint="Passwordet er 8 tegn med store og små bogstaver og tal. Byg kandidater af stykker af ordene, fx de første 2 bogstaver af navne plus et årstal. Hash dem med <code>hashlib.sha256</code> og sammenlign med <code>my_data[0]</code>.",
   why="<p>Model-svaret gætter kombinationen direkte og bekræfter den med hashen. Den forklarede løsning er mere generel: den bygger stykker af alle ord og tal, prøver alle kombinationer af 3 stykker på 8 tegn og sammenligner hashen. Det er sådan et ordbogsangreb med personlige oplysninger virker.</p>",
   annotated='''import hashlib
from itertools import permutations

target, info = my_data                  # udpak: (hash, liste med oplysninger)
pieces = []
for item in info:                       # gør listen flad: tuples pakkes ud
    if isinstance(item, tuple):
        pieces.extend(item)
    else:
        pieces.append(item)

parts = set()                           # stykker vi bygger passwords af
for p in pieces:
    for s in (p, p[:2], p[:4]):         # hele ordet, de første 2 og 4 tegn
        parts.add(s)
        parts.add(s.capitalize())       # også med stort forbogstav

result = None
for a, b, c in permutations(parts, 3):  # alle kombinationer af 3 forskellige stykker
    guess = a + b + c
    if len(guess) == 8 and hashlib.sha256(guess.encode()).hexdigest() == target:
        result = guess
        break
print(result)'''),
 26: dict(title="Det manglende lag", cat="Netværk", diff=1,
   hint="5-lagsmodellen: application, transport, ___, link, physical.",
   why="<p>Svaret er en string. Den forklarede løsning finder det med kode i stedet: den sammenligner med en liste over alle fem lag.</p>",
   annotated='''layers = ["application", "transport", "network", "link", "physical"]
given = [x.strip() for x in my_data.split(",")]  # ['application', 'transport', 'link', 'physical']
result = None
for layer in layers:
    if layer not in given:     # det lag der ikke står i data
        result = layer
print(result)'''),
 27: dict(title="Find MAC-adressen", cat="Netværk", diff=2,
   hint="Split på komma og fjern mellemrum med <code>.strip()</code>. En MAC-adresse har præcis 6 dele adskilt af <code>:</code>, og hver del er 2 hex-tegn.",
   why="<p>IPv6-adressen (<code>ff02::fb</code>) og de ugyldige adresser har også koloner, så det er ikke nok at tjekke for <code>:</code>. Man skal tjekke antallet af dele og længden af hver del.</p>",
   annotated='''result = None
for address in my_data.split(","):
    address = address.strip()                # fjern mellemrum omkring
    parts = address.split(":")
    if len(parts) == 6 and all(len(p) == 2 for p in parts):  # 6 dele á 2 tegn
        result = address
        break
print(result)'''),
 28: dict(title="Pakkens datalængde", cat="Wireshark", diff=3, pcap=True,
   hint="Åbn cap.pcapng i Wireshark og filtrér med <code>frame.number == 2020</code>. Find længden af payloaden (data efter headerne), fx <i>[TCP Segment Len]</i> eller <i>Data (N bytes)</i>.",
   why="<p>Datalængden er payloaden <i>efter</i> headerne, altså ikke hele framens længde. Svaret skal være en int.</p>"),
 29: dict(title="Ack-nummer for /style.css", cat="Wireshark", diff=3, pcap=True,
   hint="Filtrér med <code>http.request.uri == \"/style.css\"</code>, find den pakke, der kvitterer for filen, og kig på ACK-feltet. Wireshark viser relative numre som standard, så brug <i>Acknowledgment number (raw)</i>.",
   why="<p>Wireshark viser relative sequence- og ack-numre, der starter fra 0. Opgaven vil have det rå 32-bit tal fra headeren. Svaret skal være en int.</p>"),
 30: dict(title="Domænenavn for IP'en", cat="Wireshark", diff=3, pcap=True,
   hint="Find den DNS-response, der indeholder adressen, fx med filteret <code>dns.a == 74.125.143.189</code>, og læs navnet i Answers-sektionen.",
   why="<p>DNS-svaret (A-record) knytter domænenavnet til IP-adressen. Svaret er en string.</p>"),
 31: dict(title="Tyvenes etage og rum", cat="Puslespil", diff=3,
   hint="Start med <code>floor = 0</code> og <code>room = 0</code>, og løb tegnene igennem ét ad gangen. <code>^</code>/<code>v</code> ændrer etagen, <code>&lt;</code>/<code>&gt;</code> ændrer rummet. Svaret er en tuple.",
   why="<p>Det er et simpelt loop med if/elif. Kortere: etagen er <code>my_data.count('^') - my_data.count('v')</code>, og rummet beregnes på samme måde med <code>&gt;</code> og <code>&lt;</code>.</p>",
   annotated='''floor = 0
room = 0
for direction in my_data:      # ét tegn ad gangen
    if direction == "^":
        floor += 1
    elif direction == "v":
        floor -= 1
    elif direction == "<":
        room -= 1
    elif direction == ">":
        room += 1
result = (floor, room)         # svaret som tuple
print(result)'''),
 32: dict(title="Tyvene del 2: wrap og gentagelser", cat="Puslespil", diff=4,
   hint="Gem det forrige tegn og en tæller. Er tegnet det samme som før, lægges 1 til tælleren, ellers sættes den til 1. Rummene går fra 0 til 100, så brug <code>% 101</code> til at gå rundt.",
   why="<p>Pythons <code>%</code> giver et ikke-negativt resultat, når man dividerer med et positivt tal. Derfor er <code>(0 - 1) % 101 == 100</code>, og det er præcis den wrap-around, opgaven beskriver. Etagerne wrapper ikke.</p>",
   annotated='''floor = 0
room = 0
previous = ""
repeat = 0
for direction in my_data:
    if direction == previous:
        repeat += 1                     # samme som før: værdien stiger (1, 2, 3, ...)
    else:
        repeat = 1                      # nyt tegn: start forfra
    if direction == "^":
        floor += repeat
    elif direction == "v":
        floor -= repeat
    elif direction == "<":
        room = (room - repeat) % 101    # rum 0..100: % 101 wrapper rundt
    elif direction == ">":
        room = (room + repeat) % 101
    previous = direction
result = (floor, room)
print(result)'''),
 33: dict(title="Gang med 2", cat="Grundlag", diff=1,
   hint="Gang tallet med 2 og gem det i <code>result</code>.",
   why="<p><code>*</code> er gange. Svaret er en int.</p>",
   annotated='''result = my_data * 2  # * er gange
print(result)'''),
}
