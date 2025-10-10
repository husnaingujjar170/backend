const authService = require('./auth.service');
const tokenService = require('./token.service');
const postService = require('./post.service');
const commentService = require('./comment.service');
const likeService = require('./like.service');

module.exports = {
  authService,
  tokenService,
  postService,
  commentService,
  likeService 
};