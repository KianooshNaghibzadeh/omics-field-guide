---
title: Proteomics
heading: Proteomics
part: II · The omics layers
order: 110
color: prot
label: Protein layer
slug: proteomics
id: proteomics
description: Proteins do most of the work in a cell and are the targets of most drugs. Proteomics identifies and quantifies them, their modifications and their interactions. There is no protein equivalent of PCR, so the field relies on mass spectrometry and affinity reagents, each with its own statistics.
---
<h2>Research questions</h2>
<ul>
<li>Which proteins and proteoforms differ between conditions, and do they follow mRNA changes?</li>
<li>Which signalling pathways are active (phosphoproteomics) and which kinases drive them?</li>
<li>Which plasma proteins are biomarkers or drug targets, and which are causal (pQTL + Mendelian randomisation)?</li>
<li>Which proteins form complexes, where are they located, and how do structures explain variant effects?</li>
<li>Which drug binds which protein (chemoproteomics, thermal proteome profiling)?</li>
</ul>
<h2>How proteomic data are generated</h2>
<p>[steps]</p><ol><li><strong>Sample</strong> Cells, tissue, plasma or serum (EDTA plasma preferred); avoid haemolysis and keratin contamination</li><li><strong>Lysis &amp; quantify</strong> Detergent or urea buffers; protein amount by BCA assay</li><li><strong>Reduce &amp; alkylate</strong> Break disulfide bonds (DTT/TCEP) and cap cysteines (iodoacetamide)</li><li><strong>Digest</strong> Trypsin overnight (or S-Trap/SP3 workflows); optional TMT labelling or PTM enrichment</li><li><strong>Clean up</strong> Desalt peptides (C18); measure peptide amount</li><li><strong>LC-MS/MS</strong> Nano- or micro-flow LC into an Orbitrap or timsTOF; DDA or DIA acquisition, 30–120 min per sample</li></ol>
<p>Affinity platforms differ: Olink incubates plasma with pairs of DNA-tagged antibodies (a signal only forms when both bind the same protein), and SomaScan uses modified aptamers. Both convert protein amounts into nucleic-acid or fluorescence readouts and need only microlitres of plasma.</p>
<h2>How bottom-up mass spectrometry works</h2>
<ol>
<li><strong>Sample preparation</strong>: lyse, reduce and alkylate cysteines, digest with trypsin (cuts after K/R) into peptides of ~7–30 residues. Optional enrichment for PTMs (phospho: TiO<sub>2</sub>, Fe-IMAC; ubiquitin: K-ε-GG antibody) or depletion of abundant plasma proteins.</li>
<li><strong>Liquid chromatography</strong> separates peptides by hydrophobicity over 10–120 minutes; they are ionised by electrospray.</li>
<li><strong>MS1</strong> measures mass-to-charge (m/z) of intact peptide ions; <strong>MS2</strong> fragments selected ions (CID/HCD, ETD) and measures fragment masses (b- and y-ions), which encode the sequence.</li>
<li><strong>Acquisition</strong>: <em>DDA</em> (data-dependent; picks the top-N most intense ions, giving stochastic missing values), <em>DIA</em> (data-independent; fragments all ions in m/z windows, more complete and reproducible, more complex spectra), <em>targeted</em> (SRM/PRM; predefined peptides, best for validation).</li>
<li><strong>Identification</strong>: match spectra against theoretical spectra from a protein database (MSFragger, Comet, Andromeda, Sage, Mascot) or spectral libraries (often predicted by deep learning: Prosit, AlphaPeptDeep, MS²PIP). Control FDR with target–decoy competition at peptide-spectrum match, peptide and protein levels (typically 1%); rescoring with Percolator or MS²Rescore.</li>
<li><strong>Protein inference</strong>: peptides shared between proteins create ambiguity, resolved into protein groups by parsimony.</li>
<li><strong>Quantification</strong>: label-free (MS1 intensity, MaxLFQ), isobaric tags (TMT/TMTpro: up to 18 samples multiplexed, measured at reporter ions; ratio compression from co-isolation), SILAC (metabolic labelling), or DIA fragment intensities.</li>
</ol>
<p>[cards]</p><ul><li><p><strong>Top-down proteomics</strong></p><p>Measures intact proteins, so proteoforms with combinations of PTMs are preserved. Harder and lower throughput (ProSight, TopPIC).</p></li><li><p><strong>Affinity proteomics</strong></p><p>Olink (proximity extension assay; DNA-barcoded antibody pairs read by sequencing; ~5,400 proteins in Explore HT) and SomaScan (modified aptamers; ~11,000 assays). Scalable to biobanks (UK Biobank Pharma Proteomics Project). Platforms agree only moderately for many proteins, and epitope effects can create artefactual pQTLs.</p></li><li><p><strong>Single-cell and spatial</strong></p><p>SCoPE2, plexDIA and Astral-based single-cell proteomics quantify ~1,000–5,000 proteins per cell. Deep Visual Proteomics combines imaging, laser microdissection and MS. CODEX/PhenoCycler and IMC image ~40–100 proteins in tissue.</p></li></ul>
<p>[figure: msms | Fig. · From protein to peptide identification. Fragment masses are computed from real monoisotopic residue masses for LVNEVTEFAK; peak heights and background peaks are simulated. A search engine scores how well the observed fragments match each candidate peptide.]</p>
<h2>Statistical analysis</h2>
<p>MS proteomics data have features that RNA-seq tools do not handle:</p>
<ul>
<li><strong>Missing values</strong> that are not random: low-abundance peptides are missing because they fell below detection (MNAR), while others are missing by chance (MCAR). Imputation choice changes results (minimum-value, left-censored QRILC or MinProb for MNAR; kNN or random forest for MCAR). Models that handle missingness directly (MSstats, proDA, limpa) are preferable to blind imputation.</li>
<li><strong>Log-normal intensities</strong>: analyse log<sub>2</sub> intensities with linear models (limma, MSstats, MSstatsTMT, DEqMS which accounts for the number of peptides per protein).</li>
<li><strong>Normalisation</strong>: median centring, variance-stabilising normalisation (vsn), TMT reference channels (IRS) for multi-batch designs.</li>
<li><strong>PTM site localisation</strong> probabilities (ptmRS, PTMProphet), and normalising PTM changes to protein abundance.</li>
<li><strong>Kinase activity inference</strong> from phosphosites: KSEA, PTM-SEA, the Kinase Library (Johnson et al. 2023).</li>
</ul>
<h2>Structure and interactions</h2>
<p><strong>AlphaFold2</strong> (2021) predicts single-chain structures with near-experimental accuracy for many proteins; the AlphaFold Protein Structure Database holds over 200 million predictions. <strong>AlphaFold3</strong> (2024) and open alternatives (Boltz-1/2, Chai-1, RoseTTAFold All-Atom) predict complexes with nucleic acids, ligands and modifications. <strong>ESMFold</strong> predicts structure from a protein language model without multiple-sequence alignments. pLDDT and PAE confidence scores must be read before trusting a model: low pLDDT often marks intrinsically disordered regions. Interaction resources include STRING (integrated scores), BioGRID and IntAct (curated), BioPlex and HuRI (systematic AP-MS and Y2H maps), and CORUM (complexes).</p>
<h2>Tools</h2>
<p>[tools: proteomics]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: proteomics]</p>
<blockquote><p><strong>Pitfall:</strong> Protein FDR is not peptide FDR. With large datasets, a 1% peptide-level FDR can produce a much higher protein-level FDR if not controlled separately. Report which levels were controlled. Also beware of "match between runs", which improves completeness in DDA but can transfer wrong identifications if not FDR-controlled.</p></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Proteoform-resolved quantification: linking specific splice isoforms and PTM combinations to function.</li><li>Principled missing-value modelling and uncertainty propagation from spectra to proteins.</li><li>Single-cell proteomics statistics and integration with scRNA-seq.</li><li>Cross-platform harmonisation of Olink, SomaScan and MS, and resolving epitope-driven artefacts in pQTLs.</li><li>Predicting dynamics and conformational ensembles, not single static structures; variant effects on complexes.</li></ul></blockquote>
