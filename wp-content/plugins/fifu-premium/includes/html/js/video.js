jQuery(document).ready(function ($) {
    // don't put timeout here, otherwise the lazyload will fail for videos

    if (!fifuVideoVars.fifu_should_wait_ajax)
        replaceVideoThumb($);

    jQuery(".pswp__counter").bind("DOMSubtreeModified", function ($) {
        replaceImageDlg($);
    });

    setTimeout(function () {
        fifu_fix_youtube_thumbnails();
    }, 2000);

    setTimeout(function () {
        // video height
        wrapper = jQuery('div.fifu_wrapper')[0];
        if (wrapper) {
            height = wrapper.clientHeight;

            if (fifuVideoVars.fifu_is_divi_active) {
                if (wrapper.clientHeight > wrapper.clientWidth) {
                    height /= 2;
                    jQuery('iframe.fifu_iframe').parent().attr('style', '');
                }
            }

            if (height > 0) {
                jQuery('iframe.fifu_iframe').css('height', height);

                // youzer + buddypress
                if (new RegExp('/activity/$').test(window.location.href))
                    height = 0;

                jQuery('img.fifu_ratio').css('height', height);
            }
        }

        if (fifuVideoVars.fifu_woocommerce == 'on')
            fifu_fix_zoom();

        if (fifuVideoVars.fifu_is_divi_active)
            fifu_fix_divi();

        if (fifuVideoVars.fifu_is_elementor_active)
            fifu_fix_elementor();

        if (fifuVideoVars.fifu_is_play_type_lightbox) {
            jQuery("div.woocommerce-product-gallery__image").find("div.fifu_play.start").on("click", function ($) {
                jQuery.fancybox.open([{src: jQuery(this).find('a').attr('href')}]);
            });
        }
    }, 200);

    if (fifuVideoVars.fifu_essential_grid_status == 'on') {
        fifu_fix_essential_grid();
    }
});

jQuery(document).click(function ($) {
    fifu_fix_youtube_thumbnails();

    // zoom
    jQuery("a.woocommerce-product-gallery__trigger").on("click", function ($) {
        setTimeout(function () {
            replaceImageDlg($);
        }, 100);
    });
    // arrows
    jQuery("button.pswp__button, button.pswp__button--arrow--left, button.pswp__button--arrow--right").on("click", function ($) {
        replaceImageDlg($);
    });

    jQuery('.pswp__zoom-wrap').on("click", function ($) {
        if (fifuVideoVars.fifu_is_flatsome_active)
            jQuery('div.pswp').removeClass('pswp--open');
    });
});

jQuery(document).on("mouseover", function ($) {
    jQuery("div.woocommerce-product-gallery__image").on("mouseover", function ($) {
        if (is_video_img(jQuery(this)[0].dataset.thumb))
            fifu_fix_zoom();
    });
})

jQuery(document).keydown(function (e) {
    setTimeout(function () {
        switch (e.which) {
            case 37:// left
                replaceImageDlg($);
                break;
            case 39:// right
                replaceImageDlg($);
                break;
        }
    }, 100);
});

