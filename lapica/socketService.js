//here is the setup & logic for our socket communication

//external node modules 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//database 
var db = require('./models/db');
var users = require('./controllers/users');
var userXusers = require('./controllers/userXusers');
var pictures = require('./controllers/pictures');
var votes = require('./controllers/votes');

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
        debug.logusers();
    });
    //sharing images between all clients
    //if a new images comes in, every client gets the new image broadcasted
    socket.on('new_image', function (data) {
        callback = function (nullponiter, res) {
            //creating a new outgoing_image obj to cut overhead and reduce traffic
            var outgoing_image = {};
            outgoing_image._id = res;
            outgoing_image.imageData = data.imageData;
            outgoing_image.transmitternumber = data.transmitternumber;
            socket.broadcast.emit('incoming_image', outgoing_image);
            socket.emit('image_created', res, data.localImageId); //res == server id, localImageId == clint id to sender so he can assign the id
            pushNotification.sendPush(users_offline_cache, "Hey, " + data.transmitternumber + " uploaded a new image");
        };
        if (data.transmitternumber != null) {
            debug.log("getUserIdFromPhonenumber called in ln 119");
            users.getUserIdFromPhonenumber(data.transmitternumber, function (nullpointer, userid) {
                pictures.createPicture(data.imageData, userid, callback);
            });
        }
    });

    socket.on('new_user', function (number, token) {
        try {
            callback = function (nullponiter, res) {
                debug.log("signup: successful , user saved with id: " + res + "number: " + number + " token: " + token);
                socket.emit('signup', "success", number);
            };
            users.doesPhoneNumberExist(number, function (nullponiter, doesAlreadyExist) {
                if (doesAlreadyExist) {
                    socket.emit('signup', "Sorry, your name is already in use", number);
                } else {
                    //noName and noImage is just to fill this space, since this features aren't implemented yet
                    users.createUser("noName", number, "noImage", token, callback);
                }
            });
        } catch (e) {
            debug.log("signup: failed, err on new_user: " + e);
            socket.emit('signup', "Your name is already in use", number);
        }

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
            debug.log("getUserIdFromPhonenumber called in ln 161");
            users.getUserIdFromPhonenumber(user_number, function (nullpointer, userid) { //convert own number into id
                pictures.getRecentUnvotedPicturesOfUser(userid, timeForRefreshToBeConsideredAsRelevant, function (nullpointer, res) {
                    //sending every single found image
                    //this is goning to be a iterative loop function, so we wait until the first image is send and then send the second one
                    function sendSingleImage(i) {
                        users.getUserPhonenumberFromId(res[i].user, function (nullponiter, phoneNumberOfUser) { //convet sender id into number
                            var outgoing_image = {};
                            //outgoing_image._id = res[i]._id;
                            outgoing_image._id = res[i]._id;
                            outgoing_image.imageData = res[i].src;
                            outgoing_image.transmitternumber = phoneNumberOfUser;
                            socket.emit('incoming_image', outgoing_image);

                            if (res.length > i + 1) {
                                sendSingleImage(i + 1); //here iterative loop starts
                            }
                        });
                    }

                    //only if there is at least sth in the array we can send a image
                    if (res.length > 0) {
                        sendSingleImage(0);
                    }
                });
            });
        }

        //end updating community
        //updating collection (only the votes) (sending all votes as a whole package)
        function collectionUpdate() {
            votes.getVotesOfSomeSpesifcPictures(ownImages_ids_to_refresh, function (nullpointer, resListOfVotes) {
                //create formatted packge for clint, thats what we want to send the clint
                var packageArray = [];
                //loop over resListOfVotes
                //this is goning to be a iterative loop function
                function addAllObjectsToPackageArrayIterative(i) {
                    //transfer userId to user number (clint whats to know who is the acutal sender, (readable for humans))
                    users.getUserPhonenumberFromId(resListOfVotes[i].user, function (nullponiter, phoneNumberOfUser) {
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
                        } else {
                            //new we leave the iterative loop and our packageArray is filled, so we send it to client
                            socket.emit('vote_sent_from_server', packageArray);
                        }
                    });
                }

                //only if there is at least sth in the array
                if (resListOfVotes.length > 0) {
                    addAllObjectsToPackageArrayIterative(0);
                }
            });
        }

        //end of collection update
    });
    //end refresh

    //transfareing vote
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
        debug.logusers();
    });
});
