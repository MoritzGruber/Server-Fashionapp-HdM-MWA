var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
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
    },
    token: {
        type: String,
        required: true
    }
});

// create model
var User = mongoose.model('User', usersSchema);

module.exports = User;