function replaceVideoThumb($) {
    // check if elementor exists
    $position = typeof jQuery('div.elementor')[0] == "undefined" && fifuVideoVars.fifu_is_flatsome_active ? 'unset' : 'relative';

    var height;
    var width;

    if (fifuVideoVars.fifu_is_home)
        selector = 'img.fifu-video';
    else
        selector = 'img';

    jQuery(selector + ',[style*="background-image"]').each(function (index) {
        if (jQuery(this).prop('tagName') == 'IMG') {
            src = jQuery(this).attr('src');
            background_style = "";
            is_background = false;
        } else {
            src = jQuery(this).css('background-image').split(/url\([\'\"]/)[1].split(/[\'\"]\)/)[0];
            background_style = "style='position:unset'";
            is_background = true;
        }

        // lazy load
        if (!is_video_img(src)) {
            src = jQuery(this).attr('data-src');
        }

        if (!is_video_img(src))
            return;

        if (fifuVideoVars.fifu_gallery_selector && jQuery(this).parents(fifuVideoVars.fifu_gallery_selector).length) {
            if (fifuVideoVars.fifu_is_product && fifuVideoVars.fifu_video_gallery_icon_enabled && jQuery(this).parents().attr('class') != 'fifu_play icon_gallery') {
                jQuery(this).wrap("<div class='fifu_play icon_gallery'></div>");
                jQuery(this).after("<span class='dashicons dashicons-format-video icon_gallery' style='height:24px'></span>");
            }
            return;
        }

        if (jQuery(this).parent().parent().find('.fifu_play').length)
            return;

        if (jQuery(this).parents('ol.flex-control-nav').length)
            return;

        // minimum video width
        minWidth = fifuVideoVars.fifu_video_min_width;
        var width = jQuery(this)[0].clientWidth;
        if (width == 0)
            width = jQuery(this).parent()[0].clientWidth;

        // the last condition is for related products
        if (
                // autoplay for video image thumbnail + play button
                !(fifuVideoVars.fifu_autoplay_enabled && fifuVideoVars.fifu_url == src && !fifuVideoVars.fifu_is_product && !fifuVideoVars.fifu_is_front_page)
                &&
                ((fifuVideoVars.fifu_is_product && jQuery(this).parentsUntil('div.woocommerce-product-gallery').length) ||
                        (fifuVideoVars.fifu_video_thumb_enabled_home) ||
                        (fifuVideoVars.fifu_video_thumb_enabled_page) ||
                        (fifuVideoVars.fifu_video_thumb_enabled_post) ||
                        (fifuVideoVars.fifu_video_thumb_enabled_cpt) ||
                        (minWidth && (width != null && (width < Number(minWidth) || width == 0))))
                ) {
            if ((width == 0 || width > 150) && jQuery(this).parent().attr('class') != 'fifu_play' && jQuery(this).parent().find('iframe').length == 0 && !fifuVideoVars.fifu_should_hide) {

                if (fifuVideoVars.fifu_play_button_enabled) {
                    if (fifuVideoVars.fifu_url != src && fifuVideoVars.fifu_play_hide_grid && !fifuVideoVars.fifu_is_product) {
                        jQuery(this).wrap("<div class='fifu_play icon'></div>");
                        jQuery(this).after("<span class='dashicons dashicons-format-video icon'></span>");
                    } else {
                        jQuery(this).wrap("<div class='fifu_play start' " + background_style + "></div>");
                        if (fifuVideoVars.fifu_is_play_type_inline) {
                            // inline
                            jQuery(this).after("<a class='fifu_link' href='/' onclick='return false'><span class='dashicons dashicons-controls-play btn'></span></a>");
                            registerReplaceOnClick();
                        } else {
                            // lightbox                                 
                            if (fifuVideoVars.fifu_mouse_youtube_enabled || fifuVideoVars.fifu_mouse_vimeo_enabled) {
                                // mouseover
                                jQuery(this).after("<a class='fifu_link' onmouseenter='jQuery.fancybox.open([{src:\"" + video_url(src) + "\"}])' data-fancybox href='" + video_url(src) + "'><span class='dashicons dashicons-controls-play btn'></span></a>");
                            } else
                                jQuery(this).after("<a class='fifu_link' data-fancybox href='" + video_url(src) + "'><span class='dashicons dashicons-controls-play btn'></span></a>");
                        }
                    }

                    if (fifuVideoVars.fifu_is_elementor_active) {
                        parentClass = jQuery(this).parent().parent().attr('class');
                        if (parentClass && parentClass.startsWith('elementor-'))
                            jQuery(this).parent().css('position', 'unset')
                    }
                }

            }
            jQuery(this).css('opacity', 1);
            return;
        }

        if (jQuery(this).attr('class') == 'zoomImg')
            return;

        if (is_video_img(src)) {
            url = video_url(src);
            url = add_parameters(url, src);
            $autoplay = fifuVideoVars.fifu_url == src && fifuVideoVars.fifu_autoplay_enabled && !fifuVideoVars.fifu_is_home_or_shop && !fifuVideoVars.fifu_is_front_page ? 'allow="autoplay"' : '';
            $background = '/wp-content/plugins/fifu-premium/includes/images/16x9-transparent.png';
            if (fifuVideoVars.fifu_video_black == 'on')
                $background = $background.replace('transparent', 'black');

            if (is_background) {
                w = 'width:' + jQuery(this)[0].clientWidth + 'px';
                h = 'height:' + jQuery(this)[0].clientHeight + 'px';

                $iframe_class = fifuVideoVars.fifu_lazy ? 'lazyload' : '';

                $video = '<iframe class="' + $iframe_class + '" ' + fifuVideoVars.fifu_lazy_src_type + '"' + url + '" allowfullscreen frameborder="0" ' + $autoplay + ' style="' + w + ';' + h + '"></iframe>';
                jQuery(this).append($video);
            } else {
                $iframe_class = 'fifu_iframe';
                $iframe_class += fifuVideoVars.fifu_lazy ? ' lazyload' : '';

                $video = '<div class="fifu_wrapper"><div class="fifu_h_iframe" style="position:' + $position + '"><img class="fifu_ratio" src="' + $background + '"/><iframe class="' + $iframe_class + '" ' + fifuVideoVars.fifu_lazy_src_type + '"' + url + '" allowfullscreen frameborder="0" ' + $autoplay + '></iframe></div></div>';
                jQuery(this).replaceWith($video);
            }
        }
    });
}

function replaceImageDlg($) {
    jQuery('div.pswp__zoom-wrap').each(function () {
        img = jQuery(this).find('img.pswp__img');
        src = img.attr('src');
        if (!is_video_img(src))
            return;
        w = jQuery(window).width() * 0.62;
        img.attr('style', '');
        img.css('display', 'unset');
        img.css('position', 'unset');
        img.css('width', w);
        jQuery(this).replaceWith('<div class="pswp__zoom-wrap">' + '<div class="wrapper"><div class="fifu_play start">' + img[0].outerHTML + '<a data-fancybox href="' + video_url(src) + '"><span class="dashicons dashicons-controls-play btn"></span></a></div></div></div>');
    });
}

function registerReplaceOnClick() {
    var events = "click";

    if (fifuVideoVars.fifu_mouse_youtube_enabled || fifuVideoVars.fifu_mouse_vimeo_enabled)
        events += " mouseenter";

    jQuery('div.fifu_play.start').on(events, function ($) {
        tag = jQuery(this).find('img');
        if (tag.length) {
            selector = 'img';
            src = tag[0].src;
            is_background = false;
        } else {
            selector = '[style*="background-image"]';
            tag = jQuery(this).find(selector);
            if (tag.css('background-image') == undefined)
                return;
            src = tag.css('background-image').split(/url\([\'\"]/)[1].split(/[\'\"]\)/)[0];
            is_background = true;
        }

        w = 'width:' + tag[0].clientWidth + 'px';
        h = 'height:' + tag[0].clientHeight + 'px';
        if (!fifuVideoVars.fifu_is_product) {
            // to keep bottom padding
            if (!is_background && ((!fifuVideoVars.fifu_is_home && !fifuVideoVars.fifu_is_post) || fifuVideoVars.fifu_is_shop))
                jQuery(this).after('<img src="" style="width:0px;height:0px;display:block"/>');
        } else {
            // to show the image on woocommerce lightbox
            img = tag[0];
            jQuery(this).after(img);
            jQuery(img).css('height', '0px');
            jQuery(img).css('display', 'block');
        }

        greatGrandFatherClass = jQuery(this).parent().parent().parent().attr('class');
        if (fifuVideoVars.fifu_is_elementor_active && greatGrandFatherClass && greatGrandFatherClass.startsWith('elementor-post'))
            jQuery(this).parent().attr('class', '');

        url = video_url(src);
        // add parameters
        url = add_parameters(url, src);
        url += parameter_char(url) + 'autoplay=1';

        video = '<div style="background:url(https://storage.googleapis.com/featuredimagefromurl/video-loading.gif) no-repeat center center black;' + h + '"><iframe src="' + url + '" style="' + w + ';' + h + '" allowfullscreen frameborder="0" allow="autoplay">';
        if (is_background) {
            tag.append(video);
            tag.unwrap();
            tag.next().remove();
        } else
            jQuery(this).replaceWith(video);
    });
}

jQuery(document).ajaxComplete(function ($) {
    jQuery('.fifu-video').each(function (index) {
        jQuery(this).css('opacity', 1);
    });
    replaceVideoThumb($);
});

function is_video_img($src) {
    return !$src ? null : is_youtube_img($src) || is_vimeo_img($src) || is_cloudinary_video_img($src) || is_tumblr_video_img($src) || is_imgur_video_img($src) || is_publitio_video_img($src) || is_gag_video_img($src);
}

function is_youtube_img($src) {
    return $src.includes('img.youtube.com');
}

function is_vimeo_img($src) {
    return $src.includes('i.vimeocdn.com');
}

function is_cloudinary_video_img($src) {
    return $src.includes('res.cloudinary.com') && $src.includes('/video/');
}

function is_tumblr_video_img($src) {
    return $src.includes('tumblr.com');
}

function is_imgur_video_img($src) {
    return $src.includes('imgur.com') && $src.includes('?video');
}

function is_publitio_video_img($src) {
    return $src.includes('publit.io');
}

function is_gag_video_img($src) {
    return $src.includes('9cache.com');
}

function video_id($src) {
    if (is_youtube_img($src))
        return youtube_id($src);
    if (is_vimeo_img($src))
        return vimeo_id($src);
    return null;
}

function youtube_parameter($src) {
    return $src.split('?')[1];
}

function is_jetpack_src($src) {
    return $src.includes('.wp.com/');
}

function youtube_id($src) {
    index_id = is_jetpack_src($src) ? 5 : 4;
    return $src.split('/')[index_id];
}

function vimeo_id($src) {
    return $src.split('?')[1];
}

function video_url($src) {
    $src = $src.split(/[\?\&]fifu-/)[0];
    if (is_youtube_img($src))
        return youtube_url($src);
    if (is_vimeo_img($src))
        return vimeo_url($src);
    if (is_cloudinary_video_img($src))
        return cloudinary_url($src);
    if (is_tumblr_video_img($src))
        return tumblr_url($src);
    if (is_imgur_video_img($src))
        return imgur_url($src);
    if (is_publitio_video_img($src))
        return publitio_url($src);
    if (is_gag_video_img($src))
        return gag_url($src);
    return null;
}

function youtube_url($src) {
    return 'https://www.youtube.com/embed/' + youtube_id($src) + '?' + youtube_parameter($src) + '&enablejsapi=1';
}

function vimeo_url($src) {
    return 'https://player.vimeo.com/video/' + vimeo_id($src);
}

function cloudinary_url($src) {
    return $src.replace('jpg', 'mp4');
}

function tumblr_url($src) {
    $tmp = $src.replace('https://78.media.tumblr.com', 'https://vt.media.tumblr.com');
    return $tmp.replace('_smart1.jpg', '.mp4');
}

function imgur_url($src) {
    return $src.replace('jpg?video', 'mp4');
}

function publitio_url($src) {
    return $src.replace('jpg', 'mp4');
}

function gag_url($src) {
    return $src.split('_')[0] + '_460svvp9.webm';
}

jQuery(window).load(function () {
    fifu_autoplay_mouseover_vimeo();
    fifu_autoplay_mouseover_youtube();

    // lazyload
    jQuery('iframe').on('load', function () {
        fifu_autoplay_mouseover_vimeo();
        fifu_autoplay_mouseover_youtube();
    });
});

function fifu_autoplay_mouseover_vimeo() {
    enabled = fifuVideoVars.fifu_mouse_vimeo_enabled;
    if (!enabled)
        return;

    jQuery('iframe').each(function (index) {
        if (this.src.includes("vimeo.com")) {
            jQuery(this).on("mouseover", function () {
                $f(this).api("play");
                if (!!window.chrome)
                    $f(this).api('setVolume', 0);
            }).mouseout(function () {
                $f(this).api("pause");
            });
        }
    });
}

var players = [];

function fifu_autoplay_mouseover_youtube() {
    enabled = fifuVideoVars.fifu_mouse_youtube_enabled;
    if (!enabled)
        return;

    jQuery('iframe').each(function (index) {
        if (this.src.includes("youtu")) {
            players[index] = new YT.Player(this);
            jQuery(this).on("mouseover", function () {
                players[index].playVideo();
                if (!!window.chrome)
                    players[index].mute();
            }).mouseout(function () {
                players[index].pauseVideo();
            });
        }
    });
}

function add_parameters(url, src) {
    loop = fifuVideoVars.fifu_loop_enabled == 'on';
    autoplay = fifuVideoVars.fifu_url == src && fifuVideoVars.fifu_autoplay_enabled && !fifuVideoVars.fifu_is_home_or_shop && !fifuVideoVars.fifu_is_front_page;
    video_related = fifuVideoVars.fifu_video_related_enabled;
    video_mute = fifuVideoVars.fifu_video_mute_enabled;
    video_background = fifuVideoVars.fifu_video_background_enabled;

    if ((loop || autoplay || video_related))
        url += parameter_char(url) + 'muted=0&autopause=1';

    if (autoplay)
        url += parameter_char(url) + 'autoplay=1';

    if (is_youtube_img(this.src)) {
        url += parameter_char(url) + (video_related ? 'rel=1' : 'rel=0');
        if (video_mute)
            url += parameter_char(url) + 'mute=1';
    } else if (is_vimeo_img(this.src)) {
        if (video_mute)
            url += parameter_char(url) + 'muted=1';
        if (video_background)
            url += parameter_char(url) + 'background=1';
    }

    if (loop) {
        url += parameter_char(url) + 'loop=1';
        if (is_youtube_img(src))
            url += parameter_char(url) + 'playlist=' + video_id(src);
    }

    return url;
}

function parameter_char(url) {
    return url.includes('?') ? '&' : '?';
}

// for ajax load more plugin
window.almComplete = function (alm) {
    jQuery('img.fifu-video').css('opacity', 1);
    replaceVideoThumb($);
};

/* style issues */

function fifu_fix_elementor() {
    jQuery('div.fifu_wrapper').each(function (index) {
        // video height
        if (jQuery(this).parent().attr('class') && jQuery(this).parent().attr('class').startsWith('elementor-')) {
            // ignore featured video
            src = jQuery(this).find('iframe.fifu_iframe')[0].src;
            if (fifuVideoVars.fifu_url && src.includes(fifuVideoVars.fifu_url))
                return;

            height = jQuery(this).parent()[0].clientHeight;
            /* height = jQuery('div.fifu_wrapper').parent()[0].getBoundingClientRect().height; // float precision */
            jQuery(this).find('iframe.fifu_iframe').css('height', height);
            jQuery(this).find('img.fifu_ratio').css('height', height);
        }

        // portfolio
        if (jQuery(this).parent().attr('class') && jQuery(this).parent().attr('class').includes('elementor-portfolio')) {
            jQuery(this).parent().attr('class', '');
            if (jQuery(this).parent().parent().attr('class').includes('elementor-')) {
                jQuery(this).parent().parent().attr('class', '');
            }
        }
        // posts
        if (jQuery(this).parent().attr('class') && jQuery(this).parent().attr('class').includes('elementor-post')) {
            jQuery(this).parent().attr('class', '');
        }
        // product category
        if (jQuery(this).parent().parent().attr('class').includes('product-category')) {
            jQuery(this).parent().parent().attr('class', '');
        }

        // unwrap from layer
        if (jQuery(this).parent().parent().attr('class').includes('elementor-post__thumbnail__link')) {
            jQuery(this).parent().unwrap();
        }
    });
}

function fifu_fix_zoom() {
    jQuery('img[role=presentation]').css('z-index', '-100');
}

function fifu_fix_divi() {
    jQuery('div.fifu_h_iframe > div.fluid-width-video-wrapper').attr('class', '');
}

function fifu_fix_essential_grid() {
    jQuery("div.eg-youtubestream-container, div.esg-cc").click(function ($) {
        setTimeout(function () {
            replaceVideoThumb($);
        }, 10);
    });
}

function fifu_fix_youtube_thumbnails() {
    jQuery('img[src*="mqdefault"]').each(function (index) {
        src = jQuery(this)[0].src;
        jQuery('*[src^="' + src.replace('mqdefault', 'maxresdefault') + '"]').each(function (index) {
            jQuery(this).attr('src', src);
            jQuery(this).attr('data-src', src);
        });
    });
}
