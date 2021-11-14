const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true //this key is just a reminder. not actual vaidation
    }
})
userSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', userSchema)