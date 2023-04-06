const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const connection = require("../db");
// const passwordComplexity = require("joi-password-complexity");
connection();

const userSchema = new mongoose.Schema({
	// firstName: { type: String, required: true },
	// lastName: { type: String, required: true },
	email: { type: String, required: true },
	// password: { type: String, required: true },
	verified: {type:bool,default:false}
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};



module.exports = { User, validate };

//module.exports = { User };

// const createdocument = async ()=> {
// 	   try{
// 	        const data = new User({
// 	            email:mail,
// 	            verified:false
// 	        })
	
// 	        const result = await data.save();
// 	        console.log(result);
// 	   }
// 	   catch(err){
// 	    console.log(err);
// 	   }
// 	}
	
// createdocument();