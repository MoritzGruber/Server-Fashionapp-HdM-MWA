//here is the setup & logic for our socket communication

//external node modules
var Promise = require('bluebird');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//database 
var db = require('./models/db');
var users = require('./controllers/users');
var usersAsync = Promise.promisifyAll(require('./controllers/users'));
var userXusers = require('./controllers/userXusers');
var userXusersAsync = Promise.promisifyAll(require('./controllers/userXusers'));
var pictures = require('./controllers/pictures');
var picturesAsync = Promise.promisifyAll(require('./controllers/pictures'));
var votes = require('./controllers/votes');
var votesAsync = Promise.promisifyAll(require('./controllers/votes'));

//own logic modules 
var pushNotification = require('./pushNotification');
var debug = require('./debug');

//magic variables/numbers
//time when the images from other users are considered as irrelevant or outdated
var timeForRefreshToBeConsideredAsRelevant = 7200000; //1800000 == 30 min , 7200000 == 2 std

//array to store online/offline users, to send push notification later
var users_offline_cache = []; //just array of push tokens
var users_online_cache = []; //array of socketid and push tokens

//getting all tokens from the server
users.getTokens(function (nullpointer, res) {
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
        debug.log("New user joined ");
        debug.logusers(users_online_cache, users_offline_cache);
    });
    //sharing images between all clients
    //if a new images comes in, every client gets the new image broadcasted
    socket.on('new_image', function (data) {
        if (data.transmitternumber != null) {
            //we got an image form a sender
            usersAsync.getUserIdFromPhonenumberAsync(data.transmitternumber).then(function (userId) {
                //we got the id of that sender
                debug.log("data.transmitternumber = " + data.transmitternumber + " ,userid = " + userId);
                return picturesAsync.createPictureAsync(data.imageData, userId);
            }).then(function (resId) {
                //we created the image and got a resId, so we can add it to the outgoing image that we will be sending to all other clients
                var outgoing_image = {};
                outgoing_image._id = resId;
                outgoing_image.imageData = data.imageData;
                outgoing_image.transmitternumber = data.transmitternumber;
                //we send that image to all online clients via socket
                socket.broadcast.emit('incoming_image', outgoing_image);
                //send the sender(clint) a msg back, so he can add the correct server image id too
                socket.emit('image_created', resId, data.localImageId); //resId == server id, localImageId == clint id to sender so he can assign the id
                debug.log('Image send ! The redId after createPicture was == ' + resId);
            }).then(function () {
                //send push notification to other clients that are offline
                return pushNotification.sendPush(users_offline_cache, "Hey, " + data.transmitternumber + " uploaded a new image");
            }).catch(function (error) {
                //something in
                console.log('Creating Image Failed: ', error);
            });
        }
    });
    //a new user registered at the welcome page
    socket.on('new_user', function (number, token) {
        //new user registers at welocome screen
        usersAsync.doesPhoneNumberExistAsync(number).then(function (doesAlreadyExist) {
            if (doesAlreadyExist) {
                //username is already in use
                return Promise.reject("doesAlreadyExist");
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

    });

    //refresh call
    socket.on('user_refresh', function (user_number, update_trigger, ownImages_ids_to_refresh) {
        //update_trigger is "community", "collection" or "profile"
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
                return picturesAsync.getRecentUnvotedPicturesOfUserAsync(userid, timeForRefreshToBeConsideredAsRelevant);
            }).then(function (recentUnvotedPictureArray) {
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
                    usersAsync.getUserPhonenumberFromIdAsync(resListOfVotes[i].user).then( function (phoneNumberOfUser) {
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
                debug.log("Error in collectionUpdate(): "+error);
            });
        }
    })
    ;

    //vote on an image
    socket.on('vote', function (data) {
        //data.number is number of the user that voted
        debug.log("getUserIdFromPhonenumber called in ln 227 data = " + data);

        users.getUserIdFromPhonenumber(data.number, function (nullpointer, userid) {
            votes.createVote(data._id, userid, data.rating, function () {
                users.getUserIdFromPhonenumber(data.recipient_number, function (err, res_recipient_id) {
                    //got recipient id , searching for his token now
                    users.getUserTokenFromId(res_recipient_id, function (err, resToken) {
                        //got token, sending a push notification to that token
                        io.emit('vote_sent_from_server', data);
                        pushNotification.sendPush(resToken, "Hey, " + data.number + " voted on your image!");
                    });
                });
            });
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
})
;

//running the server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});
