const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route    POST api/updateUserProfile
// @desc     Update a user's profile
// @access   Public
router.post("/", auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login to check user info");
  } else {
    console.log("body =", req.body);
    const user = await User.updateOne({ _id: req.user.id }, req.body);
    console.log("res =", res);
    res.json(user);
    console.log("status normal")
  }
});

module.exports = router;
