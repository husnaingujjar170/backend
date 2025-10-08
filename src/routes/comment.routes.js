const express = require('express');
const { validate, authenticate } = require('../middleware');
const { post: postSchemas } = require('../lib/validation');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

// ALL ROUTES REQUIRE AUTHENTICATION
// Get comments for a post (protected)
router.get('/post/:postId', 
  authenticate,
  commentController.getPostComments);

// Add comment to post (protected)
router.post('/post/:postId',
  authenticate,
  validate(postSchemas.createCommentSchema),
  commentController.addComment
);

router.put('/:commentId',
  authenticate,
  validate(postSchemas.updateCommentSchema),
  commentController.updateComment
);

router.delete('/:commentId',
  authenticate,                  
  commentController.deleteComment 
);

module.exports = router;