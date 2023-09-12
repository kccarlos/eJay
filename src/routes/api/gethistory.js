const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');

const Product = require("../../models/Product");
const History = require("../../models/History");

const Tags = {
    "6347460e3e85137e0e426925": 'furniture',
    "6347460e3e85137e0e426927": 'book',
    "6347460e3e85137e0e426929": 'cookware & tableware',
    "6347460e3e85137e0e42692b": 'children & nursery',
    "6347460e3e85137e0e42692d": 'storage & organization',
}

// @route    GET api/gethistory
// @desc     Get user's browsing history
// @access   Public
router.get("/", auth, async function (req, res) {
    var browsingHistory = [];
    var browsingCategory = {};
    // var maxCategory = "";
    var products_id = [];
    // console.log("user id from token: ", req.user.id);
    if (!req.user) {
        res.status(401).json("Please login to get browsing history.");
    }
    else {
        try{
            let products = await History.find({'user': req.user.id}, {'product': 1, '_id': 0});
            for(i = 0; i < products.length; i++){
                products_id.push(products[i].product);
            }
        }catch(err){
            console.error(err);
            res.status(500).send("Server error: " + err);
        }
        try{
            for(i = 0; i < products_id.length; i++){
                let doc = await Product.findOne({'_id': products_id[i]});
                browsingHistory.push(doc.title);
                let category = Tags[doc.tags];
                if(category in browsingCategory){
                    browsingCategory[category] += 1;
                }
                else{
                    browsingCategory[category] = 1;
                }
            }
            let sortedCategory = Object.keys(browsingCategory).sort(function(a,b){return browsingCategory[b]-browsingCategory[a]});
            browsingHistory.push(sortedCategory[0]);
            res.json(browsingHistory);
        }catch(err){
            console.error(err);
            res.status(500).send("Server error: " + err);
        }
        // console.log("products: ", products);
        // console.log("req.user: ", ObjectId(req.params.id));
        // let myquery = ({user: req.user.id}, {product:1, _id:0});
        // db_connect
        //     .collection("histories")
        //     .find(myquery)
        //     .toArray(function (err, result) {
        //         if (err) throw err;
        //         res.json(result);
        // });
        // db_connect
        //     .collection("histories").find({user: ObjectId(req.user.id)}, {product:1})
        //     .toArray(function(err, result) {
        //         if(err) throw err;
        //         console.log("result: ", result[0].product);
        //     });
        // console.log("products: ", products_id);
        // for (let i = 0; i < products_id.length; i++) {
        //     let product = db_connect.collection("products").find({_id: products_id[i]}, {_id:0, title:1}).toArray();
        //     browsingHistory.push(product);
        // }
        // res.json(browsingHistory);
    }
 });

module.exports = router;