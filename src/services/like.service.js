const { likeRepository } = require('../repositories');
const { MESSAGES } = require('../constants');

class LikeService {
  async togglePostLike(userId, postId) {
    try {
      console.log('Service: About to call likeRepository.toggleLike');
      console.log('likeRepository:', likeRepository);
      console.log('likeRepository.toggleLike:', likeRepository?.toggleLike);
      
      const result = await likeRepository.toggleLike(userId, postId);
      console.log('Service: toggleLike result:', result);
    
      const likeCount = await likeRepository.getLikeCount(postId);
      console.log('Service: likeCount:', likeCount);
      
      return {
        action: result.action,
        likeCount: likeCount,
        isLiked: result.action === 'liked',
        message: result.action === 'liked' ? 'Post liked successfully' : 'Post unliked successfully'
      };
    } catch (error) {
      console.error('Service error details:', error);
      throw new Error(error.message || 'Failed to toggle like');
    }
  }

  async getPostLikes(postId) {
    try {
      const likes = await likeRepository.getLikesByPost(postId);
      const likeCount = await likeRepository.getLikeCount(postId);
      
      return {
        likes: likes,
        count: likeCount,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get post likes');
    }
  }

  async getUserLikedPosts(userId) {
    try {
      const likedPosts = await likeRepository.getLikedPostsByUser(userId);
      
      return {
        posts: likedPosts,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get user liked posts');
    }
  }
}

module.exports = new LikeService();