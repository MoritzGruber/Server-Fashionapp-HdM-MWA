var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }

});

// create model
var category = mongoose.model('category', categorySchema);

module.exports = category;