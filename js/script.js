/* LAZYLOAD */
lazyload();

/* STOP-SCROLL MODAL*/
function scrollLock(timestampLock) {
    if (!startLock) startLock = timestampLock;
    const elapsed = timestampLock - startLock;

    if (elapsed < delay) {
        requestAnimationFrame(scrollLock);
    } else {
        stopScroll.classList.remove('stop-scroll');
        stopScroll.removeAttribute('style');
        window.removeEventListener('keydown', tabFocus);
        window.lastFocus.focus();
        startLock = null;
        delay = 0;
    }
}
const stopScroll = document.querySelector('body');

/* MENU 1*/
const burgerButton = document.querySelector('.header__burger');
const burgerLine = document.querySelectorAll('.header__line');
const burgerBox = document.querySelector('.header__box');
const logo = document.querySelector('.header__logo');
const burgerScroll = document.querySelector('.header__scroll-box');

burgerButton.addEventListener('click', function () {
    burgerButton.classList.toggle('header__burger--open');
    burgerBox.classList.toggle('header__box--active');
    if (!burgerBox.classList.contains('header__box--active')) {
        logo.removeAttribute('tabindex');
        burgerButton.setAttribute('aria-expanded', 'false');
        delay = Date.now() - window.startAnimation;
        if (delay > 150) {
            delay = 150;
        }
        requestAnimationFrame(scrollLock);
    } else {
        logo.setAttribute('tabindex', '-1');
        burgerButton.setAttribute('aria-expanded', 'true');
        window.startAnimation = Date.now();
        let clientSizeBurger = stopScroll.clientWidth;
        let windowSizeBurger = window.innerWidth;
        const scrollSizeBurger = String(windowSizeBurger - clientSizeBurger);
        stopScroll.style.paddingRight = scrollSizeBurger + 'px';
        stopScroll.classList.add('stop-scroll');
        window.lastFocus = document.activeElement;
        const focusElements = burgerBox.querySelectorAll([
            'a[href]',
            'button',
            'input',
            'select',
            'textarea',
            '[tabindex]',
        ]);
        window.focusArray = Array.prototype.slice.call(focusElements);
        window.focusArray.unshift(burgerButton);
        window.addEventListener('keydown', tabFocus);
    }

    burgerLine.forEach(function (line) {
        line.classList.toggle('header__line--passive');
        line.classList.toggle('header__line--active');
    });
});

/* MENU LIST */
const headerMenu = document.querySelectorAll('.header__link-anchor');
headerMenu.forEach(function (elem) {
    elem.addEventListener('click', function (event) {
        burgerButton.classList.toggle('header__burger--open');
        burgerBox.classList.toggle('header__box--active');
        stopScroll.classList.remove('stop-scroll');

        burgerLine.forEach(function (line) {
            line.classList.toggle('header__line--passive');
            line.classList.toggle('header__line--active');
        });

        const anchor = this.getAttribute('href').replace('#', '');
        document.getElementById(anchor).scrollIntoView({
            behavior: 'smooth',
        });
        event.preventDefault();
    });
});

const simplebarMenu = new SimpleBar(burgerScroll, {
    autoHide: false,
    scrollbarMaxSize: 28,
    classNames: {
        content: 'header__content-menu',
        scrollbar: 'header__scrollbar-menu',
        track: 'header__track-menu',
    },
});

/* MENU 2 */
const headerSelectMenu = document.querySelector('.header__menu-select');
const headerSelectButton = document.querySelectorAll('.header__button-select');
const headerSelectBox = document.querySelectorAll('.header__box-select');
const oldMenuAria = 0;

headerSelectButton.forEach(function (button, index) {
    button.addEventListener('click', function () {
        headerSelectButton[menuAria].setAttribute('tabindex', '-1');
        const activeBox = document.querySelector('.header__box-select--active');
        const activeButton = document.querySelector('.header__button-select--open');
        if (activeBox && this.nextElementSibling !== activeBox) {
            activeBox.classList.remove('header__box-select--active');
            activeButton.classList.remove('header__button-select--open');
            activeButton.setAttribute('aria-expanded', 'false');
        }
        this.nextElementSibling.classList.toggle('header__box-select--active');
        button.classList.toggle('header__button-select--open');
        button.setAttribute('tabindex', '0');
        if (button.classList.contains('header__button-select--open')) {
            button.setAttribute('aria-expanded', 'true');
        } else {
            button.setAttribute('aria-expanded', 'false');
        }
        menuAria = index;
    });
});

document.addEventListener('click', function (event) {
    if (event.target.closest('.header__box-select--active') || event.target.closest('.header__button-select--open'))
        return;
    const activeBox = document.querySelector('.header__box-select--active');
    const activeButton = document.querySelector('.header__button-select--open');
    if (activeBox) {
        activeBox.classList.remove('header__box-select--active');
        activeButton.classList.remove('header__button-select--open');
        activeButton.setAttribute('aria-expanded', 'false');
        if (activeBox.querySelector('[tabindex="0"]')) {
            activeBox.querySelector('[tabindex="0"]').setAttribute('tabindex', '-1');
        }
        menuAriaBox = 0;
    }
});

