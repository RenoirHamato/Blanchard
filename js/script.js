/* LAZYLOAD */
lazyload();

/* STOP-SCROLL MODAL*/
function scrollLock() {
    console.log('yes');
    boxModal.classList.remove('gallery__modal--active');
    overlay.classList.remove('gallery__overlay--active');
    let delay = Date.now() - window.startAnimation;
    if (window.myTimeout) {
        clearTimeout(window.myTimeout);
    }
    if (delay > 300) {
        delay = 300;
    }
    window.myTimeout = setTimeout(function () {
        stopScroll.classList.remove('stop-scroll');
        stopScroll.removeAttribute('style');
    }, delay);
}
const stopScroll = document.querySelector('body');

/* MENU 1*/
const burgerButton = document.querySelector('.header__burger');
const burgerLine = document.querySelectorAll('.header__line');
const burgerBox = document.querySelector('.header__box');
const burgerScroll = document.querySelector('.header__scroll');

burgerButton.addEventListener('click', function () {
    burgerButton.classList.toggle('header__burger--open');
    burgerBox.classList.toggle('header__box--active');
    stopScroll.classList.toggle('stop-scroll');

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
        scrollbar: 'simplebar-scrollbar-menu',
        track: 'simplebar-track-menu',
    },
});

/* MENU 2 */
const headerSelectButton = document.querySelectorAll('.header__button-select');
const headerSelectBox = document.querySelectorAll('.header__box-select');

