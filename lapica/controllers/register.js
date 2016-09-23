var Register = require('./../models/register');
var Banned = require('./../controllers/banned');
var debug = require('./../debug');

module.exports = {
    // create vote 
    add: function (number, token, code) {
        return new Promise(function (resolve, reject) {

            debug.log('register.add called');
            var register = new Register({
                number: number,
                token: token,
                code: code
            });
            register.save(function (err, res) {
                if (err) {
                    reject('ERR in REGISTER ADD'+err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    //check if that code is right
    check: function(number, token, code){
        return new Promise(function (resolve, reject) {
            Register.find({number:  number, token: token, code:  code}, function (err, result) {
                if (err) {
                    reject('ERR in REGISTER CHECK'+err)
                }else{
                    if(result.length > 0){
                        resolve(true);
                    }else{
                        debug.log(JSON.stringify(result));
                        reject('Wrong code');
                    }
                }
            });
        });
    },
    //check if we should ban that clint for requesting to many sms
    checkForBan: function (number, token) {
        return new Promise(function (resolve, reject) {
            Register.find({$or: [{number: {$eq: number}}, {token: {$eq: token}}]}, function (err, result) {
                if (err) {
                    reject(err)
                }else{
                    if(result.count > 3){
                        //ban userand return promise
                        return Banned.add(number, token);
                    }
                }
            });
        });
    }
};