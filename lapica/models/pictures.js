var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var picturesSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    recipients: [{
        type: String
    }],
    votes: [{
        picture: {
            type: ObjectId,
            ref: 'picture',
            required: true
        },
        user: {
            type: ObjectId,
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