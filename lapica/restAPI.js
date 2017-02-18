// restAPI.js
var db = require('./models/db');

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app = require('./main').app;        // define our app using express
var bodyParser = require('body-parser');

//load other modules
var Promise = require('bluebird');
//var userAsync = Promise.promisifyAll(require('./controllers/user'));
var User = require('./controllers/user');
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

// =============================================================================
// User
// =============================================================================
// register
router.post('/user/register', function (req, res){
    debug.log('user register api called');
    var data = req.body;
    User.createUser(data.email, data.loginName, data.nickname, data.password, data.pushToken).then(function () {
        res.json({response: "success", success: true}); //resId == server id, localImageId == clint id to sender so he can assign the id
    }).catch(function (msg) {
        res.json({response: msg, success: false}); //resId == server id, localImageId == clint id to sender so he can assign the id
    });
});
// login
router.post('/user/login', function (req, res) {
    debug.log('user login api called');
    User.authUser(req.body.email, req.body.loginName, req.body.password).then(function () {
        res.json({response: "success", success: true});
    }).catch(function (msg) {
        res.json({response: msg, success: false});
    });
});
// =============================================================================
// Image
// =============================================================================
// create
router.post('/image/create', function (req, res) {
    debug.log('image create api called');
    Image.createImage(req.body.creator, req.body.product, req.body.source).then(function () {
        res.json({response: "success", success: true});
    }).catch(function (msg) {
        res.json({response: msg, success: false});
    });
});
//newImage

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
