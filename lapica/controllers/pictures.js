var mongoose = require('mongoose');

var debug = require('./../debug');
var Picture = require('./../models/pictures');
var Votes = require('./../models/votes');
var User = require('./users');

module.exports = {
    // create picture
    createPicture: function (source, owner, recipients, callback) {
        debug.log("createPicture called");
        var picture = new Picture({
            src: source,
            dateCreated: Date.now(),
            user: owner,
            recipients: recipients,
            votes: []
        });
        picture.save(function (err, res) {
            if (err) throw err;
            var resId = res._id;
            // User.addPictureToUser(picture, function (err, res) {
            callback(err, resId);
            // });
        });
    },

    // get pictures
    getPictures: function (callback) {
        debug.log("getPictures called");
        Picture.find().select('_id').exec(function (err, res) {
            var result = [];
            res.forEach(function (entry) {
                result.push(entry._id);
            });
            callback(err, result);
        });
    },

    // get single picture
    getPicture: function (id, callback) {
        debug.log("getPicture called");
        Picture.find({_id: {$eq: id}}, function (err, res) {
            callback(err, res);
        });
    },

    // get user(creator) of picture
    getUserOfPicture: function (id, callback) {
        debug.log("getUserOfPicture called");
        Picture.findOne({_id: {$eq: id}}, function (err, res) {
            if (err) throw err;
            callback(err, res.user);
        });
    },

    // add recipient to picture
    addRecipientToPicture: function (userId, recipientId, pictureId, callback) {
        debug.log("addRecipientToPicture called");
        Picture.update({_id: pictureId}, {
            $push: {
                "recipients": recipientId
            }
        }, function (err, res) {
            User.addRecipientToPictureInUser(userId, recipientId, pictureId, function (err, res) {
                callback(err, res);
            });
        });
    },

    // get unvoted pictures of a user made in last x milliseconds
    getRecentUnvotedPicturesOfUser: function (userId, timeDifference, callback) {
        debug.log("getRecentUnvotedPicturesOfUser called");
        var now = Date.now();
        debug.log(now - timeDifference + " < x < " + now);
        //Picture.find({recipients: userId})
        var pictureIdsAlreadyVoted = [];
        Votes.find({user: userId}, function (err, votes) {
            if (votes) {
                votes.forEach(function (vote) {
                    picutreIdsAlreadyVoted.push(votes.picture);
                });
            }
            Picture.find() //we dont have any recipients yet, so we get all pictures that:
                .where('dateCreated').gt(now - timeDifference).lt(now) //are recently created
                .where('user').ne(userId) //are not created from our self
                .where({$or: [{recipients: userId}, {recipients: {$eq: []}}]}) //you are on of the people the picture was send to
                .where({_id: {$nin: picutreIdsAlreadyVoted}}) // where we are not already in the votes array as votes[x].user //we havn't already voted
                .select('_id src user')
                .exec(function (err, res) {
                    if (res != null) {
                        callback(err, res);
                    } else {
                        callback(err, []);
                    }
                });
        });
    },

    // delete picture
    deletePicture: function (id, callback) {
        debug.log("deletePicture called");
        Picture.remove({_id: id}, function (err, res) {
            User.deletePictureFromUser(id, function (err, res) {
                callback(err, res);
            });
        });
    },

    // add vote to picture
    addVoteToPicture: function (vote, callback) {
        debug.log("addVoteToPicture");
        Picture.update({_id: vote.picture}, {$push: {votes: vote}}, function (err, res) {
            if (err) callback(err);
            // User.addVoteToPictureInUser(vote, function (err, res) {
            callback(err, res);
            // });
        });
    },

    // update vote of user
    updateVoteOfPicture: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        debug.log("updateVoteOfPicture called");
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
            // debug.log("Vote of Picture updated");
            // debug.log(res);
        });
        User.updateVoteOfPictureInUser(oldPicture, oldUser, oldHasVotedUp, hasVotedUp);
    },

    // delete vote from picture
    deleteVoteFromPicture: function (id, callback) {
        debug.log("deleteVoteFromPicture called");
        Picture.update({"votes._id": id}, {$pull: {}}, function (err, res) {
            if (err) callback(err);
            User.deleteVoteOfPictureInUser(id, function (err, res) {
                callback(err, res);
            });
        });
    }
};