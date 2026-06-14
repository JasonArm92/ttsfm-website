#!/usr/bin/env python3
"""
Vendor all TTS FM photography into the repo and rewrite the site to use
local copies instead of hot-linking ttsfm.co.uk.

WHY: the live site hot-links images from the WordPress server. That makes the
site depend on a third party, and it blocks any environment (like Claude Code
on the web) that can't reach that server. Vendoring the images fixes both.

WHAT IT DOES:
  1. Enumerates every photo via the WordPress REST API (all media), plus every
     image already referenced in the repo's HTML.
  2. Downloads each into assets/img/.
  3. Rewrites every HTML file so remote ttsfm.co.uk image URLs point at the
     local copy (path computed relative to each file).

HOW TO RUN (needs internet access to ttsfm.co.uk):
    python3 tools/scrape_images.py
Then commit the new assets/img/ folder and the edited HTML.

Safe to re-run: existing downloads are skipped; rewrites are idempotent.
"""
import os, re, sys, json, time, urllib.parse, urllib.request

ROOT     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR  = os.path.join(ROOT, "assets", "img")
SITE     = "https://ttsfm.co.uk"
UA       = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
EXT_RE   = re.compile(r"\.(jpe?g|png|webp|avif|gif|svg)$", re.I)
URL_RE   = re.compile(r"https://[^\"'() ]*ttsfm\.co\.uk[^\"'() ]*?"
                      r"\.(?:jpe?g|png|webp|avif|gif|svg)", re.I)


def fetch(url, binary=False, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA, "Referer": SITE + "/",
                "Accept": "*/*", "Accept-Language": "en-GB,en;q=0.9"})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read() if binary else r.read().decode("utf-8", "replace")
        except Exception as e:
            print(f"  retry {i+1}/{tries} {url} ({e})", file=sys.stderr)
            time.sleep(2 * (i + 1))
    return None


def discover_from_wp():
    """All media items from the WordPress REST API (gets the whole library)."""
    urls, page = set(), 1
    while True:
        body = fetch(f"{SITE}/wp-json/wp/v2/media?per_page=100&page={page}")
        if not body:
            break
        try:
            items = json.loads(body)
        except json.JSONDecodeError:
            break
        if not isinstance(items, list) or not items:
            break
        for it in items:
            src = it.get("source_url", "")
            if EXT_RE.search(src):
                urls.add(src)
        page += 1
        if page > 50:
            break
    return urls


def discover_from_html():
    urls = set()
    for dirpath, _, files in os.walk(ROOT):
        if ".git" in dirpath:
            continue
        for fn in files:
            if fn.endswith(".html"):
                with open(os.path.join(dirpath, fn), encoding="utf-8") as f:
                    urls.update(URL_RE.findall(f.read()))
    return urls


def local_name(url):
    base = os.path.basename(urllib.parse.urlparse(url).path)
    base = urllib.parse.unquote(base).replace(" ", "-")
    return re.sub(r"[^A-Za-z0-9._-]", "-", base)


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    print("Discovering images…")
    urls = discover_from_wp() | discover_from_html()
    print(f"  found {len(urls)} unique image URLs")
    if not urls:
        print("No URLs found — is the network reachable to ttsfm.co.uk?")
        sys.exit(1)

    url_to_local = {}
    for url in sorted(urls):
        name = local_name(url)
        dest = os.path.join(IMG_DIR, name)
        url_to_local[url] = name
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            continue
        data = fetch(url, binary=True)
        if data:
            with open(dest, "wb") as f:
                f.write(data)
            print(f"  ↓ {name} ({len(data)//1024} KB)")
        else:
            print(f"  ✗ FAILED {url}")

    # Rewrite HTML references → local relative paths
    print("Rewriting HTML references…")
    for dirpath, _, files in os.walk(ROOT):
        if ".git" in dirpath:
            continue
        for fn in files:
            if not fn.endswith(".html"):
                continue
            path = os.path.join(dirpath, fn)
            with open(path, encoding="utf-8") as f:
                html = f.read()
            rel = os.path.relpath(IMG_DIR, dirpath).replace(os.sep, "/")
            changed = html
            for url, name in url_to_local.items():
                changed = changed.replace(url, f"{rel}/{name}")
            if changed != html:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(changed)
                print(f"  ✎ {os.path.relpath(path, ROOT)}")

    print("Done. Review, then commit assets/img/ and the edited HTML.")


if __name__ == "__main__":
    main()
