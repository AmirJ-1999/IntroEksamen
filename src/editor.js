/* ===== Python editor: syntax colours, line numbers and VS Code-style editing on top of a plain <textarea> =====
   The textarea stays the source of truth (value, selection, input events), so everything that reads or sets
   the code keeps working. A highlighted copy is drawn underneath and scrolled along with it. */
const PY_KW=new Set("and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case".split(" "));
const PY_CONSTS=new Set(["True","False","None"]);
const PY_BUILTINS=new Set("print input len range int str float list dict set tuple bool open type isinstance enumerate zip sorted reversed sum min max abs round map filter any all chr ord hex bin oct format repr iter next super object id hash divmod pow vars dir help self Exception ValueError TypeError KeyError IndexError ZeroDivisionError FileNotFoundError NameError AttributeError StopIteration RuntimeError OSError".split(" "));
const PY_TOKEN=/(#[^\n]*)|((?:[rRbBuUfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b0[xXoObB][\da-fA-F_]+\b|\b\d[\d_]*(?:\.\d*)?(?:[eE][+-]?\d+)?j?\b|\.\d+\b)|(@[A-Za-z_]\w*)|([A-Za-z_]\w*)/g;
function pyHighlight(code){
  let out="",last=0,prev="",m;
  PY_TOKEN.lastIndex=0;
  while((m=PY_TOKEN.exec(code))){
    out+=esc(code.slice(last,m.index));last=PY_TOKEN.lastIndex;
    const t=m[0];let cls="";
    if(m[1])cls="cm";else if(m[2])cls="st";else if(m[3])cls="nu";else if(m[4])cls="de";
    else if(PY_KW.has(t))cls="kw";else if(PY_CONSTS.has(t))cls="co";
    else if(prev==="def"||prev==="class")cls="fn";
    else if(PY_BUILTINS.has(t))cls="bi";
    else if(code[last]==="(")cls="ca";
    if(m[5]||m[4])prev=t;else if(!m[1])prev="";
    out+=cls?`<span class="sy-${cls}">${esc(t)}</span>`:esc(t);
  }
  return out+esc(code.slice(last))+"\n";
}

const _taValue=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value");
function pyEditor(ta){
  if(!ta||ta._ed)return ta&&ta._ed;
  const wrap=document.createElement("div");wrap.className="ped";
  wrap.innerHTML=`<div class="ped-gutter" aria-hidden="true"><div class="ped-nums"></div></div><div class="ped-body"><div class="ped-active" aria-hidden="true"></div><pre class="ped-hl" aria-hidden="true"><code></code></pre></div>`;
  ta.before(wrap);wrap.querySelector(".ped-body").appendChild(ta);
  ta.classList.add("ped-input");ta.setAttribute("wrap","off");ta.spellcheck=false;
  const hl=wrap.querySelector(".ped-hl code"),nums=wrap.querySelector(".ped-nums"),active=wrap.querySelector(".ped-active"),gutter=wrap.querySelector(".ped-gutter");
  let lineH=21,padTop=16,lines=0,errLine=0,raf=0;
  const syncStyle=()=>{
    const cs=getComputedStyle(ta);
    lineH=parseFloat(cs.lineHeight)||21;padTop=parseFloat(cs.paddingTop)||0;
    const pre=hl.parentElement;
    for(const p of ["fontFamily","fontSize","lineHeight","letterSpacing","paddingTop","paddingRight","paddingBottom","paddingLeft","tabSize"])pre.style[p]=cs[p];
    for(const p of ["fontFamily","fontSize","lineHeight","paddingTop","paddingBottom"])nums.style[p]=cs[p];
  };
  const scroll=()=>{hl.parentElement.scrollTop=ta.scrollTop;hl.parentElement.scrollLeft=ta.scrollLeft;nums.style.transform=`translateY(${-ta.scrollTop}px)`;caret()};
  const caret=()=>{
    const ln=_taValue.get.call(ta).slice(0,ta.selectionStart).split("\n").length;
    active.style.transform=`translateY(${padTop+(ln-1)*lineH-ta.scrollTop}px)`;active.style.height=lineH+"px";
    wrap.classList.toggle("focus",document.activeElement===ta);
    nums.querySelector(".on")?.classList.remove("on");nums.children[ln-1]?.classList.add("on");
  };
  const refresh=()=>{
    const v=_taValue.get.call(ta);
    hl.innerHTML=pyHighlight(v);
    const n=v.split("\n").length;
    if(n!==lines){lines=n;let h="";for(let i=1;i<=n;i++)h+=`<span${i===errLine?' class="err"':""}>${i}</span>`;nums.innerHTML=h;gutter.style.minWidth=(String(n).length*9+26)+"px"}
    scroll();
  };
  /* values set from code (reset, switching task, opening the sandbox) redraw too */
  Object.defineProperty(ta,"value",{configurable:true,get(){return _taValue.get.call(this)},set(v){_taValue.set.call(this,v);clearErr();refresh()}});
  const clearErr=()=>{if(errLine){errLine=0;lines=0;wrap.classList.remove("has-err")}};
  ta.addEventListener("input",()=>{clearErr();refresh()});
  ta.addEventListener("scroll",scroll,{passive:true});
  ["keyup","click","focus","blur","select"].forEach(e=>ta.addEventListener(e,()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(caret)}));
  new ResizeObserver(()=>{syncStyle();scroll()}).observe(ta);

  /* editing: write through execCommand so Ctrl+Z still works */
  const put=(s,e,text,a,b=a)=>{
    ta.focus();ta.setSelectionRange(s,e);
    if(!document.execCommand("insertText",false,text)){ta.setRangeText(text,s,e,"end");ta.dispatchEvent(new Event("input",{bubbles:true}))}
    ta.setSelectionRange(a,b);
  };
  const PAIRS={"(":")","[":"]","{":"}",'"':'"',"'":"'"};
  ta.addEventListener("keydown",e=>{
    if(e.isComposing)return;
    const v=_taValue.get.call(ta),s=ta.selectionStart,en=ta.selectionEnd;
    const ls=v.lastIndexOf("\n",s-1)+1,line=v.slice(ls,s),indent=(line.match(/^ */)||[""])[0];
    const multi=v.slice(s,en).includes("\n");
    const blockStart=v.lastIndexOf("\n",s-1)+1,blockEnd=(()=>{const i=v.indexOf("\n",en-(en>s&&v[en-1]==="\n"?1:0));return i<0?v.length:i})();
    const mapLines=f=>{const block=v.slice(blockStart,blockEnd),out=block.split("\n").map(f).join("\n");put(blockStart,blockEnd,out,blockStart,blockStart+out.length)};
    if(e.key==="Tab"&&!e.ctrlKey&&!e.altKey&&!e.metaKey){
      e.preventDefault();
      if(e.shiftKey)return mapLines(l=>l.replace(/^ {1,4}/,""));
      if(multi)return mapLines(l=>l.length?"    "+l:l);
      const pad=4-(line.length%4);return put(s,en," ".repeat(pad),s+pad);
    }
    if((e.ctrlKey||e.metaKey)&&(e.key==="/"||e.code==="Slash")){
      e.preventDefault();
      const block=v.slice(blockStart,blockEnd).split("\n"),on=block.filter(l=>l.trim()).every(l=>/^\s*#/.test(l));
      return mapLines(l=>!l.trim()?l:on?l.replace(/^(\s*)# ?/,"$1"):l.replace(/^(\s*)/,"$1# "));
    }
    if(e.key==="Enter"&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){
      e.preventDefault();
      let ind=indent;const before=line.trimEnd();
      if(/:\s*(#.*)?$/.test(before)&&!before.trim().startsWith("#"))ind+="    ";
      else if(/^\s*(return\b|pass\b|break\b|continue\b|raise\b)/.test(before))ind=ind.slice(4);
      const next=v[en],prevCh=v[s-1];
      if(PAIRS[prevCh]&&PAIRS[prevCh]===next&&"([{".includes(prevCh))   // between brackets: open a new indented line
        return put(s,en,"\n"+ind+"    \n"+ind,s+ind.length+5);
      return put(s,en,"\n"+ind,s+1+ind.length);
    }
    if(e.key==="Backspace"&&s===en&&s>ls){
      if(/^ +$/.test(line)){e.preventDefault();const n=line.length%4||4;return put(s-n,s,"",s-n)}
      if(PAIRS[v[s-1]]&&PAIRS[v[s-1]]===v[s]){e.preventDefault();return put(s-1,s+1,"",s-1)}
    }
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(")]}".includes(e.key)&&e.key.length===1&&s===en&&v[s]===e.key){e.preventDefault();return ta.setSelectionRange(s+1,s+1)}
    if(PAIRS[e.key]){
      const q=e.key==='"'||e.key==="'";
      if(s!==en&&!multi){e.preventDefault();return put(s,en,e.key+v.slice(s,en)+PAIRS[e.key],s+1,en+1)}
      if(q&&v[s]===e.key&&s===en){e.preventDefault();return ta.setSelectionRange(s+1,s+1)}
      const nx=v[s]||"",pv=v[s-1]||"";
      const prefix=q&&/(^|[^\w])[rRbBfFuU]{1,2}$/.test(v.slice(ls,s));
      if(s===en&&/^[\s)\]},:]?$/.test(nx)&&(prefix||!(q&&/[\w"']/.test(pv)))){e.preventDefault();return put(s,en,e.key+PAIRS[e.key],s+1)}
    }
  });
  const ed={refresh,markError(n){errLine=n;lines=0;wrap.classList.add("has-err");refresh()}};
  ta._ed=ed;syncStyle();refresh();
  return ed;
}
/* mark the error line in the gutter whenever an error with a line number is shown for an editor */
const _edBindGoto=bindGotoLines;
bindGotoLines=function(root,ta){_edBindGoto(root,ta);const b=root.querySelector(".pyerr-line[data-goto]");if(b&&ta&&ta._ed)ta._ed.markError(+b.dataset.goto)};
window.addEventListener("resize",()=>$$(".ped-input").forEach(t=>t.dispatchEvent(new Event("scroll"))));
pyEditor($("#codeInput"));pyEditor($("#sbCode"));
