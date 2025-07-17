const express = require('express');
require("./config/database");
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




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
