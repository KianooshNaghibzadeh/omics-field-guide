(function(){
const LAYER = {
  genomics:["Genomics","--dna"], epigenomics:["Epigenomics","--epi"], transcriptomics:["Transcriptomics","--rna"],
  singlecell:["Single-cell & spatial","--rna"], proteomics:["Proteomics","--prot"], metabolomics:["Metabolomics","--met"],
  microbiome:["Microbiome","--mic"], integration:["Multi-omics integration","--int"], practice:["Workflow & practice","--int"]
};
const STAGE = {P:"Primary",S:"Secondary",T:"Tertiary"};
const $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pubmed = q => "https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(q);
const lvl = n => '<span class="lvl" title="'+["","Entry","Intermediate","Advanced"][n]+'">'+"●".repeat(n)+"<i>"+"●".repeat(3-n)+"</i></span>";
const stagePill = s => '<span class="pill stage-'+s+'">'+STAGE[s]+'</span>';
const sections = $$("section.chapter");
// Multi-page mode: the static site defines PAGES (chapter list), SEARCH (text index) and ROOT (relative path to site root).
const MULTI = typeof PAGES!=="undefined";
const pageUrl = id => MULTI ? (window.ROOT||"./") + (id==="home" ? "" : PAGES.find(p=>p.id===id).slug + "/") : "#"+id;

/* ---------- citations ---------- */
$$("cite[data-q]").forEach(c=>{ const a=document.createElement("a"); a.href=pubmed(c.dataset.q); a.target="_blank"; a.rel="noopener"; a.innerHTML=c.innerHTML; c.innerHTML=""; c.appendChild(a); c.style.fontStyle="normal"; });

/* ---------- table of contents ---------- */
const toc = $("#toc"); let lastPart = null;
if(!toc.children.length) sections.forEach(s=>{
  if(s.dataset.part!==lastPart){ lastPart=s.dataset.part; const d=document.createElement("div"); d.className="toc-part"; d.textContent=lastPart; toc.appendChild(d); }
  const a=document.createElement("a"); a.href="#"+s.id; a.dataset.id=s.id;
  a.innerHTML='<span class="sw" style="--c:var('+s.dataset.c+')"></span><span>'+s.dataset.title+'</span>'; toc.appendChild(a);
});

/* ---------- pager + on-page nav ---------- */
sections.forEach((s,i)=>{
  const p=$(".pager",s);
  if(p && !p.children.length){ const pr=sections[i-1], nx=sections[i+1];
    p.innerHTML=(pr?'<a href="#'+pr.id+'"><span>← Previous</span><b>'+pr.dataset.title+'</b></a>':'')+(nx?'<a class="nx" href="#'+nx.id+'"><span>Next →</span><b>'+nx.dataset.title+'</b></a>':''); }
  const hs=$$(":scope > h2",s);
  if(hs.length>2 && s.id!=="home"){ const nav=document.createElement("nav"); nav.className="onpage"; nav.setAttribute("aria-label","On this page");
    hs.forEach(h=>{ const b=document.createElement("button"); b.type="button"; b.textContent=h.textContent; b.onclick=()=>h.scrollIntoView({behavior:"smooth",block:"start"}); nav.appendChild(b); });
    $(".chap-head",s).after(nav); }
});
// home pager
if(!MULTI && $("#home .wide")){ const hp=document.createElement("div"); hp.className="pager"; hp.innerHTML='<a class="nx" href="#cell"><span>Begin →</span><b>Genome, genes &amp; chromatin</b></a>'; $("#home .wide").appendChild(hp); }

/* ---------- router ---------- */
const rail=$("#rail"), menuBtn=$("#menuBtn");
function show(id, keepScroll){
  if(!document.getElementById(id) || !document.getElementById(id).classList.contains("chapter")) id="home";
  sections.forEach(s=>s.classList.toggle("on", s.id===id));
  $$("#toc a").forEach(a=>{ if(a.dataset.id===id) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  if(!keepScroll) window.scrollTo(0,0);
  rail.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false");
  if(id==="home") startTrace();
}
if(!MULTI) window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
menuBtn.addEventListener("click",()=>{ const o=rail.classList.toggle("open"); menuBtn.setAttribute("aria-expanded",String(o)); });

/* ---------- tool tables ---------- */
function toolTable(list, withLayer){
  let html='<table><tr><th>Tool</th>'+(withLayer?'<th>Layer</th><th>Task</th>':'')+'<th>Aim</th><th>Stage</th><th>Level</th><th>Interface</th></tr>';
  let grp=null;
  list.forEach(t=>{
    if(!withLayer && t[2]!==grp){ grp=t[2]; html+='<tr class="grp"><td colspan="5">'+esc(grp)+'</td></tr>'; }
    html+='<tr><td>'+esc(t[0])+'</td>'+(withLayer?'<td class="wrap" style="color:var('+LAYER[t[1]][1]+')">'+LAYER[t[1]][0]+'</td><td class="wrap">'+esc(t[2])+'</td>':'')+
      '<td class="wrap">'+esc(t[6])+'</td><td>'+stagePill(t[3])+'</td><td>'+lvl(t[4])+'</td><td class="wrap mono" style="font-size:.74rem;color:var(--ink-2)">'+esc(t[5])+'</td></tr>';
  });
  return html+'</table>';
}
$$(".tooltable").forEach(el=>{
  const key=el.dataset.omics; const list=TOOLS.filter(t=>t[1]===key);
  // keep tasks grouped in first-appearance order
  const order=[]; list.forEach(t=>{ if(!order.includes(t[2])) order.push(t[2]); });
  list.sort((a,b)=>order.indexOf(a[2])-order.indexOf(b[2]));
  el.classList.add("tbl","wide"); el.innerHTML=toolTable(list,false);
});

/* ---------- atlas ---------- */
const aQ=$("#atlasQ"), aO=$("#atlasOmics"), aS=$("#atlasStage"), aL=$("#atlasLvl");
function renderAtlas(){}
if(aQ){
Object.keys(LAYER).forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=LAYER[k][0]; aO.appendChild(o); });
renderAtlas=function(){
  const q=aQ.value.trim().toLowerCase();
  const list=TOOLS.filter(t=>(!aO.value||t[1]===aO.value)&&(!aS.value||t[3]===aS.value)&&(!aL.value||String(t[4])===aL.value)&&(!q||(t[0]+" "+t[2]+" "+t[6]+" "+t[5]).toLowerCase().includes(q)));
  $("#atlasTable").innerHTML = list.length? toolTable(list,true) : '<p style="padding:14px">No tools match these filters. Clear the search or choose "All layers".</p>';
  $("#atlasCount").textContent=list.length+" of "+TOOLS.length+" tools";
};
[aQ,aO,aS,aL].forEach(e=>e.addEventListener("input",renderAtlas));
const fromHash=()=>{ if(location.hash.indexOf("#tool=")===0){ aQ.value=decodeURIComponent(location.hash.slice(6)); aO.value=aS.value=aL.value=""; } renderAtlas(); };
fromHash(); if(MULTI) window.addEventListener("hashchange",fromHash);
}

/* ---------- benchmarks ---------- */
function benchTable(list, withLayer){
  let h='<table><tr><th>Study</th>'+(withLayer?'<th>Layer</th>':'')+'<th>What it found</th><th>Practical takeaway</th></tr>';
  list.forEach(b=>{ h+='<tr><td class="wrap" style="min-width:12rem"><a href="'+pubmed(b[1])+'" target="_blank" rel="noopener">'+esc(b[2])+'</a><div class="mono" style="font-weight:400;font-size:.7rem;color:var(--ink-3);margin-top:4px">'+esc(b[1])+'</div></td>'+
    (withLayer?'<td class="wrap" style="color:var('+LAYER[b[0]][1]+')">'+LAYER[b[0]][0]+'</td>':'')+'<td class="wrap" style="min-width:16rem">'+esc(b[3])+'</td><td class="wrap" style="min-width:12rem">'+esc(b[4])+'</td></tr>'; });
  return h+'</table>';
}
$$(".benchlist").forEach(el=>{
  el.classList.add("tbl","wide");
  if(el.dataset.omics==="*") return;
  el.innerHTML=benchTable(BENCH.filter(b=>b[0]===el.dataset.omics),false);
});
const bQ=$("#benchQ"), bO=$("#benchOmics"), hub=$('#benchmarks .benchlist');
if(bQ){
[...new Set(BENCH.map(b=>b[0]))].forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=LAYER[k][0]; bO.appendChild(o); });
function renderBench(){ const q=bQ.value.trim().toLowerCase();
  const list=BENCH.filter(b=>(!bO.value||b[0]===bO.value)&&(!q||b.join(" ").toLowerCase().includes(q)));
  hub.innerHTML=list.length?benchTable(list,true):'<p style="padding:14px">No benchmarks match. Clear the filter to see all.</p>'; $("#benchCount").textContent=list.length+" of "+BENCH.length+" studies"; }
[bQ,bO].forEach(e=>e.addEventListener("input",renderBench)); renderBench();
}

