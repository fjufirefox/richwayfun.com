var fifu_slider;

(function ($) {
    $(document).ready(function () {
        fifu_slider = fifu_load_slider();
    });
})(jQuery);

function fifu_load_slider() {
    return jQuery(".gallery.list-unstyled:not(.already-loaded)").lightSlider({
        gallery: true,
        mode: 'fade',
        item: 1,
        thumbItem: 5,
        slideMargin: 0,
        adaptiveHeight: false,
        speed: fifuSliderVars.fifu_slider_speed,
        auto: fifuSliderVars.fifu_slider_auto,
        loop: true,
        freeMove: true,
        enableDrag: false,
        enableTouch: true,
        pager: fifuSliderVars.fifu_slider_thumb, // true can cause lazy load problems
        vertical: false,
        verticalHeight: 300,
        vThumbWidth: 100,
        slideEndAnimation: false,
        pause: fifuSliderVars.fifu_slider_pause,
        controls: fifuSliderVars.fifu_slider_ctrl,
        pauseOnHover: fifuSliderVars.fifu_slider_stop,
        onSliderLoad: function (el) {
            // el == this == ul
            jQuery(el).removeClass("cS-hidden");

            // avoid duplicated slider elements after ajax calls
            jQuery(el).addClass("already-loaded");

            // add slider gallery
            $lg = el.lightGallery({
                selector: '.gallery.list-unstyled ' + (fifuSliderVars.fifu_slider_gallery ? '.lslide' : '')
            });

            // use 1st image instead of slider
            if ($lg[0].clientWidth < 175 || $lg.find('img')[0].clientWidth < 175) {
                imgs = $lg.find('img');
                firstImage = imgs[0];
                $lg.parents('div.fifu-slider').replaceWith(firstImage);
                jQuery(firstImage).css('height', '');
                jQuery(firstImage).css('width', '');
                if (fifuSliderVars.fifu_lazy)
                    jQuery(firstImage).addClass('lazyload');
                return false;
            }

            $lg.on('onAfterOpen.lg', function (event) {
                // lazy load for gallery
                urls = [];
                jQuery(el).find('li').each(function (index) {
                    urls.push(jQuery(this).attr('data-thumb'));
                });
                jQuery('div.lg-thumb.lg-group').each(function (index) {
                    if (jQuery('div.lg-thumb-item').find('img[src="' + urls[0] + '"]')) {
                        jQuery(this).find('img').each(function (index) {
                            if (urls[index].includes('featuredimagefromurl.com'))
                                jQuery(this).attr('src', urls[index].replace('original', '100'));
                            else if (urls[index].includes('.wp.com'))
                                jQuery(this).attr('src', urls[index].replace('?ssl=1', '?w=100&resize=100&ssl=1'));
                            else
                                jQuery(this).attr('src', urls[index]);
                        });
                    }
                });
            });

            // thumbnail (click)
            jQuery('ul.lSPager li a img').on('click', function () {
                if (fifuSliderVars.fifu_lazy) {
                    // for jetpack
                    src = jQuery(this).attr('src').split('?')[0];
                    fifu_add_lazyload(jQuery('img[data-src^="' + src + '"]'));
                }
            });

            // fix elementor
            jQuery("article.elementor-portfolio-item > a.elementor-post__thumbnail__link > div.elementor-post__thumbnail > div.fifu-slider").parent().parent().attr("class", "");
            jQuery("div.elementor-post__thumbnail > div.fifu-slider").parent().attr("class", "");
        },
        onBeforeStart: function (el) {
            // if same height is off
            if (!fifuSliderVars.fifu_should_crop && !fifuSliderVars.fifu_slider_thumb) {
                setTimeout(function () {
                    jQuery('div.fifu-slider').each(function (index) {
                        if (jQuery(this).attr('fifu-ratio')) {
                            // with defined ratio
                            width = jQuery(this)[0].clientWidth;
                            attr = jQuery(this).attr('fifu-ratio');
                            ratio_w = parseInt(attr.split(':')[0]);
                            ratio_h = parseInt(attr.split(':')[1]);
                            jQuery(this).find('img').each(function (index) {
                                jQuery(this).attr('style', jQuery(this).attr('style') + ';height: ' + (width * ratio_h / ratio_w) + 'px !important');
                                jQuery(this).css('width', '100%');
                                jQuery(this).css('object-fit', 'cover');
                            });
                        } else {
                            // without ratio
                            imgHeight = jQuery(this).find('img')[0].clientHeight;
                            jQuery(this).css('height', imgHeight + 'px');
                        }
                    });
                }, 0);
            }
        },
        onBeforeNextSlide: function (el) {
            if (fifuSliderVars.fifu_lazy) {
                jQuery(el).find('li.lslide.active').each(function (index) {
                    fifu_add_lazyload(jQuery(this).next().find('img'))
                });
            }
        },
        onBeforePrevSlide: function (el) {
            if (fifuSliderVars.fifu_lazy) {
                jQuery(el).find('li.lslide').each(function (index) {
                    if (jQuery(this).hasClass('active')) {
                        if (index == 0)
                            fifu_add_lazyload(jQuery(el).find('li.lslide').last().find('img'));
                        else
                            fifu_add_lazyload(jQuery(this).prev().find('img'));
                    }
                });
            }
        },
    });
}
