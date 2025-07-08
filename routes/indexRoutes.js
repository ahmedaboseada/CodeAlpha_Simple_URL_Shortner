const express = require('express');
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
    res.render("index", { title: "URL Shortener", PUBLIC_URL: process.env.PUBLIC_URL });
});

module.exports = indexRouter;
