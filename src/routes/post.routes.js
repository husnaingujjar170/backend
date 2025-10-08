const express = require('express');
const { validate, authenticate } = require('../middleware');
const { post: postSchemas } = require('../lib/validation');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', postController.getAllPosts);

router.get('/user/my-posts', postController.getUserPosts);

router.post('/',
  validate(postSchemas.createPostSchema),
  postController.createPost
);

router.get('/:postId', postController.getPostById);

router.put('/:postId',
  validate(postSchemas.updatePostSchema),
  postController.updatePost
);

router.delete('/:postId', postController.deletePost);

module.exports = router;