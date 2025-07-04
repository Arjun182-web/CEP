import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

 const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://cep-backend.onrender.com/admin/users", {
      method: "GET", // ✅ Explicit method
      credentials: "include", // ✅ Required for session cookies
      headers: {
        "Content-Type": "application/json", // ✅ Set correct headers
      },
    });

    if (res.status === 403)
      throw new Error("Access denied. You are not an admin.");
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    setUsers(data);
  } catch (error) {
    setErr(error.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);


  const handleLogout = async () => {
    await fetch("https://cep-backend.onrender.com/logout", {
      method: "GET",
      credentials: "include",
    });
    navigate("/admin/login");
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`https://cep-backend.onrender.com/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.text();
        alert("❌ Delete failed: " + message);
      } else {
        fetchUsers();
      }
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(
        `https://cep-backend.onrender.com/admin/users/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const message = await res.text();
        alert("⚠️ Toggle failed: " + message);
      } else {
        fetchUsers();
      }
    } catch (err) {
      alert("Error toggling status: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  return (
    <div style={outerContainerStyle}>
      {/* 🔁 Background Video */}
      <video autoPlay loop muted style={videoStyle}>
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌟 Overlay Dashboard Content */}
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h2 style={headingText}>🛠️ Admin Dashboard</h2>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              🚪 Logout
            </button>
          </div>

          {/* 🔹 Admin Navigation Buttons */}
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <button
              onClick={() => navigate("/admin/departments")}
              style={manageDeptButton}
            >
              🏫 Manage Departments
            </button>
            <button
              onClick={() => navigate("/admin/helpdesk")}
              style={helpdeskButtonStyle}
            >
              📩 View Helpdesk
            </button>
            <button
              onClick={() => navigate("/admin/articles")}
              style={{
                backgroundColor: "#00bcd4",
                color: "#fff",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: "20px",
                boxShadow: "0 0 10px #00ffff",
              }}
            >
              📝 Review Articles
            </button>
          </div>

          {users.length === 0 ? (
            <p style={textStyle}>No users found.</p>
          ) : (
            <div style={userTableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={headingStyle}>👤 Username</th>
                    <th style={headingStyle}>📧 Email</th>
                    <th style={headingStyle}>✅ Status</th>
                    <th style={headingStyle}>🕒 Last Login</th>
                    <th style={headingStyle}>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={cellStyle}>{u.username || "N/A"}</td>
                      <td style={cellStyle}>{u.email || "N/A"}</td>
                      <td style={cellStyle}>
                        {u.isActive ? "Active" : "Disabled"}
                      </td>
                      <td style={cellStyle}>
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td style={cellStyle}>
                        <button
                          onClick={() => toggleStatus(u._id)}
                          style={u.isActive ? disableButton : enableButton}
                        >
                          {u.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          style={deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔵 Styling
const outerContainerStyle = {
  position: "relative",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
};

const videoStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -1,
};

const containerStyle = {
  position: "relative",
  zIndex: 1,
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "1000px",
  background: "rgba(0, 0, 0, 0.75)",
  color: "#fff",
  borderRadius: "12px",
  boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  padding: "30px",
  overflowY: "auto",
  maxHeight: "90vh",
  alignItems: "center",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const headingText = {
  color: "#00ffff",
};

const logoutButtonStyle = {
  backgroundColor: "#ff4d4d",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const userTableWrapperStyle = {
  marginTop: "20px",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 12px",
};

const headingStyle = {
  textAlign: "left",
  padding: "10px",
  color: "#00ffff",
};

const cellStyle = {
  padding: "12px 20px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "6px",
  color: "#fff",
};

const textStyle = {
  color: "#ccc",
};

const deleteButton = {
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

const disableButton = {
  backgroundColor: "#f39c12",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const enableButton = {
  backgroundColor: "#2ecc71",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const manageDeptButton = {
  backgroundColor: "#00bcd4",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  marginRight: "10px",
};

const helpdeskButtonStyle = {
  backgroundColor: "#9c27b0",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};
