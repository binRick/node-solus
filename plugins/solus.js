var _ = require('underscore');
//[ 'client', 'service', 'config', 'meta' ]
module.exports.Events = {
    createClient: {
        validate: function(reqJson) {
            return typeof(reqJson.client) == 'object' && reqJson.client.email.split('@').length == 2 && reqJson.client.clientid > 0;
        },
        setup: function(reqJson, cb) {
            var Setup = {
                firstname: reqJson.client.first,
                lastname: reqJson.client.last,
                company: reqJson.client.listed_company,
                username: 'u' + reqJson.client.clientid,
                email: reqJson.client.email,
            };
            cb(null, Setup);
        },
        process: function(Solus, Setup, reqJson, cb) {
            Solus.CheckClientExists(Setup.username, function(e, Exists) {
                if (e)
                    return cb(e, null);
                if (!Exists)
                    Solus.CreateClient(Setup, cb);
                else
                    cb(e, {});
            });

        },
    },
    unsuspendVM: {
        validate: function(reqJson) {
            return reqJson.service.metadata.solusvmid > 0;
        },
        setup: function(reqJson, cb) {
cb(null, {});
        },
        process: function(Solus, Setup, reqJson, cb) {
Solus.sQuery({action: 'vserver-unsuspend', vserverid: reqJson.service.metadata.solusvmid}, function(e, r){
	if(e)throw e;
cb(e, r);
});
        },
    },
    suspendVM: {
        validate: function(reqJson) {
            return reqJson.service.metadata.solusvmid > 0;
        },
        setup: function(reqJson, cb) {
cb(null, {});
        },
        process: function(Solus, Setup, reqJson, cb) {
Solus.sQuery({action: 'vserver-suspend', vserverid: reqJson.service.metadata.solusvmid}, function(e, r){
	if(e)throw e;
cb(e, r);
});
        },
    },
    createVM: {
        validate: function(reqJson) {
            console.log(reqJson.service.metadata.solusvmid, reqJson.config.apiType); //, reqJson.service.metadata.ctid, reqJson.service.servername, reqJson.client.username);
            return reqJson.service.metadata.solusvmid == 0 && reqJson.config.apiType == 'openvz'; // && reqJson.service.metadata.ctid == '' && reqJson.service.servername.length > 0 && reqJson.client.username && reqJson.client.username.length > 6;
        },
        setup: function(reqJson, cb) {
            var K = _.keys(reqJson);
            var options = _.toArray(reqJson.service.options).filter(function(o) {
                return o.variable.length > 0 && o.spo_val.length > 0 && o.spo_val != 'none';
            });
            var variables = options.map(function(o) {
                return o.variable;
            });
            var keyValues = options.map(function(o) {
                var k = {};
                k[o.variable] = o.spo_val;
                return k;
            });
            var O = {};
            _.each(keyValues, function(kv) {
                var t = _.keys(kv)[0];
                O[t] = kv[t];
            });

            var Setup = {
                type: reqJson.config.apiType,
                node: reqJson.config.apiNode,
                hostname: reqJson.service.servername,
                username: 'u' + reqJson.client.clientid,
                template: O.ostemplate || reqJson.config.apiTemplate,
                ips: O.ipv4 || reqJson.config.apiIPs,
                memory: O.memory || reqJson.config.apiMemory,
                cpu: O.cpu || reqJson.config.apiCPUs,
                disk: O.disk || reqJson.config.apiDisk,
            };
            Setup.swap = Setup.memory * 2;
            if (reqJson.service.password && reqJson.service.password.length > 6)
                Setup.password = reqJson.service.password;
            console.log(Setup);
            cb(null, Setup);
        },
        process: function(Solus, Setup, reqJson, cb) {
            Solus.CreateVM(Setup, cb);
        },
    },

};
