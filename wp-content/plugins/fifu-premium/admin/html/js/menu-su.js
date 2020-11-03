jQuery(function () {
    jQuery("#su-tabs").tabs();
});

var restUrl = fifu_get_rest_url();

function signUp() {
    var firstName = jQuery('#su_first_name').val();
    var lastName = jQuery('#su_last_name').val();
    var email = jQuery('#su_email').val();
    var site = jQuery('#su_site').val();

    if (!firstName || !lastName || !email || !site)
        return;

    var code = null;

    fifu_block();

    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/sign_up/',
        data: {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            code = data['code'];
            message(data);

            if (code > 0) {
                remove_sign_up();
                active_first_tab();
                enable_login();

                jQuery('#qrcode').children().remove();
                var qrcode = new QRCode(document.getElementById("qrcode"), {width: 150, height: 150});
                qrcode.makeCode('otpauth://totp/FIFU-Speed-Up:' + email + '?secret=' + data['qrcode'] + '&issuer=FIFU-Speed-Up');

                jQuery("#su_login_email").val(email);

                fifu_show_login();

                jQuery('#qrcode').show();
                jQuery('#qrcode-info-reset').hide();
                jQuery('#qrcode-info-signup').show();
            }
            fifu_unblock();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            fifu_unblock();
        }
    });
    return code;
}

function login() {
    var email = jQuery('#su_login_email').val();
    var site = jQuery('#su_login_site').val();
    var tfa = jQuery('#su_login_2fa').val();

    if (!email || !site)
        return;

    var code = null;

    fifu_block();

    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/login/',
        data: {
            "email": email,
            "tfa": tfa
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            code = data['code'];
            message(data);

            if (code > 0) {
                Cookies.set('fifu-tfa', data['fifu_tfa_hash']);

                jQuery("#tr_su_login_email").hide();
                jQuery("#tr_su_login_2fa").hide();
                jQuery("#tr_su_login_site").hide();
                jQuery("#su_login_button").hide();
                jQuery("#su_login_reset").hide();
                jQuery("#su_logout_button").show();

                jQuery('#qrcode').hide();
                jQuery('#qrcode-info-signup').hide();
                jQuery('#qrcode-info-reset').hide();

                // show tabs
                jQuery("#su-li-tabs-login").show();
                jQuery("#su-li-tabs-add").show();
                jQuery("#su-li-tabs-del").show();
            } else
                fifu_show_login();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
            fifu_unblock();
        }
    });
    return code;
}

function logout() {
    fifu_block();
    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/logout/',
        data: {
            "tfa": Cookies.get('fifu-tfa'),
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            code = data['code'];

            if (code == 8) {
                jQuery("#su_login_email").val('');
                fifu_show_login();
                // hide tabs
                jQuery("#su-li-tabs-login").hide();
                fifu_hide_edition_tabs();
            } else {
                jQuery("#tr_su_login_email").hide();
                jQuery("#tr_su_login_2fa").hide();
                jQuery("#tr_su_login_site").hide();
                jQuery("#su_login_button").hide();
                jQuery("#su_login_reset").hide();
                jQuery("#su_logout_button").show();
            }

            message(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
            fifu_unblock();
        }
    });
}

function check_connection() {
    fifu_block();
    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/connected/',
        data: {
            "tfa": Cookies.get('fifu-tfa'),
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            if (data == null || data['code'] == 0) {
                data = new Object();
                data['message'] = 'web service is down';
                data['color'] = 'red';
                message(data);

                jQuery('#su-tabs').tabs({disabled: [1, 2]});
                fifu_show_login();
                jQuery('#su_login_button').prop('disabled', true);
                jQuery('#su_login_reset').prop('disabled', true);

                fifu_unblock();
                return;
            } else {
                jQuery('#su-tabs').tabs({disabled: []});
                jQuery('#su_login_button').prop('disabled', false);
                jQuery('#su_login_reset').prop('disabled', false);
            }
            jQuery('#su-greybox').show();

            code = data['code'];

            jQuery("#qrcode").hide();
            jQuery("#qrcode-info-reset").hide();
            jQuery("#qrcode-info-signup").hide();

            if (code == 7) {
                jQuery("#tr_su_login_email").hide();
                jQuery("#tr_su_login_2fa").hide();
                jQuery("#tr_su_login_site").hide();
                jQuery("#su_login_button").hide();
                jQuery("#su_login_reset").hide();
                jQuery("#su_logout_button").show();
                data['message'] = 'connected';
            } else {
                fifu_show_login();
                // hide tabs
                jQuery("#su-li-tabs-sign-up").hide();
                jQuery("#su-li-tabs-login").hide();
                fifu_hide_edition_tabs();
                data['message'] = 'not connected';
            }

            message(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
            fifu_unblock();
        }
    });
}

