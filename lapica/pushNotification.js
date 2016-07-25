//here is the setup & logic for the pushNotification
//for onesignal push notifications
var request = require('request');
var sendPush = function(device, message) {
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
            if (!body.errors) {
                console.log(body);
            } else {
                console.error('Error:', body.errors);
            }

        }
    );
};