// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.community', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/community', {
            controller: 'CommunityCtrl',
            templateUrl: 'components/views/communityView.html'
        });
    }])

    // Controller definition for this module
    .controller('CommunityCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello Community!";

        $scope.pictures = [
            {
                creator: 'Sarah',
                path: '../../resources/img/pics/dress.jpg'
            },
            {
                creator: 'Marcel',
                path: '../../resources/img/banners/collection.png'
            }
        ];

        $rootScope.selectedPicture = {
            path: ''
        };

        $scope.showCommunityDetail = function(picture) {
            $rootScope.selectedPicture.path = picture.path;
            $rootScope.goTo('communitydetail');
        };

    }]);