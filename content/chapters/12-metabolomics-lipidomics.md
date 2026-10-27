---
title: Metabolomics
heading: Metabolomics
part: II · The omics layers
order: 120
color: met
label: Small-molecule layer
slug: metabolomics-lipidomics
id: metabolomics
description: 'Metabolites are the substrates, products and signals of biochemistry: sugars, amino acids, nucleotides, lipids, cofactors, drugs and microbial products. They change within seconds and integrate genes, environment, diet and microbiome, which makes them the omics layer closest to phenotype.'
---
<h2>Research questions</h2>
<ul>
<li>Which metabolites or pathways distinguish disease, and can they be biomarkers?</li>
<li>How do genes (mQTLs), diet, drugs and gut microbes shape circulating metabolites?</li>
<li>Where does carbon flow through central metabolism in a tumour or immune cell (isotope tracing)?</li>
<li>What is this unknown feature? (structure elucidation is the bottleneck of the field)</li>
<li>What has a person been exposed to (exposome)?</li>
</ul>
<h2>Technologies</h2>
<table>
<tr><th>Platform</th><th>Strengths</th><th>Weaknesses</th><th>Typical use</th></tr>
<tr><td>LC-MS (reversed phase, HILIC)</td><td>Broad coverage, sensitive, MS/MS for identification</td><td>Ion suppression, batch drift, many features per metabolite (adducts, isotopes, in-source fragments)</td><td>Untargeted discovery, lipidomics</td></tr>
<tr><td>GC-MS</td><td>Reproducible retention, large EI spectral libraries (NIST)</td><td>Needs derivatisation and volatility</td><td>Central carbon metabolism, organic acids</td></tr>
<tr><td>NMR</td><td>Quantitative, non-destructive, highly reproducible, structural information</td><td>~100× less sensitive than MS</td><td>Large cohorts (e.g. Nightingale lipoprotein panels), flux</td></tr>
<tr><td>Targeted triple-quad MRM</td><td>Absolute quantification with standards</td><td>Only predefined metabolites</td><td>Validation, clinical assays (Biocrates kits)</td></tr>
<tr><td>MS imaging (MALDI, DESI)</td><td>Spatial distribution in tissue</td><td>Identification and quantification hard</td><td>Spatial metabolomics</td></tr>
</table>
<h2>How metabolomic data are generated</h2>
<p>[steps]</p><ol><li><strong>Collect &amp; quench</strong> Stop metabolism instantly: cold methanol, liquid nitrogen; process plasma within ~30 min on ice</li><li><strong>Extract</strong> Methanol/acetonitrile for polar metabolites; MTBE or Folch/Bligh–Dyer for lipids; add internal standards</li><li><strong>Prepare</strong> Dry and reconstitute; derivatise for GC-MS; make a pooled QC from all samples</li><li><strong>Run order</strong> Randomise samples; inject blanks and pooled QCs every 5–10 samples; MS/MS on pooled QCs for identification</li><li><strong>LC-MS / GC-MS / NMR</strong> Reversed phase (lipids, non-polar) and HILIC (polar), positive and negative ionisation</li><li><strong>Raw output</strong> Vendor files → mzML; NMR free-induction decays → spectra</li></ol>
<p>[figure: mzrt | Fig. · All features detected in one untargeted LC-MS run of plasma. Simulated data.]</p>
<p>[figure: lcms | Fig. · Zooming in on one feature: its chromatographic peak and the mass spectrum at the apex, showing how one compound produces several ions. Simulated data for glucose (monoisotopic mass 180.063 Da).]</p>
<h2>Untargeted LC-MS workflow</h2>
<ol>
<li><strong>Design</strong>: randomised injection order, pooled QC samples every 5–10 injections, blanks, internal standards, and long-term reference material (NIST SRM 1950 plasma).</li>
<li><strong>Conversion</strong>: vendor files to open formats (mzML) with ProteoWizard msconvert.</li>
<li><strong>Feature detection</strong>: find chromatographic peaks in m/z–retention-time space (XCMS centWave, MZmine 3 ADAP, MS-DIAL, OpenMS FeatureFinderMetabo).</li>
<li><strong>Alignment and grouping</strong> across samples (retention-time correction), gap filling.</li>
<li><strong>Annotation of feature redundancy</strong>: group adducts ([M+H]<sup>+</sup>, [M+Na]<sup>+</sup>), isotopes and fragments of the same compound (CAMERA, MS-FLO, IPA).</li>
<li><strong>Drift and batch correction</strong>: QC-based LOESS or random forest (QC-RLSC, SERRF), and filter features with high CV in QCs (&gt;20–30%).</li>
<li><strong>Identification</strong>: match accurate mass, retention time and MS/MS spectra to libraries (MoNA, MassBank, GNPS, NIST, mzCloud) or predict structures (SIRIUS with CSI:FingerID, CANOPUS compound classes, MS-FINDER, MetFrag). Molecular networking (GNPS/FBMN) clusters related spectra so annotations propagate.</li>
<li><strong>Statistics</strong>: log or generalised-log transform, scaling (Pareto, auto), univariate tests with FDR, multivariate PCA, PLS-DA and OPLS-DA (with permutation testing and cross-validation; PLS-DA overfits easily).</li>
<li><strong>Pathway analysis</strong>: over-representation on KEGG, SMPDB or Reactome (MetaboAnalyst), or annotation-free mummichog / PIUMet that work directly from m/z values.</li>
</ol>
<blockquote><p><strong>Identification confidence (Metabolomics Standards Initiative):</strong> <strong>Level 1</strong>: confirmed with an authentic standard (same RT and MS/MS on the same system). <strong>Level 2</strong>: probable structure from library spectrum match. <strong>Level 3</strong>: tentative compound class. <strong>Level 4</strong>: unknown. Schymanski et al. (2014) added finer levels for high-resolution MS. Always report the level. Most untargeted features remain at level 3–4.</p></blockquote>
<h2>Flux and metabolic models</h2>
<p>Lipids are measured with the same instruments but have their own extraction, standards, nomenclature and quantification rules; they are covered in the <a href="#lipidomics">Lipidomics chapter</a>, with a focus on targeted methods. <strong>Stable-isotope tracing</strong> follows <sup>13</sup>C-glucose or <sup>13</sup>C-glutamine into downstream metabolites; isotopologue distributions are corrected for natural abundance (IsoCor, AccuCor) and fluxes estimated with INCA or 13CFLUX2. <strong>Genome-scale metabolic models</strong> (Recon3D, Human1/Human-GEM, AGORA2 for gut microbes) predict fluxes by flux balance analysis under constraints (COBRApy, COBRA Toolbox, RAVEN); omics data constrain them to tissue or patient-specific models (GIMME, iMAT, tINIT).</p>
<h2>Tools</h2>
<p>[tools: metabolomics]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: metabolomics]</p>
<blockquote><p><strong>Research gap:</strong></p><ul><li>The "dark metabolome": most MS/MS spectra in untargeted studies are unannotated. Structure prediction, in silico libraries and ML-based class annotation are active areas.</li><li>Cross-lab reproducibility and harmonisation of feature tables.</li><li>Absolute quantification at scale and combining metabolomics with fluxes.</li><li>Distinguishing host-, microbe- and diet-derived metabolites in integrated host–microbiome models.</li><li>Spatial metabolomics at single-cell resolution.</li></ul></blockquote>
