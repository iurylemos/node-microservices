const express = require("express");
const { isAutheticated } = require("../middlewares/isAutheticated");
const { OrderModel } = require("../models/Order");

const routes = express.Router();
// Create a new product.
// Buy a product.

routes.post("/product/create", isAutheticated, async (req, res) => {
  // req.user.email

  const { name, description, price } = req.body;
  const newOrder = new OrderModel({
    name,
    description,
    price,
  });

  return res.json(newOrder);
});
module.exports = { routes };