/* ---------- glossary ---------- */
if($("#glossary")) $("#glossary").innerHTML=GLOSSARY.slice().sort((a,b)=>a[0].localeCompare(b[0])).map(g=>'<dt>'+esc(g[0])+'</dt><dd>'+esc(g[1])+'</dd>').join("");

/* ---------- codon table ---------- */
if($("#codonTable")) (function(){
  const B="UCAG", AA="FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  const N={F:"Phe",L:"Leu",S:"Ser",Y:"Tyr","*":"Stop",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly"};
  let h='<table class="codon"><tr><th>1st</th><th>U</th><th>C</th><th>A</th><th>G</th><th>3rd</th></tr>';
  for(let i=0;i<4;i++) for(let k=0;k<4;k++){
    h+='<tr>'+(k===0?'<td rowspan="4" style="vertical-align:middle;font-weight:600">'+B[i]+'</td>':'');
    for(let j=0;j<4;j++){ const c=B[i]+B[j]+B[k], a=AA[16*i+4*j+k]; const cls=a==="*"?"stop":(c==="AUG"?"start":"");
      h+='<td class="'+cls+'">'+c+' '+N[a]+'</td>'; }
    h+='<td style="font-weight:400">'+B[k]+'</td></tr>';
  }
  $("#codonTable").innerHTML=h+'</table><div class="mono" style="padding:8px 12px;font-size:.72rem;color:var(--ink-3)">The standard genetic code, read as mRNA codons. AUG (green) is Met and the usual start; UAA, UAG, UGA (red) are stops. The mitochondrial code differs (e.g. UGA = Trp).</div>';
})();

