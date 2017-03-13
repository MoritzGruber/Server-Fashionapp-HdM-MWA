// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.collectiondetail', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/collectiondetail', {
            controller: 'CollectionDetailCtrl',
            templateUrl: 'components/views/collectionDetailView.html'
        });
    }])

    // Controller definition for this module
    .controller('CollectionDetailCtrl', ['$scope', function ($scope) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello CollectionDetail!";

    }]);