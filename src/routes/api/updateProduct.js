const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Products = require('../../models/Product');

// @route    POST api/updateProducts
// @desc     Update the detail info of a product
// @access   Public
router.post("/", auth, async (req, res) => {
  console.log('req = ', req)
  if (!req.user) {
    res.status(401).json("Invalid token. Please login to modify products");
  } else {
    const product = await Products.updateOne({ _id: req.body._id }, req.body);
    res.json(product);
  }
});

module.exports = router;
