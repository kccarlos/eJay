const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const RatingSchema = new Schema({
    rater: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    ratee: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    isRateeSeller: {
        type: Boolean,
        required: true
    },
});

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;