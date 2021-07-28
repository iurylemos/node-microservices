const mongoose = require("mongoose");
const { url, pwd, user } = require("./config");

async function connectDB() {
  try {
    await mongoose.connect(url, {
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      user: user,
      pass: pwd,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Product-Service DB Connected");
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
}

module.exports = { connectDB };
