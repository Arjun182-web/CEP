import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

const schemes = ["2019", "2024"];

export default function SyllabusHomePage() {
  const navigate = useNavigate();

  return (
    <AnimatedPageWrapper>
      <div style={wrapperStyle}>
        <h2 style={headingStyle}>📚 Select Year Scheme</h2>
        <div style={gridStyle}>
          {schemes.map((scheme) => (
            <button
              key={scheme}
              onClick={() => navigate(`/syllabus/${scheme}`)}
              style={buttonStyle}
            >
              {scheme} Scheme
            </button>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 💫 Styles
const wrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px",
  minHeight: "100vh",
  color: "#fff",
};

const headingStyle = {
  fontSize: "2rem",
  color: "#00ffff",
  marginBottom: "30px",
};

const gridStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "1.1rem",
  backgroundColor: "#00ffff",
  color: "#111",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 10px #00ffff",
};

