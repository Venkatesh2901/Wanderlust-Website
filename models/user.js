const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({          
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);      // username and password generate automatically with hashing and salting 

module.exports = mongoose.model("User",userSchema);