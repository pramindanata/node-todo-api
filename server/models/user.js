const { mongoose } = require('../db/mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');

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

let User = mongoose.model('User', UserSchema);

module.exports = { User };