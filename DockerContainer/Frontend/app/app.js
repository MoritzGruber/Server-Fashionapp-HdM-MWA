'use strict';

// Defining Angular app model with all other dependent modules
var fittshot = angular.module('fittshot', ['ngRoute', 'fittshot.collection', 'fittshot.collectiondetail', 'fittshot.community', 'fittshot.communitydetail', 'fittshot.login', 'fittshot.profile', 'fittshot.services', 'fittshot.directives', 'fittshot.constants', 'ngMaterial', 'ngMessages', 'chart.js', 'ngAnimate', 'toastr', 'infomofo.angularMdPullToRefresh']);

fittshot
    .config(function ($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {

        // Declaration of the default route if neither of the controllers
        // is supporting the request path
        $routeProvider.otherwise({redirectTo: '/'});

        // Settings for http communications
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');

        // disabling # in Angular urls
        // $locationProvider.html5Mode({
        // 		enabled: true,
        //      requireBase: false
        // });
    })

    .run(function ($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!AuthService.isAuthenticated()) {
                if ($location.$$path != '/login') {
                    // event.preventDefault();
                    // $rootScope.goTo('login');
                }
            }
        });
    })

    .controller('AppCtrl', function ($scope, $rootScope, $http, $timeout, $location, imageService) {
        $rootScope.showBanner = true;
        $rootScope.showNav = true;

        $rootScope.selectedPicture = {
            src: '',
            _id: ''
        };

        $rootScope.loggedInUser = {
            name: 'Christoph',
            email: 'chris@fittshot.com',
            location: 'Ingolstadt',
            img: '../../resources/img/profile/chris.JPG'
        };

        var bannerHeight = '20vh';

        $rootScope.marginTop = {
            'margin-top': bannerHeight
        };

        $scope.bannerImage = 'resources/img/banners/community.png';
        $scope.bannerHeadline = 'Community';

        $rootScope.goTo = function (path) {

            if (path == 'communitydetail' || path == 'collectiondetail' || path == 'login') {
                $rootScope.showBanner = false;
                $rootScope.marginTop = {
                    'margin-top': '0'
                };
                $rootScope.showNav = !(path == 'login');
            } else {
                $rootScope.showBanner = true;
                $rootScope.showNav = true;

                $rootScope.marginTop = {
                    'margin-top': bannerHeight
                };

                $scope.bannerImage = 'resources/img/banners/' + path + '.png';
                $scope.bannerHeadline = path.charAt(0).toUpperCase() + path.slice(1);
            }

            $location.path('/' + path);
        };

        $scope.cameraButtonClicked = function() {
            console.log('Camera button clicked');
        };

        $scope.inputFileChanged = function ()
        {
            var maxWidth = 200;
            var maxHeight = 200;

            var file = document.querySelector('#fileInput').files[0];

            var image = new Image();
            image.src = dataURL;

            var width = image.width;
            var height = image.height;

            var newWidth;
            var newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            var canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            var context = canvas.getContext('2d');

            context.drawImage(this, 0, 0, newWidth, newHeight);

            var dataURL = canvas.toDataURL(fileType);

            imageService.createImage(dataURL).then(function (msg) {
                console.log(msg);
            }).catch(function (err) {
                console.log(err);
            });
        };
        $rootScope.goTo('community');

    });