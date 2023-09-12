const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const transporter = require("../../config/email");
const User = require("../../models/User");

const eJayEmailAddr = config.get("emailUser");
const eJayURL = config.get("eJayURL");
const router = express.Router();

// @route    POST api/sendVerification
// @desc     Generate a verfication link and send to user in an email 
// @access   Public
router.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.findOne({ username: username });
    if (!user) {
      user = await User.findOne({ email: username });
      if (!user) {
        return res.status(400).send("User does not exist");
      }
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.get("jwtSecret2"), (err, token) => {
      if (err) throw err;

      const emailTemplate = `<p>Hi ${username},</p>
        <p>Welcome to eJay! Before you can start shopping, please click 
        the link below to verify your email address. Thank you!</p>
        <p>${eJayURL}/verifyEmail/${token}</p>
        <p>Best,<br>
        eJay Team</p>`;
      
      // console.log(`${eJayURL}/verifyEmail/${token}`);

      var mailOptions = {
        from: `eJay <${eJayEmailAddr}>`,
        to: [user.email],
        subject: "eJay no-reply: Please verify your email",
        // text: "Plaintext version of the message",
        html: emailTemplate,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).send("Failed to send verification email");
        }

        console.log(`Message sent to ${seller.email}: ` + info.response);
      });
    });

    res.json("Verification email sent.");

  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
