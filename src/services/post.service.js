const { postRepository, userRepository, likeRepository } = require('../repositories');
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

  async getAllPosts(page = 1, limit = 10, userId) {
    try {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        
        console.log('Service - Converted params:', { 
            pageNum, 
            limitNum, 
            pageType: typeof pageNum, 
            limitType: typeof limitNum 
        });
        
        const offset = (pageNum - 1) * limitNum;
        
        console.log('Calculated offset:', offset, 'type:', typeof offset);
        
        const user = await userRepository.findById(userId);
        const isAdmin = user?.isAdmin || false;
        
        console.log('User role check:', { userId, isAdmin });
        
        const posts = await postRepository.findAll({
            offset: offset,
            limit: limitNum,
            userId: userId,
            isAdmin: isAdmin,
            include: ['author', 'likes', 'comments']
        });
        
        const postsWithLikeStatus = await Promise.all(
            posts.map(async (post) => {
                const isLikedByUser = await likeRepository.isLikedByUser(userId, post.id);
                return {
                    ...post,
                    isLikedByUser
                };
            })
        );
        
        return {
            posts: postsWithLikeStatus,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: postsWithLikeStatus.length
            },
            message: MESSAGES.SUCCESS
        };
    } catch (error) {
        console.error('Service error:', error);
        throw new Error(error.message || 'Failed to get posts');
    }
}

  async getPostById(postId, userId) {
    try {
      const post = await postRepository.findById(postId);
      
      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user has access to this post
      const user = await userRepository.findById(userId);
      const isAdmin = user?.isAdmin || false;
      const isOwner = post.authorId === userId;

      // If not admin and not the owner, deny access
      if (!isAdmin && !isOwner) {
        throw new Error('Post not found'); // Hide existence for security
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
      const user = await userRepository.findById(userId);
      const isAdmin = user?.isAdmin || false;
      if (!isOwner && !isAdmin) {
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

  async sharePost(postId, shareWithUserId, userId) {
    try {
      const isOwner = await postRepository.isOwner(postId, userId);
      if (!isOwner) {
        throw new Error('You can only share your own posts');
      }

      const targetUser = await userRepository.findById(shareWithUserId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      if (shareWithUserId === userId) {
        throw new Error('You cannot share a post with yourself');
      }

      const alreadyShared = await postRepository.isPostSharedWithUser(postId, shareWithUserId);
      if (alreadyShared) {
        throw new Error('Post is already shared with this user');
      }

      const share = await postRepository.sharePost(postId, shareWithUserId);
      
      return {
        share,
        message: 'Post shared successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to share post');
    }
  }

  async unsharePost(postId, unshareFromUserId, userId) {
    try {
      const isOwner = await postRepository.isOwner(postId, userId);
      if (!isOwner) {
        throw new Error('You can only unshare your own posts');
      }

      const result = await postRepository.unsharePost(postId, unshareFromUserId);
      
      return {
        message: 'Post unshared successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to unshare post');
    }
  }

  async getPostShares(postId, userId) {
    try {
      const isOwner = await postRepository.isOwner(postId, userId);
      if (!isOwner) {
        throw new Error('You can only view shares for your own posts');
      }

      const shares = await postRepository.getPostShares(postId);
      
      return {
        shares,
        message: 'Shares retrieved successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get post shares');
    }
  }
}

module.exports = new PostService();