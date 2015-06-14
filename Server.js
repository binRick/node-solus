#!/usr/bin/env node


var express = require('express'),
    fs = require('fs'),
    _ = require('underscore'),
    app = new express(),
    multer = require('multer');

app.use(express.static(__dirname + '/public_html'));

app.use(multer());

var SolusRouter = require('./node-solus/Router');

app.get('/', function(req, res) {
    res.end('asd');
});
app.post('/api/createVM', SolusRouter.Create);
app.post('/api/cancelVM', SolusRouter.Cancel);
app.post('/api/suspendVM', SolusRouter.Suspend);
app.post('/api/unsuspendVM', SolusRouter.Unsuspend);


app.listen(process.env.PORT || 31223);
