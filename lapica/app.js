var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var db = require('./models/db');
var controller = require('./controllers/controller');

//running index.html as simple web client here ==> see on ip:3000
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//get called if somebody connects via socket.io to our ip
io.on('connection', function(socket){
    //print out the chat message to the console and emit it to all clints
  socket.on('chat message', function(msg){
    console.log('A message was transmitted: ' + msg );
    io.emit('chat message', msg);
  });
    //showing when somebody opens socket.io connection or closes
  console.log('A new connection is now open');
  socket.on('disconnect', function () {
    console.log('A connection was closed');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

