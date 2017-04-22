// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('fittshot.collectiondetail', ['ngRoute'])

// Routing configuration for this module
    .config(['$routeProvider', function ($routeprovider) {
        $routeprovider.when('/collectiondetail', {
            controller: 'CollectionDetailCtrl',
            templateUrl: 'components/views/collectionDetailView.html'
        });
    }])

    // Controller definition for this module
    .controller('CollectionDetailCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        // Just a housekeeping.
        // In the init method we are declaring all the
        // neccesarry settings and assignments to be run once
        // controller is invoked
        init();

        function init() {

        }

        $scope.back = function () {
            console.log('back');
            $rootScope.goTo('community');
        };

        this.message = "Hello CollectionDetail!";

        $('.bar-percentage[data-percentage]').each(function () {
            var progress = $(this);
            var percentage = Math.ceil($(this).attr('data-percentage'));
            $({countNum: 0}).animate({countNum: percentage}, {
                duration: 500,
                easing:'linear',
                step: function() {
                    // What todo on every count
                    var pct = '';
                    if(percentage == 0){
                        pct = Math.floor(this.countNum) + '%';
                    }else{
                        pct = Math.floor(this.countNum+1) + '%';
                    }
                    progress.text(pct) && progress.siblings().children().css('width',pct);
                }
            });
        });

    }]);