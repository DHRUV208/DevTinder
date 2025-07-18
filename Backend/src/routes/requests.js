const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
           return res.status(400).json({
            message: `Invalid Status Type:  ${status}`

           })
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({
                message: "User not found"
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne(
            {
                $or: [
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
                    ]
            }

    )

    if (existingConnectionRequest){
        return res.status(400).send({
            message: "Connection Request Already Exists !!"
        })
    }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
          const data =  await connectionRequest.save();
          res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
          })
        console.log("sending a connection req");
        res.send(user.firstName, " Connection request sent");
    } catch(err) {
        res.status(400).send("ERROR: ", err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status not allowed!"
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(404).json({
                message: "Connection request Not found!"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Connection Request ${status}`,
            data
        })
    }
    catch (err) {
        res.status(400).send("Err: ", err.message);
    }

});

module.exports = requestRouter;