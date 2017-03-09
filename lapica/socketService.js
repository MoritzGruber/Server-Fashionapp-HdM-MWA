//here is the setup & logic for our socket communication

//external node modules
var Promise = require('bluebird');
var http = require('./main').http;
var app = require('./main').app;
var io = require('socket.io')(http);
io.set('origins', '*:*');
var random = require("random-js")();


//database 
var db = require('./models/db');
var usersAsync = Promise.promisifyAll(require('./controllers/user'));
var picturesAsync = Promise.promisifyAll(require('./controllers/image'));
var votesAsync = Promise.promisifyAll(require('./controllers/vote'));
var register = require('./controllers/register');
var banned = require('./controllers/banned');

//own logic modules 
var pushNotification = require('./pushNotification');
var debug = require('./debug');
var sms = require('./smsService');

//magic variables/numbers
//time when the images from other users are considered as irrelevant or outdated
var timeForRefreshToBeConsideredAsRelevant = 7200000 * 12; //1800000 == 30 min , 7200000 == 2 std * 12 = 24h

//array to store online/offline users, to send push notification later
var users_offline_cache = []; //just array of push tokens
var users_online_cache = []; //array of socketid and push tokens

//getting all tokens from the server
usersAsync.getTokensAsync().then(function (res) {
    users_offline_cache = res; //assigning array with all usertokens for pushnotifications
});


