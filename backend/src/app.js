// src/app.js

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";

dotenv.config(); // load .env

// 简单的日志函数，避免测试时导入问题
let otelLog = (message, level = 'INFO') => console.log(`[${level}] ${message}`);

// 非测试环境下使用 OTEL
if (process.env.NODE_ENV !== 'test') {
  import('./instrumentation.js').then((mod) => {
    otelLog = mod.otelLog;
  }).catch(() => {});
}

const app = express();

// ✅ Connect to MongoDB (REAL DB)

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to REAL MongoDB");
    otelLog("Connected to REAL MongoDB", "INFO");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    otelLog("Failed to connect to MongoDB: " + err.message, "ERROR");
    process.exit(1);
  });

// Middlewares

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// ✅ Health & Readiness routes

app.get("/health", (_req, res) => {
  otelLog("Health check requested", "INFO");
  res.status(200).json({ status: "OK" });
});

app.get("/ready", (_req, res) => {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    otelLog("Readiness check: READY", "INFO");
    return res.status(200).json({
      status: "READY",
      dbState: "connected",
    });
  }

  let stateText = "unknown";
  if (state === 0) stateText = "disconnected";
  if (state === 2) stateText = "connecting";
  if (state === 3) stateText = "disconnecting";

  otelLog("Readiness check: NOT_READY - " + stateText, "WARN");
  return res.status(503).json({
    status: "NOT_READY",
    dbState: stateText,
  });
});

// Root route

app.get("/", (_req, res) => {
  otelLog("Root route accessed", "INFO");
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄 (REAL MONGO CONNECTED)",
  });
});

// API Routes

app.use("/api/v1", api);

// Common middlewares

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;