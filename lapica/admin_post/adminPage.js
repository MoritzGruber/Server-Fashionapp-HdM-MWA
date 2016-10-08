var express = require('express');
var app = require('./../main').app;
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var User = require('./../models/users');

app.use(express.static(path.join(__dirname, 'public')));

User.createAdminUser('0999123456789', function (id) {

    //secure server with password
    var auth = require("http-auth");
    var basic = auth.basic({
        realm: "Private area",
        file: __dirname + "/htpasswd"
    });

    app.use('/admin', auth.connect(basic), express.static(__dirname + '/src'));
});
