const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User");
const routes = express.Router();

// Login
routes.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(403).send({ message: "User doesn't exist" });
  } else {
    // Check if the entered password is valid

    if (password !== user.password) {
      return res.status(403).send({ message: "Password is incorrect" });
    }

    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) console.log(err);
      else {
        return res.status(200).send({ token: token });
      }
    });
  }
});

// Register
routes.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new UserModel({
      name,
      email,
      password,
    });

    newUser.save();

    return res.json(newUser);
  }
});

module.exports = { routes };
