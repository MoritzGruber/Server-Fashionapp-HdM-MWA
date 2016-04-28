var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

//setup mongo connection
mongoose.connect('mongodb://192.168.99.100:27017/mongo');

//create schemas
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  phoneNumber: {
    type: String,
    index: {
      unique: true
    },
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    required: true
  },
  appInstalled: {
    type: Boolean,
    required: true
  },
  score: {
    type: Number,
    min: 0
  }
});

var userXuserSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  },
  friend: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

var picturesSchema = new Schema({
  src: {
    type: String,
    unique: true,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  }
});

var votesSchema = new Schema({
  picture: {
    type: Schema.ObjectId,
    ref: 'picture',
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  },
  hasLiked: {
    type: Boolean,
    required: true
  }
});

//create models
var User = mongoose.model('User', usersSchema);
var UserXUser = mongoose.model('UserXUser', userXuserSchema);
var Picture = mongoose.model('Picture', picturesSchema);
var Vote = mongoose.model('Vote', votesSchema);

//instantiate a user
var user1 = new User({
  name: "Christoph Muth",
  profilePic: "Profilbild",
  phoneNumber: "015724681345",
  appInstalled: false,
  score: 42
});

//save user into database
user1.save(function(err) {
  if(err) throw err;
  console.log("User saved successfully!");
});

//get all users
var queryUsers = function(){
  User.find(function(err, result){
    if (err) throw err;
    console.log("Users:\n" + result);
  });
};

//update user
var updateUser = function(){
  User.update({phoneNumber : {$eq: '015724681345'}}, {$set: {phoneNumber: "015724681346"}}, function(err, result){
    console.log("Updated successfully");
    console.log(result);
  });
};

//delete user
var deleteUser = function(){
  User.remove({phoneNumber: "015724681346"}, function(err) {
    console.log("User removed");
  });
};

app.get('/users', function(req, res){
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  })
});

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