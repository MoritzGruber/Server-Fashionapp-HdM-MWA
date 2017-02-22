var chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

// Bring Mongoose into the app
var mongoose = require('mongoose');
var usermodel = require('./../models/user');
var crypto = require('crypto');
var db = require('./../models/db');
var jwt = require('jsonwebtoken');


describe("User", function() {

    describe("register", function() {


        it("should return an id", function() {

        });
    });
    describe("assert", function() {
        it("should", function() {
            "we".should.equal("we");
        });
    });
    describe("assert", function() {
        it("expect", function() {
            "we".should.equal("we");
            expect("we").to.equal("we");
        });
    });
});
