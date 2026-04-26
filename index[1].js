// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── DB + Start ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
