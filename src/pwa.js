/* ===== Install as an app (PWA): service worker, install prompt, iPhone instructions, app shortcuts,
   offline notice and the browser/status bar colour following the theme. ===== */
const PWA_STANDALONE=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const PWA_IOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const PWA_IOS_SAFARI=PWA_IOS&&/Safari/.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
let pwaPrompt=null;
const pwaDismissed=()=>{try{return +localStorage.getItem("pwa_dismissed")||0}catch{return 0}};

if("serviceWorker" in navigator&&(location.protocol==="https:"||["localhost","127.0.0.1"].includes(location.hostname))){
  addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();pwaPrompt=e;pwaRenderBanner()});
addEventListener("appinstalled",()=>{pwaPrompt=null;pwaRenderBanner();pwaNote(icon("checkCircle"),"Study Hub er installeret. Du finder den blandt dine apps.")});

/* the start page banner: shown when the browser can install, or with instructions on iPhone/iPad */
function pwaCanOffer(){return !PWA_STANDALONE&&(pwaPrompt||PWA_IOS_SAFARI)&&Date.now()-pwaDismissed()>14*864e5}
async function pwaInstall(){
  if(pwaPrompt){pwaPrompt.prompt();const r=await pwaPrompt.userChoice.catch(()=>null);if(r?.outcome==="accepted")pwaPrompt=null;pwaRenderBanner();return}
  if(PWA_IOS){$("#pwaBanner .pwa-ios")?.classList.add("open")}
}
function pwaRenderBanner(){
  const home=$("#homeView");if(!home)return;
  let b=$("#pwaBanner");
  if(!pwaCanOffer()){b?.remove();return}
  if(!b){(home.querySelector("#homeToday")||home.querySelector(".quickstart")).insertAdjacentHTML("beforebegin",`<div class="pwa-banner" id="pwaBanner"></div>`);b=$("#pwaBanner")}
  b.innerHTML=`<span class="pwa-icon" aria-hidden="true">${$(".brand .logo")?.outerHTML||""}</span>
    <div class="pwa-txt"><b>Installer Study Hub som app</b><span>Åbn den fra hjemmeskærmen eller dock'en i sit eget vindue. Guides, flashcards og fremgang virker også uden internet.</span>
      ${PWA_IOS&&!pwaPrompt?`<ol class="pwa-ios"><li>Tryk på <b>Del</b> ${icon("share")} nederst i Safari</li><li>Vælg <b>Føj til hjemmeskærm</b></li><li>Tryk <b>Tilføj</b></li></ol>`:""}</div>
    <div class="pwa-act"><button class="btn run" id="pwaGo">${icon("download")}${PWA_IOS&&!pwaPrompt?"Sådan gør du":"Installer"}</button><button class="pwa-x" id="pwaNo" aria-label="Ikke nu">${icon("x")}</button></div>`;
  $("#pwaGo").onclick=pwaInstall;
  $("#pwaNo").onclick=()=>{try{localStorage.setItem("pwa_dismissed",String(Date.now()))}catch{}b.remove()};
}
const _pwaHome=renderHome;
renderHome=function(){_pwaHome();pwaRenderBanner()};

/* small notices: installed, offline, back online */
const pwaNoteEl=document.createElement("div");pwaNoteEl.className="pwa-note";pwaNoteEl.hidden=true;pwaNoteEl.setAttribute("role","status");document.body.appendChild(pwaNoteEl);
let pwaNoteT=0;
function pwaNote(ic,msg,ms=4500){pwaNoteEl.innerHTML=`${ic}<span>${msg}</span>`;pwaNoteEl.hidden=false;clearTimeout(pwaNoteT);if(ms)pwaNoteT=setTimeout(()=>pwaNoteEl.hidden=true,ms)}
addEventListener("offline",()=>{document.documentElement.classList.add("is-offline");pwaNote(icon("cloud"),"Du er offline. Guides, flashcards og din fremgang virker stadig. Python virker, hvis den har været startet før.",8000)});
addEventListener("online",()=>{document.documentElement.classList.remove("is-offline");pwaNote(icon("checkCircle"),"Du er online igen.",2500)});
if(!navigator.onLine)document.documentElement.classList.add("is-offline");

/* the browser and phone status bar follow the theme */
function pwaThemeColor(){
  let m=document.querySelector('meta[name="theme-color"]');
  if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}
  m.content=document.documentElement.dataset.theme==="dark"?"#080d16":"#f6f8fc";
}
const _pwaTheme=applyTheme;
applyTheme=function(t){_pwaTheme(t);pwaThemeColor()};
pwaThemeColor();

/* app shortcuts (long-press the icon): ./#go=today|exam|live|search */
const pwaGo=new URLSearchParams(location.hash.slice(1)).get("go");
if(pwaGo)setTimeout(()=>{
  history.replaceState(null,"",location.pathname+location.search);
  ({today:()=>startTodaySession(),exam:()=>{if(exam?.ended){exam=null;exSave()}setView("exam")},live:()=>{setView("live");closeSandbox()},search:()=>sxOpen()})[pwaGo]?.();
},0);
