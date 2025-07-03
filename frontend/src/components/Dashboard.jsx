/*import React from "react";
import { FaUniversity, FaCalendarAlt, FaBookOpen, FaPenFancy, FaHandsHelping } from "react-icons/fa";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Departments", icon: <FaUniversity />, path: "/departments" },
    { title: "Events", icon: <FaCalendarAlt />, path: "/events" },
    { title: "Articles", icon: <FaPenFancy />, path: "/articles" },
    { title: "Helpdesk", icon: <FaHandsHelping />, path: "/helpdesk" },
    { title: "Syllabus", icon: <FaBookOpen />, path: "/syllabus" },
  ];

  return (
    <div className="dashboard-container">
      <h2>🎓 Welcome to the College Portal</h2>
      <div className="card-grid">
        {sections.map((section) => (
          <div
            className="dashboard-card"
            key={section.title}
            onClick={() => navigate(section.path)}
          >
            <div className="icon">{section.icon}</div>
            <h5>{section.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
*/
import React from "react";
import {
  FaUniversity,
  FaCalendarAlt,
  FaBookOpen,
  FaPenFancy,
  FaHandsHelping,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Layout from "../common/Layout";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Departments", icon: <FaUniversity />, path: "/departments" },
    { title: "Events", icon: <FaCalendarAlt />, path: "/events" },
    { title: "Articles", icon: <FaPenFancy />, path: "/articles" },
    { title: "Helpdesk", icon: <FaHandsHelping />, path: "/helpdesk" },
    { title: "Syllabus", icon: <FaBookOpen />, path: "/syllabus" },
  ];

  return (
    <div className="dashboard-video-wrapper">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="dashboard-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional: dark overlay for readability */}
      <div className="dashboard-overlay" />

      {/* 🌟 Dashboard Content */}
      <div className="dashboard-container">
        <h2>🎓 Welcome to the College Portal</h2>
        <div className="card-grid">
          {sections.map((section) => (
            <div
              className="dashboard-card"
              key={section.title}
              onClick={() => navigate(section.path)}
            >
              <div className="icon">{section.icon}</div>
              <h5>{section.title}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
