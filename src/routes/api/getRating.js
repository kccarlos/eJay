const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Rating = require("../../models/Rating");
const Product = require("../../models/Product");
const User = require("../../models/User");
const dbo = require("../../config/connect");
const {ObjectId} = require("mongodb");

// param:
// - query.userID

// response
// - userID
// - isSellerRating: true (seller rating), false (buyer rating)
// - rating: average rating. -1 if no rating found

router.get("/", auth, async function (req, res) {

    try {
        let myquery1 = {
            ratee: ObjectId(req.query.userID),
            isRateeSeller: true
        };
        let myquery2 = {
            ratee: ObjectId(req.query.userID),
            isRateeSeller: false
        };
        const sratings = await Rating.find(myquery1);
        const bratings = await Rating.find(myquery2);
        var sellerRating;
        var buyerRating;
        if (sratings.length >= 1) {
            sellerRating = sratings.filter(x => x.rating).reduce((acc,x) => acc + x.rating, 0) / sratings.length
        }
        if (bratings.length >= 1) {
            buyerRating = bratings.filter(x => x.rating).reduce((acc,x) => acc + x.rating, 0) / bratings.length
        }
        res.json({
            'userID': req.query.userID,
            'sellerRating': sellerRating,
            'buyerRating': buyerRating,
        });
    } catch (e) {
        console.log(e)
        res.status(400).send("Bad Request!");
    }
});

module.exports = router;