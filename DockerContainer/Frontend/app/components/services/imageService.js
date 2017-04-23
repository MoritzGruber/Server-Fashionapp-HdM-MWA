angular.module('fittshot.services')


    .service('imageService', function ($q, $http, API_ENDPOINT, $rootScope) {

    var serverUrl = API_ENDPOINT.url;

    var urlBase = serverUrl + '/image';

    this.createImage = function (file) {
        return new $q(function (resolve, reject) {
            var fd = new FormData();
            fd.append('image', file);
            fd.append('id', window.localStorage.getItem('user._id'));
            fd.append('token', window.localStorage.getItem('myTokenKey'));
            $http.post(serverUrl+'/image/create', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response.data);
                // TODO: remove the following line after pull-to-refresh triggering is fixed
                $rootScope.pullImages();
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response.data);

            });
        });

    };

    this.pullImage = function (updateFunction) {
        // params user id and token
        // send via socket
        return new Promise(function (resolve, reject) {
            //bool for the toast msg, no new images or up to date
            var gotSomeImages = false;

                var userID = window.localStorage.getItem('user._id');
                var userToken = window.localStorage.getItem('myTokenKey');

                var socket = io.connect(API_ENDPOINT.socket);
                socket.on('connect_error', function () {
                    reject('cant connect to socket');
                });
                socket.on('reconnect_failed', function (msg) {
                    reject('cant connect to socket');
                });
                socket.on('connect', function () {
                    console.log('emit with: '+ userID + userToken);
                    socket.emit('pullImage', userID, userToken);
                });
                //socket.on('no-next-image', function () {
                //    reject('no-next-image');
                //});
                socket.on('deliverImage', function (resImage, callback) {
                    if(resImage === 'no-next-image'){
                        callback(true);
                        if(gotSomeImages){
                            reject('up-to-date');
                        } else {
                            reject('no-next-image');
                        }
                    } else if(resImage === 'jwt-error'){
                        callback(true);
                        reject('jwt-error');
                    } else {
                        console.log("SOCKET: image recived:");
                        console.log(resImage);
                        gotSomeImages = true;
                        updateFunction(resImage);
                    }
                    callback(true);

                });
            //}, 1800);

            setTimeout(function () {
                reject('Promise timed out after ' + 12000 + ' ms');
            }, 12000)

        });

    };

});
