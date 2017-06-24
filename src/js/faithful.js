// jshint ignore: start
$(document).ready(function() {

    // ===========================
    // i18next BEGIN

    var translatedLanguages = [
    'pl',
    'en',
    // 'ru',
    ];
    var fallbacks = {
        'default': ['en'],
        'de': ['en'],
        'fr': ['en'],
        'es': ['en'],
        'zh': ['en'],
        'it': ['en'],
        'pt': ['en'],
        // 'uk': ['ru'],
    };
    var fallbacksKeys = Object.keys(fallbacks);
    for (var i = fallbacksKeys.length - 1; i >= 0; i--) {
        if (fallbacksKeys[i] === 'default') {
            fallbacksKeys.splice(i, 1);
        }
    }
    var translatedAndFallbacks = translatedLanguages.concat(fallbacksKeys);

    i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            preload: translatedLanguages,
            fallbackLng: fallbacks,
            whitelist: translatedAndFallbacks,
            load: 'languageOnly',
            cookie: 'i18n',
            useCookie: 'i18n',
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json',
                addPath: 'locales/_add/{{lng}}',
                jsonIndent: 4
            }
            // detection: {
            //     order: [/*'path', 'querystring', /*, 'session' 'cookie', */'header'],
            //     lookupQuerystring: 'lng',
            //     // lookupCookie: 'i18n',
            //     // lookupSession: 'lng',
            //     // lookupPath: 'lng',
            //     // lookupFromPathIndex: 0,
            //     //caches: ['cookie'],
            //     //cookieExpirationDate: new Date()
            //     //.getTime() + 1000 * 60 * 60 * 24 * 365
            // }
        }, function(err, t) {
            jqueryI18next.init(i18next, $);
            $('[data-i18n]').localize();
            launchEverything();
            $('.flag').attr('src', 'img/flags/flag_' + i18next.language.substring(0, 2) + '.svg').attr('alt', i18next.language);
        });

    $('.lang-select').click(function(event) {
        i18next.changeLanguage($(this).attr('language'));
        $('[data-i18n]').localize();
        $('.flag').attr('src', 'img/flags/flag_' + i18next.language + '.svg').attr('alt', i18next.language);
        // console.log('Changed language to: ' + i18next.language);
        if ($(window).width() >= 768) {
            createPagination();
            $('.paginationScrollify').localize();
        }
        event.preventDefault();
    });

    // i18next END
    // ===========================

    // ===========================
    // NAVIGATION BEGIN

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // closing menus on outside clicks and scroll
    // $('.navbar-nav > a.page-scroll').click(function() {
    //     $('.navbar-toggle:visible').click();
    // });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a.page-scroll').click(function() {
        $('.navbar-toggle:visible').click();
    });
    $(document).click(function(event) {
        if (!$(event.target).closest('.navbar-toggle').length) {
            if ($('.navbar-collapse').attr('aria-expanded') === 'true') {
                $('.navbar-toggle').click();
                // console.log('navbar toggled');
            }
        }
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });

    // Scrollify & pagination

    function createPagination() {
        $('.paginationScrollify').remove();
        var pagination = '<ul class="paginationScrollify">';
        var activeClass = '';
        $('section').each(function(i) {
            activeClass = '';
            if ('#' + $(this).attr('data-section-name') === window.location.hash) {
                activeClass = 'active';
            }
            if ($(this).attr('data-section-name') !== 'footer') {
                pagination += '<li><a class="' + activeClass + '" href="#' +
                $(this).attr('data-section-name') + '"><span class="hover-text">' +
                $(this).attr('data-section-translation').charAt(0).toUpperCase() +
                $(this).attr('data-section-translation').slice(1) +
                '</span></a></li>';
            }
        });
        pagination += '</ul>';
        $('section#home').append(pagination);

        // Changing anchor hrefs to Scrollify move()
        $('.paginationScrollify li a').on('click',function() {
            $.scrollify.move($(this).attr('href'));
            return false;
        });
        $('.paginationScrollify li a').hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        });
        $('a.page-scroll').on('click',function() {
            $.scrollify.move($(this).attr('href'));
            return false;
        });
    }

    function launchEverything() {

        // Scrollify
        if ($(window).width() >= 768) {
            if (window.location.hash === '') {
                window.location.hash = 'home';
            }
            $.scrollify({
                section : 'section',
                sectionName : 'section-name',
                interstitialSection : 'footer',
                scrollSpeed: 900,
                // offset : -50, // to be used with setHeights: true
                scrollbars: false, // on true X axis appears as well
                standardScrollElements: '.standardScroll',
                setHeights: false, // doesnt work as expected
                overflowScroll: true,
                updateHash: true,
                touchScroll: true,
                easing: 'easeOutCubic',
                before:function(i,panels) {
                    var ref = panels[i].attr('data-section-name');
                    $('.paginationScrollify .active').removeClass('active');
                    $('.paginationScrollify').find('a[href="#' + ref + '"]').addClass('active');
                },
                after:function(i,panels) {
                    // make hover text disappear on tablets
                    $('.paginationScrollify span.hover-text').each(function(i) {
                        $(this).trigger('mouseout');
                    });
                },
                afterRender: function() {
                    createPagination();
                }
            });
        } else {
            $(document).on('click', 'a.page-scroll', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: ($($anchor.attr('href')).offset().top - 50)
                }, 1250, 'easeInOutExpo');
                event.preventDefault();
            });
        }
    }

    // NAVIGATION END
    // ===========================

    // ===========================
    // GALLERY BEGIN

    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: i18next.t('js.loading'),
        tClose: i18next.t('js.close'),
        //mainClass: 'mfp-img-mobile',
        fixedContentPos: false,
        //fixedBgPos: false,
        gallery: {
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button
            tPrev: i18next.t('js.previous'),
            tNext: i18next.t('js.next'),
            tCounter: '%curr% ' + i18next.t('js.of') + ' %total%',
            enabled: true,
            navigateByImgClick: true,
            preload: [1, 2] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">#%curr%</a> ' + i18next.t('js.error')
        }
    });

    // GALLERY END
    // ===========================

    // Initialize and Configure Scroll Reveal Animation
    window.sr = ScrollReveal();
    sr.reveal('.sr-icons', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 200);
    sr.reveal('.sr-button', {
        duration: 1000,
        delay: 200
    });
    sr.reveal('.sr-contact', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 300);

    // wow.js
    var wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );
    wow.init();

    // $('.carousel').carousel({
    //     interval: 1000
    // })

    // animate.css
    // $.fn.extend({
    //     animateCss: function (animationName) {
    //         var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    //         this.addClass('animated ' + animationName).one(animationEnd, function() {
    //             $(this).removeClass('animated ' + animationName);
    //         });
    //     }
    // });

});