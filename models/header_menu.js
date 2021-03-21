const mongoose = require('mongoose');

const HeaderMenuSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('HeaderMenu', HeaderMenuSchema);