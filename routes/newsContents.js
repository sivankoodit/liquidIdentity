/**
 * Created by siva on 09/03/2017.
 */

var express     = require('express');
var config      = require('../config/database'); // get db config file
var NewsItem    = require('../models/newsitem'); // get the mongoose model
var User    = require('../models/user'); // get the mongoose model
var auth = require('../config/auth');


// bundle our routes
var newsRoutes = express.Router();

newsRoutes.post('/addNews', function(req, res) {
    if (!req.body.title || !req.body.shortContent || !req.body.fullContent) {
        res.json({success: false, msg: 'Please pass title, short and full content'});
    } else {
        var newNewsItem = new NewsItem({
            title: req.body.title,
            subtitle: req.body.subtitle || "",
            shortContent: req.body.shortContent,
            fullContent: req.body.fullContent,
            createdAt: new Date().toUTCString()
        });
        // save the user
        newNewsItem.save(function(err) {
            if (err) {
                console.log("Error adding news item: " + err);
                return res.json({success: false, msg: 'News with same title exists'});
            } else {
                res.json({success: true, msg: 'New news content added'});
            }
        });
    }
});

newsRoutes.post('/addComment', function(req, res) {
    try
    {
        validateAccessAndExec(req, res, processAddCommentReq);
    }
    catch(err){
        return res.json({success: false, error: err});
    }

});

processAddCommentReq = function(req, res, userEmail) {
    if (!req.body.newsTitle || !req.body.comment) {
        res.json({success: false, msg: 'Please pass title of the news item and comment'});
    } else {
        NewsItem.findOne({title: req.body.newsTitle}).exec(function(err, newsItem) {
            if(err || !newsItem) {
                console.log("Error adding news item: " + err);
                return res.json({success: false, msg: 'The news item cannot be found'});
            } else {
                newsItem.comments.push({
                    userEmail: userEmail,
                    text: req.body.comment,
                    createdAt: new Date().toUTCString()
                });
                newsItem.save(function(err) {
                    if (err) {
                        console.log("Error adding news item: " + err);
                        return res.json({success: false, msg: "Error adding news item: " + err});


                    } else {
                        console.log("Comment added");
                        res.json({success: true, msg: 'Comment added'});
                    }
                });

            }
        });
    }
};

validateAccessAndExec = function(req, res, processRequest) {
    auth.isValidSession(req.headers.authorization, function(err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. No valid session found.'});
        } else {
            processRequest(req, res, user.email);
        }
    });
};


newsRoutes.get('/headlines', function(req, res) {
        NewsItem.find().sort('-createdAt').select('-fullContent').select('-comments').exec(function(err, news) {
            if (err) throw err;
            if (!news) {
                return res.status(403).send({success: false, msg: 'No news content found'});
            } else {
                res.json({success: true, news: news});
            }
        });
});

newsRoutes.get('/newsitem/:title', function(req, res) {
    console.log("inside get newsitem");
    try
    {
        validateAccessAndExec(req, res, processNewsItemReq);
    }
    catch(err){
        return res.json({success: false, error: ""});
    }

});

var processNewsItemReq = function(req, res, userEmail) {
    if(!req.params.title) {
        return res.json({success: false, msg: "Pass the title of the news item"});
    } else {
        NewsItem.findOne({title: req.params.title}, function (err, newsItem) {
            if (err) throw err;
            if (!newsItem) {
                return res.status(403).send({success: false, msg: 'No news found of the title: ' + req.params.title});
            } else {
                res.json({success: true, newsItem: newsItem});
            }
        });
    }
};


module.exports = newsRoutes;