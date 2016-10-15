//separate debugging into a extra file
//make it optional ==> you can disable or enable debug logs

//just fore debugging
//overriding normal console log

var DEBUG = true;

// overload console.log function to have a file log
var fs = require('fs');
var util = require('util');
//var log_file = fs.createWriteStream(__dirname + '/logoutput/debug.log', {flags : 'w', 'mode': 0666});
var log_stdout = process.stdout;

console.log = function(d) { //
    fs.appendFile(__dirname + '/logoutput/debug.log',(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' | ' +util.format(d) +  '\n', function (err){});
    //log_file.write(util.format(d) + '\n');
    log_stdout.write((new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' | ' + util.format(d)+  '\n');
};

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
