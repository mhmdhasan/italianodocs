$(function () {
    /* ===============================================================
         ADD TEXT BACKGROUND FOR THEME COMPONENTS
      =============================================================== */
    var bgHeadingText  =  $('.bg-heading-text');
    $(window).on('load', function () {
        $('.bg-heading-text').each(function () {
            var bgHeadingContent = $(this).attr('data-text');
            $(this).prepend('<span class="bg-heading-text-content">' + bgHeadingContent + '</span>');
        });

        $('.bg-hero-text').each(function () {
            var bgHeroTextContent = $(this).attr('data-text');
            $(this).prepend('<span class="bg-hero-text-content">' + bgHeroTextContent + '</span>');
        });
    });

    /* ===============================================================
         ADD TEXT BACKGROUND FOR THEME COMPONENTS
      =============================================================== */
    $(window).on('load', function () {
        bgHeroText.each(function () {
            var bgHeroTextContent = $(this).attr('data-text');
            $(this).prepend('<span class="bg-hero-text-content">' + bgHeroTextContent + '</span>');
        });

        bgHeadingText.each(function () {
            var bgHeadingContent = $(this).attr('data-text');
            $(this).prepend('<span class="bg-heading-text-content">' + bgHeadingContent + '</span>');
        });
    });


    // ---------------------------------------------- //
    // Scroll Spy
    // ---------------------------------------------- //
    $('body').scrollspy({
        target: '.navbar',
        offset: 80
    });

    // ---------------------------------------------- //
    // Preventing URL update on navigation link click
    // ---------------------------------------------- //
    $('.link-scroll').bind('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top - 20
        }, 600);
        e.preventDefault();
    });

    $(window).on('scroll', function () {

        $('section').each(function() {
            var linkId = '#' + $(this).attr('id');
            var navitem = '.sidebar-link[href="' + linkId + '"]';

            if (($(this).offset().top - 100) < $(window).scrollTop()) {
                $(navitem).addClass('active').parent('.sidebar-item').siblings().find('.sidebar-link').removeClass('active');
            }
        });
    });


    $('#scrollTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0}, 1000);
    });

    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= 2000) {
            $('#scrollTop').addClass('active');
        } else {
            $('#scrollTop').removeClass('active');
        }
    });


    window.prettyPrint && prettyPrint();
});
