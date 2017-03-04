var Vote = require('./../models/vote');
var debug = require('./../debug');
var User = require('./../controllers/user');

module.exports = {
    // create vote 
    createVote: function (value, userId, imageId, token) {
        return new Promise(function (resolve, reject) {
                return User.validateAccessToken(token, userId).then(function () {
                    var vote = new Vote({
                        value: value,
                        dateCreated: new Date,
                        user: userId,
                        image: imageId
                    });
                    vote.save(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                });
        });

    },

    //get next vote
    getNextVote: function (voteId) {
        return new Promise(function (resolve, reject) {
            //check if image id is valid
            if (voteId == null) {
                debug.log('no last vote, falling back to get oldest valid vote');
                //if null, its probably a new user and we grab him a image max 7 days old
                var time = new Date;
                Vote.findOne({createDate: {$gt: time.addDays(-7)}}, {}).sort({createDate: 1}).exec(function (err, res) {
                    if (err) {
                        reject(err);
                    } else if (res == null) {
                        resolve('no-oldest-valid-vote-in-database');
                    } else {
                        debug.log('oldest vote found: ' + res._id);
                        resolve(res._id);
                    }
                });
            } else {
                debug.log('SERVER: Vote id before next: ' + voteId);
                Vote.findOne({_id: {$gt: voteId}}).sort({_id: 1}).exec(function (err, res) {
                    if (err) {
                        reject('error in getNextVote :' + err);
                    } else {
                        if (res == null) {
                            resolve('no-next-vote');
                        } else {
                            debug.log('SERVER: Vote id after next: ' + res._id);
                            resolve(res._id);
                        }

                    }
                });
            }
        });
    }

};