let menuAria = 0;
let menuAriaBox = 0;
let oldAria = 0;
let newFocus = null;
headerSelectMenu.addEventListener('keydown', ariaMenu);
function ariaMenu(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        headerSelectButton[menuAria].setAttribute('tabindex', '-1');
        if (headerSelectBox[menuAria].querySelector('[tabindex="0"]')) {
            headerSelectBox[menuAria].querySelector('[tabindex="0"]').setAttribute('tabindex', '-1');
        }
        if (event.key === 'ArrowRight') {
            oldAria = menuAria;
            menuAria++;
            if (menuAria >= headerSelectButton.length) {
                menuAria = 0;
            }
        }
        if (event.key === 'ArrowLeft') {
            oldAria = menuAria;
            menuAria--;
            if (menuAria < 0) {
                menuAria = headerSelectButton.length - 1;
            }
        }
        if (headerSelectButton[oldAria].classList.contains('header__button-select--open')) {
            headerSelectButton[menuAria].classList.add('header__button-select--open');
            headerSelectBox[menuAria].classList.add('header__box-select--active');
            headerSelectButton[menuAria].setAttribute('aria-expanded', 'true');
            headerSelectButton[oldAria].classList.remove('header__button-select--open');
            headerSelectBox[oldAria].classList.remove('header__box-select--active');
            headerSelectButton[oldAria].setAttribute('aria-expanded', 'false');
        }
        headerSelectButton[menuAria].setAttribute('tabindex', '0');
        headerSelectButton[menuAria].focus();
        menuAriaBox = 0;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        let headerSelectPage = headerSelectBox[menuAria].querySelectorAll('.header__item-page > .header__link-page');
        if (!headerSelectButton[menuAria].classList.contains('header__button-select--open')) {
            menuAriaBox = 0;
            headerSelectButton[menuAria].setAttribute('tabindex', '-1');
            headerSelectButton[menuAria].classList.add('header__button-select--open');
            headerSelectBox[menuAria].classList.add('header__box-select--active');
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            setTimeout(function () {
                headerSelectButton[menuAria].setAttribute('aria-expanded', 'true');
                headerSelectPage[menuAriaBox].focus();
            }, 35);
        } else if (!headerSelectBox[menuAria].querySelector('[tabindex="0"]')) {
            menuAriaBox = 0;
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            headerSelectPage[menuAriaBox].focus();
        } else {
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '-1');
            menuAriaBox++;
            if (menuAriaBox >= headerSelectPage.length) {
                menuAriaBox = 0;
            }
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            headerSelectPage[menuAriaBox].focus();
        }
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        let headerSelectPage = headerSelectBox[menuAria].querySelectorAll('.header__item-page > .header__link-page');
        if (!headerSelectButton[menuAria].classList.contains('header__button-select--open')) {
            menuAriaBox = headerSelectPage.length - 1;
            headerSelectButton[menuAria].setAttribute('tabindex', '-1');
            headerSelectButton[menuAria].classList.add('header__button-select--open');
            headerSelectBox[menuAria].classList.add('header__box-select--active');
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            setTimeout(function () {
                headerSelectButton[menuAria].setAttribute('aria-expanded', 'true');
                headerSelectPage[menuAriaBox].focus();
            }, 35);
        } else if (!headerSelectBox[menuAria].querySelector('[tabindex="0"]')) {
            menuAriaBox = headerSelectPage.length - 1;
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            headerSelectPage[menuAriaBox].focus();
        } else {
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '-1');
            menuAriaBox--;
            if (menuAriaBox < 0) {
                menuAriaBox = headerSelectPage.length - 1;
            }
            headerSelectPage[menuAriaBox].setAttribute('tabindex', '0');
            headerSelectPage[menuAriaBox].focus();
        }
    }

    if (event.key === 'Home') {
        event.preventDefault();
        oldFocus = document.activeElement;
        oldFocus.setAttribute('tabindex', '-1');
        newFocus = document.activeElement.closest('ul').firstElementChild.querySelector('button, a');
        if (newFocus.closest('.header__list-page')) {
            menuAriaBox = 0;
        } else {
            headerSelectButton[menuAria].classList.remove('header__button-select--open');
            headerSelectBox[menuAria].classList.remove('header__box-select--active');
            headerSelectButton[menuAria].setAttribute('aria-expanded', 'false');
            menuAria = 0;
        }
        newFocus.setAttribute('tabindex', '0');
        newFocus.focus();
    }

    if (event.key === 'End') {
        event.preventDefault();
        oldFocus = document.activeElement;
        oldFocus.setAttribute('tabindex', '-1');
        newFocus = document.activeElement.closest('ul').lastElementChild.querySelector('button, a');
        if (newFocus.closest('.header__list-page')) {
            menuAriaBox = document.activeElement.closest('ul').querySelectorAll('a').length - 1;
        } else {
            headerSelectButton[menuAria].classList.remove('header__button-select--open');
            headerSelectBox[menuAria].classList.remove('header__box-select--active');
            headerSelectButton[menuAria].setAttribute('aria-expanded', 'false');
            menuAria = headerSelectButton.length - 1;
        }
        newFocus.setAttribute('tabindex', '0');
        newFocus.focus();
    }

    if (event.key === 'Escape' && headerSelectButton[menuAria].classList.contains('header__button-select--open')) {
        headerSelectButton[menuAria].setAttribute('tabindex', '0');
        headerSelectButton[menuAria].classList.remove('header__button-select--open');
        headerSelectBox[menuAria].classList.remove('header__box-select--active');
        headerSelectButton[menuAria].setAttribute('aria-expanded', 'false');
        if (document.activeElement) {
            document.activeElement.setAttribute('tabindex', '-1');
        }
        setTimeout(function () {
            headerSelectButton[menuAria].focus();
        }, 10);
        menuAriaBox = 0;
    }

    if (event.key === 'Tab') {
        headerSelectMenu.querySelector('[tabindex="0"]').setAttribute('tabindex', '-1');
        headerSelectButton.forEach(function (tab) {
            tab.classList.remove('header__button-select--open');
            tab.setAttribute('aria-expanded', 'false');
            tab.nextElementSibling.classList.remove('header__box-select--active');
            tab.setAttribute('aria-expanded', 'false');
        });
        headerSelectButton[menuAria].setAttribute('tabindex', '0');
        menuAriaBox = 0;

        if (event.shiftKey) {
            event.preventDefault();
            document.querySelector('.header__button-login').focus();
        }
    }
}

/* SIMPLEBAR */
Array.prototype.forEach.call(
    document.querySelectorAll('.header__scroll-select'),
    elem =>
        new SimpleBar(elem, {
            autoHide: false,
            scrollbarMaxSize: 28,
            classNames: {
                track: 'header__track-select',
                scrollbar: 'header__scrollbar-select',
            },
        })
);
let wrapper = document.querySelectorAll('.simplebar-content-wrapper');
wrapper.forEach(function (elem) {
    elem.removeAttribute('tabindex');
    elem.removeAttribute('role');
    elem.removeAttribute('aria-label');
});

function sizeScroll() {
    if (window.innerWidth > 1919) {
        let parent = null;
        let myHeight = 0;
        document
            .querySelectorAll('.header__list-page > .header__item-page:nth-child(-n+4)')
            .forEach((el, index, array) => {
                if (!parent) {
                    parent = el.parentElement;
                }
                if (parent.contains(el)) {
                    myHeight += el.offsetHeight;
                }
                if (!parent.contains(el) || index === array.length - 1) {
                    array[index - 1].closest('.header__scroll-select').style.maxHeight =
                        myHeight + 3 * getComputedStyle(el).marginBottom.replace('px', '') + 2 + 'px';
                    myHeight = el.offsetHeight;
                    parent = el.parentElement;
                }
            });
    } else return;
}

sizeScroll();
window.addEventListener('resize', sizeScroll);

/* SEARCH */
let searchOpen = document.querySelector('.header__open-search');
let searchBox = document.querySelector('.header__box-search');
let searchClose = document.querySelector('.header__close-search');
let searchInput = document.querySelector('.header__input-search');

searchOpen.addEventListener('click', function () {
    searchBox.classList.add('header__box-search--active');
    searchOpen.classList.add('header__open-search--active');
    if (window.innerWidth < 1024) {
        burgerButton.setAttribute('tabindex', '-1');
        logo.setAttribute('tabindex', '-1');
    }
    searchOpen.setAttribute('tabindex', '-1');
    searchInput.focus();
});

searchClose.addEventListener('click', function () {
    searchOpen.classList.remove('header__open-search--active');
    burgerButton.removeAttribute('tabindex');
    logo.removeAttribute('tabindex');
    searchOpen.removeAttribute('tabindex');
    searchBox.classList.remove('header__box-search--active');
    searchOpen.focus();
});

document.addEventListener('click', function (event) {
    if (event.target.closest('.header__box-search--active') || event.target.closest('.header__open-search--active'))
        return;
    const activeSearchOpen = document.querySelector('.header__open-search--active');
    const activeSearchBox = document.querySelector('.header__box-search--active');
    if (activeSearchBox) {
        activeSearchOpen.classList.remove('header__open-search--active');
        activeSearchBox.classList.remove('header__box-search--active');
    }
});

/* AUTO SWIPER */
const previewSlider = document.querySelector('.header__wrapper');
const arrowImages = Array.from(previewSlider.children);
let oldImage = 0;
let newImage = 0;
let startTime = null;
let controlReturn = false;

function imageChange(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    if (elapsed > 9000 && controlReturn == false) {
        arrowImages[oldImage].classList.remove('header__image--return');
        oldImage = newImage;
        newImage = (newImage + 1) % arrowImages.length;
        if (oldImage == arrowImages.length - 1) {
            arrowImages[oldImage].classList.add('header__image--return');
        }
        arrowImages[newImage].classList.add('header__image--active');
        controlReturn = true;
    }
    if (elapsed > 10000) {
        arrowImages[oldImage].classList.remove('header__image--active');
        startTime = timestamp;
        controlReturn = false;
    }
    requestAnimationFrame(imageChange);
}
requestAnimationFrame(imageChange);

