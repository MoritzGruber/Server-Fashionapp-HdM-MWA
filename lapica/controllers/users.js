var User = require('./../models/users');
var debug = require('./../debug');
module.exports = {
    // create user
    createUser: function (name, phoneNumber, profilePic, token, callback) {
        debug.log("createUser called");
        var user = new User({
            phoneNumber: phoneNumber,
            name: name,
            profilePic: profilePic,
            appInstalled: true,
            score: 0,
            pictures: [],
            votes: [],
            token: token
        });
        user.save(function (err, res) {
            debug.log("saveUser called");
            if (err) {
                console.error('ERROR: ', err);
            } else {
                debug.log("user create success");
            }
            callback(null, res._id);
        });
    },
    //check if there is already a user with that number, so we can prevent dublicate errors in our mongo db
    doesPhoneNumberExist: function (phoneNumber, callback) {
        User.count({phoneNumber: phoneNumber}, function (err, res) {
            if (res > 0) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    // get users
    getUsers: function () {
        debug.log("getUsers called");
        User.find(function (err, res) {
            return res;
        });
    },
    // get users ids
    getUsersIds: function (callback) {
        debug.log("getUsersIds called");
        User.find(function (err, res) {
            if (err) callback(err);
            callback(res._id);
            return res._id;
        });
    },
    // get all tokens of the users
    getTokens: function (callback) {
        debug.log("getTokens called");
        User.find()
            .select('token')
            .exec(function (err, res) {
                var tokens = [];
                res.forEach(function (element) {
                    tokens.push(element.token);
                });
                callback(err, tokens);
            });
    },

    // get userId from token
    getUserIdFromToken: function (token, callback) {
        debug.log("getUserIdFromToken called");
        User.findOne({token: token}).exec(function (err, res) {
            callback(err, res._id);
        });
    },
    // get token from userId
    getTokenFromUserId: function (userId, callback) {
        debug.log("getTokenFromUserId called");
        User.findOne({_id: userId}).exec(function (err, res) {
            callback(err, res.token);
        });
    },
    // get userId form phonenumber
    getUserIdFromPhonenumber: function (phoneNumber, callback) {
        debug.log("getUserIdFromPhonenumber called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (res == null){
              callback("That number does not exist", res);
            }else{
            callback(err, res._id);
              
            }
        });
    },
    // get single users
    getUser: function (phoneNumber, callback) {
        debug.log("getUsers called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            callback(err, res);
        });
    },
    //get user phonenumber from id
    getUserPhonenumberFromId: function (userid, callback) {
        debug.log("getUserPhonenumberFromId called");
        User.findOne({_id: userid}, function (err, res) {
            callback(err, res.phoneNumber);
        });
    },
    //get user toke from id
    getUserTokenFromId: function (userid, callback) {
        debug.log("getUserTokenFromId called");
        User.findOne({_id: userid}, function (err, res) {
            callback(err, res.token);
        });
    },


    // get user pictures of last x milliseconds
    getRecentPicturesOfUser: function (userId, timeDifference, callback) {
        debug.log("getRecentPicturesOfUser called");
        var now = Date.now();
        debug.log(now - timeDifference + " < x < " + now);
        User.findOne({_id: userId})
            .select('pictures').where('pictures.dateCreated').gt(now - timeDifference).lt(now)
            .exec(function (err, res) {
                if (res != null) {
                    callback(err, res.pictures);
                } else {
                    callback(err, []);
                }
            });
    },

    // get all pictures of a user
    getPicturesOfUser: function (phoneNumber) {
        debug.log("getPicturesOfUser called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (err) callback(err);
            return res.pictures;
        });
    },

    // get all votes of a user
    getVotesOfUser: function (phoneNumber) {
        debug.log("getVotesOfUser called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (err) callback(err);
            return res.votes;
        });
    },

    // add recipient to picture in user
    addRecipientToPictureInUser: function (userId, recipientId, pictureId, callback) {
        debug.log("addRecipientToPictureInUser called");
        User.update({_id: userId, "pictures._id": pictureId}, {
            $push: {
                "pictures.$.recipients": recipientId
            }
        }, function (err, res) {
            callback(err, res);
        });
    },

    // update user
    updateUser: function (id, phoneNumber, name, profilePic, appInstalled, score, token, callback) {
        debug.log("updateUser called");
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
            callback(err, res);
        });
    },

    // delete user
    deleteUser: function (id, callback) {
        debug.log("deleteUser called");
        User.remove({_id: id}, function (err, res) {
            debug.log("User " + id + " removed");
            callback(err, res);
        });
    },

    // add picture to user
    addPictureToUser: function (picture, callback) {
        debug.log("addPictureToUser called");
        User.update({_id: picture.user}, {$push: {pictures: picture}}, function (err, res) {
            callback(err, res);
        });
    },

    // update picture from user
    updatePictureFromUser: function (phoneNumber, sourcePath, owner, recipients, votes, callback) {
        debug.log("updatePictureFromUser called");
        User.update({phoneNumber: owner, "pictures.user": phoneNumber}, {
            $set: {
                "pictures.$.src": sourcePath,
                "pictures.$.user": owner,
                "pictures.$.recipients": recipients,
                "pictures.$.votes": votes
            }
        }, function (err, res) {
            callback(err, res);
        });
    },

    // add vote to picture in user
    addVoteToPictureInUser: function (vote, callback) {
        debug.log("addVoteToPictureInUser called");
        User.update({"pictures._id": vote.picture}, {$push: {"pictures.$.votes": vote}}, function (err, res) {
            callback(err, res);
        });
    },

    // delete picture from user
    deletePictureFromUser: function (id, callback) {
        debug.log("deletePictureFromUser called");
        User.update({"pictures._id": id}, {$pull: {pictures: {_id: id}}}, function (err, res) {
            callback(err, res);
        });
    },

    // add vote to user
    addVoteToUser: function (vote, callback) {
        debug.log("addVoteToUser called");
        User.update({_id: vote.user}, {$push: {votes: vote}}, function (err, res) {
            callback(err, res);
        });
    },

    // update vote of user
    updateVoteOfUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        debug.log("updateVoteOfUser called");
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
            // debug.log("Vote of User updated");
            // debug.log(res);
        });
    },

    // update vote of picture in user
    updateVoteOfPictureInUser: function (oldPicture, oldUser, oldHasVotedUp, hasVotedUp) {
        debug.log("updateVoteOfPictureInUser called");
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
            // debug.log("Vote of Picture in User updated");
            // debug.log(res);
        });
    },

    // delete vote of picture in user
    deleteVoteOfPictureInUser: function (id, callback) {
        debug.log("deleteVoteOfPictureInUser called");
        User.update({$pull: {'picture.votes': {_id: id}}}, function (err, res) {
            callback(err, res);
        });
    },

    // delete vote of user
    deleteVoteOfUser: function (id, callback) {
        debug.log("deleteVoteOfUser called");
        User.update({$pull: {votes: {_id: id}}}, function (err, res) {
            callback(err, res);
        });
    }
};