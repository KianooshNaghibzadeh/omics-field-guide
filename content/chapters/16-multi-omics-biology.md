---
title: How the layers talk
heading: How the layers talk to each other
part: III · Connecting layers
order: 160
color: int
label: Multi-omics · biology
slug: multi-omics-biology
id: relations
description: Before integrating data computationally, decide what biological relationship you expect between the layers. The relationship determines which features you can link, which direction effects flow, how strong correlations should be, and which method is appropriate.
---
<h2>Six kinds of relationship</h2>
<table>
<tr><th>Relationship</th><th>Mechanism</th><th>How to link features</th><th>Expected signal</th></tr>
<tr><td>Genome → every layer (cis)</td><td>A variant changes its own gene's regulation, splicing, coding sequence or structure</td><td>Genomic position: variant within ±1 Mb of the gene (cis window)</td><td>QTLs: strong, replicable, often small effect on traits</td></tr>
<tr><td>Genome → every layer (trans)</td><td>A variant in a TF, enzyme or receptor affects distant genes or metabolites</td><td>Genome-wide scan; network propagation</td><td>Weaker, harder to detect; large sample sizes needed</td></tr>
<tr><td>Epigenome → transcriptome</td><td>Accessibility and marks at promoters and enhancers control transcription</td><td>Peak-to-gene links: distance, Hi-C contacts, correlation across samples or cells</td><td>Promoter accessibility correlates positively, promoter CpG-island methylation negatively, with expression</td></tr>
<tr><td>Transcriptome → proteome</td><td>mRNA is template for protein; translation and decay modulate the result</td><td>Gene ↔ protein ID mapping (Ensembl, UniProt); isoform ↔ proteoform</td><td>Moderate positive correlation; time-lagged; buffered for complex subunits</td></tr>
<tr><td>Proteome → metabolome</td><td>Enzymes convert substrates; transporters move them</td><td>Reaction networks (KEGG, Reactome, Recon3D/Human-GEM): enzyme ↔ substrate/product</td><td>Weak and often non-monotonic; flux depends on substrate, cofactors and allostery, not only enzyme level</td></tr>
<tr><td>Metabolome → epigenome, proteome</td><td>Metabolites as cofactors (SAM, acetyl-CoA, α-KG, NAD<sup>+</sup>) and allosteric regulators</td><td>Prior knowledge of cofactor-dependent enzymes</td><td>Feedback loops; hard to see without perturbation or time series</td></tr>
</table>
<h2>Why layers disagree</h2>
<p>A frequent surprise is that layers measured on the same samples correlate less than expected. That disagreement is usually biology, not a failed experiment:</p>
<ul>
<li><strong>Different timescales.</strong> Metabolites turn over in seconds, mRNAs in minutes to hours, proteins in hours to weeks. After a stimulus, mRNA peaks and falls before protein rises. Snapshot data at one time point capture different phases.</li>
<li><strong>Post-transcriptional regulation.</strong> Translation efficiency, microRNAs, RNA-binding proteins and protein degradation (ubiquitin–proteasome, autophagy) all intervene between mRNA and protein.</li>
<li><strong>Buffering and dosage compensation.</strong> Subunits of complexes are degraded when produced in excess, so an extra chromosome copy (aneuploidy) raises mRNA more than protein for complex members.</li>
<li><strong>Enzyme kinetics.</strong> Flux depends on substrate concentration relative to K<sub>m</sub>, on allosteric control and on cofactors. A doubled enzyme often does not double flux.</li>
<li><strong>Compartments and cell types.</strong> Bulk tissue mixes cells; a metabolite may come from a different cell type, or from microbes, than the enzyme you measured.</li>
<li><strong>Technical noise and detection limits.</strong> Each platform measures a different subset with different dynamic range and missingness.</li>
</ul>
<blockquote><p><strong>Evidence:</strong> Reviews of mRNA–protein relationships conclude that mRNA levels explain a substantial but incomplete part of protein variation across genes, and much less across samples for the same gene, with translation rates and protein turnover accounting for much of the rest (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=On+the+dependency+of+cellular+protein+levels+on+mRNA+abundance">Liu, Beyer &amp; Aebersold 2016, Cell</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/?term=mRNAs%2C+proteins+and+the+emerging+principles+of+gene+expression+control">Buccitelli &amp; Selbach 2020, Nature Reviews Genetics</a>). In tumour cohorts (CPTAC), mRNA–protein correlation per gene across samples has a median around 0.4–0.5, lowest for stable housekeeping and complex proteins.</p></blockquote>
<h2>The QTL framework: genetics as the anchor</h2>
<p>Genotype is fixed at conception and is not changed by disease, so associations from genotype to a molecular trait have a known causal direction. This makes <strong>molecular QTL mapping</strong> the backbone of most multi-omics interpretation:</p>
<p>[figure: relations-diagram-1 | Fig. 14.1 · Molecular QTLs connect one variant to each layer. If the same causal variant drives a molecular QTL and a GWAS signal, that molecule is a candidate mediator of the trait.]</p>
<ul>
<li><strong>Mapping</strong>: linear regression of normalised molecular phenotype on genotype dosage with covariates (genotype PCs, hidden factors from PEER or PCA). Tools: tensorQTL (GPU), QTLtools, FastQTL, MatrixEQTL; single-cell: pseudobulk per cell type or SAIGE-QTL, jaxQTL.</li>
<li><strong>Resources</strong>: GTEx (49 tissues, eQTL and sQTL), eQTLGen (blood eQTLs, ~31,000 samples), the eQTL Catalogue (uniformly processed studies), OneK1K (single-cell blood eQTLs), UK Biobank PPP and deCODE (pQTLs), and the GoDMC (methylation QTLs).</li>
</ul>
<p>[figure: qtl | Fig. · How an expression QTL looks. Simulated data for 330 individuals.]</p>
<h2>From association to causation</h2>
<p>[cards]</p><ul><li><p><strong>Colocalisation</strong></p><p>Do the GWAS and QTL signals share one causal variant, or are they two distinct variants in LD? <strong>coloc</strong> (Bayesian; posterior H4 for shared variant), coloc-SuSiE for multiple signals, eCAVIAR, HyPrColoc for many traits at once.</p></li><li><p><strong>TWAS / PWAS</strong></p><p>Predict gene expression (or protein) from genotype in a reference panel, then associate predicted expression with the trait in GWAS summary statistics (PrediXcan/S-PrediXcan, FUSION, UTMOST). Fast, but hits can reflect LD and co-regulation, not causal genes.</p></li><li><p><strong>Mendelian randomisation</strong></p><p>Use variants as instruments for an exposure (e.g. a cis-pQTL for a protein) to estimate its causal effect on an outcome. Assumes relevance, independence and no horizontal pleiotropy. Tools: TwoSampleMR, MendelianRandomization, MR-PRESSO, SMR with HEIDI test. Cis-pQTL MR is now used to prioritise drug targets.</p></li></ul>
<blockquote><p><strong>Example: PCSK9 across the layers:</strong> Rare loss-of-function variants in <i>PCSK9</i> lower LDL cholesterol and coronary disease risk (genome → phenome). PCSK9 protein binds the LDL receptor and targets it for degradation (proteome), so less PCSK9 means more receptors and lower plasma LDL (metabolome/lipidome). The genetics predicted that inhibiting PCSK9 would be safe and effective, and antibody (evolocumab, alirocumab) and siRNA (inclisiran) drugs followed. Drug programmes with human genetic support are roughly two to three times more likely to reach approval (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=Refining+the+impact+of+genetic+evidence+on+clinical+success">Minikel et al. 2024, Nature</a>).</p></blockquote>
<h2>Linking features between layers in practice</h2>
<table>
<tr><th>From → to</th><th>Key</th><th>Resources</th><th>Watch out for</th></tr>
<tr><td>Variant → gene</td><td>Coordinates + regulatory links</td><td>VEP, Open Targets Locus-to-Gene (L2G), ABC/rE2G predictions, cS2G</td><td>Nearest gene is often wrong for non-coding variants</td></tr>
<tr><td>Peak → gene</td><td>Distance, contacts, correlation</td><td>GREAT, ChIPseeker, ArchR/Signac peak-to-gene links</td><td>One peak can regulate several genes and vice versa</td></tr>
<tr><td>CpG → gene</td><td>Probe annotation</td><td>Illumina manifests, IlluminaHumanMethylationEPICv2anno</td><td>Gene-body vs promoter methylation have opposite associations</td></tr>
<tr><td>Gene → transcript → protein</td><td>Ensembl gene/transcript/protein IDs, UniProt accession</td><td>biomaRt, org.Hs.eg.db, UniProt ID mapping, MyGene.info</td><td>Many-to-many mappings; protein groups contain several genes</td></tr>
<tr><td>Protein → metabolite</td><td>EC numbers, reaction IDs</td><td>KEGG, Reactome, Rhea, Recon3D, Human-GEM, MetaNetX</td><td>Promiscuous enzymes; metabolites in many reactions (ATP, NADH)</td></tr>
<tr><td>Metabolite IDs</td><td>InChIKey, HMDB, ChEBI, KEGG, PubChem CID</td><td>RefMet, MetaboAnalyst ID converter, BridgeDb</td><td>Isomers and lipid annotation levels map ambiguously</td></tr>
<tr><td>Taxon → function → metabolite</td><td>Gene families (UniRef90, KEGG KO)</td><td>HUMAnN, AGORA2, gutMGene, MiMeNet</td><td>Genetic potential is not activity</td></tr>
</table>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Many GWAS loci do not colocalise with any known eQTL ("missing regulation"); context-specific, single-cell and developmental QTLs may close the gap (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=Systematic+differences+in+discovery+of+genetic+effects+on+gene+expression+and+complex+traits">Mostafavi et al. 2023, Nature Genetics</a>).</li><li>Time-resolved multi-omics that captures lags between layers.</li><li>Causal models across more than two layers (variant → methylation → expression → protein → trait) with proper uncertainty.</li><li>Protein-to-metabolite links that account for flux, not just enzyme abundance.</li></ul></blockquote>
