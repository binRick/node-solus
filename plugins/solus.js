var _ = require('underscore');
//[ 'client', 'service', 'config', 'meta' ]
module.exports.Events = {
    createVM: {
        validate: function(reqJson) {
            return reqJson.meta.solusvmid == 0 && reqJson.config.apiType == 'openvz' && reqJson.meta.ctid == '' && reqJson.service.desserv.length > 0;
        },
        setup(reqJson, cb) {
            var Setup = {
                type: reqJson.config.apiType,
                node: req.config.apiNode,
                hostname: reqJson.service.desserv,
                username: reqJson.client.username,
                template: reqJson.config.apiTemplate,
            };
            if (reqJson.service.password && reqJson.service.password.length > 6)
                Setup.password = reqJson.service.password;
        },
    },

};