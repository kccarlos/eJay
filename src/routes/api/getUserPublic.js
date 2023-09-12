const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// @route    GET api/getUserPublic
// @desc     Get a user's public info
// @access   Public
router.get('/:id', async (req, res) => {
    // let myquery = { _id: ObjectId(req.params.id) };
    try {
    const user = await User.findById(req.params.id).select('email avatarURL username bio')
    res.json(user);
    } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
  });
module.exports = router;