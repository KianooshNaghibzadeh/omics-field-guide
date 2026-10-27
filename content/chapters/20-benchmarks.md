---
title: Benchmark hub
heading: Benchmark hub
part: IV · Research
order: 200
color: prot
label: Reference
slug: benchmarks
id: benchmarks
description: What independent, neutral comparisons of tools have found. Benchmarks age quickly and can be biased by their choice of data and metrics, so read them for patterns and for what they measured, not only for the winner.
---
<h2>How to read a benchmark</h2>
<p>[cards]</p><ul><li><p><strong>Who ran it?</strong></p><p>Neutral benchmarks (by groups that did not develop any of the tools) are more trustworthy than the comparison table in a new tool's own paper, where the new tool almost always wins (the "self-assessment trap").</p></li><li><p><strong>What is the ground truth?</strong></p><p>Simulations (controllable, but may not match reality), spike-ins and mixtures (realistic, limited), reference materials (GIAB, Quartet), orthogonal validation, or consistency only (weakest).</p></li><li><p><strong>Which metric?</strong></p><p>Precision, recall, F1, AUROC, AUPRC, FDR calibration, runtime, memory. A tool can win on one and lose on another. Check whether the metric matches your use.</p></li><li><p><strong>Does it match your data?</strong></p><p>Species, platform, depth, sample size and tissue all change rankings. A method that wins on cell lines may not win on tumour biopsies.</p></li></ul>
<p>Guidelines for running a good benchmark: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Essential+guidelines+for+computational+method+benchmarking">Weber et al. 2019, Genome Biology</a>. Continuous, community-maintained benchmarks (Open Problems in Single-Cell Analysis, OpenEBench, precisionFDA challenges, CAMI, CASP) are replacing one-off papers.</p>
<h2>All benchmarks</h2>
<p>[benchmark-hub]</p>
