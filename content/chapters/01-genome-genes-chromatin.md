---
title: Genome, genes & chromatin
heading: Genome, genes & chromatin
part: I · Foundations
order: 10
color: dna
label: Foundations
slug: genome-genes-chromatin
id: cell
description: 'Before any algorithm makes sense you need a clear picture of the molecules being measured: what DNA is, how a gene is laid out, and how two metres of DNA fit inside a nucleus while staying readable.'
---
<h2>DNA: the molecule</h2>
<p>DNA (deoxyribonucleic acid) is a polymer of four nucleotides. Each nucleotide has a deoxyribose sugar, a phosphate and one of four bases: the purines <strong>adenine (A)</strong> and <strong>guanine (G)</strong>, and the pyrimidines <strong>cytosine (C)</strong> and <strong>thymine (T)</strong>. Two strands wind into a right-handed double helix and pair by hydrogen bonds: A with T (two bonds) and G with C (three bonds). Because G–C pairs are stronger, the <em>GC content</em> of a region affects its melting temperature, how well it is captured and amplified in library preparation, and therefore sequencing coverage. GC bias is a recurring source of technical artefacts in nearly every sequencing-based omics assay.</p>
<p>The strands are <strong>antiparallel</strong>: one runs 5′→3′, the other 3′→5′. Polymerases only synthesise in the 5′→3′ direction, so by convention sequences are written 5′→3′. A gene can sit on either strand, which is why annotation files (GTF/GFF) carry a <code>+</code> or <code>−</code> strand field and why "strand-specific" RNA-seq libraries matter: they tell you which strand an RNA was transcribed from, so overlapping antisense genes can be separated.</p>
<blockquote><p><strong>Key idea:</strong> Base complementarity is the physical principle behind most of the field: hybridisation arrays, PCR, probe capture, bisulfite conversion readouts, CRISPR guide targeting and sequencing-by-synthesis all depend on A·T and G·C pairing.</p></blockquote>
<h2>How the human genome is organised</h2>
<table>
<tr><th>Feature</th><th>Approximate size (human)</th><th>Why it matters for analysis</th></tr>
<tr><td>Haploid genome</td><td>~3.1 Gb (T2T-CHM13: 3.055 Gb, gap-free)</td><td>Sets sequencing depth: 30× WGS ≈ 93 Gb of sequence per sample.</td></tr>
<tr><td>Chromosomes</td><td>22 autosome pairs + XX or XY; mitochondrial DNA 16,569 bp in hundreds to thousands of copies per cell</td><td>Sex chromosomes need ploidy-aware variant calling; mtDNA shows heteroplasmy (a fraction of copies mutated).</td></tr>
<tr><td>Protein-coding genes</td><td>~19,000–20,000 (GENCODE)</td><td>Coding sequence is only ~1–2% of the genome; exome sequencing targets this ~30–60 Mb.</td></tr>
<tr><td>Non-coding RNA genes</td><td>~20,000+ lncRNA genes, plus miRNA, snRNA, snoRNA, tRNA, rRNA</td><td>Many have poorly understood functions; annotation is still changing between releases.</td></tr>
<tr><td>Repeats</td><td>~50%: transposable elements (LINEs ~17%, SINEs/Alu ~11%, LTRs, DNA transposons), satellites, segmental duplications (~5–7%)</td><td>Short reads map ambiguously to repeats, producing low mapping quality and false variants. Long reads and T2T references help.</td></tr>
<tr><td>Centromeres &amp; telomeres</td><td>Megabase α-satellite arrays; TTAGGG telomere repeats</td><td>Missing from GRCh38 until the T2T consortium filled them in 2022.</td></tr>
</table>
<p>The two reference assemblies you will meet are <strong>GRCh37/hg19</strong> (2009, still used by many clinical labs) and <strong>GRCh38/hg38</strong> (2013, current standard), plus the complete <strong>T2T-CHM13</strong> (2022) and the <strong>Human Pangenome Reference</strong> (a graph of many haplotypes, first release 2023). Coordinates differ between builds, so mixing them is one of the most common silent errors. Use <code>liftOver</code> or <code>CrossMap</code> to convert, and always record the build.</p>
<h2>Anatomy of a protein-coding gene</h2>
<p>Reading 5′→3′ along the coding strand, a typical eukaryotic gene contains:</p>
<ul>
<li><strong>Promoter</strong>: the region around the transcription start site (TSS) where RNA polymerase II and general transcription factors assemble. Core promoter elements include the TATA box (~25–30 bp upstream, in a minority of genes), the initiator and downstream promoter element. About 60–70% of human promoters sit in <strong>CpG islands</strong>, regions of high CpG density that are usually unmethylated when the gene is active.</li>
<li><strong>Enhancers and silencers</strong>: distal regulatory elements, sometimes hundreds of kilobases away, bound by sequence-specific transcription factors. They contact promoters through 3D chromatin looping. Most disease-associated GWAS variants fall in enhancers rather than in coding sequence.</li>
<li><strong>5′ untranslated region (5′UTR)</strong>: transcribed but not translated; contains elements controlling ribosome recruitment, including upstream open reading frames (uORFs).</li>
<li><strong>Exons and introns</strong>: exons are retained in mature mRNA; introns are removed by splicing. Human genes average ~9–10 exons; introns are on average much longer than exons.</li>
<li><strong>Coding sequence (CDS)</strong>: from the start codon (AUG) to a stop codon (UAA, UAG, UGA), read in triplets.</li>
<li><strong>3′UTR and polyadenylation signal</strong>: the AAUAAA hexamer directs cleavage and poly(A) tail addition. 3′UTRs carry microRNA binding sites and RNA-binding protein motifs that control stability, localisation and translation. Alternative polyadenylation produces isoforms with longer or shorter 3′UTRs.</li>
</ul>
<p>[figure: cell-diagram-1 | Fig. 1.1 · A three-exon gene. Enhancers can sit upstream, downstream or inside introns of the gene they regulate, or of a different gene.]</p>
<h2>Chromatin: packaging that controls access</h2>
<p>DNA wraps ~147 bp at a time around a <strong>nucleosome</strong>, an octamer of histones H2A, H2B, H3 and H4. Nucleosomes are separated by linker DNA (bound by H1), giving the "beads on a string" fibre with a ~200 bp periodicity. This periodicity is visible directly in ATAC-seq fragment-length distributions and in cell-free DNA fragment sizes (~167 bp peak), which is why both are used to infer nucleosome positioning.</p>
<p>Chromatin exists in two broad states:</p>
<p>[cards]</p><ul><li><p><strong>Euchromatin</strong></p><p>Open, gene-rich, transcriptionally active. Marked by H3K4me3 at active promoters, H3K27ac at active enhancers and promoters, H3K36me3 across transcribed gene bodies. Accessible to transcription factors and to Tn5 transposase (ATAC-seq) and DNase I.</p></li><li><p><strong>Heterochromatin</strong></p><p>Compact and repressed. <em>Constitutive</em> (H3K9me3; repeats, centromeres) or <em>facultative</em> (H3K27me3 deposited by Polycomb; developmentally silenced genes that can be reactivated). Usually high CpG methylation outside islands.</p></li></ul>
<p>At larger scales the genome folds into <strong>loops</strong> (often anchored by CTCF and cohesin), <strong>topologically associating domains (TADs)</strong> of roughly 100 kb–1 Mb that preferentially self-interact, and <strong>A/B compartments</strong> that separate active from inactive chromatin. These are measured with chromosome conformation capture (Hi-C, Micro-C) and covered in the <a href="#epigenomics">epigenomics chapter</a>. Disrupting a TAD boundary can let an enhancer activate the wrong gene; this mechanism explains some limb malformations and cancers.</p>
<h2>Cells, tissues and why context matters</h2>
<p>Almost every cell in a person carries the same genome, yet a neuron and a hepatocyte use very different sets of genes. Cell identity is established by transcription factors and maintained by the epigenome. For analysis this has three consequences:</p>
<ol>
<li><strong>Bulk measurements average over cell types.</strong> A change in a bulk tissue profile can mean that cells changed state, or only that the cell-type proportions changed. Deconvolution and single-cell methods exist to separate these.</li>
<li><strong>Regulatory effects are context-specific.</strong> A variant may affect expression only in one cell type, developmental stage or stimulus condition, which is a central difficulty when interpreting GWAS hits.</li>
<li><strong>Somatic variation exists.</strong> Cells acquire mutations as they divide. Cancer is the extreme case, but normal tissues are also mosaics of clones, which matters for low-frequency variant detection.</li>
</ol>
<blockquote><p><strong>Pitfall:</strong> Gene identifiers are a constant source of silent data loss. HGNC symbols change (for example, <code>SEPT7</code> → <code>SEPTIN7</code>, after spreadsheets kept converting it to a date), Ensembl IDs carry version suffixes (<code>ENSG00000141510.18</code>), and one gene maps to many transcripts and proteins. Map on stable IDs, strip versions consistently and keep the mapping table you used.</p></blockquote>
