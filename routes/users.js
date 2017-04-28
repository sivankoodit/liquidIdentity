/**
 * Created by siva on 09/03/2017.
 */

var express = require('express');
var config      = require('../config/database'); // get db config file
var auth = require('../config/auth');
var User        = require('../models/user'); // get the mongoose model
var moment  = require('moment');



// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
    if (!req.body.firstname || !req.body.password || !req.body.email) {
        res.json({success: false, msg: 'Please pass name, password and email'});
    } else {
        var newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname || "",
            password: req.body.password,
            email: req.body.email
        });

        var newSessionId = generateRandomCode(16);
        newUser.sessions.push({
            id: newSessionId,
            createdAt: new Date(),
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Email already registered.'});
            } else {
                // if user is created, create a token
                res.json({success: true, token: newSessionId, user: {firstname: newUser.firstname, lastname: newUser.lastname}, msg: 'Added as a member'});
            }
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
    auth.authenticate(req.body.email, req.body.password, function(err, userInfo) {
        if (err) throw err;
        if (!userInfo) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            res.send({success: true, token: userInfo.sessionId, user: {name: userInfo.name}, msg: 'Authentication succeeded'});
        }
    });
});


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', function(req, res) {
    if (req.headers && req.headers.authorization) {
        auth.isValidSession(req.headers.authorization, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. No valid session found.'});
            } else {
                res.json({success: true, user: {name: user.firstname + ' ' + user.lastname}, msg: 'Valid session found'});
            }
        });
    } else {
        return res.json({success: false, msg: 'No token provided.'});
    }
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/transfercode', function(req, res) {
    if (req.headers && req.headers.authorization) {
        auth.isValidSession(req.headers.authorization, function(err, user) {
            console.log(req.headers.cookie);
            console.log(req.cookies);


            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'No valid session.'});
            } else {
                var transferCode = generateRandomCode(12);
                user.transfers.push({
                    transferCode: transferCode,
                    createdAt: new Date(),
                    data: req.headers.cookie
                });

                user.save(function(err) {
                    if (err) {
                        return res.json({success: false, msg: 'Error generating code'});
                    } else {
                        res.json({success: true, code: transferCode, msg: 'Use this code to switch'});
                    }
                });
            }
        });
    } else {
        return res.json({success: false, msg: 'No token provided.'});
    }
});

// route to a restricted info (GET http://localhost:8080/api/lqaccess)
apiRoutes.get('/lqaccess/:id', function(req, res) {
    var code = req.params.id;
    console.log(req.params.id);
    if (code) {
        User.findOne({'transfers.transferCode' : code}, function(err, user){
                if(err) throw err;

                if(!user){
                    return res.status(403).send({success: false, msg: 'Authentication failed. Try generating the code again to swtich'});
                } else {
                    var transferObj = user.transfers.filter(function ( obj ) {
                        return obj.transferCode === code;
                    })[0];
                    var issuedAt = moment(transferObj.createdAt);
                    var currentTime = moment();
                    console.log('issued: ' + issuedAt.format('LTS') + "  current: " + currentTime.format('LTS'));
                    if(currentTime.diff(issuedAt, 'seconds') > 60) {
                        //user.transfers[0].remove();
                        return res.status(403).send({success: false, msg: 'Token expired. Try generating it again'});
                    } else {
                        var newSessionId = generateRandomCode(16);
                            user.sessions.push({
                            id: newSessionId,
                            createdAt: new Date(),
                        });
                        user.save(function(err){
                            if(err) {
                                res.json({success: false, msg: 'Failed to create a session'});
                            } else {
                                var arrayOfCookies = transferObj.data.split(';');
                                arrayOfCookies.forEach(function(cookie){
                                    var keyValuePair = cookie.split('=');
                                    res.cookie(keyValuePair[0], keyValuePair[1]);
                                });

                                res.json({success: true, token: newSessionId, user: {name: user.firstname + ' ' + user.lastname}, msg: 'New session created for a new device'});
                            }
                        });
                    }
                }

            });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
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
}

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/logout', function(req, res) {
    res.json({success: true, msg: 'Logged out the user.'});
});

module.exports = apiRoutes;