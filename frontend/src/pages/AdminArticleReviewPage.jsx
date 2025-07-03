import React, { useEffect, useState } from "react";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function AdminArticleReviewPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all articles
  const fetchArticles = async () => {
    try {
      const res = await fetch("https://cep-backend-9jfg.onrender.com/articles", {
        credentials: "include",
      });
      const data = await res.json();
      setArticles(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Delete an article
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://cep-backend-9jfg.onrender.com/articles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete article");
      alert("✅ Article deleted");
      fetchArticles(); // refresh the list
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ " + err.message);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div style={wrapper}>
        <h2 style={heading}>🛡️ Admin – Review All Articles</h2>

        {loading && <p>Loading articles...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && articles.length === 0 && <p>No articles to review.</p>}

        {articles.map((a) => (
          <div key={a._id} style={card}>
            <h3 style={{ color: "#00ffff" }}>{a.title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{a.content}</p>
            <div style={footer}>
              <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                ✍️ Author: {a.authorId?.username || "Unknown"}
              </span>
              <button onClick={() => handleDelete(a._id)} style={delBtn}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AnimatedPageWrapper>
  );
}

// 🎨 Styles
const wrapper = {
  padding: "40px",
  minHeight: "100vh",
  maxWidth: "900px",
  margin: "0 auto",
  color: "#fff",
};

const heading = {
  fontSize: "2rem",
  color: "#00ffff",
  marginBottom: "30px",
  textAlign: "center",
};

const card = {
  backgroundColor: "#1a1a1a",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 0 10px #00ffff55",
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

const delBtn = {
  backgroundColor: "#ff4d4d",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
