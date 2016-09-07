var express = require('express');
var router = express.Router();


var returnRouter = function (io) {
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Define Lab'
        });
    });

    return router;
};

module.exports = returnRouter;
