"""Builds the multi-page public site (one page per chapter) into publish/.

Each chapter gets its own URL, <title>, meta description and canonical link so search
engines can index chapters individually. Shared CSS/JS are separate cached files.
"""
import html, json, re, shutil
from datetime import date
from pathlib import Path

ROOT_DIR = Path(__file__).parent
SRC, OUT = ROOT_DIR / "src", ROOT_DIR / "publish"
BASE = "https://kianooshnaghibzadeh.github.io/omics-field-guide/"
SITE = "The Omics Field Guide"
SLUG = {
    "home": "", "cell": "genome-genes-chromatin", "dogma": "central-dogma", "splicing": "splicing",
    "mutations": "mutations-genetic-variation", "omes": "types-of-omics", "genomics": "genomics",
    "epigenomics": "epigenomics", "transcriptomics": "transcriptomics", "singlecell": "single-cell-spatial-omics",
    "proteomics": "proteomics", "metabolomics": "metabolomics-lipidomics", "microbiome": "metagenomics-microbiome",
    "more": "other-omics", "relations": "multi-omics-biology", "integration": "multi-omics-integration",
    "practice": "workflow-reproducibility", "atlas": "bioinformatics-tool-atlas", "benchmarks": "benchmarks",
    "gaps": "research-gaps", "learn": "learning-path-glossary", "contact": "contact",
    "generation": "how-omics-data-are-generated", "lipidomics": "lipidomics-targeted",
}

read = lambda n: (SRC / n).read_text(encoding="utf-8")
head_src = read("00_head.html")
body = "".join(read(n) for n in ["01_home.html", "02_foundations.html", "03_layers_a.html",
                                 "04_layers_b.html", "05_integration.html", "06_research.html"])

css = re.search(r"<style>(.*?)</style>", head_src, re.S).group(1)
font_links = "\n".join(re.findall(r'<link rel="(?:preconnect|stylesheet)"[^>]*>', head_src))
shell = body[: body.index('<main id="main">') + len('<main id="main">')]

sec_re = re.compile(r'<section class="chapter" id="(\w+)" data-part="([^"]*)" data-title="([^"]*)" data-c="([^"]*)">(.*?)</section>', re.S)
secs = [dict(id=m[1], part=m[2], title=m[3], c=m[4], inner=m[5]) for m in sec_re.finditer(body)]
ids = [s["id"] for s in secs]

def text(fragment):
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()

def url(id_, root):
    return root + (SLUG[id_] + "/" if SLUG[id_] else "")

def relink(fragment, root):
    fragment = re.sub(r'href="#(\w+)"', lambda m: f'href="{url(m[1], root) or "./"}"' if m[1] in ids else m[0], fragment)
    return re.sub(r'<cite data-q="([^"]*)">(.*?)</cite>',
                  lambda m: f'<cite style="font-style:normal"><a href="https://pubmed.ncbi.nlm.nih.gov/?term={html.escape(html.unescape(m[1]).replace(" ", "+"))}" target="_blank" rel="noopener">{m[2]}</a></cite>',
                  fragment)

def toc(cur, root):
    out, last = [], None
    for s in secs:
        if s["part"] != last:
            last = s["part"]; out.append(f'<div class="toc-part">{last}</div>')
        cur_attr = ' aria-current="page"' if s["id"] == cur else ""
        out.append(f'<a href="{url(s["id"], root) or "./"}" data-id="{s["id"]}"{cur_attr}><span class="sw" style="--c:var({s["c"]})"></span><span>{s["title"]}</span></a>')
    return "\n".join(out)

def pager(i, root):
    pr, nx = (secs[i - 1] if i > 0 else None), (secs[i + 1] if i + 1 < len(secs) else None)
    h = ""
    if pr: h += f'<a href="{url(pr["id"], root) or "./"}"><span>← Previous</span><b>{pr["title"]}</b></a>'
    if nx: h += f'<a class="nx" href="{url(nx["id"], root)}"><span>{"Begin →" if i == 0 else "Next →"}</span><b>{nx["title"]}</b></a>'
    return h

# fresh output, keeping git metadata and README
if OUT.exists():
    for p in OUT.iterdir():
        if p.name in (".git", "README.md"): continue
        shutil.rmtree(p) if p.is_dir() else p.unlink()
