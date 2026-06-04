(function () {
  var savedTheme = localStorage.getItem("sentinel_site_theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
