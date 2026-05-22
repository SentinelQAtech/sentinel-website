const Sidebar = (() => {
  const COLLAPSED_KEY = 'sl_sidebar_collapsed';

  let sidebar, mainWrapper, overlay, toggleBtn;

  function init() {
    sidebar     = document.getElementById('sidebar');
    mainWrapper = document.getElementById('main-wrapper');
    overlay     = document.getElementById('sidebar-overlay');
    toggleBtn   = document.getElementById('sidebar-toggle');

    if (!sidebar) return;

    _restoreState();
    _bindEvents();
  }

  function _restoreState() {
    const isCollapsed = localStorage.getItem(COLLAPSED_KEY) === 'true';
    if (isCollapsed) _applyCollapsed(true, false);
  }

  function _bindEvents() {
    toggleBtn?.addEventListener('click', () => {
      if (_isMobile()) {
        _closeMobile();
      } else {
        toggle();
      }
    });

    overlay?.addEventListener('click', _closeMobile);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _isMobile()) _closeMobile();
    });
  }

  function toggle() {
    const collapsed = sidebar.classList.contains('collapsed');
    _applyCollapsed(!collapsed, true);
  }

  function _applyCollapsed(state, save) {
    sidebar.classList.toggle('collapsed', state);
    mainWrapper?.classList.toggle('sidebar-collapsed', state);
    sidebar.setAttribute('aria-expanded', String(!state));
    if (save) localStorage.setItem(COLLAPSED_KEY, String(state));
  }

  function openMobile() {
    sidebar.classList.add('mobile-open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function _closeMobile() {
    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function _isMobile() {
    return window.innerWidth <= 768;
  }

  return { init, toggle, openMobile };
})();
