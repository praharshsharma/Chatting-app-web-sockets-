const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const connection = require("./db");
const { boolean } = require("joi");
const path = require('path');
app.use(bodyparser.urlencoded({extended: true}));

// database connection
connection();

const notesSchema = {
    email: { type: String, required: true },
	verified: {type:Boolean,default:false}
}

const path1 = path.join(__dirname, "../frontend/index.html");
console.log(path1);
const path = `${__dirname}/../frontend/index.html`;

const User = mongoose.model("Users",notesSchema);
console.log(__dirname);
app.get("/",function(req,res){
    console.log("in get");
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
})

//app.post

app.post("/",function(req,res){
    let newNote = new User({
        email: req.body.email,
        verfied: false
    })
    newNote.save();
    console.log("in post ");
    res.redirect("/");
})

app.listen(3000, ()=>{
    console.log("Server on 3000");
})