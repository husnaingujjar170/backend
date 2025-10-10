const prisma = require('../lib/database');

class LikeRepository {
  async toggleLike(userId, postId) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return { action: 'unliked' };
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      return { action: 'liked' };
    }
  }

  async getLikeCount(postId) {
    return await prisma.like.count({
      where: { postId: postId }
    });
  }

  async isLikedByUser(userId, postId) {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    return !!like;
  }

  async getLikesByPost(postId) {
    return await prisma.like.findMany({
      where: { postId: postId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async getLikedPostsByUser(userId) {
    return await prisma.like.findMany({
      where: { userId: userId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                isAdmin: true
              }
            }
          }
        }
      }
    });
  }
}

module.exports = new LikeRepository();
