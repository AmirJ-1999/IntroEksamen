# IntroEksamen — Study Lab

Studieside til eksamen i *Introduction to IT-Security* (Python + Netværk).

**Åbn siden:** https://amirj-1999.github.io/IntroEksamen/

| Del | Indhold |
|---|---|
| **Lær** | 33 visuelle guides: klikbare headers (Ethernet, ARP, IPv4, IPv6, ICMP, TCP, UDP, DNS), sekvensdiagrammer (handshake, SACK, DORA, ARP, DNS, traceroute, RTS/CTS, sockets), subnet-, fragmenterings- og checksum-beregnere, slicing-/range-visualizer, Caesar-værksted, eksamens-tjeklister og et header-galleri |
| **Flashcards** | 194 kort med let og teknisk forklaring |
| **Python Lab** | To opgavesæt med automatiske tests: **Øvelser** (70 live-coding-opgaver) og **Mandatory opgave 1** (33 spørgsmål; svaret vises aldrig, men der er hint, model-svar og forklaret løsning). **▶ Kør** viser dit output og letlæselige fejl (type, linje, dansk forklaring). Plus en fri Python-sandbox (Pyodide i browseren) |
| **Netværk Lab** | Multiple choice pr. lag (Grundlag, Application, Transport, Network, Link & WiFi, Wireshark): ca. 520 spørgsmål. Hvad hedder det markerede felt, peg på feltet i headeren, hvad bruges feltet til, feltstørrelser, hvad mangler i sekvensdiagrammet, sæt trin i rækkefølge, og subnet-, fragmenterings- og seq/ack-beregninger med nye tal hver gang. Forklaring efter hvert svar, eksamensøvelse med 20 blandede og "Øv svage punkter" |
| **Podcasts** | 4 netværks-afsnit (ca. 90 min) med live undertekster og klikbar transskription. Alle fire afsnit kan også ses som **video**: ca. 100 visuelle scener synkroniseret med forklaringen (lagmodel, indkapsling, headere der lyser op felt for felt, handshake og seq/ack, SACK, DHCP/DORA, NAT, TTL, traceroute, CIDR, ARP, Ethernet-framen, CSMA og hidden terminal m.m.), med kapitler og fuld skærm. Vælg *Video* eller *Kun lyd* |
| **Videoer** | 46 udvalgte videoer (Jim Kurose, Ben Eater, Practical Networking, Corey Schafer, NetworkChuck og Daniels Wireshark-serie) |

- **Download offline** (knappen øverst): gemmer hele siden som én HTML-fil. Guides, flashcards og transskriptioner virker uden internet; Python-motoren, lyd og videoer kræver internet.
- Fremgang og afkrydsninger gemmes lokalt i din browser. Med en **konto** (knappen øverst: brugernavn + password) følger fremgangen kontoen på tværs af enheder: flashcard-status, gemte kort, Python Lab-fremgang og kode, tjeklister m.m. Browseren og kontoen har hver sin fremgang: Når du logger ind, lægges browserens egen fremgang til side, og når du logger ud, vises den igen. En ny konto starter med en kopi af browserens fremgang. Temaet forbliver pr. enhed.
- Podcasts og transskriptioner er AI-genererede/automatiske og kan indeholde unøjagtigheder.

## Kildekode

`index.html` er bygget af filerne i `src/`: `base_v7.html` (flashcards + live coding) plus guides (`guides_net.js`, `guides_py.js`), diagrammer og værktøjer (`data.js`, `ext.js`, `ext.css`) og medie-data (`media_meta.py`, `oembed.json`, `transcripts/`). Videopodcasten ligger i `podvideo.js` (scener med tidsstempler pr. afsnit + renderere) og `podvideo.css`. Netværk Lab består af `quiz_net.js` (spørgsmålsbank, header-ledetråde og rækkefølger) og `netlab.js` (motoren, der også genererer spørgsmål fra headerne og diagrammerne i `data.js`). Mandatory opgave 1 læses fra `mandatory/Python_Exam_All_33_Questions.py` (spørgsmål, `my_data` og model-svar). Titler, hints og forklaringer ligger i `mandatory1_meta.py`. Build-scriptet kører model-svarene for at finde de rigtige svar og tjekker, at hver forklaret løsning giver samme svar. Genbyg med:

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
