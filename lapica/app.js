var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var db = require('./models/db');
var users = require('./controllers/users');
var userXusers = require('./controllers/userXusers');
var pictures = require('./controllers/pictures');
var votes = require('./controllers/votes');

//running index.html as simple web client here ==> see on ip:3000
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//get called if somebody connects via socket.io to our ip
io.on('connection', function(socket){
//sharing images between all clients
//if a new images comes in, every client gets the new image broadcasted
    socket.on('new_image',function(data){
      pictures.createPicture(data.imageData, data.transmitternumber, [], []);
      console.log('A imagefile was transmitted: ' + data );
	    socket.broadcast.emit('incoming_image',data);
    });
    socket.on('new_user', function(number){
      console.log("a new user registered: "+ number);
      users.createUser(number, number, "noImage");
    });

    //transfareing vote
  socket.on('vote', function(data){
	console.log(data);
    vote.createVote(data.imageData , data.number, data.rating);
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

// users.createUser("Max Mustermann", "015735412587", "profilePicLink");
// users.createUser("Thomas Müller", "015283028507", "profilePicLink2");
// userXusers.createUserXUser("link", "015735412587", "015283028507");
// pictures.createPicture("picture1", "015735412587", [], []);
// pictures.updatePicture("picture1", "picture1", "015735412587", ["015283028507"], []);
// votes.createVote("picture1", "015283028507", true);
// pictures.createPicture("picture2", "015283028507", [], []);
// pictures.updatePicture("picture2", "picture2", "015283028507", ["015735412587"], []);
// votes.createVote("picture2", "015735412587", false);
// votes.deleteVote("picture1", "015283028507");
