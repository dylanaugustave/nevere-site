(() => {
  "use strict";

  const page = document.body;
  if (!page.classList.contains("home-page")) return;
  if (page.dataset.homeInitialized === "true") return;
  page.dataset.homeInitialized = "true";

  // Normal refreshes start at the top; beat-specific hash links keep their direct-link behavior.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  if (!location.hash) {
    window.scrollTo(0, 0);
    window.addEventListener("pageshow", () => window.scrollTo(0, 0), { once: true });
  }
  const BEATS = [
    // BUILD:BEATS_ARRAY_START
    { id: "01", title: "Po' Man's Dreams", bpm: 85, key: "A min", tags: ["dark", "angelic"], filterTags: ["in my feelings"], price: 0, audioSrc: "po-mans-dreams.mp3", root: 220, peaks: [0.3, 0.61, 0.89, 0.78, 0.88, 0.88, 0.74, 0.74, 0.81, 1.0, 0.92, 0.93, 0.93, 0.96, 0.77, 0.74, 0.99, 0.95, 0.92, 0.97, 0.92, 0.92, 0.95, 0.98, 0.95, 0.89, 0.94, 0.12], loudness: 1994.5, lufs: -25.03 },
    { id: "02", title: "Off Air", bpm: 76, key: "A min", tags: ["mellow", "hazy", "lo-fi"], filterTags: ["vibe out"], price: 0, audioSrc: "off-air.mp3", root: 196, peaks: [0.31, 0.7, 0.66, 0.78, 0.94, 0.89, 0.91, 1.0, 0.94, 0.9, 1.0, 0.94, 0.9, 0.91, 0.35, 0.34, 0.3, 0.79, 0.93, 0.89, 0.93, 0.99, 0.94, 0.9, 0.63, 0.17, 0.18, 0.19], loudness: 10657.9, lufs: -12.83 },
    { id: "03", title: "Moon Phase", bpm: 87, key: "C maj", tags: ["spacey", "melodic"], filterTags: ["vibe out"], price: 0, audioSrc: "moon-phase.mp3", root: 262, peaks: [0.16, 0.15, 0.16, 0.16, 0.15, 0.16, 0.85, 0.95, 0.96, 0.91, 1.0, 0.9, 1.0, 0.93, 0.95, 0.96, 0.92, 0.96, 0.34, 0.56, 0.94, 0.95, 0.96, 0.91, 1.0, 0.9, 0.89, 0.16], loudness: 2756.6, lufs: -20.66 },
    { id: "04", title: "Second Wind", bpm: 88, key: "A min", tags: ["raw", "sample-based"], filterTags: ["in my feelings"], price: 0, audioSrc: "second-wind.mp3", root: 220, peaks: [0.12, 0.12, 0.41, 0.41, 0.46, 0.46, 0.68, 0.93, 0.96, 1.0, 1.0, 0.97, 0.94, 0.67, 0.7, 0.99, 0.94, 0.96, 1.0, 1.0, 0.99, 0.95, 0.97, 1.0, 0.99, 0.96, 0.94, 0.45], loudness: 5049.8, lufs: -17.96 },
    { id: "05", title: "Motion Carried", bpm: 130, key: "D maj", tags: ["anthem", "triumphant"], filterTags: ["turn up"], price: 0, audioSrc: "motion-carried.mp3", root: 294, peaks: [0.89, 0.98, 0.92, 0.97, 0.92, 0.94, 0.96, 0.87, 0.79, 0.68, 0.86, 0.81, 0.89, 0.95, 0.89, 1.0, 0.92, 0.97, 0.92, 0.93, 0.86, 0.73, 0.8, 0.76, 0.87, 0.77, 0.57, 0.12], loudness: 4858.0, lufs: -15.57 },
    { id: "06", title: "Left Field", bpm: 89, key: "Bb min", tags: ["experimental", "off-kilter"], filterTags: ["outside the box"], price: 0, audioSrc: "left-field.mp3", root: 233, peaks: [0.24, 0.21, 0.21, 0.6, 0.68, 0.75, 0.82, 0.91, 0.97, 0.98, 0.98, 0.84, 1.0, 0.96, 0.25, 0.21, 0.21, 0.26, 0.19, 0.24, 0.22, 0.91, 0.97, 0.95, 0.96, 0.85, 0.99, 1.0], loudness: 3923.0, lufs: -18.96 },
    { id: "07", title: "Channel Crossing", bpm: 120, key: "A maj", tags: ["atmospheric", "steady"], filterTags: ["vibe out"], price: 0, audioSrc: "channel-crossing.mp3", root: 220, peaks: [0.71, 0.74, 0.79, 0.69, 0.81, 0.9, 0.96, 0.97, 1.0, 0.98, 0.96, 1.0, 0.84, 0.71, 0.72, 0.87, 0.96, 0.96, 0.98, 0.92, 0.91, 0.9, 0.76, 0.7, 0.7, 0.72, 0.46, 0.12], loudness: 4640.0, lufs: -14.15 },
    { id: "08", title: "Detour", bpm: 98, key: "C maj", tags: ["experimental", "shifting structure"], filterTags: ["outside the box"], price: 0, audioSrc: "detour.mp3", root: 262, peaks: [0.33, 0.33, 0.34, 0.28, 0.54, 0.54, 0.55, 0.53, 0.57, 0.44, 0.43, 0.51, 0.54, 0.56, 0.57, 0.53, 0.12, 0.7, 0.83, 0.9, 0.88, 1.0, 0.92, 0.99, 0.89, 1.0, 0.89, 0.38], loudness: 4370.4, lufs: -16.28 },
    { id: "09", title: "Ripe", bpm: 90, key: "Eb min", tags: ["afrobeat", "tropical"], filterTags: ["vibe out"], price: 0, audioSrc: "ripe.mp3", root: 233, peaks: [0.72, 0.79, 1.0, 0.79, 1.0, 0.79, 0.76, 0.36, 0.36, 0.35, 0.73, 0.8, 1.0, 0.8, 1.0, 0.8, 0.34, 0.36, 0.34, 0.36, 1.0, 0.8, 1.0, 0.8, 1.0, 0.63, 0.71, 0.17], loudness: 3625.7, lufs: -18.32 },
    { id: "10", title: "Airtime", bpm: 115, key: "D maj", tags: ["polished", "melodic"], filterTags: ["vibe out"], price: 0, audioSrc: "airtime.mp3", root: 294, peaks: [0.16, 0.41, 0.57, 0.72, 0.72, 0.73, 0.67, 0.26, 0.37, 0.57, 0.73, 0.73, 0.71, 0.72, 0.72, 0.29, 0.35, 0.49, 0.72, 0.72, 0.72, 0.72, 0.75, 0.55, 0.53, 0.84, 1.0, 0.48], loudness: 3909.7, lufs: -17.39 },
    { id: "11", title: "Prom Night", bpm: 83, key: "B maj", tags: ["woozy", "dreamlike", "faded"], filterTags: ["vibe out"], price: 0, audioSrc: "prom-night.mp3", root: 247, peaks: [0.91, 0.9, 0.94, 0.96, 0.91, 0.94, 0.96, 0.92, 0.92, 0.97, 0.92, 0.9, 0.98, 0.89, 0.9, 0.99, 0.92, 0.89, 0.98, 0.93, 0.84, 1.0, 0.96, 0.84, 0.99, 0.82, 0.26, 0.12], loudness: 3776.2, lufs: -16.74 },
    { id: "12", title: "Long Way Up", bpm: 82, key: "F min", tags: ["spiritual", "intimate", "slow burner"], filterTags: ["in my feelings"], price: 0, audioSrc: "long-way-up.mp3", root: 220, peaks: [0.12, 0.12, 0.12, 0.17, 0.4, 0.44, 0.41, 0.44, 0.4, 0.44, 0.41, 0.41, 0.12, 0.12, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.55], loudness: 3177.0, lufs: -19.02 },
    { id: "13", title: "Red", bpm: 124, key: "Ab maj", tags: ["hard-hitting", "bright", "trap"], filterTags: ["turn up"], price: 0, audioSrc: "red-beat.mp3", root: 220, peaks: [0.89, 0.79, 0.85, 0.82, 0.79, 0.95, 0.76, 1.0, 0.9, 0.94, 0.94, 0.88, 1.0, 0.87, 0.88, 0.87, 0.86, 0.87, 0.91, 0.97, 0.92, 0.95, 0.97, 0.93, 0.86, 0.79, 0.88, 0.83], loudness: 5589.0, lufs: -16.86 },
    { id: "14", title: "ET", bpm: 88, key: "A min", tags: ["atmospheric", "chill"], filterTags: ["vibe out"], price: 0, audioSrc: "et.mp3", root: 220, peaks: [0.12, 0.12, 0.53, 0.88, 0.9, 0.76, 0.93, 0.95, 0.88, 0.98, 0.78, 0.94, 0.93, 0.86, 0.92, 0.6, 0.46, 0.58, 0.84, 0.84, 0.89, 1.0, 0.9, 0.91, 0.84, 0.89, 0.9, 0.96], loudness: 3701.8, lufs: -18.3 },
    { id: "15", title: "nyc", bpm: 120, key: "G min", tags: ["chill", "atmospheric", "melodic"], filterTags: ["vibe out"], price: 0, audioSrc: "nyc.mp3", root: 392, peaks: [0.91, 0.89, 1.0, 0.93, 0.92, 0.99, 0.94, 0.95, 0.95, 0.97, 0.92, 0.98, 0.97, 0.92, 0.99, 0.93, 0.95, 0.95, 0.96, 0.93, 0.95, 0.99, 0.89, 0.95, 0.99, 0.92, 0.6, 0.12], loudness: 4802.6, lufs: -17.55 },
    { id: "16", title: "2023", bpm: 103, key: "B min", tags: ["nostalgic", "crisp", "new-age boom-bap"], filterTags: ["vibe out"], price: 0, audioSrc: "2023.mp3", root: 493.88, peaks: [0.92, 0.95, 0.96, 0.22, 0.76, 1.0, 0.9, 0.97, 1.0, 0.89, 0.56, 0.24, 0.22, 0.79, 0.97, 0.97, 0.51, 0.6, 0.97, 0.95, 0.93, 0.98, 0.95, 0.7, 0.19, 0.23, 0.15, 0.12], loudness: 5829.0, lufs: -17.08 },
    { id: "17", title: "Free Bird", bpm: 80, key: "E maj", tags: ["house", "experimental", "tempo shift"], filterTags: ["outside the box"], price: 0, audioSrc: "free-bird.mp3", root: 330, peaks: [0.78, 0.79, 0.84, 0.96, 0.96, 0.85, 0.96, 0.81, 0.89, 0.8, 0.76, 0.35, 0.38, 0.48, 0.48, 0.99, 0.85, 0.9, 1.0, 0.99, 1.0, 0.85, 0.89, 0.99, 0.79, 0.77, 0.83, 0.77], loudness: 5105.8, lufs: -18.12 },
    { id: "18", title: "Oh", bpm: 100, key: "G maj", tags: ["808-heavy", "sample-based", "whimsical"], filterTags: ["turn up"], price: 0, audioSrc: "oh.mp3", root: 196, peaks: [0.93, 0.74, 0.84, 0.74, 0.65, 0.78, 0.74, 0.7, 0.67, 0.83, 0.73, 0.75, 0.78, 0.67, 0.56, 0.73, 0.57, 1.0, 0.75, 0.73, 0.86, 0.74, 0.74, 0.74, 0.66, 0.72, 0.65, 0.61], loudness: 10308.6, lufs: -16.70 },
    { id: "19", title: "Raj", bpm: 87, key: "G maj", tags: ["trap", "melancholic"], filterTags: ["in my feelings"], price: 0, audioSrc: "raj.mp3", root: 196, peaks: [0.19, 0.16, 0.53, 0.69, 0.7, 0.98, 0.97, 0.96, 0.95, 0.21, 0.2, 0.92, 0.96, 0.95, 0.93, 1.0, 0.97, 0.19, 0.2, 0.91, 0.99, 0.94, 0.94, 0.97, 0.98, 0.7, 0.25, 0.22], loudness: 5476.6, lufs: -20.03 },
    { id: "20", title: "Peripheral", bpm: 95, key: "D min", tags: ["lofi", "slow wind-down"], filterTags: ["outside the box"], price: 0, audioSrc: "peripheral.mp3", root: 147, peaks: [0.01, 1.0, 0.91, 0.99, 0.99, 0.91, 0.99, 0.94, 0.98, 0.96, 0.95, 0.59, 0.31, 0.56, 0.98, 0.91, 0.98, 0.9, 0.99, 0.98, 0.92, 0.97, 0.93, 0.59, 0.02, 0.02, 0.02, 0.02], loudness: 5780.1, lufs: -17.32 },
    { id: "21", title: "Sylvan", bpm: 87, key: "B maj", tags: ["flute loop", "unconventional drums"], filterTags: ["outside the box"], price: 0, audioSrc: "sylvan.mp3", root: 247, peaks: [0.85, 0.85, 0.85, 0.86, 0.85, 0.88, 0.88, 0.92, 0.99, 0.97, 0.97, 1.0, 0.97, 0.98, 0.85, 0.89, 0.99, 1.0, 0.97, 0.99, 0.98, 0.96, 0.99, 0.99, 0.97, 0.98, 0.98, 0.99], loudness: 6591.9, lufs: -16.19 },
    { id: "22", title: "Coconut Radio", bpm: 116, key: "C maj", tags: ["tropical", "trap", "hard-hitting"], filterTags: ["vibe out"], price: 0, audioSrc: "coconut-radio.mp3", root: 262, peaks: [0.47, 0.43, 0.48, 0.43, 0.99, 0.8, 0.98, 0.76, 0.74, 0.7, 0.74, 0.72, 0.75, 0.73, 0.74, 0.69, 0.71, 0.63, 0.73, 0.68, 0.97, 0.76, 1.0, 0.77, 0.45, 0.42, 0.45, 0.39], loudness: 5699.1, lufs: -19.60 },
    { id: "23", title: "Monsoon", bpm: 98, key: "B min", tags: ["tropical", "trap"], filterTags: ["turn up"], price: 0, audioSrc: "monsoon.mp3", root: 247, peaks: [0.56, 0.5, 0.69, 0.9, 0.98, 0.85, 0.97, 1.0, 0.9, 0.98, 0.8, 0.97, 1.0, 0.56, 0.9, 0.98, 0.97, 0.85, 1.0, 0.9, 0.98, 0.97, 0.85, 1.0, 0.88, 0.57, 0.42, 0.05], loudness: 7191.6, lufs: -15.60 },
    { id: "24", title: "Ceiling Fan", bpm: 150, key: "G min", tags: ["chill", "melodic"], filterTags: ["vibe out"], price: 0, audioSrc: "ceiling-fan.mp3", root: 196, peaks: [0.17, 0.19, 0.13, 0.73, 0.67, 0.66, 1.0, 0.92, 0.92, 0.98, 0.91, 0.93, 0.92, 0.65, 0.67, 1.0, 0.91, 0.92, 0.98, 0.96, 0.93, 0.97, 0.96, 0.92, 0.97, 0.96, 0.54, 0.06], loudness: 8912.8, lufs: -15.93 },
    // BUILD:BEATS_ARRAY_END
  ];

  const TIERS = [
    { name: "Free Lease", price: "$0", points: ["Untagged MP3", "Non-exclusive use", "Must credit prod. nevere", "No resale of the beat itself"] },
    { name: "Exclusive", price: "Contact for pricing", points: ["Exclusive licenses and custom terms available", "Unlimited use, credit still required", "Beat removed from catalog", "Message to discuss terms"] },
  ];

  // ---- render catalog ----
  const trackList = document.getElementById("track-list");
  function animateCount(el, target, suffix) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = "0" + suffix; // hold at 0 during the settle delay so nothing flashes early
    const settleDelay = 400; // lets layout/fonts/paint settle before counting starts, so it's actually seen
    const duration = 1400;
    setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, settleDelay);
  }
  animateCount(document.getElementById("track-count"), BEATS.length, " tracks");
  // pageshow + persisted catches back/forward-cache restores (e.g. Safari swipe-back),
  // which reuse the page without re-running the script, so the plain call above alone would miss those.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      animateCount(document.getElementById("track-count"), BEATS.length, " tracks");
    }
  });

  // rows are static HTML (for SEO); JS generates the waveform bars from real peak data
  document.querySelectorAll(".wf[data-bpm]").forEach((wf) => {
    const row = wf.closest(".track");
    const beat = row ? BEATS.find(b => b.id === row.dataset.id) : null;
    const peaks = beat && Array.isArray(beat.peaks) ? beat.peaks : null;
    wf.innerHTML = Array.from({ length: 28 }, (_, i) => {
      const p = peaks ? peaks[i] : 0.5;
      const h = Math.round(4 + p * 18); // same 4–22px range the live analyser uses
      const delay = (i * 0.09).toFixed(2); // stagger so bars don't sway in lockstep
      return `<span class="wf-bar idle" style="height:${h}px; animation-delay:-${delay}s;"></span>`;
    }).join("");
  });

  // ---- filter and sort ----
  const filterTagsEl = document.getElementById("filter-tags");

