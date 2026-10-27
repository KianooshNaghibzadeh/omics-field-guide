---
title: Single-cell & spatial
heading: Single-cell and spatial omics
part: II · The omics layers
order: 100
color: rna
label: RNA layer · resolution
slug: single-cell-spatial-omics
id: singlecell
description: Bulk profiles average thousands of cells. Single-cell methods measure each cell separately, revealing cell types, rare populations, continuous trajectories and cell-to-cell communication. Spatial methods add where each cell sits in the tissue.
---
<h2>Research questions</h2>
<ul>
<li>What cell types and states exist in a tissue, and which are new?</li>
<li>How do cell composition and cell-type-specific expression change in disease?</li>
<li>What are the developmental or differentiation trajectories, and what drives fate decisions?</li>
<li>Which cells communicate, through which ligand–receptor pairs, and in which tissue niches?</li>
<li>Which regulatory programmes (TFs, enhancers) define each state?</li>
<li>How does a genetic variant or perturbation act in specific cell types (single-cell eQTLs, Perturb-seq)?</li>
</ul>
<h2>Technologies</h2>
<table>
<tr><th>Approach</th><th>Examples</th><th>Throughput</th><th>Trade-off</th></tr>
<tr><td>Droplet, 3′ or 5′ tag</td><td>10x Chromium (Flex, 3′, 5′), Drop-seq, inDrops</td><td>10<sup>3</sup>–10<sup>5</sup> cells per run</td><td>Cheap per cell; sparse (~1–5k genes detected); no full-length isoforms</td></tr>
<tr><td>Combinatorial indexing</td><td>Parse Evercode, Scale Bio, sci-RNA-seq3</td><td>10<sup>5</sup>–10<sup>6</sup>+ cells</td><td>Fixed cells, many samples multiplexed; lower per-cell sensitivity</td></tr>
<tr><td>Plate-based full-length</td><td>Smart-seq2, Smart-seq3, FLASH-seq</td><td>10<sup>2</sup>–10<sup>3</sup> cells</td><td>High sensitivity and isoform information; expensive per cell</td></tr>
<tr><td>Single-nucleus</td><td>snRNA-seq on frozen tissue</td><td>as droplet</td><td>Works on archived and hard-to-dissociate tissue (brain, muscle); more intronic reads, fewer transcripts</td></tr>
<tr><td>Multi-modal</td><td>CITE-seq (RNA + surface proteins), 10x Multiome (RNA + ATAC), TEA-seq, scNMT-seq, Perturb-seq, VDJ</td><td>varies</td><td>Two or more layers from the same cell: the strongest data for integration</td></tr>
<tr><td>Sequencing-based spatial</td><td>Visium (55 µm spots), Visium HD (2 µm bins), Slide-seqV2, Stereo-seq</td><td>whole transcriptome</td><td>Unbiased gene coverage; spots may mix several cells; need deconvolution or segmentation</td></tr>
<tr><td>Imaging-based spatial</td><td>Xenium, MERFISH/MERSCOPE, CosMx, seqFISH+, CODEX/PhenoCycler (protein), IMC</td><td>10<sup>2</sup>–10<sup>3</sup>+ genes, subcellular</td><td>Single-cell or subcellular resolution; targeted gene panels; segmentation errors matter</td></tr>
</table>
<h2>How single-cell and spatial data are generated</h2>
<p>[steps]</p><ol><li><strong>Tissue to cells</strong> Enzymatic + mechanical dissociation, or nuclei isolation from frozen tissue; keep cold and fast to limit stress genes</li><li><strong>Cell QC</strong> Count and viability (&gt;80–90%); remove debris and dead cells; optional sorting or hashtag multiplexing</li><li><strong>Partition</strong> Microfluidics pairs each cell with one barcoded gel bead in an oil droplet (or barcodes are added in rounds of split-pool)</li><li><strong>Barcode in droplet</strong> Cell lyses; mRNA poly(A) tails bind bead oligos; reverse transcription writes cell barcode + UMI into each cDNA</li><li><strong>Pool &amp; amplify</strong> Break the emulsion, amplify cDNA, build gene-expression (and VDJ, protein, ATAC) libraries</li><li><strong>Sequence</strong> ~20,000–50,000 reads per cell; Read 1 = barcode + UMI, Read 2 = transcript</li></ol>
<p>[figure: scread | Fig. · What one droplet-based single-cell read encodes (10x Genomics 3′ chemistry). The barcode and UMI are the reason single-cell data can be counted molecule by molecule.]</p>
<p>Spatial methods skip dissociation. In <strong>spot-based</strong> methods (Visium, Stereo-seq), a tissue section is placed on a slide printed with barcoded capture probes whose positions are known; RNA diffuses onto the probes, so each barcode doubles as a coordinate. In <strong>imaging-based</strong> methods (Xenium, MERFISH, CosMx), gene-specific probes are hybridised in the intact section and decoded by repeated rounds of fluorescence imaging, giving the position of each transcript.</p>
<h2>The scRNA-seq workflow</h2>
<ol>
<li><strong>Pre-processing</strong>: demultiplex cell barcodes and UMIs, align and count (Cell Ranger, STARsolo, alevin-fry, kallisto|bustools). Output: a sparse cells × genes count matrix (h5ad, h5, mtx).</li>
<li><strong>Cell QC</strong>: total UMIs, genes detected, mitochondrial fraction (dying cells), ribosomal fraction. Prefer data-driven thresholds (median absolute deviations) per sample over fixed cut-offs. Remove <strong>ambient RNA</strong> (SoupX, CellBender, DecontX) and <strong>doublets</strong> (scDblFinder, DoubletFinder, scrublet). Sample multiplexing by genotype (demuxlet, souporcell, vireo) or hashtags (HTO) also identifies doublets.</li>
<li><strong>Normalisation</strong>: size-factor scaling with log1p (shifted logarithm), scran pooling, sctransform or analytic Pearson residuals.</li>
<li><strong>Feature selection</strong>: 2,000–5,000 highly variable genes; deviance-based selection is an alternative.</li>
<li><strong>Dimensionality reduction</strong>: PCA (or a VAE latent space such as scVI), then a k-nearest-neighbour graph. UMAP and t-SNE are for visualisation only; distances and cluster sizes in them are not meaningful.</li>
<li><strong>Integration / batch correction</strong> across samples: Harmony, scVI/scANVI, Seurat CCA/RPCA, Scanorama, BBKNN, fastMNN, LIGER. Over-correction can erase real biology (e.g. disease-specific states).</li>
<li><strong>Clustering</strong>: Leiden or Louvain community detection on the kNN graph; check robustness across resolutions.</li>
<li><strong>Annotation</strong>: marker genes plus automated label transfer (CellTypist, SingleR, Azimuth, scANVI, scArches) to reference atlases (Human Cell Atlas, Tabula Sapiens, CELLxGENE Census).</li>
<li><strong>Downstream</strong>: compositional analysis (scCODA, propeller, milo for neighbourhoods), differential expression <em>by pseudobulk</em> per sample and cell type, trajectories, velocity, communication, gene-regulatory networks.</li>
</ol>
<blockquote><p><strong>The unit of replication is the donor, not the cell:</strong> Ten thousand cells from two patients are two biological replicates. Single-cell DE tests that treat cells as independent produce floods of false positives. Aggregate counts per sample and cell type (pseudobulk) and use DESeq2, edgeR or limma, or use mixed models with a donor random effect. This is the most important statistical lesson of the field.</p></blockquote>
<p>[figure: umap | Fig. · A UMAP of blood immune cells (PBMCs), the most common single-cell figure. Simulated data shaped like a typical PBMC dataset.]</p>
<h2>Trajectories, velocity and fate</h2>
<p><strong>Pseudotime</strong> orders cells along a continuous process (Monocle 3, Slingshot, PAGA, Palantir, diffusion pseudotime). <strong>RNA velocity</strong> uses the ratio of unspliced to spliced reads to estimate the direction of change (velocyto, scVelo, with newer models such as veloVI, UniTVelo and dynamo); its assumptions (constant rates, steady-state kinetics) often fail, so treat velocity arrows as hypotheses. <strong>CellRank</strong> combines velocity, pseudotime or real time points into fate probabilities. <strong>Lineage tracing</strong> with heritable barcodes (CRISPR scars, LARRY, mitochondrial variants) provides ground truth that computational trajectories cannot.</p>
<h2>Communication and regulation</h2>
<p>Ligand–receptor inference (CellPhoneDB, CellChat, NicheNet, LIANA+) scores co-expression of ligand in sender cells and receptor in receiver cells using curated databases. These are hypotheses: mRNA co-expression does not prove protein signalling, and results depend heavily on the resource used. Gene-regulatory network inference (SCENIC/pySCENIC: GRNBoost2 co-expression + cis-regulatory motif pruning; CellOracle; SCENIC+ with multiome data) identifies regulons and TF activity.</p>
<p>[figure: spatial | Fig. · Spot-level spatial transcriptomics coloured by spatial domain. Simulated tissue section.]</p>
<h2>Spatial analysis</h2>
<ul>
<li><strong>Segmentation</strong> of imaging data into cells: Cellpose, Baysor, proseg, StarDist; errors here propagate into every downstream result.</li>
<li><strong>Deconvolution</strong> of multi-cell spots using single-cell references: cell2location, RCTD (spacexr), CARD, Tangram, DestVI, SPOTlight.</li>
<li><strong>Spatially variable genes</strong>: SpatialDE, SPARK-X, nnSVG, Moran's I in Squidpy.</li>
<li><strong>Spatial domains / niches</strong>: BayesSpace, SpaGCN, GraphST, STAGATE, BANKSY, CellCharter.</li>
<li><strong>Neighbourhood and interaction</strong>: co-occurrence and neighbourhood enrichment (Squidpy), spatially constrained ligand–receptor scoring (COMMOT, LIANA+), niche-aware DE.</li>
<li><strong>Frameworks</strong>: Squidpy and SpatialData (Python, scverse), Giotto Suite, Seurat v5, Voyager, SpatialExperiment (Bioconductor).</li>
</ul>
<h2>Foundation models</h2>
<p>Transformer models pre-trained on tens of millions of cells (Geneformer, scGPT, scFoundation, UCE, Nicheformer, and others) promise general-purpose embeddings for annotation, batch integration and perturbation prediction. Independent evaluations have been sobering: in zero-shot settings their embeddings often do not beat highly variable genes with PCA, scVI or Harmony, and for predicting perturbation effects deep models have not clearly outperformed simple linear or mean baselines. Fine-tuning helps for some tasks. Evaluate any claim against simple baselines on held-out data that the model did not see during pre-training.</p>
<h2>Tools</h2>
<p>[tools: singlecell]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: singlecell]</p>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Benchmarks and ground truth for spatial domain detection, cell segmentation and spatial communication.</li><li>Statistical frameworks for comparing conditions across many donors in spatial data (multi-sample spatial DE).</li><li>Honest evaluation and useful applications of single-cell foundation models; perturbation response prediction for unseen perturbations and cell types.</li><li>Integrating many modalities measured on different cells (mosaic integration) without erasing biology.</li><li>Defining "cell state" versus "cell type" in a reproducible, ontology-backed way.</li></ul></blockquote>
