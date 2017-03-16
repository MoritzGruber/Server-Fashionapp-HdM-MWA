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
    .controller('CommunityCtrl', ['$scope', '$rootScope', 'imageService', '$mdToast', '$mdDialog', 'voteService', function ($scope, $rootScope, imageService, $mdToast, voteService) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello Community!";

        $scope.pictures = [];

        $scope.pullImage = function () {
            $mdToast.show($mdToast.simple().textContent('Hello!'));
            imageService.pullImage().then(function (image) {
                $scope.pictures.push({_id: image._id, creatorNickname: image.creatorNickname, src: 'data:image/png;base64,'+image.src});
                $scope.$apply();
            }).catch(function (err) {
                if(err == 'no-next-image'){
                    $scope.showNoNewImagesToast();
                    console.log('No new image');
                } else {
                    console.log(err);
                }
            });
        };

        $scope.showNoNewImagesToast = function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('No new images')
                    .position('top right')
                    .hideDelay(2000)
            );
        };

        $scope.showCommunityDetail = function(picture) {
            $rootScope.selectedPicture = picture;
            $rootScope.goTo('communitydetail');
        };



    }]);