---
title: Genomics
heading: Genomics
part: II · The omics layers
order: 70
color: dna
label: DNA layer
slug: genomics
id: genomics
description: Reading DNA and finding where it differs. Germline genomics asks which inherited variants explain disease or traits; somatic genomics asks which acquired variants drive cancer and clonal expansion; assembly asks what the genome actually looks like when no reference fits.
---
<h2>Research questions</h2>
<ul>
<li>Which variant explains this patient's rare disease? (diagnostic yield of WES is ~25–40%, WGS adds several percent more)</li>
<li>Which loci are associated with a complex trait, and which variant and gene in each locus is causal?</li>
<li>How much heritability do rare and structural variants explain beyond common SNPs?</li>
<li>Which somatic mutations drive a tumour, in what order, and which therapies do they predict?</li>
<li>What is the full structural diversity of human genomes across ancestries (pangenome)?</li>
<li>Can polygenic scores predict risk equally well across populations?</li>
</ul>
<h2>Technologies</h2>
<table>
<tr><th>Platform</th><th>Read length</th><th>Accuracy</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td>Illumina SBS</td><td>2×150 bp</td><td>&gt;99.9% (Q30+)</td><td>Cheapest per base, mature tooling, the reference standard for SNVs</td><td>Repeats, SVs, phasing, GC bias</td></tr>
<tr><td>Element AVITI, MGI/Complete Genomics, Ultima</td><td>150–300 bp</td><td>Q30–Q40+</td><td>Competitive cost and accuracy</td><td>Similar short-read limits; Ultima has homopolymer-specific errors</td></tr>
<tr><td>PacBio HiFi</td><td>15–25 kb</td><td>~Q30 (99.9%)</td><td>Accurate long reads: SVs, phasing, repeats, assembly, native 5mC</td><td>Higher cost per sample</td></tr>
<tr><td>Oxford Nanopore</td><td>10 kb to &gt;1 Mb</td><td>~Q20+ with recent chemistry and basecallers</td><td>Ultra-long reads, real-time, portable, native base modifications, direct RNA</td><td>Systematic errors in homopolymers; basecaller version matters</td></tr>
<tr><td>Linked/optical (Bionano)</td><td>&gt;150 kb molecules</td><td>n/a</td><td>Large SVs, scaffolding</td><td>No base-level sequence</td></tr>
<tr><td>SNP arrays</td><td>n/a</td><td>High for common SNPs</td><td>Very cheap; basis of biobank GWAS with imputation</td><td>Only known variants; rare variants are poorly imputed</td></tr>
</table>
<h2>How genomic data are generated</h2>
<p>[steps]</p><ol><li><strong>Sample</strong> Blood (EDTA), saliva, buccal swab, fresh-frozen or FFPE tissue; tumour plus matched normal for somatic work</li><li><strong>DNA extraction</strong> Silica columns or magnetic beads; high-molecular-weight kits (&gt;50 kb) for long reads</li><li><strong>DNA QC</strong> Concentration (Qubit), purity (A260/280 ≈ 1.8), integrity (DIN, pulsed-field gel)</li><li><strong>Library</strong> PCR-free WGS; exome capture with probes (~35–60 Mb); amplicon panels; size selection for HiFi/ONT</li><li><strong>Sequencing</strong> 2 × 150 bp to ~30× (germline) or 60–100× tumour; HiFi 15–25 kb; ONT ultra-long</li><li><strong>Raw output</strong> FASTQ (short reads), unaligned BAM (PacBio), POD5 signal (ONT)</li></ol>
<p>Arrays follow a different route: DNA is amplified, fragmented, hybridised to probes on a BeadChip and scanned into IDAT intensity files, then genotypes are called from the two allele intensities (GenomeStudio, gtc2vcf) and missing variants are imputed.</p>
<h2>Reading aligned sequences</h2>
<p>After alignment, every read sits at its position on the reference. A genome browser such as IGV shows this as a <strong>pileup</strong>: bases that match the reference are drawn as plain bars, and only differences are shown. Real variants appear in a consistent fraction of reads from both strands; sequencing errors appear in single reads at low quality.</p>
<p>[figure: pileup | Fig. · A read pileup around a heterozygous SNV and a heterozygous 2-bp deletion. Top: coverage, with the alternative-allele fraction coloured. Expect about 50% alternative reads for a germline heterozygous variant and about 100% for homozygous; somatic variants can be far lower. Simulated reads.]</p>
<p>A caller summarises this evidence as one line of a VCF file:</p>
<pre><code>#CHROM  POS        ID          REF  ALT  QUAL  FILTER  INFO              FORMAT          SAMPLE
chr2    21012345   .           C    T    812   PASS    DP=41;AF=0.5      GT:AD:DP:GQ     0/1:21,20:41:99
│       │          │           │    │    │     │       │                 │               └ genotype 0/1 = heterozygous; 21 ref and 20 alt reads; depth 41; genotype quality 99
│       │          │           │    │    │     │       └ site-level annotations   └ keys for the sample column
│       │          │           │    │    │     └ passed all filters
│       │          │           │    │    └ Phred-scaled confidence that a variant exists
│       │          │           │    └ alternative allele          └ reference allele
│       │          │           └ dbSNP identifier (rs…), or "." if none
└ chromosome and 1-based position (GRCh38)</code></pre>
<h2>The germline short-read pipeline</h2>
<ol>
<li><strong>QC and trimming</strong> (FastQC, fastp): adapters, quality, duplication.</li>
<li><strong>Alignment</strong> to GRCh38 (BWA-MEM2; minimap2 for long reads). Uses the Burrows–Wheeler transform/FM-index to find exact seed matches quickly, then Smith–Waterman local alignment. Output: SAM/BAM/CRAM with mapping quality (MAPQ = −10 log<sub>10</sub> P(mapped position wrong)).</li>
<li><strong>Duplicate marking</strong> (Picard, samblaster, GATK MarkDuplicatesSpark): PCR and optical duplicates inflate confidence.</li>
<li><strong>Base quality score recalibration</strong> (BQSR): models systematic quality errors by machine cycle and context. Less important with modern instruments and with DeepVariant.</li>
<li><strong>Variant calling</strong>: GATK HaplotypeCaller re-assembles local haplotypes with a de Bruijn graph and computes genotype likelihoods with a pair-HMM; DeepVariant encodes read pileups as images and classifies genotypes with a CNN; Strelka2, FreeBayes, Octopus and DRAGEN are alternatives. Cohort calling uses gVCFs and joint genotyping (GATK GenotypeGVCFs, GLnexus).</li>
<li><strong>Filtering</strong>: VQSR (Gaussian mixture on annotations) for large cohorts, hard filters for small ones, or learned filters.</li>
<li><strong>Annotation</strong>: VEP, ANNOVAR, SnpEff add gene, transcript and consequence, population frequency (gnomAD), predictions (CADD, REVEL, SpliceAI, AlphaMissense) and clinical databases (ClinVar).</li>
<li><strong>Prioritisation</strong>: Exomiser and LIRICAL combine variant scores with patient phenotypes (HPO terms); inheritance-mode filters for trios.</li>
</ol>
<blockquote><p><strong>Key idea:</strong> Variant calling is a statistical inference, not a lookup. A genotype call is the most likely genotype given read evidence, base and mapping qualities and a prior. Report and filter on genotype quality (GQ), depth (DP) and allele balance, and use benchmark regions to know where calls can be trusted.</p></blockquote>
<h2>Structural variants and copy number</h2>
<p>Short-read SV callers combine three signals: <strong>discordant read pairs</strong> (unexpected insert size or orientation), <strong>split reads</strong> (one read spanning a breakpoint), and <strong>read depth</strong>. Assembly-based callers reconstruct breakpoint sequence. Manta, DELLY, LUMPY/smoove and GRIDSS2 are widely used, often merged with SURVIVOR or Jasmine. Long-read callers (Sniffles2, cuteSV, pbsv, SVIM) and assembly-based comparison (PAV, SVIM-asm, dipcall) recover far more SVs, especially insertions in repeats. For copy number: CNVkit and GATK gCNV (exomes and panels), CNVnator and Canvas (WGS), ASCAT, FACETS and PURPLE (tumour allele-specific copy number with purity and ploidy), and GISTIC2 (recurrent CNAs across tumours).</p>
<h2>Somatic variant calling</h2>
<p>Tumour samples are mixtures of tumour and normal cells, often with subclones, so somatic variants may appear at 5% VAF or lower. Use a matched normal, a panel of normals, and germline resource filtering (Mutect2 with FilterMutectCalls, Strelka2, VarDict, LoFreq). FFPE samples cause C&gt;T deamination artefacts, and oxidation causes G&gt;T artefacts; orientation-bias filters address both. Ultra-sensitive applications (minimal residual disease, liquid biopsy) need unique molecular identifiers (UMIs) and duplex sequencing to suppress errors below 10<sup>−6</sup>.</p>
<h2>De novo assembly and pangenomes</h2>
<p>When the reference is incomplete or absent, reads are assembled. Overlap-layout-consensus and string graphs (hifiasm, HiCanu, Flye, Shasta) handle long reads; de Bruijn graphs (SPAdes, MEGAHIT) handle short reads. Hybrid approaches (Verkko) combine HiFi with ultra-long ONT for telomere-to-telomere assemblies; Hi-C or parental data (trio binning) phase haplotypes. Assess with N50, BUSCO completeness, Merqury k-mer QV and Inspector. The Human Pangenome Reference Consortium builds graph references (minigraph-Cactus, PGGB) that reduce reference bias; vg giraffe aligns reads to graphs.</p>
<h2>Population and statistical genetics</h2>
<ul>
<li><strong>GWAS</strong>: test each variant for association with a trait while controlling population structure. PLINK 2 for QC and simple models; mixed models handle relatedness and structure at biobank scale (REGENIE, SAIGE, BOLT-LMM, fastGWA). Genome-wide significance is conventionally p &lt; 5×10<sup>−8</sup>.</li>
<li><strong>Imputation</strong>: infer untyped variants from haplotype reference panels (TOPMed, 1000 Genomes, HRC) with Beagle 5, Minimac4 or IMPUTE5; pre-phasing with SHAPEIT5 or Eagle2.</li>
<li><strong>Heritability and genetic correlation</strong>: LD score regression (LDSC), GCTA-GREML, S-LDSC for enrichment in annotations (cell-type-specific enhancers).</li>
<li><strong>Fine-mapping</strong>: SuSiE, FINEMAP, PolyFun (functional priors) output credible sets of likely causal variants.</li>
<li><strong>Polygenic scores</strong>: PRS-CS, LDpred2, SBayesRC, PRS-CSx (multi-ancestry). Evaluate with incremental R² or AUC in held-out cohorts of each ancestry.</li>
<li><strong>Rare-variant burden tests</strong>: SKAT-O, ACAT, gene-based burden in exome biobanks.</li>
</ul>
<h2>Tools</h2>
<p>[tools: genomics]</p>
<h2>Benchmarks</h2>
<p>[benchmarks: genomics]</p>
<blockquote><p><strong>Pitfall:</strong> Benchmarks such as Genome in a Bottle cover "high-confidence" regions, which historically excluded the hardest parts of the genome. A pipeline scoring 99.9% F1 there may do much worse in segmental duplications, the MHC or medically relevant genes with paralogs (e.g. <i>SMN1/2</i>, <i>PMS2</i>, <i>CYP2D6</i>). Check stratified performance (GIAB stratification BEDs with hap.py or vcfdist), not only the headline number.</p></blockquote>
<blockquote><p><strong>Research gap:</strong></p><ul><li>Variant calling against pangenome graphs, and benchmarks that represent diverse ancestries.</li><li>Joint calling of SNVs, SVs, repeat expansions and methylation from one long-read run.</li><li>Interpretation of non-coding and structural variants in rare disease, where most unsolved cases may sit.</li><li>Polygenic score portability, calibration and clinical utility across ancestries.</li><li>Somatic mosaicism and clonal haematopoiesis detection in normal tissues.</li></ul></blockquote>
