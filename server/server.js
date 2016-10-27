// CONFIGURATIONS

var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var path = require('path');
var morgan = require('morgan');  // For HTTP request logging
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');  // Handle only JSON and URL-encoded submission
var mongoose = require('mongoose');
var routes = require('./routes');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Set Environment
app.set('env', 'development');
//app.set('env', 'production');

// Database Connection
// Setup connection to database
require('mongoose-moment')(mongoose);
require('mongoose-double')(mongoose);
mongoose.Promise = global.Promise;
if (app.get('env') === 'development') {
    mongoose.connect('mongodb://localhost/define');
} else {
    mongoose.connect('mongodb://jycircles:zx55878@ds019866.mlab.com:19866/define');
}

// Test Database Connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection Error:'));
db.once('open', function() {
    console.log('Database Connection Successful')
});


// Path Settings
app.set('views', path.join(__dirname, '..', 'views'));


// Template / View Engine Setup
var main = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    // Define views directory
    layoutsDir: path.join(app.get('views'), 'layouts'),
    // Define partials directory
    partialsDir: [path.join(app.get('views'), 'partials')],
    helpers: {
        isEqualandResult: function (input, output, result_if, result_else) {
            if (input === output) {
                return result_if;
            } else {
                return result_else
            }
        }
    }
});

app.engine('hbs', main.engine);
app.set('view engine', 'hbs');


// Middleware
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon', 'logo.jpg')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/node_modules',  express.static(path.join(__dirname, '..', 'node_modules')));

// Logger
// If morgan is after static files, statics files won't be logged
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
} else {
    var logger_prod = require('../utils/logs/logger_prod');
    app.use(morgan('{' +
        '"remote_addr": ":remote-addr", ' +
        '"remote_user": ":remote-user", ' +
        '"date": ":date[web]", ' +
        '"method": ":method", ' +
        '"url": ":url", ' +
        '"http_version": ":http-version", ' +
        '"status": ":status", ' +
        '"result_length": ":res[content-length]", ' +
        '"referrer": ":referrer", ' +
        '"user_agent": ":user-agent", ' +
        '"response_time": ":response-time"}',
    {skip: function (req, res) { return res.statusCode < 400 }, "stream": logger_prod.stream}))
}

// Express Session
// Use cookies to keep track users. Thus, must be use after cookieParser
app.use(session({
    secret: 'definelab', // used to sign the session ID cookie
    saveUninitialized: true, // forces a session that is "uninitialized" to be saved to the store
    resave: true // forces the session to be saved back to the session store, even if the session was never modified during the request
}));

app.use(flash());

// Express Validator
// Validate input passed by the browser/client
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


// Global Vars
// This middleware will be executed for every request to the app
// Middleware mounted without a path will be executed for every request to the app
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // Put user into res.locals for easy access from templates
    res.locals.user = req.user || null;
    next();
});


// Run Routes
routes(app);

// Any GET request not already handled, use this route
// Error Handling
// Catch 404 and forward to Error Handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Development Error Handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);  // Sets the HTTP status for the response
        res.render('error_page', {
            message: err.message,
            error: err,
            layout: 'error_pageLayout'
        });
    });
}

// Production Error Handler
// No stack traces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error_page', {
        message: err.message,
        layout: 'error_pageLayout'
    });
});


// Server Connection
app.set('port', (process.env.PORT || 3000));

server.listen(app.get('port'), function () {
    console.log('Server up: http://localhost:' + app.get('port'));
});

