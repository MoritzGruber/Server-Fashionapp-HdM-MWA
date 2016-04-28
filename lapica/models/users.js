var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: String,
    profilePic: String,
    phoneNumber: String,
    appInstalled: Boolean
});

mongoose.model('users', usersSchema);

var User = mongoose.model('User', usersSchema);