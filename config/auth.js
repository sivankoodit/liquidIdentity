/**
 * Created by siva on 16/02/2017.
 */

// load up the user model
    require('../models/user');
var User = require('mongoose').model('User');
var Session = require('mongoose').model('Session');

var config = require('../config/database'); // get db config file



var authenticate = function(email, password, authCallback) {
    User.findOne({email: email}, function(err, user) {
        if (err) {
            authCallback(err, false); //Error reading from database
        }
        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {

                    var newSessionId = generateRandomCode(16);
                    var userSession = new Session({
                        sessionToken: newSessionId,
                        createdAt: new Date(),
                        createdFor: email
                    });
                    userSession.save(function(err){
                        if(err)
                        {
                            console.log(err);
                            authCallback("error creating session", null);
                        }
                        else{
                            var userInfo = {
                                name: user.firstname + ' ' + user.lastname,
                                sessionId : newSessionId
                            }
                            authCallback(null, userInfo); //User authenticated
                        }
                    });

                } else {
                    authCallback("Invalid credentials", null); //Invalid credentials
                }
            });
        } else {
            authCallback("Invalid credentials", null);  //No user found
        }
    });
};


var isValidSession = function(sessionId, sessCallback) {
    Session.findOne({sessionToken: sessionId}, function (err, sess) {
        if (err) {
            sessCallback(err, null); //Error reading from database
        }
        else {
            if (sess) {
                User.findOne({email: sess.createdFor}, function (err, user) {
                    if (err) {
                        sessCallback(err, null); //Account related to session doesnt exist
                    }
                    else {
                        sessCallback(null, user);
                    }
                });
            }
        }
    });
}



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
exports.isValidSession = isValidSession;