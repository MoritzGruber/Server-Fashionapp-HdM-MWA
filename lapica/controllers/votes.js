var Vote = require('./../models/votes');

module.exports = {
    // create vote
    createVote: function (picture, user, hasLiked) {
        var vote = new Vote({
            picture: picture,
            user: user,
            hasVotedUp: hasLiked
        });
        vote.save(function (err) {
            if (err) throw err;
            console.log("Vote saved successfully!");
        });
    },

    // get votes
    getVotes: function () {
        Vote.find(function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // update vote
    updateVote: function (oldPicture, oldUser, oldHasVotedUp, picture, user, hasVotedUp) {
        Vote.update({
            picture: {$eq: oldPicture},
            user: {$eq: oldUser},
            hasVotedUp: {$eq: oldHasVotedUp}
        }, {$set: {picture: picture, user: user, hasVotedUp: hasVotedUp}}, function (err) {
            if (err) throw err;
            console.log("Updated successfully");
        });
    },

    // delete vote
    deleteVote: function (picture, user) {
        Vote.remove({picture: {$eq: picture}, user: {$eq: user}}, function (err) {
            if (err) throw err;
            console.log("Vote removed");
        });
    },

    // check if user already voted a picture
    hasUserVotedPicture: function (user, picture) {
        Vote.find({user: {$eq: user}, picture: {$eq: picture}}, function (err, result) {
            if (err) throw err;
            return (result.count > 0)
        });
    }
}