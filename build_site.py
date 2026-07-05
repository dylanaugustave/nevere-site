#!/usr/bin/env python3
"""
build_site.py — regenerates index.html's beat sections and sitemap.xml
from nevere-site/beat_data/*.json. Single source of truth per beat.

Usage: python3 tools/build_site.py
Run from inside nevere-site/.
"""
import json
import glob
import os
import re
import statistics
import sys

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(SITE_DIR, "index.html")
SITEMAP = os.path.join(SITE_DIR, "sitemap.xml")
DOMAIN = "https://neverebeats.com"


def load_beats():
    beats = []
    for path in sorted(glob.glob(os.path.join(SITE_DIR, "beat_data", "*.json"))):
        with open(path) as f:
            beats.append(json.load(f))
    beats.sort(key=lambda b: b["id"])
    return beats


def check_files(beats):
    missing = []
    for b in beats:
        audio_path = os.path.join(SITE_DIR, b["audioSrc"])
        if not os.path.isfile(audio_path):
            missing.append(b["audioSrc"])
    if missing:
        print("MISSING AUDIO FILES (not on disk):")
        for m in missing:
            print("  -", m)
        sys.exit(1)


def js_str_list(items):
    return "[" + ", ".join(f'"{i}"' for i in items) + "]"


def build_beats_array(beats):
    lines = ['    // BUILD:BEATS_ARRAY_START']
    for b in beats:
        peaks_js = json.dumps(b.get("peaks", []))
        loudness = b.get("loudness", 4000)
        lufs = b.get("lufs", -18.0)
        lines.append(
            f'    {{ id: "{b["id"]}", title: "{b["title"]}", bpm: {b["bpm"]}, '
            f'key: "{b["key"]}", tags: {js_str_list(b["tags"])}, '
            f'filterTags: {js_str_list(b["filterTags"])}, price: 0, '
            f'audioSrc: "{b["audioSrc"]}", root: {b["root"]}, peaks: {peaks_js}, loudness: {loudness}, lufs: {lufs} }},'
        )
    lines.append('    // BUILD:BEATS_ARRAY_END')
    return "\n".join(lines)


def build_rows(beats):
    rows = ['      <!-- BUILD:ROWS_START -->']
    for b in beats:
        tags_html = "".join(f'<span class="tag">{t}</span>' for t in b["tags"])
        rows.append(f'''      <div class="track" data-id="{b["id"]}" id="{b["slug"]}">
        <button class="play-btn" aria-label="Play {b["title"]}">
          <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
            <circle class="ring-track" cx="22" cy="22" r="20.5"/>
            <circle class="ring-progress" cx="22" cy="22" r="20.5"/>
          </svg>
          <svg class="icon-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
          <svg class="icon-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>
        </button>
        <div class="track-main">
          <h3 class="track-title">{b["title"]}</h3>
          <div class="track-tags">{tags_html}</div>
          <div class="track-meta-mobile mono">{b["bpm"]} bpm · {b["key"]}</div>
        </div>
        <div class="wf" data-bpm="{b["bpm"]}"></div>
        <div class="track-meta mono"><span>{b["bpm"]} bpm</span><span>{b["key"]}</span></div>
        <a class="track-dl mono" href="{b["audioSrc"]}" download title="Free download — credit prod. nevere">download</a>
        <button class="track-share mono" data-share="{b["slug"]}" title="Copy link to this beat">share</button>
      </div>''')
    rows.append('      <!-- BUILD:ROWS_END -->')
    return "\n".join(rows)


def build_jsonld_recordings(beats):
    entries = []
    for b in beats:
        entries.append({
            "@type": "MusicRecording",
            "name": b["title"],
            "url": f"{DOMAIN}/#{b['slug']}",
            "genre": b["tags"],
            "byArtist": {"@id": f"{DOMAIN}/#person"},
        })
    return entries


def update_index(beats):
    with open(INDEX) as f:
        html = f.read()

    # 1. BEATS array
    array_pat = re.compile(
        r"    // BUILD:BEATS_ARRAY_START.*?// BUILD:BEATS_ARRAY_END", re.DOTALL
    )
    assert array_pat.search(html), "BEATS_ARRAY markers not found"
    html = array_pat.sub(build_beats_array(beats), html)

    # 1b. static track-count fallback (before JS runs)
    count_pat = re.compile(r'(id="track-count">)\d+( tracks</span>)')
    assert count_pat.search(html), "track-count span not found"
    html = count_pat.sub(rf"\g<1>{len(beats)}\g<2>", html)

    # 2. static rows
    rows_pat = re.compile(
        r"      <!-- BUILD:ROWS_START -->.*?<!-- BUILD:ROWS_END -->", re.DOTALL
    )
    assert rows_pat.search(html), "ROWS markers not found"
    html = rows_pat.sub(build_rows(beats), html)

    # 3. JSON-LD: replace everything after the Person object within @graph
    ld_pat = re.compile(
        r'(<script type="application/ld\+json">\s*\{\s*"@context":.*?"@graph":\s*\[\s*\{.*?"knowsAbout":\s*\[[^\]]*\]\s*\},\s*)'
        r'.*?'
        r'(\s*\]\s*\}\s*</script>)',
        re.DOTALL,
    )
    m = ld_pat.search(html)
    assert m, "JSON-LD block not found"
    recordings = build_jsonld_recordings(beats)
    rec_json = ",\n    ".join(json.dumps(r, indent=6)[1:-1].strip() for r in recordings)
    rec_blocks = ",\n".join(
        "    " + json.dumps(r, indent=6).replace("\n", "\n") for r in recordings
    )
    html = html[: m.start()] + m.group(1) + "\n" + rec_blocks + m.group(2) + html[m.end():]

    with open(INDEX, "w") as f:
        f.write(html)


def update_sitemap(beats):
    urls = [f"{DOMAIN}/", f"{DOMAIN}/terms.html"]
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        lines.append(f"  <url>\n    <loc>{u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>")
    lines.append("</urlset>")
    with open(SITEMAP, "w") as f:
        f.write("\n".join(lines) + "\n")


def bump_version(html_path):
    with open(html_path) as f:
        html = f.read()
    m = re.search(r">v(\d+)<", html)
    if m:
        new_v = int(m.group(1)) + 1
        html = html.replace(f">v{m.group(1)}<", f">v{new_v}<")
        with open(html_path, "w") as f:
            f.write(html)
        return new_v
    return None


if __name__ == "__main__":
    beats = load_beats()
    print(f"Loaded {len(beats)} beats from beat_data/")
    check_files(beats)
    update_index(beats)
    update_sitemap(beats)
    v = bump_version(INDEX)
    print(f"index.html and sitemap.xml regenerated. Version bumped to v{v}.")
    print(f"Track count: {len(beats)}")
