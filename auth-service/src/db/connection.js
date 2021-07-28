const mongoose = require("mongoose");
const { url, pwd, user } = require("./config");

async function connectDB() {
  try {
    await mongoose.connect(url, {
      user: user,
      pass: pwd,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Auth-Service DB Connected");
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
}

module.exports = { connectDB };