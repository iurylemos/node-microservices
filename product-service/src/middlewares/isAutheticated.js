const jwt = require("jsonwebtoken");

async function isAutheticated(req, res, next) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    // Bearer <token>.split(" ")[1];
    // ["Bearer": "<token>"]

    jwt.verify(token, "secret", (err, user) => {
      if (err) return res.status(403).send({ message: err });
      else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(403).send({ message: "Not authorized" });
  }
}

module.exports = { isAutheticated };
