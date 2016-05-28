var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var picturesSchema = new Schema({
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
});

// create model
var Picture = mongoose.model('Picture', picturesSchema);

module.exports = Picture;