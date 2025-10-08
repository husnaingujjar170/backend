const { commentService } = require('../services');
const { response } = require('../lib');
const { HTTP_STATUS } = require('../constants');

class CommentController {
    
  async addComment(req, res, next) {
    try {
      const { postId } = req.params;
      const commentData = req.body;
      const authorId = req.user.id;
      
      const result = await commentService.addComment(commentData, postId, authorId);
      
      return response.success(
        res,
        result,
        result.message,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req, res, next) {
    try {
      const { postId } = req.params;
      
      const result = await commentService.getPostComments(postId);
      
      return response.success(
        res,
        result,
        result.message,
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      
      const result = await commentService.updateComment(commentId, updateData, userId);
      
      return response.success(
        res,
        result,
        result.message,
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id; 
      
      const result = await commentService.deleteComment(commentId, userId);
      
      return response.success(
        res,
        result,
        result.message,
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();