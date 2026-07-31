(() => {
  "use strict";

  if (window.NeverePlaybackTransfer) return;

  const STORAGE_KEY = "neverePlaybackTransfer";
  const TRANSFER_VERSION = 1;
  const TRANSFER_LIFETIME_MS = 15 * 60 * 1000;
  const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function validSlug(value) {
    return typeof value === "string" && SLUG_PATTERN.test(value) ? value : null;
  }

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function sessionStore() {
    try {
      return window.sessionStorage;
    } catch (error) {
      console.error("Playback transfer storage is unavailable:", error);
      return null;
    }
  }

  function clear() {
    const storage = sessionStore();
    if (!storage) return false;
    try {
      storage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Unable to clear playback transfer:", error);
      return false;
    }
  }

  function normalizeState(value, expectedSlug) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    if (value.version != null && value.version !== TRANSFER_VERSION) return null;

    const slug = validSlug(value.slug);
    const requiredSlug = validSlug(expectedSlug);
    if (!slug || !requiredSlug || slug !== requiredSlug) return null;

    const savedAt = value.savedAt;
    const age = Date.now() - savedAt;
    if (typeof savedAt !== "number" || !Number.isFinite(savedAt) || age < 0 || age >= TRANSFER_LIFETIME_MS) return null;

    const currentTime = value.currentTime;
    const volume = value.volume;
    if (typeof currentTime !== "number" || !Number.isFinite(currentTime) || currentTime < 0) return null;
    if (typeof volume !== "number" || !Number.isFinite(volume) || volume < 0 || volume > 1) return null;
    if (typeof value.wasPlaying !== "boolean") return null;

    return Object.freeze({
      version: TRANSFER_VERSION,
      slug,
      currentTime,
      wasPlaying: value.wasPlaying,
      volume,
      savedAt,
    });
  }

  function read(expectedSlug) {
    if (!validSlug(expectedSlug)) return null;
    const storage = sessionStore();
    if (!storage) return null;

    let raw;
    try {
      raw = storage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error("Unable to read playback transfer:", error);
      return null;
    }
    if (!raw) return null;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }

    return normalizeState(parsed, expectedSlug);
  }

  function save(value) {
    if (!value || typeof value !== "object") return false;
    const slug = validSlug(value.slug);
    const currentTime = finiteNumber(value.currentTime, NaN);
    if (!slug || !Number.isFinite(currentTime) || currentTime <= 0) {
      clear();
      return false;
    }

    const state = {
      version: TRANSFER_VERSION,
      slug,
      currentTime,
      wasPlaying: value.wasPlaying === true,
      volume: Math.max(0, Math.min(1, finiteNumber(value.volume, 1))),
      savedAt: Date.now(),
    };

    const storage = sessionStore();
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Unable to save playback transfer:", error);
      return false;
    }
  }

  function applyToAudio(audio, state) {
    if (!(audio instanceof HTMLMediaElement) || !state) return false;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : state.currentTime;
    try {
      audio.currentTime = Math.min(state.currentTime, duration);
      audio.volume = state.volume;
      return true;
    } catch (error) {
      console.error("Unable to apply playback transfer:", error);
      return false;
    }
  }

  function restore(options) {
    const {
      audio,
      slug,
      container,
      copy,
      button,
      onPositionApplied,
    } = options || {};

    if (!(audio instanceof HTMLMediaElement) || !validSlug(slug)) return false;
    if (audio.dataset.playbackTransferInitialized === "true") return false;
    audio.dataset.playbackTransferInitialized = "true";

    const state = read(slug);
    if (!state) return false;

    function notifyPositionApplied() {
      if (typeof onPositionApplied !== "function") return;
      try {
        onPositionApplied(state);
      } catch (error) {
        console.error("Unable to update transferred playback position:", error);
      }
    }

    function showResume() {
      if (!container || !copy || !button) return;
      copy.textContent = `continue from ${formatTime(state.currentTime)}`;
      container.classList.add("show");
      button.addEventListener("click", () => {
        if (!applyToAudio(audio, state)) return;
        notifyPositionApplied();
        audio.play().then(() => {
          container.classList.remove("show");
          clear();
        }).catch((error) => console.error("Resume failed:", error));
      });
    }

    function applyTransferredPosition() {
      if (!applyToAudio(audio, state)) return;
      notifyPositionApplied();
      if (!state.wasPlaying) {
        showResume();
        return;
      }
      audio.play().then(clear).catch(showResume);
    }

    if (audio.readyState >= 1) applyTransferredPosition();
    else audio.addEventListener("loadedmetadata", applyTransferredPosition, { once: true });
    return true;
  }

  window.NeverePlaybackTransfer = Object.freeze({
    clear,
    formatTime,
    read,
    restore,
    save,
  });
})();
