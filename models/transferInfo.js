/**
 * Created by siva on 09/03/2017.
 */
/**
 * Created by siva on 24/02/2017.
 */
/**
 * Created by siva on 16/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var TransferInfoSchema = new Schema({
    transferCode: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('TransferInfo', TransferInfoSchema);