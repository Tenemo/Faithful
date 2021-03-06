// jshint ignore: start

disableScroll()
// disabling everything when page is loading
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

window.onload = function() {
    $('#loading').hide();
    enableScroll();
};

$(document).ready(function() {

    // touch detection
    document.addEventListener('touchstart', function addtouchclass(e) { // first time user touches the screen
        document.documentElement.classList.add('can-touch') // add "can-touch" class to document root using classList API
        document.removeEventListener('touchstart', addtouchclass, false) // de-register touchstart event
    }, false)

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
        if ($(window).width() >= 768) {
            createPagination();
            $('.paginationScrollify').localize();
        }
        magnificLaunch()
        event.preventDefault();
    });

    // i18next END
    // ===========================

    // ===========================
    // NAVIGATION BEGIN

    if (window.location.hash == '') {
        window.location.hash = 'home';
    }

    // // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.scrollspyNav',
        offset: 51
    });
    $(window).on('activate.bs.scrollspy', function(e) {
        var $hash, $node;
        $hash = $('a[href^=\'#\']', e.target).attr('href').replace(/^#/, '');
        $node = $('#' + $hash);
        if ($node.length) {
            $node.attr('id', '');
        }
        document.location.hash = $hash;
        if ($node.length) {
            return $node.attr('id', $hash);
        }
    });
    function launchEverything() {
        if ($(window).width() >= 768) {
            createPagination()
        }
        $(document).on('click', 'a.page-scroll', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($anchor.attr('href')).offset().top - 50)
            }, 1250, 'easeInOutExpo');
            $('.paginationScrollify span.hover-text').each(function(i) {
                $(this).trigger('mouseout');
            });
            event.preventDefault();
        });
        magnificLaunch()
    }

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a.page-scroll').click(function() {
        $('.navbar-toggle:visible').click();
    });
    $(document).click(function(event) {
        if (!$(event.target).closest('.navbar-toggle').length) {
            if ($('.navbar-collapse').attr('aria-expanded') === 'true') {
                $('.navbar-toggle').click();
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

    // TODO make it work without scrollify
    function createPagination() {
        $('.paginationScrollify').remove();
        var pagination = '<nav class="scrollspyNav"><ul class="paginationScrollify nav">';
        var activeClass = '';
        $('section').each(function(i) {
            activeClass = '';
            if ('#' + $(this).attr('data-section-name') === window.location.hash) {
                activeClass = 'active';
            }
            if ($(this).attr('data-section-name') !== 'footer') {
                pagination += '<li class ="' + activeClass + '"><a class="page-scroll" href="#' +
                $(this).attr('data-section-name') + '"><span class="hover-text">' +
                $(this).attr('data-section-translation').charAt(0).toUpperCase() +
                $(this).attr('data-section-translation').slice(1) +
                '</span></a></li>';
            }
        });
        pagination += '</ul></nav>';
        $('section#home').append(pagination);
        $('.paginationScrollify li a').hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        });
        $('.hover-text').click(function () {
            return false;
        });
    }

    // NAVIGATION END
    // ===========================

    // ===========================
    // GALLERY BEGIN

    function magnificLaunch() {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: i18next.t('js.loading'),
            tClose: i18next.t('js.close'),
            fixedContentPos: false,
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
    }

    // GALLERY END
    // ===========================

    // Initialize and Configure Scroll Reveal Animation
    window.sr = ScrollReveal();

    // wow.js
    var wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );
    wow.init();

    $('.carousel').carousel({
        interval: 1000 * 8
    });


    // Facebook feed
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v2.9';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // CONTACT FORM

    $('#contact-form').validator();

    // when the form is submitted
    $('#contact-form').on('submit', function (e) {

        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            var url = 'contact.php';

            // POST values in the background the the script URL
            $.ajax({
                type: 'POST',
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    if (messageAlert && messageText) {
                        if (messageAlert == 'alert-success') {
                            messageText = 'contact.form.sentOK';
                        } else {
                            messageText = 'contact.form.sentError';
                        }
                        var alertBox =
                            '<div class="alert ' + messageAlert +
                            ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                            i18next.t(messageText) + '</div>';
                        $('#contact-form').find('.messages').html(alertBox);
                        // empty the form
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    })

    // ACCORDION

    // Add minus icon for collapse element which is open by default
    $('.collapse.in').each(function() {
        $(this).siblings('.panel-heading').find('.glyphicon').addClass('glyphicon-minus').removeClass('glyphicon-plus');
    });

    // Toggle plus minus icon on show hide of collapse element
    $('.collapse').on('show.bs.collapse', function() {
        $(this).parent().find('.glyphicon').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }).on('hide.bs.collapse', function() {
        $(this).parent().find('.glyphicon').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    });
    $('#collapse1').click();
});