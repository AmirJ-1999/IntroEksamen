/* ===== Konto & synkronisering ===== */
/* Progress lives in localStorage (keys "its_*"). When logged in, every change is pushed to the
   sync worker (debounced) and pulled again when the page opens or gets focus, so the same
   account continues on any device. Conflicts (two devices saved) are merged key by key. */
const SYNC_API=(localStorage.getItem("its_dev_api")||"https://studylab-sync.amirjawad79.workers.dev").replace(/\/$/,"");
const SYNC_LOCAL_ONLY=new Set(["its_theme","its_account","its_sync_meta","its_dev_api"]);
const isSyncedKey=k=>k.startsWith("its_")&&!SYNC_LOCAL_ONLY.has(k);
let account=null, syncMeta={rev:0,dirty:false,last:0};
try{account=JSON.parse(localStorage.getItem("its_account")||"null");syncMeta={...syncMeta,...JSON.parse(localStorage.getItem("its_sync_meta")||"{}")}}catch{}
let syncState="idle", syncTimer=null, syncBusy=false, syncAgain=false, changeSeq=0, applyingRemote=false, lastPull=0;

/* every write to a synced key marks this device as "dirty" and schedules an upload */
const _setItem=Storage.prototype.setItem, _removeItem=Storage.prototype.removeItem;
Storage.prototype.setItem=function(k,v){
  const changed=this===localStorage&&isSyncedKey(k)&&this.getItem(k)!==String(v);
  _setItem.call(this,k,v);
  if(changed&&!applyingRemote)markDirty();
};
Storage.prototype.removeItem=function(k){
  const changed=this===localStorage&&isSyncedKey(k)&&this.getItem(k)!==null;
  _removeItem.call(this,k);
  if(changed&&!applyingRemote)markDirty();
};
function saveSyncMeta(){_setItem.call(localStorage,"its_sync_meta",JSON.stringify(syncMeta))}
function markDirty(){
  if(!account)return;   // logged out: nothing to sync (logging in merges this browser's progress anyway)
  changeSeq++;syncMeta.dirty=true;saveSyncMeta();
  clearTimeout(syncTimer);syncTimer=setTimeout(pushSync,3000);setSyncState("pending");
}

function localSnapshot(){
  const o={};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isSyncedKey(k))o[k]=localStorage.getItem(k)}
  return o;
}
/* merge two snapshots: objects are merged per key (so progress from both devices survives),
   for everything else the `win` side decides */
function mergeSnapshots(mine,win){
  const out={...mine};
  for(const [k,v] of Object.entries(win)){
    if(!(k in out)){out[k]=v;continue}
    let a,b;try{a=JSON.parse(out[k]);b=JSON.parse(v)}catch{out[k]=v;continue}
    out[k]=JSON.stringify(deepMerge(a,b));
  }
  return out;
}
const isObj=x=>x&&typeof x==="object"&&!Array.isArray(x);
function deepMerge(a,b){
  if(!isObj(a)||!isObj(b))return b;
  const o={...a};for(const k in b)o[k]=k in o?deepMerge(o[k],b[k]):b[k];return o;
}
/* write a snapshot into localStorage (replace: also drop synced keys the snapshot doesn't have)
   and refresh the app's in-memory state if anything changed */
function applySnapshot(snap,{replace=false}={}){
  let changed=0;applyingRemote=true;
  try{
    for(const [k,v] of Object.entries(snap))if(isSyncedKey(k)&&localStorage.getItem(k)!==v){localStorage.setItem(k,v);changed++}
    if(replace)for(const k of Object.keys(localSnapshot()))if(!(k in snap)){localStorage.removeItem(k);changed++}
  }finally{applyingRemote=false}
  if(changed)reloadAppState();
}
function reloadAppState(force=false){
  const J=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||"null");return v??d}catch{return d}};
  subject=localStorage.getItem("its_subject")||subject;
  statusMap=J("its_status_clean",{});savedMap=J("its_saved_cards_v5",{});lastCard=J("its_last_card",{});
  liveProgress=J("its_live_progress_clean",{});liveCode=J("its_live_code_clean",{});
  learnId=J("its_learn_last",{});checks=J("its_checklists",{});
  liveSet=localStorage.getItem("its_live_set")||liveSet;
  const sb=$("#sbCode");
  if(sb&&(force||document.activeElement!==sb))sb.value=localStorage.getItem("its_sandbox")||(force?"":sb.value);
  // don't yank the page while the user is typing; the next view change renders the new state
  const typing=["TEXTAREA","INPUT"].includes(document.activeElement?.tagName);
  if(typing&&!force)return;
  const y=scrollY,scrollTo0=window.scrollTo;window.scrollTo=()=>{};   // re-render in place, keep the scroll position
  try{syncSubject();setView(currentView)}finally{window.scrollTo=scrollTo0;scrollTo0.call(window,{top:y,behavior:"instant"})}
}

