'use strict';

var blocker = require('./../src/index.js');
var worldConfiguration1 = require('./../examples/worlds/case-study.json');

var parser = blocker.generator.parser;
var worldInstance1 = parser.parse(worldConfiguration1);
var server1 = blocker.createServer(1337, worldInstance1);

var worldConfiguration2 = require('./../examples/worlds/report-example4.json');
var worldInstance2 = parser.parse(worldConfiguration2);
var server2 = blocker.createServer(999, worldInstance2);

console.log('server1', server1);
console.log('server2', server2);

function preProcessor(event, data) {
    var size;

    console.info('preProcessor', event);
    // I only care about PARTIAL_MAP event
    if (event !== 'PARTIAL_MAP') {
        return data;
    }

    size = 2;

    return {
        minX: data.x - size,
        minY: data.y - size,
        maxX: data.x + size,
        maxY: data.y + size
    };
}

server1.setPreProcessor(preProcessor);
server2.setPreProcessor(preProcessor);

server1.start();
server2.start();
