const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    alt_title: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    display_img: {
        type: String,
        default: ""
    },
    view_count: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        default: ""
    },
    author_id: {
        type: String,
        required: true,
    },
    tags_id: {
        type: Array,
        default: []
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

module.exports = mongoose.model('Blog', BlogSchema);