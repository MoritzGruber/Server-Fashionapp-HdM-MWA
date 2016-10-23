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
            recipients: recipients
        });
        picture.save(function (err, res) {
            if (err) throw err;
            callback(err, res._id);
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
            callback(err, res);
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
                    pictureIdsAlreadyVoted.push(vote.picture);
                    $debug.log(vote.picture);
                });
            }
            Picture.find() //we dont have any recipients yet, so we get all pictures that:
                .where('dateCreated').gt(now - timeDifference).lt(now) //are recently created
                .where('user').ne(userId) //are not created from our self
                .where({$or: [{recipients: userId}, {recipients: {$eq: []}}]}) //you are on of the people the picture was send to
                .where({_id: {$nin: pictureIdsAlreadyVoted}}) //we haven't already voted
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
            callback(err, res);
        });
    },

    // add vote to picture
    addVoteToPicture: function (vote, callback) {
        debug.log("addVoteToPicture");
        Picture.update({_id: vote.picture}, {$push: {votes: vote}}, function (err, res) {
            if (err) callback(err);
            callback(err, res);
        });
    },

    // delete vote from picture
    deleteVoteFromPicture: function (id, callback) {
        debug.log("deleteVoteFromPicture called");
        Picture.update({"votes._id": id}, {$pull: {}}, function (err, res) {
            if (err) callback(err);
            callback(err, res);
        });
    }
};