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
                if ($location.$$path !== '/login') {
                    event.preventDefault();
                    $rootScope.goTo('login');
                }
            }
        });
    })

    .controller('AppCtrl', function ($scope, $rootScope, $http, $timeout, $location, imageService, voteService, toastr) {
        $rootScope.showBanner = true;
        $rootScope.showNav = true;

        $rootScope.ownImages = [];
        $rootScope.foreignImages = [];

        var allowPullImages = true;

        $rootScope.pullImages = function () {
            if(allowPullImages) {
                console.log('pullImages() triggered');
                allowPullImages = false;
                setTimeout(function() {
                    allowPullImages = true;
                }, 3000);
                return imageService.pullImage(function (image) {
                    if (image.creator === window.localStorage.getItem('user._id')) {
                        $rootScope.ownImages.push(image);
                    } else {
                        $rootScope.foreignImages.push(image);
                    }
                    // TODO: remove the following line after pull-to-refresh triggering is fixed
                    // $scope.getVotesOfOwnImages();
                    $rootScope.$apply();
                }).then(function (res) {
                    $scope.getVotesOfOwnImages();
                }).catch(function (err) {
                    if (err === 'no-next-image') {
                        toastr.info('There are no new Images');
                        console.log('No new image');
                    } else if (err === 'up-to-date') {
                        toastr.info('All new images loaded');
                    } else if (err === 'jwt-error') {
                        AuthService.logout();
                        $rootScope.goTo('login');
                        toastr.error('Token invalid!');
                        console.log('jwt-error');
                    } else {
                        console.log(err);
                    }
                });
            }
        };

        $rootScope.selectedPicture = {
            src: '',
            _id: '',
            votes: [0, 0]
        };

        $rootScope.loggedInUser = {
            name: '',
            email: '',
            location: 'Ingolstadt'
        };

        var bannerHeight = '20vh';

        $rootScope.marginTop = {
            'margin-top': bannerHeight
        };

        $scope.bannerImage = 'resources/img/banners/community.png';
        $scope.bannerHeadline = 'Community';

        $rootScope.goTo = function (path) {

            if (path === 'communitydetail' || path === 'collectiondetail' || path === 'login') {
                $rootScope.showBanner = false;
                $rootScope.marginTop = {
                    'margin-top': '0'
                };
                $rootScope.showNav = !(path === 'login');
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

        $scope.cameraButtonClicked = function () {
            console.log('Camera button clicked');
        };

        $scope.inputFileChanged = function () {
            var file = document.querySelector('#fileInput').files[0];

            readFile(file);
        };

        function readFile(file) {
            console.log('Dateigröße: ' + file.size / 1000000 + ' MB');
            var reader = new FileReader();

            reader.onloadend = function () {
                processFile(reader.result, file.type);
            };

            reader.readAsDataURL(file);
        }

        function processFile(dataURL, fileType) {
            var maxWidth = 400;
            var maxHeight = 400;

            var image = new Image();
            image.src = dataURL;

            image.onload = function () {
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

                dataURL = canvas.toDataURL(fileType);

                sendFile(dataURL);
            };
        }

        function sendFile(fileData) {
            console.log('komprimiert: ' + (((fileData.length * 4) / 3) + (fileData.length / 96) + 6) / 1000 + ' KB');
            imageService.createImage(fileData).then(function (msg) {
                console.log(msg);
                $rootScope.pullImages();

            }).catch(function (err) {
                console.log(err);
            });
        }

        $scope.getVotesOfOwnImages = function () {
            voteService.getAllOwn(window.localStorage.getItem('user._id'), window.localStorage.getItem('myTokenKey')).then(function (res) {
                angular.forEach(res.data.votes, function (vote, voteKey) {
                    angular.forEach($rootScope.ownImages, function (image, imageKey) {
                        if (vote.image._id === image._id) {
                            $rootScope.ownImages[imageKey].votes = vote.voting;
                        }
                    })
                });
            });
        };


        $rootScope.goTo('community');

    });