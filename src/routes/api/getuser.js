const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route    GET api/getuser
// @desc     Get a user's info
// @access   Public
router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
