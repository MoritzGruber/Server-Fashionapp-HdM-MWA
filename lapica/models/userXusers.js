var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var userXuserSchema = new Schema({
    link: {
        type: String,
        index: {
            unique: true
        },
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    friend: {
        type: ObjectId,
        ref: 'users',
        required: true
    }
});

// create model
var UserXUser = mongoose.model('UserXUser', userXuserSchema);

module.exports = UserXUser;