function resetCredentials() {
    var email = jQuery('#su_login_email').val();
    var site = jQuery('#su_login_site').val();

    jQuery("#su_login_button").attr("disabled", false);
    jQuery("#su_login_2fa").attr("readonly", false);

    if (!email || !site)
        return;

    var code = null;

    fifu_block();

    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/reset_credentials/',
        data: {
            "email": email
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            code = data['code'];
            if (code > 0) {
                jQuery('#qrcode').children().remove();
                var qrcode = new QRCode(document.getElementById("qrcode"), {width: 150, height: 150});
                qrcode.makeCode('otpauth://totp/FIFU-Speed-Up:' + email + '?secret=' + data['qrcode'] + '&issuer=FIFU-Speed-Up');
                jQuery('#qrcode').show();
                jQuery('#qrcode-info-reset').show();
                jQuery('#qrcode-info-signup').hide();
                jQuery('#su_login_reset').hide();

                remove_sign_up();
                enable_login();
            }
            message(data);
            fifu_unblock();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            fifu_unblock();
        }
    });
    return code;
}

function listAllSu() {
    var table = jQuery('#removeTable').DataTable({
        "language": {"emptyTable": "No images available"},
        destroy: true,
        "columns": [{"width": "64px"}, {"width": "100%"}, {"width": "64px"}, {"width": "64px"}, {"width": "64px"}],
        "autoWidth": false,
        dom: 'lfrtBip',
        select: true,
        buttons: [
            {
                text: 'select all',
                titleAttr: '1,000 rows limit',
                action: function () {
                    total_rows = table.rows().count();
                    amount = total_rows < MAX_ROWS ? total_rows : MAX_ROWS;
                    table.rows({search: 'applied'}, [...Array(amount).keys()]).select();
                    if (table.rows({selected: true}).count() == 0)
                        table.rows([...Array(amount).keys()]).select();
                }
            },
            {
                text: 'select none',
                action: function () {
                    table.rows().deselect();
                }
            },
            {
                text: 'remove',
                action: function () {
                    jQuery("#su-dialog-remove").dialog("open");
                }
            },
        ]
    });

    table.clear();
    fifu_block();

    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/list_all_su/',
        data: {
            "tfa": Cookies.get('fifu-tfa'),
        },
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            code = data['code'];
            if (code > 0) {
                var bucket = data['bucket'];
                var post_data = data['post_data'];
                for (var i = 0; i < post_data.length; i++) {
                    var url = 'https://storage.googleapis.com/' + bucket + '/' + post_data[i]['storage_id'] + '/75.webp';
                    imgTag = '<img id="' + post_data[i]['storage_id'] + '" data-src="' + url + '" style="border-radius:5%; height:48px; width:64px; object-fit:cover; text-align:center">';
                    if (post_data[i]['title']) {
                        table.row.add([
                            imgTag,
                            post_data[i]['title'],
                            post_data[i]['date'],
                            post_data[i]['post_id'],
                            post_data[i]['meta_key'].includes('url_') ? 'gallery' : 'featured',
                            post_data[i]['storage_id'],
                            post_data[i]['meta_id'],
                            post_data[i]['meta_key'],
                        ]);
                    }
                }
                table.draw(true);
            } else {
                // not connected
                if (data['code'] == -20) {
                    message(data);
                    fifu_show_login();
                    fifu_hide_edition_tabs();
                    jQuery("#su-tabs").tabs("option", "active", 0);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
            fifu_unblock();
        }
    });

    jQuery("#su-dialog-remove").dialog({
        autoOpen: false,
        modal: true,
        width: "400px",
        buttons: {
            "Delete": function () {
                selected = table.rows({selected: true});
                count = selected.count();

                if (count == 0)
                    return;

                var arr = [];
                for (var i = 0; i < count; i++) {
                    data = selected.data()[i];
                    arr.push({
                        'post_id': data[3],
                        'storage_id': data[5],
                        'meta_id': data[6],
                        'meta_key': data[7],
                    });
                }
                fifu_block();
                jQuery(this).dialog("close");
                jQuery.ajax({
                    method: "POST",
                    url: restUrl + 'fifu-premium/v2/delete/',
                    data: {
                        "selected": arr,
                        "tfa": Cookies.get('fifu-tfa'),
                    },
                    async: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
                    },
                    success: function (data) {
                        table.rows().deselect();

                        // not connected
                        if (data['code'] == -20) {
                            message(data);
                            fifu_show_login();
                            fifu_hide_edition_tabs();
                            jQuery("#su-tabs").tabs("option", "active", 0);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                    complete: function (data) {
                        selected.remove().draw(false);
                        jQuery(window).lazyLoadXT();
                        fifu_unblock();
                    }
                });
            },
            Cancel: function () {
                jQuery(this).dialog("close");
            }
        }
    });

    // limit number of rows selected
    table.on('select', function (e, dt, type, ix) {
        var selected = dt.rows({selected: true});
        if (selected.count() > MAX_ROWS)
            dt.rows(ix).deselect();
    });

    jQuery('div#removeTable_filter label input').on('keyup', function () {
        jQuery(window).lazyLoadXT();
    });
}

