---
title: Workflow & reproducibility
heading: Study design, workflows and reproducibility
part: III · Connecting layers
order: 180
color: int
label: Practice
slug: workflow-reproducibility
id: practice
description: 'Most failed omics projects fail in design or data management, not in algorithms. This chapter covers the practical layer: design, batch effects, file formats, public data, workflow managers and reporting.'
---
<h2>Design before data</h2>
<ul>
<li><strong>Power</strong>: estimate from pilot or public data (RNA-seq: RNASeqPower, PROPER, ssizeRNA; scRNA-seq: scPower, hierarchicell; GWAS: genpwr). Biological replicates beat sequencing depth.</li>
<li><strong>Randomise and block</strong>: spread conditions across extraction days, library batches, flow cells and MS runs. Record everything in sample metadata.</li>
<li><strong>Controls</strong>: spike-ins (ERCC, SIRVs, sequins), pooled QC samples, reference materials (GIAB cell lines, Quartet multi-omics reference materials, NIST plasma), negative controls (blanks).</li>
<li><strong>Matched multi-omics</strong>: split the same aliquot across assays where possible; time from collection to freezing matters most for RNA and metabolites.</li>
</ul>
<h2>Batch effects</h2>
<p>If batch is not confounded with the variable of interest, include it as a covariate in the model (preferred) or correct it: ComBat (empirical Bayes on continuous data), ComBat-seq (counts), limma removeBatchEffect (for visualisation only), RUVSeq/RUVg (using control genes), SVA (surrogate variables for unknown batches), and for single-cell, Harmony or scVI. Check before and after with PCA coloured by batch and by biology, kBET or LISI scores, and silhouette widths.</p>
<blockquote><p><strong>Pitfall:</strong> Correcting batch and then testing for group differences with the corrected data can exaggerate significance, especially when the design is unbalanced (Nygaard et al. 2016, Biostatistics). Model batch in the test instead of pre-correcting when possible.</p></blockquote>
<h2>File formats you will meet</h2>
<table>
<tr><th>Format</th><th>Layer</th><th>Contains</th></tr>
<tr><td>FASTQ</td><td>Sequencing</td><td>Reads + per-base Phred qualities</td></tr>
<tr><td>POD5 / BAM (unaligned)</td><td>Long-read</td><td>Nanopore raw signal / PacBio reads with kinetics or modification tags (MM/ML)</td></tr>
<tr><td>SAM / BAM / CRAM</td><td>Alignment</td><td>Aligned reads, CIGAR strings, MAPQ, tags; CRAM is reference-compressed</td></tr>
<tr><td>VCF / BCF / gVCF</td><td>Variants</td><td>Variant records, genotypes, annotations</td></tr>
<tr><td>BED / narrowPeak / bigWig / bedGraph</td><td>Intervals, signal</td><td>Regions (0-based, half-open), peaks, coverage tracks</td></tr>
<tr><td>GTF / GFF3</td><td>Annotation</td><td>Genes, transcripts, exons (1-based, inclusive)</td></tr>
<tr><td>.hic / .cool / .mcool / pairs</td><td>3D genome</td><td>Contact matrices at multiple resolutions</td></tr>
<tr><td>h5ad / h5Seurat / RDS / MuData / SpatialData (zarr)</td><td>Single-cell, spatial</td><td>Count matrices + cell and gene metadata + embeddings</td></tr>
<tr><td>mzML / mzXML / raw</td><td>Mass spectrometry</td><td>Spectra; vendor raw files need conversion</td></tr>
<tr><td>mzTab / mzIdentML</td><td>Proteomics, metabolomics results</td><td>Identifications and quantities</td></tr>
<tr><td>BIOM / phyloseq / TreeSummarizedExperiment</td><td>Microbiome</td><td>Feature tables with taxonomy and trees</td></tr>
</table>
<blockquote><p><strong>Pitfall:</strong> BED is 0-based half-open; GTF, VCF and SAM are 1-based. Off-by-one errors between them are among the most common bugs in genomics code.</p></blockquote>
<h2>Public data you should know</h2>
<p>[cards]</p><ul><li><p><strong>Raw and processed data</strong></p><ul><li>GEO, SRA, ENA, DDBJ (sequencing)</li><li>EGA, dbGaP (controlled human data)</li><li>ArrayExpress / BioStudies</li><li>PRIDE / ProteomeXchange, MassIVE (proteomics)</li><li>MetaboLights, Metabolomics Workbench, GNPS (metabolomics)</li><li>CELLxGENE Census, Human Cell Atlas, Single Cell Portal</li></ul></li><li><p><strong>Reference cohorts</strong></p><ul><li>TCGA / GDC, ICGC/PCAWG, CPTAC (cancer multi-omics)</li><li>GTEx (tissue expression and QTLs)</li><li>UK Biobank, All of Us, FinnGen, Biobank Japan</li><li>gnomAD, 1000 Genomes, TOPMed, HPRC</li><li>ENCODE, Roadmap, IHEC, 4DN (regulation)</li><li>DepMap, LINCS/CMap (perturbations)</li></ul></li><li><p><strong>Knowledge bases</strong></p><ul><li>Ensembl, GENCODE, RefSeq, UCSC</li><li>UniProt, AlphaFold DB, PDB</li><li>GO, Reactome, KEGG, WikiPathways, MSigDB</li><li>ClinVar, ClinGen, OMIM, HPO, Orphanet</li><li>HMDB, ChEBI, LIPID MAPS</li><li>GWAS Catalog, Open Targets, STRING, OmniPath</li></ul></li></ul>
<h2>Reproducible computation</h2>
<ul>
<li><strong>Workflow managers</strong>: Nextflow with the community-curated <strong>nf-core</strong> pipelines (rnaseq, sarek, atacseq, methylseq, scrnaseq, mag, ampliseq and more), Snakemake, WDL/Cromwell (Terra, GATK), CWL.</li>
<li><strong>Environments</strong>: conda/mamba (bioconda), Docker, Apptainer/Singularity for HPC; renv (R) and uv/poetry (Python) for analysis code.</li>
<li><strong>Version control</strong>: git for code; record reference genome build, annotation release, tool versions and parameters. DVC or data registries for large data.</li>
<li><strong>Notebooks and reports</strong>: Quarto, R Markdown, Jupyter. Keep exploratory notebooks separate from the final, scripted analysis.</li>
<li><strong>FAIR data</strong>: findable, accessible, interoperable, reusable. Use community metadata standards (MINSEQE, MIAPE, MIxS, Metabolomics Standards Initiative).</li>
<li><strong>Compute</strong>: WGS alignment and calling ≈ hours per genome on a server (minutes on GPU with Parabricks or DRAGEN); scRNA-seq with ~10<sup>6</sup> cells needs tens of GB of RAM or out-of-core tools; deep models need GPUs.</li>
</ul>
<h2>Tools</h2>
<p>[tools: practice]</p>
