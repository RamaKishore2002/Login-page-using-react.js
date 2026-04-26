// server/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const { password: _, ...safeUser } = user.toObject();
  res.status(statusCode).json({ success: true, token, user: safeUser });
};

// ── POST /api/auth/register ──────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "Email is already registered." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      provider: "local",
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || user.provider !== "local")
      return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// ── OAuth Callbacks ──────────────────────────────────────────
exports.googleCallback = (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

exports.facebookCallback = (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};
