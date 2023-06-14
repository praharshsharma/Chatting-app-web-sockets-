const express = require("express");
const app = express();
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
const socketModel = require("./models/socketId");
const staticPath = path.join(__dirname, "../frontend");
const io = require('socket.io')(5001, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})
app.set('view engine', 'ejs')
app.use(cookieParser());
app.use(express.static(staticPath));
app.use(bodyparser.json());
// database connection
connection();

const User = userModel.User;
const Socket = socketModel.socketmodel;

app.get("/", async (req, res) => {
    console.log("in home");
    //check cookie
    //if signin true  then displays data
    //else redirect signin
    var usr = null;
    try {
        let token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, password.jwtprivatekey);
        usr = await User.findOne({
            _id: verifyuser._id
        });
        let idsocket = null;
        io.on('connection', socket => {
            io.removeAllListeners();
            idsocket = socket.id;
            socket.on('home-page-visited', async () => {
                const user = await Socket.findOne({
                    userId: usr.email
                });
                var time = new Date();


                if (user) {
                    let temp = user.socketid;
                    temp = temp.filter((currElement) => {
                        let diff = new Date() - currElement.time;
                        if (diff < 86400000) {
                            return currElement;
                        }
                    })
                    const id = socket.id;
                    temp.push({ id, time })
                    user.socketid = temp;
                    user.save();
                }
                else {
                    async function func() {
                        const temp = [];
                        const id = socket.id;
                        temp.push({ id, time })
                        let newUser = new Socket({
                            userId: usr.email,
                            socketid: temp,
                        })
                        await newUser.save();
                    }

                    func();

                }
                return;
            })

            socket.on('send-message' , async (message,mail)=> {
                const reciever = await Socket.findOne({
                    userId: mail
                });
                
                const arr = reciever.socketid;
                var sender = usr.email;

                arr.forEach((currElement)=>{
                    socket.to(currElement.id).emit('receive-message' , message , sender , usr.fname);
                })   
            })
        })

        res.render(path.join(__dirname, "../frontend/home.ejs"), { usr });

        app.post("", async (req, res) => {
            //cookie delete
            //redirect to signin page
            token = req.cookies.jwt
            console.log("in logout");
            let activeuser = await User.findOne({ _id: verifyuser._id.toString() });
            activeuser.tokens = activeuser.tokens.filter((currElement) => {
                //console.log("in filter");
                return currElement.token != token;
            })

            res.clearCookie("jwt");
            await activeuser.save();

            const user = await Socket.findOne({
                userId: usr.email
            });
            console.log(idsocket);
            user.socketid = user.socketid.filter((currElement) => {
                console.log(currElement);
                return currElement.id != idsocket;
            })

            await user.save();

            console.log("deletion complete");
            res.redirect("/signin");
        })
    }
    catch (error) {
        res.redirect("/signin");
    }

    app.post('/endpoint', async (req, res) => {
        // Access the data from the request body
        const mail = req.body.name;
        console.log(mail);
        // Perform any necessary operations with the data
        // ...

        // Send a response back
        const user = await Socket.findOne({
            userId: mail
        });
        // console.log(user);
        if (user) {
            const dbuser = await User.findOne({
                email: user.userId
            });
            // console.log(dbuser);
            console.log("in server.js search")
            console.log(dbuser.fname);
            // res.send(dbuser.fname);
            res.json({ receivername: dbuser.fname });
        }
        else {
            res.json({ message: "User not found" });
            // res.render(path.join(__dirname, "../frontend/home.ejs"), { usr });
        }
    });

})

let str = "<a href='./signin'>Signin</a>"
let str1 = "<a href='./signup'>Signup</a>"



app.post("/signup", async function (req, res) {
    console.log("in signup post");
    let mail = req.body.email;
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        res.send(`User already exist go to ${str}`);
        return;
    }
    const presenttoken = await Token.Model.findOne({
        userId: req.body.email
    });
    if (presenttoken) {
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
    try {
        let token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, password.jwtprivatekey);
        console.log(verifyuser);
        res.redirect("/");
    }
    catch (error) {
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
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                //cookie creation
                const token = await user.generateAuthToken();

                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true
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