const express = require("express");
const { connectDB } = require("./src/db/connection");
const { routes } = require("./src/routes");

const app = express();
const PORT = process.env.PORT_ONE || 8080;
app.use(express.json());
app.use(routes);

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Product-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
