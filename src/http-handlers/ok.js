'use strict';

var HANDLER_MESSAGE = 'Hello blocker';

/**
 * @function handler
 * @description Simple handler to respond `'Hello blocker'` with success to requests
 *
 * @param  {Object} req http request obejct
 * @param  {Object} res http response object
 */
function handler(req, res) {
    res.writeHead(200);
    res.end(HANDLER_MESSAGE);
}

module.exports = handler;
