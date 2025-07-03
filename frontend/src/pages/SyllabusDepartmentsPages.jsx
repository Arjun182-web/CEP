// src/pages/SyllabusDepartmentsPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function SyllabusDepartmentsPage() {
  const { scheme } = useParams();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`https://cep-backend-9jfg.onrender.com/syllabus/${scheme}/departments`);
        if (!res.ok) throw new Error("Failed to fetch departments.");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [scheme]);

  return (
    <AnimatedPageWrapper>
      <div style={wrapperStyle}>
        <h2 style={headingStyle}>🏫 Departments – {scheme} Scheme</h2>

        {loading && <p>Loading departments...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && departments.length === 0 && !error && <p>No departments found.</p>}

        <div style={gridStyle}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => navigate(`/syllabus/${scheme}/${dept}`)}
              style={buttonStyle}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🔧 Styles
const wrapperStyle = {
  padding: "40px",
  minHeight: "100vh",
  color: "#fff",
};

const headingStyle = {
  fontSize: "2rem",
  color: "#00ffff",
  marginBottom: "30px",
  textAlign: "center",
};

const gridStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "14px 28px",
  fontSize: "1.1rem",
  backgroundColor: "#00ffff",
  color: "#111",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 10px #00ffff",
};
