const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res)=> {
    try{
       
        const user = req.user;
    res.send(user);
} catch(err){
    res.status(400).send("ERROR: ", err.message);
}

});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
       if( !validateEditProfile(req)){
        throw new Error("Invalid Edit Request")
       }

       const loggedInUser = req.user;
       Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));

       await loggedInUser.save()
    //    res.send(`${loggedInUser.firstname}, your profile is updated successfully`)
    res.json({
        message: `${loggedInUser.firstname}, your profile is updated successfully`,
        data: loggedInUser
    })

    } catch (error){
        res.status(400).send("ERROR: ", error.message);
    }
})

module.exports = profileRouter;