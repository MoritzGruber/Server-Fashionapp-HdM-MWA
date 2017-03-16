// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.profile', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/profile', {
            controller: 'ProfileCtrl',
            templateUrl: 'components/views/profileView.html'
        });
    }])

    // Controller definition for this module
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, $timeout, AuthService, imageService, voteService) {

        // Global variables for this controller
        var responseStatus = '';
        var userIp = 'not yet retrieved';

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello Profile!";

        //    test Stuff comes here

        var testUser = {
            email: 'frontend@user.de',
            loginName: 'frontendUser',
            nickname: 'TheFrontendGuy',
            password: 'angularisawsome'
        };
        $scope.testRegister = function () {
            AuthService.register(testUser).then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.testLogin = function () {
            AuthService.login(testUser).then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };
        $scope.testUploadImage = function () {
            var input = document.getElementById('imageUpload');
            var file = input.files[0];
            console.log(file);
            //var file = new File('../../resources/img/backgrounds/dark1.png', 'dark1.png');
            imageService.createImage(file).then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.testPullImage = function () {

            imageService.pullImage().then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.testUploadVote = function () {
            var vote = {
                value: true,
                imageId: '58bb03d8e48af50194ef8f09'
            };

            voteService.createVote(vote).then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.testPullVote = function () {

            voteService.pullVote().then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };

        //    test stuff ends here

        $scope.logout = function () {
            AuthService.logout();
            $rootScope.goTo('login');
        };
    });