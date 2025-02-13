const rateLimit = require("express-rate-limit");

const urlRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 requests per 15 minutes per IP
    message: { error: "Rate limit exceeded! Try again later." },
});

module.exports = urlRateLimiter;
