Backbone.Model.prototype.idAttribute = '_id';

var PerBudgetFilterCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/dashboard/personal/budget/api',
    budget_filter: function (acc, month, year) {
        var budget_by_date = this.toJSON()[0].budget_data,
            self = this;

        async.waterfall([
            // Filter Account
                function (callback) {
                    if (acc == false) {
                        callback(null, budget_by_date);
                    } else {
                        var acc_filtered = [];
                        _.each(budget_by_date, function (each_period) {
                            var filtered_budget = _.filter(each_period.budget, function (each_budget) {
                                if (acc == false) {
                                    return each_budget
                                } else if (acc === 'All') {
                                    return each_budget.account === null;
                                } else {
                                    return each_budget.account !== null && each_budget.account._id === acc;
                                }
                            });
                            if (filtered_budget != false) {
                                acc_filtered.push({period: each_period.period, budget: filtered_budget});
                            }
                        });
                        callback(null, acc_filtered);
                    }
                },
            // Filter Month
                function (acc_filtered, callback) {
                    if (month == false || acc_filtered == false) {
                        callback(null, acc_filtered);
                    } else {
                        var month_filtered = [];
                        _.each(acc_filtered, function (each_budget) {
                            var budget_month = each_budget.period.split(" ")[0];
                            if (budget_month === month) {
                                month_filtered.push({period: each_budget.period, budget: each_budget.budget});
                            }
                        });
                        callback(null, month_filtered);
                    }
                },
            // Filter Year
                function (month_filtered, callback) {
                    if (year == false || month_filtered == false) {
                        callback(null, month_filtered);
                    } else {
                        var year_filtered = [];
                        _.each(month_filtered, function (each_budget) {
                            var budget_year = each_budget.period.split(" ")[1];
                            if (budget_year === year) {
                                year_filtered.push({period: each_budget.period, budget: each_budget.budget});
                            }
                        });
                        callback(null, year_filtered);
                    }
                },
                function (year_filtered, callback) {
                    var surplus = 0,
                        remaining_budget = {};

                    if (year_filtered == false) {
                        callback(null, year_filtered, remaining_budget)
                    } else {
                        _.each(year_filtered, function (each_period) {
                            _.each(each_period.budget, function (each_budget) {
                                surplus += parseFloat(each_budget.remained.replace(",", ""));
                            })
                        });
                        if (surplus > 0) {
                            remaining_budget.type = 'Income'
                        } else if (surplus < 0) {
                            remaining_budget.type = 'Expense'
                        }
                        remaining_budget.surplus = parseFloat(surplus).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                        callback(null, year_filtered, remaining_budget);
                    }
                }
            ],
            function (err, all_filtered, remaining_budget) {
                self.models[0].attributes.budget_data = all_filtered;
                self.models[0].attributes.remaining_budget = remaining_budget;
                return self;
            }
        )
    }
});
var budget_filter_collection = new PerBudgetFilterCollection();


var PerBudgetFilterView = Backbone.View.extend({
    budget_collection: budget_filter_collection,
    el: $('#budget-list-tab'),
    initialize: function () {
        var self = this;
        this.filter_template = _.template($('#PerBudgetFilterTemplate').html());
        this.filtrate_template = _.template($('#PerBudgetFiltrateTemplate').html());
        this.budget_collection.fetch().done(function () {
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
        var html = this.filtrate_template({data: this.budget_collection.toJSON()[0]});
        this.$el.append(html);
        return this;
    },
    events: {
        'change .input-group-field' : 'budget_filter'
    },
    budget_filter: function () {
        var self = this,
            filter_acc = $('[name=budget-filter-acc]').val(),
            filter_month = $('[name=budget-filter-month]').val(),
            filter_year = $('[name=budget-filter-year]').val();

        this.$('#per_budget_filtrate').remove();
        this.budget_collection.fetch().done(function () {
            self.renderList(self.budget_collection.budget_filter(filter_acc, filter_month, filter_year));
        });
    }
});
var budget_filter_view = new PerBudgetFilterView();


$(document).ready(function () {
    var budget_table = '#budget-table';
    $(budget_table).dataTable();
});