#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const homeScriptPath = path.join(root, "assets", "js", "home.js");
const templatePath = path.join(root, "beats", "po-mans-dreams", "index.html");

const homeScript = fs.readFileSync(homeScriptPath, "utf8");
const template = fs.readFileSync(templatePath, "utf8");

const beatPattern =
  /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*bpm:\s*(\d+),\s*key:\s*"([^"]+)",\s*tags:\s*\[([^\]]*)\][\s\S]*?audioSrc:\s*"([^"]+)"/g;

const beats = [];
for (const match of homeScript.matchAll(beatPattern)) {
  beats.push({
    id: match[1],
    title: match[2],
    bpm: Number(match[3]),
    key: match[4],
    tags: JSON.parse(`[${match[5]}]`),
    audioSrc: match[6],
    slug: match[6].replace(/\.mp3$/i, ""),
  });
}

if (beats.length !== 24) {
  throw new Error(`Expected 24 beats in assets/js/home.js, found ${beats.length}.`);
}

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");

for (const beat of beats) {
  const escapedTitle = escapeHtml(beat.title);
  const tagSummary = beat.tags.join(", ");
  const tagJson = beat.tags.map((tag) => JSON.stringify(tag)).join(", ");
  const tagHtml = beat.tags
    .map((tag) => `<span class="tag mono">${escapeHtml(tag)}</span>`)
    .join("");

  const page = template
    .replaceAll("Po&#x27; Man&#x27;s Dreams", escapedTitle)
    .replaceAll("Po' Man's Dreams", beat.title)
    .replaceAll("po-mans-dreams", beat.slug)
    .replaceAll("dark, angelic", tagSummary)
    .replaceAll('"dark", "angelic"', tagJson)
    .replaceAll(
      '<span class="tag mono">dark</span><span class="tag mono">angelic</span>',
      tagHtml,
    )
    .replaceAll("85 BPM", `${beat.bpm} BPM`)
    .replaceAll("85 bpm", `${beat.bpm} bpm`)
    .replaceAll("A min", beat.key);

  const outputDir = path.join(root, "beats", beat.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), page);
}

console.log(`Generated ${beats.length} beat pages.`);
