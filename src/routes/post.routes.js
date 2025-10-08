const express = require('express');
const { validate, authenticate } = require('../middleware');
const { post: postSchemas } = require('../lib/validation');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.get('/', 
  authenticate,
  postController.getAllPosts);

router.get('/user/my-posts',
  authenticate,
  postController.getUserPosts
);

router.post('/',
  authenticate,
  validate(postSchemas.createPostSchema),
  postController.createPost
);

router.get('/:postId', 
  authenticate,
  postController.getPostById);

router.put('/:postId',
  authenticate,
  validate(postSchemas.updatePostSchema),
  postController.updatePost
);

router.delete('/:postId',
  authenticate,             
  postController.deletePost 
);

module.exports = router;