var Register = require('./../models/register');
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
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    //check if that code is right
    check: function(number, token, code){
        return new Promise(function (resolve, reject) {
            Register.find({number: {$eq: number}}, {token: {$eq: token}}, {code: {$eg: code}}, function (err, result) {
                if (err) {
                    reject(err)
                }else{
                    if(result.count > 0){
                        resolve(true);
                    }else{
                        reject('Wrong code');
                    }
                }
            });
        });
    },
    //check if we should ban that clint for requesting to many sms
    checkForBan: function (number, token) {
        return new Promise(function (resolve, reject) {
            var counter;
            Register.find({number: {$eq: number}}, {token: {$eq: token}}, {code: {$eg: code}}, function (err, result) {
                if (err) {
                    reject(err)
                }else{
                    if(result.count > 2){
                        //ban user
                    }
                }
            });
        });
    }
};