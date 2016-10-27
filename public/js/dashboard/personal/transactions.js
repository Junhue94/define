Backbone.Model.prototype.idAttribute = '_id';

var PerTxnFilterCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/dashboard/personal/transactions/api',
    txn_filter: function (period, acc, type, cat) {
        var txn_by_date = this.toJSON()[0].txn_data,
            self = this;

        function filterPeriodMonth(period_filtered, filter_month) {
            _.each(txn_by_date, function (each_date) {
                var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                    var txn_date = moment(each_txn.date);
                    return txn_date.isSame(filter_month, 'month') && txn_date.isSame(filter_month, 'year');
                });
                if (filtered_txn != false) {
                    period_filtered.push({date: each_date.date, txn: filtered_txn});
                }
            });
        }

        function filterPeriodDay(period_filtered, filter_day, current_date) {
            _.each(txn_by_date, function (each_date) {
                var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                    var txn_date = moment(each_txn.date);
                    return txn_date.isBetween(filter_day, current_date, null, '[]')
                });
                if (filtered_txn != false) {
                    period_filtered.push({date: each_date.date, txn: filtered_txn});
                }
            });
        }

        function filterYTD(period_filtered, current_date) {
            _.each(txn_by_date, function (each_date) {
                var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                    var txn_date = moment(each_txn.date);
                    return txn_date.isSame(current_date, 'year') && txn_date.isBefore(current_date);
                });
                if (filtered_txn != false) {
                    period_filtered.push({date: each_date.date, txn: filtered_txn});
                }
            });
        }

        function filterPastTxn(period_filtered, current_date) {
            _.each(txn_by_date, function (each_date) {
                var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                    var txn_date = moment(each_txn.date);
                    return txn_date.isBefore(current_date);
                });
                if (filtered_txn != false) {
                    period_filtered.push({date: each_date.date, txn: filtered_txn});
                }
            });
        }

        function filterPostDatedTxn(period_filtered, current_date) {
            _.each(txn_by_date, function (each_date) {
                var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                    var txn_date = moment(each_txn.date);
                    return txn_date.isAfter(current_date);
                });
                if (filtered_txn != false) {
                    period_filtered.push({date: each_date.date, txn: filtered_txn});
                }
            });
        }

        async.waterfall([
            // Filter Period
                function (callback) {
                    var period_filtered = [],
                        today = moment().endOf('day');

                    switch (period) {
                        case 'all_txns':
                            period_filtered = txn_by_date;
                            break;
                        case 'this_month':
                            filterPeriodMonth(period_filtered, today);
                            break;
                        case 'last_month':
                            var last_month = moment().subtract(1, 'months');
                            filterPeriodMonth(period_filtered, last_month);
                            break;
                        case 'next_month':
                            var next_month = moment().add(1, 'months');
                            filterPeriodMonth(period_filtered, next_month);
                            break;
                        case 'last_7_days':
                            var last_7_days = moment().subtract(6, 'days').startOf('day');
                            filterPeriodDay(period_filtered, last_7_days, today);
                            break;
                        case 'last_30_days':
                            var last_30_days = moment().subtract(29, 'days').startOf('day');
                            filterPeriodDay(period_filtered, last_30_days, today);
                            break;
                        case 'last_60_days':
                            var last_60_days = moment().subtract(59, 'days').startOf('day');
                            filterPeriodDay(period_filtered, last_60_days, today);
                            break;
                        case 'year_to_date':
                            filterYTD(period_filtered, today);
                            break;
                        case 'past_txns':
                            filterPastTxn(period_filtered, today);
                            break;
                        case 'post_dated_txns':
                            filterPostDatedTxn(period_filtered, today);
                            break;
                    }
                    callback(null, period_filtered);
                },
            // Filter Type
                function (period_filtered, callback) {
                    if (type == false || period_filtered == false) {
                        callback(null, period_filtered)
                    }
                    else {
                        var type_filtered = [];
                        _.each(period_filtered, function (each_date) {
                            var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                                return each_txn.type === type;
                            });
                            if (filtered_txn != false) {
                                type_filtered.push({date: each_date.date, txn: filtered_txn});
                            }
                        });
                        callback(null, type_filtered);
                    }
                },
            // Filter Account
                function (type_filtered, callback) {
                    if (acc == false || type_filtered == false) {
                        callback(null, type_filtered)
                    } else {
                        var acc_filtered = [];
                        _.each(type_filtered, function (each_date) {
                            var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                                return each_txn.account._id === acc;
                            });
                            if (filtered_txn != false) {
                                acc_filtered.push({date: each_date.date, txn: filtered_txn});
                            }
                        });
                        callback(null, acc_filtered);
                    }
                },
            // Filter Category
                function (acc_filtered, callback) {
                    if (cat == false || acc_filtered == false) {
                        callback(null, acc_filtered)
                    } else {
                        var cat_filtered = [];
                        _.each(acc_filtered, function (each_date) {
                            var filtered_txn = _.filter(each_date.txn, function (each_txn) {
                                return each_txn.category === cat;
                            });
                            if (filtered_txn != false) {
                                cat_filtered.push({date: each_date.date, txn: filtered_txn});
                            }
                        });
                        callback(null, cat_filtered);
                    }
                },
            // Closing balance
                function (cat_filtered, callback) {
                    var balance = 0,
                        closing_bal = {};

                    if (cat_filtered == false) {
                        callback(null, cat_filtered, closing_bal)
                    } else {
                        _.each(cat_filtered, function (each_date) {
                            _.each(each_date.txn, function (each_txn) {
                                if (each_txn.type == 'Income') {
                                    balance += parseFloat(each_txn.amount.replace(",", ""));
                                } else {
                                    balance -= parseFloat(each_txn.amount.replace(",", ""));
                                }
                            })
                        });
                        if (balance > 0) {
                            closing_bal.type = 'Income'
                        } else if (balance < 0) {
                            closing_bal.type = 'Expense'
                        }
                        closing_bal.balance = parseFloat(balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                        callback(null, cat_filtered, closing_bal);
                    }
                }
            ],
            function (err, all_filtered, closing_bal) {
                self.models[0].attributes.txn_data = all_filtered;
                self.models[0].attributes.closing_bal = closing_bal;
                return self;
            }
        );
    }
});
var txn_filter_collection = new PerTxnFilterCollection();

