'use strict';

var domain = require('domain');
var socketIO = require('socket.io');

var EVENTS = {
    PARTIAL_MAP: 'PARTIAL_MAP',
    MAP: 'MAP',
    MAP_UPDATED: 'MAP_UPDATED'
};

/**
 * @function handler
 * @description Server handler using SocketIO
 *
 * @param  {Object}   server          Http server
 * @param  {Object}   worldInstance   rule-based-map-generator world instance
 * @param  {Function} preProcessorFn  Function to process received events
 * @param  {Function} postProcessorFn Function to process emmited events
 *
 * @return {Object} SocketIO object
 */
function handler(server, worldInstance, preProcessorFn, postProcessorFn) {
    var io;

    function broadcastMapUpdatedEventExceptForSender(socket) {
        var map = worldInstance.getMap();
        var dataToSend = postProcessorFn(EVENTS.MAP_UPDATED, map);
        socket.broadcast.emit(EVENTS.MAP_UPDATED, dataToSend);
    }

    function onGetMap(socket) {
        var map;
        var dataToSend;

        preProcessorFn(EVENTS.MAP);

        map = worldInstance.getMap();
        dataToSend = postProcessorFn(EVENTS.MAP, map);
        socket.emit(EVENTS.MAP, dataToSend);
    }

    function onGetPartialMap(socket, data) {
        var bounds = preProcessorFn(EVENTS.PARTIAL_MAP, data);
        var partialMap;
        var dataToSend;
        try {
            partialMap = worldInstance.getPartialMap(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
            dataToSend = postProcessorFn(EVENTS.PARTIAL_MAP, partialMap);
            socket.emit(EVENTS.PARTIAL_MAP, dataToSend);
            broadcastMapUpdatedEventExceptForSender(socket);
        } catch (error) {
            console.error(error);
        }
    }

    function onUserDisconnected() {
        console.log('user disconnected');
    }

    function onErrorHandler(socket, error) {
        console.error('onErrorHandler', error, error.stack);
    }

    function connectionHandler(socket) {
        var mDomain;

        console.log('user connected');
        mDomain = domain.create();
        mDomain.add(socket);
        mDomain.on('error', function () {
            console.log('domain error', arguments);
        });

        socket.on(EVENTS.MAP, onGetMap.bind(null, socket));
        socket.on(EVENTS.PARTIAL_MAP, onGetPartialMap.bind(null, socket));
        socket.on('disconnect', onUserDisconnected);
        socket.on('error', onErrorHandler.bind(null, socket));
    }

    io = socketIO(server);
    io.on('connection', connectionHandler);

    return io;
}

module.exports = handler;