headerSelectButton.forEach(function (button) {
    button.addEventListener('click', function () {
        const activeBox = document.querySelector('.header__box-select--active');
        const activeButton = document.querySelector('.header__button-select--open');
        if (activeBox && this.nextElementSibling !== activeBox) {
            activeBox.classList.remove('header__box-select--active');
            activeButton.classList.remove('header__button-select--open');
        }
        this.nextElementSibling.classList.toggle('header__box-select--active');
        button.classList.toggle('header__button-select--open');
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
    }
});

/* SIMPLEBAR */
Array.prototype.forEach.call(
    document.querySelectorAll('.header__scroll-select'),
    elem =>
        new SimpleBar(elem, {
            autoHide: false,
            scrollbarMaxSize: 28,
            classNames: {
                scrollbar: 'simplebar-scrollbar-select',
                track: 'simplebar-track-select',
            },
        })
);

/* SEARCH */
let searchOpen = document.querySelector('.header__search-open');
let searchBox = document.querySelector('.header__search-box');
let searchClose = document.querySelector('.header__search-close');
let searchInput = document.querySelector('.header__input-search');

searchOpen.addEventListener('click', function () {
    searchBox.classList.add('header__search-box--active');
    searchOpen.classList.add('header__search-open--active');
    searchOpen.setAttribute('tabindex', '-1');
    searchInput.focus();
});

searchClose.addEventListener('click', function () {
    searchOpen.classList.remove('header__search-open--active');
    searchOpen.removeAttribute('tabindex', '-1');
    searchBox.classList.remove('header__search-box--active');
    searchOpen.focus();
});

document.addEventListener('click', function (event) {
    if (event.target.closest('.header__search-box--active') || event.target.closest('.header__search-open--active'))
        return;
    const activeSearchOpen = document.querySelector('.header__search-open--active');
    const activeSearchBox = document.querySelector('.header__search-box--active');
    if (activeSearchBox) {
        activeSearchOpen.classList.remove('header__search-open--active');
        activeSearchBox.classList.remove('header__search-box--active');
    }
});

/* AUTO SWIPER */
const previewSlider = document.querySelector('.header__wrapper');
const arrowImages = Array.from(previewSlider.children);
let numberImage = 0;
let oldImage = 0;

setInterval(() => {
    oldImage = numberImage;
    numberImage = (numberImage + 1) % arrowImages.length;
    arrowImages[numberImage].classList.add('header__picture--active');
    if (oldImage == arrowImages.length - 1) {
        arrowImages[numberImage].classList.add('header__picture--return');
        setTimeout(() => {
            arrowImages[numberImage].classList.remove('header__picture--return');
        }, 2000);
    }
    setTimeout(() => {
        arrowImages[oldImage].classList.remove('header__picture--active');
    }, 1000);
}, 8000);

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

function tabModal(event) {
    if (event.code == 'Tab' && overlay.classList.contains('gallery__overlay--active')) {
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
const modalClose = document.querySelector('.gallery__modal-button');

/* event 1 */
modalClose.addEventListener('click', function () {
    scrollLock();
    window.lastFocus.focus();
    window.removeEventListener('keydown', tabModal);
});

/* event 2 */
overlay.addEventListener('click', function (event) {
    if (!boxModal.contains(event.target)) {
        scrollLock();
        window.lastFocus.focus();
        window.removeEventListener('keydown', tabModal);
    }
});

/* event 3 */
document.body.addEventListener('keyup', function (event) {
    var key = event.code;
    if (key == 'Escape' && boxModal.classList.contains('gallery__modal--active')) {
        scrollLock();
        window.lastFocus.focus();
        window.removeEventListener('keydown', tabModal);
    }
});

(async function getResponse() {
    const library = await fetch('./json/pictures.json');
    const content = await library.json();
    const select = document.querySelector('.gallery__filter-select');
    const listGallery = document.querySelector('.gallery__list-swiper');

    function showCards(value) {
        const filteredCards = content.filter(item => item.category === value);
        const itemsGalleryHTML = filteredCards
            .map(item => {
                let htmlGallery = '';
                htmlGallery += `
                <li class="gallery__item swiper-slide">
                    <button class="gallery__card button-reset flex" id="${item.id}">
                        <picture class="gallery__picture">
                            <source srcset="${item.img320}" media="(max-width: 767px)">
                            <source srcset="${item.img768}" media="(max-width: 1023px)">
                            <source srcset="${item.img1024}" media="(max-width: 1919px)">
                            <img class="gallery__image lazyload" src="${item.img1920}" alt="">
                        </picture>
                    </button>
                </li>`;
                return htmlGallery;
            })
            .join('');

        listGallery.insertAdjacentHTML('beforeend', itemsGalleryHTML);

        const buttonGallery = document.querySelectorAll('.gallery__card');
        buttonGallery.forEach(function (elem) {
            elem.addEventListener('click', showModals);
        });
    }

    function showModals() {
        const contentModal = document.querySelector('.gallery__modal-content');
        window.lastFocus = document.activeElement;
        clearing(contentModal);
        const filteredModals = content.filter(item => item.category === newSelect);
        const index = this.id;
        const htmlModal = `
            <picture class="gallery__modal-picture">
                <source srcset="${filteredModals[index].modal320}" media="(max-width: 767px)" />
                <source srcset="${filteredModals[index].modal768}" media="(max-width: 1023px)" />
                <source srcset="${filteredModals[index].modal1024}" media="(max-width: 1919px)" />
                <img class="gallery__modal-img lazyload" src="${filteredModals[index].modal1920}" alt="" />
            </picture>
            <div class="gallery__modal-information">
                <div class="gallery__modal-scrollbar">
                    <h3 class="gallery__modal-subject subject">
                        ${filteredModals[index].author}
                        <span class="gallery__modal-name">"${filteredModals[index].name}"</span>
                    </h3>
                    <span class="gallery__modal-date span-gray">${filteredModals[index].date}</span>
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

        const simplebarModal = new SimpleBar(document.querySelector('.gallery__modal-scrollbar'), {
            scrollbarMaxSize: 28,
            classNames: {
                scrollbar: 'gallery__simplebar-scrollbar',
                track: 'gallery__simplebar-track',
            },
        });

        const modal = document.querySelector('.gallery__modal');
        modalClose.focus();

        const focusElements = modal.querySelectorAll([
            'a[href]',
            'button',
            'input',
            'select',
            'textarea',
            '[tabindex]',
        ]);
        console.log(focusElements);
        window.focusArray = Array.prototype.slice.call(focusElements);

        window.addEventListener('keydown', tabModal);
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
                this.slides.forEach(slide => {
                    if (!slide.classList.contains('gallery__slide-visible')) {
                        slide.querySelector('.gallery__card').tabIndex = '-1';
                    } else {
                        slide.querySelector('.gallery__card').tabIndex = '';
                    }
                });
            },
            slideChange: function () {
                this.slides.forEach(slide => {
                    if (!slide.classList.contains('gallery__slide-visible')) {
                        slide.querySelector('.gallery__card').tabIndex = '-1';
                    } else {
                        slide.querySelector('.gallery__card').tabIndex = '';
                    }
                });
            },
        },
    });

    let newSelect = select.value;
    showCards(newSelect);

    select.addEventListener('change', function (event) {
        clearing(listGallery);
        newSelect = event.target.value;
        showCards(newSelect);
        swiperGallery.slideTo(0, 300);
    });
})();

/* TAB */
(async function getResponse() {
    const catalogLibrary = await fetch('./json/catalog.json');
    const catalogContent = await catalogLibrary.json();
    const catalogButton = document.querySelectorAll('.catalog__button-content');
    const catalogContentBox = document.querySelector('.catalog__box-left');

    /* TAB FUNCTION */
    function newTab(tabID) {
        const oldTabBox = document.querySelector('.catalog__tab-post--active');
        const newTabBox = document.querySelector(`[data-target="${tabID}"]`);

        if (oldTabBox) {
            oldTabBox.classList.remove('catalog__tab-post--active');
        }

        if (!newTabBox && tabID != window.location.hash.split('-')[0]) {
            catalogShow('');
        } else {
            newTabBox.classList.add('catalog__tab-post--active');
        }
    }

    /* TAB SHOW */
    function catalogShow(hash) {
        const activeCountry = document.querySelector('.catalog__country-step--disabled');
        activeCountry.classList.remove('catalog__country-step--disabled');
        activeCountry.removeAttribute('tabindex');
        let country = hash.split('-')[0];
        let nowCountry = document.querySelector(`[data-step="${country}"`);
        const defaultCountry = catalogContent.find(item => item.const);
        if (!nowCountry && defaultCountry) {
            country = defaultCountry.const;
            hash = defaultCountry.const;
            nowCountry = document.querySelector(`[data-step="${country}"`);
        }
        if (!nowCountry) {
            country = '#italy';
            hash = '#italy';
            nowCountry = document.querySelector(`[data-step="${country}"`);
        }

        nowCountry.classList.add('catalog__country-step--disabled');
        nowCountry.setAttribute('tabindex', '-1');
        const filteredCountry = catalogContent.filter(item => item.country === country);
        const contentNullHTML = `
        <div class="catalog__null flex">
            <picture class="catalog__figure-picture">
                <source srcset="./img/catalog-320-figure.webp" media="(max-width: 767px)" />
                <source srcset="./img/catalog-768-figure.webp" media="(max-width: 1023px)" />
                <source srcset="./img/catalog-1024-figure.webp" media="(max-width: 1919px)" />
                <img class="catalog__figure-img lazyload" src="./img/catalog-1920-figure.webp" alt="" />
            </picture>
            <div class="catalog__null-empty">
                <p class="catalog__null-text">Здесь пока пусто</p>
                <span class="catalog__null-span">
                    А&nbsp;в&nbsp;галерее вы&nbsp;всегда можете найти что-то
                    интересное для себя
                </span>
                <a class="catalog__null-link" href="#gallery">В галерею</a>
            </div>
        </div>
        `;
        clearing(catalogContentBox);
        catalogButton.forEach(function (elem) {
            clearing(elem);
            const dataTime = elem.getAttribute('data-time');
            const filteredItemButton = filteredCountry.filter(item => item.timeline === dataTime);
            window.controlID = filteredCountry.map(item => item.id);
            let itemsCatalogTimelineHTML = filteredItemButton
                .map(item => {
                    let htmlGallery = '';
                    htmlGallery += `
                <li class="catalog__button-item">
                <a
                    class="catalog__button-link text"
                    href="${country}-${item.id}"
                    data-step="${country}-${item.id}"
                >
                    ${item.name}
                </a>
            </li>`;

                    return htmlGallery;
                })
                .join('');

            const itemsCatalogContentHTML = filteredItemButton
                .map(item => {
                    let htmlGallery = '';
                    if (Object.keys(item.content).length !== 0) {
                        htmlGallery += `
                        <div
                        class="catalog__tab-post"
                        data-target="${country}-${item.id}"
                    >
                        <picture class="catalog__picture">
                            <source srcset="${item.content.img320}" media="(max-width: 767px)" />
                            <source srcset="${item.content.img768}" media="(max-width: 1023px)" />
                            <source srcset="${item.content.img1024}" media="(max-width: 1919px)" />
                            <img class="catalog__img lazyload" src="${item.content.img1920}" alt="" />
                        </picture>

                        <h4 class="catalog__subject subject">${item.name}</h4>
                        <span class="catalog__date span-gray">
                            ${item.content.date}
                        </span>
                        <p class="catalog__description text">
                            ${item.content.text}
                        </p>
                    </div>`;
                    } else {
                        htmlGallery += `
                        <div class="catalog__tab-post" data-target="${country}-${item.id}">
                        <picture class="catalog__picture">
                            <source srcset="./img/catalog-320-null.webp" media="(max-width: 767px)" />
                            <source srcset="./img/catalog-768-null.webp" media="(max-width: 1023px)" />
                            <source srcset="./img/catalog-1024-null.webp" media="(max-width: 1919px)" />
                            <img class="catalog__img lazyload" src="./img/catalog-1920-null.webp" alt="" />
                        </picture>
                        <h4 class="catalog__subject subject">Что мы о нём знаем?</h4>
                        <p class="catalog__description text">
                            Пока ничего... Зато мы&nbsp;точно знаем, что в&nbsp;галерее есть
                            на&nbsp;что посмотреть!
                        </p>
                        <a class="catalog__null-link" href="#gallery">В галерею</a>
                    </div>`;
                    }
                    return htmlGallery;
                })
                .join('');

            if (filteredItemButton != '') {
                elem.insertAdjacentHTML(
                    'beforeend',
                    `
                    <ul class="catalog__button-list list-reset">
                    </ul>`
                );
                elem.querySelector('.catalog__button-list').insertAdjacentHTML(
                    'beforeend',
                    itemsCatalogTimelineHTML +
                        `
                    <li class="catalog__button-plug">&nbsp;</li>`
                );
                catalogContentBox.insertAdjacentHTML('beforeend', itemsCatalogContentHTML);
            } else {
                elem.insertAdjacentHTML('beforeend', contentNullHTML);
            }
        });

        /* TAB DOWNLOAD */
        if (hash != country) {
            newTab(hash);
        }

        if (hash == country) {
            if (!catalogContentBox.firstChild) {
                catalogContentBox.insertAdjacentHTML(
                    'beforeend',
                    `
                    <div class="catalog__tab-post catalog__tab-post--active">
                        <picture class="catalog__picture">
                            <source srcset="./img/catalog-320-null.webp" media="(max-width: 767px)" />
                            <source srcset="./img/catalog-768-null.webp" media="(max-width: 1023px)" />
                            <source srcset="./img/catalog-1024-null.webp" media="(max-width: 1919px)" />
                            <img class="catalog__img lazyload" src="./img/catalog-1920-null.webp" alt="" />
                        </picture>
                        <h4 class="catalog__subject subject">Что мы о нём знаем?</h4>
                        <p class="catalog__description text">
                            Пока ничего... Зато мы&nbsp;точно знаем, что в&nbsp;галерее есть
                            на&nbsp;что посмотреть!
                        </p>
                        <a class="catalog__null-link" href="#gallery">В галерею</a>
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
        }

        /* TAB ARTISTS */
        const stepArtists = document.querySelectorAll('.catalog__button-link');
        stepArtists.forEach(function (linkStep) {
            linkStep.addEventListener('click', function () {
                /*
                console.log('trueClick');
*/
                newTab(this.getAttribute('data-step'));
                if (window.innerWidth < 1024) {
                    document.querySelector('.catalog__box-left').scrollIntoView({
                        behavior: 'smooth',
                    });
                } else {
                    document.querySelector('.big-section').scrollIntoView({
                        behavior: 'smooth',
                    });
                }
                window.control = true;
            });
        });

        let nullLink = document.querySelectorAll('.catalog__null-link');
        nullLink.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                const anchorTab = this.getAttribute('href').replace('#', '');
                document.getElementById(anchorTab).scrollIntoView({
                    behavior: 'smooth',
                });
                event.preventDefault();
            });
        });
    }

    /* TAB COUNTRY */
    /* event 1 */
    window.control = false;
    let idTab = window.location.hash;
    catalogShow(idTab);

    /* event 2 */
    const stepCountry = document.querySelectorAll('.catalog__country-step');
    stepCountry.forEach(function (linkStep) {
        linkStep.addEventListener('click', function () {
            /*
            console.log('trueClick');
            */
            catalogShow(this.getAttribute('data-step'));
            document.getElementById('catalog').scrollIntoView({
                behavior: 'smooth',
            });
            window.control = true;
        });
    });

    /* event 3 */
    window.addEventListener('hashchange', function () {
        if (window.control == false) {
            /*
            console.log('trueHash');
            console.log(window.location.hash.split('-').pop());
            console.log(window.controlID);
            */
            if (window.controlID.includes(window.location.hash.split('-').pop())) {
                newTab(window.location.hash);
                /*
                console.log('yes');
                */
            } else {
                /*
                console.log('show');
                */
                catalogShow(window.location.hash);
            }
        }
        document.getElementById('catalog').scrollIntoView({
            behavior: 'smooth',
        });
        window.control = false;
    });
})();

const accordionCatalog = new Accordion('.catalog__time-list', {
    elementClass: 'catalog__time-item',
    triggerClass: 'catalog__button',
    panelClass: 'catalog__button-content',
    activeClass: 'catalog__time-item--active',
});

window.addEventListener('load', function () {
    accordionCatalog.open(0);
});

/* BUTTON-ALL */
const buttonMore = document.querySelector('.events__button');
var cardItem = document.querySelectorAll('.events__item');

buttonMore.addEventListener('click', function () {
    buttonMore.classList.add('events__button--hidden');
    cardItem.forEach(function (card) {
        card.classList.remove('events__item--hidden');
        card.classList.remove('events__item--hidden-768');
    });
});

/* EVENTS */
const containerEvents = document.querySelector('.big-section__container');
const swiperBoxEvents = document.querySelector('.events__swiper');
const swiperListEvents = document.querySelector('.events__list');
const swiperItemEvents = document.querySelectorAll('.events__item');

window.addEventListener('load', adaptiveSwiperEvents);
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
/* ПЕРЕМЕННЫЕ */
const listCheckbox = document.querySelector('.editions__list-checkbox'); /* лист невыбранных checkbox */
const listChecked = document.querySelector('.editions__list-checked'); /* лист выбранных checkbox */
const inputCheckbox = document.querySelectorAll('.editions__checkbox'); /* все объекты checkbox */
const buttonAccordeon =
    document.querySelector('.editions__button-filter'); /* кнопка раскрытия списка checkbox при адаптиве 320 */

/* 1. АККОРДЕОН 320 */
function accordeonAnimation() {
    if (window.myAnimationAccordeon) {
        clearTimeout(window.myAnimationAccordeon);
        window.myAnimationAccordeon = 0;
    }
    window.myAnimationAccordeon = setTimeout(function () {
        listCheckbox.classList.remove('editions__list-checkbox--animation');
        window.myAnimationAccordeon = 0;
    }, 300);
}

buttonAccordeon.addEventListener('click', accordeonEditions);

function accordeonEditions() {
    this.classList.toggle('editions__button-filter--active');
    listCheckbox.classList.add('editions__list-checkbox--animation');
    accordeonAnimation();
    if (this.classList.contains('editions__button-filter--active')) {
        listCheckbox.style.maxHeight = listCheckbox.scrollHeight + 'px';
    } else {
        listCheckbox.style.maxHeight = 0;
    }
}

/* 2. ПЕРЕСТАНОВКА CHECKBOX-ОВ 320 */
window.addEventListener('load', permutation);
window.addEventListener('resize', permutation);

function permutation() {
    const itemsChecked = Array.from(inputCheckbox).filter(
        index => index.checked == true
    ); /* Создается новый массив выбранных checkbox при текущей ширине экрана устройства */

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
    if (buttonAccordeon.classList.contains('editions__button-filter--active'))
        listCheckbox.style.maxHeight = listCheckbox.scrollHeight + 'px';
}

function separation(elementS) {
    listChecked.prepend(elementS.closest('.editions__item-checkbox'));
}

function unification(elementU) {
    const itemsCheckbox = Array.from(inputCheckbox).filter(
        index => index.checked == false
    ); /* Создается новый массив НЕвыбранных checkbox при текущей ширине экрана устройства */
    const indexChecked = Number(elementU.closest('.editions__item-checkbox').id);
    const indexCheckbox = itemsCheckbox.findIndex(index => index.closest('.editions__item-checkbox').id > indexChecked);
    if (indexCheckbox != -1) {
        itemsCheckbox[indexCheckbox]
            .closest('.editions__item-checkbox')
            .before(elementU.closest('.editions__item-checkbox'));
    } else {
        listCheckbox.append(elementU.closest('.editions__item-checkbox'));
    }
}

/* 3. ЗАГРУЗКА КОНТЕНТА ПО КАТЕГОРИЯМ */
(async function getResponse() {
    const library = await fetch('./json/editions.json');
    const content = await library.json();
    const swiperBox = document.querySelector('.editions__swiper');
    const swiperNull = document.querySelector('.editions__null');
    const editions = document.querySelector('.editions__list');
    const checkbox = document.querySelectorAll('.editions__checkbox');
    const cost = document.querySelectorAll('.editions__input');
    let slideControl = false;
    let nowCheckboxArrayEditions = Array.from(checkbox);

    function checkArrayEditions(array, min, max) {
        const filteredCheck = array.filter(item => item.checked);
        const filteredCheck2 = filteredCheck.map(item => item.value);
        const filteredCostContent = content.filter(item => item.cost >= min && item.cost <= max);
        /*        console.log(filteredCostContent); */
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
        for (let number = 0; number < requiredContent.length; number++) {
            editions.insertAdjacentHTML(
                'beforeend',
                `
                <li class="editions__item swiper-slide">
                    <div class="editions__product">
                    <picture class="editions__picture">
                        <source srcset="${requiredContent[number].img320}" media="(max-width: 767px)">
                        <source srcset="${requiredContent[number].img768}" media="(max-width: 1023px)">
                        <source srcset="${requiredContent[number].img1024}" media="(max-width: 1919px)">
                        <img class="editions__img lazyload" src="${requiredContent[number].img1920}" alt="">
                    </picture>
                    <div class="editions__information flex">
                    <div class="editions__top">
                        <h3 class="editions__subject subject">
                            ${requiredContent[number].name}
                        </h3>
                        <span class="editions__author span-little">
                            ${requiredContent[number].authors}
                        </span>
                    </div>
                    <span class="editions__price">
                        ${requiredContent[number].cost} руб.
                    </span>
                    </div>
                        <button class="editions__button button-reset button-big">
                            Заказать
                        </button>
                    </div>
                </li>
            `
            );
        }

        const editionsItem = document.querySelector('.editions__item');
        if (!editionsItem) {
            swiperNull.classList.add('editions__null--active');
        } else {
            swiperNull.classList.remove('editions__null--active');
        }

        if (slideControl === true) {
            window.swiperEditions.update();
            window.swiperEditions.slideTo(0, 200);
        }
    }

    window.addEventListener('load', controlSwiper);
    window.addEventListener('resize', controlSwiper);

    function controlSwiper() {
        if (window.innerWidth < 769 && swiperBox.classList.contains('swiper-initialized') === true) {
            /*            console.log(window.innerWidth); */
            window.swiperEditions.destroy(true, true);
            buttonAccordeon.setAttribute('tabindex', '0');
            slideControl = false;
        }
        if (window.innerWidth >= 768 && swiperBox.classList.contains('swiper-initialized') === false) {
            buttonAccordeon.setAttribute('tabindex', '-1');
            slideControl = true;
            document.querySelector('.editions__button-filter').classList.remove('editions__button-filter--active');
            window.swiperEditions = new Swiper('.editions__swiper', {
                spaceBetween: 0,
                slidesPerView: 1,
                maxBackfaceHiddenSlides: 0,
                a11y: {
                    enabled: false,
                },
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
            });
        }
    }

    let from = document.querySelector('[data-name="from"').value;
    let to = document.querySelector('[data-name="to"').value;

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
            from = document.querySelector('[data-name="from"').value;
            to = document.querySelector('[data-name="to"').value;
            clearing(editions);
            nowCheckboxArrayEditions = Array.from(checkbox);
            /*            console.log(document.querySelector('[data-name="from"').value);*/
            checkArrayEditions(nowCheckboxArrayEditions, from, to);
        });
    });
})();

