// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.collection', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/collection', {
            controller: 'CollectionCtrl',
            templateUrl: 'components/views/collectionView.html'
        });
    }])

    // Controller definition for this module
    .controller('CollectionCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello Collection!";

        $scope.data = [300, 100];
        $scope.labels = ["Likes", "Dislikes"];
        $scope.colors = ['#00d600', '#d60000'];
        $scope.options = {
            cutoutPercentage: 96,
            pointHighlightFill: [
                '#ffffff',
                '#ffffff'
            ]
        };
        $scope.override = {
            borderColor: [
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)'
            ]
        };

        $scope.pictures = [
            {
                path: '../../resources/img/pics/dress.jpg'
            }
        ];

        $scope.showCollectionDetail = function(picture) {
            $rootScope.selectedPicture.path = picture.path;
            $rootScope.goTo('collectiondetail');
        };

    }]);