const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    POST api/createOrder
// @desc     Create an order when a buyer made a purchase request
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const {
        productID,
        message,
        quote,
        latitude, 
        longtitude, 
        address
      } = req.body;
      const buyer = await User.findById(req.user.id).select('-password');
      const product = await Product.findById(productID);
      if (product.seller.equals(buyer._id)) {
        res.status(400).json('User cannot buy own products');
      }
      if (!product.potentialBuyers) {
        product.potentialBuyers = [];
      }
      if (!product.potentialBuyers.includes(req.user.id)) {
        product.potentialBuyers.unshift(req.user.id);
      }
      // deal with delivery address
      if (!product.potentialBuyersAddresses) {
        product.potentialBuyersAddresses = [];
      }
      if (!product.isPickedUp) {
        addressAndQuote = {
          onePotentialBuyer: req.user.id,
          address: address,
          latitude: latitude,
          longtitude: longtitude,
          totalPrice: quote
        }
      } else {
        // for pick up, only include price
        addressAndQuote = {
          onePotentialBuyer: req.user.id,
          address: '',
          latitude: 0,
          longtitude: 0,
          totalPrice: quote
        }
      };
      product.potentialBuyersAddresses.unshift(addressAndQuote)
      product.status = "pending";
      console.log(product)
      await Product.updateOne({ _id: productID }, product);
      if (!buyer.orders) {
        buyer.orders = [];
      }
      buyer.orders.unshift(productID);
      await User.updateOne({_id: req.user.id}, {orders: buyer.orders});
      res.json("Order successfully created!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error: " + err.message);
    }
  }
});

module.exports = router;