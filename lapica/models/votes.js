var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var votesSchema = new Schema({
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
    },
    dateCreated: {
        type: String,
        required: true
    }
});

// create model
var Vote = mongoose.model('Vote', votesSchema);

module.exports = Vote;