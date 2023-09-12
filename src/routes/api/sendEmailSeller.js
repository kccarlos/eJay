const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");
const transporter = require("../../config/email");
const User = require("../../models/User");
const Product = require("../../models/Product");
const emailAddr = config.get("emailUser");
const router = express.Router();

// @route    POST api/sendEmailSeller
// @desc     Send an notification email to seller when order completed
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const {
        productId
      } = req.body;
      const buyer = await User.findById(req.user.id);
      const product = await Product.findById(productId);
      const seller = await User.findById(product.seller).select('username email');

      var buyerIndex = -1;
      for (i = 0; i < product.potentialBuyersAddresses.length; i++) {
        if (product.potentialBuyers[i].onePotentialBuyer == buyer._id) {
          buyerIndex = i;
          break;
        }
      }

      const price = buyerIndex > 0 ? product.potentialBuyers[buyerIndex].totalPrice : product.price;

      const emailTemplate = `<p>Hi ${seller.username},</p>
      <p>Your transaction of product: ${product.title} with user: ${buyer.username} is complete.
      <br> Transaction price is $${price}. You will receive $${price} shortly.</p>
      <p>Thank you for choosing eJay!</p>
      
      <p>Best,<br>
      eJay Team</p>`;

      console.log(emailTemplate);

      var mailOptions = {
        from: `eJay <${emailAddr}>`,
        to: [seller.email],
        subject: "eJay no-reply: Your transaction is complete",
        // text: "Plaintext version of the message",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw "Failed to send email to buyer";
        }
        
        console.log(`Message sent to ${seller.email}: ` + info.response);
      });

      res.json("Successfully sent email confirmation to buyer");

    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
});

module.exports = router;