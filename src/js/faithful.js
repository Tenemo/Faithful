// jshint ignore: start
$(document).ready(function() {

    // $('.carousel').carousel({
    //     interval: 1000
    // })

    // Scrollify & pagination
    if ($(window).width() >= 768) {
        if (window.location.hash == '') {
            window.location.hash = 'home';
        }
        $.scrollify({
            section : 'section',
            sectionName : 'section-name',
            interstitialSection : 'footer',
            scrollSpeed: 1100,
            offset : 0,
            scrollbars: true,
            standardScrollElements: '.standardScroll',
            setHeights: false,
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
            afterRender:function() {
                var pagination = '<ul class="paginationScrollify">';
                var activeClass = '';
                $('section').each(function(i) {
                    activeClass = '';
                    if ('#' + $(this).attr('data-section-name') == window.location.hash) {
                        activeClass = 'active';
                    }
                    if ($(this).attr('data-section-name') !== 'footer') {
                        pagination += '<li><a class="' + activeClass + '" href="#' + $(this).attr('data-section-name') + '"><span class="hover-text">' + $(this).attr('data-section-translation').charAt(0).toUpperCase() + $(this).attr('data-section-translation').slice(1) + '</span></a></li>';
                    }
                });
                pagination += '</ul>';
                $('section#home').append(pagination);
            }
        });
        $('.paginationScrollify li a').on('click',function() {
            $.scrollify.move($(this).attr('href'));
            return false
        });
        // Changing anchor hrefs to Scrollify move()
        $('a.page-scroll').on('click',function() {
            $.scrollify.move($(this).attr('href'));
            return false
        });
        $('.paginationScrollify li a').hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        });
    } else {
        // window.scrollTo(0,1);
    }

    // animate.css
    // $.fn.extend({
    //     animateCss: function (animationName) {
    //         var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    //         this.addClass('animated ' + animationName).one(animationEnd, function() {
    //             $(this).removeClass('animated ' + animationName);
    //         });
    //     }
    // });

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

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a.page-scroll').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

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

    // Initialize and Configure Magnific Popup Lightbox Plugin
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: MP.tLoading + ' #%curr%...',
        tClose: MP.tClose,
        //mainClass: 'mfp-img-mobile',
        fixedContentPos: false,
        //fixedBgPos: false,
        gallery: {
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button
            tPrev: MP.tPrevious,
            tNext: MP.tNext,
            tCounter: '%curr% ' + MP.tCounter + ' %total%',
            enabled: true,
            navigateByImgClick: true,
            preload: [1, 2] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">#%curr%</a> ' + MP.tError
        }
    });

}); // End of use strict
