---
title: Transcriptomics (bulk)
heading: Transcriptomics
part: II · The omics layers
order: 90
color: rna
label: RNA layer
slug: transcriptomics
id: transcriptomics
description: Measuring which genes are expressed, how much, and in which isoform. Bulk RNA-seq is the most widely used omics assay in biology, and its statistical tooling is the most mature, so it is the best place to learn the logic that every other layer reuses.
---
<h2>Research questions</h2>
<ul>
<li>Which genes change between conditions (disease vs control, treated vs untreated, time points)?</li>
<li>Which pathways and programmes are active, and which upstream regulators explain them?</li>
<li>Which isoforms, fusions, editing sites or allele-specific expression patterns are present?</li>
<li>Can expression classify patients (subtypes, prognosis, treatment response)?</li>
<li>How do genetic variants affect expression (eQTLs) and splicing (sQTLs)?</li>
</ul>
<h2>Experimental choices that decide what you can analyse</h2>
<p>[cards]</p><ul><li><p><strong>RNA selection</strong></p><p>Poly(A)+ captures mature mRNA; rRNA depletion keeps non-polyadenylated and pre-mRNA (intronic reads). Small-RNA libraries for miRNA. Degraded samples (FFPE) need depletion or capture.</p></li><li><p><strong>Strandedness and length</strong></p><p>Stranded libraries (dUTP) resolve antisense transcription. Paired-end 2×100–150 bp helps isoforms and fusions. 3′-tag methods (QuantSeq, BRB-seq) are cheap for gene counts but blind to isoforms.</p></li><li><p><strong>Depth and replicates</strong></p><p>~20–30M reads per sample is typical for gene-level DE; isoform work needs more. Biological replicates matter more than depth: aim for six or more per group when you can.</p></li></ul>
<h2>How transcriptomic data are generated</h2>
<p>[steps]</p><ol><li><strong>Sample &amp; stabilise</strong> Snap-freeze, RNAlater or PAXgene (blood) within minutes; RNA degrades fast</li><li><strong>RNA extraction</strong> TRIzol or column kits; DNase treatment removes genomic DNA</li><li><strong>RNA QC</strong> RIN (1–10) or DV200 for FFPE; quantity by Qubit</li><li><strong>Select RNA</strong> Poly(A) capture with oligo-dT beads, or rRNA depletion (keeps non-polyadenylated RNA)</li><li><strong>Make cDNA</strong> Fragment RNA → reverse transcription → second strand with dUTP (marks strand) → adapters → PCR</li><li><strong>Sequence</strong> ~20–40 M read pairs, 2 × 100–150 bp; long-read cDNA or direct RNA for full isoforms</li></ol>
<p>The end product of quantification is a <strong>count matrix</strong>: genes in rows, samples in columns, each entry the number of reads (or estimated fragments) assigned to that gene. Everything downstream works on this table.</p>
<p>[figure: counts | Fig. · A small piece of a count matrix. Raw counts depend on gene length and sequencing depth, so they are compared between samples only after normalisation. Illustrative values.]</p>
<h2>The standard pipeline</h2>
<ol>
<li><strong>QC</strong>: FastQC/MultiQC, rRNA content, strand check (RSeQC infer_experiment, salmon's automatic library type), gene body coverage (3′ bias indicates degradation), RIN or DV200 from the lab.</li>
<li><strong>Quantification</strong>, two routes:
<ul><li><em>Alignment-based</em>: STAR or HISAT2 to the genome, then featureCounts or HTSeq for gene counts; RSEM for isoforms. Gives BAMs for visual inspection, novel junctions and variant calling.</li>
<li><em>Pseudoalignment / selective alignment</em>: salmon or kallisto match reads to transcript sequences and resolve multi-mapping reads with an EM algorithm. Fast and accurate for annotated transcripts; use salmon with a decoy-aware index. Import with tximport/tximeta to gene level.</li></ul></li>
<li><strong>Filtering and normalisation</strong>: remove genes with very low counts (edgeR filterByExpr). Between-sample normalisation with DESeq2's median-of-ratios or edgeR's TMM. TPM and FPKM are within-sample units for display; do not feed them into count-based DE models.</li>
<li><strong>Exploration</strong>: variance-stabilising transform (vst/rlog), PCA, sample-distance heatmaps. Look for outliers, batch effects, sex mismatches (<i>XIST</i>, chrY genes) and sample swaps.</li>
<li><strong>Differential expression</strong>: negative binomial GLMs (DESeq2, edgeR) or linear models on log-CPM with precision weights (limma-voom). Include batch and covariates in the design matrix. Use empirical Bayes shrinkage of dispersions and of fold changes (apeglm, ashr) for ranking.</li>
<li><strong>Multiple testing</strong>: Benjamini–Hochberg FDR. IHW (independent hypothesis weighting) can increase power.</li>
<li><strong>Interpretation</strong>: over-representation (clusterProfiler, g:Profiler, Enrichr), rank-based GSEA (fgsea, GSEA), sample-level scores (GSVA, ssGSEA, singscore), TF and pathway activity from footprints (DoRothEA/CollecTRI with decoupleR, PROGENy), co-expression modules (WGCNA, hdWGCNA for single-cell).</li>
</ol>
<blockquote><p><strong>Why the negative binomial:</strong> Counts from technical replicates are roughly Poisson (variance = mean). Biological replicates vary more, so variance = μ + αμ², where α is the dispersion. With three replicates you cannot estimate α per gene reliably, so DESeq2 and edgeR borrow information across genes: they shrink each gene's dispersion toward a trend fitted against mean expression. That shrinkage is the main reason these tools work with small sample sizes.</p></blockquote>
<p>[figure: volcano | Fig. · A volcano plot, the standard summary of a differential expression test. Simulated results for 900 genes.]</p>
<p>[figure: sashimi | Fig. · Seeing splicing in RNA-seq. Reads that span exon–exon junctions are counted per junction; inclusion and skipping junctions give the percent spliced in (Ψ) of the middle exon. Simulated coverage.]</p>
<h2>Beyond gene counts</h2>
<ul>
<li><strong>Isoforms</strong>: short-read isoform quantification is uncertain when isoforms share most exons. Long-read RNA-seq (PacBio Kinnex/Iso-Seq, ONT cDNA or direct RNA) sequences full transcripts. Tools: IsoQuant, Bambu, FLAIR, StringTie2, TALON, ESPRESSO; SQANTI3 classifies and filters isoforms against the annotation.</li>
<li><strong>Splicing</strong>: see the <a href="#splicing">splicing chapter</a> (rMATS, LeafCutter, MAJIQ, SUPPA2).</li>
<li><strong>Fusion genes</strong>: STAR-Fusion, Arriba, FusionCatcher; important in leukaemia (BCR::ABL1), sarcomas and prostate cancer (TMPRSS2::ERG).</li>
<li><strong>Allele-specific expression</strong>: phASER, GATK ASEReadCounter; WASP-style filtering corrects reference mapping bias.</li>
<li><strong>RNA editing</strong>: REDItools, SPRINT, JACUSA2.</li>
<li><strong>Small RNA</strong>: miRDeep2, sRNAbench, nf-core/smrnaseq; miRNA target prediction with TargetScan and miRDB.</li>
<li><strong>Deconvolution</strong>: estimate cell-type proportions from bulk with CIBERSORTx, MuSiC, BayesPrism, EPIC, quanTIseq, using single-cell references.</li>
<li><strong>Nascent and decay</strong>: PRO-seq, TT-seq and metabolic labelling (SLAM-seq) separate transcription from degradation.</li>
</ul>
<h2>Tools</h2>
<p>[tools: transcriptomics]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: transcriptomics]</p>
<blockquote><p><strong>Pitfalls:</strong></p><ul><li>Confounded design: if all cases were sequenced in batch 1 and all controls in batch 2, no software can separate batch from biology.</li><li>Pseudoreplication: multiple wells from one donor are not independent biological replicates.</li><li>Calling a pathway "activated" from an over-representation test that ignores direction and gene–gene correlation.</li><li>Using a genome-wide background for enrichment when only expressed genes could have been detected.</li><li>Treating "not significant" as "not changed"; with low power, absence of evidence is not evidence of absence.</li></ul></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Accurate isoform-level quantification and differential testing, especially from long reads at modest depth.</li><li>Calibrated DE in large heterogeneous cohorts, where standard parametric tools can inflate false positives.</li><li>Separating transcriptional from post-transcriptional regulation in standard steady-state data.</li><li>Robust deconvolution when reference single-cell data come from a different platform or disease state.</li></ul></blockquote>
