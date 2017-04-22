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
        $scope.colors = ['#04bf0d', '#c50005'];
        $scope.options = {
            cutoutPercentage: 94,
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
                path: '../../resources/img/pics/dress.jpg',
                votes: [300,100]
            },
            {
                path: '../../resources/img/pics/dress.jpg',
                votes: [200,100]
            },
            {
                path: '../../resources/img/pics/dress.jpg',
                votes: [17,100]
            },
            {
                path: '../../resources/img/pics/dress.jpg',
                votes: [300,330]
            },
            {
                path: '../../resources/img/pics/dress.jpg',
                votes: [5,3]
            }
        ];

        $scope.showCollectionDetail = function(picture) {
            $rootScope.selectedPicture = picture;
            $rootScope.goTo('collectiondetail');
        };

        $scope.pullOwnImages = function() {
            console.log('pulling own images');
        }

    }]);