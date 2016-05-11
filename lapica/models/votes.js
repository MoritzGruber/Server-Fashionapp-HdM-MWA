var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var votesSchema = new Schema({
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
});

// create model
var Vote = mongoose.model('Vote', votesSchema);

module.exports = Vote;