'use strict';

var socketIO = require('socket.io');

var EVENTS = {
    PARTIAL_MAP: 'PARTIAL_MAP',
    MAP: 'MAP',
    MAP_UPDATED: 'MAP_UPDATED'
};

function handler (server, worldInstance) {
    var io;

    function broadcastMapUpdatedEvent() {
        io.emit(EVENTS.MAP_UPDATED, worldInstance.getMap());
    }

    function onGetMap(socket) {
        var map = worldInstance.getMap();

        socket.emit(EVENTS.MAP, map);
        broadcastMapUpdatedEvent();
    }

    function onGetPartialMap(socket, bounds) {
        var partialMap = worldInstance.getPartialMap(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);

        socket.emit(EVENTS.PARTIAL_MAP, partialMap);
        broadcastMapUpdatedEvent();
    }

    function onUserDisconnected() {
        console.log('user disconnected');
    }

    function connectionHandler(socket) {
        console.log('user connected');
        socket.on(EVENTS.MAP, onGetMap.bind(null, socket));
        socket.on(EVENTS.PARTIAL_MAP, onGetPartialMap.bind(null, socket));
        socket.on('disconnect', onUserDisconnected);
    }

    io = socketIO(server);
    io.on('connection', connectionHandler);

    return io;
}

module.exports = handler;