let activeTag = null;

  const filterToggle = document.getElementById("filter-toggle");
  filterToggle.addEventListener("click", () => {
    const open = filterTagsEl.hidden;
    if (open) {
      filterTagsEl.hidden = false;
      filterTagsEl.classList.add("entering");
      requestAnimationFrame(() => requestAnimationFrame(() => filterTagsEl.classList.remove("entering")));
    } else {
      filterTagsEl.classList.add("entering");
      filterTagsEl.addEventListener("transitionend", function hide() {
        filterTagsEl.hidden = true;
        filterTagsEl.removeEventListener("transitionend", hide);
      }, { once: true });
    }
    filterToggle.setAttribute("aria-expanded", open);
    filterToggle.classList.toggle("active", open);
  });

  const allTags = [...new Set(BEATS.flatMap(b => b.filterTags))];
  allTags.forEach(tag => {
    const count = BEATS.filter(b => b.filterTags.includes(tag)).length;
    const btn = document.createElement("button");
    btn.className = "filter-tag";
    btn.dataset.tag = tag;
    btn.textContent = `${tag} (${count})`;
    btn.addEventListener("click", () => {
      activeTag = activeTag === tag ? null : tag;
      document.querySelectorAll(".filter-tag[data-tag]").forEach(b => b.classList.toggle("active", b.dataset.tag === activeTag));
      applyFilter();
    });
    filterTagsEl.appendChild(btn);
  });

  function applyFilter() {
    let visible = 0;
    BEATS.forEach(beat => {
      const row = document.querySelector(`.track[data-id="${beat.id}"]`);
      const show = !activeTag || beat.filterTags.includes(activeTag);
      row.classList.toggle("filtered-out", !show);
      if (show) visible++;
    });
    document.getElementById("track-count").textContent = visible + (visible === 1 ? " track" : " tracks");
    visibleLimit = PAGE_SIZE;
    applyPagination();
  }

  const PAGE_SIZE = 10;
  let visibleLimit = PAGE_SIZE;
  const loadMoreBtn = document.getElementById("load-more");

  function applyPagination() {
    let shown = 0;
    const rows = [...trackList.querySelectorAll(".track")];
    let matchCount = 0;
    rows.forEach(row => {
      if (!row.classList.contains("filtered-out")) matchCount++;
    });
    rows.forEach(row => {
      if (row.classList.contains("filtered-out")) {
        row.classList.add("hidden");
        return;
      }
      shown++;
      row.classList.toggle("hidden", shown > visibleLimit);
    });
    if (matchCount <= visibleLimit) {
      loadMoreBtn.hidden = true;
    } else {
      loadMoreBtn.hidden = false;
      const remaining = Math.min(PAGE_SIZE, matchCount - visibleLimit);
      loadMoreBtn.textContent = `load more (${remaining})`;
    }
  }

  loadMoreBtn.addEventListener("click", () => {
    loadMoreBtn.blur();
    visibleLimit += PAGE_SIZE;
    applyPagination();
  });

  const sortToggle = document.getElementById("sort-toggle");
  const sortPanel = document.getElementById("sort-panel");
  const sortToggleLabel = document.getElementById("sort-toggle-label");

  function applySort(mode) {
    const sorted = [...BEATS];
    if (mode === "bpm-asc") sorted.sort((a, b) => a.bpm - b.bpm);
    else if (mode === "bpm-desc") sorted.sort((a, b) => b.bpm - a.bpm);
    else if (mode === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => b.id.localeCompare(a.id)); // newest first
    sorted.forEach(beat => {
      const row = document.querySelector(`.track[data-id="${beat.id}"]`);
      trackList.appendChild(row);
    });
    applyPagination();
  }

  function closeSortPanel() {
    if (sortPanel.hidden) return;
    sortPanel.classList.add("entering");
    sortPanel.addEventListener("transitionend", function hide() {
      sortPanel.hidden = true;
      sortPanel.removeEventListener("transitionend", hide);
    }, { once: true });
    sortToggle.setAttribute("aria-expanded", "false");
  }

  function openSortPanel() {
    sortPanel.hidden = false;
    sortPanel.classList.add("entering");
    requestAnimationFrame(() => requestAnimationFrame(() => sortPanel.classList.remove("entering")));
    sortToggle.setAttribute("aria-expanded", "true");
  }

  sortToggle.addEventListener("click", () => {
    if (sortPanel.hidden) openSortPanel(); else closeSortPanel();
  });

  sortPanel.querySelectorAll(".sort-option").forEach(opt => {
    opt.addEventListener("click", () => {
      const label = opt.textContent.trim();
      sortPanel.querySelectorAll(".sort-option").forEach(o => {
        o.classList.remove("active");
        o.setAttribute("aria-selected", "false");
        o.querySelector(".check").textContent = "";
      });
      opt.classList.add("active");
      opt.setAttribute("aria-selected", "true");
      opt.querySelector(".check").textContent = "✓";
      sortToggleLabel.textContent = label;
      closeSortPanel();
      applySort(opt.dataset.value);
    });
  });

  document.addEventListener("click", (e) => {
    if (!sortPanel.hidden && !e.target.closest(".sort-dropdown")) closeSortPanel();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sortPanel.hidden) { closeSortPanel(); sortToggle.focus(); }
  });

  // default order: newest first
  [...BEATS].sort((a, b) => b.id.localeCompare(a.id)).forEach(beat => {
    const row = document.querySelector(`.track[data-id="${beat.id}"]`);
    trackList.appendChild(row);
  });
  applyPagination();

  // ---- render licensing tiers ----
  const tierList = document.getElementById("tier-list");
  TIERS.forEach((tier) => {
    const el = document.createElement("div");
    el.className = "tier";
    el.innerHTML = `
      <div class="tier-name mono">${tier.name}</div>
      <div class="tier-price display">${tier.price}</div>
      <ul>${tier.points.map(p => `<li>${p}</li>`).join("")}</ul>
    `;
    tierList.appendChild(el);
  });

  // ---- hero reveal ----
  requestAnimationFrame(() => {
    setTimeout(() => document.getElementById("hero").classList.add("in"), 50);
  });

  // ---- section reveal on scroll ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // ---- track row stagger reveal on scroll ----
  const trackRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      trackRevealObserver.unobserve(row);
      const visible = [...trackList.querySelectorAll(".track:not(.hidden)")];
      const idx = visible.indexOf(row);
      const delay = Math.min(Math.max(idx, 0) * 45, 400);
      row.style.transitionDelay = delay + "ms";
      requestAnimationFrame(() => {
        row.classList.remove("pending");
        setTimeout(() => { row.style.transitionDelay = ""; }, delay + 550);
      });
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".track").forEach(row => {
    row.classList.add("pending");
    trackRevealObserver.observe(row);
  });

  // ---- playback: real audio if provided, else a synthesized demo tone ----
  let audioCtx = null; // shared context, also used by playDemo
  // loop state now tracked via loopMode ("off" | "full" | "section"), declared with player bar controls below
  const analyserCache = {}; // beat.id -> { analyser, source, dataArray }
  let liveWfRow = null; // .track row currently showing live bars
  let liveWfRaf = null;

  function getAnalyser(beat, audio) {
    if (analyserCache[beat.id]) return analyserCache[beat.id];
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256; // 128 bins — finer resolution than the bar count, mapped via log scale below
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyserCache[beat.id] = { analyser, source, dataArray };
    return analyserCache[beat.id];
  }

  function startLiveWaveform(beat, row) {
    stopLiveWaveform();
    if (window.innerWidth < 640) return; // waveform lane hidden below this breakpoint
    const audio = audioCache[beat.id];
    if (!audio) return;
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    const { analyser, dataArray } = getAnalyser(beat, audio);
    const wf = row.querySelector(".wf");
    if (!wf) return;
    const bars = wf.querySelectorAll(".wf-bar");
    if (!bars.length) return;
    liveWfRow = row;
    wf.classList.add("live");
    bars.forEach(bar => bar.classList.remove("idle"));
    const nBins = dataArray.length;
    const nBars = bars.length;
    // log-scaled bin mapping: low bars sample narrow low-frequency ranges,
    // high bars sample wider high-frequency ranges — matches how music
    // energy is distributed and how Spotify/iOS-style EQs read
    const binForBar = (i) => {
      const t0 = i / nBars, t1 = (i + 1) / nBars;
      const b0 = Math.floor(Math.pow(nBins, t0)) - 1;
      const b1 = Math.floor(Math.pow(nBins, t1)) - 1;
      return [Math.max(0, b0), Math.max(Math.max(0, b0) + 1, b1)];
    };
    const binRanges = Array.from({ length: nBars }, (_, i) => binForBar(i));
    function draw() {
      analyser.getByteFrequencyData(dataArray);
      bars.forEach((bar, i) => {
        const [lo, hi] = binRanges[i];
        let sum = 0, count = 0;
        for (let b = lo; b < hi && b < nBins; b++) { sum += dataArray[b]; count++; }
        const v = count ? (sum / count) / 255 : 0;
        const h = Math.round(4 + v * 18);
        bar.style.height = h + "px";
      });
      liveWfRaf = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopLiveWaveform() {
    if (liveWfRaf) cancelAnimationFrame(liveWfRaf);
    liveWfRaf = null;
    if (liveWfRow) {
      const wf = liveWfRow.querySelector(".wf");
      if (wf) {
        wf.classList.remove("live");
        const beat = BEATS.find(b => b.id === liveWfRow.dataset.id);
        const peaks = beat && Array.isArray(beat.peaks) ? beat.peaks : null;
        wf.querySelectorAll(".wf-bar").forEach((bar, i) => {
          const p = peaks ? peaks[i] : 0.5;
          bar.style.height = Math.round(4 + p * 18) + "px";
          bar.classList.add("idle");
        });
      }
    }
    liveWfRow = null;
  }

  let activeStop = null;
  let playingId = null;
  let ringRAF = null;
  const audioCache = {};

  const RING_CIRCUMFERENCE = 2 * Math.PI * 20.5; // matches r in the SVG

  const PB_RING_CIRCUMFERENCE = 2 * Math.PI * 16.5;

  function setScrubProgress(scrub) {
    const min = Number(scrub.min);
    const max = Number(scrub.max);
    const value = Number(scrub.value);
    const range = max - min;
    const fraction = range > 0 && Number.isFinite(value) ? (value - min) / range : 0;
    const percent = Math.max(0, Math.min(1, fraction)) * 100;
    scrub.style.setProperty("--pb-scrub-progress", percent + "%");
  }

  function setRing(btn, fraction) {
    const clamped = Math.max(0, Math.min(1, fraction));
    const ring = btn.querySelector(".ring-progress");
    if (ring) ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - clamped);
    const pbRing = document.querySelector(".pb-ring-progress");
    if (pbRing) pbRing.style.strokeDashoffset = PB_RING_CIRCUMFERENCE * (1 - clamped);
    const scrub = document.getElementById("pb-scrub");
    if (scrub && !scrubbing) {
      scrub.value = Math.round(clamped * 1000);
      setScrubProgress(scrub);
    }
  }

  function startRing(btn, getFraction) {
    cancelAnimationFrame(ringRAF);
    const tick = () => {
      setRing(btn, getFraction());
      ringRAF = requestAnimationFrame(tick);
    };
    ringRAF = requestAnimationFrame(tick);
  }

  function stopRing(resetRings) {
    cancelAnimationFrame(ringRAF);
    ringRAF = null;
    if (resetRings) {
      document.querySelectorAll(".ring-progress").forEach(r => {
        r.style.strokeDashoffset = RING_CIRCUMFERENCE;
      });
    }
  }

  // pauseAll: halts playback but keeps position (real tracks resume later).
  // Ring freezes in place for the paused track; other rings reset.
  function pauseAll() {
    finishScrub();
    finishRegionDrag();
    if (activeStop) activeStop();
    activeStop = null;
    playingId = null;
    stopRing(false);
    document.querySelectorAll(".play-btn").forEach(btn => btn.classList.remove("on"));
    document.querySelectorAll(".wf-bar").forEach(bar => bar.classList.remove("on"));
    const pbT = document.getElementById("pb-toggle");
    if (pbT) pbT.classList.remove("on");
  }

  // resetOtherRings: when switching tracks, clear every ring except the active one,
  // and reset those tracks' audio positions so they start fresh next time
  function resetOtherRings(activeBtn) {
    document.querySelectorAll(".play-btn").forEach(btn => {
      if (btn === activeBtn) return;
      const r = btn.querySelector(".ring-progress");
      if (r) r.style.strokeDashoffset = RING_CIRCUMFERENCE;
    });
    const activeRow = activeBtn.closest(".track");
    const activeId = activeRow ? activeRow.dataset.id : null;
    Object.keys(audioCache).forEach(id => {
      if (id !== activeId) audioCache[id].currentTime = 0;
    });
  }

  function playDemo(beat, btn) {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (btn) {
      const DEMO_CYCLE = 30; // seconds per full ring on demo tones
      const startTime = performance.now();
      startRing(btn, () => ((performance.now() - startTime) / 1000 % DEMO_CYCLE) / DEMO_CYCLE);
    }

    const beatSec = 60 / beat.bpm;
    const pattern = [0, 3, 7, 10];
    const master = audioCtx.createGain();
    master.gain.value = 0.05;
    master.connect(audioCtx.destination);

    let stepIndex = 0;
    const scheduleStep = (time) => {
      const semis = pattern[stepIndex % pattern.length];
      const freq = beat.root * Math.pow(2, semis / 12);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + beatSec * 0.9);
      osc.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + beatSec);
      stepIndex += 1;
    };

    let cursor = audioCtx.currentTime;
    const lookahead = 8;
    for (let i = 0; i < lookahead; i++) scheduleStep(cursor + i * beatSec);

    const intervalId = setInterval(() => {
      for (let i = 0; i < lookahead; i++) scheduleStep(cursor + i * beatSec);
      cursor += lookahead * beatSec;
    }, beatSec * lookahead * 1000);

    activeStop = () => {
      clearInterval(intervalId);
      master.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      setTimeout(() => master.disconnect(), 200);
    };
  }

  function fmtTime(s) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  }

  const LUFS_TARGET = (() => {
    const vals = BEATS.map(b => b.lufs).filter(v => typeof v === "number").sort((a, b) => a - b);
    return vals.length ? vals[Math.floor(vals.length / 2)] : -18;
  })();
  function normalizedVolume(beat) {
    if (typeof beat.lufs !== "number") return 1;
    const gain = Math.pow(10, (LUFS_TARGET - beat.lufs) / 20);
    return Math.min(1, Math.max(0.15, gain)); // cap ceiling at 1 (HTML audio max); floor avoids near-silence on extreme outliers
  }

  function playReal(beat, btn) {
    let audio = audioCache[beat.id];
    if (!audio) {
      audio = new Audio();
      audio.preload = "none";
      audio.src = beat.audioSrc;
      audio.loop = loopMode === "full";
      audio.volume = normalizedVolume(beat);
      audio.addEventListener("ended", () => {
        if (playingId === beat.id) playNext();
      });
      audio.addEventListener("timeupdate", () => {
        // Runs off the media clock, not rAF, so this keeps enforcing the loop
        // region even when the tab is backgrounded and rAF is throttled/paused.
        if (loopMode === "section" && audio.duration && isFinite(audio.duration)) {
          const startSec = regionStart * audio.duration;
          const endSec = regionEnd * audio.duration;
          if (audio.currentTime < startSec) audio.currentTime = startSec;
          if (audio.currentTime >= endSec) audio.currentTime = startSec;
        }
      });
      audioCache[beat.id] = audio;
    }
    audio.play().then(() => {
      if (playingId !== beat.id) return; // a newer play() call superseded this one
      const row = btn.closest(".track");
      if (row) startLiveWaveform(beat, row);
    }).catch((err) => {
      console.error("Playback failed, falling back to demo tone:", err);
      playDemo(beat, btn);
    });
    const timeEl = document.getElementById("pb-time");
    startRing(btn, () => {
      if (!audio.duration || !isFinite(audio.duration)) return 0;
      if (!scrubbing) timeEl.textContent = fmtTime(audio.currentTime) + " / " + fmtTime(audio.duration);
      return audio.currentTime / audio.duration;
    });
    activeStop = () => { audio.pause(); stopLiveWaveform(); }; // pause keeps currentTime, so next play resumes
  }

  function playAdjacent(direction) {
    // Navigate the full filtered catalog, not just the rows currently exposed by pagination.
    const rows = [...trackList.querySelectorAll(".track:not(.filtered-out)")];
    if (!rows.length) return;
    const currentId = playingId || (lastBeat && lastBeat.id);
    let current = rows.findIndex(r => r.dataset.id === currentId);
    if (current < 0) current = direction > 0 ? -1 : 0;
    const targetIndex = (current + direction + rows.length) % rows.length;
    const target = rows[targetIndex];
    if (rows.length === 1 && target.dataset.id === currentId) {
      const audio = audioCache[currentId];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => console.error("Playback failed:", error));
      }
      return;
    }

    // If the next/previous track sits beyond the current “load more” boundary,
    // reveal enough catalog rows to include it before starting playback.
    if (target.classList.contains("hidden")) {
      visibleLimit = Math.max(visibleLimit, Math.ceil((targetIndex + 1) / PAGE_SIZE) * PAGE_SIZE);

      // Navigation needs a stable final layout before calculating its scroll target.
      // Keep the normal Load More animation, but expose this batch instantly so rows
      // expanding above the destination cannot move it during the smooth scroll.
      trackList.classList.add("nav-reveal-instant");
      applyPagination();
      void trackList.offsetHeight;
      trackList.classList.remove("nav-reveal-instant");
    }

    target.querySelector(".play-btn").click();
    target.classList.remove("nav-pulse");
    void target.offsetWidth; // restart the pulse even on rapid repeated navigation
    target.classList.add("nav-pulse");
    setTimeout(() => target.classList.remove("nav-pulse"), 1050);

    // Let the player/row state paint first, then measure one settled layout.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollTrackForNavigation(target)));
  }

  function scrollTrackForNavigation(target) {
    const header = document.querySelector("header");
    const player = document.getElementById("player-bar");
    const headerRect = header ? header.getBoundingClientRect() : null;
    const playerRect = player && player.classList.contains("active")
      ? player.getBoundingClientRect()
      : null;
    const margin = 16;
    const usableTop = (headerRect ? headerRect.bottom : 0) + margin;
    const usableBottom = (playerRect ? playerRect.top : window.innerHeight) - margin;
    const rect = target.getBoundingClientRect();

    // Do nothing when the complete row already fits between the sticky header
    // and fixed player. Otherwise calculate one absolute, deterministic target.
    if (rect.top >= usableTop && rect.bottom <= usableBottom) return;

    const usableHeight = Math.max(0, usableBottom - usableTop);
    const absoluteRowTop = window.scrollY + rect.top;
    let destination;

    if (rect.height <= usableHeight) {
      // Center a normal row in the genuinely visible portion of the viewport.
      destination = absoluteRowTop - usableTop - (usableHeight - rect.height) / 2;
    } else {
      // Defensive fallback for an unusually tall row: align its top below header.
      destination = absoluteRowTop - usableTop;
    }

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    destination = Math.max(0, Math.min(maxScroll, destination));

    window.scrollTo({ top: destination, behavior: "smooth" });
  }

  function playNext() {
    playAdjacent(1);
  }

  function playPrevious() {
    playAdjacent(-1);
  }

  const playerBar = document.getElementById("player-bar");
  const pbTitle = document.getElementById("pb-title");
  const pbToggle = document.getElementById("pb-toggle");
  const pbPrev = document.getElementById("pb-prev");
  const pbNext = document.getElementById("pb-next");
  const pbScrub = document.getElementById("pb-scrub");
  const pbLoop = document.getElementById("pb-loop");
  const pbRegionOverlay = document.getElementById("pb-region-overlay");
  const pbRegionFill = document.getElementById("pb-region-fill");
  const pbRegionStart = document.getElementById("pb-region-start");
  const pbRegionEnd = document.getElementById("pb-region-end");
  let lastBeat = null;
  let lastBtn = null;
  let scrubbing = false;
  let loopMode = "off"; // off -> full -> section -> off
  let regionStart = 0.2; // fraction of track duration, 0..1
  let regionEnd = 0.4;

  function currentAudio() {
    return lastBeat ? audioCache[lastBeat.id] : null;
  }

  function renderRegion() {
    const startPct = (regionStart * 100).toFixed(2) + "%";
    const endPct = (regionEnd * 100).toFixed(2) + "%";
    pbRegionFill.style.left = startPct;
    pbRegionFill.style.right = (100 - regionEnd * 100).toFixed(2) + "%";
    pbRegionStart.style.left = startPct;
    pbRegionEnd.style.left = endPct;
  }

  const pbDragTime = document.getElementById("pb-drag-time");
  const HANDLE_SENSITIVITY = 0.35; // <1 = finger moves further than handle, for finer control
  const MIN_GAP = 0.02;

  function showDragTime(frac) {
    const audio = currentAudio();
    const duration = audio && isFinite(audio.duration) ? audio.duration : 0;
    pbDragTime.textContent = fmtTime(frac * duration);
    pbDragTime.style.left = (frac * 100).toFixed(2) + "%";
    pbDragTime.classList.add("visible");
  }
  function hideDragTime() {
    pbDragTime.classList.remove("visible");
  }
  let dragTimeHideTimer = null;
  function flashDragTime(frac) {
    showDragTime(frac);
    clearTimeout(dragTimeHideTimer);
    dragTimeHideTimer = setTimeout(hideDragTime, 700);
  }

  let activeRegionDrag = null;

  function finishRegionDrag(event) {
    const drag = activeRegionDrag;
    if (!drag) return;
    if (event && "pointerId" in event && event.pointerId !== drag.pointerId) return;

    activeRegionDrag = null;
    window.removeEventListener("pointermove", drag.move);
    window.removeEventListener("pointerup", drag.finish);
    window.removeEventListener("pointercancel", drag.finish);
    window.removeEventListener("blur", drag.finish);
    drag.handle.removeEventListener("lostpointercapture", drag.finish);
    if (drag.handle.hasPointerCapture(drag.pointerId)) {
      drag.handle.releasePointerCapture(drag.pointerId);
    }
    hideDragTime();
  }

  function dragHandle(handle, isStart) {
    function onMove(startFrac, startClientX, clientX) {
      const rect = pbRegionOverlay.getBoundingClientRect();
      const deltaFrac = ((clientX - startClientX) / rect.width) * HANDLE_SENSITIVITY;
      let frac = Math.min(1, Math.max(0, startFrac + deltaFrac));
      if (isStart) {
        regionStart = Math.min(frac, regionEnd - MIN_GAP);
      } else {
        regionEnd = Math.max(frac, regionStart + MIN_GAP);
      }
      renderRegion();
      showDragTime(isStart ? regionStart : regionEnd);
    }
    handle.addEventListener("pointerdown", (e) => {
      finishRegionDrag();
      handle.setPointerCapture(e.pointerId);
      const startFrac = isStart ? regionStart : regionEnd;
      const startClientX = e.clientX;
      const drag = {
        handle,
        pointerId: e.pointerId,
        move: null,
        finish: null,
      };
      drag.move = (event) => {
        if (activeRegionDrag !== drag || event.pointerId !== drag.pointerId) return;
        if (event.pointerType === "mouse" && event.buttons === 0) {
          finishRegionDrag(event);
          return;
        }
        onMove(startFrac, startClientX, event.clientX);
      };
      drag.finish = (event) => finishRegionDrag(event);
      activeRegionDrag = drag;
      window.addEventListener("pointermove", drag.move);
      window.addEventListener("pointerup", drag.finish);
      window.addEventListener("pointercancel", drag.finish);
      window.addEventListener("blur", drag.finish);
      handle.addEventListener("lostpointercapture", drag.finish);
    });
    handle.addEventListener("keydown", (e) => {
      const audio = currentAudio();
      const duration = audio && isFinite(audio.duration) ? audio.duration : 120;
      const stepSec = e.shiftKey ? 0.5 : 0.05;
      const step = stepSec / duration;
      let delta = 0;
      if (e.key === "ArrowLeft") delta = -step;
      else if (e.key === "ArrowRight") delta = step;
      else if (e.key === "Home") delta = -1;
      else if (e.key === "End") delta = 1;
      else return;
      e.preventDefault();
      if (isStart) {
        regionStart = Math.min(1, Math.max(0, regionStart + delta));
        regionStart = Math.min(regionStart, regionEnd - MIN_GAP);
      } else {
        regionEnd = Math.min(1, Math.max(0, regionEnd + delta));
        regionEnd = Math.max(regionEnd, regionStart + MIN_GAP);
      }
      renderRegion();
      flashDragTime(isStart ? regionStart : regionEnd);
    });
  }
  dragHandle(pbRegionStart, true);
  dragHandle(pbRegionEnd, false);
  renderRegion();

  function applyLoopMode() {
    finishRegionDrag();
    pbLoop.dataset.mode = loopMode;
    playerBar.dataset.loopMode = loopMode;
    pbLoop.title = loopMode === "off" ? "Loop: off" : loopMode === "full" ? "Loop: full track" : "Loop: section";
    pbLoop.setAttribute("aria-label", pbLoop.title);
    pbRegionOverlay.hidden = loopMode !== "section";
    Object.values(audioCache).forEach(a => { a.loop = loopMode === "full"; });
    if (loopMode === "section") {
      const audio = currentAudio();
      if (audio && audio.duration && isFinite(audio.duration)) {
        const cur = audio.currentTime / audio.duration;
        regionStart = Math.max(0, cur - 0.05);
        regionEnd = Math.min(1, cur + 0.15);
        renderRegion();
      }
    }
  }

  pbLoop.addEventListener("click", () => {
    loopMode = loopMode === "off" ? "full" : loopMode === "full" ? "section" : "off";
    applyLoopMode();
  });

  const SCRUB_SENSITIVITY = 0.35; // matches loop-handle sensitivity for consistent feel
  let activeScrub = null;

  function commitScrubPosition(audio) {
    if (!audio || !audio.duration || !isFinite(audio.duration)) return;
    audio.currentTime = (pbScrub.value / 1000) * audio.duration;
  }

  function finishScrub(event) {
    const drag = activeScrub;
    if (drag && event && "pointerId" in event && event.pointerId !== drag.pointerId) return;

    if (drag) {
      activeScrub = null;
      window.removeEventListener("pointermove", drag.move);
      window.removeEventListener("pointerup", drag.finish);
      window.removeEventListener("pointercancel", drag.finish);
      window.removeEventListener("blur", drag.finish);
      pbScrub.removeEventListener("lostpointercapture", drag.finish);
      if (pbScrub.hasPointerCapture(drag.pointerId)) {
        pbScrub.releasePointerCapture(drag.pointerId);
      }
    }

    scrubbing = false;
    if (event && event.type === "change") {
      commitScrubPosition(drag ? drag.audio : currentAudio());
    }
    if (drag && (!event || event.type !== "change")) {
      pbScrub.dispatchEvent(new Event("change"));
    }
  }

  pbScrub.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    finishScrub();
    pbScrub.setPointerCapture(e.pointerId);
    const rect = pbScrub.getBoundingClientRect();
    const startFrac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const startClientX = e.clientX;
    const drag = {
      audio: currentAudio(),
      pointerId: e.pointerId,
      move: null,
      finish: null,
    };
    drag.move = (event) => {
      if (activeScrub !== drag || event.pointerId !== drag.pointerId) return;
      if (event.pointerType === "mouse" && event.buttons === 0) {
        finishScrub(event);
        return;
      }
      const deltaFrac = ((event.clientX - startClientX) / rect.width) * SCRUB_SENSITIVITY;
      const frac = Math.min(1, Math.max(0, startFrac + deltaFrac));
      pbScrub.value = Math.round(frac * 1000);
      pbScrub.dispatchEvent(new Event("input"));
    };
    drag.finish = (event) => finishScrub(event);
    activeScrub = drag;
    window.addEventListener("pointermove", drag.move);
    window.addEventListener("pointerup", drag.finish);
    window.addEventListener("pointercancel", drag.finish);
    window.addEventListener("blur", drag.finish);
    pbScrub.addEventListener("lostpointercapture", drag.finish);
    pbScrub.value = Math.round(startFrac * 1000);
    pbScrub.dispatchEvent(new Event("input"));
  });
  pbScrub.addEventListener("input", () => {
    scrubbing = true;
    setScrubProgress(pbScrub);
    if (lastBeat && audioCache[lastBeat.id]) {
      const audio = audioCache[lastBeat.id];
      if (audio.duration && isFinite(audio.duration)) {
        const preview = (pbScrub.value / 1000) * audio.duration;
        document.getElementById("pb-time").textContent = fmtTime(preview) + " / " + fmtTime(audio.duration);
      }
    }
  });
  pbScrub.addEventListener("change", finishScrub);

  pbPrev.addEventListener("click", playPrevious);
  pbNext.addEventListener("click", playNext);

  // ---- desktop keyboard playback controls ----
  document.addEventListener("keydown", (e) => {
    const target = e.target;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
    const isEditable = target && (target.isContentEditable || ["input", "textarea", "select", "button", "a"].includes(tag));
    if (isEditable || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

    if (e.code === "Space") {
      if (!lastBeat || !lastBtn) return;
      e.preventDefault();
      pbToggle.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      playPrevious();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      playNext();
    } else if (e.key.toLowerCase() === "l") {
      e.preventDefault();
      pbLoop.click();
    }
  });

  pbToggle.addEventListener("click", () => {
    if (!lastBeat || !lastBtn) return;
    const row = lastBtn.closest(".track");
    if (playingId === lastBeat.id) {
      pauseAll();
      return;
    }
    pauseAll();
    resetOtherRings(lastBtn);
    if (lastBeat.audioSrc) playReal(lastBeat, lastBtn); else playDemo(lastBeat, lastBtn);
    playingId = lastBeat.id;
    updatePlayerBar(lastBeat);
    lastBtn.classList.add("on");
    row.querySelectorAll(".wf-bar").forEach(bar => bar.classList.add("on"));
  });

  function updatePlayerBar(beat) {
    lastBeat = beat;
    pbTitle.innerHTML = "";
    const inner = document.createElement("span");
    inner.className = "pb-title-inner";
    inner.textContent = beat.title;
    pbTitle.appendChild(inner);
    pbTitle.classList.remove("scrolling");
    requestAnimationFrame(() => {
      const overflow = inner.scrollWidth - pbTitle.clientWidth;
      if (overflow > 2) {
        pbTitle.style.setProperty("--scroll-dist", `-${overflow + 8}px`);
        pbTitle.classList.add("scrolling");
      }
    });
    document.getElementById("pb-time").textContent = "0:00 / 0:00";
    playerBar.classList.add("active");
    pbToggle.classList.add("on");
  }

  trackList.addEventListener("click", (e) => {
    const dlLink = e.target.closest(".track-dl");
    if (dlLink) {
      const row = dlLink.closest(".track");
      const beat = BEATS.find(b => b.id === row.dataset.id);
      if (beat) {
        fetch("/.netlify/functions/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "download", beat: beat.title }),
        }).catch(() => {}); // fire-and-forget; never blocks the download
      }
      return; // let the native download proceed
    }

    const shareBtn = e.target.closest(".track-share");
    if (shareBtn) {
      const row = shareBtn.closest(".track");
      const beat = row ? BEATS.find(b => b.id === row.dataset.id) : null;
      const url = `https://neverebeats.com/beats/${shareBtn.dataset.share}/`;
      const shareData = {
        title: beat ? `${beat.title} — prod. nevere` : "nevere",
        text: beat ? `${beat.title} — prod. nevere` : "beat by nevere",
        url
      };

      if (navigator.share) {
        navigator.share(shareData).catch((err) => {
          // AbortError means the user simply closed the native share sheet.
          if (err && err.name !== "AbortError") console.error("Sharing failed:", err);
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          const original = shareBtn.textContent;
          shareBtn.textContent = "link copied ✓";
          setTimeout(() => { shareBtn.textContent = original; }, 1500);
        }).catch((err) => {
          console.error("Copy link failed:", err);
        });
      }
      return;
    }

    const btn = e.target.closest(".play-btn");
    if (!btn) return;
    const row = btn.closest(".track");
    const id = row.dataset.id;
    const beat = BEATS.find(b => b.id === id);

    if (playingId === id) {
      pauseAll(); // keeps position — pressing play again resumes
      return;
    }
    pauseAll();
    resetOtherRings(btn);
    if (beat.audioSrc) playReal(beat, btn); else playDemo(beat, btn);
    playingId = id;
    lastBtn = btn;
    updatePlayerBar(beat);
    btn.classList.add("on");
    row.querySelectorAll(".wf-bar").forEach(bar => bar.classList.add("on"));
  });

  // terms overlay: read terms without leaving the page or stopping playback
  const termsOverlay = document.getElementById("terms-overlay");
  document.getElementById("terms-link").addEventListener("click", (e) => {
    e.preventDefault();
    termsOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  });
  document.getElementById("terms-close").addEventListener("click", () => {
    termsOverlay.hidden = true;
    document.body.style.overflow = "";
  });
  termsOverlay.addEventListener("click", (e) => {
    if (e.target === termsOverlay) {
      termsOverlay.hidden = true;
      document.body.style.overflow = "";
    }
  });


  // beat-aware inquiry: /?beat=moon-phase#contact preselects the beat in the Netlify form
  const contactParams = new URLSearchParams(window.location.search);
  const inquiryBeatSlug = contactParams.get("beat");
  if (inquiryBeatSlug) {
    const inquiryBeat = BEATS.find(b => {
      const row = document.querySelector(`.track[data-id="${b.id}"]`);
      return row && row.id === inquiryBeatSlug;
    });
    const beatInput = document.getElementById("contact-beat");
    const beatLabel = document.getElementById("contact-beat-label");
    if (beatInput) beatInput.value = inquiryBeat ? inquiryBeat.title : inquiryBeatSlug;
    if (beatLabel) {
      beatLabel.textContent = `inquiring about: ${inquiryBeat ? inquiryBeat.title : inquiryBeatSlug.replaceAll("-", " ")}`;
      beatLabel.hidden = false;
    }
  }

  // shared-link: center the beat on screen and give it a brief arrival highlight
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains("track")) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("highlight");
        setTimeout(() => target.classList.remove("highlight"), 2800);
      }, 300);
    }
  }

  // Preserve the currently playing beat when its title opens the matching beat page.
  const playbackTransfer = window.NeverePlaybackTransfer;
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".track-title-link");
    if (!link) return;

    const row = link.closest(".track");
    const beatId = row && row.dataset.id;
    const audio = beatId ? audioCache[beatId] : null;
    const beat = BEATS.find(item => item.id === beatId);
    if (!audio || !beat || audio.currentTime <= 0) {
      playbackTransfer?.clear();
      return;
    }

    const destinationPath = link.getAttribute("href") || "";
    const destinationSlug = destinationPath.split("/").filter(Boolean).pop();
    const sourceSlug = beat.audioSrc.replace(/\.mp3$/i, "");
    if (!destinationSlug || destinationSlug !== sourceSlug) {
      playbackTransfer?.clear();
      return;
    }

    playbackTransfer?.save({
      slug: destinationSlug,
      currentTime: audio.currentTime,
      wasPlaying: !audio.paused && !audio.ended,
      volume: audio.volume,
    });
  }, true);


})();
