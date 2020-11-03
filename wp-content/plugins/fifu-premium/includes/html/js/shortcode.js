jQuery(document).ready(function ($) {
    setTimeout(function () {
        jQuery(".pswp__counter").bind("DOMSubtreeModified", function ($) {
            replaceShortcodeImageDlg($);
        });
    }, 100);
});

jQuery(document).click(function ($) {
    // zoom
    jQuery("a.woocommerce-product-gallery__trigger").on("click", function ($) {
        setTimeout(function () {
            replaceShortcodeImageDlg($);
        }, 100);
    });
    // arrows
    jQuery("button.pswp__button").on("click", function ($) {
        replaceShortcodeImageDlg($);
    });

    replaceShortcodeThumb();
});

jQuery(document).keydown(function (e) {
    setTimeout(function () {
        switch (e.which) {
            case 37:// left
                replaceShortcodeImageDlg($);
                break;
            case 39:// right
                replaceShortcodeImageDlg($);
                break;
        }
    }, 100);
});

function replaceThisShortcodeThumb($) {
    if (fifuShortcodeVars.fifu_lazy)
        var post_id = jQuery($).attr('data-src').split('fifu-post-id=')[1].split('&')[0];
    else
        var post_id = jQuery($)[0].src.split('fifu-post-id=')[1].split('&')[0];
    width = jQuery($)[0].width;
    if (!fifuShortcodeVars.fifu_shortcode_min_width || width > fifuShortcodeVars.fifu_shortcode_min_width) {
        jQuery($).attr('id', 'fifu-' + post_id);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: ajax_object.ajaxurl,
            cache: false,
            data: {action: 'fifu_callback_shortcode', id: post_id},
            global: false,
            success: function (response) {
                if (response)
                    findAndReplace(post_id, response.longcode);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
}

function findAndReplace(id, longcode) {
    jQuery('img[src*="shortcode.svg?fifu-post-id=' + id + '"], iframe[src*="shortcode.svg?fifu-post-id=' + id + '"]').each(function (index) {
        if (jQuery(this).parent().attr('class') != 'fifu-shortcode') {
            imgWidth = jQuery(this)[0].width;
            imgHeight = jQuery(this)[0].height;

            // get shortcode content
            tmp = jQuery(longcode)[0];

            //calc height
            jQuery(this).wrap('<div class="fifu-shortcode" style="width:100%;height:' + imgWidth * tmp.height / tmp.width + 'px"></div>');
            jQuery(this).parent().append(longcode);
            jQuery(this).css('display', 'none');
            jQuery(this).remove();
            //for all shortcodes on home/shop
            if (fifuShortcodeVars.fifu_should_crop)
                cropShortcode();
        }
    });
}

function cropShortcode() {
    var root = jQuery("a.woocommerce-LoopProduct-link.woocommerce-loop-product__link");
    root.find('iframe').each(function (index) {
        var width = root.parent().css('width').replace('px', '');
        jQuery(this).css('height', width * 3 / 4);
        jQuery(this).css('width', '100%');
        jQuery(this).css('object-fit', 'cover');
    });
}

function replaceShortcodeImageDlg() {
    post_id = fifuShortcodeVars.fifu_post_id;
    url = fifuShortcodeVars.fifu_url;
    jQuery('div.pswp__container > div.pswp__item > div.pswp__zoom-wrap').each(function (index) {
        if (jQuery(this).find('img[src*="shortcode.svg"]').length && jQuery(this).find('div.fifu-shortcode').length == 0) {
            height = jQuery(this).find('img[src*="shortcode.svg"]')[0].clientHeight;
            jQuery(this).find('img[src*="shortcode.svg"]').attr('style', 'display: none');
            jQuery(this).append('<div class="fifu-shortcode" id="fifu-' + post_id + '" style="display:inline-block;height:' + height + 'px"></div>');
            jQuery.ajax({
                type: "POST",
                dataType: "json",
                url: ajax_object.ajaxurl,
                cache: true,
                data: {action: 'fifu_callback_shortcode', id: post_id},
                global: false,
                success: function (response) {
                    jQuery('div#fifu-' + post_id).append(response.longcode);
                }
            }).fail(function (data) {
                console.log(data);
            });
        }
    });
}

function replaceShortcodeThumb() {
    replaceShortcodeThumbAll();
    setTimeout(function () {
        replaceShortcodeThumbAll();
    }, 1000);
}

function replaceShortcodeThumbAll() {
    jQuery('img[src*="shortcode.svg"]').each(function (index) {
        replaceThisShortcodeThumb(jQuery(this));
    });
}
