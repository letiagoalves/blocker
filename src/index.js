'use strict';
//TODO: addr in use, error callack
var http = require('http');
var serverHandler = require('./server-handler.js');
var socketHandler = require('./socket');
var mapGenerator = require('rule-based-map-generator');

// TODO: doc
// TODO: assert arguments
function createServer(port, worldInstance) {
    var app = http.createServer(serverHandler);
    app.listen(port);

    if (!worldInstance.hasStarted()) {
        worldInstance.start();
    }
    socketHandler(app, worldInstance);

    function close () {
        app.close();
    }

    // public
    return {
        close: close
    };
}

module.exports = {
    createServer: createServer,
    generator: mapGenerator
};
