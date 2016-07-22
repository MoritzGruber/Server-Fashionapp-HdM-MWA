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

    // get user(creator) of picture
    getUserOfPicture: function (id, callback) {
        console.log("getUserOfPicture called");
        Picture.findOne({_id: {$eq: id}}, function (err, res) {
            if (err) throw err;
            callback(err, res.user);
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
        //Picture.find({recipients: userId})  
        Picture.find() //we dont have any recipients yet, so we get all pictures that:
            .where('dateCreated').gt(now - timeDifference).lt(now) //are recently created
            .where('user').ne(userId) //are not created from our self
            .where('votes.user').ne(userId) // where we are not already in the votes array as votes[x].user //we havn't already voted
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
    deletePicture: function (id, callback) {
        console.log("deletePicture called");
        Picture.remove({_id: id}, function (err, res) {
            if (err) throw err;
            User.deletePictureFromUser(id, function (err, res) {
                callback(null, res);
            });
        });
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
    deleteVoteFromPicture: function (id, callback) {
        console.log("deleteVoteFromPicture called");
        Picture.update({"votes._id": id}, {$pull: {}}, function (err, res) {
            if (err) throw err;
            User.deleteVoteOfPictureInUser(id, function (err, res) {
                callback(null, res);
            });
        });
    }
};