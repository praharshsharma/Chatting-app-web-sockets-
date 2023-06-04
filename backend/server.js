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
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");
const staticPath = path.join(__dirname , "../frontend");

app.use(cookieParser());
app.use(express.static(staticPath));

// database connection
connection();

const User = userModel.User;

app.get("/",async (req, res) => {
    console.log("in home ");
    //check cookie
    //if signin true  then displays data
    //else redirect signin
    try{
    let token = req.cookies.jwt;
    const verifyuser = jwt.verify(token,password.jwtprivatekey);
    const usr = await User.findOne({
        _id: verifyuser._id
    });
    console.log(usr.fname);
    const fname = usr.fname;
    res.render(path.join(__dirname, "../frontend/home.ejs"), {fname});

    app.post("/",async (req,res) => {
        //cookie delete
        //redirect to signin page
        token = req.cookies.jwt
        console.log("in logout");
        let activeuser = await User.findOne({_id:verifyuser._id.toString()});
        activeuser.tokens = activeuser.tokens.filter((currElement) => {
            console.log("in filter");
            return currElement.token != token;
        })

        res.clearCookie("jwt");
        await activeuser.save();

        console.log("deletion complete");
        res.redirect("/signin");
    })
    }
    catch(error) {
        res.redirect("/signin");
    }
        
})

let str = "<a href='./signin'>Signin</a>"
let str1 = "<a href='./signup'>Signup</a>"

app.post("/signup", async function (req, res) {
    console.log("in signup post");
    let mail = req.body.email;
    const user = await User.findOne({
        email: req.body.email
    });
    if(user){
        res.send(`User already exist go to ${str}`);
        return;
    }
    const presenttoken = await Token.Model.findOne({
        userId: req.body.email
    });
    if(presenttoken){
        await presenttoken.deleteOne();
    }
    
    let token = await new Token.Model({
        userId: mail,
        token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();
    const url = `${password.baseurl}/${mail}/verify/${token.token}`;
    console.log("in post ");
    await sendEmail(mail, "Verify Email", url);
    
    // app.get("/loading" , ()=> {
    //     res.send("Go to the verification link");
    // })

    // res.redirect("/loading");

})

app.get("/signup", function (req, res) {
    console.log("in get");
    res.sendFile(path.join(__dirname, "../frontend/signup.html"));
})

app.get("/signin", async (req, res) => {
    try{
        let token = req.cookies.jwt;
        const verifyuser = jwt.verify(token,password.jwtprivatekey);
        console.log(verifyuser);
        res.redirect("/");
        }
        catch(error) {
            res.sendFile(path.join(__dirname, "../frontend/signin.html"));
        }
    

    app.post("/signin", async (req, res) => {
        console.log("in sign in ");
        const user = await User.findOne({
            email: req.body.email
        });
        //console.log(user);
        //console.log(user.password);
        if (user) {
            const isMatch = await bcrypt.compare(req.body.password,user.password);
            if (isMatch) {
                //cookie creation
                const token = await user.generateAuthToken();

                res.cookie("jwt", token , {
                    expires:new Date(Date.now()+3600000),
                    httpOnly:true
                });
                console.log(req.cookies.jwt);
                
                res.redirect("/");
            }
            else {
                res.send("Invalid password");
            }
        }
        else {
            res.send(`Invalid user ${str1} here`);
        }
    })
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
            let newUser = new User({
                email: req.params.id,
                fname: req.body.fname,
                lname: req.body.lname,
                password: req.body.password,
                mnum: req.body.mnumber,
                verified: true
            })



            await newUser.save();
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