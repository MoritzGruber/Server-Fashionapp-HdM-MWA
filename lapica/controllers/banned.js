var Banned = require('./../models/banned');
var debug = require('./../debug');


//delete banns all 24h
setInterval(function(){

    Banned.remove({}, function () {
        debug.log(' banned deleted');
    });
}, 86400000);

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
                    if(result.length > 0){
                        reject('You are banned for 24h');
                    }
                    resolve(false);
                }
            });
        });
    }
};
