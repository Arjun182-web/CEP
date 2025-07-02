const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// ✅ Create article (User authenticated)
router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const article = new Article({
      title,
      content,
      author: req.session.user.username,
      authorId: req.session.user.id,
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

// ✅ Get all articles (with author's username for admin)
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username"); // 👈 Include author's username
    res.json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ Get articles by current user
router.get("/my-articles", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const articles = await Article.find({ authorId: req.session.user.id }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error("Error fetching user articles:", err);
    res.status(500).json({ error: "Failed to fetch user articles" });
  }
});

// ✅ Like an article
router.put("/:id/like", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const userId = req.session.user.id;
    const username = req.session.user.username;

    const alreadyLiked = article.likedBy.some(
      (like) => like.userId.toString() === userId
    );

    if (alreadyLiked) {
      return res.status(400).json({ error: "You already liked this article" });
    }

    article.likes += 1;
    article.likedBy.push({ userId, username });
    await article.save();

    res.json(article);
  } catch (err) {
    console.error("Error liking article:", err);
    res.status(500).json({ error: "Failed to like article" });
  }
});


// ✅ Delete article (Admin only)
router.delete("/:id", async (req, res) => {
  // 🔍 DEBUG: Log the session for verification
  console.log("Delete Request by Session:", req.session.user);

  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ error: "Only admin can delete articles" });
  }

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    await article.deleteOne();
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});



module.exports = router;
