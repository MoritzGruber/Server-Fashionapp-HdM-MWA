var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userXuserSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    friend: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    link: String
});

mongoose.model('userXuser', userXuserSchema);