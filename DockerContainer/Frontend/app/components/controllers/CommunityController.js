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
    .controller('CommunityCtrl', ['$scope', '$rootScope', 'imageService', '$mdToast', function ($scope, $rootScope, imageService, $mdToast) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        this.message = "Hello Community!";

        $scope.pullImage = function () {
            imageService.pullImage().then(function (image) {
                $scope.pictures.push({creatorNickname: image.creatorNickname, src: 'data:image/png;base64,'+image.src});
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

        $scope.pictures = [
            {
                creatorNickname: 'Sarah',
                src: '../../resources/img/pics/dress.jpg'
            },
            {
                creatorNickname: 'Marcel',
                src: '../../resources/img/banners/collection.png'
            }
        ];

        $rootScope.selectedPicture = {
            path: ''
        };

        $scope.showCommunityDetail = function(picture) {
            $rootScope.selectedPicture.src = picture.src;
            $rootScope.goTo('communitydetail');
        };

    }]);