const express = require('express');

const app = express();


app.get("/admin", (req, res, next) => {
    console.log("Handling the route admin 2");
    res.send("2nd route handler")
})

app.get("/admin", (req, res, next) => {
    console.log("Hanlding req 1 ");
    next();
})

// app.use("/route", routeHandler1, routeHandler2, routeHandler3);
// app.use("/route", [routeHandler1, routeHandler2], routeHandler3);
// app.use("/route", [routeHandler1, routeHandler2, routeHandler3]);

app.get("/user", (req, res) => {
    res.send({firstname: "Dhruv", lastname: "Mehta"})
})
app.get("/ab?c", (req, res) => {
    res.send({firstname: "Dhruv", lastname: "Mehta"})
})

app.post("/user", (req, res) => {
    res.send("Data successfully saved to the db");
})

app.delete("/user", (req, res) => {
    res.send("Delete successfully");
})

app.use( "/test",(req, res)=> {
    res.send("hello from the server");
})

app.use( "/hello",(req, res, next)=> {
    console.log("inside hello ....");
    // res.send("hello hello hello");
    next();
    // res.send("hello hello hello");

}, (req,res, next) => {
    console.log("2nd response !!!!!!!!")
    // res.send("2nd response !!")
    next();
}, [(req,res, next) => {
    console.log("3rd response !!!!!!!!")
    // res.send("3rd response !!")
    next();
}, (req,res,next) => {
    console.log("4th response !!!!!!!!")
    res.send("4th response !!")
    // next();
}])

app.use( "/",(req, res)=> {
    res.send("hello from dashboard");
})

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001");
});