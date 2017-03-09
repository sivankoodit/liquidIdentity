/**
 * Created by siva on 09/03/2017.
 */

var express = require('express');
var config      = require('../config/database'); // get db config file

var User        = require('../models/user'); // get the mongoose model
var TransferInfo = require('../models/transferInfo');
var jwt         = require('jwt-simple');
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
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Email already registered.'});
            } else {
                // if user is created, create a token
                var token = jwt.encode(newUser, config.secret);
                res.json({success: true, token: 'JWT ' + token, user: {firstname: newUser.firstname, lastname: newUser.lastname}, msg: 'Added as a member'});
            }
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token, user: {firstname: user.firstname, lastname: user.lastname}});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, user: {firstname: user.firstname, lastname: user.lastname}, msg: 'Logged in user ' + user.firstname + '!'});
            }
        });
    } else {
        return res.json({success: false, msg: 'No token provided.'});
    }
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/transfercode', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                var transferCode = generateTransferCode(12);
                var newTransferInfo = new TransferInfo({
                    transferCode: transferCode,
                    token: token,
                    createdAt: new Date()
                });

                newTransferInfo.save(function(err) {
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
        TransferInfo.findOne({
            transferCode: code
        }, function(err, transferInfo) {
            if (err) throw err;

            if (!transferInfo) {
                return res.status(403).send({success: false, msg: 'Authentication failed. Try generating the code again to swtich'});
            } else {
                var issuedAt = moment(transferInfo.createdAt);
                var currentTime = moment();
                console.log('issued: ' + issuedAt.format('LTS') + "  current: " + currentTime.format('LTS'));
                if(currentTime.diff(issuedAt, 'seconds') > 30) //30 seconds
                    return res.status(403).send({success: false, msg: 'Token expired. Try generating it again'});
                else {
                    var decoded = jwt.decode(transferInfo.token, config.secret);
                    User.findOne({
                        email: decoded.email
                    }, function (err, user) {
                        if (err) throw err;

                        if (!user) {
                            return res.status(403).send({
                                success: false,
                                msg: 'Authentication failed. User not found.'
                            });
                        } else {
                            res.json({
                                success: true,
                                user: {firstname: user.firstname, lastname: user.lastname},
                                msg: 'Welcome to new device  ' + user.firstname + '!'
                            });
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

generateTransferCode = function(length)
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