const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const HistorySchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: Schema.ObjectId,
        ref: "Product",
        required: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
});

const History = mongoose.model('History', HistorySchema);
module.exports = History;
