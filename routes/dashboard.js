var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');
var moment = require('moment');

// Models
var Personal_Account = require('../models/per_acc_model');
var Personal_Txn = require('../models/per_txn_model');
var Personal_Budget= require('../models/per_budget_model');

// Utils
var utils_routes_dashboard = require('../utils/routes/dashboard');

var spaces = '\xa0\xa0/\xa0\xa0';

var returnRouter = function (io) {

    router.all('*',
        // All Personal Accounts
        function (req, res, next) {
            Personal_Account.per_acc_fn.getAllPerAcc(function (err, per_acc_data) {
                if (err) {
                    next(err);
                } else {
                    res.locals.all_per_acc_name = utils_routes_dashboard.get_all_per_acc_name(per_acc_data);
                    next();
                }
            });
        }
    );

    router.get('/', function(req, res, next) {
        res.render('dashboard/home', {
            page_title: 'Dashboard' + spaces + 'Home',
            layout: 'dashLayout'
        });
    });

    router.get('/personal/accounts', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Account.per_acc_fn.getAllPerAcc(function (err, per_acc_data) {
                        callback(err, per_acc_data);
                    });
                }, function (per_acc_data, callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        callback(err, per_acc_data, per_txn_data);
                    })
                }
            ],
            function (err, per_acc_data, per_txn_data) {
                if (err) {
                    next(err);
                } else {
                    var cat_acc_data = utils_routes_dashboard.categorize_per_acc_by_bank(per_acc_data, per_txn_data);
                    res.render('dashboard/personal/accounts', {
                        page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Accounts',
                        layout: 'dashLayout',
                        all_per_acc_name: res.locals.all_per_acc_name,
                        cat_acc_data: cat_acc_data
                    });
                }
            }
        );
    });

    router.get('/personal/transactions', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        per_txn_data = utils_routes_dashboard.table_data_per_txn(per_txn_data);
                        callback(err, per_txn_data);
                    });
                },
                function (per_txn_data, callback) {
                    var per_txn_data_by_date = utils_routes_dashboard.categorize_per_txn_by_date(per_txn_data);
                    callback(null, per_txn_data, per_txn_data_by_date);
                }
            ],
            function (err, per_txn_data, per_txn_data_by_date) {
                if (err) {
                    next(err);
                } else {
                    res.render('dashboard/personal/transactions', {
                        page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Transactions',
                        layout: 'dashLayout',
                        per_txn_data: per_txn_data,
                        per_txn_data_by_date: per_txn_data_by_date
                    });
                }
            }
        );
    });

    router.get('/personal/transactions/api', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        callback(err, per_txn_data);
                    });
                },
                function (per_txn_data, callback) {
                    var closing_bal = utils_routes_dashboard.closing_bal_per_txn(per_txn_data);
                    callback(null, per_txn_data, closing_bal)
                },
                function (per_txn_data, closing_bal, callback) {
                    var per_txn_data_by_date = utils_routes_dashboard.categorize_per_txn_by_date(per_txn_data);
                    callback(null, per_txn_data_by_date, closing_bal);
                }
            ],
            function (err, per_txn_data_by_date, closing_bal) {
                if (err) {
                    next(err);
                } else {
                    res.send({
                        txn_data: per_txn_data_by_date,
                        closing_bal: closing_bal
                    });
                }
            }
        );
    });

    router.get('/personal/budget', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Budget.per_budget_fn.getAllPerBudget(function (err, per_budget_data) {
                        per_budget_data = utils_routes_dashboard.table_data_per_budget(per_budget_data);
                        callback(err, per_budget_data);
                    });
                },
                function (per_budget_data, callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        callback(err, per_budget_data, per_txn_data);
                    })
                },
                function (per_budget_data, per_txn_data, callback) {
                    var per_budget_data_update = utils_routes_dashboard.update_per_budget(per_budget_data, per_txn_data);
                    var per_budget_data_by_period = utils_routes_dashboard.categorize_per_budget_by_period(per_budget_data_update);
                    callback(null, per_budget_data_update, per_budget_data_by_period);
                }
            ],
            function (err, per_budget_data, per_budget_data_by_period) {
                if (err) {
                    next(err);
                } else {
                    res.render('dashboard/personal/budget', {
                        page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Budget',
                        layout: 'dashLayout',
                        per_budget_data: per_budget_data,
                        per_budget_data_by_period: per_budget_data_by_period
                    });
                }
            }
        );
    });

    router.get('/personal/budget/api', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Budget.per_budget_fn.getAllPerBudget(function (err, per_budget_data) {
                        callback(err, per_budget_data);
                    });
                },
                function (per_budget_data, callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        callback(err, per_budget_data, per_txn_data);
                    })
                },
                function (per_budget_data, per_txn_data, callback) {
                    var per_budget_data_update = utils_routes_dashboard.update_per_budget(per_budget_data, per_txn_data);
                    callback(null, per_budget_data_update)
                },
                function (per_budget_data_update, callback) {
                    var remaining_budget = utils_routes_dashboard.remaining_budget(per_budget_data_update);
                    callback(null, per_budget_data_update, remaining_budget)
                },
                function (per_budget_data_update, remaining_budget, callback) {
                    var per_budget_data_by_period = utils_routes_dashboard.categorize_per_budget_by_period(per_budget_data_update);
                    callback(null, per_budget_data_by_period, remaining_budget)
                }
            ],
            function (err, per_budget_data_by_period, remaining_budget) {
                if (err) {
                    next(err);
                } else {
                    res.send({
                        budget_data: per_budget_data_by_period,
                        remaining_budget: remaining_budget
                    });
                }
            }
        );
    });

    router.get('/personal/debt', function (req, res, next) {
        res.render('dashboard/personal/debt', {
            page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Debt',
            layout: 'dashLayout'
        });
    });

    router.get('/personal/trends', function (req, res, next) {
        res.render('dashboard/personal/trends', {
            page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Trends',
            layout: 'dashLayout'
        });
    });


    router.get('/investment/portfolio', function (req, res, next) {
        async.waterfall([
                function (callback) {
                    Personal_Txn.per_txn_fn.getAllPerTxn(function (err, per_txn_data) {
                        callback(err, per_txn_data);
                    });
                },
                function (per_txn_data, callback) {
                    var per_txn_data_by_date = utils_routes_dashboard.categorize_per_txn_by_date(per_txn_data);
                    callback(null, per_txn_data, per_txn_data_by_date);
                }
            ],
            function (err, per_txn_data, per_txn_data_by_date) {
                if (err) {
                    next(err);
                } else {
                    res.render('dashboard/investment/portfolio', {
                        page_title: 'Dashboard' + spaces + 'Personal' + spaces + 'Portfolio',
                        layout: 'dashLayout',
                        per_txn_data: per_txn_data,
                        per_txn_data_by_date: per_txn_data_by_date
                    });
                }
            }
        );
        res.render('dashboard/investment/portfolio', {
            page_title: 'Dashboard' + spaces + 'Investment' + spaces + 'Portfolio',
            layout: 'dashLayout'
        });
    });

    return router;
};

module.exports = returnRouter;
