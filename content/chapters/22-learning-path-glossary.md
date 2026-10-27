---
title: Learning path & glossary
heading: Learning path and glossary
part: IV · Research
order: 220
color: int
label: Reference
slug: learning-path-glossary
id: learn
description: A staged plan for becoming fluent in omics analysis, followed by the vocabulary you will meet in papers and pipeline documentation.
---
<h2>Stages</h2>
<table>
<tr><th>Stage</th><th>Biology</th><th>Computation</th><th>Statistics</th><th>Practice project</th></tr>
<tr><td>1 · Foundations</td><td>Chapters 1–4 of this guide; a molecular biology textbook (Alberts, <i>Molecular Biology of the Cell</i>)</td><td>Linux shell, file formats, git; R basics (tidyverse) or Python (pandas)</td><td>Distributions, hypothesis tests, regression, p-values vs effect sizes</td><td>Download a GEO count matrix, make PCA and a volcano plot</td></tr>
<tr><td>2 · One layer well</td><td>Gene regulation; the biology of your system</td><td>Run nf-core/rnaseq; Bioconductor (SummarizedExperiment) or scverse (AnnData)</td><td>GLMs, negative binomial, multiple testing, empirical Bayes</td><td>Reanalyse a published RNA-seq study end to end and compare with the paper</td></tr>
<tr><td>3 · Single-cell and a second layer</td><td>Cell types, development, chromatin</td><td>Scanpy or Seurat; ATAC or proteomics pipelines; HPC job schedulers</td><td>Dimensionality reduction, clustering, mixed models, compositional data</td><td>Integrate two scRNA-seq datasets and test pseudobulk DE</td></tr>
<tr><td>4 · Integration and genetics</td><td>Population genetics, QTLs</td><td>PLINK, tensorQTL, MOFA+, mixOmics</td><td>Latent factor models, Bayesian inference, causal inference (MR, colocalisation)</td><td>Colocalise a GWAS with GTEx eQTLs; run MOFA+ on TCGA multi-omics</td></tr>
<tr><td>5 · Methods development</td><td>Deep knowledge of one system</td><td>PyTorch/JAX, package development, testing, benchmarking frameworks</td><td>Probabilistic modelling, variational inference, ML evaluation</td><td>Build and benchmark a method against neutral baselines</td></tr>
</table>
<h2>Recommended resources</h2>
<p>[cards]</p><ul><li><p><strong>Books</strong></p><ul><li>Alberts et al., <i>Molecular Biology of the Cell</i></li><li>Strachan &amp; Read, <i>Human Molecular Genetics</i></li><li>Holmes &amp; Huber, <i>Modern Statistics for Modern Biology</i> (free online)</li><li>James et al., <i>An Introduction to Statistical Learning</i> (free online)</li><li>Durbin et al., <i>Biological Sequence Analysis</i></li></ul></li><li><p><strong>Online and free</strong></p><ul><li>Single-cell Best Practices (sc-best-practices.org)</li><li>Orchestrating Single-Cell Analysis with Bioconductor (OSCA)</li><li>Bioconductor workflows and vignettes</li><li>Galaxy Training Network</li><li>nf-core documentation</li><li>GATK Best Practices documentation</li></ul></li><li><p><strong>Habits</strong></p><ul><li>Reanalyse published data before generating your own</li><li>Read the methods section of every tool you use</li><li>Keep a lab notebook for analyses (date, versions, decisions)</li><li>Follow benchmarks and preprints in your area (bioRxiv)</li><li>Join communities: Biostars, Bioconductor support, scverse forum</li></ul></li></ul>
<h2>Glossary</h2>
<p>[glossary]</p>
