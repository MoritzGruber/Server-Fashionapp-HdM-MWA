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

    .controller('CommunityCtrl', ['$scope', '$rootScope', 'imageService', '$mdToast', 'voteService', 'AuthService', 'toastr', function ($scope, $rootScope, imageService, $mdToast, voteService, AuthService, toastr) {

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
            return imageService.pullImage(function (image) {
                $rootScope.pictures.push({_id: image._id, creatorNickname: image.creatorNickname, src: 'data:image/png;base64,'+image.src});
                $scope.$apply();
            }).then(function (res) {
            }).catch(function (err) {
                if(err == 'no-next-image') {
                    toastr.info('There are no new Images');
                    console.log('No new image');
                } else if(err == 'up-to-date') {
                    toastr.info('All new images loaded');
                } else if(err == 'jwt-error'){
                    AuthService.logout();
                    $rootScope.goTo('login');
                    toastr.error('Token invalid!');
                    console.log('jwt-error');
                } else {
                    console.log(err);
                }
            });
        };

        $scope.showCommunityDetail = function(picture) {
            $rootScope.selectedPicture = picture;
            $rootScope.goTo('communitydetail');
        };



    }]);
