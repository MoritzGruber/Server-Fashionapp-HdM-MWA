var User = require('./../models/users');

module.exports = {
    // create user
    createUser: function (name, phoneNumber, profilePic) {
        var user = new User({
            _id: phoneNumber,
            name: name,
            profilePic: profilePic,
            appInstalled: false,
            score: 0,
            pictures: []
        });
        user.save(function (err, res) {
            if (err) throw err;
            console.log("User saved successfully!");
            console.log(res);
            return res._id;
        });
    },

    // get users
    getUsers: function () {
        User.find(function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // get all pictures of a user
    getPicturesOfUser: function(phoneNumber) {
        User.findOne({_id: phoneNumber}, function (err, res) {
            if (err) throw err;
            return res.pictures;
        });
    },

    // get all votes of a user
    getVotesOfUser: function(phoneNumber) {
        User.findOne({_id: phoneNumber}, function (err, res) {
            if (err) throw err;
            return res.votes;
        });
    },

    // update user
    updateUser: function (oldPhoneNumber, phonenumber, name, profilePic, appInstalled, score) {
        User.update({_id: {$eq: oldPhoneNumber}}, {
            $set: {
                _id: phonenumber,
                name: name,
                profilePic: profilePic,
                appInstalled: appInstalled,
                score: score
            }
        }, function (err, res) {
            if (err) throw err;
            console.log("Updated successfully");
            console.log(res);
        });
    },

    // delete user
    deleteUser: function (phoneNumber) {
        User.remove({_id: phoneNumber}, function (err, res) {
            if (err) throw err;
            console.log("User removed");
            console.log(res);
        });
    },

    // add picture to user
    addPictureToUser: function (picture, phoneNumber) {
        User.update({_id: phoneNumber}, {$push: {pictures: picture}}, function(err, res) {
            if (err) throw err;
            console.log("Picture added to User");
            console.log(res);
        });
    },

    // update picture from user
    updatePictureFromUser: function (oldSourcePath, sourcePath, owner, recipients, votes) {
        User.update({_id: owner, "pictures.src": oldSourcePath}, {$set: {"pictures.$.src": sourcePath, "pictures.$.user": owner, "pictures.$.recipients": recipients, "pictures.$.votes": votes}}, function(err, res) {
            if (err) throw err;
            console.log("Picture of User updated");
            console.log(res);
        });
    },

    // add vote to picture in user
    addVoteToPictureInUser: function (vote) {
        User.update({"pictures.src": vote.picture}, {$push: {"pictures.$.votes": vote}}, function(err, res) {
            if (err) throw err;
            console.log("Vote of Picture in User added");
            console.log(res);
        });
    },

    // delete picture from user
    deletePictureFromUser: function (sourcePath) {
        User.remove({"pictures.src": sourcePath}, function(err, res) {
            if (err) throw err;
            console.log(res);
        });
    },

    // add vote to user
    addVoteToUser: function (vote) {
        User.update({_id: vote.user}, {$push: {votes: vote}}, function(err, res) {
            if (err) throw err;
            console.log("Vote added to User");
            console.log(res);
        });
    },

    // update vote of user
    updateVoteOfUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        User.update({"vote.picture": oldPicture, "vote.user": oldUser, "vote.hasVotedUp": oldHasVotedUp}, {$set: {"vote.$.picture": oldPicture, "vote.$.user": oldUser, "vote.$.hasVotedUp": hasVotedUp}}, function (err, res) {
            if (err) throw err;
            console.log("Vote of User updated");
            console.log(res);
        });
    },

    // update vote of picture in user
    updateVoteOfPictureInUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp){
        User.update({"pictures.votes.picture": oldPicture, "pictures.votes.user": oldUser, "pictures.votes.hasVotedUp": oldHasVotedUp}, {$set: {"pictures.votes.$.picture": oldPicture, "pictures.votes.$.user": oldUser, "pictures.votes.$.hasVotedUp": hasVotedUp}}, function(err, res) {
            if (err) throw err;
            console.log("Vote of Picture in User updated");
            console.log(res);
        });
    },

    // delete vote of picture in user
    deleteVoteOfPictureInUser: function (picture, user) {
        User.update({"pictures.votes.picture": picture, "pictures.votes.user": user}, {$pull: {}}, function (err, res) {
            console.log("Vote of Picture in User removed");
            console.log(res);
        });
    },

    // delete vote of user
    deleteVoteOfUser: function (picture, user) {
        User.update({"votes.picture": picture, "votes.user": user}, {$pull: {}}, function (err, res) {
            console.log("Vote of User removed");
            console.log(res);
        });
    }
};