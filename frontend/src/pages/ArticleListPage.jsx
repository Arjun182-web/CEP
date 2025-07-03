import React, { useEffect, useState } from "react";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://cep-backend-9jfg.onrender.com/articles", { credentials: "include" })
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => setError("❌ Failed to load articles"));
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await fetch(`https://cep-backend-9jfg.onrender.com/articles/${id}/like`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Like failed");

      const updated = await res.json();
      setArticles((prev) =>
        prev.map((a) => (a._id === id ? { ...a, likes: updated.likes } : a))
      );
    } catch (err) {
      alert("⚠️ " + err.message);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div style={wrapper}>
        <h2 style={heading}>📚 All Articles</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {articles.length === 0 ? (
          <p style={{ color: "#ccc", textAlign: "center" }}>
            No articles posted yet.
          </p>
        ) : (
          <div style={scrollArea}>
            {articles.map((article) => (
              <div key={article._id} style={card}>
                <h3 style={title}>{article.title}</h3>
                <p style={content}>{article.content}</p>
                <div style={footer}>
                  <button style={likeButton} onClick={() => handleLike(article._id)}>
                    ❤️ {article.likes}
                  </button>
                  <span style={author}>✍️ {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPageWrapper>
  );
}

// Styles
const wrapper = {
  padding: "40px",
};

const heading = {
  textAlign: "center",
  color: "#00ffff",
  marginBottom: "30px",
};

const scrollArea = {
  maxHeight: "65vh",
  overflowY: "auto",
  paddingRight: "10px",
};

const card = {
  backgroundColor: "#111",
  color: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 0 12px #00ffff",
};

const title = {
  marginBottom: "10px",
};

const content = {
  marginBottom: "15px",
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const likeButton = {
  backgroundColor: "#00bcd4",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const author = {
  fontSize: "0.9rem",
  color: "#aaa",
};
