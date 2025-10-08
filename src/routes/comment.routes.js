const express = require('express');
const { validate, authenticate } = require('../middleware');
const { post: postSchemas } = require('../lib/validation');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

router.use(authenticate);

router.get('/post/:postId', commentController.getPostComments);

router.post('/post/:postId',
  validate(postSchemas.createCommentSchema),
  commentController.addComment
);

router.put('/:commentId',
  validate(postSchemas.updateCommentSchema),
  commentController.updateComment
);

router.delete('/:commentId', commentController.deleteComment);

module.exports = router;