var Picture = require('./../models/pictures');
var User = require('./users');

module.exports = {
    // create picture
    createPicture: function (sourcePath, owner, recipients, callback) {
        console.log("createPicture called");
        var picture = new Picture({
            src: sourcePath,
            dateCreated: Date.now(),
            user: owner,
            recipients: recipients,
            votes: []
        });
        picture.save(function (err, res) {
            if (err) throw err;
            console.log("Picture saved successfully!");
            callback(null, res._id);
        });
        User.addPictureToUser(picture, owner);
    },

    // get pictures
    getPictures: function (callback) {
        console.log("getPictures called");
        Picture.find().select('_id').exec(function (err, res) {
            var result = [];
            res.forEach(function(entry) {
                result.push(entry._id);
            });
            callback (null, result);
        });
    },

    // get single picture
    getPicture: function (id, callback) {
        console.log("getPicture called");
        Picture.find({_id: {$eq: id}}, function (err, res) {
            if (err) throw err;
            callback (err, res);
        });
    },

    // update picture
    updatePicture: function (id, sourcePath, owner, recipients, votes) {
        console.log("updatePicture called");
        Picture.update({_id: {$eq: id}}, {
            $set: {
                src: sourcePath,
                user: owner,
                recipients: recipients
            }
        }, function (err, res) {
            if (err) throw err;
            // console.log("Updated successfully");
            // console.log(res);
        });
        User.updatePictureFromUser(id, sourcePath, owner, recipients, votes);
    },

    // delete picture
    deletePicture: function (id) {
        console.log("deletePicture called");
        Picture.remove({_id: id}, function (err, res) {
            if (err) throw err;
            // console.log("Picture removed");
            // console.log(res);
        });
        User.deletePictureFromUser(id);
    },

    // add vote to picture
    addVoteToPicture: function (vote) {
        console.log("addVoteToPicture");
        Picture.update({_id: vote.picture}, {$push: {votes: vote}}, function(err, res) {
            if (err) throw err;
            // console.log("Vote added to Picture");
            // console.log(res);
        });
        User.addVoteToPictureInUser(vote);
    },

    // update vote of user
    updateVoteOfPicture: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        console.log("updateVoteOfPicture called");
        Picture.update({"vote.picture": oldPicture, "vote.user": oldUser, "vote.hasVotedUp": oldHasVotedUp}, {$set: {"vote.$.picture": oldPicture, "vote.$.user": oldUser, "vote.$.hasVotedUp": hasVotedUp}}, function(err, res) {
            if (err) throw err;
            // console.log("Vote of Picture updated");
            // console.log(res);
        });
        User.updateVoteOfPictureInUser(oldPicture, oldUser, oldHasVotedUp, hasVotedUp);
    },

    // delete vote from picture
    deleteVoteFromPicture: function (picture, user) {
        console.log("deleteVoteFromPicture called");
        Picture.update({"votes.picture": picture, "votes.user": user}, {$pull: {}}, function (err, res) {
            if (err) throw err;
            // console.log("Vote of Picture removed");
            // console.log(res);
        });
        User.deleteVoteOfPictureInUser(picture, user);
    }
};