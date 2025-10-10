const express = require("express");
// Try direct import instead of destructuring
const likeController = require("../controllers/like.controller");
const { authenticate } = require("../middleware");

// Debug: Check if likeController is imported correctly
console.log('likeController:', likeController);
console.log('likeController.toggleLike:', likeController?.toggleLike);

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// POST /api/v1/posts/:postId/like - Toggle like on post
router.post("/posts/:postId/like", likeController.toggleLike);

// GET /api/v1/posts/:postId/likes - Get all likes for post
router.get("/posts/:postId/likes", likeController.getPostLikes);

// GET /api/v1/users/:userId/likes - Get user's liked posts
router.get("/users/:userId/likes", likeController.getUserLikes);

module.exports = router;
