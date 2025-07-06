import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/Layout";


function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch("https://cep-backend.onrender.com/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.text();

    if (result.includes("User registered")) {
      alert("✅ Registration successful!");
      navigate("/login");
    } else {
      alert(result);
    }
  };

  return (
    <Layout>
      <div style={outerContainer}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>📝 Create Account</h2>

          <form onSubmit={handleRegister}>
            <input
              className="form-control"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="👤 Choose a username"
              required
              style={inputStyle}
            />

            <input
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="📧 Enter your email"
              required
              style={inputStyle}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔑 Create a password"
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
              ➕ Register
            </button>
          </form>

          <p className="mt-3">
            <a
              href="/login"
              style={{ color: "#00f0ff", textDecoration: "underline" }}
            >
              Already registered? Login
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Register;

// 🔷 Style constants
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
