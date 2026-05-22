(function () {
  'use strict';
  var COLLAPSED_KEY = 'sl_sidebar_collapsed';
  var sidebar = document.getElementById('sidebar');
  var mainContent = document.getElementById('mainContent');
  var toggleBtn = document.getElementById('sidebarToggle');

  if (!sidebar) return;

  if (localStorage.getItem(COLLAPSED_KEY) === 'true') {
    sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('expanded');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var collapsed = sidebar.classList.toggle('collapsed');
      if (mainContent) mainContent.classList.toggle('expanded', collapsed);
      localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    });
  }
})();
