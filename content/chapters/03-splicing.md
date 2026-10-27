---
title: Splicing & isoforms
heading: 'Splicing: one gene, many messages'
part: I · Foundations
order: 30
color: rna
label: Foundations
slug: splicing
id: splicing
description: Splicing removes introns from pre-mRNA and joins exons. Alternative splicing lets roughly 20,000 genes produce well over 100,000 transcript isoforms. It is also one of the most underestimated routes by which mutations cause disease.
---
<h2>The splicing code in the sequence</h2>
<p>The spliceosome recognises four short sequence elements in each intron:</p>
<p>[figure: splicing-diagram-1 | Fig. 3.1 · Consensus elements of a U2-type intron. The invariant GU and AG dinucleotides are the "canonical" splice site positions (±1, ±2) that every variant annotation tool flags.]</p>
<p>The core motifs are short and degenerate, so they carry too little information on their own to define exons. Additional signals help: <strong>exonic and intronic splicing enhancers and silencers</strong> (ESE, ESS, ISE, ISS) recruit activating <strong>SR proteins</strong> (SRSF1–12) or repressing <strong>hnRNPs</strong>. Tissue-specific regulators (RBFOX, NOVA, PTBP1/2, MBNL, CELF, ESRP) create neural, muscle or epithelial splicing programmes. Chromatin and Pol II elongation speed matter too: slow elongation gives weak exons more time to be recognised.</p>
<h2>The spliceosome's two chemical steps</h2>
<ol>
<li><strong>Branching</strong>: the 2′-OH of the branch point adenosine attacks the 5′ splice site, freeing exon 1 and forming a lariat intron.</li>
<li><strong>Exon ligation</strong>: the free 3′-OH of exon 1 attacks the 3′ splice site, joining the exons and releasing the lariat, which is debranched and degraded.</li>
</ol>
<p>The spliceosome assembles stepwise from five small nuclear ribonucleoproteins (U1, U2, U4, U5, U6) and more than 150 proteins. Exon junction complexes (EJCs) are deposited ~20–24 nt upstream of each junction, which links splicing to mRNA export, translation and nonsense-mediated decay.</p>
<h2>Types of alternative splicing</h2>
<p>[figure: alternative-splicing-types | Fig. 3.2 · Event types. Arcs above the line show one outcome, arcs below show the alternative. Event-based tools (rMATS, SUPPA2, MAJIQ, Whippet) report these as "percent spliced in" (PSI, Ψ): the fraction of transcripts that include the variable segment.]</p>
<table>
<tr><th>Event</th><th>What happens</th><th>Share in human tissues</th><th>Example</th></tr>
<tr><td>Cassette exon (skipping)</td><td>A whole exon is included or skipped</td><td>Most common class in mammals</td><td><i>SMN2</i> exon 7 skipping in spinal muscular atrophy</td></tr>
<tr><td>Alternative 5′ splice site</td><td>Donor moves, changing the end of an exon</td><td>Common</td><td><i>BCL2L1</i>: Bcl-xL (anti-apoptotic) vs Bcl-xS (pro-apoptotic)</td></tr>
<tr><td>Alternative 3′ splice site</td><td>Acceptor moves, changing the start of an exon</td><td>Common; cryptic 3′ss usage is the hallmark of <i>SF3B1</i>-mutant cancers</td><td>SF3B1 hotspot mutations in MDS, CLL, uveal melanoma</td></tr>
<tr><td>Intron retention</td><td>An intron stays in the mature RNA</td><td>Frequent in plants; regulated in mammalian neurons and granulocytes</td><td>Detained introns that regulate gene output during differentiation</td></tr>
<tr><td>Mutually exclusive exons</td><td>Exactly one of two exons is included</td><td>Less common</td><td><i>PKM</i>: PKM1 vs PKM2 (Warburg metabolism)</td></tr>
<tr><td>Alternative first exon</td><td>Different promoters, different first exons</td><td>Very common; driven by transcription, not the spliceosome</td><td>Tissue-specific promoters of many genes</td></tr>
<tr><td>Alternative last exon / APA</td><td>Different terminal exons or poly(A) sites</td><td>~70% of genes use more than one poly(A) site</td><td>Short 3′UTRs escape microRNA repression in proliferating cells</td></tr>
<tr><td>Back-splicing</td><td>A downstream donor joins an upstream acceptor, making a circular RNA</td><td>Thousands of circRNAs, mostly low abundance</td><td><i>CDR1as</i>, a microRNA sponge</td></tr>
</table>
<h2>Consequences: nonsense-mediated decay and protein diversity</h2>
<p>When an isoform contains a premature termination codon (PTC) more than ~50–55 nt upstream of the last exon–exon junction, a downstream EJC remains on the mRNA after the first round of translation and triggers <strong>nonsense-mediated decay (NMD)</strong>. Cells use this deliberately: "poison exons" containing PTCs are included to downregulate genes such as splicing factors themselves (alternative splicing coupled to NMD, AS-NMD). In analysis, NMD means a frameshifting or exon-skipping variant often reduces RNA abundance rather than producing a truncated protein. This is why allele-specific expression in RNA-seq is used to confirm loss-of-function variants.</p>
<p>Isoforms that do get translated can differ in domains, localisation signals or interaction surfaces, sometimes with opposite functions (Bcl-xL vs Bcl-xS). How many alternative isoforms produce stable, functional proteins remains an open question; mass spectrometry detects far fewer protein isoforms than RNA-seq predicts, partly because of sensitivity and partly because many isoforms may be noise.</p>
<h2>Why splicing mutations matter</h2>
<p>Estimates vary by method, but a substantial fraction of disease-causing variants act through splicing, from roughly 10% when only canonical ±1/±2 sites are counted to well over 20% when deep intronic and exonic splicing variants are included. Mechanisms:</p>
<ul>
<li><strong>Canonical site loss</strong> (GT→AT at +1): usually exon skipping or intron retention, often leading to NMD.</li>
<li><strong>Cryptic site activation</strong>: a variant creates a new donor or acceptor deep in an intron, adding a pseudo-exon (common in <i>CFTR</i>, <i>DMD</i>, <i>ATM</i>).</li>
<li><strong>Exonic variants that disrupt ESEs/ESSs</strong>: a "synonymous" change can alter splicing. Synonymous does not mean silent.</li>
<li><strong>Branch point and polypyrimidine tract variants</strong>, which are often missed by tools that only examine ±8 nt from exon boundaries.</li>
<li><strong>Trans-acting mutations</strong> in spliceosome genes (<i>SF3B1</i>, <i>SRSF2</i>, <i>U2AF1</i>, <i>ZRSR2</i>) in myelodysplastic syndromes and other cancers alter thousands of events at once.</li>
<li><strong>Repeat expansions</strong> that sequester splicing regulators, as CUG repeats in <i>DMPK</i> trap MBNL in myotonic dystrophy type 1.</li>
</ul>
<blockquote><p><strong>Example: splicing as a drug target:</strong> In spinal muscular atrophy, <i>SMN1</i> is lost and the near-identical <i>SMN2</i> mostly skips exon 7 because of a single C→T change that weakens an enhancer. The antisense oligonucleotide <strong>nusinersen</strong> blocks an intronic silencer (ISS-N1) and the small molecule <strong>risdiplam</strong> stabilises U1 binding at the exon 7 donor. Both restore exon 7 inclusion. These are among the clearest demonstrations that understanding a splicing mechanism at nucleotide resolution can lead to a therapy.</p></blockquote>
<h2>Computational analysis of splicing</h2>
<h3>From RNA-seq</h3>
<ul>
<li><strong>Splice-aware alignment</strong> (STAR, HISAT2) finds reads that span junctions. Use two-pass mode for novel junctions. Long reads (minimap2 <code>-ax splice</code>) capture whole isoforms.</li>
<li><strong>Event-level quantification</strong>: rMATS, SUPPA2, MAJIQ, Whippet and VAST-TOOLS compute PSI and test for differential splicing.</li>
<li><strong>Annotation-free intron clustering</strong>: LeafCutter groups introns that share splice sites and tests intron-usage ratios; widely used for sQTL mapping in GTEx.</li>
<li><strong>Exon-bin or isoform-level</strong>: DEXSeq (differential exon usage), DRIMSeq, satuRn and IsoformSwitchAnalyzeR (functional consequences of isoform switches).</li>
<li><strong>Single-cell splicing</strong>: full-length protocols (Smart-seq2/3) or long-read single cell; 3′-tag 10x data are largely blind to internal splicing.</li>
</ul>
<h3>From DNA sequence (variant effect prediction)</h3>
<ul>
<li><strong>SpliceAI</strong> (deep residual CNN over 10 kb context) predicts donor/acceptor gain and loss. Delta score ≥ 0.2 is a common screening threshold and ≥ 0.5 is high-confidence.</li>
<li><strong>Pangolin</strong> (tissue-aware), <strong>MMSplice</strong> (modular), <strong>SQUIRLS</strong>, <strong>SPiP</strong>, <strong>MaxEntScan</strong> (classic position-weight/maximum-entropy scorer).</li>
<li>Clinical laboratories increasingly validate predicted splice variants with RNA-seq from blood or fibroblasts, or with minigene assays, before classification.</li>
</ul>
<blockquote><p><strong>Benchmark:</strong> Systematic comparisons of differential splicing tools report low overlap between tools and strong dependence on read depth, replicate number and event type (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=Systematic+evaluation+of+differential+splicing+tools+for+RNA-seq+studies">Mehmood et al. 2020, Briefings in Bioinformatics</a>). For splice-variant prediction, SpliceAI and related deep models are consistently among the top performers on clinical and MPRA-based sets, while older motif scorers lose accuracy outside canonical positions. Results depend on how far into the intron variants lie.</p></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Linking isoforms to function: which of the thousands of detected isoforms are translated and matter?</li><li>Cell-type-resolved splicing from droplet single-cell data, where coverage of internal exons is poor.</li><li>Predicting the quantitative effect of a variant (ΔPSI) in a specific tissue, not just whether a site is lost or gained.</li><li>Calibrated splice predictions for clinical use, especially deep intronic and branch-point variants.</li></ul></blockquote>
