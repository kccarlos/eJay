const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatarURL: {
        type: String
    },
    firstname: {
        type: String,
        maxLength: 100,
        default: ' '
    },
    lastname: {
        type: String,
        maxLength: 100,
        default: ' '
    },
    bio: {
        type: String,
        default: 'This user does not have a bio'
    },
    joinTime: {
        type: Date,
        default: Date.now()
    },
    phone: {
        type: Number
    },
    isSeller: {
        type: Number,
        default: 0  // 0: not a seller, 1: seller, used to check when posting a new product
    }, 
    // wish list
    favorites: {
        type: [String]
    },
    // list of products attempted to order
    orders: {
        type: [ObjectId]
    },
    // list of products selling
    products: {
        type: [ObjectId]
    },
    active: {
        type: Boolean
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
