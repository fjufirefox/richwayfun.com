function wcRemoveVideo(i) {
    var inputUrl = "#fifu_video_input_url_" + i;
    var button = "#fifu_video_button_" + i;
    var video = "#fifu_video_" + i;
    var link = "#fifu_video_link_" + i;

    jQuery(video).hide();
    jQuery(link).hide();

    jQuery(inputUrl).val("");

    jQuery(inputUrl).show();
    jQuery(button).show();
}

function wcPreviewVideo(i) {
    var inputUrl = "#fifu_video_input_url_" + i;
    var button = "#fifu_video_button_" + i;
    var video = "#fifu_video_" + i;
    var link = "#fifu_video_link_" + i;
    var iframe = "#fifu_video_iframe_" + i;

    var $url = jQuery(inputUrl).val();

    if ($url) {
        jQuery(inputUrl).hide();
        jQuery(button).hide();

        jQuery(iframe).attr("src", srcVideo($url));

        jQuery(video).show();
        jQuery(link).show();
    }
}

jQuery(document).ready(function () {
    jQuery("div#wooCommerceVideoGalleryMetaBox").find('h2').replaceWith('<h4 style="top:5px;position:relative;"><span class="dashicons dashicons-format-video" style="font-size:15px"></span>' + jQuery("div#wooCommerceVideoGalleryMetaBox").find('h2').text() + '</h4>');
});

function fifu_woo_video_get_sizes(i) {
    video_url = jQuery('input[id^=fifu_video_input_url_' + i + ']').val();
    if (!video_url)
        return;
    image_url = fifu_video_image_thumbnail(video_url);
    fifu_woo_video_get_image(image_url, i);
}

function fifu_woo_video_get_image(url, i) {
    var image = new Image();
    jQuery(image).attr('onload', 'fifu_woo_video_store_sizes(this,' + i + ');');
    jQuery(image).attr('src', url);
}

function fifu_woo_video_store_sizes($, i) {
    jQuery("#fifu_video_input_width_" + i).val($.naturalWidth);
    jQuery("#fifu_video_input_height_" + i).val($.naturalHeight);
    if ($.naturalWidth == 120 && $.naturalHeight == 90)
        jQuery("#fifu_video_input_image_src_" + i).val($.src.replace('maxresdefault', 'mqdefault'));
    else
        jQuery("#fifu_video_input_image_src_" + i).val($.src);
}
