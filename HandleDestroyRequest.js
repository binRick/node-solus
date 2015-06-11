var Solus = require('./'),
    pj = require('prettyjson'),
    Config = require('./sConf'),
    fs = require('fs'),
    plugin = require('./plugins/solus'),
    UbersmithAPI = require('../node-ubersmith');


module.exports = function(reqJson, CB) {
    Solus.setConfig(Config);

    var v = plugin.Events.createClient.validate;
    var s = plugin.Events.createClient.setup;
    var p = plugin.Events.createClient.process;
    var client = new UbersmithAPI(reqJson.config.uberApiUser, reqJson.config.uberApiToken, reqJson.config.uberApiUrl + '/api/2.0/');
    var api_calls = {};
    api_calls['client.get'] = {
        args: {
            client_id: reqJson.client.clientid,
        },
        callback: function(err, res) {
            if (err) throw err;
            var UberClient = JSON.parse(res.body);
            reqJson.client = UberClient.data;
            var V = v(reqJson);
            if (!V) {
                console.log('Failed to validate', reqJson, V);
                return CB('Client validation failed', null);
            }
            s(reqJson, function(e, Setup) {
                if (e) throw e;
                p(Solus, Setup, reqJson, function(e, res) {
                    if (e) throw e;
                    var v2 = plugin.Events.destroyVM.validate;
                    var s2 = plugin.Events.destroyVM.setup;
                    var p2 = plugin.Events.destroyVM.process;
                    api_calls = {};
                    api_calls['client.service_get'] = {
                        args: {
                            service_id: reqJson.service.packid,
                            metadata: '1'
                        },
                        callback: function(err, res) {
                            if (err) throw err;
                            var uberService = JSON.parse(res.body).data;
                            reqJson.service = uberService;
                            var V2 = v2(reqJson);
                            if (!V2) {
                                var msg = 'Failed to destroy vm';
                                console.log(msg);
                                return CB(msg, null);
                            } else {
                                s2(reqJson, function(e, Setup) {
                                    if (e) throw e;
                                    p2(Solus, Setup, reqJson, function(e, vmDeletion) {
                                        if (e) throw e;
                                        var uberPackUpdate = {
                                            service_id: reqJson.service.packid,
                                            server: '',
                                            ip_address: '',
                                            meta_solusvmid: '',
                                            meta_solusvm_url: '',
                                        };
                                        api_calls = {};
                                        api_calls['client.service_update'] = {
                                            args: uberPackUpdate,
                                            callback: function(err, res) {
                                                if (err) throw err;
                                                var UberUpdate = JSON.parse(res.body);
                                                console.log('Updated Uber to new pack', UberUpdate);
CB(err, 'VM Suspended in Solus and service data cleared');

                                            },
                                        };
                                        client.Async(api_calls);
                                    });
                                });
                            }
                        },
                    };
                    client.Async(api_calls);


                });
            });
        }
    }
    client.Async(api_calls);
};
