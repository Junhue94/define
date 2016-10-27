
// Routes Connections
module.exports = function (app, io) {
    // Routes Variables
    var webpage = require('../routes/webpage')(io);
    var dashboard = require('../routes/dashboard')(io);
    var dashboard_post = require('../routes/dashboard_post')(io);

    app.use('/', webpage);
    app.use('/dashboard', dashboard);
    app.use('/dashboard_post', dashboard_post);
};
