const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../middleware/auth");

const History = require("../../models/History");
const Product = require("../../models/Product");

// @route    GET api/product/:id
// @desc     Get a specific product's detail info
// @access   Public
router.get("/product/:id", auth, async (req, res) => {
    try {
        let product = await Product.find({_id: req.params.id});
        res.json(product);
    } catch (err) {
        res.status(500).send("Server Error: " + err.message);
    }
    
  // record user viewing history
  if (req.user) {
      try {
          let myquery2 = {user: ObjectId(req.user.id), product: ObjectId(req.params.id)};
          filter = {user: ObjectId(req.user.id), product: ObjectId(req.params.id)};
          let doc = await History.findOneAndUpdate(filter, {create_time: new Date().toISOString()
          }, {
              new: true,
              upsert: true // Make this update into an upsert
          })
      } catch (e) {
          console.error('Save history failed!');
          console.log(e);
      };
  };
});

module.exports = router;
