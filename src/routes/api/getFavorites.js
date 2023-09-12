const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../middleware/auth");

const router = express.Router();
const Product = require("../../models/Product");
const User = require("../../models/User");

// @route    GET api/getFavorites
// @desc     Get list of products the user add to favorites
// @access   Public
router.get("/", auth, async (req, res) => {
    if (!req.user) {
        res.status(401).json("Please login to check user info");
    } else {
        try {
            userId = req.user.id;
            let user = await User.find({'_id': ObjectId(userId)});
            let favList = user[0].favorites?.map(fav => ObjectId(fav));
            let docs = await Product.find({'_id': favList});
            let products = docs.map(doc => {
                prod = {};
                prod.title = doc.title;
                prod.image = doc.mediaURLs[0];
                prod._id = doc._id;
                prod.price = doc.price;
                prod.description = doc.description;
                return prod;
            });
            res.json(products);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error: " + err);
        }
    }
});

module.exports = router;