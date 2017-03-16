// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.login', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'components/views/loginView.html'
        });
    }])

    // Controller definition for this module
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $timeout, AuthService, $mdDialog, $mdToast) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {
            $rootScope.showBanner = false;
            $rootScope.showNav = false;
            $rootScope.marginTop = {
                'margin-top': '0'
            };
        }

        this.message = "Hello Login!";

        $scope.registerMode = false;
        $scope.toggleMode = function () {
            $scope.registerMode = !$scope.registerMode;
        };

        $scope.form = {
            username: '',
            email: '',
            password: ''
        };

        $scope.login = function () {

            if ($scope.form.username != '' && $scope.form.password != '') {

                var user = {
                    email: $scope.form.email,
                    loginName: $scope.form.username,
                    nickname: $scope.form.username,
                    password: $scope.form.password
                };

                AuthService.login(user).then(function (result) {
                    setTimeout(function () {
                        $scope.form = {
                            username: '',
                            email: '',
                            password: ''
                        };
                    }, 0);

                    $rootScope.loggedInUser.username = result.loginName;
                    $rootScope.loggedInUser.email = result.email;

                    $rootScope.goTo('community');
                    $scope.showLoginSuccessToast();
                }, function (error) {
                    $scope.showAPIAlert(error);
                });
            } else {
                $scope.showEmptyFieldsAlert();
            }


        };

        $scope.register = function () {
            if ($scope.form.email != '') {
                //make sure all data is set correctly

                var user = {
                    email: $scope.form.email,
                    loginName: $scope.form.username,
                    nickname: $scope.form.username,
                    password: $scope.form.password
                };

                AuthService.register(user).then(function (result) {
                    $scope.toggleMode();
                    $scope.showRegisterSuccessToast();
                }, function (error) {
                    $scope.showAPIAlert(error);
                });

            } else {
                $scope.showEmptyFieldsAlert();
            }
        };

        $scope.showEmptyFieldsAlert = function () {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('Please provide the missing information.')
                    .ok('Got it!')
            );
        };

        $scope.showAPIAlert = function (error) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent(error)
                    .ok('Got it!')
            );
        };

        $scope.showLoginSuccessToast = function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Login successful!')
                    .position('top right')
                    .hideDelay(2000)
            );
        };

        $scope.showRegisterSuccessToast = function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Registration successful!')
                    .position('top right')
                    .hideDelay(2000)
            );
        }

    });