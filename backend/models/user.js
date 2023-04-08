const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const password = require("../password");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    mnum: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    tokens:[{
        token:{type: String}
    }]
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const signintoken = jwt.sign({_id:this._id.toString()} , password.jwtprivatekey);
        //console.log(this);
        this.tokens = this.tokens.concat({token:signintoken});
        await this.save();
        return signintoken;
    } catch (error) {
        console.log(error);
    }
}

//middle ware function that works between getting the data from html document and saving in the database
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = mongoose.model("Users", userSchema);

User.createCollection();

module.exports = { User };