const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");

// ✅ Create article (User)
router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const { title, content } = req.body;
    const author = req.session.user.username;
    const authorId = req.session.user.id;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const article = new Article({
      title,
      content,
      author,
      authorId,
      likes: 0,
      likedBy: [],
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// ✅ Get all articles (Public)
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    const response = articles.map((article) => ({
      _id: article._id,
      title: article.title,
      content: article.content,
      author: article.author,
      authorId: article.authorId,
      likes: article.likes,
      likedBy: article.likedBy.map((user) => ({
        id: user.id,
        username: user.username,
      })),
    }));

    res.json(response);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ Like an article (one per user)
router.put("/:id/like", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.session.user.id;
  const username = req.session.user.username;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const alreadyLiked = article.likedBy.some((u) => u.id === userId);
    if (alreadyLiked) {
      return res.status(400).json({ error: "You already liked this article" });
    }

    article.likes += 1;
    article.likedBy.push({ id: userId, username });
    await article.save();

    res.json(article);
  } catch (err) {
    console.error("Error liking article:", err);
    res.status(500).json({ error: "Failed to like article" });
  }
});

// ✅ Delete an article (Admin only)
router.delete("/:id", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ error: "Only admin can delete articles" });
  }

  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

module.exports = router;
