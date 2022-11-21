'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const featuresSection = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const operationsContainer = document.querySelector('.operations');
const operationsTabContainer = document.querySelector(
  '.operations__tab-container'
);
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const featureImages = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const sliderNextButton = document.querySelector('.slider__btn--right');
const sliderPreviousButton = document.querySelector('.slider__btn--left');
const sliderPaginationContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal =>
  btnOpenModal.addEventListener('click', openModal)
);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const cookiesMessage = document.createElement('div');
cookiesMessage.classList.add('cookie-message');
cookiesMessage.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Close</button>';

document.querySelector('header').prepend(cookiesMessage);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => cookiesMessage.remove());

btnLearnMore.addEventListener('click', () =>
  featuresSection.scrollIntoView({ behavior: 'smooth' })
);

cookiesMessage.style.height =
  Number.parseFloat(getComputedStyle(cookiesMessage).height, 10) + 30 + 'px';

// * navigation links smooth scroll: event delegation
navLinks.addEventListener('click', e => {
  const selectedLink = e.target;
  if (
    selectedLink.matches('a') &&
    !selectedLink.classList.contains('nav__link--btn')
  ) {
    e.preventDefault();
    const sectionId = selectedLink.getAttribute('href');
    const section = document.querySelector(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// * navigation hover effect: event delegation
const navFadeHoverEffect = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const selectedLink = e.target;
    const selectedLinkSiblings = selectedLink
      .closest('.nav')
      .querySelectorAll('.nav__link');
    const navLogo = selectedLink.closest('.nav').querySelector('.nav__logo');

    selectedLinkSiblings.forEach(link => {
      if (link !== selectedLink) link.style.opacity = this;
    });
    navLogo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', navFadeHoverEffect.bind(0.5));
nav.addEventListener('mouseout', navFadeHoverEffect.bind(1));

// * operations tab component: event delegation
operationsTabContainer.addEventListener('click', e => {
  const tabButton = e.target.closest('.operations__tab');
  if (!tabButton) return;

  operationsTabContainer
    .querySelectorAll('.operations__tab')
    .forEach(tabButton =>
      tabButton.classList.remove('operations__tab--active')
    );
  tabButton.classList.add('operations__tab--active');

  const tabNumber = tabButton.dataset.tab;
  operationsContainer
    .querySelectorAll('.operations__content')
    .forEach(content => {
      content.classList.remove('operations__content--active');

      operationsContainer
        .querySelector(`.operations__content--${tabNumber}`)
        .classList.add('operations__content--active');
    });
});

// * sticky navigation
const navStickyOptions = {
  rootMargin: -Number.parseFloat(getComputedStyle(nav).height) + 'px',
};

const addNavSticky = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(addNavSticky, navStickyOptions);

headerObserver.observe(header);

// * animate elements on scroll
const sectionOptions = {
  threshold: 0.15,
};

const animateSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(
  animateSection,
  sectionOptions
);

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// * lazy loading images
const displayFullImage = function (entries, observer) {
  const [entry] = entries;
  const image = entry.target;
  if (!entry.isIntersecting) return;
  image.src = entry.target.dataset.src;

  // * just to synchronize the removal of the blur effect with the loading of images
  image.addEventListener('load', () => image.classList.remove('lazy-img'));

  observer.unobserve(image);
};
const imageObserver = new IntersectionObserver(displayFullImage, {
  rootMargin: '200px',
});

featureImages.forEach(image => imageObserver.observe(image));

// * testimonials slider
const testimonialsSlider = function () {
  let currentSlide = 0;
  const lastSlide = slides.length - 1;

  const init = function () {
    goToSlide(currentSlide);
    showSliderPagination();
    updateSliderPagination(currentSlide);
  };

  // * testimonials slider: changing slides
  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === lastSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    updateSliderPagination(currentSlide);
  };
  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = lastSlide;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    updateSliderPagination(currentSlide);
  };

  sliderNextButton.addEventListener('click', nextSlide);
  sliderPreviousButton.addEventListener('click', previousSlide);

  // * testimonials slider: slide pagination
  const showSliderPagination = function () {
    slides.forEach((_, index) => {
      sliderPaginationContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const updateSliderPagination = function (currentSlide) {
    sliderPaginationContainer
      .querySelectorAll('.dots__dot')
      .forEach(pageNode => pageNode.classList.remove('dots__dot--active'));
    sliderPaginationContainer
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };

  sliderPaginationContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const pageNode = e.target;
      goToSlide(pageNode.dataset.slide);
      updateSliderPagination(pageNode.dataset.slide);
    }
  });

  init();
};

testimonialsSlider();
