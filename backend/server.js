// ✅ FULL UPDATED BACKEND SERVER WITH FIXES + FORGOT PASSWORD HANDLER
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/User");
const Department = require("./models/Department");
const Helpdesk = require("./models/Helpdesk");
const Syllabus = require("./models/Syllabus");

const app = express();
const syllabusRoutes = require("./routes/syllabusRoutes");
const articleRoutes = require("./routes/articleRoutes");

// ========= MIDDLEWARE ========= //
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// ========= DATABASE CONNECTION ========= //
mongoose.connect("mongodb://localhost:27017/studentdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ========= MIDDLEWARE: CHECK ADMIN ========= //
function isAdmin(req, res, next) {
  if (req.session.user?.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied. You are not an admin.");
  }
}

// ========= AUTH ROUTES ========= //
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).send("All fields required");

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return res.status(400).send("User already exists");

  const hash = await bcrypt.hash(password, 10);
  await new User({
    username,
    email,
    password: hash,
    isAdmin: false,
    isActive: true,
  }).save();

  res.send("User registered");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || user.isAdmin || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid credentials or not a user");
  }

  if (!user.isActive) return res.status(403).send("Your account has been disabled");

  user.lastLogin = new Date();
  await user.save();

  req.session.user = { id: user._id, username: user.username, isAdmin: false };
  res.send("Login successful");
});

// ========= FORGOT PASSWORD ========= //
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Send reset link to email
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("Email not registered");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "hpzg omqs kzxn pvkj", // Use Gmail App Password
    },
  });

  await transporter.sendMail({
    from: '"CEP Portal" <yourgmail@gmail.com>',
    to: user.email,
    subject: "CEP Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.send("🔐 Password reset link sent to your email");
});

// Reset password using token
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).send("Token expired or invalid");

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.send("✅ Password has been reset successfully");
});


app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, isAdmin: true });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid admin credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  req.session.user = { id: user._id, username: user.username, isAdmin: true };
  res.send("Login successful");
});

// ========= FORGOT PASSWORD ========= //
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).send("User not found");

  // In a real app, you'd email a reset link
  console.log("🔐 Forgot password request from:", email);
  res.send("Reset instructions sent to your email (not implemented)");
});

// ========= ADMIN DASHBOARD ROUTES ========= //
app.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find({ isAdmin: false }).select("username email isActive lastLogin");
  res.json(users);
});

app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted");
});

app.patch("/admin/users/:id/toggle", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    if (user.isAdmin) return res.status(403).send("Cannot toggle admin accounts");

    user.isActive = !user.isActive;
    await user.save();

    res.send("User status toggled");
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).send("Internal server error");
  }
});

// ========= DEPARTMENT ROUTES ========= //
app.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error("❌ Error fetching departments:", err);
    res.status(500).send("Server error");
  }
});

app.get("/departments/:id", async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).send("Department not found");
    res.json(dept);
  } catch (err) {
    console.error("❌ Error fetching department:", err);
    res.status(500).send("Server error");
  }
});

app.patch("/admin/departments/:id", isAdmin, async (req, res) => {
  const { hod, faculties } = req.body;

  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).send("Department not found");

    if (hod) {
      dept.hod = {
        name: hod.name || "",
        email: hod.email || "",
        position: hod.position || "",
      };
    }

    if (faculties) {
      dept.faculties = faculties.map(f => ({
        name: f.name || "",
        email: f.email || "",
        position: f.position || "",
      }));
    }

    await dept.save();
    res.send("Department updated");
  } catch (err) {
    console.error("❌ Error updating department:", err);
    res.status(500).send("Update failed");
  }
});

// ========= ARTICLES AND SYLLABUS ========= //
app.use("/syllabus", syllabusRoutes);
app.use("/articles", articleRoutes);

// ========= HELP DESK ROUTES ========= //
app.post("/helpdesk", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");

  const { message } = req.body;
  if (!message) return res.status(400).send("Message is required");

  try {
    const ticket = await new Helpdesk({
      userId: req.session.user.id,
      message,
    }).save();

    res.send("Helpdesk ticket submitted");
  } catch (err) {
    console.error("❌ Helpdesk error:", err);
    res.status(500).send("Error submitting helpdesk ticket");
  }
});

app.get("/helpdesk/my", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");

  try {
    const tickets = await Helpdesk.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("❌ Error fetching user helpdesk tickets:", err);
    res.status(500).send("Failed to fetch helpdesk tickets");
  }
});

app.get("/admin/helpdesk", isAdmin, async (req, res) => {
  try {
    const tickets = await Helpdesk.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("❌ Admin fetch helpdesk error:", err);
    res.status(500).send("Error fetching helpdesk queries");
  }
});

app.patch("/admin/helpdesk/:id/respond", isAdmin, async (req, res) => {
  const { response } = req.body;

  try {
    const ticket = await Helpdesk.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket not found");

    ticket.response = response;
    ticket.isResponded = true;
    await ticket.save();

    res.send("Response saved");
  } catch (err) {
    console.error("❌ Error responding to ticket:", err);
    res.status(500).send("Failed to save response");
  }
});

// ========= SESSION INFO ========= //
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ id: req.session.user.id, username: req.session.user.username });
});

app.get("/api/check-admin", (req, res) => {
  res.json({ isAdmin: req.session.user?.isAdmin === true });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.clearCookie("connect.sid").send("Logged out"));
});

// ========= SERVER ========= //
app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
