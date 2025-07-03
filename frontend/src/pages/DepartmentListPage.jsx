import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null); // 🆕 Track hovered item
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://cep-backend.onrender.com/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch(() => setError("Failed to fetch departments"));
  }, []);

  if (error)
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <AnimatedPageWrapper>
      <div style={containerStyle}>
        <h2 style={headingStyle}>📚 Departments</h2>
        <ul style={listStyle}>
          {departments.map((dept) => (
            <li
              key={dept._id}
              style={{
                ...itemStyle,
                ...(hovered === dept._id ? itemHoverStyle : {}),
              }}
              onClick={() => navigate(`/departments/${dept._id}`)}
              onMouseEnter={() => setHovered(dept._id)}
              onMouseLeave={() => setHovered(null)}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🎨 Stylish UI for animated background
const containerStyle = {
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: "30px",
  margin: "40px auto",
  maxWidth: "1000px",
  borderRadius: "12px",
  boxShadow: "0 0 15px #00ffff88",
  color: "#fff",
};

const headingStyle = {
  textAlign: "center",
  color: "#00ffff",
  marginBottom: "25px",
  fontSize: "1.8rem",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const itemStyle = {
  padding: "14px 20px",
  background: "#111",
  color: "#fff",
  borderRadius: "10px",
  marginBottom: "14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 8px #00ffff66",
  transition: "all 0.3s ease-in-out",
};

const itemHoverStyle = {
  transform: "scale(1.03)",
  backgroundColor: "#00ffff22",
  color: "#00ffff",
  boxShadow: "0 0 12px #00ffffcc",
};
