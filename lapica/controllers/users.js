var User = require('./../models/users');

module.exports = {
    // create user
    createUser: function (name, phoneNumber, profilePic, token, callback) {
        console.log("createUser called");
        var user = new User({
            phoneNumber: phoneNumber,
            name: name,
            profilePic: profilePic,
            appInstalled: false,
            score: 0,
            pictures: [],
            votes: [],
            token: token
        });
        user.save(function (err, res) {
            console.log("saveUser called");
            if (err) {
                console.error('ERROR: ', err);
            } else {
                console.log("user create success");
            }
            if (err) throw err;
            callback(null, res._id);
        });
    },

    // get users
    getUsers: function () {
        console.log("getUsers called");
        User.find(function (err, res) {
            if (err) throw err;
            return res;
        });
    },

    // get all tokens of the users
    getTokens: function (callback) {
        console.log("getTokens called");
        User.find()
            .select('token')
            .exec(function (err, res) {
                if (err) throw err;
                var tokens = [];
                res.forEach(function (element) {
                    tokens.push(element.token);
                });
                callback(null, tokens);
            });
    },

    // get userId from token
    getUserIdFromToken: function(token, callback) {
        console.log("getUserIdFromToken called");
        User.findOne({token: token}).exec(function(err, res) {
            if (err) throw err;
            callback(null, res._id);
        });
    },

    // get single users
    getUser: function (phoneNumber, callback) {
        console.log("getUsers called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // get user pictures of last x milliseconds
    getRecentPicturesOfUser: function (userId, timeDifference, callback) {
        console.log("getRecentPicturesOfUser called");
        var now = Date.now();
        console.log(now - timeDifference + " < x < " + now);
        User.findOne({_id: userId})
            .select('pictures').where('pictures.dateCreated').gt(now - timeDifference).lt(now)
            .exec(function (err, res) {
                if (res != null) {
                    callback(null, res.pictures);
                } else {
                    callback(null, []);
                }
            });
    },

    // get all pictures of a user
    getPicturesOfUser: function (phoneNumber) {
        console.log("getPicturesOfUser called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (err) throw err;
            return res.pictures;
        });
    },

    // get all votes of a user
    getVotesOfUser: function (phoneNumber) {
        console.log("getVotesOfUser called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (err) throw err;
            return res.votes;
        });
    },

    // add recipient to picture in user
    addRecipientToPictureInUser: function (userId, recipientId, pictureId, callback) {
        console.log("addRecipientToPictureInUser called");
        User.update({_id: userId, "pictures._id": pictureId}, {
            $push: {
                "pictures.$.recipients": recipientId
            }
        }, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // update user
    updateUser: function (oldPhoneNumber, phoneNumber, name, profilePic, appInstalled, score, token, callback) {
        console.log("updateUser called");
        User.update({phoneNumber: oldPhoneNumber}, {
            $set: {
                phoneNumber: phoneNumber,
                name: name,
                profilePic: profilePic,
                appInstalled: appInstalled,
                score: score,
                token: token
            }
        }, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // delete user
    deleteUser: function (phoneNumber) {
        console.log("deleteUser called");
        User.remove({phoneNumber: phoneNumber}, function (err, res) {
            if (err) throw err;
            // console.log("User removed");
            // console.log(res);
        });
    },

    // add picture to user
    addPictureToUser: function (picture, callback) {
        console.log("addPictureToUser called");
        User.update({_id: picture.user}, {$push: {pictures: picture}}, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // update picture from user
    updatePictureFromUser: function (phoneNumber, sourcePath, owner, recipients, votes, callback) {
        console.log("updatePictureFromUser called");
        User.update({phoneNumber: owner, "pictures.user": phoneNumber}, {
            $set: {
                "pictures.$.src": sourcePath,
                "pictures.$.user": owner,
                "pictures.$.recipients": recipients,
                "pictures.$.votes": votes
            }
        }, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // add vote to picture in user
    addVoteToPictureInUser: function (vote, callback) {
        console.log("addVoteToPictureInUser called");
        User.update({"pictures._id": vote.picture}, {$push: {"pictures.$.votes": vote}}, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // delete picture from user
    deletePictureFromUser: function (id) {
        console.log("deletePictureFromUser called");
        User.update({"pictures._id": id}, {$pull: {pictures: {_id: id}}}, function (err, res) {
            if (err) throw err;
            // console.log(res);
        });
    },

    // add vote to user
    addVoteToUser: function (vote, callback) {
        console.log("addVoteToUser called");
        User.update({_id: vote.user}, {$push: {votes: vote}}, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // update vote of user
    updateVoteOfUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        console.log("updateVoteOfUser called");
        User.update({
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
            // console.log("Vote of User updated");
            // console.log(res);
        });
    },

    // update vote of picture in user
    updateVoteOfPictureInUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        console.log("updateVoteOfPictureInUser called");
        User.update({
            "pictures.votes.picture": oldPicture,
            "pictures.votes.user": oldUser,
            "pictures.votes.hasVotedUp": oldHasVotedUp
        }, {
            $set: {
                "pictures.votes.$.picture": oldPicture,
                "pictures.votes.$.user": oldUser,
                "pictures.votes.$.hasVotedUp": hasVotedUp
            }
        }, function (err, res) {
            if (err) throw err;
            // console.log("Vote of Picture in User updated");
            // console.log(res);
        });
    },

    // delete vote of picture in user
    deleteVoteOfPictureInUser: function (picture, user) {
        console.log("deleteVoteOfPictureInUser called");
        User.update({$pull: {'picture.votes': {picture: picture, user: user}}}, function (err, res) {
            // console.log("Vote of Picture in User removed");
            // console.log(res);
        });
    },

    // delete vote of user
    deleteVoteOfUser: function (picture, user) {
        console.log("deleteVoteOfUser called");
        User.update({$pull: {votes: {picture: picture, user: user}}}, function (err, res) {
            // console.log("Vote of User removed");
            // console.log(res);
        });
    }
};