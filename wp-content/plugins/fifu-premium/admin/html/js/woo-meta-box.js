function wcRemoveImage(i) {
    var inputUrl = "#fifu_input_url_" + i;
    var button = "#fifu_button_" + i;
    var image = "#fifu_image_" + i;
    var inputAlt = "#fifu_input_alt_" + i;
    var link = "#fifu_link_" + i;

    jQuery(inputAlt).hide();
    jQuery(image).hide();
    jQuery(link).hide();

    jQuery(inputAlt).val("");
    jQuery(inputUrl).val("");

    jQuery(inputUrl).show();
    jQuery(button).show();
}

function wcPreviewImage(i) {
    var inputUrl = "#fifu_input_url_" + i;
    var button = "#fifu_button_" + i;
    var image = "#fifu_image_" + i;
    var inputAlt = "#fifu_input_alt_" + i;
    var link = "#fifu_link_" + i;

    var $url = jQuery(inputUrl).val();
    $url = fifu_convert($url);

    if ($url) {
        jQuery(inputUrl).hide();
        jQuery(button).hide();

        jQuery(image).css('background-image', "url('" + $url + "')");

        jQuery(inputAlt).show();
        jQuery(image).show();
        jQuery(link).show();
    }
}

jQuery(document).ready(function () {
    jQuery("div#wooGalleryMetaBox").find('h2').replaceWith('<h4 style="top:5px;position:relative;"><span class="dashicons dashicons-format-gallery" style="font-size:15px"></span>' + jQuery("div#wooGalleryMetaBox").find('h2').text() + '</h4>');
});

function fifu_woo_get_sizes(i) {
    url = jQuery('input[id^=fifu_input_url_' + i + ']').val();
    fifu_woo_get_image(url, i);
}

function fifu_woo_get_image(url, i) {
    var image = new Image();
    jQuery(image).attr('onload', 'fifu_woo_store_sizes(this,' + i + ');');
    jQuery(image).attr('src', url);
}

function fifu_woo_store_sizes($, i) {
    jQuery("#fifu_input_width_" + i).val($.naturalWidth);
    jQuery("#fifu_input_height_" + i).val($.naturalHeight);
}