/* ---------- alternative splicing figure ---------- */
(function(){
  const svg=$("#asFig"); if(!svg) return;
  const rows=[
    ["Cassette exon",[[200,280,0],[480,560,1],[760,840,0]],[[280,480],[560,760]],[[280,760]]],
    ["Alt. 5′ splice site",[[200,300,0],[300,350,1],[760,840,0]],[[350,760]],[[300,760]]],
    ["Alt. 3′ splice site",[[200,280,0],[650,700,1],[700,840,0]],[[280,650]],[[280,700]]],
    ["Intron retention",[[200,400,0],[400,600,2],[600,800,0]],[],[[400,600]]],
    ["Mutually exclusive",[[200,270,0],[380,450,1],[560,630,1],[760,830,0]],[[270,380],[450,760]],[[270,560],[630,760]]],
    ["Alt. first exon",[[200,260,1],[380,440,1],[700,800,0]],[[260,700]],[[440,700]]],
    ["Alt. last exon",[[200,300,0],[500,560,1],[740,800,1]],[[300,500]],[[300,740]]]
  ];
  let h='';
  rows.forEach((r,i)=>{
    const y=40+i*62;
    h+='<text x="0" y="'+(y+4)+'" font-size="11">'+r[0]+'</text><line x1="190" y1="'+y+'" x2="880" y2="'+y+'" stroke="var(--ink-3)" stroke-width="1.5"/>';
    r[2].forEach(a=>{ const m=(a[0]+a[1])/2; h+='<path d="M'+a[0]+' '+(y-9)+' Q'+m+' '+(y-34)+' '+a[1]+' '+(y-9)+'" fill="none" stroke="var(--ink-2)" stroke-width="1.4"/>'; });
    r[3].forEach(a=>{ const m=(a[0]+a[1])/2; h+='<path d="M'+a[0]+' '+(y+9)+' Q'+m+' '+(y+32)+' '+a[1]+' '+(y+9)+'" fill="none" stroke="var(--met)" stroke-width="1.4" stroke-dasharray="4 3"/>'; });
    r[1].forEach(e=>{ const f=e[2]===0?"var(--rna)":e[2]===1?"var(--prot)":"var(--prot-bg)"; h+='<rect x="'+e[0]+'" y="'+(y-9)+'" width="'+(e[1]-e[0])+'" height="18" fill="'+f+'"'+(e[2]===2?' stroke="var(--prot)" stroke-dasharray="3 2"':'')+'/>'; });
    if(i===5){ [200,380].forEach(x=>{ h+='<path d="M'+x+' '+(y-9)+' v-14 h12" fill="none" stroke="var(--ink)" stroke-width="1.4"/>'; }); }
  });
  h+='<g font-size="10" fill="var(--ink-3)"><rect x="190" y="458" width="14" height="8" fill="var(--rna)"/><text x="210" y="466">constitutive exon</text><rect x="330" y="458" width="14" height="8" fill="var(--prot)"/><text x="350" y="466">alternative segment</text><line x1="480" y1="462" x2="510" y2="462" stroke="var(--ink-2)"/><text x="516" y="466">outcome A</text><line x1="600" y1="462" x2="630" y2="462" stroke="var(--met)" stroke-dasharray="4 3"/><text x="636" y="466">outcome B</text></g>';
  svg.innerHTML=h;
})();

