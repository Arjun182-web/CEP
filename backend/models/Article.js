const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, default: 0 },
    likedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);

