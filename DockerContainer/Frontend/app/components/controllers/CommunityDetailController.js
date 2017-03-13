// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.communitydetail', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/communitydetail', {
            controller: 'CommunityDetailCtrl',
            templateUrl: 'components/views/communityDetailView.html'
        });
    }])

    // Controller definition for this module
    .controller('CommunityDetailCtrl', ['$scope', '$location', function ($scope, $location) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello CommunityDetail!";

    }]);