var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


// create schema
var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    loginName: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    banned: {
        type: Boolean,
        required: true
    },
    lastLogin: {
        type: Date
    },
    active: {
        type: Boolean,
        required: true
    },
    registrationDate: {
        type : Date,
        default: Date.now,
        required: true
    },
    activationDate: {
        type: Date
    },
    profilePicture: {
        type: String
    },
    pushToken: {
        type: String
    },
    appInstalled: {
        type: Boolean
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    lastImage: {
        type: ObjectId,
        ref: 'image'
    },
    lastVote: {
        type: 'ObjectId',
        ref: 'vote'
    }
});

// create model
var user = mongoose.model('user', userSchema);

module.exports = user;