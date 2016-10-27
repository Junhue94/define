var _ = require('underscore');

module.exports = {
    moment_yyyy_mm_dd: function (date_str) {
        var date_list = date_str.split("-");
        return date_list[2] + '-' + date_list[1] + '-' + date_list[0];
    }
};