let navList = document.querySelector('.nav-list');
let navToggleOpen = document.querySelector('.main-nav__toggle-open');
let navToggleClose = document.querySelector('.main-nav__toggle-close');

navList.classList.remove('nav-list--nojs');

navToggleOpen.addEventListener('click', function () {
  if (!navList.classList.contains('nav-list--close')) {
    return;
  }

  navList.classList.remove('nav-list--close');
  navList.classList.add('nav-list--open');
});

navToggleClose.addEventListener('click', function () {
  if (navList.classList.contains('nav-list--open')) {
    navList.classList.remove('nav-list--open');
    navList.classList.add('nav-list--close');
  }
});
