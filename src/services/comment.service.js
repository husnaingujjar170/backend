const { commentRepository, postRepository, userRepository } = require('../repositories');
const { MESSAGES } = require('../constants');

class CommentService {
  async addComment(commentData, postId, authorId) {
    try {
      const post = await postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // If it's a reply, validate the parent comment exists and is not itself a reply
      if (commentData.parentCommentId) {
        const parentComment = await commentRepository.findById(commentData.parentCommentId);
        if (!parentComment) {
          throw new Error('Parent comment not found');
        }
        // Ensure parent comment belongs to the same post
        if (parentComment.postId !== postId) {
          throw new Error('Parent comment does not belong to this post');
        }
        // Prevent nested replies (replies to replies)
        if (parentComment.parentCommentId) {
          throw new Error('Cannot reply to a reply. Only one level of replies is allowed');
        }
      }

      const newComment = await commentRepository.create({
        ...commentData,
        postId,
        authorId
      });

      return {
        comment: newComment,
        message: MESSAGES.COMMENT_CREATED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to add comment');
    }
  }

  async getPostComments(postId) {
    try {
      const allComments = await commentRepository.findByPostId(postId);
      
      // Filter to return only top-level comments (replies are already included in the 'replies' field)
      const topLevelComments = allComments.filter(comment => !comment.parentCommentId);
      
      return {
        comments: topLevelComments,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get comments');
    }
  }

  async updateComment(commentId, updateData, userId) {
    try {
      // 🔐 SECURITY: Only owners can edit their comments (not admins)
      const isOwner = await commentRepository.isOwner(commentId, userId);
      
      if (!isOwner) {
        throw new Error('You can only update your own comments');
      }

      const updatedComment = await commentRepository.updateById(commentId, updateData);
      
      return {
        comment: updatedComment,
        message: MESSAGES.COMMENT_UPDATED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update comment');
    }
  }

  async deleteComment(commentId, userId) {
    try {
      // 🔐 SECURITY: Check ownership BEFORE deletion
      const isOwner = await commentRepository.isOwner(commentId, userId);
      const user = await userRepository.findById(userId);
      const isAdmin = user?.isAdmin || false;
      
      if (!isOwner && !isAdmin) {
        throw new Error('You can only delete your own comments or you must be an admin');
      }

      await commentRepository.deleteById(commentId);
      
      return {
        message: MESSAGES.COMMENT_DELETED
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete comment');
    }
  }
}

module.exports = new CommentService();