/* TOOLTIP */
let tooltip = document.querySelectorAll('.projects__tooltip');
let tooltipBox = document.querySelectorAll('.projects__tooltip-span');

tooltip.forEach(function (tooltipButton) {
    tooltipButton.addEventListener('click', function () {
        const tooltipActiveBoxNow = document.querySelector('.projects__tooltip-span--active');
        const tooltipActiveArrowNow = document.querySelector('.projects__tooltip-arrow--active');
        const tooltipActiveCrossNow = document.querySelector('.projects__tooltip-cross--active');
        const tooltipActiveBox = tooltipButton.nextElementSibling;
        const tooltipActiveArrow = tooltipButton.querySelector('.projects__tooltip-arrow');
        const tooltipActiveCross = tooltipButton.querySelector('.projects__tooltip-cross');
        if (tooltipActiveBoxNow && tooltipActiveBox !== tooltipActiveBoxNow) {
            this.classList.remove('projects__tooltip--active');
            tooltipActiveBoxNow.classList.remove('projects__tooltip-span--active');
            tooltipActiveArrowNow.classList.remove('projects__tooltip-arrow--active');
            tooltipActiveCrossNow.classList.remove('projects__tooltip-cross--active');
        }
        this.classList.toggle('projects__tooltip--active');
        tooltipActiveBox.classList.toggle('projects__tooltip-span--active');
        tooltipActiveArrow.classList.toggle('projects__tooltip-arrow--active');
        tooltipActiveCross.classList.toggle('projects__tooltip-cross--active');
    });
});

