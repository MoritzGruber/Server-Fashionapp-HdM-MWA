var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var fs = require('fs');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  //setup mongo connection
  mongoose.connect('mongodb://192.168.99.100:27017/mongo');
}

//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB");
});

var user1 = new User({
  name: "Christoph Muth",
  profilePic: "Profilbild",
  phoneNumber: "015733210468",
  appInstalled: false
});

user1.save(function(err) {
  if(err) throw err;
  console.log("User saved successfully!");
});

app.get('/users', function(req, res){
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  })
});

//runnig index.html as simple web client here ==> see on ip:3000
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