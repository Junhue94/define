var express = require('express');
var router = express.Router();
var async = require('async');
var moment = require('moment');

// Models
var Personal_Account = require('../models/per_acc_model');
var Personal_Txn = require('../models/per_txn_model');
var Personal_Budget = require('../models/per_budget_model');

// Utils
var utils_dateFormat = require('../utils/date_format');


var returnRouter = function (io) {
    router.post('/per_acc', function (req, res, next) {
        var bank = req.body['per-acc-bank'],
            name = req.body['per-acc-name'],
            timestamp = moment();

        async.series([
                function (callback) {
                    var newAcc = new Personal_Account({
                        bank: bank,
                        name: name,
                        balance: 0,
                        timestamp: timestamp
                    });

                    Personal_Account.per_acc_fn.createPerAcc(newAcc, function (err) {
                        callback(err);
                    });
                }
            ],
            // Callback
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/dashboard/personal/accounts');
                }
            }
        );
    });

    router.post('/per_acc/edit/:per_acc_id', function (req, res, next) {
        var per_acc_obj = {
            id: req.params.per_acc_id,
            bank: req.body['per-acc-bank'],
            name: req.body['per-acc-name']
        };

        Personal_Account.per_acc_fn.updatePerAcc(per_acc_obj, function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('/dashboard/personal/accounts');
            }
        })
    });

    router.post('/per_acc/del/:per_acc_id', function (req, res, next) {
        Personal_Account.per_acc_fn.removePerAcc(req.params.per_acc_id, function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('/dashboard/personal/accounts');
            }
        });
    });

    router.post('/per_txn', function (req, res, next) {
        var type = req.body['txn-type'],
            date = req.body['txn-date'],
            account_id = req.body['txn-account'],
            desc = req.body['txn-desc'],
            category = req.body['txn-cat'],
            category_others = req.body['txn-cat-others'],
            amount = parseFloat(req.body['txn-amount']).toFixed(2),
            recurring = req.body['txn-recurring'],
            recurring_freq = req.body['txn-recurring-freq'],
            recurring_start_date = req.body['txn-recurring-start-date'],
            recurring_no_of_pmt = req.body['txn-recurring-no-of-pmt'],
            pmt_mode = req.body['txn-pmt-mode'],
            pmt_mode_others = req.body['txn-pmt-mode-others'],
            payee = req.body['txn-payee'],
            reminder = req.body['txn-reminder'],
            status = req.body['txn-status'],
            timestamp = moment();

        async.series([
                function (callback) {
                    if (category_others) {
                        category = category_others;
                    }
                    if (pmt_mode_others) {
                        pmt_mode = pmt_mode_others;
                    }
                    if (desc == false) {
                        desc = category;
                    }
                    callback();
                },
                function (callback) {
                    var moment_date = moment(utils_dateFormat.moment_yyyy_mm_dd(date));

                    var newPerTxn = new Personal_Txn({
                        date: moment_date,
                        type: type,
                        account: account_id,
                        desc: desc,
                        category: category,
                        amount: amount,
                        recurring: {
                            option: recurring,
                            frequency: recurring_freq,
                            start_date: recurring_start_date,
                            no_of_pmt: recurring_no_of_pmt
                        },
                        pmt_mode: pmt_mode,
                        payee: payee,
                        reminder: reminder,
                        status: status,
                        timestamp: timestamp
                    });

                    Personal_Txn.per_txn_fn.createPerTxn(newPerTxn, function (err) {
                        callback(err);
                    });
                }
            ],
            // Callback
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/dashboard/personal/transactions')
                }
            }
        );
    });

    router.post('/per_txn/edit/:per_txn_id', function (req, res, next) {
        var category_others = req.body['txn-cat-others'],
            pmt_mode_others = req.body['txn-pmt-mode-others'];

        var per_txn_obj = {
            id: req.params.per_txn_id,
            type: req.body['txn-type'],
            account_id: req.body['txn-account'],
            desc: req.body['txn-desc'],
            category: req.body['txn-cat'],
            amount: parseFloat(req.body['txn-amount']).toFixed(2),
            recurring: req.body['txn-recurring'],
            recurring_freq: req.body['txn-recurring-freq'],
            recurring_start_date: req.body['txn-recurring-start-date'],
            recurring_no_of_pmt: req.body['txn-recurring-no-of-pmt'],
            pmt_mode: req.body['txn-pmt-mode'],
            payee: req.body['txn-payee'],
            reminder: req.body['txn-reminder'],
            status: req.body['txn-status']
        };

        async.series([
                function (callback) {
                    if (category_others) {
                        per_txn_obj.category = category_others;
                    }
                    if (pmt_mode_others) {
                        per_txn_obj.pmt_mode = pmt_mode_others;
                    }
                    if (per_txn_obj.desc == false) {
                        per_txn_obj.desc = per_txn_obj.category;
                    }
                    callback();
                },
                function (callback) {
                    Personal_Txn.per_txn_fn.updatePerTxn(per_txn_obj, function (err) {
                        callback(err);
                    });
                }
            ],
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/dashboard/personal/transactions');
                }
            }
        );
    });

    router.post('/per_txn/del/:per_txn_id', function (req, res, next) {
        Personal_Txn.per_txn_fn.removePerTxn(req.params.per_txn_id, function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('/dashboard/personal/transactions');
            }
        });
    });

    router.post('/per_budget', function (req, res , next) {
        var category = req.body['budget-cat'],
            account = typeof req.body['budget-account'] == 'string' ? null : req.body['budget-account'],
            period = req.body['budget-period'],
            amount = parseFloat(req.body['budget-amount']).toFixed(2),
            timestamp = moment();

        async.series([
                function (callback) {
                    var moment_period = moment(utils_dateFormat.moment_yyyy_mm_dd('01-' + period));

                    var newPerBudget = new Personal_Budget({
                        category: category,
                        account: account,
                        period: moment_period,
                        allocated: amount,
                        timestamp: timestamp
                    });
                    Personal_Budget.per_budget_fn.createPerBudget(newPerBudget, callback);
                }
            ],
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/dashboard/personal/budget')
                }
            }
        )
    });

    router.post('/per_budget/edit/:per_budget_id', function (req, res, next) {
        var category = req.body['budget-cat'],
            account = req.body['budget-account'] === 'All Accounts' ? null : req.body['budget-account'],
            period = req.body['budget-period'],
            amount = parseFloat(req.body['budget-amount']).toFixed(2);

        async.series([
                function (callback) {
                    var moment_period = moment(utils_dateFormat.moment_yyyy_mm_dd('01-' + period));
                    var per_budget_obj = {
                        id: req.params.per_budget_id,
                        category: category,
                        account: account,
                        period: moment_period,
                        allocated: amount
                    };
                    Personal_Budget.per_budget_fn.updatePerBudget(per_budget_obj, callback);
                }
            ],
            function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/dashboard/personal/budget')
                }
            }
        );
    });

    router.post('/per_budget/del/:per_budget_id', function (req, res, next) {
        Personal_Budget.per_budget_fn.removePerBudget(req.params.per_budget_id, function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('/dashboard/personal/budget');
            }
        });
    });

    return router;
};

module.exports = returnRouter;
