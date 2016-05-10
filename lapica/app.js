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
//sharing images between all clients
//if a new images comes in, every client gets the new image broadcasted
    socket.on('new_image',function(data){
      	 console.log('A imagefile was transmitted: ' + data );
	 socket.broadcast.emit('incoming_image',data);
    });

    //transfareing vote
  socket.on('vote', function(data){
	console.log(data);
    console.log('a voting was transmitted from: ' + data.number + 'with vote: '+data.rating );
    io.emit('vote_sent_from_server', data);
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
