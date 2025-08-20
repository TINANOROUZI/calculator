// spa.js
// Lightweight SPA router that loads tools into the iframe app shell.
// When a link element has dataset.noAnim === "true", transitions are skipped.

(function () {
  const appShell = document.getElementById('appShell');
  const appFrame = document.getElementById('appFrame');
  const appTitleEl = document.getElementById('appTitle');
  const closeAppBtn = document.getElementById('closeApp');

  if (!appShell || !appFrame) return;

  // Map file name -> nice title (fallback: from link text or file name)
  const TITLE_MAP = {
    'basic.html': 'Basic Calculator',
    'scientific.html': 'Scientific Calculator',
    'matrix.html': 'Matrix Calculator',
    'geometry.html': 'Geometry Tools',
    'graphing.html': 'Graphing Calculator',
    'stats.html': 'Statistics Calculator',
  };

  function labelFromHref(href, linkEl) {
    if (linkEl && linkEl.textContent?.trim()) return linkEl.textContent.trim();
    try {
      const url = new URL(href, location.origin);
      const name = url.pathname.split('/').pop() || '';
      return TITLE_MAP[name] || name || 'Tool';
    } catch {
      return 'Tool';
    }
  }

  function showShell() {
    appShell.classList.add('active');
    appShell.setAttribute('aria-hidden', 'false');
  }
  function hideShell() {
    appShell.classList.remove('active');
    appShell.setAttribute('aria-hidden', 'true');
    // Clear frame to stop running calculators (optional)
    appFrame.removeAttribute('src');
  }

  // Core: open a route in the iframe; optionally animate
  function openRoute(href, linkEl) {
    const noAnim = !!(linkEl && linkEl.dataset && linkEl.dataset.noAnim === 'true');
    const title = labelFromHref(href, linkEl);

    appTitleEl && (appTitleEl.textContent = title);

    if (noAnim) {
      // Instant: no CSS classes, just swap
      showShell();
      appFrame.src = href;

      // Clear flag so future non-hamburger clicks animate normally
      if (linkEl) linkEl.dataset.noAnim = '';
      // Update history (optional)
      history.pushState({ app: href }, '', `#app=${encodeURIComponent(href)}`);
      return;
    }

    // Animated enter (small fade/slide defined in CSS)
    // Prepare
    showShell();
    appFrame.classList.add('anim-enter');
    // Start transition on next frame
    requestAnimationFrame(() => appFrame.classList.add('anim-show'));
    // Swap src; when it loads, remove animation classes
    const onLoad = () => {
      appFrame.classList.remove('anim-enter', 'anim-show');
      appFrame.removeEventListener('load', onLoad);
    };
    appFrame.addEventListener('load', onLoad);

    appFrame.src = href;
    history.pushState({ app: href }, '', `#app=${encodeURIComponent(href)}`);
  }

  // Expose for menu.js to call (so we can set noAnim from hamburger)
  window.__openRoute = openRoute;

  // Handle homepage cards with .route-link (these will animate)
  const routeLinks = document.querySelectorAll('.route-link[data-route]');
  routeLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('data-route') || link.getAttribute('href');
      if (!href) return;
      openRoute(href, link);
    });
  });

  // Back to home
  if (closeAppBtn) {
    closeAppBtn.addEventListener('click', () => {
      hideShell();
      // Return to home hash (optional)
      history.pushState({}, '', '#home');
      // Scroll to top for nice feel
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Restore if user loads with #app=<href>
  function restoreFromHash() {
    const m = location.hash.match(/^#app=(.+)$/);
    if (m) {
      const href = decodeURIComponent(m[1]);
      openRoute(href);
    }
  }
  window.addEventListener('popstate', restoreFromHash);
  restoreFromHash();
})();
