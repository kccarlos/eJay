const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../middleware/auth");

const Product = require("../../models/Product");

router.post("/", auth, async (req, res) => {
    const latLng = req.body['coor'];
    console.log("latLng: ", latLng);
    const dist = req.body['dist']*1069;
    console.log("dist in meters: ", dist);
    try {
        let products = await Product.find({
            "isPickedUp": true,
            "location": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: latLng
                    },
                    $maxDistance: dist
                }
            }
        });
        res.json(products);
    }catch (err) {
        console.log("err: ", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

module.exports = router;