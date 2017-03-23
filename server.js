var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var config      = require('./config/database'); // get db config file

var path        = require('path');
var apiRoutes = require('./routes/users');
var newsRoutes = require('./routes/newsContents');


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*app.use(function(req, resp, next){

    console.log(req.connection.remoteAddress);
    console.log(req.ip);
    console.log(req.hostname);

    next();
});*/

// log to console
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database);

app.use(function (req, res, next) {
    // No need to set this unless we allow requests from pages of other websites
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Now the REST APIs are only for get and post.
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

// connect the api routes under /api/*
app.use('/api', apiRoutes);
app.use('/news', newsRoutes);

app.use(express.static('client'))

// Define the port to run on
app.set('port', 8899);
// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('WWW server listening at ' + port);
});
