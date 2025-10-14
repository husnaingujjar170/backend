const express = require("express");
const likeController = require("../controllers/like.controller");
const { authenticate } = require("../middleware");

const router = express.Router();

router.use(authenticate);

router.post("/posts/:postId/like", likeController.toggleLike);

router.get("/posts/:postId/likes", likeController.getPostLikes);

router.get("/users/:userId/likes", likeController.getUserLikes);

module.exports = router;
