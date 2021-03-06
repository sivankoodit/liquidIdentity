/**
 * Created by siva on 09/03/2017.
 */

var express = require('express');
var moment  = require('moment');
var formidable = require('formidable');
var multer = require('multer');
var fs = require('fs');

var config = require('../config/database'); // get db config file
var auth = require('../config/auth');
//var User = require('../models/user'); // get the mongoose model
var User = require('mongoose').model('User');
var Session = require('mongoose').model('Session');


var upload = multer();

// bundle our routes
var apiRoutes = express.Router();


// create a new user account (POST http://localhost:8080/api/signup)
// Receives the user name, email, password and profile picture
apiRoutes.post('/signup', function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (!fields.firstname || !fields.password || !fields.email) {
            res.json({success: false, msg: 'Please pass name, password and email'});
        } else {
            var newUser = new User({
                firstname: fields.firstname,
                lastname: fields.lastname || "",
                password: fields.password,
                email: fields.email,
                primaryAccountEmail: ""
            });
            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Email already registered.'});
                } else {
                    if(files && files.profilepic) {
                        var oldpath = files.profilepic.path;
                        var newpath = '/Users/siva/projects/liquidlogin/client/' + fields.firstname + "_" + fields.lastname + ".png";
                        fs.rename(oldpath, newpath, function (err) {
                            if (err) console.log(err);

                        });
                    }

                    var newSessionId = generateRandomCode(16);
                    var userSession = new Session({
                        sessionToken: newSessionId,
                        createdAt: new Date(),
                        createdFor: fields.email
                    });
                    userSession.save(function(err){
                        if(err)
                        {
                            console.log(err);
                            res.status(401).send({success: false, msg: 'Error creating an authorized session.'});
                        }
                        else{
                            // if user is created, create a token
                            res.json({success: true, token: newSessionId, user: {firstname: newUser.firstname, lastname: newUser.lastname}, msg: 'Added as a member'});
                        }
                    });
                }
            });
        }
    });
});


// create a new user account (POST http://localhost:8080/api/signup)
// Receives the user name, email, password and profile picture
apiRoutes.post('/createprofile', function(req, res) {
    if (req.headers && req.headers.authorization) {
        auth.isValidSession(req.headers.authorization, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(401).send({success: false, msg: 'Authentication failed. No valid session found.'});
            } else {
                if (!req.body.firstname || !req.body.email) {
                    res.json({success: false, msg: 'Please pass name and email to share access'});
                } else {
                    var newUserProfile = new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname || "",
                        primaryAccountEmail: user.email,
                        email: req.body.email,
                        password: ""
                    });
                    var profileTransferCode = generateRandomCode(16);
                    var currentTime = new Date();
                    var validUntil = req.body.sharedUntil || currentTime.setSeconds(currentTime.getSeconds() + 3600);
                    newUserProfile.transfers.push({
                        transferCode: profileTransferCode,
                        validUntil: validUntil
                    });
                    // save the user
                    newUserProfile.save(function (err) {
                        if (err) {
                            return res.json({success: false, msg: 'Email already registered.'});
                        } else {

                            // if user is created, create a token
                            res.json({
                                success: true,
                                token: profileTransferCode,
                                user: {firstname: newUserProfile.firstname, lastname: newUserProfile.lastname},
                                msg: 'Added as a profile'
                            });
                        }
                    });
                }
            }
        });
    } else {
        return res.status(401).send({success: false, msg: 'No token provided.'});
    }
});

