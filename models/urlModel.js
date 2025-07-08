const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    clicks: {
        type: Number,
        default: 0
    }
    // user
},{
    timestamps: true
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
