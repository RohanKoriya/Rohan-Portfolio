const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Check your .env file.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });
}

module.exports = connectDB;
