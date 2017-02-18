var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var productSchema = new Schema({
    price: {
        type: Number
    },
    name: {
        type: String
    },
    category: {
        type: ObjectId,
        ref: 'category',
        required: true
    }

});

// create model
var product = mongoose.model('product', productSchema);

module.exports = product;