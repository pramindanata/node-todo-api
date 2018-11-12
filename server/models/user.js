const { mongoose } = require('../db/mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

UserSchema.methods.toJson = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ '_id': user._id.toHexString(), access }, 'abc123').toString();

    user.tokens = user.tokens.concat({ access, token });
    
    return user.save()
        .then(() => {
            return token;
        });
};  

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({ email })
        .then((doc) => {
            if (doc === null) {
                throw new Error("Invalid email or password given.");
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, doc.password, (err, data) => {
                    if (!data) {
                        reject("Invalid email or password given.");
                    }
                    
                    resolve(doc);
                });
            });
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                
                next();
            });
        });
    } else {
        next();
    }
});


let User = mongoose.model('User', UserSchema);

module.exports = { User };