/* BUTTON MAILING */
document.querySelector('.preview__button').addEventListener('click', function () {
    document.getElementById('contacts').scrollIntoView({
        behavior: 'smooth',
    });
});

/* GALLERY */
function clearing(elem) {
    while (elem.firstChild) elem.firstChild.remove();
}

function tabFocus(event) {
    if (
        event.code == 'Tab' &&
        (overlay.classList.contains('gallery__overlay--active') || burgerBox.classList.contains('header__box--active'))
    ) {
        const focusedIndex = window.focusArray.indexOf(document.activeElement);
        if (event.shiftKey && focusedIndex === 0) {
            window.focusArray[window.focusArray.length - 1].focus();
            event.preventDefault();
        }
        if (!event.shiftKey && focusedIndex === window.focusArray.length - 1) {
            window.focusArray[0].focus();
            event.preventDefault();
        }
    }
}

const overlay = document.querySelector('.gallery__overlay');
const boxModal = document.querySelector('.gallery__modal');
const modalClose = document.querySelector('.gallery__close-modal');
let startLock = null;
let delay = null;

/* event 1 */
modalClose.addEventListener('click', function () {
    delay = Date.now() - window.startAnimation;
    if (delay > 300) {
        delay = 300;
    }
    boxModal.classList.remove('gallery__modal--active');
    overlay.classList.remove('gallery__overlay--active');
    requestAnimationFrame(scrollLock);
    window.removeEventListener('keydown', tabFocus);
});

/* event 2 */
overlay.addEventListener('click', function (event) {
    if (!boxModal.contains(event.target)) {
        delay = Date.now() - window.startAnimation;
        if (delay > 300) {
            delay = 300;
        }
        boxModal.classList.remove('gallery__modal--active');
        overlay.classList.remove('gallery__overlay--active');
        requestAnimationFrame(scrollLock);
        window.removeEventListener('keydown', tabFocus);
    }
});

/* event 3 */
document.body.addEventListener('keyup', function (event) {
    var key = event.code;
    if (key == 'Escape' && boxModal.classList.contains('gallery__modal--active')) {
        delay = Date.now() - window.startAnimation;
        if (delay > 300) {
            delay = 300;
        }
        boxModal.classList.remove('gallery__modal--active');
        overlay.classList.remove('gallery__overlay--active');
        requestAnimationFrame(scrollLock);
        window.removeEventListener('keydown', tabFocus);
    }
});

/* SELECT */
const element = document.querySelector('.gallery__select');
const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',
    allowHTML: false,
    shouldSort: true,
    position: 'bottom',
    classNames: {
        containerOuter: 'choices',
        containerInner: 'choices__inner',
        input: 'choices__input',
        inputCloned: 'choices__input--cloned',
        list: 'choices__list',
        listItems: 'choices__list--multiple',
        listSingle: 'choices__list--single',
        listDropdown: 'choices__list--dropdown',
        item: 'choices__item',
        itemSelectable: 'choices__item--selectable',
        itemDisabled: 'choices__item--disabled',
        itemChoice: 'choices__item--choice',
        placeholder: 'choices__placeholder',
        group: 'choices__group',
        groupHeading: 'choices__heading',
        button: 'choices__button',
        activeState: 'is-active',
        focusState: 'is-focused',
        openState: 'is-open',
        disabledState: 'is-disabled',
        highlightedState: 'is-highlighted',
        selectedState: 'is-selected',
        flippedState: 'is-flipped',
        loadingState: 'is-loading',
        noResults: 'has-no-results',
        noChoices: 'has-no-choices',
    },
});

document.querySelector('.choices').setAttribute('role', 'combobox');
document.querySelector('.choices').setAttribute('aria-labelledby', 'gallery-span');
document.querySelector('.choices').setAttribute('aria-controls', 'choices-listbox');
document.querySelector('.choices__list:first-child').setAttribute('id', 'choices-listbox');
document.querySelector('.choices__item--selectable').removeAttribute('aria-selected');

element.addEventListener('showDropdown', function () {
    document.querySelectorAll('.choices__item--choice').forEach(function (elem) {
        elem.classList.remove('is-highlighted');
    });
    document.querySelector('.choices__item--choice:first-child').classList.add('is-highlighted');
});

