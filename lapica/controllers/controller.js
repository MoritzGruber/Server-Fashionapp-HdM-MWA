var users = require('./users');
var userXusers = require('./userXusers');
var pictures = require('./pictures');
var votes = require('./votes');

var async = require('async');

async.parallel([
    function(callback) {

    },
    function(callback) {
        userXusers.createUserXUser("link", "015735412587", "015735412587", callback);
    },
    function(callback) {
        pictures.createPicture("sourcePath", "015735412587", ["015735412587"], callback);
    },
    function(callback) {
        votes.createVote("sourcePath", "015735412587", true, callback);
    }
], function(err) {

});
