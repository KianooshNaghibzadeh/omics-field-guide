---
title: Lipidomics (targeted)
heading: Lipidomics, with a focus on targeted methods
part: II · The omics layers
order: 130
color: met
label: Small-molecule layer · lipids
slug: lipidomics-targeted
id: lipidomics
description: Lipids build membranes, store energy and carry signals. Human plasma contains thousands of lipid species from a few dozen classes. Targeted lipidomics measures a predefined panel of these species with internal standards, giving reproducible concentrations that can be compared across cohorts and laboratories.
---
<h2>Research questions</h2>
<ul>
<li>Which lipid species change in disease, and can a small panel predict risk (e.g. ceramides for cardiovascular events)?</li>
<li>How do genes (lipid QTLs), diet, drugs such as statins, and the microbiome shape the plasma lipidome?</li>
<li>Which enzymes and pathways (sphingolipid synthesis, fatty-acid elongation and desaturation, phospholipid remodelling) are altered in a tissue or cell?</li>
<li>How do signalling lipids (oxylipins, lysophospholipids, sphingosine-1-phosphate, endocannabinoids) relate to inflammation?</li>
<li>Where are lipids located in a tissue (MALDI imaging), and how does membrane composition change with cell state?</li>
</ul>
<h2>The lipid classes you will meet</h2>
<table>
<tr><th>Category (LIPID MAPS)</th><th>Main classes</th><th>Roles</th><th>Typical ion and fragment</th></tr>
<tr><td>Glycerophospholipids</td><td>PC, PE, PS, PI, PG, PA, and lyso forms (LPC, LPE)</td><td>Membrane bilayer; PI phosphates in signalling; LPC as a signal and damage marker</td><td>PC/LPC: [M+H]⁺ → m/z 184.07 (phosphocholine); PE: neutral loss of 141; PS: neutral loss of 185</td></tr>
<tr><td>Sphingolipids</td><td>Ceramides (Cer), sphingomyelin (SM), hexosylceramides, gangliosides, S1P</td><td>Membrane rafts, apoptosis, insulin resistance, cardiovascular risk</td><td>Cer: [M+H]⁺ → m/z 264.27 (d18:1 sphingoid base); SM: m/z 184.07</td></tr>
<tr><td>Glycerolipids</td><td>Triacylglycerols (TG), diacylglycerols (DG)</td><td>Energy storage, lipotoxicity, DG as a signal</td><td>[M+NH₄]⁺ → neutral loss of one fatty acid (+NH₃)</td></tr>
<tr><td>Sterol lipids</td><td>Cholesterol, cholesteryl esters (CE), bile acids, steroid hormones</td><td>Membrane rigidity, lipoprotein transport, hormones</td><td>CE: [M+NH₄]⁺ → m/z 369.35 (cholestadiene)</td></tr>
<tr><td>Fatty acyls</td><td>Free fatty acids, acylcarnitines, oxylipins (prostaglandins, leukotrienes, HETEs), endocannabinoids</td><td>Fuel, inflammation and resolution signals</td><td>Negative mode [M−H]⁻; oxylipins need dedicated targeted panels</td></tr>
</table>
<p>Names follow the LIPID MAPS shorthand, and the name should only claim what the data show (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=Update+on+LIPID+MAPS+classification%2C+nomenclature%2C+and+shorthand+notation+for+MS-derived+lipid+structures">Liebisch et al. 2020, Journal of Lipid Research</a>):</p>
<pre><code>PC 34:1             species level: class + total carbons:double bonds (from MS1 or a class fragment)
PC 16:0_18:1        molecular species level: the two fatty acyls are known, their positions are not (needs acyl fragments)
PC 16:0/18:1        sn-position level: palmitate at sn-1, oleate at sn-2
PC 16:0/18:1(9Z)    full structure: double-bond position and geometry (needs OzID, EAD/UVPD or chemical derivatisation)</code></pre>
<p>A standard MRM transition to m/z 184 tells you the lipid is a phosphocholine-containing species of a given mass, so most targeted panels report PC and SM at the species level unless acyl-specific transitions are added.</p>
<h2>Three strategies</h2>
<table>
<tr><th></th><th>Untargeted LC-HRMS</th><th>Shotgun (direct infusion)</th><th>Targeted LC-MRM</th></tr>
<tr><td>Instrument</td><td>Orbitrap or Q-TOF with data-dependent MS/MS</td><td>High-resolution MS or triple quad, no chromatography</td><td>Triple quadrupole (QqQ), sometimes QTRAP</td></tr>
<tr><td>Coverage</td><td>Broad, including unexpected lipids</td><td>Hundreds to ~1,000+ species, fast</td><td>Predefined panel, typically 100–1,000+ transitions</td></tr>
<tr><td>Quantification</td><td>Relative (fold change), semi-quantitative with standards</td><td>Quantitative with class standards</td><td>Most accurate and reproducible; absolute with calibration</td></tr>
<tr><td>Isomers</td><td>Partly separated by RT</td><td>Not separated; ion suppression in the mixture</td><td>Separated if chromatography and transitions are designed for it</td></tr>
<tr><td>Best for</td><td>Discovery</td><td>High-throughput profiling</td><td>Validation, large cohorts, clinical assays</td></tr>
</table>
<p>A common design is to discover candidates with untargeted lipidomics in a small cohort, then build a targeted MRM assay for those lipids (plus their class standards) and measure it in a large, independent cohort.</p>
<h2>How targeted lipidomics data are generated</h2>
<p>[steps]</p><ol><li><strong>Collect</strong> EDTA plasma or serum on ice, separated within ~1 h; lysophospholipids and oxylipins keep forming ex vivo at room temperature</li><li><strong>Spike standards</strong> Add class-specific internal standards (deuterated or odd-chain, e.g. SPLASH LIPIDOMIX) before extraction, so losses are corrected</li><li><strong>Extract</strong> MTBE (Matyash), chloroform/methanol (Folch, Bligh–Dyer) or butanol/methanol (BUME); add antioxidant (BHT) for oxidisable lipids; SPE for oxylipins</li><li><strong>Separate</strong> HILIC groups each class with its standard; reversed phase separates species by chain length and unsaturation</li><li><strong>Scheduled MRM</strong> QqQ monitors each precursor → product transition only in its retention-time window, allowing hundreds of lipids per run</li><li><strong>QC design</strong> Pooled QC every 5–10 samples, blanks, calibration standards, and a reference plasma (NIST SRM 1950) in every batch</li></ol>
<p>[figure: mrm | Fig. · How a triple quadrupole measures one lipid by multiple reaction monitoring (MRM). Q1 lets through only the precursor mass, the collision cell fragments it, and Q3 lets through only the class-specific fragment. Two mass filters in a row give high selectivity and sensitivity. Bottom: in scheduled MRM, each transition is monitored only around its expected retention time, so many transitions fit into one run.]</p>
<p>[figure: hilic | Fig. · In HILIC, lipids elute by class (head group) rather than by chain. Each class co-elutes with its internal standard (dashed), so standard and analytes experience the same ionisation conditions. Simulated chromatogram.]</p>
<h2>From peak areas to concentrations</h2>
<ol>
<li><strong>Integrate peaks</strong> for each transition (Skyline, MultiQuant/SCIEX OS, TargetLynx, TraceFinder, MRMkit). Check peak boundaries and retention times; automated integration errors are the most common silent problem.</li>
<li><strong>Normalise to the internal standard</strong>: response ratio = analyte area / internal-standard area.</li>
<li><strong>Isotope correction</strong>: <em>type I</em> corrects a species' own signal for its natural ¹³C distribution; <em>type II</em> removes overlap from the M+2 isotope of the species with one more double bond, which falls on the same nominal mass.</li>
<li><strong>Quantify</strong>, at one of three levels of rigour:
<ul>
<li><em>Single-point, class-based</em>: concentration = response ratio × known IS concentration. Assumes every species in a class responds like the standard, which is approximately true in HILIC and shotgun but not for very different chain lengths.</li>
<li><em>Response-factor corrected</em>: apply measured correction factors for chain length and unsaturation.</li>
<li><em>Calibration curve</em>: authentic standards at several concentrations, ideally with a stable-isotope-labelled version of each analyte. This is the only route to absolute concentrations that hold across laboratories and is required for clinical assays.</li>
</ul></li>
<li><strong>Assay performance</strong>: linearity and range, limit of detection (LOD, often signal-to-noise ≥ 3) and limit of quantification (LOQ, S/N ≥ 10 or CV ≤ 20%), precision (intra- and inter-batch CV), accuracy (recovery of spiked standards), carry-over, and matrix effects.</li>
<li><strong>Batch and drift correction</strong> with pooled QCs (LOESS, SERRF, QC-RLSC); remove species with QC CV above ~20–30% or below LOQ in most samples.</li>
<li><strong>Report</strong> in absolute units (nmol/mL plasma, pmol/µg protein, pmol/10⁶ cells), with the annotation level and the standards used.</li>
</ol>
<p>[figure: calib | Fig. · A calibration curve for one lipid. The response ratio (analyte / internal standard) is plotted against known concentrations of an authentic standard; an unknown sample's ratio is read off the fitted line. Points below the LOQ are not reported as numbers. Simulated data for Cer(d18:1/16:0).]</p>
<blockquote><p><strong>Pitfalls:</strong></p><ul>
<li>Isobaric overlap: different lipids with the same nominal mass and fragment (e.g. PC and some PE species, or ether vs ester lipids) are counted together unless separated by retention time or resolved by specific fragments.</li>
<li>In-source fragmentation can create false signals for lyso lipids and ceramides.</li>
<li>Using one internal standard for many classes, or adding it after extraction, cannot correct class-specific recovery.</li>
<li>"Absolute" concentrations from single-point class quantification are approximations; say so in the methods.</li>
<li>Relative units (percentage of total lipid) are compositional and behave like microbiome data.</li>
</ul></blockquote>
<h2>Statistics and interpretation</h2>
<ul>
<li><strong>Transform and test</strong>: log-transform concentrations; linear models with covariates (age, sex, BMI, fasting, statin use) and FDR control. Lipids are highly correlated, so also consider class-level sums, ratios (e.g. Cer/SM) and regularised models.</li>
<li><strong>Enrichment</strong>: lipid ontology enrichment with LION/web, or class- and chain-property enrichment (Lipid Mini-On, lipidr). Plot effects by class against chain length and number of double bonds to reveal patterns such as "saturated TGs up, polyunsaturated down".</li>
<li><strong>Pathways</strong>: map species to reactions (LIPID MAPS, Reactome, BioPAN for pathway activity from lipid ratios) and connect them to enzyme genes in transcriptomic or genetic data.</li>
<li><strong>Genetics</strong>: lipid QTL studies link variants in genes such as <i>FADS1/2</i> (fatty-acid desaturation) and <i>SPTLC</i> (ceramide synthesis) to specific species, and support Mendelian randomisation of lipids on disease.</li>
</ul>
<blockquote><p><strong>Example: ceramides as a clinical test:</strong> Plasma ratios of specific ceramides, such as Cer(d18:1/16:0), Cer(d18:1/18:0) and Cer(d18:1/24:1) relative to Cer(d18:1/24:0), predicted cardiovascular death in patients with coronary artery disease beyond LDL cholesterol (<a href="https://pubmed.ncbi.nlm.nih.gov/?term=Plasma+ceramides+predict+cardiovascular+death+in+patients+with+stable+coronary+artery+disease+and+acute+coronary+syndromes+beyond+LDL-cholesterol">Laaksonen et al. 2016, European Heart Journal</a>). These measurements are now offered as clinical risk scores. They work clinically because they use targeted LC-MRM with authentic, stable-isotope-labelled standards and calibration curves, which make concentrations comparable across laboratories.</p></blockquote>
<h2>Tools</h2>
<p>[tools: lipidomics]</p>
<h2>Benchmarks and standardisation</h2>
<p>[benchmarks: lipidomics]</p>
<blockquote><p><strong>Research gap:</strong></p><ul>
<li>Isomer-resolved quantification (sn-position, double-bond position and geometry) at cohort scale.</li>
<li>Absolute quantification without an authentic standard for every species: better response-factor models and predicted ionisation efficiencies.</li>
<li>Harmonising values across labs and platforms, including untargeted, shotgun and targeted data.</li>
<li>Linking lipid species to enzymes and genes for causal inference (lipid QTLs, Mendelian randomisation, isotope tracing of lipid synthesis).</li>
<li>Spatial and single-cell lipidomics (MALDI-2 imaging, mass cytometry of lipids) and their quantification.</li>
<li>Machine-learning annotation of lipid MS/MS spectra and automated QC of MRM peak integration.</li>
</ul></blockquote>
