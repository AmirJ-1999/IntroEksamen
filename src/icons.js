/* ===== Ikoner: ensartede streg-ikoner (24×24, tegnes med currentColor) ===== */
/* Brug icon("navn") i skabeloner, eller <i data-icon="navn"></i> i markup (udfyldes automatisk,
   også i HTML der tilføjes senere). Alle streger har pathLength=1, så de kan "tegnes" ved hover. */
const ICONS={
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9v11h5v-6h3v6h5V9"/>',
  book:'<path d="M2.5 5.5c0-.8.7-1.5 1.5-1.5h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4A1.5 1.5 0 0 1 2.5 16z"/><path d="M21.5 5.5c0-.8-.7-1.5-1.5-1.5h-5a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20a1.5 1.5 0 0 0 1.5-1.5z"/>',
  cards:'<rect x="3" y="7" width="13" height="14" rx="2.2"/><path d="M8 3.5h11a2 2 0 0 1 2 2V17"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  code:'<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="m13.5 4-3 16"/>',
  braces:'<path d="M8 3.5H7a2 2 0 0 0-2 2V10a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4.5a2 2 0 0 0 2 2h1"/><path d="M16 3.5h1a2 2 0 0 1 2 2V10a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4.5a2 2 0 0 1-2 2h-1"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  headphones:'<path d="M3.5 15v-3a8.5 8.5 0 0 1 17 0v3"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
  playCircle:'<circle cx="12" cy="12" r="9"/><path d="m10 8.6 5.4 3.4-5.4 3.4z"/>',
  download:'<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon:'<path d="M20 14.6A8 8 0 1 1 9.4 4a6.4 6.4 0 0 0 10.6 10.6z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  network:'<rect x="9" y="2.5" width="6" height="5" rx="1.2"/><rect x="2.5" y="16.5" width="6" height="5" rx="1.2"/><rect x="15.5" y="16.5" width="6" height="5" rx="1.2"/><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5"/>',
  star:'<path d="m12 3.2 2.7 5.5 6 .9-4.4 4.2 1.1 6L12 17l-5.4 2.8 1.1-6-4.4-4.2 6-.9z"/>',
  play:'<path d="M7.5 4.8v14.4L19 12z"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12.4 3 3 5-6"/>',
  x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  xCircle:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  arrowLeft:'<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  arrowRight:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  chevronRight:'<path d="m9 6 6 6-6 6"/>',
  chevronDown:'<path d="m6 9 6 6 6-6"/>',
  flask:'<path d="M9 3h6"/><path d="M10 3v6.5L4.6 18.8A1.5 1.5 0 0 0 5.9 21h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3"/><path d="M7.2 15h9.6"/>',
  shuffle:'<path d="M3 7h3.4a4 4 0 0 1 3.3 1.8l4.6 6.4a4 4 0 0 0 3.3 1.8H21"/><path d="M3 17h3.4a4 4 0 0 0 3.3-1.8l.5-.7M13.8 8.5l.5-.7A4 4 0 0 1 17.6 6H21"/><path d="m18 3.5 3 2.5-3 2.5M18 15.5l3 2.5-3 2.5"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.1h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z"/>',
  fileCode:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m10 12.5-2 2 2 2M14 12.5l2 2-2 2"/>',
  fileText:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  message:'<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 21l1.4-4.6A8.5 8.5 0 1 1 20.5 12z"/><path d="M8.5 10.5h7M8.5 14h4.5"/>',
  timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.5 2M9.5 2.5h5"/>',
  reset:'<path d="M3.5 12a8.5 8.5 0 1 0 2.8-6.3L3.5 8.3"/><path d="M3.5 3.5v4.8h4.8"/>',
  trash:'<path d="M4 7h16"/><path d="M6.5 7l.9 12.2a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8L17.5 7"/><path d="M9.5 7V4.5h5V7M10.5 11v6M13.5 11v6"/>',
  filter:'<path d="M3.5 5h17l-6.5 8v5.5l-4 2V13z"/>',
  stop:'<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
  sync:'<path d="M20 12a8 8 0 0 1-14.2 5"/><path d="M4 12A8 8 0 0 1 18.2 7"/><path d="M18.5 3v4.5H14M5.5 21v-4.5H10"/>',
  maximize:'<path d="M8 3.5H5.5a2 2 0 0 0-2 2V8M16 3.5h2.5a2 2 0 0 1 2 2V8M8 20.5H5.5a2 2 0 0 1-2-2V16M16 20.5h2.5a2 2 0 0 0 2-2V16"/>',
  music:'<path d="M9 18V5.5l11-2V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  video:'<rect x="2.5" y="6" width="13" height="12" rx="2.2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  transfer:'<path d="M4 8h14"/><path d="m14 4 4 4-4 4"/><path d="M20 16H6"/><path d="m10 12-4 4 4 4"/>',
  share:'<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M8.6 6h6.8M7.2 8.3l3.6 7.4M16.8 8.3l-3.6 7.4"/>',
  wifi:'<path d="M2.5 8.8a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.7 16.2a5 5 0 0 1 6.6 0"/><path d="M12 19.6h.01"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.5-4.5"/>',
  pointer:'<path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2"/><path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.7a6 6 0 0 1-4.6-2.2l-3-3.6a1.5 1.5 0 0 1 2.2-2L9 15.5"/>',
  trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5v1A3 3 0 0 0 7.5 10M17 6h2.5v1a3 3 0 0 1-3 3M12 14v3.5M8.5 21h7M9.5 17.5h5"/>',
  sparkles:'<path d="M11 3l1.7 4.6 4.6 1.7-4.6 1.7L11 15.6l-1.7-4.6-4.6-1.7 4.6-1.7z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  bolt:'<path d="M13 2.5 4.5 13.5h7L10.5 21.5l9-11.5h-7z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  captions:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10.5 10.2a2 2 0 1 0 0 3.6M16.5 10.2a2 2 0 1 0 0 3.6"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="m10 17 5-5-5-5M15 12H4"/>',
  login:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="m10 17 5-5-5-5M15 12H4"/>',
  cloud:'<path d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 10.5 4.3 4.3 0 0 1 18 19z"/>',
  graduation:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-5M21.5 9v5"/>',
  pencil:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
  lock:'<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  rotate:'<path d="M20.5 12a8.5 8.5 0 1 1-2.8-6.3l2.8 2.6"/><path d="M20.5 3.5v4.8h-4.8"/>'
};
for(const k in ICONS)ICONS[k]=ICONS[k].replace(/<(path|circle|rect)/g,'<$1 pathLength="1"');
function icon(name,cls=""){
  const d=ICONS[name];
  return d?`<svg class="ic ic-${name}${cls?" "+cls:""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`:"";
}
/* <i data-icon="x"></i> → svg, both for the initial markup and for HTML added later */
function hydrateIcons(root){
  (root.querySelectorAll?root:document).querySelectorAll("i[data-icon]").forEach(el=>{el.outerHTML=icon(el.dataset.icon,el.className)});
}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){
  if(n.nodeType!==1)continue;
  if(n.matches&&n.matches("i[data-icon]")){n.outerHTML=icon(n.dataset.icon,n.className);continue}
  if(n.querySelector&&n.querySelector("i[data-icon]"))hydrateIcons(n);
}}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",()=>hydrateIcons(document));
