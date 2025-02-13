const express = require("express");
const { createShortUrl, redirectLongUrl} = require("../controllers/shortenController");
const urlRateLimiter = require("../middleware/rateLimiter");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/shorten", urlRateLimiter, verifyToken, createShortUrl);
router.get("/shorten/:alias", verifyToken, redirectLongUrl);

module.exports = router;
