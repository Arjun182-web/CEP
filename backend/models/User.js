//const mongoose = require("mongoose");

//const userSchema = new mongoose.Schema({
  //username: { type: String, required: true, unique: true },
  //email:    { type: String, required: true, unique: true },
 // password: { type: String, required: true },
 // isAdmin:  { type: Boolean, default: false }  // ✅ new field to identify admin
//});

//module.exports = mongoose.model("User", userSchema);

//const mongoose = require("mongoose");

//const userSchema = new mongoose.Schema({
 //username: String,
 //email: String,
// password: String,
//isAdmin: Boolean,
// isActive: { type: Boolean, default: true }, // 🆕 for enabling/disabling
 //lastLogin: Date,                            // 🆕 for login tracking
//});

//module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetToken: String,
  resetTokenExpiry: Date,

});

module.exports = mongoose.model("User", userSchema);
