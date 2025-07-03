import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://cep-backend-9jfg.onrender.com/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const text = await res.text();
    setMsg(text);
  };

  return (
    <div className="bg-wrapper">
      <video className="bg-video" autoPlay muted loop>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="overlay" />
      <div className="forgot-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Update Password</button>
        </form>
        {msg && <p style={{ color: "#0ff" }}>{msg}</p>}
      </div>
    </div>
  );
}
