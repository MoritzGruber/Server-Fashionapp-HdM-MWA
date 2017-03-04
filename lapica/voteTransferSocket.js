
//external node modules
var Promise = require('bluebird');
var http = require('./main').http;
var app = require('./main').app;
var io = require('socket.io').listen(http);

//own logic modules
var debug = require('./debug');
var User = require("./controllers/user.js");
var Vote = require("./controllers/vote");


io.set('origins', '*:*');
io.sockets.on('connection', function (socket) {
    socket.on('pullVote', function (userId, token) {
        //verify the accessToken
        User.validateAccessToken(token, userId).then(function () {
            //get the next vote  after the last vote  the user has recived
            return User.getLastVote(userId);
        }).then(function (lastVoteId) {
                console.log('lastVoteId in vote socket '+lastVoteId);
                return Vote.getNextVote(lastVoteId);
        }).then(function (nextVote) {
            if(nextVoteId == 'no-next-vote'){
                return new Promise(function (resolve, reject) {
                        reject('no-next-vote');
                });
            } else {
                socket.emit('deliverVote', nextVote, function (succesful) {
                    //wait for the succsess message
                    if (succesful) {
                        //vote  successful send
                        //on success update last received vote
                        //check if the are more vote s that are newer than the last one sended
                        //if no, stop right here
                        //if yes, repeat starting again with git
                        User.updateLastVote(userId, nextVote._id);
                        console.log("vote successful sended");
                    } else {
                        //on failure try again, aswell increase the waiting time, limit the number of trys to 3
                        console.log("there was a error sending this vote");
                    }
                })
            }
        }).catch(function (msg) {
            debug.log('Error in pulling Vote: '+msg);
        });
    });

});


