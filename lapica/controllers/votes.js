var Vote = require('./../models/votes');
var Picture = require('./pictures');
var User = require('./users');

module.exports = {
    // create vote 
    createVote: function (pictureId, userId, hasVotedUp, callback) {
        console.log("createVote called");
        var vote = new Vote({
            picture: pictureId,
            user: userId,
            hasVotedUp: hasVotedUp,
            dateCreated: Date.now()
        });
        vote.save(function (err, res) {
            if (err) throw err;
            var voteId = res._id;
            Picture.addVoteToPicture(vote, function (err, res) {
                if (err) throw err;
                User.addVoteToUser(vote, function (err, res) {
                    if (err) throw err;
                    callback(null, voteId);
                });
            });
        });
    },

    // get votes
    getVotes: function () {
        console.log("getVotes called");
        Vote.find(function (err, result) {
            if (err) throw err;
            return result;
        });
    },
    // get some spesific votes
    getVotesOfSomeSpesifcPictures: function (arrayOfPictureids, callback) {
        console.log("getVotesOfSomeSpesifcPictures called");
        Vote.find()
            .where('picture').in(arrayOfPictureids)
            .exec(function (err, res) {
                if (res != null) {
                    callback(null, res);
                } else {
                    callback(null, []);
                }
            });
    },

    // get single vote
    getVote: function (picture, user) {
        console.log("getVote called");
        Vote.find({picture: {$eq: picture}, user: {$eq: user}}, function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // update vote
    updateVote: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        console.log("updateVote called");
        Vote.update({
            picture: {$eq: oldPicture},
            user: {$eq: oldUser},
            hasVotedUp: {$eq: oldHasVotedUp}
        }, {$set: {picture: oldPicture, user: oldUser, hasVotedUp: hasVotedUp}}, function (err, res) {
            if (err) throw err;
            // console.log("Updated successfully");
            // console.log(res);
        });
        Picture.updateVoteOfPicture(oldPicture, oldUser, oldHasVotedUp, hasVotedUp);
        User.updateVoteOfUser(oldPicture, oldUser, oldHasVotedUp, hasVotedUp);
    },

    // delete vote
    deleteVote: function (id, callback) {
        console.log("deleteVote called");
        Vote.remove({_id: id}, function (err) {
            if (err) throw err;
            Picture.deleteVoteFromPicture(id, function (err, res) {
                User.deleteVoteOfUser(id, function (err, res) {
                    callback(null, res);
                });
            });
        });
    },

    // check if user already voted a picture
    hasUserVotedPicture: function (user, picture) {
        console.log("hasUserVotedPicture called");
        Vote.find({user: {$eq: user}, picture: {$eq: picture}}, function (err, result) {
            if (err) throw err;
            return (result.count > 0)
        });
    }
};