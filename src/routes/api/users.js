const express = require("express");
const { check, validationResult, oneOf} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('config');
const transporter = require("../../config/email");
const eJayEmailAddr = config.get("emailUser");
const User = require("../../models/User");

const eJayURL = config.get("eJayURL");
const router = express.Router();

router.use(express.json());
// @route    POST api/users
// @desc     Register new account
// @access   Public
router.post(
  "/",
    oneOf([
    check("username", "username length should be 5~20").isLength({ min: 5, max: 16 }),
    check("email", "invalid email address").isEmail(),
    check("password", "password length should be 6~20").isLength({ min: 6, max: 20 }),
    check("password2").custom((value, {req})=> {
      if (value!==req.body.password){
        throw new Error("Password confirmation does not password")
      }
      return true
    }),
  ]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {username, email, password, password2 } = req.body;

    try {
      // check if username exists
      let user = await User.findOne({ username: username });
      if (user) {
        return res
          .status(400)
          .json("username already exists!");
      }

      if (email==null){
        return res
            .status(400)
            .json("Please provide valid input!");
      }
      if (email.split("@")[1]!=="jhu.edu"){
        return res
            .status(400)
            .json("Please use hopkins email!");
      }

      user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json("this email is already registered!");
      }

      user = new User({
        username,
        email,
        password
      });

      // encode password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save
      await user.save();
      res.json("Success.");

    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
