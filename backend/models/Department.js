// models/Department.js
//const mongoose = require("mongoose");

//const FacultySchema = new mongoose.Schema({
 // name: String,
 // position: {
  //  type: String,
  //  enum: ["HOD", "Faculty"], // clearly distinguishes HOD
  //  default: "Faculty"
//  },
 // email: String,
//});

//const DepartmentSchema = new mongoose.Schema({
  //name: { type: String, required: true },
  //faculties: [FacultySchema]
//});

//module.exports = mongoose.model("Department", DepartmentSchema);


// models/Department.js
const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
});

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },

  hod: {
    name: String,
    email: String,
    position: String, // usually "HOD"
  },

  faculties: [FacultySchema], // separate from HOD
});

module.exports = mongoose.model("Department", DepartmentSchema);

