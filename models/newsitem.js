/**
 * Created by siva on 24/02/2017.
 */
/**
 * Created by siva on 16/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

var CommentsSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
});

// set up a mongoose model
var NewsItemSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    shortContent: {
        type: String,
        required: true
    },
    fullContent: {
        type: String,
        required: true
    },
    comments: [ CommentsSchema ]

});

module.exports = mongoose.model('NewsItem', NewsItemSchema);