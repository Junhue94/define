var _ = require('underscore');
var moment = require('moment');

module.exports = {
    get_all_per_acc_name: function (per_acc_data) {
        var acc_list = [];

        _.each(per_acc_data, function (each_acc) {
            var acc_name = each_acc.bank + ' - ' + each_acc.name;
            acc_list.push({id: each_acc._id, acc_name: acc_name});
        });
        return acc_list;
    },

    categorize_per_acc_by_bank: function (per_acc_data, per_txn_data) {
        var acc_list = [];

        _.each(per_acc_data, function (each_acc) {
            var bank = _.findWhere(acc_list, {bank: each_acc.bank}),
                acc_txn = [],
                acc_bal = 0;

            // Filter Txn for each acc
            _.each(per_txn_data, function (each_txn) {
                if (_.isEqual(each_txn.account._id, each_acc._id)) {
                    acc_txn.push(each_txn);
                }
            });

            // Calculate Bal for each acc
            _.each(acc_txn, function (each_txn) {
                if (each_txn.type === 'Expense') {
                    acc_bal -= parseFloat(each_txn.amount.value);
                } else {
                    acc_bal += parseFloat(each_txn.amount.value);
                }
            });
            acc_bal = parseFloat(acc_bal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Organize Data Format
            if ((acc_list == false) || (bank == undefined)) {
                acc_list.push({
                    bank: each_acc.bank,
                    account: [{
                        id: each_acc._id,
                        bank: each_acc.bank,
                        name: each_acc.name,
                        balance: acc_bal
                    }]
                });
            } else {
                bank.account.push({
                    id: each_acc._id,
                    bank: each_acc.bank,
                    name: each_acc.name,
                    balance: acc_bal
                });
            }
        });
        return acc_list;
    },

    table_data_per_txn: function (per_txn_data) {
        _.each(per_txn_data, function (each_txn) {
            each_txn.date_moment = moment(each_txn.date).format("DD MMM YYYY");
        });

        return per_txn_data;
    },

    categorize_per_txn_by_date: function (per_txn_data) {
        var unique_dates = [];
        _.each(per_txn_data, function (each_txn) {
            var date_header = moment(each_txn.date).format('DD MMM YYYY'),
                date = _.findWhere(unique_dates, {date: date_header});

            each_txn.date_form = moment(each_txn.date).format('DD-MM-YYYY');
            each_txn.account.acc_name = each_txn.account.bank + ' - ' + each_txn.account.name;
            each_txn.amount = parseFloat(each_txn.amount.value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            if ((unique_dates == false) || (date == undefined)) {
                unique_dates.push({date: date_header, txn: [each_txn]});
            } else {
                date.txn.push(each_txn);
            }
        });
        return unique_dates;
    },

    closing_bal_per_txn: function (per_txn_data) {
        var balance = 0;
        var closing_bal = {};
        _.each(per_txn_data, function (each_txn) {
            if (each_txn.type == 'Income') {
                balance += parseFloat(each_txn.amount.value);
            } else {
                balance -= parseFloat(each_txn.amount.value);
            }
        });
        if (balance >= 0) {
            closing_bal.type = 'Income'
        } else if (balance < 0) {
            closing_bal.type = 'Expense'
        }

        closing_bal.balance = parseFloat(balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return closing_bal
    },

    table_data_per_budget: function (per_budget_data) {
        _.each(per_budget_data, function (each_budget) {
            each_budget.period_moment = moment(each_budget.period).format("MMM YYYY");
        });
        return per_budget_data;
    },

    update_per_budget: function (per_budget_data, per_txn_data) {
        var per_txn_exp = _.where(per_txn_data, {type: 'Expense'});

        _.each(per_budget_data, function (each_budget) {
            var spent = 0,
                allocated = parseFloat(each_budget.allocated.value);

            var txn_for_budget = _.filter(per_txn_exp, function (each_txn) {
                var filter_account = function () {
                    if (each_budget.account === null) {
                        return each_budget.account === each_txn.account
                    } else {
                        return each_txn.account._id.toString() === each_budget.account._id.toString();
                    }
                },
                    filter_category = each_txn.category === each_budget.category,
                    filter_date = moment(each_txn.date).format("MMM YYYY") === moment(each_budget.period).format("MMM YYYY");

                if (each_budget.category === 'All' && each_budget.account === null) {
                    return each_txn != false;
                } else if (each_budget.category === 'All' && each_budget.account) {
                    return filter_account && filter_date;
                } else if (each_budget.category !== 'All' && each_budget.account === null) {
                    return filter_category && filter_date;
                } else {
                    return filter_account && filter_category && filter_date;
                }
            });

            if (txn_for_budget != false) {
                _.each(txn_for_budget, function (each_txn_for_budget) {
                    spent += parseFloat(each_txn_for_budget.amount.value);
                });
            }
            each_budget.spent = parseFloat(spent).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            each_budget.remained = parseFloat(allocated - spent).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            if (parseFloat(allocated - spent) < 0) {
                each_budget.utilized = 100;
                each_budget.surplus_color = 'Expense';
            } else {
                each_budget.utilized = parseFloat(spent / allocated * 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                each_budget.surplus_color = 'Income';
            }
        });
        return per_budget_data;
    },

    categorize_per_budget_by_period: function (per_budget_data) {
        var unique_dates = [];
        _.each(per_budget_data, function (each_budget) {
            var period_header = moment(each_budget.period).format('MMM YYYY'),
                period = _.findWhere(unique_dates, {period: period_header});

            if (each_budget.account == null) {
                each_budget.acc_name = 'All Accounts';
            } else {
                each_budget.acc_name = each_budget.account.bank + ' - ' + each_budget.account.name;
            }

            if ((unique_dates == false) || (period == undefined)) {
                unique_dates.push({period: period_header, budget: [each_budget]});
            } else {
                period.budget.push(each_budget);
            }
        });
        return unique_dates;
    },

    remaining_budget: function (per_budget_data) {
        var balance = 0;
        var remaining_budget = {};

        _.each(per_budget_data, function (each_budget) {
            balance += parseFloat(each_budget.remained.value)
        });
        remaining_budget.surplus = parseFloat(balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (balance >= 0) {
            remaining_budget.type = 'Income'
        } else {
            remaining_budget.type = 'Expense'
        }

        return remaining_budget;
    }
};