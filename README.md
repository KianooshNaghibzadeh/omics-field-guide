# The Omics Field Guide

A free guide to omics analysis: molecular biology foundations, every major omics layer, how the data are generated, algorithms, ~270 tools, published benchmarks, multi-omics integration and open research questions.

**Website:** https://kianooshnaghibzadeh.github.io/omics-field-guide/
**Editing portal:** https://app.pagescms.org (open this repository there)

Author and maintainer: Kianoosh Naghibzadeh (Toronto Metropolitan University · SickKids)

## Editing with the portal (no coding needed)

The site is edited through **Pages CMS**, a free editing portal on top of this repository.

1. Go to https://app.pagescms.org and sign in. The owner signs in with GitHub; invited editors sign in with the email link they receive.
2. Open **omics-field-guide**. The left menu shows:
   - **Chapters**: every page of the guide. Open one to edit its text in a Word-like editor.
   - **Home page & site settings**: the home title, introduction and author line.
   - **Contact details**: name, email, LinkedIn, city, affiliations.
   - **Tools**, **Benchmarks**, **Glossary**: the tables, edited as forms.
3. Click **Save**. The website updates automatically within 1–2 minutes.

Every save is recorded, so any change can be undone from the repository history.

### Special blocks inside a chapter

Write these as a paragraph on its own line:

| Write | Result |
|---|---|
| `[figure: pileup \| Caption text]` | A figure from the figure library (`theme/figs.js`) or an SVG in `content/figures/` |
| `[tools: genomics]` | The tool table for a layer |
| `[benchmarks: genomics]` | The benchmark table for a layer |
| `[steps]` then a numbered list | A numbered step strip; start each item with **bold title** |
| `[cards]` then a bulleted list | A row of cards; start each item with **bold title** |

A quote block that starts with a bold label such as **Key idea:**, **Pitfall:**, **Research gap:**, **Benchmark:** or **Example:** becomes a coloured box. Text written like `ATGGCC` in code style is coloured by base. Links to other chapters use the chapter id, e.g. `#genomics`.

To add a chapter, click **Add an entry** in Chapters, give it a title, a web address (slug) and a position number (chapters are sorted by it).

## For developers

| Folder | Contents |
|---|---|
| `content/chapters/` | One file per chapter: YAML front matter + HTML body |
| `content/data/` | Tools, benchmarks, glossary, contact details, site settings (JSON) |
| `content/figures/` | Static SVG diagrams |
| `content/images/` | Images uploaded through the portal |
| `theme/` | Layout (`shell.html`, `home.html`), styles (`style.css`), scripts (`app.js`, `figs.js`) |
| `build_pages.py` | Builds `publish/` (website) and `site/index.html` (single-page copy) |
| `.pages.yml` | Portal configuration |

Every push to `main` runs `.github/workflows/pages.yml`, which builds and deploys the site. Build warnings appear in the **Actions** log.

Local preview:

```
pip install -r requirements.txt
python build_pages.py
python -m http.server 8000 --directory publish
```

Please keep the `GOOGLE_VERIFICATION` value in `build_pages.py`; it keeps the site registered with Google Search Console.
