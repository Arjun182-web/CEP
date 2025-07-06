const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

dotenv.config();

const User = require("./models/User");
const Department = require("./models/Department");
const Helpdesk = require("./models/Helpdesk");

// Routes
const syllabusRoutes = require("./routes/syllabusRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

// ====== MIDDLEWARE ====== //
app.use(express.json());

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none",
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(cors({
  origin: "https://cep-frontend.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Pre-flight
app.options("*", cors({
  origin: "https://cep-frontend.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ====== DATABASE ====== //
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ====== CHECK ADMIN ====== //
function isAdmin(req, res, next) {
  if (req.session.user?.isAdmin) next();
  else res.status(403).send("Access denied. You are not an admin.");
}

// ====== AUTH ROUTES ====== //
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).send("All fields required");

  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) return res.status(400).send("User already exists");

  const hash = await bcrypt.hash(password, 10);
  await new User({ username, email, password: hash, isAdmin: false, isActive: true }).save();

  res.send("User registered");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.isAdmin || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid credentials or not a user");

  if (!user.isActive) return res.status(403).send("Your account has been disabled");

  user.lastLogin = new Date();
  await user.save();

  req.session.user = { id: user._id, username: user.username, isAdmin: false };
  res.send("Login successful");
});

// ========= ADMIN REGISTRATION ========= //
app.post("/admin/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).send("All fields are required");

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return res.status(400).send("Admin already exists");

  const hash = await bcrypt.hash(password, 10);
  await new User({
    username,
    email,
    password: hash,
    isAdmin: true,
    isActive: true,
  }).save();

  res.send("✅ Admin registered successfully");
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, isAdmin: true });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid admin credentials");

  user.lastLogin = new Date();
  await user.save();

  req.session.user = { id: user._id, username: user.username, isAdmin: true };
  res.send("Login successful");
});

// ====== PASSWORD RESET ====== //
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("Email not registered");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const resetLink = `https://cep-backend-9jfg.onrender.com/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CEP Portal" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "CEP Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.send("🔐 Password reset link sent to your email");
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).send("Token expired or invalid");

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.send("✅ Password has been reset");
});

// ====== ADMIN USER MANAGEMENT ====== //
app.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find({ isAdmin: false }).select("username email isActive lastLogin");
  res.json(users);
});

app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted");
});

app.patch("/admin/users/:id/toggle", isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  if (user.isAdmin) return res.status(403).send("Cannot toggle admin");

  user.isActive = !user.isActive;
  await user.save();
  res.send("User status toggled");
});

// ====== DEPARTMENTS ====== //
app.get("/departments", async (req, res) => {
  const depts = await Department.find();
  res.json(depts);
});

app.get("/departments/:id", async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).send("Not found");
  res.json(dept);
});

app.patch("/admin/departments/:id", isAdmin, async (req, res) => {
  const { hod, faculties } = req.body;
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).send("Not found");

  if (hod) dept.hod = hod;
  if (faculties) dept.faculties = faculties;
  await dept.save();

  res.send("Department updated");
});

// ====== HELP DESK ====== //
app.post("/helpdesk", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");
  const { message } = req.body;
  if (!message) return res.status(400).send("Message required");

  const ticket = await new Helpdesk({ userId: req.session.user.id, message }).save();
  res.send("Helpdesk submitted");
});

app.get("/helpdesk/my", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");
  const tickets = await Helpdesk.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
  res.json(tickets);
});

app.get("/admin/helpdesk", isAdmin, async (req, res) => {
  const tickets = await Helpdesk.find().populate("userId", "username email").sort({ createdAt: -1 });
  res.json(tickets);
});

app.patch("/admin/helpdesk/:id/respond", isAdmin, async (req, res) => {
  const { response } = req.body;
  const ticket = await Helpdesk.findById(req.params.id);
  if (!ticket) return res.status(404).send("Ticket not found");

  ticket.response = response;
  ticket.isResponded = true;
  await ticket.save();

  res.send("Response saved");
});

// ====== REGISTER ROUTES ====== //
app.use("/syllabus", syllabusRoutes);
app.use("/articles", articleRoutes);

// ====== SESSION INFO & LOGOUT ====== //
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

// ====== 404 Handler ====== //
app.use((req, res) => {
  res.status(404).send("🚫 Route not found");
});

// ====== START SERVER ====== //
app.listen(process.env.PORT || 5000, () =>
  console.log(`✅ Backend running on port ${process.env.PORT || 5000}`)
);
