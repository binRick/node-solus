var Solus = require('./'),
    pj = require('prettyjson'),
    Config = require('./sConf'),
    fs = require('fs'),
    plugin = require('./plugins/solus'),
    UbersmithAPI = require('../node-ubersmith');



Solus.setConfig(Config);

var v = plugin.Events.createClient.validate;
var s = plugin.Events.createClient.setup;
var p = plugin.Events.createClient.process;
var reqJson = JSON.parse(fs.readFileSync('../uberPostData.json'));

//console.log(reqJson.config);
var client = new UbersmithAPI(reqJson.config.uberApiUser, reqJson.config.uberApiToken, reqJson.config.uberApiUrl + '/api/2.0/');
var api_calls = {};
api_calls['client.get'] = {
    args: {
        client_id: reqJson.client.clientid,
    },
    callback: function(err, res) {
        if (err) throw err;
        var UberClient = JSON.parse(res.body);
        //        console.log(UberClient);
        reqJson.client = UberClient.data;
        var V = v(reqJson);
        if (!V) {
            console.log('Failed to validate', reqJson, V);
            process.exit();
        }
        s(reqJson, function(e, Setup) {
            if (e) throw e;
            p(Solus, Setup, reqJson, function(e, res) {
                if (e) throw e;
                //                console.log('done', res);
                var v2 = plugin.Events.createVM.validate;
                var s2 = plugin.Events.createVM.setup;
                var p2 = plugin.Events.createVM.process;
                api_calls = {};
                api_calls['client.service_get'] = {
                    args: {
                        service_id: reqJson.service.packid,
                        metadata: '1'
                    },
                    callback: function(err, res) {
                        if (err) throw err;
                        var uberService = JSON.parse(res.body).data;
                        //console.log('Uber Service', uberService);
                        reqJson.service = uberService;
                        //process.exit();




                        var V2 = v2(reqJson);
                        //console.log(V2);
                        //process.exit();
                        if (!V2) {
                            var msg = 'Failed to Create VM. This is usually because a solusvmid already exists on this service';
console.log(msg);
 //                           throw msg;
 //                         
                        }else{
                        s2(reqJson, function(e, Setup) {
                            if (e) throw e;
                            p2(Solus, Setup, reqJson, function(e, vmCreation) {
                                if (e) throw e;
                                if (typeof(vmCreation.status) != 'string' || vmCreation.status != 'success')
                                    throw JSON.stringify(vmCreation);
                                //                        console.log('created VM!');
                                //                        console.log(pj.render(vmCreation));
                                var uberPackUpdate = {
                                    service_id: reqJson.service.packid,
                                    status: '1',
                                    userid: 'root',
                                    pass: vmCreation.rootpassword,
                                    server: vmCreation.hostname,
                                    ip_address: vmCreation.mainipaddress,
                                    meta_solusvmid: vmCreation.vserverid,
                                    meta_solusvm_url: 'https://' + reqJson.config.apiHost + ':' + reqJson.config.apiPort + '/admincp/manage.php?id=' + vmCreation.vserverid,
                                };
                                console.log(pj.render(uberPackUpdate));
                                api_calls = {};
                                api_calls['client.service_update'] = {
                                    args: uberPackUpdate,
                                    callback: function(err, res) {
                                        if (err) throw err;
                                        var UberUpdate = JSON.parse(res.body);
                                        console.log('Updated Uber to new pack', UberUpdate);
                        var api_calls = {};
                        api_calls['device.ip_assignment_add'] = {
                            args: {
                                addr: vmCreation.mainipaddress,
                                client_id: reqJson.client.clientid,
                                service_id: reqJson.service.packid,
assign_description: 'Automatically SolusVM IP', 
                            },
                            callback: function(err, res) {
//                                err ? console.log(err) : console.log(res.body);
                                        process.exit();
                            }
                        }
                        client.Async(api_calls);

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
