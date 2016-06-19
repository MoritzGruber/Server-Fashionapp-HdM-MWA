var mongoose = require('mongoose');

var Picture = require('./../models/pictures');
var User = require('./users');

module.exports = {
    // create picture
    createPicture: function (source, owner, callback) {
        console.log("createPicture called");
        var picture = new Picture({
            src: source,
            dateCreated: Date.now(),
            user: owner,
            recipients: [],
            votes: []
        });
        picture.save(function (err, res) {
            if (err) throw err;
            var resId = res._id;
            User.addPictureToUser(picture, function (err, res) {
                if (err) throw err;
                callback(null, resId);
            });
        });
    },

    // get pictures
    getPictures: function (callback) {
        console.log("getPictures called");
        Picture.find().select('_id').exec(function (err, res) {
            var result = [];
            res.forEach(function (entry) {
                result.push(entry._id);
            });
            callback(null, result);
        });
    },

    // get single picture
    getPicture: function (id, callback) {
        console.log("getPicture called");
        Picture.find({_id: {$eq: id}}, function (err, res) {
            if (err) throw err;
            callback(err, res);
        });
    },

    // add recipient to picture
    addRecipientToPicture: function (userId, recipientId, pictureId, callback) {
        console.log("addRecipientToPicture called");
        Picture.update({_id: pictureId}, {
            $push: {
                "recipients": recipientId
            }
        }, function (err, res) {
            User.addRecipientToPictureInUser(userId, recipientId, pictureId, function (err, res) {
                if (err) throw err;
                callback(null, res);
            });
        });
    },

    // get unvoted pictures of a user made in last x milliseconds
    getRecentUnvotedPicturesOfUser: function (userId, timeDifference, callback) {
        console.log("getRecentUnvotedPicturesOfUser called");
        var now = Date.now();
        console.log(now - timeDifference + " < x < " + now);
        Picture.find({recipients: userId})
            .where('dateCreated').gt(now - timeDifference).lt(now)
            .select('_id src user')
            .exec(function (err, res) {
                if (res != null) {
                    callback(null, res);
                } else {
                    callback(null, []);
                }
            });
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
    addVoteToPicture: function (vote, callback) {
        console.log("addVoteToPicture");
        Picture.update({_id: vote.picture}, {$push: {votes: vote}}, function (err, res) {
            if (err) throw err;
            User.addVoteToPictureInUser(vote, function (err, res) {
                if (err) throw err;
                callback(null, res);
            });
        });
    },

    // update vote of user
    updateVoteOfPicture: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        console.log("updateVoteOfPicture called");
        Picture.update({
            "vote.picture": oldPicture,
            "vote.user": oldUser,
            "vote.hasVotedUp": oldHasVotedUp
        }, {
            $set: {
                "vote.$.picture": oldPicture,
                "vote.$.user": oldUser,
                "vote.$.hasVotedUp": hasVotedUp
            }
        }, function (err, res) {
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