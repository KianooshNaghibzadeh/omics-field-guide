---
title: Research questions & gaps
heading: Research questions and open gaps
part: IV · Research
order: 210
color: mic
label: Research
slug: research-gaps
id: gaps
description: A map of what is unsolved, organised so you can find a thesis-sized problem. Each gap names why it is hard and what a contribution could look like. Strong PhD projects usually sit where a biological question, a data resource and a methodological weakness meet.
---
<h2>Cross-cutting gaps</h2>
<p>[cards]</p><ul><li><p><strong>1 · Causality, not correlation</strong></p><p>Most multi-omics results are associations. Combining genetic anchors (QTLs, MR), perturbations (CRISPR, drugs) and time series to build causal multi-layer models is a central open problem.</p><p><em>Contribution: a causal integration method validated against Perturb-seq or CRISPR screens.</em></p></li><li><p><strong>2 · Ground truth for evaluation</strong></p><p>Many fields (spatial domains, GRNs, multi-omics integration, cell communication) lack ground truth, so methods cannot be compared fairly.</p><p><em>Contribution: a benchmark dataset or calibrated simulator, plus a neutral comparison.</em></p></li><li><p><strong>3 · Context specificity</strong></p><p>Variant and regulatory effects depend on cell type, state, stimulus and development. Current reference maps cover few contexts.</p><p><em>Contribution: dynamic or single-cell QTL mapping; models that transfer effects across contexts.</em></p></li><li><p><strong>4 · Diversity and equity</strong></p><p>Reference panels, GWAS, QTL resources and training data for predictors over-represent European ancestry, which limits accuracy elsewhere.</p><p><em>Contribution: multi-ancestry fine-mapping, PRS or QTL methods; analysis of under-represented cohorts.</em></p></li><li><p><strong>5 · Foundation models, honestly evaluated</strong></p><p>Large pre-trained models for DNA, RNA, proteins and cells are proliferating, but evaluations frequently show they do not beat simple baselines on key tasks.</p><p><em>Contribution: rigorous evaluation, failure analysis, or task-specific models that demonstrably add value.</em></p></li><li><p><strong>6 · Uncertainty and calibration</strong></p><p>Most pipelines output point estimates. Propagating uncertainty from raw signal to biological conclusion (quantification, imputation, latent factors) is rare.</p><p><em>Contribution: Bayesian or conformal methods that give calibrated intervals.</em></p></li><li><p><strong>7 · Interpretability</strong></p><p>Deep models predict well but do not explain. Linking latent dimensions to pathways and mechanisms remains hard.</p><p><em>Contribution: biologically constrained architectures (pathway-informed, sparse) with validation.</em></p></li><li><p><strong>8 · Scale, privacy and federation</strong></p><p>Biobanks with millions of participants and atlases with hundreds of millions of cells strain current algorithms; human data often cannot leave its institution.</p><p><em>Contribution: scalable or federated algorithms, sketching, out-of-core methods.</em></p></li></ul>
<h2>Gaps by layer</h2>
<table>
<tr><th>Layer</th><th>Open problem</th><th>Why it is hard</th><th>Possible project angle</th></tr>
<tr><td>Genomics</td><td>Interpreting non-coding and structural variants in rare disease</td><td>Few labelled examples; effects are context-specific</td><td>Integrate long-read SV calls with tissue RNA-seq outliers and regulatory maps to raise diagnostic yield</td></tr>
<tr><td>Genomics</td><td>Pangenome-aware variant calling and association</td><td>Tools and coordinates assume a linear reference</td><td>GWAS or QTL mapping on graph-genome genotypes; benchmarking in diverse samples</td></tr>
<tr><td>Epigenomics</td><td>Enhancer–gene linking and enhancer grammar</td><td>Sparse CRISPR ground truth; redundancy between enhancers</td><td>Sequence-to-function deep models (Enformer, Borzoi-style) evaluated on CRISPRi data in new cell types</td></tr>
<tr><td>Epigenomics</td><td>Haplotype-resolved methylation and allele-specific regulation</td><td>Needed long reads only recently became affordable</td><td>Joint phasing, methylation and expression from long-read multi-omics</td></tr>
<tr><td>Transcriptomics</td><td>Isoform-level function and quantification</td><td>Short reads are ambiguous; long reads are lower depth</td><td>Long-read differential isoform usage with uncertainty; isoform-to-proteoform validation with MS</td></tr>
<tr><td>Single-cell</td><td>Multi-sample, multi-condition statistics</td><td>Nested design (cells within donors), compositional effects</td><td>Mixed-model or pseudobulk frameworks for spatial and multi-modal data</td></tr>
<tr><td>Spatial</td><td>Segmentation, domains and cell–cell communication with validation</td><td>Lack of ground truth; platform-specific artefacts</td><td>Benchmarks combining imaging and sequencing spatial data from serial sections</td></tr>
<tr><td>Perturbation</td><td>Predicting responses to unseen perturbations and combinations</td><td>Combinatorial space; models fail to beat linear baselines</td><td>Causal or mechanistic priors for perturbation prediction; better evaluation metrics</td></tr>
<tr><td>Proteomics</td><td>Proteoforms and PTM crosstalk</td><td>Bottom-up digestion loses combinatorial information</td><td>Methods linking top-down and bottom-up data; PTM site-level integration with phospho-signalling models</td></tr>
<tr><td>Proteomics</td><td>Plasma proteomics platform harmonisation</td><td>Olink vs SomaScan disagreement; epitope effects</td><td>Cross-platform calibration using pQTLs and MS as anchors</td></tr>
<tr><td>Metabolomics</td><td>Annotating the dark metabolome</td><td>Few reference spectra; isomers</td><td>ML structure and class prediction from MS/MS; integrating genomic context (enzymes present) to constrain candidates</td></tr>
<tr><td>Microbiome</td><td>From composition to mechanism</td><td>Compositional data, confounders, strain-level function</td><td>Integrated metagenome–metabolome models with gnotobiotic or culture validation</td></tr>
<tr><td>Integration</td><td>Mosaic, temporal and causal integration</td><td>Missing layers, different timescales, no ground truth</td><td>Dynamic latent factor models; integration with genetic anchors (MR within MOFA-like frameworks)</td></tr>
<tr><td>Clinical</td><td>Translating multi-omics into decisions</td><td>Small cohorts, overfitting, cost, regulatory evidence</td><td>Minimal biomarker panels validated across cohorts; cost-effectiveness of adding layers</td></tr>
</table>
<h2>How to choose a PhD problem in this field</h2>
<ol>
<li><strong>Start from a biological question that someone cares about</strong> (a disease, a developmental process, a drug response), then ask which layer limits the answer.</li>
<li><strong>Secure data early</strong>: public cohorts (TCGA, GTEx, UK Biobank, CELLxGENE), a collaborator's matched multi-omics, or your own. Many methods projects stall for lack of the right dataset.</li>
<li><strong>Find the methodological weakness</strong> using the benchmark hub: where do existing tools disagree, fail on certain data, or lack evaluation?</li>
<li><strong>Plan a validation</strong>: an orthogonal experiment, an independent cohort, a held-out perturbation, or a simulation calibrated to real data.</li>
<li><strong>Scope three papers</strong>: commonly (a) a benchmark or resource, (b) a method, (c) a biological application of the method.</li>
<li><strong>Release software</strong> as a documented package (Bioconductor, PyPI/scverse ecosystem) with tests; it multiplies the impact of the thesis.</li>
</ol>
<blockquote><p><strong>Ten concrete starting questions:</strong></p><ol>
<li>Do single-cell foundation model embeddings improve cell-type-specific eQTL mapping compared with pseudobulk on annotated clusters?</li>
<li>Can long-read RNA-seq resolve which GWAS-colocalised sQTLs change protein-coding potential?</li>
<li>Which share of GWAS loci without eQTL colocalisation are explained by caQTLs in disease-relevant cell types?</li>
<li>How robust are multi-omics cancer subtypes (MOFA+, SNF, iCluster) across independent cohorts and platforms?</li>
<li>Can cis-pQTL Mendelian randomisation and metabolite QTLs together identify enzyme targets with on-target metabolic biomarkers?</li>
<li>Does integrating phosphoproteomics with transcriptomics (e.g. COSMOS) predict drug response better than either layer alone in cell-line panels?</li>
<li>How much do spatial deconvolution results change with the choice of single-cell reference, and can this uncertainty be modelled?</li>
<li>What fraction of untargeted metabolomic features in human plasma are microbial in origin, and can metagenomes predict them?</li>
<li>Can calibrated variant effect predictors from protein language models reduce VUS rates in under-represented ancestries?</li>
<li>How should a multi-omics study allocate a fixed budget between more samples and more layers?</li>
</ol></blockquote>