var PerTxnFilterView = Backbone.View.extend({
    txn_collection: txn_filter_collection,
    el: $('#txn-list-tab'),
    initialize: function () {
        var self = this;
        this.filter_template = _.template($('#PerTxnFilterTemplate').html());
        this.filtrate_template = _.template($('#PerTxnFiltrateTemplate').html());
        this.txn_collection.fetch().done(function () {
            self.render();
            self.renderList();
        });
    },
    render: function () {
        var html = this.filter_template();
        this.$el.html(html);
        return this;
    },
    renderList: function () {
        var html = this.filtrate_template({data: this.txn_collection.toJSON()[0]});
        this.$el.append(html);
        return this;
    },
    events: {
        'change .input-group-field' : 'txn_filter'
    },
    txn_filter: function () {
        var self = this,
            filter_acc = $('[name=txn-filter-acc]').val(),
            filter_type = $('[name=txn-filter-type]').val(),
            filter_period = $('[name=txn-filter-period]').val(),
            filter_cat = $('[name=txn-filter-cat]').val();
        this.$('#per_txn_filtrate').remove();
        this.txn_collection.fetch().done(function () {
            self.renderList(self.txn_collection.txn_filter(filter_period, filter_acc, filter_type, filter_cat));
        });
    }
});
var txn_filter_view = new PerTxnFilterView();

$(document).ready(function () {
    // Jquery DataTables
    var txn_table = '#txn-table';
    $(txn_table).dataTable();

    // Form Validation
    var form_per_txn_edit = '#form-per-txn-edit',
        txn_recurring = '#txn-recurring',
        option_txn_cat_other = '#option-txn-cat-other',
        option_txn_pmt_mode_other = '#option-txn-pmt-mode-other';

    $(form_per_txn_edit).validate({
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
        }
    });
});