const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Save user in session
    req.session.user = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin || false,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Logout route
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// ✅ Get current logged-in user
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json(req.session.user);
});

module.exports = router;
