(() => {
  "use strict";

  const page = document.body;
  if (!page.classList.contains("beat-page")) return;
  if (page.dataset.beatPlayerInitialized === "true") return;

  const audio = document.getElementById("beat-audio");
  const playButton = document.getElementById("bp-play");
  const scrub = document.getElementById("bp-scrub");
  const progressFill = document.getElementById("bp-progress");
  const playhead = document.getElementById("bp-playhead");
  const timeLabel = document.getElementById("bp-time");
  const loopButton = document.getElementById("bp-loop");
  const playerCard = document.querySelector(".player-card");

  const requiredElements = [audio, playButton, scrub, progressFill, playhead, timeLabel, loopButton];
  if (requiredElements.some((element) => !element)) {
    console.error("Beat player initialization stopped because required markup is missing.");
    return;
  }

  const ringProgress = playButton.querySelector(".ring-progress");
  if (!ringProgress) {
    console.error("Beat player initialization stopped because the progress ring is missing.");
    return;
  }

  page.dataset.beatPlayerInitialized = "true";

  const transfer = window.NeverePlaybackTransfer;
  const title = page.dataset.beatTitle?.trim() || document.querySelector("h1")?.textContent?.trim() || "beat";
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.dataset.beatSlug || "")
    ? page.dataset.beatSlug
    : "";

  function shareUrl() {
    const configured = page.dataset.shareUrl;
    if (configured) {
      try {
        const parsed = new URL(configured, window.location.origin);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
      } catch {
        // Fall back to the server-rendered canonical URL below.
      }
    }
    return document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  }

  function formatTime(seconds) {
    if (transfer?.formatTime) return transfer.formatTime(seconds);
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  const RING_CIRCUMFERENCE = 2 * Math.PI * 14.5;
  let scrubbing = false;
  let scrubValue = 0;
  let progressFrame = null;

  function setProgress(fraction) {
    const clamped = Math.max(0, Math.min(1, fraction || 0));
    const percent = `${(clamped * 100).toFixed(3)}%`;
    if (!scrubbing) scrubValue = Math.round(clamped * 1000);
    scrub.setAttribute("aria-valuenow", String(Math.round(clamped * 1000)));
    scrub.setAttribute("aria-valuetext", formatTime(audio.duration ? clamped * audio.duration : 0));
    progressFill.style.width = percent;
    playhead.style.left = percent;
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - clamped);
  }

  function stopProgressLoop() {
    if (progressFrame) cancelAnimationFrame(progressFrame);
    progressFrame = null;
  }

  function renderTime(current = audio.currentTime) {
    timeLabel.textContent = `${formatTime(current)} / ${formatTime(audio.duration)}`;
  }

  function startProgressLoop() {
    stopProgressLoop();
    function draw() {
      if (!scrubbing && audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        renderTime();
      }
      if (!audio.paused && !audio.ended) progressFrame = requestAnimationFrame(draw);
      else progressFrame = null;
    }
    progressFrame = requestAnimationFrame(draw);
  }

  function syncPlayState() {
    const playing = !audio.paused && !audio.ended;
    playButton.classList.toggle("on", playing);
    playButton.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title}`);
    if (playing) startProgressLoop();
    else stopProgressLoop();
  }

  function reportPlaybackFailure(error) {
    console.error("Playback failed:", error);
  }

  playButton.addEventListener("click", () => {
    if (audio.paused || audio.ended) audio.play().catch(reportPlaybackFailure);
    else audio.pause();
  });

  function syncMetadata() {
    if (playerCard) delete playerCard.dataset.playerState;
    playButton.setAttribute("aria-label", `${audio.paused ? "Play" : "Pause"} ${title}`);
    setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    renderTime();
  }

  audio.addEventListener("loadedmetadata", syncMetadata);
  if (audio.readyState >= 1) syncMetadata();
  audio.addEventListener("timeupdate", () => {
    if (!scrubbing && audio.duration) setProgress(audio.currentTime / audio.duration);
    if (!scrubbing) renderTime();
  });
  audio.addEventListener("play", syncPlayState);
  audio.addEventListener("pause", syncPlayState);
  audio.addEventListener("ended", () => {
    syncPlayState();
    if (!audio.loop) {
      setProgress(1);
      renderTime(audio.duration);
    }
  });
  function reportAudioError() {
    const source = audio.currentSrc || audio.src;
    if (playerCard) playerCard.dataset.playerState = "error";
    playButton.setAttribute("aria-label", `${title} audio unavailable`);
    console.error(`Beat audio failed to load: ${source}`);
  }

  audio.addEventListener("error", reportAudioError);
  if (audio.error) reportAudioError();

  function fractionFromPointer(event) {
    const rect = scrub.getBoundingClientRect();
    if (!rect.width) return 0;
    return Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  }

  function previewSeek(fraction) {
    scrubbing = true;
    scrubValue = Math.round(fraction * 1000);
    setProgress(fraction);
    if (audio.duration) renderTime(fraction * audio.duration);
  }

  function commitSeek(fraction) {
    scrubValue = Math.round(fraction * 1000);
    if (audio.duration) audio.currentTime = fraction * audio.duration;
    scrubbing = false;
    setProgress(audio.duration ? audio.currentTime / audio.duration : fraction);
    renderTime();
    if (!audio.paused && !audio.ended) startProgressLoop();
  }

  scrub.addEventListener("pointerdown", (event) => {
    if (scrub.setPointerCapture) scrub.setPointerCapture(event.pointerId);
    previewSeek(fractionFromPointer(event));
  });
  scrub.addEventListener("pointermove", (event) => {
    if (scrubbing) previewSeek(fractionFromPointer(event));
  });
  scrub.addEventListener("pointerup", (event) => {
    commitSeek(fractionFromPointer(event));
    if (scrub.hasPointerCapture?.(event.pointerId)) scrub.releasePointerCapture(event.pointerId);
  });
  scrub.addEventListener("pointercancel", () => {
    scrubbing = false;
    setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    renderTime();
  });
  scrub.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 50 : 10;
    let nextValue = scrubValue;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextValue -= step;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextValue += step;
    else if (event.key === "Home") nextValue = 0;
    else if (event.key === "End") nextValue = 1000;
    else return;

    event.preventDefault();
    nextValue = Math.max(0, Math.min(1000, nextValue));
    commitSeek(nextValue / 1000);
  });

  loopButton.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopButton.classList.toggle("on", audio.loop);
    loopButton.setAttribute("aria-pressed", String(audio.loop));
    loopButton.setAttribute("aria-label", audio.loop ? "Loop: on" : "Loop: off");
    loopButton.title = audio.loop ? "Loop: on" : "Loop: off";
  });

  const shareButton = document.getElementById("share-beat");
  if (shareButton) {
    const data = {
      title: `${title} — prod. nevere`,
      text: `${title} — prod. nevere`,
      url: shareUrl(),
    };
    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (error) {
          if (error?.name !== "AbortError") console.error(error);
        }
        return;
      }
      if (!navigator.clipboard?.writeText) return;
      try {
        await navigator.clipboard.writeText(data.url);
        const original = shareButton.textContent;
        shareButton.textContent = "link copied ✓";
        setTimeout(() => {
          shareButton.textContent = original;
        }, 1500);
      } catch (error) {
        console.error("Copy link failed:", error);
      }
    });
  }

  if (transfer?.restore && slug) {
    transfer.restore({
      audio,
      slug,
      container: document.getElementById("resume-transfer"),
      copy: document.getElementById("resume-transfer-copy"),
      button: document.getElementById("resume-transfer-button"),
      onPositionApplied: () => {
        setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
        renderTime();
      },
    });
  }
})();
