
// Routes Connections
module.exports = function (app, io) {
    // Routes Variables
    var index = require('../routes/index')(io);

    app.use('/', index);
};
