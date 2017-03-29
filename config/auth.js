/**
 * Created by siva on 16/02/2017.
 */

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file



var authenticate = function(email, password, authCallback) {
    User.findOne({email: email}, function(err, user) {
        if (err) {
            authCallback(err, false); //Error reading from database
        }
        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    var sessId = generateRandomCode(16);
                    user.sessions.push({
                        id: sessId,
                        createdAt: new Date()
                    });
                    user.save(function(err){
                        if (err) {
                            authCallback(err, false);
                        } else {

                            var userInfo = {
                                name: user.firstname + ' ' + user.lastname,
                                sessionId : sessId
                            }
                            authCallback(null, userInfo); //User authenticated
                        }
                    });

                } else {
                    authCallback(null, false); //Invalid credentials
                }
            });
        } else {
            authCallback(null, false);  //No user found
        }
    });
};


var isValidSession = function(sessionId, sessCallback) {


    User.findOne({'sessions.id': sessionId}, function(err, user) {
        if (err) {
            sessCallback(err, false); //Error reading from database
        }
        if (user) {
                    sessCallback(null, user);
                } else {
                    sessCallback(null, false); //Account related to session doesnt exist
                }

    });
};



generateRandomCode = function(length)
{
    var charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var code = "";
    for(x=0;x<length;x++)
    {
        i = Math.floor(Math.random() * 62);
        code += charSet.charAt(i);
    }
    return code;
};

exports.authenticate = authenticate;
exports.addNewUser = addNewUser;
exports.isValidSession = isValidSession;