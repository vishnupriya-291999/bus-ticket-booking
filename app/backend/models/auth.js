const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
    email: {type:String, required: true, unique: true},
    pass: {type:String, required: true},
    fname: {type:String, required: true},
    lname: {type:String, required: true},
    gender: {type:String, required: true},
    age: {type: Number, required: true},
    phone: {type:String, required: true},
    tickets: {type:Array}

})

userSchema.plugin(uniqueValidator, {message: 'This Email exists'});
module.exports = mongoose.model('User', userSchema)