// src/pages/UserHelpdeskPage.jsx
import React, { useEffect, useState } from "react";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

const UserHelpdeskPage = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://cep-backend-9jfg.onrender.com/helpdesk/my", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setTickets(data);
      })
      .catch((err) => {
        console.error("Error fetching user helpdesk:", err);
        setError("Failed to load your helpdesk requests.");
      });
  }, []);

  return (
    <AnimatedPageWrapper>
      <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        <h2 style={{ color: "#00ffff", textAlign: "center", marginBottom: "30px" }}>
          📝 Your Helpdesk Requests
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {tickets.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "white" }}>
            No helpdesk requests found.
          </p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              style={{
                backgroundColor: "#222",
                color: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 0 12px rgba(0,255,255,0.4)",
              }}
            >
              <p><strong>Message:</strong> {ticket.message}</p>
              <p><strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              <p><strong>Admin Response:</strong> {ticket.response || "⏳ Waiting for response"}</p>
            </div>
          ))
        )}
      </div>
    </AnimatedPageWrapper>
  );
};

export default UserHelpdeskPage;
