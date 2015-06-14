var fs = require('fs');


module.exports = {
    summary: function() {
        return "this is a blank rule for anyproxy";
    },
    shouldInterceptHttpsReq: function(req) {
        return false;
    },
    shouldUseLocalResponse: function(req, reqBody) {
        return false;
    },
    dealLocalResponse: function(req, reqBody, callback) {
        callback(statusCode, resHeader, responseData)
    },
    replaceRequestProtocol: function(req, protocol) {
        var newProtocol = protocol;
        return newProtocol;
    },

    replaceRequestOption: function(req, option) {
        var newOption = option;
        newOption.hostname = process.env.HOST || "127.0.0.1";
        newOption.port = process.env.PORT || 31222;
        return newOption;
    },
    replaceRequestData: function(req, data) {
        return data;
    },

    replaceResponseStatusCode: function(req, res, statusCode) {
        var newStatusCode = statusCode;
        return newStatusCode;
    },
    replaceResponseHeader: function(req, res, header) {
        var newHeader = header;
        return newHeader;
    },
    replaceServerResDataAsync: function(req, res, serverResData, callback) {
        callback(serverResData);
    },
    pauseBeforeSendingResponse: function(req, res) {
        return 0;
    }

};