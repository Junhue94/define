var winston = require('winston');
var MongoDB = require('winston-mongodb');

var logger_prod = new (winston.Logger)({
    transports: [
        new(winston.transports.MongoDB)({
            level: 'warn',
            db : 'mongodb://jycircles:zx55878@ds019866.mlab.com:19866/define',
            collection: 'logs'
        }),
        new winston.transports.Console({
            level: 'warn',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger_prod;

// Morgan Logging - JSON Format
module.exports.stream = {
    write: function(message, encoding){
        logger_prod.warn(message);
    }
};