//here is the setup & logic for our socket communication
var dl  = require('delivery'),
    fs  = require('fs');

//external node modules
var Promise = require('bluebird');
var http = require('./main').http;
var app = require('./main').app;
var io = require('socket.io').listen(http);

//own logic modules
var debug = require('./debug');
var User = require("./controllers/user.js");


io.set('origins', '*:*');

io.sockets.on('pullImage', function (userId, token) {
    //verify the accessToken
    User.validateAccessToken(accessToken, userId).then(function () {
        //get the next image after the last image the user has recived
        return User.getLastImage(userId);
    }).then(function (currImageId) {
        return User.getNextImage(currImageId);
    }).then(function (nextImageId) {
        //send the clint the found image
            //read the file into a base64 string
            //put everthing with meta in a jason
            //send the json to client
        socket.emit({
            name: nextImageId +'.jpg',
            path : './storage/'+nextImageId+'.jpg',
            params: {foo: 'bar'}
        });
        //wait for the succsess message
        //on failure try again, aswell increase the waiting time, limit the number of trys to 3
        //on success update last recived image
        //check if the are more images that are newer than the last one sended
        //if no, stop right here
        //if yes, repeat starting at step 3
    }).catch(function (msg) {
        debug.log(6);

        debug.log('Error in pulling Image(delivery):'+msg);
    });





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

io.sockets.on('connection', function(socket){
    var delivery = dl.listen(socket);
    //pulling image from server
    delivery.on('delivery.connect',function(userId, accessToken){
        //check of accessToken is valid
        debug.log(2);
        debug.log(accessToken);





        //wait for response
        //check if there is another image
        // send the next image
        delivery.on('send.success',function(userId, imageId){
            // on succsess update the lastPulledImage in the user
            User.updateLastImage(userId, imageId).catch(function (err) {
                debug.log('error updating lastImage in send.success:'+err);
            })
        });

    });
});
/*
io.on('connection', function (socket) {
    socket.on('join', function () {
        debug.logusers('a new user joined to the socket');
    });
    //a new user registered at the welcome page
    socket.on('startPullImage', function (userId, accessToken) {
        return new Promise(function (resolve, reject) {
            var delivery = dl.listen(socket);
            delivery.on('delivery.connect',function(delivery){
                delivery.send({
                    name: 'sample-image.jpg',
                    path : './sample-image.jpg',
                    params: {foo: 'bar'}
                });

                delivery.on('send.success',function(){
                    console.log('File successfully sent to client!');
                    return User.updateLastImage(userId, imageId);
                });

            });

            return User.validateAccessToken(accessToken).then(function () {
                //safe the meta data about the image to the datebase with the src path

            }).catch(function (msg) {
                reject(msg);
            });
        });
    });
});
 */


