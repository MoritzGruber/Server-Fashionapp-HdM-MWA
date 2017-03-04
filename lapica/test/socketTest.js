
import test from 'ava';
import User from './../controllers/user';
import io from 'socket.io-client';

var socketUser = {};
socketUser._id  = "placeholer";
socketUser.accessToken = "placeholer";
socketUser.email = "socket@user.de";
socketUser.loginName = "socketUser";
socketUser.password = "socketUsersPassword";


test.before.serial('register', t => {
    setTimeout(function () {
        return User.createUser(socketUser.email, socketUser.loginName, socketUser.loginName, socketUser.password, null);
    },1000);
});
test.before.serial('login', t => {
    setTimeout(function () {

        return User.authUser(socketUser.email, socketUser.loginName, socketUser.password).then(function (res) {
        socketUser._id = res.id;
        socketUser.accessToken = res.token;
    });
    },1200);

});

test('socketTest', t => {

    return new Promise(function (resolve, reject) {
        setTimeout(function () {

            console.log("SOCKET: runnung socket tets....");
            const socketURL = 'http://localhost:3000';

            const options = {
                transports: ['websocket'],
                'force new connection': true
            };
            const client1 = io.connect(socketURL, options);

            client1.on('connect_error', function () {
                reject('cant connect to socket');

            });
            client1.on('reconnect_failed', function (msg) {
                console.log('SOCKET: Reconnection failed' + msg);
                reject('cant connect to socket');
            });
            client1.on('connect', function () {
                console.log("SOCKET: in connect from  socket tets....");
                //console.log("SOCKET: " + socketUser.accessToken);
                //console.log("SOCKET: " + socketUser._id);
                client1.emit('pullImage', socketUser._id, socketUser.accessToken);


            });

            client1.on('deliverImage', function (resImage, callback) {
                console.log("SOCKET: image recived: " + resImage);
                callback(true);
                resolve('succsess');
            });
        }, 1800);

        setTimeout(function () {
            reject('Promise timed out after ' + 4000 + ' ms');
        }, 4000)

    });

});