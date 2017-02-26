import test from 'ava';
import User from './../controllers/user';
import Image from './../controllers/image';

let user1 = {};
user1.email = 'some@mail.de';
user1.loginName = 'testuser1';
user1.password = 'supersecret';



//test.serial('User', t => {

test.before.serial('register', t => {
    setTimeout(function () {
        return User.createUser(user1.email, user1.loginName, user1.loginName, user1.password, null);
    }, 500);
});
test.before.serial('login', t => {
    return User.authUser(user1.email, user1.loginName, user1.password).then(function (res) {
        user1._id = res.id;
        user1.accessToken = res.token;
    });
});

test.skip('Image.create', t => {
    const file = {};
    file.content = {};
    file.content.name = '1.jpg';
    file.content.type = 'image/jpg';
    file.content.path = './test/1.jpg';
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
        user1.nextImage=res._id;
        console.log('next image found: ' + user1.nextImage);
        return User.updateLastImage(user1._id, user1.nextImage);
    });
});

test('save and load image', t=> {
    const file = {};
    file.content = {};
    file.content.name = '1.jpg';
    file.content.type = 'image/jpg';
    file.content.path = __dirname + '/../test/1.jpg';
    return Image.createImage(user1._id, null, file, user1.accessToken).then(function (resId) {
        return Image.getImageWithSrc(resId);
    });
});



test('getOldestValidImage', t => {
    return Image.getOldestValidImage();
});


test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});