OUT.mkdir(exist_ok=True)
(OUT / "assets").mkdir()
(OUT / "assets" / "style.css").write_text(css, encoding="utf-8")
(OUT / "assets" / "data.js").write_text(read("07_data.js"), encoding="utf-8")
(OUT / "assets" / "app.js").write_text(read("08_app.js"), encoding="utf-8")
(OUT / "assets" / "figs.js").write_text(read("09_figs.js"), encoding="utf-8")
pages = [dict(id=s["id"], slug=SLUG[s["id"]], title=html.unescape(s["title"])) for s in secs]
search = [dict(id=s["id"], title=html.unescape(s["title"]), text=text(s["inner"])) for s in secs]
(OUT / "assets" / "site.js").write_text("const PAGES=" + json.dumps(pages) + ";\nconst SEARCH=" + json.dumps(search, ensure_ascii=False) + ";\n", encoding="utf-8")

for i, s in enumerate(secs):
    root = "" if s["id"] == "home" else "../"
    title_plain = html.unescape(s["title"])
    dek = re.search(r'<p class="dek">(.*?)</p>', s["inner"], re.S)
    desc = text(dek[1]) if dek else ""
    if len(desc) > 158: desc = desc[:155].rsplit(" ", 1)[0] + "…"
    page_title = f"{SITE}: genome to metabolome, tools, benchmarks and multi-omics" if s["id"] == "home" else f"{title_plain} | {SITE}"
    canon = BASE + (SLUG[s["id"]] + "/" if SLUG[s["id"]] else "")
    inner = s["inner"]
    if '<div class="pager"></div>' in inner:
        inner = inner.replace('<div class="pager"></div>', f'<div class="pager">{pager(i, root)}</div>')
    else:
        inner += f'<div class="pager">{pager(i, root)}</div>'
    redirect = ""
    if s["id"] == "home":  # old single-page links like /#genomics go to the chapter page
        redirect = '<script>(function(){var h=location.hash.slice(1),p=(typeof PAGES!=="undefined")&&PAGES.find(function(x){return x.id===h&&x.slug;});if(p)location.replace(p.slug+"/");})();</script>'
    ld = {"@context": "https://schema.org", "@type": "WebPage" if s["id"] != "home" else "WebSite",
          "name": page_title, "url": canon, "description": desc, "inLanguage": "en",
          "author": {"@type": "Person", "name": "Kianoosh Naghibzadeh"},
          "isPartOf": {"@type": "WebSite", "name": SITE, "url": BASE}}
    page = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{html.escape(page_title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canon}">
<meta name="robots" content="index,follow"><meta name="author" content="Kianoosh Naghibzadeh">
<meta name="google-site-verification" content="odxt1RiJvQTCxN38_i_kjB3W6ATVOd_dK6NalYqU6RY">
<meta property="og:type" content="website"><meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{html.escape(page_title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{canon}">
<script type="application/ld+json">{json.dumps(ld)}</script>
{font_links}
<link rel="stylesheet" href="{root}assets/style.css">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}} body{{margin:0}} img{{max-width:100%}} [hidden]{{display:none!important}}</style>
</head><body>
{relink(shell, root).replace('<nav class="toc" id="toc"></nav>', '<nav class="toc" id="toc">' + toc(s["id"], root) + '</nav>')}
<section class="chapter on" id="{s["id"]}" data-part="{s["part"]}" data-title="{s["title"]}" data-c="{s["c"]}">{relink(inner, root)}</section>
</main>
<script>window.ROOT="{root or "./"}";</script>
<script src="{root}assets/data.js"></script><script src="{root}assets/site.js"></script>{redirect}<script src="{root}assets/app.js"></script><script src="{root}assets/figs.js"></script>
</body></html>
"""
    dest = OUT / SLUG[s["id"]] if SLUG[s["id"]] else OUT
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "index.html").write_text(page, encoding="utf-8")

today = date.today().isoformat()
(OUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{BASE}{SLUG[i] + '/' if SLUG[i] else ''}</loc><lastmod>{today}</lastmod></url>\n" for i in ids) + "</urlset>\n", encoding="utf-8")
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n", encoding="utf-8")
(OUT / ".nojekyll").write_text("", encoding="utf-8")
print(f"built {len(secs)} pages into {OUT}")
