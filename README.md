# IntroEksamen — Study Lab

Studieside til eksamen i *Introduction to IT-Security* (Python + Netværk).

**Åbn siden:** https://amirj-1999.github.io/IntroEksamen/

| Del | Indhold |
|---|---|
| **Lær** | 33 visuelle guides: klikbare headers (Ethernet, ARP, IPv4, IPv6, ICMP, TCP, UDP, DNS), sekvensdiagrammer (handshake, SACK, DORA, ARP, DNS, traceroute, RTS/CTS, sockets), subnet-, fragmenterings- og checksum-beregnere, slicing-/range-visualizer, Caesar-værksted, eksamens-tjeklister og et header-galleri |
| **Flashcards** | 194 kort med let og teknisk forklaring |
| **Python Lab** | 70 live-coding-opgaver med automatiske tests + en fri Python-sandbox (Pyodide i browseren) |
| **Podcasts** | 4 netværks-afsnit (ca. 90 min) med klikbar transskription |
| **Videoer** | 46 udvalgte videoer (Jim Kurose, Ben Eater, Practical Networking, Corey Schafer, NetworkChuck og Daniels Wireshark-serie) |

- **Download offline** (knappen øverst): gemmer hele siden som én HTML-fil. Guides, flashcards og transskriptioner virker uden internet; Python-motoren, lyd og videoer kræver internet.
- Fremgang og afkrydsninger gemmes lokalt i din browser.
- Podcasts og transskriptioner er AI-genererede/automatiske og kan indeholde unøjagtigheder.

## Kildekode

`index.html` er bygget af filerne i `src/`: `base_v7.html` (flashcards + live coding) plus guides (`guides_net.js`, `guides_py.js`), diagrammer og værktøjer (`data.js`, `ext.js`, `ext.css`) og medie-data (`media_meta.py`, `oembed.json`, `transcripts/`). Genbyg med:

```bash
cd src
python build.py ../index.html
```
