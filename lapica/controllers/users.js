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
        User.update({"pictures.src": oldSourcePath}, {$set: {src: sourcePath, owner: owner, recipients: recipients, votes: votes}}, function(err, res) {
            if (err) throw err;
            console.log("Picture of User updated");
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
    }
};