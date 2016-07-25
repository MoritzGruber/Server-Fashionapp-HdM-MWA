// Main Node APP 
// here all comes together 

//external node modules
var app = require('express')();
var http = require('http').Server(app);

//own logic modules
var socketService = require('./socketService');

//normal http server, we attach socket.io to this
http.listen(3000, function () {
    console.log('listening on *:3000');
});