/*
console.log(tooltipCoord);
console.log(tooltip[1].clientWidth * 0.5);
const correct = 12;
console.log((tooltipBox[1].style.transform = `translateX(${correct}px)`));
*/

window.addEventListener('load', function () {
    for (let i = 0; i < tooltip.length; i++) {
        let coord = tooltip[i].getBoundingClientRect();
        let coordX = coord.left + tooltip[i].clientWidth * 0.5;
        let coordY = document.querySelector('.projects').clientHeight - tooltip[i].offsetTop + 12;
        tooltipBox[i].style.setProperty('--mouse-x', coordX + 'px');
        tooltipBox[i].style.setProperty('bottom', coordY + 'px');
    }
});

window.addEventListener('resize', function () {
    for (let i = 0; i < tooltip.length; i++) {
        let coord = tooltip[i].getBoundingClientRect();
        let coordX = coord.left + tooltip[i].clientWidth * 0.5;
        let coordY = document.querySelector('.projects').clientHeight - tooltip[i].offsetTop + 12;
        /*
        console.log(coord);
        console.log(coordX);
        console.log(coordY);
        */
        tooltipBox[i].style.setProperty('--mouse-x', coordX + 'px');
        tooltipBox[i].style.setProperty('bottom', coordY + 'px');
    }
});
/*


*/

/* SWIPER-PROJECTS */
const swiperProjects = new Swiper('.projects__swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    loop: false,
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
});

document.addEventListener('DOMContentLoaded', function () {
    const telephone = document.querySelector('input[type="tel"]');
    const im = new Inputmask('+7(999)-999-99-99');
    im.mask(telephone);

    new JustValidate('.contacts__form', {
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
    });
});

/* YANDEX.MAP */
/*
ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map(
        'blanchardMap',
        {
            center: [55.7607, 37.6147],
            zoom: 14.223,
            controls: [],
        },
        {
            suppressMapOpenBlock: true,
        }
    );

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

    myMap.geoObjects.add(myPlacemark);
}
*/
