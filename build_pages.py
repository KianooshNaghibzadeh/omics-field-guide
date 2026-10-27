"""Builds The Omics Field Guide from content/ and theme/.

    content/chapters/*.md   one chapter per file: YAML front matter + HTML body (edited in Pages CMS)
    content/data/*.json     tools, benchmarks, glossary, contact details, site settings
    content/figures/*.svg   static diagrams used by [figure: name | caption]
    theme/                  layout, styles and scripts (developer-edited)

Outputs:
    publish/                multi-page site for GitHub Pages (one page per chapter)
    site/index.html         single-page version for the claude.ai artifact

Shortcodes allowed in chapter bodies, each alone in its own paragraph:
    [figure: name | caption]   [tools: layer]   [benchmarks: layer]
    [steps] followed by a numbered list   [cards] followed by a bulleted list
    [codon-table] [tool-atlas] [benchmark-hub] [glossary] [contact]
A quote block that starts with a bold "Label:" becomes a callout box.
"""
import html, json, re, shutil, sys
from datetime import date
from pathlib import Path
import yaml
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).parent
C, T, OUT, ART = ROOT / "content", ROOT / "theme", ROOT / "publish", ROOT / "site"
BASE = "https://kianooshnaghibzadeh.github.io/omics-field-guide/"
GOOGLE_VERIFICATION = "odxt1RiJvQTCxN38_i_kjB3W6ATVOd_dK6NalYqU6RY"
COLORS = {"dna", "epi", "rna", "prot", "met", "mic", "int"}
WARN = []

def warn(msg): WARN.append(msg); print("WARNING:", msg)
def esc(s): return html.escape(str(s), quote=True)
def load_json(name): return json.loads((C / "data" / f"{name}.json").read_text(encoding="utf-8"))

site, contact = load_json("site"), load_json("contact")
tools, bench, gloss = load_json("tools"), load_json("benchmarks"), load_json("glossary")

# ------------------------------------------------------------------ chapters
chapters = []
for f in sorted((C / "chapters").glob("*.md")):
    text = f.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", text, re.S)
    if not m: warn(f"{f.name}: missing front matter, skipped"); continue
    fm = yaml.safe_load(m.group(1)) or {}
    if fm.get("draft"): continue
    if not fm.get("title") or not fm.get("slug"): warn(f"{f.name}: needs a title and a slug, skipped"); continue
    fm.setdefault("id", re.sub(r"[^a-z0-9]+", "-", str(fm["slug"]).lower()).strip("-"))
    fm.setdefault("heading", fm["title"]); fm.setdefault("part", "Chapters"); fm.setdefault("label", fm["part"])
    fm.setdefault("description", ""); fm.setdefault("order", 9999)
    if fm.get("color") not in COLORS: fm["color"] = "int"
    fm["body"] = m.group(2); fm["file"] = f.name
    chapters.append(fm)
chapters.sort(key=lambda c: (float(c["order"]), c["file"]))
ids = {c["id"] for c in chapters} | {"home"}
slug_of = {c["id"]: c["slug"] for c in chapters}; slug_of["home"] = ""

# ------------------------------------------------------------------ snippets
ATLAS = """<div class="wide"><div class="filters">
<input id="atlasQ" type="search" placeholder="Search tool, task or aim…" aria-label="Search tools">
<select id="atlasOmics" aria-label="Filter by layer"><option value="">All layers</option></select>
<select id="atlasStage" aria-label="Filter by stage"><option value="">All stages</option><option value="P">Primary</option><option value="S">Secondary</option><option value="T">Tertiary</option></select>
<select id="atlasLvl" aria-label="Filter by skill level"><option value="">All levels</option><option value="1">Entry</option><option value="2">Intermediate</option><option value="3">Advanced</option></select>
<span class="count" id="atlasCount"></span></div><div class="tbl" id="atlasTable"></div></div>"""
HUB = """<div class="wide"><div class="filters"><input id="benchQ" type="search" placeholder="Filter benchmarks…" aria-label="Filter benchmarks"><select id="benchOmics" aria-label="Filter benchmarks by layer"><option value="">All layers</option></select><span class="count" id="benchCount"></span></div>
<div class="benchlist" data-omics="*"></div></div>"""

