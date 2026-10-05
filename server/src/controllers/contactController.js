const validator = require("validator");
const Contact = require("../models/Contact");
const { sendContactNotification } = require("../services/emailService");

// Strips HTML/script tags from user input without pulling in a full sanitizer library.
function stripTags(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function validatePayload({ name, email, message }) {
  const errors = [];

  const cleanName = stripTags(name);
  const cleanEmail = stripTags(email);
  const cleanMessage = stripTags(message);

  if (!cleanName || cleanName.length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters." });
  }

  if (!cleanEmail || !validator.isEmail(cleanEmail)) {
    errors.push({ field: "email", message: "Please provide a valid email address." });
  }

  if (!cleanMessage || cleanMessage.length < 10) {
    errors.push({ field: "message", message: "Message must be at least 10 characters." });
  }

  return {
    errors,
    data: { name: cleanName, email: cleanEmail, message: cleanMessage },
  };
}

async function createContact(req, res, next) {
  try {
    const { errors, data } = validatePayload(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    // 1. Save to MongoDB
    await Contact.create(data);

    // 2. Dispatch notification email asynchronously in background
    // (Non-blocking: If email service is temporarily slow or down, client still receives fast response)
    sendContactNotification(data).catch((err) => {
      console.error("Failed to send notification email:", err);
    });

    return res.status(201).json({ success: true, message: "Message received safely." });
  } catch (error) {
    next(error);
  }
}

module.exports = { createContact };