/* ---------- chromatogram ---------- */
const SEQ="ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGAGCCCCCTCTGAGTCAGGAAACATTTTCAGACCTATGGAAACTACTTCCTGAAAACAACGTTCTG";
if($("#traceSeq")) $("#traceSeq").innerHTML="TP53 codons 1–32 · <span>"+SEQ.slice(0,24).split("").map(b=>'<span class="'+b+'">'+b+'</span>').join("")+"…</span>";
const cv=$("#trace"); let raf=null, t0=null;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function rnd(i){ const x=Math.sin(i*12.9898)*43758.5453; return x-Math.floor(x); }
function drawTrace(off){
  const r=cv.getBoundingClientRect(); const dpr=window.devicePixelRatio||1;
  if(cv.width!==Math.round(r.width*dpr)){ cv.width=Math.round(r.width*dpr); cv.height=Math.round(r.height*dpr); }
  const ctx=cv.getContext("2d"); ctx.setTransform(dpr,0,0,dpr,0,0);
  const W=r.width, H=r.height, cs=getComputedStyle(document.documentElement);
  const col={A:cs.getPropertyValue("--dna").trim(),C:cs.getPropertyValue("--rna").trim(),G:cs.getPropertyValue("--prot").trim(),T:cs.getPropertyValue("--met").trim()};
  ctx.clearRect(0,0,W,H);
  const sp=14, n=SEQ.length, total=n*sp, base=H-10, top=26;
  ctx.font="500 10px 'IBM Plex Mono', monospace"; ctx.textAlign="center";
  ["A","C","G","T"].forEach(b=>{
    ctx.beginPath(); ctx.strokeStyle=col[b]; ctx.lineWidth=1.5;
    for(let x=0;x<=W;x+=1.5){
      let y=0; const gx=x+off;
      const i0=Math.floor(gx/sp)-2;
      for(let k=i0;k<i0+5;k++){ const ii=((k%n)+n)%n; const cx=k*sp+sp/2; const d=gx-cx;
        const h=SEQ[ii]===b?(0.55+0.45*rnd(ii)):0.05*rnd(ii*7+b.charCodeAt(0));
        y+=h*Math.exp(-(d*d)/(2*3.4*3.4)); }
      const py=base-y*(base-top); if(x===0) ctx.moveTo(x,py); else ctx.lineTo(x,py);
    }
    ctx.stroke();
  });
  const first=Math.floor(off/sp);
  for(let k=first;k<first+Math.ceil(W/sp)+2;k++){ const ii=((k%n)+n)%n, x=k*sp+sp/2-off; ctx.fillStyle=col[SEQ[ii]]; ctx.fillText(SEQ[ii],x,14); }
}
function startTrace(){
  if(!cv) return;
  if(raf) cancelAnimationFrame(raf);
  if(reduce){ drawTrace(0); return; }
  const step=ts=>{ if(!$("#home").classList.contains("on")){ raf=null; return; } if(t0===null) t0=ts; drawTrace(((ts-t0)*0.02)%(SEQ.length*14)); raf=requestAnimationFrame(step); };
  drawTrace(0); raf=requestAnimationFrame(step);
}
window.addEventListener("resize",()=>{ if(cv && $("#home").classList.contains("on")) drawTrace(0); });

