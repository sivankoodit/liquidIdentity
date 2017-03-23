/**
 * Created by siva on 16/03/2017.
 */
/**
 * Created by siva on 24/02/2017.
 */
/**
 * Created by siva on 16/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var SessionSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    createdFor: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Session', SessionSchema);