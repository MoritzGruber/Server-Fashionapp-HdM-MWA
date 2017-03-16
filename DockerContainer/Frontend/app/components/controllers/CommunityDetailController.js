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
    .controller('CommunityDetailCtrl', ['$scope', '$location', 'voteService', '$rootScope', function ($scope, $location, voteService, $rootScope) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }
        $scope.uploadVote = function (hasLiked) {
            var vote = {
                value: hasLiked,
                imageId: $rootScope.selectedPicture._id
            };

            voteService.createVote(vote).then(function (msg) {
                console.log(msg);
                $rootScope.goTo('community');
            }).catch(function (err) {
                console.log(err);
            });
        };

        this.message = "Hello CommunityDetail!";

    }]);