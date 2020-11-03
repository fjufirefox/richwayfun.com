function removeShortcode() {
    jQuery("#fifu_shortcode").hide();
    jQuery("#fifu_shortcode_link").hide();

    jQuery("#fifu_shortcode_input").val("");
}

jQuery(document).ready(function () {
    jQuery("div#shortCodeMetaBox").find('h2').replaceWith('<h4 style="top:7px;position:relative;">' + jQuery("div#shortCodeMetaBox").find('h2').text() + '</h4>');
});