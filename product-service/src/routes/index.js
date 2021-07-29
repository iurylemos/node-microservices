const express = require("express");
const { isAutheticated } = require("../middlewares/isAutheticated");
const { ProductModel } = require("../models/Product");
const { connectMQ } = require("../rabbitmq/connection");

const routes = express.Router();

// Create a new product.
// Buy a product.

routes.post("/product/create", isAutheticated, async (req, res) => {
  // req.user.email

  const { name, description, price } = req.body;
  const newProduct = new ProductModel({
    name,
    description,
    price,
  });

  newProduct.save();

  return res.json(newProduct);
});

// User sends a list of produc's IDs to buy
// Creating an order with those products and total value of sum of product's prices

routes.post("/product/buy", isAutheticated, async (req, res) => {
  try {
    let order = "";
    const { ids } = req.body;

    console.log("IDS", ids);

    const products = await ProductModel.find({ _id: { $in: ids } });

    // connectRabbitMQ
    const { channel } = await connectMQ();

    channel.sendToQueue(
      "ORDER",
      Buffer.from(
        JSON.stringify({
          products,
          userEmail: req.user.email,
        })
      )
    );

    channel.consume("PRODUCT", (data) => {
      order = JSON.parse(data.content);
    });

    return res.json(order);
  } catch (error) {
    return res.json(error);
  }
});

module.exports = { routes };
