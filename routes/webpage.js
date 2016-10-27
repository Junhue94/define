var express = require('express');
var router = express.Router();
var async = require('async');
var moment = require('moment');

// Models
var User = require('../models/user_model');


var returnRouter = function (io) {
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Define Lab',
            layout: 'webpageLayout'
        });
    });

    router.post('/user_register', function(req, res, next) {
        var username = req.body['username'],
            user_email = req.body['user_email'],
            user_password = req.body['password'],
            timestamp = moment();

        async.series([
                function (callback) {
                    var newUser = new User({
                        username: username,
                        email: user_email,
                        password: user_password,
                        user_type: 'free_user',
                        timestamp: timestamp
                    });
                    User.user_fn.createUser(newUser, function (err) {
                        callback(err);
                    })
                }
            ],
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/');
                }
            }
        );
    });

    return router;
};

module.exports = returnRouter;
