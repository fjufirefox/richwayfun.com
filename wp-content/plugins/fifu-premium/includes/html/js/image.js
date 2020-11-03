jQuery(document).ready(function ($) {
    // lazy load
    if (fifuImageVars.fifu_lazy)
        fifu_lazy();

    // for all images on home/shop
    if (fifuImageVars.fifu_should_crop) {
        setTimeout(function () {
            cropImage();
        }, parseInt(fifuImageVars.fifu_crop_delay));
    }

    if (fifuImageVars.fifu_slider) {
        cropImage('.fifu-slider');
        setTimeout(function () {
            cropImage('ul.lSPager');
        }, 500);
    }

    // hover effects
    if (fifuImageVars.fifu_hover_selected == 'on')
        addHoverEffect($);

    // woocommerce lightbox/zoom
    disableClick($);
    disableLink($);

    // zoomImg
    setTimeout(function () {
        jQuery('img.zoomImg').css('z-index', '');
    }, 1000);

    if (fifuImageVars.fifu_slider && fifuImageVars.fifu_is_product) {
        setTimeout(function () {
            // featured slider gallery
            jQuery('.fifu-woo-gallery').css('height', 'auto');
            cropImage('ul.lSPager');
            jQuery('ul.lSPager').css('opacity', '1');
        }, 100);

        // divi
        setTimeout(function () {
            cropImage('ul.lSPager');
        }, 1500);

        // avada
        setTimeout(function () {
            cropImage('ul.lSPager');
        }, 3000);
    }

    jQuery('img[height=1]').each(function (index) {
        if (jQuery(this).attr('width') != 1)
            jQuery(this).css('position', 'relative');
    });
});

jQuery(document).ajaxComplete(function ($) {
    addHoverEffect($);

    // image not found
    jQuery('div.woocommerce-product-gallery img').on('error', function () {
        jQuery(this)[0].src = fifuImageVars.fifu_error_url;
    });
});

jQuery(window).on('ajaxComplete', function () {
    if (fifuImageVars.fifu_lazy)
        fifu_lazy();

    // timeout necessary (load more button of Bimber)
    setTimeout(function () {
        if (fifuImageVars.fifu_slider)
            fifu_slider = fifu_load_slider();
    }, 300);
});

function addHoverEffect($) {
    var selector = fifuImageVars.fifu_hover_selector;

    jQuery('.post-thumbnail, .featured-image > a > img, div.thumbnail > a > img, .featured-media > a > img' + (selector ? ',' + selector : '')).each(function (index) {
        if (fifuImageVars.fifu_is_front_page)
            jQuery(this).replaceWith('<div id="hover" class="' + fifuImageVars.fifu_hover + '"><div><figure>'.concat(jQuery(this).parent().html()).concat('</figure></div></div>'));
    });

    jQuery('img.attachment-woocommerce_thumbnail').each(function (index) {
        // ignore if the image is not in main area
        if (jQuery(this).parent().parent().html().search('woocommerce-LoopProduct-link') < 0)
            return;
        if (fifuImageVars.fifu_is_shop == 'on')
            jQuery(this).replaceWith('<div id="hover" class="' + fifuImageVars.fifu_hover + '"><div><figure>'.concat(jQuery(this).context.outerHTML).concat('</figure></div></div>'));
    });

    // selector for shop
    if (selector) {
        jQuery(selector).each(function (index) {
            if (fifuImageVars.fifu_is_shop == 'on')
                jQuery(this).replaceWith('<div id="hover" class="' + fifuImageVars.fifu_hover + '"><div><figure>'.concat(jQuery(this).parent().html()).concat('</figure></div></div>'));
        });
    }
}