apiRoutes.post('/shareAccess', function(req, res) {
    if (req.headers && req.headers.authorization) {
        auth.isValidSession(req.headers.authorization, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(401).send({success: false, msg: 'Authentication failed. No valid session found.'});
            } else {
                if (!req.body.email) {
                    res.json({success: false, msg: 'Please pass profile to share access'});
                } else {
                    User.findOne({email: req.body.email}, function(err, userProfile){
                        if(err){
                            return res.json({success: false, msg: 'Unable to find user profile.' + err});
                        }
                        else {
                            var profileTransferCode = generateRandomCode(16);
                            var currentTime = new Date();
                            var validUntil = req.body.sharedUntil || currentTime.setSeconds(currentTime.getSeconds() + 3600);
                            userProfile.transfers.push({
                                transferCode: profileTransferCode,
                                validUntil: validUntil
                            });
                            // save the user
                            userProfile.save(function (err) {
                                if (err) {
                                    return res.json({success: false, msg: 'Unable to create shared access.' + err});
                                } else {

                                    // if user is created, create a token
                                    res.json({
                                        success: true,
                                        token: profileTransferCode,
                                        user: {firstname: userProfile.firstname, lastname: userProfile.lastname},
                                        msg: 'Added access'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        return res.status(401).send({success: false, msg: 'No token provided.'});
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
    auth.authenticate(req.body.email, req.body.password, function(err, userInfo) {
        if (err) {
            res.status(401).send({success: false, msg: err});
        }
        else {
            if (!userInfo) {
                res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.send({success: true, token: userInfo.sessionId, user: {name: userInfo.name}, msg: 'Authentication succeeded'});
            }
        }
    });
});


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', function(req, res) {
    if (req.headers && req.headers.authorization) {
        auth.isValidSession(req.headers.authorization, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(401).send({success: false, msg: 'Authentication failed. No valid session found.'});
            } else {
                var userInfo = {
                    name: user.firstname + ' ' + user.lastname,
                    primaryAccount: user.primaryAccountEmail === "",
                };
                if(user.primaryAccountEmail === "") {
                    User.find({primaryAccountEmail: user.email}, function(err, userProfiles){
                        if(err) {
                            console.log("Error getting child profiles: " + err);
                            res.json({success: true, user: userInfo, msg: 'Valid session found'});
                        }
                        else{
                            userInfo.sharedAccessTo = [];
                            userProfiles.forEach(function(userProfile){
                                   userInfo.sharedAccessTo.push({name: userProfile.firstname + ' ' + userProfile.lastname, email: userProfile.email});
                            });
                            res.json({success: true, user: userInfo, msg: 'Valid session found'});
                        }
                    });
                }
                else {
                    res.json({success: true, user: userInfo, msg: 'Valid session found'});
                }
            }
        });
    } else {
        return res.status(401).send({success: false, msg: 'No token provided.'});
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
                var currentTime = new Date();
                var validUntil = currentTime.setSeconds(currentTime.getSeconds() + 60);
                user.transfers.push({
                    transferCode: transferCode,
                    validUntil: validUntil,
                    data: req.headers.cookie
                });

                user.save(function(err) {
                    if (err) {
                        return res.status(401).send({success: false, msg: 'Error generating code'});
                    } else {
                        res.json({success: true, code: transferCode, msg: 'Use this code to switch'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
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
                    var validUntil = moment(transferObj.validUntil);
                    var currentTime = moment();
                    console.log('validUntil: ' + validUntil.format('LTS') + "  current: " + currentTime.format('LTS'));
                    if(currentTime.isAfter(validUntil)) {
                        //user.transfers[0].remove();
                        user.transfers.id(transferObj.id).remove();
                        user.save(function(err){
                            if(err) {
                                console.log("Error removing transfer code: " + transferObj.transferCode)
                            }
                        });
                        return res.status(403).send({success: false, msg: 'Token expired. Try generating it again'});
                    } else {

                        var newSessionId = generateRandomCode(16);
                        var userSession = new Session({
                            sessionToken: newSessionId,
                            createdAt: new Date(),
                            createdFor: user.email
                        });
                        userSession.save(function(err){
                            if(err)
                            {
                                res.status(401).send({success: false, msg: 'Error creating an authorized session.'});
                            }
                            else{
                                // user.transfers.id(transferObj.id).remove();
                                // user.save(function(err){
                                //     if(err) {
                                //         console.log("Error removing transfer code: " + transferObj.transferCode)
                                //     }
                                // });

                                if(transferObj.data) {
                                    var arrayOfCookies = transferObj.data.split(';');
                                    arrayOfCookies.forEach(function (cookie) {
                                        var keyValuePair = cookie.split('=');
                                        res.cookie(keyValuePair[0], decodeURI(keyValuePair[1]));
                                    });
                                }
                                res.json({success: true, token: newSessionId, user: {name: user.firstname + ' ' + user.lastname}, msg: 'New session created for a new device'});
                            }
                        });
                    }
                }

            });
    } else {
        return res.status(403).send({success: false, msg: 'No transfer code provided.'});
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