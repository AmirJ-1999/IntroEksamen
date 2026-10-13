/* ===== Python-guides ===== */
const P="Python";
GUIDES.push(
{id:"py-exam",subject:P,group:"Eksamen",title:"Sådan foregår Python-eksamen",mins:7,tools:"tjekliste",cards:["Samlede øvelser"],live:"Samlede øvelser",
lead:"Live coding på din egen laptop: én lille opgave ad gangen, som bygger videre på den forrige. Det handler om at gøre det korrekt uden for meget hjælp — og at nå langt.",
html:`<div class="g-grid"><div class="g-card"><h4>Format</h4><p>Mundtlig, individuel, op til 20 min for begge dele. Du vælger selv, om du starter med Python eller Netværk.</p></div>
<div class="g-card"><h4>Tilladt</h4><p>Din egen laptop, valgfri IDE, Google — men tiden er knap. Slå Copilot fra, når du øver.</p></div>
<div class="g-card"><h4>Før eksamen</h4><p>Tjek at <code>python3</code> virker, at du kan koble til projektoren, og mød 1 time før.</p></div></div>
<div class="g-box exam"><b class="t">Forstå frem for at huske</b><p>Når du skriver <code>for i in range(10): print(i)</code>, så kunne forklare: Hvad er <code>for</code>? Hvad er <code>i</code>? Hvorfor <code>in</code>? Hvad giver <code>range(10)</code>? Hvorfor kolon? Hvorfor er <code>print</code> rykket ind?</p></div>
<h2>Sådan udvikler en opgave sig (rigtige eksempler)</h2>
<div class="ladder">
<div><p>Lav en funktion, der lægger to tal sammen.</p><pre data-run><code>def my_function(x, y):
    z = x + y
    return z

print(my_function(2, 3))</code></pre></div>
<div><p>“Hvad sker der, hvis <code>return</code> mangler?” → funktionen returnerer <code>None</code>.</p></div>
<div><p>Udvid, så den tager et vilkårligt antal tal (<code>*args</code>).</p><pre data-run><code>def my_function(*args):
    number = 0
    for i in args:
        number += i
    return number

new_var = my_function(1, 2, 3, 4)
print(new_var)</code></pre></div>
<div><p>Skriv resultatet til en fil.</p><pre data-run><code>new_var = 10
with open("text.txt", "w") as file:
    file.write(str(new_var))     # write() kræver str
print(open("text.txt").read())</code></pre></div></div>
<h2>Andre opgaver fra eksamensbordet</h2><table class="g-table"><tr><th>Opgave</th><th>Emner</th></tr>
<tr><td>Skriv input i en løkke til en log-fil, indtil “exit”; lav liste 100–200</td><td>while, input, filer, range, append</td></tr>
<tr><td>Funktion der lægger strenge sammen → *args → skriv til fil</td><td>funktioner, *args, filer</td></tr>
<tr><td>Dict med navn + alder fra input, loop over values, skriv til fil</td><td>dict, casting, .items()/.values(), filer</td></tr>
<tr><td>Navn som string → split → efternavn baglæns → forklar step -2</td><td>split, indexing, slicing</td></tr>
<tr><td>Tomt dict — bevis at det er et dict</td><td>type()</td></tr><tr><td>“Læs op på args og kwargs”</td><td>*args, **kwargs</td></tr></table>
<h2>Tjekliste</h2><div data-chk="python"></div>`},

{id:"py-run",subject:P,group:"Grundlag",title:"Kør Python og brug terminalen",mins:6,videos:["gd7BXuUQ91w","VbEx7B_PTOE"],cards:["Linux & terminal","Grundlag"],
lead:"Til eksamen kan du blive bedt om at lave eller finde en fil — så terminalen skal sidde. Forstå hvad du beder computeren om.",
html:`<h2>REPL vs script</h2><table class="g-table"><tr><th>REPL</th><th>Script</th></tr><tr><td><code>python3</code> → <code>&gt;&gt;&gt;</code> prompt. Én linje ad gangen, godt til at prøve ting. <code>exit()</code> eller Ctrl+D lukker.</td><td>Kode i en <code>.py</code>-fil. Køres med <code>python3 fil.py</code> — eller <code>./fil.py</code> efter shebang og <code>chmod +x</code>.</td></tr></table>
<pre><code>nano hello.py             # skriv koden
python3 hello.py          # kør den

#!/usr/bin/env python3    # shebang: første linje i filen
chmod +x hello.py         # gør filen kørbar
./hello.py                # kør direkte</code></pre>
<h2>De vigtigste kommandoer</h2><table class="g-table"><tr><th>Kommando</th><th>Gør</th><th>Kommando</th><th>Gør</th></tr>
<tr><td><code>pwd</code></td><td>hvor står jeg?</td><td><code>cat fil</code></td><td>vis hele filen</td></tr>
<tr><td><code>ls -la</code></td><td>indhold (inkl. skjulte)</td><td><code>less fil</code></td><td>blad i lang fil (q = luk)</td></tr>
<tr><td><code>cd mappe</code> · <code>cd ..</code> · <code>cd ~</code></td><td>skift mappe / op / hjem</td><td><code>grep -i "error" log.txt</code></td><td>find tekst i filer</td></tr>
<tr><td><code>mkdir mappe</code></td><td>opret mappe</td><td><code>find . -name "*.py"</code></td><td>find filer</td></tr>
<tr><td><code>touch fil.txt</code></td><td>opret tom fil</td><td><code>man ls</code></td><td>manualen</td></tr>
<tr><td><code>cp a b</code> · <code>mv a b</code></td><td>kopiér · flyt/omdøb</td><td><code>echo "hej" &gt; f</code></td><td>skriv (overskriv)</td></tr>
<tr><td><code>rm fil</code> · <code>rm -r mappe</code></td><td>slet (ingen papirkurv!)</td><td><code>echo "hej" &gt;&gt; f</code></td><td>tilføj nederst</td></tr>
<tr><td><code>hostname</code></td><td>maskinens navn</td><td><code>sudo</code></td><td>kør som root — pas på</td></tr></table>
<div class="g-box analogy"><b class="t">Bro til Python</b><p><code>&gt;</code> svarer til <code>open(f, 'w')</code> og <code>&gt;&gt;</code> til <code>open(f, 'a')</code>.</p></div>
<h2>Kommandolinje-argumenter</h2><pre><code>python3 myscript.py 07 Monday September

import sys
print(sys.argv)     # ['myscript.py', '07', 'Monday', 'September']  — altid strings
print(sys.argv[1])  # '07'   (index 0 er scriptnavnet)</code></pre>`},

{id:"py-types",subject:P,group:"Grundlag",title:"Variabler, datatyper og operatorer",mins:7,videos:["k9TUPpGqYTo"],cards:["Grundlag"],live:"Grundlag",
lead:"Python er dynamisk typet: et navn peger på et objekt, og det er objektet, der har en type.",
html:`<table class="g-table"><tr><th>Type</th><th>Eksempel</th><th>Mutable?</th><th>Ordnet / index?</th><th>Bruges til</th></tr>
<tr><td><code>int</code></td><td><code>443</code></td><td>nej</td><td>—</td><td>heltal</td></tr><tr><td><code>float</code></td><td><code>2.5</code></td><td>nej</td><td>—</td><td>decimaltal</td></tr>
<tr><td><code>str</code></td><td><code>'hello'</code></td><td>nej</td><td>ja</td><td>tekst</td></tr><tr><td><code>bool</code></td><td><code>True</code></td><td>nej</td><td>—</td><td>sandt/falsk (opfører sig som 1/0)</td></tr>
<tr><td><code>NoneType</code></td><td><code>None</code></td><td>nej</td><td>—</td><td>“ingen værdi” — fx funktion uden return</td></tr>
<tr><td><code>list</code></td><td><code>[1, 'two', 3.0]</code></td><td><b>ja</b></td><td>ja</td><td>samling der ændres</td></tr><tr><td><code>tuple</code></td><td><code>(45, 16, 2)</code></td><td>nej</td><td>ja</td><td>låst samling</td></tr>
<tr><td><code>dict</code></td><td><code>{'bob': 12}</code></td><td><b>ja</b></td><td>nøgler</td><td>opslag key → value</td></tr><tr><td><code>set</code></td><td><code>{1, 2, 3}</code></td><td><b>ja</b></td><td>nej</td><td>unikke værdier</td></tr></table>
<pre data-run><code>x = "443"
print(type(x))      # &lt;class 'str'&gt;
x = int(x)          # samme navn, ny type
print(type(x), x + 1)
print(type({}), type(None))</code></pre>
<h2>input() giver altid en string</h2><pre data-run="25"><code>age = int(input("Enter your age: "))   # cast!
print("You will be", age + 100, "in 100 years")
print("In the year", 2026 + 100 - age, "you will be 100")</code></pre>
<div class="g-box warn"><b class="t">Klassisk fejl</b><p>Uden <code>int()</code>: <code>"25" + 100</code> → <code>TypeError</code>. Ugyldigt tal: <code>int("abc")</code> → <code>ValueError</code>.</p></div>
<h2>Operatorer</h2><table class="g-table"><tr><th>Udtryk</th><th>Resultat</th><th>Betydning</th></tr><tr><td><code>5 / 2</code></td><td>2.5</td><td>division (altid float)</td></tr><tr><td><code>5 // 2</code></td><td>2</td><td>heltalsdivision</td></tr>
<tr><td><code>5 % 2</code></td><td>1</td><td>rest (modulus) — lige/ulige</td></tr><tr><td><code>2 ** 3</code></td><td>8</td><td>potens</td></tr><tr><td><code>10 &lt; x &lt; 20</code></td><td>bool</td><td>kædet sammenligning</td></tr><tr><td><code>and or not</code></td><td>bool</td><td>logik</td></tr></table>
<h2>Udskrivning</h2><pre data-run><code>name, port = "web", 443
print("port is", port)                 # mellemrum mellem argumenter
print(f"{name} kører på {port}")        # f-string
print("a", "b", "c", sep="|", end="!\n")</code></pre>`},

{id:"py-strings",subject:P,group:"Datastrukturer",title:"Strings, indexing og slicing",mins:8,tools:"slicing-visualizer",videos:["k9TUPpGqYTo","ajrtAuDg3yw"],cards:["Strings"],live:"Strings",
lead:"En string er en uforanderlig række tegn. Index starter ved 0, negative index tæller bagfra, og slicing er [start:stop:step] med stop ekskluderet.",
html:`<div data-viz="slice"></div>
<h2>Reglerne</h2><ul><li><code>s[0]</code> første tegn · <code>s[-1]</code> sidste</li><li><code>s[1:4]</code> index 1, 2, 3 — <b>stop er aldrig med</b></li><li>Udeladt start/stop = fra begyndelsen / til enden</li><li><code>s[::-1]</code> baglæns · <code>s[::-2]</code> baglæns, hvert andet tegn</li></ul>
<div class="g-box exam"><b class="t">Fra eksamen (EX 5)</b><p>“Forklar stepping, og hvad der sker med -2 i stedet for -1”: step bestemmer retning <i>og</i> spring. <code>'Kolbye'[::-1]</code> = <code>'eybloK'</code>, <code>'Kolbye'[::-2]</code> = <code>'ebo'</code> (index 5, 3, 1).</p></div>
<pre data-run><code>my_name = "Mads Kolbye"
list_name = my_name.split()      # ['Mads', 'Kolbye']
last_name = list_name[1]
print(last_name[::-1], last_name[::-2])

ip_port = "192.168.0.1:443"
ip, port = ip_port.split(":")
print(ip, int(port) + 1)</code></pre>
<h2>Metoder (returnerer en NY string)</h2><table class="g-table"><tr><th>Metode</th><th>Resultat</th></tr><tr><td><code>'bob'.upper()</code> · <code>.lower()</code> · <code>.title()</code></td><td>'BOB' · 'bob' · 'Bob'</td></tr>
<tr><td><code>'  hi \n'.strip()</code></td><td>'hi'</td></tr><tr><td><code>'HTTP x'.replace('HTTP','HTTPS')</code></td><td>'HTTPS x'</td></tr><tr><td><code>'a b c'.split()</code></td><td>['a', 'b', 'c']</td></tr><tr><td><code>'::'.join(['a','b'])</code></td><td>'a::b'</td></tr><tr><td><code>len('hello')</code> · <code>'ell' in 'hello'</code></td><td>5 · True</td></tr></table>
<div class="g-box warn"><b class="t">Immutable</b><p><code>s[0] = 'H'</code> giver TypeError. Lav en ny string: <code>s = 'H' + s[1:]</code>. Og <code>l.title()</code> på en <i>liste</i> giver AttributeError — kald metoden på elementet: <code>l[1].title()</code>.</p></div>
<h2>Escape-sekvenser</h2><p><code>'C:\test\new.doc'</code> indeholder en tab (<code>\t</code>) og et linjeskift (<code>\n</code>)! Brug <code>r'C:\test\new.doc'</code> eller dobbelte backslashes.</p>`},

{id:"py-collections",subject:P,group:"Datastrukturer",title:"Lists, tuples, sets og dictionaries",mins:10,videos:["W8KRzm-HUcc","daefaLgNkw0"],cards:["Lists","Tuples","Sets","Dictionaries"],live:"Lists",
lead:"Fire samlinger med hver sin styrke. Vælg ud fra: skal den ændres? er rækkefølgen vigtig? skal jeg slå op på en nøgle? må der være dubletter?",
html:`<div class="g-grid"><div class="g-card"><h4>list <code>[ ]</code></h4><p>Ordnet, mutable, dubletter OK. “Indkøbsliste med numre.”</p></div><div class="g-card"><h4>tuple <code>( )</code></h4><p>Ordnet, <b>immutable</b>. Ét element kræver komma: <code>(5,)</code>.</p></div>
<div class="g-card"><h4>set <code>{ }</code></h4><p>Uordnet, unikke værdier, intet index. “Pose hvor dubletter forsvinder.”</p></div><div class="g-card"><h4>dict <code>{k: v}</code></h4><p>Nøgle → værdi. Nøgler skal være immutable (str, int, tuple).</p></div></div>
<h2>Lists</h2><pre data-run><code>ips = ['189.19.202.26', '3.100.186.196', '17.102.131.131', '3.100.186.196']
ips.append('8.8.8.8')            # ét element til sidst
print(len(ips), ips[-1], ips[-3:])
print(ips.count('3.100.186.196'))
x = [1, 2]
x.append([3, 4]); print(x)       # [1, 2, [3, 4]]  ← nested!
y = [1, 2]
y.extend([3, 4]); print(y)       # [1, 2, 3, 4]
y.remove(3); print(y.pop(), y)   # remove første match · pop fjerner+returnerer</code></pre>
<h2>Tuples</h2><pre data-run><code>t = (45, 16, 2)
tmp = list(t); tmp[2] = 42; t = tuple(tmp)   # “ændr” via list
print(t)
for x, y in [(1, 2), (3, 7), (9, 5)]:          # tuple unpacking
    print(x * y)
a, b = 1, 9
a, b = b, a                                    # byt
print(a, b)</code></pre>
<h2>Sets</h2><pre data-run><code>s = set([1, 2, 3, 1, 3, 5])
print(s)                    # {1, 2, 3, 5}
s.add(6); s.remove(5)
print(s, 1 in s)
values = [1, 2, 3, 3, 5, 2, 4]
unique = []                 # bevar rækkefølgen
for v in values:
    if v not in unique:
        unique.append(v)
print(unique)</code></pre>
<h2>Dictionaries</h2><pre data-run="23"><code>my_dict = {}
print(type(my_dict))
my_dict["name"] = "Amir"
my_dict["alder"] = int(input("Alder? "))
for key, value in my_dict.items():
    print(key, "=", value)
print(my_dict.get("by", "Unknown"))     # ingen KeyError
print(list(my_dict.keys())[1])          # keys() er et view → list() før index</code></pre>
<div class="g-box exam"><b class="t">Tæl forekomster (klassiker)</b><pre data-run><code>counts = {}
for ip in ['1.1.1.1', '8.8.8.8', '1.1.1.1']:
    counts[ip] = counts.get(ip, 0) + 1
print(counts)</code></pre></div>`},

{id:"py-flow",subject:P,group:"Kontrolflow",title:"Betingelser og loops",mins:9,tools:"range-visualizer",videos:["DZwmZ8Usvnk","6iF8Xb7Z3wQ"],cards:["Betingelser","Loops"],live:"Loops",
lead:"if vælger én vej. for gentager over noget iterbart. while gentager, så længe en betingelse er sand. Indrykning bestemmer, hvad der hører til blokken.",
html:`<div data-viz="svg" data-name="ifflow"></div>
<pre data-run><code>a, b, c = 3, 9, 4
if a > b and a > c:
    print("a")
elif b > a and b > c:
    print("b")
else:
    print("c")

x = 16
if 10 < x < 20: print("mellem 10 og 20")
print("lige" if x % 2 == 0 else "ulige")</code></pre>
<h2>for og range()</h2><div data-viz="range"></div>
<pre data-run><code>for i in range(1, 11):          # 1..10
    for j in range(1, 11):      # nested: kører helt for HVER i
        print(i * j, end="\t")
    print()                     # linjeskift efter hver række</code></pre>
<pre data-run><code>x = [1, 3, -7, 4, 9, -5, 4]
for idx, value in enumerate(x):     # index + værdi
    if value < 0:
        print("Negativt tal på index", idx)

chars = "abc"                        # alle kombinationer
for a in chars:
    for b in chars:
        for c in chars:
            print(a + b + c, end=", ")</code></pre>
<h2>while, break og continue</h2><pre data-run="hello&#10;world&#10;exit"><code>while True:
    text = input("> ")
    if text.lower() == "exit":
        break                 # forlader løkken
    print(text)

for v in [1, -2, 3]:
    if v < 0:
        continue              # springer kun denne runde over
    print(v)</code></pre>
<div class="g-box warn"><b class="t">break vs exit()</b><p><code>break</code> forlader løkken. <code>exit()</code> afslutter hele programmet — i REPL'en lukker den shellen. Ctrl+C stopper en løbsk løkke.</p></div>`},

{id:"py-func",subject:P,group:"Funktioner",title:"Funktioner, scope, *args og **kwargs",mins:10,videos:["9Os0o3wzS_I"],cards:["Functions"],live:"Functions",
lead:"En funktion er en genbrugelig mini-opskrift: parametre ind, return ud. Eksamen går ofte fra def f(x, y) til *args på få minutter.",
html:`<pre data-run><code>def printinfo(name, age=30):        # name = obligatorisk, age = default
    """Docstring: hvad funktionen gør."""
    return name, age                 # returnerer ÉN tuple

print(printinfo("miki"))             # ('miki', 30)   positional
print(printinfo(age=50, name="miki"))  # keyword — rækkefølgen er ligegyldig
r = print("hej")                     # print returnerer None
print(r)</code></pre>
<table class="g-table"><tr><th>print()</th><th>return</th></tr><tr><td>viser tekst på skærmen</td><td>sender en værdi tilbage til den, der kaldte. Uden return → <code>None</code></td></tr></table>
<h2>*args og **kwargs</h2><pre data-run><code>def my_sum(*args):            # samler positionelle → tuple
    print(type(args), args)
    total = 0
    for n in args:
        total += n
    return total

def point(**kwargs):          # samler keyword-argumenter → dict
    for key, value in kwargs.items():
        print(key, "=", value)

print(my_sum(1, 2, 3, 4))
point(x=10, y=20)
print(my_sum(*[5, 5]))        # * ved kaldet SPREDER en liste</code></pre>
<div class="g-box exam"><b class="t">Rækkefølgen</b><p><code>def f(a, b, *args, c=1, **kwargs)</code> — positionelle → *args → keyword/default → **kwargs. Default-parametre skal stå efter obligatoriske.</p></div>
<h2>Scope: lokal vs global (LEGB)</h2><div class="g-grid"><div class="g-card"><h4>L · Local</h4><p>Inde i funktionen (også parametrene).</p></div><div class="g-card"><h4>E · Enclosing</h4><p>Omsluttende funktion.</p></div><div class="g-card"><h4>G · Global</h4><p>Modulniveau.</p></div><div class="g-card"><h4>B · Built-in</h4><p>print, len, sum …</p></div></div>
<pre data-run><code>z = 10
def increment():
    global z        # uden denne: UnboundLocalError ved z += 1
    z += 1
    return z
print(increment(), z)

def double(x): return x * 2
alias = double      # funktionen selv (ingen parentes)
print(alias(7))</code></pre>
<div class="g-box warn"><b class="t">Overskriv ikke indbyggede navne</b><p><code>list = []</code> eller <code>print = x</code> ødelægger den indbyggede funktion resten af sessionen. <code>del list</code> redder den.</p></div>
<h2>Moduler</h2><pre data-run><code>import math                  # bedst: math.ceil tydeligt
print(math.ceil(3.49))
from math import sqrt        # OK for få navne
print(sqrt(16))
# from math import *         # undgå: navne overskrives lydløst</code></pre>`},

{id:"py-files",subject:P,group:"Filer & fejl",title:"Filer og exceptions",mins:9,videos:["Uh2ebFW8OYM","NIWwJbo-9_8"],cards:["Filer","Exceptions"],live:"Filer",
lead:"Filer: vælg den rigtige mode og brug with. Exceptions: fang den specifikke fejl, du forventer — ikke alt.",
html:`<table class="g-table"><tr><th>Mode</th><th>Gør</th><th>Findes filen ikke?</th><th>Eksisterende indhold</th></tr>
<tr><td><code>'r'</code></td><td>læs (default)</td><td>FileNotFoundError</td><td>uændret</td></tr><tr><td><code>'w'</code></td><td>skriv</td><td>oprettes</td><td><b>slettes!</b></td></tr>
<tr><td><code>'a'</code></td><td>tilføj nederst</td><td>oprettes</td><td>bevares</td></tr><tr><td><code>'x'</code></td><td>opret ny</td><td>oprettes</td><td>fejl hvis den findes</td></tr></table>
<pre data-run><code>with open("log.txt", "w") as f:          # with lukker filen automatisk
    f.write("INFO boot\nERROR login failed\n")
with open("log.txt", "a") as f:
    f.write("Error timeout\n")

word = "error"
with open("log.txt", "r") as f:
    for line_no, line in enumerate(f, start=1):
        if word.lower() in line.lower():
            print(f"{line_no}: {line}", end="")</code></pre>
<div class="g-box warn"><b class="t">Tre klassiske fejl</b><ul><li><code>f.write(42)</code> → TypeError: brug <code>str(42)</code></li><li><code>write()</code> laver ikke selv linjeskift — tilføj <code>"\n"</code></li><li><code>open(..., "w")</code> <i>inde i</i> en løkke overskriver hver gang — åbn uden for løkken eller brug <code>"a"</code></li></ul></div>
<h2>Exceptions</h2><pre data-run><code>def divide_text(a, b):
    try:
        return int(a) / int(b)
    except ValueError:            # specifik først
        return "Bad number"
    except ZeroDivisionError:
        return "Zero"
    finally:
        print("kører altid")

print(divide_text("10", "2"), divide_text("x", "2"), divide_text("1", "0"))</code></pre>
<table class="g-table"><tr><th>Exception</th><th>Typisk årsag</th></tr><tr><td>ValueError</td><td><code>int("abc")</code></td></tr><tr><td>TypeError</td><td><code>"2" + 2</code>, forkert antal argumenter</td></tr><tr><td>ZeroDivisionError</td><td><code>10 / 0</code></td></tr>
<tr><td>IndexError · KeyError</td><td><code>[1,2][5]</code> · <code>d["mangler"]</code></td></tr><tr><td>FileNotFoundError</td><td>open i 'r' på forkert sti</td></tr><tr><td>NameError · AttributeError</td><td>stavefejl · metode findes ikke på typen</td></tr></table>
<pre><code>BaseException
├── SystemExit, KeyboardInterrupt   ← fanges af bar except: (dårligt!)
└── Exception
    ├── ArithmeticError → ZeroDivisionError
    ├── LookupError → IndexError, KeyError
    ├── OSError → FileNotFoundError, PermissionError, ConnectionError
    └── ValueError, TypeError, NameError, AttributeError …</code></pre>
<div class="g-box exam"><b class="t">Hvorfor ikke bare <code>except:</code>?</b><p>Den fanger alt — også stavefejl og Ctrl+C — og skjuler den rigtige fejl. Fang den specifikke type; skal du fange bredt, så <code>except Exception as e:</code> og log <code>e</code>.</p></div>`},

{id:"py-sockets",subject:P,group:"Netværk i Python",title:"Sockets: UDP og TCP i Python",mins:9,videos:["_iHMMo7SDfQ"],cards:["Sockets"],live:"Sockets",
lead:"Socket-API'et er døren mellem din kode og transportlaget. Her mødes Python- og netværkspensum — og det er fundamentet for den obligatoriske webserver.",
html:`<h2>UDP</h2><div data-seq="sockudp"></div>
<pre><code>from socket import *
client_socket = socket(AF_INET, SOCK_DGRAM)              # IPv4 + UDP
msg = input("Input lowercase sentence: ")
client_socket.sendto(msg.encode(), ("127.0.0.1", 12000)) # bytes + (host, port)
reply, server_addr = client_socket.recvfrom(2048)
print(reply.decode())
client_socket.close()</code></pre>
<h2>TCP</h2><div data-seq="socktcp"></div>
<pre><code>from socket import *
server_port = 15000
server_socket = socket(AF_INET, SOCK_STREAM)
server_socket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)   # FØR bind
server_socket.bind(("", server_port))
server_socket.listen(1)
while True:
    connection_socket, addr = server_socket.accept()     # ny socket pr. klient
    msg = connection_socket.recv(2048).decode()
    connection_socket.send(msg.upper().encode())
    connection_socket.close()</code></pre>
<table class="g-table"><tr><th></th><th>UDP (SOCK_DGRAM)</th><th>TCP (SOCK_STREAM)</th></tr><tr><td>Forbindelse</td><td>nej — sendto/recvfrom</td><td>ja — connect / accept</td></tr><tr><td>Server-kald</td><td>socket → bind → recvfrom</td><td>socket → bind → listen → accept → recv/send → close</td></tr><tr><td>Beskedgrænser</td><td>bevares</td><td>byte-strøm (ingen grænser)</td></tr></table>
<div class="g-box warn"><b class="t">Sockets sender bytes</b><p>Glemt <code>.encode()</code> → <code>TypeError: a bytes-like object is required</code>. Modtaget data skal <code>.decode()</code>s til str.</p></div>
<h2>Den obligatoriske webserver</h2><p>TCP-server, ét request ad gangen, uden <code>http.server</code>: parse request line → find filen (default <code>index.html</code>) → send svar med 200, 400 eller 404 → log i Apache-format.</p>
<pre><code>request_line = data.split("\r\n")[0]            # 'GET /test.html HTTP/1.1'
method, path, version = request_line.split()
try:
    with open(path.lstrip("/") or "index.html", "rb") as f:
        body = f.read()
    header = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: %d\r\n\r\n" % len(body)
except FileNotFoundError:
    body = b"&lt;h1&gt;404 Not Found&lt;/h1&gt;"
    header = "HTTP/1.1 404 Not Found\r\nContent-Length: %d\r\n\r\n" % len(body)
connection_socket.sendall(header.encode() + body)
# log: 212.130.228.71 - - [10/Jan/2026:14:22:02 +0000] "GET /index.html HTTP/1.1" 200 17</code></pre>`},

{id:"py-caesar",subject:P,group:"Øvelser",title:"Caesar cipher og ASCII",mins:6,tools:"Caesar-værksted",cards:["Samlede øvelser"],live:"Samlede øvelser",
lead:"Kombinerer loops, strings, ord()/chr() og modulus. Hint fra slides: man ascii.",
html:`<div data-viz="caesar"></div>
<table class="g-table"><tr><th>Tegn</th><th>ASCII (ord)</th></tr><tr><td>A–Z</td><td>65–90</td></tr><tr><td>a–z</td><td>97–122</td></tr><tr><td>0–9</td><td>48–57</td></tr><tr><td>mellemrum</td><td>32</td></tr></table>
<pre data-run><code>def caesar(text, key):
    result = ""
    for ch in text:
        if ch.islower():
            result += chr((ord(ch) - 97 + key) % 26 + 97)   # -97 → 0..25, %26 wrap, +97 tilbage
        elif ch.isupper():
            result += chr((ord(ch) - 65 + key) % 26 + 65)
        else:
            result += ch                                     # mellemrum/tegn bevares
    return result

secret = caesar("Hello World!", 3)
print(secret, "→", caesar(secret, -3))     # dekryptering = negativ nøgle</code></pre>
<div class="g-box warn"><b class="t">Kursets løsningsfil (09-caesar.py)</b><p>Den forskyder <i>alle</i> tegn, så et mellemrum (32) bliver til et tab-tegn: <code>hello world</code> → <code>khoor\tzruog</code>. Løsningen ovenfor bevarer ikke-bogstaver.</p></div>
<div class="g-box"><b class="t">Sikkerhedsvinkel</b><p>Kun 26 nøgler (25 nyttige) → brute force på et millisekund: <code>for k in range(26): print(k, caesar(secret, -k))</code>. Og bogstavfrekvenser bevares → frekvensanalyse.</p></div>`}
);
