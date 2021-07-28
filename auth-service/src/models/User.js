const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
