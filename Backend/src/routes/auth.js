const express = require("express");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.get('/', );

authRouter.post("/signup", async (req, res) => {
    validateSignupData(req); 

    const {firstName, lastName, emailId, password} = req.body;

    const passwordHash = bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });
    try{
        await user.save();
        res.send("User added Successfully");
    } catch (err) {
        res.status(400).send("Error saving the user: ", err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid email id!");
        } 

        const user = await User.find({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials!");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.send("User Login Successful");
        } else {
            throw new Error("Invalid Credentials!");
        }

    } catch(err){

    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful");
})


authRouter.post();

authRouter.patch();

module.exports = authRouter;