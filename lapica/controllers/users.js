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
            if(err) { console.error('ERROR: ', err); } else {
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
                res.forEach(function(element) {
                    tokens.push(element.token);
                });
                callback(null, tokens);
            });
    },

    // get single users
    getUser: function (id, callback) {
        console.log("getUsers called");
        User.findOne({_id: id}, function (err, res) {
            if (err) throw err;
            callback(null, res);
        });
    },

    // get user pictures of last x milliseconds
    getRecentPicturesOfUser: function (id, timeDifference, callback) {
        console.log("getRecentDataOfUser called");
        var now = Date.now();
        console.log(now - timeDifference + " < x < " + now);
        User.findOne({_id: id})
            .select('pictures').where('pictures.dateCreated').gt(now - timeDifference).lt(now)
            .exec(function (err, res) {
                if(res != null) {
                    callback(null, res.pictures);
                } else {
                    callback(null, []);
                }
            });
    },

    // get user votes of last x milliseconds
    getRecentVotesOfUser: function (id, timeDifference, callback) {
        console.log("getRecentDataOfUser called");
        var now = Date.now();
        console.log(now - timeDifference + " < x < " + now);
        User.findOne({_id: id})
            .select('votes').where('pictures.dateCreated').gt(now - timeDifference).lt(now)
            .exec(function (err, res) {
                if(res != null) {
                    callback(null, res.votes);
                } else {
                    callback(null, []);
                }
            });
    },

    // get all pictures of a user
    getPicturesOfUser: function (id) {
        console.log("getPicturesOfUser called");
        User.findOne({_id: id}, function (err, res) {
            if (err) throw err;
            return res.pictures;
        });
    },

    // get all votes of a user
    getVotesOfUser: function (id) {
        console.log("getVotesOfUser called");
        User.findOne({_id: id}, function (err, res) {
            if (err) throw err;
            return res.votes;
        });
    },

    // update user
    updateUser: function (id, phoneNumber, name, profilePic, appInstalled, score, token, callback) {
        console.log("updateUser called");
        User.update({_id: id}, {
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
    deleteUser: function (id) {
        console.log("deleteUser called");
        User.remove({_id: id}, function (err, res) {
            if (err) throw err;
            // console.log("User removed");
            // console.log(res);
        });
    },

    // add picture to user
    addPictureToUser: function (picture, id) {
        console.log("addPictureToUser called");
        User.update({_id: id}, {$push: {pictures: picture}}, function (err, res) {
            if (err) throw err;
            // console.log("Picture added to User");
            // console.log(res);
        });
    },

    // update picture from user
    updatePictureFromUser: function (id, sourcePath, owner, recipients, votes) {
        console.log("updatePictureFromUser called");
        User.update({_id: owner, "pictures._id": id}, {
            $set: {
                "pictures.$.src": sourcePath,
                "pictures.$.user": owner,
                "pictures.$.recipients": recipients,
                "pictures.$.votes": votes
            }
        }, function (err, res) {
            if (err) throw err;
            // console.log("Picture of User updated");
            // console.log(res);
        });
    },

    // add vote to picture in user
    addVoteToPictureInUser: function (vote) {
        console.log("addVoteToPictureInUser called");
        User.update({"pictures._id": vote.picture}, {$push: {"pictures.$.votes": vote}}, function (err, res) {
            if (err) throw err;
            // console.log("Vote of Picture in User added");
            // console.log(res);
        });
    },

    // delete picture from user
    deletePictureFromUser: function (id) {
        console.log("deletePictureFromUser called");
        User.remove({"pictures._id": id}, function (err, res) {
            if (err) throw err;
            // console.log(res);
        });
    },

    // add vote to user
    addVoteToUser: function (vote) {
        console.log("addVoteToUser called");
        User.update({_id: vote.user}, {$push: {votes: vote}}, function (err, res) {
            if (err) throw err;
            // console.log("Vote added to User");
            // console.log(res);
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
        User.update({"pictures.votes.picture": picture, "pictures.votes.user": user}, {$pull: {}}, function (err, res) {
            // console.log("Vote of Picture in User removed");
            // console.log(res);
        });
    },

    // delete vote of user
    deleteVoteOfUser: function (picture, user) {
        console.log("deleteVoteOfUser called");
        User.update({"votes.picture": picture, "votes.user": user}, {$pull: {}}, function (err, res) {
            // console.log("Vote of User removed");
            // console.log(res);
        });
    }
};