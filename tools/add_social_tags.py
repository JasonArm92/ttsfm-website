#!/usr/bin/env python3
"""Inject Open Graph + Twitter Card meta tags into every page's <head>.

These tags control the preview (title, description, image) shown when a page
link is shared on social platforms and messaging apps. They are invisible on
the page itself, so there is no visual risk. Idempotent: pages that already
have og:title are skipped.
"""
import glob, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = "https://ttsfm.co.uk/wp-content/uploads/2020/06/logo.png"

for path in glob.glob(os.path.join(ROOT, "*.html")):
    html = open(path, encoding="utf-8").read()
    if "og:title" in html:
        continue
    t = re.search(r"<title>(.*?)</title>", html, re.S)
    d = re.search(r'<meta\s+name="description"\s+content="(.*?)"\s*/?>', html, re.S)
    if not t or not d:
        print(f"  skip (no title/description): {os.path.basename(path)}")
        continue
    title, desc = t.group(1).strip(), d.group(1).strip()
    block = (
        '\n<!-- Open Graph / social sharing -->\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:site_name" content="TTS FM (UK)">\n'
        f'<meta property="og:title" content="{title}">\n'
        f'<meta property="og:description" content="{desc}">\n'
        f'<meta property="og:image" content="{LOGO}">\n'
        '<meta name="twitter:card" content="summary">\n'
        f'<meta name="twitter:title" content="{title}">\n'
        f'<meta name="twitter:description" content="{desc}">\n'
        f'<meta name="twitter:image" content="{LOGO}">'
    )
    # insert right after the description meta tag
    new = re.sub(r'(<meta\s+name="description"[^>]*>)', r'\1' + block, html, count=1)
    open(path, "w", encoding="utf-8").write(new)
    print(f"  ✎ {os.path.basename(path)}")

print("Done.")
