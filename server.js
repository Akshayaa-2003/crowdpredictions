import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import crowdRoutes from "./routes/crowd.js";

dotenv.config();

/* ---------- CONNECT DB SAFELY ---------- */
connectDB().catch((err) => {
  console.error("DB Connection Failed:", err.message);
  process.exit(1);
});

const app = express();

/* ---------- TRUST PROXY (RENDER / VERCEL) ---------- */
app.set("trust proxy", 1);

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: true, // allow dynamic frontend origin
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully",
    uptime: process.uptime(),
  });
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/crowd", crowdRoutes);

/* ---------- 404 HANDLER ---------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ---------- GLOBAL ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
