var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var path        = require('path');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

//app.use(express.static('app/views'));



// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

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
apiRoutes.get('/isLoggedIn', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
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

// route to a restricted info (GET http://localhost:8080/api/lqaccess)
apiRoutes.get('/lqaccess/:id', function(req, res) {
    var token = req.params.id;
    console.log(req.params.id);
    if (token) {
        console.log(token);
        var decoded = jwt.decode(token, config.secret);
        console.log(decoded);
        User.findOne({
            email: decoded.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, token: 'JWT ' + token, user: {firstname: user.firstname, lastname: user.lastname}, msg: 'Welcome to new device ' + user.name + '!'});
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

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/logout', function(req, res) {
    res.json({success: true, msg: 'Logged out the user.'});
});


app.use(function (req, res, next) {
    //console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Define the port to run on
app.set('port', 8086);

app.use(express.static('client'))

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('WWW server listening at ' + port);
});
