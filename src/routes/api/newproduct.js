const express = require("express");
const de = require("../../config/default.json");
const imgbbUploader = require("imgbb-uploader");
const multer = require('multer')
const upload = multer({dest: 'uploads-images-cache/'})
const {body, check, oneOf, validationResult} = require("express-validator");
const auth = require("../../middleware/auth"); // check if user is seller

const uploadForm = upload.fields([{name: 'media'}])
const Product = require("../../models/Product")
const Tag = require("../../models/Tag");
const User = require("../../models/User");


const router = express.Router();


router.post("/", auth, uploadForm,
    [
        check("description", "Description should be less than 200 words").isLength({max: 200}),
        check("title", "Title should not be empty neither be less than 20 words").notEmpty().isLength({max: 20}),
        check("tags", ).notEmpty(),
        check('latitude').notEmpty(),
        check('price', 'Price cannot be negative').notEmpty().isFloat({min: 0.}),
        check('longitude').notEmpty(),],
    async (req, res, next) => {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res
                .status(400)
                .json(err.array());
        }
        const post_content = req.body;

        const user = await User.findById(post_content["seller"]);
        if (user?.isSeller != 1) {
            return res.status(400).json("Please become a seller to post a product.");
        }

        if (post_content?.['price'] < 0) {
            return res
                .status(400)
                .json("Price cannot be negative");
        }

        if (req?.files?.['media'] == null) {
            return res
                .status(400)
                .json("You must select an image.");
        }

        if (post_content?.['tags'] == null) {
            return res
                .status(400)
                .json("Invalid input(s).");
        }


        const save = async () => {
            let urls = await Promise.all(req.files['media'].map(async (image) => {
                return imgbbUploader({
                    apiKey: de["imgbbHostKey"],
                    imagePath: image['path'],
                }).then((response) => {
                        console.log(response["display_url"])
                        return response["display_url"]
                    }
                ).catch((error) => console.error(error))
            }))
            const tagInfo = await Tag.findOne({name: post_content['tags']});
            post_content["tags"] = [tagInfo._id];
            post_content["mediaURLs"] = urls
            post_content["location"] = [post_content["latitude"], post_content["longitude"]]
            delete post_content["longitude"]
            delete post_content["latitude"]
            if (typeof (post_content["keyWords"]) == 'string') {
                post_content["keyWords"] = post_content["keyWords"].split(',').map(element => element.trim());
                post_content["keyWords"] = [...new Set(post_content["keyWords"])]; //remove duplicate
            } else if (!Array.isArray(post_content["keyWords"])) {
                delete post_content["keyWords"]
            }
            ;
            console.log(post_content)
            const product = new Product(post_content)
            product.save().then(result => {
                res.status(201).json({
                        message: "Done upload!",
                        userCreated: {
                            _id: result.id,
                        }
                    }
                )
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                });
            })
            console.log("saved")
        }

        save()
    }
)

module.exports = router;