var Picture = require('./../models/pictures');
var User = require('./users');

module.exports = {
    // create picture
    createPicture: function (sourcePath, owner, recipients) {
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
            console.log(res);
            // User.addPictureToUser(picture, owner); i have removed id so the call of this function is causing a error
            return res._id;
        });
    },

    // get pictures
    getPictures: function () {
        Picture.find(function (err, res) {
            if (err) throw err;
            return res;
        });
    },

    // get single picture
    getPicture: function (sourcePath) {
        Picture.find({src: {$eq: sourcePath}}, function (err, res) {
            if (err) throw err;
            return res;
        });
    },

    // update picture
    updatePicture: function (oldSourcePath, sourcePath, owner, recipients, votes) {
        Picture.update({src: {$eq: oldSourcePath}}, {
            $set: {
                src: sourcePath,
                user: owner,
                recipients: recipients
            }
        }, function (err, res) {
            if (err) throw err;
            console.log("Updated successfully");
            console.log(res);
            User.updatePictureFromUser(oldSourcePath, sourcePath, owner, recipients, votes);
        });
    },

    // delete picture
    deletePicture: function (sourcePath) {
        Picture.remove({src: sourcePath}, function (err, res) {
            if (err) throw err;
            console.log("Picture removed");
            console.log(res);
            User.deletePictureFromUser(sourcePath);
        });
    },

    // add vote to picture
    addVoteToPicture: function (vote) {
        Picture.update({src: vote.picture}, {$push: {votes: vote}}, function(err, res) {
            if (err) throw err;
            console.log("Vote added to Picture");
            console.log(res);
            User.addVoteToPictureInUser(vote);
        });
    },

    // update vote of user
    updateVoteOfPicture: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        Picture.update({"vote.picture": oldPicture, "vote.user": oldUser, "vote.hasVotedUp": oldHasVotedUp}, {$set: {"vote.$.picture": oldPicture, "vote.$.user": oldUser, "vote.$.hasVotedUp": hasVotedUp}}, function(err, res) {
            if (err) throw err;
            console.log("Vote of Picture updated");
            console.log(res);
            User.updateVoteOfPictureInUser(oldPicture, oldUser, oldHasVotedUp, hasVotedUp);
        });
    },

    // delete vote from picture
    deleteVoteFromPicture: function (picture, user) {
        Picture.update({"votes.picture": picture, "votes.user": user}, {$pull: {}}, function (err, res) {
            if (err) throw err;
            console.log("Vote of Picture removed");
            console.log(res);
            User.deleteVoteOfPictureInUser(picture, user);
        });
    }
};