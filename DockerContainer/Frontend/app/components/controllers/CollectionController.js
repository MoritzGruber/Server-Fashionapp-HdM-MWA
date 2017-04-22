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
    .controller('CollectionCtrl', ['$scope', '$rootScope', 'voteService', function ($scope, $rootScope, voteService) {

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

        $scope.showCollectionDetail = function (picture) {
            $rootScope.selectedPicture = picture;
            $rootScope.goTo('collectiondetail');
        };

        $scope.getVotesOfOwnImages = function () {
            voteService.getAllOwn(window.localStorage.getItem('user._id'), window.localStorage.getItem('myTokenKey')).then(function (res) {
                res.forEach(function (vote) {
                    $rootScope.ownImages.forEach(function (image, index, array) {
                        if(vote.image._id === image._id) {
                            array[index].votes = vote.voting;
                        }
                    })
                });
            });
        }

    }]);