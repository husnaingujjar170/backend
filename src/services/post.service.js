const { postRepository } = require('../repositories');
const { MESSAGES } = require('../constants');

class PostService {

  async createPost(postData, authorId) {
    try {
      const newPost = await postRepository.create({
        ...postData,
        authorId
      });

      return {
        post: newPost,
        message: MESSAGES.POST_CREATED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to create post');
    }
  }

  async getAllPosts(page = 1, limit = 10) {
    try {
      const posts = await postRepository.findAll(page, limit);
      
      return {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: posts.length === limit
        },
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get posts');
    }
  }

  async getPostById(postId) {
    try {
      const post = await postRepository.findById(postId);
      
      if (!post) {
        throw new Error('Post not found');
      }

      return {
        post,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get post');
    }
  }

  async getUserPosts(userId) {
    try {
      const posts = await postRepository.findByAuthorId(userId);
      
      return {
        posts,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get user posts');
    }
  }

  async updatePost(postId, updateData, userId) {
    try {
      const isOwner = await postRepository.isOwner(postId, userId);
      if (!isOwner) {
        throw new Error('You can only update your own posts');
      }

      const updatedPost = await postRepository.updateById(postId, updateData);
      
      return {
        post: updatedPost,
        message: MESSAGES.POST_UPDATED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update post');
    }
  }

  async deletePost(postId, userId) {
    try {
      const isOwner = await postRepository.isOwner(postId, userId);
      if (!isOwner) {
        throw new Error('You can only delete your own posts');
      }

      await postRepository.deleteById(postId);
      
      return {
        message: MESSAGES.POST_DELETED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete post');
    }
  }
}

module.exports = new PostService();