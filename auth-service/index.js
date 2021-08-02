const express = require("express");
const { connectDB } = require("./src/db/connection");
const { routes } = require("./src/routes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT_ONE || 7070;
app.use(cors());
app.use(express.json());
app.use(routes);

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
