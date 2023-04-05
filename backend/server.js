const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const connection = require("./db");
const { boolean } = require("joi");
const path = require('path');
app.use(bodyparser.urlencoded({extended: true}));
const sendEmail = require("./utils/sendEmail");

// database connection
connection();

const notesSchema = {
    email: { type: String, required: true },
	verified: {type:Boolean,default:false}
}

const path1 = path.join(__dirname, "../frontend/index.html");
console.log(path1);

const User = mongoose.model("Users",notesSchema);
console.log(__dirname);
app.get("/",function(req,res){
    console.log("in get");
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
})

//app.post

app.post("/",async function(req,res){
    let mail = req.body.email;
    let newNote = new User({
        email: req.body.email,
        verfied: false
    })
    newNote.save();
    console.log("in post ");
    //module.exports = {mail}
    await sendEmail(mail, "Verify Email", "Hi");
    res.redirect("/");
})


app.listen(3000, ()=>{
    console.log("Server on 3000");
})