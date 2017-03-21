//here is the setup & logic for our socket communication
fs  = require('fs');
//external node modules
var Promise = require('bluebird');
var http = require('./main').http;
var app = require('./main').app;
var io = require('socket.io').listen(http);

//own logic modules
var debug = require('./debug');
var User = require("./controllers/user.js");
var Vote = require("./controllers/vote");
var Image = require("./controllers/image");


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
            if(nextVote == 'no-next-vote'){
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

    socket.on('pullImage', function (userId, token) {
        debug.log('images pulled from '+userId);
        //verify the accessToken
        User.validateAccessToken(token, userId).then(function () {
            //get the next image after the last image the user has recived
            return User.getLastImage(userId);
        }).then(function (lastImageId) {
            console.log('lastImageId '+lastImageId);
            return Image.getNextImage(lastImageId);
        }).then(function (nextImageId) {
            debug.log(nextImageId);
            if(nextImageId == 'no-next-image'){
                return new Promise(function (resolve, reject) {
                    reject('no-next-image');
                });
                //there is no next image
            } else {
                //read the file into a base64 string
                //put everthing with meta in a jason
                return Image.getImageWithSrc(nextImageId);
            }
        }).then(function (resultImageWithSrc) {
            return User.getNickname(resultImageWithSrc.creator).then(function (nickname) {
                //send the json to client
                var permNickname = nickname;
                var sendingres = { _id: resultImageWithSrc._id,
                    creator: resultImageWithSrc.creator,
                    creatorNickname: permNickname,
                    createDate: resultImageWithSrc.createDate,
                    active: resultImageWithSrc.active,
                    product: resultImageWithSrc.product,
                    filetype: resultImageWithSrc.filetype,
                    src: resultImageWithSrc.src,
                    __v: resultImageWithSrc.__v
                };
                socket.emit('deliverImage', sendingres, function (succesful) {
                    //wait for the succsess message

                    if(succesful){
                        //image successful send
                        //on success update last received image
                        //check if the are more images that are newer than the last one sended
                        //if no, stop right here
                        //if yes, repeat starting again with git

                        User.updateLastImage(userId, resultImageWithSrc._id);
                        console.log("image successful send");
                    } else{
                        //on failure try again, aswell increase the waiting time, limit the number of trys to 3
                        console.log("there was a error sending this image");
                    }
                });
            });


        }).catch(function (msg) {
            if (msg == 'no-next-image') {
                socket.emit('deliverImage', 'no-next-image', function () {});
                debug.log('No new Image -- deliverd');
            } else if(msg.includes('jwt')) {
                socket.emit('deliverImage', 'jwt-error', function () {});
            } else {
                debug.log('Error in pullImage:'+msg);
            }
        });
    });


});


