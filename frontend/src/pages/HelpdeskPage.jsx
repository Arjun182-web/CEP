import React, { useState, useEffect } from "react";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";
import { useNavigate } from "react-router-dom";

export default function HelpdeskPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [hasResponse, setHasResponse] = useState(false);
  const navigate = useNavigate();

  // 🔁 Check if user has any admin response
  useEffect(() => {
    fetch("https://cep-backend.onrender.com/helpdesk/my", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const responded = data.some((ticket) => ticket.response);
          setHasResponse(responded);
        }
      })
      .catch((err) => {
        console.error("Error checking helpdesk responses:", err);
      });
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setStatus({ loading: false, error: "Please enter your message.", success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await fetch("https://cep-backend.onrender.com/helpdesk", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text || "Something went wrong");

      setMessage("");
      setStatus({ loading: false, error: "", success: "✅ Message submitted successfully!" });
    } catch (err) {
      setStatus({ loading: false, error: err.message || "Submission failed", success: "" });
    }
  };

  return (
    <AnimatedPageWrapper>
      <div style={outerWrapper}>
        <div style={containerStyle}>
          <h2 style={headingStyle}>🛠 Helpdesk</h2>
          <p style={paraStyle}>
            Welcome to the CEP Helpdesk. Please describe your issue below, and we'll get back to you as soon as possible.
          </p>

          <textarea
            placeholder="Describe your issue here..."
            rows={8}
            style={textareaStyle}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {status.error && <p style={{ color: "red", marginBottom: "10px" }}>{status.error}</p>}
          {status.success && <p style={{ color: "lightgreen", marginBottom: "10px" }}>{status.success}</p>}

          <button
            style={{ ...submitButton, opacity: status.loading ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={status.loading}
          >
            {status.loading ? "Submitting..." : "Submit"}
          </button>

          {/* ✅ Show only if admin has responded */}
          {hasResponse && (
            <button style={viewButton} onClick={() => navigate("/helpdesk/my")}>
              📨 View Admin Responses
            </button>
          )}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🔧 Styles
const outerWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "90vh",
  padding: "20px",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1000px",
  backgroundColor: "#111",
  borderRadius: "16px",
  padding: "40px",
  boxShadow: "0 0 18px #00ffff",
  color: "#fff",
};

const headingStyle = {
  fontSize: "2.2rem",
  color: "#00ffff",
  marginBottom: "20px",
  textAlign: "center",
};

const paraStyle = {
  fontSize: "1.1rem",
  marginBottom: "20px",
  textAlign: "center",
};

const textareaStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "8px",
  fontSize: "1rem",
  backgroundColor: "#222",
  color: "#fff",
  border: "1px solid #555",
  marginBottom: "20px",
};

const submitButton = {
  padding: "12px 24px",
  backgroundColor: "#00ffff",
  border: "none",
  color: "#111",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  display: "block",
  margin: "0 auto",
};

const viewButton = {
  marginTop: "20px",
  backgroundColor: "#00bcd4",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};
