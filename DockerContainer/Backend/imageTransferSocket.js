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
var Image = require("./controllers/image");

io.sockets.on('connection', function (socket) {
    socket.on('pullImage', function (userId, token) {
        //verify the accessToken
        User.validateAccessToken(token, userId).then(function () {
            //get the next image after the last image the user has recived
            return User.getLastImage(userId);
        }).then(function (lastImageId) {
                console.log('lastImageId'+lastImageId);
                return Image.getNextImage(lastImageId);
        }).then(function (nextImageId) {
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

            //send the json to client
            socket.emit('deliverImage', resultImageWithSrc, function (succesful) {
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

        }).catch(function (msg) {
            debug.log('Error in pullImage:'+msg);
        });
    });

});


