#!/usr/bin/env python3
"""
add_beat.py — compresses a source audio file to a site-ready MP3 and
scaffolds a beat_data/*.json entry for build_site.py to pick up.

Usage:
  python3 tools/add_beat.py <source_audio> <slug> <title> <bpm> <key> <tag1> [tag2] [tag3] ... --filter "<filter group>"

Example:
  python3 tools/add_beat.py /path/to/raw.wav midnight-drive "Midnight Drive" 92 "F min" dark moody --filter "in my feelings"

Does not touch index.html. Run build_site.py after this to regenerate the site.
"""
import argparse
import glob
import json
import os
import subprocess
import sys

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEAT_DATA_DIR = os.path.join(SITE_DIR, "beat_data")
sys.path.insert(0, os.path.join(SITE_DIR, "tools"))
from peaks import compute_peaks, compute_loudness

NOTE_FREQ = {
    "c": 261.63, "c#": 277.18, "db": 277.18, "d": 293.66, "d#": 311.13, "eb": 311.13,
    "e": 329.63, "f": 349.23, "f#": 369.99, "gb": 369.99, "g": 392.00, "g#": 415.30,
    "ab": 415.30, "a": 440.00, "a#": 466.16, "bb": 466.16, "b": 493.88,
}


def root_from_key(key):
    """Parse e.g. 'G min', 'F# maj', 'Bb minor' -> root frequency in Hz. Falls back to 220 (A3)."""
    note = key.strip().split()[0].lower()
    return round(NOTE_FREQ.get(note, 220.0), 2)


def next_id():
    existing = sorted(glob.glob(os.path.join(BEAT_DATA_DIR, "*.json")))
    if not existing:
        return "01"
    last = json.load(open(existing[-1]))
    return f"{int(last['id']) + 1:02d}"


def compress(source, slug):
    out_path = os.path.join(SITE_DIR, f"{slug}.mp3")
    if os.path.abspath(source) == os.path.abspath(out_path):
        print("Source and output path are identical — rename the source file first.")
        sys.exit(1)
    cmd = [
        "ffmpeg", "-y", "-i", source,
        "-codec:a", "libmp3lame", "-b:a", "128k", "-ar", "44100",
        out_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ffmpeg failed:", result.stderr[-800:])
        sys.exit(1)
    size = os.path.getsize(out_path)
    print(f"Compressed: {out_path} ({size/1024/1024:.1f} MB)")
    return out_path


def main():
    p = argparse.ArgumentParser()
    p.add_argument("source")
    p.add_argument("slug")
    p.add_argument("title")
    p.add_argument("bpm", type=int)
    p.add_argument("key")
    p.add_argument("tags", nargs="+")
    p.add_argument("--filter", required=True, dest="filter_group",
                    help="One filter group: in my feelings / vibe out / turn up / outside the box")
    p.add_argument("--root", type=float, default=None,
                    help="Root frequency in Hz for demo tone fallback (default: derived from --key)")
    args = p.parse_args()

    if not os.path.isfile(args.source):
        print("Source file not found:", args.source)
        sys.exit(1)

    beat_id = next_id()
    mp3_path = compress(args.source, args.slug)
    mp3_name = os.path.basename(mp3_path)

    data = {
        "id": beat_id,
        "slug": args.slug,
        "title": args.title,
        "bpm": args.bpm,
        "key": args.key,
        "tags": args.tags,
        "filterTags": [args.filter_group],
        "audioSrc": mp3_name,
        "root": args.root if args.root is not None else root_from_key(args.key),
        "peaks": compute_peaks(mp3_path),
        "loudness": compute_loudness(mp3_path),
    }

    json_path = os.path.join(BEAT_DATA_DIR, f"{beat_id}-{args.slug}.json")
    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {json_path}")
    print("Run tools/build_site.py next to apply it to index.html.")


if __name__ == "__main__":
    main()
