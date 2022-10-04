(function() {
  var getADemoLinks = document.querySelectorAll('#demoNavButton, #demoHomeTabletButton, #demoHomeTeamsButton');
  
  for (var i = 0; i < getADemoLinks.length ; i++) {
    getADemoLinks[i].addEventListener("click", function (event) {
      window.dataLayer.push({
        'event': 'marketing_click',
        'title': 'get a demo'
      });
    }, false);
  }


  var requestADemoLinks = document.querySelectorAll('#demoFeaturesIntroButton, #demoFeaturesCTAButton');
  
  for (var i = 0; i < requestADemoLinks.length ; i++) {
    requestADemoLinks[i].addEventListener("click", function (event) {
      window.dataLayer.push({
        'event': 'marketing_click',
        'title': 'request a demo'
      });
    }, false);
  }
})();