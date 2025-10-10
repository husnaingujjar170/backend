const { likeService } = require('../services');
const { success, error } = require('../lib/response');
const { HTTP_STATUS } = require('../constants');

class LikeController {
  async toggleLike(req, res, next) {
    try {
      console.log('Controller hit! Params:', req.params);
      console.log('User from req:', req.user);
      
      const { postId } = req.params;    
      const userId = req.user.id;    
      
      console.log('Calling likeService.togglePostLike with:', { userId, postId });
      
      const result = await likeService.togglePostLike(userId, postId);
      
      console.log('Service result:', result);
      
      return success(res, result, result.message, HTTP_STATUS.OK);
    } catch (err) {
      console.error('Controller error:', err);
      next(err);
    }
  }

  
  async getPostLikes(req, res, next) {
    try {
      const { postId } = req.params;
      
      const result = await likeService.getPostLikes(postId);
      
      return success(res, result, result.message, HTTP_STATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  
  async getUserLikes(req, res, next) {
    try {
      const { userId } = req.params;
      
      const result = await likeService.getUserLikedPosts(userId);
      
      return success(res, result, result.message, HTTP_STATUS.OK);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LikeController();