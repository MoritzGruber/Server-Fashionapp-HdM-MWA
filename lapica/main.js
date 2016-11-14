// Main Node APP 
// here all comes together
var app = require('express')();
var http = require('http').Server(app);

//export this for socket service and admin page
var exports = module.exports = {};
exports.http = http;
exports.app = app;

//own logic modules
var socketService = require('./socketService');
var adminPage = require('./admin_post/adminPage');
var statisticsPage = require('./statistics/statisticsPage');
var restAPI = require('./restAPI');

//running the server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});



