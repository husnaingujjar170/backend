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
    const { offset = 0, limit = 10 } = options;
    
    const offsetNum = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 10;
    
    console.log('Repository - Final params:', { 
        offsetNum, 
        limitNum, 
        offsetType: typeof offsetNum, 
        limitType: typeof limitNum
    });
    
    return await prisma.post.findMany({
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
}

module.exports = new PostRepository();