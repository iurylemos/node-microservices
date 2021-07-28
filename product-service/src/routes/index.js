const express = require("express");
const { isAutheticated } = require("../middlewares/isAutheticated");
const { ProductModel } = require("../models/Product");

const routes = new express.Router();

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

  return res.json(newProduct);
});

module.exports = { routes };
