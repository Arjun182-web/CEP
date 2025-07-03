// src/pages/ArticleSubmitPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function ArticleSubmitPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handlePost = async () => {
    try {
      const res = await fetch("https://cep-backend.onrender.com/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }), // ✅ only send title and content
      });

      if (!res.ok) throw new Error("Article post failed");

      navigate("/articles"); // ✅ Redirect after successful post
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div style={styles.container}>
        <h2>📝 Write an Article</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handlePost} style={styles.button}>Post Article</button>
      </div>
    </AnimatedPageWrapper>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "6px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginBottom: "10px",
    padding: "10px",
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 20px",
    background: "#00ffff",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
  },
};