jQuery(document).ready(function ($) {
    jQuery.extend(jQuery.lazyLoadXT, {
        srcAttr: 'data-src',
        visibleOnly: true,
        updateEvent: 'load orientationchange resize scroll touchmove focus hover'
    });
});
jQuery(window).on('ajaxComplete', function () {
    jQuery(window).lazyLoadXT();
});

jQuery(document).on("click", "a.paginate_button, select, th.sorting_asc, th.sorting_desc", function () {
    jQuery(window).lazyLoadXT();
});

jQuery(document).ready(function ($) {
    jQuery('#addTable tbody').on('click', 'tr', function () {
        jQuery(this).toggleClass('selected');
    });
});

const MAX_ROWS = 1000;
const MAX_ROWS_BY_REQUEST = MAX_ROWS / 10;

function listAllFifu() {
    var table = jQuery('#addTable').DataTable({
        "language": {"emptyTable": "No images available"},
        destroy: true,
        "columns": [{"width": "64px"}, {"width": "100%"}, {"width": "64px"}, {"width": "64px"}, {"width": "64px"}],
        "autoWidth": false,
        dom: 'lfrtBip',
        select: true,
        buttons: [
            {
                text: 'select all',
                titleAttr: '1,000 rows limit',
                action: function () {
                    total_rows = table.rows().count();
                    amount = total_rows < MAX_ROWS ? total_rows : MAX_ROWS;
                    table.rows({search: 'applied'}, [...Array(amount).keys()]).select();
                    if (table.rows({selected: true}).count() == 0)
                        table.rows([...Array(amount).keys()]).select();
                }
            },
            {
                text: 'select none',
                action: function () {
                    table.rows().deselect();
                }
            },
            {
                text: 'add',
                action: function () {
                    addSu(table);
                }
            },
        ]
    });
    table.clear();
    fifu_block();
    jQuery.ajax({
        method: "POST",
        url: restUrl + 'fifu-premium/v2/list_all_fifu/',
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
        },
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                imgTag = '<img id="' + data[i]['meta_id'] + '" data-src="' + data[i]['url'] + '" style="border-radius:5%; height:48px; width:64px; object-fit:cover; text-align:center">';
                table.row.add([
                    imgTag,
                    data[i]['post_title'],
                    data[i]['post_date'],
                    data[i]['post_id'],
                    data[i]['meta_key'].includes('url_') ? 'gallery' : 'featured',
                    data[i]['url'],
                    data[i]['meta_key'],
                    data[i]['meta_id']
                ]);
            }
            table.draw(true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        complete: function (data) {
            fifu_unblock();
        }
    });

    // limit number of rows selected
    table.on('select', function (e, dt, type, ix) {
        var selected = dt.rows({selected: true});
        if (selected.count() > MAX_ROWS)
            dt.rows(ix).deselect();
    });

    jQuery('div#addTable_filter label input').on('keyup', function () {
        jQuery(window).lazyLoadXT();
    });
}

