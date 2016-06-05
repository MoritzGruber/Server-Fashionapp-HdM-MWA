var Vote = require('./../models/votes');
var Picture = require('./pictures');
var User = require('./users');

module.exports = {
    // create vote 
    createVote: function (pictureId, user, hasVotedUp) {
        console.log("createVote called");
        console.log("createVote picId: " + pictureId);
        var vote = new Vote({
            picture: pictureId,
            user: user,
            hasVotedUp: hasVotedUp
        });
        vote.save(function (err, res) {
            if (err) throw err;
            // console.log("Vote saved successfully!");
            // console.log(res);
            return res._id;
        });
        Picture.addVoteToPicture(vote);
        User.addVoteToUser(vote);
    },

    // get votes
    getVotes: function () {
        console.log("getVotes called");
        Vote.find(function (err, result) {
            if (err) throw err;
            return result;
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
    deleteVote: function (picture, user) {
        console.log("deleteVote called");
        Vote.remove({picture: {$eq: picture}, user: {$eq: user}}, function (err) {
            if (err) throw err;
            // console.log("Vote removed");
        });
        Picture.deleteVoteFromPicture(picture, user);
        User.deleteVoteOfUser(picture, user);
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