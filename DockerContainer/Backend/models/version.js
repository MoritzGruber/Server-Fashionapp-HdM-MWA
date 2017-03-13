var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var versionSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// create model
var version = mongoose.model('version', versionSchema);

module.exports = version;