//const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 }

	
},{
	bufferCommands : false
});

const Model = mongoose.model("token", tokenSchema);

Model.createCollection();

module.exports = {Model};