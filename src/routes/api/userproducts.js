const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    GET api/userproducts
// @desc     Get list of products the user is selling
// @access   Public
router.get("/", auth, async (req, res) => {
    if (!req.user) {
        res.status(401).json("Invalid token, please login to check user info");
    } else {
        try {
            let userId = req.user.id;
            let docs = await Product.find({'seller': ObjectId(userId)});
            let products = docs.map(doc => {
                prod = {};
                prod.title = doc.title;
                prod.image = doc.mediaURLs[0];
                prod._id = doc._id;
                prod.price = doc.price;
                prod.status = doc.status;
                prod.seller = doc.seller;
                prod.tags = doc.tags;
                prod.location = doc.location;
                prod.description = doc.description;
                prod.potentialBuyers = doc.potentialBuyers;
                prod.potentialBuyersAddresses = doc.potentialBuyersAddresses;
                return prod;
            });

            products.forEach(async prod => {
                await Promise.all(prod.potentialBuyers.map(async (id) => {
                    let buyer = await User.findById(id).select('email');
                    return buyer.email;
                }))
            });

            res.json(products);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error: " + err);
        }
    }
});

module.exports = router;
