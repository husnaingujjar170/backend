const userRepository = require('./user.repository');
const postRepository = require('./post.repository');
const commentRepository = require('./comment.repository');
const likeRepository = require('./like.repository');

module.exports = {
  userRepository,
  postRepository,
  commentRepository,
  likeRepository 
};