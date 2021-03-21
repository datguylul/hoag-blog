const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modify_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tag', TagSchema);