---
title: Epigenomics
heading: Epigenomics
part: II · The omics layers
order: 80
color: epi
label: DNA layer · regulation
slug: epigenomics
id: epigenomics
description: 'Heritable or stable changes in gene activity that do not change DNA sequence: methylation of DNA, chemical marks on histones, which DNA is accessible, where transcription factors sit, and how chromosomes fold in 3D. Epigenomics explains how one genome makes hundreds of cell types.'
---
<h2>Research questions</h2>
<ul>
<li>Which regulatory elements are active in this cell type, and which genes do they control?</li>
<li>How do disease-associated variants change TF binding, accessibility or methylation?</li>
<li>Does methylation mark disease state, ageing (epigenetic clocks), exposure (smoking) or cell composition?</li>
<li>Can methylation patterns in cell-free DNA detect cancer and identify its tissue of origin?</li>
<li>How does 3D genome folding (loops, TADs) control enhancer–promoter communication?</li>
</ul>
<h2>How epigenomic data are generated</h2>
<table>
<tr><th>Assay</th><th>Wet-lab steps</th><th>Input</th><th>Readout</th></tr>
<tr><td>WGBS / EM-seq</td><td>Extract DNA → bisulfite or enzymatic conversion of unmethylated C → library → sequence 2 × 150 bp to ~30×</td><td>10 ng–1 µg DNA</td><td>C vs T at every CpG</td></tr>
<tr><td>Methylation array</td><td>Bisulfite-convert DNA → amplify → hybridise to EPIC BeadChip → scan</td><td>~250–500 ng</td><td>Methylated / unmethylated intensities (IDAT)</td></tr>
<tr><td>ATAC-seq</td><td>Isolate nuclei → Tn5 tagmentation (cuts open DNA and inserts adapters) → PCR → sequence paired-end</td><td>500–50,000 cells</td><td>Fragments from accessible DNA</td></tr>
<tr><td>ChIP-seq</td><td>Crosslink with formaldehyde → shear chromatin → immunoprecipitate with an antibody → reverse crosslinks → library</td><td>10<sup>5</sup>–10<sup>7</sup> cells + input control</td><td>Fragments bound by the target protein or mark</td></tr>
<tr><td>CUT&amp;Tag</td><td>Permeabilised cells + antibody → protein A–Tn5 binds antibody and tagments in place → PCR</td><td>10<sup>3</sup>–10<sup>5</sup> cells</td><td>Low-background target fragments</td></tr>
<tr><td>Hi-C / Micro-C</td><td>Crosslink → digest (restriction enzyme or MNase) → fill ends with biotin → proximity ligation → shear → pull down junctions → paired-end sequencing</td><td>10<sup>5</sup>–10<sup>6</sup> cells</td><td>Read pairs joining DNA that touched in 3D</td></tr>
</table>
<h2>DNA methylation</h2>
<p>In mammals methylation is mostly 5-methylcytosine (5mC) at CpG dinucleotides. About 70–80% of CpGs are methylated, except in CpG islands at active promoters. DNMT3A/B establish new methylation, DNMT1 maintains it through replication, and TET enzymes oxidise 5mC to 5hmC, 5fC and 5caC on the way to demethylation. Promoter methylation is associated with silencing; gene-body methylation correlates with active transcription.</p>
<table>
<tr><th>Assay</th><th>Principle</th><th>Coverage</th><th>Notes</th></tr>
<tr><td>WGBS</td><td>Bisulfite converts unmethylated C→U (read as T); methylated C stays C</td><td>~28M CpGs, genome-wide</td><td>Gold standard; DNA damage; cannot separate 5mC from 5hmC</td></tr>
<tr><td>EM-seq</td><td>Enzymatic conversion (TET2 + APOBEC3A)</td><td>Genome-wide</td><td>Less DNA damage, more even coverage than bisulfite</td></tr>
<tr><td>RRBS</td><td>MspI digestion enriches CpG-rich regions, then bisulfite</td><td>~2–4M CpGs</td><td>Cheap; biased to CpG islands</td></tr>
<tr><td>Illumina EPIC v2 array</td><td>Probe hybridisation after bisulfite</td><td>~935k CpGs</td><td>Dominant in epidemiology (EWAS) and clocks; probe cross-reactivity and SNP-in-probe issues</td></tr>
<tr><td>Nanopore / PacBio native</td><td>Detects modified bases from raw signal or polymerase kinetics</td><td>Genome-wide, long-range, phased</td><td>Haplotype-resolved methylation; 5hmC on nanopore</td></tr>
<tr><td>TAPS, 5-letter/6-base sequencing</td><td>Chemistries that separate 5mC and 5hmC</td><td>Genome-wide</td><td>Newer, growing adoption</td></tr>
</table>
<p>[figure: bisulfite | Fig. · How bisulfite sequencing reads methylation. Unmethylated cytosines become uracil and are sequenced as T; methylated cytosines stay C. Comparing reads to the reference (highlighted C→T positions) gives, at each CpG, the fraction of molecules that were methylated. Simulated reads.]</p>
<p><strong>Analysis</strong>: bisulfite-aware alignment (Bismark, bwa-meth, BSBolt) uses three-letter alignment (C/T and G/A converted genomes). Methylation is then extracted per CpG (MethylDackel, Bismark extractor). Arrays are processed with minfi, SeSAMe or ChAMP (normalisation: Noob, BMIQ, functional normalisation). Differential methylation is tested per CpG (methylKit, DSS, limma on M-values) or per region (DMRcate, bsseq/BSmooth, dmrseq, metilene). Because blood and tissue methylation is dominated by cell composition, estimate proportions (Houseman method, EpiDISH, MethylCIBERSORT) and adjust.</p>
<blockquote><p><strong>Epigenetic clocks:</strong> Penalised regression on methylation predicts age with striking accuracy: Horvath's multi-tissue clock (353 CpGs, 2013) and Hannum's blood clock. Later clocks predict health outcomes rather than chronological age: PhenoAge, GrimAge and the pace-of-ageing measure DunedinPACE. Their biological meaning, and whether interventions that change them change health, are open questions.</p></blockquote>
<h2>Chromatin accessibility</h2>
<p><strong>ATAC-seq</strong> uses hyperactive Tn5 transposase to insert sequencing adapters into open chromatin. It needs ~50,000 cells (or single nuclei in scATAC). Fragment lengths show nucleosome-free (&lt;100 bp), mono-nucleosome (~200 bp) and di-nucleosome peaks; the TSS enrichment score and fragment-size periodicity are the main QC metrics. DNase-seq and MNase-seq are older alternatives.</p>
<p><strong>Pipeline</strong>: trim (Nextera adapters), align (Bowtie2 or BWA), remove mitochondrial reads and duplicates, shift reads +4/−5 bp for Tn5 offset, call peaks (MACS2/3, Genrich, HMMRATAC), build a consensus peak set, count (featureCounts), test differential accessibility (DESeq2/edgeR, DiffBind, csaw). Downstream: motif enrichment (HOMER, MEME-ChIP), TF footprinting (TOBIAS, HINT-ATAC), and per-sample TF activity (chromVAR).</p>
<p>[figure: atac | Fig. · ATAC-seq. Tn5 inserts mostly into nucleosome-free DNA around bound transcription factors, so reads pile up into a peak there; the dip right at the TF is its footprint. Right: fragment lengths show a nucleosome ladder (nucleosome-free &lt;100 bp, mono- ~200 bp, di- ~400 bp), a key QC signal. Simulated data.]</p>
<h2>Histone marks and transcription factor binding</h2>
<table>
<tr><th>Mark</th><th>Location</th><th>Meaning</th><th>Peak shape</th></tr>
<tr><td>H3K4me3</td><td>Promoters</td><td>Active or poised promoter</td><td>Sharp</td></tr>
<tr><td>H3K4me1</td><td>Enhancers</td><td>Enhancer (primed or active)</td><td>Broad-ish</td></tr>
<tr><td>H3K27ac</td><td>Enhancers, promoters</td><td>Active element; super-enhancers (ROSE)</td><td>Sharp to medium</td></tr>
<tr><td>H3K36me3</td><td>Gene bodies</td><td>Transcriptional elongation</td><td>Broad</td></tr>
<tr><td>H3K27me3</td><td>Developmental genes</td><td>Polycomb repression; bivalent with H3K4me3 in stem cells</td><td>Very broad domains</td></tr>
<tr><td>H3K9me3</td><td>Repeats, heterochromatin</td><td>Constitutive repression</td><td>Very broad</td></tr>
</table>
<p>Assays: <strong>ChIP-seq</strong> (antibody pulldown of crosslinked chromatin; needs input control), <strong>CUT&amp;RUN</strong> and <strong>CUT&amp;Tag</strong> (antibody-tethered nuclease or Tn5 cutting in situ; low background, low cell input, single-cell versions). Peak calling: MACS2/3 for sharp marks and TFs; broad mode, SICER2 or epic2 for broad marks; SEACR for CUT&amp;RUN. Reproducibility between replicates is assessed with IDR (irreproducible discovery rate), as in ENCODE pipelines. <strong>ChromHMM</strong> and <strong>Segway</strong> combine many marks into chromatin states (active promoter, strong enhancer, Polycomb-repressed, heterochromatin), as in the Roadmap Epigenomics reference maps.</p>
<h2>3D genome</h2>
<p><strong>Hi-C</strong> crosslinks chromatin, digests it, ligates nearby fragments and sequences the junctions, giving a genome-wide contact matrix. <strong>Micro-C</strong> uses MNase for nucleosome resolution; capture Hi-C, HiChIP and PLAC-seq focus on promoters or protein-anchored contacts. Processing (Juicer, HiC-Pro, distiller, HiCExplorer) produces <code>.hic</code> or <code>.cool/.mcool</code> files, normalised by iterative correction (ICE) or Knight–Ruiz balancing. Features are then called: A/B compartments (eigenvector of the correlation matrix), TADs (insulation score, Arrowhead, TopDom), loops (HiCCUPS, Mustache, chromosight), and differential contacts (diffHic, multiHiCcompare, CHESS). Contact frequency drops with genomic distance, so all comparisons must account for that distance decay.</p>
<p>[figure: hic | Fig. · A Hi-C contact map of a 1.2 Mb region. Simulated data with four TADs and one loop.]</p>
<h2>Linking regulatory elements to genes</h2>
<p>The nearest-gene assumption is wrong for a large share of enhancers. Better approaches use activity and contact together: the <strong>Activity-by-Contact (ABC) model</strong> (enhancer activity × Hi-C contact), correlations between accessibility and expression across samples or single cells (peak-to-gene links in ArchR, Signac), and CRISPRi screens as ground truth (e.g. ENCODE-rE2G models trained on CRISPR perturbation data).</p>
<h2>Tools</h2>
<p>[tools: epigenomics]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: epigenomics]</p>
<blockquote><p><strong>Pitfall:</strong> In EWAS, smoking, age, sex, genotype (meQTLs) and cell composition can all produce differential methylation. A "disease signature" may be a composition signature. Adjust for estimated cell proportions and check whether hits are known meQTLs. Also check causality direction: disease, medication and lifestyle can change methylation rather than the reverse.</p></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Causal link from a specific mark to a specific expression change (most epigenomic data are correlational; epigenome editing with dCas9 fusions is starting to test this).</li><li>Single-cell multi-modal epigenomics (methylation + accessibility + RNA in the same cell) at scale.</li><li>Haplotype-resolved methylation from long reads and its role in imprinting and allele-specific expression.</li><li>Enhancer–gene linking in rare cell types and disease states without CRISPR ground truth.</li><li>Biological interpretation of epigenetic clocks and their response to interventions.</li></ul></blockquote>
