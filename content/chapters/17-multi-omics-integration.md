---
title: Integrating multi-omics data
heading: Integrating multi-omics data
part: III · Connecting layers
order: 170
color: int
label: Multi-omics · methods
slug: multi-omics-integration
id: integration
description: Integration means analysing two or more layers jointly so that the result is more than the sum of separate analyses. The right method depends on the question, on whether layers come from the same samples or cells, and on how much prior knowledge you want to impose.
---
<h2>First, define the integration task</h2>
<table>
<tr><th>Goal</th><th>Question</th><th>Method families</th></tr>
<tr><td>Subtyping</td><td>Are there patient groups visible across layers?</td><td>Multi-view clustering (SNF, iClusterBayes, intNMF, NEMO), latent factors + clustering</td></tr>
<tr><td>Factor discovery</td><td>What shared and layer-specific axes of variation exist?</td><td>MOFA+, JIVE, MCIA, RGCCA, GFA</td></tr>
<tr><td>Prediction</td><td>Which combination of features predicts outcome?</td><td>DIABLO (sparse PLS-DA), stacked/late-fusion models, multi-modal deep learning, penalised Cox models</td></tr>
<tr><td>Mechanism</td><td>Which molecular chain links genotype to phenotype?</td><td>QTL + colocalisation + MR, mediation analysis, causal networks</td></tr>
<tr><td>Network / pathway</td><td>Which pathways are dysregulated across layers?</td><td>Multi-layer networks, prize-collecting Steiner trees (Omics Integrator), PARADIGM, COSMOS, multi-omics GSEA (mitch, ActivePathways, multiGSEA)</td></tr>
<tr><td>Cell-level alignment</td><td>Match cells across modalities</td><td>WNN (Seurat v4/5), totalVI, MultiVI, GLUE, MOFA+, Cobolt, StabMap, MIDAS</td></tr>
</table>
<h2>When to combine: early, intermediate, late</h2>
<p>[figure: integration-diagram-1 | Fig. 15.1 · The three integration strategies. Most current methods are intermediate: they learn a latent representation Z shared across layers.]</p>
<h2>Sample structure determines what is possible</h2>
<p>[cards]</p><ul><li><p><strong>Matched (vertical)</strong></p><p>All layers measured on the same samples or cells. Allows true joint models (MOFA+, DIABLO, WNN, totalVI). The anchor is the sample.</p></li><li><p><strong>Unmatched (diagonal)</strong></p><p>Different samples or cells per layer, same biology. Needs feature-level links (gene activity from ATAC, prior graphs): GLUE, LIGER/UINMF, Seurat bridge integration. Riskier assumptions.</p></li><li><p><strong>Mosaic</strong></p><p>Some samples have some layers. Methods: MultiVI, StabMap, MIDAS, Cobolt. Common in real consortia data.</p></li><li><p><strong>Horizontal</strong></p><p>Same layer across batches or studies. This is batch integration (Harmony, scVI), not multi-omics, but usually comes first.</p></li></ul>
<h2>Core method families explained</h2>
<h3>Matrix factorisation and latent factor models</h3>
<p>Each layer X<sub>m</sub> (samples × features) is approximated as Z·W<sub>m</sub><sup>T</sup>, where Z (samples × K factors) is shared and W<sub>m</sub> holds layer-specific weights. <strong>MOFA/MOFA+</strong> is a Bayesian group factor analysis with sparsity priors and per-layer likelihoods (Gaussian, Bernoulli, Poisson); it reports variance explained per factor per layer, so you see which factors are shared and which are private. <strong>JIVE</strong> separates joint from individual structure explicitly. <strong>MCIA</strong> and <strong>RGCCA</strong> maximise covariance between layer-specific projections. <strong>intNMF</strong> uses non-negative factorisation suited to clustering. <strong>iCluster/iClusterBayes</strong> fit a joint latent variable model for subtype discovery.</p>
<h3>Similarity and network fusion</h3>
<p><strong>SNF</strong> builds a patient-similarity network per layer and iteratively fuses them through message passing until they converge; spectral clustering of the fused network gives subtypes. Robust to different scales and noise, easy to apply, but feature-level interpretation is indirect. <strong>NEMO</strong> extends this to partial data.</p>
<h3>Supervised multi-block methods</h3>
<p><strong>DIABLO</strong> (mixOmics) finds sparse components that are correlated across layers and discriminate a categorical outcome, controlled by a design matrix of how strongly layers should correlate. Good for biomarker panels with cross-validation. <strong>Multi-block sPLS</strong> and penalised regression with layer-specific penalties (priority-Lasso, IPF-Lasso) are alternatives.</p>
<h3>Deep generative models</h3>
<p>Variational autoencoders with modality-specific encoders and decoders learn a joint latent space while modelling count noise properly: <strong>totalVI</strong> (RNA + surface proteins), <strong>MultiVI</strong> (RNA + ATAC, with mosaic support), <strong>PeakVI</strong>, <strong>GLUE</strong> (uses a prior regulatory graph to link unpaired modalities), <strong>scMM</strong>, <strong>MIDAS</strong>. Bulk-level examples include multi-omics autoencoders for survival (e.g. in TCGA). Graph neural networks operate on biological networks with omics features as node attributes. These models are flexible but need more data and careful evaluation against simple baselines.</p>
<h3>Knowledge-driven integration</h3>
<p>Instead of letting the data discover structure, map all layers onto prior networks: pathways (Reactome, KEGG), signalling (OmniPath), metabolic models (Human-GEM), regulatory networks (CollecTRI). <strong>COSMOS</strong> links phosphoproteomics, transcriptomics and metabolomics through a causal prior knowledge network using integer linear programming. <strong>Omics Integrator</strong> solves a prize-collecting Steiner forest to connect measured hits through the interactome. <strong>ActivePathways</strong> merges p-values across layers per pathway. These are more interpretable but limited by the completeness and bias of the prior knowledge.</p>
<p>[figure: mofa | Fig. · The main output of MOFA+: the percentage of variance each factor explains in each layer. Illustrative values.]</p>
<h2>A practical recipe</h2>
<ol>
<li><strong>Write down the question and the relationship you expect</strong> (previous chapter). Pick the method family from the task table.</li>
<li><strong>Process each layer well on its own first</strong>: QC, normalisation, batch correction, and single-layer results. If a layer is uninformative alone, integration rarely rescues it.</li>
<li><strong>Harmonise samples and identifiers</strong>: one sample sheet with IDs per layer; check sample identity across layers (genotype concordance from RNA and DNA, sex markers) to detect swaps.</li>
<li><strong>Transform to comparable scales</strong>: variance-stabilised counts, log intensities, M-values, CLR for compositions. Scale features or weight layers so the largest layer does not dominate.</li>
<li><strong>Select features</strong> (highly variable per layer) to keep layers balanced and reduce noise.</li>
<li><strong>Handle missing data</strong> explicitly: methods that tolerate missing views (MOFA+, MultiVI, late fusion) are better than imputing whole layers.</li>
<li><strong>Fit, then inspect</strong>: variance explained per layer, factor–covariate associations (batch must not drive factors), stability across random seeds and subsamples.</li>
<li><strong>Interpret</strong> with feature weights, enrichment per factor, and links back to known biology.</li>
<li><strong>Validate</strong> on an independent cohort or with an orthogonal experiment. For prediction, nest feature selection inside cross-validation to avoid leakage.</li>
</ol>
<h2>Tools</h2>
<p>[tools: integration]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: integration]</p>
<blockquote><p><strong>The honest summary of the benchmarks:</strong> No integration method wins everywhere. Adding layers does not automatically improve subtyping or prediction; a well-processed single layer (often transcriptomics) can match multi-omics models. Gains are largest when layers carry complementary information and sample sizes are adequate. Simple baselines (concatenated PCA, late fusion of separately trained models) should always be reported.</p></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Benchmarks with real ground truth for multi-omics (spike-in designs, simulations calibrated to real data, perturbation experiments).</li><li>Integration that respects causal direction and time, rather than symmetric correlation.</li><li>Uncertainty quantification for latent factors and integrated predictions.</li><li>Scalable, privacy-preserving (federated) integration across cohorts that cannot share data.</li><li>Interpretable deep integration: tying latent dimensions back to pathways and mechanisms.</li><li>Mosaic integration with many missing layers, typical of clinical cohorts.</li></ul></blockquote>
