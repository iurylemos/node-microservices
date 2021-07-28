const jwt = require("jsonwebtoken");

async function isAutheticated(req, res, next) {
  try {
    const token = req.headers["Authorization"].split(" ")[1];
    // Bearer <token>.split(" ")[1];
    // ["Bearer": "<token>"]

    jwt.verify(token, "secret", (err, user) => {
      if (err) return res.json({ message: err });
      else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    return res.json({ message: "Not authorized" });
  }
}

module.exports = { isAutheticated };
