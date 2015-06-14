var handleCreate = require('./HandleCreateVMRequest');
var handleCancel = require('./HandleCancelRequest');
var handleSuspend = require('./HandleSuspendRequest');
var handleUnsuspend = require('./HandleUnsuspendRequest');

module.exports.Cancel = function(req, res){
        var reqJson = JSON.parse(req.body.data);
        handleCancel(reqJson, function(e, response){
                if(e)
                        return res.end(e);
                return res.end(response);
        });
};

module.exports.Suspend = function(req, res){
        var reqJson = JSON.parse(req.body.data);
        handleSuspend(reqJson, function(e, response){
                if(e)
                        return res.end(e);
                return res.end(response);
        });
};


module.exports.Unsuspend = function(req, res){
	var reqJson = JSON.parse(req.body.data);
	handleUnsuspend(reqJson, function(e, response){
		if(e)
			return res.end(e);
		return res.end(response);
	});
};
module.exports.Create = function(req, res){
	var reqJson = JSON.parse(req.body.data);
	handleCreate(reqJson, function(e, response){
		if(e)
			return res.end(e);
		return res.end(response);
	});
};
