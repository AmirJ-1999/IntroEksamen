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
css, data, gnet, gpy, extjs, accjs = rd('ext.css'), rd('data.js'), rd('guides_net.js'), rd('guides_py.js'), rd('ext.js'), rd('account.js')
quizjs, netlabjs, podvjs = rd('quiz_net.js'), rd('netlab.js'), rd('podvideo.js')
css += '\n' + rd('podvideo.css') + '\n' + rd('theme.css')
iconsjs = rd('icons.js')

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

# Mandatory opgave 1: question text, my_data and model solution come from the exam file;
# the expected answer is computed by running the model solution and only stored as a test.
from mandatory1_meta import M1, M1_SOURCE, PCAP_NOTE
from html import escape
def parse_mandatory(path):
    src = open(os.path.join(SCR, path), encoding='utf-8').read()
    blocks = re.split(r'^# Question (\d+): ', src, flags=re.M)[1:]
    out = []
    for num, body in zip(blocks[::2], blocks[1::2]):
        lines = body.rstrip('\n').split('\n')
        prompt = [lines.pop(0)]
        while lines and lines[0].startswith('#'):          # multi-line question text
            prompt.append(lines.pop(0)[1:].strip())
        start = next(i for i, l in enumerate(lines) if l.startswith('my_data ='))
        end = next(i for i in range(start, len(lines)) if not lines[i].strip())
        data_code = '\n'.join(lines[start:end])
        code = lines[end:]
        pr = next(i for i, l in enumerate(code) if l.strip() == 'print(result)')
        sol = '\n'.join(code[:pr]).strip('\n')
        imports = ''.join(s for k, s in (('hashlib', 'import hashlib\n'), ('product(', 'from itertools import product\n')) if k in sol)
        ns = {}
        exec(imports + data_code + '\n' + sol, ns)
        assert ns.get('result') is not None, 'no result for question ' + num
        out.append(dict(num=int(num), prompt=' '.join(prompt).strip(), data=data_code, imports=imports,
                        solution=sol, answer=repr(ns['result']), atype=type(ns['result']).__name__))
    return out
mand = []
for q in parse_mandatory(M1_SOURCE):
    n, m = q['num'], M1[q['num']]
    head = q['imports'] + ('\n' if q['imports'] else '') + q['data']
    req = (f'Gem svaret i variablen <code>result</code>. Svaret skal være af typen <code>{q["atype"]}</code>. '
           'Testen sammenligner med det rigtige svar uden at vise det. Brug <b>▶ Kør</b> for at se dit output.')
    if m.get('pcap'): req += '<br>' + PCAP_NOTE
    annotated = (q['data'] if 'import ' in m.get('annotated', '') else head) + '\n\n' + m.get('annotated', q['solution'] + '\nprint(result)')
    if 'annotated' in m:   # the explained solution must reach the same answer as the model solution
        ns = {'print': lambda *a, **k: None}
        exec(annotated, ns)
        assert repr(ns['result']) == q['answer'] or ns['result'] == eval(q['answer']), 'annotated answer differs for question %d' % n
    mand.append(dict(
        id=f'm1-{n:02d}', set='mandatory1', num=n, category=m['cat'], difficulty=m['diff'], title=m['title'],
        prompt=f'<span class="q-label">Question {n}</span>' + escape(q['prompt']),
        requirements=req, source=f'Mandatory opgave 1 · Question {n}',
        starter=head + '\n\n# Skriv din løsning her og gem svaret i result\nresult = None\n\nprint(result)\n',
        hint=m['hint'], why=m['why'],
        solution=head + '\n\n' + q['solution'] + '\n\nprint(result)',
        annotatedSolution=annotated,
        tests=[dict(name='Svar', answer=q['answer'], atype=q['atype'], setup=head,
                    expect=f'result skal være det rigtige svar (type {q["atype"]}).')]))
assert len(mand) == len(M1), (len(mand), len(M1))
media += 'const MANDATORY_1=' + json.dumps(mand, ensure_ascii=False) + ';\n'

boot = '''
syncSubject();
(function(){const g=new URLSearchParams(location.hash.slice(1)).get("guide");
 if(g&&GUIDES.some(x=>x.id===g))openGuide(g);else setView(currentView);})();
'''
script = '\n'.join([data, gnet, gpy, media, quizjs, podvjs, extjs, netlabjs, accjs, boot])
assert '</script' not in script.lower()

html = open(BASE, encoding='utf-8').read()
def rep(old, new, count=1):
    global html
    assert html.count(old) == count, (old, html.count(old))
    html = html.replace(old, new)

fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n')
rep('<title>', fonts + '<title>')
# icon() must exist before the page's own scripts and templates run
rep('</script>\n</head>', '</script>\n<script>\n' + iconsjs + '\n</script>\n</head>')
rep('</style>\n<script>', '\n' + css + '</style>\n<script>')
rep('<header class="topnav">', '<header class="topnav" id="topnav">')
account_ui = '''<div class="account-wrap">
    <button class="account-btn" id="accountBtn" aria-haspopup="true" aria-expanded="false"><i class="acc-dot"></i><i data-icon="user"></i><span>Log ind</span></button>
    <div class="account-menu" id="accountMenu" hidden></div>
  </div>
  '''
rep('<button class="download-btn" id="downloadOffline"', account_ui + '<button class="download-btn" id="downloadOffline"')
rep('<button class="navbtn active" data-view="home">Start</button>',
    '<button class="navbtn active" data-view="home">Start</button>\n    <button class="navbtn" data-view="learn">Lær</button>')
