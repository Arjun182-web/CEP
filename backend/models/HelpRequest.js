const mongoose = require("mongoose");

const HelpRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  subject: String,
  message: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HelpRequest", HelpRequestSchema);
