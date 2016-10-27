$(document).ready(function () {
    var daily_budget_1 = c3.generate({
        bindto: '#daily-budget-1',
        data: {
            columns: [
                ['All Expenses', 91.4]
            ],
            type: 'gauge'
        },
        color: {
            // the three color levels for the percentage values.
            pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        gauge: {
            label: {
                show: false
            }
        },
        tooltip: {
            show: false
        }
    });

    var daily_budget_2 = c3.generate({
        bindto: '#daily-budget-2',
        data: {
            columns: [
                ['Clothing', 10]
            ],
            type: 'gauge'
        },
        color: {
            // the three color levels for the percentage values.
            pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        gauge: {
            label: {
                show: false
            }
        },
        tooltip: {
            show: false
        }
    });

    var daily_budget_3 = c3.generate({
        bindto: '#daily-budget-3',
        data: {
            columns: [
                ['Groceries, Food', 77]
            ],
            type: 'gauge'
        },
        color: {
            // the three color levels for the percentage values.
            pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        gauge: {
            label: {
                show: false
            }
        },
        tooltip: {
            show: false
        }
    });

    var daily_budget_4 = c3.generate({
        bindto: '#daily-budget-4',
        data: {
            columns: [
                ['Recreation', 44]
            ],
            type: 'gauge'
        },
        color: {
            // the three color levels for the percentage values.
            pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        gauge: {
            label: {
                show: false
            }
        },
        tooltip: {
            show: false
        }
    });


    var dash_home_expense_chart = c3.generate({
        bindto: '#dash-home-expense-chart',
        data: {
            x: 'date',
            columns: [
                ['date', 'Dec 12', 'Jan 13', 'Feb 13', 'Mar 13', 'Apr 13', 'May 13'],
                ['Food', 1000, 1100, 1200, 1050, 1020, 1090],
                ['Clothing', 500, 100, 100, 210, 201, 140],
                ['Transport', 50, 200, 150, 60, 80, 100],
                ['Recreation', 0, 45, 23, 23, 34, 56]
            ],
            type: 'bar',
            groups: [
                ['Food', 'Clothing', 'Transport', 'Recreation']
            ]
        },
        bar: {
            width: {
                ratio: 0.9
            }
        },
        axis: {
            x: {
                type: 'category',
                label: {
                    text: 'Period',
                    position: 'outer-center'
                }
            },
            y: {
                label: {
                    text: 'Amount',
                    position: 'outer-middle'
                },
                tick: {
                    format: d3.format("$")
                }
            }
        }
    });

    // Account Balances
    var dash_home_account_chart = c3.generate({
        bindto: '#dash-home-account-chart',
        padding: {
            right: 50
        },
        data: {
            x: 'date',
            columns: [
                ['date', 'Dec 12', 'Jan 13', 'Feb 13', 'Mar 13', 'Apr 13', 'May 13'],
                ['SCB - 23-3232-232', 654, 562, 1312, 978, 111, 234],
                ['DBS - 43-4343-23', 544, 456, 112, 452, 123, 546],
                ['OCBC - 76-34343-3', 2312, 1111, 412, 2311, 74, 131],
                ['UOB - 76-34343-3', 67, 676, 33, 24, 656, 32],
                ['Maybank - 76-34343-3', 656, 565, 243, 454, 234, 343]
            ],
            type: 'bar',
            groups: [
                ['SCB - 23-3232-232', 'DBS - 43-4343-23', 'OCBC - 76-34343-3', 'UOB - 76-34343-3', 'Maybank - 76-34343-3']
            ]
        },
        axis: {
            x: {
                type: 'category',
                label: {
                    text: 'Period',
                    position: 'outer-center'
                }
            },
            y: {
                label: {
                    text: 'Amount',
                    position: 'outer-middle'
                },
                tick: {
                    format: d3.format("$")
                }
            }
        },
        bar: {
            width: {
                ratio: 0.9
            }
        }
    });
});