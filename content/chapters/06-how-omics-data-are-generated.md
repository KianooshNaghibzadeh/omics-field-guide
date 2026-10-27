---
title: How omics data are generated
heading: How omics data are generated
part: II · The omics layers
order: 60
color: int
label: From sample to file
slug: how-omics-data-are-generated
id: generation
description: 'Every file you analyse is the end of a physical process: a sample was collected, molecules were extracted, converted into something an instrument can read, and measured. Knowing that process tells you where the artefacts in your data come from and which parameters in your pipeline exist to correct them.'
---
<h2>The common path</h2>
<p>[steps]</p><ol><li><strong>Study design</strong> Question, groups, replicates, randomisation, metadata sheet</li><li><strong>Sample collection</strong> Blood, tissue, cells, stool, swab; time to freezing; preservative (EDTA, PAXgene, RNAlater, FFPE)</li><li><strong>Extraction</strong> Isolate DNA, RNA, protein or metabolites; measure quantity and integrity (Qubit, RIN/DV200, BCA)</li><li><strong>Conversion</strong> Library preparation for sequencing, digestion for proteomics, derivatisation for GC-MS</li><li><strong>Measurement</strong> Sequencer, mass spectrometer, array scanner, NMR, microscope</li><li><strong>Raw data</strong> FASTQ / POD5 / BAM, RAW / mzML, IDAT, FID, images</li><li><strong>QC &amp; deposit</strong> Run metrics, sample QC, upload to GEO/SRA/PRIDE/MetaboLights</li></ol>
<blockquote><p><strong>Pre-analytical variation:</strong> Many apparent biological signals come from handling. RNA degrades within minutes at room temperature; hypoxia during surgery changes gene expression; metabolites keep changing in unfrozen blood; formalin fixation damages DNA (C&gt;T artefacts) and fragments RNA. Record collection time, processing delay, freeze–thaw cycles and storage duration for every sample, and keep them balanced across groups.</p></blockquote>
<h2>Sequencing libraries</h2>
<p>A sequencing <strong>library</strong> is a collection of DNA fragments, each flanked by known adapter sequences that let the sequencer capture, amplify and read them. Whatever the starting molecule (genomic DNA, cDNA from RNA, bisulfite-converted DNA, immunoprecipitated chromatin, Tn5-tagged fragments), the result has the same structure:</p>
<p>[figure: library | Fig. · Structure of an Illumina library fragment. Index (barcode) sequences identify the sample, so dozens to thousands of samples can be pooled on one run and separated afterwards (demultiplexing).]</p>
<ul>
<li><strong>Fragmentation</strong>: sonication, enzymatic shearing or transposase (tagmentation) produces fragments of ~200–600 bp for short reads. Long-read libraries keep fragments of 10–100 kb or longer.</li>
<li><strong>End repair, A-tailing and adapter ligation</strong> attach adapters; tagmentation (Nextera) fragments and adds adapters in one step.</li>
<li><strong>PCR amplification</strong> adds index sequences and enriches adapter-ligated fragments. PCR creates duplicates and GC bias; PCR-free WGS avoids this when input DNA allows.</li>
<li><strong>Unique molecular identifiers (UMIs)</strong>: random barcodes attached before amplification, so reads from the same original molecule can be collapsed. Essential for single-cell counting and ultra-low-frequency variant detection.</li>
<li><strong>Target enrichment</strong> (exomes, panels): hybridisation capture with biotinylated probes or amplicon PCR. Coverage then depends on probe efficiency, which is why exome depth is uneven.</li>
<li><strong>Library QC</strong>: fragment size (Bioanalyzer/TapeStation), concentration (qPCR) and adapter-dimer contamination.</li>
</ul>
<h2>Short-read sequencing by synthesis (Illumina)</h2>
<p>Library fragments bind to a flow cell and are copied in place into clusters of ~1,000 identical molecules (bridge amplification or exclusion amplification on patterned flow cells). Then sequencing proceeds in cycles. In each cycle a polymerase adds one fluorescently labelled, reversibly terminated nucleotide to every cluster; a camera images the flow cell; the dye and terminator are cleaved; the next cycle begins. The colour of each cluster in each cycle is the base.</p>
<p>[figure: sbs | Fig. · Sequencing by synthesis, simplified. Each column is one cycle; each row is one cluster. Reading a row left to right gives that cluster's sequence. Newer two-colour chemistries (NextSeq, NovaSeq) encode four bases with two dyes: G is 'dark', which is why poly-G tails appear when signal is lost.]</p>
<p>Errors grow along the read because clusters lose synchrony (phasing): some molecules fall a base behind or jump ahead, blurring the signal. That is why base quality drops toward the 3′ end of reads. The instrument converts intensities into base calls and Phred quality scores, stored in <strong>FASTQ</strong> files:</p>
<p>[figure: fastq | Fig. · Anatomy of one FASTQ record. Each quality character encodes a Phred score as ASCII code minus 33. Q30 means a 1-in-1,000 chance that the base call is wrong; Q20 means 1 in 100.]</p>
<h2>Long-read sequencing</h2>
<p>[cards]</p><ul><li><p><strong>PacBio HiFi (SMRT)</strong></p><p>A single polymerase copies a circularised DNA molecule (SMRTbell) inside a tiny well (zero-mode waveguide) while fluorescent nucleotides are detected in real time. Because the molecule is circular, the polymerase reads it many times; a consensus of these passes gives 15–25 kb reads at ~99.9% accuracy. Polymerase kinetics (pauses) reveal methylation.</p></li><li><p><strong>Oxford Nanopore</strong></p><p>A motor protein ratchets a single DNA or RNA strand through a protein pore in a membrane. Ionic current through the pore depends on the ~5–9 bases inside it at each moment. A neural-network basecaller translates the current trace (the "squiggle") into bases, and modified bases (5mC, 6mA, m6A) change the current, so they are detected directly. Read length is limited only by the molecule.</p></li></ul>
<p>[figure: nanopore | Fig. · Nanopore signal, simplified. Each plateau corresponds to a k-mer occupying the pore; the basecaller decodes the sequence of plateaus. A methylated cytosine shifts the current level slightly (dashed), which is how modification calling works. Simulated signal.]</p>
<h2>Arrays</h2>
<p>Microarrays measure many known targets at once by hybridising labelled sample to millions of immobilised probes. <strong>SNP genotyping arrays</strong> (e.g. Illumina Global Screening Array, UK Biobank Axiom) read the two alleles of ~0.6–2 million variants from two colour channels; the ratio gives the genotype (plotted as genotype clusters) and the B-allele frequency also reveals copy number. <strong>Methylation arrays</strong> (EPIC) read bisulfite-converted DNA at ~935k CpGs. Expression arrays are now largely replaced by RNA-seq, but decades of array data remain in GEO.</p>
<h2>Mass spectrometry</h2>
<p>Proteomics, metabolomics and lipidomics are mostly measured by mass spectrometry (MS). Molecules are separated by liquid or gas chromatography, <strong>ionised</strong> (electrospray for LC, electron ionisation for GC, MALDI for imaging), then the <strong>mass analyser</strong> separates ions by mass-to-charge ratio (m/z):</p>
<table>
<tr><th>Analyser</th><th>Principle</th><th>Resolution</th><th>Typical use</th></tr>
<tr><td>Quadrupole (Q, QqQ)</td><td>Oscillating electric fields let only one m/z pass at a time</td><td>Low</td><td>Targeted quantification (MRM), filtering</td></tr>
<tr><td>Time-of-flight (TOF)</td><td>Lighter ions fly faster down a flight tube</td><td>High, fast</td><td>Untargeted metabolomics, timsTOF proteomics with ion mobility</td></tr>
<tr><td>Orbitrap</td><td>Ions orbit an electrode; frequency of oscillation gives m/z via Fourier transform</td><td>Very high</td><td>Proteomics (Exploris, Astral), metabolomics</td></tr>
<tr><td>FT-ICR</td><td>Cyclotron frequency in a strong magnet</td><td>Highest</td><td>Complex mixtures, top-down</td></tr>
<tr><td>Ion mobility (IMS)</td><td>Separates ions by shape and size in a gas</td><td>Extra dimension</td><td>Isomer separation, collision cross section</td></tr>
</table>
<p>In tandem MS (MS/MS), a selected ion is fragmented by collision with gas and the fragments are measured. Fragment patterns identify peptide sequences and small-molecule structures. Raw files are vendor-specific (.raw, .d, .wiff) and are converted to open mzML for most open-source tools.</p>
<p>[figure: lcms | Fig. · LC-MS data are three-dimensional: retention time × m/z × intensity. A compound appears as a chromatographic peak (left); its spectrum at the apex (right) shows the protonated ion, its ¹³C isotope peaks and a sodium adduct. Simulated data for a molecule of monoisotopic mass 180.063 Da (glucose).]</p>
<h2>NMR, imaging and other readouts</h2>
<ul>
<li><strong>NMR spectroscopy</strong> measures how atomic nuclei (¹H, ¹³C) in a magnetic field absorb radio-frequency energy; chemical shifts identify functional groups. Quantitative and reproducible, used in large cohort metabolomics.</li>
<li><strong>Imaging-based spatial omics</strong> (MERFISH, Xenium, CosMx) hybridise fluorescent probes in repeated rounds; each transcript's colour sequence across rounds forms a barcode decoded to a gene. Protein imaging (CODEX, IMC) uses barcoded or metal-tagged antibodies.</li>
<li><strong>Flow and mass cytometry</strong> (CyTOF) measure ~20–50 proteins per cell in millions of cells.</li>
<li><strong>Affinity proteomics</strong> (Olink, SomaScan) converts protein binding into DNA barcodes or aptamer signals read by sequencing or arrays.</li>
</ul>
<h2>Quality metrics at the source</h2>
<table>
<tr><th>Data type</th><th>Metric</th><th>What good looks like</th></tr>
<tr><td>Any sequencing</td><td>% bases ≥ Q30; adapter content; duplication</td><td>&gt;80–90% Q30 on modern Illumina; low adapter dimers</td></tr>
<tr><td>WGS</td><td>Mean depth, % genome ≥ 20×, insert size, contamination (VerifyBamID)</td><td>~30× germline; contamination &lt;2%</td></tr>
<tr><td>RNA-seq</td><td>RIN/DV200, % rRNA, % uniquely mapped, 3′ bias</td><td>RIN ≥ 7 for poly(A); &gt;70–80% unique mapping</td></tr>
<tr><td>scRNA-seq</td><td>Cells recovered, median genes/cell, % reads in cells, % mitochondrial</td><td>Knee plot with clear separation of cells from empty droplets</td></tr>
<tr><td>ATAC-seq</td><td>TSS enrichment, fragment-size periodicity, FRiP</td><td>TSS enrichment &gt; ~6–7 (ENCODE); visible nucleosome ladder</td></tr>
<tr><td>Proteomics</td><td>IDs per run, missed cleavages, mass error, RT stability</td><td>Stable IDs in QC standard (e.g. HeLa digest) across runs</td></tr>
<tr><td>Metabolomics</td><td>Pooled-QC CV, internal standard RT/intensity drift, blanks</td><td>CV &lt; 20–30% in pooled QCs</td></tr>
</table>
