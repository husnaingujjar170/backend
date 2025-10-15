const express = require('express');
const { validate, authenticate } = require('../middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { post: postSchemas } = require('../lib/validation');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', postController.getAllPosts);

router.get('/feed/following', postController.getFollowingFeed);

router.get('/user/my-posts', postController.getUserPosts);

router.post('/',
  handleUpload,
  validate(postSchemas.createPostSchema),
  postController.createPost
);

router.get('/:postId', postController.getPostById);

router.put('/:postId',
  validate(postSchemas.updatePostSchema),
  postController.updatePost
);

router.delete('/:postId', postController.deletePost);

router.post('/:postId/share', postController.sharePost);
router.delete('/:postId/share/:userId', postController.unsharePost);
router.get('/:postId/shares', postController.getPostShares);

module.exports = router;