def contact_html():
    li = contact.get("linkedin", "")
    li_txt = re.sub(r"^https?://(www\.)?", "", li).rstrip("/")
    h = '<div class="wide"><dl class="contact">'
    h += f'<div><dt>Name</dt><dd>{esc(contact.get("name",""))}</dd></div>'
    if contact.get("email"):
        h += f'<div><dt>Email</dt><dd><span id="mail">{esc(contact["email"])}</span><button class="copy" type="button" data-copy="{esc(contact["email"])}">Copy</button></dd></div>'
    if li: h += f'<div><dt>LinkedIn</dt><dd><a href="{esc(li)}" target="_blank" rel="noopener">{esc(li_txt)}</a></dd></div>'
    if contact.get("city"): h += f'<div><dt>City</dt><dd>{esc(contact["city"])}</dd></div>'
    h += "</dl>"
    affs = contact.get("affiliations") or []
    if affs:
        h += "<h2>Affiliations</h2><div class=\"cols\">" + "".join(
            f'<div class="card"><h4>{esc(a.get("name",""))}</h4><p>{esc(a.get("detail",""))}</p></div>' for a in affs) + "</div>"
    return h + "</div>"

def frag(s): return BeautifulSoup(s, "html.parser")

def colour_seq(s):
    return '<span class="seq">' + "".join(f'<span class="{b.upper()}">{b}</span>' if b.upper() in "ACGTU" else esc(b) for b in s) + "</span>"

NOTE_CLASS = [("pitfall", "pit"), ("caution", "pit"), ("warning", "pit"), ("pre-analytical", "pit"),
              ("gap", "gap"), ("open question", "gap"), ("starting question", "gap"),
              ("benchmark", "bench"), ("evidence", "bench"),
              ("example", "eg"), ("worked", "eg"), ("clock", "eg")]

