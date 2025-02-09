const mongoose = require("mongoose");
const validator = require ("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate (value) {
            if(!validator.isEmail(value)) throw new Error("Invalid Email Address")
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender Data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1682148400830-e400005b5382?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;