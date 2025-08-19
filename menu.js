<!-- menu.js (reference) -->
<script>
// Inject navbar.html into #navbar on every page
fetch('navbar.html')
  .then(r => r.text())
  .then(html => { document.getElementById('navbar').innerHTML = html; })
  .catch(() => { console.warn('Navbar failed to load'); });
</script>
