'use strict';
var request = require('request');

var solus = Object.create(null, {
    base_config: {
        writable: false,
        value: {
            apiId: null,
            apiKey: null,
            host: null,
            port: 80,
            ssl: false,
            verbose: false
        }
    },
    config: {
        writable: true,
        value: {}
    },
});

solus.strFormat = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(match, number) {
        return args[number] === undefined ? match : args[number];
    });
};

solus.serializeParams = function(obj, prefix) {
    var prop, k, v, str = [];
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            k = prefix ? prefix + "[" + prop + "]" : prop;
            v = obj[prop];

            if (typeof v === 'object') {
                str.push(solus.serializeParams(v, k));
            } else {
                str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
    }
    return str.join("&");
};

solus.generateHostUrl = function(params) {
    if (solus.config.host === null) {
        throw {
            name: "ConfigError",
            level: "FATAL",
            message: "No 'host' value provided.",
            toString: function() {
                return this.name + ": " + this.message;
            }
        };
    }

    var schema = solus.config.ssl ? 'https' : 'http',
        suffix = 'api/admin/command.php',
        host = solus.config.host,
        port = solus.config.port;

    return solus.strFormat('{0}://{1}:{2}/{3}?{4}',
        schema, host, port, suffix,
        solus.serializeParams(params));
};

solus.setConfig = function(conf) {
    var key;

    conf = conf === undefined ? {} : conf;

    for (key in this.base_config) {
        if (this.base_config.hasOwnProperty(key)) {
            this.config[key] = this.base_config[key];
        }
    }
    for (key in conf) {
        if (conf.hasOwnProperty(key)) {
            this.config[key] = conf[key];
        }
    }

    return this;
};

solus.sQuery = function(params, callback) {
    // Set Query defaults
    params.rdtype = 'json';
    params.id = solus.config.apiId;
    params.key = solus.config.apiKey;
    //console.log(params);
    // execute response
    return request.get(solus.generateHostUrl(params), callback);
};

solus.listNodesById = function(virtType, callback) {
    this.sQuery({
        action: 'node-idlist',
        type: virtType
    }, callback);
};

solus.listNodesByName = function(virtType, callback) {
    this.sQuery({
        action: 'listnodes',
        type: virtType
    }, callback);
};

solus.listVirtualServers = function(nodeId, callback) {
    this.sQuery({
        action: 'node-virtualservers',
        nodeid: nodeId
    }, callback);
};

solus.virtualServerInfo = function(vserverId, callback) {
    this.sQuery({
        action: 'vserver-info',
        vserverid: vserverId
    }, callback);
};
solus.query = function(method, input, returnKey, cb) {
    solus[method](input, function(e, s) {
        if (e) cb(e, null);
        //console.log(s.body);
        cb(e, JSON.parse(s.body)[returnKey]);
    });
};


solus.NodeIDs = function(type, cb) {
    solus.query('listNodesById', type, 'nodes', function(e, s) {
        cb(e, s.split(','));
    });
};
solus.NodeNames = function(type, cb) {
    solus.query('listNodesByName', type, 'nodes', function(e, s) {
        cb(e, s.split(','));
    });
};
solus.NodeVMs = function(nodeID, cb) {
    solus.query('listVirtualServers', nodeID, 'virtualservers', function(e, s) {
        cb(e, s);
    });
};

module.exports = solus;