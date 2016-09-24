//load other modules
var debug = require('./debug');

//twilio settings and setup
var accountSid = 'AC8998443aa09d6836863744d191a03f63'; // Your Account SID from www.twilio.com/console
var authToken = 'b593241e727816981a7327be532b928d';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
var exports = module.exports = {};

//function we export to other modules
exports.send = function (number, message) {
    return new Promise(function (resolve, reject) {
        client.messages.create({
            body: message,
            to: number,  // number has to 01701764330, or +49170.... if international, not 49170!
            from: '+4915735984656' // From a valid Twilio number
        }, function (err, message) {
            if (err) {
                reject('ERR SENDING SMS ' + JSON.stringify(err));
            } else {
                debug.log('SMS is going out '+number+' with '+message);
                resolve(message);
            }
        });
    });

};
