var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var voteSchema = new Schema({
    value: {
        type: Boolean,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    image: {
        type: ObjectId,
        ref: 'image',
        required: true
    }
});

// create model
var vote = mongoose.model('vote', voteSchema);

module.exports = vote;