function cropImage(selector) {
    if (!selector)
        selector = fifuImageVars.fifu_crop_default + fifuImageVars.fifu_crop_selectors;

    // get selectors and set individual ratios in a dictionary
    sel = selector.split(',');
    dictRatio = {}
    selector = '';
    for (i = 0; i < sel.length; i++) {
        arr = sel[i].split('|');
        if (arr.length == 2)
            dictRatio[i] = arr[1];
        selector += arr[0];
        if (i + 1 < sel.length)
            selector += ', ';
    }

    fit = fifuImageVars.fifu_fit;

    // get global ratio
    global_ratio = fifuImageVars.fifu_crop_ratio;
    global_ratio_w = global_ratio.split(':')[0];
    global_ratio_h = global_ratio.split(':')[1];

    // for each selector
    sel = selector.split(',');
    for (i = 0; i < sel.length; i++) {

        // define which ratio will be used
        if (dictRatio) {
            local_ratio = dictRatio[i];
            ratio_w = local_ratio ? local_ratio.split(':')[0] : global_ratio_w;
            ratio_h = local_ratio ? local_ratio.split(':')[1] : global_ratio_h;
        }

        jQuery(sel[i]).each(function (index) {
            var width;
            // a.g1-frame-inner is for bimber theme
            jQuery(this).find('img, a.g1-frame').each(function (index) {
                if (!width) {
                    if (jQuery(this).attr('class') == 'fifu') {
                        // slider
                        slider = jQuery(this).parents('.fifu-slider');
                        if (!slider[0] || slider.attr('fifu-ratio'))
                            return;
                        width = slider[0].clientWidth;
                    } else {
                        width = jQuery(this).parent().css('width').replace('px', '');
                        width = width != 0 ? width : jQuery(this).parent().parent().css('width').replace('px', '');
                        width = width != 0 ? width : jQuery(this).parent().parent().parent().css('width').replace('px', '');
                    }
                }

                if (isValidImgClass(jQuery(this).attr('class'))) {
                    jQuery(this).attr('style', jQuery(this).attr('style') + ';height: ' + (width * ratio_h / ratio_w) + 'px !important');
                    jQuery(this).css('width', '100%');
                    jQuery(this).css('object-fit', fit ? fit : 'cover');

                    // position
                    position = jQuery(this).attr('fifu-position');
                    if (position) {
                        jQuery(this).css('object-position', position);
                        jQuery(this).removeAttr('fifu-position');
                    }
                }
            });
        });
    }

    jQuery('a.woocommerce-LoopProduct-link').css('width', '100%');
}

function isValidImgClass(className) {
    // bimber
    return !className || !className.includes('avatar');
}

function disableClick($) {
    if (!fifuImageVars.fifu_woo_lbox_enabled) {
        firstParentClass = '';
        parentClass = '';
        jQuery('figure.woocommerce-product-gallery__wrapper').find('div.woocommerce-product-gallery__image').each(function (index) {
            parentClass = jQuery(this).parent().attr('class').split(' ')[0];
            if (!firstParentClass)
                firstParentClass = parentClass;

            if (parentClass != firstParentClass)
                return false;

            jQuery(this).children().click(function () {
                return false;
            });
            jQuery(this).children().children().css("cursor", "default");
        });
    }
}

function disableLink($) {
    if (!fifuImageVars.fifu_woo_lbox_enabled) {
        firstParentClass = '';
        parentClass = '';
        jQuery('figure.woocommerce-product-gallery__wrapper').find('div.woocommerce-product-gallery__image').each(function (index) {
            parentClass = jQuery(this).parent().attr('class').split(' ')[0];
            if (!firstParentClass)
                firstParentClass = parentClass;

            if (parentClass != firstParentClass)
                return false;

            jQuery(this).children().attr("href", "");
        });
    }
}

jQuery(document).ajaxSuccess(function () {
    if (fifuImageVars.fifu_should_crop)
        cropImage();
});

jQuery(document).click(function ($) {
    fifu_fix_gallery_height();
})

function fifu_fix_gallery_height() {
    if (fifuImageVars.fifu_is_flatsome_active) {
        mainImage = jQuery('.woocommerce-product-gallery__wrapper div.flickity-viewport').find('img')[0];
        if (mainImage)
            jQuery('.woocommerce-product-gallery__wrapper div.flickity-viewport').css('height', mainImage.clientHeight + 'px');
    }
}
