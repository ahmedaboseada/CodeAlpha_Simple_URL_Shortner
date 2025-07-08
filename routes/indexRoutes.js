const express = require('express');
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
    // Use the dynamically determined base URL
    const baseUrl = req.baseUrl || process.env.PUBLIC_URL || `http://${req.get('host')}`;
    res.render("index", {
        title: "URL Shortener",
        PUBLIC_URL: baseUrl
    });
});

module.exports = indexRouter;
