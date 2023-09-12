const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route    POST api/updateFavorites
// @desc     Update
// @access   Public
router.post("/", auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login to check user info");
  } else {
    try {
      const user = await User.updateOne({ _id: req.user.id }, req.body);
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

module.exports = router;
