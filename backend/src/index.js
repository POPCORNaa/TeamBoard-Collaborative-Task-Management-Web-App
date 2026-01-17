import app from "./app.js";
import mongoose from "mongoose";
import { env } from "./env.js";

// Connect to MongoDB before starting the server
mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Only start the server after successful DB connection
    if (process.env.NODE_ENV !== "test") {
      const server = app.listen(env.PORT, () => {
        console.log(`Listening: http://localhost:${env.PORT}`);
      });

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.error(`Port ${env.PORT} is already in use.`);
        } else {
          console.error("Failed to start server:", err);
        }
        process.exit(1);
      });
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