(async function getResponse() {
    const library = await fetch('./json/pictures.json');
    const content = await library.json();
    const select = document.querySelector('.gallery__select');
    const listGallery = document.querySelector('.gallery__list-swiper');

    function showCards(value) {
        window.filteredCards = content.filter(item => item.category === value);
        const itemsGalleryHTML = window.filteredCards
            .map(item => {
                let htmlGallery = '';
                htmlGallery += `
                <li class="gallery__item-swiper swiper-slide">
                    <button class="gallery__card-swiper button-reset flex" id="${item.id}">
                        <picture class="gallery__picture-swiper">
                            <source srcset="${item.img320}" media="(max-width: 767px)">
                            <source srcset="${item.img768}" media="(max-width: 1023px)">
                            <source srcset="${item.img1024}" media="(max-width: 1919px)">
                            <img class="gallery__img-swiper" src="${item.img1920}" alt="${item.alt}" aria-live="off">
                        </picture>
                    </button>
                </li>`;
                return htmlGallery;
            })
            .join('');

        listGallery.insertAdjacentHTML('beforeend', itemsGalleryHTML);

        const buttonGallery = document.querySelectorAll('.gallery__card-swiper');
        buttonGallery.forEach(function (elem) {
            elem.addEventListener('click', showModals);
        });
    }

    function showModals() {
        const contentModal = document.querySelector('.gallery__content-modal');
        window.lastFocus = document.activeElement;
        clearing(contentModal);
        const filteredModals = content.filter(item => item.category === newSelect);
        const index = this.id;
        const htmlModal = `
            <picture class="gallery__picture-modal">
                <source srcset="${filteredModals[index].modal320}" media="(max-width: 767px)" />
                <source srcset="${filteredModals[index].modal768}" media="(max-width: 1023px)" />
                <source srcset="${filteredModals[index].modal1024}" media="(max-width: 1919px)" />
                <img class="gallery__img-modal" src="${filteredModals[index].modal1920}" alt="${filteredModals[index].altModal}" />
            </picture>
            <div class="gallery__information-modal">
                <div class="gallery__scroll-modal">
                    <h3 class="gallery__subject-modal subject" id="modal-title">
                        ${filteredModals[index].author}
                        <span class="gallery__name-modal">"${filteredModals[index].name}"</span>
                    </h3>
                    <time class="gallery__date-modal span-gray" datetime="${filteredModals[index].datetime}">${filteredModals[index].date}</time>
                    <p class="gallery__modal-text text">
                        ${filteredModals[index].text}
                    </p>
                </div>
            </div>
        `;
        contentModal.insertAdjacentHTML('afterbegin', htmlModal);

        window.startAnimation = Date.now();
        let clientSize = stopScroll.clientWidth;
        let windowSize = window.innerWidth;
        const scrollSize = String(windowSize - clientSize);

        boxModal.classList.add('gallery__modal--active');
        overlay.classList.add('gallery__overlay--active');
        stopScroll.classList.add('stop-scroll');
        stopScroll.style.paddingRight = scrollSize + 'px';

        const simplebarModal = new SimpleBar(document.querySelector('.gallery__scroll-modal'), {
            scrollbarMaxSize: 28,
            classNames: {
                track: 'gallery__track-modal',
                scrollbar: 'gallery__scrollbar-modal',
            },
        });

        const modal = document.querySelector('.gallery__modal');

        const focusElements = modal.querySelectorAll([
            'a[href]',
            'button',
            'input',
            'select',
            'textarea',
            '[tabindex]',
        ]);
        window.focusArray = Array.prototype.slice.call(focusElements);

        window.addEventListener('keydown', tabFocus);
        modalClose.focus();
    }

    /* SWIPER-GALLERY */
    const swiperGallery = new Swiper('.gallery__swiper', {
        slidesPerView: 1,
        spaceBetween: 50,
        slidesPerGroup: 1,
        a11y: false,
        grid: {
            rows: 1,
            fill: 'row',
        },
        loop: false,
        navigation: {
            nextEl: '.gallery__buttondark--right',
            prevEl: '.gallery__buttondark--left',
            disabledClass: 'buttondark--disabled',
            lockClass: 'buttondark--lock',
        },
        pagination: {
            el: '.gallery__number',
            type: 'fraction',
            lockClass: 'gallery__pagination--lock',
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        breakpoints: {
            3840: {
                slidesPerView: 3,
                spaceBetween: 100,
                slidesPerGroup: 3,
                grid: {
                    rows: 2,
                    fill: 'row',
                },
            },
            1920: {
                slidesPerView: 3,
                spaceBetween: 50,
                slidesPerGroup: 3,
                grid: {
                    rows: 2,
                    fill: 'row',
                },
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 34,
                slidesPerGroup: 2,
                grid: {
                    rows: 2,
                    fill: 'row',
                },
            },
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        slideVisibleClass: 'gallery__slide-visible',

        on: {
            update: function () {
                let slidesLenght = this.slides.length;
                this.slides.forEach(function (slide, index) {
                    if (!slide.classList.contains('gallery__slide-visible')) {
                        slide.querySelector('.gallery__card-swiper').setAttribute('tabindex', '-1');
                        slide.querySelector('.gallery__card-swiper').setAttribute('aria-hidden', 'true');
                    } else {
                        slide.querySelector('.gallery__card-swiper').setAttribute('tabindex', '');
                        slide.querySelector('.gallery__card-swiper').setAttribute('aria-hidden', 'false');
                    }
                    slide
                        .querySelector('.gallery__card-swiper')
                        .setAttribute(
                            'aria-label',
                            `${window.filteredCards[index].alt} (${index + 1} из ${slidesLenght})`
                        );
                });
                document
                    .querySelector('.gallery__pictures')
                    .setAttribute('aria-roledescription', `карусель из ${slidesLenght} элементов`);
            },
            slideChange: function () {
                this.slides.forEach(function (slide) {
                    if (!slide.classList.contains('gallery__slide-visible')) {
                        slide.querySelector('.gallery__card-swiper').setAttribute('tabindex', '-1');
                        slide.querySelector('.gallery__card-swiper').setAttribute('aria-hidden', 'true');
                    } else {
                        slide.querySelector('.gallery__card-swiper').setAttribute('tabindex', '');
                        slide.querySelector('.gallery__card-swiper').setAttribute('aria-hidden', 'false');
                    }
                });
            },
        },
    });

    let newSelect = select.value;
    document.querySelector('.is-selected').remove();
    showCards(newSelect);
    swiperGallery.update();

    select.addEventListener('change', function (event) {
        clearing(listGallery);
        newSelect = event.target.value;
        document.querySelector('.is-selected').remove();
        showCards(newSelect);
        swiperGallery.update();
        swiperGallery.slideTo(0, 300);
    });
})();

/* TAB */
(async function getResponse() {
    const catalogLibrary = await fetch('./json/catalog.json');
    const catalogContent = await catalogLibrary.json();
    let mapCountry = catalogContent.map(item => item.country);
    let arrayCountry = mapCountry.filter(uniqueness);
    let arrayArtist = catalogContent.map(item => item.country + '-' + item.id);
    const radio = document.querySelectorAll('.catalog__radio-country');
    const catalogButton = document.querySelectorAll('.catalog__content-time');
    const catalogContentBox = document.querySelector('.catalog__left');

    const countryTablist = document.querySelector('.catalog__list-artist');

    /* TAB FUNCTION */
    function newTab(tabID) {
        const newTabBox = document.querySelector(`[data-target="${tabID}"]`);
        const newTab = document.querySelector(`[data-step="${tabID}"]`);
        const oldTabBox = document.querySelector('.catalog__post--active');
        const oldTab = document.querySelector('.catalog__tab--active');

        if (oldTabBox) {
            oldTabBox.classList.remove('catalog__post--active');
            oldTab.classList.remove('catalog__tab--active');
            oldTab.setAttribute('aria-selected', 'false');
            if (oldTab.closest('div') === newTab.closest('div')) {
                oldTab.setAttribute('tabindex', '-1');
            }
        }

        if (newTab.closest('ul').querySelector('[tabindex="0"]'))
            newTab.closest('ul').querySelector('[tabindex="0"]').setAttribute('tabindex', '-1');

        newTabBox.classList.add('catalog__post--active');
        newTab.classList.add('catalog__tab--active');
        newTab.setAttribute('aria-selected', 'true');
        newTab.setAttribute('tabindex', '0');
    }

    function uniqueness(value, index, array) {
        return array.indexOf(value) === index;
    }

    /* FOCUS */
    function ariaTab(event) {
        let artistTab = this.querySelectorAll('li');
        let nowTab = this.querySelector('[tabindex="0"]').closest('li');
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            nowTab.querySelector('button').setAttribute('tabindex', '-1');
            if (event.key === 'ArrowDown') {
                if (
                    !nowTab.nextElementSibling ||
                    nowTab.nextElementSibling.classList.contains('catalog__plug-artist')
                ) {
                    artistTab[0].querySelector('button').setAttribute('tabindex', '0');
                } else {
                    nowTab.nextElementSibling.querySelector('button').setAttribute('tabindex', '0');
                }
            }
            if (event.key === 'ArrowUp') {
                if (!nowTab.previousElementSibling) {
                    if (artistTab[artistTab.length - 1].classList.contains('catalog__plug-artist')) {
                        artistTab[artistTab.length - 2].querySelector('button').setAttribute('tabindex', '0');
                    } else {
                        artistTab[artistTab.length - 1].querySelector('button').setAttribute('tabindex', '0');
                    }
                } else {
                    nowTab.previousElementSibling.querySelector('button').setAttribute('tabindex', '0');
                }
            }
            this.querySelector('[tabindex="0"]').focus();
        }

        if (event.key === 'Home') {
            event.preventDefault();
            oldFocus = document.activeElement;
            oldFocus.setAttribute('tabindex', '-1');
            newFocus = document.activeElement.closest('ul').firstElementChild.querySelector('button');
            newFocus.setAttribute('tabindex', '0');
            newFocus.focus();
        }

        if (event.key === 'End') {
            event.preventDefault();
            oldFocus = document.activeElement;
            oldFocus.setAttribute('tabindex', '-1');
            newFocus = document.activeElement.closest('ul').lastElementChild.querySelector('button');
            if (!newFocus) {
                newFocus = this.querySelector('.catalog__plug-artist').previousElementSibling.querySelector('button');
            }
            newFocus.setAttribute('tabindex', '0');
            newFocus.focus();
        }
    }

    /* TAB OPEN */
    function tabControl(hashView) {
        catalogShow(hashView);

        catalogButton.forEach(function (elem) {
            if (!elem.querySelector('.catalog__link-null')) {
                elem.addEventListener('keydown', ariaTab);
            }
        });
    }

    /* TAB SHOW */
    function catalogShow(country) {
        const filteredCountry = catalogContent.filter(item => item.country === country);
        const contentNullHTML = `
        <div class="catalog__null flex">
            <picture class="catalog__picture-null">
                <source srcset="./img/catalog-320-figure.webp" media="(max-width: 767px)" />
                <source srcset="./img/catalog-768-figure.webp" media="(max-width: 1023px)" />
                <source srcset="./img/catalog-1024-figure.webp" media="(max-width: 1919px)" />
                <img class="catalog__img-null" src="./img/catalog-1920-figure.webp" alt="Прямоугольная фигура (заглушка)" />
            </picture>
            <div class="catalog__information-null">
                <p class="catalog__text-null">Здесь пока пусто</p>
                <span class="catalog__span-null">
                    А&nbsp;в&nbsp;галерее вы&nbsp;всегда можете найти что-то
                    интересное для себя
                </span>
                <a class="catalog__link-null" href="#gallery">В галерею</a>
            </div>
        </div>
        `;
        clearing(catalogContentBox);
        catalogButton.forEach(function (elem) {
            clearing(elem);
            const dataTime = elem.getAttribute('data-time');
            const filteredItemButton = filteredCountry.filter(item => item.timeline === dataTime);
            let itemsCatalogTimelineHTML = filteredItemButton
                .map(item => {
                    let htmlGallery = '';
                    htmlGallery += `
                <li class="catalog__item-artist" role="none">
                <button
                    class="catalog__button-artist button-reset text"
                    id="tab-${item.id}"
                    type="button"
                    data-step="${country}-${item.id}"
                    role="tab"
                    aria-selected="false"
                    aria-controls="tabpanel-${item.id}"
                    `;
                    if (item === filteredItemButton[0]) {
                        htmlGallery += `
                            tabindex="0"
                        >
                        ${item.preview}
                        </a>
                        </li>
                    `;
                    } else {
                        htmlGallery += `
                        tabindex="-1"
                        >
                        ${item.preview}
                    </button>
                </li>
                `;
                    }

                    return htmlGallery;
                })
                .join('');

            const itemsCatalogContentHTML = filteredItemButton
                .map(item => {
                    let htmlGallery = '';
                    if (Object.keys(item.content).length !== 0) {
                        htmlGallery += `
                        <div
                        class="catalog__post"
                        id="tabpanel-${item.id}"
                        role="tabpanel"
                        aria-labelledby="tab-${item.id}"
                        data-target="${country}-${item.id}"

                    >
                        <picture class="catalog__picture">
                            <source srcset="${item.content.img320}" media="(max-width: 767px)" />
                            <source srcset="${item.content.img768}" media="(max-width: 1023px)" />
                            <source srcset="${item.content.img1024}" media="(max-width: 1919px)" />
                            <img class="catalog__img" src="${item.content.img1920}" alt="${item.content.alt}" />
                        </picture>

                        <h3 class="catalog__subject subject">${item.name}</h3>
                        <span class="catalog__date span-gray">
                        <time class="catalog__birthday" datetime="${item.content.birthdayTime}">${item.content.birthday}</time>&nbsp;&mdash; <time class="catalog__death" datetime="${item.content.deathTime}">${item.content.death}</time>.
                        </span>
                        <p class="catalog__description text">
                            ${item.content.text}
                        </p>
                    </div>`;
                    } else {
                        htmlGallery += `
                        <div 
                        class="catalog__post"
                        id="tabpanel-${item.id}"
                        role="tabpanel"
                        aria-labelledby="tab-${item.id}"
                        data-target="${country}-${item.id}">
                        <picture class="catalog__picture">
                            <source srcset="./img/catalog-320-null.webp" media="(max-width: 767px)" />
                            <source srcset="./img/catalog-768-null.webp" media="(max-width: 1023px)" />
                            <source srcset="./img/catalog-1024-null.webp" media="(max-width: 1919px)" />
                            <img class="catalog__img" src="./img/catalog-1920-null.webp" alt="Портрет художника (заглушка)" />
                        </picture>
                        <h4 class="catalog__subject subject">Что мы о нём знаем?</h4>
                        <p class="catalog__description text">
                            Пока ничего... Зато мы&nbsp;точно знаем, что в&nbsp;галерее есть
                            на&nbsp;что посмотреть!
                        </p>
                        <a class="catalog__link-null" href="#gallery">В галерею</a>
                    </div>`;
                    }
                    return htmlGallery;
                })
                .join('');

            if (filteredItemButton != '') {
                elem.insertAdjacentHTML(
                    'beforeend',
                    `
                    <ul class="catalog__list-artist list-reset" role="tablist">
                    </ul>`
                );
                elem.querySelector('.catalog__list-artist').insertAdjacentHTML(
                    'beforeend',
                    itemsCatalogTimelineHTML +
                        `
                    <li class="catalog__plug-artist">&nbsp;</li>`
                );
                catalogContentBox.insertAdjacentHTML('beforeend', itemsCatalogContentHTML);
            } else {
                elem.insertAdjacentHTML('beforeend', contentNullHTML);
            }
        });

        /* TAB DOWNLOAD */
        if (!catalogContentBox.firstChild) {
            catalogContentBox.insertAdjacentHTML(
                'beforeend',
                `
                <div class="catalog__post catalog__post--active">
                    <picture class="catalog__picture">
                        <source srcset="./img/catalog-320-null.webp" media="(max-width: 767px)" />
                        <source srcset="./img/catalog-768-null.webp" media="(max-width: 1023px)" />
                        <source srcset="./img/catalog-1024-null.webp" media="(max-width: 1919px)" />
                        <img class="catalog__img" src="./img/catalog-1920-null.webp" alt="Портрет художника (заглушка)" />
                    </picture>
                    <h4 class="catalog__subject subject">Что мы о нём знаем?</h4>
                    <p class="catalog__description text">
                        Пока ничего... Зато мы&nbsp;точно знаем, что в&nbsp;галерее есть
                        на&nbsp;что посмотреть!
                    </p>
                    <a class="catalog__link-null" href="#gallery">В галерею</a>
                </div>`
            );
        } else {
            const previewIndex = filteredCountry.findIndex(item => Object.keys(item.content).length !== 0);
            if (previewIndex != -1) {
                newTab(country + '-' + filteredCountry[previewIndex].id);
            } else {
                newTab(country + '-' + filteredCountry[0].id);
            }
        }

        document.querySelectorAll('.catalog__button-artist').forEach(function (elem) {
            elem.addEventListener('click', function () {
                newTab(elem.getAttribute('data-step'));
                if (window.innerWidth < 1024) {
                    document.getElementById('artist').scrollIntoView({
                        behavior: 'smooth',
                    });
                } else {
                    document.getElementById('catalog').scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            });
        });
        /* TAB LINK */
        const nullLink = document.querySelectorAll('.catalog__link-null');
        nullLink.forEach(function (linkStep) {
            linkStep.addEventListener('click', function (event) {
                document.querySelector('#gallery').scrollIntoView({
                    behavior: 'smooth',
                });
                event.preventDefault();
            });
        });
    }

    /* событие открытия */
    tabControl(document.querySelector('.catalog__radio-country[checked]').value);

    /* событие изменения радиокнопки */
    radio.forEach(function (elem) {
        elem.addEventListener('change', function (event) {
            tabControl(event.target.value);
            document.getElementById('catalog').scrollIntoView({
                behavior: 'smooth',
            });
        });
    });

    /* аккордеон */
    const accordionCatalog = new Accordion('.catalog__list-time', {
        duration: 300,
        elementClass: 'catalog__item-time',
        triggerClass: 'catalog__button-time',
        panelClass: 'catalog__content-time',
        activeClass: 'catalog__item-time--active',
    });
    accordionCatalog.open(0);
})();

/* BUTTON-ALL */
const buttonMore = document.querySelector('.events__button');
var cardItem = document.querySelectorAll('.events__item');
const nextFocus = document.querySelector('.events__item--hidden').querySelector('.events__link');

buttonMore.addEventListener('click', function () {
    buttonMore.classList.add('events__button--hidden');
    cardItem.forEach(function (card) {
        card.classList.remove('events__item--hidden');
        card.classList.remove('events__item--hidden-768');
    });
    nextFocus.focus();
});

/* EVENTS */
const containerEvents = document.querySelector('.big-section__container');
const swiperBoxEvents = document.querySelector('.events__swiper');
const swiperListEvents = document.querySelector('.events__list');
const swiperItemEvents = document.querySelectorAll('.events__item');

adaptiveSwiperEvents();
window.addEventListener('resize', adaptiveSwiperEvents);

function adaptiveSwiperEvents() {
    if (containerEvents.clientWidth < 768 && swiperBoxEvents.classList.contains('swiper-initialized') == false) {
        swiperListEvents.classList.remove('events__list--no-swiper');
        window.swiperEvents = new Swiper('.events__swiper', {
            a11y: {
                enabled: false,
            },
            init: true,
            spaceBetween: 0,
            slidesPerView: 1,
            maxBackfaceHiddenSlides: 0,
            pagination: {
                el: '.events__pagination',
                type: 'bullets',
                bulletActiveClass: 'events__circle--active',
                bulletClass: 'events__circle',
                clickable: true,
            },
        });
    }

    if (containerEvents.clientWidth >= 768 && swiperBoxEvents.classList.contains('swiper-initialized') == true) {
        window.swiperEvents.destroy(true, true);
        swiperListEvents.classList.add('events__list--no-swiper');
    }
}

/* EDITIONS */
const fromCost = document.querySelector('[data-name="from"');
const toCost = document.querySelector('[data-name="to"');

const inputCost = new Inputmask('numeric', {
    rightAlign: false,
    groupSeparator: ' ',
    max: 50000,
});

inputCost.mask(fromCost);
inputCost.mask(toCost);

/* ПЕРЕМЕННЫЕ */
const listCheckbox = document.querySelector('.editions__list-category');
const listChecked = document.querySelector('.editions__list-checked');
const inputCheckbox = document.querySelectorAll('.editions__checkbox-category');
const buttonAccordeon = document.querySelector('.editions__button-accordion');

/* 1. АККОРДЕОН 320 */
function accordeonAnimation() {
    if (window.myAnimationAccordeon) {
        clearTimeout(window.myAnimationAccordeon);
        window.myAnimationAccordeon = 0;
    }
    window.myAnimationAccordeon = setTimeout(function () {
        listCheckbox.classList.remove('editions__list-category--animation');
        window.myAnimationAccordeon = 0;
    }, 300);
}

buttonAccordeon.addEventListener('click', accordeonEditions);

function accordeonEditions() {
    this.classList.toggle('editions__button-accordion--active');
    listCheckbox.classList.add('editions__list-category--animation');
    accordeonAnimation();
    if (this.classList.contains('editions__button-accordion--active')) {
        listCheckbox.style.maxHeight = listCheckbox.scrollHeight + 'px';
    } else {
        listCheckbox.style.maxHeight = 0;
    }
}

/* 2. ПЕРЕСТАНОВКА CHECKBOX-ОВ 320 */
permutation();
window.addEventListener('resize', permutation);

function permutation() {
    const itemsChecked = Array.from(inputCheckbox).filter(index => index.checked == true);

    if (window.innerWidth < 768 && !listChecked.classList.contains('editions__list-checked--active')) {
        listChecked.classList.add('editions__list-checked--active');
        itemsChecked.forEach(separation);
        inputCheckbox.forEach(function (check) {
            check.addEventListener('change', rearrangingCheckboxes);
        });
    }

    if (window.innerWidth >= 768 && listChecked.classList.contains('editions__list-checked--active')) {
        listChecked.classList.remove('editions__list-checked--active');
        itemsChecked.forEach(unification);
        inputCheckbox.forEach(function (check) {
            check.removeEventListener('change', rearrangingCheckboxes);
        });
        listCheckbox.removeAttribute('style');
    }
}

function rearrangingCheckboxes() {
    if (this.checked) {
        separation(this);
    } else {
        unification(this);
    }
    if (buttonAccordeon.classList.contains('editions__button-accordion--active'))
        listCheckbox.style.maxHeight = listCheckbox.scrollHeight + 'px';
}

function separation(elementS) {
    listChecked.prepend(elementS.closest('.editions__item-category'));
}

function unification(elementU) {
    const itemsCheckbox = Array.from(inputCheckbox).filter(index => index.checked == false);
    const indexChecked = Number(elementU.closest('.editions__item-category').getAttribute('data-category'));
    const indexCheckbox = itemsCheckbox.findIndex(
        index => Number(index.closest('.editions__item-category').getAttribute('data-category')) > indexChecked
    );
    if (indexCheckbox != -1) {
        itemsCheckbox[indexCheckbox]
            .closest('.editions__item-category')
            .before(elementU.closest('.editions__item-category'));
    } else {
        listCheckbox.append(elementU.closest('.editions__item-category'));
    }
}

/* 3. ЗАГРУЗКА КОНТЕНТА ПО КАТЕГОРИЯМ */
(async function getResponse() {
    const library = await fetch('./json/editions.json');
    const content = await library.json();
    const swiperBox = document.querySelector('.editions__swiper');
    const swiperNull = document.querySelector('.editions__null-swiper');
    const editions = document.querySelector('.editions__list-swiper');
    const checkbox = document.querySelectorAll('.editions__checkbox-category');
    const cost = document.querySelectorAll('.editions__input-cost');
    let slideControl = false;
    let nowCheckboxArrayEditions = Array.from(checkbox);

    function checkArrayEditions(array, min, max) {
        const filteredCheck = array.filter(item => item.checked);
        const filteredCheck2 = filteredCheck.map(item => item.value);
        const filteredCostContent = content.filter(item => item.cost >= min && item.cost <= max);
        if (filteredCheck2.length === 0) {
            showCardsEditions(filteredCostContent);
        } else {
            const filteredContent = filteredCostContent.filter(item =>
                filteredCheck2.some(elem => item.category.split(', ').indexOf(elem) >= 0)
            );
            showCardsEditions(filteredContent);
        }
    }

    function showCardsEditions(requiredContent) {
        window.ariaContent = requiredContent;
        for (let number = 0; number < requiredContent.length; number++) {
            editions.insertAdjacentHTML(
                'beforeend',
                `
                <li class="editions__item-swiper swiper-slide">
                    <picture class="editions__picture-swiper">
                        <source srcset="${requiredContent[number].img320}" media="(max-width: 767px)">
                        <source srcset="${requiredContent[number].img768}" media="(max-width: 1023px)">
                        <source srcset="${requiredContent[number].img1024}" media="(max-width: 1919px)">
                        <img class="editions__img-swiper lazyload" src="${requiredContent[number].img1920}" alt="${requiredContent[number].alt}">
                    </picture>
                    <div class="editions__box-swiper flex">
                        <div class="editions__information-swiper">
                            <h3 class="editions__subject-swiper subject">
                                ${requiredContent[number].name}
                            </h3>
                            <span class="editions__author-swiper span-little">
                                ${requiredContent[number].authors}
                            </span>
                        </div>
                        <span class="editions__price-swiper">
                            ${requiredContent[number].cost} руб.
                        </span>
                    </div>
                    <button class="editions__button-swiper button-reset button-big">
                        Заказать
                    </button>
                </li>
            `
            );
        }

        const editionsItem = document.querySelector('.editions__item-swiper');
        if (!editionsItem) {
            swiperNull.classList.add('editions__null-swiper--active');
        } else {
            swiperNull.classList.remove('editions__null-swiper--active');
        }

        if (slideControl === true) {
            window.swiperEditions.update();
            window.swiperEditions.slideTo(0, 200);
        }
    }

    controlSwiper();
    window.addEventListener('resize', controlSwiper);

    function controlSwiper() {
        if (window.innerWidth < 769 && swiperBox.classList.contains('swiper-initialized') === true) {
            window.swiperEditions.destroy(true, true);
            buttonAccordeon.setAttribute('tabindex', '0');
            slideControl = false;
        }
        if (window.innerWidth >= 768 && swiperBox.classList.contains('swiper-initialized') === false) {
            buttonAccordeon.setAttribute('tabindex', '-1');
            slideControl = true;
            document
                .querySelector('.editions__button-accordion')
                .classList.remove('editions__button-accordion--active');
            window.swiperEditions = new Swiper('.editions__swiper', {
                spaceBetween: 0,
                slidesPerView: 1,
                maxBackfaceHiddenSlides: 0,
                a11y: false,
                navigation: {
                    nextEl: '.editions__buttondark--right',
                    prevEl: '.editions__buttondark--left',
                    disabledClass: 'buttondark--disabled',
                    lockClass: 'buttondark--lock',
                },
                pagination: {
                    el: '.editions__number',
                    type: 'fraction',
                    lockClass: 'editions__pagination--lock',
                },
                breakpoints: {
                    3840: {
                        slidesPerView: 3,
                        spaceBetween: 100,
                        slidesPerGroup: 3,
                    },
                    1920: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                        slidesPerGroup: 3,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 49,
                        slidesPerGroup: 2,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 34,
                        slidesPerGroup: 2,
                    },
                },
                watchSlidesProgress: true,
                watchSlidesVisibility: true,
                slideVisibleClass: 'editions__visible-swiper',

                on: {
                    update: function () {
                        let slidesLenght = this.slides.length;
                        this.slides.forEach(function (slide, index) {
                            if (!slide.classList.contains('editions__visible-swiper')) {
                                slide.querySelector('.editions__button-swiper').setAttribute('tabindex', '-1');
                                slide.setAttribute('aria-hidden', 'true');
                            } else {
                                slide.querySelector('.editions__button-swiper').setAttribute('tabindex', '');
                                slide.setAttribute('aria-hidden', 'false');
                            }
                            slide
                                .querySelector('.editions__button-swiper')
                                .setAttribute(
                                    'aria-label',
                                    `Заказать ${window.ariaContent[index].aria} (${index + 1} из ${slidesLenght})`
                                );
                        });
                        document
                            .querySelector('.editions__products')
                            .setAttribute('aria-roledescription', `карусель из ${slidesLenght} элементов`);
                    },
                    slideChange: function () {
                        this.slides.forEach(slide => {
                            if (!slide.classList.contains('editions__visible-swiper')) {
                                slide.querySelector('.editions__button-swiper').setAttribute('tabindex', '-1');
                                slide.setAttribute('aria-hidden', 'true');
                            } else {
                                slide.querySelector('.editions__button-swiper').setAttribute('tabindex', '');
                                slide.setAttribute('aria-hidden', 'false');
                            }
                        });
                    },
                },
            });
        }
    }

    let from = Number(document.querySelector('[data-name="from"').value.replaceAll(' ', ''));
    let to = Number(document.querySelector('[data-name="to"').value.replaceAll(' ', ''));

    checkArrayEditions(nowCheckboxArrayEditions, from, to);
    checkbox.forEach(elemCheckbox => {
        elemCheckbox.addEventListener('change', function () {
            clearing(editions);
            nowCheckboxArrayEditions = Array.from(checkbox);
            checkArrayEditions(nowCheckboxArrayEditions, from, to);
        });
    });
    cost.forEach(elemCost => {
        elemCost.addEventListener('change', function () {
            from = Number(document.querySelector('[data-name="from"').value.replaceAll(' ', ''));
            to = Number(document.querySelector('[data-name="to"').value.replaceAll(' ', ''));
            clearing(editions);
            nowCheckboxArrayEditions = Array.from(checkbox);
            checkArrayEditions(nowCheckboxArrayEditions, from, to);
        });
        elemCost.addEventListener('keyup', function (event) {
            if (
                (event.keyCode >= 48 && event.keyCode <= 57) ||
                (event.keyCode >= 96 && event.keyCode <= 105) ||
                event.key === 'Backspace' ||
                event.key === 'Delete'
            ) {
                clearing(document.querySelector('[id="editions-to"]'));
                clearing(document.querySelector('[id="editions-from"]'));
                document
                    .querySelector('[id="editions-to"]')
                    .insertAdjacentHTML(
                        'afterbegin',
                        Number(document.querySelector('[data-name="to"').value.replaceAll(' ', ''))
                    );
                document
                    .querySelector('[id="editions-from"]')
                    .insertAdjacentHTML(
                        'afterbegin',
                        Number(document.querySelector('[data-name="from"').value.replaceAll(' ', ''))
                    );
            }
        });
    });
})();

/* TOOLTIP */
let tooltip = document.querySelectorAll('.projects__button-tooltip');
let tooltipBox = document.querySelectorAll('.projects__span-tooltip');

tooltip.forEach(function (tooltipButton) {
    tooltipButton.addEventListener('click', function () {
        const tooltipActiveBoxNow = document.querySelector('.projects__span-tooltip--active');
        const tooltipActiveArrowNow = document.querySelector('.projects__arrow-tooltip--active');
        const tooltipActiveCrossNow = document.querySelector('.projects__cross-tooltip--active');
        const tooltipActiveBox = tooltipButton.previousElementSibling;
        const tooltipActiveArrow = tooltipButton.querySelector('.projects__arrow-tooltip');
        const tooltipActiveCross = tooltipButton.querySelector('.projects__cross-tooltip');
        if (tooltipActiveBoxNow && tooltipActiveBox !== tooltipActiveBoxNow) {
            tooltipActiveBoxNow.classList.remove('projects__span-tooltip--active');
            tooltipActiveArrowNow.classList.remove('projects__arrow-tooltip--active');
            tooltipActiveCrossNow.classList.remove('projects__cross-tooltip--active');
            tooltipActiveCrossNow.closest('.projects__button-tooltip').setAttribute('aria-expanded', 'false');
            this.setAttribute('aria-expanded', 'true');
        }
        tooltipActiveBox.classList.toggle('projects__span-tooltip--active');
        tooltipActiveArrow.classList.toggle('projects__arrow-tooltip--active');
        tooltipActiveCross.classList.toggle('projects__cross-tooltip--active');
        if (tooltipActiveBox.classList.contains('projects__span-tooltip--active')) {
            this.setAttribute('aria-expanded', 'true');
        } else {
            this.setAttribute('aria-expanded', 'false');
        }
    });
});

function tooltipPosition() {
    for (let i = 0; i < tooltip.length; i++) {
        let sizeArrow = document.querySelector('.projects__arrow-tooltip').clientHeight;
        let coord = tooltip[i].getBoundingClientRect();
        let coordX = coord.left + tooltip[i].clientWidth * 0.5;
        let coordY = document.querySelector('.projects').clientHeight - tooltip[i].offsetTop + sizeArrow;
        tooltipBox[i].style.setProperty('--mouse-x', coordX + 'px');
        tooltipBox[i].style.setProperty('bottom', coordY + 'px');
    }
}

window.addEventListener('load', tooltipPosition);
window.addEventListener('resize', tooltipPosition);

/* SWIPER-PROJECTS */
const swiperProjects = new Swiper('.projects__swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 5,
    loop: false,
    a11y: false,
    navigation: {
        nextEl: '.projects__buttonlight--right',
        prevEl: '.projects__buttonlight--left',
        disabledClass: 'projects__buttonlight--disabled',
    },
    breakpoints: {
        1440: {
            slidesPerView: 3,
            spaceBetween: 50,
            slidesPerGroup: 3,
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 50,
            slidesPerGroup: 2,
        },
        500: {
            slidesPerView: 2,
            spaceBetween: 34,
            slidesPerGroup: 2,
        },
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    slideVisibleClass: 'projects__visible-swiper',

    on: {
        update: function () {
            this.slides.forEach(slide => {
                if (!slide.classList.contains('projects__visible-swiper')) {
                    slide.querySelector('.projects__link-swiper').setAttribute('tabindex', '-1');
                    slide.querySelector('.projects__link-swiper').setAttribute('aria-hidden', 'true');
                } else {
                    slide.querySelector('.projects__link-swiper').setAttribute('tabindex', '');
                    slide.querySelector('.projects__link-swiper').setAttribute('aria-hidden', 'false');
                }
            });
        },
        slideChange: function () {
            this.slides.forEach(slide => {
                if (!slide.classList.contains('projects__visible-swiper')) {
                    slide.querySelector('.projects__link-swiper').setAttribute('tabindex', '-1');
                    slide.querySelector('.projects__link-swiper').setAttribute('aria-hidden', 'true');
                } else {
                    slide.querySelector('.projects__link-swiper').setAttribute('tabindex', '');
                    slide.querySelector('.projects__link-swiper').setAttribute('aria-hidden', 'false');
                }
            });
        },
    },
});

/* CONTACTS */
const telephone = document.querySelector('input[type="tel"]');
const im = new Inputmask('+7(999)-999-99-99');
im.mask(telephone);

new window.JustValidate('.contacts__form', {
    colorWrong: '#d11616',
    rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 30,
        },
        tel: {
            required: true,
            function: () => {
                const phone = telephone.inputmask.unmaskedvalue();
                return Number(phone) && phone.length === 10;
            },
        },
    },
    messages: {
        name: {
            required: 'Вы не ввели имя',
            minLength: 'Минимальное количество символов: 2',
            maxLength: 'Максимальное количество символов: 30',
        },
        tel: {
            required: 'Вы не ввели телефон',
            function: 'Недопустимый формат',
        },
    },
    submitHandler: function (thisForm) {
        let newFormData = new FormData(thisForm);
        let formStartAnimation = null;
        function messageAnimation(formTimestamp) {
            if (!formStartAnimation) formStartAnimation = formTimestamp;
            const elapsed = formTimestamp - formStartAnimation;
            if (elapsed < 5000) {
                requestAnimationFrame(messageAnimation);
            } else {
                document.querySelector('.contacts__status').classList.remove('contacts__status--successfully');
                document.querySelector('.contacts__status').classList.remove('contacts__status--error');
                document.querySelector('.contacts__button').classList.remove('contacts__button--disabled');
                document.querySelector('.contacts__button').removeAttribute('tabindex');
            }
        }

        const ajaxSend = async formData => {
            const response = await fetch('mail.php', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                document.querySelector('.contacts__preloader').classList.remove('contacts__preloader--active');
                document.querySelector('.contacts__status').classList.add('contacts__status--successfully');
                requestAnimationFrame(messageAnimation);
            } else {
                document.querySelector('.contacts__preloader').classList.remove('contacts__preloader--active');
                document.querySelector('.contacts__status').classList.add('contacts__status--error');
                requestAnimationFrame(messageAnimation);
            }
        };
        document.querySelector('.contacts__button').classList.add('contacts__button--disabled');
        document.querySelector('.contacts__button').setAttribute('tabindex', '-1');
        document.querySelector('.contacts__preloader').classList.add('contacts__preloader--active');
        ajaxSend(newFormData);
        thisForm.reset();
    },
});

