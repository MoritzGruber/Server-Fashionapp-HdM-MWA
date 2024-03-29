//here is the setup & logic for the pushNotification
//for onesignal push notifications
var request = require('request');
var Promise = require('bluebird');
var debug = require('./debug');

var exports = module.exports = {};
var pushEnabled =true;

//main function to send push notifications
exports.sendPush = function(device, message) {

    //cut admin id out of device /devices



    return new Promise(function (resolve, reject) {
        debug.log("Device at push = "+device);
    if(pushEnabled){
        if(Array.isArray(device)){
            var adminIndex = device.indexOf("ökljaflasjdlfdsajflasjflajasdjfllasjdf");
            if(adminIndex > -1) {
                device.splice(adminIndex);
            }
        } else if(device == "ökljaflasjdlfdsajflasjflajasdjfllasjdf"){
            resolve(true);
        }

      var restKey = 'Y2FjNTVlYzMtODA1NC00N2I2LWE4NjctOTM4MWMzODJmMTAw';
      var appID = 'f132b52a-4ebf-4446-a8e0-b031f40074da';
      request({
              method: 'POST',
              uri: 'https://onesignal.com/api/v1/notifications',
              headers: {
                  "authorization": "Basic " + restKey,
                  "content-type": "application/json"
              },
              json: true,
              body: {
                  'app_id': appID,
                  'contents': {
                      en: message
                  },
                  //'data': {picture: imagedata},  --> over 3500 byte error(limt of push notification) so we can just send a message and have to load the data with socket when socket is connected.
                  'include_player_ids': Array.isArray(device) ? device : [device]
              }
          },
          function(error, response, body) {
              if (!body.errors ) {
                  resolve(body);
              } else if(body.errors != '') {
                  reject('Onesignal Error:' + JSON.stringify(body.errors));
              }
              if (error){
                  reject('Onesignal Error:' + error);
              }
          }
      );
    }else{
        resolve("PushDisabled");
    }
    });
};