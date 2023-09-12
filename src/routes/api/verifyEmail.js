const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const router = express.Router();

// @route    GET api/verifyEmail
// @desc     Verify a user's email address
// @access   Public
router.get("/:id", async (req, res) => {
  const token = req.params.id;
  try {
    const userId = jwt.verify(token, config.get("jwtSecret2")).user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("No corresponding user, failed to verify");
      res.status(401).json("No corresponding user, failed to verify");
    } else {
      if (!user.active) {
        user.active = true;
        await User.updateOne({ _id: userId }, user);
      }
      console.log("Successfully verified email address.");
      res.json("Successfully verified email address.");
    }
  } catch (err) {
    res.status(500).json("Server error, failed to verify");
  }
});

module.exports = router;
