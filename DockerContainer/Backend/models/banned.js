var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var bannedSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

// create model
var Banned = mongoose.model('Banned', bannedSchema);

module.exports = Banned;