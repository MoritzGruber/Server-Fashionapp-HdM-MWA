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
            picture: []
        });
        user.save(function (err) {
            if (err) throw err;
            console.log("User saved successfully!");
        });
    },

    // get users
    getUsers: function () {
        User.find(function (err, result) {
            if (err) throw err;
            return result;
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
        }, function (err) {
            if (err) throw err;
            console.log("Updated successfully");
        });
    },

    // delete user
    deleteUser: function (phoneNumber) {
        User.remove({_id: phoneNumber}, function (err) {
            if (err) throw err;
            console.log("User removed");
        });
    },

    // add picture to user
    addPictureToUser: function (picture, phoneNumber) {
        User.update({_id: {$eq: phoneNumber}}, {
            $pushAll: {
                picture: [picture]
            }
        }, {upsert: true}, function(err) {
            console.log("Picture added to User");
        });
    },

    // delete picture from user
    // deletePictureFromUser: function (sourcePath) {
    //     User.find({"picture.src": {$eq: sourcePath}}, function(err) {
    //
    //     });
    // }
};