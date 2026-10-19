(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('trung-theme'); } catch (_) {}
  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#111820' : '#fafbfc';
  }
  applyTheme(root.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
  themeButton.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(savedTheme);
    try { localStorage.setItem('trung-theme', savedTheme); } catch (_) {}
  });
  systemTheme.addEventListener('change', event => {
    if (savedTheme !== 'light' && savedTheme !== 'dark') applyTheme(event.matches ? 'dark' : 'light');
  });
  const sculpture = document.querySelector('.hero-sculpture');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      sculpture.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    }).observe(sculpture);
  }
})();
