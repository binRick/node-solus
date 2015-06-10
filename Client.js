#!/usr/bin/env node

'use strict';
var Config = require('./sConf'),
    Solus = require('./');

Solus.setConfig(Config);
var nodeID = 111;
var Client = {
    firstname: 'tRick',
    lastname: 'rBl',
    company: 'tComp',
    username: 'rtUser1',
    email: 'asdasd@asdsad.com',
    //password: 'as08dya97sdyt23',//If not specified, 10 char random and returned on response as password key
};

Solus.CreateClient(Client, function(e, Client) {
    if (e) throw e;
    console.log('Client', Client);
});
/*
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
*/
