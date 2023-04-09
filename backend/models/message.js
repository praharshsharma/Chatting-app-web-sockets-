const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	chatswith:[{ type: String, unique:true}] ,
	messages: [{
        to:{type: String},
        text:{type:String},
        time:{type:Date}
    }]

})

const messageModel = mongoose.model("message", messageSchema);

messageModel.createCollection();

module.exports = {messageModel};