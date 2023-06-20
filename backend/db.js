const mongoose = require("mongoose");
const password = require("./password");

// Database
module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      password.uri,
      connectionParams,
      {connectTimeoutMS: 10000}
    );
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
};

