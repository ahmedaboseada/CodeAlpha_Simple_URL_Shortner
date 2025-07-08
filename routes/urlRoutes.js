const express = require('express');
const {nanoid} = require('nanoid');
const Url = require("../models/urlModel");

const urlRouter = express.Router();

urlRouter.post("/shorten", async (req, res) => {
    try {
        const {originalUrl} = req.body;

        if (!originalUrl) {
            return res.status(400).json({error: "URL is required"});
        }

        const shortUrl = nanoid(6);
        const existURL = await Url.findOne({shortUrl});
        if (existURL) {
            return res.status(400).json({error: "Short URL already exists"});
        }

        const url = await Url.create({originalUrl, shortUrl});
        res.status(201).json({
            message: "URL shortened successfully",
            url: `${process.env.PUBLIC_URL}/short/${shortUrl}`, // Updated URL format
            shortUrl,
            originalUrl,
            clicks: url.clicks
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

urlRouter.get("/:shortUrl", async (req, res) => {
    try {
        const {shortUrl} = req.params;
        const url = await Url.findOne({shortUrl});
        if (!url) {
            return res.status(404).json({error: "URL not found"});
        }
        url.clicks++;
        await url.save();
        console.log(`Redirecting to: ${url.originalUrl}`);
        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = urlRouter;
