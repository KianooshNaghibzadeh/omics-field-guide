#!/bin/sh
# Assembles the Omics Field Guide from src/ into:
#   site/index.html        – artifact page (no doctype; the host wraps it)
#   site/standalone.html   – full HTML document for any static host (GitHub Pages, Netlify)
set -e
cd "$(dirname "$0")"
mkdir -p site
{
  cat src/00_head.html src/01_home.html src/02_foundations.html src/03_layers_a.html \
      src/04_layers_b.html src/05_integration.html src/06_research.html
  echo "<script>"; cat src/07_data.js src/08_app.js src/09_figs.js; echo "</script>"
} > site/index.html
{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  echo '<link rel="canonical" href="https://kianooshnaghibzadeh.github.io/omics-field-guide/">'
  echo '<meta name="robots" content="index,follow"><meta name="author" content="Kianoosh Naghibzadeh">'
  echo '<meta property="og:type" content="website"><meta property="og:title" content="The Omics Field Guide">'
  echo '<meta property="og:description" content="A free guide to omics: central dogma, splicing, mutations, genomics, epigenomics, transcriptomics, single-cell, proteomics, metabolomics, microbiome, multi-omics integration, tools, benchmarks and research gaps.">'
  echo '<meta property="og:url" content="https://kianooshnaghibzadeh.github.io/omics-field-guide/">'
  sed -n '1,/<\/style>/p' site/index.html
  echo '</head><body>'
  sed '1,/<\/style>/d' site/index.html
  echo '</body></html>'
} > site/standalone.html
# GitHub Pages site: one page per chapter (publish/)
python build_pages.py
wc -c site/index.html site/standalone.html
