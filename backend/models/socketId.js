const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const socketSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	socketid: [{
        id:{type: String},
		time:{type:Date},
    }]

})

const socketmodel = mongoose.model("socket", socketSchema);

socketmodel.createCollection();

module.exports = {socketmodel};
