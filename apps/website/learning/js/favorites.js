// Sentinel Learning — Course Favorites
// window.SL_Favorites

(function () {
  'use strict';

  var KEY = 'sentinel_learning_favorite_courses';

  function _load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (_) { return []; }
  }

  function _save(ids) {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (_) {}
  }

  window.SL_Favorites = {
    getAll: function () { return _load(); },

    has: function (id) { return _load().indexOf(id) !== -1; },

    add: function (id) {
      var ids = _load();
      if (ids.indexOf(id) === -1) { ids.push(id); _save(ids); }
    },

    remove: function (id) {
      _save(_load().filter(function (i) { return i !== id; }));
    },

    toggle: function (id) {
      if (this.has(id)) this.remove(id); else this.add(id);
    }
  };
})();
