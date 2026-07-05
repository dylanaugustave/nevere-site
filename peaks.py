"""
peaks.py — computes normalized waveform peak data for a beat's audio file.
Used by add_beat.py at ingest and can backfill existing beat_data JSONs:

  python3 tools/peaks.py            # backfill all beat_data/*.json missing peaks
  python3 tools/peaks.py --force    # recompute for all beats
"""
import glob
import json
import math
import os
import subprocess
import sys
from array import array

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NUM_BARS = 28
FLOOR = 0.12


def compute_peaks(audio_path, num_bars=NUM_BARS):
    """Decode audio to mono 8kHz PCM via ffmpeg, return num_bars RMS peaks in 0..1."""
    samples = _decode(audio_path)
    n = len(samples)
    bucket = n // num_bars
    peaks = []
    for i in range(num_bars):
        seg = samples[i * bucket : (i + 1) * bucket]
        rms = _rms(seg)
        peaks.append(rms)
    top = max(peaks) or 1.0
    return [round(max(FLOOR, p / top), 2) for p in peaks]


def compute_lufs(audio_path):
    """Return integrated LUFS (input_i) via ffmpeg's loudnorm filter, EBU R128."""
    cmd = [
        "ffmpeg", "-i", audio_path,
        "-af", "loudnorm=print_format=json",
        "-f", "null", "-",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    stderr = result.stderr
    start = stderr.rfind("{")
    end = stderr.rfind("}") + 1
    if start == -1 or end == 0:
        raise RuntimeError("loudnorm JSON not found in ffmpeg output")
    data = json.loads(stderr[start:end])
    return round(float(data["input_i"]), 2)


def compute_loudness(audio_path):
    """Return overall RMS (0..32767 scale) for the full track. Used for volume normalization."""
    samples = _decode(audio_path)
    return round(_rms(samples), 1)


def _decode(audio_path):
    cmd = [
        "ffmpeg", "-v", "error", "-i", audio_path,
        "-ac", "1", "-ar", "8000", "-f", "s16le", "-",
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        raise RuntimeError("ffmpeg decode failed: " + result.stderr.decode()[-400:])
    samples = array("h")
    samples.frombytes(result.stdout[: len(result.stdout) // 2 * 2])
    if not samples:
        raise RuntimeError("no audio samples decoded")
    return samples


def _rms(seg):
    if not seg:
        return 0.0
    return math.sqrt(sum(s * s for s in seg) / len(seg))


def backfill(force=False):
    for path in sorted(glob.glob(os.path.join(SITE_DIR, "beat_data", "*.json"))):
        with open(path) as f:
            data = json.load(f)
        needs_peaks = "peaks" not in data or force
        needs_loudness = "loudness" not in data or force
        needs_lufs = "lufs" not in data or force
        if not needs_peaks and not needs_loudness and not needs_lufs:
            continue
        audio = os.path.join(SITE_DIR, data["audioSrc"])
        if needs_peaks:
            data["peaks"] = compute_peaks(audio)
        if needs_loudness:
            data["loudness"] = compute_loudness(audio)
        if needs_lufs:
            data["lufs"] = compute_lufs(audio)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print(f"updated: {os.path.basename(path)}")


if __name__ == "__main__":
    backfill(force="--force" in sys.argv)
