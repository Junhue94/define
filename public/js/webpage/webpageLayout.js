$(document).ready(function () {
    $.noConflict();
    // Variables
    var form_user_login = '#form_user_login',
        form_user_register = '#form_user_register';

    $(document).on('click', 'a', function () {
        // Validation
        $(form_user_login).validate({
            rules: {
                'user_email': 'required',
                'password': 'required'
            },
            submitHandler: function (form) {
                form.submit();
            }
        });

        $(form_user_register).validate({
            rules: {
                'username': 'required',
                'user_email': 'required',
                'password': {
                    required: true,
                    minlength: 6
                },
                'password_confirm': {
                    required: true,
                    minlength: 6,
                    equalTo: '#password'
                }
            },
            messages: {
                'password_confirm': {
                    equalTo: 'Password does not match'
                }
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
    });
});