// restAPI.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app = require('./main').app;        // define our app using express
var bodyParser = require('body-parser');

//load other modules
var Promise = require('bluebird');
var userAsync = Promise.promisifyAll(require('./controllers/user'));
var picturesAsync = Promise.promisifyAll(require('./controllers/image'));
var pushNotification = require('./pushNotification');
var debug = require('./debug');
var sms = require('./smsService');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.post('/user/create', function (req, res){
    var data = req.body;
    userAsync.createUser(data.email, data.loginName, data.nickname, data.password, data.pushToken).then(function () {
        res.json({response: "success", success: true}); //resId == server id, localImageId == clint id to sender so he can assign the id
    })
});
// startVerify
router.post('/startVerify', function (req, res) {
    res.json({ message: 'hooray! welcome to our startVerify!' });

});
//checkVerify
router.post('/checkVerify', function (req, res) {
    res.json({ message: 'hooray! welcome to our checkVerify!' });

});
//newImage
router.post('/newImage', function (req, res) {
    var data = req.body;
    if (data.transmitternumber != null) {
        //we got an image form a sender
        userAsync.getUserIdFromPhonenumberAsync(data.transmitternumber).then(function (userId) {
            //we got the id of that sender
            debug.log("data.transmitternumber = " + data.transmitternumber + " ,userid = " + userId + ' uploaded a new image');
            return picturesAsync.createPictureAsync(data.imageData, userId, data.recipients);
        }).then(function (resId) {
            //send the sender(clint) a msg back, so he can add the correct server image id too
            var outgoing_image = {};
            outgoing_image._id = resId;
            outgoing_image.imageData = data.imageData;
            outgoing_image.transmitternumber = data.transmitternumber;
            //give the sender back the server id"
            res.json({ serverId: resId, localId: data.localImageId}); //resId == server id, localImageId == clint id to sender so he can assign the id
            debug.log('Image succsesful created and server id send back. The resId after createPicture was == ' + resId);
        }).then(function () {
            //send push notification to other clients that are offline
            //online clients will call a refresh to fetch the new image"
            return pushNotification.sendPush(users_offline_cache, "You got a new Image");
        }).catch(function (error) {
            //something in
            console.log('Creating Image Failed: ' + error);
        });
    }

});
//update
router.get('/update', function(req, res) {
    res.json({ message: 'hooray! welcome to our update!' });
});
//vote
router.post('/vote', function (req, res) {
    res.json({ message: 'hooray! welcome to our vote!'+ JSON.stringify(req.body)});

});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
