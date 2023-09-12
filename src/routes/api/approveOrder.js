const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    POST api/approveOrder
// @desc     Approve a buyer's purchase request
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const { productId, buyerUsername } = req.body;
      const product = await Product.findById(productId);
      const buyer = await User.findOne({'username': buyerUsername}).select('_id');
      product.buyer = buyer._id;
      product.status = "approved";
      await Product.updateOne({ _id: productId }, product);

      res.json("Order Successfully approved!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error: " + err.message);
    }
  }
});

module.exports = router;