$(document).ready(function () {
    // Variables
    var form_per_acc = '#form-per-acc',
        form_per_txn = '#form-per-txn',
        form_per_budget = '#form-per-budget';

    var txn_recurring = '#txn-recurring',
        option_txn_cat_other = '#option-txn-cat-other',
        option_txn_pmt_mode_other = '#option-txn-pmt-mode-other';

    // Validation
    $(form_per_acc).validate({
        rules: {
            'per-acc-bank': 'required',
            'per-acc-name': 'required'
        },
        submitHandler: function (form) {
            form.submit();
        }
    });

    $(form_per_txn).validate({
        rules: {
            'txn-account': 'required',
            'txn-cat': 'required',
            'txn-cat-others': {
                required: option_txn_cat_other + ':selected'
            },
            'txn-amount': {
                required: true,
                number: true
            },
            'txn-recurring-freq': {
                required: txn_recurring + ':checked'
            },
            'txn-recurring-start-date': {
                required: txn_recurring + ':checked'
            },
            'txn-recurring-no-of-pmt': {
                required: txn_recurring + ':checked'
            },
            'txn-pmt-mode-others': {
                required: option_txn_pmt_mode_other + ':selected'
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });

    $(form_per_budget).validate({
        rules: {
            'budget-cat': 'required',
            'budget-account': 'required',
            'budget-period': 'required',
            'budget-amount': 'required'
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});
