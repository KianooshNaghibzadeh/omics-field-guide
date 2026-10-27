---
title: Metagenomics & microbiome
heading: Metagenomics and the microbiome
part: II · The omics layers
order: 140
color: mic
label: Community layer
slug: metagenomics-microbiome
id: microbiome
description: Humans carry roughly as many bacterial cells as human cells, and the gut microbiome encodes far more genes than our own genome. Metagenomics sequences the whole community to ask who is there, what they can do, and how they interact with the host.
---
<h2>Research questions</h2>
<ul>
<li>How does community composition differ in disease, and is it cause or consequence?</li>
<li>Which functions (pathways, antibiotic resistance genes, virulence factors) are present and expressed?</li>
<li>Which strains are shared between mother and infant, or transmitted between people?</li>
<li>Which microbial metabolites (short-chain fatty acids, bile acids, TMAO) mediate effects on the host?</li>
<li>Which genomes have never been cultured (metagenome-assembled genomes)?</li>
</ul>
<h2>How microbiome data are generated</h2>
<p>[steps]</p><ol><li><strong>Collect</strong> Stool, swab, saliva, soil, water; stabilising buffer or immediate freezing; record diet, drugs, antibiotics</li><li><strong>Extract DNA</strong> Bead-beating to break tough Gram-positive walls; include extraction blanks and a mock community</li><li><strong>Amplicon or shotgun</strong> 16S/ITS PCR with barcoded primers, or fragment all DNA for shotgun libraries</li><li><strong>Sequence</strong> Amplicons: 2 × 250–300 bp, ~20–50k reads/sample; shotgun: 5–20 M reads/sample, long reads for genomes</li><li><strong>Controls</strong> Negative controls to detect contamination; positive mock communities to measure bias</li></ol>
<h2>Approaches</h2>
<p>[cards]</p><ul><li><p><strong>Amplicon (16S rRNA, ITS, 18S)</strong></p><p>PCR of a marker gene's variable regions (e.g. V4). Cheap and sensitive; genus-level (sometimes species) taxonomy; no direct function. Denoise into exact amplicon sequence variants (ASVs) with DADA2, Deblur or UNOISE rather than 97% OTUs. Classify with SILVA, GTDB or Greengenes2. Infer function with PICRUSt2 (predicted, so interpret with care).</p></li><li><p><strong>Shotgun metagenomics</strong></p><p>Sequences all DNA. Taxonomic profiling by marker genes (MetaPhlAn 4) or k-mers (Kraken 2 + Bracken, sylph); functional profiling (HUMAnN 3); assembly (MEGAHIT, metaSPAdes, metaFlye), binning into MAGs (MetaBAT 2, SemiBin2, VAMB, DAS Tool), quality with CheckM2 (MIMAG completeness and contamination standards), taxonomy with GTDB-Tk; strain tracking (StrainPhlAn, inStrain).</p></li><li><p><strong>Meta-transcriptomics, -proteomics, -metabolomics</strong></p><p>Which genes are expressed (HUMAnN on RNA), which proteins are made, and which metabolites are present. Integrating these with the metagenome separates potential function from realised activity.</p></li></ul>
<p>[figure: s16 | Fig. · The 16S rRNA gene, the marker used for bacterial amplicon sequencing.]</p>
<p>[figure: stackbar | Fig. · Genus-level composition of eight stool samples, the standard microbiome bar chart. Simulated data.]</p>
<h2>The statistics of compositions</h2>
<p>Microbiome counts are <strong>compositional</strong> (only relative abundances are observed), <strong>sparse</strong> (many zeros), and <strong>overdispersed</strong>. Rarefying throws away data; total-sum scaling ignores compositionality. Use compositionally aware methods: centred or additive log-ratio transforms (CLR, ALR), ANCOM-BC2, ALDEx2, LinDA, or regression frameworks such as MaAsLin 2/3 with careful normalisation. Diversity: alpha (richness, Shannon, Faith's PD) and beta (Bray–Curtis, UniFrac, Aitchison distance) tested with PERMANOVA (vegan adonis2), checking dispersion first (betadisper).</p>
<blockquote><p><strong>Pitfalls:</strong></p><ul><li>Contamination dominates low-biomass samples (tissue, blood, placenta). Include extraction and PCR blanks and use decontam.</li><li>Host DNA can be over 90% of reads in tissue; deplete or sequence deeper.</li><li>Medication (metformin, proton-pump inhibitors, antibiotics), diet and transit time confound case–control differences.</li><li>Different differential-abundance methods give different answers on the same data; report results from several methods or a consensus.</li></ul></blockquote>
<h2>Tools</h2>
<p>[tools: microbiome]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: microbiome]</p>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Moving from association to mechanism: causal inference, gnotobiotic validation, metabolite mediation.</li><li>Strain-level functional differences and horizontal gene transfer tracking.</li><li>Viromes and phages, the least annotated part of the microbiome.</li><li>Absolute abundance (flow cytometry, spike-ins, qPCR) instead of relative abundance.</li><li>Integrating microbial genomes, host genotype and metabolome in one causal model.</li></ul></blockquote>
