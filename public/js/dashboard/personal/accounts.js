$(document).ready(function () {
    // Form Validation
    var form_per_acc_edit = '#form-per-acc-edit';

    $(form_per_acc_edit).validate({
        rules: {
            'per-acc-bank': 'required',
            'per-acc-name': 'required'
        }
    });
});