'use strict';

var blocker = require('./../src/index.js');

var worldConfiguration1 = require('./../examples/worlds/case-study.json');
var worldInstance1 = blocker.generator.parse(worldConfiguration1);
var server1 = blocker.createServer(1337, worldInstance1);

var worldConfiguration2 = require('./../examples/worlds/report-example4.json');
var worldInstance2 = blocker.generator.parse(worldConfiguration2);
var server2 = blocker.createServer(999, worldInstance2);

console.log('server1', server1);
console.log('server2', server2);
