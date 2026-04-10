const express = require("express");
const router = express.Router();

const questions
 = require("../data/questions");

// GET /questions

// List all questions

router.get("/", (req, res) => {
  res.json(questions

  );
});
// GET /questions
// /:postId
// Show a specific question
router.get("/:postId", (req, res) => {
  const postId = Number(req.params.postId);

  const post = questions
  .find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(post);
});
// POST /questions

// Create a new question
router.post("/", (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "Question and answer are required"
    });
  }
  const maxId = Math.max(...questions
    .map(p => p.id), 0);

  const newPost = {
    id: questions
    .length ? maxId + 1 : 1,
    question, answer,
    keywords: Array.isArray(keywords) ? keywords : []
  };
  questions
  .push(newPost);
  res.status(201).json(newPost);
});
// PUT /questions
// /:postId
// Edit a question
router.put("/:postId", (req, res) => {
  const postId = Number(req.params.postId);
  const { question, answer } = req.body;

  const post = questions
  .find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (!question || !answer) {
    return res.json({
      message: "Question and answer are required"
    });
  }

  post.question = question;
  post.answer = answer;
  post.keywords = Array.isArray(keywords) ? keywords : [];

  res.json(post);
});
// DELETE /questions
// /:postId
// Delete a question
router.delete("/:postId", (req, res) => {
  const postId = Number(req.params.postId);

  const postIndex = questions
  .findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Question not found" });
  }

  const deletedPost = questions
  .splice(postIndex, 1);

  res.json({
    message: "Question deleted successfully",
    post: deletedPost[0]
  });
});


module.exports = router;