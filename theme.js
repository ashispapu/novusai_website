/**
 * Niyan portal theme — explicit light and dark modes, persisted.
 */
(function () {
  const STORAGE_KEY = 'niyan-theme';

  function preferredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      /* ignore */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      const active = btn.getAttribute('data-theme-set') === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function closeNavMenus(except) {
    document.querySelectorAll('.nav-item.has-menu').forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      const trigger = item.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function initNavMenus() {
    const items = document.querySelectorAll('.nav-item.has-menu');
    if (!items.length) return;

    const hoverNav = window.matchMedia('(hover: hover) and (pointer: fine)');

    items.forEach((item) => {
      const trigger = item.querySelector('.nav-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (event) => {
        if (hoverNav.matches) return;
        event.preventDefault();
        const willOpen = !item.classList.contains('is-open');
        closeNavMenus();
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.main-nav')) closeNavMenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNavMenus();
        const active = document.activeElement;
        if (active && active.closest('.nav-item.has-menu')) {
          const trigger = active.closest('.nav-item.has-menu').querySelector('.nav-trigger');
          if (trigger) trigger.focus();
        }
      }
    });
  }

  function init() {
    applyTheme(preferredTheme());
    initNavMenus();
    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-theme-set');
        if (next !== 'light' && next !== 'dark') return;
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
        applyTheme(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
