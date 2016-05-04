var Picture = require('./../models/pictures');

module.exports = {
    // create picture
    createPicture: function (sourcePath, owner, recipients) {
        var picture = new Picture({
            src: sourcePath,
            dateCreated: Date.now(),
            user: owner,
            recipients: recipients
        });
        picture.save(function (err) {
            if (err) throw err;
            console.log("Picture saved successfully!");
        });
    },

    // get pictures
    getPictures: function () {
        Picture.find(function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // get single picture
    getPicture: function (sourcePath) {
        Picture.find({src: {$eq: sourcePath}}, function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // update picture
    updatePicture: function (oldSourcePath, sourcePath, owner, recipients) {
        Picture.update({src: {$eq: oldSourcePath}}, {
            $set: {
                src: sourcePath,
                user: owner,
                recipients: recipients
            }
        }, function (err) {
            if (err) throw err;
            console.log("Updated successfully");
        });
    },

    // delete picture
    deletePicture: function (sourcePath) {
        Picture.remove({src: sourcePath}, function (err) {
            if (err) throw err;
            console.log("Picture removed");
        });
    }
}