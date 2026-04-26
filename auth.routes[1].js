// server/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  googleCallback,
  facebookCallback,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// ── Manual Auth ─────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// ── Google OAuth ─────────────────────────────────────────────
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=google" }),
  googleCallback
);

// ── Facebook OAuth ───────────────────────────────────────────
router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login?error=facebook" }),
  facebookCallback
);

module.exports = router;