//get called if somebody connects via socket.io to our ip
io.on('connection', function (socket) {
    socket.on('join', function (data) {
        //if the joining user is currently in the offline list, we remove him
        var index = users_offline_cache.indexOf(data);
        if (index > -1) {
            users_offline_cache.splice(index, 1);
        }
        //mark users as online
        users_online_cache.push({
            'pushid': data,
            'socketid': socket.id
        });
        debug.logusers(users_online_cache, users_offline_cache);
    });
    //a new user registered at the welcome page
    socket.on('startVerify', function (number, token) {
        //check if number or token is blocked
        var smsCode;
        debug.log('A');
        banned.check(number, token).then(function () {
            //generate code
            debug.log('B');
            smsCode = random.integer(1, 9999);
            //save code
            return register.add(number, token, smsCode);
        }).then(function () {
            //send sms

            return sms.send(number, "Fittshot code: " + smsCode.toString());
        }).then(function () {
            register.checkForBan(number, token).catch(function (err) {
                debug.log("ERROR in register.checkForBan: " + err);
            });
        }).catch(function (err) {
            if (err == 'You are banned for 24h') {
                socket.emit('signup', 'You are banned for 24h', number);
            } else {

                debug.log('ERROR in socket startVerify: ' + err);
            }
        });
    });
    socket.on('checkVerify', function (number, token, code) {
        //check if code for that number and device is right
        debug.log('very check' + number + token + code);
        register.check(number, token, code).then(function () {
            //code right
            usersAsync.doesPhoneNumberExistAsync(number).then(function (doesAlreadyExist) {
                if (doesAlreadyExist) {
                    //user does already exist so we update
                    usersAsync.getUserIdFromPhonenumberAsync(number).then(function (resId) {
                        return usersAsync.updateUserAsync(resId, number, "noName", "noImage", true, 0, token);
                    });
                } else {
                    //that requested username is free
                    //noName and noImage is just to fill this space, since this features aren't implemented yet
                    return usersAsync.createUserAsync("noName", number, "noImage", token);
                }
            }).then(function () {
                //create user was successful and we got the id of the user so we send that clint a success msg and he can start using the app
                debug.log("signup: successful, number: " + number + " token: " + token);
                socket.emit('signup', "success", number);
            }).catch(function (error) {
                //catch if user does already exist and let client know
                if (error = "doesAlreadyExist") {
                    socket.emit('signup', "Sorry, your name is already in use", number);
                    debug.log("signup: failed, err on new_user: doesAlreadyExist");
                    return;
                }
                //sth unknown went went wrong
                debug.log("signup: failed, err on new_user: " + error);
                socket.emit('signup', "There was an error, try agian later.", number);
            });
        }).catch(function (err) {
            if (err == 'Wrong code') {
                debug.log(err);
                socket.emit('signup', 'Wrong code', number);
            } else {
                debug.log('Unable to verify  ' + err);
                socket.emit('signup', "Unable to verify that code", number);
            }
        });
    });
    //sharing images between all clients
    //if a new images comes in, every client gets the new image broadcasted
    socket.on('new_image', function (data) {
        if (data.transmitternumber != null) {
            //we got an image form a sender
            usersAsync.getUserIdFromPhonenumberAsync(data.transmitternumber).then(function (userId) {
                //we got the id of that sender
                debug.log("data.transmitternumber = " + data.transmitternumber + " ,userid = " + userId + ' uploaded a new image');
                return picturesAsync.createPictureAsync(data.imageData, userId, data.recipients);
            }).then(function (resId) {
                //send the sender(clint) a msg back, so he can add the correct server image id too
                var outgoing_image = {};
                outgoing_image._id = resId;
                outgoing_image.imageData = data.imageData;
                 outgoing_image.transmitternumber = data.transmitternumber;
                 //we send that image to all online clients via socket
                socket.broadcast.emit('incoming_image', outgoing_image);
                //give the sender back the server id
                socket.emit('image_created', resId, data.localImageId); //resId == server id, localImageId == clint id to sender so he can assign the id
                debug.log('Image succsesful created and server id send back. The resId after createPicture was == ' + resId);
            }).then(function () {
                //send push notification to other clients that are offline
                //online clients will call a refresh to fetch the new image
                return pushNotification.sendPush(users_offline_cache, "You got a new Image");
            }).catch(function (error) {
                //something in
                console.log('Creating Image Failed: ' + error);
            });
        }
    });


    //refresh call
    socket.on('user_refresh', function (user_number, update_trigger, ownImages_ids_to_refresh, community_imageIds) {
        //update_trigger is "community", "collection" or "profile"
        debug.log('user' + user_number + ' refreshed in ' + update_trigger);
        //the user should get the data first for that tab he is currently viewing
        if (update_trigger == "community") {
            communityUpdate();
            collectionUpdate();
        } else {
            //default
            collectionUpdate();
            communityUpdate();
        }

        function communityUpdate() {
            //updating Community (send single image by single image)
            usersAsync.getUserIdFromPhonenumberAsync(user_number).then(function (userid) {
                //getting User id from the phonenumber
                debug.log("User ID to refresh: "+ userid+ " and his community imageIds: "+community_imageIds);
                return picturesAsync.getRecentUnvotedPicturesOfUserAsync(userid, timeForRefreshToBeConsideredAsRelevant, community_imageIds);
            }).then(function (recentUnvotedPictureArray) {
                debug.log("found "+ recentUnvotedPictureArray.length +" unvoted pictures");
                //getting an array of unvoted picture
                //sending every single found image
                //this is goning to be a iterative loop function, so we wait until the first image is send and then send the second one
                function sendSingleImage(i) {
                    usersAsync.getUserPhonenumberFromIdAsync(recentUnvotedPictureArray[i].user).then(function (phoneNumberOfUser) { //convet sender id into number
                        //got the the phonenumber of that user id
                        var outgoing_image = {};
                        outgoing_image._id = recentUnvotedPictureArray[i]._id;
                        outgoing_image.imageData = recentUnvotedPictureArray[i].src;
                        outgoing_image.transmitternumber = phoneNumberOfUser;
                        debug.log('is image' + outgoing_image);
                        socket.emit('incoming_image', outgoing_image);
                        if (recentUnvotedPictureArray.length > i + 1) {
                            sendSingleImage(i + 1); //here iterative loop starts
                        }
                    }).catch(function (error) {
                        //handing the rejection one level higher
                        Promise.reject(error);
                    });
                }

                //only if there is at least sth in the array we can send a image
                if (recentUnvotedPictureArray.length > 0) {
                    sendSingleImage(0);
                }
            }).catch(function (error) {
                debug.log("Error in communityUpdate: " + error);
            });
        }

        //updating collection (only the votes) (sending all votes as a whole package)
        function collectionUpdate() {
            votesAsync.getVotesOfSomeSpesifcPicturesAsync(ownImages_ids_to_refresh).then(function (resListOfVotes) {
                //create formatted package for clint, this package what we want to send the clint
                var packageArray = [];
                //loop over resListOfVotes
                //this is goning to be a iterative loop function
                function addAllObjectsToPackageArrayIterative(i) {
                    //transfer userId to user number (clint whats to know who is the actual sender, (readable for humans))
                    usersAsync.getUserPhonenumberFromIdAsync(resListOfVotes[i].user).then(function (phoneNumberOfUser) {
                        //creating one single clint package
                        var packageObj = {};
                        packageObj._id = resListOfVotes[i].picture;
                        packageObj.rating = resListOfVotes[i].hasVotedUp;
                        packageObj.number = phoneNumberOfUser;
                        //adding this package now to the packageArray
                        packageArray.push(packageObj);
                        //if there are other votes left in the array, we call the current function again
                        if (resListOfVotes.length > i + 1) {
                            addAllObjectsToPackageArrayIterative(i + 1);
                        }
                    }).then(function () {
                        //new we leave the iterative loop and our packageArray is filled, so we send it to client
                        socket.emit('vote_sent_from_server', packageArray);
                    }).catch(function (error) {
                        //hand error one level up
                        Promise.reject(error);
                    });
                }

                //only if there is at least sth in the array
                if (resListOfVotes.length > 0) {
                    addAllObjectsToPackageArrayIterative(0);
                }
            }).catch(function (error) {
                debug.log("Error in collectionUpdate(): " + error);
            });
        }
    })
    ;

    //vote on an image
    socket.on('vote', function (data) {
        //data.number is number of the user that voted
        usersAsync.getUserIdFromPhonenumberAsync(data.number).then(function (userid) {
            return votesAsync.createVoteAsync(data._id, userid, data.rating);
        }).then(function () {
            //create successfully done...
            //so we can send the socket
            //the rest of the chain is for the push notification
            io.emit('vote_sent_from_server', data);
            return usersAsync.getUserIdFromPhonenumberAsync(data.recipient_number);
        }).then(function (res_recipient_id) {
            //got recipient id , searching for his token now
            return usersAsync.getUserTokenFromIdAsync(res_recipient_id);
        }).then(function (resToken) {

            //got token, sending a push notification to that token
            return pushNotification.sendPush(resToken, "Hey, " + data.number + " voted on your image!");
        }).catch(function (error) {
            debug.log("Error on vote socket function: " + error);
        });
    });

    //showing when somebody opens socket.io connection or closes
    debug.log('A new connection is now open with socket: ' + socket.id);
    socket.on('disconnect', function () {
        debug.log('A connection was closed with socket: ' + socket.id);
        //loop through online users, getting push id
        for (i = 0; i < users_online_cache.length; i++) {
            if (users_online_cache[i].socketid == socket.id) {
                //adding the found pushid back to offline users
                users_offline_cache.push(users_online_cache[i].pushid);
                //removeing from online list
                users_online_cache.splice(i, 1);
            }
        }
        debug.logusers(users_online_cache, users_offline_cache);
    });
});

