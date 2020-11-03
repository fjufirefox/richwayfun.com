function sliderRemoveImage(i) {
    var inputUrl = "#fifu_slider_input_url_" + i;
    var button = "#fifu_slider_button_" + i;
    var image = "#fifu_slider_image_" + i;
    var inputAlt = "#fifu_slider_input_alt_" + i;
    var link = "#fifu_slider_link_" + i;

    jQuery(inputAlt).hide();
    jQuery(image).hide();
    jQuery(link).hide();

    jQuery(inputAlt).val("");
    jQuery(inputUrl).val("");

    jQuery(inputUrl).show();
    jQuery(button).show();
}

function sliderPreviewImage(i) {
    var inputUrl = "#fifu_slider_input_url_" + i;
    var button = "#fifu_slider_button_" + i;
    var image = "#fifu_slider_image_" + i;
    var inputAlt = "#fifu_slider_input_alt_" + i;
    var link = "#fifu_slider_link_" + i;

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
    jQuery("div#wooSliderImageUrlMetaBox").find('h2').replaceWith('<h4 style="top:5px;position:relative;"><span class="dashicons dashicons-images-alt2" style="font-size:15px"></span>' + jQuery("div#wooSliderImageUrlMetaBox").find('h2').text() + '</h4>');
    jQuery("div#sliderImageUrlMetaBox").find('h2').replaceWith('<h4 style="top:7px;position:relative;"><span class="dashicons dashicons-images-alt2" style="font-size:15px"></span>' + jQuery("div#sliderImageUrlMetaBox").find('h2').text() + '</h4>');
});

function fifu_slider_get_sizes(i) {
    slider_url = jQuery('input[id^=fifu_slider_input_url_' + i + ']').val();
    fifu_slider_get_image(slider_url, i);
}

function fifu_slider_get_image(url, i) {
    var image = new Image();
    jQuery(image).attr('onload', 'fifu_slider_store_sizes(this,' + i + ');');
    jQuery(image).attr('src', url);
}

function fifu_slider_store_sizes($, i) {
    jQuery("#fifu_slider_input_width_" + i).val($.naturalWidth);
    jQuery("#fifu_slider_input_height_" + i).val($.naturalHeight);
}
