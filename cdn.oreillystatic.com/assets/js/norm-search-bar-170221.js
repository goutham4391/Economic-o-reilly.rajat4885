jQuery(document).ready(function() {
  // clear search values on page load
  $('#qd').attr('value',''); 
  $('#qm').attr('value','');
  // set timeout variable 
  var searchTimeout;
  // when user clicks on search button
  $('a.search-cta').on('click', function(e){
    e.preventDefault();
    // if search bar has text entered, submit search
    if ($('#qd').attr('value')) {
      $('form.search-form').submit();
    } else if ($('#qd').hasClass('expanded')) {
    // if search bar is open but empty, close search bar
      $('#qd').removeClass('expanded');
      $('#user').removeClass('contracted');
    } else {
    // if search bar is closed, open search bar
      $('#qd').focus();
    }
  });
  $('#qd').on('focus', function(e){
    $('#qd').addClass('expanded');
    $('#user').addClass('contracted');
  });
  // when user clicks on search button on mobile dropdown menu
  $('a.search-cta--m').on('click', function(e){
    e.preventDefault();
    if ($('#qm').attr('value')) {
    // if search bar has text entered, submit search
      $('form.search-form--m').submit();
    } else {
    // if search bar is empty, give search bar focus
      $('#qm').focus();
    }
  });
  // timeout to close search bar if user focuses away
  $('#qd').on('focusout', function(e){
    if ($('#qd').attr('value')) {
      // if search bar has text entered, wait 5 secs before closing search bar
      searchTimeout=setTimeout (
        function() {
          $('#qd').removeClass('expanded');
          $('#user').removeClass('contracted');
          $('#qd').attr('value','');
        }, 5000);
    } else {
      // if search bar is empty, wait .25 secs before closing search bar
      searchTimeout=setTimeout (
        function() {
          $('#qd').removeClass('expanded');
          $('#user').removeClass('contracted');
          $('#qd').attr('value','');
        }, 250);
    }
  });
  // cancel timeout timer if user focuses back on search
  $('#qd').on('focus', function(e){
    clearTimeout(searchTimeout);
  });
});