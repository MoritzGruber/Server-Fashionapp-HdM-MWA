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

        $rootScope.loggedInUser = {
            name: 'Christoph',
            email: 'chris@fittshot.com',
            location: 'Ingolstadt',
            img: '../../resources/img/profile/chris.JPG'
        };

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
                console.log( err);
            });
        };

        $scope.testPullVote = function () {

            voteService.pullVote().then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log( err);
            });
        };


        //    test stuff ends here


        var d = new Date();
        var weekday = new Array(7);
        weekday[-6] = "Monday";
        weekday[-5] = "Tuesday";
        weekday[-4] = "Wednesday";
        weekday[-3] = "Thursday";
        weekday[-2] = "Friday";
        weekday[-1] = "Saturday";
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        $scope.labels = [weekday[d.getDay() - 6], weekday[d.getDay() - 5], weekday[d.getDay() - 4], weekday[d.getDay() - 3], weekday[d.getDay() - 2], weekday[d.getDay() - 1], weekday[d.getDay()]];
        $scope.series = [
            {
                label: 'Likes',
                backgroundColor: "rgba(0,255,0,1)"
            },
            {
                label: 'Dislikes',
                backgroundColor: "rgba(255,0,0,1)"
            }
        ];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.colors = ['#72C02C', '#3498DB'];
        $scope.datasetOverride = [{yAxisID: 'y-axis'}];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };

        $scope.logout = function () {
            AuthService.logout();
            $rootScope.goTo('login');
        }
    });