const mongoose = require('mongoose');
const Department = require('./models/Department');

mongoose.connect('mongodb://localhost:27017/studentdb')
  .then(() => console.log("✅ Connected"))
  .catch(err => console.log("❌ MongoDB error", err));

const departments = [
  {
    name: "Computer Science And Engineering",
    hod: { name: "Dr. Priya Nair", position: "HOD", email: "priya@college.edu" },
    faculties: [
      { name: "Mr. Anil Kumar", position: "Faculty", email: "anil@college.edu" },
      { name: "Ms. Swetha Rao", position: "Faculty", email: "swetha@college.edu" },
    ],
  },
  {
    name: "Electronics And Communication Engineering",
    hod: { name: "Dr. Sunil Menon", position: "HOD", email: "sunil@college.edu" },
    faculties: [
      { name: "Mr. Rajesh", position: "Faculty", email: "rajesh@college.edu" },
      { name: "Ms. Anu Varghese", position: "Faculty", email: "anu@college.edu" },
    ],
  },
  {
    name: "Mechanical Engineering",
    hod: { name: "Dr. Ramesh Iyer", position: "HOD", email: "ramesh@college.edu" },
    faculties: [
      { name: "Mr. Hari", position: "Faculty", email: "hari@college.edu" },
      { name: "Ms. Asha Thomas", position: "Faculty", email: "asha@college.edu" },
    ],
  },
  {
    name: "Electrical And Electronics Engineering",
    hod: { name: "Dr. Rekha Devi", position: "HOD", email: "rekha@college.edu" },
    faculties: [
      { name: "Mr. Joseph", position: "Faculty", email: "joseph@college.edu" },
      { name: "Ms. Neha", position: "Faculty", email: "neha@college.edu" },
    ],
  },
];

async function insert() {
  try {
    await Department.deleteMany({});
    await Department.insertMany(departments);
    console.log("✅ Departments inserted successfully");
  } catch (err) {
    console.error("❌ Error inserting departments:", err);
  } finally {
    mongoose.disconnect();
  }
}

insert();
