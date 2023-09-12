const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
});

const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;
