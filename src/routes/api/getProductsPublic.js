const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const Product = require("../../models/Product");

// @route    GET api/getUserPublic
// @desc     Get a user's public info
// @access   Public
router.get('/:id', async (req, res) => {
    // let myquery = { _id: ObjectId(req.params.id) };
    try {
        // const user = await User.findById(req.params.id).select('email avatarURL username bio')
        let docs = await Product.find({ 'seller': ObjectId(req.params.id) });
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
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;