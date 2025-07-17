const mongoose = require("mongoose");
const validator = require ("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid Gender Type`
        },
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
});

userSchema.index({firstName: 1, lastName: 1})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEVTINDER@5575", {
        expiresIn: "1d"
     })

     return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash)
}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;