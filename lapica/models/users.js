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
    },
    pictures: [{
        src: {
            type: String,
            index: {
                unique: true
            },
            required: true
        },
        dateCreated: {
            type: String,
            required: true
        },
        user: {
            type: String,
            ref: 'Users',
            required: true
        },
        recipients: [{
            type: String,
            ref: 'Users'
        }],
        votes: [{
            picture: {
                type: String,
                ref: 'picture',
                required: true
            },
            user: {
                type: String,
                ref: 'users',
                required: true
            },
            hasVotedUp: {
                type: Boolean,
                required: true
            }
        }]
    }],
    votes: [{
        picture: {
            type: String,
            ref: 'picture',
            required: true
        },
        user: {
            type: String,
            ref: 'users',
            required: true
        },
        hasVotedUp: {
            type: Boolean,
            required: true
        }
    }]
});

// create model
var User = mongoose.model('User', usersSchema);

module.exports = User;