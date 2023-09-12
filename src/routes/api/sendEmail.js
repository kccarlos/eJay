const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const transporter = require("../../config/email");
const User = require("../../models/User");
const Product = require("../../models/Product");
const emailAddr = config.get("emailUser");
const router = express.Router();

// @route    POST api/sendEmail
// @desc     Send an notification email to the seller according to the order's info
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const {
        productID,
        message,
        quote,
        latitude, 
        longtitude, 
        address
      } = req.body;
      const buyer = await User.findById(req.user.id).select('-password');
      const product = await Product.findById(productID).select('seller title');
      const seller = await User.findById(product.seller).select('username email');
      
      const emailTemplate = `<p>Hi ${seller.username},</p>
      <p>${buyer.username} is interested in your product: ${product.title}
      <p>Proposed price is ${quote ? quote : product.price}</p>
      <p>Delivery method is ${product.isPickedUp ? 'via pick up' : 'mail to ' + address }</p>
      <br>Here's their message: <br>\"${message}\"</p>
      <p>Contact info: <br>
      Email: ${buyer.email}<br>
      Phone: ${buyer.phone ? buyer.phone : ""}</p>
      <p>You may contact them for further discussion. 
      To approve their purchase, login and check your products page. Thank you.</p>
      <p>Best,<br>
      eJay Team</p>`;

      var mailOptions = {
        from: `eJay <${emailAddr}>`,
        to: [seller.email],
        subject: "eJay no-reply: Someone is interested in your product",
        // text: "Plaintext version of the message",
        html: emailTemplate,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw "Failed to send email to seller";
        }
        
        console.log(`Message sent to ${seller.email}: ` + info.response);
      });

      res.json("Successfully sent email, please wait for seller's contact and approval");

    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
});

module.exports = router;