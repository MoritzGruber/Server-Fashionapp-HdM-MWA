//separate debugging into a extra file
//make it optional ==> you can disable or enable debug logs

//just fore debugging
//overriding normal console log

var DEBUG = true;

logusers = function () {
    if (DEBUG == true) {
        setTimeout(function () {
            console.log("Users Online: " + users_online_cache.length + " Users Offlien: " + users_offline_cache.length);
        }, 1000);
    }
};

log = function (msg) {
    if (DEBUG == true) {
        console.log(msg);
    }
};