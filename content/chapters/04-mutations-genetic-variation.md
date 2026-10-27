---
title: Mutations & variation
heading: Mutations and genetic variation
part: I · Foundations
order: 40
color: met
label: Foundations
slug: mutations-genetic-variation
id: mutations
description: A mutation matters because of where in the information flow it acts. The same single-base change can do nothing, break a protein, shift a splice site, disable an enhancer or change a drug's metabolism. This chapter classifies variants and traces their consequences through every layer.
---
<h2>Terms that are often confused</h2>
<ul><li><strong>Mutation:</strong> A change in DNA sequence relative to a parent cell or organism; an event.</li><li><strong>Variant:</strong> A position where an individual differs from a reference sequence. Preferred neutral term in clinical genetics.</li><li><strong>Polymorphism:</strong> A variant common in a population (conventionally minor allele frequency ≥ 1%).</li><li><strong>Allele:</strong> One version of a sequence at a locus. Humans are diploid: two alleles per autosomal locus.</li><li><strong>Genotype / haplotype:</strong> The pair of alleles at a locus / the set of alleles on one chromosome copy. Phasing assigns alleles to haplotypes.</li><li><strong>Germline / somatic:</strong> Inherited and present in every cell / acquired after conception and present only in a cell lineage (tumours, clonal haematopoiesis, mosaicism).</li><li><strong>Zygosity:</strong> Heterozygous (one copy), homozygous (two), hemizygous (one copy present, e.g. X in males), compound heterozygous (two different variants on different copies).</li></ul>
<h2>Variant classes by size</h2>
<table>
<tr><th>Class</th><th>Size</th><th>Typical detection</th><th>Notes</th></tr>
<tr><td>SNV / SNP</td><td>1 bp</td><td>Short-read WGS/WES; arrays for known SNPs</td><td>~4–5 million per genome vs reference. Transitions (A↔G, C↔T) outnumber transversions ~2:1; the Ti/Tv ratio is a standard QC metric (~2.0–2.1 genome-wide, ~3.0 in exomes).</td></tr>
<tr><td>Indel</td><td>1–49 bp</td><td>Short reads; harder in homopolymers and tandem repeats</td><td>In coding regions, indels not divisible by 3 cause frameshifts.</td></tr>
<tr><td>MNV</td><td>2+ adjacent bases</td><td>Phasing-aware callers</td><td>Annotating adjacent SNVs separately can give the wrong amino acid.</td></tr>
<tr><td>Structural variant (SV)</td><td>≥ 50 bp</td><td>Long reads best; short-read split/discordant reads and depth</td><td>Deletions, duplications, insertions, inversions, translocations. ~25,000 SVs per genome; they affect more base pairs than SNVs.</td></tr>
<tr><td>Copy-number variant (CNV)</td><td>kb–Mb</td><td>Read depth, SNP arrays (B-allele frequency), aCGH</td><td>Recurrent CNVs at 22q11.2, 16p11.2 and 1q21.1 cause neurodevelopmental disorders. Somatic arm-level CNAs are typical of cancer.</td></tr>
<tr><td>Short tandem repeat expansion</td><td>variable</td><td>ExpansionHunter, long reads</td><td>Huntington (CAG in <i>HTT</i>), fragile X (CGG in <i>FMR1</i>), C9orf72 ALS/FTD (GGGGCC).</td></tr>
<tr><td>Aneuploidy / chromothripsis</td><td>chromosome</td><td>Karyotype, depth, SNP arrays</td><td>Trisomy 21; catastrophic shattering and reassembly of chromosomes in cancer.</td></tr>
<tr><td>Mitochondrial variant</td><td>1 bp+</td><td>Deep sequencing; heteroplasmy-aware callers (Mutect2 mito mode)</td><td>Disease appears above a heteroplasmy threshold (e.g. m.3243A&gt;G in MELAS).</td></tr>
</table>
<h2>Coding consequences</h2>
<p>Using the reference <code>ATG GCC TGG AAG</code> (Met-Ala-Trp-Lys):</p>
<table>
<tr><th>Consequence</th><th>Change</th><th>Effect</th><th>Typical impact</th></tr>
<tr><td>Synonymous</td><td>GCC→GCT (Ala→Ala)</td><td>Same amino acid</td><td>Usually neutral, but can disrupt splicing enhancers, codon-optimality or mRNA structure.</td></tr>
<tr><td>Missense</td><td>GCC→ACC (Ala→Thr)</td><td>Amino-acid substitution</td><td>From harmless to severe depending on position, chemistry and conservation. The hardest class to interpret.</td></tr>
<tr><td>Nonsense (stop-gain)</td><td>TGG→TGA (Trp→Stop)</td><td>Premature stop</td><td>Usually loss of function via NMD; escapes NMD in the last exon.</td></tr>
<tr><td>Frameshift</td><td>GCC→GC- (1-bp del)</td><td>Reading frame shifts</td><td>Downstream sequence scrambled, usually followed by a premature stop.</td></tr>
<tr><td>In-frame indel</td><td>−GCC</td><td>Amino acid deleted</td><td>e.g. <i>CFTR</i> p.Phe508del, the most common cystic fibrosis variant.</td></tr>
<tr><td>Start-loss / stop-loss</td><td>ATG→ATA / TAA→CAA</td><td>No initiation / read-through into 3′UTR</td><td>Loss of protein or extended protein.</td></tr>
<tr><td>Splice region</td><td>GT→GC at +2</td><td>See <a href="#splicing">splicing</a></td><td>Exon skipping, intron retention, cryptic sites.</td></tr>
</table>
<p>Variants are written in <strong>HGVS nomenclature</strong>: <code>NM_000546.6:c.743G&gt;A</code> (cDNA position on a specific transcript) and <code>p.(Arg248Gln)</code> (protein). Always specify the transcript. MANE Select transcripts (agreed by NCBI and EBI) are now the default for clinical reporting.</p>
<p>[figure: mutfx | Fig. · The same short coding sequence with four kinds of single-nucleotide change. Highlighted: the changed base; red amino acids: changes in the protein. A one-base deletion shifts every downstream codon, which is why frameshifts are usually as damaging as stop-gains.]</p>
<h2>Non-coding consequences</h2>
<ul>
<li><strong>Promoter</strong>: <i>TERT</i> promoter mutations (C228T, C250T) create ETS-factor binding sites and reactivate telomerase in melanoma, glioblastoma and bladder cancer.</li>
<li><strong>Enhancer</strong>: a variant in the ZRS enhancer, ~1 Mb from <i>SHH</i>, causes preaxial polydactyly. The <i>FTO</i> obesity locus acts through enhancers that regulate <i>IRX3</i>/<i>IRX5</i>, not <i>FTO</i> itself.</li>
<li><strong>UTRs</strong>: variants that create upstream start codons, or that destroy microRNA sites or polyadenylation signals.</li>
<li><strong>Structural and 3D</strong>: deleting a TAD boundary lets enhancers reach the wrong gene (enhancer hijacking).</li>
<li><strong>Non-coding RNA genes</strong>: variants in <i>RNU4ATAC</i> (minor spliceosome snRNA) cause developmental disorders; a recurrent <i>RNU4-2</i> variant is a recently described common cause of neurodevelopmental disorder.</li>
</ul>
<h2>How one variant propagates through the omics layers</h2>
<table>
<tr><th>Layer</th><th>What the variant can change</th><th>Assay that detects it</th><th>QTL type</th></tr>
<tr><td>Genome</td><td>The sequence itself; copy number; structure</td><td>WGS, WES, arrays, long reads</td><td>—</td></tr>
<tr><td>Epigenome</td><td>TF binding, CpG creation or loss, accessibility, looping</td><td>ATAC-seq, ChIP-seq, bisulfite or nanopore methylation, Hi-C</td><td>caQTL, meQTL (mQTL), hQTL</td></tr>
<tr><td>Transcriptome</td><td>Expression level, splicing, polyadenylation, editing, allelic imbalance</td><td>RNA-seq, long-read RNA-seq, scRNA-seq</td><td>eQTL, sQTL, apaQTL, edQTL</td></tr>
<tr><td>Proteome</td><td>Abundance, structure, stability, PTM sites, interactions</td><td>Mass spectrometry, Olink, SomaScan, structure prediction</td><td>pQTL, ptmQTL</td></tr>
<tr><td>Metabolome</td><td>Enzyme activity, transporter function, substrate levels</td><td>LC-MS, GC-MS, NMR</td><td>mQTL (metabolite QTL)</td></tr>
<tr><td>Phenome</td><td>Disease risk, drug response, quantitative traits</td><td>Clinical data, biobanks, imaging</td><td>GWAS, PheWAS</td></tr>
</table>
<blockquote><p><strong>Worked example: lactase persistence:</strong> The variant rs4988235 (−13910 C&gt;T) sits in an intron of <i>MCM6</i>, ~14 kb upstream of <i>LCT</i>. The T allele creates an OCT1 binding site in an enhancer (epigenome), keeps <i>LCT</i> transcription active into adulthood (transcriptome), maintains lactase enzyme in the intestinal brush border (proteome), allows lactose digestion into glucose and galactose (metabolome), and produces lactose tolerance (phenome). It was strongly selected in populations with a history of dairying. One variant, six layers.</p></blockquote>
<h2>Somatic mutations and cancer</h2>
<p>A tumour is a clonal expansion carrying <strong>driver</strong> mutations, which confer a growth advantage, and many more <strong>passenger</strong> mutations, which are neutral hitchhikers. Analyses specific to somatic data include:</p>
<ul>
<li><strong>Tumour–normal paired calling</strong> to remove germline variants (Mutect2, Strelka2), with panels of normals to remove recurrent artefacts.</li>
<li><strong>Variant allele fraction (VAF)</strong> adjusted for purity and copy number to infer clonality and reconstruct phylogenies (PyClone-VI, SciClone, PhyloWGS).</li>
<li><strong>Driver discovery</strong> through recurrence beyond the background mutation rate (MutSigCV, dNdScv, OncodriveFML), which must correct for replication timing, expression and local sequence context.</li>
<li><strong>Mutational signatures</strong>: the 96-channel SBS spectrum (6 substitution types × 16 trinucleotide contexts) is decomposed into signatures with known causes. Examples: SBS4 (tobacco smoking, C&gt;A), SBS7 (UV light, C&gt;T at dipyrimidines), SBS2/13 (APOBEC), SBS3 (homologous-recombination deficiency, relevant for PARP inhibitors), SBS1 (clock-like deamination of 5-methylcytosine). Tools: SigProfiler, deconstructSigs, MutationalPatterns, SigLASSO.</li>
<li><strong>Tumour mutational burden (TMB)</strong> and microsatellite instability (MSI) as biomarkers for immunotherapy; HLA typing and neoantigen prediction (NetMHCpan, pVACtools).</li>
</ul>
<h2>Interpreting a germline variant</h2>
<p>The ACMG/AMP 2015 guidelines combine evidence types into five classes: <strong>pathogenic, likely pathogenic, variant of uncertain significance (VUS), likely benign, benign</strong>. Evidence types include population frequency (gnomAD; a variant too common for the disease prevalence is benign), computational predictions, functional data, segregation in families, de novo status, and the gene–disease relationship (ClinGen). ClinGen's 2022 calibration of computational predictors (Pejaver et al.) specifies score thresholds for tools such as REVEL and BayesDel so they can count as supporting, moderate or strong evidence.</p>
<p>[cards]</p><ul><li><p><strong>Missense predictors</strong></p><p>SIFT and PolyPhen-2 (classic), CADD (genome-wide integrative score), REVEL and BayesDel (ensembles), PrimateAI-3D, EVE and ESM-1v (evolutionary and protein language models, trained without clinical labels), AlphaMissense (AlphaFold-derived, 2023).</p></li><li><p><strong>Constraint metrics</strong></p><p>pLI and LOEUF (gnomAD) measure how strongly a gene tolerates loss-of-function variants. Missense constraint (MPC) and regional constraint highlight intolerant domains. GERP, phyloP and phastCons measure evolutionary conservation per base.</p></li><li><p><strong>Experimental maps</strong></p><p>Deep mutational scanning (DMS) and saturation genome editing (SGE; e.g. <i>BRCA1</i>, Findlay et al. 2018) measure the effect of nearly every possible SNV in a region. MaveDB collects these maps, which are increasingly used as functional evidence.</p></li></ul>
<blockquote><p><strong>Pitfall:</strong> Predictors trained on ClinVar and evaluated on ClinVar look better than they are, because the same variants or genes leak between training and test sets and because clinical classifications already used older predictors (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=evaluation+of+tools+used+to+predict+the+impact+of+missense+variants+is+hindered+by+two+types+of+circularity">Grimm et al. 2015, Human Mutation</a>). Prefer evaluations on deep mutational scanning data or on newly classified variants.</p></blockquote>
<h2>Pharmacogenomics</h2>
<p>Germline variants in drug-metabolising enzymes and transporters change drug exposure. Examples with clinical guidelines (CPIC, DPWG): <i>CYP2D6</i> (codeine, tamoxifen; star-allele haplotypes including gene deletions, duplications and hybrids), <i>CYP2C19</i> (clopidogrel), <i>TPMT</i>/<i>NUDT15</i> (thiopurines), <i>DPYD</i> (fluoropyrimidines), <i>HLA-B*57:01</i> (abacavir hypersensitivity), <i>SLCO1B1</i> (statin myopathy). Calling star alleles requires specialised tools (Aldy, Stargazer, PharmCAT, Cyrius) because of paralogs and structural variants.</p>
<h2>Population genetics you will need</h2>
<ul>
<li><strong>Allele frequency and Hardy–Weinberg equilibrium</strong>: strong deviations in controls often indicate genotyping error.</li>
<li><strong>Linkage disequilibrium (LD)</strong>: nearby variants are inherited together, so a GWAS signal marks a region, not a causal variant. Fine-mapping (SuSiE, FINEMAP) assigns posterior probabilities to variants within the region.</li>
<li><strong>Population structure and ancestry</strong>: control with principal components or mixed models, otherwise allele-frequency differences between groups create false associations. About 85% or more of GWAS participants have been of European ancestry, which reduces the portability of polygenic scores to other groups.</li>
<li><strong>Effect size versus frequency</strong>: rare variants can have large effects (Mendelian disease); common variants usually have small effects (complex traits). Both contribute to heritability.</li>
</ul>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Most VUSs are missense or non-coding. Accurate, calibrated prediction for non-coding variants is largely unsolved.</li><li>Cell-type- and context-specific variant effects, including variants that act only under stimulation or at particular developmental stages.</li><li>Equitable references: allele frequencies, LD panels and predictor training data remain skewed toward European ancestry.</li><li>Somatic mosaicism in normal tissues: detecting variants at VAF below 1% without error-corrected sequencing.</li></ul></blockquote>
