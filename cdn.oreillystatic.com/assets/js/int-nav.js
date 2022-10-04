//Run on page load
(function() {
  //Toggle isActive and mobileHidden classes for mobileNavButton
  if (document.getElementById('mobileNavButton') !== null) {
    var mobileNavButton = document.getElementById('mobileNavButton');
    mobileNavButton.addEventListener("click", function (event) {
      var expanded = mobileNavButton.getAttribute('aria-expanded') === 'true' || false;
      mobileNavButton.setAttribute('aria-expanded', !expanded);
      mobileNavButton.classList.toggle('isActive');
      document.getElementById('navItems').classList.toggle('isActive');
    });
  }
})();