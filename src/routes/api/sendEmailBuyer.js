const express = require("express");
const config = require("config");
const auth = require("../../middleware/auth");
const transporter = require("../../config/email");
const User = require("../../models/User");
const Product = require("../../models/Product");
const emailAddr = config.get("emailUser");
const router = express.Router();

// @route    POST api/sendEmailBuyer
// @desc     Send an notification email to the buyer upon approval
// @access   Public
router.post('/', auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json("Invalid token. Please login again");
  } else {
    try {
      const {
        productId,
        buyerUsername
      } = req.body;
      const buyer = await User.findOne({'username': buyerUsername}).select('-password');
      const product = await Product.findById(productId);
      const seller = await User.findById(product.seller).select('username email');

      var buyerIndex = -1;
      for (i = 0; i < product.potentialBuyersAddresses.length; i++) {
        if (product.potentialBuyers[i].onePotentialBuyer == buyer._id) {
          buyerIndex = i;
          break;
        }
      }

      const emailTemplate = `<p>Hi ${buyer.username},</p>
      <p>You attemped to purchase ${seller.username}'s product: ${product.title} has been approved.
      <br>You will be charged $${buyerIndex > 0 ? product.potentialBuyers[buyerIndex].totalPrice : product.price} for the product.</p>
      <p>Delivery method is: ${product.isPickedUp ? 'via pick up' : 'mail to ' + 
      buyerIndex > 0 ? product.potentialBuyers[buyerIndex].address : ""}</p>
      <p>Best,<br>
      eJay Team</p>`;

      console.log(emailTemplate);

      var mailOptions = {
        from: `eJay <${emailAddr}>`,
        to: [buyer.email],
        subject: "eJay no-reply: Your purchase has been approved",
        // text: "Plaintext version of the message",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw "Failed to send email to buyer";
        }
        
        console.log(`Message sent to ${buyer.email}: ` + info.response);
      });

      res.json("Successfully sent email confirmation to buyer");

    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
});

module.exports = router;