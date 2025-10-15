const authController = require('./auth.controller');
const postController = require('./post.controller');
const commentController = require('./comment.controller');
const likeController = require('./like.controller');
const followController = require('./follow.controller');

module.exports = {
  authController,
  postController,
  commentController,
  likeController,
  followController
};