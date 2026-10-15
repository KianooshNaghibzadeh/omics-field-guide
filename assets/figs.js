// Figure library: fills <div class="figx" data-fig="name" data-cap="..."> with generated SVG/HTML.
(function(){
const BC={A:"var(--dna)",C:"var(--rna)",G:"var(--prot)",T:"var(--met)",U:"var(--met)"};
const svg=(w,h,inner)=>'<svg viewBox="0 0 '+w+' '+h+'" role="img" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';
const t=(x,y,s,a)=>'<text x="'+x+'" y="'+y+'" '+(a||'font-size="11"')+'>'+s+'</text>';
const r=(x,y,w,h,f,a)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'" '+(a||'')+'/>';
const ln=(x1,y1,x2,y2,a)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+(a||'stroke="var(--ink-3)"')+'/>';
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let x=Math.imul(seed^seed>>>15,1|seed); x=x+Math.imul(x^x>>>7,61|x)^x; return ((x^x>>>14)>>>0)/4294967296; }; }
function gauss(R){ let u=0,v=0; while(!u)u=R(); while(!v)v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
const CODE=(()=>{ const B="TCAG",AA="FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",m={}; for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)m[B[i]+B[j]+B[k]]=AA[16*i+4*j+k]; return m; })();
const AA3={F:"Phe",L:"Leu",S:"Ser",Y:"Tyr","*":"Stop",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly"};
const axis=(x0,y0,x1,y1)=>ln(x0,y1,x1,y1,'stroke="var(--ink-3)"')+ln(x0,y0,x0,y1,'stroke="var(--ink-3)"');

const FIG={};

/* ---- central dogma: one sequence through three molecules ---- */
FIG.transcribe=()=>{
  const cod="ATGGCCTGGAAAGACTGA", comp={A:"T",T:"A",G:"C",C:"G"};
  const tmpl=cod.split("").map(b=>comp[b]).join(""), mrna=cod.replace(/T/g,"U");
  let h='', x0=190, cw=22;
  const row=(y,label,seq,ends,dim)=>{ let s=t(10,y+5,label,'font-size="12" font-weight="600"')+t(x0-30,y+5,ends[0],'font-size="11" class="lbl"');
    seq.split("").forEach((b,i)=>{ const x=x0+i*cw+Math.floor(i/3)*8; s+=t(x,y+5,b,'font-size="15" font-weight="600" fill="'+BC[b]+'"'+(dim?' opacity=".55"':'')); });
    return s+t(x0+seq.length*cw+48,y+5,ends[1],'font-size="11" class="lbl"'); };
  h+=row(30,"DNA coding strand",cod,["5′","3′"]); h+=row(58,"DNA template strand",tmpl,["3′","5′"],true);
  for(let i=0;i<cod.length;i++){ const x=x0+i*cw+Math.floor(i/3)*8+5; h+=ln(x,36,x,46,'stroke="var(--ink-3)" stroke-dasharray="1 2"'); }
  h+=t(10,95,"↓ transcription (RNA polymerase reads the template, writes U for T)",'font-size="10" class="lbl"');
  h+=row(125,"mRNA",mrna,["5′","3′"]);
  for(let c=0;c<6;c++){ const x=x0+c*(3*cw+8)-4; h+=r(x,108,3*cw,26,"none",'stroke="var(--rule)" rx="3"'); }
  h+=t(10,162,"↓ translation (ribosome reads codons; tRNAs bring amino acids)",'font-size="10" class="lbl"');
  for(let c=0;c<6;c++){ const a=CODE[cod.slice(c*3,c*3+3)], x=x0+c*(3*cw+8)-4;
    h+=r(x,178,3*cw,28,a==="*"?"var(--met-bg)":"var(--prot-bg)",'stroke="'+(a==="*"?"var(--met)":"var(--prot)")+'" rx="14"')+t(x+3*cw/2,197,AA3[a],'font-size="12" text-anchor="middle" font-weight="600"'); }
  h+=t(10,197,"Protein",'font-size="12" font-weight="600"')+t(x0+6*(3*cw+8),197,"N → C",'font-size="10" class="lbl"');
  return svg(900,225,h);
};

/* ---- mutation effects ---- */
FIG.mutfx=()=>{
  const ref="ATGGCCTGGAAAGACCTGTAA";
  const rows=[["Reference",ref,-1],["Synonymous (c.6C>T)","ATGGCTTGGAAAGACCTGTAA",5],["Missense (c.4G>A)","ATGACCTGGAAAGACCTGTAA",3],["Nonsense (c.9G>A)","ATGGCCTGAAAAGACCTGTAA",8],["Frameshift (c.5delC)","ATGGCTGGAAAGACCTGTAA",4]];
  let h='', x0=200, cw=19;
  rows.forEach((rw,ri)=>{ const y=28+ri*62, s=rw[1]; h+=t(10,y+5,rw[0],'font-size="11.5" font-weight="600"');
    let stop=false;
    for(let i=0;i<s.length;i++){ const x=x0+i*cw+Math.floor(i/3)*7; const changed=(ri>0&&i===rw[2]);
      if(changed) h+=r(x-3,y-11,cw-1,22,"var(--mark)",'rx="2"');
      h+=t(x+1,y+5,s[i],'font-size="13.5" font-weight="600" fill="'+BC[s[i]]+'"'); }
    if(ri===4) h+=t(x0+4*cw+5,y-14,"▾ C deleted",'font-size="9.5" fill="var(--met)"');
    for(let c=0;c*3+3<=s.length;c++){ const a=stop?"":CODE[s.slice(c*3,c*3+3)]; const x=x0+c*(3*cw+7);
      const refA=CODE[ref.slice(c*3,c*3+3)]; const diff=ri>0&&a&&a!==refA;
      if(a) h+=t(x+1.5*cw,y+26,AA3[a],'font-size="11" text-anchor="middle" '+(diff?'font-weight="700" fill="var(--met)"':'class="lbl"'));
      if(a==="*") stop=true; }
  });
  h+=t(x0+21*cw+60,28+5,"Met-Ala-Trp-Lys-Asp-Leu",'font-size="10" class="lbl"');
  h+=t(x0+21*cw+60,90+5,"same protein",'font-size="10" class="lbl"')+t(x0+21*cw+60,152+5,"Ala → Thr",'font-size="10" class="lbl"')+t(x0+21*cw+60,214+5,"truncated after Ala; mRNA → NMD",'font-size="10" class="lbl"')+t(x0+21*cw+60,276+5,"new reading frame from codon 2",'font-size="10" class="lbl"');
  return svg(980,330,h);
};

/* ---- library structure ---- */
FIG.library=()=>{
  const seg=[["P5",50,"var(--ink-3)"],["i5 index",70,"var(--prot)"],["Read 1 primer",110,"var(--paper-2)"],["Insert: your DNA fragment (~300 bp)",310,"var(--dna)"],["Read 2 primer",110,"var(--paper-2)"],["i7 index",70,"var(--prot)"],["P7",50,"var(--ink-3)"]];
  let x=30,h='';
  seg.forEach(s=>{ h+=r(x,70,s[1],34,s[2],'stroke="var(--ink-3)" stroke-width=".6"')+t(x+s[1]/2,92,s[0],'font-size="11" text-anchor="middle" '+(s[2]==="var(--dna)"?'fill="var(--paper)" font-weight="600"':'')); x+=s[1]; });
  h+='<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs>';
  h+=ln(260,52,500,52,'stroke="var(--ink)" stroke-width="2" marker-end="url(#fa)"')+t(260,44,"Read 1 (e.g. 150 cycles) →",'font-size="11"');
  h+=ln(570,128,330,128,'stroke="var(--ink)" stroke-width="2" marker-end="url(#fa)"')+t(420,146,"← Read 2",'font-size="11"');
  h+=t(30,30,"flow-cell binding",'font-size="10" class="lbl"')+t(110,30,"sample barcode",'font-size="10" class="lbl"')+t(640,30,"sample barcode",'font-size="10" class="lbl"')+t(740,30,"flow-cell binding",'font-size="10" class="lbl"');
  h+=t(30,170,"Paired-end reads come from both ends of the same fragment. If the fragment is shorter than 2 × read length, the reads overlap; if shorter than one read, the read runs into the adapter (adapter trimming).",'font-size="10" class="lbl"');
  return svg(900,185,h);
};

/* ---- sequencing by synthesis ---- */
FIG.sbs=()=>{
  const reads=["GATTACAGCT","TTCGGACATA","CAGGTCTTAG","ACGTTGCAAC","GGCATTACGA","TCAGCCATTG"];
  let h=''; const x0=120,cw=56,y0=40,rh=40;
  for(let c=0;c<10;c++) h+=t(x0+c*cw+cw/2,24,"cycle "+(c+1),'font-size="10" text-anchor="middle" class="lbl"');
  reads.forEach((s,i)=>{ const y=y0+i*rh; h+=t(10,y+rh/2+4,"cluster "+(i+1),'font-size="11"');
    for(let c=0;c<10;c++){ const b=s[c]; h+='<circle cx="'+(x0+c*cw+cw/2)+'" cy="'+(y+rh/2)+'" r="13" fill="'+BC[b]+'" opacity="'+(1-c*0.045)+'"/>'+t(x0+c*cw+cw/2,y+rh/2+4,b,'font-size="11" text-anchor="middle" fill="var(--paper)" font-weight="600"'); }
    h+=t(x0+10*cw+18,y+rh/2+4,s.split("").map(b=>'<tspan fill="'+BC[b]+'">'+b+'</tspan>').join(""),'font-size="13" font-weight="600" letter-spacing="1.5"'); });
  h+=t(x0,y0+6*rh+20,"Fading colour toward later cycles represents phasing: signal purity drops, so base quality falls along the read.",'font-size="10" class="lbl"');
  return svg(900,y0+6*rh+30,h);
};

/* ---- FASTQ anatomy ---- */
FIG.fastq=()=>{
  const seq="GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCC"; const R=rng(7);
  const q=seq.split("").map((b,i)=>Math.max(8,Math.min(40,Math.round(38-i*0.32+gauss(R)*2.4-(i===31?14:0)))));
  const x0=150,cw=17; let h='';
  h+=t(10,30,"1  header",'font-size="11" font-weight="600"')+t(x0,30,"@A00123:8:H7KJ2DSXY:1:1101:10004:1000 1:N:0:ATCACG+GTACCT",'font-size="12"');
  h+=t(x0,46,"instrument : run : flow cell : lane : tile : x : y      read 1 : not filtered : sample index",'font-size="9.5" class="lbl"');
  h+=t(10,76,"2  sequence",'font-size="11" font-weight="600"');
  seq.split("").forEach((b,i)=>{ h+=t(x0+i*cw,76,b,'font-size="13.5" font-weight="600" fill="'+BC[b]+'"'); });
  h+=t(10,102,"3  separator",'font-size="11" font-weight="600"')+t(x0,102,"+",'font-size="13"');
  h+=t(10,128,"4  qualities",'font-size="11" font-weight="600"');
  q.forEach((v,i)=>{ const ch=String.fromCharCode(v+33).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"); h+=t(x0+i*cw,128,ch,'font-size="13"'); });
  const by=250, sc=2.4; h+=axis(x0-6,by-40*sc,x0+40*cw,by);
  q.forEach((v,i)=>{ h+=r(x0+i*cw,by-v*sc,cw-4,v*sc,v>=30?"var(--dna)":v>=20?"var(--prot)":"var(--met)"); });
  h+=ln(x0-6,by-30*sc,x0+40*cw,by-30*sc,'stroke="var(--ink-2)" stroke-dasharray="4 3"')+t(x0+40*cw+6,by-30*sc+4,"Q30",'font-size="10" class="lbl"');
  h+=ln(x0-6,by-20*sc,x0+40*cw,by-20*sc,'stroke="var(--ink-3)" stroke-dasharray="2 3"')+t(x0+40*cw+6,by-20*sc+4,"Q20",'font-size="10" class="lbl"');
  h+=t(10,by-50,"Phred score",'font-size="10" class="lbl"')+t(10,by-36,"per base",'font-size="10" class="lbl"')+t(x0,by+16,"position in read → (quality decays toward the 3′ end; base 32 is a low-confidence call)",'font-size="10" class="lbl"');
  return svg(900,275,h);
};

/* ---- nanopore squiggle ---- */
FIG.nanopore=()=>{
  const seq="GACTCGATTACGGA"; const R=rng(3); const lev={A:0.55,C:0.35,G:0.75,T:0.2};
  let h='', x0=40, w=58, y0=40, H=150, pts=[], alt=[];
  for(let i=0;i<seq.length-4;i++){ const k=seq.slice(i,i+5); let L=0.15+0.7*(lev[k[1]]*.3+lev[k[2]]*.45+lev[k[3]]*.25)/0.75;
    const n=12; for(let j=0;j<n;j++){ const x=x0+i*w+j*(w/n); const y=y0+H-(L+gauss(R)*0.025)*H; pts.push(x.toFixed(1)+","+y.toFixed(1)); }
    if(k==="TCGAT"||k==="CTCGA"){ alt.push([x0+i*w,y0+H-(L+0.09)*H]); }
    h+=t(x0+i*w+w/2,y0+H+22,k,'font-size="9.5" text-anchor="middle" class="lbl"'); }
  h+='<polyline points="'+pts.join(" ")+'" fill="none" stroke="var(--rna)" stroke-width="1.6"/>';
  alt.forEach(a=>{ h+=ln(a[0],a[1],a[0]+w,a[1],'stroke="var(--met)" stroke-width="2" stroke-dasharray="5 3"'); });
  h+=axis(x0-6,y0-6,x0+(seq.length-4)*w,y0+H)+t(6,y0+8,"pA",'font-size="10" class="lbl"')+t(x0,y0+H+40,"5-mer in the pore at each step  →  time",'font-size="10" class="lbl"');
  h+=t(x0+3*w,y0-10,"dashed: same k-mers with 5mC at the CpG",'font-size="10" fill="var(--met)"');
  return svg(900,y0+H+50,h);
};

/* ---- LC-MS ---- */
FIG.lcms=()=>{
  let h=''; const L=40,T=30,W=360,H=170;
  h+=axis(L,T,L+W,T+H)+t(L,T-10,"Extracted ion chromatogram, m/z 203.053",'font-size="11" font-weight="600"');
  let p=[]; for(let i=0;i<=120;i++){ const rt=3+i*(2.5/120), y=Math.exp(-Math.pow(rt-4.2,2)/(2*0.06*0.06)) + 0.02*Math.sin(i*1.7)*Math.exp(-Math.abs(rt-4.2)); p.push((L+i*W/120).toFixed(1)+","+(T+H-y*H*0.9).toFixed(1)); }
  h+='<polyline points="'+p.join(" ")+'" fill="var(--met-bg)" stroke="var(--met)" stroke-width="1.8"/>';
  [3,3.5,4,4.5,5,5.5].forEach(v=>{ const x=L+(v-3)/2.5*W; h+=ln(x,T+H,x,T+H+4)+t(x,T+H+16,v.toFixed(1),'font-size="10" text-anchor="middle" class="lbl"'); });
  h+=t(L+W/2,T+H+32,"retention time (min)",'font-size="10" text-anchor="middle" class="lbl"')+t(L+(4.2-3)/2.5*W+8,T+14,"apex 4.20 min",'font-size="10"');
  const L2=480,W2=380,mz0=178,mz1=208; h+=axis(L2,T,L2+W2,T+H)+t(L2,T-10,"Mass spectrum at the apex",'font-size="11" font-weight="600"');
  const pk=[[181.0707,40,"[M+H]⁺ 181.071"],[182.0741,2.7,""],[203.0526,100,"[M+Na]⁺ 203.053"],[204.0560,6.8,"¹³C isotope"],[205.0569,1.3,""],[219.0266,0,""]];
  pk.forEach(k=>{ if(!k[1])return; const x=L2+(k[0]-mz0)/(mz1-mz0)*W2, y=T+H-k[1]/100*H*0.92; h+=ln(x,T+H,x,y,'stroke="var(--rna)" stroke-width="3"'); if(k[2]) h+=t(x+4,y-4,k[2],'font-size="10"'); });
  [180,185,190,195,200,205].forEach(v=>{ const x=L2+(v-mz0)/(mz1-mz0)*W2; h+=ln(x,T+H,x,T+H+4)+t(x,T+H+16,v,'font-size="10" text-anchor="middle" class="lbl"'); });
  h+=t(L2+W2/2,T+H+32,"m/z",'font-size="10" text-anchor="middle" class="lbl"')+t(L2-30,T+10,"rel.",'font-size="10" class="lbl"')+t(L2-30,T+22,"int.",'font-size="10" class="lbl"');
  return svg(900,T+H+45,h);
};

/* ---- genomics pileup ---- */
FIG.pileup=()=>{
  const ref="CCTGAAGTCAGGATCGTGACGTTCAAGCCTGGAACTTCGATCCA"; const L=ref.length, x0=110, cw=17.5;
  const snv=21, alt="A", del=[32,33]; // 0-based positions; ref[21]='T'? we set below
  const reads=[[0,30,1,0,0],[2,32,1,1,0],[4,28,0,0,0],[5,34,1,1,1],[8,30,0,1,0],[9,33,1,0,1],[12,31,0,1,1],[13,30,1,0,0],[14,30,0,0,1],[16,28,1,1,0],[17,27,0,0,1],[3,27,1,0,0]];
  // [start,len,hasAlt,strand(1=fwd),hasDel]
  let h=''; const covY=20, refY=110, ry0=130, rh=15;
  const cov=new Array(L).fill(0), altc=new Array(L).fill(0);
  reads.forEach(rd=>{ for(let i=rd[0];i<Math.min(L,rd[0]+rd[1]);i++){ if(rd[4]&&del.includes(i)) continue; cov[i]++; if(rd[2]&&i===snv) altc[i]++; } });
  const mx=Math.max(...cov);
  h+=t(10,covY+30,"coverage",'font-size="10.5" class="lbl"');
  cov.forEach((c,i)=>{ const hh=c/mx*60; h+=r(x0+i*cw,covY+62-hh,cw-1,hh,"var(--paper-2)",'stroke="var(--ink-3)" stroke-width=".4"'); if(altc[i]) h+=r(x0+i*cw,covY+62-altc[i]/mx*60,cw-1,altc[i]/mx*60,BC[alt]); });
  h+=t(10,refY+4,"reference",'font-size="10.5" font-weight="600"');
  ref.split("").forEach((b,i)=>{ h+=t(x0+i*cw+cw/2,refY+4,b,'font-size="12.5" font-weight="600" text-anchor="middle" fill="'+BC[b]+'"'); });
  reads.slice().sort((a,b)=>a[0]-b[0]).forEach((rd,k)=>{ const y=ry0+k*rh, s=rd[0], e=Math.min(L,rd[0]+rd[1]);
    h+=r(x0+s*cw,y,(e-s)*cw-1,rh-4,rd[3]?"var(--rna-bg)":"var(--met-bg)",'rx="1"');
    if(rd[4]&&s<=del[0]&&e>del[1]){ h+=r(x0+del[0]*cw,y,2*cw,rh-4,"var(--paper)")+ln(x0+del[0]*cw,y+(rh-4)/2,x0+(del[1]+1)*cw,y+(rh-4)/2,'stroke="var(--ink)" stroke-width="1.6"'); }
    if(rd[2]&&s<=snv&&e>snv) h+=t(x0+snv*cw+cw/2,y+9.5,alt,'font-size="11" font-weight="700" text-anchor="middle" fill="'+BC[alt]+'"');
    if(k===6) h+=t(x0+10*cw+cw/2,y+9.5,"C",'font-size="11" font-weight="700" text-anchor="middle" fill="'+BC.C+'" opacity=".45"');
    h+=t(rd[3]?x0+e*cw-9:x0+s*cw+3,y+9,rd[3]?"›":"‹",'font-size="10" class="lbl"'); });
  const yb=ry0+reads.length*rh+18;
  h+=ln(x0+snv*cw+cw/2,refY+8,x0+snv*cw+cw/2,yb-10,'stroke="var(--ink-3)" stroke-dasharray="2 3"')+t(x0+snv*cw-40,yb+4,"het SNV "+ref[snv]+">"+alt+" · "+altc[snv]+"/"+cov[snv]+" reads (VAF "+Math.round(altc[snv]/cov[snv]*100)+"%)",'font-size="10.5" font-weight="600"');
  h+=t(x0+del[0]*cw-10,yb+20,"2-bp deletion in a subset of reads",'font-size="10.5" font-weight="600"');
  h+=t(x0+6*cw,yb+36,"faded C: a single-read sequencing error (low base quality), not a variant",'font-size="10.5" class="lbl"');
  h+=t(10,ry0+8,"reads",'font-size="10.5" class="lbl"')+t(10,ry0+22,"blue = +",'font-size="9.5" class="lbl"')+t(10,ry0+34,"red = −",'font-size="9.5" class="lbl"');
  return svg(x0+L*cw+20,yb+48,h);
};

/* ---- bisulfite ---- */
FIG.bisulfite=()=>{
  const ref="TACGATCCGTTCACGGTCAGCGTA"; const meth={2:1,7:0,13:1,20:1}; // CpG C positions: 1=methylated
  const x0=170,cw=22; let h='';
  const row=(y,label,s,cls)=>{ let o=t(10,y+5,label,'font-size="11" font-weight="600"'); s.split("").forEach((b,i)=>{ o+=t(x0+i*cw+cw/2,y+5,b,'font-size="14" font-weight="600" text-anchor="middle" fill="'+(b==="U"?"var(--met)":BC[b])+'"'); }); return o; };
  h+=row(30,"genomic DNA",ref);
  Object.keys(meth).forEach(p=>{ if(meth[p]) h+='<circle cx="'+(x0+p*cw+cw/2)+'" cy="14" r="4.5" fill="var(--ink)"/>'; else h+='<circle cx="'+(x0+p*cw+cw/2)+'" cy="14" r="4.5" fill="none" stroke="var(--ink)"/>'; });
  h+=t(x0+ref.length*cw+12,18,"● methylated CpG  ○ unmethylated",'font-size="10" class="lbl"');
  const bs=ref.split("").map((b,i)=>b==="C"&&!(meth[i]===1)?"U":b).join(""); h+=row(70,"after bisulfite",bs);
  h+=t(x0+ref.length*cw+12,74,"unmethylated C → U",'font-size="10" class="lbl"');
  const pcr=bs.replace(/U/g,"T"); h+=row(108,"sequenced read",pcr); h+=t(x0+ref.length*cw+12,112,"U is read as T after PCR",'font-size="10" class="lbl"');
  ref.split("").forEach((b,i)=>{ if(b==="C"&&pcr[i]==="T") h+=r(x0+i*cw+2,92,cw-4,22,"var(--mark)",'opacity=".55" rx="2"'); });
  // methylation level across reads
  const R=rng(11), y0=150, n=8; const prob={2:.9,7:.12,13:.75,20:.5};
  h+=t(10,y0+8,"8 reads at the",'font-size="10.5" class="lbl"')+t(10,y0+22,"four CpGs",'font-size="10.5" class="lbl"');
  const cnt={};
  for(let k=0;k<n;k++){ Object.keys(prob).forEach(p=>{ const m=R()<prob[p]; cnt[p]=(cnt[p]||0)+(m?1:0); h+='<circle cx="'+(x0+p*cw+cw/2)+'" cy="'+(y0+k*14)+'" r="5" '+(m?'fill="var(--ink)"':'fill="var(--card)" stroke="var(--ink-2)"')+'/>'; }); }
  Object.keys(prob).forEach(p=>{ h+=t(x0+p*cw+cw/2,y0+n*14+12,Math.round(cnt[p]/n*100)+"%",'font-size="11" font-weight="600" text-anchor="middle"'); });
  h+=t(x0+ref.length*cw+12,y0+n*14+12,"methylation level = C reads / (C + T reads)",'font-size="10" class="lbl"');
  return svg(900,y0+n*14+26,h);
};

/* ---- ATAC-seq ---- */
FIG.atac=()=>{
  const R=rng(5); let h=''; const x0=20,W=560,dy=70;
  h+=ln(x0,dy,x0+W,dy,'stroke="var(--ink-2)" stroke-width="2"');
  const nuc=[40,90,140,190,380,430,480,530]; nuc.forEach(x=>{ h+='<ellipse cx="'+(x0+x)+'" cy="'+dy+'" rx="20" ry="14" fill="var(--epi-bg)" stroke="var(--epi)"/>'; });
  h+=r(x0+262,dy-10,36,20,"var(--prot)",'rx="4"')+t(x0+280,dy-16,"TF",'font-size="10" text-anchor="middle"');
  h+=t(x0+280,dy+36,"nucleosome-free region",'font-size="10" text-anchor="middle" class="lbl"')+t(x0+40,dy+36,"nucleosomes",'font-size="10" class="lbl"');
  const cuts=[]; for(let i=0;i<34;i++){ cuts.push(225+gauss(R)*28+ (R()<.5?-12:12)); } [65,115,165,405,455,505].forEach(c=>cuts.push(c+gauss(R)*4));
  cuts.forEach(c=>{ const x=x0+Math.max(5,Math.min(W-5,c)); h+='<path d="M'+x+' '+(dy-26)+' l-4 -8 h8z" fill="var(--met)"/>'; });
  h+=t(x0,dy-44,"▼ Tn5 insertion sites",'font-size="10" fill="var(--met)"');
  let p=[]; for(let i=0;i<=W;i+=4){ let v=0; cuts.forEach(c=>{ v+=Math.exp(-Math.pow(i-c,2)/(2*14*14)); }); p.push((x0+i)+","+(200-v*9).toFixed(1)); }
  h+='<polyline points="'+x0+',200 '+p.join(" ")+' '+(x0+W)+',200" fill="var(--epi-bg)" stroke="var(--epi)" stroke-width="1.5"/>'+t(x0,128,"ATAC-seq coverage → peak over open chromatin",'font-size="10" class="lbl"');
  // fragment length histogram
  const hx=640,hw=240,hy=200,hh=150; h+=axis(hx,hy-hh,hx+hw,hy)+t(hx,hy-hh-10,"Fragment length distribution",'font-size="11" font-weight="600"');
  let q=[]; for(let L=20;L<=700;L+=5){ const v=1.0*Math.exp(-Math.pow(L-60,2)/(2*25*25))+0.45*Math.exp(-Math.pow(L-200,2)/(2*30*30))+0.14*Math.exp(-Math.pow(L-390,2)/(2*35*35))+0.05*Math.exp(-Math.pow(L-580,2)/(2*40*40))+0.02; q.push((hx+(L-20)/680*hw).toFixed(1)+","+(hy-v*hh*0.9).toFixed(1)); }
  h+='<polyline points="'+q.join(" ")+'" fill="none" stroke="var(--epi)" stroke-width="1.8"/>';
  [["NFR",60],["mono",200],["di",390]].forEach(a=>{ h+=t(hx+(a[1]-20)/680*hw,hy-hh*0.95+(a[0]==="NFR"?0:a[0]==="mono"?70:110),a[0],'font-size="9.5" text-anchor="middle" class="lbl"'); });
  [100,300,500,700].forEach(v=>{ const x=hx+(v-20)/680*hw; h+=t(x,hy+14,v,'font-size="9.5" text-anchor="middle" class="lbl"'); });
  h+=t(hx+hw/2,hy+28,"bp",'font-size="9.5" text-anchor="middle" class="lbl"');
  return svg(900,235,h);
};

/* ---- Hi-C ---- */
FIG.hic=()=>{
  const N=48, s=6.4, x0=60, y0=20, tads=[0,13,25,38,48]; let h='';
  const tadOf=i=>tads.findIndex((b,k)=>i>=b&&i<tads[k+1]);
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){ const d=Math.abs(i-j); let v=1/(1+d*0.9); if(tadOf(i)===tadOf(j)) v*=2.6; if((Math.abs(i-5)<1.5&&Math.abs(j-23)<1.5)||(Math.abs(j-5)<1.5&&Math.abs(i-23)<1.5)) v+=0.55; const o=Math.min(1,v*0.42);
    h+=r((x0+j*s).toFixed(1),(y0+i*s).toFixed(1),s+0.3,s+0.3,"var(--met)",'opacity="'+o.toFixed(3)+'"'); }
  tads.slice(0,-1).forEach((b,k)=>{ const e=tads[k+1]; h+='<path d="M'+(x0+b*s)+' '+(y0+b*s)+' H'+(x0+e*s)+' V'+(y0+e*s)+'" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 2"/>'; });
  h+='<circle cx="'+(x0+23.5*s)+'" cy="'+(y0+5.5*s)+'" r="12" fill="none" stroke="var(--rna)" stroke-width="2"/>';
  h+=t(x0,y0+N*s+18,"genomic position (bins of 25 kb) →",'font-size="10" class="lbl"');
  const tx=x0+N*s+40;
  h+=t(tx,y0+20,"Reading a Hi-C map",'font-size="12" font-weight="600"');
  ["Each pixel (i, j): how often bins i and j were ligated,","i.e. touched in 3D, across millions of cells.","","Bright diagonal: neighbouring DNA always touches.","","Dashed triangles: TADs, domains that interact","mostly internally; boundaries often have CTCF.","","Circle: a loop, an enriched point contact between","two distant anchors (e.g. enhancer–promoter or","CTCF–CTCF), called by HiCCUPS or Mustache."].forEach((l,i)=>{ h+=t(tx,y0+44+i*16,l,'font-size="11" class="lbl"'); });
  return svg(900,y0+N*s+30,h);
};

/* ---- sashimi / exon coverage ---- */
FIG.sashimi=()=>{
  const ex=[[60,200,90],[380,470,52],[660,820,88]]; const R=rng(9); let h=''; const base=170;
  h+=ln(40,base,860,base,'stroke="var(--ink-3)"');
  ex.forEach(e=>{ for(let x=e[0];x<e[1];x+=4){ const v=e[2]*(0.85+0.3*R()); h+=r(x,base-v,4,v,"var(--rna)",'opacity=".85"'); } });
  const arc=(a,b,hgt,n,below)=>{ const m=(a+b)/2, y=below?base+6:base-100; h+='<path d="M'+a+' '+y+' Q'+m+' '+(below?y+hgt:y-hgt)+' '+b+' '+y+'" fill="none" stroke="'+(below?'var(--met)':'var(--ink-2)')+'" stroke-width="'+(1+n/14)+'"/>'+t(m,below?y+hgt/2+12:y-hgt/2-4,n,'font-size="11" text-anchor="middle" font-weight="600"'); };
  arc(200,380,40,58,false); arc(470,660,40,61,false); arc(200,660,60,34,true);
  ex.forEach((e,i)=>{ h+=r(e[0],base+70,e[1]-e[0],14,i===1?"var(--prot)":"var(--rna)")+t((e[0]+e[1])/2,base+100,"exon "+(i+1),'font-size="10.5" text-anchor="middle"'); });
  h+=ln(40,base+77,860,base+77,'stroke="var(--ink-3)"');
  ex.forEach(e=>{ h+=r(e[0],base+70,e[1]-e[0],14,"none"); });
  h+=t(40,22,"Sashimi plot: read coverage over exons, with junction-spanning read counts as arcs",'font-size="11" font-weight="600"');
  h+=t(560,226,"Ψ(exon 2) = mean inclusion junctions / (inclusion + skipping)",'font-size="10.5"')+t(560,242,"= 59.5 / (59.5 + 34) ≈ 0.64",'font-size="10.5" font-weight="600"');
  return svg(900,290,h);
};

/* ---- count matrix (HTML) ---- */
FIG.counts=()=>{
  const genes=["ACTB","GAPDH","CD3E","MS4A1","IL7R","LYZ","Novel lncRNA"], R=rng(4);
  const base=[42000,31000,1200,40,850,15,3];
  let h='<table><tr><th>gene</th><th>ctrl_1</th><th>ctrl_2</th><th>ctrl_3</th><th>treat_1</th><th>treat_2</th><th>treat_3</th></tr>';
  genes.forEach((g,i)=>{ h+='<tr><td>'+g+'</td>'; for(let s=0;s<6;s++){ const f=(i===2&&s>2)?2.6:(i===5&&s>2)?0.3:1; h+='<td class="mono" style="text-align:right">'+Math.max(0,Math.round(base[i]*f*(0.8+0.4*R()))).toLocaleString("en-US")+'</td>'; } h+='</tr>'; });
  return h+'<tr><td>… 20,000 more</td><td colspan="6" class="mono" style="color:var(--ink-3)">library sizes ≈ 25–32 million reads per sample</td></tr></table>';
};

/* ---- volcano ---- */
FIG.volcano=()=>{
  const R=rng(21); let h=''; const L=60,T=20,W=520,H=260; const X=v=>L+(v+5)/10*W, Y=v=>T+H-v/22*H;
  h+=axis(L,T,L+W,T+H);
  for(let i=0;i<900;i++){ let fc=gauss(R)*0.55, p=Math.abs(gauss(R))*0.9;
    if(i<60){ fc=(R()<.55?1:-1)*(1.2+R()*3.2); p=2+Math.abs(fc)*2.5+R()*6; }
    const sig=Math.abs(fc)>=1&&p>=1.3; const col=!sig?"var(--ink-3)":fc>0?"var(--met)":"var(--rna)";
    h+='<circle cx="'+X(Math.max(-5,Math.min(5,fc))).toFixed(1)+'" cy="'+Y(Math.min(21.5,p)).toFixed(1)+'" r="'+(sig?2.6:1.8)+'" fill="'+col+'" opacity="'+(sig?.9:.35)+'"/>'; }
  h+=ln(X(-1),T,X(-1),T+H,'stroke="var(--ink-2)" stroke-dasharray="3 3"')+ln(X(1),T,X(1),T+H,'stroke="var(--ink-2)" stroke-dasharray="3 3"')+ln(L,Y(1.3),L+W,Y(1.3),'stroke="var(--ink-2)" stroke-dasharray="3 3"');
  [-4,-2,0,2,4].forEach(v=>{ h+=t(X(v),T+H+15,v,'font-size="10" text-anchor="middle" class="lbl"'); }); [0,5,10,15,20].forEach(v=>{ h+=t(L-8,Y(v)+4,v,'font-size="10" text-anchor="end" class="lbl"'); });
  h+=t(L+W/2,T+H+32,"log₂ fold change (treated / control)",'font-size="10.5" text-anchor="middle" class="lbl"')+t(14,T+H/2,"−log₁₀ adj. p",'font-size="10.5" class="lbl" transform="rotate(-90 14 '+(T+H/2)+')" text-anchor="middle"');
  const lx=L+W+30; h+=t(lx,T+20,"How to read it",'font-size="12" font-weight="600"');
  [["var(--met)","up-regulated: FDR < 5%, FC ≥ 2"],["var(--rna)","down-regulated: FDR < 5%, FC ≤ ½"],["var(--ink-3)","not significant"]].forEach((a,i)=>{ h+='<circle cx="'+(lx+6)+'" cy="'+(T+44+i*22)+'" r="5" fill="'+a[0]+'"/>'+t(lx+18,T+48+i*22,a[1],'font-size="10.5"'); });
  ["Each dot is one gene. Right/left = up/down;","higher = stronger statistical evidence.","Dashed lines mark the chosen cut-offs."].forEach((l,i)=>{ h+=t(lx,T+130+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(900,T+H+45,h);
};

/* ---- single-cell read structure ---- */
FIG.scread=()=>{
  let h=''; const y=60;
  h+='<circle cx="70" cy="'+(y+30)+'" r="42" fill="var(--rna-bg)" stroke="var(--rna)"/>'+t(70,y+34,"gel bead",'font-size="10.5" text-anchor="middle"');
  h+=t(20,y+100,"one droplet = one cell + one bead",'font-size="10" class="lbl"');
  const seg=[["Read 1 primer",110,"var(--paper-2)"],["Cell barcode 16 nt",150,"var(--prot)"],["UMI 12 nt",110,"var(--met)"],["poly(dT) 30 nt",120,"var(--ink-3)"],["captured mRNA → cDNA (Read 2, ~90 nt)",240,"var(--rna)"]];
  let x=140; seg.forEach(s=>{ h+=r(x,y+16,s[1],30,s[2],'stroke="var(--ink-3)" stroke-width=".5"')+t(x+s[1]/2,y+35,s[0],'font-size="10.5" text-anchor="middle" '+((s[2]==="var(--rna)"||s[2]==="var(--ink-3)")?'fill="var(--paper)"':'')); x+=s[1]; });
  h+=t(290,y-4,"which cell?",'font-size="10.5" font-weight="600"')+t(420,y-4,"which molecule?",'font-size="10.5" font-weight="600"')+t(650,y-4,"which gene?",'font-size="10.5" font-weight="600"');
  h+=t(140,y+80,"Reads with the same barcode come from the same cell; reads with the same barcode + UMI + gene are PCR copies of one molecule and count once.",'font-size="10.5" class="lbl"');
  h+=t(140,y+98,"Result: a cells × genes matrix of UMI counts, typically 1,000–5,000 genes detected per cell and > 90% zeros.",'font-size="10.5" class="lbl"');
  return svg(900,y+115,h);
};

/* ---- UMAP-like embedding ---- */
FIG.umap=()=>{
  const R=rng(13); const cl=[["CD4 T",120,140,"var(--rna)",260],["CD8 T",200,110,"var(--int)",180],["NK",260,70,"var(--epi)",90],["B",420,210,"var(--prot)",150],["Monocytes",560,120,"var(--met)",220],["DC",620,200,"var(--mic)",40],["Platelets",350,40,"var(--ink-2)",25]];
  let h='';
  cl.forEach(c=>{ for(let i=0;i<c[4];i++){ const a=R()*6.283, rr=Math.abs(gauss(R))*(c[0]==="CD4 T"?34:26); h+='<circle cx="'+(c[1]+Math.cos(a)*rr*1.3).toFixed(1)+'" cy="'+(c[2]+Math.sin(a)*rr).toFixed(1)+'" r="2.4" fill="'+c[3]+'" opacity=".7"/>'; } h+=t(c[1],c[2]-(c[0]==="CD4 T"?44:34),c[0],'font-size="11" font-weight="600" text-anchor="middle"'); });
  h+=t(20,282,"UMAP 1 →",'font-size="10" class="lbl"')+t(14,250,"UMAP 2 →",'font-size="10" class="lbl" transform="rotate(-90 14 250)"');
  const lx=700; ["Each dot is one cell, placed so that","cells with similar expression sit close.","Colours: clusters annotated by markers","(CD3E, MS4A1, NKG7, LYZ, PPBP).","","Distances between clusters and","cluster sizes are not meaningful."].forEach((l,i)=>{ h+=t(lx,40+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(940,295,h);
};

/* ---- spatial spots ---- */
FIG.spatial=()=>{
  let h=''; const R=rng(2); const cols=36, rows=20, d=14;
  for(let rr=0;rr<rows;rr++)for(let c=0;c<cols;c++){ const x=40+c*d+(rr%2)*d/2, y=30+rr*d*0.87; const cx=(c-18)/18, cy=(rr-10)/10;
    if(cx*cx/1.0+cy*cy/0.9>1.05) continue;
    const band=cy+0.25*Math.sin(cx*3)+gauss(R)*0.06; const tumour=Math.pow(cx-0.35,2)+Math.pow(cy+0.2,2)<0.12;
    const col=tumour?"var(--met)":band<-0.35?"var(--rna)":band<0.2?"var(--dna)":"var(--prot)";
    h+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="5.6" fill="'+col+'" opacity=".85"/>'; }
  const lx=590; h+=t(lx,40,"Spot-based spatial transcriptomics",'font-size="12" font-weight="600"');
  [["var(--rna)","domain 1 (e.g. epithelium)"],["var(--dna)","domain 2 (stroma)"],["var(--prot)","domain 3 (immune-rich)"],["var(--met)","tumour niche"]].forEach((a,i)=>{ h+='<circle cx="'+(lx+6)+'" cy="'+(64+i*20)+'" r="5.5" fill="'+a[0]+'"/>'+t(lx+18,68+i*20,a[1],'font-size="10.5"'); });
  ["Each spot captures RNA from the tissue","under it (55 µm on Visium: 1–10 cells).","Clustering spots with their neighbours","gives spatial domains; deconvolution","estimates the cell types in each spot."].forEach((l,i)=>{ h+=t(lx,160+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(900,215,h);
};

/* ---- proteomics: digestion + MS/MS ---- */
FIG.msms=()=>{
  const mono={G:57.02146,A:71.03711,S:87.03203,P:97.05276,V:99.06841,T:101.04768,C:103.00919,L:113.08406,I:113.08406,N:114.04293,D:115.02694,Q:128.05858,K:128.09496,E:129.04259,M:131.04049,H:137.05891,F:147.06841,R:156.10111,Y:163.06333,W:186.07931};
  const prot="MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPFEDHVKLVNEVTEFAKTCVADESAENCDK";
  let h=''; const x0=20; h+=t(x0,20,"1 · Trypsin cuts after K or R (not before P): protein → peptides",'font-size="11" font-weight="600"');
  let x=x0, y=44; prot.split("").forEach((a,i)=>{ const cut=(a==="K"||a==="R")&&prot[i+1]!=="P"; const ps=prot.indexOf("LVNEVTEFAK"), inPep=i>=ps&&i<ps+10;
    h+=t(x,y,a,'font-size="12" '+(inPep?'font-weight="700" fill="var(--prot)"':'class="lbl"')); x+=9.4; if(cut){ h+=ln(x+1,y-12,x+1,y+4,'stroke="var(--met)" stroke-width="1.5"'); x+=5; } });
  h+=t(x0,y+22,"(serum albumin N-terminus; highlighted peptide LVNEVTEFAK is selected and fragmented)",'font-size="10" class="lbl"');
  const pep="LVNEVTEFAK", n=pep.length, P=1.00728, H2O=18.01056; const b=[],yi=[]; let s=0; for(let i=0;i<n-1;i++){ s+=mono[pep[i]]; b.push(s+P); }
  s=0; for(let i=n-1;i>0;i--){ s+=mono[pep[i]]; yi.push(s+H2O+P); }
  const prec=(pep.split("").reduce((a,c)=>a+mono[c],0)+H2O+2*P)/2;
  const L=60,T=120,W=780,H=160, mz=v=>L+(v-100)/(1100-100)*W; const R=rng(8);
  h+=t(x0,T-14,"2 · MS/MS spectrum of the peptide (precursor m/z "+prec.toFixed(2)+", 2+): fragments break along the backbone",'font-size="11" font-weight="600"');
  h+=axis(L,T,L+W,T+H);
  for(let i=0;i<40;i++){ const v=110+R()*980; h+=ln(mz(v),T+H,mz(v),T+H-R()*H*0.12,'stroke="var(--ink-3)"'); }
  b.forEach((m,i)=>{ if(m<100||m>1100) return; const it=(0.25+0.35*R())*H; h+=ln(mz(m),T+H,mz(m),T+H-it,'stroke="var(--rna)" stroke-width="2.4"')+t(mz(m),T+H-it-4,"b"+(i+1),'font-size="9.5" text-anchor="middle" fill="var(--rna)"'); });
  yi.forEach((m,i)=>{ if(m<100||m>1100) return; const it=(0.35+0.6*R())*H*(i>2&&i<8?1:0.7); h+=ln(mz(m),T+H,mz(m),T+H-it,'stroke="var(--met)" stroke-width="2.4"')+t(mz(m),T+H-it-4,"y"+(i+1),'font-size="9.5" text-anchor="middle" fill="var(--met)"'); });
  [200,400,600,800,1000].forEach(v=>{ h+=t(mz(v),T+H+14,v,'font-size="10" text-anchor="middle" class="lbl"'); }); h+=t(L+W/2,T+H+28,"m/z",'font-size="10" text-anchor="middle" class="lbl"');
  // ladder
  const ly=T+H+56; pep.split("").forEach((a,i)=>{ h+=t(L+60+i*48,ly,a,'font-size="15" font-weight="700" text-anchor="middle"'); if(i<n-1){ h+=t(L+84+i*48,ly-16,"b"+(i+1),'font-size="9" text-anchor="middle" fill="var(--rna)"')+t(L+84+i*48,ly+18,"y"+(n-1-i),'font-size="9" text-anchor="middle" fill="var(--met)"')+ln(L+84+i*48,ly-10,L+84+i*48,ly+6,'stroke="var(--ink-3)"'); } });
  h+=t(L+560,ly-4,"Mass differences between consecutive",'font-size="10" class="lbl"')+t(L+560,ly+10,"b (or y) ions spell out the sequence.",'font-size="10" class="lbl"');
  return svg(900,ly+30,h);
};

/* ---- metabolomics feature map ---- */
FIG.mzrt=()=>{
  const R=rng(17); let h=''; const L=60,T=20,W=560,H=240; h+=axis(L,T,L+W,T+H);
  const X=v=>L+v/20*W, Y=v=>T+H-(v-80)/(1000-80)*H;
  for(let i=0;i<900;i++){ let rt,mz,c="var(--met)";
    const k=R(); if(k<.45){ rt=0.6+R()*7; mz=90+R()*350; } else if(k<.75){ rt=8+R()*7; mz=250+R()*350; c="var(--prot)"; } else { rt=14+R()*5.5; mz=650+R()*300; c="var(--rna)"; }
    const sz=1+Math.pow(R(),4)*5; h+='<circle cx="'+X(rt).toFixed(1)+'" cy="'+Y(mz).toFixed(1)+'" r="'+sz.toFixed(1)+'" fill="'+c+'" opacity=".55"/>'; }
  [0,5,10,15,20].forEach(v=>{ h+=t(X(v),T+H+15,v,'font-size="10" text-anchor="middle" class="lbl"'); }); [200,400,600,800,1000].forEach(v=>{ h+=t(L-8,Y(v)+4,v,'font-size="10" text-anchor="end" class="lbl"'); });
  h+=t(L+W/2,T+H+32,"retention time (min, reversed-phase gradient)",'font-size="10.5" text-anchor="middle" class="lbl"')+t(16,T+H/2,"m/z",'font-size="10.5" class="lbl"');
  const lx=L+W+30; h+=t(lx,T+18,"An untargeted feature map",'font-size="12" font-weight="600"');
  [["var(--met)","polar metabolites (amino acids, sugars)"],["var(--prot)","mid-polarity (bile acids, drugs)"],["var(--rna)","lipids (elute late, higher m/z)"]].forEach((a,i)=>{ h+='<circle cx="'+(lx+6)+'" cy="'+(T+42+i*20)+'" r="5" fill="'+a[0]+'"/>'+t(lx+18,T+46+i*20,a[1],'font-size="10"'); });
  ["Each dot is a feature (m/z, RT, intensity).","One metabolite usually produces several","features: adducts, isotopes, fragments.","Thousands of features → hundreds of","annotated metabolites."].forEach((l,i)=>{ h+=t(lx,T+120+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(940,T+H+45,h);
};

/* ---- 16S rRNA gene ---- */
FIG.s16=()=>{
  const V=[[69,99],[137,242],[433,497],[576,682],[822,879],[986,1043],[1117,1173],[1243,1294],[1435,1465]];
  const L=40,W=820,len=1542,X=v=>L+v/len*W; let h='';
  h+=r(L,60,W,30,"var(--paper-2)",'stroke="var(--ink-3)" stroke-width=".6"');
  V.forEach((v,i)=>{ h+=r(X(v[0]),60,X(v[1])-X(v[0]),30,i===3?"var(--mic)":"var(--rna)",'opacity="'+(i===3?1:.75)+'"')+t((X(v[0])+X(v[1]))/2,108,"V"+(i+1),'font-size="11" text-anchor="middle" font-weight="600"'); });
  h+='<path d="M'+X(515)+' 52 l0 -14 l14 0" fill="none" stroke="var(--ink)" stroke-width="1.6"/>'+t(X(515)-6,30,"515F",'font-size="10.5"');
  h+='<path d="M'+X(806)+' 52 l0 -14 l-14 0" fill="none" stroke="var(--ink)" stroke-width="1.6"/>'+t(X(806)-24,30,"806R",'font-size="10.5"');
  [0,500,1000,1500].forEach(v=>{ h+=t(X(v),128,v+" bp",'font-size="9.5" text-anchor="middle" class="lbl"'); });
  h+=t(L,155,"Grey = conserved regions (primer sites, same in nearly all bacteria). Coloured = variable regions V1–V9 that differ between taxa.",'font-size="10.5" class="lbl"');
  h+=t(L,172,"The common 515F/806R primers amplify V4 (~250 bp), short enough for 2 × 250 bp reads; positions follow E. coli numbering.",'font-size="10.5" class="lbl"');
  return svg(900,185,h);
};

/* ---- microbiome stacked bars ---- */
FIG.stackbar=()=>{
  const tax=[["Bacteroides","var(--rna)"],["Prevotella","var(--epi)"],["Faecalibacterium","var(--dna)"],["Bifidobacterium","var(--prot)"],["Akkermansia","var(--mic)"],["Escherichia","var(--met)"],["Other","var(--ink-3)"]];
  const S=[[.34,.05,.14,.08,.03,.01],[.28,.12,.16,.05,.04,.01],[.40,.02,.12,.10,.02,.02],[.22,.20,.15,.06,.05,.01],[.30,.03,.06,.03,.01,.12],[.36,.02,.05,.02,.01,.18],[.25,.10,.04,.02,.00,.09],[.33,.04,.07,.01,.01,.15]];
  let h=''; const L=60,T=20,H=220,bw=46,gap=18;
  S.forEach((s,i)=>{ const x=L+i*(bw+gap)+(i>=4?24:0); let y=T+H; const all=s.concat([1-s.reduce((a,b)=>a+b,0)]);
    all.forEach((v,k)=>{ const hh=v*H; y-=hh; h+=r(x,y.toFixed(1),bw,hh.toFixed(1),tax[k][1],'stroke="var(--card)" stroke-width=".8"'); });
    h+=t(x+bw/2,T+H+15,(i<4?"C":"P")+(i%4+1),'font-size="10" text-anchor="middle" class="lbl"'); });
  h+=t(L+2*(bw+gap)-gap/2,T+H+32,"controls",'font-size="10.5" text-anchor="middle"')+t(L+6*(bw+gap)+24-gap/2,T+H+32,"patients",'font-size="10.5" text-anchor="middle"');
  [0,.25,.5,.75,1].forEach(v=>{ h+=t(L-8,T+H-v*H+4,Math.round(v*100)+"%",'font-size="10" text-anchor="end" class="lbl"'); });
  const lx=L+8*(bw+gap)+50; tax.forEach((a,i)=>{ h+=r(lx,T+10+i*20,12,12,a[1])+t(lx+18,T+20+i*20,a[0],'font-size="10.5" font-style="'+(a[0]==="Other"?"normal":"italic")+'"'); });
  h+=t(lx,T+170,"Relative abundances sum to 100%,",'font-size="10.5" class="lbl"')+t(lx,T+186,"so a rise in one taxon forces",'font-size="10.5" class="lbl"')+t(lx,T+202,"others down (compositionality).",'font-size="10.5" class="lbl"');
  return svg(900,T+H+42,h);
};

/* ---- eQTL boxplot ---- */
FIG.qtl=()=>{
  const R=rng(31); const g=[["AA",0,120],["AG",0.55,150],["GG",1.1,60]]; let h=''; const L=70,T=20,W=420,H=220, Y=v=>T+H-(v+2)/5*H;
  h+=axis(L,T,L+W,T+H);
  g.forEach((gg,i)=>{ const cx=L+70+i*140; const vals=[]; for(let k=0;k<gg[2];k++) vals.push(gg[1]+gauss(R)*0.55);
    vals.sort((a,b)=>a-b); const q=p=>vals[Math.floor(p*(vals.length-1))];
    vals.forEach(v=>{ h+='<circle cx="'+(cx-30+R()*60).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="2" fill="var(--rna)" opacity=".35"/>'; });
    h+=r(cx-26,Y(q(.75)),52,Y(q(.25))-Y(q(.75)),"none",'stroke="var(--ink)" stroke-width="1.4"')+ln(cx-26,Y(q(.5)),cx+26,Y(q(.5)),'stroke="var(--ink)" stroke-width="2.4"')+ln(cx,Y(q(.75)),cx,Y(q(.95)),'stroke="var(--ink)"')+ln(cx,Y(q(.25)),cx,Y(q(.05)),'stroke="var(--ink)"');
    h+=t(cx,T+H+16,gg[0]+"  (n="+gg[2]+")",'font-size="10.5" text-anchor="middle"'); });
  [-2,-1,0,1,2,3].forEach(v=>{ h+=t(L-8,Y(v)+4,v,'font-size="10" text-anchor="end" class="lbl"'); });
  h+=t(L+W/2,T+H+34,"genotype at the variant",'font-size="10.5" text-anchor="middle" class="lbl"')+t(18,T+H/2,"normalised expression",'font-size="10.5" class="lbl" transform="rotate(-90 18 '+(T+H/2)+')" text-anchor="middle"');
  const lx=L+W+40; h+=t(lx,T+20,"An eQTL",'font-size="12" font-weight="600"');
  ["Expression of the gene rises with each","copy of the G allele: an additive cis-eQTL.","Effect size β = slope of expression on","allele dosage (0, 1, 2); significance","from linear regression with covariates.","If the same variant also drives a GWAS","signal (colocalisation), the gene is a","candidate mediator of the trait."].forEach((l,i)=>{ h+=t(lx,T+44+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(900,T+H+45,h);
};

/* ---- MOFA variance explained ---- */
FIG.mofa=()=>{
  const views=["mRNA","Methylation","Proteins","Metabolites"]; const V=[[18,12,9,2],[0.5,14,0.4,0.2],[6,0.6,11,0.8],[1,0.3,0.9,9],[4,3,3.5,3],[2.5,0.2,0.4,0.1],[0.3,0.2,5,0.4],[1.2,1,0.6,0.5]];
  let h=''; const L=120,T=40,cw=90,ch=26;
  views.forEach((v,j)=>{ h+=t(L+j*cw+cw/2,T-10,v,'font-size="10.5" text-anchor="middle" font-weight="600"'); });
  V.forEach((row,i)=>{ h+=t(L-12,T+i*ch+ch/2+4,"Factor "+(i+1),'font-size="10.5" text-anchor="end"');
    row.forEach((v,j)=>{ h+=r(L+j*cw,T+i*ch,cw-2,ch-2,"var(--int)",'opacity="'+Math.min(1,0.06+v/18).toFixed(2)+'"')+t(L+j*cw+cw/2,T+i*ch+ch/2+4,v.toFixed(1)+"%",'font-size="10" text-anchor="middle" '+(v>9?'fill="var(--paper)"':'')); }); });
  const lx=L+4*cw+30; h+=t(lx,T+6,"Variance explained per factor and layer",'font-size="12" font-weight="600"');
  ["Factor 1: shared across all layers (e.g. a","disease axis or tumour purity).","Factor 2: methylation only (e.g. an","epigenetic subtype or batch).","Factors 3–4: shared by two layers.","","Check every factor against batch and","technical covariates before interpreting."].forEach((l,i)=>{ h+=t(lx,T+30+i*16,l,'font-size="10.5" class="lbl"'); });
  return svg(900,T+V.length*ch+20,h);
};

document.querySelectorAll(".figx[data-fig]").forEach(el=>{
  const f=FIG[el.dataset.fig]; if(!f) return; let out=""; try{ out=f(); }catch(e){ return; }
  const cap=el.dataset.cap||""; const isSvg=out.indexOf("<svg")===0;
  el.innerHTML='<figure style="margin:0"><div class="'+(isSvg?"fig":"tbl")+'">'+out+'</div>'+(cap?'<figcaption>'+cap+'</figcaption>':'')+'</figure>';
});

/* chapter numbers + copy buttons */
let n=0; document.querySelectorAll("section.chapter").forEach(s=>{ const c=s.querySelector(".chnum"); if(c){ n++; } });
const order=(typeof PAGES!=="undefined")?PAGES.map(p=>p.id):[...document.querySelectorAll("section.chapter")].map(s=>s.id);
const numbered=order.filter(id=>id!=="home"&&id!=="contact");
document.querySelectorAll("section.chapter").forEach(s=>{ const c=s.querySelector(".chnum"); const k=numbered.indexOf(s.id); if(c&&k>=0) c.textContent="Chapter "+(k+1); });
document.querySelectorAll(".copy[data-copy]").forEach(b=>b.addEventListener("click",()=>{ const v=b.dataset.copy; const done=()=>{ b.textContent="Copied"; setTimeout(()=>b.textContent="Copy",1500); };
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done,()=>{ const s=window.getSelection(), rg=document.createRange(); rg.selectNodeContents(b.previousElementSibling); s.removeAllRanges(); s.addRange(rg); }); }));
})();
