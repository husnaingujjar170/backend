const { postService } = require('../services');
const mediaService = require('../services/media.service');
const { response } = require('../lib');
const { HTTP_STATUS } = require('../constants');

class PostController {
  async createPost(req, res, next) {
    try {
      const postData = req.body;
      const authorId = req.user.id;
      const uploadedFile = req.file;

      // Process media upload if file is provided
      let mediaData = null;
      if (uploadedFile) {
        mediaData = await mediaService.processUpload(uploadedFile);
        
        // Add media information to post data
        postData.mediaUrl = mediaData.url;
        postData.mediaType = mediaData.type;
        postData.mediaFilename = mediaData.filename;
      }
      
      const result = await postService.createPost(postData, authorId);
      
      return response.success(
        res,
        result,
        result.message,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      if (req.file) {
        await mediaService.cleanupTempFile(req.file.path);
      }
      next(error);
    }
  }

  async getAllPosts(req, res, next) {
    try {
        console.log('Raw query params:', req.query);
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        console.log('Parsed params (should be numbers):', { page, limit, pageType: typeof page, limitType: typeof limit });
        
        const userId = req.user.id;
        const result = await postService.getAllPosts(page, limit, userId);
        
        return response.success(
            res,
            result,
            result.message || MESSAGES.SUCCESS,
            HTTP_STATUS.OK
        );
    } catch (error) {
        console.error('Controller error:', error);
        next(error);
    }
}

  async getPostById(req, res, next) {
    try {
      const { postId } = req.params;
      
      const result = await postService.getPostById(postId);
      
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

  async getUserPosts(req, res, next) {
    try {
      const userId = req.user.id;
      
      const result = await postService.getUserPosts(userId);
      
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

  async updatePost(req, res, next) {
    try {
      const { postId } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      
      const result = await postService.updatePost(postId, updateData, userId);
      
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

  async deletePost(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      
      const result = await postService.deletePost(postId, userId);
      
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

module.exports = new PostController();