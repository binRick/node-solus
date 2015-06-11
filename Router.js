var handleCreate = require('./HandleCreateVMRequest');
var handleDestroy = require('./HandleDestroyRequest');


module.exports.Destroy = function(req, res){
	var reqJson = JSON.parse(req.body.data);
	handleDestroy(reqJson, function(e, response){
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