async function api(path,{method="GET",body}={}){
  const res=await fetch(SYNC_API+path,{method,headers:{"Content-Type":"application/json",...(account?{Authorization:"Bearer "+account.token}:{})},body:body&&JSON.stringify(body)});
  let data={};try{data=await res.json()}catch{}
  return {status:res.status,data};
}
function sessionExpired(){
  account=null;localStorage.removeItem("its_account");setSyncState("idle");renderAccount();
  toast("Du er blevet logget ud. Log ind igen for at synkronisere.");
}

/* upload this device's progress; on conflict merge with the server copy and try again */
async function pushSync(){
  clearTimeout(syncTimer);
  if(!account)return;
  if(syncBusy){syncAgain=true;return}
  syncBusy=true;setSyncState("syncing");
  try{
    for(let tries=0;tries<4;tries++){
      const seq=changeSeq;
      const {status,data}=await api("/api/data",{method:"PUT",body:{data:localSnapshot(),baseRev:syncMeta.rev}});
      if(status===200){
        syncMeta.rev=data.rev;syncMeta.last=Date.now();if(seq===changeSeq)syncMeta.dirty=false;saveSyncMeta();
        setSyncState(syncMeta.dirty?"pending":"ok");break;
      }
      if(status===409){applySnapshot(mergeSnapshots(data.data,localSnapshot()));syncMeta.rev=data.rev;saveSyncMeta();continue}
      if(status===401){sessionExpired();return}
      throw new Error(data.error||"HTTP "+status);
    }
  }catch(e){setSyncState("error")}
  finally{syncBusy=false}
  if(syncAgain||(syncMeta.dirty&&syncState==="pending")){syncAgain=false;syncTimer=setTimeout(pushSync,1500)}
}
/* download the account's progress. Unchanged device: the account copy replaces it. Changed device:
   both are merged — local edits win, except right after login, where the account copy wins. */
async function pullSync({preferServer=false}={}){
  if(!account||syncBusy)return;
  syncBusy=true;setSyncState("syncing");lastPull=Date.now();
  let push=false;
  try{
    const {status,data}=await api("/api/data");
    if(status===401){syncBusy=false;sessionExpired();return}
    if(status!==200)throw new Error(data.error||"HTTP "+status);
    if(data.rev!==syncMeta.rev){
      if(!syncMeta.dirty)applySnapshot(data.data,{replace:true});
      else applySnapshot(preferServer?mergeSnapshots(localSnapshot(),data.data):mergeSnapshots(data.data,localSnapshot()));
      syncMeta.rev=data.rev;saveSyncMeta();
    }
    push=syncMeta.dirty;
    if(!push){syncMeta.last=Date.now();saveSyncMeta();setSyncState("ok")}
  }catch(e){setSyncState("error")}
  finally{syncBusy=false}
  if(push)pushSync();
}

