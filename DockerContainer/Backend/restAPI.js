// restAPI.js
var db = require('./models/db');
var Image = require('./controllers/image');
var Vote = require('./controllers/vote');
var formidable = require('formidable');

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

Image.test().then(function (res) {
    console.log('test succ');
}).catch(function (err) {
    console.log('test err');
});

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
    debug.log('user login api called with body: ' + JSON.stringify(req.body ));
    User.authUser(req.body.email, req.body.loginName, req.body.password).then(function (userObject) {
        debug.log('user login successful');
        res.json({response: "success", success: true, token: userObject.token,
            email: userObject.email, id: userObject.id, loginName: userObject.loginName, nickname:userObject.nickname });
    }).catch(function (msg) {
        debug.log('user login unsuccessful');
        res.json({response: msg, success: false});
    });
});
// =============================================================================
// Image
// =============================================================================
// create
router.post('/image/create', function (req, res) {
    debug.log('image create api called');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        debug.log(files);
        Image.createImage(fields.id, fields.product, files["image"], fields.token).then(function (resId) {
            res.json({response: "success", success: true, imageId:resId});
        }).catch(function (msg) {
            res.json({response: msg, success: false});
        });
    });

});


// =============================================================================
// Vote
// =============================================================================
// create
router.post('/vote/create', function (req, res) {
    debug.log('vote create create api called');
    Vote.createVote(req.body.value, req.body.userId, req.body.imageId, req.body.token).then(function (resVote) {
        console.log('scuccsess create image'+ resVote);
        res.json({response: "success", success: true});
    }).catch(function (msg) {
        console.log('error create image'+ msg);
        res.json({response: msg, success: false});
    });


});

router.post('/vote/getAllOwn', function (req, res) {
    debug.log('vote getAllOwn api called');
    //User.validateAccessToken(req.body.token, req.body.userId).then(function () {
         Vote.getAllVotesForOneUser(req.body.userId)
    .then(function (res) {
        res.json({response: "success", success: true, votes: res});
    }).catch(function (err) {
        res.json({response: "error", success: false, msg: err});
    });

});

// more routes for our API will happen here
router.get('/test', function (req, res) {
   res.json({'test-works': true});
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
