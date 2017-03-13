var UserXUser = require('./../models/userXusers');
var debug = require('./../debug');
module.exports = {
    // create userxuser
    createUserXUser: function (link, user, friend) {
        debug.log("createUserxUser called");
        var userxuser = new UserXUser({
            link: link,
            user: user,
            friend: friend
        });
        userxuser.save(function (err, res) {
            if (err) callback(err, res);
            // debug.log("UserXUser saved successfully!");
            // debug.log(res);
            return res._id;
        });
    },

    // get userxusers
    getUserXUsers: function () {
        debug.log("getUserXUsers called");
        UserXUser.find(function (err, res) {
            if (err) throw err;
            return res;
        });
    },

    // update userxuser
    updateUserXUser: function (oldLink, link, user, friend) {
        debug.log("updateUserXUser called");
        UserXUser.update({link: {$eq: oldLink}}, {$set: {link: link, user: user, friend: friend}}, function (err, res) {
            if (err) throw err;
            // debug.log("Updated successfully");
            // debug.log(res);
        });
    },

    // delete userxuser
    deleteUserXUser: function (link) {
        debug.log("deleteUserXUser called");
        UserXUser.remove({link: link}, function (err, res) {
            if (err) throw err;
            // debug.log("UserXUser removed");
            // debug.log(res);
        });
    }
};