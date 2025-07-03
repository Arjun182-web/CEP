import React from "react";
import {
  FaUniversity,
  FaCalendarAlt,
  FaBookOpen,
  FaPenFancy,
  FaHandsHelping,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Layout from "../common/Layout";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Departments", icon: <FaUniversity />, path: "/departments" },
    { title: "Events", icon: <FaCalendarAlt />, path: "/events" },
    { title: "Articles", icon: <FaPenFancy />, path: "/articles/new" }, // ✅ UPDATED PATH
    { title: "View Articles", icon: <FaBookOpen />, path: "/articles" }, // 👈 Add this
    { title: "Helpdesk", icon: <FaHandsHelping />, path: "/helpdesk" },
    { title: "Syllabus", icon: <FaBookOpen />, path: "/syllabus" },
  ];

  const handleLogout = async () => {
    await fetch("https://cep-backend.onrender.com/logout", {
      method: "GET",
      credentials: "include",
    });
    navigate("/login");
  };

  const handleSectionClick = (section) => {
    navigate(section.path);
  };

  return (
    <Layout>
      <div className="dashboard-video-wrapper">
        {/* 🎬 Background Video */}
        <video autoPlay loop muted playsInline className="dashboard-video">
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🔳 Dark overlay */}
        <div className="dashboard-overlay" />

        {/* 🔝 Logout button */}
        <div style={logoutContainer}>
          <button style={logoutButton} onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "5px" }} />
            Logout
          </button>
        </div>

        <div className="dashboard-container">
          <h2>🎓 Welcome to the College Portal</h2>
          <div className="card-grid">
            {sections.map((section) => (
              <div
                className="dashboard-card"
                key={section.title}
                onClick={() => handleSectionClick(section)}
              >
                <div className="icon">{section.icon}</div>
                <h5>{section.title}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

// ✅ Top-right logout styles
const logoutContainer = {
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 1000,
};

const logoutButton = {
  padding: "10px 16px",
  backgroundColor: "#ff4d4d",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 0 8px #00000066",
};
