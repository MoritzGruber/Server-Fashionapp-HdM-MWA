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
    /// Controller definition for this module

    .controller('CommunityCtrl', ['$scope', '$rootScope', 'imageService', '$mdToast', '$mdDialog', 'voteService', function ($scope, $rootScope, imageService, $mdToast, voteService) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked

        init();

        function init() {

        }

        this.message = "Hello Community!";

        if( $rootScope.pictures == undefined){
            $rootScope.pictures = [];
        }
        $scope.pictures = $rootScope.pictures;


        $scope.pullImage = function () {
            return imageService.pullImage().then(function (image) {
                $rootScope.pictures.push({_id: image._id, creatorNickname: image.creatorNickname, src: 'data:image/png;base64,'+image.src});
                $scope.$apply();
            }).catch(function (err) {
                if(err == 'no-next-image'){
                    $scope.showNoNewImagesToast();
                    console.log('No new image');
                } else if(err == 'jwt-error'){
                    AuthService.logout();
                    $rootScope.goTo('login');
                    console.log('jwt-error');
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
