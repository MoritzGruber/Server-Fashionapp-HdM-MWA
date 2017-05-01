var Vote = require('./../models/vote');
var Image = require('./../controllers/image');
var debug = require('./../debug');
var User = require('./../controllers/user');




module.exports = {
    // create vote 
    createVote: function (value, userId, imageId, token) {
        console.log('value ' + value + imageId + ' userid ' +userId + ' token: ' + token);
        return new Promise(function (resolve, reject) {
                return User.validateAccessToken(token, userId).then(function () {
                    console.log('token works');
                    var vote = new Vote({
                        value: value,
                        createDate: new Date,
                        user: userId,
                        image: imageId
                    });
                    vote.save(function (err, res) {
                        if (err) {
                            console.log('save err');
                            reject(err);
                        } else {
                            console.log('save succ');
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
    },
    getImagesVotedOnByUser: function (userId) {
        return new Promise(function (resolve, reject) {
            var time = new Date;
            // , createDate: {$gt: time.addDays(-7)}
            Vote.find({user: userId, createDate: {$gt: time.addDays(-7)}}).select('image').exec(function (err, res) {
                if(err) {
                    reject(err);
                } else {
                    if(res != undefined){
                        var resArray = [];
                        for(var i = 0; i < res.length; i++){
                            resArray.push(res[i].image);
                        }
                        resolve(resArray);
                    }else {
                        resolve([]);
                    }
                }
            });
        });

    },
    getAllVotesForOneUser: function (userId) {
        return new Promise(function (resolve, reject) {
            return Image.getOwnImagesOfAUser(userId).then(function (resIds) {
                var returnArray = [];
                for (var i = 0; i < resIds.length; i++) {
                    returnArray[i]={image: resIds[i], voting: [0, 0]};
                    Vote.find({image: resIds[i]}).select('value').exec(function (err, res) {
                        if(err) {
                           debug.log(err);
                           reject(err);
                       } else {
                           if(res != undefined){
                               for(var j = 0; j < res.length; j++){
                                   if(res[j].value == true){
                                       returnArray[i].voting[0] += 1;
                                   } else {
                                       returnArray[i].voting[1] += 1;
                                   }
                               }
                           }
                       }
                   });
                }
                resolve(returnArray);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            })
                    
        });
    }

};