const express = require("express");
const { isAutheticated } = require("../isAutheticated");
const { connectDB } = require("./src/db/connection");
const { ProductModel } = require("./src/models/Product");
const { connectMQ } = require("./src/rabbitmq/connection");

const app = express();
const PORT = process.env.PORT_ONE || 8080;
app.use(express.json());

(async () => {
  try {
    await connectDB();
    await connectMQ();

    // Create a new product.
    // Buy a product.

    app.post("/product/create", isAutheticated, async (req, res) => {
      // req.user.email

      const { name, description, price } = req.body;
      const newProduct = new ProductModel({
        name,
        description,
        price,
      });

      return res.json(newProduct);
    });

    app.listen(PORT, () => {
      console.log(`Auth-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
