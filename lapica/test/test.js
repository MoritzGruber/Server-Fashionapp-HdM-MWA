var mongoose = require('./../node_modules/mongoose');
var db = require('./../models/db');
var users = require('./../controllers/user');
var pictures = require('./../controllers/image');
var votes = require('./../controllers/vote');


//Variables for testing:
var test1;
test1.user = {};
test1.image1= {};
test1.user.email= 'testuser@test.de';
test1.user.loginName= 'Testuser01';
test1.user.password= 'testpassword';

//register user
test1.user._id = "";


//login user
test1.user.accessToken = "";
//upload a image

//pullImage
//createVote
//pullVote



/*
var userId;
var userId2;
var pictureId;

describe('User', function () {
    describe('#save()', function () {
        it('should save without error', function (done) {
            users.createUser("user1", "01525418795", "image", "JBKAJSF982KJ8JK892KJ39JF83", function (err, res) {
                if (err) throw err;
                userId = res;
                console.log("saved user has id " + userId);
                done();
            });
        });
    });
});

describe('User', function () {
    describe('#save()', function () {
        it('should save without error', function (done) {
            users.createUser("user2", "015241569873", "image", "5AHAE6HE35HAE35HA3E5HA35EHRA", function (err, res) {
                if (err) throw err;
                userId2 = res;
                console.log("saved user has id " + userId2);
                done();
            });
        });
    });
});

describe('User', function () {
    describe('#update()', function () {
        it('should update without error', function (done) {
            users.updateUser(userId, "015731574895", "changedName", "changedImage", true, 10, "IJB6A5ERTH5AE4TJ6A5ERTJ5A6THJ", function (err, res) {
                if (err) throw err;
                done();
            });
        });
    });
});

describe('Picture', function () {
    describe('#save()', function () {
        it('should save without error', function (done) {
            pictures.createPicture("source", userId, function (err, res) {
                if (err) throw err;
                pictureId = res;
                done();
            });
        });
    });
});

describe('Picture', function () {
    describe('#update()', function () {
        it('should update without error', function (done) {
            pictures.addRecipientToPicture(userId, userId2, pictureId, function (err, res) {
                if (err) throw err;
                done();
            })
        });
    });
});

describe('Vote', function () {
    describe('#save()', function () {
        it('should save without error', function (done) {
            votes.createVote(pictureId, userId2, true, function (err, res) {
                if (err) throw err;
                voteId = res;
                done();
            });
        });
    });
});

describe('Vote', function () {
    describe('#delete()', function () {
        it('should delete without error', function (done) {
            votes.deleteVote(voteId, function (err, res) {
                if (err) throw err;
                done();
            });
        });
    });
});

describe('Picture', function () {
    describe('#delete()', function () {
        it('should delete without error', function (done) {
            pictures.deletePicture(pictureId, function (err, res) {
                if (err) throw err;
                done();
            });
        });
    });
});

describe('User', function () {
    describe('#delete()', function () {
        it('should delete without error', function (done) {
            users.deleteUser(userId, function (err, res) {
                if (err) throw err;
                done();
            });
        });
    });
});


describe('User', function () {
    describe('#delete()', function () {
        it('should delete without error', function (done) {
            users.deleteUser(userId2, function (err, res) {
                if (err) throw err;
                done();
            });
        });
    });
});
*/
