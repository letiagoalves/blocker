'use strict';

var HANDLER_MESSAGE = 'Hello blocker';

function handler(req, res) {
    res.writeHead(200);
    res.end(HANDLER_MESSAGE);
}

module.exports = handler;
