var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var picturesSchema = new Schema({
    src: String,
    dateCreated: Timestamp,
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    price: Double,
    brand: {
        type: Schema.ObjectId,
        ref: 'brands'
    }
});

mongoose.model('pictures', picturesSchema);