const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (typeof authHeader !== "undefined") {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        res.status(400).json({
          status: "Error",
          msg: "Session Expired. Signin again." || err.message,
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({
      status: "Error",
      msg: "Unauthorized. Login or signup to view this resource",
    });
  }
};

module.exports = jwtAuthenticated;