/* YANDEX.MAP */
ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map(
            'blanchardMap',
            {
                center: [55.7595, 37.6099],
                zoom: 14.223,
                controls: [],
            },
            {
                suppressMapOpenBlock: true,
            }
        ),
        ZoomLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="contacts__container-map flex">' +
                '<button class="contacts__button-map button-reset" id="zoom-in" aria-label="увеличить масштаб карты"><svg class="contacts__svg-map plus" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#plus"></use></svg></button>' +
                '<button class="contacts__button-map button-reset" id="zoom-out" aria-label="уменьшить масштаб карты"><svg class="contacts__svg-map minus" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#minus"></use></svg></button>' +
                '</div>',
            {
                build: function () {
                    ZoomLayout.superclass.build.call(this);
                    this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                    this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
                    document.getElementById('zoom-in').addEventListener('click', this.zoomInCallback);
                    document.getElementById('zoom-out').addEventListener('click', this.zoomOutCallback);
                },

                clear: function () {
                    document.getElementById('zoom-in').removeEventListener('click', this.zoomInCallback);
                    document.getElementById('zoom-out').removeEventListener('click', this.zoomOutCallback);
                    ZoomLayout.superclass.clear.call(this);
                },

                zoomIn: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
                },

                zoomOut: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
                },
            }
        ),
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {
            layout: ymaps.templateLayoutFactory.createClass(
                '<div class="contacts__container-map flex">' +
                    '<button class="contacts__button-map button-reset" id="geo" aria-label="определить ваше местоположение"><svg class="contacts__svg-map geolocation" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#geolocation"></use></svg></button>' +
                    '</div>'
            ),
            position: {
                top: '353rem',
                right: '11rem',
            },
        },
    });

    var myPlacemark = new ymaps.Placemark(
        [55.758468, 37.601088],
        {},
        {
            iconLayout: 'default#image',
            iconImageHref: '../img/contacts-map-point.svg',
            iconImageSize: [20, 20],
            iconImageOffset: [-6, -16],
        }
    );

    myMap.behaviors.disable('scrollZoom');
    myMap.behaviors.enable('multiTouch');
    myMap.events.add('click', function () {
        myMap.behaviors.enable('scrollZoom');
    });
    myMap.geoObjects.add(myPlacemark);
    myMap.controls.add(zoomControl, {
        position: {
            top: '260rem',
            right: '11rem',
        },
    });
    myMap.controls.add(geolocationControl);
    document.querySelector('.ymaps-2-1-79-copyright__logo').setAttribute('aria-label', 'Яндекс');
    document.querySelector('.ymaps-2-1-79-copyright__logo').setAttribute('href', '#');
}
