import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/Layout";


// ✅ STYLE DEFINITIONS — moved outside of component
const outerContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: "20px",
};

const cardStyle = {
  maxWidth: "400px",
  width: "100%",
  padding: "30px",
  borderRadius: "14px",
  background: "rgba(0, 0, 0, 0.7)",
  boxShadow: "0 0 30px #00f0ff, 0 0 60px #00f0ff1a",
  color: "#00f0ff",
  border: "2px solid #00f0ff",
  textAlign: "center",
  backdropFilter: "blur(10px)",
};

const headingStyle = {
  marginBottom: "30px",
  fontWeight: "bold",
  fontSize: "24px",
  textShadow: "0 0 10px #00f0ff, 0 0 20px #00e0ff",
};

const inputStyle = {
  width: "80%",
  marginBottom: "15px",
  padding: "12px 18px",
  background: "rgba(0, 0, 0, 0.2)",
  border: "2px solid #00f0ff",
  borderRadius: "8px",
  color: "#00f0ff",
  fontSize: "15px",
  boxShadow: "0 0 12px #00f0ff88, inset 0 0 8px #00f0ff33",
  outline: "none",
};

const eyeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  color: "#00f0ff",
  fontSize: "18px",
  cursor: "pointer",
  userSelect: "none",
};

const buttonStyle = {
  width: "65%",
  padding: "12px 20px",
  background: "#00f0ff",
  color: "black",
  fontWeight: "bold",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  boxShadow: "0 0 15px #00f0ff, 0 0 30px #00f0ff80",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://cep-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Required for session cookies
        body: JSON.stringify({ username, password }),
      });

      const result = await response.text();

      if (result.includes("Login successful")) {
        alert("✅ Login successful!");
        navigate("/dashboard");
      } else {
        alert(result);
      }
    } catch (err) {
      alert("⚠️ Login failed: " + err.message);
    }
  };

  return (
    <Layout>
      <div style={outerContainer}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>🔐 Login</h2>

          <form onSubmit={handleLogin}>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="👤 Enter username"
              required
              style={inputStyle}
            />

            <div style={{ position: "relative" }}>
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔑 Enter password"
                required
                style={{ ...inputStyle, paddingRight: "45px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>
          <p style={{ marginTop: "10px" }}>
          <a href="/forgot-password" style={{ color: "#00ffff" }}>
            Forgot Password?
          </a>
        </p>


          <p className="mt-3">
            <a
              href="/register"
              style={{ color: "#00f0ff", textDecoration: "underline" }}
            >
              Don't have an account? Register
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
