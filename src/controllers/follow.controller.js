const { followService } = require('../services');

class FollowController {
  async followUser(req, res) {
    try {
      const followerId = req.user.id;
      const followingId = req.params.userId;

      const result = await followService.followUser(followerId, followingId);
      
      res.status(201).json({
        success: true,
        data: result.follow,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async unfollowUser(req, res) {
    try {
      const followerId = req.user.id;
      const followingId = req.params.userId;

      const result = await followService.unfollowUser(followerId, followingId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFollowers(req, res) {
    try {
      const userId = req.params.userId;

      const result = await followService.getFollowers(userId);
      
      res.status(200).json({
        success: true,
        data: {
          followers: result.followers,
          count: result.count
        },
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFollowing(req, res) {
    try {
      const userId = req.params.userId;

      const result = await followService.getFollowing(userId);
      
      res.status(200).json({
        success: true,
        data: {
          following: result.following,
          count: result.count
        },
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async checkIsFollowing(req, res) {
    try {
      const followerId = req.user.id;
      const followingId = req.params.userId;

      const result = await followService.checkIsFollowing(followerId, followingId);
      
      res.status(200).json({
        success: true,
        data: {
          isFollowing: result.isFollowing
        },
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFollowStats(req, res) {
    try {
      const userId = req.params.userId;

      const result = await followService.getFollowStats(userId);
      
      res.status(200).json({
        success: true,
        data: {
          followersCount: result.followersCount,
          followingCount: result.followingCount
        },
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FollowController();
