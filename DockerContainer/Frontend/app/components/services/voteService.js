angular.module('fittshot.services').service('voteService', function ($q, $http, API_ENDPOINT) {

    var serverUrl = API_ENDPOINT.url;

    var urlBase = serverUrl + '/vote';
    var voteService = {};

    voteService.createVote = function (vote) {
        return $http.post(urlBase + '/create', {
            value: vote.value,
            userId: window.localStorage.getItem('user._id'),
            imageId: vote.imageId,
            token: window.localStorage.getItem('myTokenKey')
        });
    };

    voteService.pullVote = function () {
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
                socket.emit('pullVote', userID, userToken);
            });
            socket.on('deliverVote', function (resVote, callback) {
                console.log("SOCKET: vote recived: " + resVote);
                callback(true);
                resolve('succsess');
            });
            //}, 1800);

            setTimeout(function () {
                reject('Promise timed out after ' + 4000 + ' ms');
            }, 4000)

        });

    };

    voteService.getVotes = function () {
        return $http.get(urlBase);
    };

    voteService.getVote = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    voteService.getVotesOfImage = function (id) {
        return $http.get(urlBase + '/ofImage/' + id);
    };

    voteService.deleteVote = function (id, editor) {
        return $http.delete(urlBase + '/' + id, {params: {'editor': editor}});
    };

    voteService.hasUserVotedImage = function (userId, imageId) {
        return $http.get(urlBase + '/hasUserVotedImage', {params: {'userId': userId, 'imageId': imageId}});
    };

    voteService.getAllOwn = function (userId, token) {
        return $http.post(urlBase + '/getAllOwn', {'userId': userId, 'token': token});
    };

    return voteService;
});