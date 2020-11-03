var restUrl = fifuScriptVars.restUrl;

function removeImage() {
    jQuery("#fifu_input_alt").hide();
    jQuery("#fifu_image").hide();
    jQuery("#fifu_link").hide();
    jQuery("#fifu_next").hide();
    jQuery("#fifu_thumb_button").hide();
    jQuery('#fifu_optimized').remove();
    jQuery('#fifu_giphy_logo').hide();

    jQuery("#fifu_input_alt").val("");
    jQuery("#fifu_input_url").val("");
    jQuery("#fifu_keywords").val("");

    jQuery("#fifu_button").show();
    jQuery("#fifu_help").show();
    jQuery("#fifu_giphy").show();

    if (fifuMetaBoxVars.is_sirv_active)
        jQuery("#fifu_sirv_button").show();


    giphyCount = 0;
    giphyJSON = null;
}

var giphyCount = 0;
var giphyJSON = null;

function previewImage() {
    if (giphyJSON) {
        $url = giphyJSON[giphyCount++]['images']['downsized_medium']['url'];
        jQuery("#fifu_input_url").val($url);
        runPreview($url);
        return;
    }

    var $url = jQuery("#fifu_input_url").val();

    if (jQuery("#fifu_input_url").val() && jQuery("#fifu_keywords").val())
        $message = fifuMetaBoxVars.wait;
    else
        $message = '';

    if (!$url.startsWith("http") && !$url.startsWith("//")) {
        jQuery("#fifu_keywords").val($url);
        if (fifuMetaBoxVars.is_taxonomy)
            jQuery('#fifu_button').parent().parent().block({message: $message, css: {backgroundColor: 'none', border: 'none', color: 'white'}});
        else
            jQuery('#fifu_button').parent().parent().parent().block({message: $message, css: {backgroundColor: 'none', border: 'none', color: 'white'}});
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.status == 200 && xhr.readyState == 4) {
                if ($url != xhr.responseURL) {
                    $url = xhr.responseURL;

                    if (jQuery('#fifu_giphy_checkbox').is(":checked")) {
                        giphyJSON = JSON.parse(xhr.response)['data'];
                        giphyCount = 0;
                        $url = giphyJSON[giphyCount++]['images']['downsized_medium']['url'];
                    }

                    jQuery("#fifu_input_url").val($url);
                    runPreview($url);
                }
                setTimeout(function () {
                    jQuery("#fifu_next").hide();
                    if (fifuMetaBoxVars.is_taxonomy)
                        jQuery('#fifu_button').parent().parent().unblock();
                    else
                        jQuery('#fifu_button').parent().parent().parent().unblock();
                    setTimeout(function () {
                        if (jQuery("#fifu_link").is(":visible"))
                            jQuery("#fifu_next").show();
                    }, 2000);
                }, 2000);
            }
        }
        if (jQuery('#fifu_giphy_checkbox').is(":checked")) {
            if (['', ' '].includes($url))
                xhr.open("GET", 'https://api.giphy.com/v1/gifs/trending?api_key=BgPajBFBi1OgXiGMLiqDQ7oakV5anXKV&limit=100&rating=G', true);
            else
                xhr.open("GET", 'https://api.giphy.com/v1/gifs/search?api_key=BgPajBFBi1OgXiGMLiqDQ7oakV5anXKV&q=' + $url + '&limit=100&offset=0&rating=G&lang=en', true);
        } else
            xhr.open("GET", 'https://source.unsplash.com/' + fifuMetaBoxVars.unsplash_size + '/?' + $url, true);
        xhr.send();
        if (!$url)
            jQuery("#fifu_keywords").val(' ');
    } else {
        jQuery("#fifu_next").hide();
        runPreview($url);
    }
}

function runPreview($url) {
    $url = fifu_convert($url);

    jQuery("#fifu_lightbox").attr('href', $url);

    if ($url) {
        fifu_get_sizes();

        jQuery("#fifu_button").hide();
        jQuery("#fifu_help").hide();

        jQuery("#fifu_image").css('background-image', "url('" + $url + "')");

        jQuery("#fifu_input_alt").show();
        jQuery("#fifu_image").show();
        jQuery("#fifu_link").show();
        jQuery("#fifu_thumb_button").show();
        jQuery("#sliderImageUrlMetaBox").show();

        if (fifuMetaBoxVars.fifu_su_sign_up_complete)
            checkConnected();

        if (fifuMetaBoxVars.is_sirv_active)
            jQuery("#fifu_sirv_button").hide();

        if (jQuery('#fifu_giphy_checkbox').is(":checked")) {
            jQuery('#fifu_giphy_logo').show();
            jQuery("#fifu_thumb_button").hide();
        }
    }
}

function createThumbnails() {
    jQuery('#fifu_thumb_button').hide();
    jQuery("#fifu_image").css('background-image', "url('" + 'https://storage.googleapis.com/featuredimagefromurl/load.gif' + "')");
    jQuery('#fifu_optimized').remove();
    jQuery("#fifu_giphy").hide();
    jQuery("#fifu_next").hide();
    var url = jQuery("#fifu_input_url").val();
    var post_id = fifuMetaBoxVars.get_the_ID;
    fifu_create_thumbnails_api(url, post_id);
}

