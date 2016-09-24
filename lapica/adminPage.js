var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/', express.static(__dirname + '/html'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

http.listen(3000, function () {
    console.log('admin listening on *:3000');
});