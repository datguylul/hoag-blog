const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    linkedin_link: {
        type: String,
        default: ""
    },
    google_link: {
        type: String,
        required: true,
    },
    twitter_link: {
        type: String,
        default: ""
    },
});

module.exports = mongoose.model('Tag', TagSchema);