/* ---------- search ---------- */
const q=$("#q"), res=$("#results");
const index=MULTI ? SEARCH : sections.map(s=>({id:s.id,title:s.dataset.title,text:s.textContent.replace(/\s+/g," ")}));
q.addEventListener("input",()=>{
  const v=q.value.trim().toLowerCase(); if(v.length<2){ res.classList.remove("on"); return; }
  let h=""; let n=0;
  index.forEach(s=>{ const i=s.text.toLowerCase().indexOf(v); if(i>=0 && n<8){ n++;
    const sn=s.text.slice(Math.max(0,i-40),i+70); h+='<a href="'+pageUrl(s.id)+'"><b>'+esc(s.title)+'</b><span>…'+esc(sn)+'…</span></a>'; } });
  const tools=TOOLS.filter(t=>t[0].toLowerCase().includes(v)).slice(0,6);
  tools.forEach(t=>{ h+='<a href="'+(MULTI?pageUrl("atlas")+"#tool="+encodeURIComponent(t[0]):"#atlas")+'" data-tool="'+esc(t[0])+'"><b>'+esc(t[0])+'</b><span>tool · '+LAYER[t[1]][0]+' · '+esc(t[2])+'</span></a>'; });
  res.innerHTML=h||'<div class="none">No matches. Try a tool name or a term such as "eQTL".</div>'; res.classList.add("on");
});
res.addEventListener("click",e=>{ const a=e.target.closest("a"); if(!a) return; if(MULTI){ res.classList.remove("on"); return; } if(a.dataset.tool){ aQ.value=a.dataset.tool; aO.value=""; aS.value=""; aL.value=""; renderAtlas(); }
  res.classList.remove("on"); q.value=""; if(a.getAttribute("href")==="#"+location.hash.slice(1)) show(location.hash.slice(1)); });
document.addEventListener("click",e=>{ if(!e.target.closest(".search")) res.classList.remove("on"); });
q.addEventListener("keydown",e=>{ if(e.key==="Escape"){ res.classList.remove("on"); q.blur(); } if(e.key==="Enter"){ const f=$("a",res); if(f) f.click(); } });

/* ---------- theme ---------- */
const tb=$("#themeBtn"), modes=["light","dark","auto"];
let mode="light"; try{ mode=localStorage.getItem("ofg-theme2")||"light"; }catch(e){}
function applyTheme(){ if(mode==="auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme",mode); tb.textContent="Theme: "+mode; if(cv && $("#home").classList.contains("on")&&reduce) drawTrace(0); }
tb.addEventListener("click",()=>{ mode=modes[(modes.indexOf(mode)+1)%3]; try{ localStorage.setItem("ofg-theme2",mode); }catch(e){} applyTheme(); });
applyTheme();

if(MULTI){ if($("#home")) startTrace(); } else show(location.hash.slice(1)||"home", true);
})();
