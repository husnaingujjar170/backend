const prisma = require('../lib/database');

class PostRepository {
  async create(postData) {
    return await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });
  }
  async findAll(options = {}) {
    const { offset = 0, limit = 10, userId, isAdmin } = options;
    
    const offsetNum = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 10;
    
    console.log('Repository - Final params:', { 
        offsetNum, 
        limitNum, 
        userId,
        isAdmin,
        offsetType: typeof offsetNum, 
        limitType: typeof limitNum
    });
    
    const whereClause = {};
    
    if (!isAdmin && userId) {
        whereClause.OR = [
            { authorId: userId },
            { 
                shares: {
                    some: {
                        userId: userId 
                    }
                }
            }
        ];
    }
    
    return await prisma.post.findMany({
        where: whereClause,
        skip: offsetNum,
        take: limitNum,
        include: {
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    isAdmin: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

  async findById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                isAdmin: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async findByAuthorId(authorId) {
    return await prisma.post.findMany({
      where: { 
        authorId,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });
  }

  async updateById(id, updateData) {
    return await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async deleteById(id) {
    return await prisma.post.delete({
      where: { id }
    });
  }

  async isOwner(postId, userId) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });
    return post?.authorId === userId;
  }

  async sharePost(postId, userId) {
    return await prisma.postShare.create({
      data: {
        postId,
        userId
      }
    });
  }

  async unsharePost(postId, userId) {
    return await prisma.postShare.deleteMany({
      where: {
        postId,
        userId
      }
    });
  }

  async getPostShares(postId) {
    return await prisma.postShare.findMany({
      where: { postId },
      include: {
        user: {
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

  async isPostSharedWithUser(postId, userId) {
    const share = await prisma.postShare.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });
    return !!share;
  }
}

module.exports = new PostRepository();