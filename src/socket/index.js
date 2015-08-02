'use strict';

var domain = require('domain');
var socketIO = require('socket.io');

var EVENTS = {
    PARTIAL_MAP: 'PARTIAL_MAP',
    MAP: 'MAP',
    MAP_UPDATED: 'MAP_UPDATED'
};

function handler(server, worldInstance) {
    var io;

    // TODO: except for who caused this trigger
    function broadcastMapUpdatedEventExceptForSender(socket) {
        socket.broadcast.emit(EVENTS.MAP_UPDATED, worldInstance.getMap());
    }

    function onGetMap(socket) {
        var map = worldInstance.getMap();
        socket.emit(EVENTS.MAP, map);
    }

    function onGetPartialMap(socket, bounds) {
        var partialMap;
        try {
            partialMap = worldInstance.getPartialMap(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
            socket.emit(EVENTS.PARTIAL_MAP, partialMap);
            broadcastMapUpdatedEventExceptForSender(socket);
        } catch (error) {
            console.error(error);
        }
    }

    function onUserDisconnected() {
        console.log('user disconnected');
    }

    function onErrorHandler(socket, error) {
        console.log(arguments);
        console.error(error);
    }

    function connectionHandler(socket) {
        console.log('user connected');
        var mDomain = domain.create();
        mDomain.add(socket);
        mDomain.on('error', function () {
            console.log('domain error', arguments);
        });

        socket.on(EVENTS.MAP, onGetMap.bind(null, socket));
        socket.on(EVENTS.PARTIAL_MAP, onGetPartialMap.bind(null, socket));
        socket.on('disconnect', onUserDisconnected);
        socket.on('error', onErrorHandler.bind(null, socket))
    }

    io = socketIO(server);
    io.on('connection', connectionHandler);

    return io;
}

module.exports = handler;
