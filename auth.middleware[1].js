// server/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Accept Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized. Token invalid or expired." });
  }
};
