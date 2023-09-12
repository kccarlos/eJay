const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    POST api/cancelOrder
// @desc     Cancel an order before it is approved
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const { productID } = req.body;
      const buyer = await User.findById(req.user.id).select('-password');
      const product = await Product.findById(productID);
      
      if (product.potentialBuyers && product.potentialBuyers.includes(req.user.id)) {
        let idx = product.potentialBuyers.indexOf(req.user.id);
        product.potentialBuyers.splice(idx, 1);
      }

      if (product.potentialBuyers.length == 0) {
        product.status = "selling";
      }

      await Product.updateOne({ _id: productID }, product);

      if (buyer.orders && buyer.orders.includes(productID)) {
        let idx = buyer.orders.indexOf(productID);
        buyer.orders.splice(idx, 1);
      }
      await User.updateOne({_id: req.user.id}, {orders: buyer.orders});
      
      res.json("Order successfully created!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error: " + err.message);
    }
  }
});

module.exports = router;