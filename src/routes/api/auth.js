const express = require("express");
const {check, validationResult, oneOf} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

const router = express.Router();

const User = require("../../models/User");

// @route    GET api/users
// @desc     Test sign in state
// @access   Public
router.get('/', auth, async (req, res) => {
    if (!req.user) {
        res.status(401).json("Invalid token. Please login to check user info");
    } else {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
});

// @route    POST api/users
// @desc     Sign in
// @access   Public
router.post(
    '/',
    oneOf([
        check("username", "username or email required").exists(),
        check("password", "password required").exists(),
        check("password", "password length should be 6~20").isLength({ min: 6, max: 20 }),
        check("username", "username length should be 5~20").isLength({ min: 5, max: 16 }),
    ]),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {username, password} = req.body;

        try {
            // check if username exists
            let user = await User.findOne({username: username});
            if (!user) {
                user = await User.findOne({email: username});
            }

            if (!user) {
                return res
                    .status(400)
                    .json("username does not exists or password wrong!");
            }

            // encode password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch && password != user.password) {
                return res
                    .status(400)
                    .json("user does not exists or password wrong!");
            }

            if (!user.active) {
                return res.status(401).json("Inactive account. Please activate before login.");
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 36000},
                (err, token) => {
                    if (err) throw err;
                    console.log(token);
                    res.json({token});
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
