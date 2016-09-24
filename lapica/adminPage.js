var express = require('express');
var app = require('./main').app;
app.use('/', express.static(__dirname + '/html'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
