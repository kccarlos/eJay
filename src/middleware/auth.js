const jwt = require("jsonwebtoken");
const config = require('config');
require("dotenv").config({ path: "../.env" });

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (token) {
    // verify token
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      req.user = decoded.user;
    } catch(err) {
      console.log("Please check your login status");
    }
  }
  next();
};
