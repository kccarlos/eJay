const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");

// @route    POST api/allproducts
// @desc     Get all products in the database
// @access   Public
router.get("/", async (req, res) => {
  try {
    let products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
