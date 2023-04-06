const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const connection = require("./db");
const { boolean } = require("joi");
const path = require('path');
app.use(bodyparser.urlencoded({ extended: true }));
const sendEmail = require("./utils/sendEmail");
const Token = require("./models/token");
const password = require("./password");
const crypto = require("crypto");

// database connection
connection();

const notesSchema = {
    email: { type: String, required: true },
    verified: { type: Boolean, default: false }
}

const User = mongoose.model("Users", notesSchema);

app.get("/", function (req, res) {
    console.log("in get");
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
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
    // let newNote = new User({
    //     email: req.body.email,
    //     verfied: false
    // })
    // newNote.save();
    console.log("in post ");
    //module.exports = {mail}
    await sendEmail(mail, "Verify Email", url);
    // res.redirect("/");
})

app.get("/:id/verify/:token", async (req, res) => {
    console.log(req.url);
    // const requrl = req.url;
    // const mailid = "";
    // const to = "";
    // let i =2;
    // while(requrl[i]!='/'){
    //     mailid.concat(requrl[i]);
    //     i++;
    // }
    // i+=7;
    // while(i!=requrl.length){
    //     to.concat(requrl[i]);
    //     i++;
    // }
    // console.log(mailid);
    // console.log(to);
    console.log("in get verify");
    try {
        // const token = await Token.findOne({
        //     userId: req.params.id,
        //     token: req.params.token,
        // });
        // if (!token) return res.status(400).send({ message: "Invalid link" });
        // let newNote = new User({
        //     email: req.params.id,
        //     verfied: true
        // })
        // newNote.save();
        // await token.remove();
        console.log("in try ");

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server on 3000");
})