const express = require("express");
const { UserModel } = require("./src/models/User");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./src/db/connection");

const app = express();
const PORT = process.env.PORT_ONE || 7070;
app.use(express.json());

(async () => {
  try {
    await connectDB();

    app.post("/auth/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.json({ message: "User doesn't exist" });
      } else {
        // Check if the entered password is valid

        if (password !== user.password) {
          return res.json({ message: "Password is incorrect" });
        }

        const payload = {
          email,
          name: user.name,
        };
        jwt.sign(payload, "secret", (err, token) => {
          if (err) console.log(err);
          else {
            return res.json({ token: token });
          }
        });
      }
    });

    // Register
    app.post("/auth/register", async (req, res) => {
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

    app.listen(PORT, () => {
      console.log(`Auth-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
