var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema
var companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    address: {
        type: String
    },
    contactName: {
        type: String
    },
    contactMail: {
        type: String
    },
    contactTel: {
        type: String
    },
    website: {
        type: String
    },
    users: [{
        user: {
            type: ObjectId,
            ref: 'user'
        },
        role: {type: String }
    }]
});

// create model
var company = mongoose.model('company', companySchema);

module.exports = company;