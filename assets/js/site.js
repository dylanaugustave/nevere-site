(() => {
  "use strict";

  const root = document.documentElement;
  if (root.dataset.siteInitialized === "true") return;
  root.dataset.siteInitialized = "true";

  function initializeHomeNavigation() {
    const menuButton = document.getElementById("menu-btn");
    const mobileNavigation = document.getElementById("mobile-nav");

    if (menuButton && mobileNavigation) {
      menuButton.addEventListener("click", () => {
        const open = mobileNavigation.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(open));
      });

      mobileNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileNavigation.classList.remove("open");
          menuButton.setAttribute("aria-expanded", "false");
        });
      });
    }

    const brandLink = document.querySelector('.brand[href="#top"]');
    if (!brandLink) return;

    function scrollBrandToTop(event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", location.pathname);
    }

    let brandTouchX = 0;
    let brandTouchY = 0;

    brandLink.addEventListener("click", scrollBrandToTop);
    brandLink.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      brandTouchX = touch.clientX;
      brandTouchY = touch.clientY;
    }, { passive: true });
    brandLink.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      if (Math.abs(touch.clientX - brandTouchX) < 10 && Math.abs(touch.clientY - brandTouchY) < 10) {
        scrollBrandToTop(event);
      }
    });
  }

  function initializeTermsReturnLink() {
    const backLink = document.getElementById("terms-back");
    if (!backLink) return;

    let requestedReturn = null;
    try {
      requestedReturn = new URLSearchParams(window.location.search).get("return");
    } catch (error) {
      console.error("Unable to read the terms return path:", error);
      return;
    }

    if (!requestedReturn || !/^\/beats\/[a-z0-9-]+\/$/.test(requestedReturn)) return;
    backLink.href = requestedReturn;
    backLink.textContent = "← back to beat";
  }

  initializeHomeNavigation();
  initializeTermsReturnLink();
})();
