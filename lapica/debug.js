//separate debugging into a extra file
//make it optional ==> you can disable or enable debug logs

//just fore debugging
//overriding normal console log

var pushNotification = require('./pushNotification');


var DEBUG = true;
var enablePushNotification = true;

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
  }
