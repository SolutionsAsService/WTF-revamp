"""Build the static site: wraps each _src/pages/*.html in _src/layout.html.

Each page starts with a header block:

    title: Page title
    description: Meta description
    nav: circle          (which nav item is current; optional)
    ---
    <page html>

Run from anywhere:  python _src/build.py
Output is written to the repository root (index.html, circle.html, ...).
"""
import pathlib
import re

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
NAV = ["circle", "gatherings", "venue", "manifesto", "apply"]

layout = (SRC / "layout.html").read_text(encoding="utf-8")

for page in sorted((SRC / "pages").glob("*.html")):
    head, body = page.read_text(encoding="utf-8").split("\n---\n", 1)
    meta = dict(line.split(": ", 1) for line in head.strip().splitlines())
    html = layout.replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
    for key in NAV:
        html = html.replace("{{cur:%s}}" % key, ' aria-current="page"' if meta.get("nav") == key else "")
    html = html.replace("{{content}}", body.rstrip())
    assert not re.search(r"\{\{.*?\}\}", html), f"unfilled placeholder in {page.name}"
    (ROOT / page.name).write_text(html, encoding="utf-8", newline="\n")
    print("built", page.name)
