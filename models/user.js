const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validate = require('mongoose-validator');

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Provide valid Email ID',
    })
]

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        validate: emailValidator
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String,
        default: null
    }
})

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);