def render_body(body, ch):
    soup = BeautifulSoup(body, "html.parser")
    for p in list(soup.find_all("p")):
        txt = p.get_text().strip()
        m = re.fullmatch(r"\[([a-z-]+)(?::\s*(.*))?\]", txt, re.S)
        if not m: continue
        code, arg = m.group(1), (m.group(2) or "").strip()
        if code == "figure":
            name, _, cap = arg.partition("|"); name, cap = name.strip(), cap.strip()
            svgf = C / "figures" / f"{name}.svg"
            if svgf.exists():
                new = frag(f'<figure class="wide"><div class="fig">{svgf.read_text(encoding="utf-8")}</div><figcaption>{esc(cap)}</figcaption></figure>')
            else:
                new = frag(f'<div class="figx" data-fig="{esc(name)}" data-cap="{esc(esc(cap))}"></div>')
            p.replace_with(new)
        elif code == "tools": p.replace_with(frag(f'<div class="tooltable" data-omics="{esc(arg)}"></div>'))
        elif code == "benchmarks": p.replace_with(frag(f'<div class="benchlist" data-omics="{esc(arg)}"></div>'))
        elif code in ("steps", "cards"):
            nxt = p.find_next_sibling()
            want = "ol" if code == "steps" else ("ul", "ol")
            if nxt is None or nxt.name not in (want if isinstance(want, tuple) else (want,)):
                warn(f'{ch["file"]}: [{code}] must be followed by a {"numbered" if code=="steps" else "bulleted"} list'); p.decompose(); continue
            if code == "steps":
                out = f'<ol class="steps" style="--c:var(--{ch["color"]})">'
                for li in nxt.find_all("li", recursive=False):
                    s = li.find("strong"); title = s.get_text() if s else ""
                    if s: s.decompose()
                    out += f"<li><b>{esc(title)}</b><span>{''.join(str(c) for c in li.contents).strip()}</span></li>"
                out += "</ol>"
            else:
                out = '<div class="cols">'
                for li in nxt.find_all("li", recursive=False):
                    s = li.find("strong"); title = s.get_text().rstrip(":") if s else ""
                    if s:
                        parent = s.parent; s.decompose()
                        if parent.name == "p" and not parent.get_text(strip=True): parent.decompose()
                    inner = "".join(str(c) for c in li.contents).strip()
                    if inner and not inner.startswith("<"): inner = f"<p>{inner}</p>"
                    out += f'<div class="card"><h4>{esc(title)}</h4>{inner}</div>'
                out += "</div>"
            nxt.replace_with(frag(out)); p.decompose()
        elif code == "codon-table": p.replace_with(frag('<div class="tbl wide" id="codonTable"></div>'))
        elif code == "tool-atlas": p.replace_with(frag(ATLAS))
        elif code == "benchmark-hub": p.replace_with(frag(HUB))
        elif code == "glossary": p.replace_with(frag('<dl class="gloss" id="glossary"></dl>'))
        elif code == "contact": p.replace_with(frag(contact_html()))
        else: warn(f'{ch["file"]}: unknown shortcode [{code}]')
    for bq in soup.find_all("blockquote"):
        first = bq.find(["p", "li"]); s = first.find("strong") if first else None
        label = s.get_text().strip() if s else ""
        if s and label.endswith(":") and first.contents and first.contents[0] == s:
            s.decompose(); label = label[:-1]
            if first.contents and isinstance(first.contents[0], NavigableString):
                first.contents[0].replace_with(first.contents[0].lstrip())
            if not first.get_text(strip=True) and first.name == "p": first.decompose()
        else:
            label = "Note"
        cls = next((c for k, c in NOTE_CLASS if k in label.lower()), "key")
        inner = "".join(str(c) for c in bq.contents).strip()
        bq.replace_with(frag(f'<div class="note {cls}"><span class="lbl">{esc(label)}</span>{inner}</div>'))
    for tb in soup.find_all("table"):
        for tr in tb.find_all("tr"):
            cells = tr.find_all(["td", "th"], recursive=False)
            if len(cells) == 1 and cells[0].get("colspan"):
                tr["class"] = "grp"; st = cells[0].find("strong")
                if st: st.unwrap()
        if not (tb.parent and tb.parent.name == "div" and "tbl" in (tb.parent.get("class") or [])):
            wrap = soup.new_tag("div", attrs={"class": "tbl"}); tb.wrap(wrap)
    for pre in soup.find_all("pre"):
        d = soup.new_tag("div", attrs={"class": "anat"}); d.string = pre.get_text().strip("\n"); pre.replace_with(d)
    for c in soup.find_all("code"):
        t = c.get_text()
        if re.fullmatch(r"[ACGTUacgtu ]{4,}", t): c.replace_with(frag(colour_seq(t)))
    for a in soup.find_all("a", href=True):
        if a["href"].startswith("http") and not a["href"].startswith(BASE):
            a["target"] = "_blank"; a["rel"] = "noopener"
    return str(soup)

def section(ch):
    c = ch["color"]
    head = (f'<header class="chap-head"><div class="track"><span class="chip" style="--c:var(--{c});--cb:var(--{c}-bg)">{esc(ch["label"])}</span>'
            f'<span class="chnum"></span></div><h1>{esc(ch["heading"])}</h1>' + (f'<p class="dek">{esc(ch["description"])}</p>' if ch["description"] else "") + "</header>")
    return (f'<section class="chapter" id="{esc(ch["id"])}" data-part="{esc(ch["part"])}" data-title="{esc(ch["title"])}" data-c="--{c}">\n'
            f'{head}\n{render_body(ch["body"], ch)}\n<div class="pager"></div>\n</section>')

def home_section():
    h = (T / "home.html").read_text(encoding="utf-8")
    for k in ["home_eyebrow", "home_title", "home_title_accent", "home_intro", "byline_label", "author_name", "author_line"]:
        h = h.replace("{{" + k + "}}", esc(site.get(k, "")))
    return h

