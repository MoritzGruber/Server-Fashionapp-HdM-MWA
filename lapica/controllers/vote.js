var Vote = require('./../models/vote');
var debug = require('./../debug');

module.exports = {
    // create vote 
    createVote: function (value, userId, imageId, callback) {
        debug.log("createVote called");
        var vote = new Vote({
            value: value,
            dateCreated: Date.now,
            user: userId,
            image: imageId
        });
        vote.save(function (err, res) {
            callback(err, res._id);
        });
    },

    // get all votes
    getVotes: function (callback) {
        debug.log("getVotes called");
        Vote.find(function (err, res) {
            var voteIds = [];
            res.forEach(function (vote) {
                voteIds.push(vote._id);
            });
            callback(err, voteIds);
        });
    },

    // get some spesific votes
    getVotesOfImage: function (imageId, callback) {
        debug.log("getVotesOfImage called");
        Vote.find({image: imageId}, function (err, res) {
            var voteIds = [];
            res.forEach(function (vote) {
                voteIds.push(vote._id);
            });
            callback(err, voteIds);
        });
    },

    // get single vote
    getVoteByUserAndImage: function (userId, imageId, callback) {
        debug.log("getVote called");
        Vote.findOne({user: userId, image: imageId}, function (err, res) {
            callback(res);
        });
    },

    // delete vote
    deleteVote: function (voteId, callback) {
        debug.log("deleteVote called");
        Vote.remove({_id: id}, function (err, res) {
            callback(err, res);
        });
    },

    // check if user already voted on a picture
    hasUserVotedImage: function (userId, imageId, callback) {
        debug.log("hasUserVotedImage called");
        Vote.find({user: userId, image: imageId}, function (err, res) {
            callback(res.count > 0);
        });
    }
};