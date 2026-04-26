// server/models/User.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      select: false, // never returned by default
      minlength: [8, "Password must be at least 8 characters"],
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: {
      type: String, // OAuth provider's user ID
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate exports in dev (hot-reload)
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