sections = [("home", "Start here", "Start", "int", home_section())] + [(c["id"], c["title"], c["part"], c["color"], section(c)) for c in chapters]

# ------------------------------------------------------------------ data script
LAYERS = {"genomics", "epigenomics", "transcriptomics", "singlecell", "proteomics", "metabolomics", "lipidomics", "microbiome", "integration", "practice"}
TOOL_ROWS = []
for t in tools:
    if not t.get("name"): continue
    stage = t.get("stage", "T") if t.get("stage") in ("P", "S", "T") else "T"
    try: lvl = min(3, max(1, int(t.get("level", 2))))
    except (TypeError, ValueError): lvl = 2
    if t.get("layer") not in LAYERS: warn(f'tool "{t["name"]}": unknown layer "{t.get("layer")}"')
    TOOL_ROWS.append([t["name"], t.get("layer", "practice"), t.get("task", ""), stage, lvl, t.get("interface", ""), t.get("aim", "")])
BENCH_ROWS = [[b.get("layer", ""), b.get("title", ""), b.get("citation", ""), b.get("finding", ""), b.get("takeaway", "")] for b in bench if b.get("title")]
GLOSS_ROWS = [[g.get("term", ""), g.get("definition", "")] for g in gloss if g.get("term")]
DATA_JS = ("const TOOLS=" + json.dumps(TOOL_ROWS, ensure_ascii=False) + ";\nconst BENCH=" + json.dumps(BENCH_ROWS, ensure_ascii=False) +
           ";\nconst GLOSSARY=" + json.dumps(GLOSS_ROWS, ensure_ascii=False) + ";\n")

css = (T / "style.css").read_text(encoding="utf-8")
fonts = (T / "fonts.html").read_text(encoding="utf-8")
shell = (T / "shell.html").read_text(encoding="utf-8").replace("Edition 2026.10", esc(site.get("edition", "")))
app, figs = (T / "app.js").read_text(encoding="utf-8"), (T / "figs.js").read_text(encoding="utf-8")

def text_of(fragment):
    t = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()

# ------------------------------------------------------------------ single-page (artifact)
ART.mkdir(exist_ok=True)
(ART / "index.html").write_text(
    f"<title>{esc(site.get('site_title',''))}</title>\n{fonts}<style>\n{css}</style>\n{shell}<main id=\"main\">\n" +
    "\n".join(s[4] for s in sections) + "\n</main>\n<script>\n" + DATA_JS + app + "\n" + figs + "\n</script>\n", encoding="utf-8")

# ------------------------------------------------------------------ multi-page (GitHub Pages)
def url(i, root): return root + (slug_of[i] + "/" if slug_of.get(i) else "")
def relink(fragment, root):
    return re.sub(r'href="#([\w-]+)"', lambda m: f'href="{url(m[1], root) or "./"}"' if m[1] in ids else m[0], fragment)

def toc(cur, root):
    out, last = [], None
    for sid, title, part, col, _ in sections:
        if part != last: last = part; out.append(f'<div class="toc-part">{esc(part)}</div>')
        cur_attr = ' aria-current="page"' if sid == cur else ""
        out.append(f'<a href="{url(sid, root) or "./"}" data-id="{sid}"{cur_attr}><span class="sw" style="--c:var(--{col})"></span><span>{esc(title)}</span></a>')
    return "\n".join(out)

def pager(i, root):
    pr = sections[i - 1] if i > 0 else None; nx = sections[i + 1] if i + 1 < len(sections) else None
    h = ""
    if pr: h += f'<a href="{url(pr[0], root) or "./"}"><span>← Previous</span><b>{esc(pr[1])}</b></a>'
    if nx: h += f'<a class="nx" href="{url(nx[0], root)}"><span>{"Begin →" if i == 0 else "Next →"}</span><b>{esc(nx[1])}</b></a>'
    return h

