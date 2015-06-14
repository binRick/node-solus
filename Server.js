#!/usr/bin/env node


var express = require('express'),
morgan = require('morgan'),
    fs = require('fs'),
c = require('chalk'),
    _ = require('underscore'),
    app = new express(),
    multer = require('multer');
SolusRouter = require('./Router');



app.use(express.static(__dirname + '/public_html'));

app.use(multer());
//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
//app.use(morgan('combined', {stream: accessLogStream}))


app.get('/', function(req, res) {
    res.end('asd');
});

app.post('/api/*', function(req, res, next){	
//	console.log(c.green(JSON.parse(req.body.data)));
	next();
});

app.post('/api/createVM', SolusRouter.Create);
app.post('/api/cancelVM', SolusRouter.Cancel);
app.post('/api/suspendVM', SolusRouter.Suspend);
app.post('/api/unsuspendVM', SolusRouter.Unsuspend);


app.listen(process.env.PORT || 31223);
