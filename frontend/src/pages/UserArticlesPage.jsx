import React, { useEffect, useState } from "react";
import AnimatedPageWrapper from "../components/common/AnimatedPageWrapper";

const hideScrollbar = `
  ::-webkit-scrollbar {
    display: none;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = hideScrollbar;
document.head.appendChild(styleTag);

export default function UserArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch current logged-in user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("https://cep-backend-9jfg.onrender.com/user", {
        credentials: "include",
      });
      const data = await res.json();
      setCurrentUserId(data.id);
    } catch (err) {
      console.error("Failed to fetch current user ID", err);
    }
  };

  // ✅ Fetch all articles
  const fetchArticles = async () => {
    try {
      const res = await fetch("https://cep-backend-9jfg.onrender.com/articles", {
        credentials: "include",
      });
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("❌ Failed to load articles");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchArticles();
  }, []);

  // ✅ Like an article
  const handleLike = async (articleId) => {
    try {
      const res = await fetch(`https://cep-backend-9jfg.onrender.com/articles/${articleId}/like`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) fetchArticles();
    } catch (err) {
      console.error("Error liking article:", err);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div style={wrapper}>
        <h2 style={{ color: "#00ffff", marginBottom: "30px", textAlign: "center", fontSize: "2rem" }}>
          📚 All Articles
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={articlesWrapper}>
          {articles.map((a) => (
            <div key={a._id} style={articleCard}>
              <h2 style={{ color: "#00ffff", fontSize: "1.8rem" }}>{a.title}</h2>
              <p style={{ fontSize: "1.2rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{a.content}</p>

              <div style={bottomRow}>
                <span style={{ fontSize: "1rem", color: "#aaa" }}>
                  ✍️ {a.author || "Anonymous"}
                </span>
                <button onClick={() => handleLike(a._id)} style={likeBtn}>
                  ❤️ {a.likes || 0}
                </button>
              </div>

              {/* 👍 Show likedBy usernames only if current user is author */}
              {a.likedBy?.length > 0 && a.authorId === currentUserId && (
                <div style={{ marginTop: "10px", color: "#ccc", fontSize: "0.9rem" }}>
                  👍 Liked by: {a.likedBy.map((liker) => liker.username).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}

// 🎨 Styles
const wrapper = {
  padding: "40px",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
};

const articlesWrapper = {
  width: "100%",
  maxWidth: "1000px",
  maxHeight: "70vh",
  overflowY: "scroll",
  paddingRight: "10px",
  scrollbarWidth: "none",       // Firefox
  msOverflowStyle: "none",      // IE/Edge
};

const articleCard = {
  backgroundColor: "#1a1a1a",
  padding: "30px",
  marginBottom: "30px",
  borderRadius: "12px",
  border: "1px solid #333",
  boxShadow: "0 0 15px #00ffff55",
};

const bottomRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "20px",
};

const likeBtn = {
  backgroundColor: "#00bcd4",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};
