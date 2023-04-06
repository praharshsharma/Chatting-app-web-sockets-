const mongoose = require("mongoose");
const uri = "mongodb+srv://snehashah0854:snehapraharsh1234@cluster0.q1u9itn.mongodb.net/MERN1?retryWrites=true&w=majority&ssl=true";

// Database
module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      uri,
      connectionParams,
      {connectTimeoutMS: 10000}
    );
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
};

// database();

// const collectionSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     cgpa:Number,

// })

// const Personal = new mongoose.model('Personal',collectionSchema);

// const createdocument = async ()=> {
//    try{
//         const data = new Personal({
//             name:"Sneha",
//             cgpa:9
//         })

//         const result = await data.save();
//         console.log(result);
//    }
//    catch(err){
//     console.log(err);
//    }
// }

// createdocument();

