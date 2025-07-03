import React, { useEffect, useState } from "react";

export default function AdminHelpdeskPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await fetch("https://cep-backend.onrender.com/admin/helpdesk", {
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const sendResponse = async (id, responseText) => {
    try {
      const res = await fetch(
        `https://cep-backend.onrender.com/admin/helpdesk/${id}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ response: responseText }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      fetchTickets();
    } catch (err) {
      alert("Failed to send response: " + err.message);
    }
  };

  return (
    <div style={outerContainerStyle}>
      {/* 🔁 Background Video */}
      <video autoPlay muted loop style={videoStyle}>
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headingText}>📨 Helpdesk Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : tickets.length === 0 ? (
            <p>No helpdesk tickets yet.</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} style={ticketStyle}>
                <p><strong>From:</strong> {ticket.userId?.username || "Unknown"}</p>
                <p><strong>Email:</strong> {ticket.userId?.email || "N/A"}</p>
                <p><strong>Message:</strong> {ticket.message}</p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
                <p><strong>Response:</strong> {ticket.response || "No response yet"}</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const response = e.target.elements.response.value.trim();
                    if (!response) return alert("Please enter a response.");
                    sendResponse(ticket._id, response);
                    e.target.reset();
                  }}
                >
                  <input
                    type="text"
                    name="response"
                    placeholder="Type your response..."
                    style={inputStyle}
                  />
                  <button type="submit" style={buttonStyle}>
                    Send
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 🔷 Styling

const outerContainerStyle = {
  position: "relative",
  height: "100vh",
  width: "100vw",
  overflowY: "auto",
};

const videoStyle = {
  position: "fixed",
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
  padding: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const cardStyle = {
  maxWidth: "1000px",
  width: "100%",
  background: "rgba(0, 0, 0, 0.8)",
  padding: "30px",
  borderRadius: "12px",
  color: "#fff",
  boxShadow: "0 0 30px rgba(0,0,0,0.5)",
};

const headingText = {
  textAlign: "center",
  color: "#00ffff",
  marginBottom: "20px",
};

const ticketStyle = {
  backgroundColor: "#f4f4f4",
  color: "#333",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const inputStyle = {
  width: "80%",
  padding: "10px",
  borderRadius: "6px",
  marginRight: "10px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#00bcd4",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
