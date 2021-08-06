const express = require("express");
const { isAutheticated } = require("../middlewares/isAutheticated");
const { ProductModel } = require("../models/Product");
const { connectMQ } = require("../rabbitmq/connection");

const routes = express.Router();

// Create a new product.
// Buy a product.

routes.post("/product/create", isAutheticated, async (req, res) => {
  // req.user.email

  try {
    const { name, description, price } = req.body;
    const newProduct = new ProductModel({
      name,
      description,
      price,
    });

    newProduct.save();

    return res.json(newProduct);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send({ message: error });
    return;
  }
});

routes.get("/products", isAutheticated, async (req, res) => {
  try {
    console.log("REQUEST PRODUCTS GET");
    const products = await ProductModel.find();
    res.status(200).send(products);
    return;
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send({ message: error });
    return;
  }
});

// User sends a list of produc's IDs to buy
// Creating an order with those products and total value of sum of product's prices

routes.post("/product/buy", isAutheticated, async (req, res) => {
  try {
    let order;
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      res
        .status(400)
        .send({ message: "just permission ids if it is equal array" });
      return;
    }

    // get data on the database
    const products = await ProductModel.find({ _id: { $in: ids } });

    // connectRabbitMQ
    const { channel, conn } = await connectMQ();

    channel.sendToQueue(
      "ORDER",
      Buffer.from(
        JSON.stringify({
          products,
          userEmail: req.user.email,
        })
      )
    );

    await channel.consume("PRODUCT", function (msg) {
      console.log("aqui?", msg.content.toString());
      order = JSON.parse(msg.content);
      channel.ack(msg);
      channel.close();
      conn.close();
    });

    res.status(200).send(order);
    return;
    // return res.json(order);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send({ message: error });
    return;
  }
});

module.exports = { routes };
