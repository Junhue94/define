$(document).ready(function () {
    // Expenditure by Date
    var exp_by_date = c3.generate({
        bindto: '#exp-date-linechart',
        padding: {
            right: 50
        },
        data: {
            x: 'date',
            xFormat: '%Y-%m-%d',
            columns: [
                ['date', '2012-12-01', '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01'],
                ['Income', 3000, 3100, 3200, 3200, 3200, 3300],
                ['Expense', 1500, 1800, 2000, 1500, 2200, 1700],
                ['Balance', 1500, 1300, 1200, 1700, 1000, 1600]
            ]
        },
        color: {
            pattern: ['#05c700', '#dc1000', '#0013dc']
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%m-%Y'
                },
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


    // Income by Category
    var income_by_category_donut = c3.generate({
        bindto: '#in-cat-donutchart',
        data: {
            // iris data from R
            columns: [
                ['Salary', 3000],
                ['Rental', 120],
                ['Oil Palm', 300]
            ],
            type : 'donut'
        },
        legend: {
            position: 'right'
        }
    });

    var income_by_category_stacked = c3.generate({
        bindto: '#in-cat-stackedchart',
        padding: {
            right: 50
        },
        data: {
            x: 'date',
            columns: [
                ['date', 'Dec 12', 'Jan 13', 'Feb 13', 'Mar 13', 'Apr 13', 'May 13'],
                ['Salary', 2000, 2100, 2200, 2400, 2400, 2500],
                ['Rental', 800, 800, 800, 850, 850, 850],
                ['Oil Palm', 100, 200, 300, 600, 250, 350]
            ],
            type: 'bar',
            groups: [
                ['Salary', 'Rental', 'Oil Palm']
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


    // Expense by Category
    var expense_by_category = c3.generate({
        bindto: '#exp-cat-donutchart',
        data: {
            // iris data from R
            columns: [
                ['Groceries', 30],
                ['Transport', 120],
                ['Food', 300],
                ['Cloth', 40]
            ],
            type : 'donut'
        },
        legend: {
            position: 'right'
        }
    });

    var expense_by_category_stacked = c3.generate({
        bindto: '#exp-cat-stackedchart',
        padding: {
            right: 50
        },
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
    var acc_bal_chart = c3.generate({
        bindto: '#acc-bal-linechart',
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
        }
    });
});