function fifu_create_thumbnails_api(url, post_id) {
    if (!url || !post_id)
        return;

    var output = null;

    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/create_thumbnails/',
        data: {
            "url": url,
            "post_id": post_id,
            "meta_box": true,
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            if (data == null)
                return;

            code = data['code'];

            if (code == 5) {
                output = data['url'];
                jQuery("#fifu_image").css('background-image', "url('" + output + "?" + Math.random() + "')");
                fifu_append_optimized_icon();
                jQuery("#fifu_input_url").val(output);
            } else {
                jQuery('#fifu_thumb_button').show();
                jQuery("#fifu_thumb_message").hide();
                fifu_append_not_optimized_icon();
                jQuery("#fifu_image").css('background-image', "url('" + url + "?" + Math.random() + "')");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    return output;
}

jQuery(function () {
    if (fifuMetaBoxVars.fifu_su_sign_up_complete)
        checkConnected();
});

function checkConnected() {
    jQuery('#fifu_thumb').hide();
    jQuery('#fifu_optimized').remove();
    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/connected/',
        data: {
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            if (data == null)
                return;

            code = data['code'];

            if (code == 7) {
                if (!fifu_is_su_url()) {
                    fifu_append_not_optimized_icon();
                    jQuery('#fifu_thumb').show();
                } else
                    jQuery('#fifu_thumb').hide();
            } else
                jQuery('#fifu_thumb').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR);
            //console.log(textStatus);
            //console.log(errorThrown);
        },
        complete: function (data) {
            if (fifu_is_su_url()) {
                fifu_append_optimized_icon();
                jQuery('#fifu_thumb').hide();
            }
        }
    });
}

function fifu_is_su_url() {
    url = jQuery("#fifu_input_url").val();
    return url && url.includes('featuredimagefromurl.com');
}

function fifu_append_optimized_icon() {
    jQuery("#fifu_image").append('<div id="fifu_optimized" title="optimized" class="button" disabled style="background-color:green !important;color:white !important;opacity:80%;margin:5px"><i class="fas fa-bolt"></i></div>');
}

function fifu_append_not_optimized_icon() {
    jQuery("#fifu_image").append('<div id="fifu_optimized" title="not optimized" class="button" disabled style="background-color:red !important;color:white !important;opacity:80%;margin:5px"><i class="fas fa-bolt"></i></div>');
}

jQuery(document).ready(function () {
    jQuery("#select_position").val(fifuMetaBoxVars.position_option);
    jQuery("#select_position").change(function () {
        jQuery("#fifu_input_position").val(jQuery("#select_position").val());
    });

    jQuery("#select_position_horizontal").val(fifuMetaBoxVars.position_option_horizontal);
    jQuery("#select_position_horizontal").change(function () {
        jQuery("#fifu_input_position_horizontal").val(jQuery("#select_position_horizontal").val());
    });
});

jQuery(document).ready(function () {
    // next button
    fifu_find_next();

    // lightbox
    fifu_open_lightbox();

    // start
    fifu_get_sizes();

    // input
    fifu_type_url();

    // title
    jQuery("div#imageUrlMetaBox").find('h2').replaceWith('<h4 style="top:7px;position:relative;"><span class="dashicons dashicons-camera" style="font-size:15px"></span>' + jQuery("div#imageUrlMetaBox").find('h2').text() + '</h4>');
    jQuery("div#urlMetaBox").find('h2').replaceWith('<h4 style="top:5px;position:relative;"><span class="dashicons dashicons-camera" style="font-size:15px"></span>' + jQuery("div#urlMetaBox").find('h2').text() + '</h4>');
});

function fifu_get_sizes() {
    image_url = jQuery("#fifu_input_url").val();
    fifu_get_image(image_url);
}

function fifu_get_image(url) {
    var image = new Image();
    jQuery(image).attr('onload', 'fifu_store_sizes(this);');
    jQuery(image).attr('src', url);
}

function fifu_store_sizes($) {
    jQuery("#fifu_input_image_width").val($.naturalWidth);
    jQuery("#fifu_input_image_height").val($.naturalHeight);
}

function fifu_open_lightbox() {
    jQuery("#fifu_image").on('click', function (evt) {
        evt.stopImmediatePropagation();
        jQuery.fancybox.open('<img src="' + fifu_convert(jQuery("#fifu_input_url").val()) + '" style="max-height:600px">');
    });
}

function fifu_find_next() {
    jQuery("#fifu_next").on('click', function (evt) {
        evt.stopImmediatePropagation();
        if (jQuery("#fifu_keywords").val()) {
            jQuery("#fifu_input_url").val(jQuery("#fifu_keywords").val());
            previewImage();
        }
    });
}

function fifu_type_url() {
    jQuery("#fifu_input_url").on('input', function (evt) {
        evt.stopImmediatePropagation();
        fifu_get_sizes();
    });
}
