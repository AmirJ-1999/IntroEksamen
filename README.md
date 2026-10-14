# IntroEksamen — Study Lab

Studieside til eksamen i *Introduction to IT-Security* (Python + Netværk).

**Åbn siden:** https://amirj-1999.github.io/IntroEksamen/

| Del | Indhold |
|---|---|
| **Dagens plan** | Øverst på forsiden: dagens mål på tværs af fagene (repetér dagens flashcards, løs en Python-opgave, besvar 10 spørgsmål i Netværk Lab, og valgfrit en prøveeksamen), med næste Python-opgave, dit svageste netværksemne, en streak og de sidste 7 dage. Følger kontoen |
| **Lær** | 33 visuelle guides: klikbare headers (Ethernet, ARP, IPv4, IPv6, ICMP, TCP, UDP, DNS), sekvensdiagrammer (handshake, SACK, DORA, ARP, DNS, traceroute, RTS/CTS, sockets), subnet-, fragmenterings- og checksum-beregnere, slicing-/range-visualizer, Caesar-værksted, eksamens-tjeklister og et header-galleri |
| **Flashcards** | 194 kort med let og teknisk forklaring. **Spaced repetition**: Kan / Usikker / Øv igen bestemmer, hvornår kortet kommer igen (knapperne viser hvornår), og *Dagens session* på forsiden samler dagens repetitioner + 10 nye kort |
| **Prøveeksamen** | Eksamen som den foregår, på ét ur (20 min, eller 10 min for én del, eller uden tidsgrænse). **Python**: et af 6 forløb, hvor hver opgave bygger videre på koden fra den forrige, med tests og "forklar din kode"-spørgsmål. **Netværk**: forklar 5-lagsmodellen, så trækker eksaminator et lag, og du får headeren + to spørgsmål og tjekker dig selv mod en liste over, hvad et godt svar indeholder. Resultat med score, model-løsninger, manglende punkter og links til hvor du skal øve; tidligere forsøg gemmes |
| **Python Lab** | To opgavesæt med automatiske tests: **Øvelser** (70 live-coding-opgaver) og **Mandatory opgave 1** (33 spørgsmål; svaret vises aldrig, men der er hint, model-svar og forklaret løsning). **▶ Kør** viser dit output og letlæselige fejl (type, linje, dansk forklaring). Kode-editoren har farver på koden, linjenumre (fejllinjen markeres rødt), automatisk indrykning efter `:`, parenteser og anførselstegn der lukker sig selv, Tab/Shift+Tab på flere linjer og Ctrl+/ til at kommentere. Plus en fri Python-sandbox (Pyodide i browseren) |
| **Netværk Lab** | Multiple choice pr. lag (Grundlag, Application, Transport, Network, Link & WiFi, Wireshark): ca. 520 spørgsmål. Hvad hedder det markerede felt, peg på feltet i headeren, hvad bruges feltet til, feltstørrelser, hvad mangler i sekvensdiagrammet, sæt trin i rækkefølge, og subnet-, fragmenterings- og seq/ack-beregninger med nye tal hver gang. Forklaring efter hvert svar, eksamensøvelse med 20 blandede og "Øv svage punkter" |
| **Podcasts** | 4 netværks-afsnit (ca. 90 min) med live undertekster og klikbar transskription. Alle fire afsnit kan også ses som **video**: ca. 100 visuelle scener synkroniseret med forklaringen (lagmodel, indkapsling, headere der lyser op felt for felt, handshake og seq/ack, SACK, DHCP/DORA, NAT, TTL, traceroute, CIDR, ARP, Ethernet-framen, CSMA og hidden terminal m.m.), med kapitler og fuld skærm. Vælg *Video* eller *Kun lyd* |
| **Videoer** | 46 udvalgte videoer (Jim Kurose, Ben Eater, Practical Networking, Corey Schafer, NetworkChuck og Daniels Wireshark-serie) |

