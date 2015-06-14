#!/usr/bin/env node


var express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    c = require('chalk'),
    _ = require('underscore'),
    app = new express(),
    multer = require('multer');
SolusRouter = require('./Router'),
    proxy = require("anyproxy");




app.use(express.static(__dirname + '/public_html'));

app.use(multer());
//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
//app.use(morgan('combined', {stream: accessLogStream}))


app.get('/', function(req, res) {
    res.end('asd');
});

app.post('/api/*', function(req, res, next) {
    //	console.log(c.green(JSON.parse(req.body.data)));
    next();
});

app.post('/api/createVM', SolusRouter.Create);
app.post('/api/cancelVM', SolusRouter.Cancel);
app.post('/api/suspendVM', SolusRouter.Suspend);
app.post('/api/unsuspendVM', SolusRouter.Unsuspend);


app.listen(process.env.PORT || 31222, process.env.HOST || '127.0.0.1');

var options = {
    type: "http",
    port: process.env.PPORT || 31223,
    hostname: "localhost",
    rule: require("./proxy-plugin"),
    dbFile: './requests.txt', // optional, save request data to a specified file, will use in-memory db if not specified
    webPort: 8002, // optional, port for web interface
    socketPort: 8003, // optional, internal port for web socket, replace this when it is conflict with your own service
    webConfigPort: 8088, // optional, internal port for web config(beta), replace this when it is conflict with your own service
    //    throttle      : 10,    // optional, speed limit in kb/s
    //    disableWebInterface : false, //optional, set it when you don't want to use the web interface
    silent: false //optional, do not print anything into terminal. do not set it when you are still debugging.
};
new proxy.proxyServer(options);