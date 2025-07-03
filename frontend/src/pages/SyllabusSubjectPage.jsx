import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function SyllabusSubjectPage() {
  const { scheme, department, year } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🧼 Hide scrollbar
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      ::-webkit-scrollbar {
        display: none;
      }
      * {
        scrollbar-width: none;        /* Firefox */
        -ms-overflow-style: none;     /* IE 10+ */
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  // 🎓 Fetch syllabus subjects
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(
          `https://cep-backend.onrender.com/syllabus/subjects/${scheme}/${department}/${year}`
        );
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [scheme, department, year]);

  return (
    <AnimatedPageWrapper>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          {/* 🔙 Back Button */}
          <button onClick={() => navigate(-1)} style={backButtonStyle}>
            ⬅️ Back
          </button>

          <h2 style={headingStyle}>
            📘 {scheme} Scheme – {department} – Year {year}
          </h2>

          {loading && <p>Loading syllabus...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && subjects.length === 0 && (
            <p>No syllabus found for this selection.</p>
          )}

          {!loading && subjects.length > 0 && (
            <div style={scrollContainer}>
              <ul style={listStyle}>
                {subjects.map((subject, idx) => (
                  <li key={idx} style={itemStyle}>
                    <strong>{subject.name}</strong>
                    <a
                      href={subject.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={downloadLinkStyle}
                    >
                      ⬇️ Download PDF
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🎨 Styles
const wrapperStyle = {
  padding: "20px",
  minHeight: "100vh",
  overflowY: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const cardStyle = {
  width: "100%",
  maxWidth: "800px",
  backgroundColor: "#111",
  color: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 0 15px #00ffff",
};

const backButtonStyle = {
  backgroundColor: "#00bcd4",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  marginBottom: "20px",
  cursor: "pointer",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "#00ffff",
};

const scrollContainer = {
  maxHeight: "500px",
  overflowY: "auto",
  paddingRight: "10px",
};

const listStyle = {
  listStyle: "none",
  paddingLeft: 0,
};

const itemStyle = {
  marginBottom: "15px",
  padding: "12px",
  backgroundColor: "#222",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const downloadLinkStyle = {
  backgroundColor: "#00bcd4",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};
