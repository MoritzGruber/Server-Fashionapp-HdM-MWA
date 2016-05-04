var UserXUser = require('./../models/userXusers');

module.exports = {
    // create userxuser
    createUserXUser: function (link, user, friend) {
        var userxuser = new UserXUser({
            link: link,
            user: user,
            friend: friend
        });
        userxuser.save(function (err) {
            if (err) throw err;
            console.log("UserXUser saved successfully!");
        });
    },

    // get userxusers
    getUserXUsers: function () {
        UserXUser.find(function (err, result) {
            if (err) throw err;
            return result;
        });
    },

    // update userxuser
    updateUserXUser: function (oldLink, link, user, friend) {
        UserXUser.update({link: {$eq: oldLink}}, {$set: {link: link, user: user, friend: friend}}, function (err) {
            if (err) throw err;
            console.log("Updated successfully");
        });
    },

    // delete userxuser
    deleteUserXUser: function (link) {
        UserXUser.remove({link: link}, function (err) {
            if (err) throw err;
            console.log("UserXUser removed");
        });
    }
}