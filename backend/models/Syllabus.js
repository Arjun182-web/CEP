// backend/models/Syllabus.js
const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema(
  {
    scheme: {
      type: String, // e.g., "2019", "2023"
      required: true,
    },
    department: {
      type: String, // e.g., "CSE", "ECE"
      required: true,
    },
    year: {
      type: Number, // 1, 2, 3, 4
      required: true,
    },
    subjects: [
      {
        name: String,       // e.g., "Data Structures"
        code: String,       // e.g., "CS201"
        syllabusUrl: String // link to PDF or file
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);
