var Banned = require('./../models/banned');
var debug = require('./../debug');

module.exports = {
    // add a banned user
    add: function (number, token) {
        return new Promise(function (resolve, reject) {

            debug.log('register.new called');
            var banned = new Banned({
                number: number,
                token: token
            });
            banned.save(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve('Error at banning a user('+number+', token: '+token+'): '+err);
                }
            });
        });
    },
    //check is that user is banned
    check: function(number, token){
        return new Promise(function (resolve, reject) {
            Banned.find({ $or: [ {number: number}, {token: token} ] }, function (err, result) {
                if (err) {
                    reject('ERR in BANNED.CEHCK '+err)
                }else{
                    resolve(result.count > 0);
                }
            });
        });
    }
};
