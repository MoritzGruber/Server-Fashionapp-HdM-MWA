var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brandsSchema = new Schema({
    name: String
});

mongoose.model('brands', brandsSchema);