"""Rebuild index.html: python build.py ../index.html"""
import json, os, re, sys
EXT = os.path.dirname(os.path.abspath(__file__))
SCR = EXT  # all inputs live next to this script
BASE = os.path.join(SCR, 'base_v7.html')
OUT = sys.argv[1]
TRANS = os.path.join(SCR, 'transcripts')
sys.path.insert(0, EXT)
from media_meta import VIDEOS, VIDEO_GROUPS, PODCASTS

rd = lambda n: open(os.path.join(EXT, n), encoding='utf-8').read()
css, data, gnet, gpy, extjs = rd('ext.css'), rd('data.js'), rd('guides_net.js'), rd('guides_py.js'), rd('ext.js')

# Python-guides: every backslash is meant literally (code shown/run as Python)
gpy = gpy.replace('\\', '\\\\')
# Netværk-guides: only intentional escapes are "\\r\\n"-style; refuse lone backslashes
lone = re.findall(r'(?<!\\)\\(?![\\])', gnet)
assert not lone, 'lone backslash in guides_net.js'

# media
oe = json.load(open(os.path.join(SCR, 'oembed.json'), encoding='utf-8'))
vids = []
for vid, subj, grp, ln, note in VIDEOS:
    o = oe[vid]; assert o['ok'], vid
    vids.append(dict(id=vid, subject=subj, group=grp, len=ln, note=note, title=o['title'], author=o['author']))
pods = []
for p in PODCASTS:
    lines = []
    for l in open(os.path.join(TRANS, p['src'] + '.txt'), encoding='utf-8'):
        m = re.match(r'\[(\d+):(\d+)\]\s*(.*)', l.strip())
        if m and m.group(3):
            lines.append([int(m.group(1)) * 60 + int(m.group(2)), m.group(3)])
    q = {k: v for k, v in p.items() if k != 'src'}
    q['lines'] = lines
    q['mins'] = round(lines[-1][0] / 60)
    pods.append(q)
media = ('const VIDEOS=' + json.dumps(vids, ensure_ascii=False) + ';\n'
         'const VIDEO_GROUPS=' + json.dumps(VIDEO_GROUPS, ensure_ascii=False) + ';\n'
         'const PODCASTS=' + json.dumps(pods, ensure_ascii=False) + ';\n')

boot = '''
syncSubject();
(function(){const g=new URLSearchParams(location.hash.slice(1)).get("guide");
 if(g&&GUIDES.some(x=>x.id===g))openGuide(g);else setView(currentView);})();
'''
script = '\n'.join([data, gnet, gpy, media, extjs, boot])
assert '</script' not in script.lower()

html = open(BASE, encoding='utf-8').read()
def rep(old, new, count=1):
    global html
    assert html.count(old) == count, (old, html.count(old))
    html = html.replace(old, new)

rep('</style>\n<script>', '\n' + css + '</style>\n<script>')
rep('<header class="topnav">', '<header class="topnav" id="topnav">')
rep('<button class="navbtn active" data-view="home">Start</button>',
    '<button class="navbtn active" data-view="home">Start</button>\n    <button class="navbtn" data-view="learn">Lær</button>')
rep('<button class="navbtn" data-view="live">Live Coding</button>',
    '<button class="navbtn" data-view="live">Live Coding</button>\n    <button class="navbtn" data-view="podcasts">Podcasts</button>\n    <button class="navbtn" data-view="videos">Videoer</button>')
rep('<button class="btn" id="randomLive">Tilfældig opgave</button>',
    '<button class="btn" id="randomLive">Tilfældig opgave</button>\n        <button class="btn primary" id="sandboxBtn">🧪 Fri sandbox</button>')
rep('<div class="live-layout">', '<div class="live-layout" id="liveMain">')

sandbox = '''
    <section class="lab hidden" id="sandboxPanel">
      <div class="lab-head"><div class="meta"><span class="badge d2">Sandbox</span></div><h2>Fri Python-sandbox</h2>
        <p>Skriv og kør din egen kode — fx eksamensopgaverne. <code>input()</code> læser fra feltet til højre (én linje pr. kald). Ctrl+Enter kører. Koden gemmes i browseren.</p></div>
      <div class="sandbox-io">
        <textarea class="code-input" id="sbCode" spellcheck="false" autocapitalize="off"></textarea>
        <div class="sandbox-side"><label>Input (én linje pr. input())</label><textarea id="sbInput" spellcheck="false" placeholder="25"></textarea>
          <label>Output</label><pre class="sandbox-out" id="sbOut">Tryk ▶ Kør for at se output.</pre></div>
      </div>
      <div class="lab-bottom"><div class="group"><button class="btn primary" id="sbRun">▶ Kør</button><button class="btn" id="sbClear">Ryd</button></div>
        <span style="font-size:10px;color:var(--muted)">Kører Python 3 i browseren (Pyodide) · stoppes efter 8 sek.</span></div>
    </section>
'''
end_live = '</section>\n</main>'
assert html.count(end_live) == 1
views = '''
<section id="learnView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Lær · visuelt og interaktivt</div><h1 style="font-size:clamp(26px,3.4vw,40px)">Guides</h1>
    <p>Forklaringer med headers du kan klikke på, sekvensdiagrammer, beregnere og eksempler du kan køre. Vælg en guide i menuen.</p></div></div>
  <select class="select guide-select" id="guideSelect" aria-label="Vælg guide"></select>
  <div class="learn-layout"><aside class="guide-nav" id="guideNav"></aside><div id="guideBody"></div></div>
</section>
<section id="podcastsView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Netværk · lyt og læs med</div><h1 style="font-size:clamp(26px,3.4vw,40px)">Podcasts</h1>
    <p>Fire samtaler om lagene (ca. 90 min i alt). Tryk på et tidsstempel i transskriptionen for at hoppe dertil — den aktuelle linje markeres, mens du lytter. Transskriptionerne er automatisk genereret og kan have stavefejl.</p></div></div>
  <div class="pod-list" id="podList"></div>
</section>
<section id="videosView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Videoer</div><h1 id="videosTitle" style="font-size:clamp(26px,3.4vw,40px)">Videoer</h1><p id="videosIntro"></p></div></div>
  <div class="chips" id="videoChips" style="margin-bottom:6px"></div>
  <div id="videoList"></div>
</section>
'''
html = html.replace(end_live, sandbox + end_live, 1)
html = html.replace('</main>', views + '</main>', 1)
rep('</script>\n</body>', '</script>\n<script>\n' + script + '\n</script>\n</body>')
open(OUT, 'w', encoding='utf-8', newline='').write(html)
print('ok', len(html), 'bytes ·', len(vids), 'videos ·', sum(len(p['lines']) for p in pods), 'transcript lines')
