const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = { ProductModel };