/* ---------- UI: account button, menu and login dialog ---------- */
function setSyncState(s){syncState=s;renderAccount()}
function renderAccount(){
  const btn=$("#accountBtn");if(!btn)return;
  btn.classList.toggle("logged-in",!!account);
  btn.dataset.sync=account?syncState:"";
  btn.querySelector("span").textContent=account?account.username:"Log ind";
  btn.title=account?`Logget ind som ${account.username} · ${syncLabel()}`:"Log ind for at gemme din fremgang på tværs af enheder";
  const m=$("#accountMenu");if(m&&!m.hidden)fillAccountMenu();
}
function syncLabel(){
  if(syncState==="syncing")return "Synkroniserer…";
  if(syncState==="pending")return "Gemmer om lidt…";
  if(syncState==="error")return "Kunne ikke synkronisere — prøver igen senere";
  return syncMeta.last?`Synkroniseret kl. ${new Date(syncMeta.last).toLocaleTimeString("da-DK",{hour:"2-digit",minute:"2-digit"})}`:"Synkroniseret";
}
function fillAccountMenu(){
  $("#accountMenu").innerHTML=`<div class="acc-who">Logget ind som<b>${esc(account.username)}</b></div>
    <div class="acc-status" data-sync="${syncState}"><i></i>${esc(syncLabel())}</div>
    <p class="acc-note">Flashcards, gemte kort, Python Lab-fremgang og din kode gemmes på kontoen. Når du logger ud, fjernes de fra denne browser.</p>
    <button class="btn" id="accSyncNow">⟳ Synkronisér nu</button><button class="btn" id="accLogout">Log ud</button>`;
  $("#accSyncNow").onclick=()=>{syncMeta.dirty?pushSync():pullSync()};
  $("#accLogout").onclick=logout;
}
function toggleAccountMenu(open){
  const m=$("#accountMenu");open=open??m.hidden;m.hidden=!open;
  $("#accountBtn").setAttribute("aria-expanded",String(open));
  if(open)fillAccountMenu();
}
function openAccountDialog(mode="login"){
  const d=$("#accountDialog");setAuthMode(mode);
  $("#accError").textContent="";$("#accPass").value="";
  d.showModal();$("#accUser").focus();
}
function setAuthMode(mode){
  const d=$("#accountDialog");d.dataset.mode=mode;
  $$("#accountDialog .acc-tab").forEach(t=>t.setAttribute("aria-selected",String(t.dataset.mode===mode)));
  $("#accSubmit").textContent=mode==="login"?"Log ind":"Opret konto";
  $("#accPass").autocomplete=mode==="login"?"current-password":"new-password";
  $("#accIntro").textContent=mode==="login"
    ?"Log ind for at hente din fremgang og fortsætte, hvor du slap, på enhver enhed."
    :"Opret en konto, så din fremgang gemmes online. Det du allerede har lavet i denne browser, bliver lagt på kontoen.";
}
async function submitAuth(e){
  e.preventDefault();
  const mode=$("#accountDialog").dataset.mode, username=$("#accUser").value.trim().toLowerCase(), password=$("#accPass").value;
  const err=$("#accError");err.textContent="";$("#accSubmit").disabled=true;
  try{
    const {status,data}=await api(mode==="login"?"/api/login":"/api/register",{method:"POST",body:{username,password}});
    if(status!==200){err.textContent=data.error||"Noget gik galt. Prøv igen.";return}
    account={username:data.username,token:data.token};_setItem.call(localStorage,"its_account",JSON.stringify(account));
    // a new login starts from the server copy; local progress from this browser is merged in and uploaded
    syncMeta={rev:-1,dirty:true,last:0};saveSyncMeta();
    $("#accountDialog").close();renderAccount();
    await pullSync({preferServer:true});
    toast(mode==="login"?`Velkommen tilbage, ${data.username}! Din fremgang er hentet.`:`Kontoen ${data.username} er oprettet. Din fremgang gemmes nu online.`);
  }catch(e2){err.textContent="Kunne ikke forbinde til serveren. Tjek din internetforbindelse."}
  finally{$("#accSubmit").disabled=false}
}
/* Log out = save the last changes to the account, then remove this account's progress from the
   browser, so the next person on the same device starts clean (the theme stays). */
async function logout(){
  toggleAccountMenu(false);
  clearTimeout(syncTimer);
  while(syncBusy)await new Promise(r=>setTimeout(r,100));
  if(syncMeta.dirty)await pushSync();
  if(!account)return;   // session had already expired (pushSync logged out and kept the data)
  if(syncMeta.dirty&&!confirm("Dine seneste ændringer kunne ikke gemmes på kontoen (ingen forbindelse?).\n\nLog ud alligevel? Så går de ændringer tabt."))return;
  try{await api("/api/logout",{method:"POST"})}catch{}
  account=null;_removeItem.call(localStorage,"its_account");syncMeta={rev:0,dirty:false,last:0};saveSyncMeta();
  applyingRemote=true;
  try{for(const k of Object.keys(localSnapshot()))localStorage.removeItem(k)}finally{applyingRemote=false}
  stopTerminal($("#results"));stopTerminal($("#sbOut"));$("#sbOut").innerHTML="";
  reloadAppState(true);
  setSyncState("idle");toast("Du er logget ud, og din fremgang er fjernet fra denne browser. Den ligger stadig på kontoen.");
}
function toast(msg){
  let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}
  t.textContent=msg;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),3800);
}

$("#accountBtn").onclick=e=>{e.stopPropagation();account?toggleAccountMenu():openAccountDialog("login")};
$("#accountMenu").onclick=e=>e.stopPropagation();
document.addEventListener("click",()=>{const m=$("#accountMenu");if(m&&!m.hidden)toggleAccountMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#accountMenu").hidden)toggleAccountMenu(false)});
$$("#accountDialog .acc-tab").forEach(t=>t.onclick=()=>{setAuthMode(t.dataset.mode);$("#accError").textContent=""});
$("#accForm").onsubmit=submitAuth;
$("#accClose").onclick=()=>$("#accountDialog").close();
$("#accountDialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
// fetch changes made on other devices when coming back to the tab; upload before leaving
document.addEventListener("visibilitychange",()=>{
  if(!account)return;
  if(document.visibilityState==="visible"&&Date.now()-lastPull>20000)pullSync();
  if(document.visibilityState==="hidden"&&syncMeta.dirty)pushSync();
});
window.addEventListener("online",()=>{if(account)syncMeta.dirty?pushSync():pullSync()});
renderAccount();
if(account)pullSync();
