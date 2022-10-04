/*
Get all elements with "data-hide-after-date" attribute
For each element, remove the attribute (to show the element) if element's date is greater than the current date.

Get all elements with "data-hide-before-date" attribute
For each element, remove the attribute (to show the element) if element's date is less than the current date.
*/
(function () {
  const now = new Date();

  const a = document.querySelectorAll('[data-hide-after-date]');
  a.forEach((element) => {
    d = new Date(element.getAttribute('data-hide-after-date'));

    if (d.getTime() > now.getTime()) {
      element.removeAttribute('data-hide-after-date');
    }
  });

  const b = document.querySelectorAll('[data-hide-before-date]');
  b.forEach((element) => {
    d = new Date(element.getAttribute('data-hide-before-date'));

    if (d.getTime() < now.getTime()) {
      element.removeAttribute('data-hide-before-date');
    }
  });
}());