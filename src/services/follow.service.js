const { followRepository, userRepository } = require('../repositories');
const { MESSAGES } = require('../constants');

class FollowService {
  async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) {
        throw new Error('You cannot follow yourself');
      }

      const userToFollow = await userRepository.findById(followingId);
      if (!userToFollow) {
        throw new Error('User not found');
      }

      const isAlreadyFollowing = await followRepository.isFollowing(followerId, followingId);
      if (isAlreadyFollowing) {
        throw new Error('You are already following this user');
      }

      const follow = await followRepository.follow(followerId, followingId);

      return {
        follow,
        message: 'Successfully followed user'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to follow user');
    }
  }

  async unfollowUser(followerId, followingId) {
    try {
      const isFollowing = await followRepository.isFollowing(followerId, followingId);
      if (!isFollowing) {
        throw new Error('You are not following this user');
      }

      await followRepository.unfollow(followerId, followingId);

      return {
        message: 'Successfully unfollowed user'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to unfollow user');
    }
  }

  async getFollowers(userId) {
    try {
      const followers = await followRepository.getFollowers(userId);
      const count = await followRepository.getFollowersCount(userId);

      return {
        followers: followers.map(f => f.follower),
        count,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get followers');
    }
  }

  async getFollowing(userId) {
    try {
      const following = await followRepository.getFollowing(userId);
      const count = await followRepository.getFollowingCount(userId);

      return {
        following: following.map(f => f.following),
        count,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get following');
    }
  }

  async checkIsFollowing(followerId, followingId) {
    try {
      const isFollowing = await followRepository.isFollowing(followerId, followingId);

      return {
        isFollowing,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to check follow status');
    }
  }

  async getFollowStats(userId) {
    try {
      const followersCount = await followRepository.getFollowersCount(userId);
      const followingCount = await followRepository.getFollowingCount(userId);

      return {
        followersCount,
        followingCount,
        message: MESSAGES.SUCCESS
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get follow stats');
    }
  }
}

module.exports = new FollowService();
