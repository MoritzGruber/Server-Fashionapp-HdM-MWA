// Main Node APP 
// here all comes together 

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

//database setup, files linking
var db = require('./models/db');
var users = require('./controllers/users');
var userXusers = require('./controllers/userXusers');
var pictures = require('./controllers/pictures');
var votes = require('./controllers/votes');
//just fore debugging
var util = require('util');



//initialzing users array to recive push notifications
//online users have a open socket connection to us
//at server start every user is offline.
users.getTokens(function(nullpointer, res) {
	users_offline_cache = res; //assigning array with all usertokens for pushnotifications
});
//array to store online users sockets with there push notifications
var users_online_cache = [];
//debug
logusers = function() {
	setTimeout(function() {
		console.log("Users Online: " + users_online_cache.length + " Users Offlien: " + users_offline_cache.length);
	}, 1000);
};


//for onsignal push notifications
var request = require('request');
var sendPush = function(device, message) {
	var restKey = 'Y2FjNTVlYzMtODA1NC00N2I2LWE4NjctOTM4MWMzODJmMTAw';
	var appID = 'f132b52a-4ebf-4446-a8e0-b031f40074da';
	request({
			method: 'POST',
			uri: 'https://onesignal.com/api/v1/notifications',
			headers: {
				"authorization": "Basic " + restKey,
				"content-type": "application/json"
			},
			json: true,
			body: {
				'app_id': appID,
				'contents': {
					en: message
				},
				//'data': {picture: imagedata},  --> over 3500 byte error(limt of push notification) so we can just send a message and have to load the data with socket when socket is connected.
				'include_player_ids': Array.isArray(device) ? device : [device]
			}
		},
		function(error, response, body) {
			if (!body.errors) {
				console.log(body);
			} else {
				console.error('Error:', body.errors);
			}

		}
	);
};

//get called if somebody connects via socket.io to our ip
io.on('connection', function(socket) {
	socket.on('join', function(data) {
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
		console.log("New user joined ");
		logusers();
	});
	//sharing images between all clients
	//if a new images comes in, every client gets the new image broadcasted
	socket.on('new_image', function(data) {
		callback = function(nullponiter, res) {
			//creating a new outgoing_image obj to cut overhead and reduce traffic
			var outgoing_image = {};
			outgoing_image._id = res;
			outgoing_image.imageData = data.imageData;
			outgoing_image.transmitternumber = data.transmitternumber;
			socket.broadcast.emit('incoming_image', outgoing_image);
			socket.emit('image_created', res, data.localImageId); //res == server id, localImageId == clint id to sender so he can assign the id
			sendPush(users_offline_cache, "Hey, "+data.transmitternumber+" uploaded a new image");
		};
		if (data.transmitternumber != null) { //TODO: and number exist here
			users.getUserIdFromPhonenumber(data.transmitternumber, function(nullpointer, userid) {
				pictures.createPicture(data.imageData, userid, callback);
			});
		}
	});

	socket.on('new_user', function(number, token) {
		try {
			callback = function(nullponiter, res) {
				console.log("signup: successful , user saved with id: " + res + "number: " + number + " token: " + token);
				socket.emit('signup', "success", number);
			};
			users.doesPhoneNumberExist(number, function(nullponiter, doesAlreadyExist) {
				if (doesAlreadyExist) {
					socket.emit('signup', "Sorry, your name is already in use", number);
				} else {
					users.createUser("noName", number, "noImage", token, callback);
				}
			});
		} catch (e) {
			console.log("signup: failed, err on new_user: " + e);
			//TODO:Tell the user what to do better next time
			socket.emit('signup', "Your name is already in use", number);
		}

	});
	//refresh call
	socket.on('user_refresh', function(user_number, update_trigger, ownImages_ids_to_refresh) {
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
			users.getUserIdFromPhonenumber(user_number, function(nullpointer, userid) { //convert own number into id
				//1800000 == 30 min , 7200000 == 2 std
				pictures.getRecentUnvotedPicturesOfUser(userid, 7200000, function(nullpointer, res) {
					//sending every single found image
					//this is goning to be a iterative loop function
					function sendSingleImage(i) {
						users.getUserPhonenumberFromId(res[i].user, function(nullponiter, phoneNumberOfUser) { //convet sender id into number
							var outgoing_image = {};
							//outgoing_image._id = res[i]._id;
							outgoing_image._id = res[i]._id;
							outgoing_image.imageData = res[i].src;
							outgoing_image.transmitternumber = phoneNumberOfUser;
							socket.emit('incoming_image', outgoing_image);

							if (res.length > i + 1) {
								sendSingleImage(i + 1);
							}
						});
					}
					if (res.length > 0) {
						sendSingleImage(0);
					}
				});
			});
		}
		//end updating community
		//updating collection (only the votes) (sending all votes as a whole package)
		function collectionUpdate() {
			votes.getVotesOfSomeSpesifcPictures(ownImages_ids_to_refresh, function(nullpointer, resListOfVotes) {
				//create formatted packge for clint, thats what we want to send the clint
				var packageArray = [];
				//loop over resListOfVotes
				//this is goning to be a iterative loop function
				function addAllObjectsTopackageArrayIterativ(i) {
					//transfer userId to user number (clint whats to know who is the acutal sender, (readable for humans))
					users.getUserPhonenumberFromId(resListOfVotes[i].user, function(nullponiter, phoneNumberOfUser) {
						//creating one single clint package
						var packageObj = {};
						packageObj._id = resListOfVotes[i].picture;
						packageObj.rating = resListOfVotes[i].hasVotedUp;
						packageObj.number = phoneNumberOfUser;
						//adding this package now to the packageArray
						packageArray.push(packageObj);
						//if there are other votes left in the array, we call the current function again
						if (resListOfVotes.length > i + 1) {
							addAllObjectsTopackageArrayIterativ(i + 1);
						} else {
							//new we leave the iterative loop and our packageArray is filled, so we send it
							socket.emit('vote_sent_from_server', packageArray);
						}
					});
				}
				//only if there is atleast sth
				if (resListOfVotes.length > 0) {
					addAllObjectsTopackageArrayIterativ(0);
				}
			});
		}
		//end of collection update
	});
	//end refresh

	//transfareing vote
	socket.on('vote', function(data) {
		//data.number is number of the user that voted
		users.getUserIdFromPhonenumber(data.number, function(nullpointer, userid) {
			votes.createVote(data._id, userid, data.rating, function() {
				users.getUserIdFromPhonenumber(data.recipient_number, function(err, res_recipient_id){
					//res = recipient id , searching for his token noew
					users.getUserTokenFromId(res_recipient_id, function(err, resToken){
						//res == token, sending a push notification to that token
							io.emit('vote_sent_from_server', data);
						 sendPush(resToken, "Hey, "+data.number+" voted on your image!");
						//TODO: Only send a push notification if he is offline ==> if else here, whith online and offline users
					});
				});
			});
		});
	});


	//showing when somebody opens socket.io connection or closes
	console.log('A new connection is now open with socket: ' + socket.id);
	socket.on('disconnect', function() {
		console.log('A connection was closed with socket: ' + socket.id);
		//loop through offline users, getting push id
		for (i = 0; i < users_online_cache.length; i++) {
			if (users_online_cache[i].socketid == socket.id) {
				//adding the found pushid back to offline users
				users_offline_cache.push(users_online_cache[i].pushid);
				//removeing from online list
				users_online_cache.splice(i, 1);
			}
		}
		logusers();
	});
});

//normal http server, we attach socket.io to this
http.listen(3000, function() {
	console.log('listening on *:3000');
});
