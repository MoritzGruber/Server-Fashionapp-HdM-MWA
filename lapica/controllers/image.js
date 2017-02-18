var Image = require('./../models/image');
var debug = require('./../debug');

module.exports = {
    // create image
    createImage: function (creator, product, source) {
        return new Promise(function (resolve, reject) {
            debug.log("createImage called");
            var image = new Image({
                creator: creator,
                createDate: Date.now(),
                active: true,
                product: null,
                source: source
            });
            image.save(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res._id);
                }
            });
        });

    },

    // get all images
    getImages: function (callback) {
        debug.log("getImages called");
        Image.find().select('_id').exec(function (err, res) {
            var imageIds = [];
            res.forEach(function (image) {
                imageIds.push(image._id);
            });
            callback(err, imageIds);
        });
    },

    // get single image
    getImage: function (id, callback) {
        debug.log("getImage called");
        Image.findOne({_id: id}, function (err, res) {
            callback(err, res);
        });
    },

    // get user(creator) of picture
    getUserOfImage: function (id, callback) {
        debug.log("getUserOfImage called");
        Image.findOne({_id: id}, function (err, res) {
            callback(err, res.user);
        });
    },

    // delete image
    deleteImage: function (imageId, callback) {
        debug.log("deleteImage called");
        Image.remove({_id: id}, function (err, res) {
            callback(err, res);
        });
    }
};
