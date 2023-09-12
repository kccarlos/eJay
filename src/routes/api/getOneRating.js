const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Rating = require("../../models/Rating");
const Product = require("../../models/Product");
const User = require("../../models/User");
const dbo = require("../../config/connect");
const {ObjectId} = require("mongodb");

// param:
// - query.productID

// response
// - _id rating id
// - ratee
// - rater: true (seller rating), false (buyer rating)
// - create_time
// - isRateeSeller
// - rating: a single rating record
router.get("/", auth, async (req, res) => {
    // get the buyer and seller with productID then check with token if the user is entitled to rate then get the id of ratee and update or insert
    if (!req.user) {
        res.status(401).json("Invalid token. Please login to check user info");
    } else {
        // console.log('USER', req.user.id)
        const product = await Product.findById(req.query.productID);
        // console.log('Product', req.query.productID)
        const rater_ = await User.findById(req.user.id).select('-password');
        // console.log(product)
        try {
            if (rater_._id.equals(product.buyer)) {
                const rating = await Rating.findOne({rater: rater_._id, ratee: product.seller});
                res.json(rating)
            } else if (rater_._id.equals(product.seller)) {
                // console.log("seller")
                const rating = await Rating.findOne({rater: rater_._id, ratee: product.buyer});
                res.json(rating)
            } else {
                res.status(400).json("Cannot access other accounts' rating record!");
            }
        } catch (e) {
            console.log(e)
            res.status(400).send("Bad Request!");
        }
    }
})

module.exports = router;