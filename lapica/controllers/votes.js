var Vote = require('./../models/vote');
var Picture = require('./pictures');
var User = require('./user');
var debug = require('./../debug');

module.exports = {
    // create vote 
    createVote: function (pictureId, userId, hasVotedUp, callback) {
        debug.log("createVote called");
        var vote = new Vote({
            picture: pictureId,
            user: userId,
            hasVotedUp: hasVotedUp,
            dateCreated: Date.now()
        });
        vote.save(function (err, res) {
            if (err) throw err;
            callback(err, res._id);
        });
    },

    // get votes
    getVotes: function () {
        debug.log("getVotes called");
        Vote.find(function (err, result) {
            if (err) callback(err, result);
            return result;
        });
    },
    // get some spesific votes
    getVotesOfSomeSpesifcPictures: function (arrayOfPictureids, callback) {
        debug.log("getVotesOfSomeSpesifcPictures called");
        Vote.find()
            .where('picture').in(arrayOfPictureids)
            .exec(function (err, res) {
                if (res != null) {
                    callback(err, res);
                } else {
                    callback(err, []);
                }
            });
    },

    // get single vote
    getVote: function (picture, user) {
        debug.log("getVote called");
        Vote.find({picture: {$eq: picture}, user: {$eq: user}}, function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // update vote
    updateVote: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        debug.log("updateVote called");
        Vote.update({
            picture: {$eq: oldPicture},
            user: {$eq: oldUser},
            hasVotedUp: {$eq: oldHasVotedUp}
        }, {$set: {picture: oldPicture, user: oldUser, hasVotedUp: hasVotedUp}}, function (err, res) {
            if (err) throw err;
            // debug.log("Updated successfully");
            // debug.log(res);
        });
    },

    // delete vote
    deleteVote: function (id, callback) {
        debug.log("deleteVote called");
        Vote.remove({_id: id}, function (err, res) {
            if (err) callback(err);
            callback(err, res);
        });
    },

    // check if user already voted a picture
    hasUserVotedPicture: function (user, picture) {
        debug.log("hasUserVotedPicture called");
        Vote.find({user: {$eq: user}, picture: {$eq: picture}}, function (err, result) {
            if (err) throw err;
            return (result.count > 0)
        });
    }
};