async function addSu(table) {
    selected = table.rows({selected: true});
    count = selected.count();

    if (count == 0)
        return;

    fifu_block_progress();

    var arr = [];
    var finished = 0;
    for (var i = 0; i < count; i++) {
        data = selected.data()[i];
        arr.push([
            data[3], // post_id
            data[5], // url
            data[6], // meta_key
            data[7]  // meta_id
        ]);
        if (i + 1 == count || (i > 0 && i % MAX_ROWS_BY_REQUEST == 0)) {
            jQuery.ajax({
                method: "POST",
                url: restUrl + 'fifu-premium/v2/create_thumbnails_list/',
                data: {
                    "selected": arr,
                    "tfa": Cookies.get('fifu-tfa'),
                },
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', fifuScriptVars.nonce);
                },
                success: function (data) {
                    // not connected
                    if (data['code'] == -20) {
                        message(data);
                        fifu_show_login();
                        fifu_hide_edition_tabs();
                        jQuery("#su-tabs").tabs("option", "active", 0);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                complete: function (data) {
                    finished++;
                    progress = 100 * finished / (count / MAX_ROWS_BY_REQUEST);
                    jQuery('#progressBar').attr('value', progress);
                    jQuery('#progressBar').attr('text', progress);
                    if (finished >= count / MAX_ROWS_BY_REQUEST) {
                        selected.remove().draw(false);
                        jQuery(window).lazyLoadXT();
                        fifu_unblock();
                    }
                }
            });
            await sleep(2000);
            arr = [];
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function remove_sign_up() {
    jQuery("#su-tabs-sign-up").remove();
    jQuery("#su-li-tabs-sign-up").remove();
}

function disable_login() {
    jQuery("#su-tabs-login").hide();
}

function enable_login() {
    jQuery("#su-tabs-login").show();
}

function active_first_tab() {
    jQuery("#su-tabs").tabs("option", "active", 1);
}

function message(data) {
    jQuery("#su_response_message").css('background-color', data['color']);
    jQuery("#su_response_message").css('border-radius', '3px');
    jQuery("#su_response_message").css('padding', '6px');
    jQuery("#su_response_message").css('color', 'white');
    jQuery("#su_response_message").val(data['message']);
}

function confirmResetCredentials() {
    if (jQuery("#su_login_email").val())
        jQuery("#su-dialog-reset-credentials").dialog("open");
}

jQuery(function () {
    jQuery("#su-dialog-reset-credentials").dialog({
        autoOpen: false,
        modal: true,
        width: "300px",
        buttons: {
            OK: function () {
                resetCredentials();
                jQuery(this).dialog("close");
            },
            Cancel: function () {
                jQuery(this).dialog("close");
            }
        },
        open: function (event, ui) {
            jQuery(this).parent().find('.ui-dialog-titlebar').empty();
            jQuery(this).parent().find('.ui-dialog-titlebar').append('<i class="fa fa-exclamation-triangle"></i> Are you sure?');
            jQuery(this).parent().children().children('.ui-dialog-titlebar-close').hide();
        },
    });
});

function fifu_block() {
    jQuery('#tabs-top').block({message: 'Please wait some seconds...', css: {backgroundColor: 'none', border: 'none', color: 'white'}});
}

function fifu_block_progress() {
    jQuery('#tabs-top').block({message: '<progress id="progressBar" max="100" value="0" style="width:100%;height:32px;background-color:#23282d"></progress>', css: {backgroundColor: 'none', border: 'none', color: 'white'}});
}

function fifu_unblock() {
    jQuery('#tabs-top').unblock();
}

function fifu_show_login() {
    jQuery("#su_login_2fa").val('');
    jQuery("#tr_su_login_email").show();
    jQuery("#tr_su_login_2fa").show();
    jQuery("#tr_su_login_site").show();
    jQuery("#su_login_button").show();
    jQuery("#su_login_reset").show();
    jQuery("#su_logout_button").hide();
}

function fifu_hide_edition_tabs() {
    jQuery("#su-li-tabs-add").hide();
    jQuery("#su-li-tabs-del").hide();
}
