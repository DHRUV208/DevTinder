const express = require('express');
require("./config/database");
const connectDB = require('./config/database');
const app = express();
const bcrypt = require("bcrypt");
 
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid email id!");
        } 

        const user = await User.find({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials!");
        }

        const isPasswordValid = bcrypt.compare(password, user.password );
        if(isPasswordValid){
            res.send("User Login Successful");
        } else {
            throw new Error("Invalid Credentials!");
        }

    } catch(err){

    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
   
   try {
  const users = await User.find({emailId: userEmail});
  if(users.length === 0 ) {
    res.status(404).send("User Not Found");
  } else {
    res.send(users);
  }
  
   } catch (err){
    res.status(400).send("Something Went wrong");
   } 

})

app.get("/feed", (req, res) => {

})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
    const user = await User.findByIdAndDelete(userId);

    } catch(err){

    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATE = [
        "photoUrl", 
        "about",
        "gender",
        "age"
    ];

    
    try {
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATE.includes(k) );

    if(!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }

    if(data?.skills.length > 10){
        throw new Error("Skills cannot be more than 10");
    }
        await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "before",
            runValidators: true
        });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send(err);
    }
})

connectDB()
.then(() => {
    console.log("Database Connected Established!");
    app.listen(3001, () => {
        console.log("Server is successfully listening on port 3001");
    });
})
.catch((err) => {
    console.error("Database Connection failed!", err);
}) 
