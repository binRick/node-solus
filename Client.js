#!/usr/bin/env node

'use strict';
var Config = require('./sConf'),
    Solus = require('./');

Solus.setConfig(Config);
var nodeID = 111;
var NodeGroup = '';
var Node = 'intrepid';
var Template = 'centos-6-x86_64';
//var Plan='default';

var Client = {
    firstname: 'tRick',
    lastname: 'rBl',
    company: 'tComp',
    username: 'rtUserRick',
    email: 'asdasd@asdsad.com',
    //password: 'as08dya97sdyt23',//If not specified, 10 char random and returned on response as password key
};
var VM = {
    type: 'openvz',
    node: Node,
    nodegroup: NodeGroup,
    hostname: 'vmNodeDevHostname',
//    password: '',
    username: Client.username,
    template: Template,
    ips: '1',
    memory: '512',
    swap: '2048',
    cpu: '2',
    disk: '20',
};
Solus.CreateVM(VM, function(e, VM) {
    if (e) throw e;
    console.log('VM', VM);
});
/*
Solus.CreateClient(Client, function(e, Client) {
    if (e) throw e;
    console.log('Client', Client);
});
*/
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
