var User = require('./../models/users');

module.exports = {
    // create user
    createUser: function (name, phoneNumber, profilePic) {
        var user = new User({
            _id: phoneNumber,
            name: name,
            profilePic: profilePic,
            appInstalled: false,
            score: 0
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
    }
};