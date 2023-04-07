const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const connection = require("./db");
const path = require('path');
app.use(bodyparser.urlencoded({ extended: true }));
const sendEmail = require("./utils/sendEmail");
const Token = require("./models/token");
const password = require("./password");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// database connection
connection();

const notesSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    mnum: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false }
})

//middle ware function that works between getting the data from html document and saving in the database
notesSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = mongoose.model("Users", notesSchema);

app.get("/", function (req, res) {
    console.log("in get");
    res.sendFile(path.join(__dirname, "../frontend/signup.html"));
})

//app.post

app.post("/", async function (req, res) {
    let mail = req.body.email;
    let token = await new Token.Model({
        userId: mail,
        token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();
    const url = `${password.baseurl}/${mail}/verify/${token.token}`;
    console.log("in post ");
    await sendEmail(mail, "Verify Email", url);
    // res.redirect("/");
})

app.get("/signin", async (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/signin.html"));

    app.post("/signin", async (req, res) => {
        console.log("in sign in ");
        const user = await User.findOne({
            email: req.body.email
        });
        console.log(user);
        console.log(user.password);
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if (user) {
            if (isMatch) {
                //cookie creation
                
                res.redirect("/home");
            }
            else {
                res.send("Invalid password");
            }
        }
        else {
            res.send("Invalid user");
        }
    })
})

app.get("/home", async (req, res) => {
    console.log("in home ");
    //check cookie
    //if signin true  then displays data
    //else redirect signin
    console.log(req);
    res.sendFile(path.join(__dirname, "../frontend/home.html"));
        
    
})

app.get("//:id/verify/:token", async (req, res) => {
    console.log(req.url);
    console.log("in get verify");
    try {
        console.log(req.params.id);
        console.log(req.params.token);
        const token = await Token.Model.findOne({
            userId: req.params.id,
            token: req.params.token,
        });
        console.log(token);
        if (!token) return res.status(400).send({ message: "Invalid link" });
        res.sendFile(path.join(__dirname, "../frontend/info.html"));
        app.post("//:id/verify/:token", async (req, res) => {
            console.log("in verify post");
            let newNote = new User({
                email: req.params.id,
                fname: req.body.fname,
                lname: req.body.lname,
                password: req.body.password,
                mnum: req.body.mnumber,
                verified: true
            })



            await newNote.save();
            await token.deleteOne();
            res.redirect("/signin");
        })
        console.log("in try ");

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server on 3000");
})