var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create schema
var registerSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
});

// create model
var Register = mongoose.model('Register', registerSchema);

module.exports = Register;