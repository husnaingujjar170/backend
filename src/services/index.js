const authService = require('./auth.service');
const tokenService = require('./token.service');
const postService = require('./post.service');
const commentService = require('./comment.service');
const likeService = require('./like.service');
const followService = require('./follow.service');

module.exports = {
  authService,
  tokenService,
  postService,
  commentService,
  likeService,
  followService
};