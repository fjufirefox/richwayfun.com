function removeVideo() {
    jQuery("#fifu_video").hide();
    jQuery("#fifu_video_link").hide();

    jQuery("#fifu_video_input_url").val("");

    jQuery("#fifu_video_button").show();
}

function previewVideo() {
    var $url = jQuery("#fifu_video_input_url").val();

    if ($url) {
        jQuery("#fifu_video_button").hide();

        jQuery("#fifu_video_iframe").attr("src", srcVideo($url));

        jQuery("#fifu_video").show();
        jQuery("#fifu_video_link").show();
    }

}

function isYoutubeUrl($url) {
    return $url.includes("youtu");
}

function isVimeoUrl($url) {
    return $url.includes("vimeo.com");
}

function isCloudinaryVideoUrl($url) {
    return $url.includes("cloudinary.com") && $url.includes("/video/");
}

function isTumblrVideoUrl($url) {
    return $url.includes("tumblr.com");
}

function isImgurVideoUrl($url) {
    return $url.includes("imgur.com") && $url.includes("mp4");
}

function isPublitioVideoUrl($url) {
    return $url.includes("publit.io") && $url.includes("mp4");
}

function isGagVideoUrl($url) {
    return $url.includes("9cache.com");
}

function idYoutube($url) {
    var $regex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
    return $res = $url.match($regex);
}

function idVimeo($url) {
    var $regex = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+).*$/;
    return $res = $url.match($regex);
}

function srcYoutube($url) {
    return "https://www.youtube.com/embed/" + idYoutube($url)[1];
}

function srcVimeo($url) {
    return "https://player.vimeo.com/video/" + idVimeo($url)[4];
}

function srcCloudinary($url) {
    return $url;
}

function srcTumblr($url) {
    return $url;
}

function srcImgur($url) {
    return $url;
}

function srcPublitio($url) {
    return $url;
}

function srcGag($url) {
    return $url;
}

function srcVideo($url) {
    if (isYoutubeUrl($url))
        return srcYoutube($url);
    if (isVimeoUrl($url))
        return srcVimeo($url);
    if (isCloudinaryVideoUrl($url))
        return srcCloudinary($url);
    if (isTumblrVideoUrl($url))
        return srcTumblr($url);
    if (isImgurVideoUrl($url))
        return srcImgur($url);
    if (isPublitioVideoUrl($url))
        return srcPublitio($url);
    if (isGagVideoUrl($url))
        return srcGag($url);
    return null;
}

jQuery(document).ready(function () {
    // start
    fifu_video_get_sizes();

    // blur
    jQuery("#fifu_video_input_url").on('input', function (evt) {
        evt.stopImmediatePropagation();
        fifu_video_get_sizes();
    });

    // title
    jQuery("div#wooVideoUrlMetaBox").find('h2').replaceWith('<h4 style="top:5px;position:relative;"><span class="dashicons dashicons-video-alt3" style="font-size:15px"></span>' + jQuery("div#wooVideoUrlMetaBox").find('h2').text() + '</h4>');
    jQuery("div#videoUrlMetaBox").find('h2').replaceWith('<h4 style="top:7px;position:relative;"><span class="dashicons dashicons-video-alt3" style="font-size:15px"></span>' + jQuery("div#videoUrlMetaBox").find('h2').text() + '</h4>');
});

function fifu_video_get_sizes() {
    video_url = jQuery("#fifu_video_input_url").val();
    if (!video_url)
        return;
    image_url = fifu_video_image_thumbnail(video_url);
    fifu_video_get_image(image_url);
}

function fifu_video_get_image(url) {
    var image = new Image();
    jQuery(image).attr('onload', 'fifu_video_store_sizes(this);');
    jQuery(image).attr('src', url);
}

function fifu_video_store_sizes($) {
    jQuery("#fifu_video_input_image_width").val($.naturalWidth);
    jQuery("#fifu_video_input_image_height").val($.naturalHeight);
    if ($.naturalWidth == 120 && $.naturalHeight == 90)
        jQuery("#fifu_video_input_image_src").val($.src.replace('maxresdefault', 'mqdefault'));
    else
        jQuery("#fifu_video_input_image_src").val($.src);
}

function fifu_video_image_thumbnail(url) {
    var response;

    jQuery.ajax({
        method: "POST",
        url: fifuVideoMetaBoxVars.restUrl + 'fifu-premium/v2/video_image_thumbnail/',
        async: false,
        data: {
            "url": url,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuVideoMetaBoxVars.nonce);
        },
        success: function (data) {
            response = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
        },
    });

    return decodeURI(response);
}
