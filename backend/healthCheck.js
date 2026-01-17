// backend/healthCheck.js
import dotenv from "dotenv";
dotenv.config(); // load .env from backend/.env

import app from './src/app.js';//
import mongoose from "mongoose";

const port = process.env.PORT || 3000;

// ===========================
// Connect to MongoDB
// ===========================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// ===========================
// Health check endpoints
// ===========================

// Alive check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

// Readiness check – MongoDB connection status
app.get("/ready", (_req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    res.status(200).json({ status: "READY" });
  } else {
    res.status(500).json({
      status: "NOT READY",
      mongoState: state,
      message: "MongoDB is not fully connected",
    });
  }
});

// ===========================
// Start the server
// ===========================
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
