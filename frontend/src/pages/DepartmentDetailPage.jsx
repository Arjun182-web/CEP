// src/pages/DepartmentDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";
import "../components/common/AnimatedPageWrapper.css";


export default function DepartmentDetailPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://cep-backend.onrender.com/departments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Department not found");
        return res.json();
      })
      .then((data) => setDepartment(data))
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch department details.");
      });
  }, [id]);

  return (
    <AnimatedPageWrapper>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : !department ? (
        <p>Loading department...</p>
      ) : (
        <div style={cardStyle}>
          <h2 style={titleStyle}>🏫 {department.name} Department</h2>

          <h4 style={sectionTitle}>👨‍🏫 HOD</h4>
          {department.hod ? (
            <p>
              {department.hod.name} ({department.hod.email}) - {department.hod.position}
            </p>
          ) : (
            <p>Not assigned</p>
          )}

          <h4 style={sectionTitle}>👥 Faculties</h4>
          {department.faculties && department.faculties.length > 0 ? (
            <ul style={listStyle}>
              {department.faculties.map((f, idx) => (
                <li key={idx}>
                  {f.name} ({f.email}) - {f.position}
                </li>
              ))}
            </ul>
          ) : (
            <p>No faculty listed</p>
          )}

          <br />
          <Link to="/departments" style={backLinkStyle}>
            ← Back to departments
          </Link>
        </div>
      )}
    </AnimatedPageWrapper>
  );
}

// 🎨 Styles
const cardStyle = {
  backgroundColor: "#111",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 0 12px #00ffff",
};

const titleStyle = {
  color: "#00ffff",
  marginBottom: "20px",
};

const sectionTitle = {
  marginTop: "20px",
  color: "#ffaa00",
};

const listStyle = {
  paddingLeft: "20px",
};

const backLinkStyle = {
  marginTop: "20px",
  display: "inline-block",
  color: "#00ffff",
  textDecoration: "none",
  fontWeight: "bold",
};
