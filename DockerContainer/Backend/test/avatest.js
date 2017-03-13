import test from 'ava';
import User from './../controllers/user';
import Image from './../controllers/image';

let user1 = {};
user1.email = 'some@mail.de';
user1.loginName = 'testuser1';
user1.password = 'supersecret';


let user2 = {};
user2.email = 'som2e@mail.de';
user2.loginName = 'tes2tuser1';
user2.password = 'supersecret2';

//test.serial('User', t => {

test.before.serial('register', t => {
        return User.createUser(user1.email, user1.loginName, user1.loginName, user1.password, null).then(function (res) {
            if(res == 'user-already-exists'){
                user2.email =  Math.random().toString(36).substring(7) + '@' +Math.random().toString(36).substring(10) + '.com';
                user2.loginName = Math.random().toString(36).substring(2);
                return User.createUser(user2.email  , user2.loginName, user2.loginName, user2.password, null)
                    .then( function (res) {
                    console.log('New user is: ' + user1.loginName + ' , '+ user1.email + '  ,res of create alternative user: '+res);

                });
            }
        });
});
test.before.serial('login', t => {
    return User.authUser(user1.email, user1.loginName, user1.password).then(function (res) {
        user1._id = res.id;
        user1.accessToken = res.token;
    });
});

test('Image.create', t => {
    const file = {};
    file.name = '1.jpg';
    file.type = 'image/jpg';
    file.path = __dirname + '/../test/1.jpg';
    return Image.createImage(user1._id, null, file, user1.accessToken);
});

test('getLastImageFromUser', async t => {
    return User.getLastImage(user1._id).then(function (res) {
        user1.lastImage = res;
    });
});

test('imageTransferSocket.pullImage.Inner', t => {
    return User.authUser(user1.email, user1.loginName, user1.password).then(function (res) {
        user1._id = res.id;
        user1.accessToken = res.token;
        return User.validateAccessToken(user1.accessToken, user1._id);
    }).then(function () {
        return User.getLastImage(user1._id);
    }).then(function (res) {
        user1.lastImage = res;
        console.log('last image found: ' + res);
        return Image.getNextImage(res);
    }).then(function (res) {
        user1.nextImage=res;
        console.log('next image found: ' + user1.nextImage);
        return User.updateLastImage(user1._id, user1.nextImage);
    });
});

test('save and load image', t=> {
    const file = {};
    file.name = '1.jpg';
    file.type = 'image/jpg';
    file.path = __dirname + '/../test/1.jpg';
    setTimeout(function() {
        return new Promise(function (resolve, reject) {
            reject('Promise timed out after ' + 4000 + ' ms');
        });
    }, 4000);
    return Image.createImage(user1._id, null, file, user1.accessToken).then(function (resId) {

        return Image.getImageWithSrc(resId);
    });
});



test('getOldestValidImage', t => {
    return Image.getOldestValidImage().then(function (msg) {
        console.log('get oldest image is: '+msg._id);
    });
});

test('getNextImage', t=> {
    return Image.getOldestValidImage().then(function (imageID) {
        return Image.getNextImage(imageID);
    });

});


test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});

