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
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project')];
  const count = document.querySelector('#filter-count');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    });
    const visible = projects.filter(project => !project.hidden).length;
    count.textContent = visible + (visible === 1 ? ' project' : ' projects');
  }));
  const sculpture = document.querySelector('.hero-sculpture');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      sculpture.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    }).observe(sculpture);
  }
})();
