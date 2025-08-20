// menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  // treat / or /index.html as home
  const path = location.pathname.toLowerCase();
  const isHome =
    path === '/' ||
    path.endsWith('/index.html') ||
    path === '' ||
    path === '/index.html';

  mount.innerHTML = `
    <nav class="mini-nav container">
      <a class="brand" href="index.html">🧮 Calculator Hub</a>

      <div class="nav-right">
        ${!isHome ? `<a class="back-btn" href="index.html" aria-label="Back to main menu">← Back to Main</a>` : ''}

        <!-- quick links (optional; keep or remove) -->
        <a href="basic.html">Basic</a>
        <a href="scientific.html">Scientific</a>
        <a href="matrix.html">Matrix</a>
        <a href="geometry.html">Geometry</a>
        <a href="graphing.html">Graphing</a>
        <a href="stats.html">Statistics</a>
      </div>
    </nav>
  `;
});
