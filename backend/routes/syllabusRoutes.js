const express = require("express");
const router = express.Router();
const Syllabus = require("../models/Syllabus");

// ✅ GET all year schemes
router.get("/schemes", async (req, res) => {
  try {
    const schemes = await Syllabus.distinct("scheme");
    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(500).send("Error fetching schemes");
  }
});

// ✅ GET departments for a scheme
router.get("/:scheme/departments", async (req, res) => {
  try {
    const departments = await Syllabus.find({ scheme: req.params.scheme }).distinct("department");
    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).send("Error fetching departments");
  }
});

// ✅ GET years of study for a scheme and department
router.get("/:scheme/:department/years", async (req, res) => {
  try {
    const years = await Syllabus.find({
      scheme: req.params.scheme,
      department: req.params.department,
    }).distinct("year");
    res.json(years);
  } catch (err) {
    console.error("Error fetching years:", err);
    res.status(500).send("Error fetching years");
  }
});

// ✅ GET syllabus subjects for scheme, department, and year
router.get("/subjects/:scheme/:department/:year", async (req, res) => {
  try {
    const { scheme, department, year } = req.params;

    const syllabus = await Syllabus.findOne({
      scheme,
      department,
      year: parseInt(year), // Ensure year is a number
    });

    if (!syllabus || !Array.isArray(syllabus.subjects)) {
      return res.status(404).send("Syllabus not found or malformed");
    }

    // ✅ Return the actual subjects array
    res.json(syllabus.subjects);
  } catch (err) {
    console.error("Error fetching syllabus:", err);
    res.status(500).send("Error fetching syllabus");
  }
});

module.exports = router;
