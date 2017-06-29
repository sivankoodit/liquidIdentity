/**
 * Created by siva on 16/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var SessionSchema = new Schema({
    sessionToken: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    createdFor: { // Email of the user
        type: String
    }
});


// set up a mongoose model
var TransferInfoSchema = new Schema({
    transferCode: {
        type: String,
        unique: true,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    data: {
        type: String
    }
});


// set up a mongoose model
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    primaryAccountEmail: {
        type: String
    },
    transfers: [TransferInfoSchema]
});


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Session', SessionSchema);
module.exports = mongoose.model('User', UserSchema);
