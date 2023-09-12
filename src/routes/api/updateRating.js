const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Rating = require("../../models/Rating");
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    POST api/updateRating
// @desc     Update the rating of a user
// @access   Public
router.post("/", auth, async (req, res) => {
    // get the buyer and seller with productID then check with token if the user is entitled to rate then get the id of ratee and update or insert
    if (!req.user) {
        res.status(401).json("Invalid token. Please login to check user info");
    } else {
        const product = await Product.findById(req.body.productID);
        // console.log(req.body.productID)
        const rater_ = await User.findById(req.user.id).select('-password');
        // console.log(product)
        try {
            if (rater_._id.equals(product.buyer)) {
                const rating = await Rating.updateOne({rater: rater_._id, ratee: product.seller}, {
                    rating: req.body.ratingNumber,
                    isRateeSeller: true
                }, {upsert: true});
                res.json(rating)
            } else if (rater_._id.equals(product.seller)) {
                // console.log("seller")
                const rating = await Rating.updateOne({rater: rater_._id, ratee: product.buyer}, {
                    rating: req.body.ratingNumber,
                    isRateeSeller: false
                }, {upsert: true});
                res.json(rating)
            } else {
                res.status(400).json("Invalid input. Please login to check order info");
            }
        } catch (e) {
            console.log(e)
            res.status(400).send("Bad Request!");
        }
    }
})

module.exports = router;