rep('<button class="navbtn" data-view="live">Python Lab</button>',
    '<button class="navbtn" data-view="live">Python Lab</button>\n    <button class="navbtn" data-view="netlab">Netværk Lab</button>\n    <button class="navbtn" data-view="podcasts">Podcasts</button>\n    <button class="navbtn" data-view="videos">Videoer</button>\n    <button class="navbtn nav-mobile-only" id="menuDownload"><i data-icon="download"></i>Download offline</button>')
rep('<button class="btn" id="randomLive"><i data-icon="shuffle"></i>Tilfældig opgave</button>',
    '<button class="btn" id="randomLive"><i data-icon="shuffle"></i>Tilfældig opgave</button>\n        <button class="btn primary" id="sandboxBtn"><i data-icon="flask"></i><span>Fri sandbox</span></button>')
rep('<div class="live-layout">', '<div class="live-layout" id="liveMain">')

sandbox = '''
    <section class="lab hidden" id="sandboxPanel">
      <div class="lab-head"><div class="meta"><span class="badge d2">Sandbox</span></div><h2>Fri Python-sandbox</h2>
        <p>Skriv og kør din egen kode, fx eksamensopgaverne. Når programmet kalder <code>input()</code>, skriver du svaret direkte i terminalen og trykker Enter. Ctrl+Enter kører. Koden gemmes i browseren.</p></div>
      <textarea class="code-input" id="sbCode" spellcheck="false" autocapitalize="off" aria-label="Din kode"></textarea>
      <div class="lab-bottom"><div class="group"><button class="btn run" id="sbRun"><i data-icon="play"></i>Kør</button><button class="btn" id="sbClear"><i data-icon="trash"></i>Ryd</button></div>
        <span class="lab-note">Kører Python 3 i browseren (Pyodide) · stoppes efter 10 sek.</span></div>
      <div class="results" id="sbOut" aria-live="polite"></div>
    </section>
'''
end_live = '</section>\n</main>'
assert html.count(end_live) == 1
views = '''
<section id="learnView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Lær · visuelt og interaktivt</div><h1 style="font-size:clamp(26px,3.4vw,40px)">Guides</h1>
    <p>Forklaringer med headers du kan klikke på, sekvensdiagrammer, beregnere og eksempler du kan køre. Vælg en guide i menuen.</p><div class="hero-stats" id="learnStats"></div></div></div>
  <select class="select guide-select" id="guideSelect" aria-label="Vælg guide"></select>
  <div class="learn-layout"><aside class="guide-nav" id="guideNav"></aside><div id="guideBody"></div></div>
</section>
<section id="podcastsView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Netværk · lyt og læs med</div><h1 style="font-size:clamp(26px,3.4vw,40px)">Podcasts</h1>
    <p>Fire samtaler om lagene (ca. 90 min i alt). Tryk på et tidsstempel i transskriptionen for at hoppe dertil — den aktuelle linje markeres, mens du lytter. Transskriptionerne er automatisk genereret og kan have stavefejl.</p><div class="hero-stats" id="podStats"></div></div></div>
  <div class="pod-overview" id="podOverview"></div>
  <div class="pod-list" id="podList"></div>
</section>
<section id="netlabView" class="hidden">
  <div class="live-head"><div class="live-title"><div class="eyebrow">Netværk · Test dig selv</div><h1>Netværk Lab</h1></div></div>
  <div id="nqBody"></div>
</section>
<section id="videosView" class="hidden">
  <div class="hero"><div><div class="eyebrow">Videoer</div><h1 id="videosTitle" style="font-size:clamp(26px,3.4vw,40px)">Videoer</h1><p id="videosIntro"></p></div></div>
  <div class="chips" id="videoChips" style="margin-bottom:6px"></div>
  <div id="videoList"></div>
</section>
'''
html = html.replace(end_live, sandbox + end_live, 1)
html = html.replace('</main>', views + '</main>', 1)
account_dialog = '''
<dialog class="account-dialog" id="accountDialog" data-mode="login" aria-labelledby="accTitle">
  <form id="accForm" method="dialog" novalidate>
    <button type="button" class="acc-close" id="accClose" aria-label="Luk"><i data-icon="x"></i></button>
    <h2 id="accTitle">Din konto</h2>
    <div class="acc-tabs" role="tablist"><button type="button" class="acc-tab" role="tab" data-mode="login">Log ind</button><button type="button" class="acc-tab" role="tab" data-mode="register">Opret konto</button></div>
    <p class="acc-intro" id="accIntro"></p>
    <label for="accUser">Brugernavn</label>
    <input class="input" id="accUser" name="username" autocomplete="username" autocapitalize="off" spellcheck="false" required minlength="3" maxlength="32">
    <label for="accPass">Password</label>
    <input class="input" id="accPass" name="password" type="password" autocomplete="current-password" required minlength="4">
    <p class="acc-error" id="accError" role="alert"></p>
    <button class="btn primary acc-submit" id="accSubmit" type="submit">Log ind</button>
    <p class="acc-fine">En simpel studiekonto, der synkroniserer din fremgang. Brug ikke et password, du også bruger andre steder.</p>
  </form>
</dialog>
'''
html = html.replace('</main>', '</main>' + account_dialog, 1)
rep('</script>\n</body>', '</script>\n<script>\n' + script + '\n</script>\n</body>')
open(OUT, 'w', encoding='utf-8', newline='').write(html)
print('ok', len(html), 'bytes ·', len(vids), 'videos ·', sum(len(p['lines']) for p in pods), 'transcript lines')
