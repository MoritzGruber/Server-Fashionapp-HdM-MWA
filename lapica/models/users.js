var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var usersSchema = new Schema({
    _id: {
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

// create model
var User = mongoose.model('User', usersSchema);

module.exports = User;