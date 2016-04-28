var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var votesSchema = new Schema({
    picture: {
        type: Schema.ObjectId,
        ref: 'picture'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    }
});

mongoose.model('votes', votesSchema);