#!/usr/bin/env node

'use strict';
var Config = require('./sConf'),
    Solus = require('./');

Solus.setConfig(Config);
var nodeID = 111;
Solus.NodeIDs('openvz', function(e, nodes) {
    if (e) throw e;
    console.log('nodes', nodes);
});
Solus.NodeNames('openvz', function(e, names) {
    if (e) throw e;
    console.log('node names', names);
});
Solus.NodeVMs(nodeID, function(e, vms) {
    if (e) throw e;
    console.log('nodeID', nodeID, 'vms', vms);
});