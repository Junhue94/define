$(document).ready(function () {
    $.noConflict();

    // Sidebar Current Selected Menu List
    var sidebar_menu_li = '.sidebar-menu-li',
        sidebar_menu_li_dashboard = '#sidebar-menu-li-dashboard';

    function sidebar_menu_li_active() {
        var id = sessionStorage.getItem('sidebar-menu-li-id');
        if (id === null) {
            $(sidebar_menu_li_dashboard).addClass('sidebar-menu-active');
        } else {
            $('#' + id).addClass('sidebar-menu-active');
            $('#' + id + ' ul').addClass('is-active');
        }
    }
    sidebar_menu_li_active();

    $(sidebar_menu_li).on('click', function (e) {
        var new_id = e.currentTarget.id;
        sessionStorage.setItem('sidebar-menu-li-id', new_id);
    });

    // Initialize Foundation
    $(document).foundation();


    // Each Record View Toggle
    var data_open_all = 'div[data-open], tr[data-open]',
        data_open_actions_btn = 'a[data-open]',
        btn_del = '.color_del_btn',
        btn_cancel_del = '.btn-cancel-del',
        div_edit = '.div-edit',
        div_del = '.div-del';

    var txn_recurring = '[name = txn-recurring]',
        txn_recurring_input = '.txn-recurring-input';

    $(document).on('click', data_open_actions_btn + ', ' + txn_recurring, function () {
        if ($(this).is(':checked')) {
            if ($(this).val() === 'Yes') {
                $(txn_recurring_input).show();
            } else {
                $(txn_recurring_input).hide();
            }
        } else {
            $(txn_recurring_input).hide();
        }
    });

    $(document).on('click', data_open_all + ', ' + btn_cancel_del, function () {
        $(div_edit).show();
        $(div_del).hide();
        $(select_txn_cat_other).hide();
        $(select_txn_pmt_mode_other).hide();
    });

    $(document).on('click', btn_del, function () {
        $(div_edit).hide();
        $(div_del).show();
    });

    // Sidebar Height
    var content_div = '.content-div',
        sidebar_div = '.sidebar-div',
        sidebar_ul = '.sidebar-ul',
        actions_btn = '#actions-btn',
        actions_menu_list = '.actions-menu-list',
        off_canvas_wrapper = '.off-canvas-wrapper',
        off_canvas_wrapper_inner = '.off-canvas-wrapper-inner',
        content_header_div = '.content-header-div';

    function sidebar_height_adjustment() {
        setTimeout(function () {
            if (($(sidebar_div).height() > $(content_div).height()) && ($(sidebar_div).height() > $(sidebar_ul).height())) {
                $(sidebar_div).height($(window).height());
            }
            if (($(content_div).height() > $(sidebar_div).height()) && ($(content_div).height() > $(sidebar_ul).height())) {
                $(sidebar_div).height($(content_div).height());
            }
            if (($(sidebar_ul).height() > $(content_div).height()) && ($(sidebar_ul).height() > $(sidebar_div).height())) {
                $(sidebar_div).height($(sidebar_ul).height());
            }
        }, 100);
    }
    sidebar_height_adjustment();
    $(window).resize(sidebar_height_adjustment);
    $('a').on('click', sidebar_height_adjustment);

    $(actions_btn).on('click', function () {
        $(off_canvas_wrapper).height($(sidebar_div).height() - $(content_header_div).height());
        $(off_canvas_wrapper_inner).height($(sidebar_div).height() - $(content_header_div).height());
        $(actions_menu_list).height($(sidebar_div).height() - $(content_header_div).height());
    });


    // Add Info Toggle
    var select_txn_cat = '[name = txn-cat]',
        select_txn_cat_other = '[name = txn-cat-others]',
        select_txn_pmt_mode = '[name = txn-pmt-mode]',
        select_txn_pmt_mode_other = '[name = txn-pmt-mode-others]';

    $(document).on('click', data_open_actions_btn, function () {
        $(select_txn_cat_other).hide();
        $(select_txn_pmt_mode_other).hide();
    });

    function select_other(input, output, keyword) {
        $(document).on('change', input, function () {
            if ($(this).val() === keyword) {
                $(output).show();
            } else {
                $(output).hide();
            }
        });
    }

    select_other(select_txn_cat, select_txn_cat_other, 'Others');
    select_other(select_txn_pmt_mode, select_txn_pmt_mode_other, 'Others');


    // Date Picker
    var reveal_add_txn_date = '.reveal-add-txn-date',
        reveal_add_txn_date_start = '.reveal-add-txn-date-start',
        reveal_add_txn_reminder = '.reveal-add-txn-reminder',
        reveal_add_budget_period = '.reveal-add-budget-period',
        reveal_add_debt_due_date = '#reveal-add-debt-due-date';

    $(document).on('click', data_open_all + ', ' + data_open_actions_btn, function () {
        $(reveal_add_txn_date).fdatepicker({
            format: 'dd-mm-yyyy',
            disableDblClickSelection: true
        });
        $(reveal_add_txn_date_start).fdatepicker({
            format: 'dd-mm-yyyy',
            disableDblClickSelection: true
        });
        $(reveal_add_txn_reminder).fdatepicker({
            format: 'dd-mm-yyyy hh:ii',
            disableDblClickSelection: true,
            pickTime: true
        });
        $(reveal_add_budget_period).fdatepicker({
            format: 'mm-yyyy',
            startView: "year",
            minView: "year",
            disableDblClickSelection: true
        });
        $(reveal_add_debt_due_date).fdatepicker({
            format: 'dd-mm-yyyy',
            disableDblClickSelection: true
        });
    });
});