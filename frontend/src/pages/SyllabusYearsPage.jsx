// src/pages/SyllabusYearsPage.jsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function SyllabusYearsPage() {
  const { scheme, department } = useParams();
  const navigate = useNavigate();

  return (
    <AnimatedPageWrapper>
      <div style={wrapperStyle}>
        <h2 style={headingStyle}>
          🎓 Select Year – {department} ({scheme} Scheme)
        </h2>

        <div style={buttonContainer}>
          {years.map((label, idx) => (
            <button
              key={idx}
              onClick={() =>
                navigate(`/syllabus/${scheme}/${department}/${idx + 1}`)
              }
              style={buttonStyle}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🎨 Styles
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

const buttonContainer = {
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
