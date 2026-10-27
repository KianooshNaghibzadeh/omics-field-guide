---
title: Map of the -omes
heading: A map of the -omes
part: II · The omics layers
order: 50
color: int
label: The layers
slug: types-of-omics
id: omes
description: '"-omics" means measuring all, or nearly all, members of a class of molecules at once, without choosing them in advance. That shift from hypothesis-first to measure-everything changes the statistics: you test thousands of features with few samples, so multiple testing, normalisation and study design dominate.'
---
<h2>The full list</h2>
<table>
<tr><th>Omics</th><th>What is measured</th><th>Main technologies</th><th>Typical features per sample</th><th>Core question</th></tr>
<tr><td colspan="5"><strong>DNA level</strong></td></tr>
<tr><td>Genomics</td><td>DNA sequence and variation</td><td>Short-read WGS/WES (Illumina, Element, Ultima, MGI), long reads (PacBio HiFi, Oxford Nanopore), SNP arrays</td><td>~5M SNVs/indels, ~25k SVs</td><td>Which variants does this genome carry, and which matter?</td></tr>
<tr><td>Metagenomics</td><td>All DNA in an environmental or host sample</td><td>16S/ITS amplicons, shotgun sequencing, long reads</td><td>10<sup>2</sup>–10<sup>4</sup> taxa</td><td>Who is there and what can they do?</td></tr>
<tr><td>Pan-genomics</td><td>Sequence diversity across many genomes of a species</td><td>Many de novo assemblies, graph genomes</td><td>graph nodes/edges</td><td>What does one reference miss?</td></tr>
<tr><td>Epigenomics</td><td>DNA methylation, histone marks, accessibility, TF binding, 3D structure</td><td>WGBS, EM-seq, arrays, nanopore 5mC; ChIP-seq, CUT&amp;Tag, ATAC-seq, DNase-seq; Hi-C, Micro-C</td><td>~28M CpGs; 10<sup>4</sup>–10<sup>5</sup> peaks</td><td>Which parts of the genome are readable here, and why?</td></tr>
<tr><td colspan="5"><strong>RNA level</strong></td></tr>
<tr><td>Transcriptomics</td><td>RNA abundance and structure (isoforms)</td><td>Bulk RNA-seq, long-read RNA-seq, microarrays (legacy), qPCR panels</td><td>~20k genes, ~100k+ transcripts</td><td>Which genes are used, how much, in which isoform?</td></tr>
<tr><td>Single-cell transcriptomics</td><td>RNA per individual cell or nucleus</td><td>10x Chromium, combinatorial indexing (Parse, Scale), Smart-seq3, BD Rhapsody</td><td>10<sup>3</sup>–10<sup>6</sup> cells × 20k genes</td><td>Which cell types and states exist, and how do they change?</td></tr>
<tr><td>Spatial transcriptomics</td><td>RNA with tissue coordinates</td><td>Visium/Visium HD, Stereo-seq, Slide-seq; imaging: Xenium, MERFISH/MERSCOPE, CosMx, seqFISH</td><td>10<sup>4</sup>–10<sup>7</sup> spots or cells</td><td>Where are cell states, and who are their neighbours?</td></tr>
<tr><td>Epitranscriptomics</td><td>RNA modifications (m6A, Ψ, m5C, A-to-I)</td><td>MeRIP-seq, miCLIP, GLORI, direct RNA nanopore</td><td>10<sup>4</sup> sites</td><td>How are RNA fate and translation tuned chemically?</td></tr>
<tr><td>Translatomics</td><td>Ribosome-bound mRNA</td><td>Ribo-seq, polysome profiling, TRAP</td><td>~10k translated ORFs</td><td>What is actually being translated, and where do ribosomes start?</td></tr>
<tr><td>Interactomics (RNA)</td><td>RNA–protein and RNA–RNA contacts</td><td>CLIP-seq (eCLIP, iCLIP), PARIS, RIC</td><td>binding sites</td><td>Which proteins regulate which RNAs?</td></tr>
<tr><td colspan="5"><strong>Protein level</strong></td></tr>
<tr><td>Proteomics</td><td>Protein identity and abundance</td><td>LC-MS/MS (DDA, DIA, TMT), affinity (Olink, SomaScan), antibody arrays; emerging single-molecule sequencing</td><td>3k–12k proteins (cells); 1k–11k (plasma, affinity)</td><td>Which proteins are present, how much, in what form?</td></tr>
<tr><td>PTM-omics</td><td>Phosphorylation, ubiquitination, acetylation, glycosylation</td><td>Enrichment + MS (TiO<sub>2</sub>, IMAC, antibody pulldown)</td><td>10<sup>4</sup>–10<sup>5</sup> sites</td><td>Which pathways are switched on?</td></tr>
<tr><td>Structural proteomics</td><td>3D structure and conformations</td><td>Cryo-EM, X-ray, XL-MS, HDX-MS, limited proteolysis; AlphaFold predictions</td><td>structures</td><td>How does shape explain function and variant effects?</td></tr>
<tr><td>Interactomics (protein)</td><td>Protein–protein interactions and complexes</td><td>AP-MS, BioID/TurboID proximity labelling, Y2H, co-fractionation</td><td>10<sup>4</sup>–10<sup>5</sup> interactions</td><td>Which machines do proteins form?</td></tr>
<tr><td>Immunomics / immunopeptidomics</td><td>TCR/BCR repertoires; HLA-presented peptides</td><td>AIRR-seq, single-cell VDJ, HLA peptide MS</td><td>10<sup>5</sup>–10<sup>7</sup> clonotypes</td><td>What does the immune system see and remember?</td></tr>
<tr><td>Glycomics</td><td>Glycans and glycoproteins</td><td>MS, HPLC, lectin arrays</td><td>10<sup>2</sup>–10<sup>3</sup> glycans</td><td>How do sugar chains modulate function and recognition?</td></tr>
<tr><td colspan="5"><strong>Small-molecule level</strong></td></tr>
<tr><td>Metabolomics</td><td>Small molecules</td><td>LC-MS, GC-MS, NMR, CE-MS, MS imaging</td><td>10<sup>2</sup> (targeted) to 10<sup>4</sup> features (untargeted)</td><td>What is the biochemical state right now?</td></tr>
<tr><td>Lipidomics</td><td>Lipid species</td><td>Shotgun or LC-MS lipidomics</td><td>10<sup>2</sup>–10<sup>3</sup> lipids</td><td>How are membranes, signalling and energy storage changing?</td></tr>
<tr><td>Fluxomics</td><td>Reaction rates</td><td>Stable-isotope tracing (<sup>13</sup>C, <sup>15</sup>N) + MS/NMR, flux balance models</td><td>10<sup>1</sup>–10<sup>3</sup> fluxes</td><td>How fast is material moving through pathways?</td></tr>
<tr><td>Exposomics</td><td>Environmental exposures over life</td><td>High-resolution MS of blood/urine, sensors, questionnaires</td><td>10<sup>3</sup>–10<sup>5</sup> features</td><td>What has this person been exposed to?</td></tr>
<tr><td colspan="5"><strong>Organism and clinic</strong></td></tr>
<tr><td>Phenomics</td><td>Systematic phenotypes</td><td>EHRs, HPO terms, wearables, high-content imaging, Cell Painting</td><td>10<sup>2</sup>–10<sup>3</sup> traits</td><td>How do we describe outcomes rigorously?</td></tr>
<tr><td>Radiomics / pathomics</td><td>Quantitative image features</td><td>CT, MRI, PET; whole-slide histology + deep learning</td><td>10<sup>2</sup>–10<sup>3</sup> features</td><td>Can images stand in for, or add to, molecular profiles?</td></tr>
<tr><td>Pharmacogenomics</td><td>Genetic determinants of drug response</td><td>Genotyping panels, WGS, star-allele calling</td><td>dozens of genes</td><td>Which drug and dose for this genotype?</td></tr>
<tr><td>Liquid biopsy / fragmentomics</td><td>Cell-free DNA/RNA in blood</td><td>Deep targeted sequencing, low-pass WGS, cfDNA methylation</td><td>fragments, VAFs, methylation</td><td>Can we detect and track disease from blood?</td></tr>
</table>
<h2>Three properties that shape every analysis</h2>
<p>[cards]</p><ul><li><p><strong>p ≫ n</strong></p><p>Far more features (p) than samples (n). Classical regression breaks down; you need regularisation, dimensionality reduction, empirical Bayes shrinkage and false discovery rate (FDR) control (Benjamini–Hochberg, Storey's q-value).</p></li><li><p><strong>Measurements are relative</strong></p><p>Sequencing returns a fixed number of reads per library, so counts are compositional: one feature rising forces others down. Normalisation (size factors, TMM, CLR) tries to recover comparable scales. Spike-ins can restore absolute scale.</p></li><li><p><strong>Technical variation is large</strong></p><p>Batch, operator, reagent lot, run date and sample handling can explain more variance than biology. Randomise, block and record; correct afterwards only when the design allows it.</p></li></ul>
<h2>The generic analysis arc</h2>
<p>Every layer follows a similar arc, even though the tools differ:</p>
<ol>
<li><strong>Design</strong>: question, replicates, power, randomisation, controls, metadata standards.</li>
<li><strong>Primary processing</strong>: instrument signal to reads or spectra; QC (FastQC, MultiQC; PTXQC for proteomics).</li>
<li><strong>Secondary processing</strong>: reads to features (alignment, quantification, variant/peak calling, identification).</li>
<li><strong>Feature-level QC and normalisation</strong>: filter low-quality samples and features, correct library size or loading, examine batch with PCA.</li>
<li><strong>Statistical modelling</strong>: differential abundance, association, clustering, prediction.</li>
<li><strong>Interpretation</strong>: annotation, enrichment, networks, integration with other layers and with prior knowledge.</li>
<li><strong>Validation and sharing</strong>: independent cohort, orthogonal assay, data deposition (GEO, PRIDE, MetaboLights, EGA).</li>
</ol>
