angular.module('fittshot.services')


    .service('imageService', function ($q, $http, API_ENDPOINT) {

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
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response.data);

            });
        });

    };

    this.pullImage = function () {
        // params user id and token
        // send via socket
        return new Promise(function (resolve, reject) {
            //setTimeout(function () {

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
                socket.on('deliverImage', function (resImage, callback) {
                    console.log("SOCKET: image recived: " + resImage);
                    callback(true);
                    resolve('succsess');
                });
            //}, 1800);

            setTimeout(function () {
                reject('Promise timed out after ' + 4000 + ' ms');
            }, 4000)

        });

    };

});
