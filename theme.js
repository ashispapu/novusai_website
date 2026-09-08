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

  function init() {
    applyTheme(preferredTheme());
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
