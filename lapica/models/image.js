var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var imageSchema = new Schema({
    creator: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    product: {
        type: ObjectId,
        ref: 'product'
    },
    source: {
        type: String,
        required: true
    }
});

// create model
var image = mongoose.model('image', imageSchema);

module.exports = image;