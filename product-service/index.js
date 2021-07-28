const express = require("express");
const { connectDB } = require("./src/db/connection");

const app = express();
const PORT = process.env.PORT_ONE || 8080;
app.use(express.json());

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Auth-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
