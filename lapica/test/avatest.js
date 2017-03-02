import test from 'ava';
import User from './../controllers/user';
import Image from './../controllers/image';

let user1 = {};
user1.email = 'some@mail.de';
user1.loginName = 'testuser1';
user1.password = 'supersecret';



//test.serial('User', t => {

test.before.serial('register', t => {
        return User.createUser(user1.email, user1.loginName, user1.loginName, user1.password, null).then(function (res) {
            if(res == 'user-already-exists'){
                user1.email =  Math.random().toString(36).substring(7) + '@' +Math.random().toString(36).substring(10) + '.com';
                user1.loginName = Math.random().toString(36).substring(2);
                return User.createUser(user1.email  , user1.loginName, user1.loginName, user1.password, null)
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
    file.content = {};
    file.content.name = '1.jpg';
    file.content.type = 'image/jpg';
    file.content.path = '/src/test/1.jpg';
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
    return Image.getOldestValidImage().then(function (msg) {
        console.log('get oldest image is: '+msg._id);
    });
});

test('getNextImage', t=> {
   return Image.getNextImage();
});


test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});