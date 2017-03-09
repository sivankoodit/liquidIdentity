var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var port        = process.env.PORT || 8080;
var config      = require('./config/database'); // get db config file

var path        = require('path');
var apiRoutes = require('./routes/users');
var newsRoutes = require('./routes/newsContents');


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

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
app.use('/news', newsRoutes);


// Define the port to run on
app.set('port', 8899);

app.use(express.static('client'))

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('WWW server listening at ' + port);
});
