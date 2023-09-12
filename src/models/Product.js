const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const buyerAddressSchema = mongoose.Schema({
  onePotentialBuyer: Schema.ObjectId,
  address: String,
  latitude: Number,
  longtitude: Number,
  totalPrice: Number
});


const ProductSchema = new Schema({
    seller: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    buyer: {
      type: Schema.ObjectId,
      ref: "User",
      default: undefined
    }
    ,
    potentialBuyers: {
      type: [Schema.ObjectId],
      default: []
    }
    ,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [{ type: Schema.ObjectId, ref: "Tag" }]
    },
    mediaURLs: {
      type: [String],
      default: undefined
    },
    price: {
      type: Number,
      required: true
    },
    isPickedUp: {
      type: Boolean,
      default: false
    },
    location: {
      type: [Number],
      required: true
    },
    status: {
      type: String,
      required: true ,
      default: 'selling', // selling, pending, approved, inProgress, completed, deleted 
      // only selling and pending status will show up on the main page
      // completed and quit are inactive 
    },
    keyWords: {
        type: [String],
        default: []
    },
    negotiable: {
        type: Boolean,
        default: false,
    },
    showContact: {
      type: Boolean,
      default: false
    },
    isPickedUp: {
      type: Boolean,
      default: false
    },
    potentialBuyersAddresses: {
      type: [buyerAddressSchema],
      default: []
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
