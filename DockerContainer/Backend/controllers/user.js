var User = require('./../models/user');
var crypto = require('crypto');
var debug = require('./../debug');
var db = require('./../models/db');
var jwt = require('jsonwebtoken');


var generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function (pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};

var validatePassword = function (plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};
var generateAccessToken = function (userId) {
    return jwt.sign(userId, db.secret, {expiresIn: "7d"});
};


module.exports = {
    test: function () {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    },
    // create user
    createUser: function (email, loginName, nickname, password, pushToken) {
        return new Promise(function (resolve, reject) {
            function createUser() {
                var newUser = new User({
                    email: email,
                    loginName: loginName,
                    nickname: nickname,
                    password: password,
                    banned: false,
                    lastLogin: null,
                    active: false,
                    registrationDate: new Date,
                    activationDate: null,
                    profilePicture: null,
                    pushToken: pushToken,
                    appInstalled: false,
                    score: 0
                });
                saltAndHash(password, function (hash) {
                    newUser.password = hash;
                    // append date stamp when record was created //
                    newUser.save(function (err, res) {
                        if (err) {
                            //catch dub key error
                            if (err.toString().indexOf('E11000') !== -1) {
                                resolve('user-already-exists');
                            } else {
                                reject(err);
                            }
                        } else {
                            resolve(res._id);
                        }
                    });
                });
            }

            //check if the collection exists
            db.mongoose.connection.db.listCollections({name: 'user'})
                .next(function (err, collinfo) {
                    if (collinfo) {
                        // The collection exists
                        User.findOne({loginName: loginName}, function (e, o) {
                            if (o) {
                                reject('username-taken');
                            } else {
                                User.findOne({email: email}, function (e, o) {
                                    if (o) {
                                        reject('email-taken');
                                    } else {
                                        createUser();
                                    }
                                });
                            }
                        });
                    } else {
                        createUser();
                    }
                });
        });
    },
    //authenticate or login with email or loginName with password
    authUser: function (email, loginName, password) {
        return new Promise(function (resolve, reject) {
            function validate(e, o) {
                if (o == null) {
                    debug.log('email und username' + email + loginName);
                    reject('user-not-found');
                } else {
                    validatePassword(password, o.password, function (err, res) {
                        debug.log('err validatePassword: '+err);
                        debug.log('res validatePassword: '+res);

                        if (res == true && err == null) {
                            var result = {
                                'email': o.email,
                                'loginName': o.loginName,
                                'nickname': o.nickname,
                                'id': o._id,
                                'token': generateAccessToken(o._id)
                            };
                            resolve(result);
                        } else {
                            reject('invalid-password');
                        }
                    });
                }
            }

            if (email == null || email == "" || email == undefined) {
                User.findOne({loginName: loginName}, function (e, o) {
                    validate(e, o);
                })
            } else {
                User.findOne({email: email}, function (e, o) {
                    validate(e, o);
                })
            }
        });
    },
    //validate Token
    validateAccessToken: function (hash, userId) {
        return new Promise(function (resolve, reject) {
            jwt.verify(hash, db.secret, function (err, decoded) {
                if (err) {
                    reject("accessToken-Error: " + err);
                } /*else if(decoded != userId){
                 reject("accessToken-Error: " + 'not matching');
                 } */ else {
                    resolve();
                }
            });
        })
    },
    getLastImage: function (userId) {
        return new Promise(function (resolve, reject) {
            //first find the user
            User.findOne({_id: userId}, function (err, res) {
                //console.log('in-getLast-Image-res');
                //console.log(res);
                if (err) {
                    reject('error in getLastImage:' + err);
                    //no last image set before, this is the initial process
                } else if (res == null) {
                    resolve(null);
                } else if (res.lastImage == undefined || res.lastImage == null) {

                    resolve(null);
                } else {
                    //user has a last image so we return this
                    resolve(res.lastImage);
                }
            });
        });
    },
    getNickname: function (userId) {
        return new Promise(function (resolve, reject) {
            //first find the user
            User.findOne({_id: userId}, function (err, res) {
                if (err) {
                    reject('error in getNickname:' + err);
                    //no nickname set before, this is the initial process
                } else if (res == null) {
                    resolve(null);
                } else if (res.lastImage == undefined || res.lastImage == null) {
                    resolve(null);
                } else {
                    resolve(res.nickname);
                }
            });
        });
    },
    updateLastImage: function (userId, imageId) {
        return new Promise(function (resolve, reject) {

            if (userId == null || userId == undefined || imageId == null || imageId == undefined) {
                debug.log('userId: '+userId + 'imageId: '+ imageId);
                reject('missing-params-in-updateLastImage')
            }
            User.update({_id: userId}, {$set: {lastImage: imageId}}, function (err, res) {
                if (err) {
                    reject('error in updateLastImage:' + err);
                } else {
                    resolve();
                }
            });
        });
    },
    getLastVote: function (userId) {
        return new Promise(function (resolve, reject) {
            User.findById(userId, function (err, res) {
                if (err) {
                    reject('error in getLastVote:' + err);
                } else if (res == null) {
                    resolve(null);
                } else if (res.lastVote == undefined || res.lastVote == null) {
                    resolve(null);
                } else {
                    resolve(res.lastVote);
                }
            });
        });
    },
    updateLastVote: function (userId, voteId) {
        return new Promise(function (resolve, reject) {
            if (userId == null || userId == undefined || voteId == null || voteId == undefined) {
                debug.log('userId: '+userId + 'voteId: '+ voteId);
                reject('missing-params-in-updateLastVote')
            }
            User.update({_id: userId}, {$set: {lastVote: voteId}}, function (err, res) {
                if (err) {
                    reject('error in updateLastVote:' + err);
                } else {
                    resolve(res.lastImage);
                }
            });
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