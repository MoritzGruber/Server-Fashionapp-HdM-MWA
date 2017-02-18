var user = require('./../models/user');
var crypto = require('crypto');
var debug = require('./../debug');

var generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback)
{
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};
module.exports = {
    // create user
    createUser: function (email, loginName, nickname, password, pushToken, callback) {
        debug.log("createUser called");
        user.findOne({loginName:loginName}, function(e, o) {
            if (o){
                callback('username-taken');
            }	else{
                user.findOne({email:email}, function(e, o) {
                    if (o){
                        callback('email-taken');
                    }	else{
                        var newUser = new User({
                            email: email,
                            loginName: loginName,
                            nickname: nickname,
                            password: password,
                            banned: false,
                            lastLogin: null,
                            active: false,
                            registrationDate: new Date.now(),
                            activationDate: null,
                            profilePicture: null,
                            pushToken: pushToken,
                            appInstalled: false,
                            score: 0
                        });
                        saltAndHash(password, function(hash){
                            newUser.password = hash;
                            // append date stamp when record was created //
                            user.save(function (err, res) {
                                if (err) throw err;
                                callback(err, res._id);
                            });
                        });
                    }
                });
            }
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
    // get userId form phonenumber
    getUserIdFromPhonenumber: function (phoneNumber, callback) {
        debug.log("getUserIdFromPhonenumber called");
        User.findOne({phoneNumber: phoneNumber}, function (err, res) {
            if (res == null) {
                callback("That number does not exist", res);
            } else {
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
        debug.log("getUserPhonenumberFromId called with user id: " + userid);
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

    // create admin user
    createAdminUser: function (phoneNumber, callback) {
        debug.log("createAdminUser called");
        var user = new User({
            phoneNumber: phoneNumber,
            name: 'admin',
            profilePic: 'empty',
            appInstalled: false,
            score: 0,
            pictures: [],
            votes: [],
            token: 'ökljaflasjdlfdsajflasjflajasdjfllasjdf'
        });
        user.save(function (err, res) {
            debug.log("saveAdminUser called");
            if (err) {
                console.error('ERROR: ', err);
            } else {
                debug.log("admin user create success");
            }
            callback(res._id);
        });
    }
};