var users = require('./users');
var userXusers = require('./userXusers');
var pictures = require('./pictures');
var votes = require('./votes');

users.createUser("015735412587", "Vorname Nachname", "profilePicLink");
//userXusers.createUserXUser("link", "015735412587", "015735412587");
pictures.createPicture("sourcePath", "015735412587", ["015735412587"]);
//votes.createVote(pictures.getPicture("sourcePath"), "015735412587", true);