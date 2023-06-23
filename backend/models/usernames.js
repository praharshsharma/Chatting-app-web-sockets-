const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nameSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    }
})

const namemodel = mongoose.model("name", nameSchema);

namemodel.createCollection();

module.exports = {namemodel};