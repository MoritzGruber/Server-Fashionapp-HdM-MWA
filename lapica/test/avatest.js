import test from 'ava';
import User from './../controllers/user';
import Image from './../controllers/image';

let user1 ={};
user1.email = 'some@mail.de';
user1.loginName = 'testuser1';
user1.password = 'supersecret';


//test.serial('User', t => {

    test.skip.before.serial('register', t => {
        return User.createUser(user1.email, user1.loginName, user1.loginName, user1.password, null);
    });
    test.before.serial('login', t => {
        return User.authUser(user1.email, user1.loginName, user1.password).then(function (res) {
            user1._id = res.id;
            user1.accessToken = res.token;
            console.log('shoudl first:'+user1.accessToken);

        });
    });

    test.after.serial('Image.create', t => {
        const file  = {};
        file.content = {};
        file.content.name = '1.jpg';
        file.content.type = 'image/jpg';
        file.content.path = './test/1.jpg';
        return Image.createImage(user1._id, null, file, user1.accessToken);
    });




test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});