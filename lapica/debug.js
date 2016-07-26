//separate debugging into a extra file
//make it optional ==> you can disable or enable debug logs

//just fore debugging
//overriding normal console log

var DEBUG = true;

// overload console.log function to have a file log
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/logoutput/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

//make pushnotifications diabled, so we dont spam everyone while we are testing
setTimeout(function(){
    pushNotification.setPushEnabled(enablePushNotification);
},1000);

var exports = module.exports = {};
exports.logusers = function (users_online_cache, users_offline_cache) {
    if (DEBUG === true) {
        setTimeout(function () {
            console.log("Users Online: " + users_online_cache.length + " Users Offlien: " + users_offline_cache.length);
        }, 1000);
    }
};
exports.log = function (msg) {
      if (DEBUG === true) {
          console.log(msg);
      }
};
