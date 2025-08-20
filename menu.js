// menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  // ---------- helpers ----------
  const path = location.pathname.toLowerCase();
  const isHome =
    path === '/' ||
    path.endsWith('/index.html') ||
    path === '' ||
    path === '/index.html';

  function normalizePath(p) {
    p = p.replace(/\/+$/, '');
    if (p === '' || p === '/') return '/index.html';
    return p;
  }
  const currentPath = normalizePath(location.pathname.toLowerCase());

  // ---------- i18n ----------
  const I18N = {
    en: {
      code: 'EN',
      flag: '🇺🇸',
      dir: 'ltr',
      nav: {
        back: '← Back to Main',
        basic: 'Basic',
        scientific: 'Scientific',
        matrix: 'Matrix',
        geometry: 'Geometry',
        graphing: 'Graphing',
        stats: 'Statistics'
      },
      heroTitle: '🧮 Calculator Hub',
      heroSubtitle: 'All-in-one calculators for math, science, and more.',
      explore: 'Explore Tools ↓'
    },
    it: {
      code: 'IT',
      flag: '🇮🇹',
      dir: 'ltr',
      nav: {
        back: '← Torna alla Home',
        basic: 'Base',
        scientific: 'Scientifica',
        matrix: 'Matrici',
        geometry: 'Geometria',
        graphing: 'Grafici',
        stats: 'Statistiche'
      },
      heroTitle: '🧮 Hub Calcolatrici',
      heroSubtitle: 'Calcolatrici tutto-in-uno per matematica, scienza e altro.',
      explore: 'Esplora Strumenti ↓'
    },
    fa: {
      code: 'FA',
      flag: '🇮🇷',
      dir: 'rtl',
      nav: {
        back: '← بازگشت به صفحه اصلی',
        basic: 'ساده',
        scientific: 'علمی',
        matrix: 'ماتریس',
        geometry: 'هندسه',
        graphing: 'رسم نمودار',
        stats: 'آمار'
      },
      heroTitle: '🧮 مرکز ماشین‌حساب',
      heroSubtitle: 'ماشین‌حساب‌های همه‌کاره برای ریاضی، علوم و بیشتر.',
      explore: 'مشاهده ابزارها ↓'
    },
    ar: {
      code: 'AR',
      flag: '🇸🇦',
      dir: 'rtl',
      nav: {
        back: '← العودة للصفحة الرئيسية',
        basic: 'أساسي',
        scientific: 'علمي',
        matrix: 'مصفوفات',
        geometry: 'هندسة',
        graphing: 'رسوم بيانية',
        stats: 'إحصاء'
      },
      heroTitle: '🧮 مركز الآلة الحاسبة',
      heroSubtitle: 'آلات حاسبة شاملة للرياضيات والعلوم وأكثر.',
      explore: 'استكشف الأدوات ↓'
    }
  };

  function getLang() {
    const saved = localStorage.getItem('lang');
    return saved && I18N[saved] ? saved : 'en';
  }
  let LANG = getLang();

  // ---------- Nav links (labels will be translated after) ----------
  const linksHTML = `
    ${!isHome ? `<a class="back-btn" data-i18n="back" href="index.html">← Back to Main</a>` : ''}
    <a href="basic.html" data-i18n="basic">Basic</a>
    <a href="scientific.html" data-i18n="scientific">Scientific</a>
    <a href="matrix.html" data-i18n="matrix">Matrix</a>
    <a href="geometry.html" data-i18n="geometry">Geometry</a>
    <a href="graphing.html" data-i18n="graphing">Graphing</a>
    <a href="stats.html" data-i18n="stats">Statistics</a>
  `;

  // ---------- Flags row (desktop + drawer) ----------
  const flagsHTML = `
    <div class="lang-flags" aria-label="Language">
      <button class="lang-flag" type="button" data-lang="en" title="English">🇺🇸</button>
      <button class="lang-flag" type="button" data-lang="it" title="Italiano">🇮🇹</button>
      <button class="lang-flag" type="button" data-lang="fa" title="فارسی">🇮🇷</button>
      <button class="lang-flag" type="button" data-lang="ar" title="العربية">🇸🇦</button>
    </div>
  `;

  // ---------- Render navbar + drawer ----------
  mount.innerHTML = `
    <nav class="mini-nav container">
      <a class="brand" href="index.html">🧮 Calculator Hub</a>

      <button class="hamburger" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-right">
        ${linksHTML}
        ${flagsHTML}
      </div>
    </nav>

    <div id="drawerOverlay" class="drawer-overlay" hidden></div>
    <aside id="drawer" class="drawer" aria-hidden="true" tabindex="-1">
      <div class="drawer-header">
        <span class="drawer-title">Menu</span>
        <button class="drawer-close" aria-label="Close menu">✕</button>
      </div>
      <nav class="drawer-links">
        ${linksHTML}
        ${flagsHTML}
      </nav>
    </aside>
  `;

  // ---------- Drawer logic (unchanged) ----------
  const body = document.body;
  const burger = mount.querySelector('.hamburger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = mount.querySelector('.drawer-close');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.hidden = false;
    overlay.classList.add('show');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    closeBtn && closeBtn.focus();
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    setTimeout(() => (overlay.hidden = true), 220);
  }
  burger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // Prevent reload when clicking link to the current page
  function onNavClick(e) {
    const a = e.currentTarget;
    const href = a.getAttribute('href');
    if (!href) return;
    let target = '';
    try { target = new URL(href, location.origin).pathname.toLowerCase(); }
    catch { target = href.toLowerCase(); }
    target = normalizePath(target);
    if (target === currentPath) {
      e.preventDefault();
      closeDrawer();
    } else {
      closeDrawer();
    }
  }
  [...mount.querySelectorAll('.nav-right a'), ...mount.querySelectorAll('.drawer-links a')]
    .forEach(a => a.addEventListener('click', onNavClick));

  // ---------- Language application ----------
  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    LANG = lang;
    localStorage.setItem('lang', lang);

    // Doc direction (rtl for fa/ar)
    document.documentElement.setAttribute('dir', I18N[lang].dir);

    // Highlight selected flag (all instances)
    mount.querySelectorAll('.lang-flag').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Translate nav labels
    const t = I18N[lang].nav;
    const map = [
      { sel: 'a[data-i18n="back"]', key: 'back' },
      { sel: 'a[data-i18n="basic"]', key: 'basic' },
      { sel: 'a[data-i18n="scientific"]', key: 'scientific' },
      { sel: 'a[data-i18n="matrix"]', key: 'matrix' },
      { sel: 'a[data-i18n="geometry"]', key: 'geometry' },
      { sel: 'a[data-i18n="graphing"]', key: 'graphing' },
      { sel: 'a[data-i18n="stats"]', key: 'stats' },
    ];
    map.forEach(({ sel, key }) => {
      mount.querySelectorAll(sel).forEach(a => a.textContent = t[key]);
    });

    // Translate hero if present (index.html)
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const exploreBtn = document.getElementById('exploreBtn');
    if (heroTitle) heroTitle.textContent = I18N[lang].heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = I18N[lang].heroSubtitle;
    if (exploreBtn) exploreBtn.textContent = I18N[lang].explore;
  }

  // Flag clicks
  mount.querySelectorAll('.lang-flag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage(btn.dataset.lang);
    });
  });

  // Apply saved language on load
  applyLanguage(LANG);
});