if OUT.exists(): shutil.rmtree(OUT)
(OUT / "assets").mkdir(parents=True)
(OUT / "assets" / "style.css").write_text(css, encoding="utf-8")
(OUT / "assets" / "data.js").write_text(DATA_JS, encoding="utf-8")
(OUT / "assets" / "app.js").write_text(app, encoding="utf-8")
(OUT / "assets" / "figs.js").write_text(figs, encoding="utf-8")
if (C / "images").exists(): shutil.copytree(C / "images", OUT / "images", ignore=shutil.ignore_patterns(".gitkeep"))
pages = [dict(id=s[0], slug=slug_of[s[0]], title=s[1]) for s in sections]
search = [dict(id=s[0], title=s[1], text=text_of(s[4])) for s in sections]
(OUT / "assets" / "site.js").write_text("const PAGES=" + json.dumps(pages, ensure_ascii=False) + ";\nconst SEARCH=" + json.dumps(search, ensure_ascii=False) + ";\n", encoding="utf-8")

SITE = site.get("site_title", "The Omics Field Guide")
for i, (sid, title, part, col, sec_html) in enumerate(sections):
    root = "" if sid == "home" else "../"
    if sid == "home":
        page_title = f"{SITE}: genome to metabolome, tools, benchmarks and multi-omics"; desc = site.get("seo_description", "")
        sec_html = sec_html.replace("</section>", f'<div class="pager">{pager(i, root)}</div></section>', 1)
        redirect = '<script>(function(){var h=location.hash.slice(1),p=(typeof PAGES!=="undefined")&&PAGES.find(function(x){return x.id===h&&x.slug;});if(p)location.replace(p.slug+"/");})();</script>'
    else:
        ch = next(c for c in chapters if c["id"] == sid)
        page_title = f"{title} | {SITE}"; desc = ch["description"]
        sec_html = sec_html.replace('<div class="pager"></div>', f'<div class="pager">{pager(i, root)}</div>')
        redirect = ""
    if len(desc) > 158: desc = desc[:155].rsplit(" ", 1)[0] + "…"
    sec_html = sec_html.replace('<section class="chapter"', '<section class="chapter on"', 1)
    canon = BASE + (slug_of[sid] + "/" if slug_of[sid] else "")
    ld = {"@context": "https://schema.org", "@type": "WebSite" if sid == "home" else "WebPage", "name": page_title, "url": canon,
          "description": desc, "inLanguage": "en", "author": {"@type": "Person", "name": site.get("author_name", "")},
          "isPartOf": {"@type": "WebSite", "name": SITE, "url": BASE}}
    page = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{esc(page_title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{canon}">
<meta name="robots" content="index,follow"><meta name="author" content="{esc(site.get('author_name',''))}">
<meta name="google-site-verification" content="{GOOGLE_VERIFICATION}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{esc(SITE)}">
<meta property="og:title" content="{esc(page_title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{canon}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
{fonts}<link rel="stylesheet" href="{root}assets/style.css">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}} body{{margin:0}} img{{max-width:100%}} [hidden]{{display:none!important}}</style>
</head><body>
{relink(shell, root).replace('<nav class="toc" id="toc"></nav>', '<nav class="toc" id="toc">' + toc(sid, root) + '</nav>')}
<main id="main">
{relink(sec_html, root)}
</main>
<script>window.ROOT="{root or "./"}";</script>
<script src="{root}assets/data.js"></script><script src="{root}assets/site.js"></script>{redirect}<script src="{root}assets/app.js"></script><script src="{root}assets/figs.js"></script>
</body></html>
"""
    dest = OUT / slug_of[sid] if slug_of[sid] else OUT
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "index.html").write_text(page, encoding="utf-8")

today = date.today().isoformat()
(OUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{BASE}{slug_of[s[0]] + '/' if slug_of[s[0]] else ''}</loc><lastmod>{today}</lastmod></url>\n" for s in sections) + "</urlset>\n", encoding="utf-8")
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n", encoding="utf-8")
(OUT / ".nojekyll").write_text("", encoding="utf-8")
print(f"built {len(sections)} pages into {OUT} and the single-page version into {ART / 'index.html'}"
      + (f" with {len(WARN)} warning(s)" if WARN else ""))
