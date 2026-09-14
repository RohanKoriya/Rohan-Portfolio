const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent from this address. Please try again later.",
  },
});

module.exports = { contactLimiter };
