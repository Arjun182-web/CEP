import React, { useEffect, useState } from "react";
import EditDepartmentForm from "./admin/EditDepartmentForm"; // ✅ Ensure this path is correct

const DepartmentSection = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  useEffect(() => {
    fetchDepartments();

    // ✅ Check admin session
    fetch("https://cep-backend.onrender.com/api/check-admin", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  const fetchDepartments = () => {
    fetch("https://cep-backend.onrender.com/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setEditingDept(null);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        setError("Unable to fetch department data.");
      });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={scrollContainerStyle}>
      <div style={containerStyle}>
        <h3 style={titleStyle}>📘 Departments</h3>

        {departments.map((dept) => (
          <div key={dept._id || dept.name} style={departmentCardStyle}>
            <h4 style={deptNameStyle}>🏫 {dept.name}</h4>

            <div style={hodStyle}>
              <strong>👨‍🏫 HOD:</strong>{" "}
              {dept.hod ? (
                <span>
                  {dept.hod.name} ({dept.hod.email}) - {dept.hod.position}
                </span>
              ) : (
                "Not assigned"
              )}
            </div>

            <div>
              <strong>👥 Faculties:</strong>
              {dept.faculties && dept.faculties.length > 0 ? (
                <ul style={facultyListStyle}>
                  {dept.faculties.map((faculty) => (
                    <li key={faculty._id || faculty.email} style={facultyItemStyle}>
                      {faculty.name} ({faculty.email}) - {faculty.position}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#ccc" }}>No faculty listed</p>
              )}
            </div>

            {/* ✅ Edit Button (Admin Only) */}
            {isAdmin && (
              <button
                style={editButtonStyle}
                onClick={() => setEditingDept(dept)}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        ))}

        {/* ✅ Edit Modal */}
        {editingDept && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <button style={closeButtonStyle} onClick={() => setEditingDept(null)}>
                ❌ Close
              </button>
              <EditDepartmentForm
                department={editingDept}
                onClose={() => setEditingDept(null)}
                onUpdated={fetchDepartments}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentSection;

// 🔵 Styles
const scrollContainerStyle = {
  maxHeight: "75vh",
  overflowY: "auto",
  padding: "10px",
  scrollbarWidth: "thin",
  scrollbarColor: "#00ffff transparent",
};

const containerStyle = {
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "20px",
};

const titleStyle = {
  color: "#00ffff",
  marginBottom: "20px",
};

const departmentCardStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  position: "relative",
};

const deptNameStyle = {
  color: "#fff",
  marginBottom: "10px",
};

const hodStyle = {
  color: "#fff",
  marginBottom: "10px",
};

const facultyListStyle = {
  marginTop: "10px",
  paddingLeft: "20px",
  color: "#fff",
};

const facultyItemStyle = {
  marginBottom: "5px",
};

const editButtonStyle = {
  marginTop: "10px",
  padding: "6px 10px",
  backgroundColor: "#ffaa00",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  backgroundColor: "#111",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px #00ffff",
  maxWidth: "600px",
  width: "100%",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  background: "none",
  color: "#fff",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};
