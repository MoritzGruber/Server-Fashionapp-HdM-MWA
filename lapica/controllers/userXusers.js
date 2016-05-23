var UserXUser = require('./../models/userXusers');

module.exports = {
    // create userxuser
    createUserXUser: function (link, user, friend) {
        var userxuser = new UserXUser({
            link: link,
            user: user,
            friend: friend
        });
        userxuser.save(function (err, res) {
            if (err) throw err;
            console.log("UserXUser saved successfully!");
            console.log(res);
            return res._id;
        });
    },

    // get userxusers
    getUserXUsers: function () {
        UserXUser.find(function (err, res) {
            if (err) throw err;
            return res;
        });
    },

    // update userxuser
    updateUserXUser: function (oldLink, link, user, friend) {
        UserXUser.update({link: {$eq: oldLink}}, {$set: {link: link, user: user, friend: friend}}, function (err, res) {
            if (err) throw err;
            console.log("Updated successfully");
            console.log(res);
        });
    },

    // delete userxuser
    deleteUserXUser: function (link) {
        UserXUser.remove({link: link}, function (err, res) {
            if (err) throw err;
            console.log("UserXUser removed");
            console.log(res);
        });
    }
}