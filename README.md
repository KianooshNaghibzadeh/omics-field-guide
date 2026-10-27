# The Omics Field Guide

A free guide to omics analysis: molecular biology foundations, every major omics layer, how the data are generated, algorithms, ~270 tools, published benchmarks, multi-omics integration and open research questions.

**Website:** https://kianooshnaghibzadeh.github.io/omics-field-guide/

Author and maintainer: Kianoosh Naghibzadeh (Toronto Metropolitan University · SickKids)

## How to edit

Every change saved to the `main` branch rebuilds and republishes the website automatically, usually within 1–2 minutes. Progress is shown in the **Actions** tab; a red ✗ there means the build failed and the live site was left unchanged.

### Where things are

| To change… | Edit this file |
|---|---|
| Home page, chapter list sidebar | `src/01_home.html` |
| Chapters 1–4: genome, central dogma, splicing, mutations | `src/02_foundations.html` |
| Map of omes, data generation, genomics, epigenomics, transcriptomics | `src/03_layers_a.html` |
| Single-cell & spatial, proteomics, metabolomics, lipidomics, microbiome, more omics | `src/04_layers_b.html` |
| How the layers talk, integration, workflow | `src/05_integration.html` |
| Tool atlas, benchmark hub, research gaps, learning path, contact | `src/06_research.html` |
| Tool tables, benchmark tables, glossary | `src/07_data.js` |
| Figures (drawn in code) | `src/09_figs.js` |
| Colours, fonts, layout | `src/00_head.html` |
| Page addresses, Google settings | `build_pages.py` |

### Editing in the browser (simplest)

1. Open the file on GitHub, click the pencil icon.
2. Make the change, then click **Commit changes**.
3. Watch the **Actions** tab; when it turns green, the website is updated.

### Common edits

- **Fix or add text:** edit the HTML in the chapter file. Each chapter is one `<section class="chapter" id="…">` block, with `<h2>` sections inside.
- **Add a tool:** add a line to `TOOLS` in `src/07_data.js`:
  `["Name","layer","Task","S",2,"CLI","What it does."],`
  Stage is `P`, `S` or `T` (primary, secondary, tertiary); level is 1–3. Layers: genomics, epigenomics, transcriptomics, singlecell, proteomics, metabolomics, lipidomics, microbiome, integration, practice.
- **Add a benchmark:** add a line to `BENCH` in `src/07_data.js`: layer, paper title (used for the PubMed link), "Author et al. Year, Journal", finding, takeaway.
- **Add a citation in the text:** `<cite data-q="exact paper title">Author et al. Year, Journal</cite>`
- **Add a chapter:** copy an existing `<section>` block, give it a new `id`, and add that id with a web address to `SLUG` in `build_pages.py`.

### Previewing locally (optional)

```
python build_pages.py
python -m http.server 8000 --directory publish
```
Then open http://localhost:8000.

Please do not remove the `google-site-verification` line in `build_pages.py`; it keeps the site registered with Google Search Console.