- **Søg i alt** med **Ctrl+K** (⌘K på Mac) eller **/**, eller via søgefeltet i fag-bjælken (søgeikonet i topmenuen på mobil): guides og deres afsnit, flashcards, Python-opgaver, Netværk Lab-emner, podcast-transskriptioner (hopper til tidspunktet), videoer og sider. Filtrér på type, brug piletasterne og Enter.
- **Installer som app** (PWA): banneret på forsiden eller browserens installer-knap (Chrome/Edge på computer og Android). På iPhone/iPad: Del → *Føj til hjemmeskærm*. Appen åbner i sit eget vindue, virker offline (siden caches; Python-motoren caches første gang den bruges), og et langt tryk på ikonet giver genveje til Dagens session, Prøveeksamen, Python Lab og Søg.
- **Download offline** (knappen øverst): gemmer hele siden som én HTML-fil. Guides, flashcards og transskriptioner virker uden internet; Python-motoren, lyd og videoer kræver internet.
- Fremgang og afkrydsninger gemmes lokalt i din browser. Med en **konto** (knappen øverst: brugernavn + password) følger fremgangen kontoen på tværs af enheder: flashcard-status, gemte kort, Python Lab-fremgang og kode, tjeklister m.m. Browseren og kontoen har hver sin fremgang: Når du logger ind, lægges browserens egen fremgang til side, og når du logger ud, vises den igen. En ny konto starter med en kopi af browserens fremgang. Temaet forbliver pr. enhed: **Lys**, **Mørk** eller **Auto** (standard), som følger enhedens lyse/mørke indstilling og skifter med den. På mobil skifter tema-knappen mellem de tre.
- Podcasts og transskriptioner er AI-genererede/automatiske og kan indeholde unøjagtigheder.

## Kildekode

`index.html` er bygget af filerne i `src/`: `base_v7.html` (flashcards + live coding) plus guides (`guides_net.js`, `guides_py.js`), diagrammer og værktøjer (`data.js`, `ext.js`, `ext.css`) og medie-data (`media_meta.py`, `oembed.json`, `transcripts/`). Appen (PWA) ligger i `pwa.js`; build-scriptet skriver også `manifest.webmanifest` og `sw.js` (fra `sw_template.js`, med en ny cache-version for hvert build), og ikonerne ligger i `icons/`. Søgningen ligger i `search.js`, kode-editoren i `editor.js`, Dagens plan og aktivitetsloggen i `plan.js`, spaced repetition i `srs.js`, prøveeksamen i `exam.js` med indholdet (Python-forløb med tests, netværksspørgsmål med tjeklister) i `exam_data.js`. Videopodcasten ligger i `podvideo.js` (scener med tidsstempler pr. afsnit + renderere) og `podvideo.css`. Designet (lyst og mørkt tema, sideovergange og hover-animationer) ligger i `theme.css`, og ikonerne er SVG'er i `icons.js` (`icon("navn")` i JS eller `<i data-icon="navn"></i>` i markup). Netværk Lab består af `quiz_net.js` (spørgsmålsbank, header-ledetråde og rækkefølger) og `netlab.js` (motoren, der også genererer spørgsmål fra headerne og diagrammerne i `data.js`). Mandatory opgave 1 læses fra `mandatory/Python_Exam_All_33_Questions.py` (spørgsmål, `my_data` og model-svar). Titler, hints og forklaringer ligger i `mandatory1_meta.py`. Build-scriptet kører model-svarene for at finde de rigtige svar og tjekker, at hver forklaret løsning giver samme svar. Genbyg med:

```bash
cd src
python build.py ../index.html
```

## Konto og synkronisering

Kontoerne kører på en lille Cloudflare Worker i `sync-worker/` med en D1-database (gratis plan): https://studylab-sync.amirjawad79.workers.dev

- Én række pr. bruger: brugernavn, PBKDF2-hashet password og al fremgang som én JSON-blok (siden `localStorage`-nøglerne `its_*`).
- Hver gemning øger et revisionsnummer. Har en anden enhed gemt imellem, svarer API'en `409`, og siden fletter de to versioner sammen og prøver igen.
- Klientkoden ligger i `src/account.js`.

```bash
cd sync-worker
npm install
npx wrangler deploy
```

Nye migrationer i `sync-worker/migrations/` anvendes med `npm run migrate`. Til lokal test: `npx wrangler dev`, og sæt `localStorage.its_dev_api = "http://127.0.0.1:8787"` på siden.
