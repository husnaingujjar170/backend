const prisma = require('../lib/database');

class FollowRepository {
  async follow(followerId, followingId) {
    return await prisma.follow.create({
      data: {
        followerId,
        followingId
      },
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  async unfollow(followerId, followingId) {
    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
  }

  async isFollowing(followerId, followingId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    return !!follow;
  }

  async getFollowers(userId) {
    return await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getFollowing(userId) {
    return await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getFollowingIds(userId) {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    return following.map(f => f.followingId);
  }

  async getFollowersCount(userId) {
    return await prisma.follow.count({
      where: { followingId: userId }
    });
  }

  async getFollowingCount(userId) {
    return await prisma.follow.count({
      where: { followerId: userId }
    });
  }
}

module.exports = new FollowRepository();
