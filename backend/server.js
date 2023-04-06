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

// database connection
connection();

const notesSchema = {
    email: { type: String, required: true },
    verified: { type: Boolean, required: true ,default:false}
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
    console.log("in post ");
    await sendEmail(mail, "Verify Email", url);
    // res.redirect("/");
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
        let newNote = new User({
            email: req.params.id,
            verified: true
        })
        await newNote.save();
        await token.deleteOne();
        console.log("in try ");

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server on 3000");
})