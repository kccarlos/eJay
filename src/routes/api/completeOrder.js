const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    POST api/completeOrder
// @desc     Complete an order upon buyer's confirm
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      const buyer = await User.findById(req.user.id);
      
      product.buyer = buyer._id;
      product.status = "completed";
      await Product.updateOne({ _id: productId }, product);

      res.json("Order successfully completed!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error: " + err.message);
    }
  }
});

module.exports = router;